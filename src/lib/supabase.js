import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project URL and anon key

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	console.error('Supabase env variables missing:', {
		VITE_SUPABASE_URL: SUPABASE_URL,
		VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY
	});
} else {
	console.log('Supabase env loaded:', {
		VITE_SUPABASE_URL: SUPABASE_URL,
		VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY
	});
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
