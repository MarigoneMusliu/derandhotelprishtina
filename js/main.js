/*  ---------------------------------------------------
  Template Name: Hiroto
  Description:  Hiroto Hotel HTML Template
  Author: Colorlib
  Author URI: https://colorlib.com
  Version: 1.0
  Created: Colorlib
---------------------------------------------------------  */

"use strict";

(function ($) {
  /*------------------
        Preloader
    --------------------*/
  $(window).on("load", function () {
    $(".loader").fadeOut();
    $("#preloder").delay(200).fadeOut("slow");
  });

  // Fallback: if load event is slow (hosting/photos/videos), ensure the page is usable.
  window.setTimeout(function () {
    $("#preloder").stop(true, true).fadeOut();
    $(".loader").stop(true, true).fadeOut();
  }, 5000);

  /*------------------
        Background Set
    --------------------*/
  $(".set-bg").each(function () {
    var bg = $(this).data("setbg");
    $(this).css("background-image", "url(" + bg + ")");
  });

  /*------------------
        Rooms Hero Rotator (crossfade between data-hero-rotate images)
    --------------------*/
  (function initRoomsHeroRotator() {
    var $hero = $(".rooms-page .hero[data-hero-rotate]");
    if (!$hero.length) return;

    var images = String($hero.data("hero-rotate") || "")
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);

    if (images.length < 2) return;

    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return;
    }

    /* Time between slide advances; crossfade duration in css/style.css (.rooms-hero-slides__layer) */
    var HOLD_MS = 1300;
    var url = function (src) {
      return "url(" + JSON.stringify(src) + ")";
    };

    $hero.css({
      "background-image": "none",
      "background-color": "transparent",
    });
    var $wrap = $('<div class="rooms-hero-slides" aria-hidden="true"></div>');
    var $a = $('<div class="rooms-hero-slides__layer"></div>');
    var $b = $('<div class="rooms-hero-slides__layer"></div>');
    $wrap.append($a, $b);
    $hero.prepend($wrap);

    var idx = 0;
    var $vis = $a;
    var $hid = $b;
    $vis.css("background-image", url(images[0]));
    $hid.css("background-image", url(images[1 % images.length]));
    $vis.addClass("is-visible");

    window.setInterval(function () {
      var nextIdx = (idx + 1) % images.length;
      $hid.css("background-image", url(images[nextIdx]));
      $hid.addClass("is-visible");
      $vis.removeClass("is-visible");
      var t = $vis;
      $vis = $hid;
      $hid = t;
      idx = nextIdx;
    }, HOLD_MS);
  })();

  function setMobileNavOpen(isOpen) {
    $("body").toggleClass("mobile-nav-open", !!isOpen);
    $("body").css("overflow", isOpen ? "hidden" : "");
  }

  // Canvas Menu toggle
  $(document).on("click", ".canvas__open", function (e) {
    e.preventDefault();
    $(".offcanvas-menu-wrapper").toggleClass("active");
    $(".offcanvas-menu-overlay").toggleClass("active");
    setMobileNavOpen($(".offcanvas-menu-wrapper").hasClass("active"));
  });

  $(".offcanvas-menu-overlay").on("click", function () {
    $(".offcanvas-menu-wrapper").removeClass("active");
    $(".offcanvas-menu-overlay").removeClass("active");
    setMobileNavOpen(false);
  });

  /*------------------
		Navigation
	--------------------*/
  $(".menu__class").slicknav({
    appendTo: "#mobile-menu-wrap",
    allowParentLinks: true,
    /* false = parent label stays a normal <a> (no <a> inside <a>); fixes missing ACTIVITIES/CONTACT titles on mobile */
    nestedParentLinks: false,
    showChildren: true,
    closedSymbol: "\u25be",
    openedSymbol: "\u25b4",
  });

  /* SlickNav (nestedParentLinks: false) wraps the parent <a> in .slicknav_parent-link — tap label to toggle submenu */
  $("#mobile-menu-wrap").on(
    "click",
    ".slicknav_nav .slicknav_parent-link.slicknav_row > a[href]:not(.slicknav_item)",
    function (e) {
      var href = ($(this).attr("href") || "").trim();
      var isPlaceholder = !href || href === "#" || /^javascript:/i.test(href);
      if (!isPlaceholder) return;
      var $toggle = $(this).siblings("a.slicknav_item");
      if ($toggle.length) {
        e.preventDefault();
        $toggle.trigger("click");
      }
    },
  );

  /* Dropdown parents use href="#" — avoid in-page jump; submenu links handle real destinations */
  $(document).on(
    "click",
    ".menu__class > li.has-dropdown > a[href='#']",
    function (e) {
      e.preventDefault();
    },
  );

  $("#mobile-menu-wrap").each(function () {
    var $wrap = $(this);
    if ($wrap.find("> .offcanvas-menu-close").length === 0) {
      $wrap.prepend(
        '<button type="button" class="offcanvas-menu-close" aria-label="Close menu"><i class="fa fa-times" aria-hidden="true"></i></button>',
      );
    }
  });

  $(document).on("click", ".offcanvas-menu-close", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(".offcanvas-menu-wrapper").removeClass("active");
    $(".offcanvas-menu-overlay").removeClass("active");
    setMobileNavOpen(false);
  });

  $(document).on("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!$("body").hasClass("mobile-nav-open")) return;
    $(".offcanvas-menu-wrapper").removeClass("active");
    $(".offcanvas-menu-overlay").removeClass("active");
    setMobileNavOpen(false);
  });

  /*--------------------------
        Gallery Slider
    ----------------------------*/
  $(".gallery__slider").owlCarousel({
    loop: true,
    margin: 10,
    items: 4,
    dots: false,
    smartSpeed: 1200,
    autoHeight: false,
    autoplay: true,
    responsive: {
      992: {
        items: 4,
      },
      768: {
        items: 3,
      },
      576: {
        items: 2,
      },
      0: {
        items: 1,
      },
    },
  });

  /*--------------------------
        Room Pic Slider
    ----------------------------*/
  $(".room__pic__slider").owlCarousel({
    loop: true,
    margin: 0,
    items: 1,
    dots: false,
    nav: true,
    navText: [
      "<i class='arrow_carrot-left'></i>",
      "<i class='arrow_carrot-right'></i>",
    ],
    smartSpeed: 1200,
    autoHeight: false,
    autoplay: false,
  });

  /*--------------------------
        Room Details Pic Slider
    ----------------------------*/
  $(".room__details__pic__slider").owlCarousel({
    loop: true,
    margin: 10,
    items: 2,
    dots: false,
    nav: true,
    navText: [
      "<i class='arrow_carrot-left'></i>",
      "<i class='arrow_carrot-right'></i>",
    ],
    autoHeight: false,
    autoplay: false,
    mouseDrag: false,
    responsive: {
      576: {
        items: 2,
      },
      0: {
        items: 1,
      },
    },
  });

  /*--------------------------
        Testimonial Slider
    ----------------------------*/
  var testimonialSlider = $(".testimonial__slider");
  testimonialSlider
    .owlCarousel({
      loop: true,
      margin: 30,
      items: 1,
      dots: true,
      nav: true,
      navText: [
        "<i class='fa fa-angle-left'></i>",
        "<i class='fa fa-angle-right'></i>",
      ],
      smartSpeed: 1200,
      autoHeight: false,
      autoplay: true,
      mouseDrag: false,
      onInitialized: function (e) {
        var a = this.items().length;
        $("#snh-1").html("<span>01</span><span>" + "0" + a + "</span>");
        var presentage = Math.round(100 / a);
        $(".slider__progress span").css("width", presentage + "%");
      },
    })
    .on("changed.owl.carousel", function (e) {
      var b = --e.item.index,
        a = e.item.count;
      $("#snh-1").html(
        "<span> " +
          "0" +
          (1 > b ? b + a : b > a ? b - a : b) +
          "</span><span>" +
          "0" +
          a +
          "</span>",
      );

      var current = e.page.index + 1;
      var presentage = Math.round((100 / e.page.count) * current);
      $(".slider__progress span").css("width", presentage + "%");
    });

  /*--------------------------
    Testimonials Horizontal
  --------------------------*/
  var testimonialScroller = $(".sacher-testimonials__scroller");
  if (testimonialScroller.length) {
    testimonialScroller.each(function () {
      var scroller = this;
      var $wrap = $(scroller).closest(".sacher-testimonials__wrap");
      var $prev = $wrap.find(".sacher-testimonials__nav--prev");
      var $next = $wrap.find(".sacher-testimonials__nav--next");

      if (!$prev.length || !$next.length || !scroller) return;

      var didFirstNextClick = false;
      var currentIndex = 0;
      var isAnimating = false;
      var settleTimer = null;

      function getCards() {
        return scroller.querySelectorAll(".sacher-testimonials__card");
      }

      function getClosestIndex(cards) {
        if (!cards || !cards.length) return 0;
        var closestIndex = 0;
        var bestDist = Infinity;
        var currentLeft = scroller.scrollLeft;

        for (var i = 0; i < cards.length; i++) {
          var dist = Math.abs(cards[i].offsetLeft - currentLeft);
          if (dist < bestDist) {
            bestDist = dist;
            closestIndex = i;
          }
        }

        return closestIndex;
      }

      function clampIndex(idx, cards) {
        if (!cards || !cards.length) return 0;
        return Math.max(0, Math.min(idx, cards.length - 1));
      }

      function updateNavVisibility(cards) {
        if (!cards || !cards.length) return;
        var atStart = currentIndex <= 0;
        var atEnd = currentIndex >= cards.length - 1;
        $prev.css("display", didFirstNextClick && !atStart ? "flex" : "none");
        $next.css("display", atEnd ? "none" : "flex");
      }

      function scrollToIndex(nextIndex) {
        var cards = getCards();
        if (!cards || !cards.length) return;

        currentIndex = clampIndex(nextIndex, cards);
        isAnimating = true;
        cards[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });

        if (settleTimer) clearTimeout(settleTimer);
        settleTimer = setTimeout(function () {
          isAnimating = false;
          currentIndex = clampIndex(getClosestIndex(cards), cards);
          updateNavVisibility(cards);
        }, 360);
      }

      var cards = getCards();
      currentIndex = clampIndex(getClosestIndex(cards), cards);
      updateNavVisibility(cards);

      var ticking = false;
      scroller.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          if (!isAnimating) {
            var cardsNow = getCards();
            currentIndex = clampIndex(getClosestIndex(cardsNow), cardsNow);
            updateNavVisibility(cardsNow);
          }
          ticking = false;
        });
      });

      $prev
        .off("click.sacherTestimonials")
        .on("click.sacherTestimonials", function (e) {
          e.preventDefault();
          if (isAnimating) return;
          scrollToIndex(currentIndex - 1);
        });

      $next
        .off("click.sacherTestimonials")
        .on("click.sacherTestimonials", function (e) {
          e.preventDefault();
          if (isAnimating) return;
          didFirstNextClick = true;
          scrollToIndex(currentIndex + 1);
        });

      window.addEventListener("resize", function () {
        var cardsNow = getCards();
        currentIndex = clampIndex(getClosestIndex(cardsNow), cardsNow);
        updateNavVisibility(cardsNow);
      });
    });
  }

  /*--------------------------
    Guest testimonials carousel (.guest-testimonials)
  --------------------------*/
  document
    .querySelectorAll("[data-guest-testimonials-root]")
    .forEach(function (root) {
      var panels = root.querySelectorAll(".guest-testimonials__panel");
      var dots = root.querySelectorAll(".guest-testimonials__dot");
      var prevBtn = root.querySelector(".guest-testimonials__nav--prev");
      var nextBtn = root.querySelector(".guest-testimonials__nav--next");
      if (!panels.length) return;

      var index = 0;

      function show(nextIndex) {
        var n = ((nextIndex % panels.length) + panels.length) % panels.length;
        index = n;
        panels.forEach(function (panel, i) {
          var on = i === n;
          panel.classList.toggle("is-active", on);
          panel.setAttribute("aria-hidden", on ? "false" : "true");
        });
        dots.forEach(function (dot, i) {
          var on = i === n;
          dot.classList.toggle("is-active", on);
          dot.setAttribute("aria-selected", on ? "true" : "false");
        });
      }

      show(0);

      if (prevBtn) {
        prevBtn.addEventListener("click", function (e) {
          e.preventDefault();
          show(index - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", function (e) {
          e.preventDefault();
          show(index + 1);
        });
      }
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
        });
      });
    });

  /*--------------------------
    Instagram Feed Mosaic (tiles)
  --------------------------*/
  var instaCarousel = $(".sacher-instagram__carousel");
  if (instaCarousel.length) {
    instaCarousel.owlCarousel({
      loop: true,
      margin: 0,
      items: 1,
      dots: false,
      nav: true,
      navText: ["<span>&lsaquo;</span>", "<span>&rsaquo;</span>"],
      smartSpeed: 900,
      autoHeight: false,
      autoplay: false,
      mouseDrag: true,
    });
  }

  /*--------------------------
        Logo Slider
    ----------------------------*/
  $(".logo__carousel").owlCarousel({
    loop: true,
    margin: 100,
    items: 5,
    dots: false,
    smartSpeed: 1200,
    autoHeight: false,
    autoplay: false,
    responsive: {
      992: {
        items: 5,
      },
      768: {
        items: 3,
      },
      320: {
        items: 2,
      },
      0: {
        items: 1,
      },
    },
  });

  /*--------------------------
        Home Room Carousel
    ----------------------------*/
  var carouselState = {
    currentPosition: 0,
  };

  function initRoomCarousel() {
    var roomTrack = $(".home-room__carousel-track");
    var roomCarousel = $(".home-room__carousel");
    var roomNext = $(".home-room__nav--next");
    var roomPrev = $(".home-room__nav--prev");
    var roomItems = $(".home__room__item");

    if (!roomTrack.length || !roomCarousel.length || !roomItems.length) {
      return;
    }

    var itemsPerView = 4;
    var cardGap = 20;

    function setupCarousel() {
      var carouselWidth = roomCarousel.width();
      if (carouselWidth <= 0) return;

      var cardWidth = Math.floor(
        (carouselWidth - cardGap * (itemsPerView - 1)) / itemsPerView,
      );

      roomItems.css({
        "min-width": cardWidth + "px",
        "flex-basis": cardWidth + "px",
        "flex-shrink": "0",
      });

      var cardTotalWidth = cardWidth + cardGap;
      var trackWidth = roomTrack[0].scrollWidth;
      var maxScroll = -(trackWidth - carouselWidth);

      // Update button visibility
      function updateButtonVisibility() {
        if (carouselState.currentPosition >= 0) {
          roomPrev.css("display", "none");
        } else {
          roomPrev.css("display", "flex");
        }

        if (carouselState.currentPosition <= maxScroll) {
          roomNext.css("display", "none");
        } else {
          roomNext.css("display", "flex");
        }
      }

      roomNext.off("click").on("click", function (e) {
        e.preventDefault();
        if (carouselState.currentPosition > maxScroll) {
          carouselState.currentPosition -= cardTotalWidth;
          if (carouselState.currentPosition < maxScroll) {
            carouselState.currentPosition = maxScroll;
          }
          roomTrack.css(
            "transform",
            "translateX(" + carouselState.currentPosition + "px)",
          );
          updateButtonVisibility();
        }
      });

      roomPrev.off("click").on("click", function (e) {
        e.preventDefault();
        if (carouselState.currentPosition < 0) {
          carouselState.currentPosition += cardTotalWidth;
          if (carouselState.currentPosition > 0) {
            carouselState.currentPosition = 0;
          }
          roomTrack.css(
            "transform",
            "translateX(" + carouselState.currentPosition + "px)",
          );
          updateButtonVisibility();
        }
      });

      updateButtonVisibility();
    }

    setTimeout(function () {
      setupCarousel();
    }, 100);

    $(window).on("resize", function () {
      carouselState.currentPosition = 0;
      roomTrack.css("transform", "translateX(0px)");
      setupCarousel();
    });
  }

  // Initialize carousel after DOM is ready
  $(document).ready(function () {
    initRoomCarousel();
  });

  /*--------------------------
        Sacher Rooms Slider (4 visible + arrows)
    ----------------------------*/
  function initSacherRoomsSlider() {
    $(".sacher-roomcats__grid-wrap").each(function (i, el) {
      var wrap = $(el);
      var section = wrap.closest(".sacher-roomcats");
      var viewport = wrap.find(".sacher-roomcats__viewport");
      var track = wrap.find(".sacher-roomcats__grid");
      var items = wrap.find(".sacher-roomcats__item");
      var next = section.find(".sacher-roomcats__nav--next").first();
      var prev = section.find(".sacher-roomcats__nav--prev").first();

      if (!viewport.length || !track.length || !items.length) return;

      var state = { index: 0 };
      var resizeNs = "resize.sacherRoomsSlider" + i;

      function setup() {
        var isMobile = $(window).width() <= 991;
        var visible = isMobile ? 2 : 4;
        var gap = 16;
        var viewportWidth = viewport.width();
        if (viewportWidth <= 0) return;

        var cardWidth = Math.floor(
          (viewportWidth - gap * (visible - 1)) / visible,
        );
        items.css({
          "flex-basis": cardWidth + "px",
          "max-width": cardWidth + "px",
        });

        var maxIndex = Math.max(0, items.length - visible);
        if (state.index > maxIndex) state.index = maxIndex;

        var x = -(state.index * (cardWidth + gap));
        track.css("transform", "translateX(" + x + "px)");

        prev.toggleClass("is-hidden", state.index === 0);
        next.toggleClass("is-hidden", state.index >= maxIndex);
        viewport.toggleClass("has-prev", state.index > 0);
        viewport.toggleClass("has-next", state.index < maxIndex);
      }

      next.off("click.sacherRooms").on("click.sacherRooms", function (e) {
        e.preventDefault();
        var visible = $(window).width() <= 991 ? 2 : 4;
        var maxIndex = Math.max(0, items.length - visible);
        if (state.index < maxIndex) {
          state.index += 1;
          setup();
        }
      });

      prev.off("click.sacherRooms").on("click.sacherRooms", function (e) {
        e.preventDefault();
        if (state.index > 0) {
          state.index -= 1;
          setup();
        }
      });

      setTimeout(setup, 80);
      $(window).off(resizeNs).on(resizeNs, setup);
    });
  }

  $(document).ready(function () {
    initSacherRoomsSlider();
  });

  /*--------------------------
        Sacher Events Slider
    ----------------------------*/
  function initSacherEventsSlider() {
    var viewport = $(".sacher-events__viewport");
    var track = $(".sacher-events__track");
    var items = $(".sacher-events__item");
    var next = $(".sacher-events__nav--next");
    var prev = $(".sacher-events__nav--prev");

    if (!viewport.length || !track.length || !items.length) {
      return;
    }

    var state = { index: 0 };

    function setup() {
      var width = $(window).width();
      var visible = 4;
      if (width <= 991) visible = 3;
      if (width <= 575) visible = 2;

      var gap = 22;
      var viewportWidth = viewport.width();
      if (viewportWidth <= 0) return;

      var cardWidth = Math.floor(
        (viewportWidth - gap * (visible - 1)) / visible,
      );
      items.css({
        "flex-basis": cardWidth + "px",
        "max-width": cardWidth + "px",
      });

      var maxIndex = Math.max(0, items.length - visible);
      if (state.index > maxIndex) state.index = maxIndex;

      var x = -(state.index * (cardWidth + gap));
      track.css("transform", "translateX(" + x + "px)");

      prev.toggleClass("is-hidden", state.index === 0);
      next.toggleClass("is-hidden", state.index >= maxIndex);
    }

    next.off("click").on("click", function (e) {
      e.preventDefault();
      var visible =
        $(window).width() <= 575 ? 2 : $(window).width() <= 991 ? 3 : 4;
      var maxIndex = Math.max(0, items.length - visible);
      if (state.index < maxIndex) {
        state.index += 1;
        setup();
      }
    });

    prev.off("click").on("click", function (e) {
      e.preventDefault();
      if (state.index > 0) {
        state.index -= 1;
        setup();
      }
    });

    setTimeout(setup, 80);
    $(window).on("resize", setup);
  }

  $(document).ready(function () {
    initSacherEventsSlider();
  });

  /*--------------------------
        Select
    ----------------------------*/
  $("select").niceSelect();

  /*--------------------------
        Datepicker
    ----------------------------*/
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  var mS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var month;

  for (let i = 0; i <= 12; i++) {
    const element = mS[i];
    if (mm == mS.indexOf(mS[i])) {
      month = mS[i - 1];
    }
  }
  var today = dd + " " + month + " " + yyyy;

  $(".check__in").val(today);
  $(".check__out").val(today);

  $(".datepicker_pop").datepicker({
    dateFormat: "dd M yy",
    minDate: 0,
  });

  /*--------------------------
        Newsletter Signup
    ----------------------------*/

  function initNewsletterSignup() {
    var $form = $(".footer__newslatter__form");
    if (!$form.length) return;

    // Safety net: even if native submit happens, keep user on same page.
    if (!document.getElementById("footer-submit-sink")) {
      var sink = document.createElement("iframe");
      sink.id = "footer-submit-sink";
      sink.name = "footer-submit-sink";
      sink.style.display = "none";
      sink.setAttribute("aria-hidden", "true");
      document.body.appendChild(sink);
    }
    $form.attr("target", "footer-submit-sink");

    var $status = $form.find(".footer__newslatter__status");
    var $submitBtn = $form.find("button[type='submit']");
    var statusHideTimer = null;

    function renderStatus(type, text) {
      if (!$status.length) return;

      if (statusHideTimer) {
        clearTimeout(statusHideTimer);
        statusHideTimer = null;
      }

      var iconClass =
        type === "success" ? "fa fa-check" : "fa fa-exclamation-circle";

      $status
        .removeClass(
          "footer__newslatter__status--success footer__newslatter__status--error",
        )
        .addClass("footer__newslatter__status--show")
        .addClass("footer__newslatter__status--" + type)
        .html('<i class="' + iconClass + '"></i><span>' + text + "</span>");

      if (type === "success") {
        statusHideTimer = setTimeout(function () {
          clearStatus();
        }, 7000);
      }
    }

    function clearStatus() {
      if (!$status.length) return;
      $status
        .removeClass(
          "footer__newslatter__status--show footer__newslatter__status--success footer__newslatter__status--error",
        )
        .empty();
    }

    $form.on("submit", function (e) {
      e.preventDefault();

      var firstName = (
        $form.find("input[name='firstName']").val() || ""
      ).trim();
      var lastName = ($form.find("input[name='lastName']").val() || "").trim();
      var email = ($form.find("input[name='email']").val() || "").trim();
      var consent = $form.find("input[name='consent']").is(":checked");
      var endpoint = ($form.data("subscribe-endpoint") || "").toString().trim();
      var formAction = ($form.attr("action") || "").trim();
      var isWeb3Forms =
        formAction.toLowerCase().indexOf("api.web3forms.com/submit") !== -1;
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var defaultBtnText = ($submitBtn.text() || "SIGN ME UP").trim();

      clearStatus();

      if (!firstName || !lastName || !email) {
        renderStatus("error", "Please complete your name, surname, and email.");
        return;
      }

      if (!emailRegex.test(email)) {
        renderStatus("error", "Please enter a valid email address.");
        return;
      }

      if (!consent) {
        renderStatus("error", "Please accept the privacy policy to continue.");
        return;
      }

      $submitBtn.prop("disabled", true).text("SENDING...");

      function onFail() {
        renderStatus(
          "error",
          "We could not send your message. Please try again in a moment.",
        );
      }

      if (isWeb3Forms) {
        var accessKey = (
          $form.find('input[name="access_key"]').val() || ""
        ).trim();
        var toEmail = ($form.data("contact-email") || "info@derandhotel.com")
          .toString()
          .trim();
        var fromName = (
          $form.find('input[name="from_name"]').val() ||
          "Derand Hotel Website (Footer)"
        ).trim();
        var fullName = (firstName + " " + lastName).trim();
        var username = (email.split("@")[0] || "guest").trim();
        var bodyText =
          "Footer form submission\n\n" +
          "First name: " +
          firstName +
          "\n" +
          "Last name: " +
          lastName +
          "\n" +
          "Email: " +
          email +
          "\n" +
          "Privacy consent: " +
          (consent ? "Yes" : "No");

        var fd = new FormData();
        if (accessKey) fd.append("access_key", accessKey);
        fd.append("from_name", fromName);
        fd.append("fullName", fullName);
        fd.append("username", username);
        fd.append("email", email);
        if (toEmail) fd.append("to_email", toEmail);
        fd.append("replyto", email);
        fd.append("subject", "[Footer] Website message");
        fd.append("message", bodyText);

        fetch(formAction, {
          method: "POST",
          body: fd,
          headers: {
            Accept: "application/json",
          },
        })
          .then(function (response) {
            if (!response.ok) throw new Error("Submit failed");
            return response.json();
          })
          .then(function (data) {
            if (data && data.success) {
              $form[0].reset();
              renderStatus("success", "Successful.");
              return;
            }
            throw new Error("Submit failed");
          })
          .catch(function () {
            onFail();
          })
          .finally(function () {
            $submitBtn.prop("disabled", false).text(defaultBtnText);
          });
        return;
      }

      function onLegacySuccess() {
        $form[0].reset();
        renderStatus("success", "Successful.");
      }

      function onLegacyFail() {
        renderStatus(
          "error",
          "We could not process your signup right now. Please try again in a moment.",
        );
      }

      if (!endpoint) {
        setTimeout(function () {
          onLegacySuccess();
          $submitBtn.prop("disabled", false).text(defaultBtnText);
        }, 600);
        return;
      }

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          consent: consent,
          source: "Derand Hotel Website",
        }),
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Subscription failed");
          }
          onLegacySuccess();
        })
        .catch(function () {
          onLegacyFail();
        })
        .finally(function () {
          $submitBtn.prop("disabled", false).text(defaultBtnText);
        });
    });
  }

  initNewsletterSignup();

  /*--------------------------
        Contact Form
    ----------------------------*/
  function initContactForm() {
    var $form = $(".contact-page__form");
    if (!$form.length) return;

    var $status = $form.find(".contact-page__status");
    var $submitBtn = $form.find("button[type='submit']");
    var statusHideTimer = null;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    var formAction = ($form.attr("action") || "").trim();
    var isWeb3Forms =
      formAction.toLowerCase().indexOf("api.web3forms.com/submit") !== -1;
    var defaultBtnText = ($submitBtn.text() || "SEND MESSAGE").trim();

    function clearStatus() {
      if (!$status.length) return;
      $status
        .removeClass(
          "contact-page__status--success contact-page__status--error",
        )
        .empty();
    }

    function renderStatus(type, text) {
      if (!$status.length) return;
      if (statusHideTimer) {
        clearTimeout(statusHideTimer);
        statusHideTimer = null;
      }
      var iconClass =
        type === "success" ? "fa fa-check-circle" : "fa fa-exclamation-circle";
      $status
        .removeClass(
          "contact-page__status--success contact-page__status--error",
        )
        .addClass("contact-page__status--" + type)
        .html('<i class="' + iconClass + '"></i><span>' + text + "</span>");
      if (type === "success") {
        statusHideTimer = setTimeout(function () {
          clearStatus();
        }, 7000);
      }
    }

    $form.on("submit", function (e) {
      e.preventDefault();

      var fullName = ($form.find("input[name='fullName']").val() || "").trim();
      var username = ($form.find("input[name='username']").val() || "").trim();
      var email = ($form.find("input[name='email']").val() || "").trim();
      var subject = ($form.find("input[name='subject']").val() || "").trim();
      var message = ($form.find("textarea[name='message']").val() || "").trim();

      clearStatus();

      if (!fullName || !username || !email || !subject || !message) {
        renderStatus("error", "Please complete all fields before sending.");
        return;
      }

      if (!emailRegex.test(email)) {
        renderStatus(
          "error",
          "Please enter a valid email address (example: name@email.com).",
        );
        return;
      }

      $submitBtn.prop("disabled", true).text("SENDING...");

      if (isWeb3Forms) {
        var formData = new FormData($form[0]);
        fetch(formAction, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        })
          .then(function (response) {
            if (!response.ok) throw new Error("Submit failed");
            return response.json();
          })
          .then(function (data) {
            if (data && data.success) {
              $form[0].reset();
              renderStatus(
                "success",
                "Thank you. Your message was sent successfully.",
              );
              return;
            }
            throw new Error("Submit failed");
          })
          .catch(function () {
            renderStatus(
              "error",
              "We could not send your message. Please try again in a moment.",
            );
          })
          .finally(function () {
            $submitBtn.prop("disabled", false).text(defaultBtnText);
          });
        return;
      }

      var toEmail = ($form.data("contact-email") || "info@derandhotel.com")
        .toString()
        .trim();
      var mailSubject = encodeURIComponent("[Website Contact] " + subject);
      var body =
        "Name: " +
        fullName +
        "\nUsername: " +
        username +
        "\nEmail: " +
        email +
        "\n\nMessage:\n" +
        message;
      var mailBody = encodeURIComponent(body);
      var mailtoLink =
        "mailto:" + toEmail + "?subject=" + mailSubject + "&body=" + mailBody;

      window.location.href = mailtoLink;
      $submitBtn.prop("disabled", false).text(defaultBtnText);
    });
  }

  initContactForm();

  /*--------------------------
        Noya reservation (Web3Forms, same as contact.html)
    ----------------------------*/
  function initNoyaBookingForm() {
    var $form = $("form.noya-mockup-booking");
    if (!$form.length) return;

    var $status = $form.find(".noya-mockup-booking__status");
    var $submitBtn = $form.find("button[type='submit']");
    var $phone = $form.find('input[name="phone"]');
    var $message = $form.find('textarea[name="message"]');
    var formAction = ($form.attr("action") || "").trim();
    var isWeb3Forms =
      formAction.toLowerCase().indexOf("api.web3forms.com/submit") !== -1;
    var defaultBtnText = ($submitBtn.text() || "Reserve Now").trim();
    var statusHideTimer = null;

    function clearStatus() {
      if (!$status.length) return;
      if (statusHideTimer) {
        clearTimeout(statusHideTimer);
        statusHideTimer = null;
      }
      $status
        .removeClass(
          "noya-mockup-booking__status--success noya-mockup-booking__status--error",
        )
        .empty();
    }

    function renderStatus(type, text) {
      if (!$status.length) return;
      clearStatus();
      var iconClass =
        type === "success" ? "fa fa-check-circle" : "fa fa-exclamation-circle";
      $status
        .addClass("noya-mockup-booking__status--" + type)
        .html('<i class="' + iconClass + '"></i><span>' + text + "</span>");
      if (type === "success") {
        statusHideTimer = setTimeout(function () {
          $status
            .removeClass(
              "noya-mockup-booking__status--success noya-mockup-booking__status--error",
            )
            .empty();
        }, 8000);
      }
    }

    function selectedOptionLabel(sel) {
      var $opt = $form.find(sel + " option:selected");
      return $opt.length ? $.trim($opt.text()) : "";
    }

    $form.on("submit", function (e) {
      e.preventDefault();
      clearStatus();

      var dateVal = ($form.find('select[name="date"]').val() || "").trim();
      var timeVal = ($form.find('select[name="time"]').val() || "").trim();
      var partyVal = ($form.find('select[name="party"]').val() || "").trim();
      var phoneVal = ($phone.val() || "").trim();
      $phone.val(phoneVal);

      if (!dateVal || !timeVal || !partyVal) {
        renderStatus(
          "error",
          "Please choose a date, time, and party size before sending.",
        );
        return;
      }

      var digitCount = phoneVal.replace(/\D/g, "").length;
      if (!phoneVal || digitCount < 6) {
        renderStatus(
          "error",
          "Please enter a phone number with at least 6 digits.",
        );
        $phone.trigger("focus");
        return;
      }

      var dateLabel = selectedOptionLabel('select[name="date"]');
      var timeLabel = selectedOptionLabel('select[name="time"]');
      var partyLabel = selectedOptionLabel('select[name="party"]');
      var body =
        "Noya table reservation request\r\n\r\n" +
        "Date: " +
        dateLabel +
        "\r\n" +
        "Time: " +
        timeLabel +
        "\r\n" +
        "Party size: " +
        partyLabel +
        "\r\n" +
        "Phone: " +
        phoneVal;
      $message.val(body);

      if (!isWeb3Forms) {
        renderStatus(
          "error",
          "Form is not configured for email delivery. Please contact the hotel.",
        );
        return;
      }

      $submitBtn.prop("disabled", true).text("SENDING...");

      var formData = new FormData($form[0]);
      fetch(formAction, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Submit failed");
          return response.json();
        })
        .then(function (data) {
          if (data && data.success) {
            $form[0].reset();
            renderStatus(
              "success",
              "Thank you. Your reservation request was sent successfully.",
            );
            return;
          }
          throw new Error("Submit failed");
        })
        .catch(function () {
          renderStatus(
            "error",
            "We could not send your request. Please try again in a moment or call the hotel.",
          );
        })
        .finally(function () {
          $submitBtn.prop("disabled", false).text(defaultBtnText);
        });
    });
  }

  initNoyaBookingForm();

  /*------------------
    Language Selector
  --------------------*/
  // Language: load from storage or detect, default to EN
  var storedLang = null;
  try {
    storedLang = window.localStorage && localStorage.getItem("derandLang");
  } catch (e) {}
  var detected = (navigator.language || navigator.userLanguage || "en").slice(
    0,
    2,
  );
  if (detected === "sq") detected = "al";
  var currentLang = (storedLang || detected || "en").toLowerCase();
  if (!/^(en|de|al)$/.test(currentLang)) currentLang = "en";

  var translations = {
    en: {
      "rinu-hero-kicker": "ELEVATE YOUR BEAUTY AND CONFIDENCE",
      "rinu-trust-copy":
        "Trusted by clients across Sudbury for delivering exceptional, lasting results in advanced laser and aesthetic treatments.",
      "rinu-solutions-kicker": "Explore Our Expertise",
      "rinu-solutions-title": "Comprehensive Beauty Solutions",
      "rinu-solutions-copy":
        "From cuttingâ€‘edge laser treatments to advanced aesthetics and body contouring, we offer a full range of services designed to enhance your beauty and boost your confidence.",
      "rinu-faq-q1": "What services does RINU MEDSPA offer?",
      "rinu-faq-a1":
        "We provide laser hair removal, dermaplaning, lash services, facials, and body contouring â€” plus EMSCULPT, microneedling, CO2, Alma Hybrid, massage, AxoMind, EMFUSION, and EMFACE â€” all tailored to your skin type and goals.",
      "rinu-faq-q2": "How do I book an appointment?",
      "rinu-faq-a2":
        "Book online via the â€œBook Nowâ€ button on our website. Youâ€™ll receive a confirmation instantly and can manage your booking directly on the site.",
      "rinu-faq-q3": "Is treatment safe for all skin types?",
      "rinu-faq-a3":
        "Yes. All our treatments use advanced, customizable settings to safely and effectively treat a wide range of skin tones and concerns. Your practitioner selects the safest parameters during consultation.",
      "rinu-faq-q4": "What should I expect during my first visit?",
      "rinu-faq-a4":
        "Youâ€™ll start with a free consultation with Dr. Diellxa. After reviewing your goals and assessing your skin, weâ€™ll explain the process and treatment options, and you can continue straight to your personalised plan (and first session if you wish).",
      "rinu-faq-q5": "How many sessions will I need for best results?",
      "rinu-faq-a5":
        "It depends on which treatment youâ€™re having, the area, and your individual response. Itâ€™s best to discuss this in a consultation with Dr. Diellxa so we can outline a plan and realistic timeline for your goals.",
      "rinu-faqs-kicker": "Have Questions?",
      "rinu-faqs-title": "We've Got Answers",
      "rinu-faqs-intro":
        "Find out more about our services and what to expect with our most frequently asked questions, or contact us.",
      "rinu-best-view-more": "View More",
      "rinu-view-treatment": "View Treatment",
      "rinu-hero-title": "Advanced Aesthetic<br />Solutions",
      "rinu-card-best-title": "Best Treatments",
      "rinu-card-mani-title": "Manicure &amp; Pedicure",
      "rinu-card-consult-title": "Free Consulting",
      "rinu-cta-kicker": "Ready to Transform?",
      "rinu-cta-title": "Book Your Appointment Today",
      "rinu-cta-copy":
        "Start your journey to a more confident you. Whether it's laser, aesthetics, body contouring, or beauty, our expert team is ready to help.",
      "rinu-reviews-kicker": "What Our Clients Say",
      "rinu-reviews-title": "Real Results, Real Feedback",
      "rinu-reviews-copy":
        "Hear from our satisfied clients and discover why so many trust us with their beauty treatments.",
      "rinu-signature-kicker": "Our Signature Services",
      "rinu-signature-title": "Transformative Treatments<br />Tailored to You",
      "rinu-signature-copy":
        "Discover our most popular treatments that help you look and feel your best. From smooth, hairâ€‘free skin to flawless lashes and radiant complexions, we offer expert care to meet your beauty needs.",
      "rinuform-kicker": "RINU Booking",
      "rinuform-title": "Reserve Your Appointment",
      "rinuform-sub":
        "Request an appointment. Rinu is open 12:00 - 20:00. We'll confirm your request soon.",
      "rinuform-first-name-label": "First Name",
      "rinuform-first-name-ph": "First name",
      "rinuform-last-name-label": "Last Name",
      "rinuform-last-name-ph": "Last name",
      "rinuform-email-label": "Email Address",
      "rinuform-email-ph": "EMAIL",
      "rinuform-email-aria": "Email",
      "rinuform-name-ph": "Name",
      "rinuform-name-aria": "Name",
      "rinuform-phone-label": "Phone Number",
      "rinuform-phone-ph": "Phone number",
      "rinuform-phone-aria": "Phone number",
      "rinuform-date-aria": "Date",
      "rinuform-time-aria": "Time",
      "rinuform-message-ph": "Message",
      "rinuform-message-aria": "Message",
      "rinuform-close-aria": "Close form",
      "rinuform-datetime-label": "Preferred Date & Time",
      "rinuform-submit": "Confirm Appointment",
      "rinu1-hero-title-main": "RINU Medspa",
      "rinu1-hero-title-sub": "Advanced treatments for skin, body, and mind.",
      "rinu1-hero-cta-book": "Book a consultation",
      "rinu1-hero-cta-explore": "Explore treatments",
      "rinu1-strip-1": "Clean formulations",
      "rinu1-strip-2": "Consult-first care",
      "rinu1-strip-3": "Aftercare included",
      "rinu1-strip-4": "On-site at Derand",
      "rinu1-card-skin-title": "SKIN",
      "rinu1-card-body-title": "BODY",
      "rinu1-card-mind-title": "MIND",
      "rinu1-card-learn-more": "Learn more",
      "rinu1-card-skin-note": "",
      "rinu1-card-body-note": "",
      "rinu1-skin-h": "SKIN TREATMENTS",
      "rinu1-skin-p1":
        "<strong>Facials (Biologique Recherche)</strong><br />Personalized treatments based on a skin diagnosis to restore hydration, balance, and natural radiance.",
      "rinu1-skin-p2":
        "<strong>Injectables</strong><br />Skin Boosters, Fillers, and Exosomes for deep hydration, collagen stimulation, and improved skin density.",
      "rinu1-skin-p3":
        "<strong>Non-Invasive Lifting</strong><br />EMFACE and EXION RF technologies for facial muscle toning, contouring, and a refreshed appearance.",
      "rinu1-skin-p4":
        "<strong>Skin Quality &amp; Texture</strong><br />Microneedling (EXION) and specialized infusions to minimize pores, refine texture, and enhance elasticity.",
      "rinu1-skin-p5":
        "<strong>Advanced Laser Therapy</strong><br />CO2 and Alma Hybrid technologies for skin renewal, pigmentation removal, and scar treatment.",
      "rinu1-body-h": "BODY",
      "rinu1-body-exion":
        "<strong>EXION BODY</strong><br />Skin tightening. Deep stimulation. Visible contour.<br />EXION Body is not a typical body treatment. It is an advanced technology that stimulates collagen and elastin deep within the tissue, helping to tighten the skin, improve texture, and refine body contours - all in a non-invasive way.",
      "rinu1-emfusion-kicker": "<strong>EMFUSION</strong>",
      "rinu1-emfusion-line-1":
        "Skin regeneration. Deep infusion. Real results.",
      "rinu1-emfusion-line-2":
        "EMFUSION is not a traditional facial. It is an advanced treatment that works deep within the skin to restore hydration, improve texture, and revive natural vitality.",
      "rinu1-emfusion-line-3":
        "Refined texture. Restored glow. Deep skin vitality.",
      "rinu1-body-p1":
        "<strong>Massage &amp; Relaxation</strong><br />Tailored techniques using Ligne St Barth oils to release tension, improve circulation, and restore balance.",
      "rinu1-body-p2":
        "<strong>Body Care &amp; Polish</strong><br />Exfoliation and deep hydration treatments that leave the skin smooth, nourished, and glowing.",
      "rinu1-body-p3":
        "<strong>Advanced Body Sculpting</strong><br />EMSCULPT Neo and EMTONE technologies for muscle toning, cellulite reduction, and skin firming.",
      "rinu1-body-p4":
        "<strong>Specialized Wellness</strong><br />Targeted therapies such as EMSELLA and EMFEME focusing on internal strengthening and regenerative well-being.",
      "rinu1-body-p5":
        "<strong>Nails &amp; Grooming</strong><br />Professional manicure and pedicure for a polished, aesthetic look with maximum attention to detail.",
      "rinu1-mind-h": "MIND",
      "rinu1-mind-p1":
        "<strong>EXOMIND Magnetic Stimulation</strong><br />A non-invasive treatment using gentle magnetic pulses to improve focus, reduce stress, and restore emotional balance.",
      "rinu1-mind-p2":
        "<strong>Deep Mental Reset</strong><br />A synergetic approach combining EXOMIND technology with calming massage rituals to release both mental and physical tension.",
      "rinu1-mind-p3":
        "<strong>Sleep &amp; Clarity Support</strong><br />Targeted therapy designed to enhance sleep quality, clear mental fatigue, and lift the &quot;brain fog&quot; of daily life.",
      "rinu1-process-title": "How we work",
      "rinu1-process-1-h": "Consult",
      "rinu1-process-1-p":
        "Goals, health history, and photography if you consent. No pressure to book same-day.",
      "rinu1-process-2-h": "Plan",
      "rinu1-process-2-p":
        "A written sequence: what to do in-clinic, what to pause at home, and what to expect hour by hour.",
      "rinu1-process-3-h": "Treat",
      "rinu1-process-3-p":
        "Unrushed suite time, continuous consent checks, and comfort breaks.",
      "rinu1-process-4-h": "Aftercare",
      "rinu1-process-4-p":
        "Direct line for questions, cooling tips, and a scheduled check-in photo review.",
      "rinu1-quote-main":
        "I wanted to look like I slept for a week at sea. The team mapped a gentle plan and never rushed the room. It felt like a private wing of the hotel — not a clinic hallway.",
      "rinu1-quote-by": "— Guest, RINU Medspa visit",
      "rinu1-services-kicker": "Signature focus",
      "rinu1-services-title":
        "Take one hour for yourself, without leaving the hotel.",
      "rinu1-services-copy":
        "RINU Medspa brings advanced aesthetic and wellness treatments into your stay at Derand Hotel. Designed for women and men who want visible results without downtime.",
      "rinu1-qa-q1": "What should I expect during my first visit?",
      "rinu1-qa-a1":
        "Every treatment at RINU begins with a consultation led by Dr. Diellza Mustafa. We take the time to understand your skin, your body, and your goals, then guide you toward the right treatments based on what actually works for you.<br /><br />Consultations are free.",
      "rinu1-qa-q2": "What can I do during my stay at RINU?",
      "rinu1-qa-a2":
        "<ul class='rinu1-qa-services'><li>Signature massage rituals</li><li>Facial lifting and refresh</li><li>Biologique Recherche facials</li><li>Skin quality and glow enhancement</li><li>EXOMIND stress-reset sessions</li><li>Body tone and cellulite refinement</li><li>Laser hair removal and grooming care</li><li>Professional manicure and pedicure</li></ul>",
      "rinu1-qa-q3": "Massage Rituals",
      "rinu1-qa-a3":
        "- RINU Ritual - St. Barth ChillOut - Deep Tissue - Face &amp; Decollete<br />- Aromatherapy - Cupping - Hot Stone",
      "rinu1-qa-q4": "For women and men",
      "rinu1-qa-a4":
        "Every treatment is adapted to your needs, whether you want to relax, refresh, or refine.",
      "rinu1-qa-q5": "Reset your mind with EXOMIND",
      "rinu1-qa-a5":
        "A non-invasive treatment designed to restore mental balance, improve focus, and support better sleep, while reducing stress and anxiety. Using advanced magnetic stimulation, it works directly on brain activity to bring clarity, calm, and a sense of reset.<br /><br />Perfect during travel or busy periods, when your mind needs to slow down and realign.<br /><br />30 minutes. No downtime.",
      "rinu1-qa-q6": "Treatment Time &amp; Downtime",
      "rinu1-qa-a6":
        "Treatment Time: 15 to 60 minutes depending on the treatment.<br />Downtime: Minimal to none. You can continue your day immediately.",
      "rinu1-qa-q7": "Who performs the treatments?",
      "rinu1-qa-a7": "Doctors and trained medical and aesthetic professionals.",
      "rinu1-qa-q8": "Appointments",
      "rinu1-qa-a8":
        "Booking is recommended. Walk-ins are welcome for consultation.",
      "rinu1-qa-q9": "Location",
      "rinu1-qa-a9":
        "Floor -1, Derand Hotel<br />Accessible by elevator or stairs.",
      "rinu1-visit-title": "Ready when you are",
      "rinu1-visit-sub":
        "Share your preferred dates — we will take care of all the arrangements and send you the preparation notes for your appointment.",
      "rinu1-visit-cta": "Book a consultation",
      "rinu1-visit-directions": "Directions to Derand Hotel",
      "onze-trust-copy":
        "The revolutionary Wellness, Recovery, and Physiotherapy studio.",
      "onze-faq-q1": "What treatments does ONZE offer?",
      "onze-faq-a1":
        "ONZE offers these treatments: red light therapy, cryotherapy, and massages.",
      "onze-solutions-title": "Comprehensive Recovery Solutions",
      "onze-solutions-copy":
        "ONZE is a Wellness, Recovery and Physiotherapy Studio situated in the heart of Prishtina. We focus on enhancing performance, beauty, and health through non-invasive, all-natural treatments that harness the body's own processes for improvement.",
      "onze-card-1-title": "Recovery Treatments",
      "onze-card-2-title": "Performance Therapy",
      "onze-card-3-title": "Wellness Consulting",
      "onze-view-treatment": "View Treatment",
      "onzeform-kicker": "ONZE Booking",
      "onzeform-title": "Reserve Your ONZE Session",
      "onzeform-sub":
        "Complete the form below and our team will confirm your requested session shortly.",
      "onzeform-first-name-label": "First Name",
      "onzeform-first-name-ph": "First name",
      "onzeform-last-name-label": "Last Name",
      "onzeform-last-name-ph": "Last name",
      "onzeform-email-label": "Email Address",
      "onzeform-email-ph": "e.g. name@email.com",
      "onzeform-datetime-label": "Preferred Date & Time",
      "onzeform-submit": "Confirm Session",
      "noyaform-kicker": "Noya Reservation",
      "noyaform-title": "Book Your Table",
      "noyaform-sub":
        "Complete the form below and our team will confirm your table reservation shortly.",
      "noyaform-first-name-label": "First Name",
      "noyaform-first-name-ph": "First name",
      "noyaform-last-name-label": "Last Name",
      "noyaform-last-name-ph": "Last name",
      "noyaform-email-label": "Email Address",
      "noyaform-email-ph": "Email address",
      "noyaform-datetime-label": "Preferred Date & Time",
      "noyaform-submit": "Confirm Table",
      "noya-reserve-phone-ph": "Phone number",
      "noya-book-title": "Book A Table",
      "noya-book-label-1": "Atmosphere",
      "noya-book-value-1": "Rooftop Dining",
      "noya-book-label-2": "Service",
      "noya-book-value-2": "Table Reservation",
      "noya-book-label-3": "Response",
      "noya-book-value-3": "Quick Confirmation",
      "noya-book-cta": "Book a table",
      "noya-explore-title": "Explore Noya",
      "noya-explore-copy":
        "Choose your experience and move directly to the atmosphere you want tonight.",
      "noya-explore-card-1-title": "Go to Restaurant",
      "noya-explore-card-1-copy":
        "Refined plates, elegant service, and a warm signature setting.",
      "noya-explore-card-2-title": "Go to Bar Cocktails",
      "noya-explore-card-2-copy":
        "Classic and modern cocktail creations with curated evening mood.",
      "noya-explore-open": "Open",
      "noya-restaurant-title": "Noya Restaurant",
      "noya-restaurant-sub":
        "Explore our restaurant atmosphere through the latest NOYA photos.",
      "noya-cocktails-title": "Noya Cocktails",
      "noya-cocktails-sub":
        "Explore our bar cocktail atmosphere through the latest NOYA photos.",
      "main-page-title": "Template Notice",
      "main-page-copy":
        "This placeholder page is active and uses global translation controls.",
      "room-details-title": "Room Details",
      "room-details-copy":
        "Room details content is being prepared. Please return shortly.",
      "rinu-review-1":
        "My experience at RINU with Exomind &amp; EMSCULPT was honestly very good. You can tell they work with quality technology and know what theyâ€™re doing. Clean, calm environment and a professional team. Highly recommend.",
      "rinu-review-2":
        "From the moment you walk in, the clinic feels welcoming, modern, and well organised. The staff are extremely professional, educated and attentive, and itâ€™s clear they take great pride in maintaining a pristine, high-quality environment. Highly recommend everyone to go! 5 star!",
      "rinu-review-3":
        "I had a great experience at Rinu Med Spa. The energy is amazing, the space feels very professional and welcoming, and I loved the relaxation room after the treatment. Everything is detailed and well organized. Highly recommend!",
      "rinu-review-4":
        "This place is insane. Instant calm the second you walk in. I did the CO2 laser and ExoMind, and the whole team was not only super professional but genuinely sweet. Already glowing on the outside and inside.",
      "rinu-review-5":
        "An exceptional luxury spa experience from start to finish. The atmosphere is serene and beautifully designed, the staff is attentive and highly skilled, and every detail feels thoughtful and indulgent. My treatment was deeply relaxing and expertly tailored, leaving me feeling completely refreshed and restored.",
      "rinu-review-6":
        "RINU - A truly unique place in Prishtina - it genuinely feels like being in one of the worldâ€™s capitals, offering a 5-star experience. State-of-the-art technology perfectly combined with a professional, warm, and welcoming staff. The ideal place to immerse yourself in wellness and self-care, from A to Z.",
      "best-hero-title": "The RINU Experience: Science Meets Serenity",
      "best-hero-sub": "A New Standard in Aesthetic Excellence",
      "best-hero-intro":
        "At RINU MEDSPA, located within the prestigious Derand Hotel, we believe that true beauty is an art form supported by the worldâ€™s most advanced medical science. Our MedSpa is a sanctuary where high-performance technology and boutique luxury converge to create a transformative experience for your skin and body.",
      "best-sec1-title": "1. Advanced Facial Rejuvenation & Skin Health",
      "best-sec1-item1-title": "Alma Hybrid & CO2 Resurfacing",
      "best-sec1-item1-copy":
        "The ultimate solution for skin texture, scarring, and deep rejuvenation. We utilize the dual-power of CO2 and 1570nm laser technology to stimulate collagen and resurface the skin with minimal downtime.",
      "best-sec1-item2-title": "Microneedling & Specialized Facials",
      "best-sec1-item2-copy":
        "Medical-grade microneedling creates controlled micro-channels to trigger your bodyâ€™s healing response, paired with customized facials targeting hydration, acne, or anti-aging.",
      "best-sec1-item3-title": "Dermaplaning",
      "best-sec1-item3-copy":
        "A precise exfoliation that removes dead skin cells and peach fuzz, leaving your face incredibly smooth and ready for flawless makeup or deeper product penetration.",
      "best-sec2-title":
        "2. The Future of Non-Invasive Lifting: EMFACE & AxoMind",
      "best-sec2-item1-title": "EMFACE",
      "best-sec2-item1-copy":
        "The first and only needle-free procedure that treats facial skin and muscles simultaneously. Using Synchronized RF and HIFESâ„¢ energies, it reduces wrinkles and lifts the face naturally.",
      "best-sec2-item2-title": "AxoMind",
      "best-sec2-item2-copy":
        "A cutting-edge neuromuscular stimulation that enhances muscle tone and definition, providing a structured, youthful appearance to the facial contours.",
      "best-sec3-title": "3. Body Sculpting & Professional Contouring",
      "best-sec3-item1-title": "EMSCULPT & EMFUSION",
      "best-sec3-item1-copy":
        "High-Intensity Focused Electromagnetic technology induces thousands of powerful muscle contractionsâ€”equivalent to an intensive workoutâ€”to tone the abdomen, glutes, or limbs while reducing fat.",
      "best-sec3-item2-title": "Body Contouring",
      "best-sec3-item2-copy":
        "Personalized protocols use various modalities to tighten skin and reduce stubborn fat pockets, tailored specifically to your silhouette.",
      "best-sec4-title": "4. Daily Elegance & Recovery",
      "best-sec4-item1-title": "Precision Laser Hair Removal",
      "best-sec4-item1-copy":
        "Advanced systems safe for all skin types provide long-lasting, silky-smooth results.",
      "best-sec4-item2-title": "Lash Services",
      "best-sec4-item2-copy":
        "From natural lifts to voluminous extensions, our specialists frame your eyes to perfection.",
      "best-sec4-item3-title": "Therapeutic Massage",
      "best-sec4-item3-copy":
        "Signature massages relieve tension, promote lymphatic drainage, and calm the mind after your high-tech treatments.",
      "best-why-title": "Why Choose RINU at Derand Hotel?",
      "best-why-quote":
        "We don't believe in a one-size-fits-all approach. Every guest receives a Bespoke Aesthetic Mapâ€”a detailed consultation where we analyze your skin type, muscle structure, and long-term goals to ensure every EMFUSION pulse or CO2 laser setting is calibrated perfectly for you.",
      "fc-hero-title": "Your Journey Starts Here",
      "fc-hero-sub": "A Bespoke Consultation with Dr. Diellza",
      "fc-hero-intro":
        "At RINU MEDSPA, we believe that the most beautiful results are born from a deep understanding of your unique anatomy. A consultation with Dr. Diellza is more than just an appointmentâ€”it is a professional partnership dedicated to achieving your aesthetic goals with precision, safety, and a â€œluxuryâ€‘naturalâ€ touch.",
      "fc-sec1-title": "1. Professional Skin & Facial Analysis",
      "fc-sec1-intro":
        "Every face tells a story. Dr. Diellza uses her clinical expertise to read yours.",
      "fc-sec1-item1-title": "Advanced Mapping",
      "fc-sec1-item1-copy":
        "Comprehensive structural analysis of skin quality, muscle movement, and facial symmetry.",
      "fc-sec1-item2-title": "The â€œScience of Agingâ€ Education",
      "fc-sec1-item2-copy":
        "Understand why changes happenâ€”volume loss, collagen depletion, environmental damageâ€”to make informed decisions.",
      "fc-sec2-title": "2. Your Personalized Aesthetic Roadmap",
      "fc-sec2-intro": "We donâ€™t believe in trends; we believe in harmony.",
      "fc-sec2-item1-title": "Tailored Treatment Plans",
      "fc-sec2-item1-copy":
        "Whether EMFACE, Alma Hybrid, or Body Contouring, we create a stepâ€‘byâ€‘step plan that fits your skin and lifestyle.",
      "fc-sec2-item2-title": "Realistic Expectations",
      "fc-sec2-item2-copy":
        "Clear guidance on the science, recovery, and maintenance to keep results elegant over time.",
      "fc-sec3-title": "3. A Private, Highâ€‘End Environment",
      "fc-sec3-item1-title": "Oneâ€‘onâ€‘One Attention",
      "fc-sec3-item1-copy":
        "This time is 100% yoursâ€”ask questions and explore options in a calm setting.",
      "fc-sec3-item2-title": "Holistic Wellness Integration",
      "fc-sec3-item2-copy":
        "We combine highâ€‘tech clinical care with restorative rituals for balanced wellness.",
      "fc-meet-title": "Meet the Expert",
      "fc-meet-quote":
        "â€œMy philosophy is â€˜Invisible Enhancement.â€™ My goal isn't to change how you look, but to restore the most rested, vibrant version of yourself.â€ â€” Dr. Diellza",
      "fc-prepare-title": "How to Prepare for Your Free Consultation",
      "fc-prepare-1":
        "Bring your current routineâ€”share the products you are using.",
      "fc-prepare-2":
        "Think about your â€œWhyâ€ â€” the one thing youâ€™d like to improve most.",
      "fc-prepare-3":
        "No pressureâ€”this is an educational session with zero obligation.",
      "nav-rooms": "ROOMS & SUITES",
      "nav-room-1": "JUNIOR SUITE",
      "nav-room-2": "DELUXE DOUBLE ROOM",
      "nav-room-3": "SUPERIOR TWIN ROOM",
      "nav-room-4": "PREMIUM DOUBLE ROOM",
      "nav-room-5": "SUPERIOR DOUBLE ROOM",
      "nav-restaurant": "RESTAURANT & BAR",
      "nav-restaurant-1": "NOYA",
      "nav-restaurant-2": "OMMA-Cafe & Buffet",
      "omma-hero-left": "Derand Hotel",
      "omma-hero-middle": "Coming Soon",
      "omma-hero-year": "2026",
      "omma-hero-title": "OMMA<br />Cafe &amp; BUFFET",
      "omma-intro-title": "A Contemporary Ritual of Flavor",
      "omma-intro-copy-1":
        "SOON, OUR DOORS WILL OPEN TO BOTH HOTEL RESIDENTS AND THE PUBLIC, OFFERING A SOPHISTICATED RETREAT FOR COFFEE AND A LAVISH MORNING BUFFET.",
      "omma-intro-copy-2":
        "WHETHER YOU ARE JOINING US FOR A SLOW MORNING COFFEE OR A VIBRANT BREAKFAST GATHERING, OMMA OFFERS A SOPHISTICATED YET WELCOMING ATMOSPHERE. OPEN TO HOTEL GUESTS AND THE PUBLIC ALIKE, WE INVITE YOU TO STEP INTO OUR MINIMALIST SANCTUARY AND START YOUR DAY WITH QUALITY INGREDIENTS AND EXCEPTIONAL SERVICE.",
      "omma-intro-lower-copy-1":
        "The design revolves around the interplay of contrast and harmony. This is achieved through the juxtaposition of tactile materials: polished stone set against soft ambient lighting, deep-toned marble paired with warm wood paneling, and sculptural lighting elements suspended beneath organic ceiling forms.",
      "omma-services-copy-1":
        "DERAND HOTEL IS A CONTEMPORARY LUXURY HOSPITALITY PROJECT DEFINED BY BOLD MATERIALITY, REFINED CRAFTSMANSHIP, AND A WARM, IMMERSIVE SPATIAL EXPERIENCE.",
      "omma-services-copy-2":
        "THE DESIGN BLENDS MODERN ELEGANCE WITH RICH NATURAL TEXTURES TO CREATE A SOPHISTICATED YET WELCOMING ATMOSPHERE.",
      "omma-services-copy-3":
        "THE INTERIOR PALETTE IS DOMINATED BY EARTHY BROWNS, BRONZE ACCENTS, AND NATURAL STONE FINISHES, REINFORCING A SENSE OF TIMELESS LUXURY.",
      "omma-services-copy-4":
        "VERTICAL WOODEN WALL ELEMENTS AND LAYERED TEXTURES PROVIDE RHYTHM AND DEPTH, WHILE LARGE WINDOWS ALLOW NATURAL LIGHT TO INTERACT BEAUTIFULLY WITH THE MATERIALS THROUGHOUT THE DAY.",
      "omma-intro-extra-copy-1":
        "THE DESIGN &amp; PHILOSOPHY OF OMMA CAFE &amp; BUFFET REFLECTS THE SOPHISTICATED ESSENCE OF DERAND HOTEL, WHERE EVERY DETAIL IS A STUDY IN CONTRAST.",
      "omma-intro-extra-copy-2":
        "LOCATED ADJACENT TO OUR ICONIC RECEPTION-WHERE THE RADIANT, RED-VEINED MARBLE SETS A TONE OF EXCLUSIVITY-OMMA EXTENDS THIS VISUAL NARRATIVE INTO THE CULINARY WORLD.",
      "omma-collage-left": "Lets Craft<br />Your Signature<br />Dining Story",
      "omma-collage-right":
        "And discover<br />how OMMA can<br />frame every moment",
      "omma-photo-1-alt": "OMMA photo 1",
      "omma-photo-2-alt": "OMMA photo 2",
      "omma-photo-3-alt": "OMMA photo 3",
      "omma-services-img-1-alt": "Interior design concept",
      "omma-services-img-2-alt": "Renovation concept",
      "omma-services-img-3-alt": "Material selection concept",
      "omma-services-img-4-alt": "Lighting design concept",
      "omma-services-img-5-alt": "Wide lighting design concept",
      "omma-collage-img-1-alt": "OMMA atmosphere",
      "omma-collage-img-2-alt": "OMMA interior detail",
      "omma-collage-img-3-alt": "OMMA evening experience",
      "omma-lightbox-close": "Close image zoom",
      "omma-lightbox-img-alt": "Zoomed OMMA image",
      "omma-zoom-image": "Zoom image",
      "omma-intro-btn": "Contact Us",
      "nav-activities": "ACTIVITIES",
      "nav-activity-1": "ONZE RECOVERY",
      "nav-activity-2": "RINU MEDSPA",
      "nav-inquiry": "CONTACT",
      "nav-contact-us": "CONTACT US",
      "nav-faqs": "FAQS",
      "nav-activity-3": "NOYA NIGHTLIFE",
      "nav-specials": "SPECIALS & OFFERS",
      "nav-special-1": "THE COLLECTION",
      "nav-special-2": "ROMANCE IN THE CLOUDS",
      "nav-special-3": "THE RECOVERY STAY ONZE",
      "nav-special-4": "THE BEAUTY GLOW RINU",
      "nav-special-5": "GIFT VOUCHERS",
      "nav-contact": "CONTACT",
      "nav-contact-1": "FAQS",
      "book-now": "Book Now",
      "hero-kicker": "ROOMS & SUITES",
      "hero-title": "DERAND HOTEL ROOMS IN PRISHTINA",
      "categories-kicker": "OUR EXQUISITE ROOM CATEGORIES",
      "categories-intro": "I am looking for",
      "categories-trigger": "all rooms & suites",
      "categories-item-1": "Junior Suite",
      "categories-item-2": "Superior Double Room",
      "categories-item-3": "Deluxe Double Room",
      "categories-item-4": "Premium Double Room",
      "categories-item-5": "Twin Room",
      "card-badge-1": "HIGH-CLASS COMFORT",
      "card-badge-2": "SECOND TO NONE",
      "card-badge-3": "TOP TIER LUXURY",
      "card-badge-4": "TIMELESS ELEGANCE",
      "card-badge-5": "HIGH-CLASS COMFORT",
      "card-name-1": "Junior Suite",
      "card-name-2": "Deluxe Double Room",
      "card-name-3": "Superior Twin Room",
      "card-name-4": "Premium Double Room",
      "card-name-5": "Superior Double Room",
      "about-eyebrow": "Derand Hotel",
      "about-title": "A GREAT SELECTION OF ROOMS AND SUITES",
      "about-copy-1":
        "Nestled in the vibrant heart of Prishtina, Derand Hotel offers a curated collection of accommodations designed to be your sanctuary, where tradition meets modern luxury.",
      "about-copy-2":
        "Whether you are visiting for business or a cultural escape, our rooms - from intimate Superior categories to expansive Deluxe and Premium options - offer a seamless balance of style, comfort, and quiet elegance.",
      "signature-text":
        "The Derand signature extends across all room categories, ensuring an exceptional sense of well-being and luxury, no matter your selection.",
      "owner-title": "GENERAL MANAGER",
      "showcase-1-subtitle": "SOVEREIGN FEELING OF WELLBEING",
      "showcase-1-title": "DELUXE ROOMS & <br />JUNIOR SUITES",
      "showcase-1-description":
        "Enjoy luxurious living comfort in an elegant atmosphere and<br />relax in a stylish ambience in the heart of the city.",
      "showcase-2-subtitle": "Extravagant living comfort",
      "showcase-2-title": "Premium & Twin Suites",
      "showcase-2-description":
        "Reside imperially in a stylish and elegant ambience in the heart of Prishtina and make your stay at the Derand Hotel an unforgettable experience.",
      "junior-hero-title": "Junior Suite in Prishtina",
      "junior-hero-brand": "Derand Hotel",
      "junior-kicker": "Pure excellence",
      "junior-headline": "360°Junior Suite",
      "junior-preview-copy":
        "Spacious Junior Suites offer the comfort and finish you expect from a five-star hotel: refined living space, elegant marble bathrooms, and thoughtful details throughout. Typical suites span about 35 to 45 square metres, with a calm atmosphere and views toward the city.",
      "junior-size-value": "35m²",
      "junior-size-label": "Size",
      "junior-bed-value": "King size",
      "junior-bed-label": "Bed",
      "junior-concierge-value": "24 h",
      "junior-concierge-label": "Concierge service",
      "junior-parking-value": "24/7 Parking",
      "junior-parking-label": "Free",
      "junior-water-value": "Water",
      "junior-water-label": "Free",
      "junior-director-quote":
        "Our Junior Suites set a new benchmark for luxury and well-being, combining generous comfort with timeless elegance.",
      "junior-bath-note":
        "Generous proportions and thoughtful details give our Junior Suites a calm, residential atmosphere. Warm lighting and marble finishes in the bathroom create a spa-like sense of ease.",
      "junior-director-name": "Derand Hotel PRISHTINA",
      "junior-director-role": "GENERAL MANAGER",
      "culinary-kicker": "Eat and drink in style",
      "culinary-title-line-1": "The finest culinary",
      "culinary-title-line-2": "experiences",
      "learn-more": "LEARN MORE",
      "rooms-offer-quote":
        "Join us in the heart of Prishtina, and let us guide you through a journey where the city's storied past and vibrant present come alive in every detail.",
      "footer-powered": "Powered by",
      "newsletter-title": "Become part of our world",
      "newsletter-copy":
        "Receive curated stories, seasonal offers, and private invitations.",
      "newsletter-first-name": "FIRST NAME",
      "newsletter-last-name": "LAST NAME",
      "newsletter-email": "EMAIL ADDRESS",
      "newsletter-agree": "I agree to the terms and privacy policy.",
      "newsletter-button": "SIGN ME UP",
      "contact-breadcrumb-title": "Contact Us",
      "contact-kicker": "Derand Hotel",
      "contact-title": "Let's Create Your Perfect Stay",
      "contact-copy":
        "Send us your message and our team will reply with care and speed.",
      "contact-arrival-kicker": "Contact & Arrival",
      "contact-arrival-title": "Contact and Arrival in Prishtina",
      "contact-arrival-subtitle": "Arriving at Derand Hotel Prishtina",
      "contact-arrival-p1":
        "Derand Hotel is located in the heart of the city and is easily reachable by all major forms of transportation. If you are arriving by car, simply follow the signs towards central Prishtina.",
      "contact-arrival-p2":
        "The hotel is accessible from Prishtina International Airport by taxi and private transfer services. Our team is happy to assist you with directions and arrival support before your stay.",
      "contact-showcase-title": "THE LEADING HOTELS",
      "contact-showcase-subtitle": "OF DERAND PRISHTINA",
      "contact-address-kicker": "Address",
      "contact-address-title": "Derand Hotel Prishtina",
      "contact-address-line": "Bekim Fehmiu Str. 30, Prishtina 10000 Kosovo",
      "contact-address-tel-label": "Tel.:",
      "contact-address-whatsapp-label": "Whatsapp:",
      "contact-address-whatsapp-open": "Open in the app",
      "contact-address-email-label": "Email:",
      "contact-submit": "Send Message",
      "contact-field-name": "Full Name",
      "contact-field-username": "Username",
      "contact-field-email": "Email Address",
      "contact-field-subject": "Subject",
      "contact-field-message": "Leave your message...",
      "footer-link-1": "Contact Us",
      "footer-link-2": "Derand History",
      "footer-link-3": "Terms of Service",
      "footer-link-4": "Derand Magazine",
      "footer-link-5": "Careers",
      "footer-link-6": "FAQs",
      "footer-link-7": "Privacy Policy",
      "footer-link-8": "Payments",
      "footer-link-9": "Guest App",
      "footer-link-10": "Derand Magazine",
      "footer-link-11": "Our Location",
      "footer-guarantee-1": '<i class="fa fa-check"></i> Best Value Guarantee',
      "footer-guarantee-2":
        '<i class="fa fa-check"></i> Special Rates for Leaders Club Members',
      "footer-guarantee-3":
        '<i class="fa fa-check"></i> Flexible booking conditions',
      "policy-breadcrumb-title": "Privacy Policy",
      "policy-hero-label": "Privacy Policy",
      "policy-hero-title":
        "We would like to thank you for visiting the website of Derand Hotel!",
      "policy-sec-1": "I. Name and address of data controller",
      "policy-sec-2": "II. What information do we collect?",
      "policy-sec-3": "III. Why do we collect your data?",
      "policy-sec-4": "IV. How do we protect your data?",
      "policy-sec-5": "V. Reservation and Payment Policy",
      "policy-sec-6": "VI. Your Rights",
      "policy-sec-7": "VII. How long do we keep the data?",
      "policy-sec-8": "VIII. Contact Us",
      "policy-contact-btn": "Contact Us",
      "policy-p-lead":
        "At Derand Hotel, we value your trust and are committed to protecting your personal data. This policy explains how we collect, use, and secure your information during your stay or while using our services.",
      "policy-p-1-intro":
        "Within the meaning of the General Data Protection Regulation and other national data protection laws of the Member States as well as any other data protection provisions, the controller is:",
      "policy-p-2-1":
        "Identification Information: First name, last name, date of birth, and identification document (ID or Passport), as required by local laws for guest registration.",
      "policy-p-2-2":
        "Contact Data: Phone number, email address, and residential address.",
      "policy-p-2-3":
        "Booking & Payment Details: Credit/debit card information, bank transfers, and stay history.",
      "policy-p-3-1":
        "Processing Reservations: To confirm, modify, or manage your stay.",
      "policy-p-3-2":
        "Legal Obligations: To report guest presence to the relevant state authorities, as required by law for the tourism sector.",
      "policy-p-3-3":
        "Service Personalization: To provide your room preferences, specific requests, or Concierge services.",
      "policy-p-3-4":
        "Security: The use of CCTV systems in the hotel's public areas for the safety of guests and staff.",
      "policy-p-4-1":
        "Digital Security: Your data is stored on secure servers and protected management systems.",
      "policy-p-4-2":
        "Restricted Access: Only authorized personnel have access to your personal information for strict business purposes.",
      "policy-p-4-3":
        "Third-Party Partners: We collaborate with booking platforms (such as Booking.com or Expedia). We ensure that the transfer of your data to us is carried out securely.",
      "policy-p-5-1":
        "Cancellations: Derand Hotel applies a strict policy: reservations are non-cancellable and payments are non-refundable.",
      "policy-p-5-2":
        "Payment Methods: We accept cash, credit cards, virtual cards, and bank transfers.",
      "policy-p-6-intro":
        "In accordance with the legislation in force for the protection of personal data, you have the right to:",
      "policy-p-6-li-1": "Request access to the data we hold about you.",
      "policy-p-6-li-2": "Request the correction of inaccurate information.",
      "policy-p-6-li-3":
        "Request the deletion of data, except in cases where we are legally obliged to retain it (e.g., for financial purposes or official records).",
      "policy-p-7-1":
        "We retain your data only for as long as necessary to fulfill the purposes mentioned above or to comply with legal, tax, and administrative deadlines.",
      "policy-p-8-intro":
        "If you have questions or wish to exercise your rights, please contact us:",
      "terms-breadcrumb-title": "Terms of Service",
      "terms-hero-label": "Terms of Service",
      "terms-hero-title": "Derand Hotel Prishtina",
      "terms-sec-2": "II. Acceptance of Terms",
      "terms-sec-3": "III. Reservations and Payment Policy",
      "terms-sec-4": "IV. Stay Regulations (Check-in & Check-out)",
      "terms-sec-5": "V. Website Usage",
      "terms-sec-6": "VI. Limitation of Liability",
      "terms-sec-7": "VII. Governing Law",
      "terms-sec-8": "VIII. Contact Us",
      "terms-p-lead":
        "Welcome to Derand Hotel! By using our website, our online services, or by making a reservation, you agree to the following terms and conditions:",
      "terms-p-2-1":
        "By accessing our website derandhotel.com or booking a stay, you fully agree to these terms. If you do not agree with any part of them, please discontinue the use of our platform.",
      "terms-p-3-1":
        "Booking Method: Reservations can be made through our official website, authorized online travel agencies (OTAs), or by contacting the hotel directly.",
      "terms-p-3-2":
        "Cancellations and Refunds: Derand Hotel applies a strict policy: all reservations are non-cancellable and payments are non-refundable.",
      "terms-p-3-3":
        "Payment Methods: We accept cash, credit/debit cards, virtual cards, and bank transfers.",
      "terms-p-4-1":
        "Identification: Every guest must present a valid identification document (ID or Passport) upon arrival.",
      "terms-p-4-2":
        "Schedule: Check-in and check-out times must be respected according to hotel regulations to ensure the smooth delivery of services.",
      "terms-p-4-3":
        "Smoking: Smoking inside the enclosed areas of the hotel is strictly prohibited, except in specifically designated zones.",
      "terms-p-5-1":
        "Personal Use: The content of this site (texts, photographs, logos) is the property of Derand Hotel and is permitted only for personal, non-commercial use.",
      "terms-p-5-2":
        "Prohibitions: Copying, distributing, or manipulating content without prior written authorization is strictly prohibited.",
      "terms-p-5-3":
        "Security: Users must not interfere with the security of the site or attempt to gain unauthorized access to data.",
      "terms-p-6-1":
        "Derand Hotel is not responsible for any indirect damages that may result from the use of our site or potential technical interruptions.",
      "terms-p-6-2":
        "We do not guarantee that the information on the site will be error-free at all times, but we are committed to updating it regularly.",
      "terms-p-7-1":
        "These terms are governed by the laws in force in the Republic of Kosovo. For any dispute that cannot be resolved through mutual agreement, the competent courts in Pristina shall have jurisdiction.",
      "terms-p-8-intro":
        "If you have questions or wish to exercise your rights, please contact us:",
      "index-hero-title": "Your Second Home",
      "index-mozart-h3": "WHY DERAND HOTEL IS THE BEST CHOICE?",
      "index-mozart-h4": "Modern Infrastructure & Friendly and Welcoming Staff",
      "index-mozart-p":
        "Derand Hotel boasts a superb location with easy access <br />to the city center and beyond. <br />As one of the tallest buildings in Prishtina, it offers a unique view of the city, a modern infrastructure, and a friendly, welcoming staff.<br />With high-speed internet, and complimentary parking, <br />these are just some of the reasons why Derand Hotel is the best choice for you.",
      "index-events-kicker": "Our Partnerships",
      "index-events-title": "Our Exclusive Experiences",
      "index-event-1": "Pure Radiance & Wellness",
      "index-event-2": "Vibrant City Rhythms",
      "index-event-3": "Elite Body Recovery",
      "index-event-4": "Explore the Heights",
      "index-event-5": "Inner Harmony & Flow",
      "index-event-6": "Active Life & Balance",
      "index-event-7": "Mountain Adventures",
      "index-rooms-kicker": "Luxury on Every Level",
      "index-rooms-title": "Rooms and Suites",
      "index-link-learn": "Learn more",
      "index-welcome-kicker": "HELLO Prishtina",
      "index-welcome-title": "Refined Elegance & Comfort",
      "index-welcome-p":
        "Every stay is a curated journey of elegance, where timeless style meets the art of refined hospitality.",
      "index-health-kicker": "Prishtina",
      "index-health-title": "Stay. Relax. Enjoy.",
      "index-fac-kicker": "Great for your stay",
      "index-fac-title": "Derand Facilities",
      "index-fac-chip-1": "Free Wifi",
      "index-fac-chip-2": "Free Parking",
      "index-fac-chip-3": "Private Bathroom",
      "index-fac-chip-4": "Air Conditioning",
      "index-fac-chip-5": "City View",
      "index-fac-chip-6": "Non-smoking Rooms",
      "index-fac-chip-7": "Flat-screen TV",
      "index-fac-chip-8": "24-hour Front Desk",
      "index-fac-acc1-sum": "Bathroom & Bedroom",
      "index-fac-acc1-p":
        "Toilet paper, towels, slippers, toilet, free toiletries, bathrobe, hairdryer, shower, linens, wardrobe or closet, alarm clock, walk-in closet.",
      "index-fac-acc2-sum": "Room Amenities & Living",
      "index-fac-acc2-p":
        "Desk, clothes rack, cleaning products, dryer, electric kettle, tea and coffee maker, soundproofed comfort, heating, fan, ironing facilities, suit press.",
      "index-fac-acc3-sum": "Media, Internet & Parking",
      "index-fac-acc3-p":
        "Cable and satellite channels, radio, telephone, flat-screen TV, free WiFi in all areas, free private parking on site with no reservation needed.",
      "index-fac-acc4-sum": "Services & Safety",
      "index-fac-acc4-p":
        "Concierge, wake-up service, invoice provided, 24-hour front desk, CCTV in common areas and outside, smoke alarms, security alarm, safe, 24-hour security.",
      "index-fac-acc5-sum": "Accessibility & Languages",
      "index-fac-acc5-p":
        "Upper floors accessible by elevator. Languages spoken: English, Spanish, Turkish.",
      "index-quote-text":
        "A stay at the Derand Hotel Prishtina is sure to raise anyone's experience of Prishtina to unforgettable heights.",
      "index-quote-name": "DERAND HOTEL PRISHTINA",
      "index-quote-role": "GENERAL Manager",
      "index-testimonials-heading": "What our guests say:",
      "index-guest-source": "Source",
      "index-book-room": "Book your room now",
      "index-ig-line": "Follow us on <strong>Instagram</strong>",
      "index-footer-address": "Bekim Fehmiu Str. 30 Pristina 10000 Kosovo",
      "index-t-prev": "Previous review",
      "index-t-next": "Next review",
      "index-events-prev": "Previous experiences",
      "index-events-next": "Next experiences",
      "index-stars-aria": "5 out of 5 stars",
      "index-guest-0-title": "Excellent location and beautiful rooms",
      "index-guest-0-body":
        "Excellent location, great staff, comfortable rooms, and fair prices. What more could you ask for?",
      "index-guest-0-room": "Superior Double Room",
      "index-guest-0-loc": "United States",
      "index-guest-1-title": "Clean rooms in a prime city location",
      "index-guest-1-body":
        "Great location, clean and spacious rooms, and excellent value throughout the stay.",
      "index-guest-1-room": "Superior Double Room",
      "index-guest-1-loc": "United Kingdom",
      "index-guest-2-title": "Warm hospitality and spotless rooms",
      "index-guest-2-body":
        "Friendly staff, exceptionally clean rooms, and a comfortable stay in an ideal location.",
      "index-guest-2-room": "Superior Double Room",
      "index-guest-2-loc": "United Kingdom",
      "index-guest-3-title": "Modern rooms with friendly service",
      "index-guest-3-body":
        "Modern, clean rooms, kind staff, and a smooth check-in with excellent service.",
      "index-guest-3-room": "Deluxe Double Room",
      "index-guest-3-loc": "Slovenia",
      "index-guest-4-title": "Outstanding service and a comfortable stay",
      "index-guest-4-body":
        "Excellent hospitality, a helpful team, and very comfortable rooms from start to finish.",
      "index-guest-4-room": "Deluxe Double Room",
      "index-guest-4-loc": "Oman",
      "deluxe-preview-copy":
        "Step into luxury with our Deluxe Double Room. Spacious and stylishly appointed, it boasts a sumptuous double bed and offers the flexibility of an additional bed upon request. Designed for discerning travelers seeking comfort and convenience, this room is a perfect blend of sophistication and adaptability.",
      "deluxe-size-value": "30m²",
      "deluxe-size-label": "Size",
      "deluxe-bed-value": "King size",
      "deluxe-bed-label": "Bed",
      "deluxe-concierge-value": "24 h",
      "deluxe-concierge-label": "Concierge service",
      "deluxe-parking-value": "24/7 Parking",
      "deluxe-parking-label": "Free",
      "deluxe-water-value": "Water",
      "deluxe-water-label": "Free",
      "deluxe-director-quote":
        "Our Deluxe Rooms elevate refined living by blending generous comfort with timeless elegance.",
      "deluxe-bath-note":
        "Layered textiles, soft bedside lighting, and a proper writing nook make our Deluxe rooms feel like a quiet residence in the city, ready for both rest and focused work.",
      "deluxe-moments-line-1": "Moments shared here",
      "deluxe-moments-line-2": "transform into lasting memories",
      "guest-app-hero-title":
        "Discover everything you need with Derand's tailored Guest App.",
      "guest-app-hero-copy":
        "Your journey starts here: explore, book, and enjoy a seamless stay—experience the city like nowhere else.",
      "guest-app-badge-app-small": "Download on the",
      "guest-app-badge-app-big": "App Store",
      "guest-app-badge-play-small": "GET IT ON",
      "guest-app-badge-play-big": "Google Play",
      "guest-app-featured-heading": "Highlighted features of Guest App",
      "guest-app-featured-title":
        "Explore our exclusive features for <span>seamless journey</span>",
      "guest-app-card-1-title":
        "A selection of the best bars and restaurants at your fingertips",
      "guest-app-card-2-title": "A one-stop-shop while staying at Derand",
      "guest-app-card-3-title": "Easy to setup your account",
      "guest-app-card-4-title": "Booking a table was never this easy",
      "guest-app-about-title": "About Guest App",
      "guest-app-about-copy":
        "We're dedicated to simplifying guest stay and experience the city or country. The app helps guests explore points of interest, starting from best restaurants to the most important landmarks.",
      "guest-app-stats-registered-label": "Registered guests",
      "guest-app-stats-tables-label": "Tables booked",
      "guest-app-stats-rating-label": "App Store rating",
      "careers-hero-kicker": "Derand Careers",
      "careers-hero-title": "Work With Us",
      "careers-hero-sub":
        "Explore current roles or submit an open application. Even when a role is not available today, we can review your CV for future opportunities.",
      "careers-open-application-title": "Open Application",
      "careers-open-application-copy":
        "Send your profile directly to our HR team. We keep strong candidates in review for upcoming positions.",
      "careers-preferred-position-label": "Preferred Position",
      "careers-preferred-position-placeholder": "e.g. Receptionist",
      "careers-preferred-department-label": "Preferred Department",
      "careers-preferred-department-placeholder": "Select or type a department",
      "careers-dept-housekeeping": "Housekeeping",
      "careers-dept-housekeeping-mgmt": "Housekeeping Management",
      "careers-dept-reception": "Reception / Front Office",
      "careers-dept-security": "Security",
      "careers-dept-procurement": "Procurement & Logistics",
      "careers-dept-bell": "Bell Service",
      "careers-dept-sales": "Sales",
      "careers-dept-architecture": "Architecture",
      "careers-dept-social": "Social Media",
      "careers-dept-it": "IT",
      "careers-dept-finance": "Finance",
      "careers-dept-uiux": "UI/UX Design",
      "careers-dept-management": "Management",
      "careers-dept-other": "Other",
      "careers-submit-cv": "Submit Your CV",
      "careers-current-positions-title": "Current Open Positions",
      "careers-company-name": "Derand Hotel Prishtina",
      "careers-job-1-title": "Housekeeping Staff",
      "careers-job-1-detail": "Type: Full-time | Position: Operations",
      "careers-job-2-title": "Housekeeping Manager",
      "careers-job-2-detail": "Type: Full-time | Position: Management",
      "careers-job-3-title": "Receptionist",
      "careers-job-3-detail": "Type: Full-time | Position: Front Office",
      "careers-job-4-title": "Security",
      "careers-job-4-detail": "Type: Full-time | Position: Security",
      "careers-job-5-title": "Security Manager",
      "careers-job-5-detail": "Type: Full-time | Position: Security Management",
      "careers-job-6-title": "Bellboy",
      "careers-job-6-detail": "Type: Full-time | Position: Guest Service",
      "careers-job-7-title": "Sales",
      "careers-job-7-detail": "Type: Full-time | Position: Sales",
      "careers-job-8-title": "Architect",
      "careers-job-8-detail": "Type: Full-time | Position: Architecture",
      "careers-job-9-title": "Social Media Marketing",
      "careers-job-9-detail": "Type: Full-time | Position: Marketing",
      "careers-job-10-title": "IT Specialist",
      "careers-job-10-detail": "Type: Full-time | Position: IT",
      "careers-job-11-title": "Procurement / Logistics",
      "careers-job-11-detail": "Type: Full-time | Position: Operations",
      "careers-job-12-title": "Finance Officer",
      "careers-job-12-detail": "Type: Full-time | Position: Finance",
      "careers-job-13-title": "UI/UX Designer",
      "careers-job-13-detail": "Type: Full-time | Position: Design",
      "apply-title": "Open Application",
      "apply-sub":
        "Submit your CV and profile to our HR team. We review applications for current and future roles.",
      "apply-first-name-label": "First name*",
      "apply-first-name-ph": "First name*",
      "apply-last-name-label": "Last name*",
      "apply-last-name-ph": "Last name*",
      "apply-email-label": "Email*",
      "apply-email-ph": "Email*",
      "apply-phone-label": "Phone*",
      "apply-phone-ph": "Phone*",
      "apply-preferred-position-label": "Preferred position*",
      "apply-preferred-position-ph": "e.g. Receptionist",
      "apply-department-label": "Department*",
      "apply-dept-select": "Select department",
      "apply-message-label": "Short message*",
      "apply-message-ph": "Write a short message",
      "apply-photo-label": "Photo*",
      "apply-resume-label": "CV / Resume",
      "apply-upload-file": "Upload file",
      "apply-max-size": "Max 2 MB",
      "apply-consent-title": "Data Consent",
      "apply-consent-storage":
        "I agree that my data can be stored for recruitment purposes.",
      "apply-consent-privacy": "I agree to the privacy policy.",
      "apply-cancel": "Cancel",
      "apply-submit": "Submit Application",
      "apply-success-title": "Application submitted successfully.",
      "apply-success-text": "Thank you. Your application has been received.",
    },
    de: {
      "rinu-hero-kicker":
        "STEIGERN SIE IHRE SCHÃ–NHEIT UND IHR SELBSTVERTRAUEN",
      "rinu-trust-copy":
        "Vertraut von Kundinnen und Kunden in Sudbury fÃ¼r auÃŸergewÃ¶hnliche, langanhaltende Ergebnisse in fortschrittlichen Laserâ€‘ und Ã„sthetikbehandlungen.",
      "rinu-solutions-kicker": "Entdecken Sie unsere Expertise",
      "rinu-solutions-title": "Umfassende SchÃ¶nheitslÃ¶sungen",
      "rinu-solutions-copy":
        "Von modernsten Laserbehandlungen bis hin zu fortschrittlicher Ã„sthetik und Bodyâ€‘Contouring bieten wir ein vollstÃ¤ndiges Spektrum an Services, um Ihre SchÃ¶nheit zu unterstreichen und Ihr Selbstvertrauen zu stÃ¤rken.",
      "rinu-faq-q1": "Welche Leistungen bietet RINU MEDSPA an?",
      "rinu-faq-a1":
        "Wir bieten Laser-Haarentfernung, Dermaplaning, Wimpernservices, Facials und KÃ¶rperformung â€“ sowie EMSCULPT, Microneedling, CO2, Alma Hybrid, Massage, AxoMind, EMFUSION und EMFACE â€“ individuell auf Ihren Hauttyp und Ihre Ziele abgestimmt.",
      "rinu-faq-q2": "Wie buche ich einen Termin?",
      "rinu-faq-a2":
        "Buchen Sie online Ã¼ber die â€žJetzt buchenâ€œ-SchaltflÃ¤che auf unserer Website. Sie erhalten sofort eine BestÃ¤tigung und kÃ¶nnen Ihre Buchung direkt auf der Seite verwalten.",
      "rinu-faq-q3": "Sind Behandlungen fÃ¼r alle Hauttypen sicher?",
      "rinu-faq-a3":
        "Ja. Alle unsere Behandlungen nutzen anpassbare, moderne Einstellungen, um eine Vielzahl von HauttÃ¶nen und Anliegen sicher und wirksam zu behandeln. Die sichersten Parameter werden im BeratungsgesprÃ¤ch festgelegt.",
      "rinu-faq-q4": "Was erwartet mich bei meinem ersten Besuch?",
      "rinu-faq-a4":
        "Sie beginnen mit einer kostenlosen Beratung bei Dr. Diellxa. Nach der Zielbesprechung und Hautanalyse erklÃ¤ren wir den Ablauf und die Optionen â€“ und Sie kÃ¶nnen direkt mit Ihrem personalisierten Plan (und der ersten Sitzung, falls gewÃ¼nscht) fortfahren.",
      "rinu-faq-q5":
        "Wie viele Sitzungen brauche ich fÃ¼r optimale Ergebnisse?",
      "rinu-faq-a5":
        "Das hÃ¤ngt von der gewÃ¤hlten Behandlung, der Region und der individuellen Reaktion ab. Am besten besprechen Sie dies in einer Beratung mit Dr. Diellxa, damit wir einen Plan und realistischen Zeitrahmen festlegen kÃ¶nnen.",
      "rinu-faqs-kicker": "Noch Fragen?",
      "rinu-faqs-title": "Wir haben die Antworten",
      "rinu-faqs-intro":
        "Erfahren Sie mehr Ã¼ber unsere Leistungen und was Sie erwarten kÃ¶nnen â€“ in den hÃ¤ufigsten Fragen oder kontaktieren Sie uns.",
      "rinu-best-view-more": "Mehr erfahren",
      "rinu-view-treatment": "Behandlung ansehen",
      "rinu-hero-title": "Fortgeschrittene Ã¤sthetische<br />LÃ¶sungen",
      "rinu-card-best-title": "Beste Behandlungen",
      "rinu-card-mani-title": "ManikÃ¼re &amp; PedikÃ¼re",
      "rinu-card-consult-title": "Kostenlose Beratung",
      "rinu-cta-kicker": "Bereit fÃ¼r VerÃ¤nderung?",
      "rinu-cta-title": "Buchen Sie heute Ihren Termin",
      "rinu-cta-copy":
        "Starten Sie Ihre Reise zu mehr Selbstvertrauen. Ob Laser, Ã„sthetik, Body Contouring oder Beauty â€“ unser Expertenteam ist bereit, Ihnen zu helfen.",
      "rinu-reviews-kicker": "Was unsere Kund:innen sagen",
      "rinu-reviews-title": "Echte Ergebnisse, echtes Feedback",
      "rinu-reviews-copy":
        "Erfahren Sie, warum so viele Kund:innen uns ihre Beauty-Behandlungen anvertrauen.",
      "rinu-signature-kicker": "Unsere Signature-Services",
      "rinu-signature-title":
        "Transformierende Behandlungen<br />individuell fÃ¼r Sie",
      "rinu-signature-copy":
        "Entdecken Sie unsere beliebtesten Behandlungen, mit denen Sie sich von Ihrer besten Seite fÃ¼hlen. Von glatter, haarfreier Haut bis zu makellosen Wimpern und strahlendem Teint bieten wir Expertenpflege fÃ¼r Ihre Beauty-BedÃ¼rfnisse.",
      "rinuform-kicker": "RINU Buchung",
      "rinuform-title": "Reservieren Sie Ihren Termin",
      "rinuform-sub":
        "Senden Sie eine Terminanfrage. Rinu ist von 12:00 bis 20:00 geöffnet. Wir bestätigen Ihre Anfrage in Kürze.",
      "rinuform-first-name-label": "Vorname",
      "rinuform-first-name-ph": "Vorname",
      "rinuform-last-name-label": "Nachname",
      "rinuform-last-name-ph": "Nachname",
      "rinuform-email-label": "E-Mail-Adresse",
      "rinuform-email-ph": "EMAIL",
      "rinuform-email-aria": "E-Mail",
      "rinuform-name-ph": "Name",
      "rinuform-name-aria": "Name",
      "rinuform-phone-label": "Telefonnummer",
      "rinuform-phone-ph": "Telefonnummer",
      "rinuform-phone-aria": "Telefonnummer",
      "rinuform-date-aria": "Datum",
      "rinuform-time-aria": "Uhrzeit",
      "rinuform-message-ph": "Nachricht",
      "rinuform-message-aria": "Nachricht",
      "rinuform-close-aria": "Formular schliessen",
      "rinuform-datetime-label": "Bevorzugtes Datum & Uhrzeit",
      "rinuform-submit": "Termin BestÃ¤tigen",
      "rinu1-hero-title-main": "RINU Medspa",
      "rinu1-hero-title-sub":
        "Fortschrittliche Behandlungen für Haut, Körper und Geist.",
      "rinu1-hero-cta-book": "Beratung buchen",
      "rinu1-hero-cta-explore": "Behandlungen entdecken",
      "rinu1-strip-1": "Reine Formulierungen",
      "rinu1-strip-2": "Beratung zuerst",
      "rinu1-strip-3": "Nachsorge inklusive",
      "rinu1-strip-4": "Vor Ort im Derand",
      "rinu1-card-skin-title": "HAUT",
      "rinu1-card-body-title": "KÖRPER",
      "rinu1-card-mind-title": "GEIST",
      "rinu1-card-learn-more": "Mehr erfahren",
      "rinu1-card-skin-note": "",
      "rinu1-card-body-note": "",
      "rinu1-skin-h": "HAUTBEHANDLUNGEN",
      "rinu1-skin-p1":
        "<strong>Facials (Biologique Recherche)</strong><br />Personalisierte Behandlungen auf Basis einer Hautanalyse, um Feuchtigkeit, Balance und natürliche Ausstrahlung wiederherzustellen.",
      "rinu1-skin-p2":
        "<strong>Injektionsbehandlungen</strong><br />Skin Booster, Filler und Exosomen für tiefe Hydration, Kollagenstimulation und verbesserte Hautdichte.",
      "rinu1-skin-p3":
        "<strong>Nicht-invasives Lifting</strong><br />EMFACE- und EXION-RF-Technologien zur Muskelaktivierung, Konturverbesserung und einem frischeren Aussehen.",
      "rinu1-skin-p4":
        "<strong>Hautqualität &amp; Textur</strong><br />Microneedling (EXION) und gezielte Infusionen zur Porenverfeinerung, Texturverbesserung und Elastizitätssteigerung.",
      "rinu1-skin-p5":
        "<strong>Fortgeschrittene Lasertherapie</strong><br />CO2- und Alma-Hybrid-Technologien zur Hauterneuerung, Pigmentreduktion und Narbenbehandlung.",
      "rinu1-body-h": "KÖRPER",
      "rinu1-body-exion":
        "<strong>EXION BODY</strong><br />Hautstraffung. Tiefe Stimulation. Sichtbare Kontur.<br />EXION Body ist keine typische Körperbehandlung. Es ist eine fortschrittliche Technologie, die Kollagen und Elastin tief im Gewebe stimuliert und dabei hilft, die Haut zu straffen, die Textur zu verbessern und die Körperkonturen zu verfeinern - alles auf nicht-invasive Weise.",
      "rinu1-emfusion-kicker": "<strong>EMFUSION</strong>",
      "rinu1-emfusion-line-1":
        "Hautregeneration. Tiefe Infusion. Echte Resultate.",
      "rinu1-emfusion-line-2":
        "EMFUSION ist keine traditionelle Gesichtsbehandlung. Es ist eine fortschrittliche Behandlung, die tief in der Haut wirkt, um Feuchtigkeit wiederherzustellen, die Textur zu verbessern und die natürliche Vitalität zu beleben.",
      "rinu1-emfusion-line-3":
        "Verfeinerte Textur. Neue Ausstrahlung. Tiefe Hautvitalität.",
      "rinu1-body-p1":
        "<strong>Massage &amp; Entspannung</strong><br />Individuelle Techniken mit Ligne-St-Barth-Ölen, um Spannungen zu lösen, die Durchblutung zu verbessern und das Gleichgewicht wiederherzustellen.",
      "rinu1-body-p2":
        "<strong>Körperpflege &amp; Polish</strong><br />Peelings und intensive Hydration für eine glatte, gepflegte und strahlende Haut.",
      "rinu1-body-p3":
        "<strong>Fortgeschrittenes Body Sculpting</strong><br />EMSCULPT Neo und EMTONE für Muskeltonus, Cellulite-Reduktion und Hautstraffung.",
      "rinu1-body-p4":
        "<strong>Spezialisiertes Wellness</strong><br />Gezielte Therapien wie EMSELLA und EMFEME mit Fokus auf innere Stärkung und regenerative Gesundheit.",
      "rinu1-body-p5":
        "<strong>Nails &amp; Grooming</strong><br />Professionelle Maniküre und Pediküre für ein gepflegtes, ästhetisches Erscheinungsbild mit höchster Detailgenauigkeit.",
      "rinu1-mind-h": "GEIST",
      "rinu1-mind-p1":
        "<strong>EXOMIND Magnetstimulation</strong><br />Eine nicht-invasive Behandlung mit sanften Magnetimpulsen zur Verbesserung von Fokus, Stressreduktion und emotionaler Balance.",
      "rinu1-mind-p2":
        "<strong>Tiefer mentaler Reset</strong><br />Ein synergetischer Ansatz aus EXOMIND-Technologie und beruhigenden Massage-Ritualen zur Lösung mentaler und körperlicher Spannungen.",
      "rinu1-mind-p3":
        "<strong>Schlaf- &amp; Klarheits-Support</strong><br />Gezielte Therapie zur Verbesserung der Schlafqualität, Reduktion mentaler Erschöpfung und gegen täglichen &quot;Brain Fog&quot;.",
      "rinu1-process-title": "So arbeiten wir",
      "rinu1-process-1-h": "Beratung",
      "rinu1-process-1-p":
        "Ziele, Gesundheitsverlauf und Fotos (mit Ihrem Einverständnis). Kein Druck für eine Buchung am selben Tag.",
      "rinu1-process-2-h": "Plan",
      "rinu1-process-2-p":
        "Ein klarer Ablauf: was in der Klinik zu tun ist, was zuhause pausiert werden soll und was stündlich zu erwarten ist.",
      "rinu1-process-3-h": "Behandlung",
      "rinu1-process-3-p":
        "Ruhige Suite-Zeit, kontinuierliche Zustimmung und Komfortpausen.",
      "rinu1-process-4-h": "Nachsorge",
      "rinu1-process-4-p":
        "Direkter Kontakt für Fragen, Cooling-Tipps und ein geplanter Foto-Check-in.",
      "rinu1-quote-main":
        "Ich wollte aussehen, als hätte ich eine Woche am Meer geschlafen. Das Team hat einen sanften Plan erstellt und nie gehetzt. Es fühlte sich an wie ein privater Hotelflügel — nicht wie ein Klinikflur.",
      "rinu1-quote-by": "— Gast, RINU Medspa Besuch",
      "rinu1-services-kicker": "Signature Fokus",
      "rinu1-services-title":
        "Nehmen Sie sich eine Stunde nur für sich, ohne das Hotel zu verlassen.",
      "rinu1-services-copy":
        "RINU Medspa bringt fortschrittliche ästhetische und Wellness-Behandlungen in Ihren Aufenthalt im Derand Hotel. Für Frauen und Männer, die sichtbare Ergebnisse ohne Ausfallzeit wünschen.",
      "rinu1-qa-q1": "Was erwartet mich bei meinem ersten Besuch?",
      "rinu1-qa-a1":
        "Jede Behandlung bei RINU beginnt mit einer Beratung unter Leitung von Dr. Diellza Mustafa. Wir nehmen uns Zeit, Ihre Haut, Ihren Körper und Ihre Ziele zu verstehen und führen Sie zu den Behandlungen, die wirklich zu Ihnen passen.<br /><br />Beratungen sind kostenlos.",
      "rinu1-qa-q2": "Was kann ich während meines Aufenthalts bei RINU machen?",
      "rinu1-qa-a2":
        "<ul class='rinu1-qa-services'><li>Signature Massage-Rituale</li><li>Lifting und Frische für das Gesicht</li><li>Biologique Recherche Facials</li><li>Verbesserung von Hautqualität und Glow</li><li>EXOMIND Stress-Reset Sessions</li><li>Körpertonus und Cellulite-Verfeinerung</li><li>Laser-Haarentfernung und Grooming</li><li>Professionelle Maniküre und Pediküre</li></ul>",
      "rinu1-qa-q3": "Massage-Rituale",
      "rinu1-qa-a3":
        "- RINU Ritual - St. Barth ChillOut - Deep Tissue - Gesicht &amp; Dekolleté<br />- Aromatherapie - Cupping - Hot Stone",
      "rinu1-qa-q4": "Für Frauen und Männer",
      "rinu1-qa-a4":
        "Jede Behandlung wird an Ihre Bedürfnisse angepasst — ob Sie entspannen, auffrischen oder verfeinern möchten.",
      "rinu1-qa-q5": "Reset für Ihren Geist mit EXOMIND",
      "rinu1-qa-a5":
        "Eine nicht-invasive Behandlung zur Wiederherstellung der mentalen Balance, Verbesserung des Fokus und Unterstützung besseren Schlafs bei gleichzeitiger Reduktion von Stress und Angst. Durch fortschrittliche Magnetstimulation wirkt sie direkt auf die Gehirnaktivität und bringt Klarheit, Ruhe und ein Gefühl von Reset.<br /><br />Ideal während Reisen oder intensiven Phasen, wenn Ihr Geist entschleunigen und sich neu ausrichten soll.<br /><br />30 Minuten. Keine Ausfallzeit.",
      "rinu1-qa-q6": "Behandlungszeit &amp; Ausfallzeit",
      "rinu1-qa-a6":
        "Behandlungszeit: 15 bis 60 Minuten je nach Behandlung.<br />Ausfallzeit: Minimal bis keine. Sie können sofort mit Ihrem Tag weitermachen.",
      "rinu1-qa-q7": "Wer führt die Behandlungen durch?",
      "rinu1-qa-a7":
        "Ärzte sowie medizinisch und ästhetisch geschulte Fachkräfte.",
      "rinu1-qa-q8": "Termine",
      "rinu1-qa-a8":
        "Eine Buchung wird empfohlen. Spontane Beratungen sind willkommen.",
      "rinu1-qa-q9": "Standort",
      "rinu1-qa-a9":
        "Etage -1, Derand Hotel<br />Erreichbar per Aufzug oder Treppe.",
      "rinu1-visit-title": "Bereit, wenn Sie es sind",
      "rinu1-visit-sub":
        "Teilen Sie uns Ihre bevorzugten Daten mit — wir kümmern uns um alle Details und senden Ihnen die Vorbereitungshinweise für Ihren Termin.",
      "rinu1-visit-cta": "Beratung buchen",
      "rinu1-visit-directions": "Wegbeschreibung zum Derand Hotel",
      "onze-trust-copy":
        "Das revolutionÃ¤re Studio fÃ¼r Wellness, Recovery und Physiotherapie.",
      "onze-faq-q1": "Welche Behandlungen bietet ONZE an?",
      "onze-faq-a1":
        "ONZE bietet diese Behandlungen an: Rotlichttherapie, Kryotherapie und Massagen.",
      "onze-solutions-title": "Umfassende Recovery-LÃ¶sungen",
      "onze-solutions-copy":
        "ONZE ist ein Wellness-, Recovery- und Physiotherapie-Studio im Herzen von Prishtina. Wir konzentrieren uns darauf, Leistung, SchÃ¶nheit und Gesundheit durch nicht-invasive, natÃ¼rliche Behandlungen zu verbessern, die die kÃ¶rpereigenen Prozesse nutzen.",
      "onze-card-1-title": "Recovery-Behandlungen",
      "onze-card-2-title": "Performance-Therapie",
      "onze-card-3-title": "Wellness-Beratung",
      "onze-view-treatment": "Behandlung ansehen",
      "onzeform-kicker": "ONZE Buchung",
      "onzeform-title": "Reservieren Sie Ihre ONZE Session",
      "onzeform-sub":
        "FÃ¼llen Sie das Formular aus, und unser Team bestÃ¤tigt Ihre gewÃ¼nschte Session in KÃ¼rze.",
      "onzeform-first-name-label": "Vorname",
      "onzeform-first-name-ph": "Vorname",
      "onzeform-last-name-label": "Nachname",
      "onzeform-last-name-ph": "Nachname",
      "onzeform-email-label": "E-Mail-Adresse",
      "onzeform-email-ph": "z. B. name@email.com",
      "onzeform-datetime-label": "Bevorzugtes Datum & Uhrzeit",
      "onzeform-submit": "Session BestÃ¤tigen",
      "noyaform-kicker": "Noya Reservierung",
      "noyaform-title": "Reservieren Sie Ihren Tisch",
      "noyaform-sub":
        "FÃ¼llen Sie das Formular aus, und unser Team bestÃ¤tigt Ihre Tischreservierung in KÃ¼rze.",
      "noyaform-first-name-label": "Vorname",
      "noyaform-first-name-ph": "Vorname",
      "noyaform-last-name-label": "Nachname",
      "noyaform-last-name-ph": "Nachname",
      "noyaform-email-label": "E-Mail-Adresse",
      "noyaform-email-ph": "E-Mail-Adresse",
      "noyaform-datetime-label": "Bevorzugtes Datum & Uhrzeit",
      "noyaform-submit": "Tisch BestÃ¤tigen",
      "noya-reserve-phone-ph": "Telefonnummer",
      "noya-book-title": "Einen Tisch Reservieren",
      "noya-book-label-1": "AtmosphÃ¤re",
      "noya-book-value-1": "Rooftop Dining",
      "noya-book-label-2": "Service",
      "noya-book-value-2": "Tischreservierung",
      "noya-book-label-3": "Antwort",
      "noya-book-value-3": "Schnelle BestÃ¤tigung",
      "noya-book-cta": "Tisch reservieren",
      "noya-explore-title": "Noya Entdecken",
      "noya-explore-copy":
        "WÃ¤hlen Sie Ihr Erlebnis und wechseln Sie direkt in die AtmosphÃ¤re, die Sie heute Abend wÃ¼nschen.",
      "noya-explore-card-1-title": "Zum Restaurant",
      "noya-explore-card-1-copy":
        "Feine Gerichte, eleganter Service und ein warmes, charakteristisches Ambiente.",
      "noya-explore-card-2-title": "Zur Cocktailbar",
      "noya-explore-card-2-copy":
        "Klassische und moderne Cocktailkreationen mit kuratierter Abendstimmung.",
      "noya-explore-open": "Ã–ffnen",
      "noya-restaurant-title": "Noya Restaurant",
      "noya-restaurant-sub":
        "Entdecken Sie die Restaurant-AtmosphÃ¤re durch die neuesten NOYA-Fotos.",
      "noya-cocktails-title": "Noya Cocktails",
      "noya-cocktails-sub":
        "Entdecken Sie die Bar- und Cocktail-AtmosphÃ¤re durch die neuesten NOYA-Fotos.",
      "main-page-title": "Vorlagenhinweis",
      "main-page-copy":
        "Diese Platzhalterseite ist aktiv und verwendet globale Ãœbersetzungssteuerungen.",
      "room-details-title": "Zimmerdetails",
      "room-details-copy":
        "Die Inhalte zu den Zimmerdetails werden vorbereitet. Bitte schauen Sie bald wieder vorbei.",
      "rinu-review-1":
        "Meine Erfahrung bei RINU mit Exomind &amp; EMSCULPT war wirklich sehr gut. Man merkt sofort, dass hier mit hochwertiger Technologie gearbeitet wird und das Team genau weiÃŸ, was es tut. Saubere, ruhige Umgebung und ein professionelles Team. Sehr empfehlenswert.",
      "rinu-review-2":
        "Schon beim Eintreten wirkt die Klinik einladend, modern und sehr gut organisiert. Das Team ist Ã¤uÃŸerst professionell, kompetent und aufmerksam, und man spÃ¼rt den hohen QualitÃ¤tsanspruch in jedem Detail. Absolute Empfehlung â€“ 5 Sterne!",
      "rinu-review-3":
        "Ich hatte eine groÃŸartige Erfahrung im Rinu Med Spa. Die AtmosphÃ¤re ist fantastisch, der Ort wirkt sehr professionell und einladend, und ich habe den Relax-Raum nach der Behandlung geliebt. Alles ist durchdacht und bestens organisiert. Sehr empfehlenswert!",
      "rinu-review-4":
        "Dieser Ort ist unglaublich. Sofortige Ruhe, sobald man hereinkommt. Ich habe CO2-Laser und ExoMind gemacht, und das ganze Team war nicht nur super professionell, sondern auch herzlich. Ich strahle schon jetzt â€“ auÃŸen und innen.",
      "rinu-review-5":
        "Ein auÃŸergewÃ¶hnliches Luxus-Spa-Erlebnis von Anfang bis Ende. Die AtmosphÃ¤re ist ruhig und wunderschÃ¶n gestaltet, das Team aufmerksam und sehr kompetent, und jedes Detail wirkt durchdacht und hochwertig. Meine Behandlung war tief entspannend und perfekt auf mich abgestimmt.",
      "rinu-review-6":
        "RINU â€“ ein wirklich einzigartiger Ort in Prishtina. Es fÃ¼hlt sich an wie in einer Weltmetropole mit einem echten 5â€‘Sterneâ€‘Erlebnis. Modernste Technologie, kombiniert mit einem professionellen, warmen und einladenden Team. Der ideale Ort fÃ¼r Wellness und Selfâ€‘Care von A bis Z.",
      "best-hero-title": "Die RINU Experience: Wissenschaft trifft Ruhe",
      "best-hero-sub": "Ein neuer Standard Ã¤sthetischer Exzellenz",
      "best-hero-intro":
        "Im RINU MEDSPA innerhalb des prestigetrÃ¤chtigen Derand Hotels verbinden wir modernste Medizintechnik mit Boutiqueâ€‘Luxus zu einem transformativen Erlebnis fÃ¼r Haut und KÃ¶rper.",
      "best-sec1-title":
        "1. Fortschrittliche GesichtsverjÃ¼ngung & Hautgesundheit",
      "best-sec1-item1-title": "Alma Hybrid & CO2 Resurfacing",
      "best-sec1-item1-copy":
        "Die ultimative LÃ¶sung fÃ¼r Hautstruktur, Narben und tiefe VerjÃ¼ngung. CO2â€‘ und 1570â€‘nmâ€‘Laser stimulieren Kollagen und erneuern die Haut mit minimaler Ausfallzeit.",
      "best-sec1-item2-title": "Microneedling & Spezialisierte Facials",
      "best-sec1-item2-copy":
        "Medizinisches Microneedling erzeugt kontrollierte MikrokanÃ¤le und wird mit personalisierten Facials fÃ¼r Hydration, Akne oder Antiâ€‘Aging kombiniert.",
      "best-sec1-item3-title": "Dermaplaning",
      "best-sec1-item3-copy":
        "PrÃ¤zise Exfoliation, die HautschÃ¼ppchen und Flaum entfernt und die Haut seidig glatt macht.",
      "best-sec2-title":
        "2. Die Zukunft des Liftings ohne Nadeln: EMFACE & AxoMind",
      "best-sec2-item1-title": "EMFACE",
      "best-sec2-item1-copy":
        "Die erste nadelfreie Behandlung, die Gesichtshaut und Muskeln gleichzeitig behandelt. Synchronized RF & HIFESâ„¢ reduzieren Falten und liften natÃ¼rlich.",
      "best-sec2-item2-title": "AxoMind",
      "best-sec2-item2-copy":
        "NeuromuskulÃ¤re Stimulierung fÃ¼r mehr Muskeltonus und Definition â€“ konturierte, jugendliche ZÃ¼ge.",
      "best-sec3-title": "3. KÃ¶rpersculpting & Professionelles Contouring",
      "best-sec3-item1-title": "EMSCULPT & EMFUSION",
      "best-sec3-item1-copy":
        "Hochintensive elektromagnetische Impulse erzeugen tausende Kontraktionen, straffen Muskeln und reduzieren Fett.",
      "best-sec3-item2-title": "Body Contouring",
      "best-sec3-item2-copy":
        "Personalisierte Protokolle straffen die Haut und reduzieren hartnÃ¤ckige Fettpolster, maÃŸgeschneidert auf Ihre Silhouette.",
      "best-sec4-title": "4. TÃ¤gliche Eleganz & Regeneration",
      "best-sec4-item1-title": "PrÃ¤zise Laserâ€‘Haarentfernung",
      "best-sec4-item1-copy":
        "Moderne Systeme, sicher fÃ¼r alle Hauttypen, sorgen fÃ¼r langanhaltende, glatte Ergebnisse.",
      "best-sec4-item2-title": "Wimpernâ€‘Services",
      "best-sec4-item2-copy":
        "Von natÃ¼rlichen Lifts bis zu voluminÃ¶sen Extensions â€“ perfekt auf Ihre Augen abgestimmt.",
      "best-sec4-item3-title": "Therapeutische Massage",
      "best-sec4-item3-copy":
        "Entspannt, fÃ¶rdert den Lymphfluss und rundet Highâ€‘Techâ€‘Behandlungen wohltuend ab.",
      "best-why-title": "Warum RINU im Derand Hotel?",
      "best-why-quote":
        "Wir glauben nicht an EinheitslÃ¶sungen. Jede:r Gast erhÃ¤lt eine maÃŸgeschneiderte Aesthetic Map â€“ Analyse von Hauttyp, Muskelstruktur und Zielen, damit jede Einstellung perfekt kalibriert ist.",
      "fc-hero-title": "Ihre Reise beginnt hier",
      "fc-hero-sub": "Individuelle Beratung mit Dr. Diellza",
      "fc-hero-intro":
        "Wir glauben, dass die schÃ¶nsten Ergebnisse aus einem tiefen VerstÃ¤ndnis Ihrer Anatomie entstehen. Die Beratung ist eine professionelle Partnerschaft fÃ¼r prÃ¤zise, sichere und natÃ¼rlichâ€‘luxuriÃ¶se Resultate.",
      "fc-sec1-title": "1. Professionelle Hautâ€‘ & Gesichtsâ€‘Analyse",
      "fc-sec1-intro": "Jedes Gesicht erzÃ¤hlt eine Geschichte.",
      "fc-sec1-item1-title": "Advanced Mapping",
      "fc-sec1-item1-copy":
        "Strukturanalyse von HautqualitÃ¤t, Muskelbewegung und Symmetrie.",
      "fc-sec1-item2-title": "Die â€žWissenschaft des Alternsâ€œ",
      "fc-sec1-item2-copy":
        "Verstehen Sie Ursachen wie Volumenverlust, Kollagenabbau und UmwelteinflÃ¼sse.",
      "fc-sec2-title": "2. Ihr personalisierter Ã„sthetikâ€‘Fahrplan",
      "fc-sec2-intro": "Keine Trends â€“ sondern Harmonie.",
      "fc-sec2-item1-title": "Individuelle BehandlungsplÃ¤ne",
      "fc-sec2-item1-copy":
        "Ob EMFACE, Alma Hybrid oder Body Contouring â€“ wir planen Schritt fÃ¼r Schritt passend zu Haut und Lifestyle.",
      "fc-sec2-item2-title": "Realistische Erwartungen",
      "fc-sec2-item2-copy":
        "Transparenz zu Wirkweise, Ausfallzeit und Pflege fÃ¼r nachhaltige Eleganz.",
      "fc-sec3-title": "3. Private, hochwertige Umgebung",
      "fc-sec3-item1-title": "Individuelle Betreuung",
      "fc-sec3-item1-copy":
        "Zeit nur fÃ¼r Sie â€“ Fragen klÃ¤ren, Optionen besprechen, entspannt und ohne Druck.",
      "fc-sec3-item2-title": "Ganzheitliche Integration",
      "fc-sec3-item2-copy":
        "Highâ€‘Techâ€‘Behandlungen kombiniert mit erholsamen Ritualen.",
      "fc-meet-title": "Lernen Sie die Expertin kennen",
      "fc-meet-quote":
        "â€žMeine Philosophie ist â€˜Invisible Enhancementâ€™. Ich mÃ¶chte nicht verÃ¤ndern, sondern Ihre erholte, vitale Version hervorbringen.â€œ â€” Dr. Diellza",
      "fc-prepare-title": "So bereiten Sie sich vor",
      "fc-prepare-1": "Bringen Sie Ihre aktuelle Routine mit.",
      "fc-prepare-2": "Denken Sie Ã¼ber Ihr â€žWarumâ€œ nach.",
      "fc-prepare-3": "Kein Druck â€“ rein informativ.",
      "nav-rooms": "ZIMMER & SUITEN",
      "nav-room-1": "JUNIOR SUITE",
      "nav-room-2": "DELUXE DOPPELZIMMER",
      "nav-room-3": "SUPERIOR ZWEIBETTZIMMER",
      "nav-room-4": "PREMIUM DOPPELZIMMER",
      "nav-room-5": "SUPERIOR DOPPELZIMMER",
      "nav-restaurant": "RESTAURANT & BAR",
      "nav-restaurant-1": "NOYA",
      "nav-restaurant-2": "OMMA Café & Buffet",
      "omma-hero-left": "Derand Hotel",
      "omma-hero-middle": "Kommt bald",
      "omma-hero-year": "2026",
      "omma-hero-title": "OMMA<br />Cafe &amp; BUFFET",
      "omma-intro-title": "Ein zeitgenössisches Genussritual",
      "omma-intro-copy-1":
        "Bald öffnen wir unsere Türen für Hotelgäste und die Öffentlichkeit – ein raffinierter Ort für Kaffee und ein üppiges Frühstücksbuffet im Ambiente des Derand Hotel.",
      "omma-intro-copy-2":
        "Ob zu einem ruhigen Morgenkaffee oder einem lebendigen Frühstückstreffen: OMMA verbindet eine raffinierte und zugleich einladende Atmosphäre. Offen für Hotelgäste und externe Gäste laden wir Sie ein, unser minimalistisches Refugium zu betreten und den Tag mit hochwertigen Zutaten und hervorragendem Service zu beginnen.",
      "omma-intro-lower-copy-1":
        "DAS KONZEPT DREHT SICH UM KONTRAST UND HARMONIE - POLIERTER STEIN TRIFFT AUF SANFTES AMBIENTELICHT, DUNKELER MARMOR AUF WARMES HOLZ UND SKULPTURALE LICHTELEMENTE UNTER ORGANISCHEN DECKENFORMEN.",
      "omma-intro-lower-copy-2":
        "DER REZEPTIONSBEREICH IST DAS VISUELLE UND EMOTIONALE ZENTRUM DES HOTELS. EIN MARKANTER ROT GEADERTER MARMORTRESEN WIRD VON UNTEN BELEUCHTET UND ERZEUGT EINEN SCHWEBENDEN EFFEKT, DER SOFORT AUFFAELLT.",
      "omma-services-copy-1":
        "DERAND HOTEL IST EIN ZEITGENOESSISCHES LUXUS-HOSPITALITY-PROJEKT, DAS DURCH STARKE MATERIALITAET, FEINE HANDWERKSKUNST UND EIN WARMES, IMMERSIVES RAUMERLEBNIS DEFINIERT WIRD.",
      "omma-services-copy-2":
        "DAS DESIGN VERBINDET MODERNE ELEGANZ MIT REICHEN NATUERLICHEN TEXTUREN UND SCHAFFT SO EINE RAFFINIERTE UND DENNOCH EINLADENDE ATMOSPHAERE.",
      "omma-services-copy-3":
        "DIE INNENRAUMPALETTE WIRD VON ERDIGEN BRAUNTOENEN, BRONZE-AKZENTEN UND NATUERLICHEN STEINOBERFLAECHEN GEPRAEGT, WAS EIN GEFUEHL ZEITLOSEN LUXUS VERSTAERKT.",
      "omma-services-copy-4":
        "VERTIKALE HOLZWANDELEMENTE UND GESCHICHTETE TEXTUREN SCHAFFEN RHYTHMUS UND TIEFE, WAEHREND GROSSE FENSTER DAS NATUERLICHE LICHT DEN GANZEN TAG UEBER WIRKUNGSVOLL MIT DEN MATERIALIEN SPIELEN LASSEN.",
      "omma-intro-extra-copy-1":
        "DAS DESIGN UND DIE PHILOSOPHIE DES OMMA CAFE &amp; BUFFET SPIEGELN DIE RAFFINIERTE ESSENZ DES DERAND HOTELS WIDER, IN DEM JEDES DETAIL EINE STUDIE DES KONTRASTS IST.",
      "omma-intro-extra-copy-2":
        "DIREKT NEBEN UNSERER IKONISCHEN REZEPTION - WO DER LEUCHTENDE, ROT GEADERTE MARMOR EINEN TON DER EXKLUSIVITAET SETZT - SETZT OMMA DIESE VISUELLE ERZAEHLUNG IN DER KULINARIK FORT.",
      "omma-collage-left":
        "Lasst uns<br />eure einzigartige<br />Dining-Story gestalten",
      "omma-collage-right":
        "Und entdeckt,<br />wie OMMA jeden<br />Moment rahmen kann",
      "omma-photo-1-alt": "OMMA Foto 1",
      "omma-photo-2-alt": "OMMA Foto 2",
      "omma-photo-3-alt": "OMMA Foto 3",
      "omma-services-img-1-alt": "Konzept Innenarchitektur",
      "omma-services-img-2-alt": "Konzept Renovierung",
      "omma-services-img-3-alt": "Konzept Materialauswahl",
      "omma-services-img-4-alt": "Konzept Lichtgestaltung",
      "omma-services-img-5-alt": "Breites Lichtgestaltungskonzept",
      "omma-collage-img-1-alt": "OMMA Atmosphaere",
      "omma-collage-img-2-alt": "OMMA Innenraumdetail",
      "omma-collage-img-3-alt": "OMMA Abendstimmung",
      "omma-lightbox-close": "Bildansicht schließen",
      "omma-lightbox-img-alt": "Vergrößertes OMMA-Bild",
      "omma-zoom-image": "Bild vergrößern",
      "omma-intro-btn": "Kontakt",
      "nav-activities": "AKTIVITÄTEN",
      "nav-activity-1": "ONZE RECOVERY",
      "nav-activity-2": "RINU MEDSPA",
      "nav-inquiry": "KONTAKT",
      "nav-contact-us": "KONTAKTIEREN SIE UNS",
      "nav-faqs": "FAQ",
      "nav-activity-3": "NOYA NIGHTLIFE",
      "nav-specials": "ANGEBOTE & AKTIONEN",
      "nav-special-1": "DIE KOLLEKTION",
      "nav-special-2": "ROMANTIK IN DEN WOLKEN",
      "nav-special-3": "ONZE RECOVERY – Aufenthalt",
      "nav-special-4": "DER RINU-SCHÖNHEITSGLANZ",
      "nav-special-5": "GESCHENKGUTSCHEINE",
      "nav-contact": "KONTAKT",
      "nav-contact-1": "FAQ",
      "book-now": "Jetzt Buchen",
      "hero-kicker": "ZIMMER & SUITEN",
      "hero-title": "Zimmer im Derand Hotel Prishtina",
      "categories-kicker": "UNSERE EXQUISITEN ZIMMERKATEGORIEN",
      "categories-intro": "Ich suche nach",
      "categories-trigger": "allen Zimmern & Suiten",
      "categories-item-1": "Junior Suite",
      "categories-item-2": "Superior Doppelzimmer",
      "categories-item-3": "Deluxe Doppelzimmer",
      "categories-item-4": "Premium Doppelzimmer",
      "categories-item-5": "Zweibettzimmer",
      "card-badge-1": "ERSTKLASSIGER KOMFORT",
      "card-badge-2": "OHNE GLEICHEN",
      "card-badge-3": "LUXUS DER SPITZENKLASSE",
      "card-badge-4": "ZEITLOSE ELEGANZ",
      "card-badge-5": "ERSTKLASSIGER KOMFORT",
      "card-name-1": "Junior Suite",
      "card-name-2": "Deluxe Doppelzimmer",
      "card-name-3": "Superior Zweibettzimmer",
      "card-name-4": "Premium Doppelzimmer",
      "card-name-5": "Superior Doppelzimmer",
      "about-eyebrow": "Derand Hotel",
      "about-title": "EINE HERVORRAGENDE AUSWAHL AN ZIMMERN UND SUITEN",
      "about-copy-1":
        "Im lebendigen Herzen von Prishtina bietet das Derand Hotel eine kuratierte Auswahl an Unterkuenften, die als Ihr Rueckzugsort gestaltet sind - dort, wo Tradition auf modernen Luxus trifft.",
      "about-copy-2":
        "Ob Geschaeftsreise oder kulturelle Auszeit - unsere Zimmer, von intimen Superior-Kategorien bis zu grosszuegigen Deluxe- und Premium-Optionen, bieten eine harmonische Balance aus Stil, Komfort und ruhiger Eleganz.",
      "signature-text":
        "Die Derand-Signatur zieht sich durch alle Zimmerkategorien und garantiert ein hoechstes Gefuehl von Wohlbefinden und Luxus - ganz gleich, wofuer Sie sich entscheiden.",
      "owner-title": "GENERALDIREKTOR",
      "showcase-1-subtitle": "ERHABENES WOHLBEFINDEN",
      "showcase-1-title": "DELUXE ZIMMER & <br />JUNIOR SUITEN",
      "showcase-1-description":
        "GenieÃŸen Sie luxuriÃ¶sen Wohnkomfort in einem eleganten Ambiente und entspannen Sie stilvoll im Herzen der Stadt.",
      "showcase-2-subtitle": "EXTRAVAGANTER WOHNKOMFORT",
      "showcase-2-title": "Premium- & Twin-Suiten",
      "showcase-2-description":
        "Residieren Sie stilvoll und elegant im Herzen von Prishtina und machen Sie Ihren Aufenthalt im Derand Hotel zu einem unvergesslichen Erlebnis.",
      "guest-app-hero-title":
        "Entdecken Sie alles, was Sie brauchen, mit der maßgeschneiderten Guest App von Derand.",
      "guest-app-hero-copy":
        "Ihre Reise beginnt hier: Entdecken, buchen und genießen Sie einen reibungslosen Aufenthalt – erleben Sie die Stadt wie nirgendwo sonst.",
      "guest-app-badge-app-small": "Jetzt laden im",
      "guest-app-badge-app-big": "App Store",
      "guest-app-badge-play-small": "JETZT BEI",
      "guest-app-badge-play-big": "Google Play",
      "guest-app-featured-heading": "Hervorgehobene Funktionen der Guest App",
      "guest-app-featured-title":
        "Entdecken Sie unsere exklusiven Funktionen fÃ¼r eine <span>nahtlose Reise</span>",
      "guest-app-card-1-title":
        "Eine Auswahl der besten Bars und Restaurants direkt in Ihren Händen",
      "guest-app-card-2-title":
        "Alles aus einer Hand während Ihres Aufenthalts im Derand",
      "guest-app-card-3-title": "Einfache Einrichtung Ihres Kontos",
      "guest-app-card-4-title":
        "Einen Tisch zu reservieren war noch nie so einfach",
      "guest-app-about-title": "Über die Guest App",
      "guest-app-about-copy":
        "Wir setzen uns dafür ein, den Aufenthalt der Gäste zu vereinfachen und das Erleben der Stadt oder des Landes zu verbessern. Die App hilft Gästen dabei, interessante Orte zu entdecken – von den besten Restaurants bis hin zu den wichtigsten Sehenswürdigkeiten.",
      "guest-app-stats-registered-label": "Registrierte Gäste",
      "guest-app-stats-tables-label": "Reservierte Tische",
      "guest-app-stats-rating-label": "App-Store-Bewertung",
      "junior-hero-title": "Junior Suite in Prishtina",
      "junior-hero-brand": "Derand Hotel",
      "junior-kicker": "Pure Exzellenz",
      "junior-headline": "Junior Suite",
      "junior-preview-copy":
        "Grosszuegige Junior Suiten bieten den Komfort und die hochwertige Ausstattung, die Sie von einem Fuenf-Sterne-Hotel erwarten: raffinierter Wohnraum, elegante Marmorbadezimmer und durchdachte Details. Die Suiten umfassen in der Regel etwa 35 bis 45 Quadratmeter und bieten eine ruhige Atmosphaere sowie Blick auf die Stadt.",
      "junior-size-value": "35m²",
      "junior-size-label": "GrÃ¶ÃŸe",
      "junior-bed-value": "Kingsize",
      "junior-bed-label": "Bett",
      "junior-concierge-value": "24 h",
      "junior-concierge-label": "Concierge-Service",
      "junior-parking-value": "24/7 Parken",
      "junior-parking-label": "Kostenlos",
      "junior-water-value": "Wasser",
      "junior-water-label": "Kostenlos",
      "junior-director-quote":
        "Unsere Junior Suiten setzen einen neuen Massstab fuer Luxus und Wohlbefinden und verbinden grosszuegigen Komfort mit zeitloser Eleganz.",
      "junior-bath-note":
        "Grosszuegige Proportionen und durchdachte Details verleihen unseren Junior Suiten eine ruhige, wohnliche Atmosphaere. Warmes Licht und Marmorelemente im Bad schaffen eine spaartige Auszeit.",
      "junior-director-name": "Derand Hotel PRISHTINA",
      "junior-director-role": "GENERALDIREKTOR",
      "culinary-kicker": "Essen und trinken mit Stil",
      "culinary-title-line-1": "Die feinsten kulinarischen",
      "culinary-title-line-2": "Erlebnisse",
      "learn-more": "MEHR ERFAHREN",
      "careers-hero-kicker": "Karriere bei Derand",
      "careers-hero-title": "Arbeiten Sie mit uns",
      "careers-hero-sub":
        "Entdecken Sie aktuelle Stellen oder senden Sie uns eine Initiativbewerbung. Auch wenn heute keine passende Stelle verfÃ¼gbar ist, prÃ¼fen wir Ihren Lebenslauf fÃ¼r zukÃ¼nftige MÃ¶glichkeiten.",
      "careers-open-application-title": "Initiativbewerbung",
      "careers-open-application-copy":
        "Senden Sie Ihr Profil direkt an unser HRâ€‘Team. Starke Kandidaten behalten wir fÃ¼r kommende Positionen im Blick.",
      "careers-preferred-position-label": "Bevorzugte Position",
      "careers-preferred-position-placeholder": "z. B. Rezeptionist/in",
      "careers-preferred-department-label": "Bevorzugte Abteilung",
      "careers-preferred-department-placeholder":
        "Abteilung auswÃ¤hlen oder eingeben",
      "careers-dept-housekeeping": "Housekeeping",
      "careers-dept-housekeeping-mgmt": "Housekeepingâ€‘Leitung",
      "careers-dept-reception": "Rezeption / Front Office",
      "careers-dept-security": "Sicherheit",
      "careers-dept-procurement": "Einkauf & Logistik",
      "careers-dept-bell": "GepÃ¤ckservice",
      "careers-dept-sales": "Vertrieb",
      "careers-dept-architecture": "Architektur",
      "careers-dept-social": "Social Media",
      "careers-dept-it": "IT",
      "careers-dept-finance": "Finanzen",
      "careers-dept-uiux": "UI/UX Design",
      "careers-dept-management": "Management",
      "careers-dept-other": "Sonstiges",
      "careers-submit-cv": "Bewerbung senden",
      "careers-current-positions-title": "Aktuelle offene Stellen",
      "careers-company-name": "Derand Hotel Prishtina",
      "careers-job-1-title": "Housekeeping-Mitarbeiter/in",
      "careers-job-1-detail": "Art: Vollzeit | Position: Operativer Bereich",
      "careers-job-2-title": "Housekeeping-Manager/in",
      "careers-job-2-detail": "Art: Vollzeit | Position: Management",
      "careers-job-3-title": "Rezeptionist/in",
      "careers-job-3-detail": "Art: Vollzeit | Position: Front Office",
      "careers-job-4-title": "Sicherheit",
      "careers-job-4-detail": "Art: Vollzeit | Position: Sicherheit",
      "careers-job-5-title": "Sicherheitsmanager/in",
      "careers-job-5-detail": "Art: Vollzeit | Position: Sicherheitsmanagement",
      "careers-job-6-title": "Bellboy",
      "careers-job-6-detail": "Art: Vollzeit | Position: Gästeservice",
      "careers-job-7-title": "Vertrieb",
      "careers-job-7-detail": "Art: Vollzeit | Position: Vertrieb",
      "careers-job-8-title": "Architekt/in",
      "careers-job-8-detail": "Art: Vollzeit | Position: Architektur",
      "careers-job-9-title": "Social Media Marketing",
      "careers-job-9-detail": "Art: Vollzeit | Position: Marketing",
      "careers-job-10-title": "IT-Spezialist/in",
      "careers-job-10-detail": "Art: Vollzeit | Position: IT",
      "careers-job-11-title": "Einkauf / Logistik",
      "careers-job-11-detail": "Art: Vollzeit | Position: Operativer Bereich",
      "careers-job-12-title": "Finanzsachbearbeiter/in",
      "careers-job-12-detail": "Art: Vollzeit | Position: Finanzen",
      "careers-job-13-title": "UI/UX-Designer/in",
      "careers-job-13-detail": "Art: Vollzeit | Position: Design",
      "apply-title": "Initiativbewerbung",
      "apply-sub":
        "Senden Sie Ihren Lebenslauf und Ihr Profil an unser HRâ€‘Team. Wir prÃ¼fen Bewerbungen fÃ¼r aktuelle und zukÃ¼nftige Rollen.",
      "apply-first-name-label": "Vorname*",
      "apply-first-name-ph": "Vorname*",
      "apply-last-name-label": "Nachname*",
      "apply-last-name-ph": "Nachname*",
      "apply-email-label": "Eâ€‘Mail*",
      "apply-email-ph": "Eâ€‘Mail*",
      "apply-phone-label": "Telefon*",
      "apply-phone-ph": "Telefon*",
      "apply-preferred-position-label": "Bevorzugte Position*",
      "apply-preferred-position-ph": "z. B. Rezeptionist/in",
      "apply-department-label": "Abteilung*",
      "apply-dept-select": "Abteilung auswÃ¤hlen",
      "apply-message-label": "Kurze Nachricht*",
      "apply-message-ph": "Schreiben Sie eine kurze Nachricht",
      "apply-photo-label": "Foto*",
      "apply-resume-label": "Lebenslauf",
      "apply-upload-file": "Datei hochladen",
      "apply-max-size": "Max. 2 MB",
      "apply-consent-title": "Dateneinwilligung",
      "apply-consent-storage":
        "Ich stimme zu, dass meine Daten fÃ¼r Bewerbungszwecke gespeichert werden.",
      "apply-consent-privacy": "Ich stimme der DatenschutzerklÃ¤rung zu.",
      "apply-cancel": "Abbrechen",
      "apply-submit": "Bewerbung senden",
      "apply-success-title": "Bewerbung erfolgreich eingereicht.",
      "apply-success-text":
        "Vielen Dank. Ihre Bewerbung ist bei uns eingegangen.",
      "rooms-offer-quote":
        "Besuchen Sie uns im Herzen von Prishtina und erleben Sie eine Reise, in der die bewegte Vergangenheit und die lebendige Gegenwart der Stadt in jedem Detail aufscheinen.",
      "footer-powered": "Bereitgestellt von",
      "newsletter-title": "Werden Sie Teil unserer Welt",
      "newsletter-copy":
        "Erhalten Sie ausgewählte Geschichten, saisonale Angebote und persönliche Einladungen.",
      "newsletter-first-name": "VORNAME",
      "newsletter-last-name": "NACHNAME",
      "newsletter-email": "E-MAIL-ADRESSE",
      "newsletter-agree": "Ich stimme den AGB und der Datenschutzerklärung zu.",
      "newsletter-button": "ANMELDEN",
      "contact-breadcrumb-title": "Kontakt",
      "contact-kicker": "Derand Hotel",
      "contact-title": "Lassen Sie uns Ihren perfekten Aufenthalt gestalten",
      "contact-copy":
        "Senden Sie uns Ihre Nachricht und unser Team antwortet Ihnen schnell und aufmerksam.",
      "contact-arrival-kicker": "Kontakt & Anreise",
      "contact-arrival-title": "Kontakt und Anreise in Prishtina",
      "contact-arrival-subtitle": "Anreise zum Derand Hotel Prishtina",
      "contact-arrival-p1":
        "Das Derand Hotel liegt im Herzen der Stadt und ist mit allen wichtigen Verkehrsmitteln leicht erreichbar. Wenn Sie mit dem Auto anreisen, folgen Sie einfach den Schildern Richtung Zentrum von Prishtina.",
      "contact-arrival-p2":
        "Das Hotel ist vom internationalen Flughafen Prishtina per Taxi und privatem Transfer gut erreichbar. Unser Team unterstützt Sie gerne vor Ihrer Anreise mit Wegbeschreibung und Hinweisen.",
      "contact-showcase-title": "DIE FÜHRENDEN HOTELS",
      "contact-showcase-subtitle": "VON DERAND PRISHTINA",
      "contact-address-kicker": "Adresse",
      "contact-address-title": "Derand Hotel Prishtina",
      "contact-address-line": "Bekim Fehmiu Str. 30, Prishtina 10000 Kosovo",
      "contact-address-tel-label": "Tel.:",
      "contact-address-whatsapp-label": "Whatsapp:",
      "contact-address-whatsapp-open": "In der App öffnen",
      "contact-address-email-label": "E-Mail:",
      "contact-submit": "Nachricht senden",
      "contact-field-name": "Vollständiger Name",
      "contact-field-username": "Benutzername",
      "contact-field-email": "E-Mail-Adresse",
      "contact-field-subject": "Betreff",
      "contact-field-message": "Hinterlassen Sie Ihre Nachricht...",
      "footer-link-1": "Kontaktieren Sie uns",
      "footer-link-2": "Derand Geschichte",
      "footer-link-3": "Nutzungsbedingungen",
      "footer-link-4": "Derand Magazin",
      "footer-link-5": "Karriere",
      "footer-link-6": "FAQs",
      "footer-link-7": "Datenschutzrichtlinie",
      "footer-link-8": "Zahlungen",
      "footer-link-9": "Gäste-App",
      "footer-link-10": "Derand Magazin",
      "footer-link-11": "Unser Standort",
      "footer-guarantee-1": '<i class="fa fa-check"></i> Bestpreis-Garantie',
      "footer-guarantee-2":
        '<i class="fa fa-check"></i> Sonderpreise fÃ¼r Leaders Club Mitglieder',
      "footer-guarantee-3":
        '<i class="fa fa-check"></i> Flexible Buchungsbedingungen',
      "policy-breadcrumb-title": "Datenschutzrichtlinie",
      "policy-hero-label": "Datenschutzrichtlinie",
      "policy-hero-title":
        "Wir danken Ihnen für Ihren Besuch auf der Website des Derand Hotel!",
      "policy-sec-1": "I. Name und Anschrift des Verantwortlichen",
      "policy-sec-2": "II. Welche Informationen erfassen wir?",
      "policy-sec-3": "III. Warum erfassen wir Ihre Daten?",
      "policy-sec-4": "IV. Wie schützen wir Ihre Daten?",
      "policy-sec-5": "V. Reservierungs- und Zahlungsrichtlinie",
      "policy-sec-6": "VI. Ihre Rechte",
      "policy-sec-7": "VII. Wie lange speichern wir die Daten?",
      "policy-sec-8": "VIII. Kontakt",
      "policy-contact-btn": "Kontakt",
      "policy-p-lead":
        "Im Derand Hotel schätzen wir Ihr Vertrauen und verpflichten uns zum Schutz Ihrer personenbezogenen Daten. Diese Richtlinie erklärt, wie wir Ihre Daten während Ihres Aufenthalts oder bei der Nutzung unserer Dienste erheben, verwenden und sichern.",
      "policy-p-1-intro":
        "Im Sinne der Datenschutz-Grundverordnung, der nationalen Datenschutzgesetze der Mitgliedstaaten sowie weiterer datenschutzrechtlicher Vorschriften ist der Verantwortliche:",
      "policy-p-2-1":
        "Identifikationsdaten: Vorname, Nachname, Geburtsdatum und Ausweisdokument (ID oder Reisepass), wie es die lokalen Gesetze für die Registrierung von Gästen verlangen.",
      "policy-p-2-2":
        "Kontaktdaten: Telefonnummer, E-Mail-Adresse und Wohnadresse.",
      "policy-p-2-3":
        "Buchungs- und Zahlungsdaten: Kredit-/Debitkarteninformationen, Banküberweisungen und Aufenthaltshistorie.",
      "policy-p-3-1":
        "Bearbeitung von Reservierungen: Zur Bestätigung, Änderung oder Verwaltung Ihres Aufenthalts.",
      "policy-p-3-2":
        "Gesetzliche Verpflichtungen: Zur Meldung der Anwesenheit von Gästen an die zuständigen staatlichen Stellen gemäß den gesetzlichen Vorgaben im Tourismussektor.",
      "policy-p-3-3":
        "Personalisierung von Services: Um Zimmerpräferenzen, besondere Wünsche oder Concierge-Services bereitzustellen.",
      "policy-p-3-4":
        "Sicherheit: Nutzung von CCTV-Systemen in den öffentlichen Bereichen des Hotels zur Sicherheit von Gästen und Mitarbeitenden.",
      "policy-p-4-1":
        "Digitale Sicherheit: Ihre Daten werden auf sicheren Servern und in geschützten Verwaltungssystemen gespeichert.",
      "policy-p-4-2":
        "Eingeschränkter Zugriff: Nur autorisiertes Personal hat für strenge Geschäftszwecke Zugriff auf Ihre personenbezogenen Daten.",
      "policy-p-4-3":
        "Drittpartner: Wir arbeiten mit Buchungsplattformen zusammen (z. B. Booking.com oder Expedia). Wir stellen sicher, dass die Übermittlung Ihrer Daten an uns sicher erfolgt.",
      "policy-p-5-1":
        "Stornierungen: Derand Hotel verfolgt eine strenge Richtlinie: Reservierungen sind nicht stornierbar und Zahlungen sind nicht erstattungsfähig.",
      "policy-p-5-2":
        "Zahlungsmethoden: Wir akzeptieren Bargeld, Kreditkarten, virtuelle Karten und Banküberweisungen.",
      "policy-p-6-intro":
        "Gemäß der geltenden Gesetzgebung zum Schutz personenbezogener Daten haben Sie das Recht:",
      "policy-p-6-li-1":
        "Auskunft über die von uns über Sie gespeicherten Daten zu verlangen.",
      "policy-p-6-li-2":
        "Die Berichtigung unrichtiger Informationen zu verlangen.",
      "policy-p-6-li-3":
        "Die Löschung von Daten zu verlangen, außer in Fällen, in denen wir gesetzlich zur Aufbewahrung verpflichtet sind (z. B. für finanzielle Zwecke oder amtliche Unterlagen).",
      "policy-p-7-1":
        "Wir speichern Ihre Daten nur so lange, wie es zur Erfüllung der oben genannten Zwecke oder zur Einhaltung gesetzlicher, steuerlicher und administrativer Fristen erforderlich ist.",
      "policy-p-8-intro":
        "Wenn Sie Fragen haben oder Ihre Rechte ausüben möchten, kontaktieren Sie uns bitte:",
      "terms-breadcrumb-title": "Nutzungsbedingungen",
      "terms-hero-label": "Nutzungsbedingungen",
      "terms-hero-title": "Derand Hotel Prishtina",
      "terms-sec-2": "II. Annahme der Bedingungen",
      "terms-sec-3": "III. Reservierungs- und Zahlungsrichtlinie",
      "terms-sec-4": "IV. Aufenthaltsregeln (Check-in & Check-out)",
      "terms-sec-5": "V. Nutzung der Website",
      "terms-sec-6": "VI. Haftungsbeschränkung",
      "terms-sec-7": "VII. Geltendes Recht",
      "terms-sec-8": "VIII. Kontakt",
      "terms-p-lead":
        "Willkommen im Derand Hotel! Durch die Nutzung unserer Website, unserer Online-Dienste oder durch eine Reservierung stimmen Sie den folgenden Bedingungen zu:",
      "terms-p-2-1":
        "Durch den Zugriff auf unsere Website derandhotel.com oder durch eine Buchung stimmen Sie diesen Bedingungen vollständig zu. Wenn Sie mit einem Teil davon nicht einverstanden sind, stellen Sie die Nutzung unserer Plattform bitte ein.",
      "terms-p-3-1":
        "Buchungsmethode: Reservierungen können über unsere offizielle Website, autorisierte Online-Reiseagenturen (OTAs) oder direkt über das Hotel vorgenommen werden.",
      "terms-p-3-2":
        "Stornierungen und Rückerstattungen: Derand Hotel verfolgt eine strenge Richtlinie: alle Reservierungen sind nicht stornierbar und Zahlungen nicht erstattungsfähig.",
      "terms-p-3-3":
        "Zahlungsmethoden: Wir akzeptieren Bargeld, Kredit-/Debitkarten, virtuelle Karten und Banküberweisungen.",
      "terms-p-4-1":
        "Identifikation: Jeder Gast muss bei der Ankunft ein gültiges Ausweisdokument (ID oder Reisepass) vorlegen.",
      "terms-p-4-2":
        "Zeitplan: Check-in- und Check-out-Zeiten sind gemäß den Hotelvorschriften einzuhalten, um eine reibungslose Leistungserbringung sicherzustellen.",
      "terms-p-4-3":
        "Rauchen: Rauchen in geschlossenen Bereichen des Hotels ist streng verboten, außer in speziell ausgewiesenen Zonen.",
      "terms-p-5-1":
        "Persönliche Nutzung: Inhalte dieser Website (Texte, Fotos, Logos) sind Eigentum des Derand Hotel und nur für den persönlichen, nicht kommerziellen Gebrauch gestattet.",
      "terms-p-5-2":
        "Verbote: Das Kopieren, Verteilen oder Verändern von Inhalten ohne vorherige schriftliche Genehmigung ist streng untersagt.",
      "terms-p-5-3":
        "Sicherheit: Nutzer dürfen die Sicherheit der Website nicht beeinträchtigen oder versuchen, unbefugten Zugriff auf Daten zu erlangen.",
      "terms-p-6-1":
        "Derand Hotel haftet nicht für indirekte Schäden, die aus der Nutzung unserer Website oder möglichen technischen Unterbrechungen entstehen können.",
      "terms-p-6-2":
        "Wir garantieren nicht, dass die Informationen auf der Website jederzeit fehlerfrei sind, verpflichten uns jedoch, diese regelmäßig zu aktualisieren.",
      "terms-p-7-1":
        "Diese Bedingungen unterliegen den geltenden Gesetzen der Republik Kosovo. Für Streitigkeiten, die nicht einvernehmlich gelöst werden können, sind die zuständigen Gerichte in Pristina zuständig.",
      "terms-p-8-intro":
        "Wenn Sie Fragen haben oder Ihre Rechte ausüben möchten, kontaktieren Sie uns bitte:",
      "index-hero-title": "Ihr zweites Zuhause",
      "index-mozart-h3": "WARUM IST DAS DERAND HOTEL DIE BESTE WAHL?",
      "index-mozart-h4":
        "Moderne Infrastruktur und freundliches, einladendes Personal",
      "index-mozart-p":
        "Das Derand Hotel überzeugt mit einer hervorragenden Lage und einfachem Zugang <br />ins Stadtzentrum und darüber hinaus. <br />Als eines der höchsten Gebäude in Prishtina bietet es einen einzigartigen Blick über die Stadt, moderne Infrastruktur sowie ein freundliches, einladendes Team.<br />Mit Highspeed-Internet und kostenlosen Parkplätzen <br />sind dies nur einige Gründe, warum das Derand Hotel die beste Wahl für Sie ist.",
      "index-events-kicker": "Unsere Partnerschaften",
      "index-events-title": "Unsere exklusiven Erlebnisse",
      "index-event-1": "Strahlendes Wohlbefinden und Wellness",
      "index-event-2": "Pulsierende Stadtrhythmen",
      "index-event-3": "Exklusive Körperregeneration",
      "index-event-4": "Die Höhen erkunden",
      "index-event-5": "Innere Harmonie und Ausgleich",
      "index-event-6": "Aktives Leben und Balance",
      "index-event-7": "Bergabenteuer",
      "index-rooms-kicker": "Luxus auf jeder Ebene",
      "index-rooms-title": "Zimmer und Suiten",
      "index-link-learn": "Mehr erfahren",
      "index-welcome-kicker": "HALLO PRISHTINA",
      "index-welcome-title": "Raffinierte Eleganz und Komfort",
      "index-welcome-p":
        "Jeder Aufenthalt ist eine kuratierte Reise voller Eleganz, auf der zeitloser Stil auf die Kunst raffinierter Gastfreundschaft trifft.",
      "index-health-kicker": "Prishtina",
      "index-health-title": "Bleiben. Entspannen. Genießen.",
      "index-fac-kicker": "Ideal für Ihren Aufenthalt",
      "index-fac-title": "Ausstattung im Derand",
      "index-fac-chip-1": "Kostenloses WLAN",
      "index-fac-chip-2": "Kostenlose Parkplätze",
      "index-fac-chip-3": "Eigenes Badezimmer",
      "index-fac-chip-4": "Klimaanlage",
      "index-fac-chip-5": "Stadtblick",
      "index-fac-chip-6": "Nichtraucherzimmer",
      "index-fac-chip-7": "Flachbild-TV",
      "index-fac-chip-8": "24-Stunden-Rezeption",
      "index-fac-acc1-sum": "Badezimmer und Schlafzimmer",
      "index-fac-acc1-p":
        "Toilettenpapier, Handtücher, Hausschuhe, WC, kostenlose Pflegeprodukte, Bademantel, Haartrockner, Dusche, Bettwäsche, Kleiderschrank oder Garderobe, Wecker, begehbarer Kleiderschrank.",
      "index-fac-acc2-sum": "Zimmerausstattung und Wohnbereich",
      "index-fac-acc2-p":
        "Schreibtisch, Kleiderständer, Reinigungsmittel, Wäschetrockner, Wasserkocher, Tee- und Kaffeemaschine, schalldämmender Komfort, Heizung, Ventilator, Bügelmöglichkeiten, Hosenbügler.",
      "index-fac-acc3-sum": "Medien, Internet und Parken",
      "index-fac-acc3-p":
        "Kabel- und Satellitenkanäle, Radio, Telefon, Flachbild-TV, kostenloses WLAN in allen Bereichen, kostenlose Privatparkplätze vor Ort ohne Reservierung.",
      "index-fac-acc4-sum": "Service und Sicherheit",
      "index-fac-acc4-p":
        "Concierge, Weckservice, Rechnungsstellung, 24-Stunden-Rezeption, Videoüberwachung in Gemeinschaftsbereichen und im Außenbereich, Rauchmelder, Sicherheitsalarm, Safe, 24-Stunden-Sicherheitsdienst.",
      "index-fac-acc5-sum": "Barrierefreiheit und Sprachen",
      "index-fac-acc5-p":
        "Obere Stockwerke sind mit dem Aufzug erreichbar. Gesprochene Sprachen: Englisch, Spanisch, Türkisch.",
      "index-quote-text":
        "Ein Aufenthalt im Derand Hotel Prishtina wird das Erlebnis der Stadt für jeden Gast auf unvergessliche Höhen heben.",
      "index-quote-name": "DERAND HOTEL PRISHTINA",
      "index-quote-role": "General Manager",
      "index-testimonials-heading": "Das sagen unsere Gäste:",
      "index-guest-source": "Quelle",
      "index-book-room": "Jetzt Ihr Zimmer buchen",
      "index-ig-line": "Folgen Sie uns auf <strong>Instagram</strong>",
      "index-footer-address": "Bekim-Fehmiu-Straße 30, 10000 Prishtina, Kosovo",
      "index-t-prev": "Vorherige Bewertung",
      "index-t-next": "Nächste Bewertung",
      "index-events-prev": "Vorherige Erlebnisse",
      "index-events-next": "Nächste Erlebnisse",
      "index-stars-aria": "5 von 5 Sternen",
      "index-guest-0-title": "Hervorragende Lage und wunderschöne Zimmer",
      "index-guest-0-body":
        "Hervorragende Lage, großartiges Team, komfortable Zimmer und faire Preise. Was möchte man mehr?",
      "index-guest-0-room": "Superior-Doppelzimmer",
      "index-guest-0-loc": "Vereinigte Staaten",
      "index-guest-1-title": "Saubere Zimmer in bester Stadtlage",
      "index-guest-1-body":
        "Sehr gute Lage, saubere und geräumige Zimmer sowie ein hervorragendes Preis-Leistungs-Verhältnis.",
      "index-guest-1-room": "Superior-Doppelzimmer",
      "index-guest-1-loc": "Vereinigtes Königreich",
      "index-guest-2-title": "Herzlicher Service und makellose Zimmer",
      "index-guest-2-body":
        "Freundliches Personal, außerordentlich saubere Zimmer und ein angenehmer Aufenthalt in idealer Lage.",
      "index-guest-2-room": "Superior-Doppelzimmer",
      "index-guest-2-loc": "Vereinigtes Königreich",
      "index-guest-3-title": "Moderne Zimmer mit freundlichem Service",
      "index-guest-3-body":
        "Moderne, saubere Zimmer, zuvorkommendes Personal und ein reibungsloser Check-in mit exzellentem Service.",
      "index-guest-3-room": "Deluxe-Doppelzimmer",
      "index-guest-3-loc": "Slowenien",
      "index-guest-4-title": "Exzellenter Service und hoher Komfort",
      "index-guest-4-body":
        "Großartige Gastfreundschaft, ein hilfsbereites Team und sehr komfortable Zimmer während des gesamten Aufenthalts.",
      "index-guest-4-room": "Deluxe-Doppelzimmer",
      "index-guest-4-loc": "Oman",
      "deluxe-preview-copy":
        "Treten Sie ein in Luxus in unserem Deluxe Doppelzimmer. GerÃ¤umig und stilvoll eingerichtet, verfÃ¼gt es Ã¼ber ein herrliches Doppelbett und bietet auf Wunsch die FlexibilitÃ¤t eines zusÃ¤tzlichen Bettes. FÃ¼r anspruchsvolle Reisende gestaltet, die Komfort und Bequemlichkeit suchen, ist dieses Zimmer eine perfekte Kombination aus Raffinesse und AnpassungsfÃ¤higkeit.",
      "deluxe-size-value": "30m²",
      "deluxe-size-label": "GrÃ¶ÃŸe",
      "deluxe-bed-value": "Kingsize",
      "deluxe-bed-label": "Bett",
      "deluxe-concierge-value": "24 h",
      "deluxe-concierge-label": "Conciergeâ€‘Service",
      "deluxe-parking-value": "24/7 Parken",
      "deluxe-parking-label": "Kostenlos",
      "deluxe-water-value": "Wasser",
      "deluxe-water-label": "Kostenlos",
      "deluxe-director-quote":
        "Unsere Deluxe Zimmer heben gehobenes Wohnen auf ein neues Niveau und verbinden grosszuegigen Komfort mit zeitloser Eleganz.",
      "deluxe-bath-note":
        "Geschichtete Textilien, sanftes Nachttischlicht und ein klar definierter Schreibplatz machen unsere Deluxe Zimmer zu einem ruhigen Rueckzugsort in der Stadt, fuer Erholung und konzentriertes Arbeiten.",
      "deluxe-moments-line-1": "Gemeinsam erlebte Momente",
      "deluxe-moments-line-2": "werden zu bleibenden Erinnerungen",
    },
    al: {
      "rinu-hero-kicker": "RRIT BUKURINÃ‹ DHE VETÃ‹BESIMIN TÃ‹ND",
      "guest-app-hero-title":
        "Zbuloni gjithçka që ju nevojitet me aplikacionin e personalizuar për mysafirët nga Derand.",
      "guest-app-hero-copy":
        "Udhëtimi juaj fillon këtu: eksploroni, rezervoni dhe shijoni një qëndrim pa pengesa – përjetoni qytetin si askund tjetër.",
      "guest-app-about-title": "Rreth Guest App",
      "guest-app-about-copy":
        "Ne jemi të përkushtuar për të thjeshtuar qëndrimin e mysafirëve dhe përjetimin e qytetit apo shtetit. Aplikacioni i ndihmon mysafirët të eksplorojnë pikat e interesit, duke filluar nga restorantet më të mira e deri te pikat më të rëndësishme historike e kulturore.",
      "guest-app-badge-app-small": "Shkarkoni në",
      "guest-app-badge-app-big": "App Store",
      "guest-app-badge-play-small": "SHKARKONI NË",
      "guest-app-badge-play-big": "Google Play",
      "guest-app-card-1-title":
        "Një përzgjedhje e bareve dhe restoranteve më të mira në duart tuaja",
      "guest-app-card-2-title":
        "Çdo gjë që ju nevojitet në një vend gjatë qëndrimit në Derand",
      "guest-app-card-3-title":
        "Hapja e llogarisë tuaj është shumë e thjeshtë",
      "guest-app-card-4-title":
        "Rezervimi i një tavoline nuk ka qenë kurrë më i lehtë",
      "guest-app-stats-registered-label": "Mysafirë të regjistruar",
      "guest-app-stats-tables-label": "Tavolina të rezervuara",
      "guest-app-stats-rating-label": "Vlerësimi në App Store",
      "rinu-trust-copy":
        "I besuar nga klientÃ«t nÃ« Sudbury pÃ«r rezultate tÃ« jashtÃ«zakonshme dhe afatgjata nÃ« trajtimet e avancuara me lazer dhe estetike.",
      "rinu-solutions-kicker": "Zbuloni EkspertizÃ«n TonÃ«",
      "rinu-solutions-title": "Zgjidhje GjithÃ«pÃ«rfshirÃ«se Bukurie",
      "rinu-solutions-copy":
        "Nga trajtimet mÃ« tÃ« avancuara me lazer te estetika moderne dhe modelimi i trupit, ne ofrojmÃ« njÃ« gamÃ« tÃ« plotÃ« shÃ«rbimesh pÃ«r tÃ« theksuar bukurinÃ« tuaj dhe pÃ«r tÃ« rritur vetÃ«besimin.",
      "rinu-faq-q1": "Ã‡farÃ« shÃ«rbimesh ofron RINU MEDSPA?",
      "rinu-faq-a1":
        "Ne ofrojmÃ« heqje tÃ« qimeve me lazer, dermaplaning, shÃ«rbime pÃ«r qerpikÃ«, facial dhe konturim trupi â€” si dhe EMSCULPT, microneedling, CO2, Alma Hybrid, masazh, AxoMind, EMFUSION dhe EMFACE â€” tÃ« pÃ«rshtatura pÃ«r llojin e lÃ«kurÃ«s suaj dhe qÃ«llimet tuaja.",
      "rinu-faq-q2": "Si tÃ« rezervoj njÃ« term?",
      "rinu-faq-a2":
        "Rezervoni online pÃ«rmes butonit â€œBook Nowâ€ nÃ« faqen tonÃ« tÃ« internetit. Do tÃ« merrni menjÃ«herÃ« konfirmim dhe mund ta menaxhoni rezervimin direkt nÃ« faqe.",
      "rinu-faq-q3":
        "A janÃ« tÃ« sigurta trajtimet pÃ«r tÃ« gjitha llojet e lÃ«kurÃ«s?",
      "rinu-faq-a3":
        "Po. TÃ« gjitha trajtimet tona pÃ«rdorin cilÃ«sime tÃ« avancuara dhe tÃ« personalizueshme pÃ«r tÃ« trajtuar nÃ« mÃ«nyrÃ« tÃ« sigurt dhe efektive njÃ« gamÃ« tÃ« gjerÃ« tonesh dhe shqetÃ«simesh tÃ« lÃ«kurÃ«s. Parametrat zgjidhen gjatÃ« konsultÃ«s.",
      "rinu-faq-q4": "Ã‡farÃ« tÃ« pres gjatÃ« vizitÃ«s sÃ« parÃ«?",
      "rinu-faq-a4":
        "Filloni me njÃ« konsultÃ« falas me Dr. Diellxa. Pas vlerÃ«simit tÃ« qÃ«llimeve dhe lÃ«kurÃ«s suaj, ne shpjegojmÃ« procesin dhe opsionet, dhe mund tÃ« vazhdoni menjÃ«herÃ« me planin tuaj tÃ« personalizuar (dhe seancÃ«n e parÃ«, nÃ«se dÃ«shironi).",
      "rinu-faq-q5": "Sa seanca duhen pÃ«r rezultatet mÃ« tÃ« mira?",
      "rinu-faq-a5":
        "Varet nga trajtimi qÃ« po bÃ«ni, zona dhe reagimi individual. Ã‹shtÃ« mÃ« mirÃ« ta diskutoni kÃ«tÃ« gjatÃ« konsultÃ«s me Dr. Diellxa, qÃ« tÃ« pÃ«rcaktojmÃ« planin dhe afatin realist pÃ«r objektivat tuaja.",
      "rinu-faqs-kicker": "Keni pyetje?",
      "rinu-faqs-title": "Ne kemi pÃ«rgjigjet",
      "rinu-faqs-intro":
        "MÃ«soni mÃ« shumÃ« rreth shÃ«rbimeve tona dhe Ã§farÃ« tÃ« prisni me pyetjet mÃ« tÃ« shpeshta, ose na kontaktoni.",
      "rinu-best-view-more": "MÃ« shumÃ«",
      "rinu-view-treatment": "Shiko Trajtimin",
      "rinu-hero-title": "Zgjidhje estetike tÃ« avancuara",
      "rinu-card-best-title": "Trajtimet mÃ« tÃ« mira",
      "rinu-card-mani-title": "Manikyr &amp; Pedikyr",
      "rinu-card-consult-title": "KonsultÃ« Falas",
      "rinu-cta-kicker": "Gati pÃ«r transformim?",
      "rinu-cta-title": "Rezervo termin tÃ«nd sot",
      "rinu-cta-copy":
        "Nisni rrugÃ«timin drejt njÃ« versioni mÃ« tÃ« sigurt tÃ« vetes. QoftÃ« lazer, estetikÃ«, konturim trupi apo beauty, ekipi ynÃ« ekspert Ã«shtÃ« gati tâ€™ju ndihmojÃ«.",
      "rinu-reviews-kicker": "Ã‡farÃ« thonÃ« klientÃ«t tanÃ«",
      "rinu-reviews-title": "Rezultate reale, komente reale",
      "rinu-reviews-copy":
        "DÃ«gjoni nga klientÃ«t tanÃ« tÃ« kÃ«naqur dhe zbuloni pse kaq shumÃ« njerÃ«z na besojnÃ« trajtimet e tyre tÃ« bukurisÃ«.",
      "rinu-signature-kicker": "ShÃ«rbimet tona Signature",
      "rinu-signature-title":
        "Trajtime transformuese<br />tÃ« pÃ«rshtatura pÃ«r ju",
      "rinu-signature-copy":
        "Zbuloni trajtimet tona mÃ« tÃ« kÃ«rkuara qÃ« ju ndihmojnÃ« tÃ« dukeni dhe tÃ« ndiheni nÃ« formÃ«n mÃ« tÃ« mirÃ«. Nga lÃ«kura e lÃ«muar pa qime te qerpikÃ«t perfektÃ« dhe teni rrezatues, ne ofrojmÃ« kujdes profesional pÃ«r nevojat tuaja tÃ« bukurisÃ«.",
      "rinuform-kicker": "Rezervim RINU",
      "rinuform-title": "Rezervoni Terminin Tuaj",
      "rinuform-sub":
        "Dergoni nje kerkese per termin. Rinu punon nga 12:00 deri ne 20:00. Ne do ta konfirmojme kerkesen tuaj shpejt.",
      "rinuform-first-name-label": "Emri",
      "rinuform-first-name-ph": "Emri",
      "rinuform-last-name-label": "Mbiemri",
      "rinuform-last-name-ph": "Mbiemri",
      "rinuform-email-label": "Adresa e Email-it",
      "rinuform-email-ph": "EMAIL",
      "rinuform-email-aria": "Email",
      "rinuform-name-ph": "Emri",
      "rinuform-name-aria": "Emri",
      "rinuform-phone-label": "Numri i Telefonit",
      "rinuform-phone-ph": "Numri i telefonit",
      "rinuform-phone-aria": "Numri i telefonit",
      "rinuform-date-aria": "Data",
      "rinuform-time-aria": "Ora",
      "rinuform-message-ph": "Mesazh",
      "rinuform-message-aria": "Mesazh",
      "rinuform-close-aria": "Mbyll formen",
      "rinuform-datetime-label": "Data & Ora e Preferuar",
      "rinuform-submit": "Konfirmo Terminin",
      "rinu1-hero-title-main": "RINU Medspa",
      "rinu1-hero-title-sub":
        "Trajtime te avancuara per lekuren, trupin dhe mendjen.",
      "rinu1-hero-cta-book": "Rezervo konsulten",
      "rinu1-hero-cta-explore": "Eksploro trajtimet",
      "rinu1-strip-1": "Formulime te pastra",
      "rinu1-strip-2": "Konsulte para trajtimit",
      "rinu1-strip-3": "Kujdes pas trajtimit i perfshire",
      "rinu1-strip-4": "Ne Derand, ne vend",
      "rinu1-card-skin-title": "LEKURE",
      "rinu1-card-body-title": "TRUPI",
      "rinu1-card-mind-title": "MENDJE",
      "rinu1-card-learn-more": "Shiko me shume",
      "rinu1-card-skin-note": "",
      "rinu1-card-body-note": "",
      "rinu1-skin-h": "LEKURE",
      "rinu1-skin-p1":
        "<strong>Facials (Biologique Recherche)</strong><br />Trajtime te personalizuara mbi bazen e diagnostikimit te lekures per te rikthyer hidratimin, balancen dhe ndricimin natyral.",
      "rinu1-skin-p2":
        "<strong>Injectables</strong><br />Skin Boosters, Fillers dhe Exosomes per hidratim te thelle, stimulim te kolagjenit dhe densitet me te mire te lekures.",
      "rinu1-skin-p3":
        "<strong>Lifting jo-invaziv</strong><br />Teknologjite EMFACE dhe EXION RF per tonifikim muskular te fytyres, konturim dhe pamje me te fresket.",
      "rinu1-skin-p4":
        "<strong>Cilesia &amp; Tekstura e lekures</strong><br />Microneedling (EXION) dhe infuzione te specializuara per minimizim te poreve, rafinim te tekstures dhe rritje te elasticitetit.",
      "rinu1-skin-p5":
        "<strong>Terapi e avancuar me lazer</strong><br />Teknologjite CO2 dhe Alma Hybrid per rinovim te lekures, reduktim pigmentimi dhe trajtim te shenjave.",
      "rinu1-body-h": "TRUPI",
      "rinu1-body-exion":
        "<strong>EXION BODY</strong><br />Shtrengim i lekures. Stimulim i thelle. Kontur e dukshme.<br />EXION Body nuk eshte nje trajtim tipik per trupin. Eshte nje teknologji e avancuar qe stimulon kolagjenin dhe elastinen thelle ne inde, duke ndihmuar ne shtrengimin e lekures, permiresimin e tekstures dhe rafinimin e kontureve te trupit - e gjitha ne menyre jo-invazive.",
      "rinu1-emfusion-kicker": "<strong>EMFUSION</strong>",
      "rinu1-emfusion-line-1":
        "Rigjenerim i lekures. Infuzion i thelle. Rezultate reale.",
      "rinu1-emfusion-line-2":
        "EMFUSION nuk eshte nje facial tradicional. Eshte nje trajtim i avancuar qe punon thelle ne lekure per te rikthyer hidratimin, permiresuar teksturen dhe ringjallur vitalitetin natyral.",
      "rinu1-emfusion-line-3":
        "Teksture e rafinuar. Shkelqim i rikthyer. Vitalitet i thelle i lekures.",
      "rinu1-body-p1":
        "<strong>Massage &amp; Relaxation</strong><br />Teknika te personalizuara me vajra Ligne St Barth per lirimin e tensionit, permiresimin e qarkullimit dhe rikthimin e balancit.",
      "rinu1-body-p2":
        "<strong>Body Care &amp; Polish</strong><br />Eksfolim dhe hidratim i thelle qe e lene lekuren te lemuar, te ushqyer dhe me shkelqim.",
      "rinu1-body-p3":
        "<strong>Skulpturim i avancuar i trupit</strong><br />EMSCULPT Neo dhe EMTONE per tonifikim muskujsh, reduktim celuliti dhe shtrengim te lekures.",
      "rinu1-body-p4":
        "<strong>Wellness i specializuar</strong><br />Terapi te targetuara si EMSELLA dhe EMFEME me fokus ne forcimin e brendshem dhe mireqenien rigjeneruese.",
      "rinu1-body-p5":
        "<strong>Nails &amp; Grooming</strong><br />Manikyr dhe pedikyr profesional per nje pamje estetike dhe te rafinuar me vemendje maksimale ne detaje.",
      "rinu1-mind-h": "MENDJE",
      "rinu1-mind-p1":
        "<strong>EXOMIND Stimulim Magnetik</strong><br />Trajtim jo-invaziv me impulse te buta magnetike per permiresim fokusi, ulje stresi dhe rikthim te balances emocionale.",
      "rinu1-mind-p2":
        "<strong>Reset i thelle mendor</strong><br />Qasje sinergjike qe kombinon teknologjine EXOMIND me rituale qetesuese masazhi per clirimin e tensionit mendor dhe fizik.",
      "rinu1-mind-p3":
        "<strong>Mbeshtejte per gjume &amp; qartesi</strong><br />Terapi e targetuar per cilesi me te mire gjumi, ulje te lodhjes mendore dhe largim te &quot;brain fog&quot; te perditshmerise.",
      "rinu1-process-title": "Si punojme",
      "rinu1-process-1-h": "Konsulte",
      "rinu1-process-1-p":
        "Qellimet, historiku shendetesor dhe fotografite nese jepni pelqimin. Pa presion per rezervim ne te njejten dite.",
      "rinu1-process-2-h": "Plan",
      "rinu1-process-2-p":
        "Nje sekuence e shkruar: cfare te behet ne klinike, cfare te ndalet ne shtepi dhe cfare te prisni ore pas ore.",
      "rinu1-process-3-h": "Trajtim",
      "rinu1-process-3-p":
        "Kohe e qete ne suite, verifikime te vazhdueshme te pelqimit dhe pushime komoditeti.",
      "rinu1-process-4-h": "Kujdes pas trajtimit",
      "rinu1-process-4-p":
        "Lidhje direkte per pyetje, keshilla ftohjeje dhe rishikim i planifikuar me foto.",
      "rinu1-quote-main":
        "Deshiroja te dukesha sikur kisha fjetur nje jave ne det. Ekipi pergatiti nje plan te bute dhe nuk nxitoi asnje moment. U ndjeva si ne nje krah privat te hotelit — jo ne nje korridor klinike.",
      "rinu1-quote-by": "— Mysafir, vizite ne RINU Medspa",
      "rinu1-services-kicker": "Fokus Signature",
      "rinu1-services-title": "Merr nje ore per veten, pa dale nga hoteli.",
      "rinu1-services-copy":
        "RINU Medspa sjell trajtime te avancuara estetike dhe wellness gjate qendrimit tuaj ne Derand Hotel. E dizajnuar per gra dhe burra qe duan rezultate te dukshme pa kohe rikuperimi.",
      "rinu1-qa-q1": "Cfare duhet te pres ne viziten time te pare?",
      "rinu1-qa-a1":
        "Cdo trajtim ne RINU fillon me nje konsulte te udhehequr nga Dr. Diellza Mustafa. Ne marrim kohe te kuptojme lekuren, trupin dhe qellimet tuaja, pastaj ju udhezojme drejt trajtimit te duhur bazuar ne ate qe funksionon realisht per ju.<br /><br />Konsultat jane falas.",
      "rinu1-qa-q2": "Cfare mund te bej gjate qendrimit tim ne RINU?",
      "rinu1-qa-a2":
        "<ul class='rinu1-qa-services'><li>Rituale masazhi signature</li><li>Lifting dhe rifreskim fytyre</li><li>Facials Biologique Recherche</li><li>Permiresim i cilesise se lekures dhe glow</li><li>Seanca EXOMIND per reset stresi</li><li>Tonifikim trupi dhe rafinim celuliti</li><li>Heqje qimesh me lazer dhe grooming</li><li>Manikyr dhe pedikyr profesional</li></ul>",
      "rinu1-qa-q3": "Ritualet e masazhit",
      "rinu1-qa-a3":
        "- RINU Ritual - St. Barth ChillOut - Deep Tissue - Face &amp; Decollete<br />- Aromatherapy - Cupping - Hot Stone",
      "rinu1-qa-q4": "Per gra dhe burra",
      "rinu1-qa-a4":
        "Cdo trajtim pershtatet sipas nevojave tuaja, qofte per relaks, rifreskim apo rafinim.",
      "rinu1-qa-q5": "Rivendos mendjen me EXOMIND",
      "rinu1-qa-a5":
        "Trajtim jo-invaziv i dizajnuar per te rikthyer balancen mendore, permiresuar fokusin dhe mbeshtetur gjume me te mire, duke ulur stresin dhe ankthin. Duke perdorur stimulim magnetik te avancuar, vepron direkt ne aktivitetin cerebral per te sjelle qartesi, qetesi dhe ndjesi reseti.<br /><br />Perfekt gjate udhetimeve ose periudhave te ngarkuara, kur mendja ka nevoje te ngadalesoje dhe te rialinjohet.<br /><br />30 minuta. Pa downtime.",
      "rinu1-qa-q6": "Koha e trajtimit &amp; Downtime",
      "rinu1-qa-a6":
        "Koha e trajtimit: 15 deri 60 minuta, ne varesi te trajtimit.<br />Downtime: Minimal ose aspak. Mund ta vazhdoni diten menjehere.",
      "rinu1-qa-q7": "Kush i kryen trajtimet?",
      "rinu1-qa-a7": "Mjeke dhe profesioniste te trajnuar mjekesor e estetik.",
      "rinu1-qa-q8": "Terminet",
      "rinu1-qa-a8":
        "Rezervimi rekomandohet. Pranohen edhe vizita pa rezervim per konsulte.",
      "rinu1-qa-q9": "Lokacioni",
      "rinu1-qa-a9":
        "Kati -1, Derand Hotel<br />I aksesueshem me ashensor ose shkalle.",
      "rinu1-visit-title": "Gati kur jeni ju",
      "rinu1-visit-sub":
        "Ndani datat tuaja te preferuara — ne kujdesemi per te gjitha organizimet dhe ju dergojme udhezimet pergatitore per terminin tuaj.",
      "rinu1-visit-cta": "Rezervo konsulten",
      "rinu1-visit-directions": "Drejtimi per ne Derand Hotel",
      "onze-trust-copy":
        "Studio revolucionare pÃ«r Wellness, Recovery dhe Fizioterapi.",
      "onze-faq-q1": "Cilat trajtime ofron ONZE?",
      "onze-faq-a1":
        "ONZE ofron kÃ«to trajtime: terapi me dritÃ« tÃ« kuqe, krioterapi dhe masazhe.",
      "onze-solutions-title": "Zgjidhje GjithÃ«pÃ«rfshirÃ«se pÃ«r Rikuperim",
      "onze-solutions-copy":
        "ONZE Ã«shtÃ« njÃ« Studio Wellness, Recovery dhe Fizioterapie e vendosur nÃ« zemÃ«r tÃ« PrishtinÃ«s. Ne fokusohemi nÃ« pÃ«rmirÃ«simin e performancÃ«s, bukurisÃ« dhe shÃ«ndetit pÃ«rmes trajtimeve natyrale, jo-invazive, qÃ« shfrytÃ«zojnÃ« proceset vetanake tÃ« trupit.",
      "onze-card-1-title": "Trajtime Rikuperimi",
      "onze-card-2-title": "Terapi Performance",
      "onze-card-3-title": "KonsultÃ« Wellness",
      "onze-view-treatment": "Shiko Trajtimin",
      "onzeform-kicker": "Rezervim ONZE",
      "onzeform-title": "Rezervoni Sesionin Tuaj ONZE",
      "onzeform-sub":
        "PlotÃ«soni formularin mÃ« poshtÃ« dhe ekipi ynÃ« do tÃ« konfirmojÃ« sÃ« shpejti sesionin qÃ« kÃ«rkuat.",
      "onzeform-first-name-label": "Emri",
      "onzeform-first-name-ph": "Emri",
      "onzeform-last-name-label": "Mbiemri",
      "onzeform-last-name-ph": "Mbiemri",
      "onzeform-email-label": "Adresa e Email-it",
      "onzeform-email-ph": "p.sh. name@email.com",
      "onzeform-datetime-label": "Data & Ora e Preferuar",
      "onzeform-submit": "Konfirmo Sesionin",
      "noyaform-kicker": "Rezervim Noya",
      "noyaform-title": "Rezervoni TavolinÃ«n Tuaj",
      "noyaform-sub":
        "PlotÃ«soni formularin mÃ« poshtÃ« dhe ekipi ynÃ« do tÃ« konfirmojÃ« sÃ« shpejti rezervimin e tavolinÃ«s suaj.",
      "noyaform-first-name-label": "Emri",
      "noyaform-first-name-ph": "Emri",
      "noyaform-last-name-label": "Mbiemri",
      "noyaform-last-name-ph": "Mbiemri",
      "noyaform-email-label": "Adresa e Email-it",
      "noyaform-email-ph": "Adresa e Email-it",
      "noyaform-datetime-label": "Data & Ora e Preferuar",
      "noyaform-submit": "Konfirmo TavolinÃ«n",
      "noya-reserve-phone-ph": "Numri i telefonit",
      "noya-book-title": "Rezervo NjÃ« TavolinÃ«",
      "noya-book-label-1": "Atmosfera",
      "noya-book-value-1": "Rooftop Dining",
      "noya-book-label-2": "ShÃ«rbimi",
      "noya-book-value-2": "Rezervim Tavoline",
      "noya-book-label-3": "PÃ«rgjigjja",
      "noya-book-value-3": "Konfirmim i ShpejtÃ«",
      "noya-book-cta": "Rezervo tavolinÃ«",
      "noya-explore-title": "Eksploro Noya",
      "noya-explore-copy":
        "Zgjidh pÃ«rvojÃ«n tÃ«nde dhe kalo drejtpÃ«rdrejt te atmosfera qÃ« dÃ«shiron sonte.",
      "noya-explore-card-1-title": "Shko te Restoranti",
      "noya-explore-card-1-copy":
        "Pjata tÃ« rafinuara, shÃ«rbim elegant dhe njÃ« ambient i ngrohtÃ« karakteristik.",
      "noya-explore-card-2-title": "Shko te Bar Cocktails",
      "noya-explore-card-2-copy":
        "Kokteje klasike dhe moderne me atmosferÃ« mbrÃ«mjeje tÃ« kuruar.",
      "noya-explore-open": "Hap",
      "noya-restaurant-title": "Noya Restaurant",
      "noya-restaurant-sub":
        "Eksploroni atmosferÃ«n e restorantit tonÃ« pÃ«rmes fotove mÃ« tÃ« fundit tÃ« NOYA.",
      "noya-cocktails-title": "Noya Cocktails",
      "noya-cocktails-sub":
        "Eksploroni atmosferÃ«n e barit dhe koktejeve pÃ«rmes fotove mÃ« tÃ« fundit tÃ« NOYA.",
      "main-page-title": "Njoftim Shablloni",
      "main-page-copy":
        "Kjo faqe zÃ«vendÃ«suese Ã«shtÃ« aktive dhe pÃ«rdor kontrollet globale tÃ« pÃ«rkthimit.",
      "room-details-title": "Detajet e DhomÃ«s",
      "room-details-copy":
        "PÃ«rmbajtja e detajeve tÃ« dhomÃ«s po pÃ«rgatitet. Ju lutemi rikthehuni sÃ« shpejti.",
      "rinu-review-1":
        "PÃ«rvoja ime te RINU me Exomind &amp; EMSCULPT ishte vÃ«rtet shumÃ« e mirÃ«. Dallohet qÃ« punojnÃ« me teknologji cilÃ«sore dhe e dinÃ« saktÃ« Ã§farÃ« bÃ«jnÃ«. Ambient i pastÃ«r, i qetÃ« dhe ekip profesional. E rekomandoj shumÃ«.",
      "rinu-review-2":
        "QÃ« nÃ« hyrje klinika duket mikpritÃ«se, moderne dhe shumÃ« e organizuar. Stafi Ã«shtÃ« jashtÃ«zakonisht profesional, i pÃ«rgatitur dhe i kujdesshÃ«m, dhe shihet qartÃ« standardi i lartÃ« i cilÃ«sisÃ«. E rekomandoj pÃ«r tÃ« gjithÃ«! 5 yje!",
      "rinu-review-3":
        "Kisha njÃ« pÃ«rvojÃ« shumÃ« tÃ« mirÃ« nÃ« Rinu Med Spa. Energjia Ã«shtÃ« e mrekullueshme, hapÃ«sira shumÃ« profesionale dhe mikpritÃ«se, dhe mÃ« pÃ«lqeu shumÃ« dhoma e relaksit pas trajtimit. GjithÃ§ka Ã«shtÃ« e detajuar dhe e organizuar. ShumÃ« e rekomandueshme!",
      "rinu-review-4":
        "Ky vend Ã«shtÃ« i jashtÃ«zakonshÃ«m. QetÃ«si e menjÃ«hershme sapo hyn brenda. BÃ«ra CO2 laser dhe ExoMind, dhe i gjithÃ« ekipi ishte jo vetÃ«m super profesional, por edhe shumÃ« i sjellshÃ«m. Po shkÃ«lqej si nga jashtÃ« ashtu edhe nga brenda.",
      "rinu-review-5":
        "NjÃ« eksperiencÃ« luksoze spa nga fillimi nÃ« fund. Atmosfera Ã«shtÃ« e qetÃ« dhe e dizajnuar bukur, stafi i vÃ«mendshÃ«m dhe shumÃ« i aftÃ«, dhe Ã§do detaj ndihet i menduar me kujdes. Trajtimi im ishte relaksues dhe i pÃ«rshtatur nÃ« mÃ«nyrÃ« perfekte.",
      "rinu-review-6":
        "RINU â€“ njÃ« vend vÃ«rtet unik nÃ« PrishtinÃ«. TÃ« jep ndjesinÃ« e njÃ« kryeqyteti botÃ«ror me eksperiencÃ« 5â€‘yje. Teknologji e avancuar e kombinuar me staf profesional, tÃ« ngrohtÃ« dhe mikpritÃ«s. Vendi ideal pÃ«r wellness dhe selfâ€‘care nga A nÃ« Z.",
      "best-hero-title": "PÃ«rvoja RINU: Shkenca takohet me qetÃ«sinÃ«",
      "best-hero-sub": "Standard i ri i ekselencÃ«s estetike",
      "best-hero-intro":
        "NÃ« RINU MEDSPA brenda Derand Hotel, teknologjia mjekÃ«sore mÃ« e avancuar bashkohet me luksin boutique pÃ«r njÃ« pÃ«rvojÃ« transformuese tÃ« lÃ«kurÃ«s dhe trupit.",
      "best-sec1-title":
        "1. Rinjohje e avancuar e fytyrÃ«s & shÃ«ndeti i lÃ«kurÃ«s",
      "best-sec1-item1-title": "Alma Hybrid & CO2 Resurfacing",
      "best-sec1-item1-copy":
        "Zgjidhja pÃ«rfundimtare pÃ«r strukturÃ«n, shenjat dhe rinovimin e thellÃ«. KombinojmÃ« CO2 dhe 1570nm pÃ«r tÃ« stimuluar kolagjenin me pak kohÃ« rikuperimi.",
      "best-sec1-item2-title": "Microneedling & Faciale tÃ« specializuara",
      "best-sec1-item2-copy":
        "Microneedling mjekÃ«sor krijon mikroâ€‘kanale tÃ« kontrolluara dhe kombinohet me faciale tÃ« personalizuara pÃ«r hidratim, akne ose antiâ€‘aging.",
      "best-sec1-item3-title": "Dermaplaning",
      "best-sec1-item3-copy":
        "Eksfolim i saktÃ« qÃ« heq qelizat e vdekura dhe pushin, pÃ«r lÃ«kurÃ« tepÃ«r tÃ« lÃ«muar.",
      "best-sec2-title":
        "2. E ardhmja e lifting pa gjilpÃ«ra: EMFACE & AxoMind",
      "best-sec2-item1-title": "EMFACE",
      "best-sec2-item1-copy":
        "Trajtimi i parÃ« pa gjilpÃ«ra qÃ« trajton njÃ«kohÃ«sisht lÃ«kurÃ«n dhe muskujt e fytyrÃ«s pÃ«r ngritje natyrale.",
      "best-sec2-item2-title": "AxoMind",
      "best-sec2-item2-copy":
        "Stimulim neuromuskular pÃ«r tÃ« rritur tonusin dhe definicionin e muskujve tÃ« fytyrÃ«s.",
      "best-sec3-title": "3. SkulpturÃ« trupi & konturim profesional",
      "best-sec3-item1-title": "EMSCULPT & EMFUSION",
      "best-sec3-item1-copy":
        "Teknologji elektromagnetike me intensitet tÃ« lartÃ« qÃ« shkakton kontraktime tÃ« fuqishme pÃ«r tonifikim dhe reduktim tÃ« yndyrÃ«s.",
      "best-sec3-item2-title": "Body Contouring",
      "best-sec3-item2-copy":
        "Protokolle tÃ« personalizuara pÃ«r tÃ« shtrÃ«nguar lÃ«kurÃ«n dhe reduktuar xhepat e yndyrÃ«s.",
      "best-sec4-title": "4. ElegancÃ« ditore & rikuperim",
      "best-sec4-item1-title": "Heqje qimesh me lazer",
      "best-sec4-item1-copy":
        "Sisteme tÃ« avancuara, tÃ« sigurta pÃ«r tÃ« gjitha llojet e lÃ«kurÃ«s, pÃ«r rezultate jetÃ«gjata.",
      "best-sec4-item2-title": "ShÃ«rbime pÃ«r qerpikÃ«",
      "best-sec4-item2-copy":
        "Nga liftet natyrale te extensions voluminoze â€“ tÃ« dizajnuara nÃ« mÃ«nyrÃ« perfekte pÃ«r sytÃ« tuaj.",
      "best-sec4-item3-title": "Masazh terapeutik",
      "best-sec4-item3-copy":
        "LehtÃ«son tensionin, stimulon drenazh limfatik dhe qetÃ«son mendjen.",
      "best-why-title": "Pse RINU te Derand Hotel?",
      "best-why-quote":
        "Nuk besojmÃ« nÃ« qasje njÃ«soj pÃ«r tÃ« gjithÃ«. Ã‡do mysafir merr njÃ« 'Bespoke Aesthetic Map' â€“ konsultÃ« tÃ« detajuar qÃ« analizon llojin e lÃ«kurÃ«s, strukturÃ«n e muskujve dhe objektivat, nÃ« mÃ«nyrÃ« qÃ« Ã§do puls EMFUSION ose cilÃ«sim CO2 tÃ« jetÃ« i pÃ«rsosur pÃ«r ju.",
      "fc-hero-title": "Rruga juaj fillon kÃ«tu",
      "fc-hero-sub": "KonsultÃ« e personalizuar me Dr. Diellza",
      "fc-hero-intro":
        "BesojmÃ« se rezultatet mÃ« tÃ« bukura vijnÃ« nga kuptimi i anatomisÃ« suaj unike. Konsulta Ã«shtÃ« partneritet profesional pÃ«r rezultate precize, tÃ« sigurta dhe natyraleâ€‘luksoze.",
      "fc-sec1-title": "1. AnalizÃ« profesionale e lÃ«kurÃ«s & fytyrÃ«s",
      "fc-sec1-intro": "Ã‡do fytyrÃ« tregon njÃ« histori.",
      "fc-sec1-item1-title": "HartÃ«zim i avancuar",
      "fc-sec1-item1-copy":
        "AnalizÃ« e strukturÃ«s, cilÃ«sisÃ« sÃ« lÃ«kurÃ«s, lÃ«vizjes sÃ« muskujve dhe simetrisÃ«.",
      "fc-sec1-item2-title": "Shkenca e plakjes",
      "fc-sec1-item2-copy":
        "Kuptoni arsyet: humbje vÃ«llimi, ulje kolagjeni, dÃ«me mjedisore.",
      "fc-sec2-title": "2. Plani juaj personal estetik",
      "fc-sec2-intro": "Jo trende â€“ harmoni.",
      "fc-sec2-item1-title": "Plane tÃ« personalizuara",
      "fc-sec2-item1-copy":
        "QoftÃ« EMFACE, Alma Hybrid apo Body Contouring â€“ krijojmÃ« hapa qÃ« i pÃ«rshtaten lÃ«kurÃ«s dhe stilit tuaj tÃ« jetesÃ«s.",
      "fc-sec2-item2-title": "PritshmÃ«ri realiste",
      "fc-sec2-item2-copy":
        "Sqarim i shkencÃ«s, rikuperimit dhe mirÃ«mbajtjes afatgjatÃ«.",
      "fc-sec3-title": "3. Ambient privat & i sofistikuar",
      "fc-sec3-item1-title": "VÃ«mendje njÃ«â€‘mÃ«â€‘njÃ«",
      "fc-sec3-item1-copy":
        "Koha Ã«shtÃ« e gjitha pÃ«r ju â€“ pyetni, ndani shqetÃ«sime, pa presion.",
      "fc-sec3-item2-title": "Integrim holistik",
      "fc-sec3-item2-copy":
        "KombinojmÃ« teknologjitÃ« moderne me rituale relaksuese.",
      "fc-meet-title": "Njihuni me eksperten",
      "fc-meet-quote":
        "â€œFilozofia ime Ã«shtÃ« â€˜Invisible Enhancementâ€™. QÃ«llimi nuk Ã«shtÃ« tÃ« ndryshoj pamjen, por tÃ« rikthej versionin tuaj mÃ« tÃ« freskÃ«t dhe vibrant.â€ â€” Dr. Diellza",
      "fc-prepare-title": "Si tÃ« pÃ«rgatiteni pÃ«r konsultÃ«n falas",
      "fc-prepare-1": "Sillni rutinÃ«n tuaj aktuale.",
      "fc-prepare-2": "Mendoni pÃ«r â€œPseâ€-nÃ« tuaj.",
      "fc-prepare-3": "Pa presion â€“ seancÃ« informuese.",
      "nav-rooms": "DHOMAT & SUITAT",
      "nav-room-1": "SUITË JUNIOR",
      "nav-room-2": "DHOMË DYSHE DELUXE",
      "nav-room-3": "DHOMË SUPERIOR ME DY KREVATE",
      "nav-room-4": "DHOMË DYSHE PREMIUM",
      "nav-room-5": "DHOMË DYSHE SUPERIOR",
      "nav-restaurant": "RESTORAN & BAR",
      "nav-restaurant-1": "NOYA",
      "nav-restaurant-2": "OMMA – Kafe & bufet",
      "omma-hero-left": "Derand Hotel",
      "omma-hero-middle": "SÃ« shpejti",
      "omma-hero-year": "2026",
      "omma-hero-title": "OMMA<br />Cafe &amp; BUFFET",
      "omma-intro-title": "Rreth Restorantit",
      "omma-intro-copy-1":
        "I VENDOSUR NE AMBIENTIN E RAFINUAR TE DERAND HOTEL, OMMA CAFE &amp; BUFFET ESHTE NJE HAPESIRE KU DIZAJNI MODERN TAKON EKSELENCEN KULINARE.",
      "omma-intro-copy-2":
        "NESE BASHKOHENI PER NJE KAFE TE QETE TE MENGJESIT APO PER NJE MBLEDHJE ENERGJIKE PER MENGJES, OMMA OFRON NJE ATMOSFERE TE SOFISTIKUAR DHE MIKPRITESE. E HAPUR SI PER MYSAFIRET E HOTELIT ASHTU EDHE PER PUBLIKUN, JU FTOJME TE HYNI NE STREHEN TONE MINIMALISTE DHE TA NISNI DITEN ME PERBERES CILESORE DHE SHERBIM TE JASHTEZAKONSHEM.",
      "omma-intro-lower-copy-1":
        "KONCEPTI SILLET RRETH KONTRASTIT DHE HARMONISE - GURI I LEMUAR NDERTHURET ME NDRICIM TE BUTE AMBIENT, MERMERI I ERRET ME DRU TE NGROHTE DHE ELEMENTE SKULPTURORE DRITE NEN FORMA ORGANIKE TE TAVANIT.",
      "omma-intro-lower-copy-2":
        "ZONA E RECEPSIONIT ESHTE QENDRA VIZUALE DHE EMOCIONALE E HOTELIT, ME NJE BANAK MERMERI ME DAMAR TE KUQ TE NDRICUAR NGA POSHTE, QE KRIJON EFEKT LEVIZES DHE TERHEQ MENJEHERE VEMENDJEN.",
      "omma-services-copy-1":
        "DERAND HOTEL ESHTE NJE PROJEKT BASHKEKOHOR I MIKPRITJES LUKSOZE, I PERCAKTUAR NGA MATERIALITETI I GUXIMSHEM, PUNIMI I RAFINUAR DHE NJE PERVOJE HAPESINORE E NGROHTE DHE TERHEQESE.",
      "omma-services-copy-2":
        "DIZAJNI NDERTHUR ELEGANCEN MODERNE ME TEKSTURA TE PASURA NATYRORE PER TE KRIJUAR NJE ATMOSFERE TE SOFISTIKUAR POR MIKPRITESE.",
      "omma-services-copy-3":
        "PALETA E INTERIERIT DOMINOHET NGA NGJYRAT TOKESORE KAFE, AKSENTET BRONZI DHE FINISHEET E GURIT NATYROR, DUKE FORCUAR NDJESINE E LUKSIT TE PERJETSHEM.",
      "omma-services-copy-4":
        "ELEMENTET VERTIKALE TE DRURIT DHE TEKSTURAT E SHTRESUARA KRIJOJNE RITEM DHE THELLESI, NDERKOHE QE DRITARET E MEDHA LEJOJNE DRITEN NATYRORE TE NDERVEPROJE BUKUR ME MATERIALET GJATE GJITHE DITES.",
      "omma-intro-extra-copy-1":
        "DIZAJNI DHE FILOZOFIA E OMMA CAFE &amp; BUFFET REFLEKTOJNE ESENCEN E RAFINUAR TE DERAND HOTEL, KU CDO DETAJ ESHTE NJE STUDIM I KONTRASTIT.",
      "omma-intro-extra-copy-2":
        "I VENDOSUR NGJITUR ME RECEPSIONIN TONE IKONIK - KU MERMERI I NDRITSHEM ME DAMAR TE KUQ VENDOS TONIN E EKSKLUZIVITETIT - OMMA E ZGJAT KETE NARRATIVE VIZUALE NE BOTEN KULINARE.",
      "omma-collage-left":
        "Le te krijojme<br />historine tuaj unike<br />te dining-ut",
      "omma-collage-right":
        "Dhe zbuloni<br />si OMMA mund te<br />kornizoje cdo moment",
      "omma-photo-1-alt": "OMMA foto 1",
      "omma-photo-2-alt": "OMMA foto 2",
      "omma-photo-3-alt": "OMMA foto 3",
      "omma-services-img-1-alt": "Koncept dizajni i brendshem",
      "omma-services-img-2-alt": "Koncept rinovimi",
      "omma-services-img-3-alt": "Koncept perzgjedhjeje materialesh",
      "omma-services-img-4-alt": "Koncept ndricimi",
      "omma-services-img-5-alt": "Koncept i gjere ndricimi",
      "omma-collage-img-1-alt": "Atmosfere OMMA",
      "omma-collage-img-2-alt": "Detaj i brendshem OMMA",
      "omma-collage-img-3-alt": "Eksperience mbremjeje OMMA",
      "omma-lightbox-close": "Mbyll zmadhimin e imazhit",
      "omma-lightbox-img-alt": "Imazh OMMA i zmadhuar",
      "omma-zoom-image": "Zmadho imazhin",
      "omma-intro-btn": "Na Kontaktoni",
      "nav-activities": "AKTIVITETE",
      "nav-activity-1": "ONZE RECOVERY",
      "nav-activity-2": "RINU MEDSPA",
      "nav-inquiry": "KONTAKTI",
      "nav-contact-us": "NA KONTAKTONI",
      "nav-faqs": "PYETJE TË SHPESHTA",
      "nav-activity-3": "NOYA – nightlife",
      "nav-specials": "OFERTA & PAKO",
      "nav-special-1": "KOLEKSIONI",
      "nav-special-2": "ROMANCË NË RE",
      "nav-special-3": "QËNDRIM RIKUPERUES ONZE",
      "nav-special-4": "SHKËLQIMI I BUKURISË RINU",
      "nav-special-5": "VAUÇERË DHURATASH",
      "nav-contact": "KONTAKT",
      "nav-contact-1": "PYETJE TË SHPESHTA",
      "book-now": "Rezervo Tani",
      "hero-kicker": "DHOMA & APARTAMENTE",
      "hero-title": "DHOMAT E HOTELIT DERAND NÃ‹ PRISHTINÃ‹",
      "categories-kicker": "KATEGORITÃ‹ TONA EKSKLUZIVE TÃ‹ DHOMAVE",
      "categories-intro": "Po kÃ«rkoj",
      "categories-trigger": "tÃ« gjitha dhomat & suitat",
      "categories-item-1": "SuitÃ« Junior",
      "categories-item-2": "DhomÃ« Dyshe Superior",
      "categories-item-3": "DhomÃ« Dyshe Deluxe",
      "categories-item-4": "DhomÃ« Dyshe Premium",
      "categories-item-5": "DhomÃ« me dy krevate",
      "card-badge-1": "KOMODITET I KLASIT TE LARTE",
      "card-badge-2": "I PAKRAHASUESHEM",
      "card-badge-3": "LUKS I NIVELIT TE LARTE",
      "card-badge-4": "ELEGANCE E PERJETSHME",
      "card-badge-5": "KOMODITET I KLASIT TE LARTE",
      "card-name-1": "SuitÃ« Junior",
      "card-name-2": "DhomÃ« Dyshe Deluxe",
      "card-name-3": "DhomÃ« Superior me dy krevate",
      "card-name-4": "DhomÃ« Dyshe Premium",
      "card-name-5": "DhomÃ« Dyshe Superior",
      "about-eyebrow": "Hoteli Derand",
      "about-title": "NJE PERZGJEDHJE E SHKELQYER DHOMASH DHE SUITASH",
      "about-copy-1":
        "I vendosur ne zemren plot gjalleri te Prishtines, Derand Hotel ofron nje koleksion te kuruar akomodimesh te krijuara per te qene streha juaj, aty ku tradita takohet me luksin modern.",
      "about-copy-2":
        "Qofte per biznes apo per nje arratisje kulturore, dhomat tona - nga kategorite intime Superior deri te opsionet me te bollshme Deluxe dhe Premium - ofrojne nje ekuiliber te persosur mes stilit, komoditetit dhe elegances se qete.",
      "signature-text":
        "Firma Derand shtrihet ne te gjitha kategorite e dhomave tona, duke garantuar nivelin me te larte te mireqenies dhe luksit, pavaresisht zgjedhjes suaj.",
      "owner-title": "Menaxher i përgjithshëm",
      "showcase-1-subtitle": "NDJESI SOVRANE E MIRÃ‹QENIES",
      "showcase-1-title": "DHOMA DELUXE & <br />SUITA JUNIOR",
      "showcase-1-description":
        "Shijoni rehati luksoze nÃ« njÃ« atmosferÃ« elegante dhe relaksohuni me stil nÃ« zemÃ«r tÃ« qytetit.",
      "showcase-2-subtitle": "KOMODITET JETE EKSTRAVAGANT",
      "showcase-2-title": "Suita Premium & Twin",
      "showcase-2-description":
        "QÃ«ndroni nÃ« mÃ«nyrÃ« madhÃ«shtore nÃ« njÃ« ambient elegant nÃ« zemÃ«r tÃ« PrishtinÃ«s dhe bÃ«jeni qÃ«ndrimin tuaj nÃ« Derand Hotel njÃ« pÃ«rvojÃ« tÃ« paharrueshme.",
      "junior-hero-title": "Junior Suite nÃ« PrishtinÃ«",
      "junior-hero-brand": "Derand Hotel",
      "junior-kicker": "PÃ«rsosmÃ«ri e pastÃ«r",
      "junior-headline": "Junior Suite",
      "junior-preview-copy":
        "Junior Suitat e bollshme ofrojne komoditetin dhe cilesine qe prisni nga nje hotel me pese yje: hapesire elegante jetese, banjo me mermer dhe detaje te menduara me kujdes. Suitat zakonisht kane rreth 35 deri ne 45 metra katrore, me atmosfere te qete dhe pamje nga qyteti.",
      "junior-size-value": "35m²",
      "junior-size-label": "MadhÃ«sia",
      "junior-bed-value": "King size",
      "junior-bed-label": "Shtrati",
      "junior-concierge-value": "24 h",
      "junior-concierge-label": "ShÃ«rbim concierge",
      "junior-parking-value": "Parkim 24/7",
      "junior-parking-label": "Falas",
      "junior-water-value": "UjÃ«",
      "junior-water-label": "Falas",
      "junior-director-quote":
        "Junior Suitat tona vendosin nje standard te ri te luksit dhe mireqenies, duke nderthurur komoditetin e bollshem me elegance te perjetshme.",
      "junior-bath-note":
        "Proporcione te gjera dhe detaje te menduara i japin Suitave tona Junior nje atmosfere te qete. Ndricimi i ngrohte dhe mermeri ne banjo krijojne nje ndjesi relaksimi si ne spa.",
      "junior-director-name": "Derand Hotel PRISHTINA",
      "junior-director-role": "Menaxher i përgjithshëm",
      "culinary-kicker": "Hani dhe pini me stil",
      "culinary-title-line-1": "Përvojat më të mira",
      "culinary-title-line-2": "kulinarike",
      "learn-more": "MËSONI MË SHUMË",
      "rooms-offer-quote":
        "Bashkohuni me ne në zemrën e Prishtinës dhe na lini t'ju udhëzojmë në një udhëtim ku e kaluara e pasur dhe e tashmja dinamike e qytetit marrin jetë në çdo detaj.",
      "footer-powered": "Mundësuar nga",
      "newsletter-title": "Bëhuni pjesë e botës sonë",
      "newsletter-copy":
        "Merrni histori të përzgjedhura, oferta sezonale dhe ftesa private.",
      "newsletter-first-name": "EMRI",
      "newsletter-last-name": "MBIEMRI",
      "newsletter-email": "ADRESA E EMAILIT",
      "newsletter-agree": "Pajtohem me kushtet dhe politikën e privatësisë.",
      "newsletter-button": "REGJISTROHU",
      "contact-breadcrumb-title": "Na Kontaktoni",
      "contact-kicker": "Derand Hotel",
      "contact-title": "Le të krijojmë qëndrimin tuaj të përsosur",
      "contact-copy":
        "Na dërgoni mesazhin tuaj dhe ekipi ynë do t'ju përgjigjet me kujdes dhe shpejtësi.",
      "contact-arrival-kicker": "Kontakt dhe mbërritja",
      "contact-arrival-title": "Kontakt dhe mbërritja në Prishtinë",
      "contact-arrival-subtitle": "Mbërritja në Derand Hotel Prishtinë",
      "contact-arrival-p1":
        "Derand Hotel ndodhet në zemrën e qytetit dhe arrihet lehtësisht me format kryesore të transportit. Nëse vini me makinë, ndiqni shenjat drejt qendrës së Prishtinës.",
      "contact-arrival-p2":
        "Hoteli është i arritshëm nga Aeroporti Ndërkombëtar i Prishtinës me taksi dhe transfere private. Ekipi ynë është i gatshëm t'ju ndihmojë me udhëzime dhe mbështetje para mbërritjes.",
      "contact-showcase-title": "HOTELET KRYESORE",
      "contact-showcase-subtitle": "TË DERAND PRISHTINA",
      "contact-address-kicker": "Adresa",
      "contact-address-title": "Derand Hotel Prishtina",
      "contact-address-line": "Rr. Bekim Fehmiu 30, Prishtine 10000 Kosove",
      "contact-address-tel-label": "Tel.:",
      "contact-address-whatsapp-label": "Whatsapp:",
      "contact-address-whatsapp-open": "Hape ne aplikacion",
      "contact-address-email-label": "Email:",
      "contact-submit": "Dërgo mesazhin",
      "contact-field-name": "Emri i plotë",
      "contact-field-username": "Përdoruesi",
      "contact-field-email": "Adresa e emailit",
      "contact-field-subject": "Subjekti",
      "contact-field-message": "Shkruani mesazhin tuaj...",
      "footer-link-1": "Na kontaktoni",
      "footer-link-2": "Historia e Derand",
      "footer-link-3": "Kushtet e shÃ«rbimit",
      "footer-link-4": "Revista Derand",
      "footer-link-5": "Karriera",
      "footer-link-6": "Pyetje tÃ« shpeshta",
      "footer-link-7": "Politika e privatÃ«sisÃ«",
      "footer-link-8": "Pagesat",
      "footer-link-9": "Aplikacioni i mysafirÃ«ve",
      "footer-link-10": "Revista Derand",
      "footer-link-11": "Vendndodhja jonÃ«",
      "footer-guarantee-1":
        '<i class="fa fa-check"></i> Garancia e vlerÃ«s mÃ« tÃ« mirÃ«',
      "footer-guarantee-2":
        '<i class="fa fa-check"></i> Tarifa speciale pÃ«r anÃ«tarÃ«t e Leaders Club',
      "footer-guarantee-3":
        '<i class="fa fa-check"></i> Kushte fleksibile rezervimi',
      "policy-breadcrumb-title": "Politika e privatÃ«sisÃ«",
      "policy-hero-label": "Politika e privatÃ«sisÃ«",
      "policy-hero-title":
        "Ju falenderojme qe vizituat faqen e internetit te Derand Hotel!",
      "policy-sec-1": "I. Emri dhe adresa e kontrolluesit te te dhenave",
      "policy-sec-2": "II. Cilat informacione mbledhim?",
      "policy-sec-3": "III. Pse i mbledhim te dhenat tuaja?",
      "policy-sec-4": "IV. Si i mbrojme te dhenat tuaja?",
      "policy-sec-5": "V. Politika e rezervimit dhe pageses",
      "policy-sec-6": "VI. Te drejtat tuaja",
      "policy-sec-7": "VII. Sa gjate i ruajme te dhenat?",
      "policy-sec-8": "VIII. Na kontaktoni",
      "policy-contact-btn": "Na kontaktoni",
      "policy-p-lead":
        "Ne Derand Hotel, ne e vleresojme besimin tuaj dhe jemi te perkushtuar per mbrojtjen e te dhenave tuaja personale. Kjo politike shpjegon si i mbledhim, i perdorim dhe i mbrojme informacionet tuaja gjate qendrimit ose gjate perdorimit te sherbimeve tona.",
      "policy-p-1-intro":
        "Ne kuptim te Rregullores se Pergjithshme per Mbrojtjen e te Dhenave dhe ligjeve te tjera kombetare per mbrojtjen e te dhenave te shteteve anetare, si dhe dispozitave te tjera per mbrojtjen e te dhenave, kontrolluesi eshte:",
      "policy-p-2-1":
        "Informacion identifikues: Emri, mbiemri, data e lindjes dhe dokument identifikimi (ID ose Pasaporte), sic kerkohet nga ligjet lokale per regjistrimin e mysafireve.",
      "policy-p-2-2":
        "Te dhena kontakti: Numri i telefonit, adresa e emailit dhe adresa e banimit.",
      "policy-p-2-3":
        "Detaje rezervimi dhe pagese: Informacion i kartes kredit/debit, transferta bankare dhe historiku i qendrimit.",
      "policy-p-3-1":
        "Perpunimi i rezervimeve: Per te konfirmuar, ndryshuar ose menaxhuar qendrimin tuaj.",
      "policy-p-3-2":
        "Detyrime ligjore: Per te raportuar pranine e mysafireve tek autoritetet perkatese shteterore, sic kerkohet me ligj per sektorin e turizmit.",
      "policy-p-3-3":
        "Personalizimi i sherbimit: Per te ofruar preferencat e dhomes, kerkesat specifike ose sherbimet Concierge.",
      "policy-p-3-4":
        "Siguria: Perdorimi i sistemeve CCTV ne zonat publike te hotelit per sigurine e mysafireve dhe stafit.",
      "policy-p-4-1":
        "Siguria dixhitale: Te dhenat tuaja ruhen ne servere te sigurt dhe sisteme te mbrojtura menaxhimi.",
      "policy-p-4-2":
        "Qasje e kufizuar: Vetem personeli i autorizuar ka qasje ne informacionin tuaj personal per qellime te rrepta biznesi.",
      "policy-p-4-3":
        "Partnere te trete: Bashkepunojme me platforma rezervimi (si Booking.com ose Expedia). Sigurojme qe transferimi i te dhenave tuaja tek ne te kryhet ne menyre te sigurt.",
      "policy-p-5-1":
        "Anulimet: Derand Hotel zbaton politike strikte: rezervimet jane te paanulueshme dhe pagesat jane te pakthyeshme.",
      "policy-p-5-2":
        "Menyrat e pageses: Pranojme para ne dore, karta krediti, karta virtuale dhe transferta bankare.",
      "policy-p-6-intro":
        "Ne perputhje me legjislacionin ne fuqi per mbrojtjen e te dhenave personale, ju keni te drejte te:",
      "policy-p-6-li-1": "Kerkoni qasje ne te dhenat qe mbajme per ju.",
      "policy-p-6-li-2": "Kerkoni korrigjimin e informacionit te pasakte.",
      "policy-p-6-li-3":
        "Kerkoni fshirjen e te dhenave, pervec rasteve kur jemi te detyruar ligjerisht t'i ruajme ato (p.sh., per qellime financiare ose evidenca zyrtare).",
      "policy-p-7-1":
        "Ne i ruajme te dhenat tuaja vetem per aq kohe sa eshte e nevojshme per te permbushur qellimet e permendura me lart ose per te respektuar afatet ligjore, tatimore dhe administrative.",
      "policy-p-8-intro":
        "Nese keni pyetje ose deshironi te ushtroni te drejtat tuaja, ju lutem na kontaktoni:",
      "terms-breadcrumb-title": "Kushtet e sherbimit",
      "terms-hero-label": "Kushtet e sherbimit",
      "terms-hero-title": "Derand Hotel Prishtina",
      "terms-sec-2": "II. Pranimi i kushteve",
      "terms-sec-3": "III. Politika e rezervimit dhe pageses",
      "terms-sec-4": "IV. Rregullat e qendrimit (Check-in & Check-out)",
      "terms-sec-5": "V. Perdorimi i faqes",
      "terms-sec-6": "VI. Kufizimi i pergjegjesise",
      "terms-sec-7": "VII. Ligji ne fuqi",
      "terms-sec-8": "VIII. Na kontaktoni",
      "terms-p-lead":
        "Miresevini ne Derand Hotel! Duke perdorur faqen tone te internetit, sherbimet tona online, ose duke bere nje rezervim, ju pranoni kushtet dhe rregullat e meposhtme:",
      "terms-p-2-1":
        "Duke hyre ne faqen tone derandhotel.com ose duke rezervuar nje qendrim, ju pajtoheni plotesisht me keto kushte. Nese nuk pajtoheni me ndonje pjese te tyre, ju lutem nderprisni perdorimin e platformes sone.",
      "terms-p-3-1":
        "Menyra e rezervimit: Rezervimet mund te behen permes faqes sone zyrtare, agjencive te autorizuara online te udhetimit (OTA), ose duke kontaktuar hotelin direkt.",
      "terms-p-3-2":
        "Anulimet dhe kthimet: Derand Hotel zbaton nje politike strikte: te gjitha rezervimet jane te paanulueshme dhe pagesat te pakthyeshme.",
      "terms-p-3-3":
        "Menyrat e pageses: Pranojme para ne dore, karta kredit/debit, karta virtuale dhe transferta bankare.",
      "terms-p-4-1":
        "Identifikimi: Cdo mysafir duhet te paraqese nje dokument te vlefshem identifikimi (ID ose Pasaporte) ne ardhje.",
      "terms-p-4-2":
        "Orari: Orari i check-in dhe check-out duhet te respektohet sipas rregullave te hotelit per te siguruar ofrim te qete te sherbimeve.",
      "terms-p-4-3":
        "Pirja e duhanit: Pirja e duhanit brenda zonave te mbyllura te hotelit ndalohet rreptesisht, pervec zonave te caktuara.",
      "terms-p-5-1":
        "Perdorim personal: Permbajtja e kesaj faqeje (tekste, fotografi, logo) eshte prone e Derand Hotel dhe lejohet vetem per perdorim personal, jo-komercial.",
      "terms-p-5-2":
        "Ndalime: Kopjimi, shperndarja ose manipulimi i permbajtjes pa autorizim paraprak me shkrim ndalohet rreptesisht.",
      "terms-p-5-3":
        "Siguria: Perdoruesit nuk duhet te nderhyjne ne sigurine e faqes ose te tentojne qasje te paautorizuar ne te dhena.",
      "terms-p-6-1":
        "Derand Hotel nuk mban pergjegjesi per deme indirekte qe mund te vijne nga perdorimi i faqes sone ose nga nderprerje teknike te mundshme.",
      "terms-p-6-2":
        "Ne nuk garantojme qe informacioni ne faqe do te jete pa gabime ne cdo kohe, por jemi te perkushtuar ta perditesojme rregullisht.",
      "terms-p-7-1":
        "Keto kushte rregullohen nga ligjet ne fuqi ne Republiken e Kosoves. Per cdo mosmarreveshje qe nuk mund te zgjidhet me marreveshje te ndersjelle, gjykatat kompetente ne Prishtine kane juridiksion.",
      "terms-p-8-intro":
        "Nese keni pyetje ose deshironi te ushtroni te drejtat tuaja, ju lutem na kontaktoni:",
      "index-hero-title": "Shtëpia juaj e dytë",
      "index-mozart-h3": "PSE HOTELI DERAND ËSHTË ZGJEDHJA MË E MIRË?",
      "index-mozart-h4": "Infrastrukturë moderne dhe staf miqësor e mikpritës",
      "index-mozart-p":
        "Hotel Derand ofron një vendndodhje të shkëlqyer me akses të lehtë <br />drejt qendrës së qytetit dhe më gjerë. <br />Si një nga ndërtesat më të larta në Prishtinë, ofron një pamje unike të qytetit, infrastrukturë moderne dhe staf miqësor e mikpritës.<br />Me internet me shpejtësi të lartë dhe parkim falas, <br />këto janë vetëm disa nga arsyet pse Hoteli Derand është zgjedhja më e mirë për ju.",
      "index-events-kicker": "Partneritetet tona",
      "index-events-title": "Përvojat tona ekskluzive",
      "index-event-1": "Shkëlqim dhe mirëqenie",
      "index-event-2": "Ritme të gjalla të qytetit",
      "index-event-3": "Rimëkëmbje elitare e trupit",
      "index-event-4": "Eksploroni lartësitë",
      "index-event-5": "Harmoni e brendshme dhe rrjedhje",
      "index-event-6": "Jetë aktive dhe balancë",
      "index-event-7": "Aventura malore",
      "index-rooms-kicker": "Luks në çdo nivel",
      "index-rooms-title": "Dhoma dhe suitat",
      "index-link-learn": "Mësoni më shumë",
      "index-welcome-kicker": "PËRSHËNDETJE, PRISHTINË",
      "index-welcome-title": "Elegancë e rafinuar dhe komoditet",
      "index-welcome-p":
        "Çdo qëndrim është një udhëtim i kuruar elegancë, ku stili i përjetshëm takohet me artin e mikpritjes së rafinuar.",
      "index-health-kicker": "Prishtina",
      "index-health-title": "Qëndroni. Relaksohuni. Shijoni.",
      "index-fac-kicker": "Ideale për qëndrimin tuaj",
      "index-fac-title": "Shërbimet dhe ambientet në Derand",
      "index-fac-chip-1": "Wi-Fi falas",
      "index-fac-chip-2": "Parkim falas",
      "index-fac-chip-3": "Banjo private",
      "index-fac-chip-4": "Kondicioner ajri",
      "index-fac-chip-5": "Pamje nga qyteti",
      "index-fac-chip-6": "Dhoma pa duhan",
      "index-fac-chip-7": "TV me ekran të sheshtë",
      "index-fac-chip-8": "Recepsion 24 orë",
      "index-fac-acc1-sum": "Banja dhe dhoma e gjumit",
      "index-fac-acc1-p":
        "Letër higjienike, peshqirë, shapka, tualet, kozmetikë falas, rrobë banje, tharëse flokësh, dush, çarçafë, garderobë ose dollap, zgjues, dollap i madh.",
      "index-fac-acc2-sum": "Komoditetet e dhomës dhe zona e ndenjes",
      "index-fac-acc2-p":
        "Tryezë, raft rrobash, produkte pastrimi, tharëse, ibrik elektrik, çaj dhe kafe, izolim akustik, ngrohje, ventilator, hekurosje, pres për kostum.",
      "index-fac-acc3-sum": "Media, internet dhe parkim",
      "index-fac-acc3-p":
        "Kanale kabllore dhe satelitore, radio, telefon, TV me ekran të sheshtë, Wi-Fi falas kudo, parkim privat falas në vend pa nevojë për rezervim.",
      "index-fac-acc4-sum": "Shërbime dhe siguri",
      "index-fac-acc4-p":
        "Koncierg, shërbim zgjimi, faturë, recepsion 24 orë, kamera në zona të përbashkëta dhe jashtë, alarm tymi, alarm sigurie, kasafortë, siguri 24 orë.",
      "index-fac-acc5-sum": "Akses dhe gjuhë",
      "index-fac-acc5-p":
        "Katet e sipërme janë të arritshme me ashensor. Gjuhët: anglisht, spanjisht, turqisht.",
      "index-quote-text":
        "Një qëndrim në Derand Hotel Prishtina me siguri e ngrit përvojën e kujtdo në Prishtinë në një nivel të paharruar.",
      "index-quote-name": "DERAND HOTEL PRISHTINA",
      "index-quote-role": "Menaxher i përgjithshëm",
      "index-testimonials-heading": "Çfarë thonë mysafirët tanë:",
      "index-guest-source": "Burimi",
      "index-book-room": "Rezervoni dhomën tuaj tani",
      "index-ig-line": "Na ndiqni në <strong>Instagram</strong>",
      "index-footer-address": "Rr. Bekim Fehmiu 30, 10000 Prishtinë, Kosovë",
      "index-t-prev": "Vlerësimi i mëparshëm",
      "index-t-next": "Vlerësimi tjetër",
      "index-events-prev": "Përvojat e mëparshme",
      "index-events-next": "Përvojat e ardhshme",
      "index-stars-aria": "5 nga 5 yje",
      "index-guest-0-title": "Vendndodhje e shkëlqyer dhe dhoma të bukura",
      "index-guest-0-body":
        "Vendndodhje e shkëlqyer, staf shumë i mirë, dhoma komode dhe çmime të arsyeshme. Çfarë më shumë mund të dëshirohet?",
      "index-guest-0-room": "Dhomë dyshe superior",
      "index-guest-0-loc": "Shtetet e Bashkuara",
      "index-guest-1-title": "Dhoma të pastra në një vendndodhje ideale",
      "index-guest-1-body":
        "Vendndodhje shumë e mirë, dhoma të pastra dhe me hapësirë të mjaftueshme, si dhe raport i shkëlqyer çmim–cilësi gjatë gjithë qëndrimit.",
      "index-guest-1-room": "Dhomë dyshe superior",
      "index-guest-1-loc": "Mbretëria e Bashkuar",
      "index-guest-2-title": "Mikpritje e ngrohtë dhe dhoma pa të meta",
      "index-guest-2-body":
        "Staf miqësor, dhoma jashtëzakonisht të pastra dhe një qëndrim shumë komod në një vendndodhje perfekte.",
      "index-guest-2-room": "Dhomë dyshe superior",
      "index-guest-2-loc": "Mbretëria e Bashkuar",
      "index-guest-3-title": "Dhoma moderne me shërbim miqësor",
      "index-guest-3-body":
        "Dhoma moderne dhe të pastra, staf i sjellshëm dhe pritje e shpejtë me shërbim të shkëlqyer.",
      "index-guest-3-room": "Dhomë dyshe deluxe",
      "index-guest-3-loc": "Slloveni",
      "index-guest-4-title": "Shërbim i shkëlqyer dhe qëndrim komod",
      "index-guest-4-body":
        "Mikpritje e shkëlqyer, ekip ndihmës dhe dhoma shumë komode nga fillimi deri në fund.",
      "index-guest-4-room": "Dhomë dyshe deluxe",
      "index-guest-4-loc": "Oman",
      "deluxe-preview-copy":
        "Hyni në luks me Dhomën tonë Deluxe dyshe. E bollshme dhe e pajisur me stil, ajo ka një shtrat të rehatshëm dopio dhe ofron mundësinë e një shtrese shtesë sipas kërkesës. E menduar për udhëtarët kërkues që kërkojnë komoditet dhe lehtësi, kjo dhomë është një ndërlidhje e përsosur e sofistikimit dhe përshtatshmërisë.",
      "deluxe-size-value": "30m²",
      "deluxe-size-label": "Madhësia",
      "deluxe-bed-value": "King size",
      "deluxe-bed-label": "Shtrati",
      "deluxe-concierge-value": "24 h",
      "deluxe-concierge-label": "Shërbim concierge",
      "deluxe-parking-value": "Parkim 24/7",
      "deluxe-parking-label": "Falas",
      "deluxe-water-value": "Ujë",
      "deluxe-water-label": "Falas",
      "deluxe-director-quote":
        "Dhomat tona Deluxe e ngren standardin e jetesës së rafinuar, duke përzier komoditetin e bollshëm me elegancën e përjetshme.",
      "deluxe-bath-note":
        "Tekstile te shtresuara, drite e bute prane shtratit dhe nje kend i mire pune i bejne dhomat Deluxe nje strehe te qete ne qender te qytetit, per pushim dhe pune te fokusuar.",
      "deluxe-moments-line-1": "Momentet e ndara këtu",
      "deluxe-moments-line-2": "shndërrohen në kujtime të qëndrueshme",
    },
  };

  // Extend translations with FAQ keys (EN/DE/AL)
  (function extendFaqTranslations() {
    var faq = {
      en: {
        "faq-kicker": "Frequently Asked Questions",
        "faq-title": "Questions and Answers",
        "faq-lead":
          "We're pleased to provide you with answers to the most frequently asked questions. If we should've missed one in particular, don't hesitate to let us know at any point in time. Thank you very much.",
        "faq-sec-1": "General Information About Derand Hotel Prishtina",
        "faq-q-1": "What is the address of Derand Hotel Prishtina?",
        "faq-a-1":
          "Derand Hotel is located at Bekim Fehmiu Str. 30, Prishtina 10000, Kosovo, in a central area with easy city access.",
        "faq-q-2":
          "How far is Derand Hotel Prishtina from the airport or main train station?",
        "faq-a-2":
          "The hotel is a short drive from Prishtina International Airport. Transfer time depends on traffic, but many guests arrive within around 20-30 minutes.",
        "faq-q-3": "Does Derand Hotel offer an airport shuttle service?",
        "faq-a-3":
          "We can assist with airport transfer arrangements upon request. Please contact us before arrival so we can organize the best option for your schedule.",
        "faq-q-4": "Does Derand Hotel offer valet parking?",
        "faq-a-4": "Yes, we do offer valet parking for our guests.",
        "faq-q-5": "Is Derand Hotel wheelchair accessible?",
        "faq-a-5":
          "Yes, accessibility support is available in key guest areas. Please share your requirements in advance so we can prepare your stay comfortably.",
        "faq-q-6": "Is smoking allowed at Derand Hotel?",
        "faq-a-6":
          "Smoking is not permitted in non-smoking rooms and indoor public areas. Designated smoking areas are available outside.",
        "faq-q-7": "What time is check-in and check-out?",
        "faq-a-7":
          "Standard check-in is from 15:00 and check-out is by 11:00. Early check-in or late check-out may be possible depending on availability.",
        "faq-q-8": "Does Derand Hotel Prishtina offer Wi-Fi?",
        "faq-a-8":
          "Yes, complimentary high-speed Wi-Fi is available throughout the hotel, including guest rooms and common areas.",
        "faq-q-9":
          "Does Derand Hotel Prishtina offer guided tours or experiences in the area?",
        "faq-a-9":
          "Yes, we can help arrange local guided tours and city experiences through trusted partners. Please contact reception for options and availability.",
        "faq-q-10":
          "Are guided tours of historic sites in Prishtina available?",
        "faq-a-10":
          "Yes, historical and cultural tours can be arranged on request. Our team will gladly assist with recommendations and booking.",
        "faq-q-31": "What is the history of Derand Hotel Prishtina?",
        "faq-a-31":
          "Derand Hotel is a long-standing family-run property in Prishtina, known for warm hospitality, elegant interiors, and personalized service.",
        "faq-q-32":
          "Is medical care available in case of emergency at Derand Hotel Prishtina?",
        "faq-a-32":
          "Yes, in case of emergency our team can immediately contact local medical services and assist guests with urgent support.",
        "faq-q-33":
          "Does Derand Hotel Prishtina offer customized travel itineraries?",
        "faq-a-33":
          "Yes, our team can help tailor personalized city and regional itineraries based on your interests, schedule, and preferences.",
        "faq-q-34":
          "What does Derand Hotel Prishtina recommend for an exclusive shopping experience in Prishtina?",
        "faq-a-34":
          "We recommend Albi Mall, Prishtina Mall, and Royal Mall for an excellent shopping experience in Prishtina.",
        "faq-q-35":
          "What activities does Derand Hotel Prishtina recommend for families and couples?",
        "faq-a-35":
          "Popular options include city sightseeing, cultural landmarks, local dining experiences, and nearby day trips. We can suggest activities according to your travel style.",
        "faq-sec-2": "Rooms & Suites",
        "faq-q-11":
          "Which room and suite categories are available at Derand Hotel Prishtina?",
        "faq-a-11":
          "Derand Hotel offers Junior, Superior, Deluxe, Twin, and Premium room categories.",
        "faq-q-12":
          "What amenities can I expect in the room at Derand Hotel Prishtina?",
        "faq-a-12":
          "Rooms include modern essentials such as complimentary Wi-Fi, air-conditioning, a private bathroom, TV, minibar, and selected in-room comfort features.",
        "faq-q-13": "Do all rooms at Derand Hotel Prishtina have a view?",
        "faq-a-13":
          "Room views vary by category and location in the building. Some rooms offer broader city views, while others face quieter areas.",
        "faq-q-14": "Are the rooms air-conditioned at Derand Hotel Prishtina?",
        "faq-a-14":
          "Yes, guest rooms are equipped with air-conditioning for comfort in all seasons.",
        "faq-q-15": "Is room service available at Derand Hotel Prishtina?",
        "faq-a-15":
          "Yes, room service is available for selected menu items and service hours.",
        "faq-sec-3": "Reservations & Booking",
        "faq-q-16": "How can I make a reservation at Derand Hotel?",
        "faq-a-16":
          "We recommend booking directly through our website for the fastest and most convenient reservation process. You may also book via our mobile application, online travel platforms such as Booking.com and Expedia, or by contacting the hotel via email or phone.",
        "faq-q-17": "Is a deposit required to secure a booking?",
        "faq-a-17":
          "A deposit is required upon arrival at the hotel. It may be provided in cash or by credit card and must be supported by a valid ID card or passport.",
        "faq-q-18": "Which payment methods are accepted at the hotel?",
        "faq-a-18":
          "We accept cash, credit cards, virtual cards, and bank transfers.",
        "faq-q-19": "How can I modify or cancel an existing reservation?",
        "faq-a-19":
          "Reservations made through OTA platforms can be modified directly through the respective platform. For direct reservations, please contact us by email or phone for assistance.",
        "faq-sec-4": "Wellness & Recovery",
        "faq-q-20":
          "What wellness treatments are available through your partners?",
        "faq-a-20":
          "Guests can enjoy premium aesthetic and health treatments. Rinu MedSpa offers advanced facial and body treatments, while Onze Recovery specializes in physical recovery, including cryotherapy, IV drips, and sports massages to rejuvenate your body.",
        "faq-q-21":
          "Do I need to book in advance for a session at Rinu MedSpa or Onze Recovery?",
        "faq-a-21":
          "Yes, we highly recommend booking at least 24 hours in advance. Our reception desk can handle all the arrangements to ensure you get your preferred time slot.",
        "faq-q-22": "How can Onze Recovery enhance my stay?",
        "faq-a-22":
          "Onze Recovery specializes in professional physical recovery. Whether you have had a long day of work or an energetic night at Noya, you can enjoy recovery therapies, sports massages, and treatments designed to restore your energy quickly.",
        "faq-q-23": "What services are available at Rinu MedSpa?",
        "faq-a-23":
          "Rinu MedSpa offers advanced aesthetic treatments, including specialized face and body skincare. Using the latest technology, they help you look and feel your best throughout your stay.",
        "faq-sec-5": "Nightlife & Entertainment",
        "faq-q-24": "Where is Noya Nightlife located?",
        "faq-a-24":
          "Noya Nightlife is located on the rooftop floor of our hotel, offering guests a panoramic city view.",
        "faq-q-25": "What kind of atmosphere does Noya offer?",
        "faq-a-25":
          "Noya blends elegance with entertainment. In the evening it is an ideal setting for refined dining, then transitions into a vibrant nightlife destination.",
        "faq-q-26": "Is a prior reservation required for Noya?",
        "faq-a-26":
          "Due to high demand and exclusivity, we strongly recommend booking in advance, especially on weekends. Hotel guests enjoy priority reservations through reception.",
        "faq-q-27": "Does Noya offer space for private or corporate events?",
        "faq-a-27":
          "Yes, both the terrace and interior are available for private bookings, birthday celebrations, and corporate events in a prestigious rooftop setting.",
        "faq-sec-6": "Our Culinary Partnerships",
        "faq-q-28": "What defines the culinary experience at Derand Hotel?",
        "faq-a-28":
          "Our gastronomic philosophy is built on excellence and local soul. Through our exclusive partnership with Soma Slow Food, we bring the finest organic and artisanal ingredients to your table, crafted for those who appreciate mindful and healthy dining.",
        "faq-q-29": "Looking for a bold and modern dining experience?",
        "faq-a-29":
          "We invite you to discover Comandante Marko. Our collaboration offers guests a journey into daring flavors and contemporary cuisine, perfect for those seeking a culinary experience with a strong, unforgettable character.",
        "faq-q-30":
          "Can I reserve a table at your partner restaurants through the hotel?",
        "faq-a-30":
          "Absolutely. As our guest, you enjoy priority reservations at both Soma and Comandante Marko. Our concierge team is at your service to ensure you get the best seat in the house.",
        "faq-cta":
          "Any open questions? Please send them to us. We will be glad to answer them.",
      },
      de: {
        "faq-kicker": "Häufig gestellte Fragen",
        "faq-title": "Fragen und Antworten",
        "faq-lead":
          "Gern beantworten wir die am häufigsten gestellten Fragen. Falls etwas fehlt, lassen Sie es uns jederzeit wissen. Vielen Dank.",
        "faq-sec-1": "Allgemeine Informationen über das Derand Hotel Prishtina",
        "faq-q-1": "Wie lautet die Adresse des Derand Hotel Prishtina?",
        "faq-a-1":
          "Das Derand Hotel befindet sich in der Bekim-Fehmiu-Str. 30, 10000 Prishtina, Kosovo, zentral gelegen mit guter Anbindung.",
        "faq-q-2":
          "Wie weit ist das Derand Hotel Prishtina vom Flughafen oder Hauptbahnhof entfernt?",
        "faq-a-2":
          "Der internationale Flughafen Prishtina ist mit dem Auto schnell erreichbar. Je nach Verkehr dauert die Fahrt meist etwa 20–30 Minuten.",
        "faq-q-3": "Bietet das Derand Hotel einen Flughafentransfer an?",
        "faq-a-3":
          "Gern unterstützen wir Sie auf Anfrage bei der Organisation eines Transfers. Bitte kontaktieren Sie uns vor der Anreise, damit wir die beste Option für Ihren Zeitplan arrangieren können.",
        "faq-q-4": "Bietet das Derand Hotel Valet-Parken an?",
        "faq-a-4": "Ja, Valet-Parken steht unseren Gästen zur Verfügung.",
        "faq-q-5": "Ist das Derand Hotel barrierefrei?",
        "faq-a-5":
          "Ja, in wichtigen Gästebereichen ist Barrierefreiheit gegeben. Bitte teilen Sie uns Ihre Anforderungen im Voraus mit, damit wir Ihren Aufenthalt angenehm vorbereiten können.",
        "faq-q-6": "Ist Rauchen im Derand Hotel erlaubt?",
        "faq-a-6":
          "Rauchen ist in Nichtraucherzimmern und in öffentlichen Innenbereichen nicht gestattet. Draußen gibt es ausgewiesene Raucherbereiche.",
        "faq-q-7": "Wann sind Check-in und Check-out?",
        "faq-a-7":
          "Der Check-in ist ab 15:00 Uhr möglich, der Check-out bis spätestens 11:00 Uhr. Ein früherer Check-in oder späterer Check-out ist je nach Verfügbarkeit möglich.",
        "faq-q-8": "Bietet das Derand Hotel Prishtina WLAN an?",
        "faq-a-8":
          "Ja, im gesamten Hotel – inklusive Zimmern und öffentlichen Bereichen – steht kostenloses Highspeed-WLAN zur Verfügung.",
        "faq-q-9":
          "Bietet das Derand Hotel Prishtina geführte Touren oder Erlebnisse in der Umgebung an?",
        "faq-a-9":
          "Ja, wir organisieren gern Stadttouren und Erlebnisse mit vertrauenswürdigen Partnern. Bitte wenden Sie sich an die Rezeption für Optionen und Verfügbarkeit.",
        "faq-q-10":
          "Gibt es geführte Touren zu historischen Stätten in Prishtina?",
        "faq-a-10":
          "Ja, historische und kulturelle Touren können auf Anfrage arrangiert werden. Unser Team hilft gern mit Empfehlungen und Buchungen.",
        "faq-q-31": "Wie lautet die Geschichte des Derand Hotel Prishtina?",
        "faq-a-31":
          "Das Derand Hotel ist ein traditionsreiches, familiengeführtes Haus in Prishtina, bekannt für herzliche Gastfreundschaft, elegante Innenräume und persönlichen Service.",
        "faq-q-32":
          "Steht im Notfall medizinische Hilfe im Derand Hotel Prishtina zur Verfügung?",
        "faq-a-32":
          "Ja, im Notfall kann unser Team umgehend örtliche medizinische Dienste kontaktieren und Gäste mit dringender Unterstützung versorgen.",
        "faq-q-33":
          "Bietet das Derand Hotel Prishtina maßgeschneiderte Reiseprogramme an?",
        "faq-a-33":
          "Ja, wir erstellen gern personalisierte Stadt- und Regionalprogramme – abgestimmt auf Ihre Interessen, Ihren Zeitplan und Ihre Wünsche.",
        "faq-q-34":
          "Welche Empfehlungen gibt das Derand Hotel Prishtina für exklusives Shopping?",
        "faq-a-34":
          "Wir empfehlen Albi Mall, Prishtina Mall und Royal Mall für ein ausgezeichnetes Einkaufserlebnis in Prishtina.",
        "faq-q-35":
          "Welche Aktivitäten empfiehlt das Derand Hotel Prishtina für Familien und Paare?",
        "faq-a-35":
          "Beliebt sind Stadtrundgänge, Kulturdenkmäler, lokale Gastronomie und Tagesausflüge in die Umgebung. Gern beraten wir Sie individuell.",
        "faq-sec-2": "Zimmer & Suiten",
        "faq-q-11":
          "Welche Zimmer- und Suiten-Kategorien sind im Derand Hotel Prishtina verfügbar?",
        "faq-a-11":
          "Zur Auswahl stehen Junior, Superior, Deluxe, Twin und Premium.",
        "faq-q-12":
          "Welche Annehmlichkeiten bietet mein Zimmer im Derand Hotel Prishtina?",
        "faq-a-12":
          "Zimmer mit kostenlosem WLAN, Klimaanlage, privatem Bad, TV, Minibar sowie ausgewählten Komfortmerkmalen.",
        "faq-q-13":
          "Haben alle Zimmer im Derand Hotel Prishtina eine Aussicht?",
        "faq-a-13":
          "Die Aussicht variiert je nach Kategorie und Lage im Gebäude – einige Zimmer bieten Stadtblick, andere liegen ruhiger.",
        "faq-q-14": "Sind die Zimmer im Derand Hotel Prishtina klimatisiert?",
        "faq-a-14":
          "Ja, die Gästezimmer sind für alle Jahreszeiten klimatisiert.",
        "faq-q-15": "Gibt es im Derand Hotel Prishtina Zimmerservice?",
        "faq-a-15":
          "Ja, Zimmerservice ist für ausgewählte Gerichte und Servicezeiten verfügbar.",
        "faq-sec-3": "Reservierungen & Buchung",
        "faq-q-16": "Wie kann ich im Derand Hotel reservieren?",
        "faq-a-16":
          "Am schnellsten über unsere Website. Alternativ per App, über Plattformen wie Booking.com/Expedia oder direkt per E-Mail/Telefon.",
        "faq-q-17": "Ist eine Anzahlung zur Buchungssicherung erforderlich?",
        "faq-a-17":
          "Bei Ankunft ist eine Kaution in bar oder per Kreditkarte mit gültigem Ausweis/Reisepass zu hinterlegen.",
        "faq-q-18": "Welche Zahlungsmethoden werden akzeptiert?",
        "faq-a-18":
          "Wir akzeptieren Barzahlung, Kreditkarten, virtuelle Karten und Banküberweisungen.",
        "faq-q-19":
          "Wie ändere oder storniere ich eine bestehende Reservierung?",
        "faq-a-19":
          "OTA-Buchungen bitte direkt auf der jeweiligen Plattform ändern. Für Direktbuchungen kontaktieren Sie uns per E-Mail oder Telefon.",
        "faq-sec-4": "Wellness & Regeneration",
        "faq-q-20": "Welche Wellness-Behandlungen gibt es bei Ihren Partnern?",
        "faq-a-20":
          "Rinu MedSpa bietet fortschrittliche Gesichts- und Körperbehandlungen; Onze Recovery ist spezialisiert auf physische Regeneration inkl. Kryotherapie, Infusionen und Sportmassagen.",
        "faq-q-21":
          "Sollte ich Termine bei Rinu MedSpa oder Onze Recovery vorab buchen?",
        "faq-a-21":
          "Ja, wir empfehlen eine Buchung mindestens 24 Stunden im Voraus. Die Rezeption organisiert gern Ihren Wunschtermin.",
        "faq-q-22": "Wie kann Onze Recovery meinen Aufenthalt bereichern?",
        "faq-a-22":
          "Mit professioneller Regeneration – ideal nach langen Arbeitstagen oder erlebnisreichen Abenden bei Noya.",
        "faq-q-23": "Welche Leistungen bietet Rinu MedSpa?",
        "faq-a-23":
          "Hochwertige ästhetische Behandlungen für Gesicht und Körper mit modernster Technik – für Ihr bestes Wohlbefinden.",
        "faq-sec-5": "Nachtleben & Unterhaltung",
        "faq-q-24": "Wo befindet sich Noya Nightlife?",
        "faq-a-24":
          "Noya Nightlife liegt auf der Dachterrasse unseres Hotels und bietet einen Panoramablick über die Stadt.",
        "faq-q-25": "Welche Atmosphäre bietet Noya?",
        "faq-a-25":
          "Eleganz trifft Entertainment: Abends feines Dining, später ein lebendiger Nightlife-Hotspot.",
        "faq-q-26": "Ist für Noya eine Reservierung erforderlich?",
        "faq-a-26":
          "Aufgrund der hohen Nachfrage empfehlen wir eine Reservierung im Voraus, besonders am Wochenende. Hotelgäste erhalten Priorität über die Rezeption.",
        "faq-q-27":
          "Bietet Noya Räumlichkeiten für private oder geschäftliche Events?",
        "faq-a-27":
          "Ja, Terrasse und Innenbereich sind für private Feiern, Geburtstage und Firmenevents verfügbar.",
        "faq-sec-6": "Unsere kulinarischen Partnerschaften",
        "faq-q-28": "Was zeichnet die Kulinarik im Derand Hotel aus?",
        "faq-a-28":
          "Exzellenz und lokaler Charakter: Mit Soma Slow Food bringen wir feinste Bio- und Manufakturprodukte an Ihren Tisch – bewusst und gesund.",
        "faq-q-29": "Suchen Sie ein mutiges, modernes Dining-Erlebnis?",
        "faq-a-29":
          "Entdecken Sie Comandante Marko: eine Reise in ausdrucksstarke Aromen und zeitgenössische Küche – unvergesslich und charakterstark.",
        "faq-q-30":
          "Kann ich über das Hotel einen Tisch bei den Partnerrestaurants reservieren?",
        "faq-a-30":
          "Selbstverständlich – als unser Gast erhalten Sie bevorzugte Reservierungen bei Soma und Comandante Marko. Unser Concierge kümmert sich gern darum.",
        "faq-cta": "Offene Fragen? Schreiben Sie uns – wir antworten gern.",
      },
      al: {
        "faq-kicker": "Pyetje të shpeshta",
        "faq-title": "Pyetje dhe përgjigje",
        "faq-lead":
          "Me kënaqësi ofrojmë përgjigje për pyetjet më të shpeshta. Nëse kemi lënë diçka pa prekur, na njoftoni në çdo kohë. Faleminderit.",
        "faq-sec-1":
          "Informacione të përgjithshme rreth Derand Hotel Prishtina",
        "faq-q-1": "Cila është adresa e Derand Hotel Prishtina?",
        "faq-a-1":
          "Derand Hotel ndodhet në Rr. Bekim Fehmiu 30, 10000 Prishtinë, Kosovë, në një zonë qendrore me qasje të lehtë në qytet.",
        "faq-q-2":
          "Sa larg është Derand Hotel Prishtina nga aeroporti apo stacioni kryesor i trenit?",
        "faq-a-2":
          "Aeroporti Ndërkombëtar i Prishtinës është vetëm një udhëtim i shkurtër me makinë. Në varësi të trafikut, shumica mbërrijnë për rreth 20–30 minuta.",
        "faq-q-3": "A ofron Derand Hotel shërbim transferte nga aeroporti?",
        "faq-a-3":
          "Ne mund të ndihmojmë me organizimin e transferteve sipas kërkesës. Ju lutemi na kontaktoni para mbërritjes për opsionin më të përshtatshëm për orarin tuaj.",
        "faq-q-4": "A ofron Derand Hotel parkim me valet?",
        "faq-a-4":
          "Po, parkimi me valet është i disponueshëm për mysafirët tanë.",
        "faq-q-5":
          "A është Derand Hotel i përshtatshëm për persona me aftësi të kufizuara?",
        "faq-a-5":
          "Po, mbështetja për aksesueshmëri është e disponueshme në zonat kryesore. Ju lutemi na tregoni paraprakisht kërkesat tuaja që ta përgatisim qëndrimin tuaj sa më komod.",
        "faq-q-6": "A lejohet duhani në Derand Hotel?",
        "faq-a-6":
          "Nuk lejohet pirja e duhanit në dhomat jo-duhanpirëse dhe në hapësirat e brendshme publike. Ka zona të caktuara jashtë.",
        "faq-q-7": "Cilat janë oraret e check-in dhe check-out?",
        "faq-a-7":
          "Check-in standard fillon nga ora 15:00; check-out deri në ora 11:00. Hyrja e hershme ose dalja e vonshme mund të jetë e mundur, sipas disponueshmërisë.",
        "faq-q-8": "A ofron Derand Hotel Prishtina Wi-Fi?",
        "faq-a-8":
          "Po, Wi-Fi me shpejtësi të lartë ofrohet falas në të gjithë hotelin, përfshirë dhomat dhe hapësirat e përbashkëta.",
        "faq-q-9":
          "A ofron Derand Hotel Prishtina ture të udhëzuara ose përvoja në zonë?",
        "faq-a-9":
          "Po, ne ndihmojmë me organizimin e tureve lokale dhe përvojave në qytet përmes partnerëve të besueshëm. Kontaktoni recepsionin për opsione dhe disponueshmëri.",
        "faq-q-10": "A ka ture të udhëzuara në sitet historike të Prishtinës?",
        "faq-a-10":
          "Po, turet historike dhe kulturore mund të organizohen sipas kërkesës. Ekipi ynë do të ndihmojë me rekomandime dhe rezervime.",
        "faq-q-31": "Cila është historia e Derand Hotel Prishtina?",
        "faq-a-31":
          "Derand Hotel është një hotel familjar me traditë në Prishtinë, i njohur për mikpritje të ngrohtë, ambiente elegante dhe shërbim të personalizuar.",
        "faq-q-32":
          "A ofrohet ndihmë mjekësore në rast emergjence në Derand Hotel Prishtina?",
        "faq-a-32":
          "Po, në rast urgjence, ekipi ynë kontakton menjëherë shërbimet lokale mjekësore dhe asiston mysafirët me mbështetje urgjente.",
        "faq-q-33":
          "A ofron Derand Hotel Prishtina itinerare të personalizuara udhëtimi?",
        "faq-a-33":
          "Po, mund të krijojmë itinerare të personalizuara për qytetin dhe rajonin sipas interesave, orarit dhe preferencave tuaja.",
        "faq-q-34":
          "Çfarë rekomandon Derand Hotel Prishtina për një përvojë ekskluzive blerjesh?",
        "faq-a-34":
          "Rekomandojmë Albi Mall, Prishtina Mall dhe Royal Mall për një përvojë të shkëlqyer blerjesh në Prishtinë.",
        "faq-q-35":
          "Cilat aktivitete rekomandon Derand Hotel Prishtina për familje dhe çifte?",
        "faq-a-35":
          "Opsionet e njohura përfshijnë shëtitje në qytet, monumente kulturore, gastronomi lokale dhe ekskursione ditore afër. Ne sugjerojmë sipas stilit tuaj të udhëtimit.",
        "faq-sec-2": "Dhoma & suite",
        "faq-q-11":
          "Cilat kategori dhomash e suitesh janë në dispozicion në Derand Hotel Prishtina?",
        "faq-a-11":
          "Derand Hotel ofron kategori Junior, Superior, Deluxe, Twin dhe Premium.",
        "faq-q-12":
          "Çfarë komoditetesh mund të pres në dhomë në Derand Hotel Prishtina?",
        "faq-a-12":
          "Dhomat përfshijnë Wi-Fi falas, kondicioner, banjo private, TV, minibar dhe komoditete të zgjedhura.",
        "faq-q-13": "A kanë të gjitha dhomat në Derand Hotel Prishtina pamje?",
        "faq-a-13":
          "Pamja ndryshon sipas kategorisë dhe vendndodhjes. Disa dhoma ofrojnë pamje të gjera të qytetit, të tjerat janë më të qeta.",
        "faq-q-14": "A janë të kondicionuara dhomat në Derand Hotel Prishtina?",
        "faq-a-14":
          "Po, dhomat janë të pajisura me kondicioner për rehati në çdo sezon.",
        "faq-q-15":
          "A ka shërbim në dhomë (room service) në Derand Hotel Prishtina?",
        "faq-a-15":
          "Po, shërbimi në dhomë ofrohet për artikuj dhe orare të caktuara.",
        "faq-sec-3": "Rezervime & pagesa",
        "faq-q-16": "Si mund të bëj një rezervim në Derand Hotel?",
        "faq-a-16":
          "Mënyra më e shpejtë është përmes faqes sonë. Mund të rezervoni edhe me aplikacion, në platforma si Booking.com/Expedia, ose duke kontaktuar hotelin me email ose telefon.",
        "faq-q-17": "A kërkohet një depozitë për të siguruar rezervimin?",
        "faq-a-17":
          "Po, në ardhje kërkohet një depozitë në para të gatshme ose me kartë krediti, së bashku me dokument identifikimi të vlefshëm.",
        "faq-q-18": "Cilat mënyra pagese pranohen në hotel?",
        "faq-a-18":
          "Pranojmë para në dorë, karta krediti, karta virtuale dhe transferta bankare.",
        "faq-q-19": "Si mund të modifikoj ose anuloj një rezervim ekzistues?",
        "faq-a-19":
          "Rezervimet në OTA mund të ndryshohen në vetë platformën. Për rezervime direkte, na kontaktoni me email ose telefon.",
        "faq-sec-4": "Wellness & rikuperim",
        "faq-q-20":
          "Cilat trajtime wellness janë të disponueshme përmes partnerëve tuaj?",
        "faq-a-20":
          "Rinu MedSpa ofron trajtime të avancuara për fytyrën dhe trupin; Onze Recovery është e specializuar në rikuperim fizik, përfshirë krioterapi, infuzione dhe masazhe sportive.",
        "faq-q-21":
          "A duhet të rezervoj paraprakisht për një sesion në Rinu MedSpa ose Onze Recovery?",
        "faq-a-21":
          "Po, rekomandojmë të rezervoni të paktën 24 orë përpara. Recepsioni organizon me kënaqësi orarin tuaj të preferuar.",
        "faq-q-22": "Si mund ta përmirësojë Onze Recovery qëndrimin tim?",
        "faq-a-22":
          "Me rikuperim profesional – ideal pas ditëve të gjata pune ose një nate aktive në Noya.",
        "faq-q-23": "Cilat shërbime ofron Rinu MedSpa?",
        "faq-a-23":
          "Trajtime estetike cilësore për fytyrë dhe trup me teknologjitë më të fundit – për t'u ndjerë në formën tuaj më të mirë.",
        "faq-sec-5": "Jeta e natës & argëtimi",
        "faq-q-24": "Ku ndodhet Noya Nightlife?",
        "faq-a-24":
          "Noya Nightlife ndodhet në katin e sipërm (taracë) të hotelit dhe ofron pamje panoramike të qytetit.",
        "faq-q-25": "Çfarë atmosfere ofron Noya?",
        "faq-a-25":
          "Elegancë dhe argëtim: në mbrëmje darkë e rafinuar, më pas destinacion i gjallë i jetës së natës.",
        "faq-q-26": "A kërkohet rezervim paraprak për Noya?",
        "faq-a-26":
          "Për shkak të kërkesës së lartë rekomandojmë rezervim paraprak, sidomos gjatë fundjavave. Mysafirët e hotelit kanë prioritet përmes recepsionit.",
        "faq-q-27": "A ofron Noya hapësirë për evente private ose korporative?",
        "faq-a-27":
          "Po, si taraca ashtu edhe ambienti i brendshëm janë të përshtatshëm për festa private, ditëlindje dhe evente biznesi.",
        "faq-sec-6": "Partneritetet tona kulinarike",
        "faq-q-28": "Çfarë e përcakton përvojën kulinarike në Derand Hotel?",
        "faq-a-28":
          "Filozofia jonë gastronomike bazohet në ekselencë dhe shpirt lokal. Me Soma Slow Food sjellim përbërës bio dhe artizanal në tryezën tuaj, për një ushqyerje të menduar dhe të shëndetshme.",
        "faq-q-29":
          "Po kërkoni një përvojë guximtare dhe moderne të të ngrënit?",
        "faq-a-29":
          "Ju ftojmë të zbuloni Comandante Marko: një udhëtim në shije të forta dhe kuzhinë bashkëkohore – me karakter të paharrueshëm.",
        "faq-q-30":
          "A mund të rezervoj një tavolinë te partnerët tuaj përmes hotelit?",
        "faq-a-30":
          "Patjetër. Si mysafir i yni keni prioritet rezervimi si te Soma ashtu edhe te Comandante Marko. Ekipi ynë i concierge siguron që të merrni vendin më të mirë.",
        "faq-cta":
          "Keni pyetje të hapura? Na shkruani – do t'ju përgjigjemi me kënaqësi.",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, faq.en);
      Object.assign(translations.de, faq.de);
      Object.assign(translations.al, faq.al);
    }
  })();

  // Add Junior-specific experience line translations
  (function extendJuniorExperienceTranslations() {
    var extra = {
      en: {
        "junior-experience-line-1": "This time together",
        "junior-experience-line-2": "turns into an unforgettable experience",
      },
      de: {
        "junior-experience-line-1": "Diese gemeinsame Zeit",
        "junior-experience-line-2": "wird zu einem unvergesslichen Erlebnis",
      },
      al: {
        "junior-experience-line-1": "Kjo kohe se bashku",
        "junior-experience-line-2":
          "shnderrohet ne nje pervoje te paharrueshme",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Add Superior-specific translations
  (function extendSuperiorTranslations() {
    var extra = {
      en: {
        "superior-hero-title": "Superior Double Room in Prishtina",
        "superior-headline": "360° Superior Double",
        "superior-bath-note":
          "A plush double bed and a softly balanced palette make our Superior Double a calm retreat for couples who want refined comfort and space to unwind after a day in Prishtina.",
        "superior-experience-line-1": "Step into a world ",
        "superior-experience-line-2": "where heritage meets modern luxury.",
        "superior-preview-copy":
          "Experience understated luxury in our Superior Double Room. Elegantly designed with a harmonious blend of comfort and style, this space features a plush double bed, premium amenities, and a modern ensuite bathroom.",
        "superior-director-quote":
          "Our Superior Rooms invite you into a world of understated luxury, where bespoke design creates a sanctuary of unrivaled elegance.",
      },
      de: {
        "superior-hero-title": "Superior Doppelzimmer in Prishtina",
        "superior-headline": "360° Superior Doppelzimmer",
        "superior-bath-note":
          "Ein komfortables Doppelbett und eine sanft abgestimmte Farbwelt machen unser Superior Doppelzimmer zu einem ruhigen Rueckzugsort fuer Paare, die nach einem Tag in Prishtina gehobenen Komfort und Raum zum Entspannen schaetzen.",
        "superior-experience-line-1": "Tauchen Sie ein in eine Welt ",
        "superior-experience-line-2":
          "in der Tradition auf modernen Luxus trifft.",
        "superior-preview-copy":
          "Erleben Sie zurueckhaltenden Luxus in unserem Superior Doppelzimmer. Elegant gestaltet mit einer harmonischen Verbindung aus Komfort und Stil, bietet dieser Raum ein komfortables Doppelbett, Premium-Annehmlichkeiten und ein modernes Ensuite-Bad.",
        "superior-director-quote":
          "Unsere Superior Zimmer laden Sie in eine Welt des dezenten Luxus ein, in der massgeschneidertes Design ein Refugium unvergleichlicher Eleganz schafft.",
      },
      al: {
        "superior-hero-title": "Dhoma dyshe Superior në Prishtinë",
        "superior-headline": "360° Dhoma dyshe Superior",
        "superior-bath-note":
          "Një shtrat dopjo i rehatshëm dhe një paletë ngjyrash në ekuilibër e bëjnë dhomën dyshe Superior një strehë të qetë për çiftet që duan komoditet të rafinuar dhe hapësirë për t'u çlodhur pas një dite në Prishtinë.",
        "superior-experience-line-1": "Hyni në një botë ",
        "superior-experience-line-2":
          "ku trashëgimia takohet me luksin modern.",
        "superior-preview-copy":
          "Përjetoni luks të përmbajtur në dhomën tonë dyshe Superior. E dizajnuar me elegancë dhe harmoni midis komoditetit dhe stilit, kjo hapësirë ofron një shtrat dopjo komod, shërbime premium dhe një banjo moderne ensuite.",
        "superior-director-quote":
          "Dhomat tona Superior ju ftojnë në një botë luksi të përmbajtur, ku dizajni i personalizuar krijon një strehë me elegancë të paparë.",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Ensure Careers page always has a clean EN set when language switches to EN.
  (function enforceCareersEnglishTranslations() {
    var enCareers = {
      "careers-current-positions-title": "Current Open Positions",
      "careers-company-name": "Derand Hotel Prishtina",
      "careers-job-1-title": "Housekeeping Staff",
      "careers-job-1-detail": "Type: Full-time | Position: Operations",
      "careers-job-2-title": "Housekeeping Manager",
      "careers-job-2-detail": "Type: Full-time | Position: Management",
      "careers-job-3-title": "Receptionist",
      "careers-job-3-detail": "Type: Full-time | Position: Front Office",
      "careers-job-4-title": "Security",
      "careers-job-4-detail": "Type: Full-time | Position: Security",
      "careers-job-5-title": "Security Manager",
      "careers-job-5-detail": "Type: Full-time | Position: Security Management",
      "careers-job-6-title": "Bellboy",
      "careers-job-6-detail": "Type: Full-time | Position: Guest Service",
      "careers-job-7-title": "Sales",
      "careers-job-7-detail": "Type: Full-time | Position: Sales",
      "careers-job-8-title": "Architect",
      "careers-job-8-detail": "Type: Full-time | Position: Architecture",
      "careers-job-9-title": "Social Media Marketing",
      "careers-job-9-detail": "Type: Full-time | Position: Marketing",
      "careers-job-10-title": "IT Specialist",
      "careers-job-10-detail": "Type: Full-time | Position: IT",
      "careers-job-11-title": "Procurement / Logistics",
      "careers-job-11-detail": "Type: Full-time | Position: Operations",
      "careers-job-12-title": "Finance Officer",
      "careers-job-12-detail": "Type: Full-time | Position: Finance",
      "careers-job-13-title": "UI/UX Designer",
      "careers-job-13-detail": "Type: Full-time | Position: Design",
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, enCareers);
    }
  })();

  // Housekeeping job page translations (career-housekeeping.html)
  (function extendHousekeepingJobTranslations() {
    var extra = {
      en: {
        "hk-title": "Room Attendant (Housekeeper)",
        "hk-meta-department": "Department: Housekeeping / Room Attendants",
        "hk-meta-reporting":
          "Reporting Structure: Reports to the Housekeeping Manager and Executive Housekeeper / Supervisor",
        "hk-meta-quota":
          "Work Quota: 40 hours per week, including overtime as necessary",
        "hk-intro":
          "To ensure high-level maintenance and cleanliness across all hotel areas, including guest rooms, living spaces, showers, bathrooms, and public spaces. The Room Attendant is expected to clean at least 12 rooms within an 8-hour shift according to hotel standards.",
        "hk-resp-title": "Responsibilities and Duties",
        "hk-resp-1":
          "Maintain hygiene in rooms, terraces, lobby, corridors, stairs, halls, wellness areas, elevators, offices, reception, toilets, and public spaces.",
        "hk-resp-2":
          "Safekeep and responsibly use the assigned universal floor key.",
        "hk-resp-3":
          "Prepare cleaning trolley with required materials; replace linens and towels.",
        "hk-resp-4": "Arrange beds and room inventory according to standards.",
        "hk-resp-5":
          "Disinfect bathrooms, refill sanitary items, remove trash, dust furniture, and vacuum carpets.",
        "hk-resp-6":
          "Handle minibar/waste process and remove empty bottles as required.",
        "hk-resp-7": "Double-check room quality and readiness before release.",
        "hk-resp-8":
          "Report mechanical/electrical issues immediately; perform minor fixes (e.g., lightbulb changes).",
        "hk-resp-9": "Report lost & found items promptly to the supervisor.",
        "hk-resp-10": "Coordinate laundry service requests from guests.",
        "hk-resp-11":
          "Keep records of irregularities and damages in rooms/public areas.",
        "hk-resp-12": "Forward guest complaints/remarks to the supervisor.",
        "hk-resp-13":
          "Use hotel equipment carefully; keep uniform clean and professional.",
        "hk-resp-14":
          "Apply workplace safety, hygiene, fire, and PPE standards.",
        "hk-resp-15":
          "Protect personal data in line with Law L-06/082 and internal policy.",
        "hk-resp-16":
          "Prepare monthly reports and perform additional assigned departmental tasks.",
        "hk-skills-title": "Educational Qualifications and Professional Skills",
        "hk-skills-1":
          "Vocational secondary education in Tourism and Hospitality.",
        "hk-skills-2":
          "Knowledge of cleaning techniques and professional maintenance tools.",
        "hk-skills-3":
          "Friendly and approachable communication with guests and colleagues.",
        "hk-skills-4":
          "Eagerness to learn, cultural awareness, and a helpful attitude.",
        "hk-skills-5":
          "Practical problem-solving and situational handling skills.",
        "hk-skills-6":
          "Good Albanian communication and basic English communication.",
        "hk-skills-7": "Teamwork, discipline, initiative, and accountability.",
        "hk-skills-8":
          "Ability to work independently, neatly, and responsibly under pressure.",
        "hk-skills-9":
          "Calm, structured, guest-oriented work style with flexible and diplomatic behavior.",
        "hk-exp-title": "Work Experience and Training",
        "hk-exp-1":
          "At least 5 years of experience in housekeeping in 4/5-star hotels (please confirm exact requirement if needed).",
        "hk-exp-2":
          "Professional housekeeping/maintenance training certificates preferred.",
        "hk-exp-3":
          "Demonstrated resilience and ability to perform under pressure.",
        "hk-conf-title": "Confidentiality",
        "hk-conf-body":
          "Derand Hotel requires that no confidential hotel information is disclosed without prior consent from Senior Management.",
        "hk-apply-btn": "Apply Now",
      },
      de: {
        "hk-title": "Zimmerdame / Roomboy (Housekeeping)",
        "hk-meta-department": "Abteilung: Housekeeping / Zimmerdienst",
        "hk-meta-reporting":
          "Berichtsweg: Berichtet an die Housekeeping-Leitung und den Executive Housekeeper / Supervisor",
        "hk-meta-quota":
          "Arbeitsumfang: 40 Stunden pro Woche, einschliesslich Ueberstunden bei Bedarf",
        "hk-intro":
          "Sicherstellung einer hochwertigen Pflege und Sauberkeit in allen Hotelbereichen, einschliesslich Gaestezimmer, Wohnbereiche, Duschen, Baeder und oeffentlicher Flaechen. Es wird erwartet, dass pro 8-Stunden-Schicht mindestens 12 Zimmer nach Hotelstandard gereinigt werden.",
        "hk-resp-title": "Aufgaben und Verantwortlichkeiten",
        "hk-resp-1":
          "Hygiene in Zimmern, Terrassen, Lobby, Korridoren, Treppen, Hallen, Wellnessbereichen, Aufzuegen, Bueros, Rezeption, Toiletten und oeffentlichen Bereichen sicherstellen.",
        "hk-resp-2":
          "Den zugewiesenen Universalschluessel sorgfaeltig und verantwortungsvoll verwenden.",
        "hk-resp-3":
          "Reinigungswagen mit benoetigten Materialien vorbereiten; Bettwaesche und Handtuecher ersetzen.",
        "hk-resp-4": "Betten und Zimmerinventar gemaess Standards herrichten.",
        "hk-resp-5":
          "Baeder desinfizieren, Hygieneartikel auffuellen, Abfall entsorgen, Moebel entstauben und Teppiche saugen.",
        "hk-resp-6":
          "Minibar-/Abfallprozess bearbeiten und leere Flaschen gemaess Vorgaben entfernen.",
        "hk-resp-7":
          "Zimmerqualitaet und Bezugsfertigkeit vor Freigabe doppelt pruefen.",
        "hk-resp-8":
          "Mechanische/elektrische Stoerungen sofort melden; kleinere Reparaturen durchfuehren (z. B. Lampenwechsel).",
        "hk-resp-9": "Fundsachen umgehend an die/den Vorgesetzte/n melden.",
        "hk-resp-10": "Waescheservice-Anfragen von Gaesten koordinieren.",
        "hk-resp-11":
          "Unregelmaessigkeiten und Schaeden in Zimmern/oeffentlichen Bereichen dokumentieren.",
        "hk-resp-12":
          "Gaestebeschwerden/-hinweise an die/den Vorgesetzte/n weiterleiten.",
        "hk-resp-13":
          "Hotelequipment sorgsam nutzen; Uniform sauber und professionell halten.",
        "hk-resp-14":
          "Arbeitssicherheits-, Hygiene-, Brandschutz- und PSA-Standards einhalten.",
        "hk-resp-15":
          "Personenbezogene Daten gemaess Gesetz L-06/082 und interner Richtlinie schuetzen.",
        "hk-resp-16":
          "Monatsberichte erstellen und zusaetzliche zugewiesene Abteilungsaufgaben uebernehmen.",
        "hk-skills-title": "Ausbildung und berufliche Kompetenzen",
        "hk-skills-1":
          "Berufliche Sekundarausbildung im Bereich Tourismus und Gastgewerbe.",
        "hk-skills-2":
          "Kenntnisse von Reinigungstechniken und professionellen Pflegewerkzeugen.",
        "hk-skills-3":
          "Freundliche und zugaengliche Kommunikation mit Gaesten und Kolleginnen/Kollegen.",
        "hk-skills-4":
          "Lernbereitschaft, kulturelles Bewusstsein und hilfsbereite Haltung.",
        "hk-skills-5": "Praktische Problemloesung und situatives Handeln.",
        "hk-skills-6":
          "Gute Albanischkenntnisse und grundlegende Englischkenntnisse.",
        "hk-skills-7":
          "Teamfaehigkeit, Disziplin, Eigeninitiative und Verantwortungsbewusstsein.",
        "hk-skills-8":
          "Faehigkeit, selbststaendig, ordentlich und verantwortungsvoll unter Druck zu arbeiten.",
        "hk-skills-9":
          "Ruhiger, strukturierter, gaesteorientierter Arbeitsstil mit flexiblem und diplomatischem Verhalten.",
        "hk-exp-title": "Berufserfahrung und Schulung",
        "hk-exp-1":
          "Mindestens 5 Jahre Erfahrung im Housekeeping in 4/5-Sterne-Hotels (genaue Anforderung bei Bedarf bestaetigen).",
        "hk-exp-2":
          "Zertifikate fuer professionelle Housekeeping-/Instandhaltungsschulungen von Vorteil.",
        "hk-exp-3":
          "Nachgewiesene Belastbarkeit und Faehigkeit, unter Druck zu arbeiten.",
        "hk-conf-title": "Vertraulichkeit",
        "hk-conf-body":
          "Das Derand Hotel verlangt, dass keine vertraulichen Hotelinformationen ohne vorherige Zustimmung des Senior Managements weitergegeben werden.",
        "hk-apply-btn": "Jetzt bewerben",
      },
      al: {
        "hk-title": "Punetor/e i/e Dhomave (Housekeeping)",
        "hk-meta-department": "Departamenti: Housekeeping / Dhomat",
        "hk-meta-reporting":
          "Struktura e raportimit: Raporton te Menaxheri i Housekeeping dhe Executive Housekeeper / Supervisor",
        "hk-meta-quota":
          "Kuota e punes: 40 ore ne jave, perfshire ore shtese sipas nevojes",
        "hk-intro":
          "Te siguroje mirembajtje dhe pasterti ne nivel te larte ne te gjitha zonat e hotelit, perfshire dhomat e mysafireve, hapesirat e qendrimit, dushet, banjot dhe hapesirat publike. Pritet qe punetori i dhomave te pastroje te pakten 12 dhoma brenda nje turni 8-oresh sipas standardeve te hotelit.",
        "hk-resp-title": "Pergjegjesite dhe detyrat",
        "hk-resp-1":
          "Te ruaje higjienen ne dhoma, terasa, lobby, korridore, shkalle, salla, zona wellness, ashensore, zyra, recepsion, tualete dhe hapesira publike.",
        "hk-resp-2":
          "Te ruaje dhe perdore me pergjegjesi celesin universal te katit te caktuar.",
        "hk-resp-3":
          "Te pergatise karrocen e pastrimit me materialet e nevojshme; te zevendesoje carcafet dhe peshqiret.",
        "hk-resp-4":
          "Te rregulloje shtreterit dhe inventarin e dhomes sipas standardeve.",
        "hk-resp-5":
          "Te dezinfektoje banjot, te rimbushe artikujt sanitare, te largoje mbeturinat, te pastroje pluhurin dhe te vakumoje tepihat.",
        "hk-resp-6":
          "Te menaxhoje procesin e minibarit/mbeturinave dhe te largoje shishet bosh sipas kerkesave.",
        "hk-resp-7":
          "Te beje kontroll te dyfishte te cilesise dhe gatishmerise se dhomes para lirimit.",
        "hk-resp-8":
          "Te raportoje menjehere problemet mekanike/elektrike; te kryeje rregullime te vogla (p.sh. nderrim llambe).",
        "hk-resp-9":
          "Te raportoje menjehere sendet e humbura/gjetura te mbikeqyresi.",
        "hk-resp-10":
          "Te koordinoje kerkesat e mysafireve per sherbimin e lavanderise.",
        "hk-resp-11":
          "Te mbaje evidenca per parregullsi dhe deme ne dhoma/hapesira publike.",
        "hk-resp-12":
          "Te percjelle ankesat/verejtjet e mysafireve te mbikeqyresi.",
        "hk-resp-13":
          "Te perdore me kujdes pajisjet e hotelit; te mbaje uniforme te paster dhe profesionale.",
        "hk-resp-14":
          "Te zbatoje standardet e sigurise ne pune, higjienes, mbrojtjes nga zjarri dhe PPE.",
        "hk-resp-15":
          "Te mbroje te dhenat personale ne perputhje me Ligjin L-06/082 dhe politikat e brendshme.",
        "hk-resp-16":
          "Te pergatise raporte mujore dhe te kryeje detyra shtese te caktuara nga departamenti.",
        "hk-skills-title": "Kualifikimet arsimore dhe aftesite profesionale",
        "hk-skills-1": "Arsim i mesem profesional ne Turizem dhe Hoteleri.",
        "hk-skills-2":
          "Njohuri per teknikat e pastrimit dhe mjetet profesionale te mirembajtjes.",
        "hk-skills-3":
          "Komunikim miqesor dhe i afert me mysafiret dhe koleget.",
        "hk-skills-4":
          "Gatishmeri per te mesuar, vetedije kulturore dhe qasje ndihmuese.",
        "hk-skills-5":
          "Aftesi praktike ne zgjidhje problemesh dhe menaxhim situatash.",
        "hk-skills-6":
          "Komunikim i mire ne shqip dhe komunikim bazik ne anglisht.",
        "hk-skills-7": "Pune ne ekip, disipline, iniciative dhe llogaridhenie.",
        "hk-skills-8":
          "Aftesi per te punuar ne menyre te pavarur, te rregullt dhe me pergjegjesi nen presion.",
        "hk-skills-9":
          "Stil pune i qete, i strukturuar dhe i orientuar nga mysafiri, me sjellje fleksibile dhe diplomatike.",
        "hk-exp-title": "Eksperienca e punes dhe trajnimi",
        "hk-exp-1":
          "Te pakten 5 vite eksperience ne housekeeping ne hotele 4/5 yje (ju lutem konfirmoni kerkesen e sakte nese duhet).",
        "hk-exp-2":
          "Preferohen certifikata trajnimi profesional ne housekeeping/mirembajtje.",
        "hk-exp-3":
          "Qendrueshmeri e deshmuar dhe aftesi per te performuar nen presion.",
        "hk-conf-title": "Konfidencialiteti",
        "hk-conf-body":
          "Derand Hotel kerkon qe asnje informacion konfidencial i hotelit te mos zbulohet pa pelqimin paraprak te Menaxhmentit te Larte.",
        "hk-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Housekeeping manager job page translations (career-housekeeping-manager.html)
  (function extendHousekeepingManagerJobTranslations() {
    var extra = {
      en: {
        "hkm-title": "Housekeeping Manager",
        "hkm-meta-company": "Company: Ideoma Sh.p.k.",
        "hkm-meta-location": "Location: Derand Hotel, Prishtina",
        "hkm-meta-department": "Department: Housekeeping Management",
        "hkm-intro":
          "The Housekeeping Manager plans, organizes, and leads housekeeping operations to ensure the highest standards of cleanliness, maintenance, and service quality across all hotel areas.",
        "hkm-duties-title": "Duties and Responsibilities",
        "hkm-duty-1":
          "Plan, organize, and lead housekeeping staff during each shift.",
        "hkm-duty-2":
          "Manage daily department operations and assign staff for cleaning all hotel areas (rooms, terraces, bathrooms, corridors, halls, restaurants, elevators, stairs, offices, etc.).",
        "hkm-duty-3":
          "Manage, organize, record, and maintain housekeeping storage rooms.",
        "hkm-duty-4":
          "Inspect and transfer consumable materials from maintenance warehouses to floor housekeepers.",
        "hkm-duty-5":
          "Verify rooms are cleaned according to established quality standards.",
        "hkm-duty-6":
          "Personally support cleaning and hygiene tasks when needed to ensure speed, care, and efficiency.",
        "hkm-duty-7":
          "Conduct daily pre-arrival inspections of all spaces before guest check-in.",
        "hkm-duty-8":
          "Inspect minibar and restock consumed products when assigned.",
        "hkm-duty-9":
          "Submit daily minibar consumption control sheets when assigned.",
        "hkm-duty-10":
          "Inspect minibar within 5 minutes upon Reception request when assigned.",
        "hkm-duty-11":
          "Report malfunctioning room equipment immediately to Engineering for prompt repair.",
        "hkm-duty-12":
          "Support guest requests (newspapers/magazines, local attraction information, transportation organization).",
        "hkm-duty-13":
          "Coordinate closely with all departments, especially Reception and Engineering, for smooth operations.",
        "hkm-apply-btn": "Apply Now",
      },
      de: {
        "hkm-title": "Housekeeping-Manager/in",
        "hkm-meta-company": "Unternehmen: Ideoma Sh.p.k.",
        "hkm-meta-location": "Standort: Derand Hotel, Prishtina",
        "hkm-meta-department": "Abteilung: Housekeeping-Management",
        "hkm-intro":
          "Die/Der Housekeeping-Manager/in plant, organisiert und fuehrt die Housekeeping-Ablaeufe, um hoechste Standards bei Sauberkeit, Instandhaltung und Servicequalitaet in allen Hotelbereichen sicherzustellen.",
        "hkm-duties-title": "Aufgaben und Verantwortlichkeiten",
        "hkm-duty-1":
          "Housekeeping-Mitarbeitende in jeder Schicht planen, organisieren und fuehren.",
        "hkm-duty-2":
          "Taegliche Abteilungsablaeufe steuern und Personal fuer die Reinigung aller Hotelbereiche einteilen (Zimmer, Terrassen, Baeder, Korridore, Hallen, Restaurants, Aufzuege, Treppen, Bueros usw.).",
        "hkm-duty-3":
          "Housekeeping-Lagerräume verwalten, organisieren, dokumentieren und instand halten.",
        "hkm-duty-4":
          "Verbrauchsmaterialien aus den Wartungslagern pruefen und an Etagenmitarbeitende uebergeben.",
        "hkm-duty-5":
          "Sicherstellen, dass Zimmer gemaess den festgelegten Qualitaetsstandards gereinigt sind.",
        "hkm-duty-6":
          "Bei Bedarf persoenlich Reinigungs- und Hygienearbeiten unterstuetzen, um Schnelligkeit, Sorgfalt und Effizienz sicherzustellen.",
        "hkm-duty-7":
          "Taegliche Inspektionen aller Bereiche vor der Anreise und dem Check-in von Gaesten durchfuehren.",
        "hkm-duty-8":
          "Minibar kontrollieren und konsumierte Produkte bei Zuweisung nachfuellen.",
        "hkm-duty-9":
          "Taegliche Minibar-Kontrollblaetter bei Zuweisung einreichen.",
        "hkm-duty-10":
          "Minibar innerhalb von 5 Minuten auf Anfrage der Rezeption bei Zuweisung pruefen.",
        "hkm-duty-11":
          "Defekte Zimmerausstattung umgehend an die Technik zur schnellen Reparatur melden.",
        "hkm-duty-12":
          "Gaestewuensche unterstuetzen (Zeitungen/Zeitschriften, Informationen zu lokalen Attraktionen, Organisation von Transport).",
        "hkm-duty-13":
          "Eng mit allen Abteilungen, besonders Rezeption und Technik, fuer reibungslose Ablaeufe zusammenarbeiten.",
        "hkm-apply-btn": "Jetzt bewerben",
      },
      al: {
        "hkm-title": "Menaxher i Housekeeping",
        "hkm-meta-company": "Kompania: Ideoma Sh.p.k.",
        "hkm-meta-location": "Lokacioni: Derand Hotel, Prishtine",
        "hkm-meta-department": "Departamenti: Menaxhimi i Housekeeping",
        "hkm-intro":
          "Menaxheri i Housekeeping planifikon, organizon dhe udheheq operacionet e housekeeping per te siguruar standardet me te larta te pastertise, mirembajtjes dhe cilesise se sherbimit ne te gjitha zonat e hotelit.",
        "hkm-duties-title": "Detyrat dhe pergjegjesite",
        "hkm-duty-1":
          "Te planifikoje, organizoje dhe udheheqe stafin e housekeeping ne cdo turn.",
        "hkm-duty-2":
          "Te menaxhoje operacionet ditore te departamentit dhe te caktoje stafin per pastrimin e te gjitha zonave te hotelit (dhoma, terasa, banjo, korridore, salla, restorante, ashensore, shkalle, zyra etj.).",
        "hkm-duty-3":
          "Te menaxhoje, organizoje, regjistroje dhe mirembaje depozitat e housekeeping.",
        "hkm-duty-4":
          "Te inspektoje dhe transferoje materialet konsumuese nga depot e mirembajtjes te stafi i kateve.",
        "hkm-duty-5":
          "Te verifikoje qe dhomat jane pastruar sipas standardeve te cilesise.",
        "hkm-duty-6":
          "Te mbeshtese personalisht detyrat e pastrimit dhe higjienes kur nevojitet per te garantuar shpejtesi, kujdes dhe efikasitet.",
        "hkm-duty-7":
          "Te kryeje inspektime ditore para-arritjes ne te gjitha hapesirat para check-in te mysafireve.",
        "hkm-duty-8":
          "Te inspektoje minibarin dhe te rimbushe produktet e konsumuara kur i caktohet.",
        "hkm-duty-9":
          "Te dorezoje fletet ditore te kontrollit te konsumit te minibarit kur i caktohet.",
        "hkm-duty-10":
          "Te inspektoje minibarin brenda 5 minutash me kerkese te Recepsionit kur i caktohet.",
        "hkm-duty-11":
          "Te raportoje menjehere pajisjet e dhomes qe nuk funksionojne te Inxhinieria per riparim te shpejte.",
        "hkm-duty-12":
          "Te mbeshtese kerkesat e mysafireve (gazeta/revista, informacion per atraksione lokale, organizim transporti).",
        "hkm-duty-13":
          "Te koordinoje ngushte me te gjitha departamentet, sidomos Recepsionin dhe Inxhinierine, per operacione te qeta.",
        "hkm-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Receptionist job page translations (career-receptionist.html)
  (function extendReceptionistJobTranslations() {
    var extra = {
      en: {
        "rec-title": "Hotel Receptionist (Front Desk Agent)",
        "rec-meta-company-location":
          "Company: Derand Hotel | Location: Prishtina",
        "rec-meta-schedule": "Schedule: Full-time (Shift-based)",
        "rec-meta-exp": "Minimum Experience: 5 relevant years",
        "rec-meta-commitment": "Commitment: Long-term",
        "rec-intro-1":
          "Derand Hotel is opening a vacancy for the position of Receptionist, a key operational role and the primary point of contact for our guests. We maintain high service standards with a focus on organization, accuracy, and a consistent guest experience.",
        "rec-intro-2":
          "We are looking for candidates with proven experience, a professional approach, and job stability, aiming for long-term collaboration and active participation in maintaining the hotel's standards.",
        "rec-main-title": "Main Responsibilities",
        "rec-main-1":
          "Welcoming and registering guests (check-in / check-out) according to procedures.",
        "rec-main-2":
          "Managing reservations and updating PMS data with full accuracy.",
        "rec-main-3":
          "Processing payments (cash/card), managing cash register, and issuing documentation.",
        "rec-main-4":
          "Handling complaints and requests professionally with solution focus.",
        "rec-main-5":
          "Coordinating with housekeeping, maintenance, and other departments.",
        "rec-main-6": "Preparing shift reports and ensuring accurate handover.",
        "rec-main-7":
          "Following hotel standards, internal regulations, and confidentiality protocols.",
        "rec-req-title": "Required Criteria",
        "rec-req-1":
          "Minimum of 5 years of relevant front desk/hospitality experience.",
        "rec-req-2": "Practical PMS experience and strong computer literacy.",
        "rec-req-3":
          "Excellent communication skills, professional appearance, and strong work ethics.",
        "rec-req-4":
          "High accuracy in organization, details, and cash/document handling.",
        "rec-req-5":
          "Ability to work under pressure while maintaining service quality.",
        "rec-req-6":
          "Excellent Albanian and mandatory English (other languages are an advantage).",
        "rec-req-7": "Long-term commitment and work stability.",
        "rec-req-8": "References from previous employers are preferred.",
        "rec-req-9":
          "Upselling ability (room upgrades / extra services) is required.",
        "rec-req-10":
          "OTA/Channel Manager knowledge (Booking.com, Expedia, etc.) is an advantage.",
        "rec-req-11":
          "High confidentiality and precise handling of guest data.",
        "rec-offer-title": "What Is Offered",
        "rec-offer-1": "Stable position with focus on long-term collaboration.",
        "rec-offer-2":
          "Professional and structured work environment with clear standards.",
        "rec-offer-3": "Training aligned with hotel procedures and standards.",
        "rec-offer-4":
          "Competitive salary based on experience and performance.",
        "rec-apply-btn": "Apply Now",
      },
      de: {
        "rec-title": "Hotelrezeptionist/in (Front Desk Agent)",
        "rec-meta-company-location":
          "Unternehmen: Derand Hotel | Standort: Prishtina",
        "rec-meta-schedule": "Arbeitszeit: Vollzeit (Schichtbetrieb)",
        "rec-meta-exp": "Mindest-Erfahrung: 5 relevante Jahre",
        "rec-meta-commitment": "Verpflichtung: Langfristig",
        "rec-intro-1":
          "Das Derand Hotel schreibt eine Stelle als Rezeptionist/in aus - eine zentrale operative Rolle und der wichtigste Kontaktpunkt fuer unsere Gaeste. Wir arbeiten mit hohen Servicestandards und klarem Fokus auf Organisation, Genauigkeit und ein durchgaengiges Gaesteerlebnis.",
        "rec-intro-2":
          "Wir suchen Kandidat/innen mit nachgewiesener Erfahrung, professionellem Auftreten und beruflicher Stabilitaet, mit dem Ziel einer langfristigen Zusammenarbeit und aktiven Beteiligung an der Einhaltung unserer Hotelstandards.",
        "rec-main-title": "Hauptaufgaben",
        "rec-main-1":
          "Gaeste empfangen und registrieren (Check-in / Check-out) gemaess den Verfahren.",
        "rec-main-2":
          "Reservierungen verwalten und PMS-Daten mit hoher Genauigkeit aktualisieren.",
        "rec-main-3":
          "Zahlungen (Bar/Karte) bearbeiten, Kasse fuehren und Belege ausstellen.",
        "rec-main-4":
          "Beschwerden und Anfragen professionell und loesungsorientiert bearbeiten.",
        "rec-main-5":
          "Enge Abstimmung mit Housekeeping, Technik und weiteren Abteilungen.",
        "rec-main-6":
          "Schichtberichte erstellen und eine saubere Uebergabe sicherstellen.",
        "rec-main-7":
          "Hotelstandards, interne Regelungen und Vertraulichkeitsprotokolle einhalten.",
        "rec-req-title": "Anforderungen",
        "rec-req-1":
          "Mindestens 5 Jahre relevante Erfahrung im Front Office/Gastgewerbe.",
        "rec-req-2":
          "Praktische PMS-Erfahrung und sehr gute Computerkenntnisse.",
        "rec-req-3":
          "Ausgezeichnete Kommunikationsfaehigkeit, professionelles Auftreten und starke Arbeitsethik.",
        "rec-req-4":
          "Hohe Genauigkeit bei Organisation, Details sowie Kassen-/Dokumentenbearbeitung.",
        "rec-req-5":
          "Faehigkeit, unter Druck zu arbeiten und gleichzeitig Servicequalitaet zu halten.",
        "rec-req-6":
          "Sehr gute Albanischkenntnisse und verpflichtendes Englisch (weitere Sprachen von Vorteil).",
        "rec-req-7": "Langfristige Bindung und berufliche Stabilitaet.",
        "rec-req-8": "Referenzen frueherer Arbeitgeber sind von Vorteil.",
        "rec-req-9":
          "Upselling-Faehigkeit (Zimmer-Upgrades / Zusatzleistungen) ist erforderlich.",
        "rec-req-10":
          "Kenntnisse in OTA/Channel-Manager-Systemen (Booking.com, Expedia usw.) sind von Vorteil.",
        "rec-req-11":
          "Hohe Vertraulichkeit und praeziser Umgang mit Gaestedaten.",
        "rec-offer-title": "Unser Angebot",
        "rec-offer-1":
          "Stabile Position mit Fokus auf langfristige Zusammenarbeit.",
        "rec-offer-2":
          "Professionelles und strukturiertes Arbeitsumfeld mit klaren Standards.",
        "rec-offer-3":
          "Schulungen im Einklang mit Hotelverfahren und Standards.",
        "rec-offer-4":
          "Wettbewerbsfaehiges Gehalt basierend auf Erfahrung und Leistung.",
        "rec-apply-btn": "Jetzt bewerben",
      },
      al: {
        "rec-title": "Recepsionist/e Hoteli (Front Desk Agent)",
        "rec-meta-company-location":
          "Kompania: Derand Hotel | Lokacioni: Prishtine",
        "rec-meta-schedule": "Orari: Orar i plote (me turne)",
        "rec-meta-exp": "Eksperience minimale: 5 vite relevante",
        "rec-meta-commitment": "Angazhim: Afatgjate",
        "rec-intro-1":
          "Derand Hotel hap nje vend te lire pune per poziten e Recepsionistit/es, nje rol kyç operacional dhe pika kryesore e kontaktit per mysafiret tane. Ne mbajme standarde te larta sherbimi me fokus ne organizim, saktesi dhe pervoje te qendrueshme per mysafirin.",
        "rec-intro-2":
          "Kerkohen kandidate me pervoje te deshmuar, qasje profesionale dhe stabilitet ne pune, me synim bashkepunim afatgjate dhe pjesemarrje aktive ne ruajtjen e standardeve te hotelit.",
        "rec-main-title": "Pergjegjesite kryesore",
        "rec-main-1":
          "Mirepritja dhe regjistrimi i mysafireve (check-in / check-out) sipas procedurave.",
        "rec-main-2":
          "Menaxhimi i rezervimeve dhe perditesimi i te dhenave ne PMS me saktesi te plote.",
        "rec-main-3":
          "Procesimi i pagesave (cash/kartel), menaxhimi i arkes dhe leshimi i dokumentacionit.",
        "rec-main-4":
          "Trajtimi profesional i ankesave dhe kerkesave me fokus ne zgjidhje.",
        "rec-main-5":
          "Koordinimi me housekeeping, mirembajtje dhe departamente te tjera.",
        "rec-main-6":
          "Pergatitja e raporteve te turnit dhe sigurimi i dorezimit korrekt.",
        "rec-main-7":
          "Zbatimi i standardeve te hotelit, rregulloreve te brendshme dhe protokolleve te konfidencialitetit.",
        "rec-req-title": "Kriteret e kerkuara",
        "rec-req-1":
          "Minimum 5 vite eksperience relevante ne front desk/hoteleri.",
        "rec-req-2":
          "Eksperience praktike me PMS dhe aftesi te forta kompjuterike.",
        "rec-req-3":
          "Aftesi te shkelqyera komunikimi, paraqitje profesionale dhe etike e forte pune.",
        "rec-req-4":
          "Saktesi e larte ne organizim, detaje dhe menaxhim te arkes/dokumenteve.",
        "rec-req-5":
          "Aftesi per te punuar nen presion duke ruajtur cilesine e sherbimit.",
        "rec-req-6":
          "Shqip e shkelqyer dhe anglishte e detyrueshme (gjuhet e tjera jane perparesi).",
        "rec-req-7": "Angazhim afatgjate dhe stabilitet ne pune.",
        "rec-req-8":
          "Referenca nga punedhenes te meparshem jane te preferuara.",
        "rec-req-9":
          "Aftesi ne upselling (upgrade dhomash / sherbime shtese) eshte e kerkuar.",
        "rec-req-10":
          "Njohuri ne OTA/Channel Manager (Booking.com, Expedia, etj.) jane perparesi.",
        "rec-req-11":
          "Konfidencialitet i larte dhe trajtim i sakte i te dhenave te mysafireve.",
        "rec-offer-title": "Cfare ofrohet",
        "rec-offer-1": "Pozite stabile me fokus ne bashkepunim afatgjate.",
        "rec-offer-2":
          "Ambient pune profesional dhe i strukturuar me standarde te qarta.",
        "rec-offer-3":
          "Trajnime ne perputhje me procedurat dhe standardet e hotelit.",
        "rec-offer-4": "Page konkurruese sipas pervojes dhe performances.",
        "rec-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Security guard job page translations (career-security.html)
  (function extendSecurityJobTranslations() {
    var extra = {
      en: {
        "sec-title": "Security Guard",
        "sec-meta-company": "Company: Ideoma Sh.p.k.",
        "sec-meta-location": "Location: Derand Hotel, Prishtina",
        "sec-meta-department": "Department: Security",
        "sec-intro":
          "The Security Guard is responsible for maintaining a safe and secure environment for guests, staff, and hotel assets through active monitoring, prevention, patrolling, and emergency response.",
        "sec-duties-title": "Duties and Responsibilities",
        "sec-duty-1":
          "Monitor and control all entrances and exits of the hotel and surrounding perimeter.",
        "sec-duty-2":
          "Maintain order, peace, and privacy by preventing unauthorized access to restricted areas.",
        "sec-duty-3":
          "Prevent attempted offenses or criminal acts on hotel premises.",
        "sec-duty-4":
          "Continuously monitor PTZ security cameras, alarm systems, and other surveillance equipment.",
        "sec-duty-5":
          "Ensure guests can rest undisturbed in a quiet and secure environment, especially overnight.",
        "sec-duty-6":
          "Monitor movement of people, loading/unloading of goods, and vehicle circulation.",
        "sec-duty-7":
          "Allow entry only to authorized personnel who complete required security procedures.",
        "sec-duty-8":
          "Remain vigilant to prevent and stop potential sabotage or diversion acts.",
        "sec-duty-9":
          "Conduct regular patrols in all indoor and outdoor hotel areas and report suspicious activity by radio.",
        "sec-duty-10":
          "Protect guests, staff, hotel property, and all persons on-site.",
        "sec-duty-11":
          "In case of fire, alert authorities immediately and assist with initial fire response.",
        "sec-duty-12":
          "Maintain a detailed logbook of suspicious entries/exits, identity verification, and relevant security information.",
        "sec-apply-btn": "Apply Now",
      },
      de: {
        "sec-title": "Sicherheitsmitarbeiter/in",
        "sec-meta-company": "Unternehmen: Ideoma Sh.p.k.",
        "sec-meta-location": "Standort: Derand Hotel, Prishtina",
        "sec-meta-department": "Abteilung: Sicherheit",
        "sec-intro":
          "Die/Der Sicherheitsmitarbeiter/in ist fuer die Aufrechterhaltung einer sicheren Umgebung fuer Gaeste, Mitarbeitende und Hotelwerte verantwortlich - durch aktive Ueberwachung, Praevention, Patrouillen und Reaktion in Notfaellen.",
        "sec-duties-title": "Aufgaben und Verantwortlichkeiten",
        "sec-duty-1":
          "Alle Ein- und Ausgaenge des Hotels sowie den umliegenden Perimeter ueberwachen und kontrollieren.",
        "sec-duty-2":
          "Ordnung, Ruhe und Privatsphaere wahren, indem unbefugter Zugang zu gesperrten Bereichen verhindert wird.",
        "sec-duty-3":
          "Versuchte Verstoesse oder kriminelle Handlungen auf dem Hotelgelaende verhindern.",
        "sec-duty-4":
          "PTZ-Sicherheitskameras, Alarmsysteme und weitere Ueberwachungsgeraete fortlaufend beobachten.",
        "sec-duty-5":
          "Sicherstellen, dass Gaeste ungestoert in einer ruhigen und sicheren Umgebung ruhen koennen, besonders nachts.",
        "sec-duty-6":
          "Bewegungen von Personen, Be- und Entladung von Waren sowie Fahrzeugverkehr ueberwachen.",
        "sec-duty-7":
          "Nur autorisiertem Personal Zutritt gewaehrleisten, das die erforderlichen Sicherheitsverfahren durchlaeuft.",
        "sec-duty-8":
          "Wachsam bleiben, um moegliche Sabotage- oder Umleitungsversuche zu verhindern und zu stoppen.",
        "sec-duty-9":
          "Regelmaessige Patrouillen in allen Innen- und Aussenbereichen des Hotels durchfuehren und verdaechtige Aktivitaeten per Funk melden.",
        "sec-duty-10":
          "Gaeste, Mitarbeitende, Hoteleigentum und alle Personen vor Ort schuetzen.",
        "sec-duty-11":
          "Im Brandfall sofort die Behoerden alarmieren und bei der Erstreaktion unterstuetzen.",
        "sec-duty-12":
          "Ein detailliertes Protokoll ueber verdaechtige Ein-/Ausgaenge, Identitaetspruefungen und relevante Sicherheitsinformationen fuehren.",
        "sec-apply-btn": "Jetzt bewerben",
      },
      al: {
        "sec-title": "Roje Sigurie",
        "sec-meta-company": "Kompania: Ideoma Sh.p.k.",
        "sec-meta-location": "Lokacioni: Derand Hotel, Prishtine",
        "sec-meta-department": "Departamenti: Siguri",
        "sec-intro":
          "Roja e Sigurise eshte pergjegjes/e per ruajtjen e nje mjedisi te sigurt per mysafiret, stafin dhe asetet e hotelit nepermjet monitorimit aktiv, parandalimit, patrullimit dhe reagimit ne emergjenca.",
        "sec-duties-title": "Detyrat dhe pergjegjesite",
        "sec-duty-1":
          "Te monitoroje dhe kontrolloje te gjitha hyrje-daljet e hotelit dhe perimetrin perreth.",
        "sec-duty-2":
          "Te ruaje rendin, qetesine dhe privatesine duke parandaluar hyrjen e paautorizuar ne zona te kufizuara.",
        "sec-duty-3":
          "Te parandaloje tentativat per shkelje ose akte kriminale ne ambientet e hotelit.",
        "sec-duty-4":
          "Te monitoroje vazhdimisht kamerat PTZ, sistemet e alarmit dhe pajisje te tjera te vezhgimit.",
        "sec-duty-5":
          "Te siguroje qe mysafiret te pushojne pa shqetesime ne nje ambient te qete dhe te sigurt, sidomos gjate nates.",
        "sec-duty-6":
          "Te monitoroje levizjen e personave, ngarkim-shkarkimin e mallrave dhe qarkullimin e automjeteve.",
        "sec-duty-7":
          "Te lejoje hyrje vetem per personel te autorizuar qe permbush procedurat e kerkuara te sigurise.",
        "sec-duty-8":
          "Te qendroje vigjilent/e per te parandaluar dhe ndaluar akte te mundshme sabotimi ose devijimi.",
        "sec-duty-9":
          "Te kryeje patrullime te rregullta ne te gjitha zonat e brendshme dhe te jashtme te hotelit dhe te raportoje aktivitet te dyshimte me radio.",
        "sec-duty-10":
          "Te mbroje mysafiret, stafin, pronen e hotelit dhe te gjithe personat ne vendngjarje.",
        "sec-duty-11":
          "Ne rast zjarri, te njoftoje menjehere autoritetet dhe te ndihmoje ne reagimin fillestar ndaj zjarrit.",
        "sec-duty-12":
          "Te mbaje nje regjister te detajuar per hyrje/dalje te dyshimta, verifikim identiteti dhe informacion relevant te sigurise.",
        "sec-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Security manager job page translations (career-security-manager.html)
  (function extendSecurityManagerJobTranslations() {
    var extra = {
      en: {
        "secm-title": "Security Manager",
        "secm-meta-company": "Company: Ideoma Sh.p.k.",
        "secm-meta-location": "Location: Derand Hotel, Prishtina",
        "secm-meta-department": "Department: Security Management",
        "secm-intro":
          "The Security Manager oversees all safety and protection procedures to ensure secure operations, guest peace of mind, and full control of access, surveillance, incident response, and internal discipline.",
        "secm-duties-title": "Duties and Responsibilities",
        "secm-duty-1":
          "Monitor and control all hotel entrances, exits, and surrounding perimeter.",
        "secm-duty-2":
          "Maintain order and tranquility, and prevent unauthorized access to restricted/private areas.",
        "secm-duty-3":
          "Prevent attempted offenses or criminal acts within hotel premises.",
        "secm-duty-4":
          "Continuously monitor PTZ cameras, alarm systems, and electronic surveillance equipment during working hours.",
        "secm-duty-5":
          "Ensure guests and clients enjoy a safe and quiet environment 24/7.",
        "secm-duty-6":
          "Oversee movement of people, loading/unloading operations, and vehicle traffic.",
        "secm-duty-7":
          "Allow access only to authorized personnel who pass required security screening procedures.",
        "secm-duty-8":
          "Vigilantly prevent and stop potential sabotage or diversion acts.",
        "secm-duty-9":
          "Coordinate continuous patrols in all indoor and outdoor areas and report suspicious movement by radio.",
        "secm-duty-10":
          "Protect guests, property, staff members, and all other individuals on-site.",
        "secm-duty-11":
          "In fire emergencies, take immediate suppression and notification measures.",
        "secm-duty-12":
          "Coordinate with department managers to maintain internal discipline and report irregularities to Legal and HR.",
        "secm-duty-13":
          "Maintain a dedicated logbook for suspicious entries/exits, identity verification, and all relevant security documentation.",
        "secm-apply-btn": "Apply Now",
      },
      de: {
        "secm-title": "Sicherheitsmanager/in",
        "secm-meta-company": "Unternehmen: Ideoma Sh.p.k.",
        "secm-meta-location": "Standort: Derand Hotel, Prishtina",
        "secm-meta-department": "Abteilung: Sicherheitsmanagement",
        "secm-intro":
          "Die/Der Sicherheitsmanager/in ueberwacht alle Sicherheits- und Schutzverfahren, um einen sicheren Betrieb, Ruhe fuer Gaeste und volle Kontrolle ueber Zugang, Ueberwachung, Vorfallreaktion und interne Disziplin zu gewaehren.",
        "secm-duties-title": "Aufgaben und Verantwortlichkeiten",
        "secm-duty-1":
          "Alle Hoteleingaenge, Ausgaenge und den umliegenden Perimeter ueberwachen und kontrollieren.",
        "secm-duty-2":
          "Ordnung und Ruhe sichern sowie unbefugten Zugang zu eingeschraenkten/privaten Bereichen verhindern.",
        "secm-duty-3":
          "Versuchte Verstoesse oder kriminelle Handlungen innerhalb des Hotelgelaendes verhindern.",
        "secm-duty-4":
          "PTZ-Kameras, Alarmsysteme und elektronische Ueberwachungsgeraete waehrend der Arbeitszeiten fortlaufend beobachten.",
        "secm-duty-5":
          "Sicherstellen, dass Gaeste und Kunden rund um die Uhr eine sichere und ruhige Umgebung geniessen.",
        "secm-duty-6":
          "Bewegungen von Personen, Be-/Entladevorgaenge und Fahrzeugverkehr ueberwachen.",
        "secm-duty-7":
          "Zugang nur autorisiertem Personal gewaehrleisten, das die erforderlichen Sicherheitskontrollen besteht.",
        "secm-duty-8":
          "Moegliche Sabotage- oder Umleitungsakte wachsam verhindern und stoppen.",
        "secm-duty-9":
          "Kontinuierliche Patrouillen in allen Innen- und Aussenbereichen koordinieren und verdaechtige Bewegungen per Funk melden.",
        "secm-duty-10":
          "Gaeste, Eigentum, Mitarbeitende und alle weiteren Personen vor Ort schuetzen.",
        "secm-duty-11":
          "Bei Brandnotfaellen sofortige Loesch- und Benachrichtigungsmassnahmen einleiten.",
        "secm-duty-12":
          "Mit Abteilungsleitungen koordinieren, um interne Disziplin aufrechtzuerhalten und Unregelmaessigkeiten an Rechtsabteilung und HR zu melden.",
        "secm-duty-13":
          "Ein eigenes Protokollbuch fuer verdaechtige Ein-/Ausgaenge, Identitaetspruefungen und alle relevanten Sicherheitsdokumente fuehren.",
        "secm-apply-btn": "Jetzt bewerben",
      },
      al: {
        "secm-title": "Menaxher i Sigurise",
        "secm-meta-company": "Kompania: Ideoma Sh.p.k.",
        "secm-meta-location": "Lokacioni: Derand Hotel, Prishtine",
        "secm-meta-department": "Departamenti: Menaxhimi i Sigurise",
        "secm-intro":
          "Menaxheri i Sigurise mbikeqyr te gjitha procedurat e sigurise dhe mbrojtjes per te garantuar operime te sigurta, qetesi per mysafiret dhe kontroll te plote te aksesit, vezhgimit, reagimit ndaj incidenteve dhe disiplinës se brendshme.",
        "secm-duties-title": "Detyrat dhe pergjegjesite",
        "secm-duty-1":
          "Te monitoroje dhe kontrolloje te gjitha hyrjet, daljet dhe perimetrin perreth hotelit.",
        "secm-duty-2":
          "Te ruaje rendin dhe qetesine, si dhe te parandaloje hyrjen e paautorizuar ne zona te kufizuara/private.",
        "secm-duty-3":
          "Te parandaloje tentativa per shkelje ose akte kriminale brenda ambienteve te hotelit.",
        "secm-duty-4":
          "Te monitoroje vazhdimisht kamerat PTZ, sistemet e alarmit dhe pajisjet elektronike te vezhgimit gjate orarit te punes.",
        "secm-duty-5":
          "Te siguroje qe mysafiret dhe klientet te kene nje ambient te sigurt dhe te qete 24/7.",
        "secm-duty-6":
          "Te mbikeqyre levizjen e personave, operacionet e ngarkim-shkarkimit dhe trafikun e automjeteve.",
        "secm-duty-7":
          "Te lejoje akses vetem per personel te autorizuar qe kalon procedurat e kerkuara te kontrollit te sigurise.",
        "secm-duty-8":
          "Te parandaloje dhe ndaloje me vigjilence akte te mundshme sabotimi ose devijimi.",
        "secm-duty-9":
          "Te koordinoje patrullime te vazhdueshme ne te gjitha zonat e brendshme dhe te jashtme dhe te raportoje levizje te dyshimta me radio.",
        "secm-duty-10":
          "Te mbroje mysafiret, pronen, stafin dhe te gjithe personat e tjere ne vendngjarje.",
        "secm-duty-11":
          "Ne emergjenca zjarri, te ndermarre menjehere masa shuarjeje dhe njoftimi.",
        "secm-duty-12":
          "Te koordinoje me menaxheret e departamenteve per te ruajtur disiplinen e brendshme dhe te raportoje parregullsite te Juridiku dhe HR.",
        "secm-duty-13":
          "Te mbaje nje regjister te dedikuar per hyrje/dalje te dyshimta, verifikim identiteti dhe te gjithe dokumentacionin relevant te sigurise.",
        "secm-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Bellboy job page translations (career-bellboy.html)
  (function extendBellboyJobTranslations() {
    var extra = {
      en: {
        "bell-title": "Bellboy (Porter)",
        "bell-meta-company": "Company: Ideoma Sh.p.k.",
        "bell-meta-location": "Location: Derand Hotel, Prishtina",
        "bell-meta-department":
          "Department: Guest Services / Front Office Support",
        "bell-intro":
          "The Bellboy supports guest arrivals and departures, ensures excellent luggage handling, and provides professional assistance to maintain a smooth and comfortable guest experience.",
        "bell-duties-title": "Duties and Responsibilities",
        "bell-duty-1": "Welcome arriving guests and assist with their luggage.",
        "bell-duty-2":
          "Escort guests to their rooms and explain room facilities and amenities.",
        "bell-duty-3":
          "Deliver luggage, messages, faxes, and packages, and respond to guest requests.",
        "bell-duty-4":
          "Confirm guest count, label luggage with guest name and room number, and ensure no luggage is left in vehicles.",
        "bell-duty-5":
          "Assist departing guests by transporting luggage from rooms to the lobby and confirming ownership.",
        "bell-duty-6":
          "Support valet and parking operations when needed by directing and moving vehicles safely.",
        "bell-duty-7": "Keep luggage clean, protected, and never unattended.",
        "bell-duty-8":
          "Carry luggage from entrance to room and demonstrate room equipment usage (lights, TV, telephone, ventilation, safe, and mini-bar).",
        "bell-duty-9":
          "Report room equipment malfunctions immediately to the maintenance department for fast resolution.",
        "bell-apply-btn": "Apply Now",
      },
      de: {
        "bell-title": "Bellboy (Portier)",
        "bell-meta-company": "Unternehmen: Ideoma Sh.p.k.",
        "bell-meta-location": "Standort: Derand Hotel, Prishtina",
        "bell-meta-department":
          "Abteilung: Gaesteservice / Front Office Support",
        "bell-intro":
          "Der Bellboy unterstuetzt An- und Abreisen von Gaesten, gewaehrleistet eine exzellente Gepaeckabwicklung und bietet professionelle Hilfe fuer ein reibungsloses und komfortables Gaesteerlebnis.",
        "bell-duties-title": "Aufgaben und Verantwortlichkeiten",
        "bell-duty-1": "Ankommende Gaeste begruessen und beim Gepaeck helfen.",
        "bell-duty-2":
          "Gaeste zu ihren Zimmern begleiten und Zimmerausstattung sowie Annehmlichkeiten erklaeren.",
        "bell-duty-3":
          "Gepaeck, Nachrichten, Faxe und Pakete zustellen sowie auf Gaestewuensche reagieren.",
        "bell-duty-4":
          "Gaesteanzahl bestaetigen, Gepaeck mit Name und Zimmernummer kennzeichnen und sicherstellen, dass kein Gepaeck in Fahrzeugen verbleibt.",
        "bell-duty-5":
          "Abreisende Gaeste unterstuetzen, indem Gepaeck vom Zimmer in die Lobby transportiert und Eigentum bestaetigt wird.",
        "bell-duty-6":
          "Bei Bedarf Valet- und Parkvorgaenge unterstuetzen, indem Fahrzeuge sicher dirigiert und bewegt werden.",
        "bell-duty-7":
          "Gepaeck sauber und geschuetzt halten und niemals unbeaufsichtigt lassen.",
        "bell-duty-8":
          "Gepaeck vom Eingang ins Zimmer bringen und die Nutzung der Zimmerausstattung erklaeren (Licht, TV, Telefon, Belueftung, Safe und Minibar).",
        "bell-duty-9":
          "Stoerungen an Zimmerausstattung sofort an die Instandhaltung melden, damit eine schnelle Loesung erfolgt.",
        "bell-apply-btn": "Jetzt bewerben",
      },
      al: {
        "bell-title": "Bellboy (Portier)",
        "bell-meta-company": "Kompania: Ideoma Sh.p.k.",
        "bell-meta-location": "Lokacioni: Derand Hotel, Prishtine",
        "bell-meta-department":
          "Departamenti: Sherbime per Mysafire / Mbeshtetje Front Office",
        "bell-intro":
          "Bellboy mbeshtet ardhjet dhe largimet e mysafireve, siguron menaxhim shume te mire te bagazheve dhe ofron ndihme profesionale per nje pervoje te qete dhe komode te mysafirit.",
        "bell-duties-title": "Detyrat dhe pergjegjesite",
        "bell-duty-1":
          "Te mireprese mysafiret qe arrijne dhe t'i ndihmoje me bagazhet.",
        "bell-duty-2":
          "Te shoqeroje mysafiret deri ne dhoma dhe te shpjegoje pajisjet dhe fasilitetet e dhomes.",
        "bell-duty-3":
          "Te dorezoje bagazhe, mesazhe, fakse dhe pako, si dhe te pergjigjet ndaj kerkesave te mysafireve.",
        "bell-duty-4":
          "Te konfirmoje numrin e mysafireve, te etiketoje bagazhin me emer dhe numer dhome dhe te siguroje qe asnje bagazh te mos mbetet ne automjete.",
        "bell-duty-5":
          "Te ndihmoje mysafiret ne largim duke transportuar bagazhin nga dhomat ne lobby dhe duke konfirmuar pronesine.",
        "bell-duty-6":
          "Te mbeshtese valet dhe operacionet e parkimit kur nevojitet duke orientuar dhe levizur automjetet ne menyre te sigurt.",
        "bell-duty-7":
          "Te mbaje bagazhin te paster, te mbrojtur dhe asnjehere te pambikeqyrur.",
        "bell-duty-8":
          "Te bart bagazhin nga hyrja ne dhome dhe te demonstroje perdorimin e pajisjeve te dhomes (dritat, TV, telefoni, ventilimi, kasaforta dhe mini-bari).",
        "bell-duty-9":
          "Te raportoje menjehere defektet e pajisjeve te dhomes te departamenti i mirembajtjes per zgjidhje te shpejte.",
        "bell-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // IT specialist job page translations (career-it-specialist.html)
  (function extendITJobTranslations() {
    var extra = {
      en: {
        "it-title": "IT Specialist",
        "it-meta-company": "Company: Ideoma Sh.p.k.",
        "it-meta-location": "Location: Derand Hotel, Prishtina",
        "it-meta-department": "Department: Information Technology",
        "it-intro":
          "The IT Specialist supports secure, reliable, and efficient technology operations by managing infrastructure, information security, technical support, and digital development across the organization.",
        "it-sec1-title": "I. IT Infrastructure Management",
        "it-sec1-1":
          "Install, configure, and maintain computer hardware and company network infrastructure.",
        "it-sec1-2":
          "Ensure proper operation of servers, operating systems, and internal software applications.",
        "it-sec1-3":
          "Monitor system performance and resolve technical issues (troubleshooting).",
        "it-sec1-4": "Manage user accounts, permissions, and access levels.",
        "it-sec2-title": "II. Information Security",
        "it-sec2-1":
          "Apply data security policies and information protection measures.",
        "it-sec2-2":
          "Perform periodic data backups to ensure business continuity.",
        "it-sec2-3": "Protect systems from viruses, malware, and cyberattacks.",
        "it-sec2-4": "Ensure confidentiality and integrity of company data.",
        "it-sec3-title": "III. Technical Support",
        "it-sec3-1":
          "Provide technical support and helpdesk services to company staff.",
        "it-sec3-2":
          "Train employees on effective use of systems and software.",
        "it-sec3-3":
          "Document technical issues and solutions for future reference.",
        "it-sec4-title": "IV. Reporting and Development",
        "it-sec4-1": "Report periodically to management on IT systems status.",
        "it-sec4-2":
          "Propose technological improvements and investments to increase efficiency.",
        "it-sec4-3":
          "Collaborate with departments to develop and optimize digital processes.",
        "it-apply-btn": "Apply Now",
      },
      de: {
        "it-title": "IT-Spezialist/in",
        "it-meta-company": "Unternehmen: Ideoma Sh.p.k.",
        "it-meta-location": "Standort: Derand Hotel, Prishtina",
        "it-meta-department": "Abteilung: Informationstechnologie",
        "it-intro":
          "Die/Der IT-Spezialist/in unterstuetzt sichere, zuverlaessige und effiziente Technologieablaeufe durch das Management von Infrastruktur, Informationssicherheit, technischem Support und digitaler Weiterentwicklung in der gesamten Organisation.",
        "it-sec1-title": "I. IT-Infrastrukturmanagement",
        "it-sec1-1":
          "Computerhardware und die Netzwerkinfrastruktur des Unternehmens installieren, konfigurieren und warten.",
        "it-sec1-2":
          "Den einwandfreien Betrieb von Servern, Betriebssystemen und internen Softwareanwendungen sicherstellen.",
        "it-sec1-3":
          "Systemleistung ueberwachen und technische Probleme beheben (Troubleshooting).",
        "it-sec1-4":
          "Benutzerkonten, Berechtigungen und Zugriffsebenen verwalten.",
        "it-sec2-title": "II. Informationssicherheit",
        "it-sec2-1":
          "Datensicherheitsrichtlinien und Massnahmen zum Informationsschutz anwenden.",
        "it-sec2-2":
          "Regelmaessige Datensicherungen zur Gewaehrleistung der Geschaeftskontinuitaet durchfuehren.",
        "it-sec2-3": "Systeme vor Viren, Malware und Cyberangriffen schuetzen.",
        "it-sec2-4":
          "Vertraulichkeit und Integritaet der Unternehmensdaten sicherstellen.",
        "it-sec3-title": "III. Technischer Support",
        "it-sec3-1":
          "Technischen Support und Helpdesk-Services fuer Mitarbeitende bereitstellen.",
        "it-sec3-2":
          "Mitarbeitende im effektiven Einsatz von Systemen und Software schulen.",
        "it-sec3-3":
          "Technische Probleme und Loesungen zur spaeteren Referenz dokumentieren.",
        "it-sec4-title": "IV. Reporting und Weiterentwicklung",
        "it-sec4-1":
          "Regelmaessig an das Management ueber den Status der IT-Systeme berichten.",
        "it-sec4-2":
          "Technologische Verbesserungen und Investitionen zur Effizienzsteigerung vorschlagen.",
        "it-sec4-3":
          "Mit Abteilungen zusammenarbeiten, um digitale Prozesse zu entwickeln und zu optimieren.",
        "it-apply-btn": "Jetzt bewerben",
      },
      al: {
        "it-title": "Specialist IT",
        "it-meta-company": "Kompania: Ideoma Sh.p.k.",
        "it-meta-location": "Lokacioni: Derand Hotel, Prishtine",
        "it-meta-department": "Departamenti: Teknologjia e Informacionit",
        "it-intro":
          "Specialisti i IT mbeshtet operacione teknologjike te sigurta, te besueshme dhe efikase duke menaxhuar infrastrukturen, sigurine e informacionit, suportin teknik dhe zhvillimin digjital ne te gjithe organizaten.",
        "it-sec1-title": "I. Menaxhimi i Infrastruktures IT",
        "it-sec1-1":
          "Te instaloje, konfiguroje dhe mirembaje harduerin kompjuterik dhe infrastrukturen e rrjetit te kompanise.",
        "it-sec1-2":
          "Te siguroje funksionimin korrekt te servereve, sistemeve operative dhe aplikacioneve te brendshme softuerike.",
        "it-sec1-3":
          "Te monitoroje performancen e sistemeve dhe te zgjidhe problemet teknike (troubleshooting).",
        "it-sec1-4":
          "Te menaxhoje llogarite e perdoruesve, lejet dhe nivelet e aksesit.",
        "it-sec2-title": "II. Siguria e Informacionit",
        "it-sec2-1":
          "Te zbatoje politikat e sigurise se te dhenave dhe masat per mbrojtjen e informacionit.",
        "it-sec2-2":
          "Te kryeje backup periodik te te dhenave per te siguruar vazhdimesine e biznesit.",
        "it-sec2-3":
          "Te mbroje sistemet nga viruse, malware dhe sulme kibernetike.",
        "it-sec2-4":
          "Te siguroje konfidencialitetin dhe integritetin e te dhenave te kompanise.",
        "it-sec3-title": "III. Suporti Teknik",
        "it-sec3-1":
          "Te ofroje suport teknik dhe sherbime helpdesk per stafin e kompanise.",
        "it-sec3-2":
          "Te trajnoje punonjesit per perdorimin efektiv te sistemeve dhe softuerit.",
        "it-sec3-3":
          "Te dokumentoje problemet teknike dhe zgjidhjet per reference ne te ardhmen.",
        "it-sec4-title": "IV. Raportimi dhe Zhvillimi",
        "it-sec4-1":
          "Te raportoje periodikisht te menaxhmenti per gjendjen e sistemeve IT.",
        "it-sec4-2":
          "Te propozoje permiresime teknologjike dhe investime per rritjen e efikasitetit.",
        "it-sec4-3":
          "Te bashkepunoje me departamentet per zhvillimin dhe optimizimin e proceseve digjitale.",
        "it-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Procurement & Logistics job page translations (career-procurement-logistics.html)
  (function extendProcurementJobTranslations() {
    var extra = {
      en: {
        "proc-title": "Procurement / Logistics",
        "proc-meta-company": "Company: Ideoma Sh.p.k.",
        "proc-meta-location": "Location: Derand Hotel, Prishtina",
        "proc-meta-department": "Department: Procurement & Logistics",
        "proc-intro":
          "The Procurement/Logistics role is responsible for managing supplies, stock, warehouse flow, transportation, reporting, and compliance to ensure efficient and uninterrupted hotel operations.",
        "proc-sec1-title": "I. Supply and Procurement Management",
        "proc-sec1-1":
          "Plan and coordinate the supply of goods and operational materials.",
        "proc-sec1-2": "Monitor stock levels and ensure timely procurement.",
        "proc-sec1-3":
          "Collaborate with suppliers and negotiate supply terms and conditions.",
        "proc-sec1-4":
          "Inspect and verify quality and quantity of received goods.",
        "proc-sec2-title": "II. Warehouse and Inventory Management",
        "proc-sec2-1": "Supervise goods entry and exit in the warehouse.",
        "proc-sec2-2": "Ensure accurate inventory recording and documentation.",
        "proc-sec2-3": "Conduct periodic stocktaking and inventory audits.",
        "proc-sec2-4": "Report shortages, damages, and inconsistencies.",
        "proc-sec3-title": "III. Transportation Organization",
        "proc-sec3-1": "Organize transportation and distribution of goods.",
        "proc-sec3-2":
          "Ensure all transport documentation is compliant and complete.",
        "proc-sec3-3":
          "Coordinate with departments to guarantee on-time deliveries.",
        "proc-sec4-title": "IV. Reporting and Control",
        "proc-sec4-1": "Prepare periodic reports for senior management.",
        "proc-sec4-2":
          "Monitor logistics costs and propose optimization opportunities.",
        "proc-sec4-3":
          "Ensure compliance with internal procedures and legal regulations.",
        "proc-apply-btn": "Apply Now",
      },
      de: {
        "proc-title": "Einkauf / Logistik",
        "proc-meta-company": "Unternehmen: Ideoma Sh.p.k.",
        "proc-meta-location": "Standort: Derand Hotel, Prishtina",
        "proc-meta-department": "Abteilung: Einkauf & Logistik",
        "proc-intro":
          "Die Rolle Einkauf/Logistik ist verantwortlich fuer das Management von Lieferungen, Lagerbestand, Warenfluss, Transport, Reporting und Compliance, um einen effizienten und unterbrechungsfreien Hotelbetrieb sicherzustellen.",
        "proc-sec1-title": "I. Liefer- und Einkaufsmanagement",
        "proc-sec1-1":
          "Lieferung von Waren und Betriebsmaterialien planen und koordinieren.",
        "proc-sec1-2":
          "Lagerbestaende ueberwachen und rechtzeitige Beschaffung sicherstellen.",
        "proc-sec1-3":
          "Mit Lieferanten zusammenarbeiten und Lieferbedingungen verhandeln.",
        "proc-sec1-4":
          "Qualitaet und Menge eingehender Waren pruefen und verifizieren.",
        "proc-sec2-title": "II. Lager- und Bestandsmanagement",
        "proc-sec2-1": "Warenein- und -ausgang im Lager ueberwachen.",
        "proc-sec2-2":
          "Eine genaue Bestandsbuchung und Dokumentation sicherstellen.",
        "proc-sec2-3":
          "Regelmaessige Inventuren und Bestandspruefungen durchfuehren.",
        "proc-sec2-4": "Engpaesse, Schaeden und Unstimmigkeiten melden.",
        "proc-sec3-title": "III. Transportorganisation",
        "proc-sec3-1": "Transport und Verteilung von Waren organisieren.",
        "proc-sec3-2":
          "Sicherstellen, dass alle Transportdokumente konform und vollstaendig sind.",
        "proc-sec3-3":
          "Mit Abteilungen koordinieren, um puenktliche Lieferungen zu garantieren.",
        "proc-sec4-title": "IV. Reporting und Kontrolle",
        "proc-sec4-1":
          "Regelmaessige Berichte fuer das Senior Management erstellen.",
        "proc-sec4-2":
          "Logistikkosten ueberwachen und Optimierungspotenziale vorschlagen.",
        "proc-sec4-3":
          "Einhaltung interner Verfahren und gesetzlicher Vorgaben sicherstellen.",
        "proc-apply-btn": "Jetzt bewerben",
      },
      al: {
        "proc-title": "Prokurim / Logjistike",
        "proc-meta-company": "Kompania: Ideoma Sh.p.k.",
        "proc-meta-location": "Lokacioni: Derand Hotel, Prishtine",
        "proc-meta-department": "Departamenti: Prokurim & Logjistike",
        "proc-intro":
          "Roli i Prokurimit/Logjistikes eshte pergjegjes per menaxhimin e furnizimeve, stokut, rrjedhes se depos, transportit, raportimit dhe perputhshmerise per te siguruar operacione hoteliere efikase dhe pa nderprerje.",
        "proc-sec1-title": "I. Menaxhimi i Furnizimit dhe Prokurimit",
        "proc-sec1-1":
          "Te planifikoje dhe koordinoje furnizimin me mallra dhe materiale operative.",
        "proc-sec1-2":
          "Te monitoroje nivelet e stokut dhe te siguroje prokurim ne kohe.",
        "proc-sec1-3":
          "Te bashkepunoje me furnitore dhe te negocioje kushtet e furnizimit.",
        "proc-sec1-4":
          "Te inspektoje dhe verifikoje cilesine dhe sasine e mallrave te pranuara.",
        "proc-sec2-title": "II. Menaxhimi i Depos dhe Inventarit",
        "proc-sec2-1": "Te mbikeqyre hyrje-daljet e mallrave ne depo.",
        "proc-sec2-2":
          "Te siguroje regjistrim dhe dokumentim te sakte te inventarit.",
        "proc-sec2-3":
          "Te kryeje numerime periodike te stokut dhe auditime inventari.",
        "proc-sec2-4": "Te raportoje mungesat, demet dhe mospërputhjet.",
        "proc-sec3-title": "III. Organizimi i Transportit",
        "proc-sec3-1": "Te organizoje transportin dhe shperndarjen e mallrave.",
        "proc-sec3-2":
          "Te siguroje qe i gjithe dokumentacioni i transportit te jete i rregullt dhe i plote.",
        "proc-sec3-3":
          "Te koordinoje me departamentet per te garantuar dorezime ne kohe.",
        "proc-sec4-title": "IV. Raportimi dhe Kontrolli",
        "proc-sec4-1":
          "Te pergatise raporte periodike per menaxhmentin e larte.",
        "proc-sec4-2":
          "Te monitoroje kostot logjistike dhe te propozoje mundesi optimizimi.",
        "proc-sec4-3":
          "Te siguroje perputhje me procedurat e brendshme dhe rregulloret ligjore.",
        "proc-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Finance/Admin/HR leadership job page translations (career-finance.html)
  (function extendFinanceLeadershipTranslations() {
    var extra = {
      en: {
        "fin-title": "Head of Finance, Administration, and HR",
        "fin-meta-company": "Company: Ideoma Sh.p.k.",
        "fin-meta-location": "Location: Derand Hotel, Prishtina",
        "fin-intro":
          "The job description, competencies, and responsibilities are defined as follows:",
        "fin-sec1-title": "I. Financial Responsibilities",
        "fin-sec1-1": "Lead and manage all financial processes of the company.",
        "fin-sec1-2":
          "Oversee accounting, financial ledgers, and the preparation of financial statements.",
        "fin-sec1-3":
          "Ensure compliance with the fiscal legislation of the Republic of Kosovo (VAT, Withholding Tax, TAK).",
        "fin-sec1-4": "Monitor cash flow and the company's liquidity.",
        "fin-sec1-5":
          "Control the petty cash, daily/monthly reconciliations, and financial reports.",
        "fin-sec1-6":
          "Prepare the annual budget and periodic financial analyses.",
        "fin-sec1-7":
          "Authorize payments and oversee e-banking and banking relationships.",
        "fin-sec1-8":
          "Review and control financial contracts (rent, suppliers, maintenance, etc.).",
        "fin-sec2-title": "II. Administrative Responsibilities",
        "fin-sec2-1":
          "Organize and oversee the company administrative documentation.",
        "fin-sec2-2":
          "Draft and control internal regulations and administrative policies.",
        "fin-sec2-3":
          "Oversee procurement processes and supplier relationships.",
        "fin-sec2-4": "Ensure the maintenance of company assets and inventory.",
        "fin-sec2-5":
          "Coordinate legal and contractual matters in collaboration with relevant parties.",
        "fin-sec3-title": "III. Human Resources (HR) Responsibilities",
        "fin-sec3-1": "Lead the staff recruitment and selection process.",
        "fin-sec3-2":
          "Prepare and manage employment contracts and employee documentation.",
        "fin-sec3-3":
          "Oversee the calculation of salaries and benefits in accordance with current legislation.",
        "fin-sec3-4":
          "Ensure compliance with the Labor Law of the Republic of Kosovo.",
        "fin-sec3-5":
          "Manage performance evaluations and the professional development of staff.",
        "fin-sec3-6":
          "Handle disciplinary issues and internal conflicts in accordance with company policies.",
        "fin-apply-btn": "Apply Now",
      },
      de: {
        "fin-title": "Leitung Finanzen, Administration und HR",
        "fin-meta-company": "Unternehmen: Ideoma Sh.p.k.",
        "fin-meta-location": "Standort: Derand Hotel, Prishtina",
        "fin-intro":
          "Die Stellenbeschreibung, Kompetenzen und Verantwortlichkeiten sind wie folgt definiert:",
        "fin-sec1-title": "I. Finanzverantwortung",
        "fin-sec1-1":
          "Alle Finanzprozesse des Unternehmens fuehren und steuern.",
        "fin-sec1-2":
          "Buchhaltung, Finanzbuecher und die Erstellung von Finanzabschluessen ueberwachen.",
        "fin-sec1-3":
          "Einhaltung der Steuergesetzgebung der Republik Kosovo sicherstellen (MwSt., Quellensteuer, TAK).",
        "fin-sec1-4": "Cashflow und Liquiditaet des Unternehmens ueberwachen.",
        "fin-sec1-5":
          "Kassenbestand, taegliche/monatliche Abstimmungen und Finanzberichte kontrollieren.",
        "fin-sec1-6": "Jahresbudget und periodische Finanzanalysen erstellen.",
        "fin-sec1-7":
          "Zahlungen freigeben sowie E-Banking und Bankbeziehungen ueberwachen.",
        "fin-sec1-8":
          "Finanzvertraege pruefen und kontrollieren (Miete, Lieferanten, Wartung usw.).",
        "fin-sec2-title": "II. Administrative Verantwortung",
        "fin-sec2-1":
          "Administrative Unternehmensdokumentation organisieren und ueberwachen.",
        "fin-sec2-2":
          "Interne Regelwerke und administrative Richtlinien erstellen und kontrollieren.",
        "fin-sec2-3":
          "Beschaffungsprozesse und Lieferantenbeziehungen ueberwachen.",
        "fin-sec2-4":
          "Instandhaltung von Unternehmenswerten und Inventar sicherstellen.",
        "fin-sec2-5":
          "Rechtliche und vertragliche Angelegenheiten mit relevanten Parteien koordinieren.",
        "fin-sec3-title": "III. Human Resources (HR) Verantwortung",
        "fin-sec3-1":
          "Rekrutierungs- und Auswahlprozess fuer Mitarbeitende leiten.",
        "fin-sec3-2":
          "Arbeitsvertraege und Mitarbeiterdokumentation erstellen und verwalten.",
        "fin-sec3-3":
          "Berechnung von Gehaeltern und Leistungen gemaess geltender Gesetzgebung ueberwachen.",
        "fin-sec3-4":
          "Einhaltung des Arbeitsgesetzes der Republik Kosovo sicherstellen.",
        "fin-sec3-5":
          "Leistungsbewertungen und berufliche Entwicklung der Mitarbeitenden steuern.",
        "fin-sec3-6":
          "Disziplinarische Themen und interne Konflikte gemaess Unternehmensrichtlinien behandeln.",
        "fin-apply-btn": "Jetzt bewerben",
      },
      al: {
        "fin-title": "Udheheqes i Financave, Administrates dhe HR",
        "fin-meta-company": "Kompania: Ideoma Sh.p.k.",
        "fin-meta-location": "Lokacioni: Derand Hotel, Prishtine",
        "fin-intro":
          "Pershkrimi i punes, kompetencat dhe pergjegjesite percaktohen si me poshte:",
        "fin-sec1-title": "I. Pergjegjesite Financiare",
        "fin-sec1-1":
          "Te udheheqe dhe menaxhoje te gjitha proceset financiare te kompanise.",
        "fin-sec1-2":
          "Te mbikeqyre kontabilitetin, librat financiar dhe pergatitjen e pasqyrave financiare.",
        "fin-sec1-3":
          "Te siguroje perputhje me legjislacionin fiskal te Republikes se Kosoves (TVSH, Tatimi ne Burim, TAK).",
        "fin-sec1-4":
          "Te monitoroje rrjedhen e parase dhe likuiditetin e kompanise.",
        "fin-sec1-5":
          "Te kontrolloje arken e imet, rakordimet ditore/mujore dhe raportet financiare.",
        "fin-sec1-6":
          "Te pergatise buxhetin vjetor dhe analiza periodike financiare.",
        "fin-sec1-7":
          "Te autorizoje pagesat dhe te mbikeqyre e-banking dhe marredheniet bankare.",
        "fin-sec1-8":
          "Te rishikoje dhe kontrolloje kontratat financiare (qira, furnitore, mirembajtje, etj.).",
        "fin-sec2-title": "II. Pergjegjesite Administrative",
        "fin-sec2-1":
          "Te organizoje dhe mbikeqyre dokumentacionin administrativ te kompanise.",
        "fin-sec2-2":
          "Te hartoje dhe kontrolloje rregulloret e brendshme dhe politikat administrative.",
        "fin-sec2-3":
          "Te mbikeqyre proceset e prokurimit dhe marredheniet me furnitoret.",
        "fin-sec2-4":
          "Te siguroje mirembajtjen e aseteve dhe inventarit te kompanise.",
        "fin-sec2-5":
          "Te koordinoje ceshtjet ligjore dhe kontraktuale ne bashkepunim me palet relevante.",
        "fin-sec3-title": "III. Pergjegjesite ne Burime Njerezore (HR)",
        "fin-sec3-1":
          "Te udheheqe procesin e rekrutimit dhe perzgjedhjes se stafit.",
        "fin-sec3-2":
          "Te pergatise dhe menaxhoje kontratat e punes dhe dokumentacionin e punonjesve.",
        "fin-sec3-3":
          "Te mbikeqyre llogaritjen e pagave dhe perfitimeve sipas legjislacionit ne fuqi.",
        "fin-sec3-4":
          "Te siguroje perputhje me Ligjin e Punes te Republikes se Kosoves.",
        "fin-sec3-5":
          "Te menaxhoje vleresimet e performances dhe zhvillimin profesional te stafit.",
        "fin-sec3-6":
          "Te trajtoje ceshtjet disiplinore dhe konfliktet e brendshme sipas politikave te kompanise.",
        "fin-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Architect job page translations (career-architect.html)
  (function extendArchitectJobTranslations() {
    var extra = {
      en: {
        "arc-title": "Architect at Ideoma Sh.p.k.",
        "arc-meta-intro":
          "The job description, competencies, and responsibilities are defined as follows:",
        "arc-intro":
          "Design of hospitality spaces (guest rooms, lobby, restaurant, offices, and service areas).",
        "arc-sec1-title": "Main Responsibilities",
        "arc-item-1":
          "Design of hospitality spaces (guest rooms, lobby, restaurant, offices, and service areas).",
        "arc-item-2":
          "Preparation of concepts and detailed technical drawings.",
        "arc-item-3": "Collaboration with management and technical teams.",
        "arc-item-4":
          "Supervision of works during construction and renovations.",
        "arc-item-5":
          "Ensuring compliance with building codes and safety standards.",
        "arc-item-6":
          "Proposing modern and functional solutions to optimize space and aesthetics.",
        "arc-apply-btn": "Apply Now",
      },
      de: {
        "arc-title": "Architekt/in bei Ideoma Sh.p.k.",
        "arc-meta-intro":
          "Die Stellenbeschreibung, Kompetenzen und Verantwortlichkeiten sind wie folgt definiert:",
        "arc-intro":
          "Planung von Hospitality-Bereichen (Gaestezimmer, Lobby, Restaurant, Bueros und Servicebereiche).",
        "arc-sec1-title": "Hauptaufgaben",
        "arc-item-1":
          "Planung von Hospitality-Bereichen (Gaestezimmer, Lobby, Restaurant, Bueros und Servicebereiche).",
        "arc-item-2":
          "Erstellung von Konzepten und detaillierten technischen Zeichnungen.",
        "arc-item-3": "Zusammenarbeit mit Management und technischen Teams.",
        "arc-item-4":
          "Ueberwachung der Arbeiten waehrend Bau- und Renovierungsphasen.",
        "arc-item-5":
          "Sicherstellung der Einhaltung von Bauvorschriften und Sicherheitsstandards.",
        "arc-item-6":
          "Vorschlag moderner und funktionaler Loesungen zur Optimierung von Raum und Aesthetik.",
        "arc-apply-btn": "Jetzt bewerben",
      },
      al: {
        "arc-title": "Arkitekt/e ne Ideoma Sh.p.k.",
        "arc-meta-intro":
          "Pershkrimi i punes, kompetencat dhe pergjegjesite percaktohen si me poshte:",
        "arc-intro":
          "Projektimi i hapesirave hoteliere (dhoma mysafiresh, lobby, restorant, zyra dhe zona sherbimi).",
        "arc-sec1-title": "Pergjegjesite kryesore",
        "arc-item-1":
          "Projektimi i hapesirave hoteliere (dhoma mysafiresh, lobby, restorant, zyra dhe zona sherbimi).",
        "arc-item-2":
          "Pergatitja e koncepteve dhe vizatimeve teknike te detajuara.",
        "arc-item-3": "Bashkepunimi me menaxhmentin dhe ekipet teknike.",
        "arc-item-4": "Mbikeqyrja e punimeve gjate ndertimit dhe renovimeve.",
        "arc-item-5":
          "Sigurimi i perputhjes me kodet e ndertimit dhe standardet e sigurise.",
        "arc-item-6":
          "Propozimi i zgjidhjeve moderne dhe funksionale per optimizimin e hapesires dhe estetikes.",
        "arc-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  // Sales job page translations (career-sales.html)
  (function extendSalesJobTranslations() {
    var extra = {
      en: {
        "sales-title": "Sales at Ideoma Sh.p.k.",
        "sales-meta-intro":
          "The job description, competencies, and responsibilities are defined as follows:",
        "sales-intro":
          "The role focuses on developing new business opportunities and long-term client relationships for hotel services.",
        "sales-sec1-title": "Main Responsibilities",
        "sales-item-1":
          "Identifying and contacting potential clients (companies, travel agencies, event organizers, etc.).",
        "sales-item-2":
          "Presenting and selling hotel rooms, packages, conference halls, and other hotel services.",
        "sales-item-3":
          "Managing relationships with existing clients and building long-term partnerships.",
        "sales-item-4":
          "Preparing offers and contracts, and negotiating terms of cooperation.",
        "sales-item-5":
          "Coordinating with other departments (reception, marketing, kitchen, etc.) to ensure the delivery of sold services.",
        "sales-item-6":
          "Following up on bookings, events, and client requests.",
        "sales-item-7": "Achieving monthly and annual sales targets.",
        "sales-item-8":
          "Participating in trade fairs, events, and promotional activities.",
        "sales-item-9":
          "Conducting market and competitor analysis to identify new sales opportunities.",
        "sales-item-10": "Regular reporting on sales activities and results.",
        "sales-apply-btn": "Apply Now",
      },
      de: {
        "sales-title": "Vertrieb bei Ideoma Sh.p.k.",
        "sales-meta-intro":
          "Die Stellenbeschreibung, Kompetenzen und Verantwortlichkeiten sind wie folgt definiert:",
        "sales-intro":
          "Die Rolle konzentriert sich auf die Entwicklung neuer Geschaeftsmoeglichkeiten und langfristiger Kundenbeziehungen fuer Hoteldienstleistungen.",
        "sales-sec1-title": "Hauptaufgaben",
        "sales-item-1":
          "Potenzielle Kunden identifizieren und kontaktieren (Unternehmen, Reiseagenturen, Eventveranstalter usw.).",
        "sales-item-2":
          "Hotelzimmer, Pakete, Konferenzsaele und weitere Hoteldienstleistungen praesentieren und verkaufen.",
        "sales-item-3":
          "Beziehungen zu bestehenden Kunden pflegen und langfristige Partnerschaften aufbauen.",
        "sales-item-4":
          "Angebote und Vertraege vorbereiten sowie Kooperationsbedingungen verhandeln.",
        "sales-item-5":
          "Mit anderen Abteilungen (Rezeption, Marketing, Kueche usw.) koordinieren, um die Erbringung verkaufter Leistungen sicherzustellen.",
        "sales-item-6":
          "Buchungen, Veranstaltungen und Kundenanfragen nachverfolgen.",
        "sales-item-7": "Monatliche und jaehrliche Verkaufsziele erreichen.",
        "sales-item-8":
          "An Messen, Veranstaltungen und Promotion-Aktivitaeten teilnehmen.",
        "sales-item-9":
          "Markt- und Wettbewerbsanalysen durchfuehren, um neue Verkaufschancen zu identifizieren.",
        "sales-item-10":
          "Regelmaessig ueber Verkaufsaktivitaeten und Ergebnisse berichten.",
        "sales-apply-btn": "Jetzt bewerben",
      },
      al: {
        "sales-title": "Shitje ne Ideoma Sh.p.k.",
        "sales-meta-intro":
          "Pershkrimi i punes, kompetencat dhe pergjegjesite percaktohen si me poshte:",
        "sales-intro":
          "Roli fokusohet ne zhvillimin e mundesive te reja te biznesit dhe marredhenieve afatgjata me klientet per sherbimet hoteliere.",
        "sales-sec1-title": "Pergjegjesite kryesore",
        "sales-item-1":
          "Identifikimi dhe kontaktimi i klienteve potenciale (kompani, agjenci udhetimi, organizatore eventesh, etj.).",
        "sales-item-2":
          "Prezantimi dhe shitja e dhomave te hotelit, paketave, sallave te konferencave dhe sherbimeve te tjera te hotelit.",
        "sales-item-3":
          "Menaxhimi i marredhenieve me klientet ekzistues dhe ndertimi i partneriteteve afatgjata.",
        "sales-item-4":
          "Pergatitja e ofertave dhe kontratave, si dhe negocimi i kushteve te bashkepunimit.",
        "sales-item-5":
          "Koordinimi me departamentet e tjera (recepsion, marketing, kuzhine, etj.) per te siguruar ofrimin e sherbimeve te shitura.",
        "sales-item-6":
          "Ndjekja e rezervimeve, eventeve dhe kerkesave te klienteve.",
        "sales-item-7": "Arritja e objektivave mujore dhe vjetore te shitjes.",
        "sales-item-8":
          "Pjesemarrja ne panaire, evente dhe aktivitete promovuese.",
        "sales-item-9":
          "Kryerja e analizave te tregut dhe konkurrences per te identifikuar mundesi te reja shitjeje.",
        "sales-item-10":
          "Raportimi i rregullt mbi aktivitetet dhe rezultatet e shitjes.",
        "sales-apply-btn": "Apliko tani",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();

  function repairMojibake(value) {
    if (typeof value !== "string") return value;
    if (!/[ÃÂâ]/.test(value)) return value;
    try {
      var bytes = [];
      for (var i = 0; i < value.length; i++) {
        var code = value.charCodeAt(i);
        if (code > 255) return value;
        bytes.push(code);
      }
      var decoded = new TextDecoder("utf-8").decode(new Uint8Array(bytes));
      return decoded && decoded.indexOf("\uFFFD") === -1 ? decoded : value;
    } catch (e) {
      return value;
    }
  }

  function normalizeLanguageStrings(langObj) {
    if (!langObj || typeof langObj !== "object") return;
    Object.keys(langObj).forEach(function (key) {
      langObj[key] = repairMojibake(langObj[key]);
    });
  }

  normalizeLanguageStrings(translations.en);
  normalizeLanguageStrings(translations.de);
  normalizeLanguageStrings(translations.al);

  function initLanguage() {
    $(".lang-btn").removeClass("lang-active");
    $(".lang-btn[data-lang='" + currentLang + "']").addClass("lang-active");
    var htmlLang = currentLang === "al" ? "sq" : currentLang;
    document.documentElement.setAttribute("lang", htmlLang);
  }

  /** Keep EN / DE / AL labels literal — applyTranslations must never wipe them. */
  function restoreStaticLangLabels() {
    $(".lang-btn[data-lang]").each(function () {
      var code = String($(this).data("lang") || "").toLowerCase();
      if (code === "en") $(this).text("EN");
      else if (code === "de") $(this).text("DE");
      else if (code === "al") $(this).text("AL");
    });
  }

  $(".lang-btn").on("click", function () {
    currentLang = $(this).data("lang");
    try {
      window.localStorage && localStorage.setItem("derandLang", currentLang);
    } catch (e) {}
    initLanguage();
    applyTranslations();
  });

  function applyTranslations() {
    $("[data-i18n]")
      .filter(function () {
        var $el = $(this);
        if ($el.is(".lang-btn")) return false;
        if ($el.find(".lang-btn").length) return false;
        return true;
      })
      .each(function () {
        var key = $(this).data("i18n");
        var text = translations[currentLang][key] || translations.en[key];

        if (text) {
          $(this).html(text);
        }
      });

    $("[data-i18n-placeholder]").each(function () {
      var key = $(this).data("i18n-placeholder");
      var text = translations[currentLang][key] || translations.en[key];

      if (text) {
        $(this).attr("placeholder", text);
      }
    });

    $("[data-i18n-aria-label]").each(function () {
      var key = $(this).data("i18n-aria-label");
      var text = translations[currentLang][key] || translations.en[key];
      if (text) {
        $(this).attr("aria-label", text);
      }
    });

    $("[data-i18n-alt]").each(function () {
      var key = $(this).data("i18n-alt");
      var text = translations[currentLang][key] || translations.en[key];
      if (text) {
        $(this).attr("alt", text);
      }
    });

    var legacyMenuItems = [
      { selector: ".nav-rooms", key: "nav-rooms" },
      { selector: ".nav-restaurant", key: "nav-restaurant" },
      { selector: ".nav-activities", key: "nav-activities" },
      { selector: ".nav-specials", key: "nav-specials" },
      { selector: ".nav-contact", key: "nav-contact" },
    ];

    legacyMenuItems.forEach(function (item) {
      var text =
        translations[currentLang][item.key] || translations.en[item.key];
      if (text && $(".header__menu " + item.selector).length) {
        $(".header__menu " + item.selector).text(text);
      }
    });

    restoreStaticLangLabels();
  }

  initLanguage();
  applyTranslations();

  /*------------------
    Media performance
  --------------------*/
  (function initMediaPerformance() {
    var prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Lazy-load images (except hero images already above the fold).
    document.querySelectorAll("img").forEach(function (img) {
      if (!img || img.getAttribute("loading")) return;
      if (img.closest && img.closest(".sacher-hero")) return;
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
    });

    // Defer autoplaying videos until visible.
    if (!("IntersectionObserver" in window)) return;
    if (prefersReduced) return;

    var videos = document.querySelectorAll(
      "video.sacher-hero__video, video.sacher-instagram__tileVideo, video.sacher-mozart__video",
    );

    if (!videos.length) return;

    var videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          if (!video) return;
          if (entry.isIntersecting) {
            // Some browsers require a direct user gesture before play.
            // If it fails, the page still looks fine (video will stay paused).
            try {
              video.play && video.play();
            } catch (e) {}
          } else {
            try {
              video.pause && video.pause();
            } catch (e) {}
          }
        });
      },
      { threshold: 0.25 },
    );

    videos.forEach(function (v) {
      videoObserver.observe(v);
    });
  })();

  // Add Premium-specific translations
  (function extendPremiumTranslations() {
    var extra = {
      en: {
        "premium-hero-title": "Premium Double Room in Prishtina",
        "premium-headline": "Premium Double",
        "premium-moments-line-1": "Every moment shared ",
        "premium-moments-line-2": "here blossoms into a timeless memory.",
        "premium-preview-copy":
          "Immerse yourself in the opulence of our Premium Double Room. Centered on a lavish double bed, this space is a testament to luxury tailored for your comfort. Meticulously designed for the refined traveler, it offers a seamless fusion of elegance and ease.",
        "premium-director-quote":
          "Our Premium Double Rooms blend modern grace with deep relaxation, offering an exquisite sanctuary of peace and style.",
        "premium-bath-note":
          "Built for guests who want more room to spread out, this Premium layout centers on a generous double bed and polished details that set the tone for a truly indulgent stay.",
      },
      de: {
        "premium-hero-title": "Premium Doppelzimmer in Prishtina",
        "premium-headline": "Premium Doppelzimmer",
        "premium-moments-line-1": "Jeder hier geteilte Moment ",
        "premium-moments-line-2": "wird zu einer zeitlosen Erinnerung.",
        "premium-preview-copy":
          "Tauchen Sie ein in die Opulenz unseres Premium Doppelzimmers. Ein luxurioeses Doppelbett steht im Mittelpunkt dieses Raums, der massgeschneiderten Komfort ausstrahlt. Sorgfaeltig fuer den anspruchsvollen Reisenden gestaltet, verbindet er nahtlos Eleganz und Ruhe.",
        "premium-director-quote":
          "Unsere Premium Doppelzimmer verbinden moderne Anmut mit tiefer Entspannung und bieten einen exquisiten Rueckzugsort voller Ruhe und Stil.",
        "premium-bath-note":
          "Fuer Gaeste, die mehr Raum zum Entfalten wuenschen: dieses Premium Layout stellt ein grosszuegiges Doppelbett in den Mittelpunkt und verbindet es mit ausgewaehlten Details fuer einen besonders luxurioesen Aufenthalt.",
      },
      al: {
        "premium-hero-title": "Dhoma dyshe Premium në Prishtinë",
        "premium-headline": "Dhoma dyshe Premium",
        "premium-moments-line-1": "Çdo moment i ndarë këtu ",
        "premium-moments-line-2": "shndërrohet në një kujtim të përjetshëm.",
        "premium-preview-copy":
          "Zhytuni në luksin e dhomës sonë dyshe Premium. Në qendër të saj qëndron një shtrat dopjo madhështor; hapësira është dëshmi e komoditetit të përshtatur për ju. E projektuar me kujdes për udhëtarin e rafinuar, ofron një përzierje të përsosur mes elegancës dhe rehatisë.",
        "premium-director-quote":
          "Dhomat tona dyshe Premium përziejnë hijeshinë moderne me relaksim të thellë, duke ofruar një strehë të rafinuar të qetësisë dhe stilit.",
        "premium-bath-note":
          "E konceptuar për ata që duan më shumë hapësirë, ky plan Premium përqendrohet në një shtrat dopjo të bollshëm dhe detaje të rafinuara për një qëndrim vërtet relaksues.",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();
  /*------------------
    Parallax Engine (data-parallax)
  --------------------*/

  // Decorate index sections with parallax by default (except the hero 1111.webp)
  (function addIndexParallaxDefaults() {
    var isIndex =
      document.body && document.body.classList.contains("sacher-home");
    if (!isIndex) return;

    // Skip reduced motion
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Helper to mark a node if not already parallax-enabled
    function ensureParallax(node, speed) {
      if (!node || node.hasAttribute("data-parallax")) return;
      node.setAttribute("data-parallax", "y");
      if (speed) node.setAttribute("data-parallax-speed", speed.toString());
    }

    // Exclude anything inside the hero that contains the 1111.webp image
    var hero = document.querySelector(".sacher-hero");
    var excluded = hero ? hero.querySelector("img[src*='1111.webp']") : null;

    // Target all main sections before footer
    var footer = document.querySelector("footer.footer");
    var sections = Array.prototype.slice.call(
      document.querySelectorAll(
        "section, .guest-testimonials, .sacher-welcome, .sacher-facilities, .sacher-events, .sacher-arch-quote",
      ),
    );

    // Apply gentle parallax to section wrappers and their prominent headings
    sections.forEach(function (sec, i) {
      if (
        !sec ||
        (footer &&
          sec.compareDocumentPosition(footer) &
            Node.DOCUMENT_POSITION_FOLLOWING)
      )
        return;
      if (hero && hero.contains(sec)) return; // never within hero

      // Slower baseline speeds
      var speed = 0.045 + (i % 3) * 0.012; // 0.045, 0.057, 0.069 variety
      ensureParallax(sec, speed);
      // Ensure gentle reveal class exists
      if (!sec.classList.contains("scroll-reveal")) {
        sec.classList.add("scroll-reveal", "index-scroll-slow");
      }

      // Headings or key content inside
      var heading = sec.querySelector(
        "h1, h2, h3, .sacher-section-head, .sacher-card__content, .sacher-banner-content, .sacher-feature__content",
      );
      if (heading) {
        ensureParallax(heading, Math.max(0.03, speed - 0.012));
        if (!heading.classList.contains("scroll-reveal")) {
          heading.classList.add("scroll-reveal", "index-scroll-slow");
        }
      }
    });

    // Remove parallax from the excluded hero image if any
    if (excluded) {
      excluded.removeAttribute("data-parallax");
      excluded.removeAttribute("data-parallax-speed");
    }
  })();

  // Add Twin-specific translations
  (function extendTwinTranslations() {
    var extra = {
      en: {
        "twin-hero-title": "Twin Double Room in Prishtina",
        "twin-headline": "Twin Double",
        "twin-size-label": "Size",
        "twin-bed-value": "Twin beds",
        "twin-bed-label": "Bed",
        "twin-concierge-value": "24 h",
        "twin-concierge-label": "Concierge service",
        "twin-water-value": "Water",
        "twin-water-label": "Free",
        "twin-parking-value": "24/7 Parking",
        "twin-parking-label": "Free",
        "twin-moments-line-1": "Transforming simple ",
        "twin-moments-line-2": "moments into a legacy of memories",
        "twin-preview-copy":
          "Discover refined elegance in our Superior Twin Bed Room. Expertly crafted for comfort and functionality, this space features two inviting twin beds, top-tier amenities, and a sleek ensuite bathroom. Perfect for friends or colleagues, it ensures a seamless blend of relaxation and modernity.",
        "twin-director-quote":
          "Designed for effortless relaxation, our Twin Rooms provide a masterfully curated space where modern luxury meets timeless well-being.",
        "twin-bath-note":
          "Two separate twin beds and individual reading lights suit friends or colleagues who want personal sleeping space while still sharing the same refined sitting area and ensuite.",
      },
      de: {
        "twin-hero-title": "Twin Doppelzimmer in Prishtina",
        "twin-headline": "Twin Doppelzimmer",
        "twin-size-label": "Groesse",
        "twin-bed-value": "Twin-Betten",
        "twin-bed-label": "Bett",
        "twin-concierge-value": "24 h",
        "twin-concierge-label": "Concierge-Service",
        "twin-water-value": "Wasser",
        "twin-water-label": "Kostenlos",
        "twin-parking-value": "24/7 Parken",
        "twin-parking-label": "Kostenlos",
        "twin-moments-line-1": "Aus einfachen Momenten wird ",
        "twin-moments-line-2": "ein bleibendes Vermaechtnis an Erinnerungen",
        "twin-preview-copy":
          "Entdecken Sie die raffinierte Eleganz unseres Superior Twin Zimmers. Mit Fokus auf Komfort und Funktionalitaet gestaltet, bietet dieser Raum zwei einladende Twin-Betten, hochwertige Annehmlichkeiten und ein modernes Ensuite-Badezimmer. Ideal fuer Freunde oder Kollegen und perfekt fuer eine nahtlose Verbindung aus Entspannung und moderner Funktionalitaet.",
        "twin-director-quote":
          "Fuer muhelose Entspannung gestaltet, bieten unsere Twin-Zimmer einen meisterhaft kuratierten Raum, in dem moderner Luxus auf zeitloses Wohlbefinden trifft.",
        "twin-bath-note":
          "Zwei getrennte Einzelbetten und eigene Leseleuchten eignen sich fuer Freunde oder Kollegen, die persoenlichen Schlafkomfort schaetzen, aber denselben raffinierten Sitzbereich und die Ensuite teilen.",
      },
      al: {
        "twin-hero-title": "DhomÃ« Dyshe Twin nÃ« PrishtinÃ«",
        "twin-headline": "DhomÃ« Dyshe Twin",
        "twin-size-label": "Madhesia",
        "twin-bed-value": "Dy krevate twin",
        "twin-bed-label": "Shtrati",
        "twin-concierge-value": "24 h",
        "twin-concierge-label": "Sherbim concierge",
        "twin-water-value": "Uje",
        "twin-water-label": "Falas",
        "twin-parking-value": "Parkim 24/7",
        "twin-parking-label": "Falas",
        "twin-moments-line-1": "Duke i kthyer momentet e thjeshta ",
        "twin-moments-line-2": "ne nje trashegimi kujtimesh",
        "twin-preview-copy":
          "Zbuloni elegancen e rafinuar ne Dhomen tone Superior Twin. E projektuar me kujdes per komoditet dhe funksionalitet, kjo hapesire ofron dy krevate twin te rehatshem, sherbime te nivelit te larte dhe nje banjo moderne ensuite. Ideale per miq ose kolege, ajo siguron nje nderthurje te qete te relaksit dhe modernitetit.",
        "twin-director-quote":
          "E projektuar per relaksim pa mundim, Dhoma jone Twin ofron nje hapesire te kuruar me mjeshteri, ku luksi modern takohet me mireqenie te perjetshme.",
        "twin-bath-note":
          "Dy krevate twin te vecanta dhe drita individuale leximi i pershtaten miqve ose kolegeve qe duan hapesire te vecante per gjumin, por ende ndajne te njejten zone qendrimi te rafinuar dhe banjon ensuite.",
      },
    };
    if (window && window.Object && window.Object.assign) {
      Object.assign(translations.en, extra.en);
      Object.assign(translations.de, extra.de);
      Object.assign(translations.al, extra.al);
    }
  })();
  var parallaxNodes = document.querySelectorAll("[data-parallax]");
  var isParallaxTicking = false;
  var prefersReducedMotion = false;

  if (window.matchMedia) {
    prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }

  function updateParallax() {
    var viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    var isMobileViewport = window.innerWidth <= 991;
    var isSmallViewport = window.innerWidth <= 575;

    parallaxNodes.forEach(function (node) {
      var rect = node.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > viewportHeight) {
        return;
      }

      var type = node.getAttribute("data-parallax"); // "bg" | "y"
      var speedAttr = node.getAttribute("data-parallax-speed");
      // Default slower parallax
      var speed = speedAttr ? parseFloat(speedAttr) : 0.09;
      if (Number.isNaN(speed)) speed = 0.18;

      var progress =
        (viewportHeight - rect.top) / (viewportHeight + rect.height);
      var clampedProgress = Math.min(1, Math.max(0, progress));

      if (prefersReducedMotion) {
        if (type === "bg") {
          node.style.backgroundPosition = "center center";
        } else {
          node.style.transform = "translate3d(0, 0, 0)";
        }
        return;
      }

      if (type === "bg") {
        var bgRangePercent =
          speed * (isMobileViewport ? (isSmallViewport ? 6 : 8) : 14);
        var bgY = 50 - bgRangePercent + clampedProgress * bgRangePercent;
        node.style.backgroundPosition = "center " + bgY.toFixed(2) + "%";
      } else {
        var maxPx =
          speed * (isMobileViewport ? (isSmallViewport ? 22 : 36) : 110);
        var translateY = -maxPx + clampedProgress * maxPx;
        node.style.transform =
          "translate3d(0, " + translateY.toFixed(1) + "px, 0)";
      }
    });

    isParallaxTicking = false;
  }

  function requestParallaxUpdate() {
    if (!isParallaxTicking) {
      window.requestAnimationFrame(updateParallax);
      isParallaxTicking = true;
    }
  }

  if (parallaxNodes.length) {
    updateParallax();
    window.addEventListener("scroll", requestParallaxUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestParallaxUpdate);
  }

  /*------------------
    Scroll Reveal
  --------------------*/
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  document.querySelectorAll(".scroll-reveal").forEach(function (el) {
    var delay = el.getAttribute("data-reveal-delay");
    if (delay) {
      var normalizedDelay = /s$/.test(delay) ? delay : delay + "s";
      el.style.transitionDelay = normalizedDelay;
    }
    revealObserver.observe(el);
  });

  /*------------------
    Room specs carousel (below 360Â° preview on room pages)
  --------------------*/
  document.querySelectorAll("[data-room-specs]").forEach(function (root) {
    var panels = root.querySelectorAll(".room-specs__panel");
    var dots = root.querySelectorAll(".room-specs__dot");
    var nextBtns = root.querySelectorAll(".room-specs__arrow--next");
    var prevBtns = root.querySelectorAll(".room-specs__arrow--prev");
    if (!panels.length) return;
    var current = 0;

    function show(index) {
      var n = Math.max(0, Math.min(panels.length - 1, index));
      current = n;
      panels.forEach(function (p, i) {
        p.hidden = i !== n;
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === n);
        d.setAttribute("aria-selected", i === n ? "true" : "false");
      });
    }

    nextBtns.forEach(function (nextBtn) {
      nextBtn.addEventListener("click", function () {
        show(current + 1);
      });
    });
    prevBtns.forEach(function (prevBtn) {
      prevBtn.addEventListener("click", function () {
        show(current - 1);
      });
    });
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () {
        show(i);
      });
    });
    show(0);
  });

  /*------------------
    Cookie consent banner
  --------------------*/
  (function initCookieConsent() {
    var storageKey = "derandCookieConsent";
    var existing = null;
    try {
      existing = window.localStorage && localStorage.getItem(storageKey);
    } catch (e) {
      existing = null;
    }
    if (existing === "accepted") return;

    var copy = {
      en: {
        title: "Cookies & Privacy",
        text: "By continuing, you agree to our Privacy Policy and use of cookies. Your data is processed securely and you may request deletion at any time.",
        accept: "Accept All",
        decline: "Decline",
      },
      de: {
        title: "Cookies & Datenschutz",
        text: "Wir verwenden Cookies, um Ihr Erlebnis zu verbessern und den Datenverkehr zu analysieren.",
        accept: "Alle akzeptieren",
        decline: "Ablehnen",
      },
      al: {
        title: "Cookies & Privatësia",
        text: "Ne përdorim cookies për të përmirësuar përvojën tuaj dhe për të analizuar trafikun.",
        accept: "Prano të gjitha",
        decline: "Refuzo",
      },
    };

    var lang =
      typeof currentLang === "string" && copy[currentLang] ? currentLang : "en";
    var t = copy[lang];

    var banner = document.createElement("div");
    banner.className = "cookie-consent";
    banner.innerHTML =
      '<div class="cookie-consent__inner">' +
      '<h4 class="cookie-consent__title">' +
      t.title +
      "</h4>" +
      '<p class="cookie-consent__text">' +
      t.text +
      "</p>" +
      '<div class="cookie-consent__actions">' +
      '<button type="button" class="cookie-consent__btn cookie-consent__btn--decline">' +
      t.decline +
      "</button>" +
      '<button type="button" class="cookie-consent__btn cookie-consent__btn--accept">' +
      t.accept +
      "</button>" +
      "</div>" +
      "</div>";

    function closeWith(value) {
      try {
        if (window.localStorage) {
          if (value === "accepted") {
            localStorage.setItem(storageKey, value);
          } else {
            localStorage.removeItem(storageKey);
          }
        }
      } catch (e) {}
      banner.classList.add("is-hidden");
      setTimeout(function () {
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
      }, 220);
    }

    document.body.appendChild(banner);
    banner
      .querySelector(".cookie-consent__btn--accept")
      .addEventListener("click", function () {
        closeWith("accepted");
      });
    banner
      .querySelector(".cookie-consent__btn--decline")
      .addEventListener("click", function () {
        closeWith("declined");
      });
  })();
})(jQuery);
