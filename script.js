// script.js
const SUPABASE_URL = '
https://tlmzcasltbihfbnupguq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbXpjYXNsdGJpaGZibnVwZ3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQ5NTEsImV4cCI6MjA4OTk1MDk1MX0.ImMh9EDzX4TyKf0zxLLTcr8xcvtF3eUvPwhki2EOC3Q';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// သတင်းများကို Database မှ ဆွဲထုတ်သည့် Function
async function loadNews() {
    const { data, error } = await _supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
        return;
    }

    const container = document.getElementById('searchResults');
    if (data.length === 0) {
        container.innerHTML = '<p>သတင်းမရှိသေးပါ။</p>';
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="result-card">
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <div class="result-footer">
                <span class="reliability-badge">${item.reliability}</span>
            </div>
        </div>
    `).join('');
}

// Page စဖွင့်သည်နှင့် Function ကို Run ပါ
window.onload = loadNews;
