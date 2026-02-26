import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function main() {
    const { data, error } = await supabase.from('announcements').select('*');
    console.log('All announcements:', data);
    
    const { data: data2, error: error2 } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .neq('is_deleted', true);
    console.log('Filtered announcements:', data2);
}
main();
