const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin authentication
async function checkAdminAuth() {
  // Simple password protection (for demo)
  const password = prompt('Admin Password ထည့်ပါ:');
  if (password !== 'admin123') {
    alert('Password မှားနေပါသည်');
    document.body.innerHTML = '<h1>Access Denied</h1>';
    return false;
  }
  return true;
}

if (!checkAdminAuth()) {
  throw new Error('Unauthorized');
}
