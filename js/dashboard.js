async function loadDashboard() {
    const sheets = window.sheetsList || [];
    const allData = window.allSheetsData || {};
    
    let totalItems = 0;
    let ebookCount = 0;
    
    for (const sheet of sheets) {
        const count = allData[sheet]?.length || 0;
        totalItems += count;
        if (sheet === 'Ebook') ebookCount = count;
    }
    
    const statsHtml = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${sheets.length}</div>
                <div>Database</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${ebookCount}</div>
                <div>Total Ebook</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalItems}</div>
                <div>Total Items</div>
            </div>
        </div>
        <div class="stat-card" style="margin:0 24px 24px 24px;">
            <h3 style="margin-bottom:16px;">📊 Statistik per Database</h3>
            ${sheets.map(sheet => `
                <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border-color);">
                    <span>📄 ${escapeHtml(sheet)}</span>
                    <span style="color:var(--accent);">${allData[sheet]?.length || 0} items</span>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('content').innerHTML = statsHtml;
}
