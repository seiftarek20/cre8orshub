import { requireSupabaseClient } from '../lib/supabaseClient.js';

// Phase 1 placeholder:
// Add task list, task detail, and task submission queries here after task tables are created.
export async function getStudentTasks(studentId) {
  const supabase = requireSupabaseClient();
  return supabase.from('tasks').select('*').eq('student_id', studentId);
}
