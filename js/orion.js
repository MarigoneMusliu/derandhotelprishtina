(function () {
  "use strict";

  var LAYOUTS = [
    { id: "theatre", guests: 102 },
    { id: "ushape", guests: 36 },
    { id: "classroom", guests: 46 },
    { id: "hsquare", guests: 40 },
    { id: "conference", guests: 34 }
  ];

  var T = {
    en: {
      "hero-tag": "Meetings. Ideas. Occasions.",
      "hero-discover": "Discover Orion",
      "hero-preview": "Official Orion preview",
      "brand-sub": "by Derand Hotel",
      "nav-overview": "Overview",
      "nav-hall": "The hall",
      "nav-layouts": "Layouts",
      "nav-contact": "Contact",
      "nav-enquire": "Make an enquiry",
      "ov-eyebrow": "A new space to come together",
      "ov-title": "Orion Conference Hall",
      "ov-copy": "A considered setting for your next big idea. From focused meetings and workshops to conferences and private gatherings, Orion brings flexible layouts, modern audio-visual technology and Derand's warm hospitality together in Prishtina.",
      "ov-status": "Opening soon · Event enquiries welcome",
      "st-guests": "Guests, up to",
      "st-layouts": "Seating arrangements",
      "st-city": "Your city meeting point",
      "ly-eyebrow": "A space that adapts to you",
      "ly-title-1": "Your event.",
      "ly-title-2": "Your arrangement.",
      "ly-copy": "Choose the right setting for your gathering. Explore our five seating layouts below.",
      "ly-download": "Download seating guide",
      "ly-preview": "Layout preview",
      "ly-schematic": "Schematic illustration · Not to scale",
      "ly-guests": "guests",
      "ly-ideal": "Ideal for",
      "ly-choose": "Choose this layout",
      "ly-note": "Capacities shown for each arrangement. The team will confirm the final setup for your event.",
      "ly-stage": "Presentation area",
      "theatre": "Theatre",
      "theatre-copy": "A shared focus, with every seat facing the speaker. A natural choice for presentations, talks and company announcements.",
      "theatre-ideal": "Presentations · Talks · Company events",
      "ushape": "U-Shape",
      "ushape-copy": "An open, conversational setting where everyone sees the presenter and each other. Made for sessions that invite discussion.",
      "ushape-ideal": "Workshops · Trainings · Briefings",
      "classroom": "Classroom",
      "classroom-copy": "Rows of tables facing the front, with room for laptops and notes. Built for learning and focused, productive work.",
      "classroom-ideal": "Seminars · Trainings · Courses",
      "hsquare": "H-Square",
      "hsquare-copy": "Tables arranged around a closed square, so every participant sits face to face. Ideal for dialogue and decision-making.",
      "hsquare-ideal": "Round tables · Committees · Discussions",
      "conference": "Conference",
      "conference-copy": "One central table for focused, high-level meetings, with a private and premium feel from the first minute to the last.",
      "conference-ideal": "Board meetings · Negotiations · Executive sessions",
      "hl-eyebrow": "Inside Orion",
      "hl-title-1": "Designed for",
      "hl-title-2": "focus.",
      "hl-copy": "Every element of Orion is chosen to keep attention where it belongs: on your people and your ideas. Calm interiors, modern technology and attentive service work quietly in the background.",
      "ft-av": "Audio-visual",
      "ft-av-copy": "Large-format display and presentation technology, ready from the very first slide.",
      "ft-sound": "Sound & microphones",
      "ft-sound-copy": "Clear, balanced audio with wireless microphones for speakers and Q&A.",
      "ft-wifi": "High-speed Wi-Fi",
      "ft-wifi-copy": "Reliable connectivity for every guest, presenter and live stream.",
      "ft-light": "Considered lighting",
      "ft-light-copy": "Adjustable lighting that moves easily from presentation to reception.",
      "ft-climate": "Climate comfort",
      "ft-climate-copy": "Quiet, controlled air conditioning for long and focused sessions.",
      "ft-host": "Dedicated coordinator",
      "ft-host-copy": "One point of contact, from the first plan to the final applause.",
      "oc-eyebrow": "Made for every occasion",
      "oc-title-1": "One hall.",
      "oc-title-2": "Many stories.",
      "oc-1": "Business meetings",
      "oc-1-copy": "Board meetings, interviews and client presentations in a private setting.",
      "oc-2": "Conferences",
      "oc-2-copy": "Keynotes and panel sessions for up to 102 guests.",
      "oc-3": "Seminars & training",
      "oc-3-copy": "Workshops and courses with room to learn and work.",
      "oc-4": "Product launches",
      "oc-4-copy": "Unveil your next idea to partners, press and clients.",
      "oc-5": "Private celebrations",
      "oc-5-copy": "Receptions, anniversaries and milestones, beautifully hosted.",
      "cta-eyebrow": "Orion · Opening soon",
      "cta-title-1": "Bring your next event",
      "cta-title-2": "to Derand.",
      "cta-btn": "Contact our team",
      "guide-title": "Orion Conference Hall · Seating guide",
      "guide-sub": "Derand Hotel, Prishtina · info@derandhotel.com · Capacities are indicative; final setup confirmed by our team."
    },
    de: {
      "hero-tag": "Meetings. Ideen. Anlässe.",
      "hero-discover": "Orion entdecken",
      "hero-preview": "Offizielle Orion-Vorschau",
      "brand-sub": "by Derand Hotel",
      "nav-overview": "Überblick",
      "nav-hall": "Der Saal",
      "nav-layouts": "Layouts",
      "nav-contact": "Kontakt",
      "nav-enquire": "Anfrage senden",
      "ov-eyebrow": "Ein neuer Ort der Begegnung",
      "ov-title": "Orion Konferenzsaal",
      "ov-copy": "Ein durchdachter Rahmen für Ihre nächste große Idee. Von konzentrierten Meetings und Workshops bis zu Konferenzen und privaten Anlässen vereint Orion flexible Layouts, moderne Audio-Video-Technik und die herzliche Gastfreundschaft des Derand in Prishtina.",
      "ov-status": "Bald geöffnet · Eventanfragen willkommen",
      "st-guests": "Gäste, bis zu",
      "st-layouts": "Bestuhlungsvarianten",
      "st-city": "Ihr Treffpunkt in der Stadt",
      "ly-eyebrow": "Ein Raum, der sich Ihnen anpasst",
      "ly-title-1": "Ihr Event.",
      "ly-title-2": "Ihre Anordnung.",
      "ly-copy": "Wählen Sie den passenden Rahmen für Ihr Treffen. Entdecken Sie unten unsere fünf Bestuhlungsvarianten.",
      "ly-download": "Bestuhlungsplan herunterladen",
      "ly-preview": "Layout-Vorschau",
      "ly-schematic": "Schematische Darstellung · Nicht maßstabsgetreu",
      "ly-guests": "Gäste",
      "ly-ideal": "Ideal für",
      "ly-choose": "Dieses Layout wählen",
      "ly-note": "Kapazitäten je Anordnung. Unser Team bestätigt die endgültige Aufstellung für Ihr Event.",
      "ly-stage": "Präsentationsbereich",
      "theatre": "Theater",
      "theatre-copy": "Ein gemeinsamer Fokus, jeder Platz ist zum Redner ausgerichtet. Die natürliche Wahl für Präsentationen, Vorträge und Unternehmensankündigungen.",
      "theatre-ideal": "Präsentationen · Vorträge · Firmenevents",
      "ushape": "U-Form",
      "ushape-copy": "Eine offene, kommunikative Anordnung, in der alle den Vortragenden und einander sehen. Gemacht für Sitzungen mit Austausch.",
      "ushape-ideal": "Workshops · Schulungen · Briefings",
      "classroom": "Parlament",
      "classroom-copy": "Tischreihen mit Blick nach vorne und Platz für Laptops und Notizen. Geschaffen für Lernen und konzentriertes Arbeiten.",
      "classroom-ideal": "Seminare · Schulungen · Kurse",
      "hsquare": "Hohlquadrat",
      "hsquare-copy": "Tische rund um ein geschlossenes Quadrat, sodass sich alle gegenübersitzen. Ideal für Dialog und Entscheidungen.",
      "hsquare-ideal": "Runde Tische · Gremien · Diskussionen",
      "conference": "Konferenz",
      "conference-copy": "Ein zentraler Tisch für konzentrierte Meetings auf höchster Ebene, mit privater und exklusiver Atmosphäre von Anfang bis Ende.",
      "conference-ideal": "Vorstandssitzungen · Verhandlungen · Executive-Meetings",
      "hl-eyebrow": "Im Orion",
      "hl-title-1": "Geschaffen für",
      "hl-title-2": "Konzentration.",
      "hl-copy": "Jedes Element des Orion ist so gewählt, dass die Aufmerksamkeit dort bleibt, wo sie hingehört: bei Ihren Gästen und Ihren Ideen. Ruhige Räume, moderne Technik und aufmerksamer Service wirken diskret im Hintergrund.",
      "ft-av": "Audio & Video",
      "ft-av-copy": "Großformatige Displays und Präsentationstechnik, bereit ab der ersten Folie.",
      "ft-sound": "Ton & Mikrofone",
      "ft-sound-copy": "Klarer, ausgewogener Klang mit kabellosen Mikrofonen für Redner und Fragerunden.",
      "ft-wifi": "Schnelles WLAN",
      "ft-wifi-copy": "Zuverlässige Verbindung für jeden Gast, jeden Vortrag und jeden Livestream.",
      "ft-light": "Durchdachtes Licht",
      "ft-light-copy": "Regelbares Licht, das mühelos von der Präsentation zum Empfang wechselt.",
      "ft-climate": "Angenehmes Klima",
      "ft-climate-copy": "Leise, geregelte Klimatisierung für lange und konzentrierte Sitzungen.",
      "ft-host": "Persönlicher Ansprechpartner",
      "ft-host-copy": "Eine Kontaktperson, von der ersten Planung bis zum letzten Applaus.",
      "oc-eyebrow": "Für jeden Anlass",
      "oc-title-1": "Ein Saal.",
      "oc-title-2": "Viele Geschichten.",
      "oc-1": "Geschäftstreffen",
      "oc-1-copy": "Vorstandssitzungen, Interviews und Kundenpräsentationen in privatem Rahmen.",
      "oc-2": "Konferenzen",
      "oc-2-copy": "Keynotes und Podiumsdiskussionen für bis zu 102 Gäste.",
      "oc-3": "Seminare & Schulungen",
      "oc-3-copy": "Workshops und Kurse mit Raum zum Lernen und Arbeiten.",
      "oc-4": "Produktvorstellungen",
      "oc-4-copy": "Präsentieren Sie Ihre nächste Idee Partnern, Presse und Kunden.",
      "oc-5": "Private Feiern",
      "oc-5-copy": "Empfänge, Jubiläen und besondere Momente, stilvoll ausgerichtet.",
      "cta-eyebrow": "Orion · Bald geöffnet",
      "cta-title-1": "Bringen Sie Ihr nächstes Event",
      "cta-title-2": "ins Derand.",
      "cta-btn": "Kontaktieren Sie uns",
      "guide-title": "Orion Konferenzsaal · Bestuhlungsplan",
      "guide-sub": "Derand Hotel, Prishtina · info@derandhotel.com · Kapazitäten sind Richtwerte; die endgültige Aufstellung bestätigt unser Team."
    },
    al: {
      "hero-tag": "Takime. Ide. Raste.",
      "hero-discover": "Zbuloni Orion",
      "hero-preview": "Pamje zyrtare e Orion",
      "brand-sub": "nga Derand Hotel",
      "nav-overview": "Përmbledhje",
      "nav-hall": "Salla",
      "nav-layouts": "Rregullimet",
      "nav-contact": "Kontakt",
      "nav-enquire": "Bëni një kërkesë",
      "ov-eyebrow": "Një hapësirë e re për t'u bashkuar",
      "ov-title": "Salla e Konferencave Orion",
      "ov-copy": "Një ambient i menduar me kujdes për idenë tuaj të radhës. Nga takimet e fokusuara dhe punëtoritë deri te konferencat dhe ngjarjet private, Orion bashkon rregullime fleksibile, teknologji moderne audio-vizuale dhe mikpritjen e ngrohtë të Derand në Prishtinë.",
      "ov-status": "Hapet së shpejti · Kërkesat për evente janë të mirëpritura",
      "st-guests": "Mysafirë, deri në",
      "st-layouts": "Rregullime uljesh",
      "st-city": "Pika juaj e takimit në qytet",
      "ly-eyebrow": "Një hapësirë që përshtatet me ju",
      "ly-title-1": "Eventi juaj.",
      "ly-title-2": "Rregullimi juaj.",
      "ly-copy": "Zgjidhni ambientin e duhur për takimin tuaj. Shikoni më poshtë pesë rregullimet tona të uljeve.",
      "ly-download": "Shkarkoni udhëzuesin e uljeve",
      "ly-preview": "Pamja e rregullimit",
      "ly-schematic": "Ilustrim skematik · Jo në shkallë",
      "ly-guests": "mysafirë",
      "ly-ideal": "Ideale për",
      "ly-choose": "Zgjidhni këtë rregullim",
      "ly-note": "Kapacitetet janë për secilin rregullim. Ekipi ynë do ta konfirmojë rregullimin përfundimtar për eventin tuaj.",
      "ly-stage": "Zona e prezantimit",
      "theatre": "Teatër",
      "theatre-copy": "Një fokus i përbashkët, me çdo ulëse të kthyer nga folësi. Zgjedhja natyrale për prezantime, fjalime dhe njoftime të kompanisë.",
      "theatre-ideal": "Prezantime · Fjalime · Evente të kompanisë",
      "ushape": "Formë U",
      "ushape-copy": "Një ambient i hapur dhe bashkëbisedues, ku të gjithë shohin prezantuesin dhe njëri-tjetrin. I krijuar për seanca me diskutim.",
      "ushape-ideal": "Punëtori · Trajnime · Takime informuese",
      "classroom": "Klasë",
      "classroom-copy": "Rreshta tavolinash të kthyera përpara, me vend për laptopë dhe shënime. I ndërtuar për mësim dhe punë të fokusuar.",
      "classroom-ideal": "Seminare · Trajnime · Kurse",
      "hsquare": "Katror H",
      "hsquare-copy": "Tavolina të vendosura rreth një katrori të mbyllur, që çdo pjesëmarrës të ulet ballë për ballë. Ideale për dialog dhe vendimmarrje.",
      "hsquare-ideal": "Tryeza të rrumbullakëta · Komisione · Diskutime",
      "conference": "Konferencë",
      "conference-copy": "Një tavolinë qendrore për takime të fokusuara të nivelit të lartë, me ndjesi private dhe premium nga minuta e parë deri te e fundit.",
      "conference-ideal": "Mbledhje bordi · Negociata · Seanca ekzekutive",
      "hl-eyebrow": "Brenda Orion",
      "hl-title-1": "E krijuar për",
      "hl-title-2": "fokus.",
      "hl-copy": "Çdo element i Orion është zgjedhur që vëmendja të mbetet aty ku duhet: te njerëzit dhe idetë tuaja. Ambiente të qeta, teknologji moderne dhe shërbim i kujdesshëm punojnë në heshtje në sfond.",
      "ft-av": "Audio-vizuale",
      "ft-av-copy": "Ekran i madh dhe teknologji prezantimi, gati që nga sllajdi i parë.",
      "ft-sound": "Zë & mikrofona",
      "ft-sound-copy": "Zë i qartë dhe i balancuar, me mikrofona pa tel për folësit dhe pyetjet.",
      "ft-wifi": "Wi-Fi i shpejtë",
      "ft-wifi-copy": "Lidhje e besueshme për çdo mysafir, prezantues dhe transmetim të drejtpërdrejtë.",
      "ft-light": "Ndriçim i menduar",
      "ft-light-copy": "Ndriçim i rregullueshëm që kalon lehtë nga prezantimi në pritje.",
      "ft-climate": "Klimë e rehatshme",
      "ft-climate-copy": "Klimatizim i qetë dhe i kontrolluar për seanca të gjata e të fokusuara.",
      "ft-host": "Koordinator i dedikuar",
      "ft-host-copy": "Një person kontakti, nga plani i parë deri te duartrokitja e fundit.",
      "oc-eyebrow": "Për çdo rast",
      "oc-title-1": "Një sallë.",
      "oc-title-2": "Shumë histori.",
      "oc-1": "Takime biznesi",
      "oc-1-copy": "Mbledhje bordi, intervista dhe prezantime për klientë në një ambient privat.",
      "oc-2": "Konferenca",
      "oc-2-copy": "Fjalime kryesore dhe panele diskutimi për deri në 102 mysafirë.",
      "oc-3": "Seminare & trajnime",
      "oc-3-copy": "Punëtori dhe kurse me hapësirë për të mësuar dhe punuar.",
      "oc-4": "Lansime produktesh",
      "oc-4-copy": "Prezantoni idenë tuaj të radhës para partnerëve, medias dhe klientëve.",
      "oc-5": "Festa private",
      "oc-5-copy": "Pritje, përvjetorë dhe momente të veçanta, të organizuara me stil.",
      "cta-eyebrow": "Orion · Hapet së shpejti",
      "cta-title-1": "Sillni eventin tuaj të radhës",
      "cta-title-2": "në Derand.",
      "cta-btn": "Kontaktoni ekipin tonë",
      "guide-title": "Salla e Konferencave Orion · Udhëzuesi i uljeve",
      "guide-sub": "Derand Hotel, Prishtinë · info@derandhotel.com · Kapacitetet janë orientuese; rregullimin përfundimtar e konfirmon ekipi ynë."
    }
  };

  var lang = "en";
  var current = 0;

  function t(key) {
    return (T[lang] && T[lang][key]) || T.en[key] || "";
  }

  function detectLang() {
    var l = window.currentLang;
    if (!l) {
      try { l = localStorage.getItem("derandLang"); } catch (e) {}
    }
    return T[l] ? l : "en";
  }

  /* ---------------------------------------------------------- Schematics */
  function dot(x, y, r) {
    return '<circle class="o-dot" cx="' + x + '" cy="' + y + '" r="' + (r || 3.2) + '"/>';
  }
  function rect(x, y, w, h, cls) {
    return '<rect class="' + (cls || "o-table") + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1"/>';
  }
  function seatsAlong(x1, y1, x2, y2, n, r) {
    var out = "";
    for (var i = 0; i < n; i++) {
      var k = n === 1 ? 0.5 : i / (n - 1);
      out += dot(x1 + (x2 - x1) * k, y1 + (y2 - y1) * k, r);
    }
    return out;
  }

  /* All drawings use a 200 x 130 box; the stage sits at the top. */
  function drawing(id, withLabel) {
    var s = "";
    var stage = rect(40, 6, 120, 9, "o-stage");
    var label = withLabel
      ? '<text x="100" y="12.6" text-anchor="middle" font-size="4.6" letter-spacing="1.4" fill="#8a8d93">' + escapeHtml(t("ly-stage").toUpperCase()) + "</text>"
      : "";
    if (id === "theatre") {
      s += stage + label;
      for (var row = 0; row < 5; row++) {
        var y = 34 + row * 19;
        s += seatsAlong(30, y, 88, y, 5) + seatsAlong(112, y, 170, y, 5);
      }
    } else if (id === "ushape") {
      s += stage + label;
      s += rect(52, 112, 96, 5) + rect(52, 32, 5, 85) + rect(143, 32, 5, 85);
      s += seatsAlong(64, 124, 136, 124, 6);
      s += seatsAlong(44, 38, 44, 108, 6) + seatsAlong(156, 38, 156, 108, 6);
    } else if (id === "classroom") {
      s += stage + label;
      for (var r = 0; r < 4; r++) {
        var ty = 32 + r * 24;
        s += rect(26, ty, 66, 5) + rect(108, ty, 66, 5);
        s += seatsAlong(34, ty + 13, 84, ty + 13, 4) + seatsAlong(116, ty + 13, 166, ty + 13, 4);
      }
    } else if (id === "hsquare") {
      s += stage + label;
      s += rect(56, 38, 88, 5) + rect(56, 109, 88, 5) + rect(56, 38, 5, 76) + rect(139, 38, 5, 76);
      s += seatsAlong(64, 29, 136, 29, 10) + seatsAlong(64, 123, 136, 123, 10);
      s += seatsAlong(47, 46, 47, 106, 10) + seatsAlong(153, 46, 153, 106, 10);
    } else {
      s += stage + label;
      s += rect(30, 60, 140, 22);
      s += seatsAlong(36, 51, 164, 51, 18) + seatsAlong(36, 91, 164, 91, 18);
      s += dot(21, 65) + dot(21, 77) + dot(179, 65) + dot(179, 77);
    }
    return s;
  }

  function svg(id, withLabel, attrs) {
    return '<svg viewBox="0 0 200 130" aria-hidden="true" ' + (attrs || "") + ">" + drawing(id, withLabel) + "</svg>";
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ------------------------------------------------------------- Layouts */
  function renderCards() {
    var box = document.querySelector("[data-o-cards]");
    if (!box) return;
    box.innerHTML = LAYOUTS.map(function (l, i) {
      return (
        '<button type="button" role="tab" class="o-card' + (i === current ? " is-active" : "") + '" data-layout="' + i + '" aria-selected="' + (i === current) + '">' +
        svg(l.id, false) +
        '<b class="o-display">' + l.guests + "</b><small>" + escapeHtml(t("ly-guests")) + "</small>" +
        "<span>" + escapeHtml(t(l.id)) + "</span></button>"
      );
    }).join("");
  }

  function renderPreview(animate) {
    var l = LAYOUTS[current];
    var art = document.querySelector("[data-o-art]");
    var body = document.querySelector("[data-o-body]");
    if (!art || !body) return;
    art.innerHTML = svg(l.id, true);
    body.innerHTML =
      '<span class="o-preview__index">0' + (current + 1) + " / 0" + LAYOUTS.length + "</span>" +
      '<span class="o-preview__count"><b>' + l.guests + "</b> " + escapeHtml(t("ly-guests")) + "</span>" +
      '<h3 class="o-title o-display">' + escapeHtml(t(l.id)) + "</h3>" +
      '<p class="o-lead">' + escapeHtml(t(l.id + "-copy")) + "</p>" +
      '<dl class="o-ideal"><dt>' + escapeHtml(t("ly-ideal")) + "</dt><dd>" + escapeHtml(t(l.id + "-ideal")) + "</dd></dl>" +
      '<button type="button" class="o-btn" disabled>' + escapeHtml(t("ly-choose")) +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 17 17 7M8 7h9v9"/></svg></button>';
    if (animate) {
      [art, body].forEach(function (el) {
        el.classList.remove("o-fade");
        void el.offsetWidth;
        el.classList.add("o-fade");
      });
    }
  }

  function selectLayout(i) {
    current = (i + LAYOUTS.length) % LAYOUTS.length;
    document.querySelectorAll(".o-card").forEach(function (c, k) {
      c.classList.toggle("is-active", k === current);
      c.setAttribute("aria-selected", String(k === current));
    });
    renderPreview(true);
  }

  function printGuide() {
    var box = document.querySelector(".o-print-guide");
    if (!box) {
      box = document.createElement("div");
      box.className = "o-print-guide";
      document.body.appendChild(box);
    }
    box.innerHTML =
      "<h1>" + escapeHtml(t("guide-title")) + "</h1><p>" + escapeHtml(t("guide-sub")) + "</p>" +
      LAYOUTS.map(function (l) {
        return "<section>" + svg(l.id, true) + "<div><h2>" + escapeHtml(t(l.id)) + " · " + l.guests + " " + escapeHtml(t("ly-guests")) + "</h2><p>" +
          escapeHtml(t(l.id + "-copy")) + "</p><p><strong>" + escapeHtml(t("ly-ideal")) + ":</strong> " + escapeHtml(t(l.id + "-ideal")) + "</p></div></section>";
      }).join("");
    document.body.classList.add("o-printing");
    var done = function () {
      document.body.classList.remove("o-printing");
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    setTimeout(done, 1500);
  }

  /* --------------------------------------------------------- Translation */
  function applyLang(next) {
    lang = T[next] ? next : "en";
    document.querySelectorAll("[data-o]").forEach(function (el) {
      var v = t(el.getAttribute("data-o"));
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-o-ph]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-o-ph")));
    });
    document.querySelectorAll("[data-o-alt]").forEach(function (el) {
      el.setAttribute("alt", t(el.getAttribute("data-o-alt")));
    });
    renderCards();
    renderPreview(false);
  }

  /* ------------------------------------------------------ Sticky sub-nav */
  function initSubnav() {
    var nav = document.querySelector(".o-subnav");
    var header = document.querySelector(".header__nav__option") || document.querySelector("header.header");
    var setOffset = function () {
      var h = 0;
      if (header) {
        var pos = getComputedStyle(header).position;
        if (pos === "fixed" || pos === "sticky") {
          var r = header.getBoundingClientRect();
          h = Math.max(0, Math.round(r.bottom));
        }
      }
      var pad = h + (nav ? nav.offsetHeight : 0) + "px";
      document.documentElement.style.setProperty("--o-header-h", h + "px");
      document.documentElement.style.scrollPaddingTop = pad;
      document.body.style.scrollPaddingTop = pad;
    };
    setOffset();
    window.addEventListener("resize", setOffset);
    /* style.css makes <body> the scroll container, so listen in the capture phase to catch both. */
    document.addEventListener("scroll", setOffset, { passive: true, capture: true });

    var links = Array.prototype.slice.call(document.querySelectorAll('.o-subnav__links a[href^="#"]'));
    var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
    var spy = function () {
      var line = window.innerHeight * 0.35;
      var active = 0;
      sections.forEach(function (s, i) {
        if (s && s.getBoundingClientRect().top <= line) active = i;
      });
      links.forEach(function (a, i) { a.classList.toggle("is-active", i === active); });
    };
    document.addEventListener("scroll", spy, { passive: true, capture: true });
    spy();
  }

  /* -------------------------------------------------------------- Reveal */
  function initReveal() {
    var els = document.querySelectorAll(".o-reveal, .o-cta");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------- Init */
  function init() {
    applyLang(detectLang());

    document.addEventListener("click", function (e) {
      var card = e.target.closest(".o-card");
      if (card) { selectLayout(parseInt(card.getAttribute("data-layout"), 10)); return; }

      if (e.target.closest("[data-o-guide]")) { e.preventDefault(); printGuide(); return; }

      var lb = e.target.closest(".lang-btn");
      if (lb && lb.getAttribute("data-lang")) {
        setTimeout(function () { applyLang(lb.getAttribute("data-lang")); }, 0);
      }
    });

    document.addEventListener("keydown", function (e) {
      var card = e.target.closest && e.target.closest(".o-card");
      if (!card) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        selectLayout(current + (e.key === "ArrowRight" ? 1 : -1));
        var next = document.querySelectorAll(".o-card")[current];
        if (next) next.focus();
      }
    });

    initSubnav();
    initReveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
