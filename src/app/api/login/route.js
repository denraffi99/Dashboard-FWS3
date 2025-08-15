import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return new Response(JSON.stringify({ success: false, message: 'Username dan password wajib diisi' }), { status: 400 });
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Cek admin
  let { data: adminRows, error: adminError } = await supabase
    .from('admin')
    .select('id, username_admin, password_admin, nama_admin, email_admin')
    .eq('username_admin', username)
    .limit(1);
  if (adminError) {
    console.error('Supabase admin error:', adminError);
  }

  let role = null;
  let principal = null;
  let dbPassword = '';
  if (adminRows && adminRows.length > 0) {
    role = 'admin';
    principal = adminRows[0];
    dbPassword = principal.password_admin ? String(principal.password_admin).trim() : '';
  } else {
    // Cek user
    let { data: userRows, error: userError } = await supabase
      .from('user')
      .select('id, username, password_user, nama_user, email_user')
      .eq('username', username)
      .limit(1);
    if (userError) {
      console.error('Supabase user error:', userError);
    }
    if (userRows && userRows.length > 0) {
      role = 'user';
      principal = userRows[0];
      dbPassword = principal.password_user ? String(principal.password_user).trim() : '';
    }
  }

  // DEBUG LOG
  console.log({
    username,
    role,
    principal,
    dbPassword,
    inputPassword: password,
    isMatch: dbPassword === password,
  });

  const isMatch = dbPassword === password;
  const status = isMatch ? 'SUCCESS' : 'FAILED';
  const userId = principal ? principal.id : null;
  const nama = role === 'admin' ? (principal?.nama_admin || principal?.username_admin) : principal?.nama_user;
  const email = role === 'admin' ? (principal?.email_admin || null) : principal?.email_user;

  // Catat history login ke Supabase
  if (userId && username) {
    await supabase.from('login_history').insert([
      {
        username,
        nama,
        email,
        status,
        created_at: new Date().toISOString(),
      },
    ]);
  }

  if (!isMatch || !role) {
    return new Response(JSON.stringify({ success: false, message: 'Username atau password salah' }), { status: 401 });
  }

  return new Response(JSON.stringify({ success: true, user: { id: userId, username, role, nama, email } }), { status: 200 });
} 