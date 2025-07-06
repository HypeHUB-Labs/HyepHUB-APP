import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://loikkjwyzbeeinbasvnq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvaWtrand5emJlZWluYmFzdm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTgwNTMsImV4cCI6MjA2NTMzNDA1M30.vPnwJkD2U2pO-x7d2VGtvWjmSN4yOrvTjHIKkKxPZvE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);