import React, { useState } from 'react';
import { createTestStaff } from '@/utils/createTestUser';
import { supabaseCk as supabase } from '@/lib/supabaseClient';

export default function TestSupa() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateTestUser = async () => {
    setIsLoading(true);
    setError(null);
    setUserData(null);
    
    try {
      const { user, profile, email, password } = await createTestStaff();
      setUserData({
        email,
        password,
        id: user.id,
        name: profile?.name || user.user_metadata?.full_name,
        role: profile?.role
      });
      // console.log('User created successfully:', { user, profile });
    } catch (error) {
      console.error('Failed to create test staff:', error);
      setError(error.message || 'Failed to create test user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Test Staff Creation</h2>
      <p className="text-sm text-gray-600 mb-4">
        Click the button below to create a test staff user.
      </p>
      
      <button
        onClick={handleCreateTestUser}
        disabled={isLoading}
        className={`w-full px-4 py-2 rounded-md ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isLoading ? 'Creating...' : 'Create Test Staff'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {userData && (
        <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
          <h3 className="font-semibold text-green-800">User Created Successfully! 🎉</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium text-gray-700">User ID:</p>
                <p className="text-gray-900 break-all">{userData.id}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Name:</p>
                <p className="text-gray-900">{userData.name}</p>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700">Email:</p>
              <p className="text-gray-900 break-all">{userData.email}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Role:</p>
              <p className="text-gray-900 capitalize">{userData.role || 'employee'}</p>
            </div>
            <div className="pt-2 mt-2 border-t border-green-100">
              <p className="font-medium text-gray-700">Temporary Password:</p>
              <div className="flex items-center justify-between p-2 mt-1 bg-yellow-50 border border-yellow-200 rounded">
                <code className="text-sm text-gray-800">{userData.password}</code>
                <button 
                  onClick={() => navigator.clipboard.writeText(userData.password)}
                  className="ml-2 px-2 py-1 text-xs text-yellow-700 bg-yellow-100 rounded hover:bg-yellow-200"
                >
                  Copy
                </button>
              </div>
              <p className="mt-1 text-xs text-yellow-600">
                Note: This password will not be shown again. Please store it securely.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
