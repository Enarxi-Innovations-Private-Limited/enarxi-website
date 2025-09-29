import { useState, useCallback } from 'react';
import { db, secondaryAuth } from '@/lib/firebase'; // Use secondaryAuth for creation
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const staffList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStaff(staffList);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to fetch staff data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createStaff = async (staffData) => {
    const { email, password, name, role } = staffData;
    setLoading(true);
    setError(null);
    try {
      // Use the secondary auth instance to create the user. This does not affect
      // the currently logged-in admin's session.
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const newUser = userCredential.user;

      // Now create the user document in Firestore with the new UID
      await setDoc(doc(db, 'users', newUser.uid), {
        name,
        email,
        role,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Refresh the staff list to show the new member
      fetchStaff();
    } catch (err) {
      console.error('Error creating staff:', err);
      let friendlyError = 'Failed to create staff member.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This email is already registered.';
      }
      setError(friendlyError);
      throw new Error(friendlyError); // Re-throw to be caught by the form
    } finally {
      setLoading(false);
    }
  };

    const updateStaff = async (staffId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const staffRef = doc(db, 'users', staffId);
      await updateDoc(staffRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });
      // Refresh the local state to show the update immediately
      await fetchStaff();
    } catch (err) {
      console.error('Error updating staff:', err);
      setError(`Failed to update staff: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { staff, loading, error, fetchStaff, createStaff, updateStaff };
};
