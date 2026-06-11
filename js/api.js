const API_URL = "https://script.google.com/macros/s/AKfycbxtkfn059eEdHCPKPeYMu5UL0HyAYtMz7MWb5kQoqmJM1PIDG1RA64AxArCAqQLs_IG/exec";

async function getSheets() {
    try {
        const res = await fetch(`${API_URL}?action=sheets`);
        const data = await res.json();
        console.log("Sheets:", data);
        return Array.isArray(data) ? data : [];
    } catch(e) {
        console.error("getSheets error:", e);
        return [];
    }
}

async function getSheetData(sheetName) {
    try {
        const res = await fetch(`${API_URL}?action=data&sheet=${encodeURIComponent(sheetName)}&limit=200`);
        const data = await res.json();
        console.log(`Data ${sheetName}:`, data);
        
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && !Array.isArray(data[0])) {
            return data;
        }
        return [];
    } catch(e) {
        console.error(`getSheetData error:`, e);
        return [];
    }
}
