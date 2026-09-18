(function () {
  var HOTELRUNNER_BASE = "https://derand-hotel.hotelrunner.com/bv3/search";
  var BOOKING_DETAILS_PAGE = "booking-details.html";

  var form = document.getElementById("book-form");
  if (!form) return;

  var checkInEl = document.getElementById("book-check-in");
  var checkOutEl = document.getElementById("book-check-out");
  var guestsSelectEl = document.getElementById("book-guests");
  var adultsEl = document.getElementById("book-adults");
  var childrenEl = document.getElementById("book-children");
  var statusEl = document.getElementById("book-status");
  var summaryEl = document.getElementById("book-summary");
  var cards = Array.prototype.slice.call(
    document.querySelectorAll(".booking-room-card"),
  );
  var reserveLinks = Array.prototype.slice.call(
    document.querySelectorAll(".booking-room-card__reserve"),
  );

  if (!cards.length) return;

  var selectedRoom = cards[0].dataset.room || "superior-double";
  var lastStatus = { key: "", state: "" };

  function t(key, vars) {
    if (window.BookI18n && typeof window.BookI18n.t === "function") {
      return window.BookI18n.t(key, null, vars);
    }
    return key;
  }

  function getDateLocale() {
    var lang =
      window.BookI18n && typeof window.BookI18n.currentLang === "function"
        ? window.BookI18n.currentLang()
        : "en";
    if (lang === "de") return "de-DE";
    if (lang === "al") return "sq-AL";
    return "en-GB";
  }

  function initHeroRotation() {
    var hero = document.querySelector(".booking-hero[data-hero-rotate]");
    if (!hero) return;

    var slidesHost = hero.querySelector(".booking-hero__slides");
    if (!slidesHost) return;

    var sources = String(hero.getAttribute("data-hero-rotate") || "")
      .split(",")
      .map(function (value) {
        return value.trim();
      })
      .filter(Boolean);

    if (!sources.length) return;

    slidesHost.innerHTML = "";

    function ensureLayerImage(layer) {
      if (!layer || layer.dataset.loaded === "1") return;
      var src = layer.getAttribute("data-src");
      if (!src) return;
      layer.style.backgroundImage = 'url("' + src + '")';
      layer.dataset.loaded = "1";
    }

    var layers = sources.map(function (src, index) {
      var layer = document.createElement("div");
      layer.className = "booking-hero__layer" + (index === 0 ? " is-visible" : "");
      layer.setAttribute("data-src", src);
      if (index === 0) {
        ensureLayerImage(layer);
      }
      slidesHost.appendChild(layer);
      return layer;
    });

    if (layers.length < 2) return;
  }

  function todayIso() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function parseIso(value) {
    if (!value) return null;
    var parts = value.split("-");
    if (parts.length !== 3) return null;
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  function formatDate(iso) {
    var date = parseIso(iso);
    if (!date) return "\u2014";
    return date.toLocaleDateString(getDateLocale(), {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getNightCount() {
    var start = parseIso(checkInEl.value);
    var end = parseIso(checkOutEl.value);
    if (!start || !end) return 0;
    return Math.round((end - start) / 86400000);
  }

  function getGuestSummary() {
    var adults = parseInt(adultsEl.value, 10) || 0;
    var children = parseInt(childrenEl.value, 10) || 0;
    var parts = [];

    if (adults > 0) {
      parts.push(
        adults +
          " " +
          t(adults === 1 ? "book-guest-adult" : "book-guest-adults"),
      );
    }
    if (children > 0) {
      parts.push(
        children +
          " " +
          t(children === 1 ? "book-guest-child" : "book-guest-children"),
      );
    }

    return parts.length ? parts.join(", ") : t("book-no-guests");
  }

  function syncCountsFromGuestSelect() {
    if (!guestsSelectEl) return;
    var parts = (guestsSelectEl.value || "1-0").split("-");
    adultsEl.value = parts[0] || "1";
    childrenEl.value = parts[1] || "0";
  }

  function syncGuestSelectFromCounts() {
    if (!guestsSelectEl) return;
    var combined = (adultsEl.value || "1") + "-" + (childrenEl.value || "0");
    var hasExactOption = Array.prototype.some.call(guestsSelectEl.options, function (option) {
      return option.value === combined;
    });

    if (hasExactOption) {
      guestsSelectEl.value = combined;
    } else {
      guestsSelectEl.value = (adultsEl.value || "1") + "-0";
      childrenEl.value = "0";
    }
  }

  function setMinDates() {
    var today = todayIso();
    checkInEl.min = today;
    if (checkInEl.value && checkInEl.value < today) {
      checkInEl.value = "";
    }
    if (!checkInEl.value) {
      checkOutEl.min = "";
      checkOutEl.value = "";
      return;
    }
    updateCheckOutMin();
  }

  function updateCheckOutMin() {
    var start = parseIso(checkInEl.value);
    if (!start) {
      checkOutEl.min = "";
      checkOutEl.value = "";
      return;
    }

    var next = new Date(start);
    next.setDate(next.getDate() + 1);

    var month = String(next.getMonth() + 1).padStart(2, "0");
    var day = String(next.getDate()).padStart(2, "0");
    var minOut = next.getFullYear() + "-" + month + "-" + day;

    checkOutEl.min = minOut;
    if (!checkOutEl.value || checkOutEl.value <= checkInEl.value) {
      checkOutEl.value = minOut;
    }
  }

  function roomLabelKey(room) {
    return "book-room-" + room + "-label";
  }

  function syncRoomCardLabels() {
    cards.forEach(function (card) {
      var room = card.dataset.room;
      if (!room) return;
      card.dataset.roomLabel = t(roomLabelKey(room));
    });
  }

  function getSelectedRoomLabel() {
    var selectedCard = cards.find(function (card) {
      return card.dataset.room === selectedRoom;
    });
    if (selectedCard && selectedCard.dataset.roomLabel) {
      return selectedCard.dataset.roomLabel;
    }
    if (selectedRoom) {
      return t(roomLabelKey(selectedRoom));
    }
    return t("book-selected-room");
  }

  function buildSearchParams(room) {
    var adults = parseInt(adultsEl.value, 10) || 1;
    var children = parseInt(childrenEl.value, 10) || 0;
    var params = new URLSearchParams();

    params.set("checkin", checkInEl.value);
    params.set("checkout", checkOutEl.value);
    params.set("adults", String(adults));
    params.set("children", String(children));
    params.set("room", room || selectedRoom);

    return params;
  }

  function buildHotelRunnerUrl(room) {
    var params = buildSearchParams(room);
    var adults = parseInt(params.get("adults"), 10) || 2;
    var children = parseInt(params.get("children"), 10) || 0;
    var searchParams = new URLSearchParams();

    searchParams.set("check_in", params.get("checkin") || "");
    searchParams.set("check_out", params.get("checkout") || "");
    searchParams.set("adults", String(adults));
    searchParams.set("children", String(children));
    searchParams.set("guests", String(adults + children));
    searchParams.set("room", params.get("room") || selectedRoom);

    return HOTELRUNNER_BASE + "?" + searchParams.toString();
  }

  function buildDetailsUrl(room) {
    return BOOKING_DETAILS_PAGE + "?" + buildSearchParams(room).toString();
  }

  function syncReserveLinks() {
    reserveLinks.forEach(function (link) {
      link.href = buildDetailsUrl(link.dataset.room || selectedRoom);
    });
  }

  function isFeaturePriceEl(el) {
    return el.classList.contains("booking-room-card__feature-price");
  }

  function buildDefaultPriceHtml(nightly, el) {
    var perNight = t("book-price-per-night");
    if (isFeaturePriceEl(el)) {
      return "&euro;" + nightly + "<span>" + perNight + "</span>";
    }
    return "&euro;" + nightly + perNight;
  }

  function getCardDisplayNightly(card) {
    var display = parseFloat(card.getAttribute("data-display-night"), 10);
    if (display > 0) return display;
    return parseFloat(card.getAttribute("data-price-night"), 10) || 0;
  }

  function resetDefaultPriceHtml() {
    cards.forEach(function (card) {
      var nightly = getCardDisplayNightly(card);
      if (!nightly) return;

      card
        .querySelectorAll(
          ".booking-room-card__feature-price, .booking-room-card__inline-price",
        )
        .forEach(function (el) {
          delete el.dataset.defaultHtml;
          el.innerHTML = buildDefaultPriceHtml(nightly, el);
          el.dataset.defaultHtml = el.innerHTML;
        });
    });
  }

  function buildStayPriceHtml(nightly, nights, total) {
    var perNight = t("book-price-per-night");
    var stayTotal =
      typeof total === "number" && !isNaN(total) ? total : nightly * nights;
    var displayNightly = Math.round(nightly);
    if (Math.abs(nightly - displayNightly) > 0.001) {
      displayNightly = Math.round(nightly * 100) / 100;
    }
    return (
      "&euro;" +
      Math.round(stayTotal) +
      "<span> " +
      t("book-price-total") +
      "</span> <span class=\"booking-room-card__price-note\">" +
      t("book-price-multi", {
        nights: nights,
        nightly: displayNightly,
        perNight: perNight,
      }) +
      "</span>"
    );
  }

  function getCardBaseNightly(card) {
    var adults = parseInt(adultsEl && adultsEl.value, 10) || 1;
    var single = parseFloat(card.getAttribute("data-price-night"), 10) || 0;
    var doubleRate = parseFloat(card.getAttribute("data-price-double"), 10);
    var tripleRate = parseFloat(card.getAttribute("data-price-triple"), 10);
    if (adults >= 3 && tripleRate > 0) return tripleRate;
    if (adults >= 2 && doubleRate > 0) return doubleRate;
    return single;
  }

  function getCardStayPricing(card) {
    var base = getCardBaseNightly(card);
    var nights = getNightCount();
    if (
      !nights ||
      !checkInEl.value ||
      !checkOutEl.value ||
      !window.DerandBooking ||
      typeof window.DerandBooking.getStayRoomTotal !== "function"
    ) {
      return { base: base, nights: nights, nightly: base, total: base * nights };
    }
    var total = window.DerandBooking.getStayRoomTotal(
      base,
      checkInEl.value,
      checkOutEl.value,
    );
    var nightly =
      typeof window.DerandBooking.getStayAverageNightly === "function"
        ? window.DerandBooking.getStayAverageNightly(
            base,
            checkInEl.value,
            checkOutEl.value,
          )
        : total / nights;
    return { base: base, nights: nights, nightly: nightly, total: total };
  }

  function updateRoomCardPrices() {
    var nights = getNightCount();
    cards.forEach(function (card) {
      var pricing = getCardStayPricing(card);
      if (!pricing.base) return;

      var priceEls = card.querySelectorAll(
        ".booking-room-card__feature-price, .booking-room-card__inline-price",
      );
      priceEls.forEach(function (el) {
        if (!el.dataset.defaultHtml) {
          el.dataset.defaultHtml = el.innerHTML;
        }
        if (nights > 1) {
          el.innerHTML = buildStayPriceHtml(
            pricing.nightly,
            nights,
            pricing.total,
          );
        } else if (nights === 1) {
          el.innerHTML =
            "&euro;" +
            Math.round(pricing.nightly) +
            "<span>" +
            t("book-price-per-night") +
            "</span>";
        } else {
          el.innerHTML = el.dataset.defaultHtml;
        }
      });
    });
  }

  function getStayText(nights) {
    if (nights === 1) return t("book-night");
    if (nights > 1) return t("book-nights", { count: nights });
    return t("book-choose-valid-dates");
  }

  function hasCompleteStay() {
    return getNightCount() >= 1 && checkInEl.value && checkOutEl.value;
  }

  function updateSummary() {
    var nights = getNightCount();
    var stayText = getStayText(nights);

    if (summaryEl) {
      if (!hasCompleteStay()) {
        summaryEl.textContent = t("book-summary-placeholder");
      } else {
        summaryEl.textContent =
          getSelectedRoomLabel() +
          t("book-summary-separator") +
          formatDate(checkInEl.value) +
          t("book-summary-to") +
          formatDate(checkOutEl.value) +
          t("book-summary-separator") +
          stayText +
          t("book-summary-separator") +
          getGuestSummary();
      }
    }
    updateRoomCardPrices();
  }

  function setStatus(key, state, vars) {
    lastStatus = { key: key || "", state: state || "", vars: vars || null };
    statusEl.textContent = key ? t(key, vars) : "";
    statusEl.className = "booking-search__status" + (state ? " is-" + state : "");
  }

  function refreshStatusMessage() {
    if (!lastStatus.key) return;
    setStatus(lastStatus.key, lastStatus.state, lastStatus.vars);
  }

  function stayIsBlockedForAllRooms() {
    return (
      window.DerandBooking &&
      typeof window.DerandBooking.stayOverlapsBlockedNights === "function" &&
      window.DerandBooking.stayOverlapsBlockedNights(
        checkInEl.value,
        checkOutEl.value,
      )
    );
  }

  function juniorSuiteIsFullyBooked() {
    return (
      window.DerandBooking &&
      typeof window.DerandBooking.stayOverlapsJuniorSuiteBlocked === "function" &&
      window.DerandBooking.stayOverlapsJuniorSuiteBlocked(
        checkInEl.value,
        checkOutEl.value,
      )
    );
  }

  function roomIsUnavailable(room) {
    if (stayIsBlockedForAllRooms()) return true;
    return room === "junior-suite" && juniorSuiteIsFullyBooked();
  }

  function alertUnavailableRoom(room) {
    if (room === "junior-suite" && juniorSuiteIsFullyBooked()) {
      window.alert(t("book-status-junior-fully-booked"));
      return;
    }
    window.alert(t("book-status-blocked-dates"));
  }

  function validateFilters(room) {
    var nights = getNightCount();
    var targetRoom = room || selectedRoom;
    if (!checkInEl.value || !checkOutEl.value || nights < 1) {
      setStatus("book-status-invalid-dates", "error");
      return false;
    }
    if (roomIsUnavailable(targetRoom)) {
      var statusKey =
        targetRoom === "junior-suite" && juniorSuiteIsFullyBooked()
          ? "book-status-junior-fully-booked"
          : "book-status-blocked-dates";
      setStatus(statusKey, "error");
      alertUnavailableRoom(targetRoom);
      return false;
    }
    return true;
  }

  function ensureValidDatesForReserve() {
    var today = todayIso();
    if (!checkInEl.value || checkInEl.value < today) {
      checkInEl.value = today;
    }
    updateCheckOutMin();
  }

  function updateQueryString() {
    var params = new URLSearchParams();
    if (checkInEl.value) params.set("checkin", checkInEl.value);
    if (checkOutEl.value) params.set("checkout", checkOutEl.value);
    params.set("adults", adultsEl.value);
    params.set("children", childrenEl.value);
    params.set("room", selectedRoom);
    window.history.replaceState(null, "", window.location.pathname + "?" + params.toString());
  }

  function selectRoom(room) {
    selectedRoom = room;
    cards.forEach(function (card) {
      card.classList.toggle("is-selected", card.dataset.room === room);
    });
    updateSummary();
    syncReserveLinks();
    updateQueryString();
  }

  function applyQueryParams() {
    var navEntries =
      window.performance && typeof window.performance.getEntriesByType === "function"
        ? window.performance.getEntriesByType("navigation")
        : [];
    var navType = navEntries.length ? navEntries[0].type : "";
    var isReload = navType === "reload";
    var params = new URLSearchParams(window.location.search);
    var room = params.get("room");

    if (!isReload) {
      if (params.get("checkin")) checkInEl.value = params.get("checkin");
      if (params.get("checkout")) checkOutEl.value = params.get("checkout");
    }
    if (params.get("adults")) adultsEl.value = params.get("adults");
    if (params.get("children")) childrenEl.value = params.get("children");
    syncGuestSelectFromCounts();

    setMinDates();

    if (room && cards.some(function (card) { return card.dataset.room === room; })) {
      selectedRoom = room;
    }

    if (isReload) {
      updateQueryString();
    }
  }

  function onLanguageChange() {
    syncRoomCardLabels();
    resetDefaultPriceHtml();
    updateSummary();
    refreshStatusMessage();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    syncCountsFromGuestSelect();
    updateCheckOutMin();
    if (!validateFilters(selectedRoom)) return;

    updateSummary();
    syncReserveLinks();
    updateQueryString();
    setStatus("book-status-updated", "success");
  });

  [checkInEl, checkOutEl].forEach(function (element) {
    element.addEventListener("change", function () {
      if (element === checkInEl) updateCheckOutMin();
      updateSummary();
      syncReserveLinks();
      updateQueryString();
      if (
        checkInEl.value &&
        checkOutEl.value &&
        roomIsUnavailable(selectedRoom)
      ) {
        var statusKey =
          selectedRoom === "junior-suite" && juniorSuiteIsFullyBooked()
            ? "book-status-junior-fully-booked"
            : "book-status-blocked-dates";
        setStatus(statusKey, "error");
        alertUnavailableRoom(selectedRoom);
      } else if (
        lastStatus.key === "book-status-blocked-dates" ||
        lastStatus.key === "book-status-junior-fully-booked"
      ) {
        setStatus("", "");
      }
    });
  });

  if (guestsSelectEl) {
    guestsSelectEl.addEventListener("change", function () {
      syncCountsFromGuestSelect();
      updateSummary();
      syncReserveLinks();
      updateQueryString();
    });
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function (event) {
      if (event.target.closest("a")) return;
      var room = card.dataset.room;
      selectRoom(room);
      if (checkInEl.value && checkOutEl.value && roomIsUnavailable(room)) {
        var statusKey =
          room === "junior-suite" && juniorSuiteIsFullyBooked()
            ? "book-status-junior-fully-booked"
            : "book-status-blocked-dates";
        setStatus(statusKey, "error");
        alertUnavailableRoom(room);
      }
    });
  });

  reserveLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var room = link.dataset.room || selectedRoom;
      selectRoom(room);
      ensureValidDatesForReserve();
      if (!validateFilters(room)) {
        event.preventDefault();
        return;
      }
      link.href = buildDetailsUrl(room);
      setStatus("book-status-opening", "success", { room: getSelectedRoomLabel() });
    });
  });

  document.addEventListener("derand:languagechange", onLanguageChange);

  initHeroRotation();
  syncRoomCardLabels();
  resetDefaultPriceHtml();
  syncCountsFromGuestSelect();
  applyQueryParams();
  selectRoom(selectedRoom);
  updateSummary();
  syncReserveLinks();
})();
