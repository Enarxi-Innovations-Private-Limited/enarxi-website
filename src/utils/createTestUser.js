import { supabase } from "@/lib/superbaseClientByCk";

export const createTestStaff = async () => {
  // Generate a unique email with timestamp for testing
  const timestamp = Date.now();
  const email = `test.${timestamp}@enarxi.com`;
  const password = 'TestPassword123!';
  const name = `Test User ${timestamp}`;
  const role = 'employee';

  try {
    console.log('Creating test user with email:', email);
    
    // 1. Sign out any existing session
    await supabase.auth.signOut();
    
    // 2. Sign up the user with email and password
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('No user data returned after signup');
    
    console.log('Auth user created, ID:', authData.user.id);
    
    // Create the profile directly
    const { data: profileData, error: profileError } = await supabase
      .from('staff_profiles')
      .insert({
        id: authData.user.id,
        email: email,
        name: name,
        role: role,
        status: 'active',
        joining_date: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // If there's an error, it might be because the profile already exists
      if (profileError.code === '23505') { // Unique violation
        console.log('Profile already exists, fetching existing profile...');
        const { data: existingProfile, error: fetchError } = await supabase
          .from('staff_profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        if (fetchError) throw fetchError;
        return {
          user: authData.user,
          profile: existingProfile,
          email,
          password // Only for testing - remove in production
        };
      }
      throw profileError;
    }

    console.log('Staff profile created successfully!');
    
    return {
      user: authData.user,
      profile: profileData,
      email,
      password // Only for testing - remove in production
    };
  } catch (error) {
    console.error('Error in createTestStaff:', {
      message: error.message,
      details: error
    });
    throw error;
  }
};
