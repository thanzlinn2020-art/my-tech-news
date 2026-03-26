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
        // နည်းလမ်း (၁) - LinkPreview API ကို သုံးကြည့်မယ်
        const response = await fetch(`https://api.linkpreview.net/?key=56d367468686e065759714856037a1a4&q=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
            // နည်းလမ်း (၂) - ပထမနည်းလမ်း အလုပ်မလုပ်ရင် OpenGraph Proxy တစ်ခုနဲ့ စမ်းမယ်
            const ogRes = await fetch(`https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=56d367468686e065759714856037a1a4`);
            const ogData = await ogRes.json();
            
            if (ogData.hybridGraph && ogData.hybridGraph.title) {
                document.getElementById('title').value = ogData.hybridGraph.title;
                document.getElementById('summary').value = ogData.hybridGraph.description || "";
                alert("✅ အချက်အလက်များ ရရှိပါပြီ (Backup Server)");
            } else {
                throw new Error("Failed to fetch");
            }
        } else {
            const data = await response.json();
            document.getElementById('title').value = data.title;
            document.getElementById('summary').value = data.description || "";
            alert("✅ အချက်အလက်များ ရရှိပါပြီ");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("⚠️ Link မှ အချက်အလက် ဆွဲယူမရပါ။ ဝက်ဘ်ဆိုက်မှ ပိတ်ထားခြင်း ဖြစ်နိုင်သဖြင့် ကိုယ်တိုင် ဖြည့်စွက်ပေးပါ။");
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

    // လက်သည်းကွင်း [ ] ကို သေချာကြည့်ပါ
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
