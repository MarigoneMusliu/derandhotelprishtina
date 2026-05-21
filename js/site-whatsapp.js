(function () {
  var WA_URL = "https://wa.me/38343727272";
  var START_DELAY_MS = 1000;
  var LETTER_DELAY_MS = 65;

  var LABELS = {
    en: "Chat us on WhatsApp",
    de: "Schreiben Sie uns auf WhatsApp",
    al: "Na shkruani në WhatsApp",
  };

  var typewriterTimer = null;
  var labelEl = null;
  var anchorEl = null;

  function logoSrc() {
    var link = document.querySelector('link[rel="stylesheet"][href*="css/style"]');
    if (link && link.href) {
      try {
        return new URL("../img/logowhatsapp.png", link.href).href;
      } catch (e) {}
    }
    return "img/logowhatsapp.png";
  }

  function getLang() {
    var activeBtn = document.querySelector(".lang-btn.lang-active[data-lang]");
    if (activeBtn) {
      return activeBtn.getAttribute("data-lang") || "en";
    }
    var htmlLang = (document.documentElement.getAttribute("lang") || "en")
      .toLowerCase()
      .trim();
    if (htmlLang === "de") return "de";
    if (htmlLang === "al" || htmlLang === "sq") return "al";
    try {
      var stored = (
        localStorage.getItem("derandLang") ||
        localStorage.getItem("selectedLanguage") ||
        localStorage.getItem("language") ||
        localStorage.getItem("lang") ||
        "en"
      )
        .toLowerCase()
        .trim();
      if (stored === "de" || stored === "al") return stored;
    } catch (e) {}
    return "en";
  }

  function getLabelText() {
    return LABELS[getLang()] || LABELS.en;
  }

  function clearTypewriterTimer() {
    if (typewriterTimer) {
      window.clearTimeout(typewriterTimer);
      typewriterTimer = null;
    }
  }

  function updateAccessibleName() {
    if (!anchorEl) return;
    anchorEl.setAttribute(
      "aria-label",
      getLabelText() + " (+383 43 727 272)",
    );
  }

  function setLabelTextInstant(text) {
    if (!labelEl) return;
    clearTypewriterTimer();
    labelEl.textContent = text;
    labelEl.classList.add("is-visible", "is-complete");
    labelEl.classList.remove("is-typing");
    updateAccessibleName();
  }

  function startTypewriter() {
    if (!labelEl) return;
    clearTypewriterTimer();
    var text = getLabelText();
    var index = 0;
    labelEl.textContent = "";
    labelEl.classList.add("is-visible", "is-typing");
    labelEl.classList.remove("is-complete");

    function typeNextLetter() {
      if (!labelEl) return;
      if (index > text.length) {
        labelEl.classList.remove("is-typing");
        labelEl.classList.add("is-complete");
        typewriterTimer = null;
        updateAccessibleName();
        return;
      }
      labelEl.textContent = text.slice(0, index);
      index += 1;
      typewriterTimer = window.setTimeout(typeNextLetter, LETTER_DELAY_MS);
    }

    typewriterTimer = window.setTimeout(typeNextLetter, START_DELAY_MS);
  }

  function onLanguageChange() {
    if (!labelEl) return;
    if (labelEl.classList.contains("is-complete")) {
      setLabelTextInstant(getLabelText());
      return;
    }
    if (labelEl.classList.contains("is-visible")) {
      clearTypewriterTimer();
      startTypewriter();
    }
  }

  function bindLanguageListeners() {
    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".lang-btn[data-lang]");
      if (!btn) return;
      window.setTimeout(onLanguageChange, 80);
    });

    if (window.jQuery) {
      window.jQuery(document).on("click", ".lang-btn[data-lang]", function () {
        window.setTimeout(onLanguageChange, 80);
      });
    }
  }

  function mountWhatsAppFab() {
    if (document.getElementById("site-whatsapp-wrap")) return;

    var wrap = document.createElement("div");
    wrap.id = "site-whatsapp-wrap";
    wrap.className = "site-whatsapp-wrap";

    anchorEl = document.createElement("a");
    anchorEl.id = "site-whatsapp-fab";
    anchorEl.className = "site-whatsapp-fab";
    anchorEl.href = WA_URL;
    anchorEl.target = "_blank";
    anchorEl.rel = "noopener noreferrer";

    var icon = document.createElement("span");
    icon.className = "site-whatsapp-fab__icon";

    var img = document.createElement("img");
    img.src = logoSrc();
    img.alt = "";
    img.width = 52;
    img.height = 52;
    img.decoding = "async";
    img.loading = "lazy";
    icon.appendChild(img);

    labelEl = document.createElement("span");
    labelEl.className = "site-whatsapp-fab__label";
    labelEl.setAttribute("data-i18n", "whatsapp-chat-label");

    anchorEl.appendChild(icon);
    anchorEl.appendChild(labelEl);
    wrap.appendChild(anchorEl);
    document.body.appendChild(wrap);

    updateAccessibleName();
    bindLanguageListeners();
    startTypewriter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountWhatsAppFab);
  } else {
    mountWhatsAppFab();
  }
})();
