const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  const { data, error } = await supabase.from('login_history').select('*').limit(1);
  if (error) {
    console.error('Koneksi gagal:', error.message);
  } else {
    console.log('Koneksi berhasil! Data:', data);
  }
}

testConnection();