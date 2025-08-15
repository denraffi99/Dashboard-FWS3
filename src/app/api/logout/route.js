export async function POST() {
  // Tidak ada session server-side, logout cukup di client (hapus localStorage/sessionStorage)
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 