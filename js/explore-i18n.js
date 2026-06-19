(function (global) {
  "use strict";

  var LANGS = ["en", "de", "al"];

  var T = {
    en: {
      "explore-page-title": "Explore Prishtina | Derand Hotel",
      "explore-meta-description":
        "Explore Prishtina — Kosovo's vibrant capital. Discover festivals, landmarks, culture, and nightlife in the heart of the Balkans.",
      "explore-nav-brand": "Explore Prishtina",
      "explore-nav-festivals": "Festivals",
      "explore-nav-landmarks": "Landmarks",
      "explore-nav-culture": "Culture",
      "explore-nav-nightlife": "Nightlife",
      "explore-nav-login": "Log In",
      "explore-nav-plan": "Plan Trip",
      "explore-hero-kicker": "Kosovo's Vibrant Capital",
      "explore-hero-title": "Prishtina: The Heart of the Balkans",
      "explore-hero-lead":
        "Experience a city where brutalist architecture meets a youthful pulse, where history is etched in every corner, and the world's best macchiato awaits.",
      "explore-hero-cta": "Start Exploring",
      "explore-festivals-title": "Festivals that Define Us",
      "explore-festivals-intro":
        "From international music phenomenon to cinematic excellence, Prishtina's festival circuit is the energetic heartbeat of the Balkan cultural scene.",
      "explore-festivals-all": "View All Events",
      "explore-festival-sunnyhill-tag": "Music & Pop",
      "explore-festival-sunnyhill-title": "Sunny Hill Festival",
      "explore-festival-sunnyhill-copy":
        "The biggest music event in Kosovo, founded by Dua Lipa, bringing global superstars to the capital.",
      "explore-festival-dokufest-tag": "Film & Culture",
      "explore-festival-dokufest-title": "DokuFest Prishtina",
      "explore-festival-dokufest-copy":
        "Experience the finest international documentary and short film screenings in unique urban locations.",
      "explore-festival-jazz-tag": "Soul & Jazz",
      "explore-festival-jazz-title": "Pristina Jazz Festival",
      "explore-festival-jazz-copy":
        "A refined celebration of improvisation and musical craft, gathering masters from across the globe.",
      "explore-landmarks-title": "Must-visit Landmarks",
      "explore-landmark-library-tag": "ARCHITECTURAL MARVEL",
      "explore-landmark-library-title": "National Library of Kosovo",
      "explore-landmark-library-copy":
        "A stunning example of Brutalist design, this library's unique domes and metallic mesh are a symbol of Prishtina's intellectual resilience.",
      "explore-landmark-cathedral-tag": "SPIRITUAL CENTER",
      "explore-landmark-cathedral-title": "Mother Teresa Cathedral",
      "explore-landmark-newborn-tag": "MODERN HISTORY",
      "explore-landmark-newborn-title": "Newborn Monument",
      "explore-landmark-museum-tag": "NATIONAL HERITAGE",
      "explore-landmark-museum-title": "National Museum of Kosovo",
      "explore-landmark-heroinat-tag": "OLD TOWN BEAT",
      "explore-landmark-heroinat-title": "Heroines Monument",
    },
    de: {
      "explore-page-title": "Prishtina entdecken | Derand Hotel",
      "explore-meta-description":
        "Entdecken Sie Prishtina — die lebendige Hauptstadt des Kosovo. Festivals, Sehenswürdigkeiten, Kultur und Nachtleben im Herzen des Balkans.",
      "explore-nav-brand": "Prishtina entdecken",
      "explore-nav-festivals": "Festivals",
      "explore-nav-landmarks": "Sehenswürdigkeiten",
      "explore-nav-culture": "Kultur",
      "explore-nav-nightlife": "Nachtleben",
      "explore-nav-login": "Anmelden",
      "explore-nav-plan": "Reise planen",
      "explore-hero-kicker": "Die lebendige Hauptstadt des Kosovo",
      "explore-hero-title": "Prishtina: Das Herz des Balkans",
      "explore-hero-lead":
        "Erleben Sie eine Stadt, in der brutalistische Architektur auf jugendliche Energie trifft, Geschichte in jeder Ecke spürbar ist und der beste Macchiato der Welt auf Sie wartet.",
      "explore-hero-cta": "Jetzt entdecken",
      "explore-festivals-title": "Festivals, die uns prägen",
      "explore-festivals-intro":
        "Vom internationalen Musikphänomen bis zur filmischen Exzellenz — Prishtinas Festival-Szene ist der pulsierende Herzschlag der Balkan-Kulturszene.",
      "explore-festivals-all": "Alle Events ansehen",
      "explore-festival-sunnyhill-tag": "Musik & Pop",
      "explore-festival-sunnyhill-title": "Sunny Hill Festival",
      "explore-festival-sunnyhill-copy":
        "Das größte Musikereignis im Kosovo, gegründet von Dua Lipa, mit globalen Superstars in der Hauptstadt.",
      "explore-festival-dokufest-tag": "Film & Kultur",
      "explore-festival-dokufest-title": "DokuFest Prishtina",
      "explore-festival-dokufest-copy":
        "Erleben Sie die besten internationalen Dokumentar- und Kurzfilmvorführungen an einzigartigen urbanen Orten.",
      "explore-festival-jazz-tag": "Soul & Jazz",
      "explore-festival-jazz-title": "Pristina Jazz Festival",
      "explore-festival-jazz-copy":
        "Eine raffinierte Feier der Improvisation und musikalischen Handwerkskunst mit Meistern aus aller Welt.",
      "explore-landmarks-title": "Sehenswürdigkeiten, die man gesehen haben muss",
      "explore-landmark-library-tag": "ARCHITEKTONISCHES WUNDER",
      "explore-landmark-library-title": "Nationalbibliothek des Kosovo",
      "explore-landmark-library-copy":
        "Ein beeindruckendes Beispiel brutalistischer Architektur — die einzigartigen Kuppeln und das metallische Gitterwerk sind ein Symbol für Prishtinas intellektuelle Widerstandskraft.",
      "explore-landmark-cathedral-tag": "SPIRITUELLES ZENTRUM",
      "explore-landmark-cathedral-title": "Mutter-Teresa-Kathedrale",
      "explore-landmark-newborn-tag": "MODERNE GESCHICHTE",
      "explore-landmark-newborn-title": "Newborn-Denkmal",
      "explore-landmark-museum-tag": "NATIONALES ERBE",
      "explore-landmark-museum-title": "Nationalmuseum des Kosovo",
      "explore-landmark-heroinat-tag": "ALTSTADT-PULS",
      "explore-landmark-heroinat-title": "Heldinnen-Denkmal",
    },
    al: {
      "explore-page-title": "Eksploro Prishtinën | Derand Hotel",
      "explore-meta-description":
        "Eksploroni Prishtinën — kryeqytetin e gjallë të Kosovës. Festivale, monumente, kulturë dhe jetë nate në zemër të Ballkanit.",
      "explore-nav-brand": "Eksploro Prishtinën",
      "explore-nav-festivals": "Festivale",
      "explore-nav-landmarks": "Monumente",
      "explore-nav-culture": "Kulturë",
      "explore-nav-nightlife": "Jetë nate",
      "explore-nav-login": "Hyr",
      "explore-nav-plan": "Planifiko udhëtimin",
      "explore-hero-kicker": "Kryeqyteti i gjallë i Kosovës",
      "explore-hero-title": "Prishtina: Zemra e Ballkanit",
      "explore-hero-lead":
        "Përjetoni një qytet ku arkitektura brutaliste takohet me një ritëm të ri, ku historia është gdhendur në çdo cep, dhe macchiato më i mirë në botë ju pret.",
      "explore-hero-cta": "Fillo eksplorimin",
      "explore-festivals-title": "Festivalet që na përkufizojnë",
      "explore-festivals-intro":
        "Nga fenomeni ndërkombëtar i muzikës deri te ekselenca kinematografike — skena festivale e Prishtinës është pulsi energjik i kulturës ballkanike.",
      "explore-festivals-all": "Shiko të gjitha eventet",
      "explore-festival-sunnyhill-tag": "Muzikë & Pop",
      "explore-festival-sunnyhill-title": "Sunny Hill Festival",
      "explore-festival-sunnyhill-copy":
        "Ngjarja më e madhe muzikore në Kosovë, themeluar nga Dua Lipa, që sjell superylltarë globalë në kryeqytet.",
      "explore-festival-dokufest-tag": "Film & Kulturë",
      "explore-festival-dokufest-title": "DokuFest Prishtina",
      "explore-festival-dokufest-copy":
        "Përjetoni projeksionet më të mira ndërkombëtare të dokumentarëve dhe filmave të shkurtër në lokacione urbane unike.",
      "explore-festival-jazz-tag": "Soul & Jazz",
      "explore-festival-jazz-title": "Pristina Jazz Festival",
      "explore-festival-jazz-copy":
        "Një festë e rafinuar e improvizimit dhe mjeshtërisë muzikore, që mbledh mjeshtër nga e gjithë bota.",
      "explore-landmarks-title": "Monumentet që duhen vizituar",
      "explore-landmark-library-tag": "MREKULLI ARKITEKTURORE",
      "explore-landmark-library-title": "Biblioteka Kombëtare e Kosovës",
      "explore-landmark-library-copy":
        "Një shembull mahnitës i dizajnit brutalist — kupolat unike dhe rrjeti metalik janë simbol i reziliencës intelektuale të Prishtinës.",
      "explore-landmark-cathedral-tag": "QENDËR SHPIRTËRORE",
      "explore-landmark-cathedral-title": "Katedralja e Nënë Terezës",
      "explore-landmark-newborn-tag": "HISTORI MODERNE",
      "explore-landmark-newborn-title": "Monumenti Newborn",
      "explore-landmark-museum-tag": "TRASHËGIMI KOMBËTARE",
      "explore-landmark-museum-title": "Muzeu Kombëtar i Kosovës",
      "explore-landmark-heroinat-tag": "RITMI I QYTETIT TË VJETËR",
      "explore-landmark-heroinat-title": "Monumenti i Heroinave",
    },
  };

  function normalizeLang(lang) {
    lang = String(lang || "en").toLowerCase();
    return LANGS.indexOf(lang) >= 0 ? lang : "en";
  }

  function currentLang() {
    var active = document.querySelector(".lang-btn.lang-active[data-lang]");
    if (active) return normalizeLang(active.getAttribute("data-lang"));
    try {
      return normalizeLang(localStorage.getItem("derand_lang"));
    } catch (e) {
      return "en";
    }
  }

  function t(key, lang) {
    lang = normalizeLang(lang);
    var bucket = T[lang] || T.en;
    return bucket[key] != null ? bucket[key] : T.en[key] || key;
  }

  function applyPage(lang) {
    lang = normalizeLang(lang);
    document.documentElement.setAttribute("lang", lang === "al" ? "sq" : lang);
    document.title = t("explore-page-title", lang);

    var metaDesc = document.querySelector('meta[name="description"][data-i18n]');
    if (metaDesc) {
      metaDesc.setAttribute("content", t(metaDesc.getAttribute("data-i18n"), lang));
    }

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      if (!key || key.indexOf("explore-") !== 0) return;
      node.textContent = t(key, lang);
    });

  }

  function init() {
    applyPage(currentLang());
    window.addEventListener("load", function () {
      window.setTimeout(function () {
        applyPage(currentLang());
      }, 50);
    });

    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".lang-btn[data-lang]");
      if (!btn) return;
      window.setTimeout(function () {
        applyPage(currentLang());
      }, 150);
    });
  }

  global.ExploreI18n = { t: t, applyPage: applyPage, init: init };
  document.addEventListener("DOMContentLoaded", init);
})(window);
