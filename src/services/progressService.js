import { requireSupabaseClient } from '../lib/supabaseClient.js';

// Phase 1 placeholder:
// Add course progress and lesson completion reads/writes here after progress tables are created.
export async function getStudentProgress(studentId) {
  const supabase = requireSupabaseClient();
  return supabase.from('lesson_progress').select('*').eq('student_id', studentId);
}
