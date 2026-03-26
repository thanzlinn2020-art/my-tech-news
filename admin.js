// admin.js
const SUPABASE_URL = 'https://tlmzcasltbihfbnupguq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbXpjYXNsdGJpaGZibnVwZ3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQ5NTEsImV4cCI6MjA4OTk1MDk1MX0.ImMh9EDzX4TyKf0zxLLTcr8xcvtF3eUvPwhki2EOC3Q';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_PASSWORD = 'admin123'; 
if (prompt('Password:') !== ADMIN_PASSWORD) { document.body.innerHTML = 'Denied'; }
// admin.js ထဲမှာ ထည့်ရန်
async function fetchMetadata() {
    const url = document.getElementById('newsLink').value;
    if (!url) return alert("Link အရင်ထည့်ပါ");

    // Link Preview API (Free Tier သုံးထားပါတယ်)
    const apiKey = '56d367468686e065759714856037a1a4'; // ဒီ Key ကို သုံးနိုင်ပါတယ်
    
    try {
        const response = await fetch(`https://api.linkpreview.net/?key=${apiKey}&q=${url}`);
        const data = await response.json();

        if (data.title) {
            document.getElementById('title').value = data.title;
            document.getElementById('summary').value = data.description;
            // ပုံပါ ပါလာရင် image_url column ထဲ ထည့်ဖို့ (ရှိခဲ့လျှင်)
            // document.getElementById('image_url').value = data.image; 
            alert("အချက်အလက်များ ရရှိပါပြီ။ လိုအပ်တာ ပြင်ပြီး သိမ်းဆည်းနိုင်ပါတယ်။");
        }
    } catch (error) {
        console.error("Error fetching metadata:", error);
        alert("အချက်အလက်ဆွဲယူလို့မရပါ။ ကိုယ်တိုင်ဖြည့်စွက်ပေးပါ။");
    }
}
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
        // admin.js ထဲက saveNews function ကို ပြင်ရန်
const newsData = {
    title: document.getElementById('title').value,
    summary: document.getElementById('summary').value,
    reliability: document.getElementById('reliability').value,
    category: document.getElementById('category').value // ဒီစာကြောင်း အသစ်ထည့်ပါ
};

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

