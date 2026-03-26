// script.js
const SUPABASE_URL = 'https://tlmzcasltbihfbnupguq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbXpjYXNsdGJpaGZibnVwZ3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQ5NTEsImV4cCI6MjA4OTk1MDk1MX0.ImMh9EDzX4TyKf0zxLLTcr8xcvtF3eUvPwhki2EOC3Q'; // သင့် Key အရှည်ကြီးကို ဒီမှာ အပြည့်အစုံ ပြန်ထည့်ပေးပါ

// နာမည်ကို _supabase လို့ ပြောင်းလိုက်ပါ (ထပ်နေတဲ့ error ပျောက်အောင်)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const initialNewsData = [
  {
    title: "📶 5G ကွန်ရက် စတင်အသုံးပြုနိုင်ပြီ",
    summary: "မြန်မာနိုင်ငံတွင် 5G ကွန်ရက်ကို စတင်အသုံးပြုနိုင်ပြီဖြစ်ပါသည်။",
    reliability: "high"
  }
];

let allNewsData = []; // သတင်းအားလုံး သိမ်းရန်

// Function ကို တစ်ခါပဲ ရေးရပါမယ်
async function loadNews() {
  const { data, error } = await _supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading news:', error);
    renderNews(initialNewsData);
  } else {
    allNewsData = data; // Data တွေကို သိမ်းထားမယ်
    renderNews(data);
  }
}

function renderNews(newsArray) {
  const container = document.getElementById('searchResults');
  if (!container) return;

  if (newsArray.length === 0) {
    container.innerHTML = '<p>သတင်းမရှိသေးပါ။</p>';
    return;
  }

  container.innerHTML = newsArray.map(news => `
    <div class="result-card">
      <h3>${news.title}</h3>
      <p style="color:#475569; margin: 10px 0;">${news.summary}</p>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="reliability-badge ${news.reliability || 'high'}">${(news.reliability || 'high').toUpperCase()}</span>
        <small>${news.category || 'အထွေထွေ'}</small>
      </div>
    </div>
  `).join('');
}

// Category filter အတွက် function
function filterByCategory(cat) {
    if (cat === 'အားလုံး') {
        renderNews(allNewsData);
    } else {
        const filtered = allNewsData.filter(item => item.category === cat);
        renderNews(filtered);
    }
}

// Page စဖွင့်တာနဲ့ သတင်းဆွဲတင်ရန်
window.onload = loadNews;
