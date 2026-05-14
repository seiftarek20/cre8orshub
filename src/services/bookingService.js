import { requireSupabaseClient } from '../lib/supabaseClient.js';

const bookingSelect = `
  id,
  full_name,
  email,
  phone,
  course_slug,
  preferred_mode,
  message,
  status,
  assigned_to,
  created_at,
  updated_at,
  profiles!booking_requests_assigned_to_fkey (
    full_name,
    email
  )
`;

function readSingleRelation(value) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeBooking(booking) {
  const assignee = readSingleRelation(booking.profiles);

  return {
    id: booking.id,
    fullName: booking.full_name || '',
    email: booking.email || '',
    phone: booking.phone || '',
    courseSlug: booking.course_slug || '',
    preferredMode: booking.preferred_mode || '',
    message: booking.message || '',
    status: booking.status || 'new',
    assignedTo: booking.assigned_to || '',
    assigneeName: assignee?.full_name || assignee?.email || '',
    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
  };
}

function buildBookingPayload(data) {
  return {
    full_name: data.full_name?.trim() || data.fullName?.trim(),
    email: data.email?.trim(),
    phone: data.phone?.trim() || null,
    course_slug: data.course_slug || data.courseSlug || null,
    preferred_mode: data.preferred_mode || data.preferredMode || null,
    message: data.message?.trim() || null,
    status: data.status || 'new',
  };
}

export async function createBookingRequest(data) {
  const supabase = requireSupabaseClient();
  const payload = buildBookingPayload(data);
  const { error } = await supabase
    .from('booking_requests')
    .insert(payload);

  if (error) throw error;
  return payload;
}

export async function getAllBookingsForStaff() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('booking_requests')
    .select(bookingSelect)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeBooking);
}

export async function updateBookingStatus(id, status) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('booking_requests')
    .update({ status })
    .eq('id', id)
    .select(bookingSelect)
    .single();

  if (error) throw error;
  return normalizeBooking(data);
}

export async function assignBooking(id, userId) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('booking_requests')
    .update({ assigned_to: userId || null })
    .eq('id', id)
    .select(bookingSelect)
    .single();

  if (error) throw error;
  return normalizeBooking(data);
}

export async function getBookingStaffOptions() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .in('role', ['admin', 'instructor'])
    .order('full_name', { ascending: true });

  if (error) throw error;
  return (data || []).map((profile) => ({
    id: profile.id,
    name: profile.full_name || profile.email || 'Staff member',
    email: profile.email || '',
    role: profile.role,
  }));
}
