(() => {
  const reel = document.querySelector("[data-reel]");
  if (!reel) return;

  const frames = Array.from(reel.querySelectorAll("[data-reel-frame]"));
  const counter = document.querySelector("[data-reel-counter]");
  const caption = document.querySelector("[data-reel-caption]");
  const toggle = document.querySelector("[data-reel-toggle]");
  if (frames.length < 2 || !toggle) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const intervalMs = 4300;
  let activeIndex = Math.max(0, frames.findIndex((frame) => frame.classList.contains("is-active")));
  let timer = null;
  let pausedByUser = reducedMotion;

  const paintFrame = () => {
    if (counter) counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(frames.length).padStart(2, "0")}`;
    if (caption) caption.textContent = frames[activeIndex].dataset.caption || "";
  };

  const stopTimer = () => {
    window.clearInterval(timer);
    timer = null;
  };

  const updateControls = () => {
    const playing = !pausedByUser;
    reel.classList.toggle("is-paused", !playing);
    toggle.textContent = playing ? "Пауза" : reducedMotion ? "Запустить" : "Продолжить";
    toggle.setAttribute("aria-pressed", String(playing));
  };

  const advance = () => {
    frames[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % frames.length;
    frames[activeIndex].classList.add("is-active");
    paintFrame();
  };

  const startTimer = () => {
    stopTimer();
    if (!pausedByUser && !document.hidden) timer = window.setInterval(advance, intervalMs);
  };

  toggle.addEventListener("click", () => {
    pausedByUser = !pausedByUser;
    updateControls();
    startTimer();
  });

  document.addEventListener("visibilitychange", () => {
    if (!pausedByUser) startTimer();
  });

  paintFrame();
  updateControls();
  startTimer();
})();
