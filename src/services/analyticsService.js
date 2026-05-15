import { requireSupabaseClient } from '../lib/supabaseClient.js';

async function safeCount(supabase, table, queryBuilder = (query) => query) {
  const query = queryBuilder(supabase.from(table).select('id', { count: 'exact', head: true }));
  const { count, error } = await query;

  if (error) return 0;
  return count || 0;
}

async function safeList(query, normalizer = (item) => item) {
  const { data, error } = await query;

  if (error) return [];
  return (data || []).map(normalizer);
}

function readSingleRelation(value) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeBooking(booking) {
  return {
    id: booking.id,
    title: booking.full_name || booking.email || 'Booking request',
    meta: booking.course_slug || 'General consultation',
    status: booking.status || 'new',
    createdAt: booking.created_at,
  };
}

function normalizeSubmission(submission) {
  const task = readSingleRelation(submission.tasks);
  const profile = readSingleRelation(submission.profiles);

  return {
    id: submission.id,
    title: task?.title || 'Task submission',
    meta: profile?.full_name || profile?.email || 'Student',
    status: submission.status || 'submitted',
    createdAt: submission.submitted_at,
  };
}

function normalizeProject(project) {
  const profile = readSingleRelation(project.profiles);

  return {
    id: project.id,
    title: project.title || 'Project',
    meta: profile?.full_name || profile?.email || 'Student',
    status: project.status || 'draft',
    createdAt: project.updated_at,
  };
}

export async function getAdminAnalytics() {
  const supabase = requireSupabaseClient();

  const [
    totalUsers,
    totalBookingRequests,
    totalTasks,
    totalSubmissions,
    approvedSubmissions,
    totalProjects,
    showcasedProjects,
    rewardPointsRows,
    latestBookingRequests,
    latestSubmissions,
    latestProjects,
  ] = await Promise.all([
    safeCount(supabase, 'profiles'),
    safeCount(supabase, 'booking_requests'),
    safeCount(supabase, 'tasks'),
    safeCount(supabase, 'task_submissions'),
    safeCount(supabase, 'task_submissions', (query) => query.in('status', ['approved', 'reviewed'])),
    safeCount(supabase, 'projects'),
    safeCount(supabase, 'projects', (query) => query.eq('is_public', true).eq('status', 'showcased')),
    safeList(supabase.from('reward_points').select('points')),
    safeList(
      supabase
        .from('booking_requests')
        .select('id, full_name, email, course_slug, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      normalizeBooking,
    ),
    safeList(
      supabase
        .from('task_submissions')
        .select(`
          id,
          status,
          submitted_at,
          tasks (
            title
          ),
          profiles!task_submissions_student_id_fkey (
            full_name,
            email
          )
        `)
        .order('submitted_at', { ascending: false })
        .limit(5),
      normalizeSubmission,
    ),
    safeList(
      supabase
        .from('projects')
        .select(`
          id,
          title,
          status,
          updated_at,
          profiles!projects_student_id_fkey (
            full_name,
            email
          )
        `)
        .order('updated_at', { ascending: false })
        .limit(5),
      normalizeProject,
    ),
  ]);

  return {
    stats: {
      totalUsers,
      totalBookingRequests,
      totalTasks,
      totalSubmissions,
      approvedSubmissions,
      totalProjects,
      showcasedProjects,
      totalRewardPointsAwarded: rewardPointsRows.reduce((total, row) => total + Number(row.points || 0), 0),
    },
    latestBookingRequests,
    latestSubmissions,
    latestProjects,
  };
}
