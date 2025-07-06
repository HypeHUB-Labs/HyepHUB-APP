import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://loikkjwyzbeeinbasvnq.supabase.co';
const supabaseAnonKey = 'Add Yours Key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
