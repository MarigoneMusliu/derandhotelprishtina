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
      "explore-jump-pulse": "City Pulse",
      "explore-quote-text":
        "In Prishtina, every street tells a story — of resilience, of coffee that never gets cold, and of a city forever becoming itself.",
      "explore-quote-by": "A note from Derand Hotel",
      "explore-pulse-1-title": "Morning Macchiato",
      "explore-pulse-1-copy":
        "Start the day the Prishtina way — a perfect macchiato and city energy just steps from Derand.",
      "explore-pulse-2-title": "Walkable Icons",
      "explore-pulse-2-copy":
        "Landmarks, galleries, and squares are close enough to explore on foot — then return to quiet luxury.",
      "explore-pulse-3-title": "Festival Nights",
      "explore-pulse-3-copy":
        "Year after year, the capital's cultural calendar fills the nights with music, film, and unforgettable energy.",
      "explore-festivals-label": "Culture & Rhythm",
      "explore-festivals-title": "Festivals that Define Us",
      "explore-festivals-intro":
        "From international music phenomenon to cinematic excellence, Prishtina's festival circuit is the energetic heartbeat of the Balkan cultural scene.",
      "explore-festivals-all": "View All Events",
      "explore-landmarks-label": "Iconic Places",
      "explore-festival-sunnyhill-tag": "Music & Pop",
      "explore-festival-sunnyhill-title": "Sunny Hill Festival",
      "explore-festival-sunnyhill-date": "July 31 – August 2, 2026",
      "explore-festival-sunnyhill-copy":
        "The biggest music event in Kosovo, founded by Dua Lipa, bringing global superstars to the capital.",
      "explore-festival-dokufest-tag": "Film & Culture",
      "explore-festival-dokufest-title": "DokuFest Prishtina",
      "explore-festival-dokufest-date": "August 7 – 15, 2026",
      "explore-festival-dokufest-copy":
        "Experience the finest international documentary and short film screenings in unique urban locations.",
      "explore-festival-jazz-tag": "Soul & Jazz",
      "explore-festival-jazz-title": "Pristina Jazz Festival",
      "explore-festival-jazz-date": "November 2026 (Dates TBA)",
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
      "explore-landmark-heroinat-tag": "MEMORIAL & REMEMBRANCE",
      "explore-landmark-heroinat-title": "Heroines Monument",
      "explore-cta-title": "Your Base for Exploring Prishtina",
      "explore-cta-copy":
        "Steps from the city's best festivals, landmarks, and cafés — stay at Derand Hotel and experience it all.",
      "explore-cta-btn": "Book Your Stay",
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
      "explore-jump-pulse": "Stadt-Puls",
      "explore-quote-text":
        "In Prishtina erzählt jede Straße eine Geschichte — von Widerstandskraft, von Kaffee, der nie kalt wird, und von einer Stadt, die stets wird, was sie ist.",
      "explore-quote-by": "Eine Notiz vom Derand Hotel",
      "explore-pulse-1-title": "Morgen-Macchiato",
      "explore-pulse-1-copy":
        "Beginnen Sie den Tag wie in Prishtina — mit dem perfekten Macchiato und Stadtpuls, nur Schritte vom Derand entfernt.",
      "explore-pulse-2-title": "Zu Fuß erreichbar",
      "explore-pulse-2-copy":
        "Sehenswürdigkeiten, Galerien und Plätze sind nah genug für Spaziergänge — danach zurück in ruhigen Luxus.",
      "explore-pulse-3-title": "Festival-Nächte",
      "explore-pulse-3-copy":
        "Jahr für Jahr füllt der kulturelle Kalender der Hauptstadt die Nächte mit Musik, Film und unvergesslicher Energie.",
      "explore-festivals-label": "Kultur & Rhythmus",
      "explore-festivals-title": "Festivals, die uns prägen",
      "explore-festivals-intro":
        "Vom internationalen Musikphänomen bis zur filmischen Exzellenz — Prishtinas Festival-Szene ist der pulsierende Herzschlag der Balkan-Kulturszene.",
      "explore-festivals-all": "Alle Events ansehen",
      "explore-landmarks-label": "Ikonische Orte",
      "explore-festival-sunnyhill-tag": "Musik & Pop",
      "explore-festival-sunnyhill-title": "Sunny Hill Festival",
      "explore-festival-sunnyhill-date": "31. Juli – 2. August 2026",
      "explore-festival-sunnyhill-copy":
        "Das größte Musikereignis im Kosovo, gegründet von Dua Lipa, mit globalen Superstars in der Hauptstadt.",
      "explore-festival-dokufest-tag": "Film & Kultur",
      "explore-festival-dokufest-title": "DokuFest Prishtina",
      "explore-festival-dokufest-date": "7. – 15. August 2026",
      "explore-festival-dokufest-copy":
        "Erleben Sie die besten internationalen Dokumentar- und Kurzfilmvorführungen an einzigartigen urbanen Orten.",
      "explore-festival-jazz-tag": "Soul & Jazz",
      "explore-festival-jazz-title": "Pristina Jazz Festival",
      "explore-festival-jazz-date": "November 2026 (Termine folgen)",
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
      "explore-landmark-heroinat-tag": "GEDENKEN & ERINNERUNG",
      "explore-landmark-heroinat-title": "Heldinnen-Denkmal",
      "explore-cta-title": "Ihre Basis für Prishtina",
      "explore-cta-copy":
        "Nur Schritte von den besten Festivals, Sehenswürdigkeiten und Cafés — übernachten Sie im Derand Hotel und erleben Sie alles.",
      "explore-cta-btn": "Jetzt buchen",
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
      "explore-jump-pulse": "Pulsi i qytetit",
      "explore-quote-text":
        "Në Prishtinë, çdo rrugë tregon një histori — të reziliencës, të kafesë që nuk ftohet kurrë, dhe të një qyteti që vazhdimisht bëhet vetja e tij.",
      "explore-quote-by": "Një shënim nga Derand Hotel",
      "explore-pulse-1-title": "Macchiato e mëngjesit",
      "explore-pulse-1-copy":
        "Filloni ditën si në Prishtinë — me macchiato të përsosur dhe energjinë e qytetit, vetëm disa hapa nga Derand.",
      "explore-pulse-2-title": "Ikona me këmbë",
      "explore-pulse-2-copy":
        "Monumentet, galeritë dhe sheshet janë mjaft afër për t'u eksploruar me këmbë — pastaj kthehuni në luksin e qetë.",
      "explore-pulse-3-title": "Netë festivali",
      "explore-pulse-3-copy":
        "Vit pas viti, kalendari kulturor i kryeqytetit i mbush netët me muzikë, film dhe energji të paharrueshme.",
      "explore-festivals-label": "Kulturë & Ritëm",
      "explore-festivals-title": "Festivalet që na përkufizojnë",
      "explore-festivals-intro":
        "Nga fenomeni ndërkombëtar i muzikës deri te ekselenca kinematografike — skena festivale e Prishtinës është pulsi energjik i kulturës ballkanike.",
      "explore-festivals-all": "Shiko të gjitha eventet",
      "explore-landmarks-label": "Vende ikonike",
      "explore-festival-sunnyhill-tag": "Muzikë & Pop",
      "explore-festival-sunnyhill-title": "Sunny Hill Festival",
      "explore-festival-sunnyhill-date": "31 korrik – 2 gusht 2026",
      "explore-festival-sunnyhill-copy":
        "Ngjarja më e madhe muzikore në Kosovë, themeluar nga Dua Lipa, që sjell superylltarë globalë në kryeqytet.",
      "explore-festival-dokufest-tag": "Film & Kulturë",
      "explore-festival-dokufest-title": "DokuFest Prishtina",
      "explore-festival-dokufest-date": "7 – 15 gusht 2026",
      "explore-festival-dokufest-copy":
        "Përjetoni projeksionet më të mira ndërkombëtare të dokumentarëve dhe filmave të shkurtër në lokacione urbane unike.",
      "explore-festival-jazz-tag": "Soul & Jazz",
      "explore-festival-jazz-title": "Pristina Jazz Festival",
      "explore-festival-jazz-date": "Nëntor 2026 (Datat TBA)",
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
      "explore-landmark-heroinat-tag": "MEMORIAL & KUJTIM",
      "explore-landmark-heroinat-title": "Monumenti i Heroinave",
      "explore-cta-title": "Baza juaj për të eksploruar Prishtinën",
      "explore-cta-copy":
        "Vetëm disa hapa nga festivalet, monumentet dhe kafete më të mira — qëndroni në Derand Hotel dhe përjetoni gjithçka.",
      "explore-cta-btn": "Rezervo qëndrimin",
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
