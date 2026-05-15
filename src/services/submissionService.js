import { requireSupabaseClient } from '../lib/supabaseClient.js';
import { buildPaginatedResult, getPaginationRange } from '../utils/pagination.js';

const submissionSelect = `
  id,
  task_id,
  student_id,
  submission_text,
  file_url,
  status,
  feedback,
  score,
  submitted_at,
  reviewed_at,
  tasks (
    title,
    points,
    courses (
      title
    )
  ),
  profiles!task_submissions_student_id_fkey (
    full_name,
    email
  )
`;

function readSingleRelation(value) {
  return Array.isArray(value) ? value[0] : value;
}

function shouldAwardRewards(status) {
  return status === 'approved' || status === 'reviewed';
}

function getSubmissionRewardPoints(submission) {
  const task = readSingleRelation(submission.tasks);
  const taskPoints = Number(task?.points || 0);
  const scorePoints = Number(submission.score || 0);

  return taskPoints > 0 ? taskPoints : scorePoints;
}

async function awardEligibleBadges(supabase, studentId) {
  const { data: pointsRows, error: pointsError } = await supabase
    .from('reward_points')
    .select('points')
    .eq('student_id', studentId);

  if (pointsError) throw pointsError;

  const totalPoints = (pointsRows || []).reduce((total, row) => total + Number(row.points || 0), 0);

  const { data: eligibleBadges, error: badgesError } = await supabase
    .from('badges')
    .select('id, points_required')
    .not('points_required', 'is', null)
    .lte('points_required', totalPoints);

  if (badgesError) throw badgesError;
  if (!eligibleBadges?.length) return;

  const { data: existingBadges, error: existingError } = await supabase
    .from('student_badges')
    .select('badge_id')
    .eq('student_id', studentId);

  if (existingError) throw existingError;

  const existingBadgeIds = new Set((existingBadges || []).map((badge) => badge.badge_id));
  const missingBadges = eligibleBadges
    .filter((badge) => !existingBadgeIds.has(badge.id))
    .map((badge) => ({
      student_id: studentId,
      badge_id: badge.id,
    }));

  if (!missingBadges.length) return;

  const { error: insertError } = await supabase
    .from('student_badges')
    .insert(missingBadges);

  if (insertError) throw insertError;
}

async function awardSubmissionRewardsIfNeeded(supabase, submission) {
  if (!shouldAwardRewards(submission.status)) return false;

  const points = getSubmissionRewardPoints(submission);
  if (!points) return false;

  const sourceId = submission.task_id;
  const { data: existingReward, error: existingError } = await supabase
    .from('reward_points')
    .select('id')
    .eq('student_id', submission.student_id)
    .eq('source_type', 'task')
    .eq('source_id', sourceId)
    .maybeSingle();

  if (existingError) throw existingError;

  const task = readSingleRelation(submission.tasks);
  let didCreateReward = false;

  if (!existingReward) {
    const { error: rewardError } = await supabase
      .from('reward_points')
      .insert({
        student_id: submission.student_id,
        source_type: 'task',
        source_id: sourceId,
        points,
        note: `Task approved: ${task?.title || 'Task submission'}`,
      });

    if (rewardError) throw rewardError;
    didCreateReward = true;
  }

  await awardEligibleBadges(supabase, submission.student_id);
  return didCreateReward;
}

export function normalizeSubmission(submission) {
  const task = readSingleRelation(submission.tasks);
  const course = readSingleRelation(task?.courses);
  const profile = readSingleRelation(submission.profiles);

  return {
    id: submission.id,
    taskId: submission.task_id,
    studentId: submission.student_id,
    taskTitle: task?.title || 'Task submission',
    courseTitle: course?.title || 'Course',
    studentName: profile?.full_name || profile?.email || 'Student',
    studentEmail: profile?.email || '',
    submissionText: submission.submission_text || '',
    projectUrl: submission.file_url || '',
    status: submission.status || 'submitted',
    feedback: submission.feedback || '',
    score: submission.score,
    points: task?.points || 0,
    submittedAt: submission.submitted_at,
    reviewedAt: submission.reviewed_at,
  };
}

export async function createTaskSubmission(taskId, submissionText, projectUrl = '', fileUrl = '') {
  const supabase = requireSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be logged in to submit a task.');

  const { data, error } = await supabase
    .from('task_submissions')
    .insert({
      task_id: taskId,
      student_id: userData.user.id,
      submission_text: submissionText.trim(),
      file_url: (fileUrl || projectUrl || '').trim() || null,
      status: 'submitted',
    })
    .select(submissionSelect)
    .single();

  if (error) throw error;
  return normalizeSubmission(data);
}

export async function getMyTaskSubmissions() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('task_submissions')
    .select(submissionSelect)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeSubmission);
}

export async function getSubmissionByTask(taskId) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('task_submissions')
    .select(submissionSelect)
    .eq('task_id', taskId)
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeSubmission(data) : null;
}

export async function updateMySubmissionIfAllowed(submissionId, updates) {
  const payload = {
    submission_text: updates.submissionText?.trim() || null,
    file_url: updates.projectUrl?.trim() || updates.fileUrl?.trim() || null,
  };

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('task_submissions')
    .update(payload)
    .eq('id', submissionId)
    .in('status', ['submitted', 'needs_revision'])
    .select(submissionSelect)
    .single();

  if (error) throw error;
  return normalizeSubmission(data);
}

export async function getAllTaskSubmissionsForReview({ page = 1, pageSize = 12 } = {}) {
  const range = getPaginationRange(page, pageSize);
  const supabase = requireSupabaseClient();
  const { data, count, error } = await supabase
    .from('task_submissions')
    .select(submissionSelect, { count: 'exact' })
    .order('submitted_at', { ascending: false })
    .range(range.from, range.to);

  if (error) throw error;
  return buildPaginatedResult(data, count, range.page, range.pageSize, normalizeSubmission);
}

export async function updateSubmissionReview(submissionId, { status, feedback, score }) {
  const payload = {
    status,
    feedback: feedback?.trim() || null,
    score: score === '' || score === null || score === undefined ? null : Number(score),
    reviewed_at: new Date().toISOString(),
  };

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('task_submissions')
    .update(payload)
    .eq('id', submissionId)
    .select(submissionSelect)
    .single();

  if (error) throw error;
  const rewardsUpdated = await awardSubmissionRewardsIfNeeded(supabase, data);

  return {
    ...normalizeSubmission(data),
    rewardsUpdated,
  };
}
