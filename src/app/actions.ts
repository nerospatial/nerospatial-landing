'use server';

import { supabase } from '@/lib/supabase';

export async function submitWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const type = formData.get('type') as string;

  if (!email) {
    return { error: 'Email is required' };
  }

  if (!type || (type !== 'glasses' && type !== 'toys')) {
    return { error: 'Please select a valid interest type' };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: 'Invalid email address' };
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, type }]);

    if (error) {
      if (error.code === '23505') { // Unique violation code for Postgres
        return { error: 'You are already on the waitlist!' };
      }
      console.error('Supabase error:', error);
      return { error: 'Something went wrong. Please try again.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: 'Failed to submit. Please try again.' };
  }
}
