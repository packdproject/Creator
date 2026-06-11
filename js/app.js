let appInitialized = false;
let allSheetsData = {};
let sheetsList = [];

async function initApp() {
    if (appInitialized) return;
    
    console.log("Initializing Creator Vault...");
    
    // Show loading
    const content = document.getElementById('content');
    if (content) {
        content.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Memuat data dari database...</p>
                <p style="font-size:12px; margin-top:8px;">Ini hanya sekali, mohon tunggu...</p>
            </div>
        `;
    }
    
    try {
        // Load data with cache
        const cachedData = await loadAllDataWithCache();
        
        // Set global variables
        allSheetsData = cachedData.data;
        sheetsList = cachedData.sheets;
        
        // Simpan ke window untuk akses global
        window.allSheetsData = allSheetsData;
        window.sheetsList = sheetsList;
        
        console.log("Data loaded:", { sheetsList, totalSheets: sheetsList.length });
        
        // Load sidebar and dashboard
        if (typeof loadSidebar === 'function') {
            await loadSidebar();
        } else {
            console.error("loadSidebar is not defined");
        }
        
        if (typeof loadDashboard === 'function') {
            await loadDashboard();
        } else {
            console.error("loadDashboard is not defined");
        }
        
        if (typeof initSearch === 'function') {
            initSearch();
        }
        
        appInitialized = true;
        console.log("App initialized successfully");
        
    } catch(error) {
        console.error("Init error:", error);
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = `
                <div class="empty-state">
                    <span style="font-size:48px;">⚠️</span>
                    <p>Gagal memuat data</p>
                    <p style="font-size:12px;">${error.message}</p>
                    <button class="refresh-btn" onclick="location.reload()" style="margin-top:16px;">Refresh Halaman</button>
                </div>
            `;
        }
    }
}

// Fungsi refresh manual
window.manualRefresh = async function() {
    const content = document.getElementById('content');
    if (content) {
        content.innerHTML = `<div class="loading"><div class="spinner"></div><p>Mengambil data terbaru...</p></div>`;
    }
    
    try {
        const freshData = await loadAllDataWithCache(true);
        window.allSheetsData = freshData.data;
        window.sheetsList = freshData.sheets;
        allSheetsData = freshData.data;
        sheetsList = freshData.sheets;
        
        if (typeof loadSidebar === 'function') await loadSidebar();
        if (typeof loadDashboard === 'function') await loadDashboard();
        
        showToast('Data berhasil diperbarui');
    } catch(e) {
        showToast('Gagal refresh data');
        console.error(e);
    }
};

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Start the app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
