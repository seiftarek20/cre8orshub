import { hasSupabaseConfig } from '../lib/supabaseClient.js';

// Phase 1 placeholder:
// Future hooks can expose auth state, profile loading, and student dashboard data.
export function useSupabaseStatus() {
  return {
    isConfigured: hasSupabaseConfig,
  };
}
