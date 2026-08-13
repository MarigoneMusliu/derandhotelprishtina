(function () {
  "use strict";

  var tabsScroll = document.querySelector(".mb-tabs__scroll");
  var tabs = document.querySelectorAll(".mb-tab");
  var cards = document.querySelectorAll(".mb-card");
  var grid = document.querySelector(".mb-grid");
  var prevBtn = document.querySelector(".mb-tabs__arrow--prev");
  var nextBtn = document.querySelector(".mb-tabs__arrow--next");
  var indicator = document.querySelector(".mb-tabs__indicator");
  var activeCategory = "all";
  var staggerStep = 0.04;
  var introStaggerStep = 0.07;
  var introBaseDelay = 0.75;

  document.body.classList.add("is-intro");

  function updateIndicator() {
    if (!indicator || !tabsScroll) return;

    var activeTab = tabsScroll.querySelector(".mb-tab.is-active");
    if (!activeTab) return;

    var scrollLeft = tabsScroll.scrollLeft;
    var left = activeTab.offsetLeft - scrollLeft;
    var width = activeTab.offsetWidth;

    indicator.style.left = left + "px";
    indicator.style.width = width + "px";
    indicator.classList.add("is-visible");
  }

  function setStaggerDelays(isIntro) {
    var visibleIndex = 0;
    var step = isIntro ? introStaggerStep : staggerStep;
    var base = isIntro ? introBaseDelay : 0;

    cards.forEach(function (card) {
      if (card.hidden) {
        card.style.animationDelay = "0s";
        card.style.transitionDelay = "0s";
        return;
      }

      var delay = base + visibleIndex * step;
      if (isIntro) {
        card.style.animationDelay = delay + "s";
        card.style.transitionDelay = "0s";
      } else {
        card.style.transitionDelay = visibleIndex * step + "s";
        card.style.animationDelay = "0s";
      }

      visibleIndex += 1;
    });
  }

  function setActiveTab(category) {
    activeCategory = category;
    tabs.forEach(function (tab) {
      var isActive = tab.getAttribute("data-category") === category;
      tab.classList.toggle("is-active", isActive);
      if (isActive && tabsScroll) {
        tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        window.setTimeout(updateIndicator, 320);
      }
    });

    window.requestAnimationFrame(updateIndicator);
  }

  function showCategory(category, isIntro) {
    if (!grid) return;

    grid.classList.remove("is-ready");
    grid.classList.add("is-switching");

    window.setTimeout(function () {
      cards.forEach(function (card) {
        var cardCategory = card.getAttribute("data-category");
        var match = category === "all" || cardCategory === category;
        card.hidden = !match;
      });

      setStaggerDelays(!!isIntro);
      grid.classList.remove("is-switching");

      window.requestAnimationFrame(function () {
        grid.classList.add("is-ready");
      });
    }, isIntro ? 220 : 200);
  }

  function selectCategory(category) {
    if (category === activeCategory) return;
    setActiveTab(category);
    showCategory(category, false);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      selectCategory(tab.getAttribute("data-category") || "all");
    });
  });

  if (prevBtn && tabsScroll) {
    prevBtn.addEventListener("click", function () {
      tabsScroll.scrollBy({ left: -120, behavior: "smooth" });
      window.setTimeout(updateIndicator, 320);
    });
  }

  if (nextBtn && tabsScroll) {
    nextBtn.addEventListener("click", function () {
      tabsScroll.scrollBy({ left: 120, behavior: "smooth" });
      window.setTimeout(updateIndicator, 320);
    });
  }

  if (tabsScroll) {
    tabsScroll.addEventListener("scroll", function () {
      window.requestAnimationFrame(updateIndicator);
    });
  }

  window.addEventListener("resize", updateIndicator);

  setActiveTab(activeCategory);
  showCategory(activeCategory, true);

  window.setTimeout(function () {
    updateIndicator();
  }, 900);

  window.setTimeout(function () {
    document.body.classList.remove("is-intro");
  }, 2600);
})();
