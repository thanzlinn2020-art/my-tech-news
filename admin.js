// admin.js
const SUPABASE_URL = 'https://tlmzcasltbihfbnupguq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbXpjYXNsdGJpaGZibnVwZ3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQ5NTEsImV4cCI6MjA4OTk1MDk1MX0.ImMh9EDzX4TyKf0zxLLTcr8xcvtF3eUvPwhki2EOC3Q';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_PASSWORD = 'admin123'; 
if (prompt('Password:') !== ADMIN_PASSWORD) { document.body.innerHTML = 'Denied'; }

async function loadAdminNews() {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    const tbody = document.getElementById('newsListBody');
    tbody.innerHTML = data.map(n => `
        <tr>
            <td>${n.title}</td>
            <td>
                <button onclick="editNews(${n.id})" style="background:#f59e0b; color:white;">Edit</button>
                <button onclick="deleteNews(${n.id})" style="background:#ef4444; color:white;">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function saveNews() {
    const id = document.getElementById('newsId').value;
    const newsData = {
        title: document.getElementById('title').value,
        summary: document.getElementById('summary').value,
        reliability: document.getElementById('reliability').value
    };

    if (id) {
        await supabase.from('news').update(newsData).eq('id', id);
    } else {
        await supabase.from('news').insert([newsData]);
    }
    location.reload();
}

async function deleteNews(id) {
    if (confirm('ဖျက်မှာလား?')) {
        await supabase.from('news').delete().eq('id', id);
        loadAdminNews();
    }
}

window.onload = loadAdminNews;

