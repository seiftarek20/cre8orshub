-- Cre8ors Hub Supabase RLS policies
-- Run this after schema.sql.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.is_instructor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'instructor'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'instructor')
  );
$$;

create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role and not public.is_admin() then
    raise exception 'Only admins can change profile roles.';
  end if;

  return new;
end;
$$;

create or replace function public.is_enrolled(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.enrollments
    where student_id = auth.uid()
      and course_id = target_course_id
      and status in ('active', 'completed')
  );
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.tasks enable row level security;
alter table public.task_submissions enable row level security;
alter table public.reward_points enable row level security;
alter table public.badges enable row level security;
alter table public.student_badges enable row level security;
alter table public.projects enable row level security;
alter table public.booking_requests enable row level security;

drop trigger if exists prevent_profile_role_change on public.profiles;
create trigger prevent_profile_role_change
before update on public.profiles
for each row execute function public.prevent_profile_role_change();

drop policy if exists "Profiles are readable by owner or staff" on public.profiles;
create policy "Profiles are readable by owner or staff"
on public.profiles for select
using (id = auth.uid() or public.is_staff());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public reads published courses" on public.courses;
create policy "Public reads published courses"
on public.courses for select
using (is_published = true or public.is_staff());

drop policy if exists "Admins manage courses" on public.courses;
create policy "Admins manage courses"
on public.courses for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Students read enrolled published lessons" on public.lessons;
create policy "Students read enrolled published lessons"
on public.lessons for select
using (is_published = true and (public.is_staff() or public.is_enrolled(course_id)));

drop policy if exists "Admins manage lessons" on public.lessons;
create policy "Admins manage lessons"
on public.lessons for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Students read own enrollments" on public.enrollments;
create policy "Students read own enrollments"
on public.enrollments for select
using (student_id = auth.uid() or public.is_staff());

drop policy if exists "Staff manage enrollments" on public.enrollments;
create policy "Staff manage enrollments"
on public.enrollments for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Students read own lesson progress" on public.lesson_progress;
create policy "Students read own lesson progress"
on public.lesson_progress for select
using (student_id = auth.uid() or public.is_staff());

drop policy if exists "Students manage own lesson progress" on public.lesson_progress;
create policy "Students manage own lesson progress"
on public.lesson_progress for insert
with check (student_id = auth.uid() and public.is_enrolled(course_id));

drop policy if exists "Students update own lesson progress" on public.lesson_progress;
create policy "Students update own lesson progress"
on public.lesson_progress for update
using (student_id = auth.uid())
with check (student_id = auth.uid());

drop policy if exists "Staff manage lesson progress" on public.lesson_progress;
create policy "Staff manage lesson progress"
on public.lesson_progress for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Enrolled students read published tasks" on public.tasks;
create policy "Enrolled students read published tasks"
on public.tasks for select
using (is_published = true and (public.is_staff() or public.is_enrolled(course_id)));

drop policy if exists "Admins manage tasks" on public.tasks;
create policy "Admins manage tasks"
on public.tasks for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Students read own task submissions" on public.task_submissions;
create policy "Students read own task submissions"
on public.task_submissions for select
using (student_id = auth.uid() or public.is_staff());

drop policy if exists "Students create own task submissions" on public.task_submissions;
create policy "Students create own task submissions"
on public.task_submissions for insert
with check (student_id = auth.uid());

drop policy if exists "Students update own submitted task submissions" on public.task_submissions;
create policy "Students update own submitted task submissions"
on public.task_submissions for update
using (student_id = auth.uid() and status in ('submitted', 'needs_revision'))
with check (student_id = auth.uid());

drop policy if exists "Staff review task submissions" on public.task_submissions;
create policy "Staff review task submissions"
on public.task_submissions for update
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Students read own reward points" on public.reward_points;
create policy "Students read own reward points"
on public.reward_points for select
using (student_id = auth.uid() or public.is_staff());

drop policy if exists "Staff award reward points" on public.reward_points;
create policy "Staff award reward points"
on public.reward_points for insert
with check (public.is_staff());

drop policy if exists "Badges are readable by authenticated users" on public.badges;
create policy "Badges are readable by authenticated users"
on public.badges for select
to authenticated
using (true);

drop policy if exists "Admins manage badges" on public.badges;
create policy "Admins manage badges"
on public.badges for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Students read own badges" on public.student_badges;
create policy "Students read own badges"
on public.student_badges for select
using (student_id = auth.uid() or public.is_staff());

drop policy if exists "Staff award badges" on public.student_badges;
create policy "Staff award badges"
on public.student_badges for insert
with check (public.is_staff());

drop policy if exists "Public reads showcased projects" on public.projects;
create policy "Public reads showcased projects"
on public.projects for select
using (is_public = true or student_id = auth.uid() or public.is_staff());

drop policy if exists "Students create own projects" on public.projects;
create policy "Students create own projects"
on public.projects for insert
with check (student_id = auth.uid());

drop policy if exists "Students update own projects" on public.projects;
create policy "Students update own projects"
on public.projects for update
using (student_id = auth.uid())
with check (student_id = auth.uid());

drop policy if exists "Staff manage projects" on public.projects;
create policy "Staff manage projects"
on public.projects for all
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "Anyone creates booking requests" on public.booking_requests;
create policy "Anyone creates booking requests"
on public.booking_requests for insert
with check (true);

drop policy if exists "Staff reads booking requests" on public.booking_requests;
create policy "Staff reads booking requests"
on public.booking_requests for select
using (public.is_staff());

drop policy if exists "Staff updates booking requests" on public.booking_requests;
create policy "Staff updates booking requests"
on public.booking_requests for update
using (public.is_staff())
with check (public.is_staff());
