import { createClient } from '@supabase/supabase-js';

const sanitize = (v) =>
  String(v || '')
    .trim()
    .replace(/^`+|`+$/g, '')
    .replace(/^"+|"+$/g, '')
    .replace(/^'+|'+$/g, '');

const SUPABASE_URL = sanitize(import.meta.env.VITE_SUPABASE_URL);
const SUPABASE_ANON_KEY = sanitize(import.meta.env.VITE_SUPABASE_ANON_KEY);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase env variables missing');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
