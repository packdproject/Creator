async function getSheets(){

  const res =
    await fetch(
      `${API_URL}?action=sheets`
    );

  return await res.json();

}

async function getSheetData(sheet){

  const res =
    await fetch(
      `${API_URL}?action=data&sheet=${encodeURIComponent(sheet)}`
    );

  return await res.json();

}

async function searchData(keyword){

  const res =
    await fetch(
      `${API_URL}?action=search&q=${encodeURIComponent(keyword)}`
    );

  return await res.json();

}