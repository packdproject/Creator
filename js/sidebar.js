async function loadSidebar(){

  const menu =
    document.getElementById(
      "sidebarMenu"
    );

  menu.innerHTML = "";

  const sheets =
    await getSheets();

  sheets.forEach(sheet => {

    const li =
      document.createElement("li");

    li.textContent = sheet;

    li.addEventListener(
      "click",
      () => {

        loadSheet(sheet);

      }
    );

    menu.appendChild(li);

  });

}