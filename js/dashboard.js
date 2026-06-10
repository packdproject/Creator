async function loadDashboard() {
    const content = document.getElementById("content");
    content.innerHTML = '<div class="card"><h3>📊 Memuat Dashboard...</h3></div>';

    try {
        const sheets = await getSheets();
        
        // Get stats for each sheet
        const stats = [];
        for (const sheet of sheets) {
            const data = await getSheetData(sheet);
            stats.push({ name: sheet, count: data.length });
        }

        const totalItems = stats.reduce((sum, s) => sum + s.count, 0);

        let html = `
            <div class="dashboard-welcome">
                <h1>🏠 Creator Vault</h1>
                <p>Personal Knowledge Hub & Digital Library</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${sheets.length}</div>
                    <div class="stat-label">Database Categories</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${totalItems}</div>
                    <div class="stat-label">Total Items</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">⚡</div>
                    <div class="stat-label">Real-time Sync</div>
                </div>
            </div>

            <div class="card">
                <h3>📚 Semua Database</h3>
                <div class="sheet-grid">
        `;

        for (const sheet of stats) {
            html += `
                <div class="sheet-card" onclick="loadSheet('${sheet.name}')">
                    <div class="sheet-icon">📄</div>
                    <div class="sheet-name">${escapeHtml(sheet.name)}</div>
                    <div class="sheet-count">${sheet.count} items</div>
                </div>
            `;
        }

        html += `
                </div>
            </div>

            <div class="card tips-card">
                <h3>💡 Panduan Cepat</h3>
                <ul>
                    <li>🔍 Gunakan kotak search di atas untuk mencari ke semua database</li>
                    <li>📄 Klik sheet di sidebar kiri untuk melihat semua data</li>
                    <li>👆 Klik baris tabel untuk melihat detail lengkap</li>
                    <li>✨ Tambah sheet baru di Google Spreadsheet, otomatis muncul di sini</li>
                    <li>📊 Data langsung dari Google Sheets Anda</li>
                </ul>
            </div>
        `;

        content.innerHTML = html;
    } catch (error) {
        console.error("Dashboard error:", error);
        content.innerHTML = `
            <div class="card error-card">
                <h3>⚠️ Gagal Memuat Dashboard</h3>
                <p>Pastikan koneksi internet Anda aktif dan API dapat diakses.</p>
                <button onclick="loadDashboard()" class="btn-primary">🔄 Coba Lagi</button>
            </div>
        `;
    }
}
