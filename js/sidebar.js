async function loadSidebar() {
  const menu = document.getElementById("sidebarMenu");
  menu.innerHTML = '<li class="loading">Memuat menu...</li>';

  try {
    const sheets = await getSheets();
    menu.innerHTML = "";

    // Dashboard selalu di atas
    const dashboardLi = document.createElement("li");
    dashboardLi.textContent = "📊 Dashboard";
    dashboardLi.className = "menu-item active";
    dashboardLi.addEventListener("click", () => {
      setActiveMenu(dashboardLi);
      loadDashboard();
    });
    menu.appendChild(dashboardLi);

    // Separator
    const separator = document.createElement("li");
    separator.textContent = "━━━━━━━━━━━━━━━━";
    separator.className = "menu-separator";
    separator.style.fontSize = "12px";
    separator.style.color = "#555";
    separator.style.cursor = "default";
    separator.style.padding = "8px 12px";
    menu.appendChild(separator);

    // Dynamic sheets
    sheets.forEach(sheet => {
      const li = document.createElement("li");
      li.textContent = `📄 ${sheet}`;
      li.className = "menu-item";
      li.addEventListener("click", () => {
        setActiveMenu(li);
        loadSheet(sheet);
      });
      menu.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading sidebar:", error);
    menu.innerHTML = '<li class="error">Gagal memuat menu</li>';
  }
}

function setActiveMenu(activeItem) {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.remove("active");
  });
  activeItem.classList.add("active");
}
