async function loadSidebar() {
    const menu = document.getElementById("sidebarMenu");
    const sheets = window.sheetsList || [];
    
    let html = `
        <li class="menu-item" data-view="dashboard">
            <span>📊</span> Dashboard
        </li>
        <li class="menu-item" data-view="ebook">
            <span>📚</span> Perpustakaan
        </li>
    `;
    
    const otherSheets = sheets.filter(s => s !== 'Ebook');
    if (otherSheets.length > 0) {
        html += `<li class="menu-separator">━━ DATABASE LAIN ━━</li>`;
        otherSheets.forEach(sheet => {
            html += `<li class="menu-item" data-sheet="${sheet}"><span>📄</span> ${sheet}</li>`;
        });
    }
    
    menu.innerHTML = html;
    
    // Event listeners
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            
            if (item.dataset.view === 'dashboard') {
                loadDashboard();
            } else if (item.dataset.view === 'ebook') {
                showEbookList();
            } else if (item.dataset.sheet) {
                loadSheet(item.dataset.sheet);
            }
        });
    });
    
    // Active dashboard
    const dashboardItem = document.querySelector('.menu-item[data-view="dashboard"]');
    if (dashboardItem) dashboardItem.classList.add('active');
}

function showEbookList() {
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
                    <div class="ebook-title">${escapeHtml(judul)}</div>
                    <div class="ebook-author">✍️ ${escapeHtml(penulis)}</div>
                    <span class="ebook-category">📁 ${escapeHtml(kategori)}</span>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    document.getElementById('content').innerHTML = html;
}

function loadSheet(sheetName) {
    const data = window.allSheetsData[sheetName] || [];
    
    if (!data.length) {
        document.getElementById('content').innerHTML = `<div class="empty-state"><p>Tidak ada data di ${sheetName}</p></div>`;
        return;
    }
    
    const headers = Object.keys(data[0]);
    let html = `<div style="padding:24px; overflow-x:auto;"><table class="data-table"><thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>`;
    
    data.forEach(item => {
        html += `<tr>${headers.map(h => `<td>${escapeHtml(String(item[h] || "").substring(0, 50))}</td>`).join('')}</tr>`;
    });
    
    html += `</tbody></table></div>`;
    document.getElementById('content').innerHTML = html;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

window.openEbookReader = function(idx) {
    const ebook = window.allSheetsData?.Ebook?.[idx];
    if (!ebook || !ebook.File) {
        alert("File tidak tersedia");
        return;
    }
    
    const fileUrl = ebook.File;
    let embedUrl = fileUrl;
    const match = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
        embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    
    document.getElementById('content').style.display = 'none';
    document.querySelector('.search-container').style.display = 'none';
    
    const readerHtml = `
        <div class="reader-container" id="readerContainer">
            <div class="reader-toolbar">
                <button onclick="closeEbookReader()">← Tutup Buku</button>
            </div>
            <div class="reader-content">
                <iframe src="${embedUrl}" style="width:100%; height:calc(100vh - 80px); border:none;"></iframe>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', readerHtml);
};

window.closeEbookReader = function() {
    const reader = document.getElementById('readerContainer');
    if (reader) reader.remove();
    document.getElementById('content').style.display = 'block';
    document.querySelector('.search-container').style.display = 'block';
    showEbookList();
};
