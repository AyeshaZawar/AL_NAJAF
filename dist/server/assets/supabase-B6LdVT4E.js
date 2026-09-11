import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://hkngaublsewywdzefk.supabase.co";
const supabaseAnonKey = "sb_publishable_Hv_FZbvQMuQKadnkxQpttw_Uwma0A6y";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export {
  supabase as s
};
