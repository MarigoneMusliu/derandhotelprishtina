(function (global) {
  "use strict";

  var LANGS = ["en", "de", "al"];

  var T = {
    en: {
      "extra-page-title": "Concierge | Hotel in Prishtina",
      "extra-meta-description":
        "Derand Hotel Extra offers curated in-room surprises and premium add-ons in Pristina.",
      "extra-hero-title": "Explore our exclusive products",
      "extra-hero-subtitle": "available at your room",
      "extra-hero-more": "More",
      "extra-signature-the": "The",
      "extra-signature-collection": "Signature Collection",
      "extra-flowers-title": "Floral Artistry",
      "extra-flowers-text":
        "Seasonal arrangements curated by our master florists to bring nature\u2019s most delicate scents into your sanctuary.",
      "extra-flowers-btn": "Choose Your Flower",
      "extra-champagne-title": "Champagne Collection",
      "extra-champagne-text":
        "Celebrate the moment with a chilled bottle of our finest vintage champagne, delivered to your door.",
      "extra-champagne-btn": "Choose Your Bottle",
      "extra-perfumes-title": "Olfactory Signature",
      "extra-perfumes-text":
        "Access our exclusive scent library, featuring artisanal fragrances crafted specifically for the Derand mood.",
      "extra-perfumes-btn": "Choose Your Perfume",
      "extra-chocolates-title": "Artisanal Delights",
      "extra-chocolates-text":
        "Handcrafted truffles and pralines delivered to your suite, offering a symphony of rare cacao and refined flavors.",
      "extra-chocolates-btn": "Choose Your Selection",
      "extra-laundry-title": "Pristine Care",
      "extra-laundry-text":
        "From delicate silks to bespoke tailoring, our garment care specialists treat every thread with architectural precision.",
      "extra-laundry-btn": "Choose Your Service",
      "extra-continue-kicker": "In-room celebration decor",
      "extra-continue-heading": "Surprise your most beloved",
      "extra-continue-sub": "And make them feel like home.",
      "extra-decor-prev": "Previous decor",
      "extra-decor-next": "Next decor",
      "extra-decor-options": "Optional decor extras",
      "extra-decor-room-included": "Room decor (included)",
      "extra-decor-total": "Total",
      "extra-decor-prev-extra": "Previous extra",
      "extra-decor-next-extra": "Next extra",
      "extra-decor-browse": "Browse products in this category",
      "extra-decor-prev-product": "Previous product",
      "extra-decor-next-product": "Next product",
      "extra-decor-flower-bouquet": "Flower bouquet",
      "extra-decor-add-bouquet": "Add flower bouquet for 60 euros",
      "extra-decor-remove-bouquet": "Remove flower bouquet from order",
      "extra-decor-add-bouquet-named": "Add {name} to order",
      "extra-decor-remove-bouquet-named": "Remove {name} from order",
      "extra-decor-add-cart": "Add decor to cart",
      "extra-decor-price-note": "Decor 60\u20ac \u00b7 bouquet +60\u20ac below",
      "extra-decor-arrows-hint": "Outer arrows: category \u00b7 inner arrows: pick product",
      "extra-decor-price-request": "Price on request",
      "extra-decor-custom-hint":
        "For custom decor, please contact reception or info@derandhotel.com.",
      "decor-label-valentine": "VALENTINE",
      "decor-label-birthday": "BIRTHDAY PARTY",
      "decor-label-custom": "CUSTOM",
      "decor-price-valentine": "Valentine decor",
      "decor-price-birthday": "Birthday decor",
      "decor-price-custom": "Custom decor",
      "extra-order-title": "Add to cart",
      "extra-order-close": "Close order modal",
      "extra-order-img-prev": "Previous product image",
      "extra-order-img-next": "Next product image",
      "extra-order-perfume-size": "Perfume bottle size",
      "extra-order-laundry-type": "Laundry service type",
      "extra-order-qty-minus": "Decrease quantity",
      "extra-order-qty-plus": "Increase quantity",
      "extra-order-flower-colour": "Rose colour",
      "extra-order-variant-flowers": "Choose your flowers",
      "extra-order-variant-more": "More options",
      "extra-order-discover-eyebrow": "While you are here",
      "extra-order-discover-label": "More in-room extras",
      "extra-order-selected-total": "Selected total:",
      "extra-order-add-cart": "Add to cart",
      "extra-cart-open": "Open shopping cart",
      "extra-cart-label": "Shopping cart",
      "extra-cart-close": "Close cart",
      "extra-cart-kicker": "Room delivery",
      "extra-cart-heading": "Your order",
      "extra-cart-items": "Items",
      "extra-cart-delivery-title": "Delivery details",
      "extra-cart-delivery-hint": "Tell us when to bring your order to your room.",
      "extra-cart-name-label": "Name on reservation",
      "extra-cart-name-placeholder": "As on your booking",
      "extra-cart-date": "Date",
      "extra-cart-time": "Time",
      "extra-cart-notes": "Notes",
      "extra-cart-optional": "optional",
      "extra-cart-notes-placeholder": "Card message or special request",
      "extra-cart-order-total": "Order total",
      "extra-cart-pay": "Pay now",
      "extra-cart-empty": "Your cart is empty",
      "extra-cart-empty-hint": "Add something from our extras below.",
      "extra-cart-remove": "Remove",
      "extra-cart-decrease": "Decrease quantity",
      "extra-cart-increase": "Increase quantity",
      "extra-cart-extra-fallback": "Extra",
      "extra-zoom-close": "Close zoomed image",
      "extra-zoom-alt": "Zoomed image",
      "extra-toast-added": "Added to cart",
      "extra-toast-added-cart": "Added to your cart",
      "extra-toast-updated": "Updated quantity in your cart",
      "extra-toast-added-selections": "Added your selections to the cart",
      "extra-toast-added-booking": "Added to your booking",
      "extra-toast-removed-booking": "Removed from your booking",
      "extra-modal-qty-hint":
        "Please press + to choose how many you want (at least 1).",
      "extra-modal-added-booking": "Added to your booking.",
      "extra-modal-removed-booking": "Removed from your booking.",
      "extra-checkout-empty": "Your cart is empty.",
      "extra-checkout-opening":
        "Opening secure payment... Order email will be sent after successful payment.",
      "extra-flower-red": "Red",
      "extra-flower-white": "White",
      "extra-flower-rose": "Rose",
      "extra-laundry-wash-iron": "Wash & ironing",
      "extra-laundry-iron-only": "Ironing only",
      "extra-discover-flowers": "Flowers",
      "extra-discover-champagne": "Champagne",
      "extra-discover-perfumes": "Perfumes",
      "extra-discover-chocolates": "Tog chocolates",
      "extra-discover-decor": "Decor",
      "extra-discover-laundry": "Laundry",
      "extra-desc-flowers":
        "Fresh seasonal flowers wrapped in decorative paper for a romantic in-room surprise.",
      "extra-desc-champagne": "Premium spirit served chilled in your room.",
      "extra-desc-perfume":
        "Fragrance delivered to your room in the selected bottle size.",
      "extra-desc-chocolate": "Premium Tog chocolate delivered to your room.",
      "extra-desc-laundry":
        "In-room laundry \u2014 choose wash & ironing or ironing only per item.",
      "spirit-desc-default": "Served chilled in your room with premium glassware.",
      "spirit-desc-moet-brut":
        "An iconic house champagne with bright fruitiness, a seductive palate, and an elegant, balanced finish.",
      "spirit-desc-moet-ice":
        "The first champagne made to be served over ice, featuring powerful tropical fruit aromas and a refreshing finish.",
      "spirit-desc-moet-rose":
        "A radiant ros\u00e9 champagne with lively red berry aromas, a vibrant palate, and a romantic character.",
      "spirit-desc-moet-ice-rose":
        "A fresh ros\u00e9 champagne designed for ice, blending sweet red berries, cherries, and a touch of cranberry.",
      "spirit-desc-dom-brut":
        "A prestigious vintage champagne offering exceptional depth, with notes of dried fruits, toasted brioche, and a silky finish.",
      "spirit-desc-dom-luminous":
        "The legendary vintage Dom P\u00e9rignon in a striking, light-up bottle, combining luxury taste with a vibrant visual presence.",
      "spirit-desc-julio-anejo":
        "Aged 18 months in oak barrels, featuring a rich flavor profile with citrus notes and a hint of caramel.",
      "spirit-desc-julio-reposado":
        "Aged 8 months, offering an exceptionally smooth finish with inviting aromas of lemon, honey, and light spice.",
      "spirit-desc-julio-blanco":
        "A crisp, agave-forward tequila with fresh citrus notes and a clean finish, ideal for premium cocktails.",
      "spirit-desc-julio-1942":
        "An iconic, ultra-premium tequila that is exceptionally smooth with rich notes of oak, vanilla, and roasted agave.",
      "spirit-desc-ciroc":
        "A modern, ultra-premium vodka distilled five times from fine French grapes for a smooth, subtly sweet taste.",
      "spirit-desc-grey-goose":
        "A world-class French vodka made from winter wheat and spring water, renowned for its crisp, clean, and smooth texture.",
      "spirit-desc-belvedere":
        "A luxury Polish rye vodka offering a structured, velvety texture with subtle hints of almond and vanilla.",
      "spirit-desc-tanqueray":
        "A super-premium gin distilled with whole citrus fruits, bursting with bright notes of grapefruit, lime, and orange.",
      "spirit-desc-hendricks":
        "A uniquely refreshing gin infused with cucumber and rose petals, offering a distinct floral and smooth flavor profile.",
      "spirit-desc-jager":
        "Herbal liqueur served chilled in your room with premium glassware.",
      "perfume-desc-armani":
        "A legendary aquatic scent blending crisp marine notes and calabrian bergamot over a warm cedarwood base.",
      "perfume-desc-diesel":
        "An addictive oriental-woody fragrance blending bold star anise and juicy mandarin over a rich, sweet base of liquorice and vanilla.",
      "perfume-desc-dkny":
        "A refreshing floral-fruity fragrance blending crisp green apple and juicy cucumber over a soft, sophisticated base of magnolia and sandalwood.",
      "perfume-desc-juliet":
        "A delicious floral-gourmand fragrance blending sweet raspberry and powdery iris over a rich, creamy base of vanilla and sandalwood.",
      "perfume-desc-prada":
        "An indulgent amber-gourmand fragrance blending powdery white musk and warm benzoin over a rich, sweet base of pure caramel.",
      "perfume-desc-roberto":
        "A provocative floral fragrance blending luminous neroli and tahitian tiare flower over a warm, seductive base of palisander rosewood.",
      "perfume-desc-valentino":
        "A modern amber-floral fragrance blending sparkling blackcurrant and luminous jasmine trio over a rich, edgy base of bourbon vanilla.",
      "perfume-desc-thierry":
        "A vibrant amber-floral fragrance blending juicy raspberry and upcycled rose over a rich, sensual base of akigalawood.",
      "perfume-desc-ralph":
        "A refreshing aromatic-aquatic fragrance blending crisp cantaloupe melon and juicy cucumber over a smooth, masculine base of washed suede.",
      "perfume-desc-montale":
        "A captivating woody-floral fragrance blending exotic Pakistani oud and fresh, tart lime over a rich, sensual base of precious rose and patchouli.",
      "perfume-desc-viktor":
        "An explosive amber-floral fragrance blending luminous cattleya orchid and sensual centifolia rose over a warm, addictive base of patchouli and vanilla.",
      "perfume-desc-yves":
        "A powerful aromatic-woody fragrance blending fresh green apple and vibrant sage over a deep, masculine base of amberwood and tonka bean.",
    },
    de: {
      "extra-page-title": "Concierge | Hotel in Pristina",
      "extra-meta-description":
        "Derand Hotel Extra bietet kuratierte \u00dcberraschungen und Premium-Zusatzleistungen auf dem Zimmer in Pristina.",
      "extra-hero-title": "Entdecken Sie unsere exklusiven Produkte",
      "extra-hero-subtitle": "verf\u00fcgbar auf Ihrem Zimmer",
      "extra-hero-more": "Mehr",
      "extra-signature-the": "Die",
      "extra-signature-collection": "Signature Kollektion",
      "extra-flowers-title": "Florale Kunst",
      "extra-flowers-text":
        "Saisonale Arrangements unserer Meisterfloristen, die die zartesten D\u00fcfte der Natur in Ihr Refugium bringen.",
      "extra-flowers-btn": "Blume w\u00e4hlen",
      "extra-champagne-title": "Champagner-Kollektion",
      "extra-champagne-text":
        "Feiern Sie den Moment mit einer gek\u00fchlten Flasche unseres feinsten Jahrgangs-Champagners, direkt an Ihre T\u00fcr geliefert.",
      "extra-champagne-btn": "Flasche w\u00e4hlen",
      "extra-perfumes-title": "Olfaktorische Signatur",
      "extra-perfumes-text":
        "Zugang zu unserer exklusiven Duftbibliothek mit handwerklich komponierten Parfums f\u00fcr die Derand-Atmosph\u00e4re.",
      "extra-perfumes-btn": "Parfum w\u00e4hlen",
      "extra-chocolates-title": "Handwerkliche K\u00f6stlichkeiten",
      "extra-chocolates-text":
        "Handgefertigte Tr\u00fcffel und Pralinen auf Ihr Zimmer \u2013 eine Symphonie aus seltenem Kakao und feinen Aromen.",
      "extra-chocolates-btn": "Auswahl w\u00e4hlen",
      "extra-laundry-title": "Pristine Care",
      "extra-laundry-text":
        "Von feiner Seide bis zur Ma\u00dfanfertigung \u2013 unsere Textilpflege-Experten behandeln jedes Detail mit h\u00f6chster Pr\u00e4zision.",
      "extra-laundry-btn": "Service w\u00e4hlen",
      "extra-continue-kicker": "Feier-Dekoration im Zimmer",
      "extra-continue-heading": "\u00dcberraschen Sie Ihre Liebsten",
      "extra-continue-sub": "Und schenken Sie ihnen ein Gef\u00fchl von Zuhause.",
      "extra-decor-prev": "Vorherige Dekoration",
      "extra-decor-next": "N\u00e4chste Dekoration",
      "extra-decor-options": "Optionale Dekoration-Extras",
      "extra-decor-room-included": "Zimmerdekoration (inklusive)",
      "extra-decor-total": "Gesamt",
      "extra-decor-prev-extra": "Vorheriges Extra",
      "extra-decor-next-extra": "N\u00e4chstes Extra",
      "extra-decor-browse": "Produkte in dieser Kategorie durchsuchen",
      "extra-decor-prev-product": "Vorheriges Produkt",
      "extra-decor-next-product": "N\u00e4chstes Produkt",
      "extra-decor-flower-bouquet": "Blumenstrau\u00df",
      "extra-decor-add-bouquet": "Blumenstrau\u00df f\u00fcr 60 Euro hinzuf\u00fcgen",
      "extra-decor-remove-bouquet": "Blumenstrau\u00df aus der Bestellung entfernen",
      "extra-decor-add-bouquet-named": "{name} zur Bestellung hinzuf\u00fcgen",
      "extra-decor-remove-bouquet-named": "{name} aus der Bestellung entfernen",
      "extra-decor-add-cart": "Dekoration in den Warenkorb",
      "extra-decor-price-note": "Dekoration 60\u20ac \u00b7 Strau\u00df +60\u20ac unten",
      "extra-decor-arrows-hint":
        "\u00c4u\u00dfere Pfeile: Kategorie \u00b7 innere Pfeile: Produkt w\u00e4hlen",
      "extra-decor-price-request": "Preis auf Anfrage",
      "extra-decor-custom-hint":
        "F\u00fcr individuelle Dekoration kontaktieren Sie bitte die Rezeption oder info@derandhotel.com.",
      "decor-label-valentine": "VALENTINSTAG",
      "decor-label-birthday": "GEBURTSTAG",
      "decor-label-custom": "INDIVIDUELL",
      "decor-price-valentine": "Valentins-Dekoration",
      "decor-price-birthday": "Geburtstags-Dekoration",
      "decor-price-custom": "Individuelle Dekoration",
      "extra-order-title": "In den Warenkorb",
      "extra-order-close": "Bestellfenster schlie\u00dfen",
      "extra-order-img-prev": "Vorheriges Produktbild",
      "extra-order-img-next": "N\u00e4chstes Produktbild",
      "extra-order-perfume-size": "Parfumflaschengr\u00f6\u00dfe",
      "extra-order-laundry-type": "W\u00e4scheservice",
      "extra-order-qty-minus": "Menge verringern",
      "extra-order-qty-plus": "Menge erh\u00f6hen",
      "extra-order-flower-colour": "Rosenfarbe",
      "extra-order-variant-flowers": "Blumen w\u00e4hlen",
      "extra-order-variant-more": "Weitere Optionen",
      "extra-order-discover-eyebrow": "W\u00e4hrend Sie hier sind",
      "extra-order-discover-label": "Weitere Zimmer-Extras",
      "extra-order-selected-total": "Ausgew\u00e4hlte Summe:",
      "extra-order-add-cart": "In den Warenkorb",
      "extra-cart-open": "Warenkorb \u00f6ffnen",
      "extra-cart-label": "Warenkorb",
      "extra-cart-close": "Warenkorb schlie\u00dfen",
      "extra-cart-kicker": "Zimmerlieferung",
      "extra-cart-heading": "Ihre Bestellung",
      "extra-cart-items": "Artikel",
      "extra-cart-delivery-title": "Lieferdetails",
      "extra-cart-delivery-hint":
        "Teilen Sie uns mit, wann wir Ihre Bestellung auf Ihr Zimmer bringen sollen.",
      "extra-cart-name-label": "Name der Reservierung",
      "extra-cart-name-placeholder": "Wie in Ihrer Buchung",
      "extra-cart-date": "Datum",
      "extra-cart-time": "Uhrzeit",
      "extra-cart-notes": "Notizen",
      "extra-cart-optional": "optional",
      "extra-cart-notes-placeholder": "Kartentext oder besondere W\u00fcnsche",
      "extra-cart-order-total": "Bestellsumme",
      "extra-cart-pay": "Jetzt bezahlen",
      "extra-cart-empty": "Ihr Warenkorb ist leer",
      "extra-cart-empty-hint": "F\u00fcgen Sie unten etwas aus unseren Extras hinzu.",
      "extra-cart-remove": "Entfernen",
      "extra-cart-decrease": "Menge verringern",
      "extra-cart-increase": "Menge erh\u00f6hen",
      "extra-cart-extra-fallback": "Extra",
      "extra-zoom-close": "Vergr\u00f6\u00dferung schlie\u00dfen",
      "extra-zoom-alt": "Vergr\u00f6\u00dfertes Bild",
      "extra-toast-added": "In den Warenkorb gelegt",
      "extra-toast-added-cart": "Zu Ihrem Warenkorb hinzugef\u00fcgt",
      "extra-toast-updated": "Menge im Warenkorb aktualisiert",
      "extra-toast-added-selections": "Auswahl in den Warenkorb gelegt",
      "extra-toast-added-booking": "Zur Buchung hinzugef\u00fcgt",
      "extra-toast-removed-booking": "Aus der Buchung entfernt",
      "extra-modal-qty-hint":
        "Bitte + dr\u00fccken, um die gew\u00fcnschte Menge zu w\u00e4hlen (mindestens 1).",
      "extra-modal-added-booking": "Zur Buchung hinzugef\u00fcgt.",
      "extra-modal-removed-booking": "Aus der Buchung entfernt.",
      "extra-checkout-empty": "Ihr Warenkorb ist leer.",
      "extra-checkout-opening":
        "Sichere Zahlung wird ge\u00f6ffnet\u2026 Bestell-E-Mail nach erfolgreicher Zahlung.",
      "extra-flower-red": "Rot",
      "extra-flower-white": "Wei\u00df",
      "extra-flower-rose": "Rosa",
      "extra-laundry-wash-iron": "Waschen & B\u00fcgeln",
      "extra-laundry-iron-only": "Nur b\u00fcgeln",
      "extra-discover-flowers": "Blumen",
      "extra-discover-champagne": "Champagner",
      "extra-discover-perfumes": "Parfums",
      "extra-discover-chocolates": "Tog Pralinen",
      "extra-discover-decor": "Dekoration",
      "extra-discover-laundry": "W\u00e4sche",
      "extra-desc-flowers":
        "Frische Saisonblumen in dekoratives Papier gewickelt \u2013 eine romantische \u00dcberraschung auf dem Zimmer.",
      "extra-desc-champagne": "Premium-Spirituose gek\u00fchlt auf Ihr Zimmer serviert.",
      "extra-desc-perfume":
        "Parfum wird in der gew\u00e4hlten Flaschengr\u00f6\u00dfe auf Ihr Zimmer geliefert.",
      "extra-desc-chocolate": "Premium Tog-Schokolade auf Ihr Zimmer geliefert.",
      "extra-desc-laundry":
        "W\u00e4scheservice im Zimmer \u2013 Waschen & B\u00fcgeln oder nur B\u00fcgeln pro Artikel.",
      "spirit-desc-default": "Gek\u00fchlt auf Ihrem Zimmer mit Premium-Glasware serviert.",
      "spirit-desc-moet-brut":
        "Ein ikonischer Haus-Champagner mit lebendiger Fruchtigkeit, verf\u00fchrerischem Gaumen und elegantem, ausgewogenem Abgang.",
      "spirit-desc-moet-ice":
        "Der erste Champagner f\u00fcr die Servierung auf Eis \u2013 mit tropischen Fruchtaromen und erfrischendem Abgang.",
      "spirit-desc-moet-rose":
        "Ein strahlender Ros\u00e9-Champagner mit lebhaften Beerenaromen, vibrierendem Gaumen und romantischem Charakter.",
      "spirit-desc-moet-ice-rose":
        "Ein frischer Ros\u00e9-Champagner f\u00fcr auf Eis \u2013 mit roten Beeren, Kirschen und einer Note Cranberry.",
      "spirit-desc-dom-brut":
        "Ein prestigetr\u00e4chtiger Jahrgangs-Champagner mit Tiefe, Noten von getrockneten Fr\u00fcchten, Toastbrioche und seidigem Abgang.",
      "spirit-desc-dom-luminous":
        "Der legend\u00e4re Dom P\u00e9rignon Jahrgang in einer leuchtenden Flasche \u2013 Luxusgeschmack mit visueller Pr\u00e4senz.",
      "spirit-desc-julio-anejo":
        "18 Monate in Eichenf\u00e4ssern gereift \u2013 reichhaltig mit Zitrusnoten und einem Hauch Karamell.",
      "spirit-desc-julio-reposado":
        "8 Monate gereift \u2013 au\u00dfergew\u00f6hnlich weich mit Zitrone, Honig und leichter W\u00fcrze.",
      "spirit-desc-julio-blanco":
        "Knackiger Agave-Tequila mit frischen Zitrusnoten und cleanem Abgang \u2013 ideal f\u00fcr Premium-Cocktails.",
      "spirit-desc-julio-1942":
        "Ein ikonischer Ultra-Premium-Tequila, au\u00dfergew\u00f6hnlich weich mit Eiche, Vanille und ger\u00f6steter Agave.",
      "spirit-desc-ciroc":
        "Moderner Ultra-Premium-Wodka, f\u00fcnffach destilliert aus franz\u00f6sischen Trauben \u2013 weich und dezent s\u00fc\u00df.",
      "spirit-desc-grey-goose":
        "Weltklasse-Wodka aus Winterweizen und Quellwasser \u2013 klar, clean und weich.",
      "spirit-desc-belvedere":
        "Luxus-Roggen-Wodka mit strukturierter, samtiger Textur und Noten von Mandel und Vanille.",
      "spirit-desc-tanqueray":
        "Super-Premium-Gin mit ganzen Zitrusfr\u00fcchten \u2013 Grapefruit, Limette und Orange.",
      "spirit-desc-hendricks":
        "Erfrischender Gin mit Gurke und Rosenbl\u00fcten \u2013 floral und weich.",
      "spirit-desc-jager":
        "Kr\u00e4uterlik\u00f6r gek\u00fchlt auf Ihrem Zimmer mit Premium-Glasware.",
      "perfume-desc-armani":
        "Eine legend\u00e4re aquatische Komposition mit marinen Noten und Bergamotte auf warmer Zedernbasis.",
      "perfume-desc-diesel":
        "S\u00fcdliches Orient-Holz mit Sternanis und Mandarine \u00fcber S\u00fc\u00dfholz und Vanille.",
      "perfume-desc-dkny":
        "Erfrischend floral-fruchtig mit gr\u00fcnem Apfel und Gurke auf Magnolie und Sandelholz.",
      "perfume-desc-juliet":
        "Floral-gourmand mit Himbeere und Iris \u00fcber Vanille und Sandelholz.",
      "perfume-desc-prada":
        "Amber-Gourmand mit wei\u00dfem Moschus und Benzoe \u00fcber reiner Karamellbasis.",
      "perfume-desc-roberto":
        "Provokanter Floralduft mit Neroli und Tiar\u00e9 auf Palisander-Rosenholz.",
      "perfume-desc-valentino":
        "Modern amber-floral mit Cassis und Jasmin-Trio \u00fcber Bourbon-Vanille.",
      "perfume-desc-thierry":
        "Lebendig amber-floral mit Himbeere und Rose \u00fcber Akigalawood.",
      "perfume-desc-ralph":
        "Aromatisch-aquatisch mit Melone und Gurke auf Wildleder-Basis.",
      "perfume-desc-montale":
        "Holzig-floral mit pakistanischem Oud und Limette \u00fcber Rose und Patchouli.",
      "perfume-desc-viktor":
        "Amber-floral mit Cattleya-Orchidee und Rose \u00fcber Patchouli und Vanille.",
      "perfume-desc-yves":
        "Aromatisch-holzig mit gr\u00fcnem Apfel und Salbei \u00fcber Amberwood und Tonkabohne.",
    },
    al: {
      "extra-page-title": "Concierge | Hotel n\u00eb Prishtin\u00eb",
      "extra-meta-description":
        "Derand Hotel Extra ofron surpriza dhe shtesa premium n\u00eb dhom\u00eb n\u00eb Prishtin\u00eb.",
      "extra-hero-title": "Zbuloni produktet tona ekskluzive",
      "extra-hero-subtitle": "t\u00eb disponueshme n\u00eb dhom\u00ebn tuaj",
      "extra-hero-more": "M\u00eb shum\u00eb",
      "extra-signature-the": "",
      "extra-signature-collection": "Koleksioni Signature",
      "extra-flowers-title": "Arti Floristik",
      "extra-flowers-text":
        "Aranzhime sezonale t\u00eb kuratuara nga florist\u00ebt tan\u00eb master, duke sjell\u00eb aromat m\u00eb t\u00eb delikata t\u00eb natyr\u00ebs n\u00eb strehimin tuaj.",
      "extra-flowers-btn": "Zgjidhni lul\u00ebn",
      "extra-champagne-title": "Koleksioni i Shampanj\u00ebs",
      "extra-champagne-text":
        "Festoni momentin me nj\u00eb shishe t\u00eb ftohur t\u00eb shampanj\u00ebs m\u00eb t\u00eb mir\u00eb vintage, e dor\u00ebzuar deri te dera juaj.",
      "extra-champagne-btn": "Zgjidhni shishen",
      "extra-perfumes-title": "Nënshkrimi Olfaktor",
      "extra-perfumes-text":
        "Qasje n\u00eb bibliotek\u00ebn ton\u00eb ekskluzive t\u00eb aromave, me parfume artizanale t\u00eb krijuara p\u00ebr atmosfer\u00ebn Derand.",
      "extra-perfumes-btn": "Zgjidhni parfumin",
      "extra-chocolates-title": "Delikatesa Artizanale",
      "extra-chocolates-text":
        "Trufa dhe pralina t\u00eb punuara me dor\u00eb n\u00eb suit\u00ebn tuaj \u2013 simfoni e kakaos rrall\u00eb dhe shijesh t\u00eb rafinuara.",
      "extra-chocolates-btn": "Zgjidhni seleksionin",
      "extra-laundry-title": "Pristine Care",
      "extra-laundry-text":
        "Nga mëndafshi delikat deri te kostumet me porosi \u2013 specialistët tanë trajtojnë çdo fije me precizion arkitektural.",
      "extra-laundry-btn": "Zgjidhni shërbimin",
      "extra-continue-kicker": "Dekor festimi në dhomë",
      "extra-continue-heading": "Surprizoni të dashurit",
      "extra-continue-sub": "Dhe bëni që të ndihen si në shtëpi.",
      "extra-decor-prev": "Dekor i mëparshëm",
      "extra-decor-next": "Dekor tjetër",
      "extra-decor-options": "Ekstra opsionale dekori",
      "extra-decor-room-included": "Dekori i dhomës (përfshirë)",
      "extra-decor-total": "Totali",
      "extra-decor-prev-extra": "Ekstra e mëparshme",
      "extra-decor-next-extra": "Ekstra tjetër",
      "extra-decor-browse": "Shfletoni produktet në këtë kategori",
      "extra-decor-prev-product": "Produkti i mëparshëm",
      "extra-decor-next-product": "Produkti tjetër",
      "extra-decor-flower-bouquet": "Buqetë lulesh",
      "extra-decor-add-bouquet": "Shto buqetë lulesh për 60 euro",
      "extra-decor-remove-bouquet": "Hiq buqetën nga porosia",
      "extra-decor-add-bouquet-named": "Shto {name} në porosi",
      "extra-decor-remove-bouquet-named": "Hiq {name} nga porosia",
      "extra-decor-add-cart": "Shto dekorin në shportë",
      "extra-decor-price-note": "Dekori 60€ · buqeta +60€ më poshtë",
      "extra-decor-arrows-hint": "Shigjetat e jashtme: kategori · brenda: produkt",
      "extra-decor-price-request": "Çmimi sipas kërkesës",
      "extra-decor-custom-hint":
        "Për dekor të personalizuar, kontaktoni recepsionin ose info@derandhotel.com.",
      "decor-label-valentine": "VALENTIN",
      "decor-label-birthday": "DITËLINDJE",
      "decor-label-custom": "PERSONALIZUAR",
      "decor-price-valentine": "Dekor Valentini",
      "decor-price-birthday": "Dekor ditëlindjeje",
      "decor-price-custom": "Dekor personalizuar",
      "extra-order-title": "Shto në shportë",
      "extra-order-close": "Mbyll dritaren e porosisë",
      "extra-order-img-prev": "Foto e mëparshme e produktit",
      "extra-order-img-next": "Foto tjetër e produktit",
      "extra-order-perfume-size": "Madhësia e shishe së parfumit",
      "extra-order-laundry-type": "Lloji i shërbimit të rrobalarësisë",
      "extra-order-qty-minus": "Ul sasinë",
      "extra-order-qty-plus": "Rrit sasinë",
      "extra-order-flower-colour": "Ngjyra e trëndafilave",
      "extra-order-variant-flowers": "Zgjidhni lulet",
      "extra-order-variant-more": "Më shumë opsione",
      "extra-order-discover-eyebrow": "Ndërsa jeni këtu",
      "extra-order-discover-label": "Më shumë ekstra në dhomë",
      "extra-order-selected-total": "Totali i zgjedhur:",
      "extra-order-add-cart": "Shto në shportë",
      "extra-cart-open": "Hap shportën",
      "extra-cart-label": "Shporta",
      "extra-cart-close": "Mbyll shportën",
      "extra-cart-kicker": "Dorëzim në dhomë",
      "extra-cart-heading": "Porosia juaj",
      "extra-cart-items": "Artikuj",
      "extra-cart-delivery-title": "Detajet e dorëzimit",
      "extra-cart-delivery-hint": "Na tregoni kur ta çojmë porosinë në dhomën tuaj.",
      "extra-cart-name-label": "Emri në rezervim",
      "extra-cart-name-placeholder": "Si në rezervimin tuaj",
      "extra-cart-date": "Data",
      "extra-cart-time": "Ora",
      "extra-cart-notes": "Shënime",
      "extra-cart-optional": "opsionale",
      "extra-cart-notes-placeholder": "Mesazh kartoline ose kërkesë speciale",
      "extra-cart-order-total": "Totali i porosisë",
      "extra-cart-pay": "Paguaj tani",
      "extra-cart-empty": "Shporta juaj është bosh",
      "extra-cart-empty-hint": "Shtoni diçka nga ekstrat më poshtë.",
      "extra-cart-remove": "Hiq",
      "extra-cart-decrease": "Ul sasinë",
      "extra-cart-increase": "Rrit sasinë",
      "extra-cart-extra-fallback": "Ekstra",
      "extra-zoom-close": "Mbyll zmadhimin",
      "extra-zoom-alt": "Imazh i zmadhuar",
      "extra-toast-added": "Shtuar në shportë",
      "extra-toast-added-cart": "Shtuar në shportën tuaj",
      "extra-toast-updated": "Sasia u përditësua në shportë",
      "extra-toast-added-selections": "Zgjedhjet u shtuan në shportë",
      "extra-toast-added-booking": "Shtuar në rezervimin tuaj",
      "extra-toast-removed-booking": "Hequr nga rezervimi",
      "extra-modal-qty-hint":
        "Ju lutemi shtypni + për të zgjedhur sasinë (të paktën 1).",
      "extra-modal-added-booking": "Shtuar në rezervimin tuaj.",
      "extra-modal-removed-booking": "Hequr nga rezervimi.",
      "extra-checkout-empty": "Shporta juaj është bosh.",
      "extra-checkout-opening":
        "Duke hapur pagesën e sigurt… Emaili i porosisë pas pagesës së suksesshme.",
      "extra-flower-red": "E kuqe",
      "extra-flower-white": "E bardhë",
      "extra-flower-rose": "Rozë",
      "extra-laundry-wash-iron": "Larje & hekurosje",
      "extra-laundry-iron-only": "Vetëm hekurosje",
      "extra-discover-flowers": "Lule",
      "extra-discover-champagne": "Shampanjë",
      "extra-discover-perfumes": "Parfume",
      "extra-discover-chocolates": "Çokollata Tog",
      "extra-discover-decor": "Dekor",
      "extra-discover-laundry": "Rroba larëse",
      "extra-desc-flowers":
        "Lule sezonale të freskëta të mbështjella për një surprizë romantike në dhomë.",
      "extra-desc-champagne": "Pije premium e servirur e ftohur në dhomën tuaj.",
      "extra-desc-perfume":
        "Parfumi dorëzohet në dhomë në madhësinë e zgjedhur të shishes.",
      "extra-desc-chocolate": "Çokollatë premium Tog e dorëzuar në dhomë.",
      "extra-desc-laundry":
        "Rroba larëse në dhomë — larje & hekurosje ose vetëm hekurosje për artikull.",
      "spirit-desc-default": "E servirur e ftohur në dhomë me qelq premium.",
      "spirit-desc-moet-brut":
        "Shampanjë ikonike me fruktë të gjalla, palat tërheqës dhe finish elegant.",
      "spirit-desc-moet-ice":
        "Shampanja e parë për servim mbi akull, me aroma tropikale frutore.",
      "spirit-desc-moet-rose":
        "Rosé me aroma të gjalla mali të kuq dhe karakter romantik.",
      "spirit-desc-moet-ice-rose":
        "Rosé e freskët për akull, me mali të kuq, qershi dhe pak cranberry.",
      "spirit-desc-dom-brut":
        "Vintage prestigjioz me thellësi, fruta të thata, briosh të pjekur dhe finish të butë.",
      "spirit-desc-dom-luminous":
        "Dom Pérignon legjendar në shishe me dritë — shije luksoze dhe prezencë vizuale.",
      "spirit-desc-julio-anejo":
        "18 muaj në fuçi druri, me shije të pasur, agrume dhe nuancë karameli.",
      "spirit-desc-julio-reposado":
        "8 muaj, finish jashtëzakonisht i butë me limon, mjaltë dhe erëza të lehta.",
      "spirit-desc-julio-blanco":
        "Tequila e pastër me agave dhe agrume, ideale për koktej premium.",
      "spirit-desc-julio-1942":
        "Tequila ultra-premium, e butë me dru, vanilë dhe agave të pjekur.",
      "spirit-desc-ciroc":
        "Vodka moderne ultra-premium, pesë herë distiluar nga rrush francez.",
      "spirit-desc-grey-goose":
        "Vodka franceze nga gruri i dimrit dhe ujë burimi — e pastër dhe e butë.",
      "spirit-desc-belvedere":
        "Vodka luksoze nga thekri me teksturë të butë dhe nuanca bajameje e vanilje.",
      "spirit-desc-tanqueray":
        "Gin super-premium me agrume të plota — grejpfrut, limë dhe portokall.",
      "spirit-desc-hendricks":
        "Gin me kastravec dhe petale trëndafili — floral dhe i butë.",
      "spirit-desc-jager":
        "Likier bimor i servirur i ftohur në dhomë me qelq premium.",
      "perfume-desc-armani":
        "Aromë legjendare ujore me nota deti dhe bergamot mbi bazë kedri.",
      "perfume-desc-diesel":
        "Orientale-druri me anis dhe mandarin mbi bazë ëmbël lakrice e vanilje.",
      "perfume-desc-dkny":
        "Floral-frutore me mollë jeshile dhe kastravec mbi magnoli e sandal.",
      "perfume-desc-juliet":
        "Floral-gourmand me mali, iris, vanilë e sandal.",
      "perfume-desc-prada":
        "Amber-gourmand me mushk të bardhë dhe benzoe mbi karamel.",
      "perfume-desc-roberto":
        "Floral provokues me neroli dhe tiaré mbi dru palisander.",
      "perfume-desc-valentino":
        "Amber-floral modern me cassis dhe jasemin mbi vanilë bourbon.",
      "perfume-desc-thierry":
        "Amber-floral me mali dhe trëndafil mbi akigalawood.",
      "perfume-desc-ralph":
        "Aromatik-ujor me melonë dhe kastravec mbi suede.",
      "perfume-desc-montale":
        "Druri-floral me oud pakistanez dhe limë mbi trëndafil e patchouli.",
      "perfume-desc-viktor":
        "Amber-floral me orkide cattleya dhe trëndafil mbi patchouli e vanilje.",
      "perfume-desc-yves":
        "Aromatik-druri me mollë jeshile dhe sarri mbi amberwood e tonka.",
    },
  };

  var SPIRIT_DESC_KEYS = {
    "Moët & Chandon — Brut": "spirit-desc-moet-brut",
    "Moët & Chandon — Ice": "spirit-desc-moet-ice",
    "Moët & Chandon — Rosé": "spirit-desc-moet-rose",
    "Moët & Chandon — Ice Rosé": "spirit-desc-moet-ice-rose",
    "Dom Pérignon — Brut": "spirit-desc-dom-brut",
    "Dom Pérignon — Brut Luminous": "spirit-desc-dom-luminous",
    "Don Julio — Añejo": "spirit-desc-julio-anejo",
    "Don Julio — Reposado": "spirit-desc-julio-reposado",
    "Don Julio — Blanco": "spirit-desc-julio-blanco",
    "Don Julio — 1942": "spirit-desc-julio-1942",
    "Cîroc Vodka": "spirit-desc-ciroc",
    "Grey Goose Vodka": "spirit-desc-grey-goose",
    "Belvedere Vodka": "spirit-desc-belvedere",
    "Tanqueray — Ten": "spirit-desc-tanqueray",
    "Hendrick's Gin": "spirit-desc-hendricks",
    "Jägermeister": "spirit-desc-jager",
  };

  function normalizeLang(lang) {
    lang = String(lang || "").toLowerCase().trim();
    if (lang === "sq") lang = "al";
    return LANGS.indexOf(lang) >= 0 ? lang : "en";
  }

  function currentLang() {
    var activeBtn = document.querySelector(".lang-btn.lang-active[data-lang]");
    if (activeBtn) {
      return normalizeLang(activeBtn.getAttribute("data-lang"));
    }

    var htmlLang = normalizeLang(
      document.documentElement.getAttribute("lang") || "",
    );
    if (htmlLang !== "en") return htmlLang;

    var stored =
      localStorage.getItem("derandLang") ||
      localStorage.getItem("selectedLanguage") ||
      localStorage.getItem("language") ||
      localStorage.getItem("lang") ||
      "en";
    return normalizeLang(stored);
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

  function isExtraScopedNode(node) {
    return (
      !node.closest(".header") &&
      !node.closest(".footer") &&
      !node.closest(".site-whatsapp-wrap")
    );
  }

  function applyNodes(selector, attr, applyFn, lang) {
    document.querySelectorAll(selector).forEach(function (node) {
      if (!isExtraScopedNode(node)) return;
      var key = node.getAttribute(attr);
      if (!key) return;
      applyFn(node, t(key, lang));
    });
  }

  function applyPage(lang) {
    lang = normalizeLang(lang);

    document.title = t("extra-page-title", lang);

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

  function spiritDescription(productName, lang) {
    var key = SPIRIT_DESC_KEYS[productName] || "spirit-desc-default";
    return t(key, lang);
  }

  function init() {
    freezeHeaderChrome();
    applyPage(currentLang());
    window.addEventListener("load", freezeHeaderChrome);
    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".lang-btn[data-lang]");
      if (!btn) return;
      var lang = normalizeLang(btn.getAttribute("data-lang"));
      window.setTimeout(function () {
        freezeHeaderChrome();
        applyPage(lang);
      }, 100);
    });
  }

  global.ExtraI18n = {
    t: t,
    currentLang: currentLang,
    applyPage: applyPage,
    spiritDescription: spiritDescription,
    init: init,
  };

  if (document.querySelector(".header")) {
    freezeHeaderChrome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
