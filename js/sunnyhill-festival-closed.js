(function () {
  function showClosedToast() {
    var toast = document.getElementById("sunnyhill-closed-toast");
    if (!toast) return;
    toast.hidden = false;
    toast.classList.add("is-visible");
  }

  function hideClosedToast() {
    var toast = document.getElementById("sunnyhill-closed-toast");
    if (!toast) return;
    toast.classList.remove("is-visible");
    toast.hidden = true;
  }

  function blockReservationLink(el) {
    if (!el || el.dataset.festivalClosedBound === "1") return;
    el.dataset.festivalClosedBound = "1";
    el.setAttribute("aria-disabled", "true");
    el.classList.add("stay-row__cta--closed");

    el.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      showClosedToast();
    });
  }

  function init() {
    document.body.classList.add("sunnyhill-page--festival-closed");

    document
      .querySelectorAll(".stay-row__cta[data-room], a[data-room-link]")
      .forEach(blockReservationLink);

    document.querySelectorAll('a[href*="booking-details"]').forEach(function (el) {
      if (el.dataset.festivalClosedBound === "1") return;
      blockReservationLink(el);
    });

    var toast = document.getElementById("sunnyhill-closed-toast");
    if (toast) {
      var closeBtn = toast.querySelector(".sunnyhill-festival-closed-toast__close");
      if (closeBtn) {
        closeBtn.addEventListener("click", hideClosedToast);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
