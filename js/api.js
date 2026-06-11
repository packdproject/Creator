const API_URL = "https://script.google.com/macros/s/AKfycbxtkfn059eEdHCPKPeYMu5UL0HyAYtMz7MWb5kQoqmJM1PIDG1RA64AxArCAqQLs_IG/exec";

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
        
        // Format baru: Array of Objects (langsung bisa digunakan)
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && !Array.isArray(data[0])) {
            return data;
        }
        
        // Format lama: 2D array (untuk kompatibilitas)
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
