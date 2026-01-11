import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_KEY in .env file.');
}

// Create client with service role key for backend operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create client with anon key for authentication
const supabaseAnon = createClient(supabaseUrl, supabaseKey);

console.log('[Supabase] Initialized successfully');

export { supabase, supabaseAnon };
