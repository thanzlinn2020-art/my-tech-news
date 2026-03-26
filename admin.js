// admin.js
const SUPABASE_URL = 'https://tlmzcasltbihfbnupguq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbXpjYXNsdGJpaGZibnVwZ3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQ5NTEsImV4cCI6MjA4OTk1MDk1MX0.ImMh9EDzX4TyKf0zxLLTcr8xcvtF3eUvPwhki2EOC3Q';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_PASSWORD = 'admin123'; 
if (prompt('Password:') !== ADMIN_PASSWORD) { document.body.innerHTML = 'Denied'; }
// admin.js ထဲမှာ ထည့်ရန်
async function fetchMetadata() {
    const urlInput = document.getElementById('newsLink');
    const url = urlInput.value.trim();
    
    if (!url) return alert("Link အရင်ထည့်ပါ");

    // Fetch Button ကို ခဏပိတ်ထားမယ် (Loading ပြချင်လို့)
    const fetchBtn = document.querySelector('button[onclick="fetchMetadata()"]');
    fetchBtn.innerText = "Loading...";
    fetchBtn.disabled = true;

    // အခမဲ့သုံးလို့ရတဲ့ တခြား API တစ်ခုနဲ့ စမ်းကြည့်မယ်
    try {
        const response = await fetch(`https://api.peekalink.io/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '67b3f94c-8367-4686-9a2f-e06575971485' // Key လဲထားပါတယ်
            },
            body: JSON.stringify({ link: url })
        });

        // အကယ်၍ အပေါ်က API အလုပ်မလုပ်ရင် နောက်တစ်နည်း (Linkpreview.net) နဲ့ ပြန်စမ်းမယ်
        if (!response.ok) {
            const backupRes = await fetch(`https://api.linkpreview.net/?key=56d367468686e065759714856037a1a4&q=${encodeURIComponent(url)}`);
            const data = await backupRes.json();
            fillForm(data);
        } else {
            const data = await response.json();
            fillForm(data);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("အချက်အလက် ဆွဲယူလို့မရပါ။ ကိုယ်တိုင် ဖြည့်စွက်ပေးပါ။");
    } finally {
        fetchBtn.innerText = "Fetch";
        fetchBtn.disabled = false;
    }
}

// Form ထဲမှာ အချက်အလက် ဖြည့်ပေးတဲ့ function
function fillForm(data) {
    if (data.title) {
        document.getElementById('title').value = data.title;
        document.getElementById('summary').value = data.description || "";
        // ပုံလင့်ခ် ရှိရင် သိမ်းထားဖို့ (image_url input ရှိလျှင်)
        if(document.getElementById('image_url')) {
            document.getElementById('image_url').value = data.image || data.url;
        }
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

