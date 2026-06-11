let allSheetsData = {};
let sheetsList = [];

async function initApp() {
    console.log("App starting...");
    
    const content = document.getElementById('content');
    content.innerHTML = `<div class="loading"><div class="spinner"></div><p>Memuat data...</p></div>`;
    
    try {
        // Ambil daftar sheet
        sheetsList = await getSheets();
        console.log("Sheets list:", sheetsList);
        
        // Ambil data setiap sheet
        for (const sheet of sheetsList) {
            allSheetsData[sheet] = await getSheetData(sheet);
            console.log(`Loaded ${sheet}: ${allSheetsData[sheet].length} items`);
        }
        
        // Simpan ke global
        window.allSheetsData = allSheetsData;
        window.sheetsList = sheetsList;
        
        // Load sidebar
        await loadSidebar();
        
        // Load dashboard
        await loadDashboard();
        
        // Init search
        if (typeof initSearch === 'function') initSearch();
        
        console.log("App ready!");
        
    } catch(error) {
        console.error("Init error:", error);
        content.innerHTML = `
            <div class="empty-state">
                <span style="font-size:48px;">⚠️</span>
                <p>Gagal memuat data</p>
                <p style="font-size:12px; color:red;">${error.message}</p>
                <button onclick="location.reload()" class="refresh-btn" style="margin-top:16px;">Refresh</button>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", initApp);
