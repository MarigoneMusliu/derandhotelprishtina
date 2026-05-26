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

  var selectedRoom = cards[0].dataset.room || "junior-suite";

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

    var layers = sources.map(function (src, index) {
      var layer = document.createElement("div");
      layer.className = "booking-hero__layer" + (index === 0 ? " is-visible" : "");
      layer.style.backgroundImage = 'url("' + src + '")';
      slidesHost.appendChild(layer);
      return layer;
    });

    if (layers.length < 2) return;

    var currentIndex = 0;
    window.setInterval(function () {
      layers[currentIndex].classList.remove("is-visible");
      currentIndex = (currentIndex + 1) % layers.length;
      layers[currentIndex].classList.add("is-visible");
    }, 4200);
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
    if (!date) return "—";
    return date.toLocaleDateString("en-GB", {
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
      parts.push(adults + (adults === 1 ? " adult" : " adults"));
    }
    if (children > 0) {
      parts.push(children + (children === 1 ? " child" : " children"));
    }

    return parts.length ? parts.join(", ") : "No guests selected";
  }

  function syncCountsFromGuestSelect() {
    if (!guestsSelectEl) return;
    var parts = (guestsSelectEl.value || "2-0").split("-");
    adultsEl.value = parts[0] || "2";
    childrenEl.value = parts[1] || "0";
  }

  function syncGuestSelectFromCounts() {
    if (!guestsSelectEl) return;
    var combined = (adultsEl.value || "2") + "-" + (childrenEl.value || "0");
    var hasExactOption = Array.prototype.some.call(guestsSelectEl.options, function (option) {
      return option.value === combined;
    });

    if (hasExactOption) {
      guestsSelectEl.value = combined;
    } else {
      guestsSelectEl.value = (adultsEl.value || "2") + "-0";
      childrenEl.value = "0";
    }
  }

  function setMinDates() {
    var today = todayIso();
    checkInEl.min = today;
    if (!checkInEl.value || checkInEl.value < today) {
      checkInEl.value = today;
    }
    updateCheckOutMin();
  }

  function updateCheckOutMin() {
    var start = parseIso(checkInEl.value);
    if (!start) return;

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

  function getSelectedRoomLabel() {
    var selectedCard = cards.find(function (card) {
      return card.dataset.room === selectedRoom;
    });
    return selectedCard ? selectedCard.dataset.roomLabel || "Selected room" : "Selected room";
  }

  function buildSearchParams(room) {
    var adults = parseInt(adultsEl.value, 10) || 2;
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

  function updateSummary() {
    var nights = getNightCount();
    var stayText =
      nights === 1 ? "1 night" : nights > 1 ? nights + " nights" : "Choose valid dates";

    summaryEl.textContent =
      getSelectedRoomLabel() +
      " · " +
      formatDate(checkInEl.value) +
      " to " +
      formatDate(checkOutEl.value) +
      " · " +
      stayText +
      " · " +
      getGuestSummary();
  }

  function setStatus(message, state) {
    statusEl.textContent = message || "";
    statusEl.className = "booking-search__status" + (state ? " is-" + state : "");
  }

  function validateFilters() {
    var nights = getNightCount();
    if (!checkInEl.value || !checkOutEl.value || nights < 1) {
      setStatus("Please choose a valid check-in and check-out date.", "error");
      return false;
    }
    return true;
  }

  function updateQueryString() {
    var params = new URLSearchParams();
    params.set("checkin", checkInEl.value);
    params.set("checkout", checkOutEl.value);
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
    var params = new URLSearchParams(window.location.search);
    var room = params.get("room");

    if (params.get("checkin")) checkInEl.value = params.get("checkin");
    if (params.get("checkout")) checkOutEl.value = params.get("checkout");
    if (params.get("adults")) adultsEl.value = params.get("adults");
    if (params.get("children")) childrenEl.value = params.get("children");
    syncGuestSelectFromCounts();

    setMinDates();

    if (room && cards.some(function (card) { return card.dataset.room === room; })) {
      selectedRoom = room;
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    syncCountsFromGuestSelect();
    updateCheckOutMin();
    if (!validateFilters()) return;

    updateSummary();
    syncReserveLinks();
    updateQueryString();
    setStatus("Dates and guests updated. Choose any room below to continue.", "success");
  });

  [checkInEl, checkOutEl].forEach(function (element) {
    element.addEventListener("change", function () {
      if (element === checkInEl) updateCheckOutMin();
      updateSummary();
      syncReserveLinks();
      updateQueryString();
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
      selectRoom(card.dataset.room);
    });
  });

  reserveLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var room = link.dataset.room || selectedRoom;
      selectRoom(room);
      if (!validateFilters()) {
        event.preventDefault();
        return;
      }
      link.href = buildDetailsUrl(room);
      setStatus("Opening booking details for " + getSelectedRoomLabel() + "...", "success");
    });
  });

  initHeroRotation();
  syncCountsFromGuestSelect();
  applyQueryParams();
  selectRoom(selectedRoom);
  updateSummary();
  syncReserveLinks();
})();
