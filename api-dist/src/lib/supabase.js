import { createClient as createSupabaseClient } from '@supabase/supabase-js';
export const createClient = (url, key) => {
    return createSupabaseClient(url, key);
};
