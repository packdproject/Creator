let searchTimeout;

function initSearch() {
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");

    input.addEventListener("input", async () => {
        clearTimeout(searchTimeout);
        const keyword = input.value.trim();

        if (keyword.length < 2) {
            results.innerHTML = "";
            return;
        }

        searchTimeout = setTimeout(async () => {
            await performSearch(keyword);
        }, 300);
    });
}

async function performSearch(keyword) {
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = '<div class="loading-search">🔍 Mencari...</div>';

    try {
        const data = await searchData(keyword);
        renderSearchResults(data, keyword);
    } catch (error) {
        console.error("Search error:", error);
        resultsDiv.innerHTML = '<div class="error-search">Gagal melakukan pencarian</div>';
    }
}

function renderSearchResults(data, keyword) {
    const resultsDiv = document.getElementById("searchResults");

    if (!data || data.length === 0) {
        resultsDiv.innerHTML = `
            <div class="card">
                <p>😕 Tidak ada hasil untuk "<strong>${escapeHtml(keyword)}</strong>"</p>
            </div>
        `;
        return;
    }

    // Group by sheet
    const grouped = {};
    data.forEach(item => {
        if (!grouped[item.sheet]) grouped[item.sheet] = [];
        grouped[item.sheet].push(item);
    });

    let html = `
        <div class="search-header">
            <h3>🔍 Hasil: "${escapeHtml(keyword)}"</h3>
            <p>${data.length} hasil dari ${Object.keys(grouped).length} kategori</p>
        </div>
    `;

    for (const [sheet, items] of Object.entries(grouped)) {
        html += `
            <div class="card search-group">
                <div class="search-sheet-header" onclick="loadSheet('${sheet}')">
                    📄 ${sheet} <span class="badge">${items.length}</span>
                </div>
                <div class="search-items">
        `;

        items.slice(0, 5).forEach((item, idx) => {
            const title = item.title || item.judul || item.nama || Object.values(item)[0] || 'Tanpa judul';
            html += `
                <div class="search-item" onclick="showSearchDetail('${sheet}', ${idx})">
                    <div class="search-item-title">📌 ${escapeHtml(String(title).substring(0, 80))}</div>
                    <div class="search-item-preview">${getPreview(item)}</div>
                </div>
            `;
        });

        if (items.length > 5) {
            html += `<div class="search-more" onclick="loadSheet('${sheet}')">+ ${items.length - 5} hasil lainnya</div>`;
        }

        html += `</div></div>`;
    }

    resultsDiv.innerHTML = html;
    
    // Store search results for detail view
    window.lastSearchResults = data;
}

function getPreview(item) {
    for (const [key, value] of Object.entries(item)) {
        if (key !== 'sheet' && value && typeof value === 'string' && value.length > 10 && value.length < 200) {
            return escapeHtml(value.substring(0, 100)) + (value.length > 100 ? '...' : '');
        }
    }
    return 'Klik untuk lihat detail';
}

function showSearchDetail(sheet, index) {
    const item = window.lastSearchResults[index];
    if (!item) return;

    const content = document.getElementById("content");
    
    let detailsHtml = `
        <div class="card detail-card">
            <div class="detail-header">
                <h2>📋 Detail dari ${sheet}</h2>
                <button class="btn-close" onclick="loadDashboard()">✖ Tutup</button>
            </div>
            <div class="detail-body">
    `;

    // Tampilkan semua field dari item
    for (const [key, value] of Object.entries(item)) {
        if (key === '_rowData') continue;
        if (key === 'sheet') continue;
        
        detailsHtml += `
            <div class="detail-row">
                <div class="detail-label">${escapeHtml(key)}</div>
                <div class="detail-value">
                    ${isUrl(value) ? `<a href="${value}" target="_blank">${escapeHtml(value)}</a>` : 
                      value ? `<pre>${escapeHtml(String(value))}</pre>` : '-'}
                </div>
            </div>
        `;
    }

    detailsHtml += `
            </div>
            <div class="detail-footer">
                <button onclick="loadSheet('${sheet}')" class="btn-primary">📄 Lihat semua di ${sheet}</button>
            </div>
        </div>
    `;

    content.innerHTML = detailsHtml;
    document.getElementById("searchResults").innerHTML = "";
    document.getElementById("searchInput").value = "";
}
