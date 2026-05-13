# Cre8ors Hub Supabase Setup

These files prepare the Supabase backend for Cre8ors Hub. They do not connect the current frontend pages to Supabase yet.

## Manual Setup Order

Run the files in this order inside the Supabase SQL editor:

1. `schema.sql`
2. `policies.sql`
3. `storage.sql`
4. `seed.sql`

## Environment Variables

After the Supabase project is created, add these locally and in Vercel:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## First Admin User

1. Enable email/password auth in Supabase.
2. Sign up with the first admin email when auth UI exists.
3. In Supabase, update that user's profile:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## Notes

- `schema.sql` creates tables, constraints, indexes, and `updated_at` triggers.
- `policies.sql` enables RLS and adds practical student, instructor, and admin policies.
- `storage.sql` creates the storage buckets and storage object policies.
- `seed.sql` adds starter courses, one orientation lesson per course, starter tasks, and basic badges.
- Do not run these files against production without reviewing them for your exact launch data.
