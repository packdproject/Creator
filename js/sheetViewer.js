// Di file sheetViewer.js, ubah fungsi getSheetData:

async function getSheetData(sheetName, limit = 200) {
    const res = await fetch(`${API_URL}?action=data&sheet=${encodeURIComponent(sheetName)}&limit=${limit}`);
    const data = await res.json();
    
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
}
