-- Cre8ors Hub starter seed data
-- Run this after storage.sql.

insert into public.courses (
  slug,
  title,
  arabic_title,
  subtitle,
  description,
  duration,
  level,
  cover_image_url,
  is_published,
  sort_order
)
values
  (
    'video-editing',
    'Video Editing',
    'مونتاج الفيديو',
    'Learn the rhythm behind every great edit.',
    'A practical editing path for story, pacing, sound, color, and portfolio-ready social edits.',
    '8 Weeks',
    'Beginner to Intermediate',
    '/images/video_editing_course.png',
    true,
    1
  ),
  (
    'motion-graphics',
    'Motion Graphics',
    'موشن جرافيك',
    'Motion that feels alive.',
    'A premium motion path covering After Effects foundations, animation principles, typography, transitions, AI workflow, and a final project.',
    '10 Weeks',
    'Beginner to Advanced',
    '/images/motion_graphic_course.png',
    true,
    2
  ),
  (
    'graphic-design',
    'Graphic Design',
    'جرافيك ديزاين',
    'Design with intention, not decoration.',
    'A structured design path focused on layout, typography, color, brand systems, and portfolio presentation.',
    '9 Weeks',
    'Beginner to Intermediate',
    '/images/graphic_design_course.png',
    true,
    3
  ),
  (
    'ai-video-making',
    'AI Video Making',
    'صناعة الفيديو بالذكاء الاصطناعي',
    'Your ideas deserve better execution.',
    'A creator-focused AI video workflow for prompts, visual direction, image-to-video, sound, editing, and a final AI video project.',
    '6 Weeks',
    'Beginner',
    '/images/AI_course.png',
    true,
    4
  )
on conflict (slug) do update
set
  title = excluded.title,
  arabic_title = excluded.arabic_title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  duration = excluded.duration,
  level = excluded.level,
  cover_image_url = excluded.cover_image_url,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;

insert into public.lessons (course_id, title, description, duration_minutes, sort_order, is_published)
select id, 'Course Orientation', 'Understand the course path, expectations, and project outcome.', 20, 1, true
from public.courses
where slug in ('video-editing', 'motion-graphics', 'graphic-design', 'ai-video-making')
on conflict (course_id, sort_order) do update
set
  title = excluded.title,
  description = excluded.description,
  duration_minutes = excluded.duration_minutes,
  is_published = excluded.is_published;

insert into public.tasks (course_id, title, description, requirements, points, due_days_after_enrollment, is_published)
select
  id,
  'Starter Creative Brief',
  'Submit a short creative brief that describes your taste, references, and first project direction.',
  '["Write your project idea", "Add 2-3 visual references", "Explain what you want to improve"]'::jsonb,
  50,
  7,
  true
from public.courses
where slug in ('video-editing', 'motion-graphics', 'graphic-design', 'ai-video-making')
and not exists (
  select 1
  from public.tasks
  where tasks.course_id = courses.id
    and tasks.title = 'Starter Creative Brief'
);

insert into public.badges (title, description, criteria, points_required)
values
  ('First Step', 'Awarded when a student completes their first lesson.', 'Complete one lesson.', 10),
  ('Brief Builder', 'Awarded when a student submits their first creative brief.', 'Submit the starter creative brief.', 50),
  ('Consistent Creator', 'Awarded for steady weekly progress.', 'Complete learning activity across multiple weeks.', 150),
  ('Portfolio Ready', 'Awarded when a student finishes a polished project.', 'Submit and approve a final project.', 300)
on conflict (title) do update
set
  description = excluded.description,
  criteria = excluded.criteria,
  points_required = excluded.points_required;
