import { createClient } from "@supabase/supabase-js";
const supabaseUrl = void 0;
const supabaseAnonKey = void 0;
{
  console.warn("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables");
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export {
  supabase as s
};
