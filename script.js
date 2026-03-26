// script.js
const SUPABASE_URL = 'သင်၏_PROJECT_URL';
const SUPABASE_KEY = 'သင်၏_ANON_KEY';
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
