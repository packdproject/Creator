let currentSheet = null;
let currentData = [];
let currentHeaders = [];

function loadSheet(sheetName) {
    currentSheet = sheetName;
    const content = document.getElementById('content');
    content.innerHTML = `<div class="loading"><div class="spinner"></div><p>Memuat data ${sheetName}...</p></div>`;
    
    getSheetData(sheetName, 200).then(data => {
        currentData = data;
        if (currentData.length > 0) {
            currentHeaders = Object.keys(currentData[0]);
        }
        renderSheetData();
    }).catch(err => {
        console.error(err);
        content.innerHTML = `<div class="empty-state"><p>❌ Gagal memuat data</p></div>`;
    });
}

function renderSheetData() {
    const content = document.getElementById('content');
    
    if (!currentData.length) {
        content.innerHTML = `<div class="empty-state"><span style="font-size:48px;">📭</span><p>Tidak ada data di ${currentSheet}</p></div>`;
        return;
    }
    
    let html = `<div style="padding:24px; overflow-x:auto;">
        <table class="data-table">
            <thead><tr>${currentHeaders.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</thead>
            <tbody>
    `;
    
    currentData.forEach((item, idx) => {
        html += `<tr onclick="showDetailSheet('${currentSheet}', ${idx})">`;
        currentHeaders.forEach(h => {
            let val = item[h] || "";
            val = val.length > 50 ? val.substring(0, 50) + "..." : val;
            html += `<td>${escapeHtml(val)}</td>`;
        });
        html += `</tr>`;
    });
    
    html += `</tbody></table></div>`;
    content.innerHTML = html;
}

function showDetailSheet(sheetName, idx) {
    const item = window.allSheetsData?.[sheetName]?.[idx] || currentData?.[idx];
    if (!item) return;
    
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

// Menampilkan ebook dashboard
window.showEbookDashboard = function() {
    getSheetData('Ebook', 200).then(ebookData => {
        if (!ebookData.length) {
            document.getElementById('content').innerHTML = `<div class="empty-state"><span style="font-size:48px;">📚</span><p>Belum ada ebook</p></div>`;
            return;
        }
        
        let html = `<div class="ebook-grid">`;
        ebookData.forEach((ebook, idx) => {
            const judul = ebook.Judul || ebook.title || "Tanpa Judul";
            const penulis = ebook.Penulis || ebook.author || "Unknown";
            const kategori = ebook.Kategori || ebook.category || "Umum";
            const fileUrl = ebook.File || "";
            
            html += `
                <div class="ebook-card" onclick="openEbookReader(${idx})">
                    <div class="ebook-cover">📖</div>
                    <div class="ebook-info">
                        <div class="ebook-title">${escapeHtml(judul.substring(0, 60))}</div>
                        <div class="ebook-author">✍️ ${escapeHtml(penulis)}</div>
                        <span class="ebook-category">📁 ${escapeHtml(kategori)}</span>
                        ${fileUrl ? '<div style="margin-top:12px; font-size:11px; color:var(--accent);">🔗 Tersedia</div>' : ''}
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        document.getElementById('content').innerHTML = html;
        window.ebookData = ebookData;
    }).catch(err => {
        console.error(err);
        document.getElementById('content').innerHTML = `<div class="empty-state"><p>❌ Gagal memuat ebook</p></div>`;
    });
};

window.openEbookReader = function(idx) {
    const ebook = window.ebookData?.[idx];
    if (!ebook) return;
    
    const judul = ebook.Judul || ebook.title || "Ebook";
    const fileUrl = ebook.File || "";
    
    if (!fileUrl) {
        showToast('File tidak tersedia');
        return;
    }
    
    let embedUrl = fileUrl;
    const match = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
        embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    
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
    
    document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
        document.getElementById('readerContainer')?.requestFullscreen();
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

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}
