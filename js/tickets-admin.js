(function () {
  "use strict";

  var API = "api/tickets-admin.php";
  var REFRESH_MS = 60000;

  var ROLE_LABEL = { admin: "Hotel admin", staff: "Reception", partner: "Festival partner" };
  var ROLE_INFO = {
    admin: "Everything: festivals, prices, ticket limits, users and all sales.",
    staff: "Sees every festival, sells tickets at the desk, records tickets received from organizers and hands tickets to guests.",
    partner: "Festival organizer. Sees only their own festival(s): tickets sold and how many tickets to bring to the hotel. Read-only."
  };
  var PAY_LABEL = { online: "Online card (RaiAccept)", cash: "Cash at reception", card: "Card at reception", bank: "Bank transfer", complimentary: "Complimentary" };
  var MONTHS = ["Not set", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var BADGE_STYLES = { rose: "Red", cyan: "Blue", purple: "Purple", emerald: "Green" };
  var BADGE_ICONS = ["flame", "ticket", "music", "film", "badge-check", "star", "sparkles", "crown", "party-popper", "mic"];

  var ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v2M13 11v2M13 16v2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    settings: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    ok: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    euro: '<path d="M18 7a7 7 0 1 0 0 10M4 10h10M4 14h10"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"/>',
    printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M17.9 17.9A10 10 0 0 1 12 19c-6.5 0-10-7-10-7a18 18 0 0 1 5.1-5.9M9.9 5.2A9 9 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2M1 1l22 22"/><path d="M14.1 14.1a3 3 0 1 1-4.2-4.2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    hourglass: '<path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"/>'
  };

  var S = {
    data: null,
    csrf: "",
    route: { view: "overview", id: "" },
    orderFilter: { festival: "all", status: "paid", handover: "all", q: "" },
    festOrderFilter: { status: "paid", q: "" },
    auditQ: "",
    loadedAt: 0
  };

  /* ------------------------------------------------------------ Helpers */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function icon(name, cls) {
    return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function eur(n) {
    n = Number(n) || 0;
    return "€" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }
  function int(n) { return (Number(n) || 0).toLocaleString("en-US"); }
  function fmtDate(iso, withTime) {
    if (!iso) return "—";
    var d = new Date(iso);
    if (isNaN(d)) return "—";
    var o = { day: "2-digit", month: "short", year: "numeric" };
    if (withTime !== false) { o.hour = "2-digit"; o.minute = "2-digit"; }
    return d.toLocaleString("en-GB", o);
  }
  function ago(iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (!isFinite(s)) return "never";
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + " min ago";
    if (s < 86400) return Math.floor(s / 3600) + " h ago";
    if (s < 86400 * 30) return Math.floor(s / 86400) + " days ago";
    return fmtDate(iso, false);
  }
  function role() { return S.data && S.data.user ? S.data.user.role : ""; }
  function isAdmin() { return role() === "admin"; }
  function isDesk() { return role() === "admin" || role() === "staff"; }
  function isPartner() { return role() === "partner"; }
  function festById(id) { return (S.data.festivals || []).filter(function (f) { return f.id === id; })[0] || null; }
  function tierOf(f, key) { return (f.tiers || []).filter(function (t) { return t.key === key; })[0] || null; }
  function tierStats(f, key) { return (f.stats && f.stats.tiers && f.stats.tiers[key]) || {}; }
  function bg(url) { return url ? "background-image:url('" + esc(String(url).replace(/'/g, "%27")) + "')" : ""; }
  function isHolding(o) {
    return o.status === "pending" && Date.now() - new Date(o.createdAt).getTime() < (S.data.holdMinutes || 30) * 60000;
  }

  function toast(msg, bad) {
    var t = $("#toast");
    t.textContent = msg;
    t.className = "toast show" + (bad ? " bad" : "");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.className = "toast" + (bad ? " bad" : ""); }, bad ? 4200 : 2600);
  }

  /* --------------------------------------------------------------- API */
  function handle(r) {
    return r.text().then(function (text) {
      var d = {};
      try { d = text ? JSON.parse(text) : {}; } catch (e) { d = { error: "The server returned an unexpected answer (" + r.status + ")." }; }
      if (r.status === 401 && S.data) {
        S.data = null;
        closeAllModals();
        showLogin(d.error || "Your session has ended. Please sign in again.");
      }
      if (!r.ok || d.ok === false) {
        var err = new Error(d.error || "Request failed (" + r.status + ").");
        err.status = r.status;
        throw err;
      }
      return d;
    });
  }
  function api(action, payload) {
    var body = { action: action };
    Object.keys(payload || {}).forEach(function (k) { body[k] = payload[k]; });
    return fetch(API, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-CSRF-Token": S.csrf },
      body: JSON.stringify(body)
    }).then(handle);
  }
  function loadSession() {
    return fetch(API + "?action=session", { credentials: "same-origin", headers: { Accept: "application/json" }, cache: "no-store" }).then(handle);
  }
  /* Every write returns the fresh dataset, so the screen is always in sync with the server. */
  function mutate(action, payload, okMsg) {
    return api(action, payload).then(function (d) {
      applyData(d);
      if (okMsg) toast(okMsg);
      return d;
    });
  }

  /* ----------------------------------------------------------- Screens */
  function showOnly(id) {
    ["boot", "login-view", "password-view", "shell"].forEach(function (x) { $("#" + x).hidden = x !== id; });
  }
  function showLogin(message) {
    showOnly("login-view");
    $("#login-error").textContent = message || "";
    var u = $("#login-form").username;
    setTimeout(function () { (u.value ? $("#login-form").password : u).focus(); }, 30);
  }
  function applyData(d) {
    if (!d || !d.user) { S.data = null; showLogin(); return; }
    S.data = d;
    S.csrf = d.csrf || S.csrf;
    S.loadedAt = Date.now();
    if (d.user.mustChangePassword) {
      showOnly("password-view");
      setTimeout(function () { $("#first-password-form").current.focus(); }, 30);
      return;
    }
    showOnly("shell");
    readRoute();
    render();
  }

  $("#login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, btn = $("button[type=submit]", f);
    $("#login-error").textContent = "";
    if (!f.username.value.trim() || !f.password.value) { $("#login-error").textContent = "Enter your username and password."; return; }
    btn.disabled = true;
    api("login", { username: f.username.value.trim(), password: f.password.value })
      .then(function (d) { f.password.value = ""; applyData(d); })
      .catch(function (err) { $("#login-error").textContent = err.message; f.password.select(); })
      .then(function () { btn.disabled = false; });
  });

  $("#first-password-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, out = $("#first-password-error"), btn = $("button[type=submit]", f);
    out.textContent = "";
    if (f["new"].value !== f.repeat.value) { out.textContent = "The new passwords do not match."; return; }
    btn.disabled = true;
    api("change_password", { current: f.current.value, "new": f["new"].value })
      .then(function (d) { f.reset(); applyData(d); toast("Password saved. Welcome!"); })
      .catch(function (err) { out.textContent = err.message; })
      .then(function () { btn.disabled = false; });
  });

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-toggle-pw]");
    if (t) {
      var input = t.parentNode.querySelector("input");
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      t.innerHTML = icon(show ? "eyeOff" : "eye");
      t.setAttribute("aria-label", show ? "Hide password" : "Show password");
    }
    if (e.target.closest("[data-logout]")) {
      api("logout").catch(function () {}).then(function () {
        S.data = null;
        closeAllModals();
        location.hash = "";
        showLogin();
      });
    }
  });
  $$("[data-toggle-pw]").forEach(function (b) { b.innerHTML = icon("eye"); });

  /* ------------------------------------------------------------ Routing */
  function defaultRoute() {
    if (isPartner() && S.data.festivals.length === 1) return { view: "festival", id: S.data.festivals[0].id };
    return { view: "overview", id: "" };
  }
  function readRoute() {
    var parts = (location.hash || "").replace(/^#\/?/, "").split("/");
    var view = parts[0] || "", id = decodeURIComponent(parts[1] || "");
    var allowed = { overview: 1, festival: 1, orders: 1, account: 1 };
    if (isAdmin()) { allowed.manage = 1; allowed.users = 1; allowed.activity = 1; }
    if (!allowed[view] || (view === "festival" && !festById(id))) {
      S.route = defaultRoute();
      return;
    }
    S.route = { view: view, id: id };
  }
  window.addEventListener("hashchange", function () {
    if (!S.data) return;
    readRoute();
    render();
    window.scrollTo(0, 0);
    $("#shell").classList.remove("nav-open");
  });
  function go(hash) {
    if (location.hash === hash) { readRoute(); render(); } else location.hash = hash;
  }

  /* --------------------------------------------------------- Navigation */
  function navLink(href, ic, label, active, extra) {
    return '<a class="nav-link' + (active ? " is-active" : "") + '" href="' + href + '">' + ic + "<span>" + esc(label) + "</span>" + (extra || "") + "</a>";
  }
  function renderNav() {
    var r = S.route, u = S.data.user;
    var ordersPaid = S.data.orders.filter(function (o) { return o.status === "paid" && !o.collected; }).length;
    $("#nav-main").innerHTML =
      navLink("#/overview", icon("grid"), "Overview", r.view === "overview") +
      navLink("#/orders", icon("list"), "Orders", r.view === "orders", ordersPaid && !isPartner() ? '<em title="Paid, not yet handed to guest">' + ordersPaid + "</em>" : "");

    $("#nav-festivals").innerHTML = S.data.festivals.length ? S.data.festivals.map(function (f) {
      var on = f.active && f.salesOpen;
      var bring = f.stats.total.toBring;
      return navLink("#/festival/" + encodeURIComponent(f.id), '<span class="nav-dot' + (on ? " on" : "") + '" title="' + (on ? "Selling online" : "Not selling online") + '"></span>', f.name,
        r.view === "festival" && r.id === f.id, bring ? '<em class="alert" title="Tickets still to bring">' + bring + "</em>" : "");
    }).join("") : '<p class="side__label" style="text-transform:none;letter-spacing:0">No festivals yet</p>';

    $("#nav-admin").innerHTML = isAdmin()
      ? '<div class="side__label">Administration</div>' +
        navLink("#/manage", icon("settings"), "Festivals & prices", r.view === "manage") +
        navLink("#/users", icon("users"), "Users & access", r.view === "users") +
        navLink("#/activity", icon("clock"), "Activity log", r.view === "activity")
      : "";

    $("#me").innerHTML = '<span class="avatar">' + esc((u.name || u.username).charAt(0).toUpperCase()) + '</span><span><b>' + esc(u.name || u.username) + "</b><small>" + esc(ROLE_LABEL[u.role] || u.role) + "</small></span>";
  }

  /* ------------------------------------------------------------- Render */
  function render() {
    if (!S.data) return;
    renderNav();
    var r = S.route, title = "Overview", html = "";
    if (r.view === "festival") { var f = festById(r.id); title = f.name; html = viewFestival(f); }
    else if (r.view === "orders") { title = "Orders"; html = viewOrders(); }
    else if (r.view === "manage") { title = "Festivals & prices"; html = viewManage(); }
    else if (r.view === "users") { title = "Users & access"; html = viewUsers(); }
    else if (r.view === "activity") { title = "Activity log"; html = viewActivity(); }
    else if (r.view === "account") { title = "My account"; html = viewAccount(); }
    else html = viewOverview();
    $("#page-title").textContent = title;
    document.title = title + " · Derand Ticket Admin";
    $("#view").innerHTML = html;
    $("#updated-at").textContent = "Updated " + new Date(S.loadedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    var search = $("#view [data-focus-keep]");
    if (search && render.keepFocus) {
      search.focus();
      search.setSelectionRange(search.value.length, search.value.length);
    }
    render.keepFocus = false;
  }

  function kpi(ic, label, value, hint, mod) {
    return '<div class="card kpi' + (mod ? " kpi--" + mod : "") + '"><div class="kpi__label">' + icon(ic) + esc(label) + '</div><div class="kpi__value num">' + value + '</div><div class="kpi__hint">' + esc(hint || "") + "</div></div>";
  }
  function sumTotals(list) {
    var t = { sold: 0, revenue: 0, toBring: 0, readyAtHotel: 0, collected: 0, orders: 0, held: 0, received: 0 };
    list.forEach(function (f) { Object.keys(t).forEach(function (k) { t[k] += Number(f.stats.total[k]) || 0; }); });
    return t;
  }
  function capacityOf(f) {
    var cap = 0, limited = true;
    f.tiers.forEach(function (t) { if (t.capacity == null) limited = false; else cap += t.capacity; });
    return limited ? cap : null;
  }

  /* What still needs to come from the organizer, per festival / ticket type. */
  function bringCallout(list, partnerView) {
    var items = [];
    list.forEach(function (f) {
      f.tiers.forEach(function (t) {
        var n = tierStats(f, t.key).toBring || 0;
        if (n > 0) items.push((list.length > 1 ? f.name + " · " : "") + t.label + " × " + n);
      });
    });
    var sold = sumTotals(list).sold;
    if (!items.length) {
      if (!sold) return "";
      return '<div class="callout callout--ok">' + icon("ok") + "<div><h3>All sold tickets are at the hotel</h3><p>" +
        (partnerView ? "Thank you — every ticket sold so far has been delivered to Derand Hotel." : "Every ticket sold so far has been delivered by the organizer.") + "</p></div></div>";
    }
    return '<div class="callout">' + icon("truck") + "<div><h3>" +
      (partnerView ? "Please bring these tickets to Derand Hotel" : "Organizers still need to bring these tickets") + "</h3><p>" +
      (partnerView ? "Sold online or at our reception and not yet delivered to the hotel." : "Sold, but the physical tickets are not at the hotel yet.") +
      "</p><ul>" + items.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div></div>";
  }

  function statusChips(o) {
    var pay;
    if (o.status === "paid") pay = '<span class="chip chip--ok">Paid</span>';
    else if (o.status === "pending") pay = isHolding(o) ? '<span class="chip chip--warn">In checkout</span>' : '<span class="chip">Not completed</span>';
    else if (o.status === "failed") pay = '<span class="chip chip--bad">Payment failed</span>';
    else if (o.status === "refunded") pay = '<span class="chip chip--bad">Refunded</span>';
    else pay = '<span class="chip chip--bad">Cancelled</span>';
    return pay;
  }
  function handoverCell(o) {
    if (o.status !== "paid") return '<span class="faint">—</span>';
    if (o.collected) return '<span class="chip chip--ok" title="' + esc(fmtDate(o.collectedAt) + (o.collectedBy ? " by " + o.collectedBy : "")) + '">Handed over</span>';
    if (isDesk()) return '<button class="btn btn--sm" type="button" data-act="handover" data-id="' + esc(o.id) + '">' + icon("hand") + "Hand over</button>";
    return '<span class="chip chip--warn">Waiting for guest</span>';
  }

  function ordersTable(list, opts) {
    opts = opts || {};
    if (!list.length) return '<div class="card__empty">' + esc(opts.empty || "No orders yet.") + "</div>";
    var partner = isPartner();
    var head = "<tr><th>Order</th><th>Guest</th>" + (opts.hideFestival ? "" : "<th>Festival</th>") + "<th>Ticket type</th><th class=right>Qty</th><th class=right>" + (partner ? "Tickets" : "Paid") + "</th>" + (partner ? "" : "<th>Status</th>") + "<th>Hand-over</th></tr>";
    var rows = list.map(function (o) {
      var amount = partner ? o.ticketTotal : (o.total || o.ticketTotal);
      return '<tr class="clickable" data-order="' + esc(o.id) + '">' +
        '<td><span class="strong">' + esc(o.id) + '</span><span class="sub">' + esc(fmtDate(o.paidAt || o.createdAt)) + (o.source === "manual" ? " · reception" : "") + "</span></td>" +
        '<td><span class="strong">' + esc(o.guestName || "—") + "</span>" + (!partner && o.guest && o.guest.email ? '<span class="sub">' + esc(o.guest.email) + "</span>" : "") + "</td>" +
        (opts.hideFestival ? "" : "<td>" + esc((festById(o.festivalId) || {}).name || o.festivalName) + "</td>") +
        "<td>" + esc(o.tierLabel) + (!partner && o.mode === "bundle" ? '<span class="sub">+ ' + esc(o.roomLabel) + ", " + esc(o.nights) + " nights</span>" : "") + "</td>" +
        '<td class="right num strong">' + int(o.quantity) + "</td>" +
        '<td class="right num">' + eur(amount) + "</td>" +
        (partner ? "" : "<td>" + statusChips(o) + "</td>") +
        "<td>" + handoverCell(o) + "</td></tr>";
    }).join("");
    return '<div class="table-wrap"><table class="tbl"><thead>' + head + "</thead><tbody>" + rows + "</tbody></table></div>";
  }

  function filterOrders(list, f) {
    var q = (f.q || "").trim().toLowerCase();
    return list.filter(function (o) {
      if (f.festival && f.festival !== "all" && o.festivalId !== f.festival) return false;
      if (f.status === "paid" && o.status !== "paid") return false;
      if (f.status === "pending" && o.status !== "pending") return false;
      if (f.status === "closed" && ["cancelled", "refunded", "failed"].indexOf(o.status) < 0) return false;
      if (f.handover === "waiting" && !(o.status === "paid" && !o.collected)) return false;
      if (f.handover === "done" && !o.collected) return false;
      if (q) {
        var hay = [o.id, o.guestName, o.tierLabel, o.festivalName, o.guest && o.guest.email, o.guest && o.guest.phone, o.note].join(" ").toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  function statusSelect(name, value) {
    var opts = [["paid", "Paid orders"], ["all", "All orders"], ["pending", "Checkout not finished"], ["closed", "Cancelled / refunded / failed"]];
    return '<select class="select" data-filter="' + name + '">' + opts.map(function (o) {
      return '<option value="' + o[0] + '"' + (o[0] === value ? " selected" : "") + ">" + o[1] + "</option>";
    }).join("") + "</select>";
  }

  /* -------------------------------------------------------------- Views */
  function viewOverview() {
    var list = S.data.festivals, t = sumTotals(list), partner = isPartner();
    var hello = (S.data.user.name || S.data.user.username).split(" ")[0];
    var html = '<div><h2 style="margin:0 0 2px;font-size:22px">Hello, ' + esc(hello) + '</h2><p class="muted" style="margin:0">' +
      (partner ? "Here is how tickets for your festival" + (list.length > 1 ? "s are" : " is") + " selling at Derand Hotel." : "Festival ticket sales across all partners.") + "</p></div>";

    html += '<div class="kpis">' +
      kpi("ticket", "Tickets sold", int(t.sold), t.orders + (t.orders === 1 ? " order" : " orders")) +
      kpi("euro", "Ticket revenue", eur(t.revenue), "tickets only, excl. rooms") +
      kpi("truck", "Still to bring", int(t.toBring), "from organizers to the hotel", t.toBring ? "warn" : "") +
      kpi("hand", "Handed to guests", int(t.collected), int(t.readyAtHotel) + " ready at reception", t.collected ? "ok" : "") +
      "</div>";

    html += bringCallout(list, partner);

    if (!list.length) {
      html += '<div class="card card__empty">' + (isAdmin() ? 'No festivals yet. <a href="#/manage">Add the first festival</a>.' : "No festivals are assigned to your account yet. Please contact Derand Hotel.") + "</div>";
    } else {
      html += '<div class="fest-grid">' + list.map(function (f) {
        var s = f.stats.total, cap = capacityOf(f);
        var bar = cap ? '<div><div class="bar"><i style="width:' + Math.min(100, s.sold / cap * 100) + '%"></i><i style="width:' + Math.min(100, s.held / cap * 100) + '%"></i></div><small class="muted">' + int(s.sold) + " of " + int(cap) + " sold" + (s.held ? " · " + s.held + " in checkout" : "") + "</small></div>" : "";
        return '<a class="card fest-card" href="#/festival/' + encodeURIComponent(f.id) + '">' +
          '<div class="fest-card__img" style="' + bg(f.img) + '"><div class="fest-card__title"><b>' + esc(f.name) + "</b><small>" + esc(f.dates) + (f.city ? " · " + esc(f.city) : "") + "</small></div></div>" +
          '<div class="fest-card__body">' +
            (partner ? "" : '<div class="chips">' + (f.active ? '<span class="chip chip--ok">On website</span>' : '<span class="chip">Hidden</span>') + (f.salesOpen ? '<span class="chip chip--info">Sales open</span>' : '<span class="chip chip--warn">Sales closed</span>') + "</div>") +
            '<div class="fest-card__stats"><div><b class="num">' + int(s.sold) + '</b><small>Sold</small></div><div><b class="num"' + (s.toBring ? ' style="color:var(--warn)"' : "") + ">" + int(s.toBring) + '</b><small>To bring</small></div><div><b class="num">' + int(s.collected) + "</b><small>Handed out</small></div></div>" +
            bar +
          "</div></a>";
      }).join("") + "</div>";
    }

    var recent = S.data.orders.filter(function (o) { return o.status === "paid"; }).slice(0, 8);
    html += '<div class="card"><div class="card__head"><h2>Latest sales</h2><a class="btn btn--sm" href="#/orders">All orders</a></div>' +
      ordersTable(recent, { empty: "No tickets sold yet." }) + "</div>";
    return html;
  }

  function viewFestival(f) {
    var s = f.stats.total, partner = isPartner(), desk = isDesk();
    var orders = S.data.orders.filter(function (o) { return o.festivalId === f.id; });
    var filtered = filterOrders(orders, S.festOrderFilter);
    var deliveries = S.data.deliveries.filter(function (d) { return d.festivalId === f.id; });
    var organizer = [f.organizer, f.organizerPhone, f.organizerEmail].filter(Boolean).map(esc).join(" · ");

    var html = '<section class="fest-hero" style="' + bg(f.img) + '"><div class="fest-hero__inner"><div class="grow">' +
      '<div class="chips" style="margin-bottom:10px">' +
        (f.active ? '<span class="chip chip--ok">On website</span>' : '<span class="chip chip--bad">Hidden from website</span>') +
        (f.salesOpen ? '<span class="chip chip--ok">Online sales open</span>' : '<span class="chip chip--bad">Online sales closed</span>') +
      "</div><h2>" + esc(f.name) + "</h2><p>" + esc([f.dates, f.city, f.genre].filter(Boolean).join(" · ")) + "</p>" +
      (organizer && !partner ? '<p style="margin-top:6px;font-size:13px">Organizer: ' + organizer + "</p>" : "") +
      '</div><div class="toolbar">' +
        (desk ? '<button class="btn btn--primary" type="button" data-act="delivery" data-fest="' + esc(f.id) + '">' + icon("truck") + "Tickets received</button>" +
                '<button class="btn" type="button" data-act="manual-sale" data-fest="' + esc(f.id) + '">' + icon("plus") + "Sell at reception</button>" : "") +
        '<a class="btn" href="' + API + "?action=export&festival=" + encodeURIComponent(f.id) + '">' + icon("download") + "Export</a>" +
        '<button class="btn" type="button" data-act="print">' + icon("printer") + "Print</button>" +
        (isAdmin() ? '<button class="btn" type="button" data-act="edit-fest" data-fest="' + esc(f.id) + '">' + icon("edit") + "Edit</button>" : "") +
      "</div></div></section>";

    html += '<div class="kpis">' +
      kpi("ticket", "Tickets sold", int(s.sold), s.orders + (s.orders === 1 ? " order" : " orders") + (s.held && !partner ? " · " + s.held + " in checkout" : "")) +
      kpi("euro", "Ticket revenue", eur(s.revenue), "tickets only") +
      kpi("truck", "Still to bring", int(s.toBring), int(s.received) + " received so far", s.toBring ? "warn" : "") +
      kpi("hand", "Handed to guests", int(s.collected), int(s.readyAtHotel) + " waiting at reception", s.collected ? "ok" : "") +
      "</div>";

    html += bringCallout([f], partner);

    /* Ticket types */
    var tot = { sold: 0, held: 0, received: 0, toBring: 0, collected: 0, revenue: 0 };
    var rows = f.tiers.map(function (t) {
      var st = tierStats(f, t.key);
      Object.keys(tot).forEach(function (k) { tot[k] += Number(st[k]) || 0; });
      var left = st.remaining == null ? '<span class="faint">No limit</span>' : (st.remaining === 0 ? '<span class="chip chip--bad">Sold out</span>' : int(st.remaining));
      return "<tr><td><span class=strong>" + esc(t.label) + "</span>" + (t.active ? "" : ' <span class="chip">Off</span>') + '<span class="sub">' + esc(t.note) + "</span></td>" +
        '<td class="right num">' + eur(t.price) + "</td>" +
        '<td class="right num strong">' + int(st.sold) + "</td>" +
        (partner ? "" : '<td class="right num">' + (st.held ? int(st.held) : '<span class="faint">0</span>') + "</td>") +
        '<td class="right num">' + (t.capacity == null ? '<span class="faint">—</span>' : int(t.capacity)) + "</td>" +
        '<td class="right num">' + left + "</td>" +
        '<td class="right num">' + int(st.received) + "</td>" +
        '<td class="right num ' + (st.toBring ? "hl" : "good") + '">' + int(st.toBring) + "</td>" +
        '<td class="right num">' + int(st.collected) + "</td>" +
        '<td class="right num">' + eur(st.revenue) + "</td></tr>";
    }).join("");
    html += '<div class="card"><div class="card__head"><div style="flex:1"><h2>Ticket types</h2><p>Sold = paid online or at reception. Still to bring = sold minus tickets the organizer already delivered.</p></div></div>' +
      '<div class="table-wrap"><table class="tbl"><thead><tr><th>Ticket type</th><th class=right>Price</th><th class=right>Sold</th>' + (partner ? "" : "<th class=right title='Guests currently paying online; held for " + S.data.holdMinutes + " min'>In checkout</th>") +
      "<th class=right>Limit</th><th class=right>Left</th><th class=right>Received</th><th class=right>To bring</th><th class=right>Handed out</th><th class=right>Revenue</th></tr></thead><tbody>" + rows +
      "</tbody><tfoot><tr><td>Total</td><td></td><td class='right num'>" + int(tot.sold) + "</td>" + (partner ? "" : "<td class='right num'>" + int(tot.held) + "</td>") +
      "<td></td><td></td><td class='right num'>" + int(tot.received) + "</td><td class='right num'>" + int(tot.toBring) + "</td><td class='right num'>" + int(tot.collected) + "</td><td class='right num'>" + eur(tot.revenue) + "</td></tr></tfoot></table></div></div>";

    /* Orders */
    html += '<div class="card"><div class="card__head"><h2>Orders</h2><span class="muted">' + filtered.length + " shown</span></div>" +
      '<div class="filters">' +
        '<label class="search">' + icon("search") + '<input class="input" type="search" placeholder="Search guest, reference, email…" value="' + esc(S.festOrderFilter.q) + '" data-filter="fest-q" data-focus-keep /></label>' +
        (partner ? "" : statusSelect("fest-status", S.festOrderFilter.status)) +
      "</div>" + ordersTable(filtered, { hideFestival: true, empty: "No orders match." }) + "</div>";

    /* Deliveries from the organizer */
    var dRows = deliveries.map(function (d) {
      return "<tr><td>" + esc(fmtDate(d.at)) + "</td><td>" + esc(d.tierLabel) + '</td><td class="right num strong">' + (d.quantity > 0 ? "+" : "") + int(d.quantity) + "</td><td>" + esc(d.broughtBy || "—") + "</td><td>" + esc(d.note || "") + '</td><td class="muted">' + esc(d.by) + "</td>" +
        (isAdmin() ? '<td class="right"><button class="btn btn--sm btn--ghost btn--icon" type="button" title="Remove this entry" data-act="del-delivery" data-id="' + esc(d.id) + '">' + icon("trash") + "</button></td>" : "") + "</tr>";
    }).join("");
    html += '<div class="card"><div class="card__head"><div style="flex:1"><h2>Tickets received from the organizer</h2><p>Every time the organizer brings physical tickets, reception records it here.</p></div>' +
      (desk ? '<button class="btn btn--sm" type="button" data-act="delivery" data-fest="' + esc(f.id) + '">' + icon("plus") + "Record delivery</button>" : "") + "</div>" +
      (deliveries.length ? '<div class="table-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Ticket type</th><th class=right>Tickets</th><th>Brought by</th><th>Note</th><th>Recorded by</th>' + (isAdmin() ? "<th></th>" : "") + "</tr></thead><tbody>" + dRows + "</tbody></table></div>"
        : '<div class="card__empty">No tickets received yet.</div>') + "</div>";
    return html;
  }

  function viewOrders() {
    var F = S.orderFilter, partner = isPartner();
    var list = filterOrders(S.data.orders, F);
    var qty = list.reduce(function (n, o) { return n + (o.status === "paid" ? o.quantity : 0); }, 0);
    var festOpts = '<option value="all">All festivals</option>' + S.data.festivals.map(function (f) {
      return '<option value="' + esc(f.id) + '"' + (F.festival === f.id ? " selected" : "") + ">" + esc(f.name) + "</option>";
    }).join("");
    var exportHref = API + "?action=export" + (F.festival !== "all" ? "&festival=" + encodeURIComponent(F.festival) : "");
    return '<div class="card"><div class="card__head"><div style="flex:1"><h2>All orders</h2><p>' + list.length + " orders · " + int(qty) + ' paid tickets</p></div>' +
      (isDesk() ? '<button class="btn btn--sm" type="button" data-act="manual-sale">' + icon("plus") + "Sell at reception</button>" : "") +
      '<a class="btn btn--sm" href="' + exportHref + '">' + icon("download") + "Export CSV</a></div>" +
      '<div class="filters">' +
        '<label class="search">' + icon("search") + '<input class="input" type="search" placeholder="Search guest, reference, email, phone…" value="' + esc(F.q) + '" data-filter="q" data-focus-keep /></label>' +
        '<select class="select" data-filter="festival">' + festOpts + "</select>" +
        (partner ? "" : statusSelect("status", F.status)) +
        '<select class="select" data-filter="handover">' +
          [["all", "Any hand-over"], ["waiting", "Waiting for guest"], ["done", "Handed over"]].map(function (o) {
            return '<option value="' + o[0] + '"' + (F.handover === o[0] ? " selected" : "") + ">" + o[1] + "</option>";
          }).join("") + "</select>" +
      "</div>" + ordersTable(list, { empty: "No orders match these filters." }) + "</div>";
  }

  function viewManage() {
    var list = S.data.festivals;
    var rows = list.map(function (f, i) {
      var prices = f.tiers.map(function (t) { return t.price; });
      var range = prices.length ? (Math.min.apply(null, prices) === Math.max.apply(null, prices) ? eur(prices[0]) : eur(Math.min.apply(null, prices)) + " – " + eur(Math.max.apply(null, prices))) : "—";
      return "<tr>" +
        '<td class="nowrap"><button class="btn btn--sm btn--ghost btn--icon" type="button" title="Move up" data-act="move-fest" data-dir="-1" data-fest="' + esc(f.id) + '"' + (i === 0 ? " disabled" : "") + ">" + icon("up") + '</button><button class="btn btn--sm btn--ghost btn--icon" type="button" title="Move down" data-act="move-fest" data-dir="1" data-fest="' + esc(f.id) + '"' + (i === list.length - 1 ? " disabled" : "") + ">" + icon("down") + "</button></td>" +
        '<td><a class="strong" href="#/festival/' + encodeURIComponent(f.id) + '">' + esc(f.name) + '</a><span class="sub">' + esc([f.dates, f.city].filter(Boolean).join(" · ")) + "</span></td>" +
        "<td>" + f.tiers.length + ' <span class="sub">' + range + "</span></td>" +
        '<td><label class="switch" title="Show this festival on /Derandtickets"><input type="checkbox" data-toggle="active" data-fest="' + esc(f.id) + '"' + (f.active ? " checked" : "") + "><i></i></label></td>" +
        '<td><label class="switch" title="Guests can pay online"><input type="checkbox" data-toggle="salesOpen" data-fest="' + esc(f.id) + '"' + (f.salesOpen ? " checked" : "") + "><i></i></label></td>" +
        '<td class="right num strong">' + int(f.stats.total.sold) + "</td>" +
        '<td><div class="actions"><button class="btn btn--sm" type="button" data-act="edit-fest" data-fest="' + esc(f.id) + '">' + icon("edit") + 'Edit</button><button class="btn btn--sm btn--danger btn--icon" type="button" title="Delete" data-act="del-fest" data-fest="' + esc(f.id) + '">' + icon("trash") + "</button></div></td>" +
        "</tr>";
    }).join("");
    return '<div class="banner">' + icon("globe") + "<div>Everything here is what guests see on the <a href=\"/Derandtickets\" target=\"_blank\" rel=\"noopener\">Derand Tickets page</a>. Prices are also checked by the server at payment, so the page can never charge an old price.</div></div>" +
      '<div class="card"><div class="card__head"><div style="flex:1"><h2>Festivals</h2><p>The order here is the order on the website.</p></div><button class="btn btn--primary" type="button" data-act="new-fest">' + icon("plus") + "New festival</button></div>" +
      (list.length ? '<div class="table-wrap"><table class="tbl"><thead><tr><th>Order</th><th>Festival</th><th>Ticket types</th><th>On website</th><th>Online sales</th><th class=right>Sold</th><th></th></tr></thead><tbody>' + rows + "</tbody></table></div>" : '<div class="card__empty">No festivals yet.</div>') +
      "</div>" +
      '<div class="card"><div class="card__head"><div style="flex:1"><h2>Airport transfer add-on</h2><p>Price per guest for the round-trip airport transfer offered with every ticket.</p></div></div>' +
      '<form class="card__body" id="transfer-form" style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap"><label class="field" style="width:180px"><span>Price per guest (EUR)</span><input class="input" name="price" type="number" min="0" step="0.01" value="' + esc(S.data.transferPrice) + '" /></label><button class="btn" type="submit">Save</button></form></div>';
  }

  function viewUsers() {
    var rows = S.data.users.map(function (u) {
      var fests = u.role === "partner" ? u.festivals.map(function (id) { return esc((festById(id) || { name: id }).name); }).join(", ") : '<span class="faint">All festivals</span>';
      var me = u.id === S.data.user.id;
      return '<tr class="clickable" data-user="' + esc(u.id) + '"><td><span class="avatar" style="display:inline-grid;vertical-align:middle;margin-right:10px;width:30px;height:30px;font-size:13px;background:#efe7d8;color:#6f5430">' + esc((u.name || u.username).charAt(0).toUpperCase()) + '</span><span class="strong">' + esc(u.name) + "</span>" + (me ? ' <span class="chip chip--plain">You</span>' : "") + "</td>" +
        "<td>" + esc(u.username) + "</td><td>" + esc(ROLE_LABEL[u.role]) + "</td><td>" + fests + "</td>" +
        "<td>" + (u.active ? (u.mustChangePassword ? '<span class="chip chip--warn">Must set password</span>' : '<span class="chip chip--ok">Active</span>') : '<span class="chip chip--bad">Disabled</span>') + "</td>" +
        '<td class="muted">' + esc(u.lastLoginAt ? ago(u.lastLoginAt) : "never") + "</td>" +
        '<td><div class="actions"><button class="btn btn--sm" type="button" data-act="edit-user" data-id="' + esc(u.id) + '">' + icon("edit") + "Edit</button>" +
        (me ? "" : '<button class="btn btn--sm btn--danger btn--icon" type="button" title="Delete user" data-act="del-user" data-id="' + esc(u.id) + '">' + icon("trash") + "</button>") + "</div></td></tr>";
    }).join("");
    return '<div class="banner">' + icon("key") + "<div><b>How access works.</b> Hotel admins manage everything. Reception sells at the desk and hands tickets to guests. Festival partners (each festival's organizer) only see their own festival: how many tickets were sold and how many they still need to bring.</div></div>" +
      '<div class="card"><div class="card__head"><h2>Users</h2><button class="btn btn--primary" type="button" data-act="new-user">' + icon("plus") + "Add user</button></div>" +
      '<div class="table-wrap"><table class="tbl"><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Festivals</th><th>Status</th><th>Last sign-in</th><th></th></tr></thead><tbody>' + rows + "</tbody></table></div></div>";
  }

  function viewActivity() {
    var q = S.auditQ.trim().toLowerCase();
    var list = (S.data.audit || []).filter(function (a) {
      return !q || (a.user + " " + a.action + " " + a.details).toLowerCase().indexOf(q) >= 0;
    });
    return '<div class="card"><div class="card__head"><div style="flex:1"><h2>Activity log</h2><p>Who did what — sign-ins, sales, hand-overs and changes (latest 300).</p></div></div>' +
      '<div class="filters"><label class="search">' + icon("search") + '<input class="input" type="search" placeholder="Filter…" value="' + esc(S.auditQ) + '" data-filter="audit" data-focus-keep /></label></div>' +
      (list.length ? '<div class="table-wrap"><table class="tbl"><thead><tr><th>When</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>' + list.map(function (a) {
        return '<tr><td class="nowrap">' + esc(fmtDate(a.at)) + '</td><td class="strong">' + esc(a.user) + "</td><td>" + esc(a.action) + '</td><td class="muted">' + esc(a.details) + "</td></tr>";
      }).join("") + "</tbody></table></div>" : '<div class="card__empty">Nothing yet.</div>') + "</div>";
  }

  function viewAccount() {
    var u = S.data.user;
    var fests = u.role === "partner" ? u.festivals.map(function (id) { return esc((festById(id) || { name: id }).name); }).join(", ") : "All festivals";
    return '<div class="grid-2" style="align-items:start">' +
      '<div class="card"><div class="card__head"><h2>Profile</h2></div><div class="card__body"><dl class="dl">' +
        "<dt>Name</dt><dd>" + esc(u.name) + "</dd><dt>Username</dt><dd>" + esc(u.username) + "</dd><dt>Role</dt><dd>" + esc(ROLE_LABEL[u.role]) + '<br><small class="muted" style="font-weight:400">' + esc(ROLE_INFO[u.role]) + "</small></dd><dt>Festivals</dt><dd>" + fests + "</dd>" +
      "</dl></div></div>" +
      '<div class="card"><div class="card__head"><h2>Change password</h2></div><form class="card__body" id="account-password" style="display:grid;gap:14px" novalidate>' +
        '<label class="field"><span>Current password</span><input class="input" type="password" name="current" autocomplete="current-password" /></label>' +
        '<label class="field"><span>New password</span><span class="pw-wrap"><input class="input" type="password" name="new" autocomplete="new-password" /><button type="button" data-toggle-pw aria-label="Show password">' + icon("eye") + "</button></span><small>At least 8 characters. You stay signed in here; other devices are signed out.</small></label>" +
        '<label class="field"><span>Repeat new password</span><input class="input" type="password" name="repeat" autocomplete="new-password" /></label>' +
        '<div class="form-error"></div><div><button class="btn btn--primary" type="submit">Update password</button></div>' +
      "</form></div></div>";
  }

  /* ------------------------------------------------------------- Modals */
  function closeAllModals() { $("#modal-root").innerHTML = ""; document.body.style.overflow = ""; }

  function modal(opts) {
    var root = $("#modal-root");
    var wrap = document.createElement("div");
    wrap.className = "modal-backdrop";
    wrap.innerHTML = '<div class="modal' + (opts.wide ? " modal--wide" : "") + '" role="dialog" aria-modal="true" aria-label="' + esc(opts.title) + '" tabindex="-1">' +
      '<div class="modal__head"><h3>' + esc(opts.title) + '</h3><button class="btn btn--ghost btn--icon" type="button" data-close aria-label="Close">' + icon("x") + "</button></div>" +
      (opts.form ? '<form novalidate>' : "") +
      '<div class="modal__body">' + opts.body + "</div>" +
      (opts.foot ? '<div class="modal__foot"><div class="form-error" role="alert"></div>' + opts.foot + "</div>" : "") +
      (opts.form ? "</form>" : "") + "</div>";
    root.appendChild(wrap);
    document.body.style.overflow = "hidden";
    var last = document.activeElement;

    function close() {
      if (!wrap.parentNode) return;
      wrap.parentNode.removeChild(wrap);
      document.removeEventListener("keydown", onKey);
      if (!root.children.length) document.body.style.overflow = "";
      if (last && last.focus && document.body.contains(last)) last.focus();
    }
    function onKey(e) { if (e.key === "Escape" && root.lastElementChild === wrap) close(); }
    document.addEventListener("keydown", onKey);
    wrap.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) close();
      if (opts.dismiss && e.target === wrap) close();
    });

    var m = { el: wrap, close: close, error: function (msg) { var el = $(".form-error", wrap); if (el) el.textContent = msg || ""; } };
    if (opts.form && opts.onSubmit) {
      $("form", wrap).addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = $(".modal__foot [type=submit]", wrap);
        m.error("");
        var result;
        try { result = opts.onSubmit($("form", wrap), m); } catch (err) { m.error(err.message); return; }
        if (result && result.then) {
          if (btn) btn.disabled = true;
          result.then(function (r) { if (r !== false) close(); })
            .catch(function (err) { m.error(err.message); })
            .then(function () { if (btn) btn.disabled = false; });
        }
      });
    }
    if (opts.onMount) opts.onMount(wrap, m);
    setTimeout(function () {
      var first = $("input:not([type=hidden]):not([disabled]):not([readonly]), select, textarea", $(".modal__body", wrap));
      (first || $(".modal", wrap)).focus();
    }, 40);
    return m;
  }

  function confirmBox(title, message, okLabel, danger) {
    return new Promise(function (resolve) {
      var done = false;
      var m = modal({
        title: title, dismiss: true,
        body: "<p style='margin:0'>" + message + "</p>",
        foot: '<button class="btn" type="button" data-close>Cancel</button><button class="btn ' + (danger ? "btn--danger" : "btn--primary") + '" type="button" data-ok>' + esc(okLabel || "OK") + "</button>"
      });
      $("[data-ok]", m.el).addEventListener("click", function () { done = true; m.close(); resolve(true); });
      var observer = new MutationObserver(function () { if (!m.el.parentNode) { observer.disconnect(); if (!done) resolve(false); } });
      observer.observe($("#modal-root"), { childList: true });
    });
  }

  function tierOptions(f, selected, showBring) {
    return f.tiers.map(function (t) {
      var st = tierStats(f, t.key), extra = [];
      extra.push(eur(t.price));
      if (showBring) extra.push(int(st.toBring || 0) + " to bring");
      else if (st.remaining != null) extra.push(st.remaining + " left");
      return '<option value="' + esc(t.key) + '"' + (t.key === selected ? " selected" : "") + ">" + esc(t.label) + " — " + extra.join(" · ") + "</option>";
    }).join("");
  }
  function festOptions(selected) {
    return S.data.festivals.map(function (f) {
      return '<option value="' + esc(f.id) + '"' + (f.id === selected ? " selected" : "") + ">" + esc(f.name) + "</option>";
    }).join("");
  }

  /* Tickets physically delivered by the organizer. */
  function openDelivery(festId) {
    var fid = festId || (S.data.festivals[0] || {}).id;
    if (!fid) return toast("Add a festival first.", true);
    var f = festById(fid);
    var firstBring = f.tiers.filter(function (t) { return tierStats(f, t.key).toBring > 0; })[0] || f.tiers[0];
    modal({
      title: "Tickets received from organizer", form: true,
      body: '<p class="muted" style="margin:0">Record the physical tickets the organizer just brought to the hotel. Use a minus number to correct a mistake.</p>' +
        '<label class="field"><span>Festival</span><select class="select" name="festivalId"' + (festId ? " disabled" : "") + ">" + festOptions(fid) + "</select></label>" +
        '<label class="field"><span>Ticket type</span><select class="select" name="tierKey">' + tierOptions(f, firstBring.key, true) + "</select></label>" +
        '<div class="grid-2"><label class="field"><span>Number of tickets</span><input class="input" name="quantity" type="number" step="1" value="' + (tierStats(f, firstBring.key).toBring || 1) + '" /></label>' +
        '<label class="field"><span>Brought by</span><input class="input" name="broughtBy" value="' + esc(f.organizer || "") + '" placeholder="Name of the person" /></label></div>' +
        '<label class="field"><span>Note (optional)</span><input class="input" name="note" placeholder="e.g. ticket numbers 1201–1220" /></label>',
      foot: '<button class="btn" type="button" data-close>Cancel</button><button class="btn btn--primary" type="submit">' + icon("check") + "Save</button>",
      onMount: function (el) {
        var form = $("form", el);
        form.festivalId.addEventListener("change", function () {
          f = festById(form.festivalId.value);
          form.tierKey.innerHTML = tierOptions(f, "", true);
          form.quantity.value = tierStats(f, form.tierKey.value).toBring || 1;
          form.broughtBy.value = f.organizer || "";
        });
        form.tierKey.addEventListener("change", function () { form.quantity.value = tierStats(f, form.tierKey.value).toBring || 1; });
      },
      onSubmit: function (form) {
        return mutate("delivery_add", {
          festivalId: form.festivalId.value, tierKey: form.tierKey.value, quantity: parseInt(form.quantity.value, 10) || 0,
          broughtBy: form.broughtBy.value, note: form.note.value
        }, "Delivery recorded.");
      }
    });
  }

  /* Ticket sold at the hotel desk (cash, card terminal, bank transfer or complimentary). */
  function openManualSale(festId) {
    var fid = festId || (S.route.view === "orders" && S.orderFilter.festival !== "all" ? S.orderFilter.festival : (S.data.festivals[0] || {}).id);
    if (!fid) return toast("Add a festival first.", true);
    var f = festById(fid);
    modal({
      title: "Sell tickets at reception", form: true,
      body: '<div class="grid-2"><label class="field"><span>Festival</span><select class="select" name="festivalId">' + festOptions(fid) + "</select></label>" +
        '<label class="field"><span>Ticket type</span><select class="select" name="tierKey">' + tierOptions(f, "", false) + "</select></label></div>" +
        '<div class="grid-2"><label class="field"><span>Quantity</span><input class="input" name="quantity" type="number" min="1" max="100" value="1" /></label>' +
        '<label class="field"><span>Payment</span><select class="select" name="paymentMethod">' + ["cash", "card", "bank", "complimentary"].map(function (k) { return '<option value="' + k + '">' + PAY_LABEL[k] + "</option>"; }).join("") + "</select></label></div>" +
        '<p class="section-title">Guest</p>' +
        '<div class="grid-2"><label class="field"><span>First name</span><input class="input" name="firstName" /></label><label class="field"><span>Last name</span><input class="input" name="lastName" /></label></div>' +
        '<div class="grid-2"><label class="field"><span>Email (optional)</span><input class="input" name="email" type="email" /></label><label class="field"><span>Phone (optional)</span><input class="input" name="phone" /></label></div>' +
        '<label class="field"><span>Note (optional)</span><input class="input" name="note" placeholder="e.g. room 304" /></label>' +
        '<label class="check"><input type="checkbox" name="collected" /> The guest already received the ticket</label>' +
        '<div class="banner" style="justify-content:space-between"><span>Total to collect</span><b class="num" data-total style="font-size:18px"></b></div>',
      foot: '<button class="btn" type="button" data-close>Cancel</button><button class="btn btn--primary" type="submit">' + icon("check") + "Record sale</button>",
      onMount: function (el) {
        var form = $("form", el);
        function total() {
          var t = tierOf(f, form.tierKey.value);
          var n = Math.max(0, parseInt(form.quantity.value, 10) || 0);
          $("[data-total]", el).textContent = form.paymentMethod.value === "complimentary" ? eur(0) : eur((t ? t.price : 0) * n);
        }
        form.festivalId.addEventListener("change", function () { f = festById(form.festivalId.value); form.tierKey.innerHTML = tierOptions(f, "", false); total(); });
        ["tierKey", "quantity", "paymentMethod"].forEach(function (n) { form[n].addEventListener("input", total); form[n].addEventListener("change", total); });
        total();
      },
      onSubmit: function (form) {
        if (!form.firstName.value.trim() && !form.lastName.value.trim()) throw new Error("Enter the guest's name.");
        var payload = {
          festivalId: form.festivalId.value, tierKey: form.tierKey.value, quantity: parseInt(form.quantity.value, 10) || 0,
          paymentMethod: form.paymentMethod.value, collected: form.collected.checked, note: form.note.value,
          guest: { firstName: form.firstName.value, lastName: form.lastName.value, email: form.email.value, phone: form.phone.value }
        };
        return mutate("order_manual", payload, "Sale recorded.").catch(function (err) {
          if (err.status !== 409 || !isAdmin()) throw err;
          return confirmBox("Ticket limit reached", esc(err.message) + " Record the sale anyway?", "Record anyway").then(function (yes) {
            if (!yes) return false;
            payload.overrideStock = true;
            return mutate("order_manual", payload, "Sale recorded.");
          });
        });
      }
    });
  }

  function openOrder(id) {
    var o = S.data.orders.filter(function (x) { return x.id === id; })[0];
    if (!o) return;
    var partner = isPartner(), desk = isDesk();
    var g = o.guest || {};
    var rows = [
      ["Reference", esc(o.id)],
      ["Festival", esc((festById(o.festivalId) || {}).name || o.festivalName)],
      ["Ticket", esc(o.tierLabel) + " × " + int(o.quantity) + " <span class='muted'>(" + eur(o.unitPrice) + " each)</span>"],
      ["Tickets total", eur(o.ticketTotal)],
      ["Guest", esc(o.guestName || "—")]
    ];
    if (!partner) {
      rows.push(["Email", g.email ? '<a href="mailto:' + esc(g.email) + '">' + esc(g.email) + "</a>" : "—"]);
      rows.push(["Phone", g.phone ? '<a href="tel:' + esc(g.phone) + '">' + esc(g.phone) + "</a>" : "—"]);
      if (o.mode === "bundle") rows.push(["Hotel stay", esc(o.roomLabel) + ", " + esc(o.nights) + " nights × " + int(o.quantity)]);
      if (o.transfer) rows.push(["Airport transfer", "Yes"]);
      rows.push(["Order total", "<b>" + eur(o.total) + "</b>"]);
      rows.push(["Payment", esc(PAY_LABEL[o.paymentMethod] || o.paymentMethod) + " · " + statusChips(o)]);
      if (o.orderIdentification) rows.push(["RaiAccept ID", '<span class="muted">' + esc(o.orderIdentification) + "</span>"]);
      if (o.createdBy) rows.push(["Sold by", esc(o.createdBy)]);
      if (o.cancelReason) rows.push(["Cancel reason", esc(o.cancelReason)]);
    }
    rows.push(["Ordered", esc(fmtDate(o.createdAt))]);
    if (o.paidAt) rows.push(["Paid", esc(fmtDate(o.paidAt))]);
    rows.push(["Hand-over", o.status !== "paid" ? "—" : (o.collected ? '<span class="chip chip--ok">Handed over</span> <span class="muted">' + esc(fmtDate(o.collectedAt)) + (o.collectedBy ? " · " + esc(o.collectedBy) : "") + "</span>" : '<span class="chip chip--warn">Waiting for guest</span>')]);

    var foot = '<button class="btn" type="button" data-close>Close</button>';
    if (desk && o.status === "paid") {
      foot = (isAdmin() && !o.collected ? '<button class="btn btn--danger" type="button" data-cancel>Cancel / refund</button>' : "") + foot +
        (o.collected ? '<button class="btn" type="button" data-undo>Undo hand-over</button>' : '<button class="btn btn--primary" type="button" data-hand>' + icon("hand") + "Handed to guest</button>");
    }
    var m = modal({
      title: "Order " + o.id, dismiss: true,
      body: '<dl class="dl">' + rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>"; }).join("") + "</dl>" +
        (desk ? '<label class="field"><span>Internal note</span><textarea class="textarea" data-note placeholder="Visible to hotel staff only">' + esc(o.note || "") + '</textarea></label><div><button class="btn btn--sm" type="button" data-save-note>Save note</button></div>' : ""),
      foot: foot
    });
    m.el.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-hand], [data-undo], [data-save-note], [data-cancel]");
      if (!btn) return;
      if (btn.hasAttribute("data-cancel")) { m.close(); openCancel(o); return; }
      var note = btn.hasAttribute("data-save-note");
      var payload = note ? { id: o.id, note: $("[data-note]", m.el).value } : { id: o.id, collected: btn.hasAttribute("data-hand") };
      var msg = note ? "Note saved." : (payload.collected ? "Marked as handed to guest." : "Hand-over undone.");
      btn.disabled = true;
      mutate("order_update", payload, msg)
        .then(function () { if (note) btn.disabled = false; else m.close(); })
        .catch(function (err) { m.error(err.message); btn.disabled = false; });
    });
  }

  function openCancel(o) {
    modal({
      title: "Cancel or refund " + o.id, form: true,
      body: '<p style="margin:0">The tickets go back into stock and stop counting as sold.' + (o.source === "online" ? " <b>The money is not returned automatically</b> — refund card payments in the RaiAccept merchant portal." : "") + "</p>" +
        '<label class="field"><span>What happened?</span><select class="select" name="status"><option value="refunded">Money was refunded</option><option value="cancelled">Cancelled without refund</option></select></label>' +
        '<label class="field"><span>Reason</span><input class="input" name="reason" placeholder="e.g. guest cannot attend" /></label>',
      foot: '<button class="btn" type="button" data-close>Back</button><button class="btn btn--danger" type="submit">Confirm</button>',
      onSubmit: function (form) {
        return mutate("order_cancel", { id: o.id, status: form.status.value, reason: form.reason.value }, "Order updated.");
      }
    });
  }

  /* --------------------------------------------------- Festival editor */
  function tierRow(t) {
    t = t || { key: "", label: "", note: "", price: "", capacity: null, active: true };
    return '<div class="tier-row" data-key="' + esc(t.key) + '">' +
      '<input class="input" data-f="label" placeholder="Name, e.g. VIP Pass" value="' + esc(t.label) + '" />' +
      '<input class="input" data-f="note" placeholder="Short description" value="' + esc(t.note) + '" />' +
      '<input class="input" data-f="price" type="number" min="0" step="0.01" placeholder="Price €" value="' + esc(t.price) + '" />' +
      '<input class="input" data-f="capacity" type="number" min="0" step="1" placeholder="No limit" value="' + (t.capacity == null ? "" : esc(t.capacity)) + '" />' +
      '<label class="switch" title="Sell this ticket type"><input type="checkbox" data-f="active"' + (t.active ? " checked" : "") + "><i></i></label>" +
      '<button class="btn btn--sm btn--ghost btn--icon" type="button" data-remove-tier title="Remove">' + icon("trash") + "</button>" +
      (t.key ? '<div class="code">Code: ' + esc(t.key) + "</div>" : "") +
      "</div>";
  }

  function openFestivalEditor(id) {
    var f = id ? festById(id) : null;
    var isNew = !f;
    f = f || { id: "", name: "", city: "", month: 0, dates: "", days: 1, nights: 1, genre: "", img: "", badge: { text: "", style: "purple", icon: "ticket" }, active: false, salesOpen: true, organizer: "", organizerEmail: "", organizerPhone: "", tiers: [] };
    var b = f.badge || {};
    modal({
      title: isNew ? "New festival" : "Edit " + f.name, wide: true, form: true,
      body:
        '<p class="section-title">Festival</p>' +
        '<div class="grid-2"><label class="field"><span>Name</span><input class="input" name="fname" value="' + esc(f.name) + '" placeholder="e.g. Sunny Hill Festival" /></label>' +
        '<label class="field"><span>Web ID</span><input class="input" name="fid" value="' + esc(f.id) + '"' + (isNew ? "" : " readonly") + ' placeholder="filled in automatically" /><small>' + (isNew ? "Letters, numbers and dashes. Cannot be changed later." : "Fixed — used by orders and translations.") + "</small></label></div>" +
        '<div class="grid-3"><label class="field"><span>Dates (as shown to guests)</span><input class="input" name="dates" value="' + esc(f.dates) + '" placeholder="30 Jul – 1 Aug 2027" /></label>' +
        '<label class="field"><span>Month (for the date filter)</span><select class="select" name="month">' + MONTHS.map(function (m, i) { return '<option value="' + i + '"' + (i === Number(f.month) ? " selected" : "") + ">" + m + "</option>"; }).join("") + "</select></label>" +
        '<label class="field"><span>City</span><input class="input" name="city" value="' + esc(f.city) + '" /></label></div>' +
        '<div class="grid-3"><label class="field"><span>Music / genre</span><input class="input" name="genre" value="' + esc(f.genre) + '" placeholder="Pop · Hip-hop" /></label>' +
        '<label class="field"><span>Festival days</span><input class="input" name="days" type="number" min="1" max="30" value="' + esc(f.days) + '" /></label>' +
        '<label class="field"><span>Hotel nights in package</span><input class="input" name="nights" type="number" min="1" max="30" value="' + esc(f.nights) + '" /></label></div>' +

        '<p class="section-title">Picture & badge</p>' +
        '<div class="img-pick"><div class="img-pick__preview" data-preview style="' + bg(f.img) + '"></div><div style="display:grid;gap:10px">' +
          '<label class="field"><span>Image address</span><input class="input" name="img" value="' + esc(f.img) + '" placeholder="https://… or img/…" /></label>' +
          '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label class="btn btn--sm">' + icon("image") + 'Upload image<input type="file" accept="image/jpeg,image/png,image/webp" data-upload hidden /></label><small class="muted" data-upload-status>JPG, PNG or WEBP, max 6 MB. Landscape works best.</small></div>' +
        "</div></div>" +
        '<div class="grid-3"><label class="field"><span>Badge text</span><input class="input" name="badgeText" value="' + esc(b.text) + '" placeholder="e.g. Selling Fast" /></label>' +
        '<label class="field"><span>Badge colour</span><select class="select" name="badgeStyle">' + Object.keys(BADGE_STYLES).map(function (k) { return '<option value="' + k + '"' + (k === b.style ? " selected" : "") + ">" + BADGE_STYLES[k] + "</option>"; }).join("") + "</select></label>" +
        '<label class="field"><span>Badge icon</span><select class="select" name="badgeIcon">' + BADGE_ICONS.map(function (k) { return '<option value="' + k + '"' + (k === b.icon ? " selected" : "") + ">" + k + "</option>"; }).join("") + "</select></label></div>" +

        '<p class="section-title">Ticket types</p>' +
        '<div class="tier-head"><span>Name</span><span>Description</span><span>Price €</span><span>Limit</span><span>On</span><span></span></div>' +
        '<div class="tier-editor" data-tiers>' + (f.tiers.length ? f.tiers.map(tierRow).join("") : tierRow()) + "</div>" +
        '<div><button class="btn btn--sm" type="button" data-add-tier>' + icon("plus") + 'Add ticket type</button> <small class="muted">Limit = how many tickets the organizer gave us to sell. Leave empty for no limit.</small></div>' +

        '<p class="section-title">Organizer (festival partner)</p>' +
        '<div class="grid-3"><label class="field"><span>Contact person / company</span><input class="input" name="organizer" value="' + esc(f.organizer) + '" /></label>' +
        '<label class="field"><span>Email</span><input class="input" name="organizerEmail" type="email" value="' + esc(f.organizerEmail) + '" /></label>' +
        '<label class="field"><span>Phone</span><input class="input" name="organizerPhone" value="' + esc(f.organizerPhone) + '" /></label></div>' +

        '<p class="section-title">Visibility</p>' +
        '<div style="display:flex;gap:28px;flex-wrap:wrap"><label class="switch"><input type="checkbox" name="active"' + (f.active ? " checked" : "") + "><i></i>Show on the website</label>" +
        '<label class="switch"><input type="checkbox" name="salesOpen"' + (f.salesOpen ? " checked" : "") + "><i></i>Guests can buy online</label></div>",
      foot: '<button class="btn" type="button" data-close>Cancel</button><button class="btn btn--primary" type="submit">' + icon("check") + (isNew ? "Create festival" : "Save changes") + "</button>",
      onMount: function (el) {
        var form = $("form", el);
        var idTouched = !isNew;
        form.fname.addEventListener("input", function () {
          if (!idTouched) form.fid.value = form.fname.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
        });
        form.fid.addEventListener("input", function () { idTouched = true; });
        form.img.addEventListener("input", function () { $("[data-preview]", el).setAttribute("style", bg(form.img.value.trim())); });
        $("[data-add-tier]", el).addEventListener("click", function () {
          $("[data-tiers]", el).insertAdjacentHTML("beforeend", tierRow());
          $("[data-tiers] .tier-row:last-child input", el).focus();
        });
        $("[data-tiers]", el).addEventListener("click", function (e) {
          var btn = e.target.closest("[data-remove-tier]");
          if (!btn) return;
          var row = btn.closest(".tier-row");
          var key = row.getAttribute("data-key");
          if (key && !isNew && (tierStats(f, key).sold || tierStats(f, key).held)) {
            toast("This ticket type already has sales — switch it off instead.", true);
            return;
          }
          row.parentNode.removeChild(row);
        });
        $("[data-upload]", el).addEventListener("change", function (e) {
          var file = e.target.files[0], status = $("[data-upload-status]", el);
          if (!file) return;
          var fd = new FormData();
          fd.append("action", "upload_image");
          fd.append("image", file);
          status.textContent = "Uploading…";
          fetch(API, { method: "POST", credentials: "same-origin", headers: { "X-CSRF-Token": S.csrf }, body: fd })
            .then(handle)
            .then(function (d) {
              form.img.value = d.path;
              $("[data-preview]", el).setAttribute("style", bg(d.path));
              status.textContent = "Uploaded.";
            })
            .catch(function (err) { status.textContent = err.message; })
            .then(function () { e.target.value = ""; });
        });
      },
      onSubmit: function (form, m) {
        var tiers = $$(".tier-row", m.el).map(function (row) {
          var v = function (n) { return $('[data-f="' + n + '"]', row); };
          return { key: row.getAttribute("data-key") || "", label: v("label").value, note: v("note").value, price: v("price").value, capacity: v("capacity").value, active: v("active").checked };
        }).filter(function (t) { return t.label.trim(); });
        if (!form.fname.value.trim()) throw new Error("Enter the festival name.");
        if (!tiers.length) throw new Error("Add at least one ticket type with a name.");
        for (var i = 0; i < tiers.length; i++) {
          if (tiers[i].price === "" || isNaN(Number(tiers[i].price))) throw new Error("Enter a price for “" + tiers[i].label + "”.");
        }
        var payload = {
          id: form.fid.value.trim(), name: form.fname.value, city: form.city.value, month: form.month.value, dates: form.dates.value,
          days: form.days.value, nights: form.nights.value, genre: form.genre.value, img: form.img.value.trim(),
          badge: { text: form.badgeText.value, style: form.badgeStyle.value, icon: form.badgeIcon.value },
          organizer: form.organizer.value, organizerEmail: form.organizerEmail.value, organizerPhone: form.organizerPhone.value,
          active: form.active.checked, salesOpen: form.salesOpen.checked, tiers: tiers
        };
        return mutate("festival_save", { originalId: isNew ? "" : f.id, festival: payload }, isNew ? "Festival created." : "Changes saved.").then(function (d) {
          if (isNew && d.saved) go("#/festival/" + encodeURIComponent(d.saved));
        });
      }
    });
  }

  /* -------------------------------------------------------- User editor */
  function randomPassword() {
    var chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var a = new Uint32Array(12);
    (window.crypto || window.msCrypto).getRandomValues(a);
    return Array.prototype.map.call(a, function (n) { return chars[n % chars.length]; }).join("");
  }

  function openUserEditor(id) {
    var u = id ? S.data.users.filter(function (x) { return x.id === id; })[0] : null;
    var isNew = !u;
    u = u || { id: "", username: "", name: "", role: "partner", festivals: [], active: true };
    var me = u.id === S.data.user.id;
    modal({
      title: isNew ? "Add user" : "Edit " + (u.name || u.username), form: true,
      body:
        '<div class="grid-2"><label class="field"><span>Full name</span><input class="input" name="name" value="' + esc(u.name) + '" placeholder="e.g. Arben Krasniqi" /></label>' +
        '<label class="field"><span>Username</span><input class="input" name="username" value="' + esc(u.username) + '" autocapitalize="none" spellcheck="false" placeholder="e.g. sunnyhill" /></label></div>' +
        '<div class="field"><span>Role</span><div class="role-pick">' + ["partner", "staff", "admin"].map(function (r) {
          return '<label class="role-opt"><input type="radio" name="role" value="' + r + '"' + (u.role === r ? " checked" : "") + (me && r !== "admin" ? " disabled" : "") + "><span><b>" + ROLE_LABEL[r] + "</b><small>" + ROLE_INFO[r] + "</small></span></label>";
        }).join("") + "</div></div>" +
        '<div class="field" data-fest-pick><span>Festivals this partner can see</span><div class="fest-checks">' + (S.data.festivals.length ? S.data.festivals.map(function (f) {
          return '<label class="check"><input type="checkbox" name="festivals" value="' + esc(f.id) + '"' + (u.festivals.indexOf(f.id) >= 0 ? " checked" : "") + ">" + esc(f.name) + "</label>";
        }).join("") : '<span class="muted">Create a festival first.</span>') + "</div></div>" +
        '<label class="field"><span>' + (isNew ? "Starting password" : "New password (leave empty to keep the current one)") + '</span>' +
          '<span style="display:flex;gap:8px"><span class="pw-wrap" style="flex:1"><input class="input" name="password" type="text" autocomplete="new-password" spellcheck="false" /></span><button class="btn" type="button" data-generate>Generate</button></span>' +
          "<small>At least 8 characters. Give it to the person privately.</small></label>" +
        '<label class="check"><input type="checkbox" name="mustChange"' + (isNew ? " checked" : "") + "> Ask them to choose their own password at first sign-in</label>" +
        (me ? "" : '<label class="switch"><input type="checkbox" name="active"' + (u.active ? " checked" : "") + "><i></i>Account active (can sign in)</label>"),
      foot: '<button class="btn" type="button" data-close>Cancel</button><button class="btn btn--primary" type="submit">' + icon("check") + (isNew ? "Create user" : "Save") + "</button>",
      onMount: function (el) {
        var form = $("form", el);
        function sync() {
          var r = (form.querySelector("[name=role]:checked") || {}).value;
          $("[data-fest-pick]", el).hidden = r !== "partner";
        }
        $$("[name=role]", el).forEach(function (x) { x.addEventListener("change", sync); });
        sync();
        $("[data-generate]", el).addEventListener("click", function () { form.password.value = randomPassword(); form.password.select(); });
        if (isNew) form.password.value = randomPassword();
      },
      onSubmit: function (form) {
        var r = (form.querySelector("[name=role]:checked") || {}).value;
        var fests = $$("[name=festivals]:checked", form).map(function (x) { return x.value; });
        if (r === "partner" && !fests.length) throw new Error("Choose at least one festival for this partner.");
        var pw = form.password.value;
        var payload = {
          id: u.id, name: form.fullName.value, username: form.username.value, role: r, festivals: fests,
          password: pw, mustChangePassword: form.mustChange.checked, active: form.active ? form.active.checked : true
        };
        return mutate("user_save", { user: payload }, isNew ? "User created." : "User saved.").then(function () {
          if (pw) {
            modal({
              title: "Share these sign-in details", dismiss: true,
              body: '<p style="margin:0">Send this privately to <b>' + esc(payload.name || payload.username) + "</b>:</p>" +
                '<div class="banner" style="display:block;font-family:Consolas,monospace;white-space:pre-line">Address: ' + esc(location.origin + "/TicketsAdmin") + "\nUsername: " + esc(payload.username.toLowerCase()) + "\nPassword: " + esc(pw) + "</div>" +
                (payload.mustChangePassword ? '<p class="muted" style="margin:0">They will be asked to choose their own password when they first sign in.</p>' : ""),
              foot: '<button class="btn" type="button" data-copy>Copy</button><button class="btn btn--primary" type="button" data-close>Done</button>',
              onMount: function (el) {
                $("[data-copy]", el).addEventListener("click", function () {
                  var text = "Address: " + location.origin + "/TicketsAdmin\nUsername: " + payload.username.toLowerCase() + "\nPassword: " + pw;
                  if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast("Copied."); });
                });
              }
            });
          }
        });
      }
    });
  }

  /* ----------------------------------------------------- View events */
  $("#view").addEventListener("click", function (e) {
    var a = e.target.closest("[data-act]");
    if (a) {
      var act = a.getAttribute("data-act"), fest = a.getAttribute("data-fest"), id = a.getAttribute("data-id");
      e.stopPropagation();
      if (act === "handover") {
        a.disabled = true;
        mutate("order_update", { id: id, collected: true }, "Marked as handed to guest.").catch(function (err) { a.disabled = false; toast(err.message, true); });
      } else if (act === "delivery") openDelivery(fest);
      else if (act === "manual-sale") openManualSale(fest);
      else if (act === "print") window.print();
      else if (act === "edit-fest") openFestivalEditor(fest);
      else if (act === "new-fest") openFestivalEditor("");
      else if (act === "move-fest") mutate("festival_move", { id: fest, dir: Number(a.getAttribute("data-dir")) }).catch(function (err) { toast(err.message, true); });
      else if (act === "del-fest") {
        var f = festById(fest);
        confirmBox("Delete " + f.name + "?", "This removes the festival and its ticket types. Festivals with orders cannot be deleted — hide them from the website instead.", "Delete", true).then(function (yes) {
          if (yes) mutate("festival_delete", { id: fest }, "Festival deleted.").catch(function (err) { toast(err.message, true); });
        });
      } else if (act === "del-delivery") {
        confirmBox("Remove this delivery entry?", "Use this only for an entry recorded by mistake.", "Remove", true).then(function (yes) {
          if (yes) mutate("delivery_delete", { id: id }, "Entry removed.").catch(function (err) { toast(err.message, true); });
        });
      } else if (act === "new-user") openUserEditor("");
      else if (act === "edit-user") openUserEditor(id);
      else if (act === "del-user") {
        var u = S.data.users.filter(function (x) { return x.id === id; })[0];
        confirmBox("Delete " + esc(u.name || u.username) + "?", "They will no longer be able to sign in. To keep their history, you can disable the account instead.", "Delete user", true).then(function (yes) {
          if (yes) mutate("user_delete", { id: id }, "User deleted.").catch(function (err) { toast(err.message, true); });
        });
      }
      return;
    }
    var row = e.target.closest("[data-order]");
    if (row && !e.target.closest("a, button, input, select")) { openOrder(row.getAttribute("data-order")); return; }
    var urow = e.target.closest("[data-user]");
    if (urow && !e.target.closest("a, button, input")) openUserEditor(urow.getAttribute("data-user"));
  });

  $("#view").addEventListener("change", function (e) {
    var t = e.target;
    if (t.matches("[data-toggle]")) {
      t.disabled = true;
      var field = t.getAttribute("data-toggle");
      mutate("festival_toggle", { id: t.getAttribute("data-fest"), field: field, value: t.checked },
        field === "active" ? (t.checked ? "Now visible on the website." : "Hidden from the website.") : (t.checked ? "Online sales opened." : "Online sales closed."))
        .catch(function (err) { t.checked = !t.checked; t.disabled = false; toast(err.message, true); });
      return;
    }
    var f = t.getAttribute("data-filter");
    if (f === "festival" || f === "status" || f === "handover") { S.orderFilter[f] = t.value; render(); }
    if (f === "fest-status") { S.festOrderFilter.status = t.value; render(); }
  });

  $("#view").addEventListener("input", function (e) {
    var f = e.target.getAttribute("data-filter");
    if (!f) return;
    if (f === "q") S.orderFilter.q = e.target.value;
    else if (f === "fest-q") S.festOrderFilter.q = e.target.value;
    else if (f === "audit") S.auditQ = e.target.value;
    else return;
    render.keepFocus = true;
    render();
  });

  $("#view").addEventListener("submit", function (e) {
    var form = e.target;
    if (form.id === "transfer-form") {
      e.preventDefault();
      mutate("transfer_price", { price: form.price.value }, "Transfer price saved.").catch(function (err) { toast(err.message, true); });
    }
    if (form.id === "account-password") {
      e.preventDefault();
      var out = $(".form-error", form);
      out.textContent = "";
      if (form["new"].value !== form.repeat.value) { out.textContent = "The new passwords do not match."; return; }
      api("change_password", { current: form.current.value, "new": form["new"].value })
        .then(function (d) { applyData(d); toast("Password updated."); })
        .catch(function (err) { out.textContent = err.message; });
    }
  });

  $("#menu-btn").addEventListener("click", function () { $("#shell").classList.toggle("nav-open"); });
  $("#shell").addEventListener("click", function (e) {
    if (e.target === $("#shell") && $("#shell").classList.contains("nav-open")) $("#shell").classList.remove("nav-open");
  });

  function refresh(manual) {
    var btn = $("#refresh-btn");
    btn.disabled = true;
    return loadSession()
      .then(function (d) {
        if (!d.user) { S.data = null; showLogin("Your session has ended. Please sign in again."); return; }
        applyData(d);
        if (manual) toast("Up to date.");
      })
      .catch(function (err) { if (manual) toast(err.message, true); })
      .then(function () { btn.disabled = false; });
  }
  $("#refresh-btn").addEventListener("click", function () { refresh(true); });

  /* Keep numbers live (partners often leave the page open) without disturbing open forms or typing. */
  setInterval(function () {
    if (!S.data || document.hidden || $("#modal-root").children.length) return;
    if (document.activeElement && document.activeElement.matches("#view input, #view select, #view textarea")) return;
    refresh(false);
  }, REFRESH_MS);

  loadSession()
    .then(applyData)
    .catch(function (err) {
      showLogin(location.protocol === "file:" ? "Open this page through the website (it needs the server)." : err.message);
    });
})();
