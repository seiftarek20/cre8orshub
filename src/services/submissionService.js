import { requireSupabaseClient } from '../lib/supabaseClient.js';

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

export async function getAllTaskSubmissionsForReview() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('task_submissions')
    .select(submissionSelect)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeSubmission);
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
  return normalizeSubmission(data);
}
