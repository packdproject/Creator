async function initApp(){

  await loadSidebar();

  await loadDashboard();

}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initApp();

    initSearch();

  }
);