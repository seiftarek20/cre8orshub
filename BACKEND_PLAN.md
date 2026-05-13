# Cre8ors Hub Backend Plan

Backend target: Supabase.

This plan keeps Cre8ors Hub practical: a premium education platform backend, not an oversized enterprise system. The current React + Vite frontend can stay working while backend features are added in phases.

## 1. Database Tables

### profiles

```text
id uuid primary key references auth.users(id)
full_name text
email text
phone text
avatar_url text
role text default 'student'
bio text
created_at timestamptz
updated_at timestamptz
```

### courses

```text
id uuid primary key
slug text unique
title text
arabic_title text
subtitle text
description text
duration text
level text
cover_image_url text
is_published boolean default false
sort_order int
created_at timestamptz
updated_at timestamptz
```

### lessons

```text
id uuid primary key
course_id uuid references courses(id)
title text
description text
video_url text
duration_minutes int
sort_order int
is_published boolean default false
created_at timestamptz
updated_at timestamptz
```

### enrollments

```text
id uuid primary key
student_id uuid references profiles(id)
course_id uuid references courses(id)
status text -- active, paused, completed
enrolled_at timestamptz
completed_at timestamptz
```

### lesson_progress

```text
id uuid primary key
student_id uuid references profiles(id)
course_id uuid references courses(id)
lesson_id uuid references lessons(id)
status text -- not_started, in_progress, completed
progress_percent int
completed_at timestamptz
updated_at timestamptz
```

### tasks

```text
id uuid primary key
course_id uuid references courses(id)
lesson_id uuid references lessons(id) nullable
title text
description text
requirements jsonb
points int
due_days_after_enrollment int
is_published boolean default false
created_at timestamptz
```

### task_submissions

```text
id uuid primary key
task_id uuid references tasks(id)
student_id uuid references profiles(id)
project_id uuid references projects(id) nullable
submission_text text
file_url text
status text -- submitted, reviewed, approved, needs_revision
feedback text
score int
reviewed_by uuid references profiles(id)
submitted_at timestamptz
reviewed_at timestamptz
```

### reward_points

```text
id uuid primary key
student_id uuid references profiles(id)
source_type text -- lesson, task, project, manual
source_id uuid nullable
points int
note text
created_at timestamptz
```

### badges

```text
id uuid primary key
title text
description text
icon_url text
criteria text
points_required int nullable
created_at timestamptz
```

### student_badges

```text
id uuid primary key
student_id uuid references profiles(id)
badge_id uuid references badges(id)
awarded_by uuid references profiles(id) nullable
awarded_at timestamptz
```

### projects

```text
id uuid primary key
student_id uuid references profiles(id)
course_id uuid references courses(id) nullable
title text
description text
cover_url text
project_url text
status text -- draft, submitted, reviewed, showcased
is_public boolean default false
created_at timestamptz
updated_at timestamptz
```

### booking_requests

```text
id uuid primary key
full_name text
email text
phone text
course_slug text nullable
preferred_mode text
message text
status text -- new, contacted, booked, closed
assigned_to uuid references profiles(id) nullable
created_at timestamptz
```

## 2. Relationships

- `auth.users` to `profiles`: one-to-one.
- `profiles` to `enrollments`: one student can enroll in many courses.
- `courses` to `lessons`: one course has many lessons.
- `courses` to `tasks`: one course has many tasks.
- `lessons` to `tasks`: optional lesson-specific tasks.
- `profiles` plus `lessons` to `lesson_progress`.
- `tasks` to `task_submissions`.
- `task_submissions` to `projects`: optional link when a task submission becomes portfolio work.
- `profiles` to `projects`.
- `profiles` to `reward_points`.
- `badges` to `student_badges`.
- `booking_requests` can be created without login.

Optional later table:

```text
course_instructors
id uuid
course_id uuid references courses(id)
instructor_id uuid references profiles(id)
```

## 3. Roles

Use `profiles.role`:

```text
student
instructor
admin
```

Role permissions:

- `student`: view own dashboard, own courses, own progress, own submissions, own projects, and own rewards.
- `instructor`: view assigned course students, review submissions, give feedback, and award points/badges.
- `admin`: manage courses, lessons, tasks, bookings, students, rewards, and dashboard content.

## 4. RLS And Security Plan

Enable Row Level Security on all tables.

- `profiles`: users can read/update their own profile. Admin can read/update all.
- `courses`: public can read published courses. Admin/instructor can manage.
- `lessons`: enrolled students can read published lessons. Admin/instructor can manage.
- `enrollments`: students can read their own. Admin/instructor can create/update.
- `lesson_progress`: students can read/update their own. Admin/instructor can read.
- `tasks`: enrolled students can read published tasks. Admin/instructor can manage.
- `task_submissions`: students can create/read own submissions. Instructor/admin can review/update.
- `reward_points`: students can read own points. Admin/instructor can insert.
- `badges`: authenticated users can read. Admin can manage.
- `student_badges`: students can read own badges. Admin/instructor can award.
- `projects`: students can manage own projects. Public can read only `is_public = true`.
- `booking_requests`: anyone can insert. Only admin/instructor can read/update.

Storage buckets:

```text
avatars
course-assets
project-files
submission-files
```

Bucket security:

- `avatars`: users manage their own folder.
- `course-assets`: admin/instructor upload; public or signed read depending on asset.
- `project-files`: student-owned private uploads.
- `submission-files`: private review files for student plus instructor/admin.

## 5. Implementation Phases

### Phase 1: Foundation

- Supabase client.
- Environment variables.
- Service folders.
- Keep existing static data working.

### Phase 2: Database

- Create schema.
- Add RLS.
- Seed courses, lessons, tasks, and badges.

### Phase 3: Auth

- Signup/login/logout.
- Auth context.
- Protected routes.
- Auto-create profile after signup.

### Phase 4: Dashboard Data

- Replace static dashboard data gradually.
- Load enrollments, progress, tasks, projects, and rewards.

### Phase 5: Courses And Lessons

- Move course/lesson data to Supabase.
- Keep public course pages.
- Lock lesson access to enrolled students.

### Phase 6: Tasks And Submissions

- Student task submission flow.
- Instructor review flow.
- Feedback, score, and status.

### Phase 7: Rewards And Badges

- Award points from lesson/task/project actions.
- Badge assignment.
- Rewards dashboard.

### Phase 8: Projects And Uploads

- Project creation.
- File upload to Supabase Storage.
- Public showcase approval.

### Phase 9: Admin Dashboard

- Manage bookings.
- Manage courses/lessons/tasks.
- Review submissions.
- View student progress.

## 6. Files Created Later

Likely new frontend files:

```text
src/lib/supabaseClient.js
src/context/AuthContext.jsx
src/components/ProtectedRoute.jsx
src/components/RoleRoute.jsx
src/services/authService.js
src/services/profileService.js
src/services/courseService.js
src/services/lessonService.js
src/services/progressService.js
src/services/taskService.js
src/services/rewardService.js
src/services/projectService.js
src/services/bookingService.js
src/pages/Login.jsx
src/pages/Signup.jsx
src/pages/Profile.jsx
src/pages/AdminDashboard.jsx
src/pages/AdminBookings.jsx
src/pages/AdminCourses.jsx
src/pages/AdminSubmissions.jsx
```

Optional SQL files:

```text
supabase/schema.sql
supabase/policies.sql
supabase/seed.sql
```

Likely modified files later:

```text
src/App.jsx
src/components/Navbar.jsx
src/pages/Dashboard.jsx
src/pages/MyCourses.jsx
src/pages/Tasks.jsx
src/pages/Rewards.jsx
src/pages/Projects.jsx
src/pages/Progress.jsx
src/pages/Booking.jsx
.env.example
package.json
```

## 7. Manual Supabase Setup

1. Create a Supabase project.
2. Add environment variables locally and on Vercel:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

3. Enable email/password auth.
4. Configure Auth URLs:
   - Local dev URL.
   - Production Vercel URL.
5. Create database tables.
6. Enable RLS on all tables.
7. Add RLS policies.
8. Create storage buckets:
   - `avatars`
   - `course-assets`
   - `project-files`
   - `submission-files`
9. Create the first admin:
   - Sign up normally.
   - Manually update `profiles.role` to `admin`.
10. Seed initial data:
    - Courses
    - Lessons
    - Tasks
    - Badges
    - Optional instructor profile
