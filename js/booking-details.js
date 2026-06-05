(function () {
  var HOTELRUNNER_BASE = "https://derand-hotel.hotelrunner.com/bv3/search";
  var WEB3FORMS_URL = "https://api.web3forms.com/submit";
  var WEB3FORMS_ACCESS_KEY = "761d8dce-87b2-4534-bc76-77ec2305d4ec";
  var NOTIFY_EMAIL = "info@derandhotel.com";
  var TAX_RATE = 0.15;

  var ROOM_DATA = {
    "junior-suite": {
      labelKey: "bd-room-junior-suite-label",
      metaKey: "bd-room-junior-suite-meta",
      image: "img/1111.webp",
      price: 119,
    },
    "deluxe-double": {
      labelKey: "bd-room-deluxe-double-label",
      metaKey: "bd-room-deluxe-double-meta",
      image: "img/deluxeroom4.webp",
      price: 88,
    },
    "premium-double": {
      labelKey: "bd-room-premium-double-label",
      metaKey: "bd-room-premium-double-meta",
      image: "img/premium1.webp",
      price: 99,
    },
    "superior-twin": {
      labelKey: "bd-room-superior-twin-label",
      metaKey: "bd-room-superior-twin-meta",
      image: "img/twinbook.jpg",
      price: 72,
    },
    "superior-double": {
      labelKey: "bd-room-superior-double-label",
      metaKey: "bd-room-superior-double-meta",
      image: "img/superiorroom3.webp",
      price: 84,
    },
  };

  var lastStatus = { key: "", state: "", vars: null };

  function t(key, vars) {
    if (window.BookingDetailsI18n && typeof window.BookingDetailsI18n.t === "function") {
      return window.BookingDetailsI18n.t(key, null, vars);
    }
    return key;
  }

  function getDateLocale() {
    var lang =
      window.BookingDetailsI18n &&
      typeof window.BookingDetailsI18n.currentLang === "function"
        ? window.BookingDetailsI18n.currentLang()
        : "en";
    if (lang === "de") return "de-DE";
    if (lang === "al") return "sq-AL";
    return "en-GB";
  }

  function getNumberLocale() {
    return getDateLocale();
  }

  function getRoomInfo(roomKey) {
    var data = ROOM_DATA[roomKey];
    if (!data) {
      return { label: "", meta: "", image: "", price: 0 };
    }
    return {
      label: t(data.labelKey),
      meta: t(data.metaKey),
      image: data.image,
      price: data.price,
    };
  }

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
  var summaryRowsEl = document.getElementById("booking-summary-rows");
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
  var childAgesWrapEl = document.getElementById("booking-child-ages");
  var childAgesInputsEl = document.getElementById("booking-child-ages-inputs");
  var notesEl = document.getElementById("booking-notes");
  var extrasDeliveryPanelEl = document.getElementById("booking-extras-delivery");
  var extrasDeliveryDateEl = document.getElementById("booking-extras-delivery-date");
  var extrasDeliveryTimeEl = document.getElementById("booking-extras-delivery-time");
  var extrasDeliveryNotesEl = document.getElementById("booking-extras-delivery-notes");
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
    if (!date) return "\u2014";
    return date.toLocaleDateString(getDateLocale(), {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function currency(amount) {
    return new Intl.NumberFormat(getNumberLocale(), {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  function shortDateRange(startIso, endIso) {
    var start = parseIso(startIso);
    var end = parseIso(endIso);
    if (!start || !end) return "\u2014";

    var locale = getDateLocale();
    var startMonth = start.toLocaleDateString(locale, { month: "short" });
    var startDay = start.toLocaleDateString(locale, { day: "numeric" });
    var endDay = end.toLocaleDateString(locale, { day: "numeric" });
    var month = end.toLocaleDateString(locale, { month: "short" });
    var year = end.toLocaleDateString(locale, { year: "numeric" });
    return startMonth === month
      ? startDay + "-" + endDay + " " + month + ", " + year
      : formatDate(startIso) + " - " + formatDate(endIso);
  }

  function guestSummary(adults, children) {
    var parts = [];
    if (adults > 0) {
      parts.push(
        adults + " " + t(adults === 1 ? "bd-guest-adult" : "bd-guest-adults"),
      );
    }
    if (children > 0) {
      parts.push(
        children + " " + t(children === 1 ? "bd-guest-child" : "bd-guest-children"),
      );
    }
    return parts.join(", ") || t("bd-no-guests");
  }

  function getAdultsMaxForRoom(roomKey) {
    return roomKey === "premium-double" ? 3 : 2;
  }

  function isPremiumRoom(roomKey) {
    return roomKey === "premium-double";
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
    var adults = parseInt(params.get("adults"), 10) || 1;
    var children = parseInt(params.get("children"), 10) || 0;
    if (!isPremiumRoom(room)) children = 0;

    var start = parseIso(checkin);
    var end = parseIso(checkout);
    if (!start || !end || end <= start) {
      checkin = formatIso(today);
      checkout = formatIso(tomorrow);
    }

    var legacyExtras = [];
    if (window.DerandBooking) {
      legacyExtras = window.DerandBooking.parseExtrasParam(params.get("extras"));
    }

    return {
      room: room,
      checkin: checkin,
      checkout: checkout,
      adults: adults,
      children: children,
      childAges: [],
      extraLines: window.DerandBooking
        ? window.DerandBooking.getBookingLinesForState(legacyExtras)
        : [],
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

  function buildExtrasPickerUrl(state, focusId) {
    var params = new URLSearchParams();
    params.set("from", "booking");
    params.set("room", state.room);
    params.set("checkin", state.checkin);
    params.set("checkout", state.checkout);
    params.set("adults", String(state.adults));
    params.set("children", String(state.children));
    if (focusId) params.set("focus", focusId);
    return "extra.html?" + params.toString();
  }

  function updateConciergePrompt(state) {
    var choicesEl = document.getElementById("booking-concierge-choices");
    if (!choicesEl) return;

    Array.prototype.forEach.call(
      choicesEl.querySelectorAll("[data-extra-focus]"),
      function (chip) {
        var id = chip.getAttribute("data-extra-focus");
        chip.href = buildExtrasPickerUrl(state, id);
        var isOn =
          window.DerandBooking &&
          window.DerandBooking.categoryHasExtras(state.extraLines || [], id);
        chip.classList.toggle("is-added", isOn);
      },
    );
  }

  function getExtraLineTotal(item) {
    if (!item) return 0;
    return window.DerandBooking
      ? window.DerandBooking.lineTotal(item)
      : (item.price || 0) * (item.qty || 1);
  }

  function removeExtraAtIndex(index) {
    if (!state.extraLines || index < 0 || index >= state.extraLines.length) return;
    state.extraLines.splice(index, 1);
    if (window.DerandBooking) {
      window.DerandBooking.saveBookingLines(state.extraLines);
    }
    renderState = render(state);
  }

  function buildExtraRemoveButton(index, label) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "booking-extra-remove";
    btn.setAttribute("data-extra-index", String(index));
    btn.setAttribute("aria-label", t("bd-remove-extra", { label: label }));
    btn.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
    return btn;
  }

  function getExtrasTotal(state) {
    if (!window.DerandBooking) return 0;
    return window.DerandBooking.getBookingLinesTotal(state.extraLines || []);
  }

  function hasBookingExtras(state) {
    return !!(state.extraLines && state.extraLines.length);
  }

  function getExtrasDeliveryFromForm() {
    return {
      date: extrasDeliveryDateEl ? extrasDeliveryDateEl.value.trim() : "",
      time: extrasDeliveryTimeEl ? extrasDeliveryTimeEl.value.trim() : "",
      notes: extrasDeliveryNotesEl ? extrasDeliveryNotesEl.value.trim() : "",
    };
  }

  function isDeliveryDateWithinStay(deliveryIso, checkinIso, checkoutIso) {
    var delivery = parseIso(deliveryIso);
    var checkin = parseIso(checkinIso);
    var checkout = parseIso(checkoutIso);
    if (!delivery || !checkin || !checkout) return false;
    return delivery >= checkin && delivery <= checkout;
  }

  function updateExtrasDeliveryPanel(state) {
    if (!extrasDeliveryPanelEl) return;
    var show = hasBookingExtras(state);
    extrasDeliveryPanelEl.hidden = !show;

    if (!show) {
      if (extrasDeliveryDateEl) extrasDeliveryDateEl.value = "";
      if (extrasDeliveryTimeEl) extrasDeliveryTimeEl.value = "";
      if (extrasDeliveryNotesEl) extrasDeliveryNotesEl.value = "";
      return;
    }

    if (extrasDeliveryDateEl) {
      extrasDeliveryDateEl.min = state.checkin;
      extrasDeliveryDateEl.max = state.checkout;
      extrasDeliveryDateEl.required = true;
      if (
        !extrasDeliveryDateEl.value ||
        !isDeliveryDateWithinStay(
          extrasDeliveryDateEl.value,
          state.checkin,
          state.checkout,
        )
      ) {
        extrasDeliveryDateEl.value = state.checkin;
      }
    }
    if (extrasDeliveryTimeEl) {
      extrasDeliveryTimeEl.required = true;
    }
  }

  function formatExtrasList(extraLines) {
    if (!extraLines || !extraLines.length) return t("bd-extras-none");
    return extraLines
      .map(function (item) {
        var qty = item.qty && item.qty > 1 ? " × " + item.qty : "";
        var total = window.DerandBooking
          ? window.DerandBooking.lineTotal(item)
          : (item.price || 0) * (item.qty || 1);
        return item.label + qty + " (" + currency(total) + ")";
      })
      .join("; ");
  }

  function renderExtrasRows(state) {
    if (!summaryRowsEl) return;
    Array.prototype.forEach.call(
      summaryRowsEl.querySelectorAll(".booking-summary-card__row--extra"),
      function (row) {
        row.parentNode.removeChild(row);
      },
    );
    if (!state.extraLines || !state.extraLines.length) return;

    state.extraLines.forEach(function (item, index) {
      var row = document.createElement("div");
      row.className = "booking-summary-card__row booking-summary-card__row--extra";
      var qtyLabel = item.qty && item.qty > 1 ? " (" + item.qty + "×)" : "";

      var labelSpan = document.createElement("span");
      labelSpan.className = "booking-summary-card__extra-label";
      labelSpan.textContent = item.label + qtyLabel;

      var end = document.createElement("span");
      end.className = "booking-summary-card__extra-end";

      var priceStrong = document.createElement("strong");
      priceStrong.textContent = currency(getExtraLineTotal(item));

      end.appendChild(priceStrong);
      end.appendChild(buildExtraRemoveButton(index, item.label));

      row.appendChild(labelSpan);
      row.appendChild(end);
      summaryRowsEl.appendChild(row);
    });
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

  function getChildrenSurcharge(roomKey, childAges) {
    if (!isPremiumRoom(roomKey)) return 0;
    return (childAges || []).reduce(function (sum, age) {
      var n = parseInt(age, 10);
      if (isNaN(n)) return sum;
      return sum + (n > 3 ? 20 : 0);
    }, 0);
  }

  function syncChildAgesLength() {
    if (!state.childAges || !Array.isArray(state.childAges)) {
      state.childAges = [];
    }
    var needed = Math.max(0, state.children || 0);
    while (state.childAges.length < needed) {
      state.childAges.push("");
    }
    if (state.childAges.length > needed) {
      state.childAges = state.childAges.slice(0, needed);
    }
  }

  function renderChildAgeInputs() {
    if (!childAgesWrapEl || !childAgesInputsEl) return;
    var visible = isPremiumRoom(state.room) && state.children > 0;
    childAgesWrapEl.classList.toggle("is-visible", visible);
    childAgesInputsEl.innerHTML = "";
    if (!visible) return;

    syncChildAgesLength();
    state.childAges.forEach(function (value, index) {
      var row = document.createElement("div");
      row.className = "booking-child-ages__row";

      var label = document.createElement("label");
      label.className = "booking-child-ages__label";
      label.setAttribute("for", "booking-child-age-" + index);
      label.textContent = t("bd-child-age-label", { num: index + 1 });

      var input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.max = "17";
      input.step = "1";
      input.id = "booking-child-age-" + index;
      input.value = value === "" ? "" : String(value);
      input.placeholder = t("bd-child-age-placeholder");
      input.required = true;
      input.addEventListener("input", function () {
        state.childAges[index] = input.value;
        renderState = render(state);
      });

      row.appendChild(label);
      row.appendChild(input);
      childAgesInputsEl.appendChild(row);
    });
  }

  function enforceChildrenPolicy(showAlert) {
    if (!isPremiumRoom(state.room) && state.children > 0) {
      state.children = 0;
      state.childAges = [];
      if (childrenInputEl) childrenInputEl.value = "0";
      if (showAlert) {
        window.alert(t("bd-alert-children-premium"));
      }
    }
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
    enforceChildrenPolicy(false);
    syncChildAgesLength();
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

  function setStatus(key, type, vars) {
    lastStatus = { key: key || "", state: type || "", vars: vars || null };
    statusEl.textContent = key ? t(key, vars) : "";
    statusEl.className = "booking-details__status" + (type ? " is-" + type : "");
  }

  function refreshStatusMessage() {
    if (!lastStatus.key) return;
    setStatus(lastStatus.key, lastStatus.state, lastStatus.vars);
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

    if (isPremiumRoom(state.room) && state.children > 0) {
      syncChildAgesLength();
      var hasInvalidChildAge = state.childAges.some(function (age) {
        var n = parseInt(age, 10);
        return isNaN(n) || n < 0;
      });
      if (hasInvalidChildAge) {
        if (childAgesWrapEl) childAgesWrapEl.classList.add("is-invalid");
        valid = false;
      } else if (childAgesWrapEl) {
        childAgesWrapEl.classList.remove("is-invalid");
      }
    } else if (childAgesWrapEl) {
      childAgesWrapEl.classList.remove("is-invalid");
    }

    if (hasBookingExtras(state)) {
      var delivery = getExtrasDeliveryFromForm();
      if (!delivery.date) {
        if (extrasDeliveryDateEl) markError(extrasDeliveryDateEl);
        valid = false;
      } else if (!isDeliveryDateWithinStay(delivery.date, state.checkin, state.checkout)) {
        if (extrasDeliveryDateEl) markError(extrasDeliveryDateEl);
        valid = false;
      }
      if (!delivery.time) {
        if (extrasDeliveryTimeEl) markError(extrasDeliveryTimeEl);
        valid = false;
      }
    }

    if (!valid) {
      var deliveryMissing =
        hasBookingExtras(state) &&
        (!getExtrasDeliveryFromForm().date || !getExtrasDeliveryFromForm().time);
      setStatus(
        deliveryMissing ? "bd-status-delivery-required" : "bd-status-guest-required",
        "error",
      );
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
    var extrasDelivery = hasBookingExtras(state) ? getExtrasDeliveryFromForm() : null;
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
      booking_child_ages: (state.childAges || []).join(", "),
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
        "Children ages: " + ((state.childAges && state.childAges.length) ? state.childAges.join(", ") : "(none)"),
        "Children surcharge: " + currency(totals.childSurcharge || 0),
        "Concierge extras: " + formatExtrasList(state.extraLines),
        "Extras total: " + currency(totals.extrasTotal || 0),
        extrasDelivery
          ? "Extras delivery date: " + formatDate(extrasDelivery.date) + " (" + extrasDelivery.date + ")"
          : "Extras delivery date: (not applicable)",
        extrasDelivery
          ? "Extras delivery time: " + extrasDelivery.time
          : "Extras delivery time: (not applicable)",
        extrasDelivery
          ? "Extras delivery notes: " + (extrasDelivery.notes || "(none)")
          : "Extras delivery notes: (not applicable)",
        "Stay: " + checkInFormatted + " to " + checkOutFormatted,
        "Guests summary: " + guestSummary(state.adults, state.children),
        "Nights: " + nights,
        "Rate per night: " + currency(totals.pricePerNight || 0),
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
        "Extras total: " + currency(totals.extrasTotal || 0),
        "Taxes & fees: " + currency(totals.fees),
        "Final total (one payment): " + currency(totals.total),
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
    var lines = [
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
      "Concierge extras: " + formatExtrasList(state.extraLines),
    ];
    if (hasBookingExtras(state)) {
      var delivery = getExtrasDeliveryFromForm();
      lines.push(
        "Extras delivery: " + formatDate(delivery.date) + " at " + delivery.time,
      );
      if (delivery.notes) {
        lines.push("Extras delivery notes: " + delivery.notes);
      }
    }
    lines.push(
      "Room total: " + currency(totals.roomTotal),
      "Extras total: " + currency(totals.extrasTotal || 0),
      "Final total (one payment): " + currency(totals.total),
    );
    return lines.join("\n");
  }

  function openEmailDraft(state, room, nights, totals) {
    var subject = encodeURIComponent(
      "Booking details — " + room.label + " — " + state.checkin,
    );
    var body = encodeURIComponent(buildEmailMessage(state, room, nights, totals));
    window.location.href = "mailto:" + NOTIFY_EMAIL + "?subject=" + subject + "&body=" + body;
  }

  function render(state) {
    var room = getRoomInfo(state.room);
    var nights = getNightCount(state);
    enforceChildrenPolicy(false);
    syncChildAgesLength();
    renderChildAgeInputs();
    var pricePerNight = getRoomBasePrice(state.room, state.adults);
    var childSurchargePerNight = getChildrenSurcharge(state.room, state.childAges);
    var roomTotal = pricePerNight * nights;
    var childSurcharge = childSurchargePerNight * nights;
    var fees = 0;
    var discount = 0;
    var extrasTotal = getExtrasTotal(state);
    var total = roomTotal + childSurcharge + extrasTotal;
    var cancelDeadline = parseIso(state.checkin);

    if (cancelDeadline) {
      cancelDeadline.setDate(cancelDeadline.getDate() - 4);
    }

    setText(roomTitleEl, room.label);
    setText(roomMetaEl, room.meta);
    if (roomImageEl) {
      roomImageEl.src = room.image;
      roomImageEl.alt = t("bd-summary-room-alt", { room: room.label });
    }
    var nightsLabel = nights + " " + t(nights === 1 ? "bd-night" : "bd-nights");
    if (state.room === "premium-double") {
      setText(
        roomRateEl,
        t("bd-rate-per-night-room", { price: currency(pricePerNight) }),
      );
    } else {
      setText(roomRateEl, t("bd-rate-per-night", { price: currency(pricePerNight) }));
    }
    setText(
      roomTotalLabelEl,
      t("bd-room-total-label", { room: room.label, nights: nightsLabel }),
    );
    setText(checkinEl, formatDate(state.checkin));
    setText(checkoutEl, formatDate(state.checkout));
    setText(guestsEl, guestSummary(state.adults, state.children));
    setText(nightsEl, nights + " " + t(nights === 1 ? "bd-night" : "bd-nights"));
    setText(dateRangeEl, shortDateRange(state.checkin, state.checkout));
    setText(
      stayCountEl,
      nights + " " + t(nights === 1 ? "bd-night-cap" : "bd-nights-cap"),
    );
    setText(roomTotalEl, currency(roomTotal));
    renderExtrasRows(state);
    updateExtrasDeliveryPanel(state);
    setText(totalEl, currency(total));
    setText(cancelDeadlineEl, cancelDeadline ? formatDate(formatIso(cancelDeadline)) : "—");
    if (backLinkEl) {
      backLinkEl.href = buildBackUrl(state);
    }
    updateConciergePrompt(state);

    if (roomInputEl) roomInputEl.value = state.room;
    if (checkinInputEl) checkinInputEl.value = state.checkin;
    if (checkoutInputEl) checkoutInputEl.value = state.checkout;
    if (adultsInputEl) adultsInputEl.value = String(state.adults);
    if (childrenInputEl) childrenInputEl.value = String(state.children);
    return {
      pricePerNight: pricePerNight,
      roomTotal: roomTotal,
      childSurcharge: childSurcharge,
      extrasTotal: extrasTotal,
      fees: fees,
      discount: discount,
      total: total,
      nights: nights,
      room: room,
    };
  }

  var state;
  var renderState;

  function refreshBookingDetailsView() {
    if (!state) {
      state = loadState();
    }
    renderState = render(state);
    refreshStatusMessage();
  }

  document.addEventListener("DOMContentLoaded", function () {
    refreshBookingDetailsView();
  });

  window.addEventListener("load", function () {
    window.setTimeout(refreshBookingDetailsView, 150);
  });

  document.addEventListener("derand:languagechange", function () {
    refreshBookingDetailsView();
  });

  document.addEventListener("click", function (event) {
    var removeBtn = event.target.closest(".booking-extra-remove");
    if (!removeBtn) return;
    event.preventDefault();
    var index = parseInt(removeBtn.getAttribute("data-extra-index"), 10);
    if (isNaN(index)) return;
    removeExtraAtIndex(index);
  });

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
        if (
          targetId === "booking-children" &&
          action === "increment" &&
          !isPremiumRoom(state.room)
        ) {
          window.alert(t("bd-alert-children-premium"));
          state.children = 0;
          input.value = "0";
          syncGuestStateFromInputs();
          renderState = render(state);
          return;
        }
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
      window.alert(t("bd-alert-form-incomplete"));
      return;
    }
    if (!validate()) return;

    setStatus("bd-status-sending", "success");
    notifyHotel(state, renderState.room, renderState.nights, renderState)
      .then(function (result) {
        if (!result || !result.ok || !result.json || !result.json.success) {
          throw new Error(
            (result && result.json && result.json.message) || "Submit failed",
          );
        }
        setStatus("bd-status-thanks", "success");
        form.reset();
        syncGuestStateFromInputs();
        renderState = render(state);
        clearErrors();
      })
      .catch(function (error) {
        setStatus("bd-status-error", "error", {
          message: (error && error.message) || "send failed",
        });
      })
      .finally(function () {
        if (confirmBtnEl) confirmBtnEl.disabled = false;
      });
  });
})();
