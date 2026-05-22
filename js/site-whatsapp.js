(function () {
  var WA_URL = "https://wa.me/38343727272";
  var START_DELAY_MS = 400;
  var LETTER_DELAY_MS = 65;
  var HOLD_BEFORE_CLOSE_MS = 1800;
  var labelClosed = false;

  var LABELS = {
    en: "Chat us on WhatsApp",
    de: "Schreiben Sie uns auf WhatsApp",
    al: "Na shkruani në WhatsApp",
  };

  var typewriterTimer = null;
  var labelEl = null;
  var labelTextEl = null;
  var anchorEl = null;

  function assetSrc(filename) {
    var link = document.querySelector('link[rel="stylesheet"][href*="css/style"]');
    if (link && link.href) {
      try {
        return new URL("../img/" + filename, link.href).href;
      } catch (e) {}
    }
    return "img/" + filename;
  }

  function logoSrc() {
    return assetSrc("logowhatsapp.png");
  }

  function labelMarkSrc() {
    return assetSrc("whts.png");
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
    if (!labelEl || !labelTextEl) return;
    clearTypewriterTimer();
    labelTextEl.textContent = text;
    labelEl.classList.add("is-visible", "is-complete");
    labelEl.classList.remove("is-typing", "is-closing");
    updateAccessibleName();
  }

  function showTidioAfterWhatsAppLabel() {
    if (typeof window.derandOnWhatsAppLabelClosing === "function") {
      window.derandOnWhatsAppLabelClosing();
    } else if (typeof window.derandLoadTidioChat === "function") {
      window.derandLoadTidioChat();
    }
  }

  function closeLabelSlowly() {
    if (!labelEl || labelClosed) return;
    labelClosed = true;
    clearTypewriterTimer();
    labelEl.classList.remove("is-typing");
    labelEl.classList.add("is-closing");
    showTidioAfterWhatsAppLabel();

    function finishClose() {
      if (!labelEl) return;
      labelEl.classList.remove("is-visible", "is-complete", "is-closing");
      if (labelTextEl) labelTextEl.textContent = "";
    }

    labelEl.addEventListener("transitionend", finishClose, { once: true });
    window.setTimeout(finishClose, 950);
  }

  function scheduleLabelClose() {
    if (labelClosed || !window.__derandUseOnboardingSequence) return;
    window.setTimeout(closeLabelSlowly, HOLD_BEFORE_CLOSE_MS);
  }

  function startTypewriter() {
    if (!labelEl || !labelTextEl) return;
    clearTypewriterTimer();
    var text = getLabelText();
    var index = 0;
    labelTextEl.textContent = "";
    labelEl.classList.add("is-visible", "is-typing");
    labelEl.classList.remove("is-complete");

    function typeNextLetter() {
      if (!labelEl || !labelTextEl) return;
      if (index > text.length) {
        labelEl.classList.remove("is-typing");
        labelEl.classList.add("is-complete");
        typewriterTimer = null;
        updateAccessibleName();
        scheduleLabelClose();
        return;
      }
      labelTextEl.textContent = text.slice(0, index);
      index += 1;
      typewriterTimer = window.setTimeout(typeNextLetter, LETTER_DELAY_MS);
    }

    typewriterTimer = window.setTimeout(typeNextLetter, START_DELAY_MS);
  }

  function onLanguageChange() {
    if (!labelEl || labelClosed) return;
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

    labelTextEl = document.createElement("span");
    labelTextEl.className = "site-whatsapp-fab__label-text";

    var labelMark = document.createElement("img");
    labelMark.className = "site-whatsapp-fab__label-mark";
    labelMark.src = labelMarkSrc();
    labelMark.alt = "";
    labelMark.width = 16;
    labelMark.height = 16;
    labelMark.decoding = "async";
    labelMark.loading = "lazy";

    labelEl.appendChild(labelTextEl);
    labelEl.appendChild(labelMark);

    anchorEl.appendChild(icon);
    anchorEl.appendChild(labelEl);
    wrap.appendChild(anchorEl);
    document.body.appendChild(wrap);

    updateAccessibleName();
    bindLanguageListeners();
    startTypewriter();

    function syncFabAlignment() {
      if (typeof window.derandAlignFloatingFabs === "function") {
        window.derandAlignFloatingFabs();
      }
    }
    requestAnimationFrame(syncFabAlignment);
    window.setTimeout(syncFabAlignment, 400);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountWhatsAppFab);
  } else {
    mountWhatsAppFab();
  }
})();
