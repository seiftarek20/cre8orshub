import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { getCurrentSession, signInWithEmail, signOut, signUpWithEmail } from '../services/authService.js';
import { getCurrentUserProfile, updateCurrentUserProfile } from '../services/profileService.js';

const AuthContext = createContext(null);
const PROFILE_TIMEOUT_MS = 6000;

function buildFallbackProfile(nextUser) {
  return {
    id: nextUser.id,
    full_name: nextUser.user_metadata?.full_name || nextUser.email?.split('@')[0] || '',
    email: nextUser.email || '',
    role: 'student',
    isMissingProfile: true,
  };
}

function withTimeout(promise, timeoutMs, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId));
}

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

    const nextProfile = await withTimeout(
      getCurrentUserProfile(nextUser.id),
      PROFILE_TIMEOUT_MS,
      'Profile loading timed out.',
    );
    const safeProfile = nextProfile
      ? {
          ...nextProfile,
          role: nextProfile.role || 'student',
        }
      : buildFallbackProfile(nextUser);

    setProfile(safeProfile);
    return safeProfile;
  }, []);

  const loadProfileSafely = useCallback(async (nextUser) => {
    if (!nextUser) {
      setProfile(null);
      return null;
    }

    try {
      setAuthError(null);
      return await loadProfile(nextUser);
    } catch {
      const fallbackProfile = buildFallbackProfile(nextUser);
      setProfile(fallbackProfile);
      setAuthError('Your profile could not be loaded. Some account features may be limited.');
      return fallbackProfile;
    }
  }, [loadProfile]);

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
          void loadProfileSafely(initialSession.user);
        }
      } catch {
        if (isMounted) {
          setSession(null);
          setProfile(null);
          setAuthError('Your session could not be restored. Please log in again.');
        }
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

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setAuthError(null);

      if (nextSession?.user) {
        void loadProfileSafely(nextSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [loadProfileSafely]);

  const login = useCallback(async ({ email, password }) => {
    setAuthError(null);
    const data = await signInWithEmail({ email, password });
    setSession(data.session);
    if (data.user) void loadProfileSafely(data.user);
    return data;
  }, [loadProfileSafely]);

  const signup = useCallback(async ({ email, password, fullName }) => {
    setAuthError(null);
    const data = await signUpWithEmail({ email, password, fullName });
    setSession(data.session);
    if (data.user) void loadProfileSafely(data.user);
    return data;
  }, [loadProfileSafely]);

  const logout = useCallback(async () => {
    setAuthError(null);
    await signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) throw new Error('You must be logged in to update your profile.');
    setAuthError(null);
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
