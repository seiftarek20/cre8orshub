import { requireSupabaseClient } from '../lib/supabaseClient.js';
import { buildPaginatedResult, getPaginationRange } from '../utils/pagination.js';

const projectSelect = `
  id,
  student_id,
  course_id,
  title,
  description,
  cover_url,
  project_url,
  status,
  is_public,
  created_at,
  updated_at,
  courses (
    title
  ),
  profiles!projects_student_id_fkey (
    full_name,
    email
  )
`;

function readSingleRelation(value) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeProject(project) {
  const course = readSingleRelation(project.courses);
  const profile = readSingleRelation(project.profiles);

  return {
    id: project.id,
    studentId: project.student_id,
    courseId: project.course_id || '',
    courseTitle: course?.title || 'Portfolio Project',
    studentName: profile?.full_name || profile?.email || 'Student',
    title: project.title || '',
    description: project.description || '',
    coverUrl: project.cover_url || '',
    projectUrl: project.project_url || '',
    status: project.status || 'draft',
    isPublic: Boolean(project.is_public),
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  };
}

function buildProjectPayload(project) {
  return {
    title: project.title?.trim(),
    description: project.description?.trim() || null,
    course_id: project.courseId || project.course_id || null,
    cover_url: project.coverUrl?.trim() || project.cover_url?.trim() || null,
    project_url: project.projectUrl?.trim() || project.project_url?.trim() || null,
  };
}

export async function getProjectCourses() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, slug')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getMyProjects() {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select(projectSelect)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeProject);
}

export async function createProject(project) {
  const supabase = requireSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be logged in to create a project.');

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...buildProjectPayload(project),
      student_id: userData.user.id,
      status: project.status || 'draft',
      is_public: false,
    })
    .select(projectSelect)
    .single();

  if (error) throw error;
  return normalizeProject(data);
}

export async function updateMyProject(projectId, project) {
  const { data, error } = await requireSupabaseClient()
    .from('projects')
    .update({
      ...buildProjectPayload(project),
      status: project.status || 'draft',
      is_public: false,
    })
    .eq('id', projectId)
    .select(projectSelect)
    .single();

  if (error) throw error;
  return normalizeProject(data);
}

export async function deleteMyProject(projectId) {
  const { error } = await requireSupabaseClient()
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('status', 'draft');

  if (error) throw error;
}

export async function getAllProjectsForStaff({ page = 1, pageSize = 12 } = {}) {
  const range = getPaginationRange(page, pageSize);
  const { data, count, error } = await requireSupabaseClient()
    .from('projects')
    .select(projectSelect, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(range.from, range.to);

  if (error) throw error;
  return buildPaginatedResult(data, count, range.page, range.pageSize, normalizeProject);
}

export async function reviewProject(projectId, { status, isPublic }) {
  const nextStatus = status || 'reviewed';
  const { data, error } = await requireSupabaseClient()
    .from('projects')
    .update({
      status: nextStatus,
      is_public: nextStatus === 'showcased' ? true : Boolean(isPublic),
    })
    .eq('id', projectId)
    .select(projectSelect)
    .single();

  if (error) throw error;
  return normalizeProject(data);
}

export async function getPublicShowcaseProjects({ page = 1, pageSize = 12 } = {}) {
  const range = getPaginationRange(page, pageSize);
  const { data, error } = await requireSupabaseClient()
    .from('projects')
    .select(projectSelect)
    .eq('is_public', true)
    .eq('status', 'showcased')
    .order('updated_at', { ascending: false })
    .range(range.from, range.to);

  if (error) throw error;
  return (data || []).map(normalizeProject);
}
