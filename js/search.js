function initSearch() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    input.addEventListener('input', (e) => {
        const keyword = e.target.value;
        
        if (keyword.length > 0) {
            clearBtn.classList.add('show');
        } else {
            clearBtn.classList.remove('show');
        }
        
        if (keyword.length < 2) {
            loadDashboard();
            return;
        }
        
        searchData(keyword).then(results => {
            displaySearchResults(results, keyword);
        });
    });
    
    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.remove('show');
        loadDashboard();
    });
}

function displaySearchResults(results, keyword) {
    if (!results.length) {
        document.getElementById('content').innerHTML = `<div class="empty-state"><p>Tidak ada hasil untuk "${keyword}"</p></div>`;
        return;
    }
    
    let html = `<div class="ebook-grid">`;
    results.forEach(result => {
        const title = result.title || Object.values(result.data)[0] || "Item";
        html += `
            <div class="ebook-card">
                <div class="ebook-cover">🔍</div>
                <div class="ebook-info">
                    <div class="ebook-title">${escapeHtml(title)}</div>
                    <div class="ebook-author">📁 ${result.sheet}</div>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    document.getElementById('content').innerHTML = html;
}
