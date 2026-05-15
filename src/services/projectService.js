import { requireSupabaseClient } from '../lib/supabaseClient.js';
import { CACHE_TTL, getCachedData, invalidateCaches, makeCacheKey } from '../utils/cache.js';
import { buildPaginatedResult, getPaginationRange } from '../utils/pagination.js';
import {
  sanitizeLongText,
  sanitizeOptionalUrl,
  sanitizeText,
  toSafeSupabaseError,
  validateChoice,
} from '../utils/security.js';

const USER_PROJECT_LIMIT = 24;
const PROJECT_STATUSES = ['draft', 'submitted', 'reviewed', 'showcased'];
const STUDENT_EDITABLE_PROJECT_STATUSES = ['draft', 'submitted'];
const COURSE_CACHE_PREFIX = 'courses:';
const PROJECT_CACHE_PREFIX = 'projects:';
const ANALYTICS_CACHE_PREFIX = 'analytics:';

function invalidateProjectCaches() {
  invalidateCaches([
    PROJECT_CACHE_PREFIX,
    ANALYTICS_CACHE_PREFIX,
  ]);
}

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
    title: sanitizeText(project.title, { maxLength: 140, required: true, label: 'Project title' }),
    description: sanitizeLongText(project.description, { maxLength: 2000 }) || null,
    course_id: sanitizeText(project.courseId || project.course_id, { maxLength: 80 }) || null,
    cover_url: sanitizeOptionalUrl(project.coverUrl || project.cover_url, { label: 'Cover image URL' }),
    project_url: sanitizeOptionalUrl(project.projectUrl || project.project_url, { label: 'Project link' }),
  };
}

export async function getProjectCourses() {
  return getCachedData(makeCacheKey(COURSE_CACHE_PREFIX, 'project-options'), CACHE_TTL.public, async () => {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, slug')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  });
}

export async function getMyProjects({ limit = USER_PROJECT_LIMIT } = {}) {
  const safeLimit = Math.max(Number(limit) || USER_PROJECT_LIMIT, 1);
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select(projectSelect)
    .order('updated_at', { ascending: false })
    .range(0, safeLimit - 1);

  if (error) throw toSafeSupabaseError(error, 'Could not load your projects.');
  return (data || []).map(normalizeProject);
}

export async function createProject(project) {
  const supabase = requireSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be logged in to create a project.');
  const nextStatus = validateChoice(project.status || 'draft', ['draft', 'submitted'], { label: 'Project status' });

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...buildProjectPayload(project),
      student_id: userData.user.id,
      status: nextStatus,
      is_public: false,
    })
    .select(projectSelect)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not save project.');
  invalidateProjectCaches();
  return normalizeProject(data);
}

export async function updateMyProject(projectId, project) {
  const supabase = requireSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be logged in to update a project.');

  const { data: existingProject, error: existingError } = await supabase
    .from('projects')
    .select('id, status, is_public')
    .eq('id', projectId)
    .eq('student_id', userData.user.id)
    .maybeSingle();

  if (existingError) throw toSafeSupabaseError(existingError, 'Could not check project status.');
  if (!existingProject) throw new Error('This project is no longer available.');
  if (!STUDENT_EDITABLE_PROJECT_STATUSES.includes(existingProject.status) || existingProject.is_public) {
    throw new Error('This project has already been reviewed and can no longer be edited.');
  }

  const nextStatus = validateChoice(project.status || 'draft', ['draft', 'submitted'], { label: 'Project status' });
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...buildProjectPayload(project),
      status: nextStatus,
      is_public: false,
    })
    .eq('id', projectId)
    .eq('student_id', userData.user.id)
    .select(projectSelect)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not update project.');
  invalidateProjectCaches();
  return normalizeProject(data);
}

export async function deleteMyProject(projectId) {
  const supabase = requireSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!userData.user) throw new Error('You must be logged in to delete a project.');

  const { data: existingProject, error: existingError } = await supabase
    .from('projects')
    .select('id, status, is_public')
    .eq('id', projectId)
    .eq('student_id', userData.user.id)
    .maybeSingle();

  if (existingError) throw toSafeSupabaseError(existingError, 'Could not check project status.');
  if (!existingProject) throw new Error('This project is no longer available.');
  if (existingProject.status !== 'draft' || existingProject.is_public) {
    throw new Error('Only draft projects can be deleted.');
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('student_id', userData.user.id)
    .eq('status', 'draft');

  if (error) throw toSafeSupabaseError(error, 'Could not delete project.');
  invalidateProjectCaches();
}

export async function getAllProjectsForStaff({ page = 1, pageSize = 12 } = {}) {
  const range = getPaginationRange(page, pageSize);
  const { data, count, error } = await requireSupabaseClient()
    .from('projects')
    .select(projectSelect, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(range.from, range.to);

  if (error) throw toSafeSupabaseError(error, 'Could not load projects.');
  return buildPaginatedResult(data, count, range.page, range.pageSize, normalizeProject);
}

export async function reviewProject(projectId, { status, isPublic }) {
  const nextStatus = validateChoice(status || 'reviewed', PROJECT_STATUSES, { label: 'Project status' });
  const supabase = requireSupabaseClient();
  const { data: existingProject, error: existingError } = await supabase
    .from('projects')
    .select('id, status, is_public')
    .eq('id', projectId)
    .maybeSingle();

  if (existingError) throw toSafeSupabaseError(existingError, 'Could not check project status.');
  if (!existingProject) throw new Error('This project is no longer available for review.');
  if (existingProject.status === 'reviewed' && nextStatus === 'reviewed') {
    throw new Error('This project has already been reviewed.');
  }
  if (existingProject.status === 'showcased' && nextStatus === 'showcased' && Boolean(isPublic || existingProject.is_public)) {
    throw new Error('This project is already showcased.');
  }

  const { data, error } = await supabase
    .from('projects')
    .update({
      status: nextStatus,
      is_public: nextStatus === 'showcased' ? true : Boolean(isPublic),
    })
    .eq('id', projectId)
    .select(projectSelect)
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not review project.');
  invalidateProjectCaches();
  return normalizeProject(data);
}

export async function getPublicShowcaseProjects({ page = 1, pageSize = 12 } = {}) {
  const range = getPaginationRange(page, pageSize);
  return getCachedData(
    makeCacheKey(PROJECT_CACHE_PREFIX, 'showcase', range.page, range.pageSize),
    CACHE_TTL.public,
    async () => {
      const { data, error } = await requireSupabaseClient()
        .from('projects')
        .select(projectSelect)
        .eq('is_public', true)
        .eq('status', 'showcased')
        .order('updated_at', { ascending: false })
        .range(range.from, range.to);

      if (error) throw error;
      return (data || []).map(normalizeProject);
    },
  );
}
