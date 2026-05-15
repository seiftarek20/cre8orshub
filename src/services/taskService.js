import { requireSupabaseClient } from '../lib/supabaseClient.js';
import { CACHE_TTL, getCachedData, invalidateCaches, makeCacheKey } from '../utils/cache.js';
import { sanitizeLongText, sanitizeText, toSafeSupabaseError } from '../utils/security.js';
import {
  createTaskSubmission,
  getMyTaskSubmissions,
  getSubmissionByTask,
  updateMySubmissionIfAllowed,
} from './submissionService.js';

const TASK_CACHE_PREFIX = 'tasks:';
const COURSE_CACHE_PREFIX = 'courses:';
const ANALYTICS_CACHE_PREFIX = 'analytics:';

function invalidateTaskCaches() {
  invalidateCaches([
    TASK_CACHE_PREFIX,
    COURSE_CACHE_PREFIX,
    ANALYTICS_CACHE_PREFIX,
  ]);
}

function normalizeStatus(status) {
  if (!status) return 'Open';

  const readableStatus = {
    submitted: 'Submitted',
    reviewed: 'Reviewed',
    approved: 'Reviewed',
    needs_revision: 'Open',
  };

  return readableStatus[status] || 'Open';
}

function normalizeTask(task) {
  const submission = Array.isArray(task.task_submissions) ? task.task_submissions[0] : null;
  const course = Array.isArray(task.courses) ? task.courses[0] : task.courses;
  const requirements = Array.isArray(task.requirements) ? task.requirements : [];

  return {
    id: task.id,
    title: task.title,
    category: course?.title || 'Course Task',
    difficulty: course?.level || 'Published',
    deadline: task.due_days_after_enrollment ? `${task.due_days_after_enrollment} days` : 'Flexible',
    points: task.points || 0,
    status: normalizeStatus(submission?.status),
    rawStatus: submission?.status || null,
    submission: submission ? {
      id: submission.id,
      text: submission.submission_text || '',
      projectUrl: submission.file_url || '',
      feedback: submission.feedback || '',
      score: submission.score,
      submittedAt: submission.submitted_at,
      reviewedAt: submission.reviewed_at,
      status: submission.status,
    } : null,
    description: task.description || 'Complete this assignment brief and prepare your project for review.',
    requirements: requirements.length ? requirements : ['Follow the creative brief', 'Prepare your project for review'],
  };
}

function normalizeStaffTask(task) {
  const course = Array.isArray(task.courses) ? task.courses[0] : task.courses;
  const lesson = Array.isArray(task.lessons) ? task.lessons[0] : task.lessons;
  const requirements = Array.isArray(task.requirements) ? task.requirements : [];

  return {
    id: task.id,
    title: task.title || '',
    description: task.description || '',
    requirements,
    requirementsText: requirements.join('\n'),
    points: task.points || 0,
    courseId: task.course_id || '',
    courseTitle: course?.title || 'No course',
    lessonId: task.lesson_id || '',
    lessonTitle: lesson?.title || '',
    dueDaysAfterEnrollment: task.due_days_after_enrollment ?? '',
    isPublished: Boolean(task.is_published),
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  };
}

function normalizeCourse(course) {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
  };
}

function parseRequirements(requirements) {
  const items = Array.isArray(requirements) ? requirements : String(requirements || '').split('\n');
  return items
    .map((item) => sanitizeText(item, { maxLength: 240 }))
    .filter(Boolean);
}

function buildTaskPayload(task) {
  const points = Number(task.points);
  const dueDays = Number(task.dueDaysAfterEnrollment);

  if (!Number.isFinite(points) || points < 0 || points > 10000) {
    throw new Error('Task points must be a valid number.');
  }

  if (
    task.dueDaysAfterEnrollment !== '' &&
    task.dueDaysAfterEnrollment !== null &&
    task.dueDaysAfterEnrollment !== undefined &&
    (!Number.isFinite(dueDays) || dueDays < 0 || dueDays > 365)
  ) {
    throw new Error('Due days must be between 0 and 365.');
  }

  return {
    title: sanitizeText(task.title, { maxLength: 140, required: true, label: 'Task title' }),
    description: sanitizeLongText(task.description, { maxLength: 2000 }) || null,
    requirements: parseRequirements(task.requirementsText ?? task.requirements),
    points,
    course_id: sanitizeText(task.courseId || task.course_id, { maxLength: 80, required: true, label: 'Course' }),
    lesson_id: sanitizeText(task.lessonId || task.lesson_id, { maxLength: 80 }) || null,
    due_days_after_enrollment:
      task.dueDaysAfterEnrollment === '' || task.dueDaysAfterEnrollment === null || task.dueDaysAfterEnrollment === undefined
        ? null
        : dueDays,
    is_published: Boolean(task.isPublished ?? task.is_published),
  };
}

export async function getStudentTasks(userId) {
  if (!userId) return [];

  return getCachedData(makeCacheKey(TASK_CACHE_PREFIX, 'published', userId), CACHE_TTL.standard, async () => {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        description,
        requirements,
        points,
        due_days_after_enrollment,
        courses (
          title,
          level
        ),
        task_submissions (
          id,
          student_id,
          submission_text,
          file_url,
          status,
          feedback,
          score,
          submitted_at,
          reviewed_at
        )
      `)
      .eq('is_published', true)
      .eq('task_submissions.student_id', userId)
      .order('points', { ascending: false });

    if (error) throw toSafeSupabaseError(error, 'Could not load tasks.');
    return (data || []).map(normalizeTask);
  });
}

export async function getTaskCoursesForStaff() {
  return getCachedData(makeCacheKey(COURSE_CACHE_PREFIX, 'task-options'), CACHE_TTL.public, async () => {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, slug')
      .order('sort_order', { ascending: true });

    if (error) throw toSafeSupabaseError(error, 'Could not load course options.');
    return (data || []).map(normalizeCourse);
  });
}

export async function getAllTasksForStaff() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id,
      title,
      description,
      requirements,
      points,
      course_id,
      lesson_id,
      due_days_after_enrollment,
      is_published,
      created_at,
      updated_at,
      courses (
        title
      ),
      lessons (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw toSafeSupabaseError(error, 'Could not create task.');
  return (data || []).map(normalizeStaffTask);
}

export async function createTask(task) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .insert(buildTaskPayload(task))
    .select(`
      id,
      title,
      description,
      requirements,
      points,
      course_id,
      lesson_id,
      due_days_after_enrollment,
      is_published,
      created_at,
      updated_at,
      courses (
        title
      ),
      lessons (
        title
      )
    `)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not update task.');
  invalidateTaskCaches();
  return normalizeStaffTask(data);
}

export async function updateTask(taskId, task) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .update(buildTaskPayload(task))
    .eq('id', taskId)
    .select(`
      id,
      title,
      description,
      requirements,
      points,
      course_id,
      lesson_id,
      due_days_after_enrollment,
      is_published,
      created_at,
      updated_at,
      courses (
        title
      ),
      lessons (
        title
      )
    `)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not archive task.');
  invalidateTaskCaches();
  return normalizeStaffTask(data);
}

export async function archiveTask(taskId) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .update({ is_published: false })
    .eq('id', taskId)
    .select(`
      id,
      title,
      description,
      requirements,
      points,
      course_id,
      lesson_id,
      due_days_after_enrollment,
      is_published,
      created_at,
      updated_at,
      courses (
        title
      ),
      lessons (
        title
      )
    `)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not delete task.');
  invalidateTaskCaches();
  return normalizeStaffTask(data);
}

export async function deleteTask(taskId) {
  const supabase = requireSupabaseClient();
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw toSafeSupabaseError(error, 'Could not update task visibility.');
  invalidateTaskCaches();
}

export async function toggleTaskPublished(taskId, isPublished) {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .update({ is_published: isPublished })
    .eq('id', taskId)
    .select(`
      id,
      title,
      description,
      requirements,
      points,
      course_id,
      lesson_id,
      due_days_after_enrollment,
      is_published,
      created_at,
      updated_at,
      courses (
        title
      ),
      lessons (
        title
      )
    `)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not load tasks.');
  invalidateTaskCaches();
  return normalizeStaffTask(data);
}

export {
  createTaskSubmission,
  getMyTaskSubmissions,
  getSubmissionByTask,
  updateMySubmissionIfAllowed,
};
