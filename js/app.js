async function initApp() {
  await loadSidebar();
  await loadDashboard();
  initSearch();
}

// Global functions for HTML onclick
window.changePage = changePage;
window.showDetail = showDetail;
window.loadSheet = loadSheet;
window.loadDashboard = loadDashboard;
window.showSearchDetail = showSearchDetail;

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});
