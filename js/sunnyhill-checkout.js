(function () {
  var WEB3FORMS_URL = "https://api.web3forms.com/submit";
  var WEB3FORMS_ACCESS_KEY = "761d8dce-87b2-4534-bc76-77ec2305d4ec";
  var ORDER_TO_EMAIL = "info@derandhotel.com";
  var PAYMENT_CREATE_URL =
    (window.location.origin || "") + "/api/raiaccept-create-checkout.php";
  var PAYMENT_STATUS_URL =
    (window.location.origin || "") + "/api/raiaccept-order-status.php";
  var PENDING_KEY = "derand_sunnyhill_pending_v1";
  var SENT_KEY_PREFIX = "derand_sunnyhill_emailed_";

  var checkoutRoot = document.getElementById("sunnyhill-checkout");
  var checkoutForm = document.getElementById("sunnyhill-checkout-form");
  var payBtn = document.getElementById("sunnyhill-checkout-pay-btn");
  var statusEl = document.getElementById("sunnyhill-checkout-status");
  var summaryEl = document.getElementById("sunnyhill-checkout-summary");

  var passNameEl = document.getElementById("sunnyhill-checkout-pass-name");
  var passModeEl = document.getElementById("sunnyhill-checkout-pass-mode");
  var passDetailEl = document.getElementById("sunnyhill-checkout-pass-detail");
  var passPriceEl = document.getElementById("sunnyhill-checkout-pass-price");
  var totalEl = document.getElementById("sunnyhill-checkout-total");

  var selectedPass = null;
  var passGrid = document.querySelector(".sunnyhill-passes__grid");

  if (!checkoutRoot || !checkoutForm) {
    return;
  }

  function getPricingMode() {
    return passGrid && passGrid.dataset.passPricing === "couple" ? "couple" : "solo";
  }

  function applyPassMode(mode) {
    var pricingMode = mode === "couple" ? "couple" : "solo";
    if (passGrid) {
      passGrid.dataset.passPricing = pricingMode;
    }

    document.querySelectorAll(".sunnyhill-passes__mode-btn").forEach(function (btn) {
      var isActive = btn.dataset.passMode === pricingMode;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    document.querySelectorAll(".pass-card__price").forEach(function (priceEl) {
      var valueEl = priceEl.querySelector(".pass-card__price-value");
      if (!valueEl) return;
      var amount =
        pricingMode === "couple"
          ? priceEl.getAttribute("data-price-couple")
          : priceEl.getAttribute("data-price-solo");
      if (amount) valueEl.textContent = amount;
    });

    document.querySelectorAll("[data-room-solo]").forEach(function (roomEl) {
      roomEl.textContent =
        pricingMode === "couple"
          ? roomEl.getAttribute("data-room-couple") || roomEl.textContent
          : roomEl.getAttribute("data-room-solo") || roomEl.textContent;
    });
  }

  if (passGrid) {
    document.querySelectorAll(".sunnyhill-passes__mode-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyPassMode(btn.dataset.passMode || "solo");
      });
    });
    applyPassMode("solo");
  }

  function formatEuro(amount) {
    var n = Math.round(Number(amount) * 100) / 100;
    if (isNaN(n)) n = 0;
    return Math.round(n) + " EUR";
  }

  function parseJsonResponse(response) {
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
      if (!response.ok) {
        throw new Error(
          apiMessage || "We could not start secure payment. Please try again.",
        );
      }
      if (data && data.ok === false) {
        throw new Error(
          apiMessage || "We could not start secure payment. Please try again.",
        );
      }
      return data;
    });
  }

  function setStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.classList.toggle("is-error", !!isError);
  }

  function openCheckout(passCard) {
    var mode = getPricingMode();
    var priceEl = passCard.querySelector(".pass-card__price");
    if (!priceEl) return;

    var amount = parseInt(
      mode === "couple"
        ? priceEl.getAttribute("data-price-couple")
        : priceEl.getAttribute("data-price-solo"),
      10,
    );
    if (!amount || isNaN(amount)) return;

    selectedPass = {
      id: passCard.getAttribute("data-pass-id") || "pass",
      title: passCard.getAttribute("data-pass-title") || "Festival Pass",
      detail: passCard.getAttribute("data-pass-detail") || "",
      mode: mode,
      amount: amount,
    };

    if (passNameEl) passNameEl.textContent = selectedPass.title;
    if (passModeEl) {
      passModeEl.textContent =
        mode === "couple" ? "Couple ticket" : "Solo ticket";
    }
    if (passDetailEl) passDetailEl.textContent = selectedPass.detail;
    if (passPriceEl) passPriceEl.textContent = String(amount);
    if (totalEl) totalEl.textContent = formatEuro(amount);

    if (summaryEl) {
      summaryEl.classList.remove(
        "pass-card--standard",
        "pass-card--featured",
        "pass-card--ultra",
        "sunnyhill-checkout__summary--vip",
        "sunnyhill-checkout__summary--ultra",
      );
      if (selectedPass.id === "vip") {
        summaryEl.classList.add("pass-card--featured", "sunnyhill-checkout__summary--vip");
      } else if (selectedPass.id === "ultra") {
        summaryEl.classList.add("pass-card--ultra", "sunnyhill-checkout__summary--ultra");
      } else {
        summaryEl.classList.add("pass-card--standard");
      }
    }

    setStatus("", false);
    checkoutRoot.classList.add("is-open");
    checkoutRoot.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    var firstInput = checkoutForm.querySelector("input");
    if (firstInput) {
      window.setTimeout(function () {
        firstInput.focus();
      }, 280);
    }
  }

  function closeCheckout() {
    checkoutRoot.classList.remove("is-open");
    checkoutRoot.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".extra-cart-drawer.is-open")) {
      document.body.style.overflow = "";
    }
  }

  function buildEmailPayload(pending, orderReference) {
    var guest = pending.guest || {};
    var pass = pending.pass || {};
    var fullMessage = [
      "SUNNY HILL PASS — PAID",
      "====================",
      "",
      "Recipient: " + ORDER_TO_EMAIL,
      "",
      "Pass",
      "----",
      "Type: " + pass.title,
      "Package: " + (pass.mode === "couple" ? "Couple" : "Solo"),
      "Detail: " + (pass.detail || ""),
      "Total: " + formatEuro(pass.amount),
      "Order reference: " + orderReference,
      "",
      "Guest",
      "-----",
      "First name: " + (guest.firstName || ""),
      "Surname: " + (guest.lastName || ""),
      "Phone: " + (guest.phone || ""),
      "Email: " + (guest.email || ""),
      "",
      "Sent from: sunnyhill.html",
      "Time: " + new Date().toLocaleString("en-GB", { hour12: false }),
    ].join("\n");

    return {
      subject:
        "[Sunny Hill PAID] " +
        pass.title +
        " (" +
        (pass.mode === "couple" ? "Couple" : "Solo") +
        ") — " +
        guest.lastName,
      from_name: "Derand Hotel — Sunny Hill",
      to_email: ORDER_TO_EMAIL,
      recipient: ORDER_TO_EMAIL,
      name: (guest.firstName || "") + " " + (guest.lastName || ""),
      email: guest.email || "",
      phone: guest.phone || "",
      message: fullMessage,
    };
  }

  function sendToHotelInbox(payload) {
    return fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(
        Object.assign(
          {
            access_key: WEB3FORMS_ACCESS_KEY,
            to_email: ORDER_TO_EMAIL,
            recipient: ORDER_TO_EMAIL,
          },
          payload,
        ),
      ),
    });
  }

  function savePending(record) {
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify(record));
    } catch (error) {
      /* ignore */
    }
  }

  function getPending() {
    try {
      var raw = localStorage.getItem(PENDING_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function removePending() {
    try {
      localStorage.removeItem(PENDING_KEY);
    } catch (error) {
      /* ignore */
    }
  }

  function markEmailSent(orderReference) {
    try {
      sessionStorage.setItem(SENT_KEY_PREFIX + orderReference, "1");
    } catch (error) {
      /* ignore */
    }
  }

  function wasEmailSent(orderReference) {
    try {
      return sessionStorage.getItem(SENT_KEY_PREFIX + orderReference) === "1";
    } catch (error) {
      return false;
    }
  }

  function completePaidOrder(pending, orderReference) {
    if (wasEmailSent(orderReference)) {
      setStatus(
        "Payment received. Your pass confirmation was already sent to the hotel.",
        false,
      );
      return Promise.resolve();
    }

    setStatus("Payment confirmed. Sending your details to the hotel…", false);

    return sendToHotelInbox(buildEmailPayload(pending, orderReference))
      .then(function (response) {
        return response.json().then(function (json) {
          return { ok: response.ok, json: json };
        });
      })
      .then(function (result) {
        if (!result.ok || !result.json || !result.json.success) {
          throw new Error("Email failed");
        }
        markEmailSent(orderReference);
        removePending();
        setStatus(
          "Thank you — payment received and your pass details were sent to the hotel.",
          false,
        );
      })
      .catch(function () {
        setStatus(
          "Payment succeeded, but we could not email the hotel automatically. Please contact " +
            ORDER_TO_EMAIL +
            " with reference " +
            orderReference +
            ".",
          true,
        );
      });
  }

  function verifyReturnedPayment(paymentState, orderReference) {
    var pending = getPending();
    if (!pending || pending.merchantOrderReference !== orderReference) {
      if (wasEmailSent(orderReference)) {
        setStatus(
          "Thank you — your payment was already received and the hotel was notified.",
          false,
        );
        checkoutRoot.classList.add("is-open");
        checkoutRoot.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        return;
      }
      setStatus(
        "Payment return received. Please contact the hotel with reference " +
          orderReference +
          ".",
        true,
      );
      checkoutRoot.classList.add("is-open");
      checkoutRoot.setAttribute("aria-hidden", "false");
      return;
    }

    if (paymentState === "cancel") {
      setStatus("Payment was cancelled. You can try again when ready.", true);
      checkoutRoot.classList.add("is-open");
      checkoutRoot.setAttribute("aria-hidden", "false");
      return;
    }

    if (paymentState === "fail") {
      setStatus(
        "Payment was not completed. Please try again or contact the hotel.",
        true,
      );
      checkoutRoot.classList.add("is-open");
      checkoutRoot.setAttribute("aria-hidden", "false");
      return;
    }

    if (!pending.orderIdentification) {
      setStatus(
        "Payment return received. Please contact the hotel with reference " +
          orderReference +
          ".",
        true,
      );
      return;
    }

    setStatus("Checking payment status…", false);
    checkoutRoot.classList.add("is-open");
    checkoutRoot.setAttribute("aria-hidden", "false");

    fetch(
      PAYMENT_STATUS_URL +
        "?orderIdentification=" +
        encodeURIComponent(pending.orderIdentification),
      { method: "GET", headers: { Accept: "application/json" } },
    )
      .then(parseJsonResponse)
      .then(function (data) {
        if ((data && data.paymentStatus) === "paid") {
          return completePaidOrder(pending, orderReference);
        }
        if (data && data.paymentStatus === "cancelled") {
          setStatus("Payment was cancelled.", true);
          return;
        }
        if (data && data.paymentStatus === "failed") {
          setStatus("Payment was not completed.", true);
          return;
        }
        setStatus(
          "Payment is still processing. Contact the hotel with reference " +
            orderReference +
            " if needed.",
          false,
        );
      })
      .catch(function () {
        setStatus(
          "We could not verify payment automatically. Contact the hotel with reference " +
            orderReference +
            ".",
          true,
        );
      });
  }

  function handlePaymentReturn() {
    var params = new URLSearchParams(window.location.search || "");
    var paymentState = (params.get("payment") || "").trim().toLowerCase();
    var orderReference = (params.get("orderRef") || "").trim();
    if (!paymentState) return;

    if (window.history && window.history.replaceState) {
      params.delete("payment");
      params.delete("orderRef");
      var query = params.toString();
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + (query ? "?" + query : "") + window.location.hash,
      );
    }

    if (!orderReference) {
      setStatus("Payment return was missing a reference.", true);
      checkoutRoot.classList.add("is-open");
      checkoutRoot.setAttribute("aria-hidden", "false");
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

  document.addEventListener("click", function (event) {
    var checkoutBtn = event.target.closest("[data-pass-action='checkout']");
    if (checkoutBtn) {
      var card = checkoutBtn.closest(".pass-card");
      if (card) openCheckout(card);
      return;
    }

    if (event.target.closest("[data-checkout-close]")) {
      closeCheckout();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && checkoutRoot.classList.contains("is-open")) {
      closeCheckout();
    }
  });

  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!selectedPass) return;

    var firstName = (checkoutForm.firstName.value || "").trim();
    var lastName = (checkoutForm.lastName.value || "").trim();
    var phone = (checkoutForm.phone.value || "").trim();
    var email = (checkoutForm.email.value || "").trim();

    if (!firstName || !lastName || !phone || !email) {
      setStatus("Please fill in all guest details.", true);
      return;
    }

    var modeLabel = selectedPass.mode === "couple" ? "Couple" : "Solo";
    var productName =
      "Sunny Hill " + selectedPass.title + " (" + modeLabel + ")";

    if (payBtn) payBtn.disabled = true;
    setStatus("Preparing secure payment…", false);

    fetch(PAYMENT_CREATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        productName: productName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        returnPath: "/sunnyhill.html",
        items: [
          {
            description: productName,
            quantity: 1,
            unitPrice: selectedPass.amount,
          },
        ],
      }),
    })
      .then(parseJsonResponse)
      .then(function (data) {
        if (!data || !data.checkoutUrl || !data.merchantOrderReference) {
          throw new Error("Payment session was incomplete.");
        }
        savePending({
          merchantOrderReference: data.merchantOrderReference,
          orderIdentification: data.orderIdentification || "",
          pass: selectedPass,
          guest: {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
          },
          createdAt: new Date().toISOString(),
        });
        setStatus("Redirecting to secure payment…", false);
        window.location.href = data.checkoutUrl;
      })
      .catch(function (error) {
        setStatus(
          (error && error.message) ||
            "We could not start payment. Please try again or email " +
              ORDER_TO_EMAIL +
              ".",
          true,
        );
        if (payBtn) payBtn.disabled = false;
      });
  });

  handlePaymentReturn();
})();
