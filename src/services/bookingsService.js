import { requireSupabaseClient } from '../lib/supabaseClient.js';

// Phase 1 placeholder:
// Add public booking request creation here after the booking_requests table is created.
export async function createBookingRequest(payload) {
  const supabase = requireSupabaseClient();
  return supabase.from('booking_requests').insert(payload).select().single();
}
