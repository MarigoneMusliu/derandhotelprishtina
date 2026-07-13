(function () {
  "use strict";

  var MOBILE_QUERY = "(max-width: 767px)";
  var sizingTimer = null;

  function injectChatbaseStyles() {
    if (document.getElementById("derand-chatbase-styles")) return;

    var link = document.createElement("link");
    link.id = "derand-chatbase-styles";
    link.rel = "stylesheet";
    link.href = "css/chatbase-widget.css?v=4";
    document.head.appendChild(link);
  }

  function isMobileViewport() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function getViewportHeight() {
    if (window.visualViewport && window.visualViewport.height) {
      return Math.round(window.visualViewport.height);
    }
    return Math.round(window.innerHeight);
  }

  function isChatWindowOpen(windowEl) {
    if (!windowEl) return false;

    var style = window.getComputedStyle(windowEl);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      parseFloat(style.opacity || "1") === 0
    ) {
      return false;
    }

    if (windowEl.getAttribute("aria-hidden") === "true") {
      return false;
    }

    var rect = windowEl.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function applyCompactChatbaseSizing() {
    var button = document.getElementById("chatbase-bubble-button");
    var windowEl = document.getElementById("chatbase-bubble-window");
    var isMobile = isMobileViewport();
    var insetX = isMobile ? 20 : 20;
    var buttonSize = isMobile ? 38 : 46;
    var viewportWidth = Math.round(
      window.visualViewport ? window.visualViewport.width : window.innerWidth,
    );
    var viewportHeight = getViewportHeight();
    var safeBottom =
      "calc(" + (isMobile ? 12 : 28) + "px + env(safe-area-inset-bottom, 0px))";

    if (button) {
      button.style.setProperty("width", buttonSize + "px", "important");
      button.style.setProperty("height", buttonSize + "px", "important");
      button.style.setProperty("min-width", buttonSize + "px", "important");
      button.style.setProperty("min-height", buttonSize + "px", "important");
      button.style.setProperty("right", insetX + "px", "important");
      button.style.setProperty("left", "auto", "important");
      button.style.setProperty("bottom", safeBottom, "important");
      button.style.setProperty("pointer-events", "auto", "important");
    }

    if (!windowEl || !isChatWindowOpen(windowEl)) {
      return;
    }

    var chatWidth = isMobile
      ? Math.min(300, viewportWidth - 40)
      : Math.min(320, viewportWidth - 40);
    var chatHeight = isMobile
      ? Math.min(Math.round(viewportHeight * 0.56), 420, viewportHeight - 108)
      : Math.min(500, viewportHeight - 120);
    var windowBottom =
      "calc(" + safeBottom + " + " + buttonSize + "px + 10px)";

    windowEl.style.setProperty("width", chatWidth + "px", "important");
    windowEl.style.setProperty("max-width", chatWidth + "px", "important");
    windowEl.style.setProperty("height", chatHeight + "px", "important");
    windowEl.style.setProperty("max-height", chatHeight + "px", "important");
    windowEl.style.setProperty("right", insetX + "px", "important");
    windowEl.style.setProperty("left", "auto", "important");
    windowEl.style.setProperty("bottom", windowBottom, "important");
    windowEl.style.setProperty("overflow", "visible", "important");
    windowEl.style.setProperty("pointer-events", "auto", "important");

    var iframe = windowEl.querySelector("iframe");
    if (iframe) {
      iframe.style.setProperty("width", "100%", "important");
      iframe.style.setProperty("height", "100%", "important");
      iframe.style.setProperty("border", "0", "important");
      iframe.style.setProperty("pointer-events", "auto", "important");
    }
  }

  function scheduleSizing() {
    if (sizingTimer) window.clearTimeout(sizingTimer);
    sizingTimer = window.setTimeout(applyCompactChatbaseSizing, 80);
  }

  function isLikelyCloseControl(node) {
    if (!node || node.nodeType !== 1) return false;

    var tag = node.tagName ? node.tagName.toLowerCase() : "";
    if (tag !== "button" && node.getAttribute("role") !== "button") {
      return false;
    }

    var label = (
      node.getAttribute("aria-label") ||
      node.getAttribute("title") ||
      node.textContent ||
      ""
    )
      .trim()
      .toLowerCase();

    if (
      /close|dismiss|minimize|hide/.test(label) ||
      node.className.toLowerCase().indexOf("close") !== -1
    ) {
      return true;
    }

    var svg = node.querySelector("svg");
    if (!svg) return false;

    var box = node.getBoundingClientRect();
    return box.width > 0 && box.width <= 44 && box.height > 0 && box.height <= 44;
  }

  function wireCloseFallback() {
    document.addEventListener(
      "click",
      function (event) {
        var windowEl = document.getElementById("chatbase-bubble-window");
        if (!windowEl || !windowEl.contains(event.target)) return;

        var control = event.target.closest
          ? event.target.closest("button, [role='button']")
          : null;
        if (!control || !isLikelyCloseControl(control)) return;

        window.setTimeout(function () {
          if (isChatWindowOpen(windowEl)) {
            if (typeof window.chatbase === "function") {
              try {
                window.chatbase("close");
              } catch (e) {
                try {
                  window.chatbase.close();
                } catch (err) {}
              }
            }
          }
        }, 0);
      },
      true,
    );
  }

  function watchChatbaseSizing() {
    applyCompactChatbaseSizing();

    if (typeof MutationObserver === "undefined") return;

    var observer = new MutationObserver(function (mutations) {
      var shouldResize = false;

      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.type !== "childList") continue;

        var nodes = mutation.addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j];
          if (node.nodeType !== 1) continue;
          if (
            node.id === "chatbase-bubble-window" ||
            node.id === "chatbase-bubble-button" ||
            (node.querySelector &&
              (node.querySelector("#chatbase-bubble-window") ||
                node.querySelector("#chatbase-bubble-button")))
          ) {
            shouldResize = true;
            break;
          }
        }
        if (shouldResize) break;
      }

      if (shouldResize) scheduleSizing();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("resize", scheduleSizing, { passive: true });
    window.addEventListener("orientationchange", function () {
      window.setTimeout(scheduleSizing, 200);
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", scheduleSizing, {
        passive: true,
      });
    }

    if (typeof window.chatbase === "function") {
      try {
        window.chatbase.addEventListener("open", scheduleSizing);
        window.chatbase.addEventListener("close", scheduleSizing);
      } catch (e) {}
    }
  }

  window.derandLoadChatbaseWidget = function () {
    if (window.__derandSkipChatbase) return;
    if (window.__derandChatbaseLoaded) return;
    window.__derandChatbaseLoaded = true;

    injectChatbaseStyles();
    wireCloseFallback();

    (function () {
      if (
        !window.chatbase ||
        window.chatbase("getState") !== "initialized"
      ) {
        window.chatbase = function () {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(arguments);
        };
        window.chatbase = new Proxy(window.chatbase, {
          get: function (target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return function () {
              var args = [].slice.call(arguments);
              return target.apply(null, [prop].concat(args));
            };
          },
        });
      }

      var onLoad = function () {
        var script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "gzgmglcFdDISSeTbzfIwM";
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);
        window.setTimeout(scheduleSizing, 600);
        window.setTimeout(scheduleSizing, 1800);
      };

      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }
    })();

    watchChatbaseSizing();
  };

  window.derandLoadChatbaseWidget();
})();
