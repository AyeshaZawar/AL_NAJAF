# Supabase Setup

1. Create a Supabase project at https://app.supabase.com.

2. In the SQL editor, run `database.sql`, then run `supabase_sql/profiles_and_rls.sql`. The second script creates the `profiles` and `app_settings` tables and their RLS policies required for admin signup and the admin panel.

3. In the Project Settings → API, copy `URL` and `anon` key. Add them to your Vercel environment variables as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

4. (Optional) Create an admin user in Supabase Auth via the UI, and set a secure password. Only admin users should be granted access.

5. In Supabase → Authentication → Settings → Enable email/password provider.

Security notes:
- Never expose the service_role key to the frontend. Use only `anon` key in the browser.
- Optionally, restrict the `contact_submissions` table RLS to allow inserts from unauthenticated users if desired, or allow anon inserts and only allow selects/deletes for authenticated admins.
