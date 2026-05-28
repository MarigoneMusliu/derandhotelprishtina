(function () {
  var HOTELRUNNER_BASE = "https://derand-hotel.hotelrunner.com/bv3/search";
  var WEB3FORMS_URL = "https://api.web3forms.com/submit";
  var WEB3FORMS_ACCESS_KEY = "761d8dce-87b2-4534-bc76-77ec2305d4ec";
  var NOTIFY_EMAIL = "info@derandhotel.com";
  var TAX_RATE = 0.15;

  var ROOM_DATA = {
    "junior-suite": {
      label: "Junior Suite",
      image: "img/1111.webp",
      price: 119,
      meta: "37 m2 / King bed",
    },
    "deluxe-double": {
      label: "Deluxe Double Room",
      image: "img/deluxeroom4.webp",
      price: 88,
      meta: "30 m2 / King bed",
    },
    "premium-double": {
      label: "Premium Double Room",
      image: "img/premium1.webp",
      price: 99,
      meta: "28 m2 / King bed",
    },
    "superior-twin": {
      label: "Superior Twin Room",
      image: "img/twinbook.jpg",
      price: 72,
      meta: "23 m2 / Twin beds",
    },
    "superior-double": {
      label: "Superior Double Room",
      image: "img/superiorroom3.webp",
      price: 84,
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
  var dateRangeEl = document.getElementById("booking-summary-date-range");
  var stayCountEl = document.getElementById("booking-summary-stay-count");
  var roomTotalLabelEl = document.getElementById("booking-price-room-label");
  var roomTotalEl = document.getElementById("booking-price-room-total");
  var totalEl = document.getElementById("booking-price-total");
  var cancelDeadlineEl = document.getElementById("booking-cancel-deadline");
  var statusEl = document.getElementById("booking-details-status");
  var backLinkEl = document.getElementById("booking-back-link");
  var fullNameEl = document.getElementById("booking-full-name");
  var emailEl = document.getElementById("booking-email");
  var phoneEl = document.getElementById("booking-phone");
  var roomInputEl = document.getElementById("booking-room");
  var checkinInputEl = document.getElementById("booking-checkin");
  var checkoutInputEl = document.getElementById("booking-checkout");
  var adultsInputEl = document.getElementById("booking-adults");
  var childrenInputEl = document.getElementById("booking-children");
  var notesEl = document.getElementById("booking-notes");
  var confirmBtnEl = document.getElementById("booking-confirm");
  var selectedMethod = "hotelrunner";

  function setText(el, value) {
    if (!el) return;
    el.textContent = value;
  }

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

  function shortDateRange(startIso, endIso) {
    var start = parseIso(startIso);
    var end = parseIso(endIso);
    if (!start || !end) return "—";

    var startMonth = start.toLocaleDateString("en-GB", { month: "short" });
    var startDay = start.toLocaleDateString("en-GB", { day: "numeric" });
    var endDay = end.toLocaleDateString("en-GB", { day: "numeric" });
    var month = end.toLocaleDateString("en-GB", { month: "short" });
    var year = end.toLocaleDateString("en-GB", { year: "numeric" });
    return startMonth === month
      ? startDay + "-" + endDay + " " + month + ", " + year
      : formatDate(startIso) + " - " + formatDate(endIso);
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

  function getAdultsMaxForRoom(roomKey) {
    return roomKey === "premium-double" ? 3 : 2;
  }

  function getRoomBasePrice(roomKey, adults) {
    if (roomKey === "junior-suite") {
      return adults >= 2 ? 125 : 119;
    }
    if (roomKey === "premium-double") {
      return adults >= 3 ? 140 : 104;
    }
    if (roomKey === "deluxe-double") {
      return adults >= 2 ? 93 : 88;
    }
    if (roomKey === "superior-twin") {
      return adults >= 2 ? 84 : 72;
    }
    var room = ROOM_DATA[roomKey];
    return room ? room.price : 0;
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
    var parsedAdults = parseInt(params.get("adults"), 10);
    if (isNaN(parsedAdults)) parsedAdults = 1;
    var adults = Math.max(1, Math.min(getAdultsMaxForRoom(room), parsedAdults));
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

  function syncGuestStateFromInputs() {
    if (roomInputEl && ROOM_DATA[roomInputEl.value]) {
      state.room = roomInputEl.value;
    }
    if (checkinInputEl && checkinInputEl.value) {
      state.checkin = checkinInputEl.value;
    }
    if (checkoutInputEl && checkoutInputEl.value) {
      state.checkout = checkoutInputEl.value;
    }
    if (adultsInputEl) {
      var typedAdults = parseInt(adultsInputEl.value, 10);
      if (isNaN(typedAdults)) typedAdults = 1;
      state.adults = Math.min(getAdultsMaxForRoom(state.room), Math.max(1, typedAdults));
      adultsInputEl.value = String(state.adults);
    }
    if (childrenInputEl) {
      var typedChildren = parseInt(childrenInputEl.value, 10);
      if (isNaN(typedChildren)) typedChildren = 0;
      state.children = Math.min(2, Math.max(0, typedChildren));
      childrenInputEl.value = String(state.children);
    }
  }

  function forceNativeSelect(selectEl) {
    if (!selectEl) return;
    selectEl.classList.add("booking-native-select");
    selectEl.disabled = false;
    selectEl.style.display = "block";
    selectEl.style.opacity = "1";
    selectEl.style.visibility = "visible";
    selectEl.style.pointerEvents = "auto";
    selectEl.style.position = "relative";
    selectEl.style.zIndex = "3";
    var sibling = selectEl.nextElementSibling;
    if (sibling && sibling.classList && sibling.classList.contains("nice-select")) {
      sibling.parentNode.removeChild(sibling);
    }
  }

  function lockSelectToNative(selectEl) {
    if (!selectEl || !selectEl.parentNode) return;
    forceNativeSelect(selectEl);
    var observer = new MutationObserver(function () {
      forceNativeSelect(selectEl);
      var next = selectEl.nextElementSibling;
      if (next && next.classList && next.classList.contains("nice-select")) {
        next.parentNode.removeChild(next);
      }
    });
    observer.observe(selectEl.parentNode, { childList: true, subtree: false });
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
    var start = parseIso(state.checkin);
    var end = parseIso(state.checkout);

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

    var adultsCount = parseInt(adultsInputEl && adultsInputEl.value, 10) || 0;
    var adultsMax = getAdultsMaxForRoom(state.room);
    if (!adultsInputEl || adultsCount < 1 || adultsCount > adultsMax) {
      if (adultsInputEl) markError(adultsInputEl);
      valid = false;
    }

    if (!ROOM_DATA[state.room]) {
      if (roomInputEl) markError(roomInputEl);
      valid = false;
    }

    if (!start || !end || end <= start) {
      if (checkinInputEl) markError(checkinInputEl);
      if (checkoutInputEl) markError(checkoutInputEl);
      valid = false;
    }

    if (!valid) {
      setStatus("Please complete the highlighted guest details.", "error");
    }

    return valid;
  }

  function notifyHotel(state, room, nights, totals) {
    var submittedAt = new Date().toISOString();
    var checkInFormatted = formatDate(state.checkin);
    var checkOutFormatted = formatDate(state.checkout);
    var guestEmail = emailEl.value.trim();
    var guestName = fullNameEl.value.trim();
    var guestPhone = phoneEl.value.trim();
    var payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "Booking details — " + room.label + " — " + state.checkin,
      from_name: "Derand Hotel Booking Details",
      email: NOTIFY_EMAIL,
      replyto: guestEmail,
      to_email: NOTIFY_EMAIL,
      recipient: NOTIFY_EMAIL,
      notify_email: NOTIFY_EMAIL,
      name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      guest_name: guestName,
      booking_room: room.label,
      booking_checkin: state.checkin,
      booking_checkout: state.checkout,
      booking_nights: String(nights),
      booking_adults: String(state.adults),
      booking_children: String(state.children),
      booking_total: currency(totals.total),
      submitted_at: submittedAt,
      message: [
        "Recipient: " + NOTIFY_EMAIL,
        "",
        "New booking details submission — Derand Hotel",
        "",
        "Submitted at: " + submittedAt,
        "Room type: " + room.label,
        "Check-in: " + checkInFormatted + " (" + state.checkin + ")",
        "Check-out: " + checkOutFormatted + " (" + state.checkout + ")",
        "Adults: " + state.adults,
        "Children: " + state.children,
        "Stay: " + checkInFormatted + " to " + checkOutFormatted,
        "Guests summary: " + guestSummary(state.adults, state.children),
        "Nights: " + nights,
        "Payment preference: " + selectedMethod,
        "",
        "Guest name: " + guestName,
        "Email: " + guestEmail,
        "Phone: " + guestPhone,
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
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }).then(function (response) {
      return response.json().then(function (data) {
        return { ok: response.ok, json: data };
      });
    });
  }

  function buildEmailMessage(state, room, nights, totals) {
    return [
      "New booking details submission — Derand Hotel",
      "",
      "Room type: " + room.label,
      "Check-in: " + formatDate(state.checkin),
      "Check-out: " + formatDate(state.checkout),
      "Adults: " + state.adults,
      "Children: " + state.children,
      "Stay: " + formatDate(state.checkin) + " to " + formatDate(state.checkout),
      "Guests summary: " + guestSummary(state.adults, state.children),
      "Nights: " + nights,
      "",
      "Guest name: " + fullNameEl.value.trim(),
      "Email: " + emailEl.value.trim(),
      "Phone: " + phoneEl.value.trim(),
      "",
      "Special requests:",
      notesEl.value.trim() || "(none)",
      "",
      "Room total: " + currency(totals.roomTotal),
      "Final total: " + currency(totals.total),
    ].join("\n");
  }

  function openEmailDraft(state, room, nights, totals) {
    var subject = encodeURIComponent(
      "Booking details — " + room.label + " — " + state.checkin,
    );
    var body = encodeURIComponent(buildEmailMessage(state, room, nights, totals));
    window.location.href = "mailto:" + NOTIFY_EMAIL + "?subject=" + subject + "&body=" + body;
  }

  function render(state) {
    var room = ROOM_DATA[state.room];
    var nights = getNightCount(state);
    var roomTotal = getRoomBasePrice(state.room, state.adults);
    var fees = 0;
    var discount = 0;
    var total = roomTotal;
    var cancelDeadline = parseIso(state.checkin);

    if (cancelDeadline) {
      cancelDeadline.setDate(cancelDeadline.getDate() - 4);
    }

    setText(roomTitleEl, room.label);
    setText(roomMetaEl, room.meta);
    if (roomImageEl) {
      roomImageEl.src = room.image;
      roomImageEl.alt = room.label + " at Derand Hotel";
    }
    if (state.room === "premium-double") {
      setText(roomRateEl, currency(roomTotal) + " / room");
      setText(roomTotalLabelEl, room.label + " (per room)");
    } else {
      setText(roomRateEl, currency(roomTotal) + " / night");
      setText(roomTotalLabelEl, room.label + " (per night)");
    }
    setText(checkinEl, formatDate(state.checkin));
    setText(checkoutEl, formatDate(state.checkout));
    setText(guestsEl, guestSummary(state.adults, state.children));
    setText(nightsEl, nights + " " + (nights === 1 ? "night" : "nights"));
    setText(dateRangeEl, shortDateRange(state.checkin, state.checkout));
    setText(stayCountEl, nights + " " + (nights === 1 ? "Night" : "Nights"));
    setText(roomTotalEl, currency(roomTotal));
    setText(totalEl, currency(total));
    setText(cancelDeadlineEl, cancelDeadline ? formatDate(formatIso(cancelDeadline)) : "—");
    if (backLinkEl) {
      backLinkEl.href = buildBackUrl(state);
    }

    if (roomInputEl) roomInputEl.value = state.room;
    if (checkinInputEl) checkinInputEl.value = state.checkin;
    if (checkoutInputEl) checkoutInputEl.value = state.checkout;
    if (adultsInputEl) adultsInputEl.value = String(state.adults);
    if (childrenInputEl) childrenInputEl.value = String(state.children);
    return {
      roomTotal: roomTotal,
      fees: fees,
      discount: discount,
      total: total,
      nights: nights,
      room: room,
    };
  }

  var state = loadState();
  var renderState = render(state);

  lockSelectToNative(roomInputEl);
  window.setTimeout(function () {
    forceNativeSelect(roomInputEl);
  }, 120);
  window.addEventListener("load", function () {
    forceNativeSelect(roomInputEl);
  });

  if (roomInputEl) {
    roomInputEl.addEventListener("change", function () {
      syncGuestStateFromInputs();
      renderState = render(state);
    });
  }

  if (checkinInputEl) {
    checkinInputEl.addEventListener("change", function () {
      syncGuestStateFromInputs();
      renderState = render(state);
    });
  }

  if (checkoutInputEl) {
    checkoutInputEl.addEventListener("change", function () {
      syncGuestStateFromInputs();
      renderState = render(state);
    });
  }

  if (adultsInputEl) {
    adultsInputEl.addEventListener("change", function () {
      syncGuestStateFromInputs();
      renderState = render(state);
    });
  }

  if (childrenInputEl) {
    childrenInputEl.addEventListener("change", function () {
      syncGuestStateFromInputs();
      renderState = render(state);
    });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll(".booking-stepper__btn"),
    function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-stepper-target");
        var action = btn.getAttribute("data-stepper-action");
        var input = document.getElementById(targetId);
        if (!input) return;

        var current = parseInt(input.value, 10);
        if (isNaN(current)) current = targetId === "booking-adults" ? 1 : 0;

        var min = targetId === "booking-adults" ? 1 : 0;
        var max = targetId === "booking-adults" ? getAdultsMaxForRoom(state.room) : 2;
        var next = action === "increment" ? current + 1 : current - 1;
        next = Math.min(max, Math.max(min, next));
        input.value = String(next);

        syncGuestStateFromInputs();
        renderState = render(state);
      });
    },
  );

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    syncGuestStateFromInputs();
    renderState = render(state);
    if (!form.checkValidity()) {
      form.reportValidity();
      window.alert("Please fill all fields except Children and Special Requests before confirming your booking.");
      return;
    }
    if (!validate()) return;

    setStatus("Sending…", "success");
    notifyHotel(state, renderState.room, renderState.nights, renderState)
      .then(function (result) {
        if (!result || !result.ok || !result.json || !result.json.success) {
          throw new Error(
            (result && result.json && result.json.message) || "Submit failed",
          );
        }
        setStatus("Thank you — we received your message.", "success");
        form.reset();
        syncGuestStateFromInputs();
        renderState = render(state);
        clearErrors();
      })
      .catch(function (error) {
        setStatus(
          "Something went wrong (" +
            (error && error.message ? error.message : "send failed") +
            "). Please email info@derandhotel.com.",
          "error",
        );
      })
      .finally(function () {
        if (confirmBtnEl) confirmBtnEl.disabled = false;
      });
  });
})();
