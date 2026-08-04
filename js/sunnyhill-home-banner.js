(function () {
  var STORAGE_KEY = "derand_sunnyhill_home_banner_v2";
  var CLOSE_MS = 320;

  var copy = {
    en: {
      badge: "Sunny Hill Festival",
      text: "<strong>Rooms available</strong> for 31 Jul – 3 Aug 2026. Stay at Derand Hotel during the festival.",
      cta: "View rooms",
      close: "Dismiss Sunny Hill Festival announcement",
    },
    de: {
      badge: "Sunny Hill Festival",
      text: "<strong>Zimmer verfügbar</strong> für 31. Juli – 3. August 2026. Übernachten Sie im Derand Hotel während des Festivals.",
      cta: "Zimmer ansehen",
      close: "Sunny-Hill-Festival-Hinweis schließen",
    },
    al: {
      badge: "Sunny Hill Festival",
      text: "<strong>Dhoma të disponueshme</strong> për 31 korrik – 3 gusht 2026. Qendro në Derand Hotel gjatë festivalit.",
      cta: "Shiko dhomat",
      close: "Mbyll njoftimin e Sunny Hill Festival",
    },
  };

  function activeLang() {
    var activeBtn = document.querySelector(".lang-btn.lang-active[data-lang]");
    return (activeBtn && activeBtn.getAttribute("data-lang")) || "en";
  }

  function applyCopy(lang) {
    var pack = copy[lang] || copy.en;
    var badge = document.querySelector("[data-sunnyhill-banner='badge']");
    var text = document.querySelector("[data-sunnyhill-banner='text']");
    var cta = document.querySelector("[data-sunnyhill-banner='cta']");
    var closeBtn = document.querySelector(".sunnyhill-home-banner__close");

    if (badge) badge.textContent = pack.badge;
    if (text) text.innerHTML = pack.text;
    if (cta) cta.textContent = pack.cta;
    if (closeBtn) closeBtn.setAttribute("aria-label", pack.close);
  }

  function syncOffset(banner) {
    if (!banner || !document.body.classList.contains("has-sunnyhill-banner")) {
      document.documentElement.style.removeProperty("--sunnyhill-banner-offset");
      return;
    }

    document.documentElement.style.setProperty(
      "--sunnyhill-banner-offset",
      banner.offsetHeight + "px",
    );
  }

  function showBanner(banner) {
    banner.hidden = false;
    applyCopy(activeLang());
    document.body.classList.add("has-sunnyhill-banner");
    syncOffset(banner);

    window.requestAnimationFrame(function () {
      syncOffset(banner);
      banner.classList.add("is-visible");
    });
  }

  function dismissBanner(banner) {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {}

    banner.classList.remove("is-visible");
    banner.classList.add("is-closing");
    document.body.classList.remove("has-sunnyhill-banner");
    document.documentElement.style.removeProperty("--sunnyhill-banner-offset");

    window.setTimeout(function () {
      banner.hidden = true;
      banner.classList.remove("is-closing");
    }, CLOSE_MS);
  }

  function init() {
    var banner = document.getElementById("sunnyhill-home-banner");
    if (!banner) return;

    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch (e) {}

    var closeBtn = banner.querySelector(".sunnyhill-home-banner__close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        dismissBanner(banner);
      });
    }

    window.addEventListener("resize", function () {
      syncOffset(banner);
    });

    if (typeof ResizeObserver !== "undefined") {
      var observer = new ResizeObserver(function () {
        syncOffset(banner);
      });
      observer.observe(banner);
    }

    document.querySelectorAll(".lang-btn[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.setTimeout(function () {
          applyCopy(activeLang());
          syncOffset(banner);
        }, 60);
      });
    });

    window.setTimeout(function () {
      showBanner(banner);
    }, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
