(() => {
  const root = document.documentElement;
  const settingsKey = "the-book-reader";
  function readSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(settingsKey));
      return saved && typeof saved === "object" ? saved : {};
    } catch {
      return {};
    }
  }
  const settings = readSettings();
  function saveSettings() {
    try { localStorage.setItem(settingsKey, JSON.stringify(settings)); } catch {}
  }

  const themeSelect = document.querySelector("[data-theme]");
  function applyTheme(value) {
    const light = value === "white" || value === "sepia";
    const theme = light ? value : "dark";
    root.classList.toggle("theme-light", light);
    root.classList.toggle("theme-white", theme === "white");
    root.classList.toggle("theme-sepia", theme === "sepia");
    themeSelect.value = theme;
    settings.theme = theme;
  }
  if (themeSelect) {
    applyTheme(settings.theme === "light" ? "sepia" : settings.theme);
    themeSelect.addEventListener("change", () => {
      applyTheme(themeSelect.value);
      saveSettings();
    });
  }

  let size = Number(settings.size) || 1.17;
  function applySize() {
    size = Math.min(1.55, Math.max(1, size));
    root.style.setProperty("--reader-size", size + "rem");
    settings.size = size;
  }
  applySize();
  document.querySelectorAll("[data-font]").forEach(button => {
    button.addEventListener("click", () => {
      size += button.dataset.font === "up" ? .08 : -.08;
      applySize();
      saveSettings();
    });
  });
  const focusButton = document.querySelector("[data-focus]");
  focusButton?.addEventListener("click", () => {
    const active = document.body.classList.toggle("focus-mode");
    focusButton.setAttribute("aria-pressed", String(active));
  });

  const progress = document.querySelector(".reader-progress");
  if (!progress) return;
  const fill = progress.querySelector("span");
  const progressKey = "the-book-progress-" + document.body.dataset.chapter;
  function updateProgress() {
    const distance = document.documentElement.scrollHeight - innerHeight;
    const percent = distance > 0 ? Math.max(0, Math.min(100, scrollY / distance * 100)) : 0;
    fill.style.width = percent + "%";
    progress.setAttribute("aria-valuenow", String(Math.round(percent)));
    try { localStorage.setItem(progressKey, String(Math.round(percent))); } catch {}
  }
  addEventListener("scroll", updateProgress, { passive: true });
  addEventListener("resize", updateProgress);
  updateProgress();
})();
