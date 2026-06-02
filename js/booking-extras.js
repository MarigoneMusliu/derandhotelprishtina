(function () {
  var BOOKING_DETAILS_PAGE = "booking-details.html";
  var ROOM_LABELS = {
    "junior-suite": "Junior Suite",
    "deluxe-double": "Deluxe Double Room",
    "premium-double": "Premium Room",
    "superior-twin": "Superior Twin Room",
    "superior-double": "Superior Double Room",
  };
  var ROOM_NIGHTLY = {
    "junior-suite": 119,
    "deluxe-double": 88,
    "premium-double": 104,
    "superior-twin": 72,
    "superior-double": 84,
  };

  var gridEl = document.getElementById("booking-extras-grid");
  if (!gridEl || !window.DerandBooking) return;

  var titleEl = document.getElementById("extras-page-title");
  var leadEl = document.getElementById("extras-page-lead");
  var continueBtn = document.getElementById("extras-continue-btn");
  var skipBtn = document.getElementById("extras-skip-btn");
  var backLink = document.getElementById("extras-back-link");
  var progressPill = document.getElementById("extras-progress-pill");
  var footerBar = document.getElementById("booking-extras-footer");
  var footerCount = document.getElementById("booking-extras-footer-count");
  var footerDone = document.getElementById("booking-extras-footer-done");
  var extrasEmptyEl = document.getElementById("extras-summary-extras-empty");
  var summaryRowsEl = document.getElementById("extras-summary-rows");
  var grandTotalEl = document.getElementById("extras-summary-grand-total");
  var roomTotalEl = document.getElementById("extras-summary-room-total");
  var roomLabelEl = document.getElementById("extras-summary-room-label");
  var stayEl = document.getElementById("extras-summary-stay");

  var selected = [];
  var fromDetails = false;
  var focusId = "";
  var catalogItems = [];

  var FOCUS_COPY = {
    flowers: {
      title: "Choose your flowers",
      lead: "Same selection as our Concierge page — tap to add, then continue to your booking.",
    },
    bottle: {
      title: "Champagne & premium spirits",
      lead: "Browse the full in-room bottle menu. Selected items are added to your total.",
    },
    chocolate: {
      title: "Tog chocolates",
      lead: "All Tog chocolate options from Concierge — select any you would like in your room.",
    },
    perfume: {
      title: "Perfumes",
      lead: "Our in-room fragrance collection — default bottle size, same prices as Concierge.",
    },
  };

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  function parseIso(value) {
    if (!value) return null;
    var parts = value.split("-");
    if (parts.length !== 3) return null;
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  function loadBookingParams() {
    var params = new URLSearchParams(window.location.search);
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    var day = String(tomorrow.getDate()).padStart(2, "0");
    var defaultOut = tomorrow.getFullYear() + "-" + month + "-" + day;
    var monthIn = String(today.getMonth() + 1).padStart(2, "0");
    var dayIn = String(today.getDate()).padStart(2, "0");
    var defaultIn = today.getFullYear() + "-" + monthIn + "-" + dayIn;

    var room = params.get("room") || "junior-suite";
    if (!ROOM_LABELS[room]) room = "junior-suite";

    var checkin = params.get("checkin") || defaultIn;
    var checkout = params.get("checkout") || defaultOut;
    var start = parseIso(checkin);
    var end = parseIso(checkout);
    if (!start || !end || end <= start) {
      checkin = defaultIn;
      checkout = defaultOut;
    }

    fromDetails = params.get("from") === "details";
    focusId = params.get("focus") || "";
    if (focusId && !window.DerandBooking.getCategoryMeta(focusId)) {
      focusId = "";
    }

    selected = window.DerandBooking.parseExtrasParam(params.get("extras"));
    catalogItems = focusId ? window.DerandBooking.getCategoryItems(focusId) : [];

    return {
      room: room,
      checkin: checkin,
      checkout: checkout,
      adults: params.get("adults") || "1",
      children: params.get("children") || "0",
    };
  }

  function getNightCount(state) {
    var start = parseIso(state.checkin);
    var end = parseIso(state.checkout);
    if (!start || !end) return 1;
    var diff = Math.round((end - start) / 86400000);
    return diff > 0 ? diff : 1;
  }

  function getRoomTotal(state) {
    return (ROOM_NIGHTLY[state.room] || 0) * getNightCount(state);
  }

  function buildDetailsUrl(state, extrasIds) {
    var params = new URLSearchParams();
    params.set("room", state.room);
    params.set("checkin", state.checkin);
    params.set("checkout", state.checkout);
    params.set("adults", state.adults);
    params.set("children", state.children);
    var encoded = window.DerandBooking.encodeExtrasParam(extrasIds);
    if (encoded) params.set("extras", encoded);
    return BOOKING_DETAILS_PAGE + "?" + params.toString();
  }

  function applyFocusCopy() {
    var copy = focusId && FOCUS_COPY[focusId] ? FOCUS_COPY[focusId] : null;
    var meta = focusId ? window.DerandBooking.getCategoryMeta(focusId) : null;
    if (titleEl) {
      titleEl.textContent = copy ? copy.title : meta ? meta.label : "Concierge touches";
    }
    if (leadEl) {
      leadEl.textContent = copy
        ? copy.lead
        : "Browse and tap items to add them to your booking total.";
    }
    if (progressPill) {
      progressPill.textContent = meta ? meta.label : "Optional extra";
    }
  }

  function toggleItem(id) {
    var index = selected.indexOf(id);
    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(id);
    }
    renderCards();
    updateSummaryUi();
    syncUrls();
  }

  function updateSummaryUi() {
    var extrasTotal = window.DerandBooking.getExtrasTotal(selected);
    var lines = window.DerandBooking.getExtrasLines(selected);
    var count = selected.length;

    if (footerCount) {
      footerCount.textContent =
        count === 0
          ? "No extras selected"
          : count === 1
            ? "1 item selected · " + formatCurrency(extrasTotal)
            : count + " items selected · " + formatCurrency(extrasTotal);
    }

    if (footerBar) {
      footerBar.hidden = !fromDetails;
    }

    if (summaryRowsEl) {
      Array.prototype.forEach.call(
        summaryRowsEl.querySelectorAll(".booking-extras-summary__row--extra"),
        function (row) {
          row.parentNode.removeChild(row);
        },
      );
      lines.forEach(function (item) {
        var row = document.createElement("div");
        row.className = "booking-extras-summary__row booking-extras-summary__row--extra";
        row.innerHTML =
          "<span>" + item.label + "</span><strong>" + formatCurrency(item.price) + "</strong>";
        summaryRowsEl.appendChild(row);
      });
    }

    if (extrasEmptyEl) {
      extrasEmptyEl.hidden = lines.length > 0;
    }

    var state = bookingState;
    var roomTotal = getRoomTotal(state);
    var nights = getNightCount(state);
    var nightsLabel = nights + " " + (nights === 1 ? "night" : "nights");
    var roomName = ROOM_LABELS[state.room] || "Room";

    if (stayEl) stayEl.textContent = roomName + " · " + nightsLabel;
    if (roomLabelEl) roomLabelEl.textContent = roomName + " (" + nightsLabel + ")";
    if (roomTotalEl) roomTotalEl.textContent = formatCurrency(roomTotal);
    if (grandTotalEl) grandTotalEl.textContent = formatCurrency(roomTotal + extrasTotal);
  }

  function syncUrls() {
    var url = buildDetailsUrl(bookingState, selected);
    if (continueBtn) continueBtn.href = url;
    if (skipBtn) skipBtn.href = buildDetailsUrl(bookingState, []);
    if (footerDone) footerDone.href = url;
    if (backLink) backLink.href = url;
  }

  function renderCards() {
    gridEl.innerHTML = "";
    if (!catalogItems.length) {
      gridEl.classList.remove("booking-extras__grid--catalog");
      var empty = document.createElement("p");
      empty.className = "booking-extras__empty";
      empty.textContent = "Choose a category from guest details to browse items.";
      gridEl.appendChild(empty);
      return;
    }

    gridEl.classList.add("booking-extras__grid--catalog");

    catalogItems.forEach(function (item) {
      var isOn = selected.indexOf(item.id) >= 0;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-extra-card booking-extra-card--catalog" + (isOn ? " is-selected" : "");
      btn.setAttribute("data-extra-id", item.id);
      btn.setAttribute("aria-pressed", isOn ? "true" : "false");

      var priceText =
        item.price > 0 ? formatCurrency(item.price) : "On request";

      btn.innerHTML =
        '<div class="booking-extra-card__media">' +
        '<span class="booking-extra-card__check" aria-hidden="true"><i class="fa fa-check"></i></span>' +
        '<img src="' +
        item.image +
        '" alt="" loading="lazy" decoding="async" />' +
        "</div>" +
        '<div class="booking-extra-card__body">' +
        '<span class="booking-extra-card__label">' +
        item.label +
        "</span>" +
        '<p class="booking-extra-card__price">' +
        priceText +
        "</p>" +
        "</div>";

      btn.addEventListener("click", function () {
        toggleItem(item.id);
      });
      gridEl.appendChild(btn);
    });
  }

  var bookingState = loadBookingParams();
  applyFocusCopy();

  var layoutEl = document.querySelector(".booking-extras__layout");
  var aside = document.querySelector(".booking-extras__aside");

  if (fromDetails && layoutEl) {
    layoutEl.classList.add("booking-extras__layout--with-footer");
  }
  if (aside) {
    aside.hidden = false;
  }

  if (backLink) {
    backLink.querySelector("span").textContent = "Back to guest details";
  }

  if (continueBtn) continueBtn.hidden = fromDetails;
  if (skipBtn) skipBtn.hidden = fromDetails;

  if (footerDone) {
    footerDone.addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = buildDetailsUrl(bookingState, selected);
    });
  }

  renderCards();
  updateSummaryUi();
  syncUrls();
})();
