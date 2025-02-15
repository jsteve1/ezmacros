import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://atyfcanlzrnlpxaleahz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0eWZjYW5senJubHB4YWxlYWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MzA1NzUsImV4cCI6MjA1NTAwNjU3NX0.gPCYdW0wcPCvF5ujMC-p8mNCiUlsA7V3nqEIIZ0Hwjg';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey); 