(function (global) {
  "use strict";

  var LANGS = ["en", "de", "al"];

  var T = {
    en: {
      "book-page-title": "Reserve Your Stay | Derand Hotel",
      "book-meta-description":
        "Reserve your stay at Derand Hotel in Pristina. Choose your room, dates, and guests, then complete secure online payment.",
      "book-desktop-header-aria": "Booking page navigation",
      "book-nav-explore": "Explore",
      "book-nav-bookings": "Bookings",
      "book-nav-favorites": "Favorites",
      "book-nav-profile": "Profile",
      "book-nav-book-now": "Book Now",
      "book-hero-kicker": "Exquisite Sanctuary",
      "book-hero-title": "The Art of Refined Living",
      "book-hero-lead":
        "Step into a world where heritage meets modern sophistication. At Derand Hotel, every detail is a curated masterpiece of comfort and prestige.",
      "book-hero-cta": "Explore Rooms",
      "book-label-check-in": "Check-in",
      "book-label-check-out": "Check-out",
      "book-label-guests": "Guests",
      "book-search": "Search",
      "book-guests-1-0": "1 Guest",
      "book-guests-2-0": "2 Guests",
      "book-guests-3-0": "3 Guests",
      "book-guests-4-0": "4 Guests",
      "book-guests-2-1": "2 Adults, 1 Child",
      "book-guests-2-2": "2 Adults, 2 Children",
      "book-guests-3-1": "3 Adults, 1 Child",
      "book-summary-placeholder":
        "Choose your dates and guests, then reserve a room below.",
      "book-room-list-title": "Curated Room Collection",
      "book-room-list-copy":
        "Crafted stays for quiet luxury, business travel, and indulgent city escapes.",
      "book-ribbon-master": "Master Selection",
      "book-kicker-flagship": "Flagship Experience",
      "book-price-starting-at": "Starting at",
      "book-view-360": "View Room 360",
      "book-reserve-room": "Reserve This Room",
      "book-reserve": "Reserve",
      "book-room-junior-suite-label": "Junior Suite",
      "book-room-junior-suite-title": "Junior Suite",
      "book-room-junior-suite-copy":
        "Our most prestigious accommodation, featuring a private fireplace, marble bath, and panoramic garden views.",
      "book-room-junior-suite-alt": "Junior Suite at Derand Hotel",
      "book-room-junior-suite-360-aria": "View Room 360 for Junior Suite",
      "book-room-deluxe-double-label": "Deluxe Double Room",
      "book-room-deluxe-double-title": "Deluxe Double Room",
      "book-room-deluxe-double-copy":
        "A blend of modern efficiency and classic aesthetics, perfect for the discerning solo traveler.",
      "book-room-deluxe-double-alt": "Deluxe Double Room at Derand Hotel",
      "book-room-deluxe-double-360-aria": "View Room 360 for Deluxe Double Room",
      "book-room-premium-double-label": "Premium Room",
      "book-room-premium-double-title": "Premium Room",
      "book-room-premium-double-copy":
        "Enhanced space with a dedicated sitting area and premium amenities for an extended stay.",
      "book-room-premium-double-alt": "Premium Room at Derand Hotel",
      "book-room-premium-double-360-aria": "View Room 360 for Premium Room",
      "book-room-superior-twin-label": "Twin Room",
      "book-room-superior-twin-title": "Twin Room",
      "book-room-superior-twin-copy":
        "Designed for shared comfort without compromising on the signature Heritage Suite luxury.",
      "book-room-superior-twin-alt": "Twin Room at Derand Hotel",
      "book-room-superior-twin-360-aria": "View Room 360 for Twin Room",
      "book-room-superior-double-label": "Superior Double Room",
      "book-room-superior-double-title": "Superior Double Room",
      "book-room-superior-double-copy":
        "Refined comfort with elegant detailing and a serene atmosphere designed for effortless city stays.",
      "book-room-superior-double-alt": "Superior Double Room at Derand Hotel",
      "book-room-superior-double-360-aria": "View Room 360 for Superior Double Room",
      "book-micro-about": "About Us",
      "book-micro-suites": "Suites",
      "book-micro-legal": "Legal",
      "book-micro-contact-aria": "Contact",
      "book-micro-copyright": "\u00a9 2026 Derand Hotel. All rights reserved.",
      "book-guest-adult": "adult",
      "book-guest-adults": "adults",
      "book-guest-child": "child",
      "book-guest-children": "children",
      "book-no-guests": "No guests selected",
      "book-night": "1 night",
      "book-nights": "{count} nights",
      "book-choose-valid-dates": "Choose valid dates",
      "book-price-per-night": "/night",
      "book-price-total": "total",
      "book-price-multi": "({nights} \u00d7 \u20ac{nightly}{perNight})",
      "book-summary-separator": " \u00b7 ",
      "book-summary-to": " to ",
      "book-status-invalid-dates":
        "Please choose a valid check-in and check-out date.",
      "book-status-updated":
        "Dates and guests updated. Choose any room below to continue.",
      "book-status-opening": "Opening guest details for {room}...",
      "book-selected-room": "Selected room",
    },
    de: {
      "book-page-title": "Aufenthalt buchen | Derand Hotel",
      "book-meta-description":
        "Buchen Sie Ihren Aufenthalt im Derand Hotel in Pristina. W\u00e4hlen Sie Zimmer, Daten und G\u00e4ste und schlie\u00dfen Sie die sichere Online-Zahlung ab.",
      "book-desktop-header-aria": "Buchungsseiten-Navigation",
      "book-nav-explore": "Entdecken",
      "book-nav-bookings": "Buchungen",
      "book-nav-favorites": "Favoriten",
      "book-nav-profile": "Profil",
      "book-nav-book-now": "Jetzt Buchen",
      "book-hero-kicker": "Exquisites Refugium",
      "book-hero-title": "Die Kunst des verfeinerten Wohnens",
      "book-hero-lead":
        "Betreten Sie eine Welt, in der Tradition auf moderne Eleganz trifft. Im Derand Hotel ist jedes Detail ein kuratiertes Meisterwerk aus Komfort und Prestige.",
      "book-hero-cta": "Zimmer entdecken",
      "book-label-check-in": "Anreise",
      "book-label-check-out": "Abreise",
      "book-label-guests": "G\u00e4ste",
      "book-search": "Suchen",
      "book-guests-1-0": "1 Gast",
      "book-guests-2-0": "2 G\u00e4ste",
      "book-guests-3-0": "3 G\u00e4ste",
      "book-guests-4-0": "4 G\u00e4ste",
      "book-guests-2-1": "2 Erwachsene, 1 Kind",
      "book-guests-2-2": "2 Erwachsene, 2 Kinder",
      "book-guests-3-1": "3 Erwachsene, 1 Kind",
      "book-summary-placeholder":
        "W\u00e4hlen Sie Daten und G\u00e4ste, dann reservieren Sie unten ein Zimmer.",
      "book-room-list-title": "Kuratierte Zimmerkollektion",
      "book-room-list-copy":
        "Ma\u00dfgeschneiderte Aufenthalte f\u00fcr stille Luxusmomente, Gesch\u00e4ftsreisen und genussvolle Stadtausfl\u00fcge.",
      "book-ribbon-master": "Meisterauswahl",
      "book-kicker-flagship": "Flaggschiff-Erlebnis",
      "book-price-starting-at": "Ab",
      "book-view-360": "Zimmer 360\u00b0 ansehen",
      "book-reserve-room": "Dieses Zimmer reservieren",
      "book-reserve": "Reservieren",
      "book-room-junior-suite-label": "Junior Suite",
      "book-room-junior-suite-title": "Junior Suite",
      "book-room-junior-suite-copy":
        "Unsere prestigetr\u00e4chtigste Unterkunft mit privatem Kamin, Marmorbad und Panoramablick auf den Garten.",
      "book-room-junior-suite-alt": "Junior Suite im Derand Hotel",
      "book-room-junior-suite-360-aria": "Zimmer 360\u00b0 f\u00fcr Junior Suite ansehen",
      "book-room-deluxe-double-label": "Deluxe Doppelzimmer",
      "book-room-deluxe-double-title": "Deluxe Doppelzimmer",
      "book-room-deluxe-double-copy":
        "Eine Verbindung aus moderner Effizienz und klassischer \u00c4sthetik \u2013 perfekt f\u00fcr den anspruchsvollen Alleinreisenden.",
      "book-room-deluxe-double-alt": "Deluxe Doppelzimmer im Derand Hotel",
      "book-room-deluxe-double-360-aria": "Zimmer 360\u00b0 f\u00fcr Deluxe Doppelzimmer ansehen",
      "book-room-premium-double-label": "Premium Zimmer",
      "book-room-premium-double-title": "Premium Zimmer",
      "book-room-premium-double-copy":
        "Mehr Raum mit separatem Sitzbereich und Premium-Ausstattung f\u00fcr einen l\u00e4ngeren Aufenthalt.",
      "book-room-premium-double-alt": "Premium Zimmer im Derand Hotel",
      "book-room-premium-double-360-aria": "Zimmer 360\u00b0 f\u00fcr Premium Zimmer ansehen",
      "book-room-superior-twin-label": "Zweibettzimmer",
      "book-room-superior-twin-title": "Zweibettzimmer",
      "book-room-superior-twin-copy":
        "F\u00fcr gemeinsamen Komfort konzipiert, ohne den Luxus unserer Heritage Suite zu vernachl\u00e4ssigen.",
      "book-room-superior-twin-alt": "Zweibettzimmer im Derand Hotel",
      "book-room-superior-twin-360-aria": "Zimmer 360\u00b0 f\u00fcr Zweibettzimmer ansehen",
      "book-room-superior-double-label": "Superior Doppelzimmer",
      "book-room-superior-double-title": "Superior Doppelzimmer",
      "book-room-superior-double-copy":
        "Verfeinerter Komfort mit eleganten Details und einer ruhigen Atmosph\u00e4re f\u00fcr entspannte Stadtaufenthalte.",
      "book-room-superior-double-alt": "Superior Doppelzimmer im Derand Hotel",
      "book-room-superior-double-360-aria": "Zimmer 360\u00b0 f\u00fcr Superior Doppelzimmer ansehen",
      "book-micro-about": "\u00dcber uns",
      "book-micro-suites": "Suiten",
      "book-micro-legal": "Rechtliches",
      "book-micro-contact-aria": "Kontakt",
      "book-micro-copyright": "\u00a9 2026 Derand Hotel. Alle Rechte vorbehalten.",
      "book-guest-adult": "Erwachsener",
      "book-guest-adults": "Erwachsene",
      "book-guest-child": "Kind",
      "book-guest-children": "Kinder",
      "book-no-guests": "Keine G\u00e4ste ausgew\u00e4hlt",
      "book-night": "1 Nacht",
      "book-nights": "{count} N\u00e4chte",
      "book-choose-valid-dates": "G\u00fcltige Daten w\u00e4hlen",
      "book-price-per-night": "/Nacht",
      "book-price-total": "gesamt",
      "book-price-multi": "({nights} \u00d7 \u20ac{nightly}{perNight})",
      "book-summary-separator": " \u00b7 ",
      "book-summary-to": " bis ",
      "book-status-invalid-dates":
        "Bitte w\u00e4hlen Sie g\u00fcltige An- und Abreisedaten.",
      "book-status-updated":
        "Daten und G\u00e4ste aktualisiert. W\u00e4hlen Sie unten ein Zimmer, um fortzufahren.",
      "book-status-opening": "G\u00e4stedetails f\u00fcr {room} werden ge\u00f6ffnet...",
      "book-selected-room": "Ausgew\u00e4hltes Zimmer",
    },
    al: {
      "book-page-title": "Rezervo Q\u00ebndrimin | Derand Hotel",
      "book-meta-description":
        "Rezervoni q\u00ebndrimin tuaj n\u00eb Derand Hotel n\u00eb Prishtin\u00eb. Zgjidhni dhom\u00ebn, datat dhe mysafir\u00ebt, pastaj p\u00ebrfundoni pages\u00ebn e sigurt online.",
      "book-desktop-header-aria": "Navigimi i faqes s\u00eb rezervimit",
      "book-nav-explore": "Eksploro",
      "book-nav-bookings": "Rezervimet",
      "book-nav-favorites": "T\u00eb preferuarat",
      "book-nav-profile": "Profili",
      "book-nav-book-now": "Rezervo Tani",
      "book-hero-kicker": "Strehim i Rafinuar",
      "book-hero-title": "Arti i Jetes\u00ebs s\u00eb Rafinuar",
      "book-hero-lead":
        "Hyni n\u00eb nj\u00eb bot\u00eb ku trash\u00ebgimia takohet me sofistikimin modern. N\u00eb Derand Hotel, \u00e7do detaj \u00ebsht\u00eb nj\u00eb kryevep\u00ebr e kuruar e rehatis\u00eb dhe prestigjit.",
      "book-hero-cta": "Eksploro Dhomat",
      "book-label-check-in": "Check-in",
      "book-label-check-out": "Check-out",
      "book-label-guests": "Mysafir\u00ebt",
      "book-search": "K\u00ebrko",
      "book-guests-1-0": "1 Mysafir",
      "book-guests-2-0": "2 Mysafir\u00eb",
      "book-guests-3-0": "3 Mysafir\u00eb",
      "book-guests-4-0": "4 Mysafir\u00eb",
      "book-guests-2-1": "2 T\u00eb rritur, 1 F\u00ebmij\u00eb",
      "book-guests-2-2": "2 T\u00eb rritur, 2 F\u00ebmij\u00eb",
      "book-guests-3-1": "3 T\u00eb rritur, 1 F\u00ebmij\u00eb",
      "book-summary-placeholder":
        "Zgjidhni datat dhe mysafir\u00ebt, pastaj rezervoni nj\u00eb dhom\u00eb m\u00eb posht\u00eb.",
      "book-room-list-title": "Koleksioni i Kuruar i Dhomave",
      "book-room-list-copy":
        "Q\u00ebndrime t\u00eb krijuara p\u00ebr luks t\u00eb qet\u00eb, udh\u00ebtim biznesi dhe arratisje urbane t\u00eb k\u00ebnaqshme.",
      "book-ribbon-master": "Zgjedhja Kryesore",
      "book-kicker-flagship": "P\u00ebrjetim Flamurtar",
      "book-price-starting-at": "Duke filluar nga",
      "book-view-360": "Shiko Dhom\u00ebn 360",
      "book-reserve-room": "Rezervo K\u00ebt\u00eb Dhom\u00eb",
      "book-reserve": "Rezervo",
      "book-room-junior-suite-label": "Suit\u00eb Junior",
      "book-room-junior-suite-title": "Suit\u00eb Junior",
      "book-room-junior-suite-copy":
        "Akomodimi yn\u00eb m\u00eb prestigjioz, me oxhak privat, banj\u00eb mermeri dhe pamje panoramike t\u00eb kopshtit.",
      "book-room-junior-suite-alt": "Suit\u00eb Junior n\u00eb Derand Hotel",
      "book-room-junior-suite-360-aria": "Shiko Dhom\u00ebn 360 p\u00ebr Suit\u00eb Junior",
      "book-room-deluxe-double-label": "Dhom\u00eb Dyshe Deluxe",
      "book-room-deluxe-double-title": "Dhom\u00eb Dyshe Deluxe",
      "book-room-deluxe-double-copy":
        "Nj\u00eb kombinim i efikasitetit modern dhe estetik\u00ebs klasike, i p\u00ebrsosur p\u00ebr udh\u00ebtarin e vetmuar me kriter.",
      "book-room-deluxe-double-alt": "Dhom\u00eb Dyshe Deluxe n\u00eb Derand Hotel",
      "book-room-deluxe-double-360-aria": "Shiko Dhom\u00ebn 360 p\u00ebr Dhom\u00eb Dyshe Deluxe",
      "book-room-premium-double-label": "Dhom\u00eb Premium",
      "book-room-premium-double-title": "Dhom\u00eb Premium",
      "book-room-premium-double-copy":
        "Hap\u00ebsir\u00eb e zgjeruar me zon\u00eb uljeje t\u00eb dedikuar dhe pajisje premium p\u00ebr q\u00ebndrim t\u00eb zgjatur.",
      "book-room-premium-double-alt": "Dhom\u00eb Premium n\u00eb Derand Hotel",
      "book-room-premium-double-360-aria": "Shiko Dhom\u00ebn 360 p\u00ebr Dhom\u00eb Premium",
      "book-room-superior-twin-label": "Dhom\u00eb me Dy Krevate",
      "book-room-superior-twin-title": "Dhom\u00eb me Dy Krevate",
      "book-room-superior-twin-copy":
        "E dizajnuar p\u00ebr rehati t\u00eb ndar\u00eb pa kompromisuar luksin e Suit\u00ebs Heritage.",
      "book-room-superior-twin-alt": "Dhom\u00eb me Dy Krevate n\u00eb Derand Hotel",
      "book-room-superior-twin-360-aria": "Shiko Dhom\u00ebn 360 p\u00ebr Dhom\u00eb me Dy Krevate",
      "book-room-superior-double-label": "Dhom\u00eb Dyshe Superior",
      "book-room-superior-double-title": "Dhom\u00eb Dyshe Superior",
      "book-room-superior-double-copy":
        "Rehati e rafinuar me detaje elegante dhe atmosfer\u00eb t\u00eb qet\u00eb p\u00ebr q\u00ebndrime pa mundim n\u00eb qytet.",
      "book-room-superior-double-alt": "Dhom\u00eb Dyshe Superior n\u00eb Derand Hotel",
      "book-room-superior-double-360-aria": "Shiko Dhom\u00ebn 360 p\u00ebr Dhom\u00eb Dyshe Superior",
      "book-micro-about": "Rreth Nesh",
      "book-micro-suites": "Suit\u00eb",
      "book-micro-legal": "Ligjore",
      "book-micro-contact-aria": "Kontakt",
      "book-micro-copyright": "\u00a9 2026 Derand Hotel. T\u00eb gjitha t\u00eb drejtat e rezervuara.",
      "book-guest-adult": "i rritur",
      "book-guest-adults": "t\u00eb rritur",
      "book-guest-child": "f\u00ebmij\u00eb",
      "book-guest-children": "f\u00ebmij\u00eb",
      "book-no-guests": "Asnj\u00eb mysafir i zgjedhur",
      "book-night": "1 nat\u00eb",
      "book-nights": "{count} net\u00eb",
      "book-choose-valid-dates": "Zgjidhni data t\u00eb vlefshme",
      "book-price-per-night": "/nat\u00eb",
      "book-price-total": "total",
      "book-price-multi": "({nights} \u00d7 \u20ac{nightly}{perNight})",
      "book-summary-separator": " \u00b7 ",
      "book-summary-to": " deri ",
      "book-status-invalid-dates":
        "Ju lutemi zgjidhni data t\u00eb vlefshme t\u00eb check-in dhe check-out.",
      "book-status-updated":
        "Datat dhe mysafir\u00ebt u p\u00ebrdit\u00ebsuan. Zgjidhni nj\u00eb dhom\u00eb m\u00eb posht\u00eb p\u00ebr t\u00eb vazhduar.",
      "book-status-opening": "Duke hapur detajet e mysafir\u00ebt p\u00ebr {room}...",
      "book-selected-room": "Dhoma e zgjedhur",
    },
  };

  function normalizeLang(lang) {
    lang = String(lang || "").toLowerCase().trim();
    if (lang === "sq") lang = "al";
    return LANGS.indexOf(lang) >= 0 ? lang : "en";
  }

  function currentLang() {
    var stored =
      localStorage.getItem("derandLang") ||
      localStorage.getItem("selectedLanguage") ||
      localStorage.getItem("language") ||
      localStorage.getItem("lang") ||
      "";
    if (stored) {
      return normalizeLang(stored);
    }

    var activeBtn = document.querySelector(".lang-btn.lang-active[data-lang]");
    if (activeBtn) {
      return normalizeLang(activeBtn.getAttribute("data-lang"));
    }

    var htmlLang = normalizeLang(
      document.documentElement.getAttribute("lang") || "",
    );
    return htmlLang || "en";
  }

  function t(key, lang, vars) {
    lang = normalizeLang(lang || currentLang());
    var pack = T[lang] || T.en;
    var text = pack[key];
    if (text == null) text = T.en[key];
    if (text == null) text = key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        text = text.split("{" + name + "}").join(String(vars[name]));
      });
    }
    return text;
  }

  var HEADER_FREEZE_ROOTS =
    ".header, .offcanvas-menu-wrapper, #mobile-menu-wrap";

  function freezeHeaderChrome() {
    document.querySelectorAll(HEADER_FREEZE_ROOTS).forEach(function (root) {
      root.querySelectorAll("[data-i18n]").forEach(function (node) {
        if (!node.hasAttribute("data-i18n-chrome-frozen")) {
          node.setAttribute("data-i18n-chrome-frozen", node.textContent);
          node.removeAttribute("data-i18n");
        }
        node.textContent = node.getAttribute("data-i18n-chrome-frozen");
      });
    });
  }

  function isBookScopedNode(node) {
    return (
      !!node.closest(".booking-ui") &&
      !node.closest(".header") &&
      !node.closest(".footer") &&
      !node.closest(".site-whatsapp-wrap")
    );
  }

  function applyNodes(selector, attr, applyFn, lang) {
    document.querySelectorAll(selector).forEach(function (node) {
      if (!isBookScopedNode(node)) return;
      var key = node.getAttribute(attr);
      if (!key) return;
      applyFn(node, t(key, lang));
    });
  }

  function applyPage(lang) {
    lang = normalizeLang(lang);

    document.documentElement.setAttribute("lang", lang === "al" ? "sq" : lang);
    document.title = t("book-page-title", lang);

    var metaDesc = document.querySelector('meta[name="description"][data-i18n]');
    if (metaDesc) {
      metaDesc.setAttribute("content", t(metaDesc.getAttribute("data-i18n"), lang));
    }

    applyNodes("[data-i18n]", "data-i18n", function (node, value) {
      node.textContent = value;
    }, lang);
    applyNodes("[data-i18n-placeholder]", "data-i18n-placeholder", function (node, value) {
      node.setAttribute("placeholder", value);
    }, lang);
    applyNodes("[data-i18n-aria-label]", "data-i18n-aria-label", function (node, value) {
      node.setAttribute("aria-label", value);
    }, lang);
    applyNodes("[data-i18n-html]", "data-i18n-html", function (node, value) {
      node.innerHTML = value;
    }, lang);
    applyNodes("[data-i18n-alt]", "data-i18n-alt", function (node, value) {
      node.setAttribute("alt", value);
    }, lang);

    document.dispatchEvent(
      new CustomEvent("derand:languagechange", { detail: { lang: lang } }),
    );
  }

  function init() {
    freezeHeaderChrome();
    applyPage(currentLang());
    window.addEventListener("load", function () {
      freezeHeaderChrome();
      window.setTimeout(function () {
        applyPage(currentLang());
      }, 50);
    });
    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".lang-btn[data-lang]");
      if (!btn) return;
      var lang = normalizeLang(btn.getAttribute("data-lang"));
      window.setTimeout(function () {
        freezeHeaderChrome();
        applyPage(lang);
      }, 150);
    });
  }

  global.BookI18n = {
    t: t,
    currentLang: currentLang,
    applyPage: applyPage,
    init: init,
  };

  if (document.querySelector(".header")) {
    freezeHeaderChrome();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window);
