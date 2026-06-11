let searchTimeout;

function initSearch() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    if (!input) return;
    
    input.addEventListener('input', (e) => {
        const keyword = e.target.value;
        
        if (keyword.length > 0) {
            clearBtn.classList.add('show');
        } else {
            clearBtn.classList.remove('show');
        }
        
        if (searchTimeout) clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            if (keyword.length === 0) {
                if (window.currentView === 'ebook') {
                    if (typeof window.showEbookDashboard === 'function') window.showEbookDashboard();
                } else if (window.currentView === 'dashboard') {
                    loadDashboard();
                } else if (window.currentView === 'sheet' && window.currentSheet) {
                    loadSheet(window.currentSheet);
                }
                return;
            }
            
            if (keyword.length < 2) return;
            
            searchLocal(keyword);
        }, 300);
    });
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.classList.remove('show');
            input.focus();
            if (window.currentView === 'ebook') {
                if (typeof window.showEbookDashboard === 'function') window.showEbookDashboard();
            } else if (window.currentView === 'dashboard') {
                loadDashboard();
            } else if (window.currentView === 'sheet' && window.currentSheet) {
                loadSheet(window.currentSheet);
            }
        });
    }
}

function searchLocal(keyword) {
    const allData = window.allSheetsData || {};
    const lowerKeyword = keyword.toLowerCase();
    const results = [];
    
    for (const [sheet, data] of Object.entries(allData)) {
        for (const item of data) {
            let found = false;
            for (const val of Object.values(item)) {
                if (val && String(val).toLowerCase().includes(lowerKeyword)) {
                    found = true;
                    break;
                }
            }
            if (found) {
                results.push({ sheet, data: item });
            }
        }
    }
    
    displaySearchResults(results, keyword);
}

function displaySearchResults(results, keyword) {
    const container = document.getElementById('content');
    window.currentView = 'search';
    document.getElementById('pageTitle').innerText = `🔍 Hasil: ${keyword}`;
    
    if (!results.length) {
        container.innerHTML = `<div class="empty-state"><span style="font-size:48px;">🔍</span><p>Tidak ada hasil untuk "${escapeHtml(keyword)}"</p></div>`;
        return;
    }
    
    let html = `<div style="padding:24px;"><div class="search-info">🔍 ${results.length} hasil untuk "${escapeHtml(keyword)}"</div><div class="ebook-grid">`;
    
    results.forEach((result, idx) => {
        const title = Object.values(result.data)[0] || "Tanpa Judul";
        const preview = Object.values(result.data)[1] || "";
        html += `
            <div class="ebook-card" onclick='showSearchDetail(${JSON.stringify(result.data).replace(/'/g, "&#39;")}, "${result.sheet}")' style="cursor:pointer;">
                <div class="ebook-cover" style="background:#4a9eff;">🔍</div>
                <div class="ebook-info">
                    <div class="ebook-title">${escapeHtml(title.substring(0, 50))}</div>
                    <div class="ebook-author">📁 ${escapeHtml(result.sheet)}</div>
                    <div style="font-size:12px; color:var(--text-secondary);">${escapeHtml(preview.substring(0, 80))}</div>
                </div>
            </div>
        `;
    });
    
    html += `</div></div>`;
    container.innerHTML = html;
}

function showSearchDetail(item, sheetName) {
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.innerHTML = `📋 ${escapeHtml(sheetName)}`;
    
    let bodyHtml = '';
    for (const [key, val] of Object.entries(item)) {
        let displayVal = val;
        if (typeof val === 'string' && (val.includes('drive.google.com') || val.includes('http'))) {
            displayVal = `<a href="${val}" target="_blank">🔗 ${escapeHtml(val)}</a>`;
        }
        bodyHtml += `
            <div class="detail-row">
                <div style="font-weight:600; color:var(--accent); margin-bottom:4px;">${escapeHtml(key)}</div>
                <div>${displayVal}</div>
            </div>
        `;
    }
    modalBody.innerHTML = bodyHtml;
    modal.classList.add('active');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
