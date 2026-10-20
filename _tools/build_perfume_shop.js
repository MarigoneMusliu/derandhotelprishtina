/*
 * Builds js/perfume-shop-data.js (+ German / Albanian description files) from the
 * perfume catalogue inside extra.html and the translations in js/extra-i18n.js.
 *
 * Run from the project folder after adding or changing perfumes on extra.html:
 *   node _tools/build_perfume_shop.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

function sliceObject(src, startMarker) {
  const start = src.indexOf(startMarker);
  if (start < 0) throw new Error("Not found: " + startMarker);
  const open = src.indexOf(startMarker.trim().endsWith("[") ? "[" : "{", start);
  const close = open === -1 ? -1 : matchBracket(src, open);
  return src.slice(start, close + 1);
}

function matchBracket(src, i) {
  const pairs = { "{": "}", "[": "]" };
  const stack = [];
  let str = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (str) {
      if (c === "\\") { i++; continue; }
      if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { str = c; continue; }
    if (c === "{" || c === "[") stack.push(pairs[c]);
    else if (c === "}" || c === "]") {
      stack.pop();
      if (!stack.length) return i;
    }
  }
  throw new Error("Unbalanced brackets");
}

function loadCatalog() {
  const html = read("extra.html");
  const code =
    sliceObject(html, "var PERFUME_CATALOG_IDS = [") + ";\n" +
    sliceObject(html, "var PERFUME_CATALOG = {") + ";\n" +
    "out = { ids: PERFUME_CATALOG_IDS, cat: PERFUME_CATALOG };";
  const ctx = { out: null };
  vm.runInNewContext(code, ctx);
  return ctx.out;
}

function loadI18n() {
  const src = read("js/extra-i18n.js");
  const code = sliceObject(src, "var T = {") + ";\nout = T;";
  const ctx = { out: null };
  vm.runInNewContext(code, ctx);
  return ctx.out;
}

/* ---------------------------------------------------------------- brands */

const BRANDS = [
  [/^(YVES SAINT LAU(RENT)?|YSL)\b/i, "Yves Saint Laurent"],
  [/^ARMANI PRIVE\b/i, "Armani Privé"],
  [/^(GIORGIO ARMANI|ARMANI EMPORIO|EMPORIO ARMANI|ARMANI)\b/i, "Giorgio Armani"],
  [/^MAISON MARGIELA\b/i, "Maison Margiela"],
  [/^BIOTHERM\b/i, "Biotherm"],
  [/^LANCOME\b/i, "Lancôme"],
  [/^VALENTINO\b/i, "Valentino"],
  [/^TIZIANA TERENZI\b/i, "Tiziana Terenzi"],
  [/^PRADA\b/i, "Prada"],
  [/^MIU MIU\b/i, "Miu Miu"],
  [/^XERJOFF\b/i, "Xerjoff"],
  [/^RALPH LAUREN\b/i, "Ralph Lauren"],
  [/^ROBERTO CAVALLI\b/i, "Roberto Cavalli"],
  [/^JUST CAVALLI\b/i, "Just Cavalli"],
  [/^SHISEIDO\b/i, "Shiseido"],
  [/^GUESS\b/i, "Guess"],
  [/^(VIKTOR&ROLF|FLBB|SPB|BONBON)\b/i, "Viktor&Rolf"],
  [/^(THIERRY MUGLER|MUGLER)\b/i, "Mugler"],
  [/^DKNY\b/i, "DKNY"],
  [/^(JULIETTE HAS|JHAG)\b/i, "Juliette Has a Gun"],
  [/^CACHAREL\b/i, "Cacharel"],
  [/^(DIESEL|D BY DIESEL)\b/i, "Diesel"],
  [/^AZZARO\b/i, "Azzaro"],
  [/^MANCERA\b/i, "Mancera"],
  [/^MONTALE\b/i, "Montale"],
  [/^NISHANE\b/i, "Nishane"],
  [/^BORNTOSTANDOUT\b/i, "BORNTOSTANDOUT"],
  [/^BOND NO\.?\s?9\b/i, "Bond No. 9"],
];

function brandOf(name) {
  for (const [re, brand] of BRANDS) if (re.test(name)) return brand;
  return name.split(/\s+/)[0];
}

/* Niche houses: everything is shared / unisex unless the line says otherwise. */
const UNISEX_HOUSES = new Set([
  "Armani Privé", "Maison Margiela", "Tiziana Terenzi", "Xerjoff", "Mancera",
  "Montale", "Nishane", "BORNTOSTANDOUT", "Bond No. 9", "Juliette Has a Gun",
]);

/* ---------------------------------------------------------------- kind */

const BEAUTY_RE = /\b(mascara|liner|eyeliner|lip|lipstick|rouge|gloss|loveshine|foundation|teint|concealer|effacernes|powder|blush|palette|bronze|highlighter|luminize|primer|brow|sourcils|khol|kohl|crayon|pencil|cils|lash|nail|cream|creme|crème|serum|sérum|essence|lotion|tonique|toner|cleans|nett|gel|eau mic|micellar|mousse|balm|baume|mask|masque|eye|yeux|deo|deodorant|antiperspirant|roll.?on|stick|shower|douche|body milk|lait|corporel|shimmer|soap|scrub|exfol|spf|uv|sun|aquasource|aquapower|life plankton|blue therapy|biosource|genifique|g[eé]nifique|renergie|r[eé]nergie|absolue|hydra zen|nutrix|confort|galatee|bi.?facil|waso|benefiance|vital perfection|future solution|ultimune|bio.?performance|synchro|essential energy|revitalessence|eudermine|technosatin|controlledchaos|colorgel|maru|naname|hasu|daiya|tsutsu|hanatsubaki|archliner|imperiallash|microliner|setting|loose|skin|make me blush|all hours|touche [eé]clat|collagen|waterlover|aquascreen|day control|men total|clarifying|treatment|refreshing|instant|deep|extra|complete|sports|zen)\b/i;
const FRAGRANCE_RE = /\b(edp|edt|edc|eau de parfum|eau de toilette|eau de cologne|parfum|perfume|extrait|elixir|fragrance|vapo|spray|cologne)\b/i;

function kindOf(e) {
  const n = e.name;
  const lead = (e.description || "").split(/[—.]/)[0];
  if (/^diesel loverdose$/i.test(n.trim()) || /stronger with you .*gift set/i.test(n)) return "fragrance";
  if (/fleur de lait edp|libre l'absolu platine|born in roma .*gift set/i.test(n)) return "fragrance";
  if (/\b(candle|diffuser|wash|hand cream|hair mist|body lotion|shower gel)\b/i.test(n) && !/\b(ed[pt]|parfum)\b.*\bset\b/i.test(n)) return "beauty";
  if (/\bfragrance mist\b|\bhair & body mist\b/i.test(n)) return "fragrance";
  if (/\b(ed[pt]|eau de parfum|eau de toilette|parfum)\b/i.test(n) && /\bset\b/i.test(n)) return "fragrance";
  const nameSaysFragrance = /\b(edp|edt|edc|eau de parfum|eau de toilette|extrait|le parfum|parfum|cologne)\b/i.test(n);
  if (nameSaysFragrance && !/\b(deo|stick|body|lait|shower|lotion|milk|balm|shimmer|hair|cream|serum|eye)\b/i.test(n)) return "fragrance";
  if (BEAUTY_RE.test(n)) return "beauty";
  if (/\b(eau de parfum|eau de toilette|extrait de parfum|le parfum|parfum|cologne)\b/i.test(lead)) return "fragrance";
  if (UNISEX_HOUSES.has(brandOf(n))) return "fragrance";
  if (brandOf(n) === "Biotherm") return "beauty";
  if (FRAGRANCE_RE.test(n)) return "fragrance";
  if (/\bfragrance for\b|\bscent\b/i.test(e.description || "")) return "fragrance";
  return "beauty";
}

/* ---------------------------------------------------------------- gender */

/* Well-known lines, checked against the stock name before anything else. */
const LINE_WOMEN = /acqua di gioia|code feme|code femme|my way|\bsi\b|si passione|si nude|in love with you|power of you|babel she|la vie est belle|\blveb\b|idole|tr[eé]sor|magie noire|les o de lancome|mon paris|black opium|\blibre\b|voce viva|flowerbomb|\bflbb\b|\bfbb\b|bonbon|good fortune|prada candy|^lancome\b|^guess\b|la femme|paradoxe|miu miu|\bnoa\b|amor amor|loulou|anais|ella ella|yes i am|\bangel\b|\balien\b|bella vita|guess love|sexy skin|be delicious|be 100%|be extra|dkny women|roberto cavalli|shiseido (zen|ginza)|loverdose|crazy in love|roses musk|sweet peony|rose elixir/i;
const LINE_MEN = /acqua di gi[oò](?!ia)|profondo|armani code(?! fem)|\bcode (edt|edp|le parfum|elixir|parfum)\b|black code|stronger with you|babel he|emporio armani he\b|l'homme|\by (edp|edt|elixir|le parfum|iced)\b|lau y edp|myslf|luna rossa|paradigme|spicebomb|\bspb\b|only the brave|diesel bad|fuel for life|polo|ralph'?s club|wanted|chrome|azzaro pour homme|a\*men|seductive homme|monsieur/i;

function genderOf(e, brand) {
  const raw = e.name;
  const desc = (e.description || "").toLowerCase();

  if (/\b(uomo|homme|men|man|him|pour homme)\b/i.test(raw) && !/\b(donna|femme|feme|women|her)\b/i.test(raw)) return "men";
  if (/\b(donna|femme|feme|women|woman|her|pour femme)\b|\bf\.ed[pt]\b|\bvapo f\b/i.test(raw)) return "women";
  if (LINE_WOMEN.test(raw)) return "women";
  if (LINE_MEN.test(raw)) return "men";

  if (/\b(unisex|gender-?fluid|genderless|for everyone|for all)\b/.test(desc)) return "unisex";
  if (UNISEX_HOUSES.has(brand)) return "unisex";
  if (/\b(fragrance|scent|perfume|cologne|eau de \w+) for women\b|\bfeminine\b|\bfor her\b/.test(desc)) return "women";
  if (/\b(fragrance|scent|perfume|cologne|eau de \w+) for men\b|\bmasculine\b|\bfor him\b/.test(desc)) return "men";
  return "unisex";
}

/* Beauty & care only has Women / Men filters, so anything not clearly for men is listed under Women. */
function beautyGenderOf(e, brand) {
  if (brand === "Biotherm" && /blue therapy|\bspb\b/i.test(e.name)) return "women";
  const g = genderOf(e, brand);
  if (g !== "unisex") return g;
  return /\bfor men\b(?! and)|\bmen's\b|\bmasculine\b/i.test(e.description || "") ? "men" : "women";
}

/* ---------------------------------------------------------------- names */

const CONC = [
  [/\bextrait( de parfum)?\b/i, "Extrait de Parfum"],
  [/\b(edp|eau de parfum)\b/i, "Eau de Parfum"],
  [/\b(edt|eau de toilette)\b/i, "Eau de Toilette"],
  [/\b(edc|eau de cologne|cologne)\b/i, "Eau de Cologne"],
  [/\b(le parfum|parfum|pure perfume)\b/i, "Parfum"],
];

function concentrationOf(e) {
  const lead = (e.description || "").split(" — ")[0];
  for (const [re, label] of CONC) if (re.test(e.name)) return label;
  for (const [re, label] of CONC) if (re.test(lead)) return label;
  return "";
}

const SMALL = new Set(["de", "di", "du", "la", "le", "les", "of", "the", "for", "and", "à", "a", "in", "by", "et"]);
function titleCase(s) {
  return s
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((w, i) => {
      if (/^\s+$|^-$/.test(w)) return w;
      if (i > 0 && SMALL.has(w)) return w;
      if (/^(ml|g)$/.test(w)) return w;
      if (/^\d+ml$/.test(w)) return w;
      if (/^(ysl|dkny|uv|spf|sp|oud|edp|edt|jtc|x)$/i.test(w)) return w.toUpperCase();
      return w.replace(/^(['’]?)(\p{L})/u, (m, q, c) => q + c.toUpperCase()).replace(/(['’])(\p{L})(\p{L}{2,})/u, (m, q, a, b) => q + a.toUpperCase() + b);
    })
    .join("");
}

function brandPattern(brand) {
  const words = brand.replace(/[.&]/g, " ").split(/\s+/).filter(Boolean).map((w) => w.replace(/[éè]/g, "[eéè]").replace(/ô/g, "[oô]"));
  return new RegExp("^\\s*" + words.join("[\\s&.]*") + "\\s*", "i");
}

function displayNameOf(e, brand) {
  const desc = e.description || "";
  const dash = desc.indexOf(" — ");
  let lead = dash > 0 && dash < 110 ? desc.slice(0, dash) : "";
  if (lead && /[.!?]/.test(lead)) lead = "";

  let name;
  if (lead) {
    name = lead
      .replace(/\s*\([^)]*\)/g, "")
      .replace(brandPattern(brand), "")
      .replace(/^(Giorgio Armani|Emporio Armani|Armani\/Privé|Armani Privé|Armani|Privé|YSL|Viktor ?& ?Rolf|Thierry Mugler|Lancôme|Lancome)\s+/i, "")
      .replace(/^(Privé|Armani\/Privé)\s+/i, "")
      .replace(/,\s*\d+(\.\d+)?\s*(ml|g)\b.*$/i, "")
      .replace(/\s+\b(extrait de parfum|eau de parfum|eau de toilette|eau de cologne|le parfum|parfum|edp|edt)\b.*$/i, (m) => (/le parfum/i.test(m) ? " Le Parfum" : ""))
      .replace(/\s+L['’]$/i, "")
      .trim();
    if (!name || /^[a-z"]/.test(name) || /gift set|holiday set|routine set/i.test(name) && name.length < 25) name = "";
  }
  if (!name) {
    name = titleCase(
      e.name
        .replace(brandPattern(brand), "")
        .replace(/^(YVES SAINT LAU(RENT)?|YSL|GIORGIO ARMANI|EMPORIO ARMANI|ARMANI EMPORIO|ARMANI|VIKTOR&ROLF|THIERRY MUGLER|LANCOME LC|LANCOME|BIOTHERM BIO|BIOTHERM|JHAG|D BY DIESEL)\s+/i, "")
        .replace(/\b(edp|edt|edc|eau de parfum|eau de toilette|eau de cologne|vapo|spray|f\.|h\.)(?=\s|$)/gi, " ")
        .replace(/\b\d+(\.\d+)?\s?ml\b/gi, " ")
        .replace(/\s{2,}/g, " ")
        .trim(),
    );
  }
  if (/^le parfum$/i.test(name)) name = titleCase(e.name.replace(brandPattern(brand), ""));
  if (/^maison margiela \(untitled\)/i.test(e.name)) name = /l'eau/i.test(e.name) ? "Untitled L'Eau" : "Untitled";
  if (/^(eau de|l'?eau)?$/i.test(name)) name = brand;
  name = name
    .replace(/\s+F\.?$/, "")
    .replace(/^Flbb\b/i, "Flowerbomb")
    .replace(/^Spb\b/i, "Spicebomb")
    .replace(/\bCode Feme\b/i, "Code Femme")
    .replace(/\s+L['’]Eau de( Parfum| Toilette)?\b.*$/i, "")
    .replace(/\s+gift set\b,?.*$/i, (m) => (/\+|\band\b/.test(name) ? m.replace(/,.*$/, "") : ""))
    .replace(/ for (men|women)$/, "")
    .replace(/ (fragrance|hair & body) mists?$/i, (m, kind) => (kind.toLowerCase() === "fragrance" ? " Fragrance Mist" : " Hair & Body Mist"))
    .replace(/^La vie est belle/, "La Vie est Belle")
    .replace(/^La Vie Est Belle/, "La Vie est Belle")
    .trim();
  return name || titleCase(e.name);
}

/* ---------------------------------------------------------------- sizes */

function sizesOf(e) {
  const list = Array.isArray(e.sizes) && e.sizes.length ? e.sizes : [];
  return list
    .map((s) => {
      const label = s.label || (s.shade ? "Shade " + s.shade : s.ml ? s.ml + " ml" : "");
      return { label, ml: s.ml || null, price: Number(s.price) || 0, image: s.image || "", default: !!s.default };
    })
    .filter((s) => s.price > 0);
}

/* ---------------------------------------------------------------- build */

function build() {
  const { ids, cat } = loadCatalog();
  const T = loadI18n();
  const products = [];
  const desc = { de: {}, al: {} };

  ids.forEach((id, order) => {
    const e = cat[id];
    if (!e) return;
    const sizes = sizesOf(e);
    if (!sizes.length) return;
    const brand = brandOf(e.name);
    const kind = kindOf(e);
    products.push({
      id,
      order,
      brand,
      name: displayNameOf(e, brand),
      cartName: (T.en && T.en["perfume-name-" + id]) || e.name,
      kind,
      gender: kind === "fragrance" ? genderOf(e, brand) : beautyGenderOf(e, brand),
      conc: kind === "fragrance" ? concentrationOf(e) : "",
      image: e.image,
      sizes,
      desc: (T.en && T.en["perfume-desc-" + id]) || e.description || "",
    });
    ["de", "al"].forEach((lang) => {
      const d = T[lang] && T[lang]["perfume-desc-" + id];
      if (d) desc[lang][id] = d;
    });
  });

  const banner = "/* Generated by _tools/build_perfume_shop.js from extra.html. Do not edit by hand. */\n";
  fs.writeFileSync(path.join(ROOT, "js/perfume-shop-data.js"), banner + "window.PERFUME_SHOP_DATA = " + JSON.stringify(products) + ";\n");
  ["de", "al"].forEach((lang) => {
    fs.writeFileSync(
      path.join(ROOT, "js/perfume-shop-desc-" + lang + ".js"),
      banner + "window.PERFUME_SHOP_DESC = window.PERFUME_SHOP_DESC || {};\nwindow.PERFUME_SHOP_DESC." + lang + " = " + JSON.stringify(desc[lang]) + ";\n",
    );
  });
  return products;
}

if (require.main === module) {
  const products = build();
  const count = (f) => products.filter(f).length;
  console.log("products:", products.length);
  console.log("fragrances:", count((p) => p.kind === "fragrance"), "beauty:", count((p) => p.kind === "beauty"));
  console.log("women:", count((p) => p.gender === "women"), "men:", count((p) => p.gender === "men"), "unisex:", count((p) => p.gender === "unisex"));
  if (process.argv.includes("--list")) {
    products.forEach((p) => console.log([p.kind[0], p.gender || "-", p.brand, p.name, p.conc, "<=", p.cartName].join(" | ")));
  }
}

module.exports = { build };
