function initSearch(){

  const input =
    document.getElementById("searchInput");

  const results =
    document.getElementById("searchResults");

  input.addEventListener("keyup", async () => {

    const keyword =
      input.value.trim();

    if(keyword.length < 2){

      results.innerHTML = "";
      return;

    }

    const data =
      await searchData(keyword);

    let html = "";

    data.forEach(item => {

      html += `
        <div class="result-item">

          <div class="sheet">
            ${item.sheet}
          </div>

          <div class="title">
            ${item.title}
          </div>

        </div>
      `;

    });

    results.innerHTML = html;

  });

}