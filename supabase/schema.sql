-- Cre8ors Hub Supabase schema
-- Run this first in the Supabase SQL editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role text not null default 'student',
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('student', 'instructor', 'admin'))
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  arabic_title text,
  subtitle text,
  description text,
  duration text,
  level text,
  cover_image_url text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  video_url text,
  duration_minutes int not null default 0,
  sort_order int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_duration_check check (duration_minutes >= 0),
  constraint lessons_sort_unique unique (course_id, sort_order)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint enrollments_status_check check (status in ('active', 'paused', 'completed')),
  constraint enrollments_student_course_unique unique (student_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'not_started',
  progress_percent int not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint lesson_progress_status_check check (status in ('not_started', 'in_progress', 'completed')),
  constraint lesson_progress_percent_check check (progress_percent between 0 and 100),
  constraint lesson_progress_student_lesson_unique unique (student_id, lesson_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  description text,
  requirements jsonb not null default '[]'::jsonb,
  points int not null default 0,
  due_days_after_enrollment int,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_points_check check (points >= 0),
  constraint tasks_due_days_check check (due_days_after_enrollment is null or due_days_after_enrollment >= 0)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  description text,
  cover_url text,
  project_url text,
  status text not null default 'draft',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_status_check check (status in ('draft', 'submitted', 'reviewed', 'showcased'))
);

create table if not exists public.task_submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  submission_text text,
  file_url text,
  status text not null default 'submitted',
  feedback text,
  score int,
  reviewed_by uuid references public.profiles(id) on delete set null,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint task_submissions_status_check check (status in ('submitted', 'reviewed', 'approved', 'needs_revision')),
  constraint task_submissions_score_check check (score is null or score between 0 and 100),
  constraint task_submissions_student_task_unique unique (student_id, task_id)
);

create table if not exists public.reward_points (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  source_type text not null,
  source_id uuid,
  points int not null,
  note text,
  created_at timestamptz not null default now(),
  constraint reward_points_source_type_check check (source_type in ('lesson', 'task', 'project', 'manual')),
  constraint reward_points_points_check check (points <> 0)
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text,
  icon_url text,
  criteria text,
  points_required int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint badges_points_required_check check (points_required is null or points_required >= 0)
);

create table if not exists public.student_badges (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_by uuid references public.profiles(id) on delete set null,
  awarded_at timestamptz not null default now(),
  constraint student_badges_student_badge_unique unique (student_id, badge_id)
);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  course_slug text,
  preferred_mode text,
  message text,
  status text not null default 'new',
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_requests_status_check check (status in ('new', 'contacted', 'booked', 'closed'))
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists courses_published_sort_idx on public.courses(is_published, sort_order);
create index if not exists lessons_course_sort_idx on public.lessons(course_id, sort_order);
create index if not exists enrollments_student_idx on public.enrollments(student_id);
create index if not exists enrollments_course_idx on public.enrollments(course_id);
create index if not exists lesson_progress_student_idx on public.lesson_progress(student_id);
create index if not exists lesson_progress_course_idx on public.lesson_progress(course_id);
create index if not exists tasks_course_idx on public.tasks(course_id);
create index if not exists tasks_lesson_idx on public.tasks(lesson_id);
create index if not exists task_submissions_student_idx on public.task_submissions(student_id);
create index if not exists task_submissions_task_idx on public.task_submissions(task_id);
create index if not exists task_submissions_status_idx on public.task_submissions(status);
create index if not exists reward_points_student_idx on public.reward_points(student_id);
create index if not exists student_badges_student_idx on public.student_badges(student_id);
create index if not exists projects_student_idx on public.projects(student_id);
create index if not exists projects_public_status_idx on public.projects(is_public, status);
create index if not exists booking_requests_status_idx on public.booking_requests(status);
create index if not exists booking_requests_created_at_idx on public.booking_requests(created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_courses_updated_at on public.courses;
create trigger set_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

drop trigger if exists set_lessons_updated_at on public.lessons;
create trigger set_lessons_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

drop trigger if exists set_lesson_progress_updated_at on public.lesson_progress;
create trigger set_lesson_progress_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_badges_updated_at on public.badges;
create trigger set_badges_updated_at
before update on public.badges
for each row execute function public.set_updated_at();

drop trigger if exists set_booking_requests_updated_at on public.booking_requests;
create trigger set_booking_requests_updated_at
before update on public.booking_requests
for each row execute function public.set_updated_at();
