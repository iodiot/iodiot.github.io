(() => {
  const progress = document.querySelector("#guide-progress");
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    progress.style.width = amount + "%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  document.querySelectorAll("[data-stepper]").forEach((root) => {
    const buttons = [...root.querySelectorAll("[data-step]")];
    const panels = [...root.querySelectorAll("[data-panel]")];
    const nodes = [...root.querySelectorAll("[data-diagram-step]")];
    const activate = (key) => {
      buttons.forEach((button) => {
        const selected = button.dataset.step === key;
        button.setAttribute("aria-pressed", String(selected));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== key;
      });
      nodes.forEach((node) => {
        node.classList.toggle("active", node.dataset.diagramStep === key);
      });
    };
    buttons.forEach((button) => button.addEventListener("click", () => activate(button.dataset.step)));
    if (buttons[0]) activate(buttons[0].dataset.step);
  });

  document.querySelectorAll("[data-agent-estimator]").forEach((root) => {
    const input = root.querySelector("input");
    const countOutput = root.querySelector("[data-agent-count]");
    const workgroupOutput = root.querySelector("[data-workgroup-count]");
    const drawMeter = root.querySelector("[data-load-meter]");
    if (!input || !countOutput || !workgroupOutput) return;
    const update = () => {
      const count = Number(input.value);
      const workgroups = Math.ceil(count / 256);
      countOutput.textContent = count.toLocaleString("en-US");
      workgroupOutput.textContent = workgroups.toLocaleString("en-US");
      if (drawMeter) drawMeter.style.setProperty("--meter", (count / 1000) + "%");
      input.setAttribute("aria-valuetext", count.toLocaleString("en-US") + " agents");
    };
    input.addEventListener("input", update);
    update();
  });

  document.querySelectorAll("[data-range-tabs]").forEach((root) => {
    const buttons = [...root.querySelectorAll("[data-range]")];
    const output = root.querySelector("[data-range-description]");
    const descriptions = {
      "24h": "A focused view of the last 24 hours.",
      "7d": "A one-week view for short-term regional patterns.",
      "30d": "The full month window from the primary USGS feed."
    };
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => {
          const selected = item === button;
          item.setAttribute("aria-pressed", String(selected));
        });
        if (output) output.textContent = descriptions[button.dataset.range] || "";
      });
    });
  });

  const sections = [...document.querySelectorAll(".guide-section[id]")];
  const tocLinks = [...document.querySelectorAll(".guide-toc a[href^='#']")];
  if ("IntersectionObserver" in window && sections.length && tocLinks.length) {
    const linkById = new Map(tocLinks.map((link) => [link.hash.slice(1), link]));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      tocLinks.forEach((link) => {
        const active = link === linkById.get(visible[0].target.id);
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-22% 0px -62% 0px", threshold: [0, .2, .5, 1] });
    sections.forEach((section) => observer.observe(section));
  }
})();
