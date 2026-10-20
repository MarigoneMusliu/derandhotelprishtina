(function (global) {
  var BOOKING_LINES_KEY = "derandBookingExtraLines";

  var FLOWER_ITEMS = [
    { id: "flowers-0", label: "Single Red Roses", image: "img/flower.jpg", price: 3, category: "flowers" },
    { id: "flowers-1", label: "Single White Rose", image: "img/whiteflower-1.webp", price: 3, category: "flowers" },
    { id: "flowers-2", label: "Single Pink Rose", image: "img/redrose.jpg", price: 3, category: "flowers" },
    { id: "flowers-3", label: "Single Pink Dianthus", image: "img/rose.jpg", price: 2, category: "flowers" },
    { id: "flowers-4", label: "Single White Dianthus", image: "img/whiteflowers-1.webp", price: 2, category: "flowers" },
    { id: "flowers-5", label: "Single White Lily", image: "img/flower5.webp", price: 8, category: "flowers" },
    { id: "flowers-6", label: "Single Pink Lily", image: "img/lilypink.webp", price: 8, category: "flowers" },
    { id: "flowers-7", label: "Lily Bouquet", image: "img/flower1.jpg", price: 50, category: "flowers" },
    { id: "flowers-8", label: "A Bouquet of Red Roses", image: "img/flower2.jpg", price: 60, category: "flowers" },
    { id: "flowers-9", label: "A Bouquet of Yellow Tulips", image: "img/flower3.jpg", price: 55, category: "flowers" },
    { id: "flowers-10", label: "Mixed Flower Bouquet", image: "img/flowers1.webp", price: 50, category: "flowers" },
  ];

  var BOTTLE_ITEMS = [
    { id: "bottle-0", label: "Moët & Chandon — Brut", image: "img/champ.jpg", price: 128, category: "bottle" },
    { id: "bottle-1", label: "Moët & Chandon — Ice", image: "img/champ3.webp", price: 208, category: "bottle" },
    { id: "bottle-2", label: "Moët & Chandon — Rosé", image: "img/champ4.webp", price: 160, category: "bottle" },
    { id: "bottle-3", label: "Moët & Chandon — Ice Rosé", image: "img/champ5.webp", price: 256, category: "bottle" },
    { id: "bottle-4", label: "Dom Pérignon — Brut", image: "img/champ6.webp", price: 400, category: "bottle" },
    { id: "bottle-5", label: "Dom Pérignon — Brut Luminous", image: "img/champ7.webp", price: 440, category: "bottle" },
    { id: "bottle-6", label: "Don Julio — Añejo", image: "img/tequila.webp", price: 200, category: "bottle" },
    { id: "bottle-7", label: "Don Julio — Reposado", image: "img/tequila1.webp", price: 228, category: "bottle" },
    { id: "bottle-8", label: "Don Julio — Blanco", image: "img/tequila2.webp", price: 228, category: "bottle" },
    { id: "bottle-9", label: "Don Julio — 1942", image: "img/tequila3.webp", price: 664, category: "bottle" },
    { id: "bottle-10", label: "Cîroc Vodka", image: "img/vodka-1.webp", price: 120, category: "bottle" },
    { id: "bottle-11", label: "Grey Goose Vodka", image: "img/vodka1-1.webp", price: 120, category: "bottle" },
    { id: "bottle-12", label: "Belvedere Vodka", image: "img/vodka2-1.webp", price: 120, category: "bottle" },
    { id: "bottle-13", label: "Tanqueray — Ten", image: "img/vodka3-1.webp", price: 120, category: "bottle" },
    { id: "bottle-14", label: "Hendrick's Gin", image: "img/vodka4-1.webp", price: 140, category: "bottle" },
    { id: "bottle-15", label: "Jägermeister", image: "img/jager.webp", price: 140, category: "bottle" },
  ];

  var CHOCOLATE_ITEMS = [
    {
      id: "chocolate-tog",
      label: "With love from Kosova",
      image: "img/tog.webp",
      price: 10.6,
      category: "chocolate",
      description:
        "A rich, curated journey of our finest flavors. This collection balances deep dark chocolate creams and smooth milk chocolate textures in perfect harmony—crafted to share a piece of Kosovo's history and national essence.",
    },
    {
      id: "chocolate-tog1",
      label: "With love from Prishtina",
      image: "img/tog1.webp",
      price: 10.6,
      category: "chocolate",
      description:
        "Crafted for the modern palate, featuring a bold and vibrant mix of contemporary fillings, velvety creams, and satisfying crunchy pralines. A perfect match for urban and modern hearts.",
    },
    {
      id: "chocolate-tog2",
      label: "With love from Prizreni",
      image: "img/tog2.webp",
      price: 10.6,
      category: "chocolate",
      description:
        "A timeless, artistic tasting experience where tradition meets art. Comforting, slow-churned creams and traditional roasted nuts melt together elegantly to celebrate the rich heritage of Prizren.",
    },
    {
      id: "chocolate-tog3",
      label: "Spicy Dark Chocolate",
      image: "img/tog3.webp",
      price: 4.99,
      category: "chocolate",
      description:
        "Elegance in simplicity. Intense, bittersweet dark chocolate beautifully balanced by the bright, tangy burst of real, chewy cranberries. A premium tablet dedicated to pure chocolate love.",
    },
    {
      id: "chocolate-tog5",
      label: 'Tog Chocolate "ASAJ" Cranberry Dark Chocolate',
      image: "img/tog5.webp",
      price: 4.99,
      category: "chocolate",
      description:
        "Deep and aromatic. Luxurious dark chocolate infused with a vibrant, tart medley of red berries—honoring the grace, strength, and beauty of the Albanian woman.",
    },
    {
      id: "chocolate-tog4",
      label: "Dark Chocolate with Cranberry",
      image: "img/tog4.webp",
      price: 4.99,
      category: "chocolate",
      description:
        "A bold, fiery contrast. Premium dark chocolate that melts slowly to release a subtle, lingering, and warming chili kick. Perfect for those who love a sophisticated, spicy twist.",
    },
    {
      id: "chocolate-tog6",
      label: 'Cranberry Dark Chocolate "Me dashni për ty"',
      image: "img/tog6.webp",
      price: 9.99,
      category: "chocolate",
      description:
        'Design your perfect box. Mix and match from our 9 unique handcrafted flavors, ranging from zesty fruit creams to silky pistachio and crunchy salted caramel. Packaged in our elegant, vibrant red "With Love for You!" box—perfect for gifts and special occasions.',
    },
  ];

  var PERFUME_ITEMS = [
    { id: "perfume-armani", label: "ARMANI ACQUA DI GIOIA F.EDP", image: "img/parfume.jpg", price: 104.53, category: "perfume" },
    { id: "perfume-cacharel", label: "CACHAREL AMOR AMOR EDT VAPO F", image: "img/parfume1.jpg", price: 60.92, category: "perfume" },
    { id: "perfume-armani-code", label: "ARMANI CODE FEME EDP", image: "img/parfume2.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-lancome", label: "LANCOME LA VIE EST BELLE EDP", image: "img/parfume3.webp", price: 128.04, category: "perfume" },
    { id: "perfume-mon-paris", label: "YVES SAINT LAU MON PARIS EDP", image: "img/ysl-mon-paris.webp", price: 118.56, category: "perfume" },
    { id: "perfume-black-opium", label: "YVES SAINT LAU BLACK OPIUM", image: "img/parfume5.webp", price: 134.11, category: "perfume" },
    { id: "perfume-diesel-brave", label: "DIESEL ONLY THE BRAVE MEN EDT", image: "img/parfume6.jpg", price: 69.90, category: "perfume" },
    { id: "perfume-lhomme-nuit", label: "YVES SAINT LAU L'HOMME NUIT LE PARFUM VAPO", image: "img/parfume7.jpg", price: 144.35, category: "perfume" },
    { id: "perfume-armani-babel-he", label: "ARMANI EMPORIO BABEL HE EDT", image: "img/parfume8.jpg", price: 117.55, category: "perfume" },
    { id: "perfume-y-edp", label: "YVES SAINT LAU Y EDP", image: "img/parfume9.jpg", price: 154.71, category: "perfume" },
    { id: "perfume-libre-edt", label: "YVES SAINT LAU LIBRE EDT", image: "img/parfume10.jpg", price: 126.27, category: "perfume" },
    { id: "perfume-valentino-voce-viva", label: "VALENTINO VOCE VIVA EAU DE PARFUM", image: "img/parfume11.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-valentino-donna", label: "VALENTINO BORN IN ROMA DONNA EAU DE PARFUM", image: "img/parfume12.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-libre-edp-intense", label: "YVES SAINT LAU LIBRE EDP INTENSE", image: "img/parfume13.webp", price: 154.71, category: "perfume" },
    { id: "perfume-valentino-donna-yellow", label: "VALENTINO BORN IN ROMA DONNA YELLOW DREAM EAU DE PARFUM", image: "img/parfume14.webp", price: 123.75, category: "perfume" },
    { id: "perfume-armani-my-way", label: "ARMANI MY WAY EDP", image: "img/parfume15.jpg", price: 130.57, category: "perfume" },
    { id: "perfume-lancome-idole", label: "LANCOME IDOLE EDP", image: "img/parfume16.webp", price: 114.90, category: "perfume" },
    { id: "perfume-armani-in-love-with-you", label: "ARMANI EMPORIO IN LOVE WITH YOU EDP", image: "img/parfume17.jpg", price: 107.06, category: "perfume" },
    { id: "perfume-prada-luna-rossa-carbon", label: "PRADA LUNA ROSSA CARBON EDT", image: "img/parfume18.webp", price: 126.02, category: "perfume" },
    { id: "perfume-prada-luna-rossa-black", label: "PRADA LUNA ROSSA BLACK EDP", image: "img/parfume19.jpg", price: 135.75, category: "perfume" },
    { id: "perfume-prada-lhomme", label: "PRADA L'HOMME EDT", image: "img/parfume20.jpg", price: 135.75, category: "perfume" },
    { id: "perfume-prada-la-femme", label: "PRADA LA FEMME EDP", image: "img/parfume21.jpg", price: 127.79, category: "perfume" },
    { id: "perfume-armani-si-passione", label: "ARMANI SI PASSIONE EDP", image: "img/parfume22.jpg", price: 133.23, category: "perfume" },
    { id: "perfume-viktor", label: "FLBB EDP SPRAY", image: "img/parfume23.jpg", price: 111.11, category: "perfume" },
    { id: "perfume-viktor-spicebomb-extreme", label: "SPB EXTREME EDP", image: "img/parfume24.webp", price: 135.50, category: "perfume" },
    { id: "perfume-viktor-bonbon", label: "BONBON EDP SPRAY", image: "img/parfume25.webp", price: 103.40, category: "perfume" },
    { id: "perfume-cacharel-noa", label: "CACHAREL NOA EDT", image: "img/parfume26.webp", price: 67.24, category: "perfume" },
    { id: "perfume-armani-acqua-gio-stick", label: "ARMANI ACQUA DI GIO H.STICK 75", image: "img/parfume27.webp", price: 65.35, category: "perfume" },
    { id: "perfume-armani-black-code-stick", label: "ARMANI BLACK CODE DEO STICK 75", image: "img/parfume28.webp", price: 68.00, category: "perfume" },
    { id: "perfume-armani-si-edp", label: "ARMANI SI EDP", image: "img/parfume32.webp", price: 133.23, category: "perfume" },
    { id: "perfume-diesel-brave-tattoo", label: "DIESEL ONLY THE BRAVE TATTOO EDT", image: "img/parfume30.webp", price: 69.9, category: "perfume" },
    { id: "perfume-lancome-lveb-body-milk", label: "LANCOME LVEB BODY MILK 200ML", image: "img/parfume31.jpg", price: 73.19, category: "perfume" },
    { id: "perfume-lancome-tresor-edp", label: "LANCOME TRESOR EDP", image: "img/parfume33.webp", price: 128.04, category: "perfume" },
    { id: "perfume-biotherm-aqp-fresh-eyes", label: "BIOTHERM BIO AQS FRESH EYE 15ML", image: "img/parfume34.jpg", price: 70.53, category: "perfume" },
    { id: "perfume-biotherm-aquafitness-shower-gel", label: "BIOTHERM BIO AQUAFITNESS SHOWER GEL T200", image: "img/parfume35.jpg", price: 49.68, category: "perfume" },
    { id: "perfume-biotherm-aquapower-72h", label: "BIOTHERM BIO AQUAPOWER 72H POT 50ML", image: "img/parfume36.jpg", price: 94.04, category: "perfume" },
    { id: "perfume-biotherm-biocils-waterproof", label: "BIOTHERM BIO BIOCILS WATERPROOF F100ML 2016", image: "img/biotherm33.webp", price: 48.28, category: "perfume" },
    { id: "perfume-biotherm-blue-therapy-nuit", label: "BIOTHERM BIO BLUE THERAPY NUIT SPB 50ML", image: "img/parfume38.jpg", price: 148.9, category: "perfume" },
    { id: "perfume-biotherm-blue-therapy-reno-serum", label: "BIOTHERM BIO BLUE THERAPY RENO SERUM FL50ML", image: "img/parfume39.jpg", price: 172.41, category: "perfume" },
    { id: "perfume-biotherm-deo-pure-invisible", label: "BIOTHERM BIO DEO PURE INVISIBLE ROLL ON 48H 75ML", image: "img/parfume40.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-biotherm-lait-corporel-deo", label: "BIOTHERM BIO-LAIT CORPOREL DEO ROLL ON 75ML", image: "img/biotherm22.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-biotherm-day-control-deo-72h", label: "BIOTHERM BIO DAY CONTROL DEO 72H ROLL ON 75ML", image: "img/parfume42.jpg", price: 42.98, category: "perfume" },
    { id: "perfume-biotherm-day-control-ecocert", label: "BIOTHERM BIO DAY CONTROL ECOCERT ROLL ON 75ML", image: "img/biotherm44.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-biotherm-deo-ato-men", label: "BIOTHERM BIO DEO ATO 150 ML MEN", image: "img/biotherm3.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-biotherm-deo-pure-krem", label: "BIOTHERM BIO DEO PURE KREM 75 ML TUBE", image: "img/biotherm11.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-biotherm-deo-pure-rollon", label: "BIOTHERM BIO DEO PURE ROLLON ON 75ML", image: "img/biotherm9.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-biotherm-deo-pure-stick", label: "BIOTHERM DEO PURE STICK 24H ANTIPERSPIRANT STICK", image: "img/biotherm10.webp", price: 42.6, category: "perfume" },
    { id: "perfume-biotherm-deo-rollon-man-pure", label: "BIOTHERM BIO DEO ROLL ON 75 ML MAN PURE", image: "img/biotherm8.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-biotherm-deo-stick-man", label: "BIOTHERM BIO DEO STICK 50 ML MAN", image: "img/parfume49.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-biotherm-eau-vitaminee", label: "BIOTHERM BIO EAU VITAMINEE SPRAY 100ML", image: "img/biotherm6.webp", price: 87.97, category: "perfume" },
    { id: "perfume-biotherm-fs-liquid-eyes", label: "BIOTHERM BIO FS LIQUID EYES", image: "img/parfume51.jpg", price: 107.06, category: "perfume" },
    { id: "perfume-biotherm-lait-de-douche", label: "BIOTHERM BIO LAIT DE DOUCHE 200ML", image: "img/biotherm4.jpg", price: 49.68, category: "perfume" },
    { id: "perfume-biotherm-biosource-nett-pnm", label: "BIOTHERM BIO SOURCE NETT PNM T150ML", image: "img/biotherm3.webp", price: 49.68, category: "perfume" },
    { id: "perfume-biotherm-biosource-eau-mic", label: "BIOTHERM BIOSOURCE EAU MIC TTP FL200ML", image: "img/parfume54.jpg", price: 49.68, category: "perfume" },
    { id: "perfume-biotherm-biosource-gelee-nett", label: "BIOTHERM BIOSOURCE GELEE NETT EXF 150ML", image: "img/parfume55.jpg", price: 49.68, category: "perfume" },
    { id: "perfume-biotherm-biosource-lot-adouc", label: "BIOTHERM BIOSOURCE LOT ADOUC PS FL200ML", image: "img/parfume56.jpg", price: 48.28, category: "perfume" },
    { id: "perfume-biotherm-biosource-lotion-pnm", label: "BIOTHERM BIOSOURCE LOTION PNM 200 ML FL", image: "img/biotherm1.png", price: 49.68, category: "perfume" },
    { id: "perfume-lancome-effacernes", label: "LANCOME EFFACERNES 15ML", image: "img/parfume58.jpg", price: 73.19, category: "perfume" },
    { id: "perfume-lancome-grandiose-01", label: "LANCOME GRANDIOSE 01", image: "img/parfume62.jpg", price: 47.69, category: "perfume" },
    { id: "perfume-lancome-hypnose-clean-volume-01", label: "LANCOME HYPNOSE CLEAN VOLUME 01", image: "img/parfume63.jpg", price: 44.68, category: "perfume" },
    { id: "perfume-lancome-bi-facil-125", label: "LANCOME LC BI FACIL EYES", image: "img/parfume64.jpg", price: 36.66, category: "perfume" },
    { id: "perfume-lancome-galatee-confort-200", label: "LANCOME LC CONFORT GALATEE 200 ML", image: "img/parfume65.jpg", price: 68.0, category: "perfume" },
    { id: "perfume-lancome-crayon-khol-noir", label: "LANCOME LC CRAYON KHOL NOIR", image: "img/parfume66.jpg", price: 41.84, category: "perfume" },
    { id: "perfume-lancome-genifique-cream-50", label: "LANCOME LC GENEFIQUE ACT JEUNESSE CR P50ML", image: "img/parfume67.jpg", price: 164.57, category: "perfume" },
    { id: "perfume-lancome-hypnose-doll-eyes-wp-01", label: "LANCOME LC HYPNOSE DOLL EYES MASCARA 01 6ML WP", image: "img/parfume68.jpg", price: 44.68, category: "perfume" },
    { id: "perfume-lancome-hypnose-doll-eyes-01", label: "LANCOME LC HYPNOSE MASCARA DOLL EYES 01", image: "img/parfume69.jpg", price: 44.68, category: "perfume" },
    { id: "perfume-lancome-creme-mousse-confort-125", label: "LANCOME LC PR CONFORT CR MOUSSE T 125ML", image: "img/parfume70.jpg", price: 68.0, category: "perfume" },
    { id: "perfume-lancome-eau-micellaire-douceur-400", label: "LANCOME LC PR DOUCEUR EAU MIC FL P 400ML", image: "img/parfume71.jpg", price: 101.88, category: "perfume" },
    { id: "perfume-lancome-renergie-multilift-night-50", label: "LANCOME LC RENER MPLIFT NIGHT 50ML", image: "img/parfume72.jpg", price: 224.61, category: "perfume" },
    { id: "perfume-lancome-renergie-creme-50", label: "LANCOME LC RENERGIE CREME 50 ML POT", image: "img/parfume73.jpg", price: 180.25, category: "perfume" },
    { id: "perfume-lancome-tonique-douceur-400", label: "LANCOME LC TONIQUE DOUCEUR 400 ML FLAC", image: "img/parfume74.jpg", price: 97.96, category: "perfume" },
    { id: "perfume-ysl-mascara-mvefc-01", label: "YVES SAINT LAU YSL EYE MASCARA MVEFC 01 black", image: "img/parfume75.jpg", price: 48.75, category: "perfume" },
    { id: "perfume-ysl-dessin-sourcils-02", label: "YVES SAINT LAURENT DESSIN DES SOURCILS EYEBROW PENCIL", image: "img/parfume76.jpg", price: 54.23, category: "perfume" },
    { id: "perfume-ysl-mascara-vefc-wp-01", label: "YVES SAINT LAU YSL MASCARA VEFC WP 01", image: "img/parfume77.jpg", price: 48.75, category: "perfume" },
    { id: "perfume-ysl-touche-eclat-3", label: "YVES SAINT LAURENT TOUCHE ECLAT RADIANT TOUCH", image: "img/parfume78.jpg", price: 69.65, category: "perfume" },
    { id: "perfume-armani-babel-she-edp", label: "ARMANI EMPORIO BABEL SHE EDP", image: "img/parfume79.jpg", price: 146.24, category: "perfume" },
    { id: "perfume-lancome-monsieur-big-01", label: "LANCOME Monsieur Big Mascara 01", image: "img/parfume80.jpg", price: 45.74, category: "perfume" },
    { id: "perfume-biotherm-waterlover-spf30-200", label: "BIOTHERM BIO WATERLOVER SUN MILK SPF30 200M", image: "img/parfume81.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-biotherm-waterlover-spf50-200", label: "BIOTHERM BIO WATERLOVER SUN MILK SPF50 200M", image: "img/parfume82.jpg", price: 66.61, category: "perfume" },
    { id: "perfume-biotherm-blue-therapy-big-eye-15", label: "BIOTHERM BIO BLUE THERAPY BIG EYE 16 5ML", image: "img/s-l1200.jpg", price: 95.05, category: "perfume" },
    { id: "perfume-ysl-primer-moisture-glow", label: "YVES SAINT LAU YSL PRIMER INSTANT MOISTURE GLOW", image: "img/parfume84.jpg", price: 95.43, category: "perfume" },
    { id: "perfume-lancome-hydra-zen-spf15-50", label: "LANCOME LC HYDRAZEN CREME 50ML SPF15", image: "img/parfume89.jpg", price: 112.12, category: "perfume" },
    { id: "perfume-lancome-absolu-plumper", label: "LANCOME L ABSOLU PLUMPER", image: "img/parfume91.jpg", price: 61.05, category: "perfume" },
    { id: "perfume-lancome-teint-miracle", label: "LANCOME TEINT MIRACLE F P30ML", image: "img/parfume92.jpg", price: 96.7, category: "perfume" },
    { id: "perfume-biotherm-lait-corporel-400", label: "BIOTHERM LAIT CORPOREL L'ORIGINAL", image: "img/parfume87.jpg", price: 55.36, category: "perfume" },
    { id: "perfume-biotherm-rasage-sensitive-200", label: "BIOTHERM BIO RASAGE PX SENS 200 ML", image: "img/parfume88.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-biotherm-deo-pure-ecocert", label: "BIOTHERM BIO DEO PURE ECOCERT ROLL ON 75ML", image: "img/parfume90.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-viktor-spicebomb-edt", label: "VIKTOR&ROLF SPB EDT SPRAY", image: "img/parfume93.jpg", price: 111.11, category: "perfume" },
    { id: "perfume-viktor-flowerbomb-nectar", label: "VIKTOR&ROLF FBB NECTAR EDP", image: "img/parfume94.jpg", price: 125.39, category: "perfume" },
    { id: "perfume-biotherm-aquasource-serum-biphase-50", label: "BIOTHERM AQUASOURCE SERUM BIPHASE F50ML", image: "img/parfume100.jpg", price: 48.98, category: "perfume" },
    { id: "perfume-biotherm-aquapower-cleanser", label: "BIOTHERM AQUAPOWER OLIGO-THERMAL FRESH ULTRA CLEANSER", image: "img/parfume101.jpg", price: 49.68, category: "perfume" },
    { id: "perfume-lancome-hypnose", label: "LANCOME HYPNOSE MASCARA", image: "img/parfume102.jpg", price: 47.6, category: "perfume" },
    { id: "perfume-lancome-cils-booster-xl", label: "LANCOME CILS BOOSTER XL ENHANCING LASH PRIMER", image: "img/parfume103.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-lancome-monsieur-big-wp-01", label: "LANCOME MONSIEUR BIG WATERPROOF MASCARA 01", image: "img/parfume104.jpg", price: 45.74, category: "perfume" },
    { id: "perfume-lancome-loose-setting-powder", label: "LANCOME LOOSE SETTING POWDER TRANSLUCENT", image: "img/parfume105.jpg", price: 73.19, category: "perfume" },
    { id: "perfume-lancome-setting-spray", label: "LANCOME SETTING SPRAY", image: "img/parfume106.jpg", price: 63.83, category: "perfume" },
    { id: "perfume-lancome-blush-subtil", label: "LANCOME BLUSH SUBTIL", image: "img/parfume112.jpg", price: 39.06, category: "perfume" },
    { id: "perfume-armani-ea-with-you-intensely", label: "ARMANI EMPORIO STRONGER WITH YOU INTENSELY EDP", image: "img/parfume107.jpg", price: 107.06, category: "perfume" },
    { id: "perfume-prada-candy", label: "PRADA CANDY EDP", image: "img/parfume108.jpg", price: 116.41, category: "perfume" },
    { id: "perfume-prada-la-femme-intense", label: "PRADA LA FEMME INTENSE EDP", image: "img/parfume109.jpg", price: 271.51, category: "perfume" },
    { id: "perfume-prada-lhomme-intense", label: "PRADA L'HOMME INTENSE EDP", image: "img/parfume110.jpg", price: 198.7, category: "perfume" },
    { id: "perfume-prada-lhomme-leau", label: "PRADA L'HOMME L'EAU EDT", image: "img/parfume111.jpg", price: 174.56, category: "perfume" },
    { id: "perfume-biotherm-life-plankton-eye-15", label: "BIOTHERM LIFE PLANKTON EYE 15ML", image: "img/parfume113.jpg", price: 99.22, category: "perfume" },
    { id: "perfume-biotherm-tpur-salty-gel-cleanser-125", label: "BIOTHERM HOMME T-PUR SALTY GEL CLEANSER 125ML", image: "img/parfume114.jpg", price: 48.28, category: "perfume" },
    { id: "perfume-biotherm-aqs-concentrate-bounce-50", label: "BIOTHERM AQUASOURCE CONCENTRATE BOUNCE 50ML", image: "img/parfume115.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-biotherm-aqs-concentrate-pure-50", label: "BIOTHERM AQUASOURCE CONCENTRATE PURE 50ML", image: "img/parfume116.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-biotherm-aqs-concentrate-glow-50", label: "BIOTHERM AQUASOURCE CONCENTRATE GLOW 50ML", image: "img/parfume117.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-lancome-brow-define-pencil", label: "LANCOME BROW DEFINE PENCIL", image: "img/lancome-brow-define-pencil.jpg", price: 44.49, category: "perfume" },
    { id: "perfume-lancome-hypnose-palette", label: "LANCOME HYPNOSE PALETTE 5 COULEURS", image: "img/lancome-hypnose-palette.jpg", price: 117.55, category: "perfume" },
    { id: "perfume-biotherm-aquapower-deo-roll-75", label: "BIOTHERM HOMME AQUAPOWER 48H DEO ROLL ON 75ML", image: "img/parfume120.jpg", price: 42.6, category: "perfume" },
    { id: "perfume-ysl-lhomme-nuit-edp-100", label: "YVES SAINT LAU L'HOMME NUIT EDP 100ML", image: "img/ysl-la-nuit-de-lhomme-edp.jpg", price: 200.22, category: "perfume" },
    { id: "perfume-lancome-mademoiselle-shine", label: "LANCOME MADEMOISELLE SHINE", image: "img/lancome-mademoiselle-shine.jpg", price: 23.51, category: "perfume" },
    { id: "perfume-libre-edp", label: "YVES SAINT LAU LIBRE EDP", image: "img/ysl-libre-edp.jpg", price: 139.17, category: "perfume" },
    { id: "perfume-biotherm-amber-algae-revitalize-day", label: "BIOTHERM BLUE THERAPY AMBER ALGAE REVITALIZE DAY", image: "img/parfume124.jpg", price: 141.06, category: "perfume" },
    { id: "perfume-biotherm-amber-algae-revitalize-night", label: "BIOTHERM BLUE THERAPY AMBER ALGAE REVITALIZE NIGHT", image: "img/parfume125.jpg", price: 148.9, category: "perfume" },
    { id: "perfume-lancome-genifique-serum-50", label: "LANCOME GENIFIQUE SERUM 50ML", image: "img/lancome-genifique-serum-50.jpg", price: 95.75, category: "perfume" },
    { id: "perfume-lancome-rose-sugar-scrub", label: "LANCOME ROSE SUGAR SCRUB", image: "img/lancome-rose-sugar-scrub.jpg", price: 68.0, category: "perfume" },
    { id: "perfume-lancome-hydra-zen-cream-50", label: "LANCOME HYDRA ZEN CREAM", image: "img/lancome-hydra-zen-day-cream.jpg", price: 96.7, category: "perfume" },
    { id: "perfume-lancome-hydra-zen-nuit-50", label: "LANCOME HYDRA ZEN NUIT 50ML", image: "img/lancome-hydra-zen-nuit-50.jpg", price: 126.27, category: "perfume" },
    { id: "perfume-lancome-hydra-zen-glow-50", label: "LANCOME HYDRA ZEN GLOW 50ML", image: "img/lancome-hydra-zen-glow-50.jpg", price: 94.04, category: "perfume" },
    { id: "perfume-ysl-lhomme-le-parfum-100", label: "YVES SAINT LAU L'HOMME LE PARFUM 100ML", image: "img/ysl-lhomme-le-parfum-100.jpg", price: 219.05, category: "perfume" },
    { id: "perfume-biotherm-tpur-cleanser-125", label: "BIOTHERM HOMME T-PUR CLEANSER 125ML", image: "img/biotherm-tpur-cleanser-old.jpg", price: 48.28, category: "perfume" },
    { id: "perfume-ysl-mascara-mvefc-the-curler", label: "YVES SAINT LAU YSL MASCARA MVEFC THE CURLER BLACK", image: "img/ysl-mascara-mvefc-the-curler.jpg", price: 47.07, category: "perfume" },
    { id: "perfume-ysl-eyeliner-couture-01", label: "YVES SAINT LAU YSL EYELINER COUTURE 1", image: "img/ysl-eyeliner-couture-01.jpg", price: 69.65, category: "perfume" },
    { id: "perfume-biotherm-aqua-super-mask-glow", label: "BIOTHERM AQUA SUPER MASK GLOW", image: "img/biotherm-aqua-super-mask-glow.jpg", price: 24.14, category: "perfume" },
    { id: "perfume-biotherm-aqua-super-mask-bounce", label: "BIOTHERM AQUA SUPER MASK BOUNCE", image: "img/biotherm-aqua-super-mask-bounce.jpg", price: 24.14, category: "perfume" },
    { id: "perfume-biotherm-aqua-super-mask-pure", label: "BIOTHERM AQUA SUPER MASK PURE", image: "img/biotherm-aqua-super-mask-pure.jpg", price: 24.14, category: "perfume" },
    { id: "perfume-ysl-tatouage-velvet-cream-201", label: "YVES SAINT LAU YSL TATOUAGE COUTURE VELVET CREAM 201", image: "img/ysl-tatouage-velvet-cream-201.jpg", price: 27.56, category: "perfume" },
    { id: "perfume-biotherm-life-plankton-body-milk-400", label: "BIOTHERM LIFE PLANKTON BODY MILK 400ML", image: "img/biotherm-body-milk-400.jpg", price: 59.66, category: "perfume" },
    { id: "perfume-ysl-satin-crush-eyeshadow-05", label: "YVES SAINT LAU YSL SATIN CRUSH EYESHADOW 05", image: "img/ysl-satin-crush-liquid-eyeshadow.jpg", price: 19.91, category: "perfume" },
    { id: "perfume-lancome-cils-booster-serum", label: "LANCOME CILS BOOSTER LASH REVITALIZING SERUM", image: "img/lancome-cils-booster-serum.jpg", price: 94.04, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-uomo-edt", label: "VALENTINO BORN IN ROMA UOMO EAU DE TOILETTE", image: "img/valentino-born-in-roma-uomo-edt.jpg", price: 140.81, category: "perfume" },
    { id: "perfume-valentino-donna-edp-30", label: "VALENTINO DONNA EAU DE PARFUM", image: "img/valentino-donna-edp.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-valentino-uomo-edt", label: "VALENTINO UOMO EAU DE TOILETTE", image: "img/valentino-uomo-edt.jpg", price: 140.81, category: "perfume" },
    { id: "perfume-ysl-mascara-mvefc-radical-01", label: "YVES SAINT LAU YSL MASCARA MVEFC RADICAL 01 BLACK", image: "img/ysl-mascara-mvefc-radical-01.jpg", price: 47.07, category: "perfume" },
    { id: "perfume-lancome-lash-idole-01", label: "LANCOME LASH IDOLE MASCARA", image: "img/lancome-lash-idole-01.jpg", price: 45.74, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-absolu", label: "ARMANI EMPORIO STRONGER WITH YOU ABSOLUTELY EDP", image: "img/armani-stronger-with-you-absolu.jpg", price: 148.9, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-uomo-yellow-dream", label: "VALENTINO BORN IN ROMA UOMO YELLOW DREAM EDT 100ML", image: "img/valentino-born-in-roma-uomo-yellow-dream.jpg", price: 190.61, category: "perfume" },
    { id: "perfume-ysl-crushliner", label: "YVES SAINT LAU YSL CRUSHLINER EYELINER", image: "img/ysl-crushliner.jpg", price: 54.23, category: "perfume" },
    { id: "perfume-cacharel-yes-i-am", label: "CACHAREL YES I AM EDP", image: "img/cacharel-yes-i-am.jpg", price: 64.21, category: "perfume" },
    { id: "perfume-cacharel-yes-i-am-purple", label: "CACHAREL YES I AM FABULOUS EDP 30ML", image: "img/cacharel-yes-i-am-purple.jpg", price: 35.64, category: "perfume" },
    { id: "perfume-cacharel-yes-i-am-glorious", label: "CACHAREL YES I AM GLORIOUS EDP 50ML", image: "img/cacharel-yes-i-am-glorious.jpg", price: 58.46, category: "perfume" },
    { id: "perfume-cacharel-loulou", label: "CACHAREL LOULOU EDP", image: "img/cacharel-loulou.jpg", price: 54.23, category: "perfume" },
    { id: "perfume-viktor-spicebomb-night-vision-edt", label: "VIKTOR&ROLF SPICEBOMB NIGHT VISION EDT 90ML", image: "img/viktor-spicebomb-night-vision-edt.jpg", price: 150.42, category: "perfume" },
    { id: "perfume-viktor-flowerbomb-dew", label: "VIKTOR&ROLF FLOWERBOMB DEW EDP 50ML", image: "img/viktor-flowerbomb-dew.jpg", price: 64.46, category: "perfume" },
    { id: "perfume-diesel-bad", label: "DIESEL BAD EDT", image: "img/diesel-bad.jpg", price: 44.43, category: "perfume" },
    { id: "perfume-diesel-fuel-for-life-homme", label: "DIESEL FUEL FOR LIFE HOMME EDT", image: "img/diesel-fuel-for-life-homme.jpg", price: 77.36, category: "perfume" },
    { id: "perfume-mugler-alien-edp", label: "THIERRY MUGLER ALIEN EDP", image: "img/mugler-alien-edp.jpg", price: 120.84, category: "perfume" },
    { id: "perfume-mugler-alien-goddess", label: "THIERRY MUGLER ALIEN GODDESS EDP", image: "img/mugler-alien-goddess.jpg", price: 118.44, category: "perfume" },
    { id: "perfume-armani-my-way-intense", label: "ARMANI MY WAY EDP INTENSE", image: "img/armani-my-way-intense.jpg", price: 134.74, category: "perfume" },
    { id: "perfume-prada-luna-rossa-ocean", label: "PRADA LUNA ROSSA OCEAN EDT", image: "img/prada-luna-rossa-ocean.jpg", price: 126.02, category: "perfume" },
    { id: "perfume-biotherm-aquasource-gel-50", label: "BIOTHERM AQUASOURCE HYALU PLUMP GEL 50ML", image: "img/biotherm-aquasource-gel-50.jpg", price: 85.19, category: "perfume" },
    { id: "perfume-lancome-hypnose-absolu-de-noir", label: "LANCOME HYPNOSE MASCARA ABSOLU DE NOIR", image: "img/lancome-hypnose-absolu-de-noir.jpg", price: 47.6, category: "perfume" },
    { id: "perfume-lancome-24h-drama-liqui-pencil", label: "LANCOME 24H DRAMA LIQUI-PENCIL", image: "img/lancome-24h-drama-liqui-pencil.jpg", price: 44.49, category: "perfume" },
    { id: "perfume-lancome-tiuw-stick", label: "LANCOME TEINT IDOLE ULTRA WEAR STICK", image: "img/lancome-tiuw-stick.jpg", price: 39.06, category: "perfume" },
    { id: "perfume-lancome-tiuw-stick-blush-03", label: "LANCOME TEINT IDOLE ULTRA WEAR STICK BLUSH 03 WILD RUBY", image: "img/lancome-tiuw-stick-blush.jpg", price: 35.64, category: "perfume" },
    { id: "perfume-lancome-tiuw-stick-highlighter", label: "LANCOME TEINT IDOLE ULTRA WEAR STICK HIGHLIGHTER", image: "img/lancome-tiuw-stick-highlighter.jpg", price: 35.64, category: "perfume" },
    { id: "perfume-lancome-tiuw-concealer", label: "LANCOME TEINT IDOLE ULTRA WEAR ALL OVER CONCEALER", image: "img/lancome-tiuw-concealer.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-viktor-spicebomb-night-vision-edp", label: "VIKTOR&ROLF SPICEBOMB NIGHT VISION EDP 90ML", image: "img/viktor-spicebomb-night-vision-edp.jpg", price: 170.01, category: "perfume" },
    { id: "perfume-ralph-lauren-polo-red-edp", label: "RALPH LAUREN POLO RED EAU DE PARFUM 75ML", image: "img/ralph-lauren-polo-red-edp.jpg", price: 111.11, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-uomo-coral-fantasy", label: "VALENTINO BORN IN ROMA UOMO CORAL FANTASY EDT", image: "img/valentino-born-in-roma-uomo-coral-fantasy.jpg", price: 140.81, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-donna-coral-fantasy", label: "VALENTINO BORN IN ROMA DONNA CORAL FANTASY EDP", image: "img/valentino-born-in-roma-donna-coral-fantasy.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-prada-luna-rossa-sport", label: "PRADA LUNA ROSSA SPORT EDT 50ML", image: "img/prada-luna-rossa-sport.jpg", price: 126.02, category: "perfume" },
    { id: "perfume-ysl-y-edt", label: "YVES SAINT LAU Y EDT", image: "img/ysl-y-edt.jpg", price: 136.64, category: "perfume" },
    { id: "perfume-lancome-genifique-sensitive-20", label: "LANCOME GENIFIQUE SENSITIVE 20ML", image: "img/lancome-genifique-sensitive-20.jpg", price: 74.51, category: "perfume" },
    { id: "perfume-lancome-absolu-rouge-drama-ink", label: "LANCOME L'ABSOLU ROUGE DRAMA INK", image: "img/lancome-absolu-rouge-drama-ink.jpg", price: 25.98, category: "perfume" },
    { id: "perfume-lancome-le-stylo-waterproof", label: "LANCOME LE STYLO WATERPROOF", image: "img/lancome-le-stylo-waterproof.jpg", price: 44.49, category: "perfume" },
    { id: "perfume-lancome-liner-idole", label: "LANCOME LINER IDOLE 01 GLOSSY BLACK", image: "img/lancome-liner-idole.jpg", price: 57.51, category: "perfume" },
    { id: "perfume-lancome-renergie-hcf-triple-serum-50", label: "LANCOME RENERGIE H.C.F. TRIPLE SERUM", image: "img/lancome-renergie-ultra-triple-serum-50.jpg", price: 229.8, category: "perfume" },
    { id: "perfume-lancome-nutrix-face-cream", label: "LANCOME NUTRIX FACE CREAM 50ML", image: "img/lancome-nutrix-face-cream-new.jpg", price: 106.93, category: "perfume" },
    { id: "perfume-lancome-genifique-light-pearl-20", label: "LANCOME GENIFIQUE LIGHT PEARL 20ML", image: "img/lancome-genifique-light-pearl-20.jpg", price: 126.27, category: "perfume" },
    { id: "perfume-lancome-absolu-rouge-cream-366", label: "LANCOME L'ABSOLU ROUGE CREAM", image: "img/lancome-absolu-rouge-cream.jpg", price: 70.53, category: "perfume" },
    { id: "perfume-biotherm-tpur-gel-50", label: "BIOTHERM HOMME T-PUR ANTI-OIL & SHINE GEL 50ML", image: "img/biotherm-tpur-aos-moisturizer-50.jpg", price: 61.05, category: "perfume" },
    { id: "perfume-biotherm-aquapower-comfort-gel-75", label: "BIOTHERM HOMME AQUAPOWER COMFORT GEL 75ML", image: "img/biotherm-aquapower-ps-75.jpg", price: 83.55, category: "perfume" },
    { id: "perfume-biotherm-homme-ultra-confort-balm-75", label: "BIOTHERM HOMME ULTRA CONFORT BALM 75ML", image: "img/biotherm-homme-ultra-confort-balm-75.jpg", price: 83.55, category: "perfume" },
    { id: "perfume-biotherm-blue-pro-retinol-50", label: "BIOTHERM BLUE PRO-RETINOL MULTI-CORRECT CREAM 50ML", image: "img/biotherm-blue-pro-retinol.jpg", price: 141.06, category: "perfume" },
    { id: "perfume-ysl-rouge-pur-couture-the-slim-32", label: "YVES SAINT LAU YSL ROUGE PUR COUTURE THE SLIM 32", image: "img/ysl-rouge-pur-couture-the-slim-32.jpg", price: 32.93, category: "perfume" },
    { id: "perfume-ysl-lash-clash-01", label: "YVES SAINT LAURENT LASH CLASH MASCARA", image: "img/ysl-lash-clash-01.jpg", price: 48.75, category: "perfume" },
    { id: "perfume-lancome-absolu-rouge-drama-matte", label: "LANCOME L'ABSOLU ROUGE DRAMA MATTE", image: "img/lancome-absolu-rouge-drama-matte.jpg", price: 70.53, category: "perfume" },
    { id: "perfume-biotherm-waterlover-sun-mist-spf30", label: "BIOTHERM WATERLOVER SUN MIST SPF30 200ML", image: "img/biotherm-waterlover-sun-mist-spf30.jpg", price: 66.61, category: "perfume" },
    { id: "perfume-biotherm-life-plankton-elixir-75", label: "BIOTHERM LIFE PLANKTON ELIXIR 75ML", image: "img/biotherm-life-plankton-elixir-75.jpg", price: 198.7, category: "perfume" },
    { id: "perfume-prada-luna-rossa-edt", label: "PRADA LUNA ROSSA EDT", image: "img/prada-luna-rossa-edt.jpg", price: 126.02, category: "perfume" },
    { id: "perfume-armani-code-le-parfum", label: "ARMANI CODE LE PARFUM", image: "img/armani-code-le-parfum.jpg", price: 180.25, category: "perfume" },
    { id: "perfume-lancome-advanced-genifique-night-cream", label: "LANCOME ADVANCED GENIFIQUE NIGHT CREAM 50ML", image: "img/lancome-advanced-genifique-night-cream.jpg", price: 174.94, category: "perfume" },
    { id: "perfume-diesel-d-by-diesel-edt", label: "D BY DIESEL EDT 50ML", image: "img/diesel-d-by-diesel-edt.jpg", price: 85.57, category: "perfume" },
    { id: "perfume-ysl-libre-le-parfum", label: "YVES SAINT LAU LIBRE LE PARFUM", image: "img/ysl-libre-le-parfum.jpg", price: 159.77, category: "perfume" },
    { id: "perfume-prada-paradoxe-edp", label: "PRADA PARADOXE EDP", image: "img/prada-paradoxe-edp.jpg", price: 130.95, category: "perfume" },
    { id: "perfume-lancome-bi-facil-clean-care-125", label: "LANCOME BI-FACIL CLEAN & CARE MAKE-UP REMOVER 125ML", image: "img/lancome-bi-facil-clean-care-125.jpg", price: 69.52, category: "perfume" },
    { id: "perfume-lancome-hypnose-gift-set", label: "LANCOME LE 8 HYPNOSE GIFT SET", image: "img/lancome-hypnose-gift-set.jpg", price: 40.61, category: "perfume" },
    { id: "perfume-valentino-donna-yellow-dream-set", label: "VALENTINO DONNA BORN IN ROMA YELLOW DREAM GIFT SET", image: "img/valentino-donna-born-in-roma-yellow-dream-set.jpg", price: 170.64, category: "perfume" },
    { id: "perfume-lancome-tiuw-care-glow-foundation", label: "LANCOME TEINT IDOLE ULTRA WEAR CARE & GLOW FOUNDATION 30ML", image: "img/lancome-tiuw-care-glow-foundation.jpg", price: 96.7, category: "perfume" },
    { id: "perfume-ysl-all-hours-foundation", label: "YVES SAINT LAU YSL ALL HOURS FOUNDATION 25ML", image: "img/ysl-all-hours-foundation.jpg", price: 97.96, category: "perfume" },
    { id: "perfume-viktor-rolf-good-fortune-edp", label: "VIKTOR&ROLF GOOD FORTUNE EDP 50ML", image: "img/viktor-rolf-good-fortune-edp.jpg", price: 68.89, category: "perfume" },
    { id: "perfume-ysl-lhomme-edp", label: "YVES SAINT LAU L'HOMME EDP 100ML", image: "img/ysl-lhomme-edp.jpg", price: 206.16, category: "perfume" },
    { id: "perfume-ysl-black-opium-le-parfum", label: "YVES SAINT LAU BLACK OPIUM LE PARFUM", image: "img/ysl-black-opium-le-parfum.jpg", price: 95.12, category: "perfume" },
    { id: "perfume-ysl-libre-body-balm", label: "YVES SAINT LAURENT LIBRE BODY BALM 200ML", image: "img/ysl-libre-body-balm.jpg", price: 110.85, category: "perfume" },
    { id: "perfume-armani-code-edt", label: "ARMANI CODE EDT", image: "img/armani-code-edt.jpg", price: 138.41, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-uomo-intense", label: "VALENTINO BORN IN ROMA UOMO INTENSE EDP", image: "img/valentino-born-in-roma-uomo-intense.jpg", price: 156.23, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-donna-intense", label: "VALENTINO BORN IN ROMA DONNA INTENSE EDP", image: "img/valentino-born-in-roma-donna-intense.jpg", price: 143.34, category: "perfume" },
    { id: "perfume-armani-my-way-le-parfum", label: "ARMANI MY WAY LE PARFUM", image: "img/armani-my-way-le-parfum.jpg", price: 144.73, category: "perfume" },
    { id: "perfume-viktor-rolf-flowerbomb-ruby-orchid", label: "VIKTOR&ROLF FLOWERBOMB RUBY ORCHID EDP", image: "img/viktor-rolf-flowerbomb-ruby-orchid.jpg", price: 57.51, category: "perfume" },
    { id: "perfume-ysl-myslf-edp", label: "YVES SAINT LAURENT MYSLF EDP", image: "img/ysl-myslf-edp.jpg", price: 141.82, category: "perfume" },
    { id: "perfume-armani-si-intense-edp", label: "ARMANI SI EDP INTENSE", image: "img/armani-si-intense-edp.jpg", price: 143.72, category: "perfume" },
    { id: "perfume-lancome-hypnose-mascara-set", label: "LANCOME LE 8 HYPNOSE MASCARA SET", image: "img/lancome-hypnose-mascara-set.jpg", price: 49.37, category: "perfume" },
    { id: "perfume-biotherm-blue-pro-retinol-eye-cream", label: "BIOTHERM BLUE PRO-RETINOL EYE CREAM 15ML", image: "img/biotherm-blue-pro-retinol-eye-cream.jpg", price: 99.22, category: "perfume" },
    { id: "perfume-prada-paradoxe-intense", label: "PRADA PARADOXE INTENSE EDP", image: "img/prada-paradoxe-intense.jpg", price: 145.49, category: "perfume" },
    { id: "perfume-ysl-libre-absolu-platine", label: "YVES SAINT LAURENT LIBRE L'ABSOLU PLATINE", image: "img/ysl-libre-absolu-platine.jpg", price: 226.76, category: "perfume" },
    { id: "perfume-lancome-renergie-hpn-300-peptide", label: "LANCOME RENERGIE H.P.N. 300-PEPTIDE CREAM 50ML", image: "img/lancome-renergie-hpn-300-peptide.jpg", price: 177.59, category: "perfume" },
    { id: "perfume-armani-prive-cuir-zerzura", label: "ARMANI PRIVE CUIR ZERZURA EDP", image: "img/armani-prive-cuir-zerzura.jpg", price: 486.77, category: "perfume" },
    { id: "perfume-armani-prive-musc-shamal", label: "ARMANI PRIVE MUSC SHAMAL EDP", image: "img/armani-prive-musc-shamal.jpg", price: 504.34, category: "perfume" },
    { id: "perfume-armani-prive-sable-nuit", label: "ARMANI PRIVE SABLE NUIT EDP", image: "img/armani-prive-sable-nuit.jpg", price: 504.34, category: "perfume" },
    { id: "perfume-armani-prive-bois-encens", label: "ARMANI PRIVE BOIS D'ENCENS EDP", image: "img/armani-prive-bois-encens.jpg", price: 504.34, category: "perfume" },
    { id: "perfume-armani-prive-cuir-amethyste", label: "ARMANI PRIVE CUIR AMETHYSTE EDP", image: "img/armani-prive-cuir-amethyste.jpg", price: 486.77, category: "perfume" },
    { id: "perfume-armani-prive-oud-royal", label: "ARMANI PRIVE OUD ROYAL EDP", image: "img/armani-prive-oud-royal.jpg", price: 504.34, category: "perfume" },
    { id: "perfume-armani-prive-cypres-pantelleria", label: "ARMANI PRIVE CYPRES PANTELLERIA EDT", image: "img/armani-prive-cypres-pantelleria.jpg", price: 238.14, category: "perfume" },
    { id: "perfume-armani-prive-figuier-eden", label: "ARMANI PRIVE FIGUIER EDEN EDT", image: "img/armani-prive-figuier-eden.jpg", price: 335.34, category: "perfume" },
    { id: "perfume-armani-prive-jasmin-kusamono", label: "ARMANI PRIVE JASMIN KUSAMONO EDT", image: "img/armani-prive-jasmin-kusamono.jpg", price: 238.14, category: "perfume" },
    { id: "perfume-armani-prive-rose-arabie", label: "ARMANI PRIVE ROSE D'ARABIE EDP", image: "img/armani-prive-rose-arabie.jpg", price: 504.34, category: "perfume" },
    { id: "perfume-armani-prive-orangerie-venise", label: "ARMANI PRIVE ORANGERIE VENISE EDT", image: "img/armani-prive-orangerie-venise.jpg", price: 312.97, category: "perfume" },
    { id: "perfume-armani-prive-pivoine-suzhou", label: "ARMANI PRIVE PIVOINE SUZHOU EDT", image: "img/armani-prive-pivoine-suzhou.jpg", price: 238.14, category: "perfume" },
    { id: "perfume-armani-prive-rose-alexandrie", label: "ARMANI PRIVE ROSE ALEXANDRIE EDT", image: "img/armani-prive-rose-alexandrie.jpg", price: 312.97, category: "perfume" },
    { id: "perfume-armani-prive-rose-milano", label: "ARMANI PRIVE ROSE MILANO EDT", image: "img/armani-prive-rose-milano.jpg", price: 238.14, category: "perfume" },
    { id: "perfume-armani-prive-the-yulong", label: "ARMANI PRIVE THE YULONG EDT", image: "img/armani-prive-the-yulong.jpg", price: 335.34, category: "perfume" },
    { id: "perfume-armani-prive-vetiver-hiver", label: "ARMANI PRIVE VETIVER D'HIVER EDT", image: "img/armani-prive-vetiver-hiver.jpg", price: 238.14, category: "perfume" },
    { id: "perfume-armani-prive-bleu-lazuli", label: "ARMANI PRIVE BLEU LAZULI EDP", image: "img/armani-prive-bleu-lazuli.jpg", price: 528.48, category: "perfume" },
    { id: "perfume-armani-prive-magenta-tanzanite", label: "ARMANI PRIVE MAGENTA TANZANITE EDP", image: "img/armani-prive-magenta-tanzanite.jpg", price: 545.29, category: "perfume" },
    { id: "perfume-armani-prive-rouge-malachite", label: "ARMANI PRIVE ROUGE MALACHITE EDP", image: "img/armani-prive-rouge-malachite.jpg", price: 384.0, category: "perfume" },
    { id: "perfume-armani-prive-santal-dan-sha", label: "ARMANI PRIVE SANTAL DAN SHA EDT", image: "img/armani-prive-santal-dan-sha.jpg", price: 238.14, category: "perfume" },
    { id: "perfume-armani-eyes-to-kill-classico", label: "GIORGIO ARMANI EYES TO KILL CLASSICO MASCARA", image: "img/armani-eyes-to-kill-classico.jpg", price: 71.67, category: "perfume" },
    { id: "perfume-armani-eyes-to-kill-eccentrico", label: "GIORGIO ARMANI EYES TO KILL ECCENTRICO MASCARA", image: "img/armani-eyes-to-kill-eccentrico.jpg", price: 71.67, category: "perfume" },
    { id: "perfume-armani-eyes-to-kill-stellar", label: "GIORGIO ARMANI EYES TO KILL STELLAR EYESHADOW", image: "img/armani-eyes-to-kill-stellar.jpg", price: 71.67, category: "perfume" },
    { id: "perfume-armani-eye-tint", label: "GIORGIO ARMANI EYE TINT LIQUID EYESHADOW", image: "img/armani-eye-tint.jpg", price: 59.91, category: "perfume" },
    { id: "perfume-armani-smooth-silk-eye-pencil", label: "GIORGIO ARMANI SMOOTH SILK EYE PENCIL", image: "img/armani-smooth-silk-eye-pencil.jpg", price: 51.19, category: "perfume" },
    { id: "perfume-armani-fluid-sheer", label: "GIORGIO ARMANI FLUID SHEER", image: "img/armani-fluid-sheer.jpg", price: 66.61, category: "perfume" },
    { id: "perfume-armani-luminous-silk-concealer", label: "GIORGIO ARMANI LUMINOUS SILK CONCEALER 12ML", image: "img/armani-luminous-silk-concealer.jpg", price: 79.38, category: "perfume" },
    { id: "perfume-armani-lip-power", label: "GIORGIO ARMANI LIP POWER LIPSTICK", image: "img/armani-lip-power.jpg", price: 71.67, category: "perfume" },
    { id: "perfume-armani-lip-power-matte", label: "GIORGIO ARMANI LIP POWER MATTE LIPSTICK", image: "img/armani-lip-power-matte.jpg", price: 71.67, category: "perfume" },
    { id: "perfume-armani-concealer-brush", label: "GIORGIO ARMANI CONCEALER BRUSH", image: "img/armani-concealer-brush.jpg", price: 41.08, category: "perfume" },
    { id: "perfume-armani-luminous-silk-glow-blush", label: "GIORGIO ARMANI LUMINOUS SILK GLOW BLUSH", image: "img/armani-luminous-silk-glow-blush.jpg", price: 79.38, category: "perfume" },
    { id: "perfume-armani-power-fabric-concealer", label: "GIORGIO ARMANI POWER FABRIC+ CONCEALER", image: "img/armani-power-fabric-concealer.jpg", price: 76.47, category: "perfume" },
    { id: "perfume-armani-lip-maestro", label: "GIORGIO ARMANI LIP MAESTRO LIQUID LIPSTICK", image: "img/armani-lip-maestro.jpg", price: 68.26, category: "perfume" },
    { id: "perfume-armani-lip-maestro-satin", label: "GIORGIO ARMANI LIP MAESTRO SATIN", image: "img/armani-lip-maestro-satin.jpg", price: 71.67, category: "perfume" },
    { id: "perfume-armani-power-fabric-compact", label: "GIORGIO ARMANI POWER FABRIC COMPACT FOUNDATION", image: "img/armani-power-fabric-compact.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-armani-luminous-silk-glow-fusion-powder", label: "GIORGIO ARMANI LUMINOUS SILK GLOW FUSION POWDER", image: "img/armani-luminous-silk-glow-fusion-powder.jpg", price: 107.57, category: "perfume" },
    { id: "perfume-ralph-lauren-polo-red-parfum", label: "RALPH LAUREN POLO RED PARFUM", image: "img/ralph-lauren-polo-red-parfum.jpg", price: 124.25, category: "perfume" },
    { id: "perfume-mugler-alien-goddess-supra-florale", label: "THIERRY MUGLER ALIEN GODDESS SUPRA FLORALE EDP", image: "img/mugler-alien-goddess-supra-florale.jpg", price: 97.52, category: "perfume" },
    { id: "perfume-prada-luna-rossa-ocean-edp", label: "PRADA LUNA ROSSA OCEAN EDP", image: "img/prada-luna-rossa-ocean-edp.jpg", price: 135.75, category: "perfume" },
    { id: "perfume-ysl-y-edp-intense", label: "YVES SAINT LAURENT Y EDP INTENSE", image: "img/ysl-y-edp-intense.jpg", price: 170.13, category: "perfume" },
    { id: "perfume-lancome-renergie-yeux", label: "LANCOME RENERGIE YEUX EYE CREAM 15ML", image: "img/lancome-renergie-yeux.jpg", price: 112.12, category: "perfume" },
    { id: "perfume-lancome-absolu-rouge-intimatte", label: "LANCOME L'ABSOLU ROUGE INTIMATTE", image: "img/lancome-absolu-rouge-intimatte.jpg", price: 70.53, category: "perfume" },
    { id: "perfume-lancome-hypnose-genifique-bifacil-set", label: "LANCOME HYPNOSE MASCARA SET (GENIFIQUE + BI-FACIL)", image: "img/lancome-hypnose-genifique-bifacil-set.jpg", price: 49.64, category: "perfume" },
    { id: "perfume-lancome-genifique-happiness-set", label: "LANCOME ADVANCED GENIFIQUE HAPPINESS GIFT SET", image: "img/lancome-genifique-happiness-set.jpg", price: 154.84, category: "perfume" },
    { id: "perfume-ysl-couture-mini-clutch", label: "YVES SAINT LAURENT COUTURE MINI CLUTCH EYESHADOW PALETTE", image: "img/ysl-couture-baby-clutch.jpg", price: 118.56, category: "perfume" },
    { id: "perfume-diesel-d-red-edp", label: "DIESEL D RED EDP", image: "img/diesel-d-red-edp.jpg", price: 64.21, category: "perfume" },
    { id: "perfume-ysl-black-opium-over-red", label: "YVES SAINT LAURENT BLACK OPIUM EDP OVER RED", image: "img/ysl-black-opium-red.jpg", price: 136.13, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-edt-set", label: "ARMANI ACQUA DI GIO EDT GIFT SET", image: "img/armani-acqua-di-gio-edt-set.jpg", price: 217.03, category: "perfume" },
    { id: "perfume-prada-infusion-cedre", label: "PRADA LES INFUSIONS INFUSION DE CÈDRE EDP 100ML", image: "img/prada-infusion-cedre.jpg", price: 233.08, category: "perfume" },
    { id: "perfume-prada-infusion-fleur-oranger", label: "PRADA LES INFUSIONS INFUSION DE FLEUR D'ORANGER EDP 100ML", image: "img/prada-infusion-fleur-oranger.jpg", price: 233.08, category: "perfume" },
    { id: "perfume-prada-infusion-figue", label: "PRADA LES INFUSIONS INFUSION DE FIGUE EDP 100ML", image: "img/prada-infusion-figue.jpg", price: 233.08, category: "perfume" },
    { id: "perfume-valentino-green-stravaganza-donna", label: "VALENTINO BORN IN ROMA GREEN STRAVAGANZA DONNA EDP", image: "img/valentino-green-stravaganza-donna.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-valentino-green-stravaganza-uomo", label: "VALENTINO BORN IN ROMA GREEN STRAVAGANZA UOMO EDT", image: "img/valentino-green-stravaganza-uomo.jpg", price: 140.81, category: "perfume" },
    { id: "perfume-armani-my-way-nectar", label: "ARMANI MY WAY NECTAR EDP", image: "img/armani-my-way-nectar.jpg", price: 130.57, category: "perfume" },
    { id: "perfume-ysl-all-hours-concealer", label: "YVES SAINT LAURENT ALL HOURS CONCEALER 15ML", image: "img/ysl-all-hours-concealer.jpg", price: 69.65, category: "perfume" },
    { id: "perfume-lancome-idole-tint", label: "LANCOME IDOLE TINT LIQUID EYEBLUSHER", image: "img/lancome-idole-tint.jpg", price: 52.71, category: "perfume" },
    { id: "perfume-lancome-lveb-rose-extraordinaire", label: "LANCOME LA VIE EST BELLE ROSE EXTRAORDINAIRE EDP", image: "img/lancome-lveb-rose-extraordinaire.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-lancome-advanced-genifique-serum-set", label: "LANCOME ADVANCED GENIFIQUE SERUM GIFT SET", image: "img/lancome-advanced-genifique-serum-set.jpg", price: 170.51, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-edt-set", label: "ARMANI EMPORIO STRONGER WITH YOU EDT GIFT SET", image: "img/armani-stronger-with-you-edt-set.jpg", price: 170.51, category: "perfume" },
    { id: "perfume-ysl-touche-eclat-blur-primer", label: "YVES SAINT LAURENT TOUCHE ECLAT BLUR PRIMER 30ML", image: "img/ysl-touche-eclat-blur-primer.jpg", price: 87.72, category: "perfume" },
    { id: "perfume-armani-prive-blanc-kogane", label: "ARMANI PRIVE BLANC KOGANE EDP", image: "img/armani-prive-blanc-kogane.jpg", price: 547.06, category: "perfume" },
    { id: "perfume-armani-prive-noir-kogane", label: "ARMANI PRIVE NOIR KOGANE EDP", image: "img/armani-prive-noir-kogane.jpg", price: 547.06, category: "perfume" },
    { id: "perfume-mugler-alien-hypersense", label: "THIERRY MUGLER ALIEN HYPERSENSE EDP", image: "img/mugler-alien-hypersense.jpg", price: 119.83, category: "perfume" },
    { id: "perfume-viktor-rolf-flowerbomb-tiger-lily", label: "VIKTOR&ROLF FLOWERBOMB TIGER LILY EDP", image: "img/viktor-rolf-flowerbomb-tiger-lily.jpg", price: 156.86, category: "perfume" },
    { id: "perfume-azzaro-the-most-wanted-edt-intense", label: "AZZARO THE MOST WANTED EDT INTENSE", image: "img/azzaro-the-most-wanted-edt-intense.jpg", price: 109.84, category: "perfume" },
    { id: "perfume-azzaro-wanted-by-night", label: "AZZARO WANTED BY NIGHT EDP 100ML", image: "img/azzaro-wanted-by-night.jpg", price: 154.08, category: "perfume" },
    { id: "perfume-ysl-y-elixir", label: "YVES SAINT LAURENT Y ELIXIR 60ML", image: "img/ysl-y-elixir.jpg", price: 229.42, category: "perfume" },
    { id: "perfume-lancome-uv-expert-supra-screen", label: "LANCOME UV EXPERT SUPRA SCREEN SPF50+", image: "img/lancome-uv-expert-supra-screen.jpg", price: 73.19, category: "perfume" },
    { id: "perfume-lancome-renergie-triple-serum-eye", label: "LANCOME RENERGIE H.C.F. TRIPLE SERUM EYE 20ML", image: "img/lancome-renergie-triple-serum-eye.jpg", price: 154.97, category: "perfume" },
    { id: "perfume-biotherm-blue-peptides-uplift-cream", label: "BIOTHERM BLUE PEPTIDES UPLIFT CREAM", image: "img/biotherm-blue-peptides-uplift-cream.jpg", price: 141.06, category: "perfume" },
    { id: "perfume-biotherm-blue-peptides-uplift-night", label: "BIOTHERM BLUE PEPTIDES UPLIFT NIGHT CREAM 50ML", image: "img/biotherm-blue-peptides-uplift-night.jpg", price: 148.9, category: "perfume" },
    { id: "perfume-ysl-rouge-pur-couture", label: "YVES SAINT LAURENT ROUGE PUR COUTURE LIPSTICK", image: "img/ysl-rouge-pur-couture.jpg", price: 72.17, category: "perfume" },
    { id: "perfume-ysl-loveshine", label: "YVES SAINT LAURENT LOVESHINE LIPSTICK", image: "img/ysl-loveshine.jpg", price: 72.17, category: "perfume" },
    { id: "perfume-azzaro-wanted-edt", label: "AZZARO WANTED EDT", image: "img/azzaro-wanted-edt.jpg", price: 107.06, category: "perfume" },
    { id: "perfume-azzaro-chrome-edt", label: "AZZARO CHROME EDT", image: "img/azzaro-chrome-edt.jpg", price: 61.43, category: "perfume" },
    { id: "perfume-azzaro-pour-homme-edt", label: "AZZARO POUR HOMME EDT", image: "img/azzaro-pour-homme-edt.jpg", price: 84.94, category: "perfume" },
    { id: "perfume-azzaro-the-most-wanted-edp-intense", label: "AZZARO THE MOST WANTED EDP INTENSE", image: "img/azzaro-the-most-wanted-edp-intense.jpg", price: 121.22, category: "perfume" },
    { id: "perfume-azzaro-the-most-wanted-parfum", label: "AZZARO THE MOST WANTED PARFUM", image: "img/azzaro-the-most-wanted-parfum.jpg", price: 121.22, category: "perfume" },
    { id: "perfume-azzaro-chrome-edp", label: "AZZARO CHROME EDP", image: "img/azzaro-chrome-edp.jpg", price: 125.39, category: "perfume" },
    { id: "perfume-azzaro-chrome-parfum", label: "AZZARO CHROME PARFUM", image: "img/azzaro-chrome-parfum.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-azzaro-wanted-edp", label: "AZZARO WANTED EDP", image: "img/azzaro-wanted-edp.jpg", price: 116.92, category: "perfume" },
    { id: "perfume-lancome-hypnose-drama", label: "LANCOME HYPNOSE DRAMA MASCARA 01 EXCESSIVE BLACK", image: "img/lancome-hypnose-drama.jpg", price: 52.11, category: "perfume" },
    { id: "perfume-biotherm-homme-force-supreme-blue-serum", label: "BIOTHERM HOMME FORCE SUPREME BLUE SERUM 30ML", image: "img/biotherm-homme-force-supreme-blue-serum.jpg", price: 108.45, category: "perfume" },
    { id: "perfume-biotherm-life-plankton-body-oil", label: "BIOTHERM LIFE PLANKTON MULTI-CORRECTIVE BODY OIL 125ML", image: "img/biotherm-life-plankton-body-oil.jpg", price: 97.96, category: "perfume" },
    { id: "perfume-biotherm-life-plankton-sensitive-balm", label: "BIOTHERM LIFE PLANKTON SENSITIVE BALM 50ML", image: "img/biotherm-life-plankton-sensitive-balm.jpg", price: 83.8, category: "perfume" },
    { id: "perfume-biotherm-blue-retinol-night-serum", label: "BIOTHERM BLUE RETINOL NIGHT SERUM 30ML", image: "img/biotherm-blue-retinol-night-serum.jpg", price: 172.41, category: "perfume" },
    { id: "perfume-biotherm-waterlover-sun-milk-spf30-400", label: "BIOTHERM WATERLOVER HYDRATING SUN MILK SPF30 400ML", image: "img/biotherm-lait-solaire-spf30.jpg", price: 75.97, category: "perfume" },
    { id: "perfume-armani-acqua-di-gioia-edp-intense", label: "ARMANI ACQUA DI GIOIA EDP INTENSE", image: "img/armani-acqua-di-gioia-edp-intense.jpg", price: 167.1, category: "perfume" },
    { id: "perfume-armani-prive-cuir-noir", label: "ARMANI PRIVE CUIR NOIR EDP", image: "img/armani-prive-cuir-noir.jpg", price: 486.77, category: "perfume" },
    { id: "perfume-armani-prive-the-yulong-soie-de-nacre", label: "ARMANI PRIVE THE YULONG SOIE DE NACRE EDT", image: "img/armani-prive-yulong-nacre.jpg", price: 312.97, category: "perfume" },
    { id: "perfume-armani-maestro-fusion-foundation", label: "GIORGIO ARMANI MAESTRO FUSION MAKE UP FOUNDATION 30ML", image: "img/armani-maestro-foundation.jpg", price: 59.09, category: "perfume" },
    { id: "perfume-armani-prisma-glass", label: "GIORGIO ARMANI PRISMA GLASS LIP GLOSS", image: "img/armani-prisma-glass.jpg", price: 66.61, category: "perfume" },
    { id: "perfume-armani-luminous-silk-cheek-tint", label: "GIORGIO ARMANI LUMINOUS SILK CHEEK TINT", image: "img/armani-luminous-silk-cheek-tint.jpg", price: 74.32, category: "perfume" },
    { id: "perfume-ysl-all-hours-hyper-finish", label: "YSL ALL HOURS HYPER FINISH POWDER", image: "img/ysl-all-hours-hyper-finish.jpg", price: 116.04, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-profondo-parfum", label: "GIORGIO ARMANI ACQUA DI GIÒ PROFONDO PARFUM", image: "img/armani-acqua-di-gio-profondo-parfum.jpg", price: 141.06, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-tobacco", label: "EMPORIO ARMANI STRONGER WITH YOU TOBACCO EDP", image: "img/armani-stronger-with-you-tobacco.jpg", price: 178.35, category: "perfume" },
    { id: "perfume-viktor-rolf-spicebomb-infrared-edp", label: "VIKTOR&ROLF SPICEBOMB INFRARED EDP", image: "img/viktor-rolf-spicebomb-infrared.jpg", price: 93.35, category: "perfume" },
    { id: "perfume-lancome-idole-edt", label: "LANCOME IDOLE EDT", image: "img/lancome-idole-edt.jpg", price: 97.96, category: "perfume" },
    { id: "perfume-lancome-tiuw-serum-bronzer", label: "LANCOME TEINT IDOLE ULTRA WEAR SKIN TRANSFORMING BRONZER", image: "img/lancome-tiuw-serum-bronzer.jpg", price: 88.86, category: "perfume" },
    { id: "perfume-lancome-tiuw-serum-highlighter", label: "LANCOME TEINT IDOLE ULTRA WEAR SKIN TRANSFORMING HIGHLIGHTER", image: "img/lancome-tiuw-serum-highlighter.jpg", price: 88.86, category: "perfume" },
    { id: "perfume-lancome-lip-idole-butterglow", label: "LANCOME LIP IDOLE BUTTERGLOW", image: "img/lancome-lip-idole-butterglow.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-lancome-lip-idole-liner", label: "LANCOME LIP IDOLE LINER", image: "img/lancome-lip-idole-liner.jpg", price: 44.49, category: "perfume" },
    { id: "perfume-prada-luna-rossa-ocean-le-parfum", label: "PRADA LUNA ROSSA OCEAN LE PARFUM", image: "img/prada-luna-rossa-ocean-le-parfum.jpg", price: 172.16, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-edp", label: "GIORGIO ARMANI ACQUA DI GIÒ EDP", image: "img/armani-acqua-di-gio-edp.jpg", price: 120.21, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-edt", label: "GIORGIO ARMANI ACQUA DI GIÒ EDT", image: "img/armani-acqua-di-gio-edt.jpg", price: 107.06, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-parfum", label: "GIORGIO ARMANI ACQUA DI GIÒ PARFUM", image: "img/armani-acqua-di-gio-parfum.jpg", price: 141.06, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-profondo-edp", label: "GIORGIO ARMANI ACQUA DI GIÒ PROFONDO EDP", image: "img/armani-acqua-di-gio-profondo-edp.jpg", price: 120.21, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-profondo-edt", label: "GIORGIO ARMANI ACQUA DI GIÒ PROFONDO EDT", image: "img/armani-acqua-di-gio-profondo-edt.jpg", price: 133.23, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-elixir", label: "GIORGIO ARMANI ACQUA DI GIÒ ELIXIR 50ML", image: "img/armani-acqua-di-gio-elixir.jpg", price: 224.61, category: "perfume" },
    { id: "perfume-armani-code-edp-homme", label: "ARMANI CODE EDP", image: "img/armani-code-edp-homme.jpg", price: 120.21, category: "perfume" },
    { id: "perfume-armani-emporio-he", label: "EMPORIO ARMANI HE EDT 100ML", image: "img/armani-emporio-he.jpg", price: 180.25, category: "perfume" },
    { id: "perfume-armani-si-passione-intense", label: "ARMANI SI PASSIONE EDP INTENSE", image: "img/armani-si-passione-intense.jpg", price: 143.72, category: "perfume" },
    { id: "perfume-armani-si-passione-red-musk", label: "ARMANI SI PASSIONE RED MUSK EDP", image: "img/armani-si-passione-red-musk.jpg", price: 138.41, category: "perfume" },
    { id: "perfume-armani-my-way-ylang", label: "ARMANI MY WAY YLANG EDP", image: "img/armani-my-way-ylang.jpg", price: 130.57, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-parfum", label: "EMPORIO ARMANI STRONGER WITH YOU PARFUM", image: "img/armani-stronger-with-you-parfum.jpg", price: 151.43, category: "perfume" },
    { id: "perfume-armani-prive-vert-malachite", label: "ARMANI PRIVE VERT MALACHITE EDP", image: "img/armani-prive-vert-malachite.jpg", price: 545.29, category: "perfume" },
    { id: "perfume-armani-luminous-silk-acqua-highlighter", label: "GIORGIO ARMANI LUMINOUS SILK ACQUA HIGHLIGHTER", image: "img/armani-luminous-silk-acqua-highlighter.jpg", price: 58.9, category: "perfume" },
    { id: "perfume-armani-designer-glow-foundation", label: "GIORGIO ARMANI DESIGNER GLOW FOUNDATION 30ML", image: "img/armani-designer-glow.jpg", price: 107.57, category: "perfume" },
    { id: "perfume-armani-vertigo-lift-mascara", label: "GIORGIO ARMANI VERTIGO LIFT MASCARA 01 BLACK", image: "img/armani-vertigo-lift-mascara.jpg", price: 71.67, category: "perfume" },
    { id: "perfume-armani-luminous-silk-bronzer", label: "GIORGIO ARMANI LUMINOUS SILK BRONZER 120 SUNBATHED DUNE", image: "img/armani-luminous-silk-bronzer.jpg", price: 87.09, category: "perfume" },
    { id: "perfume-armani-luminous-silk-cheek-tint-shine", label: "GIORGIO ARMANI LUMINOUS SILK CHEEK TINT SHINE", image: "img/armani-luminous-silk-cheek-tint-53s.jpg", price: 74.32, category: "perfume" },
    { id: "perfume-armani-code-edp-set", label: "ARMANI CODE EDP GIFT SET", image: "img/set-3614274337082.jpg", price: 184.42, category: "perfume" },
    { id: "perfume-armani-si-edp-body-set", label: "ARMANI SI EDP GIFT SET WITH BODY LOTION & SHOWER GEL", image: "img/set-3614274341072.jpg", price: 184.42, category: "perfume" },
    { id: "perfume-armani-si-passione-set", label: "ARMANI SI PASSIONE EDP GIFT SET", image: "img/set-3614274336924.jpg", price: 184.42, category: "perfume" },
    { id: "perfume-armani-my-way-edp-set", label: "ARMANI MY WAY EDP GIFT SET 50ML + 10ML", image: "img/set-3614274336979.jpg", price: 174.56, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-profondo-set", label: "ARMANI ACQUA DI GIO PROFONDO EDP GIFT SET", image: "img/set-3614274437157.jpg", price: 194.4, category: "perfume" },
    { id: "perfume-armani-swy-intensely-set", label: "EMPORIO ARMANI STRONGER WITH YOU INTENSELY GIFT SET", image: "img/set-3614274458879.jpg", price: 201.48, category: "perfume" },
    { id: "perfume-armani-swy-parfum-set", label: "EMPORIO ARMANI STRONGER WITH YOU PARFUM GIFT SET", image: "img/set-3614274458787.jpg", price: 151.81, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-edt-set-50", label: "ARMANI ACQUA DI GIO EDT GIFT SET 50ML + SHOWER GEL", image: "img/set-3614274437140.jpg", price: 134.74, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-parfum-set", label: "ARMANI ACQUA DI GIO PARFUM GIFT SET", image: "img/set-3614274437256.jpg", price: 229.8, category: "perfume" },
    { id: "perfume-armani-my-way-body-set", label: "ARMANI MY WAY EDP GIFT SET WITH BODY LOTION & SHOWER GEL", image: "img/set-3614274459074.jpg", price: 180.25, category: "perfume" },
    { id: "perfume-armani-si-edp-spring-set", label: "ARMANI SI EDP GIFT SET 50ML + 10ML + BODY LOTION", image: "img/set-3614274458886.jpg", price: 262.41, category: "perfume" },
    { id: "perfume-valentino-uomo-born-in-roma-edt-set", label: "VALENTINO UOMO BORN IN ROMA EDT GIFT SET", image: "img/set-3614274320725.jpg", price: 141.95, category: "perfume" },
    { id: "perfume-valentino-donna-born-in-roma-edp-set", label: "VALENTINO DONNA BORN IN ROMA EDP GIFT SET", image: "img/set-3614274407709.jpg", price: 185.05, category: "perfume" },
    { id: "perfume-prada-paradoxe-holiday-set", label: "PRADA PARADOXE EDP HOLIDAY GIFT SET", image: "img/set-3614274341188.jpg", price: 186.95, category: "perfume" },
    { id: "perfume-prada-luna-rossa-ocean-edp-set", label: "PRADA LUNA ROSSA OCEAN EDP GIFT SET", image: "img/set-3614274347982.jpg", price: 140.94, category: "perfume" },
    { id: "perfume-prada-paradoxe-virtual-flower-set", label: "PRADA PARADOXE VIRTUAL FLOWER EDP GIFT SET", image: "img/set-3614274423839.jpg", price: 184.29, category: "perfume" },
    { id: "perfume-prada-luna-rossa-carbon-set", label: "PRADA LUNA ROSSA CARBON EDT GIFT SET", image: "img/set-3614274423730.jpg", price: 184.29, category: "perfume" },
    { id: "perfume-prada-luna-rossa-black-set", label: "PRADA LUNA ROSSA BLACK EDP GIFT SET", image: "img/set-3614274423723.jpg", price: 208.43, category: "perfume" },
    { id: "perfume-prada-paradoxe-edp-spring-set", label: "PRADA PARADOXE EDP GIFT SET 50ML + 10ML", image: "img/set-3614274423785.jpg", price: 184.29, category: "perfume" },
    { id: "perfume-ysl-y-le-parfum-set", label: "YVES SAINT LAURENT Y LE PARFUM GIFT SET", image: "img/set-3614274284881.jpg", price: 223.98, category: "perfume" },
    { id: "perfume-ysl-myslf-le-parfum-set", label: "YVES SAINT LAURENT MYSLF LE PARFUM GIFT SET", image: "img/set-3614274318777.jpg", price: 242.18, category: "perfume" },
    { id: "perfume-ysl-myslf-edp-set", label: "YVES SAINT LAURENT MYSLF EDP GIFT SET", image: "img/set-3614274400557.jpg", price: 167.99, category: "perfume" },
    { id: "perfume-ysl-black-opium-set-30", label: "YVES SAINT LAURENT BLACK OPIUM EDP GIFT SET 30ML + 10ML", image: "img/set-3614274399899.jpg", price: 128.8, category: "perfume" },
    { id: "perfume-ysl-black-opium-set-50", label: "YVES SAINT LAURENT BLACK OPIUM EDP GIFT SET 50ML + MASCARA", image: "img/set-3614274399905.jpg", price: 183.03, category: "perfume" },
    { id: "perfume-lancome-idole-holiday-set", label: "LANCOME IDOLE EDP 50ML HOLIDAY GIFT SET", image: "img/set-3614274331134.jpg", price: 170.26, category: "perfume" },
    { id: "perfume-lancome-iconic-mascara-set", label: "LANCOME ICONIC MASCARA HOLIDAY SET", image: "img/set-3614274338393.jpg", price: 89.36, category: "perfume" },
    { id: "perfume-lancome-lveb-elixir-set", label: "LANCOME LA VIE EST BELLE L'ELIXIR EDP GIFT SET", image: "img/set-3614274330236.jpg", price: 212.86, category: "perfume" },
    { id: "perfume-lancome-lveb-candle-set", label: "LANCOME LA VIE EST BELLE EDP 50ML + CANDLE SET", image: "img/set-3614274317541.jpg", price: 180.25, category: "perfume" },
    { id: "perfume-lancome-hypnose-drama-set", label: "LANCOME HYPNOSE DRAMA MASCARA SET", image: "img/set-3614274160703.jpg", price: 54.68, category: "perfume" },
    { id: "perfume-viktor-rolf-spicebomb-extreme-set", label: "VIKTOR&ROLF SPICEBOMB EXTREME EDP GIFT SET", image: "img/set-3614274308075.jpg", price: 97.64, category: "perfume" },
    { id: "perfume-cacharel-yes-i-am-set", label: "CACHAREL YES I AM EDP GIFT SET", image: "img/cacharel-yes-i-am.jpg", price: 60.36, category: "perfume" },
    { id: "perfume-mugler-angel-elixir-set", label: "MUGLER ANGEL ELIXIR EDP GIFT SET", image: "img/set-3614274177855.jpg", price: 90.5, category: "perfume" },
    { id: "perfume-biotherm-homme-force-supreme-set", label: "BIOTHERM HOMME FORCE SUPREME GIFT SET", image: "img/set-3614274330724.jpg", price: 198.57, category: "perfume" },
    { id: "perfume-ysl-all-hours-hyper-bronze", label: "YSL ALL HOURS HYPER BRONZE", image: "img/ysl-all-hours-hyper-bronze.jpg", price: 95.43, category: "perfume" },
    { id: "perfume-ysl-all-hours-hyper-luminize", label: "YSL ALL HOURS HYPER LUMINIZE HIGHLIGHTER", image: "img/ysl-all-hours-hyper-luminize.jpg", price: 95.43, category: "perfume" },
    { id: "perfume-ysl-all-hours-hyper-blur-loose-powder", label: "YSL ALL HOURS HYPER BLUR LOOSE POWDER", image: "img/ysl-all-hours-loose-powder.jpg", price: 116.04, category: "perfume" },
    { id: "perfume-ysl-loveshine-balm", label: "YSL LOVESHINE CANDY GLOW TINTED BUTTER BALM", image: "img/ysl-loveshine-balm.jpg", price: 72.17, category: "perfume" },
    { id: "perfume-ysl-lines-liberated", label: "YSL LINES LIBERATED WATERPROOF EYE PENCIL", image: "img/ysl-lines-liberated.jpg", price: 54.23, category: "perfume" },
    { id: "perfume-ysl-make-me-blush-liquid", label: "YSL MAKE ME BLUSH LIQUID BLUSH", image: "img/ysl-make-me-blush-liquid.jpg", price: 69.65, category: "perfume" },
    { id: "perfume-ysl-make-me-blush-bold", label: "YSL MAKE ME BLUSH BOLD BLURRING POWDER BLUSH", image: "img/ysl-make-me-blush-bold.jpg", price: 77.36, category: "perfume" },
    { id: "perfume-ysl-loveshine-gloss", label: "YSL LOVESHINE PLUMPING LIP OIL GLOSS", image: "img/ysl-loveshine-gloss.jpg", price: 69.65, category: "perfume" },
    { id: "perfume-ysl-libre-flowers-flames", label: "YVES SAINT LAURENT LIBRE FLOWERS & FLAMES EDP FLORALE", image: "img/ysl-libre-edp-florale.jpg", price: 139.17, category: "perfume" },
    { id: "perfume-ysl-myslf-le-parfum", label: "YVES SAINT LAURENT MYSLF LE PARFUM", image: "img/ysl-myslf-le-parfum.jpg", price: 162.42, category: "perfume" },
    { id: "perfume-ysl-black-opium-glitter", label: "YVES SAINT LAURENT BLACK OPIUM EDP GLITTER", image: "img/ysl-black-opium-glitter.jpg", price: 134.11, category: "perfume" },
    { id: "perfume-ysl-libre-leau-nue", label: "YVES SAINT LAURENT LIBRE L'EAU NUE", image: "img/ysl-libre-leau-nue.jpg", price: 177.84, category: "perfume" },
    { id: "perfume-ysl-y-le-parfum", label: "YVES SAINT LAURENT Y LE PARFUM", image: "img/ysl-y-le-parfum.jpg", price: 146.88, category: "perfume" },
    { id: "perfume-prada-paradoxe-virtual-flower", label: "PRADA PARADOXE VIRTUAL FLOWER EDP", image: "img/prada-paradoxe-virtual-flower.jpg", price: 130.95, category: "perfume" },
    { id: "perfume-prada-infusion-vanille", label: "PRADA LES INFUSIONS INFUSION DE VANILLE EDP 100ML", image: "img/prada-infusion-vanille.jpg", price: 233.08, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-the-gold-uomo", label: "VALENTINO BORN IN ROMA THE GOLD UOMO EDT 100ML", image: "img/valentino-born-in-roma-the-gold-uomo.jpg", price: 184.67, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-the-gold-donna", label: "VALENTINO BORN IN ROMA THE GOLD DONNA EDP", image: "img/valentino-born-in-roma-the-gold-donna.jpg", price: 169.76, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-uomo-extradose", label: "VALENTINO BORN IN ROMA UOMO EXTRADOSE PARFUM", image: "img/valentino-born-in-roma-uomo-extradose.jpg", price: 169.0, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-donna-extradose", label: "VALENTINO BORN IN ROMA DONNA EXTRADOSE PARFUM", image: "img/valentino-born-in-roma-donna-extradose.jpg", price: 153.58, category: "perfume" },
    { id: "perfume-lancome-lveb-elixir", label: "LANCOME LA VIE EST BELLE L'ELIXIR EDP", image: "img/lancome-lveb-elixir.jpg", price: 146.24, category: "perfume" },
    { id: "perfume-lancome-idole-power", label: "LANCOME IDOLE POWER EDP INTENSE", image: "img/lancome-idole-power.jpg", price: 114.9, category: "perfume" },
    { id: "perfume-lancome-tresor-la-nuit-vanille-noire", label: "LANCOME LA NUIT TRESOR VANILLE NOIRE EDP", image: "img/lancome-tresor-la-nuit-vanille-noire.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-ralph-lauren-ralphs-club-edt", label: "RALPH LAUREN RALPH'S CLUB EDT", image: "img/ralph-lauren-ralphs-club-edt.jpg", price: 52.33, category: "perfume" },
    { id: "perfume-mugler-angel-fantasm", label: "MUGLER ANGEL FANTASM EDP", image: "img/mugler-angel-fantasm.jpg", price: 119.83, category: "perfume" },
    { id: "perfume-mugler-amen-fantasm", label: "MUGLER A*MEN FANTASM EDP 100ML", image: "img/mugler-amen-fantasm.jpg", price: 156.86, category: "perfume" },
    { id: "perfume-mugler-alien-extraintense", label: "MUGLER ALIEN EXTRAINTENSE EDP INTENSE", image: "img/mugler-alien-extra-intense.jpg", price: 125.52, category: "perfume" },
    { id: "perfume-cacharel-ella-ella", label: "CACHAREL ELLA ELLA EDP", image: "img/cacharel-ella-ella.jpg", price: 78.49, category: "perfume" },
    { id: "perfume-viktor-rolf-spicebomb-dark-leather", label: "VIKTOR&ROLF SPICEBOMB DARK LEATHER EDP", image: "img/viktor-rolf-spicebomb-dark-leather.jpg", price: 124.25, category: "perfume" },
    { id: "perfume-diesel-only-the-brave-edp", label: "DIESEL ONLY THE BRAVE EDP", image: "img/diesel-only-the-brave-edp.jpg", price: 72.43, category: "perfume" },
    { id: "perfume-azzaro-forever-wanted-elixir", label: "AZZARO FOREVER WANTED ELIXIR", image: "img/azzaro-forever-wanted-elixir.jpg", price: 128.42, category: "perfume" },
    { id: "perfume-lancome-lip-idole-juicytreat", label: "LANCOME LIP IDOLE JUICYTREAT OIL-IN-GLOSS", image: "img/lancome-lip-idole-juicytreat.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-lancome-lash-idole-flutter", label: "LANCOME LASH IDOLE FLUTTER EXTENSION MASCARA 01", image: "img/lancome-lash-idole-flutter.jpg", price: 45.74, category: "perfume" },
    { id: "perfume-lancome-tiuw-setting-powder", label: "LANCOME TEINT IDOLE ULTRA WEAR SKIN REFINING SETTING POWDER", image: "img/lancome-tiuw-setting-powder.jpg", price: 88.86, category: "perfume" },
    { id: "perfume-lancome-tiuw-care-glow-concealer", label: "LANCOME TEINT IDOLE ULTRA WEAR CARE & GLOW SERUM CONCEALER 125W", image: "img/lancome-tiuw-care-glow-concealer.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-lancome-hydra-zen-gel-cream", label: "LANCOME HYDRA ZEN GEL CREAM", image: "img/lancome-hydra-zen-gel-cream.jpg", price: 111.99, category: "perfume" },
    { id: "perfume-lancome-genifique-ultimate", label: "LANCOME ADVANCED GENIFIQUE ULTIMATE SERUM", image: "img/lancome-genifique-ultimate.jpg", price: 106.3, category: "perfume" },
    { id: "perfume-lancome-renergie-crx-triple-serum-retinol", label: "LANCOME RENERGIE C.R.X. TRIPLE SERUM RETINOL 50ML", image: "img/lancome-renergie-triple-serum-retinol.jpg", price: 251.03, category: "perfume" },
    { id: "perfume-lancome-renergie-hpn-uvmune-spf50", label: "LANCOME RENERGIE H.P.N. UVMUNE CREAM SPF50 50ML", image: "img/lancome-renergie-hpn-300-spf50.jpg", price: 188.08, category: "perfume" },
    { id: "perfume-lancome-tonique-confort-200", label: "LANCOME TONIQUE CONFORT 200ML", image: "img/lancome-tonique-confort-200.jpg", price: 68.0, category: "perfume" },
    { id: "perfume-biotherm-life-plankton-regenerating-serum", label: "BIOTHERM LIFE PLANKTON REGENERATING SERUM", image: "img/biotherm-life-plankton-regenerating-serum.jpg", price: 135.88, category: "perfume" },
    { id: "perfume-biotherm-homme-aquapower-advanced-gel", label: "BIOTHERM HOMME AQUAPOWER ADVANCED GEL", image: "img/biotherm-homme-aquapower-advanced-gel.jpg", price: 83.55, category: "perfume" },
    { id: "perfume-biotherm-lait-corporel-active-recovery", label: "BIOTHERM LAIT CORPOREL ACTIVE RECOVERY 400ML", image: "img/biotherm-lait-corporel-active-recovery.jpg", price: 59.53, category: "perfume" },
    { id: "perfume-biotherm-blue-peptides-eyes-lips", label: "BIOTHERM BLUE PEPTIDES EYES & LIPS CONTOUR RESHAPER 15ML", image: "img/biotherm-blue-peptides-eyes-lips.jpg", price: 107.06, category: "perfume" },
    { id: "perfume-biotherm-aquasource-hydra-barrier-cleanser", label: "BIOTHERM AQUASOURCE HYDRA BARRIER CLEANSER 150ML", image: "img/biotherm-aquasource-hydra-barrier-cleanser.jpg", price: 49.68, category: "perfume" },
    { id: "perfume-biotherm-aquasource-hydra-barrier-cream", label: "BIOTHERM AQUASOURCE HYDRA BARRIER CREAM", image: "img/biotherm-aquasource-hydra-barrier-cream.jpg", price: 55.36, category: "perfume" },
    { id: "perfume-lancome-o-de-lancome-off-now", label: "LANCOME LES O DE LANCOME OFF NOW EDT 100ML", image: "img/lancome-o-de-lancome-off-now.jpg", price: 141.82, category: "perfume" },
    { id: "perfume-lancome-o-de-lancome-over-the-top", label: "LANCOME LES O DE LANCOME OVER THE TOP EDT 100ML", image: "img/lancome-o-de-lancome-over-the-top.jpg", price: 141.82, category: "perfume" },
    { id: "perfume-lancome-o-de-lancome-ozenith", label: "LANCOME LES O DE LANCOME O ZENITH EDT 100ML", image: "img/lancome-o-de-lancome-ozenith.jpg", price: 141.82, category: "perfume" },
    { id: "perfume-armani-prive-iris-bleu", label: "ARMANI PRIVE IRIS BLEU EDT", image: "img/armani-prive-bleu-iris.jpg", price: 238.14, category: "perfume" },
    { id: "perfume-armani-prive-gardenia-antigua", label: "ARMANI PRIVE GARDENIA ANTIGUA EDT 100ML", image: "img/armani-prive-gardenia-antigua.jpg", price: 312.97, category: "perfume" },
    { id: "perfume-armani-prive-indigo-tanzanite", label: "ARMANI PRIVE INDIGO TANZANITE EDP 100ML", image: "img/armani-prive-indigo-tanzanite.jpg", price: 545.29, category: "perfume" },
    { id: "perfume-cacharel-anais-anais", label: "CACHAREL ANAIS ANAIS EDT", image: "img/cacharel-anais-anais.jpg", price: 64.84, category: "perfume" },
    { id: "perfume-armani-code-edp-75-spring-set", label: "ARMANI CODE EDP 75ML + 15ML GIFT SET", image: "img/set-3614274458749.jpg", price: 193.27, category: "perfume" },
    { id: "perfume-armani-code-edt-50-spring-set", label: "ARMANI CODE EDT 50ML + BODY SHAMPOO GIFT SET", image: "img/set-3614274458732.jpg", price: 137.65, category: "perfume" },
    { id: "perfume-lancome-lash-idole-idole-edp-set", label: "LANCOME LASH IDOLE MASCARA + IDOLE EDP 10ML SET", image: "img/set-3614274393590.jpg", price: 44.68, category: "perfume" },
    { id: "perfume-lancome-lash-idole-flutter-extension-set", label: "LANCOME LASH IDOLE FLUTTER EXTENSION + LIP IDOLE MINI SET", image: "img/set-3614274406849.jpg", price: 42.74, category: "perfume" },
    { id: "perfume-valentino-uomo-born-in-roma-edt-50-set", label: "VALENTINO UOMO BORN IN ROMA EDT 50ML + 15ML SET", image: "img/set-3614274407662.jpg", price: 148.52, category: "perfume" },
    { id: "perfume-biotherm-homme-aquapower-routine-set", label: "BIOTHERM HOMME AQUAPOWER ROUTINE SET", image: "img/set-3614274484625.jpg", price: 85.19, category: "perfume" },
    { id: "perfume-biotherm-homme-force-supreme-routine-set", label: "BIOTHERM HOMME FORCE SUPREME ROUTINE SET", image: "img/set-3614274484793.jpg", price: 149.03, category: "perfume" },
    { id: "perfume-lancome-genifique-ultimate-routine-set", label: "LANCOME GENIFIQUE ULTIMATE SERUM 30ML ROUTINE SET", image: "img/set-3614274425796.jpg", price: 173.17, category: "perfume" },
    { id: "perfume-lancome-juicy-tubes", label: "LANCOME JUICY TUBES LIP GLOSS 15ML", image: "img/lancome-juicy-tubes.jpg", price: 34.0, category: "perfume" },
    { id: "perfume-lancome-skin-idole-supertint", label: "LANCOME SKIN IDOLE 3 SERUM SUPERTINT 30ML", image: "img/lancome-idole-skintint.jpg", price: 78.37, category: "perfume" },
    { id: "perfume-lancome-genifique-eye-cream", label: "LANCOME GENIFIQUE ULTIMATE EYE CREAM 20ML", image: "img/lancome-genifique-eye-cream.jpg", price: 107.57, category: "perfume" },
    { id: "perfume-lancome-renergie-multi-glow-day", label: "LANCOME RENERGIE MULTI GLOW DAY CREAM 50ML", image: "img/lancome-renergie-multi-glow-day.jpg", price: 159.26, category: "perfume" },
    { id: "perfume-biotherm-waterlover-sun-milk-spf50-400", label: "BIOTHERM WATERLOVER HYDRATING SUN MILK SPF50+ 400ML", image: "img/biotherm-waterlover-hydrating-sun-milk-spf50-400ml.jpg", price: 77.99, category: "perfume" },
    { id: "perfume-biotherm-waterlover-milky-sun-spray-spf50", label: "BIOTHERM WATERLOVER MILKY SUN SPRAY SPF50+ 200ML", image: "img/biotherm-waterlover-milky-sun-spray-spf50.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-biotherm-collagen-fit-body-cream", label: "BIOTHERM COLLAGEN FIT INTENSIVE HYDRA BODY CREAM 200ML", image: "img/biotherm-collagen-fit-body-cream.jpg", price: 68.13, category: "perfume" },
    { id: "perfume-biotherm-collagen-fit-body-milk", label: "BIOTHERM COLLAGEN FIT FIRMING BODY MILK 400ML", image: "img/biotherm-collagen-fit-body-milk.jpg", price: 63.83, category: "perfume" },
    { id: "perfume-biotherm-homme-force-supreme-body-reshaper", label: "BIOTHERM HOMME FORCE SUPREME BODY RESHAPER 125ML", image: "img/biotherm-force-supreme-body-reshaper.jpg", price: 78.37, category: "perfume" },
    { id: "perfume-biotherm-homme-force-supreme-face-reshaper", label: "BIOTHERM HOMME FORCE SUPREME FACE RESHAPER CREAM 50ML", image: "img/biotherm-force-supreme-reshaper-cream.jpg", price: 164.57, category: "perfume" },
    { id: "perfume-armani-prisma-glass-icy-plumper", label: "GIORGIO ARMANI PRISMA GLASS ICY PLUMPER", image: "img/armani-prisma-glass-icy-plumper.jpg", price: 66.61, category: "perfume" },
    { id: "perfume-ysl-loveshine-candy-glaze", label: "YSL LOVESHINE CANDY GLAZE LIP GLOSS STICK", image: "img/ysl-loveshine-candy-glaze.jpg", price: 72.17, category: "perfume" },
    { id: "perfume-margiela-replica-beach-walk", label: "MAISON MARGIELA REPLICA BEACH WALK EDT", image: "img/margiela-replica-beach-walk.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-margiela-replica-by-the-fireplace", label: "MAISON MARGIELA REPLICA BY THE FIREPLACE EDT 30ML", image: "img/margiela-replica-by-the-fireplace.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-margiela-replica-jazz-club", label: "MAISON MARGIELA REPLICA JAZZ CLUB EDT", image: "img/margiela-replica-jazz-club.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-margiela-replica-lazy-sunday-morning", label: "MAISON MARGIELA REPLICA LAZY SUNDAY MORNING EDT", image: "img/margiela-replica-lazy-sunday-morning.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-margiela-replica-afternoon-delight", label: "MAISON MARGIELA REPLICA AFTERNOON DELIGHT EDT", image: "img/margiela-replica-afternoon-delight.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-margiela-replica-autumn-vibes", label: "MAISON MARGIELA REPLICA AUTUMN VIBES EDT 30ML", image: "img/margiela-replica-autumn-vibes.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-margiela-replica-from-the-garden", label: "MAISON MARGIELA REPLICA FROM THE GARDEN EDT", image: "img/margiela-replica-from-the-garden.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-margiela-replica-sailing-day", label: "MAISON MARGIELA REPLICA SAILING DAY EDT 100ML", image: "img/margiela-replica-sailing-day.jpg", price: 192.25, category: "perfume" },
    { id: "perfume-margiela-replica-on-a-date", label: "MAISON MARGIELA REPLICA ON A DATE EDT 30ML", image: "img/margiela-replica-on-a-date.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-margiela-replica-when-the-rain-stops", label: "MAISON MARGIELA REPLICA WHEN THE RAIN STOPS EDT", image: "img/margiela-replica-when-the-rain-stops.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-margiela-replica-under-the-stars", label: "MAISON MARGIELA REPLICA UNDER THE STARS EDT", image: "img/margiela-replica-under-the-stars.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-margiela-replica-coffee-break", label: "MAISON MARGIELA REPLICA COFFEE BREAK EDT 100ML", image: "img/margiela-replica-coffee-break.jpg", price: 192.25, category: "perfume" },
    { id: "perfume-margiela-replica-flying", label: "MAISON MARGIELA REPLICA FLYING EDP 100ML", image: "img/margiela-replica-flying.jpg", price: 264.56, category: "perfume" },
    { id: "perfume-margiela-replica-ideal-one", label: "MAISON MARGIELA REPLICA IDEAL ONE EDP 100ML", image: "img/margiela-replica-ideal-one.jpg", price: 264.56, category: "perfume" },
    { id: "perfume-margiela-replica-dancing-on-the-moon", label: "MAISON MARGIELA REPLICA DANCING ON THE MOON EDP 100ML", image: "img/margiela-replica-dancing-on-the-moon.jpg", price: 264.56, category: "perfume" },
    { id: "perfume-margiela-replica-celestial-whispers", label: "MAISON MARGIELA REPLICA CELESTIAL WHISPERS EDP 100ML", image: "img/margiela-replica-celestial-whispers.jpg", price: 264.56, category: "perfume" },
    { id: "perfume-margiela-replica-under-the-lemon-trees", label: "MAISON MARGIELA REPLICA UNDER THE LEMON TREES EDT 100ML", image: "img/margiela-replica-under-the-lemon-trees.jpg", price: 192.25, category: "perfume" },
    { id: "perfume-margiela-replica-bubble-bath", label: "MAISON MARGIELA REPLICA BUBBLE BATH EDT 100ML", image: "img/margiela-replica-bubble-bath.jpg", price: 192.25, category: "perfume" },
    { id: "perfume-margiela-replica-lazy-sunday-morning-candle", label: "MAISON MARGIELA REPLICA LAZY SUNDAY MORNING CANDLE 165G", image: "img/margiela-replica-lazy-sunday-morning-candle.jpg", price: 83.8, category: "perfume" },
    { id: "perfume-mugler-amen-stellar", label: "MUGLER A*MEN STELLAR EDP", image: "img/mugler-amen-stellar.jpg", price: 121.22, category: "perfume" },
    { id: "perfume-mugler-angel-stellar", label: "MUGLER ANGEL STELLAR EDP", image: "img/mugler-angel-stellar.jpg", price: 118.44, category: "perfume" },
    { id: "perfume-mugler-angel-edp", label: "MUGLER ANGEL EDP", image: "img/mugler-angel-edp.jpg", price: 119.83, category: "perfume" },
    { id: "perfume-mugler-angel-nova", label: "MUGLER ANGEL NOVA EDP 25ML", image: "img/mugler-angel-nova.jpg", price: 119.83, category: "perfume" },
    { id: "perfume-ralph-lauren-big-pony-1", label: "RALPH LAUREN POLO BIG PONY #1 BLUE EDT 100ML", image: "img/ralph-lauren-big-pony-1.jpg", price: 54.98, category: "perfume" },
    { id: "perfume-ralph-lauren-polo-blue-parfum", label: "RALPH LAUREN POLO BLUE PARFUM 75ML", image: "img/ralph-lauren-polo-blue-parfum.jpg", price: 124.25, category: "perfume" },
    { id: "perfume-ralph-lauren-polo-67-edt", label: "RALPH LAUREN POLO 67 EDT", image: "img/ralph-lauren-polo-67-edt.jpg", price: 73.31, category: "perfume" },
    { id: "perfume-ralph-lauren-polo-67-edp", label: "RALPH LAUREN POLO 67 EDP", image: "img/ralph-lauren-polo-67-edp.jpg", price: 81.15, category: "perfume" },
    { id: "perfume-viktor-rolf-spicebomb-metallic-musk", label: "VIKTOR&ROLF SPICEBOMB METALLIC MUSK EDP", image: "img/viktor-rolf-spicebomb-metallic-musk.jpg", price: 135.5, category: "perfume" },
    { id: "perfume-viktor-rolf-flowerbomb-extreme", label: "VIKTOR&ROLF FLOWERBOMB EXTREME EDP INTENSE", image: "img/viktor-rolf-flowerbomb-extreme.jpg", price: 156.86, category: "perfume" },
    { id: "perfume-prada-paradoxe-radical-essence", label: "PRADA PARADOXE RADICAL ESSENCE PARFUM", image: "img/prada-paradoxe-essence.jpg", price: 150.29, category: "perfume" },
    { id: "perfume-prada-paradoxe-hair-mist", label: "PRADA PARADOXE HAIR MIST 30ML", image: "img/prada-paradoxe-hair-mist.jpg", price: 67.88, category: "perfume" },
    { id: "perfume-prada-paradoxe-intense-90-set", label: "PRADA PARADOXE INTENSE EDP 90ML + 10ML GIFT SET", image: "img/set-3614274423808.jpg", price: 269.86, category: "perfume" },
    { id: "perfume-ysl-myslf-labsolu", label: "YVES SAINT LAURENT MYSLF L'ABSOLU PARFUM", image: "img/ysl-myslf-labsolu.jpg", price: 183.03, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-body-shimmer", label: "VALENTINO BORN IN ROMA DONNA PERFUMED BODY SHIMMER 125ML", image: "img/valentino-born-in-roma-body-shimmer.jpg", price: 76.85, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-hair-body-mist", label: "VALENTINO BORN IN ROMA DONNA PERFUMED HAIR & BODY MIST 90ML", image: "img/valentino-born-in-roma-hair-mist.jpg", price: 76.47, category: "perfume" },
    { id: "perfume-armani-code-elixir", label: "ARMANI CODE ELIXIR 50ML", image: "img/armani-code-elixir.jpg", price: 212.86, category: "perfume" },
    { id: "perfume-armani-si-parfum", label: "ARMANI SI PARFUM", image: "img/armani-si-parfum.jpg", price: 151.43, category: "perfume" },
    { id: "perfume-armani-swy-intensely-edp-50-set", label: "EMPORIO ARMANI STRONGER WITH YOU INTENSELY EDP 50ML + SHOWER GEL SET", image: "img/set-3614274458763.jpg", price: 170.26, category: "perfume" },
    { id: "perfume-lancome-lveb-vanille-nude", label: "LANCOME LA VIE EST BELLE VANILLE NUDE EDP", image: "img/lancome-lveb-vanille-nude.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-lancome-absolue-longevity-soft-cream", label: "LANCOME ABSOLUE LONGEVITY THE SOFT CREAM 60ML", image: "img/lancome-absolue-soft-cream.jpg", price: 441.26, category: "perfume" },
    { id: "perfume-biotherm-aquascreen-uv-daily-spf50", label: "BIOTHERM AQUASCREEN ACTIVEWEAR DAILY UV FLUID SPF50+ 40ML", image: "img/biotherm-aquascreen-uv-daily-spf50.jpg", price: 70.53, category: "perfume" },
    { id: "perfume-lancome-skin-idole-juicy-blush", label: "LANCOME SKIN IDOLE JUICY LIQUID BLUSH", image: "img/lancome-idole-liquid-blush.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-ysl-the-inks-blur", label: "YSL THE INKS BLUR MATTE LIP STAIN", image: "img/ysl-the-inks-blur-matte.jpg", price: 69.65, category: "perfume" },
    { id: "perfume-ysl-the-inks-vinyl-cream", label: "YSL THE INKS VINYL CREAM LIP STAIN", image: "img/ysl-the-inks-vinyl-cream.jpg", price: 69.65, category: "perfume" },
    { id: "perfume-ysl-the-slim-couture-matte", label: "YSL ROUGE PUR COUTURE THE SLIM MATTE LIPSTICK", image: "img/ysl-the-slim.jpg", price: 69.65, category: "perfume" },
    { id: "perfume-ysl-all-hours-glow-foundation", label: "YSL ALL HOURS GLOW FOUNDATION 25ML", image: "img/ysl-all-hours-glow-foundation.jpg", price: 97.96, category: "perfume" },
    { id: "perfume-armani-skin-tint", label: "GIORGIO ARMANI SKIN TINT 30ML", image: "img/armani-skin-tint.jpg", price: 87.09, category: "perfume" },
    { id: "perfume-armani-luminous-silk-foundation", label: "GIORGIO ARMANI LUMINOUS SILK FOUNDATION 30ML", image: "img/armani-luminous-silk-foundation.jpg", price: 110.09, category: "perfume" },
    { id: "perfume-armani-luminous-silk-glow-primer", label: "GIORGIO ARMANI LUMINOUS SILK ILLUMINATING PRIMER", image: "img/armani-luminous-silk-glow-primer.jpg", price: 110.09, category: "perfume" },
    { id: "perfume-armani-prive-cuir-nu", label: "ARMANI PRIVE CUIR NU EDP INTENSE", image: "img/armani-prive-cuir-nu.jpg", price: 384.0, category: "perfume" },
    { id: "perfume-armani-power-of-you", label: "EMPORIO ARMANI POWER OF YOU EDP", image: "img/armani-power-of-you.jpg", price: 107.06, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-amber", label: "EMPORIO ARMANI STRONGER WITH YOU AMBER EDP 100ML", image: "img/armani-stronger-with-you-amber.jpg", price: 187.2, category: "perfume" },
    { id: "perfume-lancome-magie-noire", label: "LANCOME MAGIE NOIRE EDT 75ML", image: "img/lancome-magie-noire.jpg", price: 203.76, category: "perfume" },
    { id: "perfume-lancome-absolue-lextrait-cream", label: "LANCOME ABSOLUE L'EXTRAIT ELIXIR CREAM 50ML", image: "img/lancome-absolue-lextrait-cream.jpg", price: 741.46, category: "perfume" },
    { id: "perfume-lancome-absolue-lextrait-yeux", label: "LANCOME ABSOLUE L'EXTRAIT EYE CREAM 15ML", image: "img/lancome-absolue-lextrait-yeux.jpg", price: 671.06, category: "perfume" },
    { id: "perfume-biotherm-aquasource-vitamin-glow-gel", label: "BIOTHERM AQUASOURCE+ VITAMIN GLOW GEL 50ML", image: "img/biotherm-aquasource-vitamin-glow.jpg", price: 83.68, category: "perfume" },
    { id: "perfume-biotherm-aquasource-cica-nutri-cream", label: "BIOTHERM AQUASOURCE CICA NUTRI CREAM 30ML", image: "img/biotherm-aquasource-cica-nutri-cream.jpg", price: 41.84, category: "perfume" },
    { id: "perfume-prada-paradigme-edp", label: "PRADA PARADIGME EDP", image: "img/prada-paradigme.jpg", price: 152.69, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-rendez-vous-uomo", label: "VALENTINO UOMO BORN IN ROMA RENDEZ-VOUS IVORY EDT 100ML", image: "img/valentino-born-in-roma-rendez-vous-uomo.jpg", price: 227.9, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-rendez-vous-donna", label: "VALENTINO DONNA BORN IN ROMA RENDEZ-VOUS IVORY EDP", image: "img/valentino-born-in-roma-rendez-vous-donna.jpg", price: 209.95, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-purple-melancholia-uomo", label: "VALENTINO UOMO BORN IN ROMA PURPLE MELANCHOLIA EDT", image: "img/valentino-born-in-roma-purple-uomo.jpg", price: 140.81, category: "perfume" },
    { id: "perfume-valentino-born-in-roma-purple-melancholia-donna", label: "VALENTINO DONNA BORN IN ROMA PURPLE MELANCHOLIA EDP", image: "img/valentino-born-in-roma-purple-donna.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-ysl-libre-vanille-couture", label: "YVES SAINT LAURENT LIBRE VANILLE COUTURE EDP 50ML", image: "img/ysl-libre-vanille-couture.jpg", price: 224.23, category: "perfume" },
    { id: "perfume-margiela-untitled-l-eau", label: "MAISON MARGIELA (UNTITLED) L'EAU EDT 100ML", image: "img/margiela-untitled-l-eau.jpg", price: 174.18, category: "perfume" },
    { id: "perfume-margiela-untitled-edp", label: "MAISON MARGIELA (UNTITLED) EDP 100ML", image: "img/margiela-untitled-edp.jpg", price: 192.25, category: "perfume" },
    { id: "perfume-margiela-replica-beach-vibes-candle", label: "MAISON MARGIELA REPLICA BEACH VIBES CANDLE 165G", image: "img/margiela-replica-beach-vibes-candle.jpg", price: 83.8, category: "perfume" },
    { id: "perfume-margiela-replica-jazz-club-diffuser", label: "MAISON MARGIELA REPLICA JAZZ CLUB DIFFUSER 185ML", image: "img/margiela-replica-jazz-club-diffuser.jpg", price: 116.16, category: "perfume" },
    { id: "perfume-margiela-replica-from-the-garden-candle", label: "MAISON MARGIELA REPLICA FROM THE GARDEN CANDLE 165G", image: "img/margiela-replica-from-the-garden-candle.jpg", price: 83.8, category: "perfume" },
    { id: "perfume-margiela-replica-lazy-sunday-morning-shower-gel", label: "MAISON MARGIELA REPLICA LAZY SUNDAY MORNING SHOWER GEL 200ML", image: "img/margiela-replica-lazy-sunday-morning-shower-gel.jpg", price: 51.57, category: "perfume" },
    { id: "perfume-margiela-replica-lazy-sunday-morning-body-lotion", label: "MAISON MARGIELA REPLICA LAZY SUNDAY MORNING BODY LOTION 200ML", image: "img/margiela-replica-lazy-sunday-morning-body-lotion.jpg", price: 70.91, category: "perfume" },
    { id: "perfume-dkny-be-delicious", label: "DKNY BE DELICIOUS EDP", image: "img/dkny-be-delicious.jpg", price: 61.94, category: "perfume" },
    { id: "perfume-dkny-be-100-delicious", label: "DKNY BE 100% DELICIOUS EDP", image: "img/dkny-be-100-delicious.jpg", price: 55.87, category: "perfume" },
    { id: "perfume-dkny-be-delicious-fresh-blossom", label: "DKNY BE DELICIOUS FRESH BLOSSOM EDP", image: "img/dkny-be-delicious-fresh-blossom.jpg", price: 55.11, category: "perfume" },
    { id: "perfume-dkny-be-extra-delicious", label: "DKNY BE EXTRA DELICIOUS EDP", image: "img/dkny-be-extra-delicious.jpg", price: 55.11, category: "perfume" },
    { id: "perfume-dkny-women-edp", label: "DKNY WOMEN ENERGIZING EDP", image: "img/dkny-women-edp.jpg", price: 67.5, category: "perfume" },
    { id: "perfume-dkny-be-delicious-orchard-street", label: "DKNY BE DELICIOUS ORCHARD ST. EDP", image: "img/dkny-be-delicious-orchard-street.jpg", price: 55.11, category: "perfume" },
    { id: "perfume-cavalli-paradiso", label: "ROBERTO CAVALLI PARADISO EDP", image: "img/cavalli-paradiso.jpg", price: 68.0, category: "perfume" },
    { id: "perfume-just-cavalli-her", label: "JUST CAVALLI FOR HER EDT", image: "img/just-cavalli-her.jpg", price: 35.9, category: "perfume" },
    { id: "perfume-just-cavalli-him", label: "JUST CAVALLI FOR HIM EDT", image: "img/just-cavalli-him.jpg", price: 35.9, category: "perfume" },
    { id: "perfume-cavalli-signature", label: "ROBERTO CAVALLI SIGNATURE EDP", image: "img/cavalli-signature.jpg", price: 68.0, category: "perfume" },
    { id: "perfume-cavalli-nero-assoluto", label: "ROBERTO CAVALLI NERO ASSOLUTO EDP 75ML", image: "img/cavalli-nero-assoluto.jpg", price: 98.84, category: "perfume" },
    { id: "perfume-cavalli-sweet-ferocious", label: "ROBERTO CAVALLI SIGNATURE SWEET FEROCIOUS EDP", image: "img/cavalli-sweet-ferocious.jpg", price: 63.2, category: "perfume" },
    { id: "perfume-just-cavalli-wild-heart-her", label: "JUST CAVALLI WILD HEART FOR HER EDP", image: "img/just-cavalli-wild-heart-her.jpg", price: 35.9, category: "perfume" },
    { id: "perfume-just-cavalli-wild-heart-him", label: "JUST CAVALLI WILD HEART FOR HIM EDT", image: "img/just-cavalli-wild-heart-him.jpg", price: 35.9, category: "perfume" },
    { id: "perfume-cavalli-paradiso-rosa", label: "ROBERTO CAVALLI PARADISO ROSA EDP", image: "img/cavalli-paradiso-rosa.jpg", price: 68.0, category: "perfume" },
    { id: "perfume-cavalli-serpentine", label: "ROBERTO CAVALLI SERPENTINE PARFUM", image: "img/cavalli-serpentine.jpg", price: 83.42, category: "perfume" },
    { id: "perfume-just-cavalli-give-me-magic-him", label: "JUST CAVALLI GIVE ME MAGIC FOR HIM EDT", image: "img/just-cavalli-give-me-magic-him.jpg", price: 35.9, category: "perfume" },
    { id: "perfume-just-cavalli-give-me-magic-her", label: "JUST CAVALLI GIVE ME MAGIC FOR HER EDP", image: "img/just-cavalli-give-me-magic-her.jpg", price: 35.39, category: "perfume" },
    { id: "perfume-ysl-libre-edp-loveshine-set", label: "YVES SAINT LAURENT LIBRE EDP 30ML + LOVESHINE GIFT SET", image: "img/set-3614274638356.jpg", price: 158.13, category: "perfume" },
    { id: "perfume-ysl-black-opium-holiday-set-50", label: "YVES SAINT LAURENT BLACK OPIUM EDP 50ML HOLIDAY GIFT SET", image: "img/set-3614274638400.jpg", price: 190.74, category: "perfume" },
    { id: "perfume-ysl-myslf-le-parfum-holiday-set", label: "YVES SAINT LAURENT MYSLF LE PARFUM 60ML HOLIDAY GIFT SET", image: "img/set-3614274643398.jpg", price: 201.1, category: "perfume" },
    { id: "perfume-ysl-myslf-edp-holiday-set-60", label: "YVES SAINT LAURENT MYSLF EDP 60ML HOLIDAY GIFT SET", image: "img/set-3614274643411.jpg", price: 167.99, category: "perfume" },
    { id: "perfume-ysl-myslf-edp-holiday-set-40", label: "YVES SAINT LAURENT MYSLF EDP 40ML HOLIDAY GIFT SET", image: "img/set-3614274643428.jpg", price: 144.35, category: "perfume" },
    { id: "perfume-ysl-libre-edp-intense-holiday-set", label: "YVES SAINT LAURENT LIBRE EDP INTENSE 90ML HOLIDAY GIFT SET", image: "img/set-3614274638271.jpg", price: 294.01, category: "perfume" },
    { id: "perfume-prada-paradoxe-intense-holiday-set", label: "PRADA PARADOXE INTENSE EDP 50ML HOLIDAY GIFT SET", image: "img/set-3614274642018.jpg", price: 208.43, category: "perfume" },
    { id: "perfume-prada-paradoxe-holiday-set-2025", label: "PRADA PARADOXE EDP 50ML HOLIDAY GIFT SET 2025", image: "img/set-3614274642001.jpg", price: 193.9, category: "perfume" },
    { id: "perfume-prada-paradigme-set", label: "PRADA PARADIGME EDP 100ML GIFT SET", image: "img/set-3614274428568.jpg", price: 220.57, category: "perfume" },
    { id: "perfume-prada-luna-rossa-black-set-100", label: "PRADA LUNA ROSSA BLACK EDP 100ML GIFT SET", image: "img/set-3614274642049.jpg", price: 197.56, category: "perfume" },
    { id: "perfume-armani-si-passione-holiday-set", label: "ARMANI SI PASSIONE EDP 50ML HOLIDAY GIFT SET", image: "img/set-3614274692754.jpg", price: 193.27, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-intensely-set-100", label: "ARMANI EMPORIO STRONGER WITH YOU INTENSELY EDP 100ML HOLIDAY GIFT SET", image: "img/set-3614274692563.jpg", price: 194.4, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-intensely-set-50", label: "ARMANI EMPORIO STRONGER WITH YOU INTENSELY EDP 50ML HOLIDAY GIFT SET", image: "img/set-3614274692556.jpg", price: 137.65, category: "perfume" },
    { id: "perfume-armani-si-edp-holiday-set", label: "ARMANI SI EDP 50ML HOLIDAY GIFT SET", image: "img/set-3614274692464.jpg", price: 193.27, category: "perfume" },
    { id: "perfume-armani-code-edt-holiday-set", label: "ARMANI CODE EDT 50ML HOLIDAY GIFT SET", image: "img/set-3614274692518.jpg", price: 141.06, category: "perfume" },
    { id: "perfume-armani-my-way-holiday-set", label: "ARMANI MY WAY EDP 50ML HOLIDAY GIFT SET", image: "img/set-3614274692679.jpg", price: 188.08, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-edt-holiday-set", label: "ARMANI EMPORIO STRONGER WITH YOU EDT 100ML HOLIDAY GIFT SET", image: "img/set-3614274692570.jpg", price: 170.26, category: "perfume" },
    { id: "perfume-lancome-la-vie-est-belle-edp-30-set", label: "LANCOME LA VIE EST BELLE EDP 30ML GIFT SET", image: "img/set-3614274652208.jpg", price: 130.44, category: "perfume" },
    { id: "perfume-lancome-juicy-tubes-mini-set", label: "LANCOME JUICY TUBES MINI GIFT SET", image: "img/set-3614274653496.jpg", price: 69.65, category: "perfume" },
    { id: "perfume-lancome-idole-edp-25-set", label: "LANCOME IDOLE EDP 25ML GIFT SET", image: "img/set-3614274654387.jpg", price: 120.59, category: "perfume" },
    { id: "perfume-lancome-idole-edp-50-set", label: "LANCOME IDOLE EDP 50ML GIFT SET", image: "img/set-3614274654400.jpg", price: 193.27, category: "perfume" },
    { id: "perfume-lancome-la-vie-est-belle-edp-50-set", label: "LANCOME LA VIE EST BELLE EDP 50ML GIFT SET", image: "img/set-3614274656978.jpg", price: 188.08, category: "perfume" },
    { id: "perfume-lancome-la-vie-est-belle-vanille-nude-set", label: "LANCOME LA VIE EST BELLE VANILLE NUDE EDP 50ML GIFT SET", image: "img/set-3614274714647.jpg", price: 193.27, category: "perfume" },
    { id: "perfume-lancome-renergie-triple-serum-20-set", label: "LANCOME RENERGIE TRIPLE SERUM 20ML GIFT SET", image: "img/set-3614274653403.jpg", price: 215.51, category: "perfume" },
    { id: "perfume-lancome-renergie-crx-triple-serum-50-set", label: "LANCOME RENERGIE C.R.X. TRIPLE SERUM 50ML GIFT SET", image: "img/set-3614274653410.jpg", price: 262.41, category: "perfume" },
    { id: "perfume-lancome-la-vie-est-belle-edp-100-set", label: "LANCOME LA VIE EST BELLE EDP 100ML GIFT SET", image: "img/set-3614274654141.jpg", price: 252.55, category: "perfume" },
    { id: "perfume-lancome-la-vie-est-belle-elixir-petit-theatre", label: "LANCOME LA VIE EST BELLE L'ELIXIR 50ML PETIT THEATRE", image: "img/set-3614274653373.jpg", price: 201.36, category: "perfume" },
    { id: "perfume-lancome-la-vie-est-belle-petit-theatre", label: "LANCOME LA VIE EST BELLE EDP 50ML PETIT THEATRE", image: "img/set-3614274653489.jpg", price: 173.04, category: "perfume" },
    { id: "perfume-lancome-renergie-hpn-300-peptide-50-set", label: "LANCOME RENERGIE H.P.N. 300-PEPTIDE CREAM 50ML GIFT SET", image: "img/set-3614274654318.jpg", price: 184.29, category: "perfume" },
    { id: "perfume-lancome-hypnose-drama-mascara-set", label: "LANCOME HYPNOSE DRAMA MASCARA GIFT SET", image: "img/set-3614274653557.jpg", price: 64.15, category: "perfume" },
    { id: "perfume-lancome-monsieur-big-set", label: "LANCOME MONSIEUR BIG MASCARA GIFT SET", image: "img/set-3614274653533.jpg", price: 63.09, category: "perfume" },
    { id: "perfume-biotherm-homme-aquafitness-set", label: "BIOTHERM HOMME AQUAFITNESS GIFT SET", image: "img/set-3614274679731.jpg", price: 73.82, category: "perfume" },
    { id: "perfume-biotherm-homme-force-supreme-reshaper-set", label: "BIOTHERM HOMME FORCE SUPREME RESHAPER GIFT SET", image: "img/set-3614274720297.jpg", price: 198.57, category: "perfume" },
    { id: "perfume-biotherm-deo-pure-duo-set", label: "BIOTHERM DEO PURE DUO GIFT SET", image: "img/set-3614274716337.jpg", price: 69.52, category: "perfume" },
    { id: "perfume-biotherm-aqua-drop-set", label: "BIOTHERM AQUA DROP GIFT SET", image: "img/set-3614274669602.jpg", price: 83.68, category: "perfume" },
    { id: "perfume-biotherm-homme-power-drop-set", label: "BIOTHERM HOMME POWER DROP GIFT SET", image: "img/set-3614274669619.jpg", price: 83.68, category: "perfume" },
    { id: "perfume-valentino-uomo-born-in-roma-edt-holiday-set", label: "VALENTINO UOMO BORN IN ROMA EDT HOLIDAY GIFT SET", image: "img/set-3614274680096.jpg", price: 145.99, category: "perfume" },
    { id: "perfume-valentino-donna-born-in-roma-intense-set", label: "VALENTINO DONNA BORN IN ROMA INTENSE EDP GIFT SET", image: "img/set-3614274680119.jpg", price: 209.95, category: "perfume" },
    { id: "perfume-valentino-donna-born-in-roma-edp-holiday-set", label: "VALENTINO DONNA BORN IN ROMA EDP HOLIDAY GIFT SET", image: "img/set-3614274680126.jpg", price: 192.0, category: "perfume" },
    { id: "perfume-valentino-uomo-born-in-roma-extradose-set", label: "VALENTINO UOMO BORN IN ROMA EXTRADOSE GIFT SET", image: "img/set-3614274692792.jpg", price: 171.52, category: "perfume" },
    { id: "perfume-valentino-donna-born-in-roma-extradose-set", label: "VALENTINO DONNA BORN IN ROMA EXTRADOSE GIFT SET", image: "img/set-3614274692808.jpg", price: 218.29, category: "perfume" },
    { id: "perfume-guess-seductive-edt", label: "GUESS SEDUCTIVE FOR WOMEN EDT", image: "img/guess-seductive-edt.jpg", price: 69.52, category: "perfume" },
    { id: "perfume-guess-seductive-noir-edt", label: "GUESS SEDUCTIVE NOIR FOR WOMEN EDT", image: "img/guess-seductive-noir-edt.jpg", price: 70.53, category: "perfume" },
    { id: "perfume-guess-seductive-red-edt", label: "GUESS SEDUCTIVE RED FOR WOMEN EDT", image: "img/guess-seductive-red-edt.jpg", price: 70.53, category: "perfume" },
    { id: "perfume-guess-seductive-red-mist", label: "GUESS SEDUCTIVE RED FRAGRANCE MIST 250ML", image: "img/guess-seductive-red-mist.jpg", price: 23.13, category: "perfume" },
    { id: "perfume-guess-iconic-edp", label: "GUESS ICONIC FOR WOMEN EDP", image: "img/guess-iconic-edp.jpg", price: 85.95, category: "perfume" },
    { id: "perfume-guess-iconic-men-edp", label: "GUESS ICONIC FOR MEN EDP", image: "img/guess-iconic-men-edp.jpg", price: 82.16, category: "perfume" },
    { id: "perfume-guess-bella-vita-edp", label: "GUESS BELLA VITA EDP", image: "img/guess-bella-vita-edp.jpg", price: 76.98, category: "perfume" },
    { id: "perfume-guess-bella-vita-mist", label: "GUESS BELLA VITA FRAGRANCE MIST 250ML", image: "img/guess-bella-vita-mist.jpg", price: 21.39, category: "perfume" },
    { id: "perfume-guess-bella-vita-rosa-edt", label: "GUESS BELLA VITA ROSA EDT", image: "img/guess-bella-vita-rosa-edt.jpg", price: 76.98, category: "perfume" },
    { id: "perfume-guess-bella-vita-rosa-mist", label: "GUESS BELLA VITA ROSA FRAGRANCE MIST 250ML", image: "img/guess-bella-vita-rosa-mist.jpg", price: 23.76, category: "perfume" },
    { id: "perfume-guess-bella-vita-paradiso-edp", label: "GUESS BELLA VITA PARADISO EDP", image: "img/guess-bella-vita-paradiso-edp.jpg", price: 102.64, category: "perfume" },
    { id: "perfume-guess-love-fragrance-mist", label: "GUESS LOVE FRAGRANCE MIST 250ML", image: "img/guess-love-romantic-blush-mist.jpg", price: 23.13, category: "perfume" },
    { id: "perfume-guess-sexy-skin-fragrance-mist", label: "GUESS SEXY SKIN FRAGRANCE MIST 250ML", image: "img/guess-sexy-skin-sweet-sugar-mist.jpg", price: 23.66, category: "perfume" },
    { id: "perfume-armani-prive-les-eaux-holiday-discovery-set", label: "ARMANI PRIVE LES EAUX HOLIDAY DISCOVERY SET 4 X 7.5ML", image: "img/set-3614274663617.jpg", price: 208.56, category: "perfume" },
    { id: "perfume-biotherm-homme-aquapower-essentials-set", label: "BIOTHERM HOMME AQUAPOWER ADVANCED GEL 75ML HOLIDAY SET", image: "img/set-3614274679717.jpg", price: 123.37, category: "perfume" },
    { id: "perfume-lancome-la-nuit-tresor-holiday-set", label: "LANCOME LA NUIT TRESOR EDP 30ML HOLIDAY GIFT SET", image: "img/set-3614274653434.jpg", price: 127.66, category: "perfume" },
    { id: "perfume-lancome-absolue-soft-cream-holiday-set", label: "LANCOME ABSOLUE LONGEVITY SOFT CREAM 60ML HOLIDAY SET", image: "img/set-3614274654295.jpg", price: 467.93, category: "perfume" },
    { id: "perfume-prada-luna-rossa-ocean-edt-set", label: "PRADA LUNA ROSSA OCEAN EDT 100ML GIFT SET", image: "img/set-3614274642087.jpg", price: 180.37, category: "perfume" },
    { id: "perfume-ysl-libre-berry-crush", label: "YVES SAINT LAURENT LIBRE BERRY CRUSH EDP", image: "img/ysl-libre-berry-crush.jpg", price: 206.16, category: "perfume" },
    { id: "perfume-lancome-lash-idole-curl-goddess", label: "LANCOME LASH IDOLE CURL GODDESS MASCARA 01 DIVINE BLACK", image: "img/lancome-lash-idole-curl-goddess.jpg", price: 45.74, category: "perfume" },
    { id: "perfume-guess-iconic-mist", label: "GUESS ICONIC FOR WOMEN FRAGRANCE MIST 250ML", image: "img/guess-iconic-mist.jpg", price: 25.94, category: "perfume" },
    { id: "perfume-guess-iconic-sublime-edp", label: "GUESS ICONIC SUBLIME EDP", image: "img/guess-iconic-sublime-edp.jpg", price: 85.95, category: "perfume" },
    { id: "perfume-guess-iconic-sublime-mist", label: "GUESS ICONIC SUBLIME FRAGRANCE MIST 250ML", image: "img/guess-iconic-sublime-mist.jpg", price: 25.94, category: "perfume" },
    { id: "perfume-guess-seductive-noir-homme-edt", label: "GUESS SEDUCTIVE HOMME NOIR EDT", image: "img/guess-seductive-noir-men-edt.jpg", price: 70.66, category: "perfume" },
    { id: "perfume-azzaro-forever-wanted-absolu", label: "AZZARO FOREVER WANTED ABSOLU PARFUM", image: "img/azzaro-forever-wanted-absolu.jpg", price: 118.94, category: "perfume" },
    { id: "perfume-mugler-alien-pulp", label: "MUGLER ALIEN PULP EDP", image: "img/mugler-alien-pulp.jpg", price: 100.87, category: "perfume" },
    { id: "perfume-armani-acqua-di-gio-edp-intense", label: "GIORGIO ARMANI ACQUA DI GIO EDP INTENSE", image: "img/armani-acqua-di-gio-edp-intense.jpg", price: 148.9, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-powerfully", label: "EMPORIO ARMANI STRONGER WITH YOU POWERFULLY EDP", image: "img/armani-stronger-with-you-powerfully.jpg", price: 138.41, category: "perfume" },
    { id: "perfume-lancome-goddess-dimension-eyeshadow", label: "LANCOME IDOLE GODDESS DIMENSION MONO EYESHADOW", image: "img/lancome-goddess-dimension-eyeshadow.jpg", price: 41.84, category: "perfume" },
    { id: "perfume-biotherm-aquasource-electrolyte-dewy-gel", label: "BIOTHERM AQUASOURCE+ ELECTROLYTE DEWY GEL 100H 100ML", image: "img/biotherm-aquasource-electrolyte-dewy-gel.jpg", price: 94.04, category: "perfume" },
    { id: "perfume-lancome-mascara-melter", label: "LANCOME MASCARA MELTER CARING MASCARA REMOVER", image: "img/lancome-mascara-melter.jpg", price: 65.35, category: "perfume" },
    { id: "perfume-lancome-o-juicy-hair-body-mist", label: "LANCOME O JUICY HAIR & BODY MIST 100ML", image: "img/lancome-o-zenith-mist.jpg", price: 41.84, category: "perfume" },
    { id: "perfume-lancome-idole-peach-n-roses", label: "LANCOME IDOLE PEACH 'N ROSES EDP", image: "img/lancome-idole-peach-n-roses.jpg", price: 114.9, category: "perfume" },
    { id: "perfume-miu-miu-edp", label: "MIU MIU EDP", image: "img/miu-miu-edp.jpg", price: 187.2, category: "perfume" },
    { id: "perfume-miu-miu-eau-bleue", label: "MIU MIU L'EAU BLEUE EDP", image: "img/miu-miu-eau-bleue.jpg", price: 187.32, category: "perfume" },
    { id: "perfume-miu-miu-eau-rosee", label: "MIU MIU L'EAU ROSEE EDT", image: "img/miu-miu-eau-rosee.jpg", price: 187.32, category: "perfume" },
    { id: "perfume-miu-miu-fleur-de-lait", label: "MIU MIU FLEUR DE LAIT EDP", image: "img/miu-miu-fleur-de-lait.jpg", price: 187.32, category: "perfume" },
    { id: "perfume-miu-miu-miutine", label: "MIU MIU MIUTINE EDP", image: "img/miu-miu-miutine.jpg", price: 187.32, category: "perfume" },
    { id: "perfume-lancome-renergie-nano-resurfacer-starter", label: "LANCOME RENERGIE NANO-RESURFACER 400 BOOSTER STARTER KIT", image: "img/lancome-renergie-nano-resurfacer-starter.jpg", price: 391.71, category: "perfume" },
    { id: "perfume-lancome-renergie-nano-resurfacer-refill", label: "LANCOME RENERGIE NANO-RESURFACER 400 BOOSTER REFILL", image: "img/lancome-renergie-nano-resurfacer-refill.jpg", price: 88.86, category: "perfume" },
    { id: "perfume-lancome-renergie-collagen-lift-xtend-cream", label: "LANCOME RENERGIE COLLAGEN+ LIFT-XTEND CREAM 50ML", image: "img/lancome-renergie-collagen-lift-xtend-cream.jpg", price: 164.57, category: "perfume" },
    { id: "perfume-lancome-renergie-yeux-lifting-20", label: "LANCOME RENERGIE YEUX LIFTING EYE CREAM 20ML", image: "img/lancome-renergie-yeux-20.jpg", price: 117.55, category: "perfume" },
    { id: "perfume-lancome-la-nuit-tresor-rouge-drama", label: "LANCOME LA NUIT TRESOR ROUGE DRAMA EDP INTENSE 50ML", image: "img/lancome-la-nuit-tresor-rouge-drama.jpg", price: 201.1, category: "perfume" },
    { id: "perfume-lancome-la-vie-est-belle-edp-30-body-lotion-set-s26", label: "LANCOME LA VIE EST BELLE EDP 30ML + BODY LOTION 50ML GIFT SET", image: "img/set-3614274787597.jpg", price: 128.04, category: "perfume" },
    { id: "perfume-prada-paradigme-edp-50-set-s26", label: "PRADA PARADIGME EDP 50ML + 10ML GIFT SET", image: "img/set-3614274793413.jpg", price: 160.02, category: "perfume" },
    { id: "perfume-prada-paradoxe-edp-30-set-s26", label: "PRADA PARADOXE EDP 30ML + 10ML GIFT SET", image: "img/set-3614274793376.jpg", price: 135.75, category: "perfume" },
    { id: "perfume-valentino-uomo-born-in-roma-intense-50-set-s26", label: "VALENTINO UOMO BORN IN ROMA INTENSE EDP 50ML + 10ML GIFT SET", image: "img/set-3614274786637.jpg", price: 163.81, category: "perfume" },
    { id: "perfume-ysl-myslf-edp-60-shower-gel-set-s26", label: "YVES SAINT LAURENT MYSLF EDP 60ML + SHOWER GEL 50ML GIFT SET", image: "img/set-3614274769692.jpg", price: 167.61, category: "perfume" },
    { id: "perfume-ysl-libre-edp-90-body-balm-set-s26", label: "YVES SAINT LAURENT LIBRE EDP 90ML + 10ML + BODY BALM 50ML GIFT SET", image: "img/set-3614274769739.jpg", price: 273.15, category: "perfume" },
    { id: "perfume-ysl-libre-edp-50-mirror-set-s26", label: "YVES SAINT LAURENT LIBRE EDP 50ML + 10ML + MIRROR GIFT SET", image: "img/set-3614274776522.jpg", price: 203.63, category: "perfume" },
    { id: "perfume-ysl-libre-edp-30-set-s26", label: "YVES SAINT LAURENT LIBRE EDP 30ML + 10ML GIFT SET", image: "img/set-3614274769586.jpg", price: 144.35, category: "perfume" },
    { id: "perfume-ysl-libre-edp-50-candy-glaze-set-s26", label: "YVES SAINT LAURENT LIBRE EDP 50ML + 10ML + CANDY GLAZE 15 GIFT SET", image: "img/set-3614274769746.jpg", price: 275.8, category: "perfume" },
    { id: "perfume-armani-prive-orange-mediterranee", label: "ARMANI PRIVE ORANGE MEDITERRANEE EDT", image: "img/armani-prive-orange-mediterranee.jpg", price: 241.17, category: "perfume" },
    { id: "perfume-armani-prive-oud-nacre", label: "ARMANI PRIVE OUD NACRE EDP", image: "img/armani-prive-oud-nacre.jpg", price: 389.94, category: "perfume" },
    { id: "perfume-armani-si-nude-bloom", label: "ARMANI SI NUDE BLOOM EDP 50ML", image: "img/armani-si-nude-bloom.jpg", price: 195.92, category: "perfume" },
    { id: "perfume-armani-si-passione-red-bloom", label: "ARMANI SI PASSIONE RED BLOOM EDP 50ML", image: "img/armani-si-passione-red-bloom.jpg", price: 195.92, category: "perfume" },
    { id: "perfume-ysl-y-iced-cologne", label: "YVES SAINT LAURENT Y ICED COLOGNE EDT INTENSE", image: "img/ysl-y-iced-cologne.jpg", price: 147.0, category: "perfume" },
    { id: "perfume-ysl-lash-latex", label: "YVES SAINT LAURENT LASH LATEX MASCARA", image: "img/ysl-lash-latex.jpg", price: 48.75, category: "perfume" },
    { id: "perfume-ysl-lovenude-kiss-shaper", label: "YVES SAINT LAURENT LOVENUDE KISS SHAPER LIP LINER", image: "img/ysl-lovenude-kiss-shaper.jpg", price: 49.04, category: "perfume" },
    { id: "perfume-ysl-lovenude-lip-blusher", label: "YVES SAINT LAURENT LOVENUDE LIP BLUSHER BALM", image: "img/ysl-lovenude-lip-blusher.jpg", price: 72.81, category: "perfume" },
    { id: "perfume-guess-iconic-blue-men-edp", label: "GUESS ICONIC BLUE FOR MEN EDP", image: "img/guess-iconic-blue-men-edp.jpg", price: 83.42, category: "perfume" },
    { id: "perfume-guess-seductive-desire-men-edt", label: "GUESS SEDUCTIVE DESIRE FOR MEN EDT", image: "img/guess-seductive-desire-men-edt.jpg", price: 70.53, category: "perfume" },
    { id: "perfume-guess-seductive-desire-women-edt", label: "GUESS SEDUCTIVE DESIRE FOR WOMEN EDT", image: "img/guess-seductive-desire-women-edt.jpg", price: 70.53, category: "perfume" },
    { id: "perfume-guess-seductive-desire-women-mist", label: "GUESS SEDUCTIVE DESIRE FOR WOMEN FRAGRANCE MIST 250ML", image: "img/guess-seductive-desire-women-mist.jpg", price: 20.82, category: "perfume" },
    { id: "perfume-cavalli-florence", label: "ROBERTO CAVALLI FLORENCE EDP", image: "img/cavalli-florence.jpg", price: 83.42, category: "perfume" },
    { id: "perfume-cavalli-paradiso-assoluto", label: "ROBERTO CAVALLI PARADISO ASSOLUTO EDP", image: "img/cavalli-paradiso-assoluto.jpg", price: 83.42, category: "perfume" },
    { id: "perfume-cavalli-paradiso-azzurro", label: "ROBERTO CAVALLI PARADISO AZZURRO EDP 75ML", image: "img/cavalli-paradiso-azzurro.jpg", price: 98.84, category: "perfume" },
    { id: "perfume-just-cavalli-wild-blue-him", label: "JUST CAVALLI WILD BLUE FOR HIM EDT", image: "img/just-cavalli-wild-blue-him.jpg", price: 36.02, category: "perfume" },
    { id: "perfume-just-cavalli-wild-pink-her", label: "JUST CAVALLI WILD PINK FOR HER EDP", image: "img/just-cavalli-wild-pink-her.jpg", price: 35.9, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-spices", label: "EMPORIO ARMANI STRONGER WITH YOU SPICES EDP 100ML", image: "img/armani-stronger-with-you-spices.jpg", price: 180.25, category: "perfume" },
    { id: "perfume-armani-my-way-sunny-vanilla", label: "ARMANI MY WAY SUNNY VANILLA EDP", image: "img/armani-my-way-sunny-vanilla.jpg", price: 131.2, category: "perfume" },
    { id: "perfume-prada-paradoxe-hand-cream", label: "PRADA PARADOXE HAND CREAM 50ML", image: "img/prada-paradoxe-hand-cream.jpg", price: 75.46, category: "perfume" },
    { id: "perfume-prada-luna-rossa-ocean-le-parfum-set", label: "PRADA LUNA ROSSA OCEAN LE PARFUM 50ML + 10ML GIFT SET", image: "img/set-3614274423761.jpg", price: 181.76, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-edt-valentines-set", label: "ARMANI EMPORIO STRONGER WITH YOU EDT 100ML + 15ML GIFT SET", image: "img/set-3614274821703.jpg", price: 167.1, category: "perfume" },
    { id: "perfume-armani-stronger-with-you-intensely-valentines-set", label: "ARMANI EMPORIO STRONGER WITH YOU INTENSELY EDP 100ML + 15ML GIFT SET", image: "img/set-3614274822052.jpg", price: 195.92, category: "perfume" },
    { id: "perfume-prada-paradigme-edp-30-set", label: "PRADA PARADIGME EDP 30ML + 10ML GIFT SET", image: "img/set-3614274799408.jpg", price: 130.95, category: "perfume" },
    { id: "perfume-ysl-lash-clash-loveshine-set-s26", label: "YVES SAINT LAURENT LASH CLASH MASCARA + LOVESHINE 44 GIFT SET", image: "img/set-3614274769661.jpg", price: 79.37, category: "perfume" },
    { id: "perfume-ysl-myslf-edp-100-set-s26", label: "YVES SAINT LAURENT MYSLF EDP 100ML + 10ML GIFT SET", image: "img/set-3614274769616.jpg", price: 221.71, category: "perfume" },
    { id: "perfume-ysl-lash-clash-libre-set-s26", label: "YVES SAINT LAURENT LASH CLASH MASCARA + LIBRE EDP 10ML GIFT SET", image: "img/set-3614274769678.jpg", price: 50.96, category: "perfume" },
    { id: "perfume-lancome-tiuw-shape-stick", label: "LANCOME TEINT IDOLE ULTRA WEAR SHAPE STICK FOUNDATION", image: "img/lancome-tiuw-shape-stick.jpg", price: 85.57, category: "perfume" },
    { id: "perfume-lancome-tiuw-shape-stick-blush", label: "LANCOME TEINT IDOLE SHAPE STICK BLUSH", image: "img/lancome-tiuw-shape-stick-blush.jpg", price: 81.28, category: "perfume" },
    { id: "perfume-lancome-tiuw-shape-stick-highlighter", label: "LANCOME TEINT IDOLE SHAPE STICK HIGHLIGHTER 01 FLEXING LAVENDER", image: "img/lancome-tiuw-shape-stick-highlighter.jpg", price: 81.28, category: "perfume" },
    { id: "perfume-lancome-lip-idole-cuddle-blur", label: "LANCOME LIP IDOLE CUDDLEBLUR LIP VELVET", image: "img/lancome-lip-idole-cuddle-blur.jpg", price: 64.21, category: "perfume" },
    { id: "perfume-margiela-replica-chasing-sunsets", label: "MAISON MARGIELA REPLICA CHASING SUNSETS EDT 100ML", image: "img/margiela-replica-chasing-sunsets.jpg", price: 192.25, category: "perfume" },
    { id: "perfume-margiela-replica-up-at-dawn", label: "MAISON MARGIELA REPLICA UP AT DAWN EDT", image: "img/margiela-replica-up-at-dawn.jpg", price: 100.61, category: "perfume" },
    { id: "perfume-mugler-angel-blush", label: "MUGLER ANGEL BLUSH EDP", image: "img/mugler-angel-blush.jpg", price: 171.15, category: "perfume" },
    { id: "perfume-ralph-lauren-polo-67-extreme", label: "RALPH LAUREN POLO 67 EDP EXTREME", image: "img/ralph-lauren-polo-67-extreme.jpg", price: 90.0, category: "perfume" },
    { id: "perfume-ralph-lauren-polo-red-extreme-edp", label: "RALPH LAUREN POLO RED EDP EXTREME", image: "img/ralph-lauren-polo-red-extreme.jpg", price: 90.0, category: "perfume" },
    { id: "perfume-prada-luna-rossa-carbon-edp", label: "PRADA LUNA ROSSA CARBON EDP", image: "img/prada-luna-rossa-carbon-edp.jpg", price: 135.75, category: "perfume" },
    { id: "perfume-lancome-absolue-longevity-md-anticipate-cream", label: "LANCOME ABSOLUE LONGEVITY MD ANTICIPATE THE CREAM 50ML", image: "img/lancome-absolue-longevity-md-anticipate-cream.jpg", price: 227.14, category: "perfume" },
    { id: "perfume-lancome-absolue-longevity-md-intercept-cream", label: "LANCOME ABSOLUE LONGEVITY MD INTERCEPT THE CREAM 50ML", image: "img/lancome-absolue-longevity-md-intercept-cream.jpg", price: 227.14, category: "perfume" },
    { id: "perfume-lancome-absolue-longevity-md-intercept-serum", label: "LANCOME ABSOLUE LONGEVITY MD INTERCEPT THE SERUM 50ML", image: "img/lancome-absolue-longevity-md-intercept-serum.jpg", price: 263.8, category: "perfume" },
    { id: "perfume-lancome-absolue-longevity-md-reset-cream", label: "LANCOME ABSOLUE LONGEVITY MD RESET THE CREAM 50ML", image: "img/lancome-absolue-longevity-md-reset-cream.jpg", price: 227.14, category: "perfume" },
    { id: "perfume-lancome-absolue-longevity-md-reset-serum", label: "LANCOME ABSOLUE LONGEVITY MD RESET THE SERUM 50ML", image: "img/lancome-absolue-longevity-md-reset-serum.jpg", price: 263.8, category: "perfume" },
    { id: "perfume-lancome-lveb-hair-body-mist", label: "LANCOME LA VIE EST BELLE HAIR & BODY MIST 100ML", image: "img/lancome-lveb-elixir-mist.jpg", price: 55.36, category: "perfume" },
    { id: "perfume-armani-si-passione-intense-set", label: "ARMANI SI PASSIONE INTENSE EDP 50ML + 7ML GIFT SET", image: "img/set-3614274692723.jpg", price: 208.94, category: "perfume" },
    { id: "perfume-nishane-ani-x", label: "NISHANE ANI X EXTRAIT DE PARFUM", image: "img/nishane-ani-x.jpg", price: 305.89, category: "perfume" },
    { id: "perfume-nishane-fan-your-flames-x", label: "NISHANE FAN YOUR FLAMES X EXTRAIT DE PARFUM 50ML", image: "img/nishane-fan-your-flames-x.jpg", price: 305.89, category: "perfume" },
    { id: "perfume-nishane-hacivat-x", label: "NISHANE HACIVAT X EXTRAIT DE PARFUM", image: "img/nishane-hacivat-x.jpg", price: 318.78, category: "perfume" },
    { id: "perfume-nishane-hacivat", label: "NISHANE HACIVAT EXTRAIT DE PARFUM 100ML", image: "img/nishane-hacivat.jpg", price: 448.85, category: "perfume" },
    { id: "perfume-nishane-hundred-silent-ways", label: "NISHANE HUNDRED SILENT WAYS EXTRAIT DE PARFUM", image: "img/nishane-hundred-silent-ways.jpg", price: 292.87, category: "perfume" },
    { id: "perfume-nishane-zenne", label: "NISHANE ZENNE EXTRAIT DE PARFUM 50ML", image: "img/nishane-zenne.jpg", price: 318.78, category: "perfume" },
    { id: "perfume-nishane-ani", label: "NISHANE ANI EXTRAIT DE PARFUM 50ML", image: "img/nishane-ani.jpg", price: 292.87, category: "perfume" },
    { id: "perfume-nishane-ege", label: "NISHANE EGE EXTRAIT DE PARFUM 50ML", image: "img/nishane-ege.jpg", price: 292.87, category: "perfume" },
    { id: "perfume-nishane-tempfluo", label: "NISHANE TEMPFLUO EXTRAIT DE PARFUM 50ML", image: "img/nishane-tempfluo.jpg", price: 305.89, category: "perfume" },
    { id: "perfume-nishane-wulong-cha", label: "NISHANE WULONG CHA EXTRAIT DE PARFUM 50ML", image: "img/nishane-wulong-cha.jpg", price: 258.99, category: "perfume" },
    { id: "perfume-mancera-wild-fruits", label: "MANCERA WILD FRUITS EDP", image: "img/mancera-wilde-fruits.jpg", price: 107.44, category: "perfume" },
    { id: "perfume-mancera-aoud-blue-notes", label: "MANCERA AOUD BLUE NOTES EDP 120ML", image: "img/mancera-aoud-blue-notes.jpg", price: 183.28, category: "perfume" },
    { id: "perfume-mancera-lemon-line", label: "MANCERA LEMON LINE EDP 60ML", image: "img/mancera-lemon-line.jpg", price: 93.26, category: "perfume" },
    { id: "perfume-mancera-amore-caffe", label: "MANCERA AMORE CAFFE EDP 120ML", image: "img/mancera-amore-caffe.jpg", price: 182.65, category: "perfume" },
    { id: "perfume-mancera-french-riviera", label: "MANCERA FRENCH RIVIERA EDP 120ML", image: "img/mancera-french-riviera.jpg", price: 195.92, category: "perfume" },
    { id: "perfume-mancera-cherry-cherry", label: "MANCERA CHERRY CHERRY EDP", image: "img/mancera-cherry-cherry.jpg", price: 126.4, category: "perfume" },
    { id: "perfume-mancera-fig-me-up", label: "MANCERA FIG ME UP EDP", image: "img/mancera-fig-me-up.jpg", price: 120.33, category: "perfume" },
    { id: "perfume-mancera-amberful", label: "MANCERA AMBERFUL EDP", image: "img/mancera-amberful.jpg", price: 133.23, category: "perfume" },
    { id: "perfume-mancera-cinque-terre", label: "MANCERA CINQUE TERRE EDP", image: "img/mancera-cinque-terre.jpg", price: 120.33, category: "perfume" },
    { id: "perfume-mancera-eternal-wood", label: "MANCERA ETERNAL WOOD EDP", image: "img/mancera-eternal-wood.jpg", price: 120.33, category: "perfume" },
    { id: "perfume-mancera-intense-red-tobacco", label: "MANCERA INTENSE RED TOBACCO", image: "img/mancera-intense-red-tobacco.jpg", price: 159.01, category: "perfume" },
    { id: "perfume-mancera-tonka-cola", label: "MANCERA TONKA COLA EDP", image: "img/mancera-tonka-cola.jpg", price: 120.08, category: "perfume" },
    { id: "perfume-montale-day-dreams", label: "MONTALE DAY DREAMS EDP", image: "img/montale-day-dreams.jpg", price: 189.09, category: "perfume" },
    { id: "perfume-montale-bubble-forever", label: "MONTALE BUBBLE FOREVER EDP", image: "img/montale-bubble-forever.jpg", price: 146.12, category: "perfume" },
    { id: "perfume-montale-crazy-in-love", label: "MONTALE CRAZY IN LOVE EDP", image: "img/montale-crazy-in-love.jpg", price: 139.67, category: "perfume" },
    { id: "perfume-montale-arabians-musk", label: "MONTALE ARABIANS MUSK EDP", image: "img/montale-arabians-musk.jpg", price: 146.12, category: "perfume" },
    { id: "perfume-montale-arabians", label: "MONTALE ARABIANS EDP 100ML", image: "img/montale-arabians.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-xerjoff-erba-gold", label: "XERJOFF ERBA GOLD EDP", image: "img/xerjoff-erba-gold.jpg", price: 393.23, category: "perfume" },
    { id: "perfume-xerjoff-erba-pura", label: "XERJOFF ERBA PURA EDP", image: "img/xerjoff-erba-pura.jpg", price: 327.38, category: "perfume" },
    { id: "perfume-xerjoff-accento-overdose", label: "XERJOFF ACCENTO OVERDOSE EDP 100ML", image: "img/xerjoff-accento-overdose.jpg", price: 417.12, category: "perfume" },
    { id: "perfume-xerjoff-accento", label: "XERJOFF ACCENTO EDP 100ML", image: "img/xerjoff-accento.jpg", price: 372.88, category: "perfume" },
    { id: "perfume-xerjoff-purple-accento", label: "XERJOFF PURPLE ACCENTO EDP 100ML", image: "img/xerjoff-purple-accento.jpg", price: 354.55, category: "perfume" },
    { id: "perfume-xerjoff-opera", label: "XERJOFF OPERA EDP 100ML", image: "img/xerjoff-opera.jpg", price: 417.12, category: "perfume" },
    { id: "perfume-xerjoff-torino21", label: "XERJOFF TORINO21 EDP", image: "img/xerjoff-torino21.jpg", price: 385.52, category: "perfume" },
    { id: "perfume-xerjoff-alexandria-ii", label: "XERJOFF ALEXANDRIA II PARFUM", image: "img/xerjoff-alexandria-ii.jpg", price: 417.12, category: "perfume" },
    { id: "perfume-xerjoff-alexandria-ii-anniversary", label: "XERJOFF ALEXANDRIA II ANNIVERSARY PARFUM 100ML", image: "img/xerjoff-alexandria-ii-anniversary.jpg", price: 733.12, category: "perfume" },
    { id: "perfume-xerjoff-coro", label: "XERJOFF CORO EDP 100ML", image: "img/xerjoff-coro.jpg", price: 391.97, category: "perfume" },
    { id: "perfume-xerjoff-neorio", label: "XERJOFF X DURAN DURAN NEORIO PARFUM 50ML", image: "img/xerjoff-neorio-orange.jpg", price: 397.53, category: "perfume" },
    { id: "perfume-xerjoff-black-moonlight", label: "XERJOFF X DURAN DURAN BLACK MOONLIGHT PARFUM 50ML", image: "img/xerjoff-black-moonlight.jpg", price: 398.16, category: "perfume" },
    { id: "perfume-tiziana-terenzi-kirke-overdose", label: "TIZIANA TERENZI KIRKE OVERDOSE EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-kirke-overdose.jpg", price: 442.4, category: "perfume" },
    { id: "perfume-btso-dirty-heaven", label: "BORNTOSTANDOUT DIRTY HEAVEN EDP 50ML", image: "img/btso-dirty-heaven.jpg", price: 247.24, category: "perfume" },
    { id: "perfume-btso-dirty-rice", label: "BORNTOSTANDOUT DIRTY RICE EDP 50ML", image: "img/btso-dirty-rice.jpg", price: 247.24, category: "perfume" },
    { id: "perfume-btso-angels-powder", label: "BORNTOSTANDOUT ANGELS' POWDER EDP 50ML", image: "img/btso-angels-powder.jpg", price: 247.24, category: "perfume" },
    { id: "perfume-btso-filthy-musk", label: "BORNTOSTANDOUT FILTHY MUSK EDP 50ML", image: "img/btso-filthy-musk.jpg", price: 247.24, category: "perfume" },
    { id: "perfume-btso-fig-porn", label: "BORNTOSTANDOUT FIG PORN EDP 50ML", image: "img/btso-fig-porn.jpg", price: 247.24, category: "perfume" },
    { id: "perfume-btso-indecent-cherry", label: "BORNTOSTANDOUT INDECENT CHERRY EDP 50ML", image: "img/btso-indecent-cherry.jpg", price: 253.81, category: "perfume" },
    { id: "perfume-btso-mud", label: "BORNTOSTANDOUT MUD EDP 50ML", image: "img/btso-mud.jpg", price: 247.24, category: "perfume" },
    { id: "perfume-btso-nanatopia", label: "BORNTOSTANDOUT NANATOPIA EDP 50ML", image: "img/btso-nanatopia.jpg", price: 253.81, category: "perfume" },
    { id: "perfume-btso-black-mango", label: "BORNTOSTANDOUT BLACK MANGO EXTRAIT EXTREME 50ML", image: "img/btso-black-mango.jpg", price: 357.84, category: "perfume" },
    { id: "perfume-btso-oud-candy", label: "BORNTOSTANDOUT OUD CANDY EXTRAIT EXTREME 50ML", image: "img/btso-oud-candy.jpg", price: 357.84, category: "perfume" },
    { id: "perfume-btso-black-guava", label: "BORNTOSTANDOUT BLACK GUAVA EXTRAIT EXTREME 50ML", image: "img/btso-black-guava.jpg", price: 357.84, category: "perfume" },
    { id: "perfume-btso-drunk-lovers-cream", label: "BORNTOSTANDOUT DRUNK LOVERS HAND & BODY CREAM 350ML", image: "img/btso-drunk-lovers-cream.jpg", price: 71.67, category: "perfume" },
    { id: "perfume-btso-drunk-lovers-wash", label: "BORNTOSTANDOUT DRUNK LOVERS HAND & BODY WASH 350ML", image: "img/btso-drunk-lovers-wash.jpg", price: 67.75, category: "perfume" },
    { id: "perfume-jhag-ego-stratis", label: "JULIETTE HAS A GUN EGO STRATIS EDP", image: "img/jhag-ego-stratis.jpg", price: 176.96, category: "perfume" },
    { id: "perfume-jhag-lust-for-sun", label: "JULIETTE HAS A GUN LUST FOR SUN EDP", image: "img/jhag-lust-for-sun.jpg", price: 176.96, category: "perfume" },
    { id: "perfume-jhag-ode-to-dullness", label: "JULIETTE HAS A GUN ODE TO DULLNESS EDP 50ML", image: "img/jhag-ode-to-dullness.jpg", price: 132.72, category: "perfume" },
    { id: "perfume-mancera-instant-crush", label: "MANCERA INSTANT CRUSH EDP", image: "img/mancera-instant-crush.jpg", price: 126.4, category: "perfume" },
    { id: "perfume-mancera-jardin-exclusif", label: "MANCERA JARDIN EXCLUSIF EDP", image: "img/mancera-jardin-exclusif.jpg", price: 195.92, category: "perfume" },
    { id: "perfume-mancera-red-tobacco", label: "MANCERA RED TOBACCO EDP", image: "img/mancera-red-tobacco.jpg", price: 139.04, category: "perfume" },
    { id: "perfume-mancera-holidays", label: "MANCERA HOLIDAYS EDP", image: "img/mancera-holidays.jpg", price: 107.44, category: "perfume" },
    { id: "perfume-mancera-intense-cedrat-boise", label: "MANCERA INTENSE CEDRAT BOISE", image: "img/mancera-intense-cedrat-boise.jpg", price: 201.99, category: "perfume" },
    { id: "perfume-montale-dark-vanilla", label: "MONTALE DARK VANILLA EDP 100ML", image: "img/montale-dark-vanilla.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-xerjoff-40-knots", label: "XERJOFF JTC 40 KNOTS EDP 100ML", image: "img/xerjoff-40-knots.jpg", price: 385.52, category: "perfume" },
    { id: "perfume-xerjoff-don", label: "XERJOFF JTC DON EDP", image: "img/xerjoff-don.jpg", price: 385.52, category: "perfume" },
    { id: "perfume-xerjoff-comandante", label: "XERJOFF JTC COMANDANTE! EDP 100ML", image: "img/xerjoff-comandante.jpg", price: 341.66, category: "perfume" },
    { id: "perfume-xerjoff-more-than-words", label: "XERJOFF JTC MORE THAN WORDS EDP", image: "img/xerjoff-more-than-words.jpg", price: 385.52, category: "perfume" },
    { id: "perfume-xerjoff-decas", label: "XERJOFF 1861 DECAS EDP 100ML", image: "img/xerjoff-decas.jpg", price: 322.32, category: "perfume" },
    { id: "perfume-xerjoff-naxos", label: "XERJOFF 1861 NAXOS EDP 100ML", image: "img/xerjoff-naxos.jpg", price: 322.32, category: "perfume" },
    { id: "perfume-xerjoff-renaissance", label: "XERJOFF 1861 RENAISSANCE EDP 100ML", image: "img/xerjoff-renaissance.jpg", price: 322.32, category: "perfume" },
    { id: "perfume-xerjoff-la-capitale", label: "XERJOFF LA CAPITALE PARFUM 50ML", image: "img/xerjoff-la-capitale.jpg", price: 309.68, category: "perfume" },
    { id: "perfume-xerjoff-nio", label: "XERJOFF NIO PARFUM 50ML", image: "img/xerjoff-nio.jpg", price: 207.93, category: "perfume" },
    { id: "perfume-xerjoff-golden-dallah", label: "XERJOFF GOLDEN DALLAH PARFUM 50ML", image: "img/xerjoff-golden-dallah.jpg", price: 316.13, category: "perfume" },
    { id: "perfume-tiziana-terenzi-nero-oudh", label: "TIZIANA TERENZI NERO OUDH EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-nero-oudh.jpg", price: 423.44, category: "perfume" },
    { id: "perfume-tiziana-terenzi-delox", label: "TIZIANA TERENZI DELOX EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-delox.jpg", price: 271.76, category: "perfume" },
    { id: "perfume-tiziana-terenzi-dionisio", label: "TIZIANA TERENZI DIONISIO EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-dionisio.jpg", price: 537.2, category: "perfume" },
    { id: "perfume-tiziana-terenzi-leo", label: "TIZIANA TERENZI LEO EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-leo.jpg", price: 366.56, category: "perfume" },
    { id: "perfume-tiziana-terenzi-libra", label: "TIZIANA TERENZI LIBRA EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-libra.jpg", price: 379.33, category: "perfume" },
    { id: "perfume-bond-no9-gold-coast", label: "BOND NO. 9 GOLD COAST EDP 100ML", image: "img/bond-no9-gold-coast.jpg", price: 417.12, category: "perfume" },
    { id: "perfume-jhag-lili-fantasy", label: "JULIETTE HAS A GUN LILI FANTASY EDP 100ML", image: "img/jhag-lili-fantasy.jpg", price: 176.96, category: "perfume" },
    { id: "perfume-jhag-magnolia-bliss", label: "JULIETTE HAS A GUN MAGNOLIA BLISS EDP", image: "img/jhag-magnolia-bliss.jpg", price: 176.96, category: "perfume" },
    { id: "perfume-mancera-aoud-vanille", label: "MANCERA AOUD VANILLE EDP", image: "img/mancera-aoud-vanille.jpg", price: 182.65, category: "perfume" },
    { id: "perfume-mancera-cedrat-boise", label: "MANCERA CEDRAT BOISE EDP", image: "img/mancera-cedrat-boise.jpg", price: 170.64, category: "perfume" },
    { id: "perfume-mancera-choco-violet", label: "MANCERA CHOCO VIOLET EDP", image: "img/mancera-choco-violet.jpg", price: 170.64, category: "perfume" },
    { id: "perfume-mancera-gold-prestigium", label: "MANCERA GOLD PRESTIGIUM EDP", image: "img/mancera-gold-prestigium.jpg", price: 214.88, category: "perfume" },
    { id: "perfume-mancera-gold-intensive-aoud", label: "MANCERA GOLD INTENSIVE AOUD EDP 60ML", image: "img/mancera-gold-intensive-aoud.jpg", price: 113.76, category: "perfume" },
    { id: "perfume-mancera-roses-greedy", label: "MANCERA ROSES GREEDY EDP", image: "img/mancera-roses-greedy.jpg", price: 195.92, category: "perfume" },
    { id: "perfume-mancera-roses-vanille", label: "MANCERA ROSES VANILLE EDP", image: "img/mancera-roses-vanille.jpg", price: 170.64, category: "perfume" },
    { id: "perfume-mancera-velvet-vanilla", label: "MANCERA VELVET VANILLA EDP 60ML", image: "img/mancera-velvet-vanilla.jpg", price: 126.4, category: "perfume" },
    { id: "perfume-mancera-wind-wood", label: "MANCERA WIND WOOD EDP 120ML", image: "img/mancera-wind-wood.jpg", price: 169.76, category: "perfume" },
    { id: "perfume-mancera-black-line", label: "MANCERA BLACK LINE EDP 60ML", image: "img/mancera-black-line.jpg", price: 139.04, category: "perfume" },
    { id: "perfume-mancera-black-gold", label: "MANCERA BLACK GOLD EDP 60ML", image: "img/mancera-black-gold.jpg", price: 118.83, category: "perfume" },
    { id: "perfume-mancera-aoud-lemon-mint", label: "MANCERA AOUD LEMON MINT EDP 60ML", image: "img/mancera-aoud-lemon-mint.jpg", price: 126.78, category: "perfume" },
    { id: "perfume-montale-aoud-lime", label: "MONTALE AOUD LIME EDP 100ML", image: "img/montale-aoud-lime.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-aoud-night", label: "MONTALE AOUD NIGHT EDP 100ML", image: "img/montale-aoud-night.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-black-aoud", label: "MONTALE BLACK AOUD EDP", image: "img/montale-black-aoud.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-black-aoud-intense", label: "MONTALE BLACK AOUD INTENSE EDP 100ML", image: "img/montale-black-aoud-intense.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-chocolate-greedy", label: "MONTALE CHOCOLATE GREEDY EDP", image: "img/montale-chocolate-greedy.jpg", price: 164.32, category: "perfume" },
    { id: "perfume-montale-dark-purple", label: "MONTALE DARK PURPLE EDP 100ML", image: "img/montale-dark-purple.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-intense-pepper", label: "MONTALE INTENSE PEPPER EDP", image: "img/montale-intense-pepper.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-intense-cafe", label: "MONTALE INTENSE CAFE EDP", image: "img/montale-intense-cafe.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-intense-roses-musk", label: "MONTALE INTENSE ROSES MUSK EXTRAIT DE PARFUM", image: "img/montale-intense-roses-musk.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-intense-tiare", label: "MONTALE INTENSE TIARE EDP 100ML", image: "img/montale-intense-tiare.jpg", price: 164.32, category: "perfume" },
    { id: "perfume-montale-oudmazing", label: "MONTALE OUDMAZING EDP", image: "img/montale-oudmazing.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-rose-elixir", label: "MONTALE ROSE ELIXIR EDP", image: "img/montale-rose-elixir.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-santal-wood", label: "MONTALE SANTAL WOOD EDP 100ML", image: "img/montale-santal-wood.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-soleil-de-capri", label: "MONTALE SOLEIL DE CAPRI EDP", image: "img/montale-soleil-de-capri.jpg", price: 164.32, category: "perfume" },
    { id: "perfume-montale-starry-nights", label: "MONTALE STARRY NIGHTS EDP", image: "img/montale-starry-nights.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-sweet-vanilla", label: "MONTALE SWEET VANILLA EDP", image: "img/montale-sweet-vanilla.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-vanilla-extasy", label: "MONTALE VANILLA EXTASY EDP 100ML", image: "img/montale-vanilla-extasy.jpg", price: 164.32, category: "perfume" },
    { id: "perfume-montale-vanille-absolu", label: "MONTALE VANILLE ABSOLU EDP", image: "img/montale-vanille-absolu.jpg", price: 164.32, category: "perfume" },
    { id: "perfume-montale-white-musk", label: "MONTALE WHITE MUSK EDP 100ML", image: "img/montale-white-musk.jpg", price: 115.02, category: "perfume" },
    { id: "perfume-montale-wood-spices", label: "MONTALE WOOD & SPICES EDP", image: "img/montale-wood-spices.jpg", price: 164.32, category: "perfume" },
    { id: "perfume-montale-sweet-peony", label: "MONTALE SWEET PEONY EDP", image: "img/montale-sweet-peony.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-oud-dream", label: "MONTALE OUD DREAM EDP", image: "img/montale-oud-dream.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-sensual-instinct", label: "MONTALE SENSUAL INSTINCT EDP", image: "img/montale-sensual-instinct.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-arabians-tonka", label: "MONTALE ARABIANS TONKA EDP 100ML", image: "img/montale-arabians-tonka.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-montale-oud-tobacco", label: "MONTALE OUD TOBACCO EDP", image: "img/montale-oud-tobacco.jpg", price: 189.6, category: "perfume" },
    { id: "perfume-tiziana-terenzi-ursa", label: "TIZIANA TERENZI URSA EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-ursa.jpg", price: 366.56, category: "perfume" },
    { id: "perfume-tiziana-terenzi-al-contrario", label: "TIZIANA TERENZI AL CONTRARIO EXTRAIT DE PARFUM 50ML", image: "img/tiziana-terenzi-al-contrario.jpg", price: 97.33, category: "perfume" },
    { id: "perfume-tiziana-terenzi-cassiopea", label: "TIZIANA TERENZI CASSIOPEA EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-cassiopea.jpg", price: 379.33, category: "perfume" },
    { id: "perfume-tiziana-terenzi-draco", label: "TIZIANA TERENZI DRACO EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-draco.jpg", price: 379.33, category: "perfume" },
    { id: "perfume-tiziana-terenzi-orion", label: "TIZIANA TERENZI ORION EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-orion.jpg", price: 379.33, category: "perfume" },
    { id: "perfume-tiziana-terenzi-andromeda", label: "TIZIANA TERENZI ANDROMEDA EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-andromeda.jpg", price: 379.33, category: "perfume" },
    { id: "perfume-tiziana-terenzi-andromeda-body-lotion", label: "TIZIANA TERENZI ANDROMEDA BODY LOTION 250ML", image: "img/tiziana-terenzi-andromeda-body-lotion.jpg", price: 132.72, category: "perfume" },
    { id: "perfume-tiziana-terenzi-kirke", label: "TIZIANA TERENZI KIRKE EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-kirke.jpg", price: 271.76, category: "perfume" },
    { id: "perfume-tiziana-terenzi-borea", label: "TIZIANA TERENZI BOREA EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-borea.jpg", price: 271.76, category: "perfume" },
    { id: "perfume-tiziana-terenzi-spirito-fiorentino", label: "TIZIANA TERENZI SPIRITO FIORENTINO EXTRAIT DE PARFUM 100ML", image: "img/tiziana-terenzi-spirito-fiorentino.jpg", price: 423.44, category: "perfume" },
    { id: "perfume-xerjoff-casamorati-regio", label: "XERJOFF CASAMORATI REGIO EDP 100ML", image: "img/xerjoff-casamorati-regio.jpg", price: 341.66, category: "perfume" },
    { id: "perfume-xerjoff-casamorati-bouquet-ideale", label: "XERJOFF CASAMORATI BOUQUET IDEALE EDP", image: "img/xerjoff-casamorati-bouquet-ideale.jpg", price: 341.66, category: "perfume" },
    { id: "perfume-xerjoff-casamorati-1888", label: "XERJOFF CASAMORATI 1888 EDP 100ML", image: "img/xerjoff-casamorati-1888.jpg", price: 341.28, category: "perfume" },
    { id: "perfume-xerjoff-casamorati-dama-bianca", label: "XERJOFF CASAMORATI DAMA BIANCA EDP", image: "img/xerjoff-casamorati-dama-bianca.jpg", price: 341.28, category: "perfume" },
    { id: "perfume-xerjoff-casamorati-fiero", label: "XERJOFF CASAMORATI FIERO EDP 100ML", image: "img/xerjoff-casamorati-fiero.jpg", price: 238.9, category: "perfume" },
    { id: "perfume-xerjoff-casamorati-fiore-d-ulivo", label: "XERJOFF CASAMORATI FIORE D'ULIVO EDP 100ML", image: "img/xerjoff-casamorati-fiore-d-ulivo.jpg", price: 238.9, category: "perfume" },
    { id: "perfume-xerjoff-casamorati-gran-ballo", label: "XERJOFF CASAMORATI GRAN BALLO EDP 100ML", image: "img/xerjoff-casamorati-gran-ballo.jpg", price: 341.28, category: "perfume" },
    { id: "perfume-xerjoff-casamorati-la-tosca", label: "XERJOFF CASAMORATI LA TOSCA EDP", image: "img/xerjoff-casamorati-la-tosca.jpg", price: 341.66, category: "perfume" },
    { id: "perfume-xerjoff-casamorati-lira", label: "XERJOFF CASAMORATI LIRA EDP 100ML", image: "img/xerjoff-casamorati-lira.jpg", price: 341.66, category: "perfume" },
    { id: "perfume-xerjoff-casamorati-dolce-amalfi", label: "XERJOFF CASAMORATI DOLCE AMALFI EDP", image: "img/xerjoff-casamorati-dolce-amalfi.jpg", price: 341.28, category: "perfume" },
    { id: "perfume-jhag-mmmm", label: "JHAG MMMM... EDP 100ML", image: "img/jhag-mmmm.jpg", price: 176.96, category: "perfume" },
    { id: "perfume-jhag-another-oud", label: "JHAG ANOTHER OUD EDP 100ML", image: "img/jhag-another-oud.jpg", price: 202.24, category: "perfume" },
    { id: "perfume-jhag-sunny-side-up", label: "JHAG SUNNY SIDE UP EDP 100ML", image: "img/jhag-sunny-side-up.jpg", price: 88.48, category: "perfume" },
    { id: "perfume-jhag-vanilla-vibes", label: "JHAG VANILLA VIBES EDP 100ML", image: "img/jhag-vanilla-vibes.jpg", price: 123.87, category: "perfume" },
    { id: "perfume-jhag-musc-invisible", label: "JHAG MUSC INVISIBLE EDP 100ML", image: "img/jhag-musc-invisible.jpg", price: 123.87, category: "perfume" },
    { id: "perfume-bond-no9-lafayette-street", label: "BOND NO.9 LAFAYETTE STREET EDP 100ML", image: "img/bond-no9-lafayette-street.jpg", price: 416.87, category: "perfume" },
    { id: "perfume-bond-no9-tribeca", label: "BOND NO.9 TRIBECA EDP 100ML", image: "img/bond-no9-tribeca.jpg", price: 379.2, category: "perfume" },
    { id: "perfume-shiseido-fslx-cleansing-foam", label: "SHISEIDO FUTURE SOLUTION LX EXTRA RICH CLEANSING FOAM 125ML", image: "img/shiseido-fslx-cleansing-foam.jpg", price: 146.62, category: "perfume" },
    { id: "perfume-shiseido-fslx-eye-lip-cream", label: "SHISEIDO FUTURE SOLUTION LX EYE AND LIP CONTOUR REGENERATING CREAM 17ML", image: "img/shiseido-fslx-eye-lip-cream.jpg", price: 279.34, category: "perfume" },
    { id: "perfume-shiseido-fslx-total-protective-cream", label: "SHISEIDO FUTURE SOLUTION LX TOTAL PROTECTIVE CREAM SPF30 50ML", image: "img/shiseido-fslx-total-protective-cream.jpg", price: 571.33, category: "perfume" },
    { id: "perfume-shiseido-fslx-total-regenerating-cream", label: "SHISEIDO FUTURE SOLUTION LX TOTAL REGENERATING CREAM 50ML", image: "img/shiseido-fslx-total-regenerating-cream.jpg", price: 604.19, category: "perfume" },
    { id: "perfume-shiseido-fslx-brightening-softener", label: "SHISEIDO FUTURE SOLUTION LX CONCENTRATED BRIGHTENING SOFTENER 150ML", image: "img/shiseido-fslx-brightening-softener.jpg", price: 218.67, category: "perfume" },
    { id: "perfume-shiseido-legendary-enmei-cream", label: "SHISEIDO FUTURE SOLUTION LX LEGENDARY ENMEI ULTIMATE RENEWING CREAM 50ML", image: "img/shiseido-legendary-enmei-cream.jpg", price: 720.48, category: "perfume" },
    { id: "perfume-shiseido-legendary-enmei-serum", label: "SHISEIDO FUTURE SOLUTION LX LEGENDARY ENMEI ULTIMATE LUMINANCE SERUM 30ML", image: "img/shiseido-legendary-enmei-serum.jpg", price: 733.12, category: "perfume" },
    { id: "perfume-shiseido-legendary-enmei-eye-cream", label: "SHISEIDO FUTURE SOLUTION LX LEGENDARY ENMEI ULTIMATE RADIANCE EYE CREAM 15ML", image: "img/shiseido-legendary-enmei-eye-cream.jpg", price: 421.16, category: "perfume" },
    { id: "perfume-shiseido-vp-advanced-cream", label: "SHISEIDO VITAL PERFECTION UPLIFTING AND FIRMING ADVANCED CREAM 50ML", image: "img/shiseido-vp-advanced-cream.jpg", price: 204.77, category: "perfume" },
    { id: "perfume-shiseido-vp-day-cream-spf30", label: "SHISEIDO VITAL PERFECTION UPLIFTING AND FIRMING ADVANCED DAY CREAM SPF30 50ML", image: "img/shiseido-vp-day-cream-spf30.jpg", price: 204.77, category: "perfume" },
    { id: "perfume-shiseido-vp-eye-cream", label: "SHISEIDO VITAL PERFECTION UPLIFTING AND FIRMING ADVANCED EYE CREAM 15ML", image: "img/shiseido-vp-eye-cream.jpg", price: 131.46, category: "perfume" },
    { id: "perfume-shiseido-vp-wrinklespot-treatment", label: "SHISEIDO VITAL PERFECTION INTENSIVE WRINKLESPOT TREATMENT 20ML", image: "img/shiseido-vp-wrinklespot-treatment.jpg", price: 154.21, category: "perfume" },
    { id: "perfume-shiseido-vp-overnight-firming-treatment", label: "SHISEIDO VITAL PERFECTION OVERNIGHT FIRMING TREATMENT 50ML", image: "img/shiseido-vp-overnight-firming-treatment.jpg", price: 222.46, category: "perfume" },
    { id: "perfume-shiseido-vp-concentrated-supreme-cream", label: "SHISEIDO VITAL PERFECTION CONCENTRATED SUPREME CREAM 50ML", image: "img/shiseido-vp-concentrated-supreme-cream.jpg", price: 223.73, category: "perfume" },
    { id: "perfume-shiseido-bop-micro-click-concentrate", label: "SHISEIDO BIO-PERFORMANCE MICRO-CLICK CONCENTRATE", image: "img/shiseido-bop-micro-click-concentrate.jpg", price: 332.81, category: "perfume" },
    { id: "perfume-shiseido-bop-skin-hiforce-cream", label: "SHISEIDO BIO-PERFORMANCE SKIN HIFORCE CREAM 50ML", image: "img/shiseido-bop-skin-hiforce-cream.jpg", price: 305.89, category: "perfume" },
    { id: "perfume-shiseido-bop-super-revitalizing-cream", label: "SHISEIDO BIO-PERFORMANCE ADVANCED SUPER REVITALIZING CREAM", image: "img/shiseido-bop-super-revitalizing-cream.jpg", price: 179.49, category: "perfume" },
    { id: "perfume-shiseido-ultimune-serum", label: "SHISEIDO ULTIMUNE POWER INFUSING SERUM", image: "img/shiseido-ultimune-serum.jpg", price: 192.13, category: "perfume" },
    { id: "perfume-shiseido-ultimune-oil", label: "SHISEIDO ULTIMUNE POWER INFUSING OIL 75ML", image: "img/shiseido-ultimune-oil.jpg", price: 74.58, category: "perfume" },
    { id: "perfume-shiseido-ultimune-hand-cream", label: "SHISEIDO ULTIMUNE POWER INFUSING HAND CREAM 50ML", image: "img/shiseido-ultimune-hand-cream.jpg", price: 41.71, category: "perfume" },
    { id: "perfume-shiseido-ultimune-future-power-shot", label: "SHISEIDO ULTIMUNE FUTURE POWER SHOT 15ML", image: "img/shiseido-ultimune-future-power-shot.jpg", price: 112.37, category: "perfume" },
    { id: "perfume-shiseido-men-total-revitalizer-cream", label: "SHISEIDO MEN TOTAL REVITALIZER CREAM 50ML", image: "img/shiseido-men-total-revitalizer-cream.jpg", price: 136.13, category: "perfume" },
    { id: "perfume-shiseido-men-total-revitalizer-eye", label: "SHISEIDO MEN TOTAL REVITALIZER EYE 15ML", image: "img/shiseido-men-total-revitalizer-eye.jpg", price: 95.81, category: "perfume" },
    { id: "perfume-shiseido-men-total-revitalizer-light-fluid", label: "SHISEIDO MEN TOTAL REVITALIZER LIGHT FLUID 70ML", image: "img/shiseido-men-total-revitalizer-light-fluid.jpg", price: 126.02, category: "perfume" },
    { id: "perfume-shiseido-men-skin-empowering-cream", label: "SHISEIDO MEN SKIN EMPOWERING CREAM 50ML", image: "img/shiseido-men-skin-empowering-cream.jpg", price: 187.07, category: "perfume" },
    { id: "perfume-shiseido-refreshing-cleansing-water", label: "SHISEIDO REFRESHING CLEANSING WATER 180ML", image: "img/shiseido-refreshing-cleansing-water.jpg", price: 54.35, category: "perfume" },
    { id: "perfume-shiseido-complete-cleansing-microfoam", label: "SHISEIDO COMPLETE CLEANSING MICROFOAM 180ML", image: "img/shiseido-complete-cleansing-microfoam.jpg", price: 48.66, category: "perfume" },
    { id: "perfume-shiseido-benefiance-contour-serum", label: "SHISEIDO BENEFIANCE WRINKLE SMOOTHING CONTOUR SERUM 30ML", image: "img/shiseido-benefiance-contour-serum.jpg", price: 175.7, category: "perfume" },
    { id: "perfume-shiseido-benefiance-eye-cream", label: "SHISEIDO BENEFIANCE WRINKLE SMOOTHING EYE CREAM 15ML", image: "img/shiseido-benefiance-eye-cream.jpg", price: 120.08, category: "perfume" },
    { id: "perfume-shiseido-eudermine-activating-essence", label: "SHISEIDO EUDERMINE ACTIVATING ESSENCE 145ML", image: "img/shiseido-eudermine-activating-essence.jpg", price: 102.38, category: "perfume" },
    { id: "perfume-shiseido-eye-lip-makeup-remover", label: "SHISEIDO INSTANT EYE AND LIP MAKEUP REMOVER 125ML", image: "img/shiseido-eye-lip-makeup-remover.jpg", price: 56.88, category: "perfume" },
    { id: "perfume-shiseido-clear-sun-stick-spf50", label: "SHISEIDO EXPERT SUN PROTECTOR CLEAR STICK SPF50+ 20G", image: "img/shiseido-clear-sun-stick-spf50.jpg", price: 50.56, category: "perfume" },
    { id: "perfume-shiseido-expert-sun-lotion-spf50", label: "SHISEIDO EXPERT SUN PROTECTOR LOTION SPF50+ 150ML", image: "img/shiseido-expert-sun-lotion-spf50.jpg", price: 59.41, category: "perfume" },
    { id: "perfume-shiseido-expert-sun-cream-spf50", label: "SHISEIDO EXPERT SUN PROTECTOR CREAM SPF50+ 50ML", image: "img/shiseido-expert-sun-cream-spf50.jpg", price: 54.35, category: "perfume" },
    { id: "perfume-shiseido-expert-sun-lotion-spf30", label: "SHISEIDO EXPERT SUN PROTECTOR LOTION SPF30 150ML", image: "img/shiseido-expert-sun-lotion-spf30.jpg", price: 58.14, category: "perfume" },
    { id: "perfume-shiseido-zen-essence", label: "SHISEIDO ZEN ESSENCE EDP", image: "img/shiseido-zen-essence.jpg", price: 146.62, category: "perfume" },
    { id: "perfume-shiseido-ginza-datura", label: "SHISEIDO GINZA DATURA EDP", image: "img/shiseido-ginza-datura.jpg", price: 146.62, category: "perfume" },
    { id: "perfume-shiseido-ginza-intense", label: "SHISEIDO GINZA INTENSE EDP", image: "img/shiseido-ginza-intense.jpg", price: 214.88, category: "perfume" },
    { id: "perfume-shiseido-ginza-night-intense", label: "SHISEIDO GINZA NIGHT EDP INTENSE", image: "img/shiseido-ginza-night-intense.jpg", price: 156.74, category: "perfume" },
    { id: "perfume-shiseido-synchro-skin-radiant-lifting-foundation", label: "SHISEIDO SYNCHRO SKIN RADIANT LIFTING FOUNDATION SPF30 30ML", image: "img/shiseido-synchro-skin-radiant-lifting-foundation.jpg", price: 83.42, category: "perfume" },
    { id: "perfume-shiseido-synchro-skin-self-refreshing-foundation", label: "SHISEIDO SYNCHRO SKIN SELF-REFRESHING FOUNDATION SPF30 30ML", image: "img/shiseido-synchro-skin-self-refreshing-foundation.jpg", price: 83.42, category: "perfume" },
    { id: "perfume-shiseido-revitalessence-skin-glow-foundation", label: "SHISEIDO REVITALESSENCE SKIN GLOW FOUNDATION SPF30 30ML", image: "img/shiseido-revitalessence-skin-glow-foundation.jpg", price: 87.22, category: "perfume" },
    { id: "perfume-shiseido-technosatin-gel-lipstick", label: "SHISEIDO TECHNOSATIN GEL LIPSTICK", image: "img/shiseido-technosatin-gel-lipstick.jpg", price: 42.47, category: "perfume" },
    { id: "perfume-shiseido-controlledchaos-mascaraink", label: "SHISEIDO CONTROLLEDCHAOS MASCARAINK", image: "img/shiseido-controlledchaos-mascaraink.jpg", price: 38.05, category: "perfume" },
    { id: "perfume-shiseido-sports-bb", label: "SHISEIDO SPORTS BB SPF50+ 30ML", image: "img/shiseido-sports-bb.jpg", price: 54.35, category: "perfume" },
    { id: "perfume-shiseido-sports-bb-compact", label: "SHISEIDO SPORTS BB COMPACT SPF50+ 12G", image: "img/shiseido-sports-bb-compact.jpg", price: 56.88, category: "perfume" },
    { id: "perfume-bond-no9-sutton-place", label: "BOND NO.9 SUTTON PLACE EDP 100ML", image: "img/bond-no9-sutton-place.jpg", price: 379.2, category: "perfume" },
    { id: "perfume-shiseido-lipliner-inkduo", label: "SHISEIDO LIPLINER INKDUO PRIME + LINE", image: "img/shiseido-lipliner-inkduo.jpg", price: 45.5, category: "perfume" },
    { id: "perfume-shiseido-benefiance-overnight-cream", label: "SHISEIDO BENEFIANCE OVERNIGHT WRINKLE RESISTING CREAM 50ML", image: "img/shiseido-benefiance-overnight-cream.jpg", price: 169.38, category: "perfume" },
    { id: "perfume-shiseido-synchro-skin-soft-blurring-primer", label: "SHISEIDO SYNCHRO SKIN SOFT BLURRING PRIMER 30ML", image: "img/shiseido-synchro-skin-soft-blurring-primer.jpg", price: 63.2, category: "perfume" },
    { id: "perfume-shiseido-vp-liftdefine-mask", label: "SHISEIDO VITAL PERFECTION LIFTDEFINE RADIANCE FACE MASK (6 PAIRS)", image: "img/shiseido-vp-liftdefine-mask.jpg", price: 190.86, category: "perfume" },
    { id: "perfume-shiseido-ginza", label: "SHISEIDO GINZA EDP", image: "img/shiseido-ginza.jpg", price: 129.81, category: "perfume" },
    { id: "perfume-shiseido-ginza-body-lotion", label: "SHISEIDO GINZA PERFUMED BODY LOTION 200ML", image: "img/shiseido-ginza-body-lotion.jpg", price: 73.31, category: "perfume" },
    { id: "perfume-shiseido-ginza-murasaki", label: "SHISEIDO GINZA MURASAKI EDP", image: "img/shiseido-ginza-murasaki.jpg", price: 146.62, category: "perfume" },
    { id: "perfume-shiseido-zen", label: "SHISEIDO ZEN EDP", image: "img/shiseido-zen.jpg", price: 131.46, category: "perfume" },
    { id: "perfume-shiseido-men-face-cleanser", label: "SHISEIDO MEN FACE CLEANSER 125ML", image: "img/shiseido-men-face-cleanser.jpg", price: 54.35, category: "perfume" },
    { id: "perfume-shiseido-men-energizing-moisturizer-fluid", label: "SHISEIDO MEN ENERGIZING MOISTURIZER EXTRA LIGHT FLUID 100ML", image: "img/shiseido-men-energizing-moisturizer-fluid.jpg", price: 84.69, category: "perfume" },
    { id: "perfume-shiseido-microliner-ink", label: "SHISEIDO MICROLINER INK", image: "img/shiseido-microliner-ink.jpg", price: 42.98, category: "perfume" },
    { id: "perfume-shiseido-waso-gel-to-oil-cleanser", label: "SHISEIDO WASO SHIKULIME GEL-TO-OIL CLEANSER 125ML", image: "img/shiseido-waso-gel-to-oil-cleanser.jpg", price: 23.38, category: "perfume" },
    { id: "perfume-shiseido-waso-yuzu-c-sleeping-mask", label: "SHISEIDO WASO YUZU-C BEAUTY SLEEPING MASK 50ML", image: "img/shiseido-waso-yuzu-c-sleeping-mask.jpg", price: 64.46, category: "perfume" },
    { id: "perfume-shiseido-waso-color-control-moisturizer", label: "SHISEIDO WASO SHIKULIME COLOR CONTROL OIL-FREE MOISTURIZER SPF30 50ML", image: "img/shiseido-waso-color-control-moisturizer.jpg", price: 58.14, category: "perfume" },
    { id: "perfume-shiseido-waso-mega-hydrating-moisturizer", label: "SHISEIDO WASO SHIKULIME MEGA HYDRATING MOISTURIZER 50ML", image: "img/shiseido-waso-mega-hydrating-moisturizer.jpg", price: 58.14, category: "perfume" },
    { id: "perfume-shiseido-ee-hydrating-cream", label: "SHISEIDO ESSENTIAL ENERGY HYDRATING CREAM 50ML", image: "img/shiseido-ee-hydrating-cream.jpg", price: 98.59, category: "perfume" },
    { id: "perfume-shiseido-ee-hydrating-day-cream-spf20", label: "SHISEIDO ESSENTIAL ENERGY HYDRATING DAY CREAM SPF20 50ML", image: "img/shiseido-ee-hydrating-day-cream-spf20.jpg", price: 98.59, category: "perfume" },
    { id: "perfume-shiseido-bop-skin-filler", label: "SHISEIDO BIO-PERFORMANCE SKIN FILLER SERUMS (2 X 30ML)", image: "img/shiseido-bop-skin-filler.jpg", price: 375.41, category: "perfume" },
    { id: "perfume-shiseido-clarifying-cleansing-foam", label: "SHISEIDO CLARIFYING CLEANSING FOAM 125ML", image: "img/shiseido-clarifying-cleansing-foam.jpg", price: 48.66, category: "perfume" },
    { id: "perfume-shiseido-extra-rich-cleansing-milk", label: "SHISEIDO EXTRA RICH CLEANSING MILK 125ML", image: "img/shiseido-extra-rich-cleansing-milk.jpg", price: 48.66, category: "perfume" },
    { id: "perfume-shiseido-deep-cleansing-foam", label: "SHISEIDO DEEP CLEANSING FOAM 125ML", image: "img/shiseido-deep-cleansing-foam.jpg", price: 48.66, category: "perfume" },
    { id: "perfume-shiseido-treatment-softener", label: "SHISEIDO TREATMENT SOFTENER 150ML", image: "img/shiseido-treatment-softener.jpg", price: 61.94, category: "perfume" },
    { id: "perfume-shiseido-revitalizing-treatment-softener", label: "SHISEIDO REVITALIZING TREATMENT SOFTENER 150ML", image: "img/shiseido-revitalizing-treatment-softener.jpg", price: 115.66, category: "perfume" },
    { id: "perfume-shiseido-benefiance-day-cream-spf25", label: "SHISEIDO BENEFIANCE WRINKLE SMOOTHING DAY CREAM SPF25 50ML", image: "img/shiseido-benefiance-day-cream-spf25.jpg", price: 156.74, category: "perfume" },
    { id: "perfume-shiseido-benefiance-wrinkle-smoothing-cream", label: "SHISEIDO BENEFIANCE WRINKLE SMOOTHING CREAM 50ML", image: "img/shiseido-benefiance-wrinkle-smoothing-cream.jpg", price: 156.74, category: "perfume" },
    { id: "perfume-shiseido-fslx-total-radiance-foundation", label: "SHISEIDO FUTURE SOLUTION LX TOTAL RADIANCE FOUNDATION SPF20 30ML", image: "img/shiseido-fslx-total-radiance-foundation.jpg", price: 169.38, category: "perfume" },
    { id: "perfume-shiseido-maru-fude-brush", label: "SHISEIDO MARU FUDE MULTI FACE BRUSH", image: "img/shiseido-maru-fude-brush.jpg", price: 88.48, category: "perfume" },
    { id: "perfume-shiseido-naname-fude-brush", label: "SHISEIDO NANAME FUDE MULTI EYE BRUSH", image: "img/shiseido-naname-fude-brush.jpg", price: 51.82, category: "perfume" },
    { id: "perfume-shiseido-hasu-fude-brush", label: "SHISEIDO HASU FUDE FOUNDATION BRUSH", image: "img/shiseido-hasu-fude-brush.jpg", price: 74.58, category: "perfume" },
    { id: "perfume-shiseido-daiya-fude-brush", label: "SHISEIDO DAIYA FUDE FACE DUO BRUSH", image: "img/shiseido-daiya-fude-brush.jpg", price: 96.19, category: "perfume" },
    { id: "perfume-shiseido-tsutsu-fude-brush", label: "SHISEIDO TSUTSU FUDE CONCEALER BRUSH", image: "img/shiseido-tsutsu-fude-brush.jpg", price: 51.82, category: "perfume" },
    { id: "perfume-shiseido-hanatsubaki-hake-brush", label: "SHISEIDO HANATSUBAKI HAKE POLISHING FACE BRUSH", image: "img/shiseido-hanatsubaki-hake-brush.jpg", price: 104.91, category: "perfume" },
    { id: "perfume-shiseido-colorgel-lipbalm", label: "SHISEIDO COLORGEL LIPBALM", image: "img/shiseido-colorgel-lipbalm.jpg", price: 53.09, category: "perfume" },
    { id: "perfume-shiseido-synchro-skin-powder-foundation", label: "SHISEIDO SYNCHRO SKIN SELF-REFRESHING CUSTOM FINISH POWDER FOUNDATION 9G", image: "img/shiseido-synchro-skin-powder-foundation.jpg", price: 83.42, category: "perfume" },
    { id: "perfume-shiseido-benefiance-nutriperfect-day-cream", label: "SHISEIDO BENEFIANCE NUTRIPERFECT DAY CREAM SPF15 50ML", image: "img/shiseido-benefiance-nutriperfect-day-cream.jpg", price: 192.13, category: "perfume" },
    { id: "perfume-shiseido-benefiance-nutriperfect-night-cream", label: "SHISEIDO BENEFIANCE NUTRIPERFECT NIGHT CREAM 50ML", image: "img/shiseido-benefiance-nutriperfect-night-cream.jpg", price: 207.3, category: "perfume" },
    { id: "perfume-shiseido-archliner-ink", label: "SHISEIDO ARCHLINER INK 01 SHIBUI BLACK", image: "img/shiseido-archliner-ink.jpg", price: 41.71, category: "perfume" },
    { id: "perfume-shiseido-brow-inktrio", label: "SHISEIDO BROW INKTRIO", image: "img/shiseido-brow-inktrio.jpg", price: 41.71, category: "perfume" },
    { id: "perfume-shiseido-imperiallash-mascaraink", label: "SHISEIDO IMPERIALLASH MASCARAINK 01 SUMI BLACK", image: "img/shiseido-imperiallash-mascaraink.jpg", price: 54.35, category: "perfume" },
    { id: "perfume-diesel", label: "DIESEL LOVERDOSE", image: "img/diesel.webp", price: 69.90, category: "perfume" },
  ];

  var CATEGORIES = {
    flowers: { id: "flowers", label: "Flowers", items: FLOWER_ITEMS },
    bottle: { id: "bottle", label: "Champagne & spirits", items: BOTTLE_ITEMS },
    chocolate: { id: "chocolate", label: "Tog chocolates", items: CHOCOLATE_ITEMS },
    perfume: { id: "perfume", label: "Perfumes", items: PERFUME_ITEMS },
    decor: {
      id: "decor",
      label: "Decor",
      items: [
        {
          id: "decor-valentine",
          label: "Valentine decor",
          image: "img/valentineday.webp",
          price: 60,
          category: "decor",
        },
        {
          id: "decor-birthday",
          label: "Birthday decor",
          image: "img/birthday.webp",
          price: 60,
          category: "decor",
        },
      ],
    },
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

  // Flat nightly rates for all dates (no seasonal overrides).
  var SPECIAL_RATE_NIGHTS = [];
  var AUGUST_REDUCED_RATE_NIGHTS = [];
  var SPECIAL_RATE_EUR = 0;
  var AUGUST_REDUCED_RATE_EUR = 0;
  var JUNIOR_SUITE_BLOCKED_NIGHTS = [];
  // Legacy: nights closed for every room (none currently).
  var BLOCKED_NIGHTS = [];

  function parseIsoDate(value) {
    if (!value) return null;
    var parts = String(value).split("-");
    if (parts.length !== 3) return null;
    var date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return isNaN(date.getTime()) ? null : date;
  }

  function formatIsoDate(date) {
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  function eachNightIso(checkinIso, checkoutIso) {
    var start = parseIsoDate(checkinIso);
    var end = parseIsoDate(checkoutIso);
    if (!start || !end || end <= start) return [];

    var nights = [];
    var cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    while (cursor < end) {
      nights.push(formatIsoDate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return nights;
  }

  function isBlockedNight(iso) {
    return BLOCKED_NIGHTS.indexOf(String(iso || "")) >= 0;
  }

  function isAugustReducedRateNight(iso) {
    return AUGUST_REDUCED_RATE_NIGHTS.indexOf(String(iso || "")) >= 0;
  }

  function isSpecialRateNight(iso) {
    return SPECIAL_RATE_NIGHTS.indexOf(String(iso || "")) >= 0;
  }

  function isJuniorSuiteBlockedNight(iso) {
    return JUNIOR_SUITE_BLOCKED_NIGHTS.indexOf(String(iso || "")) >= 0;
  }

  function getBlockedNightsInStay(checkinIso, checkoutIso) {
    return eachNightIso(checkinIso, checkoutIso).filter(isBlockedNight);
  }

  function getSpecialRateNightsInStay(checkinIso, checkoutIso) {
    return eachNightIso(checkinIso, checkoutIso).filter(isSpecialRateNight);
  }

  function getJuniorSuiteBlockedNightsInStay(checkinIso, checkoutIso) {
    return eachNightIso(checkinIso, checkoutIso).filter(isJuniorSuiteBlockedNight);
  }

  function stayOverlapsBlockedNights(checkinIso, checkoutIso) {
    return getBlockedNightsInStay(checkinIso, checkoutIso).length > 0;
  }

  function stayOverlapsJuniorSuiteBlocked(checkinIso, checkoutIso) {
    return getJuniorSuiteBlockedNightsInStay(checkinIso, checkoutIso).length > 0;
  }

  function applyNightlySpecialRate(baseRate, nightIso) {
    return Number(baseRate) || 0;
  }

  function getStayRoomTotal(baseRate, checkinIso, checkoutIso) {
    var nights = eachNightIso(checkinIso, checkoutIso);
    if (!nights.length) return 0;
    var total = 0;
    for (var i = 0; i < nights.length; i++) {
      total += applyNightlySpecialRate(baseRate, nights[i]);
    }
    return total;
  }

  function getStayAverageNightly(baseRate, checkinIso, checkoutIso) {
    var nights = eachNightIso(checkinIso, checkoutIso);
    if (!nights.length) return Number(baseRate) || 0;
    return getStayRoomTotal(baseRate, checkinIso, checkoutIso) / nights.length;
  }

  function stayHasSpecialRate(checkinIso, checkoutIso) {
    return getSpecialRateNightsInStay(checkinIso, checkoutIso).length > 0;
  }

  global.DerandBooking = {
    BOOKING_LINES_KEY: BOOKING_LINES_KEY,
    CATEGORIES: CATEGORIES,
    EXTRA_ITEMS: EXTRA_ITEMS,
    BLOCKED_NIGHTS: BLOCKED_NIGHTS.slice(),
    SPECIAL_RATE_NIGHTS: SPECIAL_RATE_NIGHTS.slice(),
    AUGUST_REDUCED_RATE_NIGHTS: AUGUST_REDUCED_RATE_NIGHTS.slice(),
    SPECIAL_RATE_EUR: SPECIAL_RATE_EUR,
    AUGUST_REDUCED_RATE_EUR: AUGUST_REDUCED_RATE_EUR,
    JUNIOR_SUITE_BLOCKED_NIGHTS: JUNIOR_SUITE_BLOCKED_NIGHTS.slice(),
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
    eachNightIso: eachNightIso,
    isBlockedNight: isBlockedNight,
    isSpecialRateNight: isSpecialRateNight,
    isAugustReducedRateNight: isAugustReducedRateNight,
    isJuniorSuiteBlockedNight: isJuniorSuiteBlockedNight,
    getBlockedNightsInStay: getBlockedNightsInStay,
    getSpecialRateNightsInStay: getSpecialRateNightsInStay,
    getJuniorSuiteBlockedNightsInStay: getJuniorSuiteBlockedNightsInStay,
    stayOverlapsBlockedNights: stayOverlapsBlockedNights,
    stayOverlapsJuniorSuiteBlocked: stayOverlapsJuniorSuiteBlocked,
    applyNightlySpecialRate: applyNightlySpecialRate,
    getStayRoomTotal: getStayRoomTotal,
    getStayAverageNightly: getStayAverageNightly,
    stayHasSpecialRate: stayHasSpecialRate,
  };
})(typeof window !== "undefined" ? window : this);
