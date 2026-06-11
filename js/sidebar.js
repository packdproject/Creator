async function loadSidebar() {
    const menu = document.getElementById("sidebarMenu");
    const sheets = window.sheetsList || [];
    
    let menuHtml = `
        <li class="menu-item" data-view="dashboard">
            <span>📊</span> Dashboard
        </li>
        <li class="menu-item" data-view="ebook">
            <span>📚</span> Perpustakaan
        </li>
    `;
    
    const otherSheets = sheets.filter(s => s !== 'Ebook' && s !== 'Dasbhoard');
    if (otherSheets.length > 0) {
        menuHtml += `<li class="menu-separator">━━ DATABASE LAIN ━━</li>`;
        otherSheets.forEach(sheet => {
            menuHtml += `
                <li class="menu-item" data-sheet="${sheet}">
                    <span>📄</span> ${escapeHtml(sheet)}
                </li>
            `;
        });
    }
    
    menu.innerHTML = menuHtml;
    
    // Add click handlers
    document.querySelectorAll('.menu-item[data-view], .menu-item[data-sheet]').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            
            if (item.dataset.view === 'dashboard') {
                window.currentView = 'dashboard';
                document.getElementById('pageTitle').innerText = 'Dashboard';
                loadDashboard();
            } else if (item.dataset.view === 'ebook') {
                window.currentView = 'ebook';
                document.getElementById('pageTitle').innerText = '📚 Perpustakaan';
                if (typeof showEbookDashboard === 'function') {
                    showEbookDashboard();
                }
            } else if (item.dataset.sheet) {
                window.currentView = 'sheet';
                window.currentSheet = item.dataset.sheet;
                document.getElementById('pageTitle').innerText = window.currentSheet;
                if (typeof loadSheet === 'function') {
                    loadSheet(window.currentSheet);
                }
            }
            
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            document.getElementById('clearSearchBtn').classList.remove('show');
            if (window.innerWidth <= 768) toggleSidebar(false);
        });
    });
    
    // Set active
    const dashboardItem = document.querySelector('.menu-item[data-view="dashboard"]');
    if (dashboardItem) dashboardItem.classList.add('active');
}

function toggleSidebar(show) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (show) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    } else {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
}
