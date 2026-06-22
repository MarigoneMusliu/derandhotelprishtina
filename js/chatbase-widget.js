(function () {
  "use strict";

  function injectChatbaseStyles() {
    if (document.getElementById("derand-chatbase-styles")) return;

    var link = document.createElement("link");
    link.id = "derand-chatbase-styles";
    link.rel = "stylesheet";
    link.href = "css/chatbase-widget.css?v=1";
    document.head.appendChild(link);
  }

  function applyCompactChatbaseSizing() {
    var button = document.getElementById("chatbase-bubble-button");
    var windowEl = document.getElementById("chatbase-bubble-window");
    var isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (button) {
      var buttonSize = isMobile ? "42px" : "46px";
      button.style.setProperty("width", buttonSize, "important");
      button.style.setProperty("height", buttonSize, "important");
      button.style.setProperty("min-width", buttonSize, "important");
      button.style.setProperty("min-height", buttonSize, "important");
    }

    if (windowEl) {
      windowEl.style.setProperty("width", isMobile ? "min(300px, 90vw)" : "min(340px, 78vw)", "important");
      windowEl.style.setProperty("max-width", isMobile ? "300px" : "340px", "important");
      windowEl.style.setProperty("height", isMobile ? "min(460px, 62dvh)" : "min(540px, 68dvh)", "important");
      windowEl.style.setProperty("max-height", isMobile ? "62dvh" : "68dvh", "important");
    }
  }

  function watchChatbaseSizing() {
    applyCompactChatbaseSizing();

    if (typeof MutationObserver === "undefined") return;

    var observer = new MutationObserver(function () {
      applyCompactChatbaseSizing();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });

    window.addEventListener("resize", applyCompactChatbaseSizing, { passive: true });
  }

  window.derandLoadChatbaseWidget = function () {
    if (window.__derandChatbaseLoaded) return;
    window.__derandChatbaseLoaded = true;

    injectChatbaseStyles();

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
