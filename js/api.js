// Google Apps Script API URL
const API_URL = "https://script.google.com/macros/s/AKfycbxtkfn059eEdHCPKPeYMu5UL0HyAYtMz7MWb5kQoqmJM1PIDG1RA64AxArCAqQLs_IG/exec";

// Cache untuk menyimpan data
let dataCache = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

async function getSheets() {
    try {
        const res = await fetch(`${API_URL}?action=sheets`);
        const data = await res.json();
        console.log("getSheets response:", data);
        return Array.isArray(data) ? data : [];
    } catch(e) {
        console.error("getSheets error:", e);
        return [];
    }
}

async function getSheetData(sheetName, limit = 200) {
    try {
        const res = await fetch(`${API_URL}?action=data&sheet=${encodeURIComponent(sheetName)}&limit=${limit}`);
        const data = await res.json();
        console.log(`getSheetData ${sheetName}:`, data);
        
        // Format: Array of Objects (langsung bisa digunakan)
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && !Array.isArray(data[0])) {
            return data;
        }
        
        // Format: 2D array (untuk kompatibilitas)
        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
            const headers = data[0];
            const rows = data.slice(1);
            return rows.map(row => {
                const obj = {};
                headers.forEach((h, i) => obj[h] = row[i] || "");
                return obj;
            });
        }
        
        return [];
    } catch(e) {
        console.error(`getSheetData ${sheetName} error:`, e);
        return [];
    }
}

async function getAllSheetsData(limit = 200) {
    try {
        const res = await fetch(`${API_URL}?action=all&limit=${limit}`);
        const data = await res.json();
        console.log("getAllSheetsData response:", data);
        return data;
    } catch(e) {
        console.error("getAllSheetsData error:", e);
        return {};
    }
}

async function searchData(keyword, limit = 200) {
    if (!keyword || keyword.length < 2) return [];
    try {
        const res = await fetch(`${API_URL}?action=search&q=${encodeURIComponent(keyword)}&limit=${limit}`);
        const data = await res.json();
        console.log("searchData response:", data);
        return Array.isArray(data) ? data : [];
    } catch(e) {
        console.error("searchData error:", e);
        return [];
    }
}

// Fungsi untuk load semua data dengan cache
async function loadAllDataWithCache(forceRefresh = false) {
    const now = Date.now();
    
    if (!forceRefresh && dataCache && (now - lastFetch) < CACHE_DURATION) {
        console.log("Using cached data");
        return dataCache;
    }
    
    console.log("Fetching fresh data from API...");
    
    try {
        const sheetsList = await getSheets();
        const allData = {};
        
        // Load data untuk setiap sheet
        for (const sheet of sheetsList) {
            allData[sheet] = await getSheetData(sheet, 200);
        }
        
        dataCache = {
            sheets: sheetsList,
            data: allData,
            timestamp: now
        };
        lastFetch = now;
        
        return dataCache;
    } catch(e) {
        console.error("loadAllDataWithCache error:", e);
        throw e;
    }
}
