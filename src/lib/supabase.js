import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vntescsrshpurwrrgtil.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudGVzY3Nyc2hwdXJ3cnJndGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTg5MDIsImV4cCI6MjA5MzQ5NDkwMn0.Wis_se-2bm8hJhyTo4Sh8yHGj-o6SpTMb4X5Bb-TIZE";

export const supabase = createClient(supabaseUrl, supabaseKey);