function loadSheet(sheetName) {
    const allData = window.allSheetsData || {};
    const data = allData[sheetName] || [];
    
    if (!data.length) {
        document.getElementById('content').innerHTML = `<div class="empty-state"><span style="font-size:48px;">📭</span><p>Tidak ada data di ${escapeHtml(sheetName)}</p></div>`;
        return;
    }
    
    const headers = Object.keys(data[0]);
    
    let html = `<div style="padding:24px; overflow-x:auto;">
        <table class="data-table">
            <thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
            <tbody>
    `;
    
    data.forEach((item, idx) => {
        html += `<tr onclick="showDetailSheet('${sheetName}', ${idx})">`;
        headers.forEach(h => {
            let val = item[h] || "";
            val = val.length > 50 ? val.substring(0, 50) + "..." : val;
            html += `<td>${escapeHtml(val)}</td>`;
        });
        html += `</tr>`;
    });
    
    html += `</tbody></table></div>`;
    document.getElementById('content').innerHTML = html;
}

function showDetailSheet(sheetName, idx) {
    const item = window.allSheetsData[sheetName][idx];
    if (!item) return;
    
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.innerHTML = `📋 ${escapeHtml(sheetName)}`;
    
    let bodyHtml = '';
    for (const [key, val] of Object.entries(item)) {
        bodyHtml += `
            <div class="detail-row">
                <div style="font-weight:600; color:var(--accent); margin-bottom:4px;">${escapeHtml(key)}</div>
                <div>${escapeHtml(String(val))}</div>
            </div>
        `;
    }
    modalBody.innerHTML = bodyHtml;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// Untuk showEbookDashboard (diperlukan oleh sidebar)
window.showEbookDashboard = function() {
    const ebookData = window.allSheetsData?.Ebook || [];
    
    if (!ebookData.length) {
        document.getElementById('content').innerHTML = `<div class="empty-state"><span style="font-size:48px;">📚</span><p>Belum ada ebook</p></div>`;
        return;
    }
    
    let html = `<div class="ebook-grid">`;
    ebookData.forEach((ebook, idx) => {
        const judul = ebook.Judul || ebook.title || "Tanpa Judul";
        const penulis = ebook.Penulis || ebook.author || "Unknown";
        const kategori = ebook.Kategori || ebook.category || "Umum";
        
        html += `
            <div class="ebook-card" onclick="openEbookReader(${idx})">
                <div class="ebook-cover">📖</div>
                <div class="ebook-info">
                    <div class="ebook-title">${escapeHtml(judul.substring(0, 60))}</div>
                    <div class="ebook-author">✍️ ${escapeHtml(penulis)}</div>
                    <span class="ebook-category">📁 ${escapeHtml(kategori)}</span>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    document.getElementById('content').innerHTML = html;
};

window.openEbookReader = function(idx) {
    const ebook = window.allSheetsData?.Ebook?.[idx];
    if (!ebook) return;
    
    const judul = ebook.Judul || ebook.title || "Ebook";
    const fileUrl = ebook.File || ebook.link || ebook.url || "";
    
    if (!fileUrl) {
        showToast('File tidak tersedia');
        return;
    }
    
    // Extract Google Drive file ID
    let embedUrl = fileUrl;
    const match = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
        embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    
    // Hide main content
    document.getElementById('content').style.display = 'none';
    document.querySelector('.search-container').style.display = 'none';
    document.getElementById('pageTitle').innerText = `📖 Membaca: ${judul.substring(0, 40)}`;
    
    const readerHtml = `
        <div class="reader-container" id="readerContainer">
            <div class="reader-toolbar">
                <button onclick="closeEbookReader()">← Tutup Buku</button>
                <button id="fullscreenBtn">🖥️ Layar Penuh</button>
                <button id="themeReaderBtn">🎨 Mode Malam</button>
            </div>
            <div id="readerContent" class="reader-content">
                <iframe src="${embedUrl}" class="drive-embed" allow="autoplay"></iframe>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', readerHtml);
    
    // Controls
    document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
        const container = document.getElementById('readerContainer');
        if (container.requestFullscreen) container.requestFullscreen();
    });
    
    document.getElementById('themeReaderBtn')?.addEventListener('click', () => {
        const container = document.getElementById('readerContainer');
        if (container.style.background === 'rgb(26, 26, 26)' || container.style.background === '#1a1a1a') {
            container.style.background = 'var(--bg-primary)';
        } else {
            container.style.background = '#1a1a1a';
        }
    });
};

window.closeEbookReader = function() {
    const readerContainer = document.getElementById('readerContainer');
    if (readerContainer) readerContainer.remove();
    document.getElementById('content').style.display = 'block';
    document.querySelector('.search-container').style.display = 'block';
    document.getElementById('pageTitle').innerText = '📚 Perpustakaan';
    window.showEbookDashboard();
};
