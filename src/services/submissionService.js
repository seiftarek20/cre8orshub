import { requireSupabaseClient } from '../lib/supabaseClient.js';
import { invalidateCaches } from '../utils/cache.js';
import { buildPaginatedResult, getPaginationRange } from '../utils/pagination.js';
import {
  sanitizeLongText,
  sanitizeOptionalUrl,
  sanitizeScore,
  sanitizeText,
  toSafeSupabaseError,
  validateChoice,
} from '../utils/security.js';

const USER_SUBMISSION_LIMIT = 24;
const TASK_CACHE_PREFIX = 'tasks:';
const REWARD_CACHE_PREFIX = 'rewards:';
const ANALYTICS_CACHE_PREFIX = 'analytics:';
const SUBMISSION_STATUSES = ['submitted', 'needs_revision', 'reviewed', 'approved'];
const EDITABLE_SUBMISSION_STATUSES = ['submitted', 'needs_revision'];

function invalidateSubmissionRelatedCaches() {
  invalidateCaches([
    TASK_CACHE_PREFIX,
    REWARD_CACHE_PREFIX,
    ANALYTICS_CACHE_PREFIX,
  ]);
}

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

  if (insertError?.code === '23505') return;
  if (insertError) throw toSafeSupabaseError(insertError, 'Could not award badge.');
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

    if (rewardError) throw toSafeSupabaseError(rewardError, 'Could not award reward points.');
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
  const cleanTaskId = sanitizeText(taskId, { maxLength: 80, required: true, label: 'Task' });
  const cleanSubmissionText = sanitizeLongText(submissionText, {
    maxLength: 3000,
    required: true,
    label: 'Submission text',
  });
  const cleanFileUrl = sanitizeOptionalUrl(fileUrl || projectUrl, { label: 'Project link' });

  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('id, is_published')
    .eq('id', cleanTaskId)
    .eq('is_published', true)
    .maybeSingle();

  if (taskError) throw toSafeSupabaseError(taskError, 'Could not verify this task.');
  if (!task) throw new Error('This task is no longer available for submission.');

  const { data: existingSubmission, error: existingError } = await supabase
    .from('task_submissions')
    .select('id, status')
    .eq('task_id', cleanTaskId)
    .eq('student_id', userData.user.id)
    .maybeSingle();

  if (existingError) throw toSafeSupabaseError(existingError, 'Could not check your existing submission.');
  if (existingSubmission) {
    throw new Error(
      EDITABLE_SUBMISSION_STATUSES.includes(existingSubmission.status)
        ? 'You already submitted this task. Please update the existing submission.'
        : 'This task submission has already been reviewed.',
    );
  }

  const { data, error } = await supabase
    .from('task_submissions')
    .insert({
      task_id: cleanTaskId,
      student_id: userData.user.id,
      submission_text: cleanSubmissionText,
      file_url: cleanFileUrl,
      status: 'submitted',
    })
    .select(submissionSelect)
    .single();

  if (error?.code === '23505') {
    throw new Error('You already submitted this task.');
  }
  if (error) throw toSafeSupabaseError(error, 'Could not submit task.');
  invalidateSubmissionRelatedCaches();
  return normalizeSubmission(data);
}

export async function getMyTaskSubmissions({ limit = USER_SUBMISSION_LIMIT } = {}) {
  const safeLimit = Math.max(Number(limit) || USER_SUBMISSION_LIMIT, 1);
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('task_submissions')
    .select(submissionSelect)
    .order('submitted_at', { ascending: false })
    .range(0, safeLimit - 1);

  if (error) throw toSafeSupabaseError(error, 'Could not load submissions.');
  return (data || []).map(normalizeSubmission);
}

export async function getSubmissionByTask(taskId) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('task_submissions')
    .select(submissionSelect)
    .eq('task_id', taskId)
    .maybeSingle();

  if (error) throw toSafeSupabaseError(error, 'Could not load this submission.');
  return data ? normalizeSubmission(data) : null;
}

export async function updateMySubmissionIfAllowed(submissionId, updates) {
  const supabase = requireSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be logged in to update a submission.');

  const payload = {
    submission_text: sanitizeLongText(updates.submissionText, {
      maxLength: 3000,
      required: true,
      label: 'Submission text',
    }),
    file_url: sanitizeOptionalUrl(updates.projectUrl || updates.fileUrl, { label: 'Project link' }),
  };

  const { data: existingSubmission, error: existingError } = await supabase
    .from('task_submissions')
    .select('id, status')
    .eq('id', submissionId)
    .eq('student_id', userData.user.id)
    .maybeSingle();

  if (existingError) throw toSafeSupabaseError(existingError, 'Could not check your submission.');
  if (!existingSubmission) throw new Error('This submission is no longer available.');
  if (!EDITABLE_SUBMISSION_STATUSES.includes(existingSubmission.status)) {
    throw new Error('This submission has already been reviewed and can no longer be edited.');
  }

  const { data, error } = await supabase
    .from('task_submissions')
    .update(payload)
    .eq('id', submissionId)
    .eq('student_id', userData.user.id)
    .in('status', ['submitted', 'needs_revision'])
    .select(submissionSelect)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not update submission.');
  invalidateSubmissionRelatedCaches();
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

  if (error) throw toSafeSupabaseError(error, 'Could not load submissions for review.');
  return buildPaginatedResult(data, count, range.page, range.pageSize, normalizeSubmission);
}

export async function updateSubmissionReview(submissionId, { status, feedback, score }) {
  const payload = {
    status: validateChoice(status, SUBMISSION_STATUSES, { label: 'Submission status' }),
    feedback: sanitizeLongText(feedback, { maxLength: 2000 }) || null,
    score: sanitizeScore(score),
    reviewed_at: new Date().toISOString(),
  };

  const supabase = requireSupabaseClient();
  const { data: existingSubmission, error: existingError } = await supabase
    .from('task_submissions')
    .select('id, status')
    .eq('id', submissionId)
    .maybeSingle();

  if (existingError) throw toSafeSupabaseError(existingError, 'Could not check this submission.');
  if (!existingSubmission) throw new Error('This submission is no longer available for review.');

  const { data, error } = await supabase
    .from('task_submissions')
    .update(payload)
    .eq('id', submissionId)
    .select(submissionSelect)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not save review.');
  let rewardsUpdated;

  try {
    rewardsUpdated = await awardSubmissionRewardsIfNeeded(supabase, data);
  } finally {
    invalidateSubmissionRelatedCaches();
  }

  return {
    ...normalizeSubmission(data),
    rewardsUpdated,
  };
}
