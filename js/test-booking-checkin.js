(function () {
  if (!window.__derandTestBookingPage) return;

  var OTELLO_API =
    (window.location.origin || "").replace(/\/$/, "") +
    "/api/otello-create-reservation.php";

  function $(id) {
    return document.getElementById(id);
  }

  function phoneDigits(value) {
    return ((value || "").match(/\d/g) || []).length;
  }

  function isPhoneValid(value) {
    var digits = phoneDigits(value);
    return digits >= 5 && digits <= 20;
  }

  function parseIso(value) {
    if (!value) return null;
    var parts = value.split("-");
    if (parts.length !== 3) return null;
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  function formatDate(value) {
    var date = parseIso(value);
    if (!date) return value || "—";
    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function setStatus(message, type) {
    var statusEl = $("booking-details-status");
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.className =
      "booking-details__status" + (type ? " is-" + type : "");
    if (message && typeof statusEl.scrollIntoView === "function") {
      statusEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function getOtelloApiUrl() {
    var origin = window.location.origin || "";
    var href = window.location.href || "";
    if (
      !origin ||
      origin === "null" ||
      origin.indexOf("file:") === 0 ||
      href.indexOf("file:") === 0
    ) {
      return "";
    }
    return OTELLO_API;
  }

  function explainEnvironmentBlock() {
    var origin = window.location.origin || "";
    var href = window.location.href || "";

    if (
      !origin ||
      origin === "null" ||
      origin.indexOf("file:") === 0 ||
      href.indexOf("file:") === 0
    ) {
      return (
        "Open this page on the live website, not from your Desktop folder:\n\n" +
        "https://www.derandhotel.com/test.html"
      );
    }

    return (
      "Could not reach the Otello API.\n\n" +
      "Upload to Hostinger:\n" +
      "- api/otello-lib.php\n" +
      "- api/otello-config.php\n" +
      "- api/otello-create-reservation.php"
    );
  }

  function readGuestPayload() {
    return {
      checkin: ($("booking-checkin") || {}).value
        ? $("booking-checkin").value.trim()
        : "",
      checkout: ($("booking-checkout") || {}).value
        ? $("booking-checkout").value.trim()
        : "",
      adults: $("booking-adults")
        ? parseInt($("booking-adults").value, 10) || 1
        : 1,
      children: $("booking-children")
        ? parseInt($("booking-children").value, 10) || 0
        : 0,
      firstname: ($("booking-first-name") || {}).value
        ? $("booking-first-name").value.trim()
        : "",
      lastname: ($("booking-last-name") || {}).value
        ? $("booking-last-name").value.trim()
        : "",
      email: ($("booking-email") || {}).value
        ? $("booking-email").value.trim()
        : "",
      tel: ($("booking-phone") || {}).value
        ? $("booking-phone").value.trim()
        : "",
      note: ($("booking-notes") || {}).value
        ? $("booking-notes").value.trim()
        : "",
      form: $("booking-details-form"),
    };
  }

  function validateGuest(payload) {
    var problems = [];

    if (!payload.firstname) problems.push("Name is required.");
    if (!payload.lastname) problems.push("Surname is required.");
    if (!payload.email || payload.email.indexOf("@") < 1) {
      problems.push("A valid email is required.");
    }
    if (!payload.tel || !isPhoneValid(payload.tel)) {
      problems.push("Phone must contain 5–20 digits.");
    }

    var start = parseIso(payload.checkin);
    var end = parseIso(payload.checkout);
    if (!start || !end || end <= start) {
      problems.push("Check-out must be after check-in.");
    }

    if (problems.length) {
      setStatus(problems[0], "error");
      window.alert("Please fix the form:\n\n- " + problems.join("\n- "));
      if (payload.form && typeof payload.form.reportValidity === "function") {
        payload.form.reportValidity();
      }
      return false;
    }

    return true;
  }

  function parseJsonResponse(response) {
    return response.text().then(function (text) {
      var data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          data = { raw: text };
        }
      }

      if (!response.ok || (data && data.ok === false)) {
        var message =
          (data && (data.error || data.message)) ||
          (data && data.response && data.response.message) ||
          "Otello request failed (HTTP " + response.status + ").";
        if (data && data.step) {
          message += " Step: " + data.step + ".";
        }
        throw new Error(message);
      }

      return data;
    });
  }

  function formatSuccess(data) {
    var lines = ["Reservation sent to Otello PMS successfully!"];
    if (data.status) {
      lines.push("Status: " + data.status + (data.status === "A" ? " (Active)" : ""));
    }
    if (data.reservatno) {
      lines.push("Reservation number: " + data.reservatno);
    }
    if (data.reservatGid) {
      lines.push("Internal ID: " + data.reservatGid);
    }
    if (data.warning) {
      lines.push("Note: " + data.warning);
    }
    lines.push("");
    lines.push("Check Otello PMS → Future reservations.");
    return lines.join("\n");
  }

  var sending = false;

  function sendTestReservation() {
    if (sending) return;

    var sendBtn = $("booking-confirm-checkin");
    var payload = readGuestPayload();

    if (!validateGuest(payload)) {
      return;
    }

    if (
      !window.confirm(
        "Send this Junior Suite test booking to Otello WITHOUT payment?\n\n" +
          "Guest: " +
          payload.firstname +
          " " +
          payload.lastname +
          "\n" +
          "Check-in: " +
          formatDate(payload.checkin) +
          "\n" +
          "Check-out: " +
          formatDate(payload.checkout),
      )
    ) {
      return;
    }

    var apiUrl = getOtelloApiUrl();
    if (!apiUrl) {
      var blocked = explainEnvironmentBlock();
      setStatus(blocked.split("\n")[0], "error");
      window.alert(blocked);
      return;
    }

    sending = true;
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.setAttribute("aria-busy", "true");
    }
    setStatus("Sending test reservation to Otello PMS…", "success");

    var orderRef =
      "TEST-" + new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
    var note = "[Website test booking — no payment]";
    if (payload.note) {
      note += " " + payload.note;
    }

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchantOrderReference: orderRef,
        roomType: "junior-suite",
        checkin: payload.checkin,
        checkout: payload.checkout,
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
        tel: payload.tel,
        totalpax: payload.adults,
        totalchd1: payload.children,
        note: note,
      }),
    })
      .then(parseJsonResponse)
      .then(function (data) {
        var message = formatSuccess(data);
        setStatus(
          "Success — Otello status " + (data.status || "OK") +
            (data.reservatno ? ", reservation #" + data.reservatno : ""),
          "success",
        );
        window.alert(message);
      })
      .catch(function (error) {
        var message =
          (error && error.message) ||
          "Could not send booking. Open browser console (F12) for details.";
        if (message === "Failed to fetch") {
          message = explainEnvironmentBlock();
        }
        setStatus(message.split("\n")[0], "error");
        window.alert("Otello test booking failed:\n\n" + message);
      })
      .finally(function () {
        sending = false;
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.removeAttribute("aria-busy");
        }
      });
  }

  window.__derandSendTestReservation = sendTestReservation;

  function bindTestPage() {
    var sendBtn = $("booking-confirm-checkin");
    var form = $("booking-details-form");

    if (sendBtn && sendBtn.dataset.bound !== "1") {
      sendBtn.dataset.bound = "1";
      sendBtn.addEventListener("click", function (event) {
        event.preventDefault();
        sendTestReservation();
      });
    }

    if (form && form.dataset.testSubmitBound !== "1") {
      form.dataset.testSubmitBound = "1";
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        sendTestReservation();
      });
    }

    window.__derandTestCheckinReady = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindTestPage);
  } else {
    bindTestPage();
  }
  window.addEventListener("load", bindTestPage);
})();
