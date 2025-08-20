import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { data, error } = await supabase
    .from('links')
    .select('id, created_at, nama, link')
    .order('created_at', { ascending: false });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  // Kembalikan dalam format { [nama]: link }
  const result = {};
  data.forEach(row => { result[row.nama] = row.link; });
  return new Response(JSON.stringify(result), { status: 200 });
}

export async function POST(request) {
  const formData = await request.formData();
  const nama = formData.get('title');
  const link = formData.get('link');
  if (!nama || !link) return new Response('Invalid', { status: 400 });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { error } = await supabase
    .from('links')
    .insert([{ nama, link }]);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return GET();
}

export async function DELETE(request) {
  const { title } = await request.json();
  if (!title) return new Response('Invalid', { status: 400 });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('nama', title);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return GET();
} 
