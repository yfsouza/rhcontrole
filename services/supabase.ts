import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rewzaparcgvthweczxhm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJld3phcGFyY2d2dGh3ZWN6eGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTg0NjMsImV4cCI6MjA3OTU5NDQ2M30.NHG7J894B-X7W5TfrqD-VWOiUMfWhsEnByZs7u-DN5w';

export const supabase = createClient(supabaseUrl, supabaseKey);
