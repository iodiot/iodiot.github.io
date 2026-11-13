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

  document.querySelectorAll("[data-quake-example]").forEach((root) => {
    const magnitude = Number(root.dataset.magnitude);
    const place = root.dataset.place || "";
    const minimumInput = root.querySelector("input[type='range']");
    const queryInput = root.querySelector("input[type='search']");
    const minimumOutput = root.querySelector("[data-example-mag-output]");
    const result = root.querySelector("[data-matches]");
    const heading = root.querySelector("[data-example-result-heading]");
    const detail = root.querySelector("[data-example-result-detail]");
    if (!minimumInput || !queryInput || !result || !heading || !detail) return;
    const update = () => {
      const minimum = Number(minimumInput.value);
      const query = queryInput.value.trim();
      const magnitudeMatches = magnitude >= minimum;
      const placeMatches = !query || place.toLowerCase().includes(query.toLowerCase());
      const included = magnitudeMatches && placeMatches;
      if (minimumOutput) minimumOutput.textContent = `M${minimum.toFixed(1)}+`;
      minimumInput.setAttribute("aria-valuetext", `M${minimum.toFixed(1)} and above`);
      result.dataset.matches = String(included);
      heading.textContent = included ? "Included" : "Filtered out";
      if (included) {
        detail.textContent = `M${magnitude.toFixed(1)} meets the M${minimum.toFixed(1)} minimum${query ? `, and the place contains “${query}” (case-insensitive).` : "; no place text filter is active."}`;
      } else {
        const reasons = [];
        if (!magnitudeMatches) reasons.push(`M${magnitude.toFixed(1)} is below the M${minimum.toFixed(1)} minimum`);
        if (!placeMatches) reasons.push(`the place does not contain “${query}”`);
        detail.textContent = reasons.join("; ") + ".";
      }
    };
    minimumInput.addEventListener("input", update);
    queryInput.addEventListener("input", update);
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

})();
