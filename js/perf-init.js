(() => {
  "use strict";

  function wrapJqueryPlugins() {
    if (!window.jQuery) return;
    const $ = window.jQuery;

    function deferPlugin(pluginName, delayMs) {
      if (!$.fn || !$.fn[pluginName]) return;
      const original = $.fn[pluginName];
      if (original.__deferredWrapped) return;

      const wrapped = function (...args) {
        return this.each(function () {
          const node = this;
          window.requestAnimationFrame(() => {
            window.setTimeout(() => {
              original.apply($(node), args);
            }, delayMs);
          });
        });
      };

      wrapped.__deferredWrapped = true;
      $.fn[pluginName] = wrapped;
    }

    deferPlugin("owlCarousel", 120);
    deferPlugin("niceSelect", 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wrapJqueryPlugins, { once: true });
  } else {
    wrapJqueryPlugins();
  }
})();
