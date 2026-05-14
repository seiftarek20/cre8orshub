import { requireSupabaseClient } from '../lib/supabaseClient.js';

export async function getStudentProgress(userId) {
  if (!userId) return [];

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('lesson_progress')
    .select(`
      id,
      status,
      progress_percent,
      updated_at,
      courses (
        title
      ),
      lessons (
        title,
        duration_minutes
      )
    `)
    .eq('student_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
