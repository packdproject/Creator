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
        <h3>📚 All Databases</h3>
        <div class="sheet-grid">
    `;

    for (const sheet of sheets) {
      const preview = await getSheetPreview(sheet);
      html += `
        <div class="sheet-card" onclick="loadSheet('${sheet}')">
          <div class="sheet-icon">📄</div>
          <div class="sheet-name">${escapeHtml(sheet)}</div>
          <div class="sheet-count">${preview.count} items</div>
          <div class="sheet-preview">${escapeHtml(preview.preview)}</div>
        </div>
      `;
    }

    html += `
        </div>
      </div>

      <div class="card tips-card">
        <h3>💡 Quick Tips</h3>
        <ul>
          <li>🔍 Gunakan search di atas untuk mencari ke semua database</li>
          <li>📄 Klik sheet di sidebar untuk melihat semua data</li>
          <li>👆 Klik baris tabel untuk melihat detail lengkap</li>
          <li>✨ Tambah sheet baru di Google Spreadsheet, otomatis muncul di sini</li>
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

async function getSheetPreview(sheetName) {
  try {
    const data = await getSheetData(sheetName);
    if (data.length === 0) return { count: 0, preview: 'Kosong' };
    
    // Get first item's title or first field
    const firstItem = data[0];
    const firstValue = Object.values(firstItem)[0];
    const preview = firstValue ? String(firstValue).substring(0, 40) : 'Tidak ada data';
    
    return { count: data.length, preview: preview + (data.length > 1 ? ` +${data.length - 1} lainnya` : '') };
  } catch (error) {
    return { count: 0, preview: 'Error' };
  }
}
