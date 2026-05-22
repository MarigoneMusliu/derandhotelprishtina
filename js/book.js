(function () {
  var HOTELRUNNER_BASE = "https://derand-hotel.hotelrunner.com/bv3/search";
  var WEB3FORMS_URL = "https://api.web3forms.com/submit";
  var WEB3FORMS_ACCESS_KEY = "761d8dce-87b2-4534-bc76-77ec2305d4ec";
  var NOTIFY_EMAIL = "info@derandhotel.com";

  var form = document.getElementById("book-form");
  if (!form) return;

  var roomEl = document.getElementById("book-room");
  var checkInEl = document.getElementById("book-check-in");
  var checkOutEl = document.getElementById("book-check-out");
  var adultsEl = document.getElementById("book-adults");
  var childrenEl = document.getElementById("book-children");
  var firstNameEl = document.getElementById("book-first-name");
  var lastNameEl = document.getElementById("book-last-name");
  var emailEl = document.getElementById("book-email");
  var phoneEl = document.getElementById("book-phone");
  var notesEl = document.getElementById("book-notes");
  var submitBtn = document.getElementById("book-submit");
  var statusEl = document.getElementById("book-status");
  var summaryRoom = document.getElementById("book-summary-room");
  var summaryStay = document.getElementById("book-summary-stay");
  var summaryGuests = document.getElementById("book-summary-guests");

  function todayIso() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function parseIso(s) {
    if (!s) return null;
    var p = s.split("-");
    if (p.length !== 3) return null;
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function dayDiff(start, end) {
    return Math.round((end - start) / 86400000);
  }

  function setMinDates() {
    var t = todayIso();
    checkInEl.min = t;
    if (!checkInEl.value || checkInEl.value < t) {
      checkInEl.value = t;
    }
    updateCheckOutMin();
  }

  function updateCheckOutMin() {
    var inDate = parseIso(checkInEl.value);
    if (!inDate) return;
    var next = new Date(inDate);
    next.setDate(next.getDate() + 1);
    var m = String(next.getMonth() + 1).padStart(2, "0");
    var d = String(next.getDate()).padStart(2, "0");
    var minOut = next.getFullYear() + "-" + m + "-" + d;
    checkOutEl.min = minOut;
    if (!checkOutEl.value || checkOutEl.value <= checkInEl.value) {
      checkOutEl.value = minOut;
    }
  }

  function getRoomLabel() {
    var opt = roomEl.options[roomEl.selectedIndex];
    return opt ? opt.textContent.trim() : "—";
  }

  function getNights() {
    var a = parseIso(checkInEl.value);
    var b = parseIso(checkOutEl.value);
    if (!a || !b) return 0;
    var n = dayDiff(a, b);
    return n > 0 ? n : 0;
  }

  function getGuestSummary() {
    var adults = parseInt(adultsEl.value, 10) || 0;
    var children = parseInt(childrenEl.value, 10) || 0;
    var total = adults + children;
    if (total <= 0) return "—";
    var parts = [];
    if (adults > 0) {
      parts.push(adults + (adults === 1 ? " adult" : " adults"));
    }
    if (children > 0) {
      parts.push(children + (children === 1 ? " child" : " children"));
    }
    return parts.join(", ");
  }

  function updateSummary() {
    summaryRoom.textContent = getRoomLabel();
    var nights = getNights();
    summaryStay.textContent =
      nights === 1 ? "1 night" : nights > 0 ? nights + " nights" : "—";
    summaryGuests.textContent = getGuestSummary();
  }

  function clearErrors() {
    var fields = form.querySelectorAll(".book__field");
    for (var i = 0; i < fields.length; i++) {
      fields[i].classList.remove("has-error");
    }
    var inputs = form.querySelectorAll(".is-invalid");
    for (var j = 0; j < inputs.length; j++) {
      inputs[j].classList.remove("is-invalid");
    }
  }

  function markError(el, message) {
    var wrap = el.closest(".book__field");
    if (wrap) {
      wrap.classList.add("has-error");
      var err = wrap.querySelector(".book__error");
      if (err && message) err.textContent = message;
    }
    el.classList.add("is-invalid");
  }

  function validate() {
    clearErrors();
    var ok = true;

    if (!roomEl.value) {
      markError(roomEl, "Please select a room.");
      ok = false;
    }
    if (!checkInEl.value) {
      markError(checkInEl, "Check-in is required.");
      ok = false;
    }
    if (!checkOutEl.value) {
      markError(checkOutEl, "Check-out is required.");
      ok = false;
    }
    if (getNights() < 1) {
      markError(checkOutEl, "Check-out must be after check-in.");
      ok = false;
    }
    if (!firstNameEl.value.trim()) {
      markError(firstNameEl, "First name is required.");
      ok = false;
    }
    if (!lastNameEl.value.trim()) {
      markError(lastNameEl, "Last name is required.");
      ok = false;
    }
    var email = emailEl.value.trim();
    if (!email || email.indexOf("@") < 1) {
      markError(emailEl, "A valid email is required.");
      ok = false;
    }
    if (!phoneEl.value.trim()) {
      markError(phoneEl, "Phone number is required.");
      ok = false;
    }

    return ok;
  }

  function buildHotelRunnerUrl() {
    var params = new URLSearchParams();
    params.set("check_in", checkInEl.value);
    params.set("check_out", checkOutEl.value);
    params.set("adults", String(parseInt(adultsEl.value, 10) || 2));
    params.set("children", String(parseInt(childrenEl.value, 10) || 0));
    params.set("guests", String(
      (parseInt(adultsEl.value, 10) || 0) + (parseInt(childrenEl.value, 10) || 0),
    ));
    return HOTELRUNNER_BASE + "?" + params.toString();
  }

  function buildNotificationBody() {
    return [
      "New online booking request — Derand Hotel",
      "",
      "Room: " + getRoomLabel(),
      "Check-in: " + checkInEl.value,
      "Check-out: " + checkOutEl.value,
      "Stay: " + summaryStay.textContent,
      "Guests: " + getGuestSummary(),
      "",
      "Guest: " + firstNameEl.value.trim() + " " + lastNameEl.value.trim(),
      "Email: " + emailEl.value.trim(),
      "Phone: " + phoneEl.value.trim(),
      "",
      "Notes:",
      notesEl.value.trim() || "(none)",
    ].join("\n");
  }

  function applyQueryParams() {
    var q = new URLSearchParams(window.location.search);
    var room = q.get("room");
    if (room) {
      for (var i = 0; i < roomEl.options.length; i++) {
        if (roomEl.options[i].value === room) {
          roomEl.selectedIndex = i;
          break;
        }
      }
    }
    if (q.get("checkin")) checkInEl.value = q.get("checkin");
    if (q.get("checkout")) checkOutEl.value = q.get("checkout");
    if (q.get("adults")) adultsEl.value = q.get("adults");
    if (q.get("children")) childrenEl.value = q.get("children");
    setMinDates();
    updateSummary();
  }

  function notifyHotel() {
    var payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "Booking request — " + getRoomLabel() + " — " + checkInEl.value,
      from_name: "Derand Hotel Booking",
      email: NOTIFY_EMAIL,
      replyto: emailEl.value.trim(),
      message: buildNotificationBody(),
    };
    return fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }).catch(function () {
      return null;
    });
  }

  function onSubmit(event) {
    event.preventDefault();
    updateSummary();
    if (!validate()) {
      statusEl.textContent = "Please complete the highlighted fields.";
      statusEl.className = "book__status is-error";
      return;
    }

    submitBtn.disabled = true;
    statusEl.textContent = "Preparing secure payment…";
    statusEl.className = "book__status";

    var paymentUrl = buildHotelRunnerUrl();

    notifyHotel().finally(function () {
      statusEl.textContent = "Redirecting to secure card payment…";
      statusEl.className = "book__status is-success";
      window.setTimeout(function () {
        window.location.href = paymentUrl;
      }, 600);
    });
  }

  [
    roomEl,
    checkInEl,
    checkOutEl,
    adultsEl,
    childrenEl,
  ].forEach(function (el) {
    el.addEventListener("change", updateSummary);
    el.addEventListener("input", updateSummary);
  });

  checkInEl.addEventListener("change", updateCheckOutMin);
  checkInEl.addEventListener("input", updateCheckOutMin);

  form.addEventListener("submit", onSubmit);

  setMinDates();
  applyQueryParams();
  updateSummary();
})();
