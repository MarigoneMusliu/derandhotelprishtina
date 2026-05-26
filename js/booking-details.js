(function () {
  var HOTELRUNNER_BASE = "https://derand-hotel.hotelrunner.com/bv3/search";
  var WEB3FORMS_URL = "https://api.web3forms.com/submit";
  var WEB3FORMS_ACCESS_KEY = "761d8dce-87b2-4534-bc76-77ec2305d4ec";
  var NOTIFY_EMAIL = "info@derandhotel.com";
  var TAX_RATE = 0.15;

  var ROOM_DATA = {
    "junior-suite": {
      label: "Junior Suite",
      image: "img/j.webp",
      price: 280,
      meta: "37 m2 / King bed",
    },
    "deluxe-double": {
      label: "Deluxe Double Room",
      image: "img/deluxeroom.webp",
      price: 320,
      meta: "30 m2 / King bed",
    },
    "premium-double": {
      label: "Premium Double Room",
      image: "img/p1.webp",
      price: 450,
      meta: "28 m2 / King bed",
    },
    "superior-twin": {
      label: "Superior Twin Room",
      image: "img/t1.webp",
      price: 350,
      meta: "23 m2 / Twin beds",
    },
    "superior-double": {
      label: "Superior Double Room",
      image: "img/s1.webp",
      price: 390,
      meta: "22 m2 / King bed",
    },
  };

  var form = document.getElementById("booking-details-form");
  if (!form) return;

  var roomTitleEl = document.getElementById("booking-summary-room");
  var roomMetaEl = document.getElementById("booking-summary-meta");
  var roomImageEl = document.getElementById("booking-summary-image");
  var roomRateEl = document.getElementById("booking-summary-rate");
  var checkinEl = document.getElementById("booking-summary-checkin");
  var checkoutEl = document.getElementById("booking-summary-checkout");
  var guestsEl = document.getElementById("booking-summary-guests");
  var nightsEl = document.getElementById("booking-summary-nights");
  var roomTotalLabelEl = document.getElementById("booking-price-room-label");
  var roomTotalEl = document.getElementById("booking-price-room-total");
  var feesEl = document.getElementById("booking-price-fees");
  var totalEl = document.getElementById("booking-price-total");
  var statusEl = document.getElementById("booking-details-status");
  var backLinkEl = document.getElementById("booking-back-link");
  var fullNameEl = document.getElementById("booking-full-name");
  var emailEl = document.getElementById("booking-email");
  var phoneEl = document.getElementById("booking-phone");
  var notesEl = document.getElementById("booking-notes");
  var methodButtons = Array.prototype.slice.call(
    document.querySelectorAll(".booking-method"),
  );

  var selectedMethod = "card";

  function parseIso(value) {
    if (!value) return null;
    var parts = value.split("-");
    if (parts.length !== 3) return null;
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  function formatIso(date) {
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  function formatDate(value) {
    var date = parseIso(value);
    if (!date) return "—";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function currency(amount) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  function guestSummary(adults, children) {
    var parts = [];
    if (adults > 0) {
      parts.push(adults + " " + (adults === 1 ? "Adult" : "Adults"));
    }
    if (children > 0) {
      parts.push(children + " " + (children === 1 ? "Child" : "Children"));
    }
    return parts.join(", ") || "No guests";
  }

  function loadState() {
    var params = new URLSearchParams(window.location.search);
    var roomKey = params.get("room");
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    var room = ROOM_DATA[roomKey] ? roomKey : "junior-suite";
    var checkin = params.get("checkin") || formatIso(today);
    var checkout = params.get("checkout") || formatIso(tomorrow);
    var adults = parseInt(params.get("adults"), 10) || 2;
    var children = parseInt(params.get("children"), 10) || 0;

    var start = parseIso(checkin);
    var end = parseIso(checkout);
    if (!start || !end || end <= start) {
      checkin = formatIso(today);
      checkout = formatIso(tomorrow);
    }

    return {
      room: room,
      checkin: checkin,
      checkout: checkout,
      adults: adults,
      children: children,
    };
  }

  function getNightCount(state) {
    var start = parseIso(state.checkin);
    var end = parseIso(state.checkout);
    if (!start || !end) return 1;
    var diff = Math.round((end - start) / 86400000);
    return diff > 0 ? diff : 1;
  }

  function buildBackUrl(state) {
    var params = new URLSearchParams();
    params.set("room", state.room);
    params.set("checkin", state.checkin);
    params.set("checkout", state.checkout);
    params.set("adults", String(state.adults));
    params.set("children", String(state.children));
    return "book.html?" + params.toString();
  }

  function buildHotelRunnerUrl(state) {
    var params = new URLSearchParams();
    params.set("check_in", state.checkin);
    params.set("check_out", state.checkout);
    params.set("adults", String(state.adults));
    params.set("children", String(state.children));
    params.set("guests", String(state.adults + state.children));
    params.set("room", state.room);
    return HOTELRUNNER_BASE + "?" + params.toString();
  }

  function setStatus(message, type) {
    statusEl.textContent = message || "";
    statusEl.className = "booking-details__status" + (type ? " is-" + type : "");
  }

  function clearErrors() {
    Array.prototype.forEach.call(
      form.querySelectorAll(".booking-field.is-invalid"),
      function (field) {
        field.classList.remove("is-invalid");
      },
    );
  }

  function markError(input) {
    var field = input.closest(".booking-field");
    if (field) field.classList.add("is-invalid");
  }

  function validate() {
    clearErrors();
    var valid = true;

    if (!fullNameEl.value.trim()) {
      markError(fullNameEl);
      valid = false;
    }

    if (!emailEl.value.trim() || emailEl.value.indexOf("@") < 1) {
      markError(emailEl);
      valid = false;
    }

    if (!phoneEl.value.trim()) {
      markError(phoneEl);
      valid = false;
    }

    if (!valid) {
      setStatus("Please complete the highlighted guest details.", "error");
    }

    return valid;
  }

  function notifyHotel(state, room, nights, totals) {
    var payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "Booking details — " + room.label + " — " + state.checkin,
      from_name: "Derand Hotel Booking Details",
      email: NOTIFY_EMAIL,
      replyto: emailEl.value.trim(),
      message: [
        "New booking details submission — Derand Hotel",
        "",
        "Room: " + room.label,
        "Stay: " + formatDate(state.checkin) + " to " + formatDate(state.checkout),
        "Guests: " + guestSummary(state.adults, state.children),
        "Nights: " + nights,
        "Payment preference: " + selectedMethod,
        "",
        "Guest name: " + fullNameEl.value.trim(),
        "Email: " + emailEl.value.trim(),
        "Phone: " + phoneEl.value.trim(),
        "",
        "Special requests:",
        notesEl.value.trim() || "(none)",
        "",
        "Room total: " + currency(totals.roomTotal),
        "Taxes & fees: " + currency(totals.fees),
        "Final total: " + currency(totals.total),
      ].join("\n"),
    };

    return fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }).catch(function () {
      return null;
    });
  }

  function render(state) {
    var room = ROOM_DATA[state.room];
    var nights = getNightCount(state);
    var roomTotal = room.price * nights;
    var fees = roomTotal * TAX_RATE;
    var total = roomTotal + fees;

    roomTitleEl.textContent = room.label;
    roomMetaEl.textContent = room.meta;
    roomImageEl.src = room.image;
    roomImageEl.alt = room.label + " at Derand Hotel";
    roomRateEl.textContent = currency(room.price) + " / night";
    checkinEl.textContent = formatDate(state.checkin);
    checkoutEl.textContent = formatDate(state.checkout);
    guestsEl.textContent = guestSummary(state.adults, state.children);
    nightsEl.textContent = nights + " " + (nights === 1 ? "night" : "nights");
    roomTotalLabelEl.textContent =
      "Room total (" + nights + " " + (nights === 1 ? "night" : "nights") + ")";
    roomTotalEl.textContent = currency(roomTotal);
    feesEl.textContent = currency(fees);
    totalEl.textContent = currency(total);
    backLinkEl.href = buildBackUrl(state);

    return {
      roomTotal: roomTotal,
      fees: fees,
      total: total,
      nights: nights,
      room: room,
    };
  }

  function setMethod(method) {
    selectedMethod = method;
    methodButtons.forEach(function (button) {
      var active = button.dataset.method === method;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  var state = loadState();
  var renderState = render(state);

  methodButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setMethod(button.dataset.method || "card");
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) return;

    setStatus("Preparing secure payment...", "");
    notifyHotel(state, renderState.room, renderState.nights, renderState).finally(function () {
      setStatus("Redirecting to HotelRunner secure checkout...", "success");
      window.setTimeout(function () {
        window.location.href = buildHotelRunnerUrl(state);
      }, 650);
    });
  });
})();
