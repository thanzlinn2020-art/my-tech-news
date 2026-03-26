const SUPABASE_URL = 'https://tlmzcasltbihfbnupguq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbXpjYXNsdGJpaGZibnVwZ3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQ5NTEsImV4cCI6MjA4OTk1MDk1MX0.ImMh9EDzX4TyKf0zxLLTcr8xcvtF3eUvPwhki2EOC3Q'; // KEY သေချာစစ်ပါ
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_PASSWORD = 'admin123'; 
if (prompt('Password:') !== ADMIN_PASSWORD) { 
    document.body.innerHTML = '<h1 style="text-align:center; margin-top:50px;">Access Denied</h1>'; 
}

// သတင်းလင့်ခ်မှ အချက်အလက်များ ဆွဲယူခြင်း
async function fetchMetadata() {
    const urlInput = document.getElementById('newsLink');
    const url = urlInput.value.trim();
    
    if (!url) return alert("Link အရင်ထည့်ပါ");

    const fetchBtn = document.querySelector('button[onclick="fetchMetadata()"]');
    fetchBtn.innerText = "Loading...";
    fetchBtn.disabled = true;

    try {
        // LinkPreview API (Free Tier)
        const response = await fetch(`https://api.linkpreview.net/?key=56d367468686e065759714856037a1a4&q=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.title) {
            document.getElementById('title').value = data.title;
            document.getElementById('summary').value = data.description || "";
            alert("အချက်အလက်များ ရရှိပါပြီ!");
        } else {
            alert("အချက်အလက် ဆွဲယူ၍မရပါ။ ကိုယ်တိုင်ဖြည့်စွက်ပါ။");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("API Error ဖြစ်နေပါသည်။ ကိုယ်တိုင်ဖြည့်စွက်ပေးပါ။");
    } finally {
        fetchBtn.innerText = "Fetch";
        fetchBtn.disabled = false;
    }
}

// သတင်းတင်ရန် Function
async function saveNews() {
    const title = document.getElementById('title').value;
    const summary = document.getElementById('summary').value;
    const category = document.getElementById('category').value;
    const reliability = document.getElementById('reliability').value;

    if (!title || !summary) return alert("ခေါင်းစဉ်နှင့် အကျဉ်းချုပ် ဖြည့်ပါ");

    const { error } = await _supabase
        .from('news')
        .insert([{ title, summary, category, reliability }]);

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("✅ သတင်းတင်ပြီးပါပြီ");
        location.reload();
    }
}

// သတင်းစာရင်းပြရန်
async function loadAdminNews() {
    const { data } = await _supabase.from('news').select('*').order('created_at', { ascending: false });
    const tbody = document.getElementById('newsListBody');
    if (data) {
        tbody.innerHTML = data.map(n => `
            <tr>
                <td>${n.title}</td>
                <td>
                    <button onclick="deleteNews(${n.id})" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:4px;">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

async function deleteNews(id) {
    if (confirm('ဖျက်မှာလား?')) {
        await _supabase.from('news').delete().eq('id', id);
        loadAdminNews();
    }
}

window.onload = loadAdminNews;
