(function () {
  var params = new URLSearchParams(window.location.search);
  var fromBook = params.get("from") === "book";

  if (!fromBook) {
    try {
      var ref = document.referrer || "";
      fromBook = /(?:^|[/?])book(?:now[a-z]+)?(?:\.html)?(?:[?#]|$)/i.test(ref);
    } catch (e) {}
  }

  if (!fromBook) return;

  var bookParams = new URLSearchParams();
  ["checkin", "checkout", "adults", "children", "room"].forEach(function (key) {
    var value = params.get(key);
    if (value) bookParams.set(key, value);
  });

  var ROOM_PATHS = {
    "superior-double": "/BookNowSuperiorDoubleRoom",
    "superior-twin": "/BookNowSuperiorTwinRoom",
    "premium-double": "/BookNowPremiumDoubleRoom",
    "deluxe-double": "/BookNowDeluxeDoubleRoom",
    "junior-suite": "/BookNowJuniorSuite",
  };
  var bookUrl =
    (ROOM_PATHS[bookParams.get("room")] || "/Book") +
    (bookParams.toString() ? "?" + bookParams.toString() : "");

  function appendBookContext(href) {
    if (!href) return href;
    var base = href.split("?")[0];
    var out = new URLSearchParams(bookParams);
    out.set("from", "book");
    return base + "?" + out.toString();
  }

  document.querySelectorAll(".back-link").forEach(function (link) {
    link.href = bookUrl;
    link.textContent = " Back to Bookings";
  });

  document.querySelectorAll(".bathroom-logo").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href) link.setAttribute("href", appendBookContext(href));
  });
})();
