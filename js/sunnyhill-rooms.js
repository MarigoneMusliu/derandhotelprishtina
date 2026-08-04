(function () {
  var DEFAULT_CHECKIN = "2026-07-31";
  var MIN_NIGHTS = 1;
  var MAX_NIGHTS = 14;

  var checkinEl = document.getElementById("sunnyhill-checkin");
  var nightsEl = document.getElementById("sunnyhill-nights");
  var list = document.querySelector(".sunnyhill-rooms__list");
  if (!checkinEl || !nightsEl || !list) return;

  function parseIso(value) {
    var parts = String(value || "").split("-");
    if (parts.length !== 3) return null;
    var date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return isNaN(date.getTime()) ? null : date;
  }

  function formatIso(date) {
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  function getNights() {
    var nights = parseInt(nightsEl.value, 10);
    if (isNaN(nights)) nights = 3;
    nights = Math.max(MIN_NIGHTS, Math.min(MAX_NIGHTS, nights));
    nightsEl.value = String(nights);
    return nights;
  }

  function getCheckin() {
    var date = parseIso(checkinEl.value) || parseIso(DEFAULT_CHECKIN);
    checkinEl.value = formatIso(date);
    return date;
  }

  function getCheckoutIso() {
    var checkin = getCheckin();
    var checkout = new Date(
      checkin.getFullYear(),
      checkin.getMonth(),
      checkin.getDate() + getNights(),
    );
    return formatIso(checkout);
  }

  function bookingHref(room) {
    return (
      "booking-details.html?room=" +
      encodeURIComponent(room) +
      "&checkin=" +
      encodeURIComponent(checkinEl.value) +
      "&checkout=" +
      encodeURIComponent(getCheckoutIso()) +
      "&adults=1&children=0"
    );
  }

  function updateReserveLinks() {
    list.querySelectorAll("[data-room]").forEach(function (link) {
      var room = link.getAttribute("data-room");
      if (!room) return;
      link.href = bookingHref(room);
    });
    list.querySelectorAll("[data-room-link]").forEach(function (link) {
      var room = link.getAttribute("data-room-link");
      if (!room) return;
      link.href = bookingHref(room);
    });
  }

  document.querySelectorAll("[data-nights-action]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var action = btn.getAttribute("data-nights-action");
      var nights = getNights();
      if (action === "increase") nights += 1;
      if (action === "decrease") nights -= 1;
      nightsEl.value = String(nights);
      getNights();
      updateReserveLinks();
    });
  });

  nightsEl.addEventListener("change", function () {
    getNights();
    updateReserveLinks();
  });
  nightsEl.addEventListener("input", updateReserveLinks);
  checkinEl.addEventListener("change", updateReserveLinks);

  getNights();
  updateReserveLinks();
})();
