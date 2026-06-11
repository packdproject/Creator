let appInitialized = false;

async function initApp() {
    if (appInitialized) return;
    
    console.log("Initializing Creator Vault...");
    
    // Show loading
    document.getElementById('content').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Memuat data dari database...</p>
            <p style="font-size:12px; margin-top:8px;">Ini hanya sekali, mohon tunggu...</p>
        </div>
    `;
    
    try {
        // Load data with cache
        const cachedData = await loadAllDataWithCache();
        
        // Set global variables
        window.allSheetsData = cachedData.data;
        window.sheetsList = cachedData.sheets;
        
        // Load sidebar and dashboard
        await loadSidebar();
        await loadDashboard();
        initSearch();
        
        appInitialized = true;
        console.log("App initialized successfully");
        
        // Hide loading
        document.getElementById('content').innerHTML = '';
        
    } catch(error) {
        console.error("Init error:", error);
        document.getElementById('content').innerHTML = `
            <div class="empty-state">
                <span style="font-size:48px;">⚠️</span>
                <p>Gagal memuat data</p>
                <p style="font-size:12px;">${error.message}</p>
                <button class="refresh-btn" onclick="location.reload()" style="margin-top:16px;">Refresh Halaman</button>
            </div>
        `;
    }
}

// Global functions
window.manualRefresh = async function() {
    const content = document.getElementById('content');
    content.innerHTML = `<div class="loading"><div class="spinner"></div><p>Mengambil data terbaru...</p></div>`;
    
    try {
        const freshData = await loadAllDataWithCache(true);
        window.allSheetsData = freshData.data;
        window.sheetsList = freshData.sheets;
        
        await loadSidebar();
        await loadDashboard();
        
        showToast('Data berhasil diperbarui');
    } catch(e) {
        showToast('Gagal refresh data');
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
