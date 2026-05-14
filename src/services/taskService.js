import { requireSupabaseClient } from '../lib/supabaseClient.js';

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
    description: task.description || 'Complete this assignment brief and prepare your project for review.',
    requirements: requirements.length ? requirements : ['Follow the creative brief', 'Prepare your project for review'],
  };
}

export async function getStudentTasks(userId) {
  if (!userId) return [];

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
        status,
        submitted_at,
        reviewed_at
      )
    `)
    .eq('is_published', true)
    .order('points', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeTask);
}
