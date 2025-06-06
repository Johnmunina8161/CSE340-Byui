
  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("menu-toggle");
    const nav = document.getElementById("primary-nav");

    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
      nav.classList.toggle("closed");

      const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", !expanded);
    });
  });



