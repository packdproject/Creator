async function loadDashboard(){

  const content =
    document.getElementById("content");

  const sheets =
    await getSheets();

  let html = `
    <div class="card">
      <h2>Creator Vault</h2>
      <p>Personal Knowledge Hub</p>
    </div>

    <div class="card">
      <h3>Database Tersedia</h3>

      <table class="table">
        <thead>
          <tr>
            <th>Sheet</th>
            <th>Total Data</th>
          </tr>
        </thead>

        <tbody>
  `;

  for(const sheet of sheets){

    const data =
      await getSheetData(sheet);

    html += `
      <tr>
        <td>${sheet}</td>
        <td>${data.length}</td>
      </tr>
    `;

  }

  html += `
        </tbody>
      </table>

    </div>
  `;

  content.innerHTML = html;

}