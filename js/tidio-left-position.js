(function () {
  function alignFloatingButtons() {
    if (typeof window.derandAlignFloatingFabs === "function") {
      window.derandAlignFloatingFabs();
    }
  }

  var resizeTimer = null;
  function scheduleAlign() {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(alignFloatingButtons, 120);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", alignFloatingButtons, { once: true });
  } else {
    alignFloatingButtons();
  }
  window.addEventListener("load", alignFloatingButtons);
  window.addEventListener("resize", scheduleAlign);
  document.addEventListener("tidioChat-ready", alignFloatingButtons);
})();
