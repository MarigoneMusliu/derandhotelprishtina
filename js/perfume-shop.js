(function () {
  "use strict";

  var DATA = window.PERFUME_SHOP_DATA || [];
  var CART_KEY = "derandExtraCart";
  var PAGE_SIZE = 48;
  var DESC_VERSION = "1";

  var TEXT = {
    en: {
      title: "Perfumes & Beauty | Concierge Shop | Derand Hotel Prishtina",
      kicker: "Concierge shop · Room delivery",
      h1: "Delivered to your room",
      lead: "Fragrance, chilled bottles, flowers and beauty essentials — order from your phone and we bring it to your door. Please allow up to 30 minutes.",
      searchLabel: "Search the shop",
      searchPh: "Try Prada, Libre, vanilla",
      clear: "Clear search",
      tabAll: "All",
      tabFlowers: "Flowers",
      tabBottles: "In-room bottle service",
      tabPerfumes: "Perfumes",
      tabBeauty: "Beauty & care",
      tabChocolates: "Chocolates",
      tabLaundry: "Laundry",
      brand: "Brand",
      price: "Price",
      priceAny: "Any price",
      priceUnder25: "Under €25",
      price25: "€25–75",
      price75: "€75–150",
      price150: "€150 and up",
      conc: "Concentration",
      helpTitle: "Can’t find it?",
      helpText: "Ask the concierge on WhatsApp and we will source it in Prishtina.",
      helpLink: "Message the concierge",
      allPerfumes: "All perfumes",
      allProducts: "All products",
      women: "Women",
      men: "Men",
      unisex: "Unisex",
      countPerfumes: function (n) { return n + (n === 1 ? " perfume" : " perfumes"); },
      countBeauty: function (n) { return n + (n === 1 ? " product" : " products"); },
      sort: "Sort",
      sortFeatured: "Featured",
      sortLow: "Price: low to high",
      sortHigh: "Price: high to low",
      sortName: "Name A–Z",
      filters: "Filters",
      showResults: function (n) { return "Show " + n + " results"; },
      chooseSize: "Choose size",
      chooseShade: "Choose shade",
      choose: "Choose",
      from: "from",
      ml: "ml",
      shades: function (n) { return n + " shades"; },
      options: function (n) { return n + " options"; },
      size: "Size",
      shade: "Shade",
      option: "Option",
      quantity: "Quantity",
      add: "Add to order",
      added: "Added to your order",
      viewOrder: "View order",
      close: "Close",
      note: "Delivered to your room · please allow up to 30 minutes",
      showMore: "Show more",
      showing: function (a, b) { return "Showing " + a + " of " + b; },
      emptyTitle: "Nothing matches yet",
      emptyText: "Try another brand or price, or clear the filters.",
      clearAll: "Clear filters",
      cart: "Your order",
    },
    de: {
      title: "Parfums & Beauty | Concierge-Shop | Derand Hotel Prishtina",
      kicker: "Concierge-Shop · Zimmerservice",
      h1: "Direkt auf Ihr Zimmer",
      lead: "Düfte, gekühlte Flaschen, Blumen und Beauty-Essentials — bestellen Sie per Handy und wir bringen alles an Ihre Tür. Bitte rechnen Sie mit bis zu 30 Minuten.",
      searchLabel: "Shop durchsuchen",
      searchPh: "z. B. Prada, Libre, Vanille",
      clear: "Suche löschen",
      tabAll: "Alle",
      tabFlowers: "Blumen",
      tabBottles: "Flaschenservice aufs Zimmer",
      tabPerfumes: "Parfums",
      tabBeauty: "Beauty & Pflege",
      tabChocolates: "Pralinen",
      tabLaundry: "Wäscheservice",
      brand: "Marke",
      price: "Preis",
      priceAny: "Alle Preise",
      priceUnder25: "Unter 25 €",
      price25: "25–75 €",
      price75: "75–150 €",
      price150: "Ab 150 €",
      conc: "Konzentration",
      helpTitle: "Nicht gefunden?",
      helpText: "Fragen Sie den Concierge auf WhatsApp — wir besorgen es in Prishtina.",
      helpLink: "Concierge schreiben",
      allPerfumes: "Alle Parfums",
      allProducts: "Alle Produkte",
      women: "Damen",
      men: "Herren",
      unisex: "Unisex",
      countPerfumes: function (n) { return n + (n === 1 ? " Parfum" : " Parfums"); },
      countBeauty: function (n) { return n + (n === 1 ? " Produkt" : " Produkte"); },
      sort: "Sortieren",
      sortFeatured: "Empfohlen",
      sortLow: "Preis: aufsteigend",
      sortHigh: "Preis: absteigend",
      sortName: "Name A–Z",
      filters: "Filter",
      showResults: function (n) { return n + " Ergebnisse anzeigen"; },
      chooseSize: "Größe wählen",
      chooseShade: "Farbton wählen",
      choose: "Auswählen",
      from: "ab",
      ml: "ml",
      shades: function (n) { return n + " Farbtöne"; },
      options: function (n) { return n + " Varianten"; },
      size: "Größe",
      shade: "Farbton",
      option: "Variante",
      quantity: "Menge",
      add: "Zur Bestellung",
      added: "Zur Bestellung hinzugefügt",
      viewOrder: "Bestellung ansehen",
      close: "Schließen",
      note: "Lieferung aufs Zimmer · bitte bis zu 30 Minuten einplanen",
      showMore: "Mehr anzeigen",
      showing: function (a, b) { return a + " von " + b + " angezeigt"; },
      emptyTitle: "Keine Treffer",
      emptyText: "Versuchen Sie eine andere Marke oder Preisspanne, oder setzen Sie die Filter zurück.",
      clearAll: "Filter zurücksetzen",
      cart: "Ihre Bestellung",
    },
    al: {
      title: "Parfume & Bukuri | Dyqani i Concierge | Derand Hotel Prishtina",
      kicker: "Dyqani i concierge · Dërgesë në dhomë",
      h1: "Dërguar në dhomën tuaj",
      lead: "Parfume, shishe të ftohta, lule dhe produkte bukurie — porositni nga telefoni dhe ne i sjellim te dera juaj. Ju lutemi lejoni deri në 30 minuta.",
      searchLabel: "Kërko në dyqan",
      searchPh: "Provo Prada, Libre, vanilje",
      clear: "Fshi kërkimin",
      tabAll: "Të gjitha",
      tabFlowers: "Lule",
      tabBottles: "Shërbim pijesh në dhomë",
      tabPerfumes: "Parfume",
      tabBeauty: "Bukuri & kujdes",
      tabChocolates: "Çokollata",
      tabLaundry: "Lavanderi",
      brand: "Marka",
      price: "Çmimi",
      priceAny: "Çdo çmim",
      priceUnder25: "Nën 25 €",
      price25: "25–75 €",
      price75: "75–150 €",
      price150: "150 € e lart",
      conc: "Përqendrimi",
      helpTitle: "Nuk e gjeni?",
      helpText: "Pyesni concierge-in në WhatsApp dhe ne e sigurojmë në Prishtinë.",
      helpLink: "Shkruani concierge-it",
      allPerfumes: "Të gjitha parfumet",
      allProducts: "Të gjitha produktet",
      women: "Femra",
      men: "Meshkuj",
      unisex: "Unisex",
      countPerfumes: function (n) { return n + (n === 1 ? " parfum" : " parfume"); },
      countBeauty: function (n) { return n + (n === 1 ? " produkt" : " produkte"); },
      sort: "Rendit",
      sortFeatured: "Të veçuara",
      sortLow: "Çmimi: nga më i ulëti",
      sortHigh: "Çmimi: nga më i larti",
      sortName: "Emri A–Z",
      filters: "Filtrat",
      showResults: function (n) { return "Shfaq " + n + " rezultate"; },
      chooseSize: "Zgjidh madhësinë",
      chooseShade: "Zgjidh nuancën",
      choose: "Zgjidh",
      from: "nga",
      ml: "ml",
      shades: function (n) { return n + " nuanca"; },
      options: function (n) { return n + " opsione"; },
      size: "Madhësia",
      shade: "Nuanca",
      option: "Opsioni",
      quantity: "Sasia",
      add: "Shto në porosi",
      added: "U shtua në porosinë tuaj",
      viewOrder: "Shiko porosinë",
      close: "Mbyll",
      note: "Dërgesë në dhomë · ju lutemi lejoni deri në 30 minuta",
      showMore: "Shfaq më shumë",
      showing: function (a, b) { return "Po shfaqen " + a + " nga " + b; },
      emptyTitle: "Asnjë rezultat",
      emptyText: "Provoni një markë ose çmim tjetër, ose pastroni filtrat.",
      clearAll: "Pastro filtrat",
      cart: "Porosia juaj",
    },
  };

  var GENDER_LABEL = { women: "women", men: "men", unisex: "unisex" };
  var CONC_ORDER = ["Eau de Cologne", "Eau de Toilette", "Eau de Parfum", "Parfum", "Extrait de Parfum"];
  var CONC_TEXT = {
    en: { "Eau de Cologne": "Eau de Cologne", "Eau de Toilette": "Eau de Toilette", "Eau de Parfum": "Eau de Parfum", Parfum: "Parfum", "Extrait de Parfum": "Extrait" },
    de: { "Eau de Cologne": "Eau de Cologne", "Eau de Toilette": "Eau de Toilette", "Eau de Parfum": "Eau de Parfum", Parfum: "Parfum", "Extrait de Parfum": "Extrait" },
    al: { "Eau de Cologne": "Eau de Cologne", "Eau de Toilette": "Eau de Toilette", "Eau de Parfum": "Eau de Parfum", Parfum: "Parfum", "Extrait de Parfum": "Extrait" },
  };
  var PRICE_RANGES = {
    any: [0, Infinity],
    u25: [0, 25],
    "25": [25, 75],
    "75": [75, 150],
    "150": [150, Infinity],
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  var els = {
    grid: $("#ps-grid"),
    genders: $("#ps-genders"),
    brands: $("#ps-brands"),
    prices: $("#ps-prices"),
    concs: $("#ps-concs"),
    concGroup: $("#ps-conc-group"),
    count: $("#ps-count"),
    sort: $("#ps-sort"),
    search: $("#ps-search"),
    searchClear: $("#ps-search-clear"),
    more: $("#ps-more"),
    moreBtn: $("#ps-more-btn"),
    moreText: $("#ps-more-text"),
    side: $("#ps-side"),
    sideBackdrop: $("#ps-side-backdrop"),
    filterBtn: $("#ps-filter-btn"),
    filterCount: $("#ps-filter-count"),
    sideApply: $("#ps-side-apply"),
    toast: $("#ps-toast"),
    toastText: $("#ps-toast-text"),
  };

  var state = {
    tab: "fragrance",
    gender: "all",
    brands: {},
    price: "any",
    concs: {},
    q: "",
    sort: "featured",
    limit: PAGE_SIZE,
    open: null,
    sizeIdx: 0,
    qty: 1,
  };

  var byId = {};
  DATA.forEach(function (p) {
    byId[p.id] = p;
    p.minPrice = Math.min.apply(null, p.sizes.map(function (s) { return s.price; }));
    p.search = normalize([p.brand, p.name, p.cartName, p.conc, p.gender].join(" "));
  });

  /* ---------------------------------------------------------------- language */

  function lang() {
    var l = (document.documentElement.getAttribute("lang") || "en").toLowerCase();
    if (l === "sq") l = "al";
    return TEXT[l] ? l : "en";
  }

  function t(key) {
    var dict = TEXT[lang()];
    return dict[key] !== undefined ? dict[key] : TEXT.en[key];
  }

  var descLoading = {};
  function ensureDescriptions(l, done) {
    if (l === "en" || (window.PERFUME_SHOP_DESC && window.PERFUME_SHOP_DESC[l])) return done && done();
    if (descLoading[l]) return;
    descLoading[l] = true;
    var s = document.createElement("script");
    s.src = "js/perfume-shop-desc-" + l + ".js?v=" + DESC_VERSION;
    s.onload = function () { if (done) done(); };
    document.head.appendChild(s);
  }

  function descOf(p) {
    var l = lang();
    var map = window.PERFUME_SHOP_DESC && window.PERFUME_SHOP_DESC[l];
    return (map && map[p.id]) || p.desc || "";
  }

  function applyStaticText() {
    document.querySelectorAll("[data-ps]").forEach(function (el) {
      var v = t(el.getAttribute("data-ps"));
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-ps-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-ps-placeholder")));
    });
    document.querySelectorAll("[data-ps-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-ps-aria")));
    });
    document.title = t("title");
    var sortVal = els.sort.value;
    els.sort.innerHTML =
      '<option value="featured">' + esc(t("sortFeatured")) + "</option>" +
      '<option value="low">' + esc(t("sortLow")) + "</option>" +
      '<option value="high">' + esc(t("sortHigh")) + "</option>" +
      '<option value="name">' + esc(t("sortName")) + "</option>";
    els.sort.value = sortVal || "featured";
  }

  /* ---------------------------------------------------------------- helpers */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function euro(n) {
    var v = Math.round(Number(n) * 100) / 100;
    return "€" + (Math.abs(v - Math.round(v)) < 0.001 ? String(Math.round(v)) : v.toFixed(2));
  }

  function isMl(label) {
    return /^\s*\d+(\.\d+)?\s*ml\s*$/i.test(label || "");
  }

  function isShade(label) {
    return /^shade\b/i.test(label || "");
  }

  function mlOf(label) {
    var m = /^\s*(\d+(?:\.\d+)?)\s*ml\b/i.exec(label || "");
    return m ? m[1] : "";
  }

  function sizeKind(p) {
    if (p.sizes.every(function (s) { return mlOf(s.label); })) return "ml";
    if (p.sizes.every(function (s) { return isShade(s.label); })) return "shade";
    return "option";
  }

  function sizesSummary(p) {
    var kind = sizeKind(p);
    if (kind === "ml") {
      var seen = {};
      var mls = [];
      p.sizes.forEach(function (s) {
        var v = mlOf(s.label);
        if (!seen[v]) { seen[v] = true; mls.push(v); }
      });
      return mls.join(" / ") + " " + t("ml");
    }
    if (p.sizes.length === 1) return p.sizes[0].label;
    return kind === "shade" ? t("shades")(p.sizes.length) : t("options")(p.sizes.length);
  }

  function metaLine(p) {
    var parts = [];
    if (p.conc) parts.push(p.conc);
    var s = sizesSummary(p);
    if (s) parts.push(s);
    return parts.join(" · ");
  }

  function sizeButtonLabel(s) {
    if (isMl(s.label)) return String(s.label).replace(/\s*ml\s*$/i, " ml");
    if (isShade(s.label)) return String(s.label).replace(/^shade\s*/i, "");
    return s.label;
  }

  function defaultSizeIdx(p) {
    for (var i = 0; i < p.sizes.length; i++) if (p.sizes[i].default) return i;
    return 0;
  }

  /* ---------------------------------------------------------------- filtering */

  function matches(p, skip) {
    if (p.kind !== state.tab) return false;
    if (skip !== "gender" && state.gender !== "all" && p.gender !== state.gender) return false;
    if (skip !== "brand" && hasAny(state.brands) && !state.brands[p.brand]) return false;
    if (skip !== "price") {
      var r = PRICE_RANGES[state.price] || PRICE_RANGES.any;
      if (!(p.minPrice >= r[0] && p.minPrice < r[1])) return false;
    }
    if (skip !== "conc" && state.tab === "fragrance" && hasAny(state.concs) && !state.concs[p.conc]) return false;
    if (state.q) {
      var words = state.q.split(/\s+/);
      var hay = p.search + " " + normalize(descOf(p));
      for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) === -1) return false;
    }
    return true;
  }

  function hasAny(obj) {
    for (var k in obj) if (obj[k]) return true;
    return false;
  }

  function activeFilterCount() {
    var n = 0;
    for (var b in state.brands) if (state.brands[b]) n++;
    for (var c in state.concs) if (state.concs[c]) n++;
    if (state.price !== "any") n++;
    return n;
  }

  function filtered() {
    var list = DATA.filter(function (p) { return matches(p); });
    if (state.sort === "low") list.sort(function (a, b) { return a.minPrice - b.minPrice || a.order - b.order; });
    else if (state.sort === "high") list.sort(function (a, b) { return b.minPrice - a.minPrice || a.order - b.order; });
    else if (state.sort === "name") list.sort(function (a, b) { return (a.brand + " " + a.name).localeCompare(b.brand + " " + b.name); });
    return list;
  }

  function countBy(skip, keyFn) {
    var counts = {};
    DATA.forEach(function (p) {
      if (!matches(p, skip)) return;
      var k = keyFn(p);
      if (k) counts[k] = (counts[k] || 0) + 1;
    });
    return counts;
  }

  /* ---------------------------------------------------------------- render: sidebar & tabs */

  function renderTabs() {
    var nF = 0, nB = 0;
    DATA.forEach(function (p) { if (p.kind === "fragrance") nF++; else nB++; });
    document.querySelectorAll("[data-ps-tab]").forEach(function (btn) {
      var tab = btn.getAttribute("data-ps-tab");
      btn.classList.toggle("is-active", tab === state.tab);
      btn.setAttribute("aria-selected", tab === state.tab ? "true" : "false");
      var small = btn.querySelector("small");
      if (small) small.textContent = tab === "fragrance" ? nF : nB;
    });
  }

  function renderGenders() {
    els.genders.hidden = false;
    var counts = countBy("gender", function (p) { return p.gender; });
    var total = 0;
    for (var k in counts) total += counts[k];
    var items = [["all", t(state.tab === "fragrance" ? "allPerfumes" : "allProducts"), total], ["women", t("women"), counts.women || 0], ["men", t("men"), counts.men || 0]];
    if (state.tab === "fragrance") items.push(["unisex", t("unisex"), counts.unisex || 0]);
    els.genders.innerHTML = items
      .map(function (it) {
        return (
          '<button type="button" class="ps-chip' + (state.gender === it[0] ? " is-active" : "") + '" data-gender="' + it[0] + '" aria-pressed="' + (state.gender === it[0]) + '">' +
          esc(it[1]) + " <small>" + it[2] + "</small></button>"
        );
      })
      .join("");
  }

  function renderBrands() {
    var counts = countBy("brand", function (p) { return p.brand; });
    var names = {};
    DATA.forEach(function (p) { if (p.kind === state.tab) names[p.brand] = true; });
    var list = Object.keys(names).sort(function (a, b) { return a.localeCompare(b); });
    els.brands.innerHTML = list
      .map(function (b) {
        var n = counts[b] || 0;
        var on = !!state.brands[b];
        return (
          '<label class="ps-check' + (!n && !on ? " is-empty" : "") + '"><input type="checkbox" value="' + esc(b) + '"' + (on ? " checked" : "") + "><span>" + esc(b) + "</span><small>" + n + "</small></label>"
        );
      })
      .join("");
  }

  function renderPrices() {
    var items = [["any", "priceAny"], ["u25", "priceUnder25"], ["25", "price25"], ["75", "price75"], ["150", "price150"]];
    els.prices.innerHTML = items
      .map(function (it) {
        return '<button type="button" class="ps-chip' + (state.price === it[0] ? " is-active" : "") + '" data-price="' + it[0] + '" aria-pressed="' + (state.price === it[0]) + '">' + esc(t(it[1])) + "</button>";
      })
      .join("");
  }

  function renderConcs() {
    if (state.tab !== "fragrance") {
      els.concGroup.hidden = true;
      return;
    }
    els.concGroup.hidden = false;
    var counts = countBy("conc", function (p) { return p.conc; });
    var labels = CONC_TEXT[lang()] || CONC_TEXT.en;
    els.concs.innerHTML = CONC_ORDER.filter(function (c) {
      return DATA.some(function (p) { return p.kind === "fragrance" && p.conc === c; });
    })
      .map(function (c) {
        var on = !!state.concs[c];
        var n = counts[c] || 0;
        return '<button type="button" class="ps-chip' + (on ? " is-active" : "") + '" data-conc="' + esc(c) + '" aria-pressed="' + on + '"' + (!n && !on ? " disabled" : "") + ">" + esc(labels[c] || c) + " <small>" + n + "</small></button>";
      })
      .join("");
  }

  /* ---------------------------------------------------------------- render: grid */

  function cardHtml(p) {
    var kind = sizeKind(p);
    var btn = p.sizes.length === 1 ? t("choose") : kind === "shade" ? t("chooseShade") : t("chooseSize");
    var price = (p.sizes.length > 1 ? t("from") + " " : "") + euro(p.minPrice);
    return (
      '<article class="ps-card' + (state.open === p.id ? " is-open" : "") + '" data-id="' + esc(p.id) + '">' +
      '<div class="ps-card__media"><img src="' + esc(p.image) + '" alt="' + esc(p.brand + " " + p.name) + '" loading="eager" decoding="async"></div>' +
      '<p class="ps-card__brand">' + esc(p.brand) + "</p>" +
      '<h3 class="ps-card__name">' + esc(p.name) + "</h3>" +
      '<p class="ps-card__meta">' + esc(metaLine(p)) + "</p>" +
      '<p class="ps-card__price">' + esc(price) + "</p>" +
      '<button type="button" class="ps-card__btn" aria-expanded="' + (state.open === p.id) + '">' + esc(btn) + "</button>" +
      "</article>"
    );
  }

  var lastList = [];

  function renderGrid() {
    var list = filtered();
    lastList = list;
    var tab = state.tab;
    els.count.textContent = tab === "fragrance" ? t("countPerfumes")(list.length) : t("countBeauty")(list.length);

    if (state.open) {
      var idx = -1;
      for (var i = 0; i < list.length; i++) if (list[i].id === state.open) { idx = i; break; }
      if (idx === -1) state.open = null;
      else if (idx >= state.limit) state.limit = Math.ceil((idx + 1) / PAGE_SIZE) * PAGE_SIZE;
    }

    if (!list.length) {
      els.grid.innerHTML =
        '<div class="ps-empty"><h3>' + esc(t("emptyTitle")) + "</h3><p>" + esc(t("emptyText")) + '</p><button type="button" class="ps-btn-outline" data-clear-all>' + esc(t("clearAll")) + "</button></div>";
      els.more.hidden = true;
      return;
    }

    var shown = list.slice(0, state.limit);
    els.grid.innerHTML = shown.map(cardHtml).join("");
    els.more.hidden = shown.length >= list.length;
    els.moreText.textContent = t("showing")(shown.length, list.length);
    if (state.open) placeDetail(false);
  }

  function renderFilterCount() {
    var n = activeFilterCount();
    els.filterCount.textContent = n;
    els.filterCount.hidden = !n;
    if (els.sideApply) els.sideApply.textContent = t("showResults")(lastList.length);
  }

  function renderAll() {
    renderTabs();
    renderGenders();
    renderBrands();
    renderPrices();
    renderConcs();
    renderGrid();
    renderFilterCount();
    syncUrl();
  }

  function refresh() {
    state.limit = PAGE_SIZE;
    renderAll();
  }

  /* ---------------------------------------------------------------- detail panel */

  function detailHtml(p) {
    var size = p.sizes[state.sizeIdx] || p.sizes[0];
    var kind = sizeKind(p);
    var label = kind === "ml" ? t("size") : kind === "shade" ? t("shade") : t("option");
    var metaParts = [];
    if (p.conc) metaParts.push(p.conc);
    if (p.gender) metaParts.push(t(GENDER_LABEL[p.gender]));
    var image = size.image || p.image;
    var sizes = p.sizes
      .map(function (s, i) {
        return '<button type="button" class="ps-size' + (i === state.sizeIdx ? " is-active" : "") + '" data-size="' + i + '" aria-pressed="' + (i === state.sizeIdx) + '">' + esc(sizeButtonLabel(s)) + "</button>";
      })
      .join("");
    return (
      '<button type="button" class="ps-detail__close" data-close aria-label="' + esc(t("close")) + '">&times;</button>' +
      '<div class="ps-detail__media"><img src="' + esc(image) + '" alt="' + esc(p.brand + " " + p.name) + '" decoding="async"></div>' +
      '<div class="ps-detail__info">' +
      '<p class="ps-detail__brand">' + esc(p.brand) + "</p>" +
      '<h2 class="ps-detail__name" id="ps-detail-title">' + esc(p.name) + "</h2>" +
      (metaParts.length ? '<p class="ps-detail__meta">' + esc(metaParts.join(" · ")) + "</p>" : "") +
      '<p class="ps-detail__desc">' + esc(descOf(p)) + "</p>" +
      (p.sizes.length > 1 || kind !== "option" ? '<p class="ps-detail__label">' + esc(label) + '</p><div class="ps-sizes">' + sizes + "</div>" : "") +
      '<div class="ps-buy">' +
      '<p class="ps-buy__price" data-price-out>' + esc(euro(size.price * state.qty)) + "</p>" +
      '<div class="ps-qty" role="group" aria-label="' + esc(t("quantity")) + '">' +
      '<button type="button" data-qty="-1" aria-label="−"' + (state.qty <= 1 ? " disabled" : "") + ">&minus;</button>" +
      "<span data-qty-out>" + state.qty + "</span>" +
      '<button type="button" data-qty="1" aria-label="+">+</button>' +
      "</div>" +
      '<button type="button" class="ps-add" data-add>' + esc(t("add")) + "</button>" +
      '<p class="ps-detail__note">' + esc(t("note")) + "</p>" +
      "</div>" +
      "</div>"
    );
  }

  function removeDetail() {
    var old = els.grid.querySelector(".ps-detail");
    if (old) old.parentNode.removeChild(old);
  }

  function placeDetail(scroll) {
    removeDetail();
    var p = byId[state.open];
    if (!p) return;
    var card = els.grid.querySelector('.ps-card[data-id="' + cssEscape(p.id) + '"]');
    if (!card) return;
    var anchor = card;
    var top = card.offsetTop;
    var next = card.nextElementSibling;
    while (next && next.classList.contains("ps-card") && next.offsetTop === top) {
      anchor = next;
      next = next.nextElementSibling;
    }
    var panel = document.createElement("section");
    panel.className = "ps-detail";
    panel.setAttribute("aria-labelledby", "ps-detail-title");
    panel.innerHTML = detailHtml(p);
    anchor.parentNode.insertBefore(panel, anchor.nextSibling);
    var arrow = card.offsetLeft - els.grid.offsetLeft + card.offsetWidth / 2;
    panel.style.setProperty("--ps-arrow", arrow + "px");
    if (scroll) {
      var rect = panel.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var delta = 0;
      if (rect.bottom > vh - 16) delta = Math.min(rect.bottom - vh + 24, rect.top - 90);
      else if (rect.top < 90) delta = rect.top - 90;
      if (Math.abs(delta) > 4) window.scrollTo({ top: window.pageYOffset + delta, behavior: "smooth" });
    }
  }

  function cssEscape(s) {
    return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/"/g, '\\"');
  }

  function openProduct(id, scroll) {
    if (state.open === id) {
      closeProduct();
      return;
    }
    var p = byId[id];
    if (!p) return;
    state.open = id;
    state.sizeIdx = defaultSizeIdx(p);
    state.qty = 1;
    els.grid.querySelectorAll(".ps-card").forEach(function (c) {
      var on = c.getAttribute("data-id") === id;
      c.classList.toggle("is-open", on);
      var b = c.querySelector(".ps-card__btn");
      if (b) b.setAttribute("aria-expanded", on ? "true" : "false");
    });
    placeDetail(scroll !== false);
    syncUrl();
  }

  function closeProduct() {
    var id = state.open;
    state.open = null;
    removeDetail();
    els.grid.querySelectorAll(".ps-card.is-open").forEach(function (c) {
      c.classList.remove("is-open");
      var b = c.querySelector(".ps-card__btn");
      if (b) b.setAttribute("aria-expanded", "false");
    });
    syncUrl();
    var card = id && els.grid.querySelector('.ps-card[data-id="' + cssEscape(id) + '"] .ps-card__btn');
    if (card) card.focus({ preventScroll: true });
  }

  function updateDetail() {
    var panel = els.grid.querySelector(".ps-detail");
    var p = byId[state.open];
    if (!panel || !p) return;
    var size = p.sizes[state.sizeIdx] || p.sizes[0];
    panel.querySelectorAll(".ps-size").forEach(function (b) {
      var on = Number(b.getAttribute("data-size")) === state.sizeIdx;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    panel.querySelector("[data-price-out]").textContent = euro(size.price * state.qty);
    panel.querySelector("[data-qty-out]").textContent = state.qty;
    panel.querySelector('[data-qty="-1"]').disabled = state.qty <= 1;
    var img = panel.querySelector(".ps-detail__media img");
    var src = size.image || p.image;
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
  }

  /* ---------------------------------------------------------------- cart */

  function loadCart() {
    try {
      var parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      return true;
    } catch (e) {
      return false;
    }
  }

  function cartKey(item) {
    return (item.productBase || "") + "|" + (item.image || "") + "|" + (item.variantLabel || "");
  }

  function updateCartBadge() {
    var n = 0;
    loadCart().forEach(function (i) { n += Number(i.qty) || 0; });
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = n > 99 ? "99+" : String(n);
      el.hidden = n < 1;
    });
  }

  function addToCart() {
    var p = byId[state.open];
    if (!p) return;
    var size = p.sizes[state.sizeIdx] || p.sizes[0];
    var item = {
      id: String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
      productBase: p.cartName,
      variantLabel: size.label || "",
      image: size.image || p.image,
      price: size.price,
      qty: state.qty,
      category: "perfumes",
      description: p.brand + " " + p.name + (p.conc ? " · " + p.conc : ""),
    };
    var cart = loadCart();
    var key = cartKey(item);
    var merged = false;
    for (var i = 0; i < cart.length; i++) {
      if (cartKey(cart[i]) === key) {
        cart[i].qty = (Number(cart[i].qty) || 0) + item.qty;
        merged = true;
        break;
      }
    }
    if (!merged) cart.push(item);
    if (!saveCart(cart)) return;
    updateCartBadge();
    showToast(t("added") + " — " + p.brand + " " + p.name + (size.label ? " · " + size.label : ""));
    state.qty = 1;
    updateDetail();
  }

  var toastTimer = null;
  function showToast(msg) {
    els.toastText.textContent = msg;
    els.toast.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("is-visible"); }, 4200);
  }

  /* ---------------------------------------------------------------- URL state */

  function syncUrl() {
    if (!window.history || !history.replaceState) return;
    var params = new URLSearchParams();
    if (state.tab !== "fragrance") params.set("tab", "beauty");
    if (state.gender !== "all") params.set("g", state.gender);
    if (state.q) params.set("q", els.search.value.trim());
    if (state.open) params.set("p", state.open);
    var qs = params.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }

  function readUrl() {
    var params = new URLSearchParams(location.search);
    if (params.get("tab") === "beauty") state.tab = "beauty";
    var g = params.get("g");
    if (g && (state.tab === "fragrance" ? /^(women|men|unisex)$/ : /^(women|men)$/).test(g)) state.gender = g;
    var q = params.get("q");
    if (q) {
      els.search.value = q;
      state.q = normalize(q.trim());
    }
    var p = params.get("p");
    if (p && byId[p]) {
      state.tab = byId[p].kind;
      state.open = p;
      state.sizeIdx = defaultSizeIdx(byId[p]);
    }
  }

  /* ---------------------------------------------------------------- mobile filters */

  function openSide() {
    els.side.classList.add("is-open");
    els.sideBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeSide() {
    els.side.classList.remove("is-open");
    els.sideBackdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /* ---------------------------------------------------------------- events */

  document.querySelectorAll("[data-ps-tab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var tab = btn.getAttribute("data-ps-tab");
      if (tab === state.tab) return;
      state.tab = tab;
      state.brands = {};
      state.concs = {};
      state.gender = "all";
      state.open = null;
      refresh();
    });
  });

  els.genders.addEventListener("click", function (e) {
    var b = e.target.closest("[data-gender]");
    if (!b) return;
    state.gender = b.getAttribute("data-gender");
    refresh();
  });

  els.brands.addEventListener("change", function (e) {
    var input = e.target;
    if (!input || input.type !== "checkbox") return;
    if (input.checked) state.brands[input.value] = true;
    else delete state.brands[input.value];
    refresh();
  });

  els.prices.addEventListener("click", function (e) {
    var b = e.target.closest("[data-price]");
    if (!b) return;
    state.price = b.getAttribute("data-price");
    refresh();
  });

  els.concs.addEventListener("click", function (e) {
    var b = e.target.closest("[data-conc]");
    if (!b || b.disabled) return;
    var c = b.getAttribute("data-conc");
    if (state.concs[c]) delete state.concs[c];
    else state.concs[c] = true;
    refresh();
  });

  els.sort.addEventListener("change", function () {
    state.sort = els.sort.value;
    refresh();
  });

  var searchTimer = null;
  els.search.addEventListener("input", function () {
    els.searchClear.hidden = !els.search.value;
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.q = normalize(els.search.value.trim());
      refresh();
    }, 160);
  });

  els.searchClear.addEventListener("click", function () {
    els.search.value = "";
    els.searchClear.hidden = true;
    state.q = "";
    refresh();
    els.search.focus();
  });

  els.grid.addEventListener("click", function (e) {
    if (e.target.closest("[data-clear-all]")) {
      state.brands = {};
      state.concs = {};
      state.price = "any";
      state.gender = "all";
      state.q = "";
      els.search.value = "";
      els.searchClear.hidden = true;
      refresh();
      return;
    }
    var panel = e.target.closest(".ps-detail");
    if (panel) {
      if (e.target.closest("[data-close]")) return closeProduct();
      var sizeBtn = e.target.closest("[data-size]");
      if (sizeBtn) {
        state.sizeIdx = Number(sizeBtn.getAttribute("data-size"));
        return updateDetail();
      }
      var qtyBtn = e.target.closest("[data-qty]");
      if (qtyBtn) {
        state.qty = Math.max(1, Math.min(20, state.qty + Number(qtyBtn.getAttribute("data-qty"))));
        return updateDetail();
      }
      if (e.target.closest("[data-add]")) return addToCart();
      return;
    }
    var card = e.target.closest(".ps-card");
    if (card) openProduct(card.getAttribute("data-id"));
  });

  els.moreBtn.addEventListener("click", function () {
    state.limit += PAGE_SIZE;
    renderGrid();
  });

  els.filterBtn.addEventListener("click", openSide);
  els.sideBackdrop.addEventListener("click", closeSide);
  document.querySelectorAll("[data-side-close]").forEach(function (b) { b.addEventListener("click", closeSide); });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (els.side.classList.contains("is-open")) closeSide();
    else if (state.open) closeProduct();
  });

  var resizeTimer = null;
  var lastWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 991) closeSide();
      if (state.open) placeDetail(false);
    }, 150);
  });

  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) updateCartBadge();
  });

  function onLanguageChange() {
    var l = lang();
    applyStaticText();
    ensureDescriptions(l, function () { renderAll(); });
    renderAll();
  }

  new MutationObserver(onLanguageChange).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  /* ---------------------------------------------------------------- init */

  readUrl();
  els.searchClear.hidden = !els.search.value;
  applyStaticText();
  renderAll();
  updateCartBadge();
  ensureDescriptions(lang(), function () { renderAll(); });
  document.addEventListener("DOMContentLoaded", function () {
    var jq = window.jQuery;
    if (jq && jq.fn.niceSelect) jq(els.sort).niceSelect("destroy");
  });
  if (state.open) {
    setTimeout(function () {
      var panel = els.grid.querySelector(".ps-detail");
      var card = els.grid.querySelector('.ps-card[data-id="' + cssEscape(state.open) + '"]');
      if (card) window.scrollTo({ top: card.getBoundingClientRect().top + window.pageYOffset - 100 });
      else if (panel) panel.scrollIntoView();
    }, 60);
  }
})();
