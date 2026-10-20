(function () {
  var HOTELRUNNER_BASE = "https://derand-hotel.hotelrunner.com/bv3/search";
  var PAYMENT_CREATE_URL =
    (window.location.origin || "") + "/api/raiaccept-create-booking-checkout.php";
  var PAYMENT_STATUS_URL =
    (window.location.origin || "") + "/api/raiaccept-order-status.php";
  var PAYMENT_CONFIRM_EMAIL_URL =
    (window.location.origin || "") + "/api/raiaccept-booking-confirm.php";
  var OTELLO_CREATE_URL =
    (window.location.origin || "") + "/api/otello-create-reservation.php";
  var PENDING_PAYMENT_STORAGE_KEY = "derandBookingPendingPayments";

  var ROOM_DATA = {
    "superior-double": {
      labelKey: "bd-room-superior-double-label",
      metaKey: "bd-room-superior-double-meta",
      image: "img/superiorheader.webp",
      price: 80,
    },
    "deluxe-double": {
      labelKey: "bd-room-deluxe-double-label",
      metaKey: "bd-room-deluxe-double-meta",
      image: "img/deluxeroom4.webp",
      price: 105,
    },
    "premium-double": {
      labelKey: "bd-room-premium-double-label",
      metaKey: "bd-room-premium-double-meta",
      image: "img/premium1.webp",
      price: 120,
    },
    "superior-twin": {
      labelKey: "bd-room-superior-twin-label",
      metaKey: "bd-room-superior-twin-meta",
      image: "img/twinbook.webp",
      price: 95,
    },
    "junior-suite": {
      labelKey: "bd-room-junior-suite-label",
      metaKey: "bd-room-junior-suite-meta",
      image: "img/1111.webp",
      price: 140,
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
  var firstNameEl = document.getElementById("booking-first-name");
  var lastNameEl = document.getElementById("booking-last-name");
  var emailEl = document.getElementById("booking-email");
  function phoneDigitCount(value) {
    return ((value || "").match(/\d/g) || []).length;
  }

  function isPhoneValid(value) {
    var digits = phoneDigitCount(value);
    return digits >= 5 && digits <= 20;
  }

  function normalizePhoneInput(value) {
    return String(value || "")
      .replace(/\D/g, "")
      .slice(0, 20);
  }

  var phoneEl = document.getElementById("booking-phone");
  if (phoneEl) {
    phoneEl.removeAttribute("pattern");
    phoneEl.removeAttribute("title");
    phoneEl.setAttribute("maxlength", "20");
    phoneEl.setAttribute("minlength", "5");
    phoneEl.setAttribute("inputmode", "numeric");
    if (phoneEl.type !== "tel") phoneEl.type = "tel";
    phoneEl.addEventListener("input", function () {
      var normalized = normalizePhoneInput(phoneEl.value);
      if (phoneEl.value !== normalized) {
        phoneEl.value = normalized;
      }
      if (phoneEl.setCustomValidity) {
        phoneEl.setCustomValidity(isPhoneValid(phoneEl.value) ? "" : t("bd-status-phone-invalid"));
      }
    });
  }
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

  function getRoomRateOption(roomKey) {
    if (!roomInputEl) return null;
    return roomInputEl.querySelector('option[value="' + roomKey + '"]');
  }

  function getRoomBasePrice(roomKey, adults) {
    var option = getRoomRateOption(roomKey);
    if (option) {
      var single = parseFloat(option.getAttribute("data-price-night"), 10) || 0;
      var doubleRate = parseFloat(option.getAttribute("data-price-double"), 10);
      var tripleRate = parseFloat(option.getAttribute("data-price-triple"), 10);
      if (adults >= 3 && tripleRate > 0) return tripleRate;
      if (adults >= 2 && doubleRate > 0) return doubleRate;
      if (single > 0) return single;
    }
    if (roomKey === "junior-suite") {
      return 140;
    }
    if (roomKey === "premium-double") {
      if (adults >= 3) return 140;
      if (adults >= 2) return 130;
      return 120;
    }
    if (roomKey === "deluxe-double") {
      return 105;
    }
    if (roomKey === "superior-twin") {
      return adults >= 2 ? 105 : 95;
    }
    if (roomKey === "superior-double") {
      return adults >= 2 ? 90 : 80;
    }
    var room = ROOM_DATA[roomKey];
    return room ? room.price : 0;
  }

  function getRoomStayTotal(roomKey, adults, checkin, checkout) {
    var base = getRoomBasePrice(roomKey, adults);
    if (
      window.DerandBooking &&
      typeof window.DerandBooking.getStayRoomTotal === "function"
    ) {
      return window.DerandBooking.getStayRoomTotal(base, checkin, checkout);
    }
    var nights = getNightCount({ checkin: checkin, checkout: checkout });
    return base * nights;
  }

  function getRoomStayAverageNightly(roomKey, adults, checkin, checkout) {
    var base = getRoomBasePrice(roomKey, adults);
    if (
      window.DerandBooking &&
      typeof window.DerandBooking.getStayAverageNightly === "function"
    ) {
      return window.DerandBooking.getStayAverageNightly(base, checkin, checkout);
    }
    return base;
  }

  function stayBlocksAllRooms(checkin, checkout) {
    return (
      window.DerandBooking &&
      typeof window.DerandBooking.stayOverlapsBlockedNights === "function" &&
      window.DerandBooking.stayOverlapsBlockedNights(checkin, checkout)
    );
  }

  function juniorSuiteFullyBooked(checkin, checkout) {
    return (
      window.DerandBooking &&
      typeof window.DerandBooking.stayOverlapsJuniorSuiteBlocked === "function" &&
      window.DerandBooking.stayOverlapsJuniorSuiteBlocked(checkin, checkout)
    );
  }

  function roomUnavailableForStay(roomKey, checkin, checkout) {
    if (stayBlocksAllRooms(checkin, checkout)) return "blocked";
    if (roomKey === "junior-suite" && juniorSuiteFullyBooked(checkin, checkout)) {
      return "junior";
    }
    return "";
  }

  function alertRoomUnavailable(reason) {
    if (reason === "junior") {
      window.alert(t("bd-status-junior-fully-booked"));
      return;
    }
    window.alert(t("bd-status-blocked-dates"));
  }

  function statusKeyForUnavailable(reason) {
    return reason === "junior"
      ? "bd-status-junior-fully-booked"
      : "bd-status-blocked-dates";
  }

  function loadState() {
    var params = new URLSearchParams(window.location.search);
    var roomKey = params.get("room");
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    var room = ROOM_DATA[roomKey] ? roomKey : "superior-double";
    if (window.__derandTestBookingPage) {
      room = "junior-suite";
    }
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

    if (
      window.DerandBooking &&
      typeof window.DerandBooking.stayOverlapsBlockedNights === "function" &&
      window.DerandBooking.stayOverlapsBlockedNights(checkin, checkout)
    ) {
      var safeStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var safeEnd = new Date(safeStart);
      safeEnd.setDate(safeEnd.getDate() + 1);
      var guard = 0;
      while (
        guard < 40 &&
        window.DerandBooking.stayOverlapsBlockedNights(
          formatIso(safeStart),
          formatIso(safeEnd),
        )
      ) {
        safeStart.setDate(safeStart.getDate() + 1);
        safeEnd = new Date(safeStart);
        safeEnd.setDate(safeEnd.getDate() + 1);
        guard += 1;
      }
      checkin = formatIso(safeStart);
      checkout = formatIso(safeEnd);
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
    var roomPaths = {
      "superior-double": "/BookNowSuperiorDoubleRoom",
      "superior-twin": "/BookNowSuperiorTwinRoom",
      "premium-double": "/BookNowPremiumDoubleRoom",
      "deluxe-double": "/BookNowDeluxeDoubleRoom",
      "junior-suite": "/BookNowJuniorSuite",
    };
    return (roomPaths[state.room] || "/Book") + "?" + params.toString();
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
    return "/Concierge?" + params.toString();
  }

  var conciergeMarqueeMedia = window.matchMedia("(max-width: 767px)");
  var conciergeReducedMotionMedia = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  var conciergeMarqueeResumeTimer = null;
  var conciergeMarqueeRaf = null;
  var conciergeMarqueePaused = false;
  var conciergeMarqueeOffset = 0;
  var conciergeMarqueeTouch = null;
  var conciergeMarqueeSpeed = 0.42;

  function stopConciergeMarqueeAuto() {
    if (conciergeMarqueeRaf) {
      window.cancelAnimationFrame(conciergeMarqueeRaf);
      conciergeMarqueeRaf = null;
    }
  }

  function pauseConciergeMarqueeAuto(resumeAfterMs) {
    conciergeMarqueePaused = true;
    if (conciergeMarqueeResumeTimer) {
      window.clearTimeout(conciergeMarqueeResumeTimer);
      conciergeMarqueeResumeTimer = null;
    }
    if (!resumeAfterMs) return;
    conciergeMarqueeResumeTimer = window.setTimeout(function () {
      conciergeMarqueePaused = false;
      conciergeMarqueeResumeTimer = null;
    }, resumeAfterMs);
  }

  function clearConciergeMarqueeClones(choicesEl) {
    if (!choicesEl) return;
    Array.prototype.forEach.call(
      choicesEl.querySelectorAll(".booking-concierge-prompt__chip--marquee-clone"),
      function (clone) {
        clone.parentNode.removeChild(clone);
      },
    );
    choicesEl.classList.remove("is-marquee-active");
  }

  function syncConciergeMarqueeCloneLabels(choicesEl) {
    var originals = choicesEl.querySelectorAll(
      ".booking-concierge-prompt__chip:not(.booking-concierge-prompt__chip--marquee-clone)",
    );
    var clones = choicesEl.querySelectorAll(
      ".booking-concierge-prompt__chip--marquee-clone",
    );
    Array.prototype.forEach.call(clones, function (clone, index) {
      var source = originals[index % originals.length];
      if (!source) return;
      var sourceLabel = source.querySelector(".booking-concierge-prompt__chip-label");
      var cloneLabel = clone.querySelector(".booking-concierge-prompt__chip-label");
      if (sourceLabel && cloneLabel) {
        cloneLabel.textContent = sourceLabel.textContent;
      }
    });
  }

  function getConciergeMarqueeLoopHalf(choicesEl) {
    if (!choicesEl) return 0;
    return choicesEl.scrollWidth / 2;
  }

  function applyConciergeMarqueeTransform(choicesEl, offset) {
    if (!choicesEl) return;
    choicesEl.style.transform =
      "translate3d(" + -offset.toFixed(2) + "px, 0, 0)";
  }

  function normalizeConciergeMarqueeOffset(offset, loopHalf) {
    if (!loopHalf) return 0;
    offset = offset % loopHalf;
    if (offset < 0) offset += loopHalf;
    return offset;
  }

  function tickConciergeMarquee(choicesEl) {
    if (
      choicesEl &&
      conciergeMarqueeMedia.matches &&
      !conciergeReducedMotionMedia.matches &&
      !conciergeMarqueePaused
    ) {
      var loopHalf = getConciergeMarqueeLoopHalf(choicesEl);
      if (loopHalf > 4) {
        conciergeMarqueeOffset = normalizeConciergeMarqueeOffset(
          conciergeMarqueeOffset + conciergeMarqueeSpeed,
          loopHalf,
        );
        applyConciergeMarqueeTransform(choicesEl, conciergeMarqueeOffset);
      }
    }
    conciergeMarqueeRaf = window.requestAnimationFrame(function () {
      tickConciergeMarquee(choicesEl);
    });
  }

  function startConciergeMarqueeAuto(choicesEl) {
    stopConciergeMarqueeAuto();
    if (
      !choicesEl ||
      !conciergeMarqueeMedia.matches ||
      conciergeReducedMotionMedia.matches
    ) {
      return;
    }
    conciergeMarqueePaused = false;
    conciergeMarqueeRaf = window.requestAnimationFrame(function () {
      tickConciergeMarquee(choicesEl);
    });
  }

  function setupConciergeMarquee() {
    var choicesEl = document.getElementById("booking-concierge-choices");
    var viewportEl = document.getElementById("booking-concierge-choices-viewport");
    if (!choicesEl || !viewportEl) return;

    stopConciergeMarqueeAuto();
    clearConciergeMarqueeClones(choicesEl);
    viewportEl.classList.remove("is-marquee-ready", "is-marquee-dragging");
    viewportEl.scrollLeft = 0;
    choicesEl.style.transform = "";
    conciergeMarqueeOffset = 0;
    conciergeMarqueeTouch = null;

    if (!conciergeMarqueeMedia.matches) return;

    var originals = choicesEl.querySelectorAll(
      ".booking-concierge-prompt__chip:not(.booking-concierge-prompt__chip--marquee-clone)",
    );
    if (!originals.length) return;

    if (!conciergeReducedMotionMedia.matches) {
      Array.prototype.forEach.call(originals, function (chip) {
        var clone = chip.cloneNode(true);
        clone.classList.add("booking-concierge-prompt__chip--marquee-clone");
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("tabindex", "-1");
        choicesEl.appendChild(clone);
      });
      choicesEl.classList.add("is-marquee-active");
    }

    viewportEl.classList.add("is-marquee-ready");

    if (!viewportEl.dataset.marqueeBound) {
      viewportEl.dataset.marqueeBound = "1";

      function beginConciergeMarqueeTouch(clientX) {
        pauseConciergeMarqueeAuto(null);
        conciergeMarqueeTouch = {
          startX: clientX,
          startOffset: conciergeMarqueeOffset,
          moved: false,
        };
        viewportEl.classList.add("is-marquee-dragging");
      }

      function moveConciergeMarqueeTouch(clientX) {
        if (!conciergeMarqueeTouch) return;
        var deltaX = conciergeMarqueeTouch.startX - clientX;
        if (Math.abs(deltaX) > 4) {
          conciergeMarqueeTouch.moved = true;
        }
        var loopHalf = getConciergeMarqueeLoopHalf(choicesEl);
        conciergeMarqueeOffset = normalizeConciergeMarqueeOffset(
          conciergeMarqueeTouch.startOffset + deltaX,
          loopHalf,
        );
        applyConciergeMarqueeTransform(choicesEl, conciergeMarqueeOffset);
      }

      function endConciergeMarqueeTouch(resumeAfterMs) {
        if (!conciergeMarqueeTouch) return;
        var moved = conciergeMarqueeTouch.moved;
        conciergeMarqueeTouch = null;
        viewportEl.classList.remove("is-marquee-dragging");
        pauseConciergeMarqueeAuto(
          resumeAfterMs || (moved ? 2800 : 1800),
        );
      }

      viewportEl.addEventListener(
        "touchstart",
        function (event) {
          if (!event.touches || !event.touches.length) return;
          beginConciergeMarqueeTouch(event.touches[0].clientX);
        },
        { passive: true },
      );

      viewportEl.addEventListener(
        "touchmove",
        function (event) {
          if (!event.touches || !event.touches.length) return;
          moveConciergeMarqueeTouch(event.touches[0].clientX);
        },
        { passive: true },
      );

      viewportEl.addEventListener(
        "touchend",
        function () {
          endConciergeMarqueeTouch(2200);
        },
        { passive: true },
      );

      viewportEl.addEventListener(
        "touchcancel",
        function () {
          endConciergeMarqueeTouch(1800);
        },
        { passive: true },
      );

      viewportEl.addEventListener(
        "pointerdown",
        function (event) {
          if (event.pointerType === "touch") return;
          if (event.pointerType === "mouse" && event.button !== 0) return;
          beginConciergeMarqueeTouch(event.clientX);
        },
        { passive: true },
      );

      viewportEl.addEventListener(
        "pointermove",
        function (event) {
          if (event.pointerType === "touch" || !conciergeMarqueeTouch) return;
          moveConciergeMarqueeTouch(event.clientX);
        },
        { passive: true },
      );

      viewportEl.addEventListener(
        "pointerup",
        function (event) {
          if (event.pointerType === "touch") return;
          endConciergeMarqueeTouch(
            conciergeMarqueeTouch && conciergeMarqueeTouch.moved ? 2800 : 1800,
          );
        },
        { passive: true },
      );

      viewportEl.addEventListener(
        "pointercancel",
        function (event) {
          if (event.pointerType === "touch") return;
          endConciergeMarqueeTouch(1800);
        },
        { passive: true },
      );

      choicesEl.addEventListener(
        "click",
        function (event) {
          if (conciergeMarqueeTouch && conciergeMarqueeTouch.moved) {
            event.preventDefault();
            event.stopPropagation();
          }
        },
        true,
      );
    }

    function ensureConciergeMarqueeStarted(attempts) {
      if (getConciergeMarqueeLoopHalf(choicesEl) > 4 || attempts > 24) {
        startConciergeMarqueeAuto(choicesEl);
        return;
      }
      window.requestAnimationFrame(function () {
        ensureConciergeMarqueeStarted(attempts + 1);
      });
    }

    window.requestAnimationFrame(function () {
      ensureConciergeMarqueeStarted(0);
    });
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

    syncConciergeMarqueeCloneLabels(choicesEl);
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

    if (!firstNameEl.value.trim()) {
      markError(firstNameEl);
      valid = false;
    }

    if (!lastNameEl.value.trim()) {
      markError(lastNameEl);
      valid = false;
    }

    if (!emailEl.value.trim() || emailEl.value.indexOf("@") < 1) {
      markError(emailEl);
      valid = false;
    }

    if (!phoneEl.value.trim() || !isPhoneValid(phoneEl.value)) {
      markError(phoneEl);
      valid = false;
      if (phoneEl.setCustomValidity) {
        phoneEl.setCustomValidity(t("bd-status-phone-invalid"));
      }
    } else if (phoneEl.setCustomValidity) {
      phoneEl.setCustomValidity("");
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
    } else {
      var unavailable = roomUnavailableForStay(
        state.room,
        state.checkin,
        state.checkout,
      );
      if (unavailable) {
        if (checkinInputEl) markError(checkinInputEl);
        if (checkoutInputEl) markError(checkoutInputEl);
        if (roomInputEl) markError(roomInputEl);
        valid = false;
        setStatus(statusKeyForUnavailable(unavailable), "error");
        alertRoomUnavailable(unavailable);
        return false;
      }
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
      var phoneInvalid = phoneEl && phoneEl.value.trim() && !isPhoneValid(phoneEl.value);
      setStatus(
        deliveryMissing
          ? "bd-status-delivery-required"
          : phoneInvalid
            ? "bd-status-phone-invalid"
            : "bd-status-guest-required",
        "error",
      );
    }

    return valid;
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
      "Guest name: " + getGuestFullName(),
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

  function getPendingGuestName(pendingOrder) {
    if (!pendingOrder) return "";
    if (pendingOrder.fullName) return pendingOrder.fullName;
    return (
      (pendingOrder.firstName || "") + " " + (pendingOrder.lastName || "")
    ).trim();
  }

  function getGuestFullName() {
    return (firstNameEl.value.trim() + " " + lastNameEl.value.trim()).trim();
  }

  function splitFullName(value) {
    var parts = value.trim().split(/\s+/).filter(Boolean);
    var firstName = parts.shift() || "";
    return {
      firstName: firstName,
      lastName: parts.join(" ") || firstName,
    };
  }

  function parsePaymentJsonResponse(response) {
    return response.text().then(function (text) {
      var data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          data = {};
        }
      }
      var apiMessage = (data && (data.error || data.message)) || "";
      if (!response.ok || (data && data.ok === false)) {
        throw new Error(apiMessage || t("bd-status-payment-start-error"));
      }
      return data;
    });
  }

  function readPendingPayments() {
    try {
      var raw = localStorage.getItem(PENDING_PAYMENT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function writePendingPayments(value) {
    try {
      localStorage.setItem(PENDING_PAYMENT_STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      /* ignore */
    }
  }

  function savePendingPayment(record) {
    var pending = readPendingPayments();
    pending[record.merchantOrderReference] = record;
    writePendingPayments(pending);
  }

  function getPendingPayment(orderReference) {
    var pending = readPendingPayments();
    return pending[orderReference] || null;
  }

  function removePendingPayment(orderReference) {
    var pending = readPendingPayments();
    if (!pending[orderReference]) return;
    delete pending[orderReference];
    writePendingPayments(pending);
  }

  function buildReturnPath(state) {
    var params = new URLSearchParams();
    params.set("room", state.room);
    params.set("checkin", state.checkin);
    params.set("checkout", state.checkout);
    params.set("adults", String(state.adults));
    params.set("children", String(state.children));
    var path = window.location.pathname || "/Booking-Details";
    if (path === "/" || /\/$/.test(path)) {
      path = "/Booking-Details";
    }
    return path + "?" + params.toString();
  }

  function clearPaymentQuery() {
    if (!window.history || typeof window.history.replaceState !== "function") return;
    var params = new URLSearchParams(window.location.search || "");
    params.delete("payment");
    params.delete("orderRef");
    var query = params.toString();
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + (query ? "?" + query : "") + window.location.hash,
    );
  }

  function getExtraPaymentItems(state) {
    return (state.extraLines || [])
      .map(function (item) {
        var qty = parseInt(item.qty, 10) || 1;
        var unitPrice = Number(item.price) || 0;
        if (qty < 1 || unitPrice <= 0) return null;
        var label = item.label || item.productBase || "Concierge extra";
        if (item.variantLabel && String(label).indexOf(item.variantLabel) === -1) {
          label += " (" + item.variantLabel + ")";
        }
        return {
          description: label,
          quantity: qty,
          unitPrice: unitPrice,
        };
      })
      .filter(Boolean);
  }

  function restorePendingPayment(record) {
    if (!record) return;
    if (record.state) {
      state = record.state;
      if (window.DerandBooking && Array.isArray(state.extraLines)) {
        window.DerandBooking.saveBookingLines(state.extraLines);
      }
      renderState = render(state);
    }
    if (record.firstName) firstNameEl.value = record.firstName;
    if (record.lastName) lastNameEl.value = record.lastName;
    if (record.fullName && !record.firstName && !record.lastName) {
      var restoredName = splitFullName(record.fullName);
      firstNameEl.value = restoredName.firstName;
      lastNameEl.value = restoredName.lastName;
    }
    if (record.email) emailEl.value = record.email;
    if (record.phone) phoneEl.value = record.phone;
    if (record.notes) notesEl.value = record.notes;
    if (record.extrasDelivery) {
      if (extrasDeliveryDateEl) extrasDeliveryDateEl.value = record.extrasDelivery.date || "";
      if (extrasDeliveryTimeEl) extrasDeliveryTimeEl.value = record.extrasDelivery.time || "";
      if (extrasDeliveryNotesEl) extrasDeliveryNotesEl.value = record.extrasDelivery.notes || "";
    }
  }

  function buildGuestConfirmationMessage(pendingOrder, orderReference) {
    var state = pendingOrder.state || {};
    var guestName =
      pendingOrder.fullName ||
      (
        (pendingOrder.firstName || "") +
        " " +
        (pendingOrder.lastName || "")
      ).trim() ||
      "Guest";
    var lines = [
      "Booking Confirmed!",
      "",
      "Dear " + guestName + ",",
      "",
      "Thank you for choosing Derand Hotel. We have received your reservation and payment — your stay is confirmed.",
      "",
    ];
    if (pendingOrder.roomName) {
      lines.push("Room: " + pendingOrder.roomName);
    }
    lines.push(
      "Check-in: " + (state.checkin || "") + " from 15:00",
      "Check-out: " + (state.checkout || "") + " until 11:00",
    );
    if (pendingOrder.nights) {
      lines.push("Nights: " + pendingOrder.nights);
    }
    var guestLine = "Guests: " + (state.adults || 1) + " adult";
    if ((state.adults || 1) !== 1) {
      guestLine += "s";
    }
    if (state.children > 0) {
      guestLine +=
        ", " +
        state.children +
        " child" +
        (state.children === 1 ? "" : "ren");
    }
    lines.push(guestLine);
    if (pendingOrder.amount) {
      lines.push("Total paid: " + pendingOrder.amount + " EUR");
    }
    if (orderReference) {
      lines.push("Booking reference: " + orderReference);
    }
    if (pendingOrder.notes) {
      lines.push("Your notes: " + pendingOrder.notes);
    }
    lines.push(
      "",
      "Need to change anything? Reply to this email or call us at +383 (0) 41 111 222.",
      "",
      "We look forward to welcoming you.",
      "",
      "— Derand Hotel",
      "Bekim Fehmiu Str. 30, Pristina 10000, Kosovo",
      "info@derandhotel.com",
    );
    return lines.join("\n");
  }

  var GUEST_CONFIRM_STORAGE_PREFIX = "derandGuestConfirm:";
  var RESERVATION_ALERT_STORAGE_PREFIX = "derandReservationAlert:";

  function reservationAlertAlreadyShown(orderReference) {
    if (!orderReference) return false;
    try {
      return (
        sessionStorage.getItem(RESERVATION_ALERT_STORAGE_PREFIX + orderReference) ===
        "1"
      );
    } catch (e) {
      return false;
    }
  }

  function markReservationAlertShown(orderReference) {
    if (!orderReference) return;
    try {
      sessionStorage.setItem(RESERVATION_ALERT_STORAGE_PREFIX + orderReference, "1");
    } catch (e) {
      /* ignore */
    }
  }

  function showReservationConfirmedAlert(pendingOrder, orderReference) {
    if (!orderReference || reservationAlertAlreadyShown(orderReference)) return;
    var state = pendingOrder && pendingOrder.state ? pendingOrder.state : {};
    markReservationAlertShown(orderReference);
    window.alert(
      t("bd-alert-reservation-confirmed", {
        room: (pendingOrder && pendingOrder.roomName) || "—",
        checkin: formatDate(state.checkin || ""),
        checkout: formatDate(state.checkout || ""),
        reference: orderReference,
        email: (pendingOrder && pendingOrder.email) || "—",
      }),
    );
    if (statusEl && typeof statusEl.scrollIntoView === "function") {
      statusEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function guestConfirmAlreadySent(orderReference) {
    if (!orderReference) return false;
    try {
      return sessionStorage.getItem(GUEST_CONFIRM_STORAGE_PREFIX + orderReference) === "1";
    } catch (e) {
      return false;
    }
  }

  function markGuestConfirmSent(orderReference) {
    if (!orderReference) return;
    try {
      sessionStorage.setItem(GUEST_CONFIRM_STORAGE_PREFIX + orderReference, "1");
    } catch (e) {
      /* ignore */
    }
  }

  function notifyGuestFromBrowser(pendingOrder, orderReference) {
    var guestEmail = (pendingOrder.email || "").trim();
    if (!guestEmail || guestEmail.indexOf("@") < 1) {
      return Promise.resolve(false);
    }
    if (guestConfirmAlreadySent(orderReference)) {
      return Promise.resolve(true);
    }

    var subject = "Booking Confirmed — Derand Hotel";
    var message = buildGuestConfirmationMessage(pendingOrder, orderReference);

    return fetch(
      "https://formsubmit.co/ajax/" + encodeURIComponent(guestEmail),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          _captcha: "false",
          _template: "box",
          name: "Derand Hotel",
          message: message,
        }),
      },
    )
      .then(function (response) {
        return response.json().then(function (data) {
          if (data && data.success) {
            markGuestConfirmSent(orderReference);
            return true;
          }
          return false;
        });
      })
      .catch(function () {
        return false;
      })
      .then(function (sent) {
        if (sent) return true;
        return fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: "761d8dce-87b2-4534-bc76-77ec2305d4ec",
            subject: subject,
            from_name: "Derand Hotel",
            name: getPendingGuestName(pendingOrder) || "Guest",
            email: guestEmail,
            replyto: "info@derandhotel.com",
            message: message,
          }),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data && data.success) {
              markGuestConfirmSent(orderReference);
              return true;
            }
            return false;
          })
          .catch(function () {
            return false;
          });
      });
  }

  function notifyHotelFromBrowser(pendingOrder, orderReference) {
    var state = pendingOrder.state || {};
    var guestName = getPendingGuestName(pendingOrder);
    var message = [
      "DERAND HOTEL — paid room reservation",
      "",
      "Name: " + guestName,
      "Email: " + (pendingOrder.email || ""),
      "Phone: " + (pendingOrder.phone || ""),
      "",
      "Room: " + (pendingOrder.roomName || ""),
      "Check-in: " + (state.checkin || ""),
      "Check-out: " + (state.checkout || ""),
      "Adults: " + (state.adults || 1),
      "Children: " + (state.children || 0),
      "Nights: " + (pendingOrder.nights || ""),
      "Total price: " + (pendingOrder.amount || "") + " EUR",
      "Payment: PAID",
      "Reservation reference: " + orderReference,
      "Notes: " + (pendingOrder.notes || "(none)"),
    ].join("\n");
    return fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "761d8dce-87b2-4534-bc76-77ec2305d4ec",
        subject: "Room reservation — " + (guestName || orderReference),
        from_name: "Derand Hotel Room Reservation",
        name: guestName,
        email: pendingOrder.email || "info@derandhotel.com",
        replyto: pendingOrder.email || "",
        phone: pendingOrder.phone || "",
        message: message,
      }),
    });
  }

  function sendOtelloReservation(pendingOrder, orderReference) {
    if (!pendingOrder || !orderReference) {
      return Promise.resolve(null);
    }

    var state = pendingOrder.state || {};
    return fetch(OTELLO_CREATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchantOrderReference: orderReference,
        roomType: state.room || "",
        checkin: state.checkin || "",
        checkout: state.checkout || "",
        firstname: pendingOrder.firstName || "",
        lastname: pendingOrder.lastName || "",
        email: pendingOrder.email || "",
        tel: pendingOrder.phone || "",
        totalpax: state.adults || 1,
        totalchd1: state.children || 0,
        nights: pendingOrder.nights || "",
        paidAmount: pendingOrder.amount || "",
        total: pendingOrder.amount || "",
        amount: pendingOrder.amount || "",
        currency: pendingOrder.currency || "EUR",
        note: pendingOrder.notes || "",
      }),
    })
      .then(parsePaymentJsonResponse)
      .then(function (data) {
        if (data && data.ok) {
          console.log("Otello PMS reservation activated successfully.", data);
          if (data.warning) {
            console.warn("Otello PMS:", data.warning);
          }
          if (!data.alreadySent) {
            setStatus("bd-status-otello-success", "success");
          }
        } else {
          console.error("Otello PMS reservation failed.", data);
          if (data && data.step) {
            console.error(
              "Otello failed at step:",
              data.step,
              data.error || "",
              data.response || data,
            );
          }
          if (data && data.warning) {
            console.warn("Otello PMS:", data.warning);
          }
        }
        return data;
      })
      .catch(function (error) {
        console.error("Otello PMS reservation failed.", error);
        return null;
      });
  }

  function sendPaidBookingEmails(pendingOrder, orderReference) {
    if (!pendingOrder || !orderReference) return;
    var state = pendingOrder.state || {};
    fetch(PAYMENT_CONFIRM_EMAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchantOrderReference: orderReference,
        orderIdentification: pendingOrder.orderIdentification || "",
        guestName: getPendingGuestName(pendingOrder),
        guestFirstName: pendingOrder.firstName || "",
        guestLastName: pendingOrder.lastName || "",
        guestEmail: pendingOrder.email || "",
        guestPhone: pendingOrder.phone || "",
        roomType: state.room || "",
        roomName: pendingOrder.roomName || "",
        checkIn: state.checkin || "",
        checkOut: state.checkout || "",
        adults: state.adults || 1,
        children: state.children || 0,
        nights: pendingOrder.nights || "",
        total: pendingOrder.amount || "",
        amount: pendingOrder.amount || "",
        currency: "EUR",
        notes: pendingOrder.notes || "",
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var followUps = [];
        if (!data || !data.hotelSent) {
          followUps.push(
            notifyHotelFromBrowser(pendingOrder, orderReference).catch(function () {}),
          );
        }
        // Always attempt guest confirmation from the browser — server mail() is often blocked.
        followUps.push(
          notifyGuestFromBrowser(pendingOrder, orderReference).catch(function () {
            return false;
          }),
        );
        if (followUps.length) {
          return Promise.all(followUps);
        }
      })
      .catch(function () {
        return Promise.all([
          notifyHotelFromBrowser(pendingOrder, orderReference).catch(function () {}),
          notifyGuestFromBrowser(pendingOrder, orderReference).catch(function () {}),
        ]);
      });
  }

  function finalizePaidBookingOnServer(pendingOrder, orderReference) {
    var state = pendingOrder && pendingOrder.state ? pendingOrder.state : {};
    return fetch(PAYMENT_CONFIRM_EMAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchantOrderReference: orderReference,
        orderIdentification: pendingOrder ? pendingOrder.orderIdentification || "" : "",
        guestName: pendingOrder ? getPendingGuestName(pendingOrder) : "",
        guestFirstName: pendingOrder ? pendingOrder.firstName || "" : "",
        guestLastName: pendingOrder ? pendingOrder.lastName || "" : "",
        guestEmail: pendingOrder ? pendingOrder.email || "" : "",
        guestPhone: pendingOrder ? pendingOrder.phone || "" : "",
        roomType: state.room || "",
        roomName: pendingOrder ? pendingOrder.roomName || "" : "",
        checkIn: state.checkin || "",
        checkOut: state.checkout || "",
        adults: state.adults || 1,
        children: state.children || 0,
        nights: pendingOrder ? pendingOrder.nights || "" : "",
        total: pendingOrder ? pendingOrder.amount || "" : "",
        amount: pendingOrder ? pendingOrder.amount || "" : "",
        currency: "EUR",
        notes: pendingOrder ? pendingOrder.notes || "" : "",
      }),
    })
      .then(parsePaymentJsonResponse)
      .catch(function () {
        return null;
      });
  }

  function completePaidBooking(pendingOrder, orderReference) {
    sendOtelloReservation(pendingOrder, orderReference);
    sendPaidBookingEmails(pendingOrder, orderReference);
    removePendingPayment(orderReference);
    if (window.DerandBooking) {
      window.DerandBooking.clearBookingLines();
    }
    setStatus("bd-status-payment-confirmed", "success", {
      reference: orderReference,
    });
    showReservationConfirmedAlert(pendingOrder, orderReference);
  }

  function verifyReturnedPayment(paymentState, orderReference) {
    var pendingOrder = getPendingPayment(orderReference);
    restorePendingPayment(pendingOrder);

    if (!pendingOrder || !pendingOrder.orderIdentification) {
      if (paymentState === "cancel") {
        setStatus("bd-status-payment-cancelled", "error");
        return;
      }
      if (paymentState === "fail") {
        setStatus("bd-status-payment-failed", "error", { reference: orderReference });
        return;
      }
      if (paymentState === "success") {
        setStatus("bd-status-payment-checking", "success");
        finalizePaidBookingOnServer(null, orderReference).then(function (data) {
          if (data && data.ok !== false) {
            setStatus("bd-status-payment-confirmed", "success", {
              reference: orderReference,
            });
            if (data.otello && !data.otello.ok && !data.otello.alreadySent) {
              console.error("Otello PMS reservation failed.", data.otello);
            }
            return;
          }
          setStatus("bd-status-payment-return-reference", "error", {
            reference: orderReference,
          });
        });
        return;
      }
      setStatus("bd-status-payment-return-reference", "error", {
        reference: orderReference,
      });
      return;
    }

    if (paymentState === "cancel") {
      setStatus("bd-status-payment-cancelled", "error");
      return;
    }
    if (paymentState === "fail") {
      setStatus("bd-status-payment-failed", "error", { reference: orderReference });
      return;
    }

    setStatus("bd-status-payment-checking", "success");
    fetch(
      PAYMENT_STATUS_URL +
        "?orderIdentification=" +
        encodeURIComponent(pendingOrder.orderIdentification),
      { method: "GET", headers: { Accept: "application/json" } },
    )
      .then(parsePaymentJsonResponse)
      .then(function (data) {
        var paymentStatus = (data && data.paymentStatus) || "pending";
        if (paymentStatus === "paid") {
          completePaidBooking(pendingOrder, orderReference);
          return;
        }
        if (paymentStatus === "cancelled") {
          setStatus("bd-status-payment-cancelled", "error");
          return;
        }
        if (paymentStatus === "failed") {
          setStatus("bd-status-payment-failed", "error", {
            reference: orderReference,
          });
          return;
        }
        setStatus("bd-status-payment-pending", "success", {
          reference: orderReference,
        });
      })
      .catch(function () {
        setStatus("bd-status-payment-verify-error", "error", {
          reference: orderReference,
        });
      });
  }

  var paymentReturnHandled = false;

  function handlePaymentReturn() {
    if (paymentReturnHandled) return;
    var params = new URLSearchParams(window.location.search || "");
    var paymentState = (params.get("payment") || "").trim().toLowerCase();
    var orderReference = (params.get("orderRef") || "").trim();
    if (!paymentState) return;

    paymentReturnHandled = true;
    clearPaymentQuery();

    if (!orderReference) {
      setStatus("bd-status-payment-return-missing", "error");
      return;
    }
    if (paymentState === "success" || paymentState === "paid" || paymentState === "ok") {
      verifyReturnedPayment("success", orderReference);
      return;
    }
    if (paymentState === "cancel" || paymentState === "cancelled") {
      verifyReturnedPayment("cancel", orderReference);
      return;
    }
    if (paymentState === "fail" || paymentState === "failed" || paymentState === "error") {
      verifyReturnedPayment("fail", orderReference);
      return;
    }
    verifyReturnedPayment(paymentState, orderReference);
  }

  function render(state) {
    var room = getRoomInfo(state.room);
    var nights = getNightCount(state);
    enforceChildrenPolicy(false);
    syncChildAgesLength();
    renderChildAgeInputs();
    var pricePerNight = getRoomStayAverageNightly(
      state.room,
      state.adults,
      state.checkin,
      state.checkout,
    );
    var childSurchargePerNight = getChildrenSurcharge(state.room, state.childAges);
    var roomTotal = getRoomStayTotal(
      state.room,
      state.adults,
      state.checkin,
      state.checkout,
    );
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
  var warnedUnavailableStay = false;

  function refreshBookingDetailsView() {
    if (!state) {
      state = loadState();
    } else if (window.DerandBooking) {
      // Always re-read concierge lines so returning from extra updates the pay card.
      state.extraLines = window.DerandBooking.loadBookingLines();
    }
    try {
      if (sessionStorage.getItem("derandBookingReturnFromExtras") === "1") {
        sessionStorage.removeItem("derandBookingReturnFromExtras");
        if (window.DerandBooking) {
          state.extraLines = window.DerandBooking.loadBookingLines();
        }
      }
    } catch (e) {
      /* ignore */
    }
    renderState = render(state);
    refreshStatusMessage();
  }

  function warnIfStayUnavailable() {
    if (!state || warnedUnavailableStay) return;
    var unavailable = roomUnavailableForStay(
      state.room,
      state.checkin,
      state.checkout,
    );
    if (!unavailable) return;
    warnedUnavailableStay = true;
    // Status only on load — do not alert when returning from extras picker.
    setStatus(statusKeyForUnavailable(unavailable), "error");
  }

  document.addEventListener("DOMContentLoaded", function () {
    refreshBookingDetailsView();
    setupConciergeMarquee();
    handlePaymentReturn();
    warnIfStayUnavailable();
  });

  window.addEventListener("pageshow", function (event) {
    if (event.persisted || (state && window.DerandBooking)) {
      refreshBookingDetailsView();
    }
  });

  window.addEventListener("load", function () {
    window.setTimeout(function () {
      refreshBookingDetailsView();
      setupConciergeMarquee();
    }, 150);
  });

  document.addEventListener("derand:languagechange", function () {
    refreshBookingDetailsView();
    window.setTimeout(setupConciergeMarquee, 120);
  });

  function bindConciergeMarqueeMedia(query) {
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", setupConciergeMarquee);
    } else if (typeof query.addListener === "function") {
      query.addListener(setupConciergeMarquee);
    }
  }

  bindConciergeMarqueeMedia(conciergeMarqueeMedia);
  bindConciergeMarqueeMedia(conciergeReducedMotionMedia);

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
      var unavailable = roomUnavailableForStay(
        state.room,
        state.checkin,
        state.checkout,
      );
      if (unavailable) {
        setStatus(statusKeyForUnavailable(unavailable), "error");
        alertRoomUnavailable(unavailable);
      }
    });
  }

  if (checkinInputEl) {
    checkinInputEl.addEventListener("change", function () {
      syncGuestStateFromInputs();
      renderState = render(state);
      var unavailable = roomUnavailableForStay(
        state.room,
        state.checkin,
        state.checkout,
      );
      if (unavailable) {
        setStatus(statusKeyForUnavailable(unavailable), "error");
        alertRoomUnavailable(unavailable);
      }
    });
  }

  if (checkoutInputEl) {
    checkoutInputEl.addEventListener("change", function () {
      syncGuestStateFromInputs();
      renderState = render(state);
      var unavailable = roomUnavailableForStay(
        state.room,
        state.checkin,
        state.checkout,
      );
      if (unavailable) {
        setStatus(statusKeyForUnavailable(unavailable), "error");
        alertRoomUnavailable(unavailable);
      }
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

  function paymentTotalsMatch(expected, charged) {
    var expectedAmount = Number(expected);
    var chargedAmount = Number(charged);
    if (!isFinite(expectedAmount) || !isFinite(chargedAmount)) return false;
    return Math.abs(expectedAmount - chargedAmount) < 0.02;
  }

  function confirmPaymentProceed(renderState, state) {
    return window.confirm(
      t("bd-alert-payment-confirm", {
        room: renderState.room.label,
        checkin: formatDate(state.checkin),
        checkout: formatDate(state.checkout),
        guests: guestSummary(state.adults, state.children),
        total: currency(renderState.total),
      }),
    );
  }

  function startSecurePayment(renderState, state, guestDetails) {
    if (confirmBtnEl) confirmBtnEl.disabled = true;
    setStatus("bd-status-payment-starting", "success");

    fetch(PAYMENT_CREATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        orderType: "booking",
        roomType: state.room,
        roomName: renderState.room.label,
        checkIn: state.checkin,
        checkOut: state.checkout,
        adults: state.adults,
        children: state.children,
        childAges: state.childAges || [],
        guestFirstName: guestDetails.firstName,
        guestLastName: guestDetails.lastName,
        email: guestDetails.email,
        phone: guestDetails.phone,
        message: guestDetails.notes,
        nightlyRate: renderState.pricePerNight,
        roomTotal: renderState.roomTotal,
        childSurcharge: renderState.childSurcharge,
        extrasTotal: renderState.extrasTotal,
        fees: renderState.fees,
        total: renderState.total,
        extras: getExtraPaymentItems(state),
        extrasDeliveryDate: guestDetails.extrasDelivery
          ? guestDetails.extrasDelivery.date
          : "",
        extrasDeliveryTime: guestDetails.extrasDelivery
          ? guestDetails.extrasDelivery.time
          : "",
        extrasDeliveryNotes: guestDetails.extrasDelivery
          ? guestDetails.extrasDelivery.notes
          : "",
        returnPath: buildReturnPath(state),
      }),
    })
      .then(parsePaymentJsonResponse)
      .then(function (data) {
        if (
          !data ||
          !data.checkoutUrl ||
          !data.orderIdentification ||
          !data.merchantOrderReference
        ) {
          throw new Error(t("bd-status-payment-incomplete"));
        }
        if (!paymentTotalsMatch(renderState.total, data.amount)) {
          throw new Error(
            t("bd-status-payment-amount-mismatch", {
              charged: currency(Number(data.amount) || 0),
              expected: currency(renderState.total),
            }),
          );
        }
        savePendingPayment({
          merchantOrderReference: data.merchantOrderReference,
          orderIdentification: data.orderIdentification,
          state: JSON.parse(JSON.stringify(state)),
          roomName: renderState.room.label,
          nights: renderState.nights,
          firstName: guestDetails.firstName,
          lastName: guestDetails.lastName,
          fullName: guestDetails.fullName,
          email: guestDetails.email,
          phone: guestDetails.phone,
          notes: guestDetails.notes,
          extrasDelivery: guestDetails.extrasDelivery,
          amount: data.amount,
          createdAt: new Date().toISOString(),
        });
        setStatus("bd-status-payment-redirect", "success");
        window.location.href = data.checkoutUrl;
      })
      .catch(function (error) {
        setStatus("bd-status-error", "error", {
          message:
            (error && error.message) || t("bd-status-payment-start-error"),
        });
        if (confirmBtnEl) confirmBtnEl.disabled = false;
      });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (window.__derandTestSkipPayment) {
      if (typeof window.__derandSendTestReservation === "function") {
        window.__derandSendTestReservation();
      }
      return;
    }
    syncGuestStateFromInputs();
    renderState = render(state);
    if (!form.checkValidity()) {
      form.reportValidity();
      window.alert(t("bd-alert-form-incomplete"));
      return;
    }
    if (!validate()) return;

    var name = {
      firstName: firstNameEl.value.trim(),
      lastName: lastNameEl.value.trim(),
    };
    var extrasDelivery = hasBookingExtras(state) ? getExtrasDeliveryFromForm() : null;
    if (!confirmPaymentProceed(renderState, state)) {
      return;
    }

    startSecurePayment(renderState, state, {
      firstName: name.firstName,
      lastName: name.lastName,
      fullName: getGuestFullName(),
      email: emailEl.value.trim(),
      phone: phoneEl.value.trim(),
      notes: notesEl.value.trim(),
      extrasDelivery: extrasDelivery,
    });
  });

  if (window.__derandTestBookingPage) {
    window.__derandBookingDetails = {
      syncGuestStateFromInputs: syncGuestStateFromInputs,
      render: function () {
        renderState = render(state);
        return renderState;
      },
      validate: validate,
      getState: function () {
        return state;
      },
      getRenderState: function () {
        return renderState;
      },
      getGuestFullName: getGuestFullName,
      getExtrasDeliveryFromForm: getExtrasDeliveryFromForm,
      hasBookingExtras: function () {
        return hasBookingExtras(state);
      },
      startSecurePayment: startSecurePayment,
      confirmPaymentProceed: confirmPaymentProceed,
      formatDate: formatDate,
      guestSummary: guestSummary,
      currency: currency,
      setStatus: setStatus,
      form: form,
      confirmBtnEl: confirmBtnEl,
      firstNameEl: firstNameEl,
      lastNameEl: lastNameEl,
      emailEl: emailEl,
      phoneEl: phoneEl,
      notesEl: notesEl,
    };
  }
})();
