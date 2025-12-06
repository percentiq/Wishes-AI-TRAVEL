import { createClient } from '@supabase/supabase-js';

// Configuration from your project
const supabaseUrl = 'https://vctdqmnsydlcxzyqbvrd.supabase.co';
// WARNING: Using the Publishable Key as requested.
// In a real production app, ensure this is the ANON key, not the SERVICE_ROLE key.
const supabaseKey = 'sb_publishable_LvCwORdVYuy8mVuXM01aRQ_E8o83QSb';

export const supabase = createClient(supabaseUrl, supabaseKey);