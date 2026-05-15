import { requireSupabaseClient } from '../lib/supabaseClient.js';

function toAuthError(error, fallbackMessage = 'Authentication failed. Please try again.') {
  const message = String(error?.message || '').toLowerCase();

  if (message.includes('invalid login credentials')) {
    return new Error('Invalid email or password.');
  }

  if (message.includes('email not confirmed')) {
    return new Error('Please confirm your email before logging in.');
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return new Error('Too many attempts. Please wait a moment and try again.');
  }

  if (message.includes('failed to fetch') || message.includes('network')) {
    return new Error('Network error. Please check your connection and try again.');
  }

  return new Error(error?.message || fallbackMessage);
}

export async function getCurrentSession() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;
  return data.session;
}

export async function signUpWithEmail({ email, password, fullName }) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
    },
  });

  if (error) throw toAuthError(error, 'Could not create your account.');
  return {
    user: data.user || null,
    session: data.session || null,
    error: null,
  };
}

export async function signInWithEmail({ email, password }) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw toAuthError(error, 'Could not log in. Please try again.');
  return {
    user: data.user || null,
    session: data.session || null,
    error: null,
  };
}

export async function signOut() {
  const supabase = requireSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
