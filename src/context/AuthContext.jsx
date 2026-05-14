import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { getCurrentSession, signInWithEmail, signOut, signUpWithEmail } from '../services/authService.js';
import { getCurrentUserProfile, updateCurrentUserProfile } from '../services/profileService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const user = session?.user || null;

  const loadProfile = useCallback(async (nextUser) => {
    if (!nextUser) {
      setProfile(null);
      return null;
    }

    const nextProfile = await getCurrentUserProfile(nextUser.id);
    setProfile(nextProfile);
    return nextProfile;
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      if (!supabase) {
        if (isMounted) {
          setAuthError('Supabase is not configured yet.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const initialSession = await getCurrentSession();
        if (!isMounted) return;

        setSession(initialSession);
        if (initialSession?.user) {
          await loadProfile(initialSession.user);
        }
      } catch (error) {
        if (isMounted) setAuthError(error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initializeAuth();

    if (!supabase) {
      return () => {
        isMounted = false;
      };
    }

    const { data } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setAuthError(null);

      if (nextSession?.user) {
        try {
          await loadProfile(nextSession.user);
        } catch (error) {
          setAuthError(error.message);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login = useCallback(async ({ email, password }) => {
    const data = await signInWithEmail({ email, password });
    setSession(data.session);
    if (data.user) await loadProfile(data.user);
    return data;
  }, [loadProfile]);

  const signup = useCallback(async ({ email, password, fullName }) => {
    const data = await signUpWithEmail({ email, password, fullName });
    setSession(data.session);
    if (data.user) await loadProfile(data.user);
    return data;
  }, [loadProfile]);

  const logout = useCallback(async () => {
    await signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) throw new Error('You must be logged in to update your profile.');
    const nextProfile = await updateCurrentUserProfile(user.id, updates);
    setProfile(nextProfile);
    return nextProfile;
  }, [user]);

  const value = useMemo(() => ({
    session,
    user,
    profile,
    isAuthenticated: Boolean(user),
    isLoading,
    authError,
    login,
    signup,
    logout,
    loadProfile,
    updateProfile,
  }), [session, user, profile, isLoading, authError, login, signup, logout, loadProfile, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
