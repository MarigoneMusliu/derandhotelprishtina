(() => {
  "use strict";

  const LABELS = {
    en: "Size",
    de: "Groesse",
    al: "Madhesia",
  };

  const readLanguage = () => {
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("de")) return "de";
    if (htmlLang.startsWith("al") || htmlLang.startsWith("sq")) return "al";

    const stored =
      (localStorage.getItem("selectedLanguage") ||
        localStorage.getItem("language") ||
        localStorage.getItem("lang") ||
        "")
        .toLowerCase()
        .trim();

    if (stored === "de") return "de";
    if (stored === "al" || stored === "sq") return "al";
    return "en";
  };

  const applySizeLabels = () => {
    const lang = readLanguage();
    const value = LABELS[lang] || LABELS.en;
    document.querySelectorAll("[data-i18n$='-size-label']").forEach((node) => {
      node.textContent = value;
    });

    // Keep existing EN/AL text untouched; enforce requested DE wording.
    if (lang === "de") {
      document.querySelectorAll("[data-i18n$='-concierge-label']").forEach((node) => {
        node.textContent = "Concierge-Service";
      });
    }
  };

  document.addEventListener("DOMContentLoaded", applySizeLabels, { once: true });
  window.addEventListener("load", applySizeLabels);
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".lang-btn[data-lang]");
    if (!btn) return;
    window.setTimeout(applySizeLabels, 0);
  });
})();
