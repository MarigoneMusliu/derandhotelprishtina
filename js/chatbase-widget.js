(function () {
  "use strict";

  window.derandLoadChatbaseWidget = function () {
    if (window.__derandChatbaseLoaded) return;
    window.__derandChatbaseLoaded = true;

    (function () {
      if (
        !window.chatbase ||
        window.chatbase("getState") !== "initialized"
      ) {
        window.chatbase = function () {
          var args = arguments;
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
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
  };

  window.derandLoadChatbaseWidget();
})();
