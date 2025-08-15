import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data, error } = await supabase
    .from('login_history')
    .select('username, nama, email, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) {
    return new Response(JSON.stringify([]), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
} 