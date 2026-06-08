(function (global) {
  var BOOKING_LINES_KEY = "derandBookingExtraLines";

  var FLOWER_ITEMS = [
    { id: "flowers-0", label: "Single Red Roses", image: "img/flower.jpg", price: 3, category: "flowers" },
    { id: "flowers-1", label: "Single White Rose", image: "img/whiteflower.png", price: 3, category: "flowers" },
    { id: "flowers-2", label: "Single Pink Rose", image: "img/redrose.jpg", price: 3, category: "flowers" },
    { id: "flowers-3", label: "Single Pink Dianthus", image: "img/rose.jpg", price: 2, category: "flowers" },
    { id: "flowers-4", label: "Single White Dianthus", image: "img/whiteflowers.png", price: 2, category: "flowers" },
    { id: "flowers-5", label: "Single White Lily", image: "img/flower5.png", price: 8, category: "flowers" },
    { id: "flowers-6", label: "Single Pink Lily", image: "img/lilypink.png", price: 8, category: "flowers" },
    { id: "flowers-7", label: "Lily Bouquet", image: "img/flower1.jpg", price: 50, category: "flowers" },
    { id: "flowers-8", label: "A Bouquet of Red Roses", image: "img/flower2.jpg", price: 60, category: "flowers" },
    { id: "flowers-9", label: "A Bouquet of Yellow Tulips", image: "img/flower3.jpg", price: 55, category: "flowers" },
    { id: "flowers-10", label: "Mixed Flower Bouquet", image: "img/flowers1.png", price: 50, category: "flowers" },
  ];

  var BOTTLE_ITEMS = [
    { id: "bottle-0", label: "Moët & Chandon — Brut", image: "img/champ.jpg", price: 128, category: "bottle" },
    { id: "bottle-1", label: "Moët & Chandon — Ice", image: "img/champ3.png", price: 208, category: "bottle" },
    { id: "bottle-2", label: "Moët & Chandon — Rosé", image: "img/champ4.png", price: 160, category: "bottle" },
    { id: "bottle-3", label: "Moët & Chandon — Ice Rosé", image: "img/champ5.png", price: 256, category: "bottle" },
    { id: "bottle-4", label: "Dom Pérignon — Brut", image: "img/champ6.png", price: 400, category: "bottle" },
    { id: "bottle-5", label: "Dom Pérignon — Brut Luminous", image: "img/champ7.png", price: 440, category: "bottle" },
    { id: "bottle-6", label: "Don Julio — Añejo", image: "img/tequila.png", price: 200, category: "bottle" },
    { id: "bottle-7", label: "Don Julio — Reposado", image: "img/tequila1.png", price: 228, category: "bottle" },
    { id: "bottle-8", label: "Don Julio — Blanco", image: "img/tequila2.png", price: 228, category: "bottle" },
    { id: "bottle-9", label: "Don Julio — 1942", image: "img/tequila3.png", price: 664, category: "bottle" },
    { id: "bottle-10", label: "Cîroc Vodka", image: "img/vodka.png", price: 120, category: "bottle" },
    { id: "bottle-11", label: "Grey Goose Vodka", image: "img/vodka1.png", price: 120, category: "bottle" },
    { id: "bottle-12", label: "Belvedere Vodka", image: "img/vodka2.png", price: 120, category: "bottle" },
    { id: "bottle-13", label: "Tanqueray — Ten", image: "img/vodka3.png", price: 120, category: "bottle" },
    { id: "bottle-14", label: "Hendrick's Gin", image: "img/vodka4.png", price: 140, category: "bottle" },
    { id: "bottle-15", label: "Jägermeister", image: "img/jager.png", price: 140, category: "bottle" },
  ];

  var CHOCOLATE_ITEMS = [
    { id: "chocolate-tog", label: "With love from Kosova", image: "img/tog.png", price: 10.6, category: "chocolate" },
    { id: "chocolate-tog1", label: "With love from Prishtina", image: "img/tog1.png", price: 10.6, category: "chocolate" },
    { id: "chocolate-tog2", label: "With love from Prizreni", image: "img/tog2.png", price: 10.6, category: "chocolate" },
    { id: "chocolate-tog3", label: "Me dashni per ty", image: "img/tog3.png", price: 16.63, category: "chocolate" },
    { id: "chocolate-tog4", label: "Cranberry Dark Chocolate", image: "img/tog4.png", price: 6.25, category: "chocolate" },
    { id: "chocolate-tog5", label: "Tog Spicy Chocolate bar", image: "img/tog5.png", price: 6.25, category: "chocolate" },
    { id: "chocolate-tog6", label: 'Tog Tablet "ASAJ"', image: "img/tog6.png", price: 6.25, category: "chocolate" },
  ];

  var PERFUME_ITEMS = [
    { id: "perfume-armani", label: "Giorgio Armani", image: "img/armani.png", price: 44.71, category: "perfume" },
    { id: "perfume-diesel", label: "DIESEL LOVERDOSE", image: "img/diesel.png", price: 59.72, category: "perfume" },
    { id: "perfume-dkny", label: "DKNY BE DELICIOUS", image: "img/dkny.png", price: 52.92, category: "perfume" },
    { id: "perfume-juliet", label: "JULIET HAS A GUN", image: "img/juliet.png", price: 151.2, category: "perfume" },
    { id: "perfume-prada", label: "Prada Candy", image: "img/prada.png", price: 99.47, category: "perfume" },
    { id: "perfume-roberto", label: "Roberto Cavalli Just Cavalli For Her", image: "img/roberto.png", price: 30.67, category: "perfume" },
    { id: "perfume-valentino", label: "Valentino Born In Roma", image: "img/valentino.png", price: 109.4, category: "perfume" },
    { id: "perfume-thierry", label: "Thierry Mugler MU ANG NOVA", image: "img/thierry.png", price: 127.98, category: "perfume" },
    { id: "perfume-ralph", label: "Ralph Lauren Polo Blue", image: "img/ralph.png", price: 83.81, category: "perfume" },
    { id: "perfume-montale", label: "MONTALE AOUD LIME", image: "img/montale.png", price: 162, category: "perfume" },
    { id: "perfume-viktor", label: "FLBB EDP SPRAY", image: "img/viktor.png", price: 94.93, category: "perfume" },
    { id: "perfume-yves", label: "YVES SAINT LAURENT", image: "img/yves.png", price: 132.19, category: "perfume" },
  ];

  var CATEGORIES = {
    flowers: { id: "flowers", label: "Flowers", items: FLOWER_ITEMS },
    bottle: { id: "bottle", label: "Champagne & spirits", items: BOTTLE_ITEMS },
    chocolate: { id: "chocolate", label: "Tog chocolates", items: CHOCOLATE_ITEMS },
    perfume: { id: "perfume", label: "Perfumes", items: PERFUME_ITEMS },
  };

  var EXTRA_ITEMS = {};
  Object.keys(CATEGORIES).forEach(function (catKey) {
    CATEGORIES[catKey].items.forEach(function (item) {
      EXTRA_ITEMS[item.id] = item;
    });
  });

  function loadBookingLines() {
    try {
      var raw = global.sessionStorage.getItem(BOOKING_LINES_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveBookingLines(lines) {
    try {
      global.sessionStorage.setItem(BOOKING_LINES_KEY, JSON.stringify(lines || []));
    } catch (e) {
      /* ignore */
    }
  }

  function clearBookingLines() {
    try {
      global.sessionStorage.removeItem(BOOKING_LINES_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  function lineTotal(line) {
    if (!line) return 0;
    return (line.price || 0) * (line.qty || 1);
  }

  function getBookingLinesTotal(lines) {
    return (lines || []).reduce(function (sum, line) {
      return sum + lineTotal(line);
    }, 0);
  }

  function parseExtrasParam(value) {
    if (!value) return [];
    return String(value)
      .split(",")
      .map(function (part) {
        return part.trim();
      })
      .filter(function (id) {
        return EXTRA_ITEMS[id];
      });
  }

  function linesFromLegacyIds(ids) {
    return (ids || [])
      .map(function (id) {
        var item = EXTRA_ITEMS[id];
        if (!item) return null;
        return {
          id: item.id,
          label: item.label,
          price: item.price,
          image: item.image,
          category: item.category,
          qty: 1,
        };
      })
      .filter(Boolean);
  }

  function getBookingLinesForState(legacyIds) {
    var stored = loadBookingLines();
    if (stored.length) return stored;
    return linesFromLegacyIds(legacyIds);
  }

  function encodeExtrasParam(ids) {
    return (ids || [])
      .filter(function (id) {
        return EXTRA_ITEMS[id];
      })
      .join(",");
  }

  function getExtrasTotal(ids) {
    return getBookingLinesTotal(linesFromLegacyIds(ids));
  }

  function getExtrasLines(ids) {
    return linesFromLegacyIds(ids);
  }

  function getCategoryItems(categoryId) {
    var cat = CATEGORIES[categoryId];
    return cat ? cat.items.slice() : [];
  }

  function getCategoryMeta(categoryId) {
    return CATEGORIES[categoryId] || null;
  }

  function categoryHasExtras(idsOrLines, categoryId) {
    if (!categoryId) return false;
    function lineMatchesCategory(line) {
      if (!line) return false;
      if (line.category === categoryId) return true;
      if (categoryId === "decor") {
        var text = String(line.label || line.productBase || "").toLowerCase();
        return text.indexOf("decor") !== -1;
      }
      return false;
    }
    if (Array.isArray(idsOrLines) && idsOrLines.length && typeof idsOrLines[0] === "object") {
      return idsOrLines.some(lineMatchesCategory);
    }
    var lines = linesFromLegacyIds(idsOrLines || []);
    return lines.some(lineMatchesCategory);
  }

  function getItemById(id) {
    return EXTRA_ITEMS[id] || null;
  }

  global.DerandBooking = {
    BOOKING_LINES_KEY: BOOKING_LINES_KEY,
    CATEGORIES: CATEGORIES,
    EXTRA_ITEMS: EXTRA_ITEMS,
    loadBookingLines: loadBookingLines,
    saveBookingLines: saveBookingLines,
    clearBookingLines: clearBookingLines,
    getBookingLinesTotal: getBookingLinesTotal,
    getBookingLinesForState: getBookingLinesForState,
    lineTotal: lineTotal,
    parseExtrasParam: parseExtrasParam,
    encodeExtrasParam: encodeExtrasParam,
    getExtrasTotal: getExtrasTotal,
    getExtrasLines: getExtrasLines,
    getCategoryItems: getCategoryItems,
    getCategoryMeta: getCategoryMeta,
    categoryHasExtras: categoryHasExtras,
    getItemById: getItemById,
  };
})(typeof window !== "undefined" ? window : this);
