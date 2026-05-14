import { requireSupabaseClient } from '../lib/supabaseClient.js';

export async function getCurrentSession() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;
  return data.session;
}

export async function signUpWithEmail({ email, password, fullName }) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithEmail({ email, password }) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = requireSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
