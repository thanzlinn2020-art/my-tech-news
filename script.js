// script.js
const SUPABASE_URL = 'https://tlmzcasltbihfbnupguq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbXpjYXNsdGJpaGZibnVwZ3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQ5NTEsImV4cCI6MjA4OTk1MDk1MX0.ImMh9EDzX4TyKf0zxLLTcr8xcvtF3eUvPwhki2EOC3Q';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const initialNewsData = [
    { title: "📶 5G ကွန်ရက် စတင်အသုံးပြုနိုင်ပြီ", summary: "မြန်မာနိုင်ငံတွင် 5G ကွန်ရက်ကို စတင်အသုံးပြုနိုင်ပြီဖြစ်ပါသည်။", reliability: "high" }
];

async function loadNews() {
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Error:', error);
        renderNews(initialNewsData);
    } else {
        renderNews(data);
    }
}
// script.js ထဲမှာ ထည့်ရန်
let allNewsData = []; // သတင်းအားလုံးကို ခေတ္တသိမ်းထားရန်

async function loadNews() {
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (data) {
        allNewsData = data; // Data တွေကို variable ထဲသိမ်း
        renderNews(data);
    }
}

function filterByCategory(cat) {
    if (cat === 'အားလုံး') {
        renderNews(allNewsData);
    } else {
        const filtered = allNewsData.filter(item => item.category === cat);
        renderNews(filtered);
    }
}

// renderNews ထဲမှာ Category Badge လေးပြအောင် ပြင်ပါ
// ${news.category} ကို Card template ထဲမှာ ထည့်လိုက်ပါ
function renderNews(newsArray) {
    const container = document.getElementById('searchResults');
    if (newsArray.length === 0) {
        container.innerHTML = '<p>သတင်းမရှိသေးပါ။</p>';
        return;
    }
    container.innerHTML = newsArray.map(news => `
        <div class="result-card">
            <h3>${news.title}</h3>
            <p style="color:#475569; margin: 10px 0;">${news.summary}</p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="reliability-badge ${news.reliability}">${news.reliability.toUpperCase()}</span>
                <small>${news.source || 'Tech News'}</small>
            </div>
        </div>
    `).join('');
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.result-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(term) ? 'block' : 'none';
    });
});

window.onload = loadNews;
