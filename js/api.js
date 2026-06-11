// Cache untuk menyimpan data
let dataCache = null;
let lastFetch = 0;

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

async function getSheetData(sheetName) {
    try {
        const res = await fetch(`${API_URL}?action=data&sheet=${encodeURIComponent(sheetName)}`);
        const data = await res.json();
        console.log(`getSheetData ${sheetName}:`, data);
        
        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
            const headers = data[0];
            const rows = data.slice(1);
            return rows.map(row => {
                const obj = {};
                headers.forEach((h, i) => obj[h] = row[i] || "");
                return obj;
            });
        }
        return Array.isArray(data) ? data : [];
    } catch(e) {
        console.error(`getSheetData ${sheetName} error:`, e);
        return [];
    }
}

async function loadAllDataWithCache(forceRefresh = false) {
    const now = Date.now();
    
    if (!forceRefresh && dataCache && (now - lastFetch) < 60000) {
        console.log("Using cached data");
        return dataCache;
    }
    
    console.log("Fetching fresh data from API...");
    
    const sheetsList = await getSheets();
    const allData = {};
    
    for (const sheet of sheetsList) {
        allData[sheet] = await getSheetData(sheet);
    }
    
    dataCache = {
        sheets: sheetsList,
        data: allData,
        timestamp: now
    };
    lastFetch = now;
    
    return dataCache;
}
