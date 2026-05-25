import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate credentials are non-placeholder values
const isConfigValid = 
  supabaseUrl && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

let supabase: any = null;
let isSupabaseAvailable = false;

if (isConfigValid) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isSupabaseAvailable = true;
    console.log("Supabase client initialized successfully!");
  } catch (error) {
    console.warn("Supabase initialization failed, falling back to Mock Mode:", error);
  }
} else {
  console.log("Supabase credentials missing. Operating in Mock Local Database Mode.");
}

export { supabase, isSupabaseAvailable };
