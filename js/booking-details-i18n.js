(function (global) {
  "use strict";

  var LANGS = ["en", "de", "al"];

  var T = {
    en: {
      "bd-page-title": "Booking Details | Derand Hotel",
      "bd-meta-description":
        "Complete your Derand Hotel booking details before secure payment.",
      "bd-desktop-header-aria": "Booking navigation",
      "bd-nav-explore": "Explore",
      "bd-nav-bookings": "Bookings",
      "bd-nav-favorites": "Favorites",
      "bd-nav-profile": "Profile",
      "bd-nav-book-now": "Book Now",
      "bd-back-rooms": "Rooms",
      "bd-menu-aria": "More options",
      "bd-progress-aria": "Booking progress",
      "bd-progress-guest-details": "Guest details",
      "bd-checkout-title": "Guest & Payment Details",
      "bd-concierge-kicker": "Treat your stay",
      "bd-concierge-title": "What should we bring to your room?",
      "bd-concierge-lead":
        "Tap a picture below \u2014 browse, pick your favourite, we deliver. Easy.",
      "bd-chip-flowers": "Flowers",
      "bd-chip-champagne": "Champagne",
      "bd-chip-chocolate": "Chocolate",
      "bd-chip-perfume": "Perfume",
      "bd-chip-decor": "Decor",
      "bd-chip-laundry": "Laundry",
      "bd-guest-info-title": "Guest Information",
      "bd-label-room": "Room",
      "bd-label-check-in": "Check-in",
      "bd-label-check-out": "Check-out",
      "bd-label-full-name": "Full Name",
      "bd-label-email": "Email Address",
      "bd-label-phone": "Phone Number",
      "bd-label-adults": "Adults",
      "bd-label-children": "Children",
      "bd-stepper-decrease-adults": "Decrease adults",
      "bd-stepper-increase-adults": "Increase adults",
      "bd-stepper-decrease-children": "Decrease children",
      "bd-stepper-increase-children": "Increase children",
      "bd-aria-adults": "Adults",
      "bd-aria-children": "Children",
      "bd-child-years-title": "Children Years",
      "bd-child-years-note":
        "Premium Room policy: children up to 3 years are free, 4+ years add \u20ac20 per child.",
      "bd-child-age-label": "Child {num} age",
      "bd-child-age-placeholder": "Years",
      "bd-extras-delivery-title": "When should we deliver your extras?",
      "bd-extras-delivery-lead":
        "Choose a date and time during your stay. We will bring your order to your room.",
      "bd-label-delivery-date": "Delivery date",
      "bd-label-delivery-time": "Delivery time",
      "bd-label-delivery-notes": "Delivery notes (optional)",
      "bd-delivery-notes-placeholder":
        "Card message, surprise timing, or other instructions",
      "bd-label-special-requests": "Special Requests (Optional)",
      "bd-summary-dates": "Dates",
      "bd-summary-stay": "Stay",
      "bd-summary-unified-note":
        "Your booking total is paid in one secure checkout.",
      "bd-summary-total-due": "Total due",
      "bd-confirm-payment": "Complete secure payment",
      "bd-benefit-rate-aria": "Best rate guarantee",
      "bd-benefit-rate": "Best Rate Guarantee",
      "bd-benefit-concierge-aria": "24/7 concierge",
      "bd-benefit-concierge": "24/7 Concierge",
      "bd-security-aria": "Secure payment note",
      "bd-security-text":
        "Your payment information is encrypted and processed securely by our global financial partners.",
      "bd-footer-copyright":
        "\u00a92026 Derand Hotel. Excellence in hospitality since 1990. Providing curated luxury experiences across Kosovo.",
      "bd-footer-discover": "Discover",
      "bd-footer-about": "About Us",
      "bd-footer-rooms": "Rooms & Suites",
      "bd-footer-support": "Support",
      "bd-footer-contact": "Contact",
      "bd-footer-terms": "Terms of Service",
      "bd-footer-legal": "Legal",
      "bd-footer-privacy": "Privacy Policy",
      "bd-footer-payments": "Payments",
      "bd-room-junior-suite-label": "Junior Suite",
      "bd-room-deluxe-double-label": "Deluxe Double Room",
      "bd-room-premium-double-label": "Premium Room",
      "bd-room-superior-twin-label": "Superior Twin Room",
      "bd-room-superior-double-label": "Superior Double Room",
      "bd-room-junior-suite-meta": "37 m\u00b2 / King bed",
      "bd-room-deluxe-double-meta": "30 m\u00b2 / King bed",
      "bd-room-premium-double-meta": "28 m\u00b2 / King bed",
      "bd-room-superior-twin-meta": "23 m\u00b2 / Twin beds",
      "bd-room-superior-double-meta": "22 m\u00b2 / King bed",
      "bd-guest-adult": "Adult",
      "bd-guest-adults": "Adults",
      "bd-guest-child": "Child",
      "bd-guest-children": "Children",
      "bd-no-guests": "No guests",
      "bd-night": "night",
      "bd-nights": "nights",
      "bd-night-cap": "Night",
      "bd-nights-cap": "Nights",
      "bd-rate-per-night": "{price} / night",
      "bd-rate-per-night-room": "{price} / night (room rate)",
      "bd-room-total-label": "{room} ({nights})",
      "bd-summary-room-alt": "{room} at Derand Hotel",
      "bd-remove-extra": "Remove {label}",
      "bd-extras-none": "(none)",
      "bd-alert-children-premium":
        "Children are available only for Premium Room due to space limits.",
      "bd-status-delivery-required":
        "Please choose when to deliver your extras to your room.",
      "bd-status-guest-required": "Please complete the highlighted guest details.",
      "bd-status-sending": "Sending\u2026",
      "bd-status-thanks": "Thank you \u2014 we received your message.",
      "bd-status-error":
        "Something went wrong ({message}). Please email info@derandhotel.com.",
      "bd-alert-form-incomplete":
        "Please fill all fields except Children and Special Requests before confirming your booking.",
    },
    de: {
      "bd-page-title": "Buchungsdetails | Derand Hotel",
      "bd-meta-description":
        "Vervollst\u00e4ndigen Sie Ihre Buchungsdetails im Derand Hotel vor der sicheren Zahlung.",
      "bd-desktop-header-aria": "Buchungsnavigation",
      "bd-nav-explore": "Entdecken",
      "bd-nav-bookings": "Buchungen",
      "bd-nav-favorites": "Favoriten",
      "bd-nav-profile": "Profil",
      "bd-nav-book-now": "Jetzt Buchen",
      "bd-back-rooms": "Zimmer",
      "bd-menu-aria": "Weitere Optionen",
      "bd-progress-aria": "Buchungsfortschritt",
      "bd-progress-guest-details": "G\u00e4stedaten",
      "bd-checkout-title": "G\u00e4ste- & Zahlungsdetails",
      "bd-concierge-kicker": "Verw\u00f6hnen Sie Ihren Aufenthalt",
      "bd-concierge-title": "Was sollen wir auf Ihr Zimmer bringen?",
      "bd-concierge-lead":
        "Tippen Sie unten auf ein Bild \u2014 st\u00f6bern, ausw\u00e4hlen, wir liefern. Ganz einfach.",
      "bd-chip-flowers": "Blumen",
      "bd-chip-champagne": "Champagner",
      "bd-chip-chocolate": "Schokolade",
      "bd-chip-perfume": "Parf\u00fcm",
      "bd-chip-decor": "Dekoration",
      "bd-chip-laundry": "W\u00e4scheservice",
      "bd-guest-info-title": "G\u00e4steinformationen",
      "bd-label-room": "Zimmer",
      "bd-label-check-in": "Anreise",
      "bd-label-check-out": "Abreise",
      "bd-label-full-name": "Vollst\u00e4ndiger Name",
      "bd-label-email": "E-Mail-Adresse",
      "bd-label-phone": "Telefonnummer",
      "bd-label-adults": "Erwachsene",
      "bd-label-children": "Kinder",
      "bd-stepper-decrease-adults": "Erwachsene verringern",
      "bd-stepper-increase-adults": "Erwachsene erh\u00f6hen",
      "bd-stepper-decrease-children": "Kinder verringern",
      "bd-stepper-increase-children": "Kinder erh\u00f6hen",
      "bd-aria-adults": "Erwachsene",
      "bd-aria-children": "Kinder",
      "bd-child-years-title": "Alter der Kinder",
      "bd-child-years-note":
        "Premium-Zimmer: Kinder bis 3 Jahre kostenlos, ab 4 Jahren +20 \u20ac pro Kind.",
      "bd-child-age-label": "Alter Kind {num}",
      "bd-child-age-placeholder": "Jahre",
      "bd-extras-delivery-title": "Wann sollen wir Ihre Extras liefern?",
      "bd-extras-delivery-lead":
        "W\u00e4hlen Sie Datum und Uhrzeit w\u00e4hrend Ihres Aufenthalts. Wir bringen die Bestellung auf Ihr Zimmer.",
      "bd-label-delivery-date": "Lieferdatum",
      "bd-label-delivery-time": "Lieferzeit",
      "bd-label-delivery-notes": "Lieferhinweise (optional)",
      "bd-delivery-notes-placeholder":
        "Kartentext, \u00dcberraschungszeitpunkt oder andere Hinweise",
      "bd-label-special-requests": "Besondere W\u00fcnsche (optional)",
      "bd-summary-dates": "Daten",
      "bd-summary-stay": "Aufenthalt",
      "bd-summary-unified-note":
        "Ihr Buchungsgesamtbetrag wird in einem sicheren Checkout bezahlt.",
      "bd-summary-total-due": "Gesamtbetrag",
      "bd-confirm-payment": "Sichere Zahlung abschlie\u00dfen",
      "bd-benefit-rate-aria": "Bestpreisgarantie",
      "bd-benefit-rate": "Bestpreisgarantie",
      "bd-benefit-concierge-aria": "Concierge rund um die Uhr",
      "bd-benefit-concierge": "24/7 Concierge",
      "bd-security-aria": "Hinweis zur sicheren Zahlung",
      "bd-security-text":
        "Ihre Zahlungsinformationen werden verschl\u00fcsselt und sicher von unseren globalen Finanzpartnern verarbeitet.",
      "bd-footer-copyright":
        "\u00a92026 Derand Hotel. Exzellenz in der Gastfreundschaft seit 1990. Kuratierte Luxuserlebnisse in ganz Kosovo.",
      "bd-footer-discover": "Entdecken",
      "bd-footer-about": "\u00dcber uns",
      "bd-footer-rooms": "Zimmer & Suiten",
      "bd-footer-support": "Support",
      "bd-footer-contact": "Kontakt",
      "bd-footer-terms": "Nutzungsbedingungen",
      "bd-footer-legal": "Rechtliches",
      "bd-footer-privacy": "Datenschutz",
      "bd-footer-payments": "Zahlungen",
      "bd-room-junior-suite-label": "Junior Suite",
      "bd-room-deluxe-double-label": "Deluxe Doppelzimmer",
      "bd-room-premium-double-label": "Premium Zimmer",
      "bd-room-superior-twin-label": "Superior Zweibettzimmer",
      "bd-room-superior-double-label": "Superior Doppelzimmer",
      "bd-room-junior-suite-meta": "37 m\u00b2 / Kingsize-Bett",
      "bd-room-deluxe-double-meta": "30 m\u00b2 / Kingsize-Bett",
      "bd-room-premium-double-meta": "28 m\u00b2 / Kingsize-Bett",
      "bd-room-superior-twin-meta": "23 m\u00b2 / Zwei Einzelbetten",
      "bd-room-superior-double-meta": "22 m\u00b2 / Kingsize-Bett",
      "bd-guest-adult": "Erwachsener",
      "bd-guest-adults": "Erwachsene",
      "bd-guest-child": "Kind",
      "bd-guest-children": "Kinder",
      "bd-no-guests": "Keine G\u00e4ste",
      "bd-night": "Nacht",
      "bd-nights": "N\u00e4chte",
      "bd-night-cap": "Nacht",
      "bd-nights-cap": "N\u00e4chte",
      "bd-rate-per-night": "{price} / Nacht",
      "bd-rate-per-night-room": "{price} / Nacht (Zimmerpreis)",
      "bd-room-total-label": "{room} ({nights})",
      "bd-summary-room-alt": "{room} im Derand Hotel",
      "bd-remove-extra": "{label} entfernen",
      "bd-extras-none": "(keine)",
      "bd-alert-children-premium":
        "Kinder sind nur im Premium-Zimmer aufgrund des begrenzten Platzes m\u00f6glich.",
      "bd-status-delivery-required":
        "Bitte w\u00e4hlen Sie, wann wir Ihre Extras auf Ihr Zimmer liefern sollen.",
      "bd-status-guest-required":
        "Bitte vervollst\u00e4ndigen Sie die markierten G\u00e4stedaten.",
      "bd-status-sending": "Wird gesendet\u2026",
      "bd-status-thanks": "Vielen Dank \u2014 wir haben Ihre Nachricht erhalten.",
      "bd-status-error":
        "Etwas ist schiefgelaufen ({message}). Bitte schreiben Sie an info@derandhotel.com.",
      "bd-alert-form-incomplete":
        "Bitte f\u00fcllen Sie alle Felder au\u00dfer Kinder und besondere W\u00fcnsche aus, bevor Sie best\u00e4tigen.",
    },
    al: {
      "bd-page-title": "Detajet e Rezervimit | Derand Hotel",
      "bd-meta-description":
        "Plot\u00ebsoni detajet e rezervimit n\u00eb Derand Hotel para pages\u00ebs s\u00eb sigurt.",
      "bd-desktop-header-aria": "Navigimi i rezervimit",
      "bd-nav-explore": "Eksploro",
      "bd-nav-bookings": "Rezervimet",
      "bd-nav-favorites": "T\u00eb preferuarat",
      "bd-nav-profile": "Profili",
      "bd-nav-book-now": "Rezervo Tani",
      "bd-back-rooms": "Dhomat",
      "bd-menu-aria": "M\u00eb shum\u00eb opsione",
      "bd-progress-aria": "Progresi i rezervimit",
      "bd-progress-guest-details": "Detajet e mysafir\u00ebt",
      "bd-checkout-title": "Detajet e Mysafir\u00ebt & Pages\u00ebs",
      "bd-concierge-kicker": "Sh\u00eblizoni q\u00ebndrimin tuaj",
      "bd-concierge-title": "\u00c7far\u00eb t\u00eb sjellim n\u00eb dhom\u00ebn tuaj?",
      "bd-concierge-lead":
        "Prekni nj\u00eb foto m\u00eb posht\u00eb \u2014 shfletoni, zgjidhni t\u00eb preferuarin, ne e sjellim. E lehtë.",
      "bd-chip-flowers": "Lule",
      "bd-chip-champagne": "Shampanj\u00eb",
      "bd-chip-chocolate": "\u00c7okollat\u00eb",
      "bd-chip-perfume": "Parfum",
      "bd-chip-decor": "Dekor",
      "bd-chip-laundry": "Larje rrobash",
      "bd-guest-info-title": "Informacioni i Mysafir\u00ebt",
      "bd-label-room": "Dhoma",
      "bd-label-check-in": "Check-in",
      "bd-label-check-out": "Check-out",
      "bd-label-full-name": "Emri i Plot\u00eb",
      "bd-label-email": "Adresa e Email-it",
      "bd-label-phone": "Numri i Telefonit",
      "bd-label-adults": "T\u00eb rritur",
      "bd-label-children": "F\u00ebmij\u00eb",
      "bd-stepper-decrease-adults": "Ul t\u00eb rriturit",
      "bd-stepper-increase-adults": "Rrit t\u00eb rriturit",
      "bd-stepper-decrease-children": "Ul f\u00ebmij\u00ebt",
      "bd-stepper-increase-children": "Rrit f\u00ebmij\u00ebt",
      "bd-aria-adults": "T\u00eb rritur",
      "bd-aria-children": "F\u00ebmij\u00eb",
      "bd-child-years-title": "Moshat e F\u00ebmij\u00ebve",
      "bd-child-years-note":
        "Politika e Dhom\u00ebs Premium: f\u00ebmij\u00ebt deri n\u00eb 3 vje\u00e7 falas, 4+ vje\u00e7 shtojn\u00eb 20 \u20ac p\u00ebr f\u00ebmij\u00eb.",
      "bd-child-age-label": "Mosha e f\u00ebmij\u00ebs {num}",
      "bd-child-age-placeholder": "Vite",
      "bd-extras-delivery-title": "Kur t\u00eb sjellim shtesat tuaja?",
      "bd-extras-delivery-lead":
        "Zgjidhni dat\u00ebn dhe or\u00ebrn gjat\u00eb q\u00ebndrimit tuaj. Do ta sjellim porosin\u00eb n\u00eb dhom\u00ebn tuaj.",
      "bd-label-delivery-date": "Data e dor\u00e8zimit",
      "bd-label-delivery-time": "Ora e dor\u00eazimit",
      "bd-label-delivery-notes": "Sh\u00ebnime dor\u00e8zimi (opsionale)",
      "bd-delivery-notes-placeholder":
        "Mesazh karte, koha e surpriz\u00ebs ose udh\u00ebzime t\u00eb tjera",
      "bd-label-special-requests": "K\u00ebrkesa Speciale (Opsionale)",
      "bd-summary-dates": "Datat",
      "bd-summary-stay": "Q\u00ebndrimi",
      "bd-summary-unified-note":
        "Totali i rezervimit paguhet n\u00eb nj\u00eb checkout t\u00eb sigurt.",
      "bd-summary-total-due": "Totali p\u00ebr t\u00eb paguar",
      "bd-confirm-payment": "P\u00ebrfundoni pages\u00ebn e sigurt",
      "bd-benefit-rate-aria": "Garancia e \u00e7mimit m\u00eb t\u00eb mir\u00eb",
      "bd-benefit-rate": "Garancia e \u00c7mimit m\u00eb t\u00eb Mir\u00eb",
      "bd-benefit-concierge-aria": "Concierge 24/7",
      "bd-benefit-concierge": "Concierge 24/7",
      "bd-security-aria": "Sh\u00ebnim p\u00ebr pages\u00ebn e sigurt",
      "bd-security-text":
        "Informacioni juaj i pages\u00ebs enkriptohet dhe p\u00ebrpunohet n\u00eb m\u00ebnyr\u00eb t\u00eb sigurt nga partner\u00ebt tan\u00eb financiar\u00eb global\u00eb.",
      "bd-footer-copyright":
        "\u00a92026 Derand Hotel. Ekselenc\u00eb n\u00eb mikpritje q\u00eb nga 1990. P\u00ebrjetime luksoze t\u00eb kuruara n\u00eb t\u00eb gjith\u00eb Kosov\u00ebn.",
      "bd-footer-discover": "Eksploro",
      "bd-footer-about": "Rreth Nesh",
      "bd-footer-rooms": "Dhomat & Suit\u00eb",
      "bd-footer-support": "Mb\u00ebshtetje",
      "bd-footer-contact": "Kontakt",
      "bd-footer-terms": "Kushtet e Sh\u00ebrbimit",
      "bd-footer-legal": "Ligjore",
      "bd-footer-privacy": "Politika e Privat\u00ebsis\u00eb",
      "bd-footer-payments": "Pagesat",
      "bd-room-junior-suite-label": "Suit\u00eb Junior",
      "bd-room-deluxe-double-label": "Dhom\u00eb Dyshe Deluxe",
      "bd-room-premium-double-label": "Dhom\u00eb Premium",
      "bd-room-superior-twin-label": "Dhom\u00eb Superior me Dy Krevate",
      "bd-room-superior-double-label": "Dhom\u00eb Dyshe Superior",
      "bd-room-junior-suite-meta": "37 m\u00b2 / Krevat king",
      "bd-room-deluxe-double-meta": "30 m\u00b2 / Krevat king",
      "bd-room-premium-double-meta": "28 m\u00b2 / Krevat king",
      "bd-room-superior-twin-meta": "23 m\u00b2 / Dy krevate",
      "bd-room-superior-double-meta": "22 m\u00b2 / Krevat king",
      "bd-guest-adult": "I rritur",
      "bd-guest-adults": "T\u00eb rritur",
      "bd-guest-child": "F\u00ebmij\u00eb",
      "bd-guest-children": "F\u00ebmij\u00eb",
      "bd-no-guests": "Asnj\u00eb mysafir",
      "bd-night": "nat\u00eb",
      "bd-nights": "net\u00eb",
      "bd-night-cap": "Nat\u00eb",
      "bd-nights-cap": "Net\u00eb",
      "bd-rate-per-night": "{price} / nat\u00eb",
      "bd-rate-per-night-room": "{price} / nat\u00eb (tarifa e dhom\u00ebs)",
      "bd-room-total-label": "{room} ({nights})",
      "bd-summary-room-alt": "{room} n\u00eb Derand Hotel",
      "bd-remove-extra": "Hiq {label}",
      "bd-extras-none": "(asnj\u00eb)",
      "bd-alert-children-premium":
        "F\u00ebmij\u00ebt jan\u00eb t\u00eb disponueshme vet\u00ebm p\u00ebr Dhom\u00ebn Premium p\u00ebr shkak t\u00eb hap\u00ebsir\u00ebs s\u00eb kufizuar.",
      "bd-status-delivery-required":
        "Ju lutemi zgjidhni kur t\u00eb sjellim shtesat n\u00eb dhom\u00ebn tuaj.",
      "bd-status-guest-required":
        "Ju lutemi plot\u00ebsoni detajet e mysafir\u00ebt t\u00eb theksuara.",
      "bd-status-sending": "Duke d\u00ebrguar\u2026",
      "bd-status-thanks": "Faleminderit \u2014 e mor\u00ebm mesazhin tuaj.",
      "bd-status-error":
        "Di\u00e7ka shkoi keq ({message}). Ju lutemi shkruani n\u00eb info@derandhotel.com.",
      "bd-alert-form-incomplete":
        "Ju lutemi plot\u00ebsoni t\u00eb gjitha fushat p\u00ebrve\u00e7 F\u00ebmij\u00ebve dhe K\u00ebrkesave Speciale para konfirmimit.",
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

  function isDetailsScopedNode(node) {
    return (
      (!!node.closest(".booking-details") ||
        !!node.closest(".booking-details-desktop-header") ||
        !!node.closest(".booking-details-desktop-footer")) &&
      !node.closest(".header") &&
      !node.closest(".footer") &&
      !node.closest(".site-whatsapp-wrap")
    );
  }

  function applyNodes(selector, attr, applyFn, lang) {
    document.querySelectorAll(selector).forEach(function (node) {
      if (!isDetailsScopedNode(node)) return;
      var key = node.getAttribute(attr);
      if (!key) return;
      applyFn(node, t(key, lang));
    });
  }

  function applyPage(lang) {
    lang = normalizeLang(lang);

    document.documentElement.setAttribute("lang", lang === "al" ? "sq" : lang);
    document.title = t("bd-page-title", lang);

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

  global.BookingDetailsI18n = {
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
