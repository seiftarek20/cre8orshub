-- Cre8ors Hub Supabase storage buckets and policies
-- Run this after policies.sql.

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('course-assets', 'course-assets', true),
  ('project-files', 'project-files', false),
  ('submission-files', 'submission-files', false)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public reads avatars" on storage.objects;
create policy "Public reads avatars"
on storage.objects for select
using (bucket_id = 'avatars');

drop policy if exists "Users upload own avatars" on storage.objects;
create policy "Users upload own avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users update own avatars" on storage.objects;
create policy "Users update own avatars"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Public reads course assets" on storage.objects;
create policy "Public reads course assets"
on storage.objects for select
using (bucket_id = 'course-assets');

drop policy if exists "Staff manages course assets" on storage.objects;
create policy "Staff manages course assets"
on storage.objects for all
using (bucket_id = 'course-assets' and public.is_staff())
with check (bucket_id = 'course-assets' and public.is_staff());

drop policy if exists "Users read own project files" on storage.objects;
create policy "Users read own project files"
on storage.objects for select
using (
  bucket_id = 'project-files'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_staff()
  )
);

drop policy if exists "Users upload own project files" on storage.objects;
create policy "Users upload own project files"
on storage.objects for insert
with check (
  bucket_id = 'project-files'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users update own project files" on storage.objects;
create policy "Users update own project files"
on storage.objects for update
using (
  bucket_id = 'project-files'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'project-files'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users read own submission files" on storage.objects;
create policy "Users read own submission files"
on storage.objects for select
using (
  bucket_id = 'submission-files'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or public.is_staff()
  )
);

drop policy if exists "Users upload own submission files" on storage.objects;
create policy "Users upload own submission files"
on storage.objects for insert
with check (
  bucket_id = 'submission-files'
  and auth.uid()::text = (storage.foldername(name))[1]
);
