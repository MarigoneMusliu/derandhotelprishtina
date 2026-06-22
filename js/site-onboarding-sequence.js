(function () {

  /* Set to true to re-enable the Tidio live chat widget. */
  var TIDIO_CHAT_ENABLED = false;

  var TIDIO_URL = "https://code.tidio.co/bnuc9odotvfbltnpijihm3enhpjj0ovy.js";

  var COOKIE_DELAY_MS = 15000;

  var TIDIO_FALLBACK_MS = 20000;
  var TIDIO_OFFSET_UP_PX = 10;



  window.__derandUseOnboardingSequence = true;



  var tidioFallbackTimer = null;



  function isMobileViewport() {

    return window.matchMedia("(max-width: 767px)").matches;

  }



  function getWhatsAppIconBottomPx() {

    var icon = document.querySelector(

      ".site-whatsapp-wrap .site-whatsapp-fab__icon",

    );

    if (!icon) return null;

    var rect = icon.getBoundingClientRect();

    return Math.max(0, Math.round(window.innerHeight - rect.bottom));

  }



  function tidioTargets() {

    var list = [];

    var iframe = document.getElementById("tidio-chat-iframe");

    var chatIframe = document.querySelector("#tidio-chat iframe");

    var root = document.getElementById("tidio");

    if (iframe) list.push(iframe);

    if (chatIframe && chatIframe !== iframe) list.push(chatIframe);

    if (root) list.push(root);

    return list;

  }



  function applyTidioAlignment(bottomPx) {

    var isMobile = isMobileViewport();

    var bottom = bottomPx + "px";

    var primarySide = isMobile ? "right" : "left";

    var primaryVal = isMobile ? "14px" : "20px";

    var oppositeSide = isMobile ? "left" : "right";



    var targets = tidioTargets();

    for (var i = 0; i < targets.length; i++) {

      var node = targets[i];

      var pos = window.getComputedStyle(node).position;

      if (pos !== "fixed" && pos !== "absolute") continue;

      node.style.setProperty("bottom", bottom, "important");

      node.style.setProperty(primarySide, primaryVal, "important");

      node.style.setProperty(oppositeSide, "auto", "important");

      node.style.setProperty("top", "auto", "important");

      node.style.setProperty("transform", "none", "important");

      node.style.setProperty("margin-bottom", "0", "important");

    }



    var api = window.tidioChatApi;

    if (api && typeof api.adjustStyles === "function") {

      var rules =

        "#tidio-chat-iframe,#tidio-chat iframe,#tidio{bottom:" +

        bottomPx +

        "px!important;top:auto!important;transform:none!important;margin-bottom:0!important;";

      if (isMobile) {

        rules += "left:auto!important;right:14px!important;}";

        api.adjustStyles(rules);

        api.adjustStyles(

          "@media (max-width:767px){#tidio-chat-iframe,#tidio-chat iframe,#tidio{bottom:" +

            bottomPx +

            "px!important;left:auto!important;right:14px!important;transform:none!important;}}",

        );

      } else {

        rules += "left:20px!important;right:auto!important;}";

        api.adjustStyles(rules);

      }

    }

  }



  function forceTidioPosition() {

    if (!document.body.classList.contains("derand-tidio-enabled")) return;

    var bottomPx = getWhatsAppIconBottomPx();

    if (bottomPx === null) {

      bottomPx = isMobileViewport() ? 23 : 39;

    }

    bottomPx += TIDIO_OFFSET_UP_PX;

    applyTidioAlignment(bottomPx);

  }



  window.derandAlignFloatingFabs = forceTidioPosition;



  function clearTidioFallback() {

    if (tidioFallbackTimer) {

      window.clearTimeout(tidioFallbackTimer);

      tidioFallbackTimer = null;

    }

  }



  function shouldSkipTidio() {
    return !!window.__derandSkipTidio || !TIDIO_CHAT_ENABLED;
  }

  window.derandLoadTidioChat = function () {
    if (shouldSkipTidio() || window.__derandTidioLoaded) return;

    window.__derandTidioLoaded = true;

    clearTidioFallback();

    document.body.classList.add("derand-tidio-enabled");

    try {

      var s = document.createElement("script");

      s.src = TIDIO_URL;

      s.defer = true;

      document.body.appendChild(s);

    } catch (e) {}

    forceTidioPosition();

    var forceUntil = Date.now() + 60000;

    var forceTimer = window.setInterval(function () {

      forceTidioPosition();

      if (Date.now() > forceUntil) window.clearInterval(forceTimer);

    }, 400);

    document.addEventListener("tidioChat-ready", forceTidioPosition);

    if (window.tidioChatApi && typeof window.tidioChatApi.on === "function") {

      window.tidioChatApi.on("ready", forceTidioPosition);

    }

  };



  window.derandOnWhatsAppLabelClosing = function () {

    if (TIDIO_CHAT_ENABLED) {
      window.derandLoadTidioChat();
      return;
    }

    if (typeof window.derandLoadChatbaseWidget === "function") {
      window.derandLoadChatbaseWidget();
    }

  };



  var resizeTimer = null;

  window.addEventListener("resize", function () {

    if (resizeTimer) window.clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(forceTidioPosition, 120);

  });

  window.addEventListener("orientationchange", function () {

    window.setTimeout(forceTidioPosition, 280);

  });



  var heldCookie = null;



  function holdCookieBanner(node) {

    if (!node || node.dataset.onboardingHeld === "1") return;

    node.dataset.onboardingHeld = "1";

    node.classList.add("is-onboarding-held");

    node.classList.add("is-hidden");

    node.setAttribute("aria-hidden", "true");

    heldCookie = node;

  }



  function showCookieBanner() {

    if (!heldCookie || !heldCookie.parentNode) {

      heldCookie = document.querySelector(".cookie-consent");

    }

    if (!heldCookie) return;

    heldCookie.classList.remove("is-onboarding-held");

    heldCookie.classList.remove("is-hidden");

    heldCookie.classList.add("is-onboarding-show");

    heldCookie.setAttribute("aria-hidden", "false");

  }



  function watchForCookieBanner() {

    var existing = document.querySelector(".cookie-consent");

    if (existing) {

      holdCookieBanner(existing);

      return;

    }

    if (typeof MutationObserver === "undefined") return;

    var observer = new MutationObserver(function () {

      var node = document.querySelector(".cookie-consent");

      if (node) {

        holdCookieBanner(node);

        observer.disconnect();

      }

    });

    observer.observe(document.documentElement, {

      childList: true,

      subtree: true,

    });

  }



  function scheduleChatbaseFallback() {
    if (TIDIO_CHAT_ENABLED) return;
    window.setTimeout(function () {
      if (typeof window.derandLoadChatbaseWidget === "function") {
        window.derandLoadChatbaseWidget();
      }
    }, TIDIO_FALLBACK_MS);
  }



  function schedule() {

    watchForCookieBanner();

    if (TIDIO_CHAT_ENABLED && !shouldSkipTidio()) {
      tidioFallbackTimer = window.setTimeout(function () {
        if (!window.__derandTidioLoaded) window.derandLoadTidioChat();
      }, TIDIO_FALLBACK_MS);
    } else {
      scheduleChatbaseFallback();
    }

    window.setTimeout(showCookieBanner, COOKIE_DELAY_MS);

  }



  if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", schedule);

  } else {

    schedule();

  }

})();

