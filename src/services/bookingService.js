import { requireSupabaseClient } from '../lib/supabaseClient.js';
import { invalidateCachePrefix } from '../utils/cache.js';
import { buildPaginatedResult, getPaginationRange } from '../utils/pagination.js';
import {
  sanitizeEmail,
  sanitizeLongText,
  sanitizeText,
  toSafeSupabaseError,
  validateChoice,
} from '../utils/security.js';

const ANALYTICS_CACHE_PREFIX = 'analytics:';
const BOOKING_STATUSES = ['new', 'contacted', 'booked', 'closed'];
const DUPLICATE_BOOKING_WINDOW_MS = 15000;
const recentBookingAttempts = new Map();

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
    full_name: sanitizeText(data.full_name || data.fullName, { maxLength: 120, required: true, label: 'Name' }),
    email: sanitizeEmail(data.email),
    phone: sanitizeText(data.phone, { maxLength: 40 }) || null,
    course_slug: sanitizeText(data.course_slug || data.courseSlug, { maxLength: 80 }) || null,
    preferred_mode: sanitizeText(data.preferred_mode || data.preferredMode, { maxLength: 80 }) || null,
    message: sanitizeLongText(data.message, { maxLength: 1200 }) || null,
    status: validateChoice(data.status || 'new', BOOKING_STATUSES, { label: 'Booking status' }),
  };
}

function getBookingSignature(payload) {
  return [
    payload.email,
    payload.phone || '',
    payload.course_slug || '',
    payload.preferred_mode || '',
  ].join('|');
}

export async function createBookingRequest(data) {
  const supabase = requireSupabaseClient();
  const payload = buildBookingPayload(data);
  const signature = getBookingSignature(payload);
  const now = Date.now();
  const lastAttemptAt = recentBookingAttempts.get(signature) || 0;

  if (now - lastAttemptAt < DUPLICATE_BOOKING_WINDOW_MS) {
    throw new Error('This booking request was already sent. Please wait a moment before trying again.');
  }

  recentBookingAttempts.set(signature, now);
  const { error } = await supabase
    .from('booking_requests')
    .insert(payload);

  if (error) {
    recentBookingAttempts.delete(signature);
    throw toSafeSupabaseError(error, 'Could not save the booking request.');
  }
  invalidateCachePrefix(ANALYTICS_CACHE_PREFIX);
  return payload;
}

export async function getAllBookingsForStaff({ page = 1, pageSize = 12 } = {}) {
  const range = getPaginationRange(page, pageSize);
  const supabase = requireSupabaseClient();
  const { data, count, error } = await supabase
    .from('booking_requests')
    .select(bookingSelect, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(range.from, range.to);

  if (error) throw toSafeSupabaseError(error, 'Could not load booking requests.');
  return buildPaginatedResult(data, count, range.page, range.pageSize, normalizeBooking);
}

export async function updateBookingStatus(id, status) {
  const nextStatus = validateChoice(status, BOOKING_STATUSES, { label: 'Booking status' });
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('booking_requests')
    .update({ status: nextStatus })
    .eq('id', id)
    .select(bookingSelect)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not update booking status.');
  invalidateCachePrefix(ANALYTICS_CACHE_PREFIX);
  return normalizeBooking(data);
}

export async function assignBooking(id, userId) {
  const assigneeId = sanitizeText(userId, { maxLength: 80 }) || null;
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('booking_requests')
    .update({ assigned_to: assigneeId })
    .eq('id', id)
    .select(bookingSelect)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not assign booking.');
  invalidateCachePrefix(ANALYTICS_CACHE_PREFIX);
  return normalizeBooking(data);
}

export async function getBookingStaffOptions() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .in('role', ['admin', 'instructor'])
    .order('full_name', { ascending: true });

  if (error) throw toSafeSupabaseError(error, 'Could not load staff options.');
  return (data || []).map((profile) => ({
    id: profile.id,
    name: profile.full_name || profile.email || 'Staff member',
    email: profile.email || '',
    role: profile.role,
  }));
}
