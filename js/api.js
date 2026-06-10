const API_URL = "";const API_URL = "https://script.google.com/macros/s/AKfycbxtkfn059eEdHCPKPeYMu5UL0HyAYtMz7MWb5kQoqmJM1PIDG1RA64AxArCAqQLs_IG/exec";

async function getSheets() {
    const res = await fetch(`${API_URL}?action=sheets`);
    return await res.json();
}

async function getSheetData(sheetName) {
    const res = await fetch(`${API_URL}?action=data&sheet=${encodeURIComponent(sheetName)}`);
    const data = await res.json();
    
    // Convert 2D array to array of objects
    if (Array.isArray(data) && data.length > 0) {
        const headers = data[0];
        const rows = data.slice(1);
        return rows.map(row => {
            const obj = {};
            headers.forEach((header, idx) => {
                obj[header] = row[idx] || "";
            });
            return obj;
        });
    }
    return [];
}

async function searchData(keyword) {
    const res = await fetch(`${API_URL}?action=search&q=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    
    // Format search results
    if (Array.isArray(data)) {
        return data.map(item => ({
            sheet: item.sheet,
            title: item.title || item.data?.judul || item.data?.nama || "Tanpa Judul",
            ...item.data,
            _rowData: item.data
        }));
    }
    return [];
}
