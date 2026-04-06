import { useState, useCallback, useEffect } from "react";
import { db, secondaryAuth, auth } from "@/lib/firebase"; // Use secondaryAuth for creation
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { logAdminActivity } from "@/utils/adminActivityLogger";

export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const fetchStaff = useCallback(async () => {
  //   console.log("Started to fetch staff");
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const querySnapshot = await getDocs(collection(db, "users"));
  //     const allUsers = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     const staffList = allUsers.filter((user) => user.role === 'employee' || user.role === 'intern');

  //     setStaff(staffList);
  //   } catch (err) {
  //     console.error("❌ Error fetching staff:", err);
  //     setError("Failed to fetch staff data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);


  //refersh the staff list after added a new staff

  // remove fetchStaff with getDocs entirely and replace useEffect with this:
useEffect(() => {
  setLoading(true);
  const unsubscribe = onSnapshot(
    collection(db, "users"),
    (querySnapshot) => {
      const allUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const staffList = allUsers.filter(
        (user) => user.role === "employee" || user.role === "intern"
      );
      setStaff(staffList);
      setLoading(false);
    },
    (err) => {
      console.error("❌ Error fetching staff:", err);
      setError("Failed to fetch staff data.");
      setLoading(false);
    }
  );

  return () => unsubscribe(); // cleanup on unmount
}, []);

  const createStaff = async (staffData) => {
    console.log("Started to create a new staff")
    const { email, password, name, role } = staffData;
    setLoading(true);
    setError(null);
    try {
      // Use the secondary auth instance to create the user. This does not affect
      // the currently logged-in admin's session.
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      const newUser = userCredential.user;
      console.log("new user created");

      await updateProfile(newUser, {
        displayName: name,
      });

      // Now create the user document in Firestore with the new UID
      await setDoc(doc(db, "users", newUser.uid), {
        name,
        searchableName: name.toLowerCase(),
        email,
        role,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Log activity
      const currentUser = auth.currentUser;
      if (currentUser) {
        await logAdminActivity(
          currentUser.uid,
          currentUser.displayName || currentUser.email,
          "added_staff",
          `Added new ${role}: ${name}`,
          { staffId: newUser.uid, staffName: name, staffEmail: email, role }
        );
      }

      // Refresh the staff list to show the new member
      // fetchStaff();
    } catch (err) {
      console.error("Error creating staff:", err);
      let friendlyError = "Failed to create staff member.";
      if (err.code === "auth/email-already-in-use") {
        friendlyError = "This email is already registered.";
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
      const staffRef = doc(db, "users", staffId);
      await updateDoc(staffRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });

      // Log activity
      const currentUser = auth.currentUser;
      if (currentUser) {
        await logAdminActivity(
          currentUser.uid,
          currentUser.displayName || currentUser.email,
          "updated_staff",
          `Updated staff member: ${updatedData.name || staffId}`,
          { staffId, updates: updatedData }
        );
      }

      // Refresh the local state to show the update immediately
      await fetchStaff();
    } catch (err) {
      console.error("Error updating staff:", err);
      setError(`Failed to update staff: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { staff, loading, error, createStaff, updateStaff };
};
