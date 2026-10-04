(function () {
  var hasGsap = typeof gsap !== "undefined";
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash) window.scrollTo(0, 0);

  var lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09 });
    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  var nav = document.getElementById("nav");
  function navState() { nav.classList.toggle("on", window.scrollY > 60); }
  window.addEventListener("scroll", navState, { passive: true });
  navState();

  // ---------- intro motion ----------
  if (hasGsap) {
    var tl = gsap.timeline();
    if (document.getElementById("pre")) {
      tl.to(".pre b", { y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 })
        .to(".pre s", { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, "-=.25")
        .to("#pre", { yPercent: -100, duration: 0.9, ease: "power4.inOut", delay: 0.1 })
        .set("#pre", { display: "none" });
    }
    tl.from(".hero .media img,.phero .media img", { scale: 1.25, duration: 2, ease: "power2.out" }, document.getElementById("pre") ? "-=.9" : 0)
      .to("h1 .l>span", { y: 0, duration: 1, ease: "power3.out" }, "-=1.8")
      .from(".hero .sub,.hero .acts,.phero .sub", { opacity: 0, y: 18, duration: 0.7, stagger: 0.12 }, "-=1.2")
      .from(".hstats div", { opacity: 0, y: 16, duration: 0.5, stagger: 0.06 }, "-=.8");
    gsap.to(".hero .media img,.phero .media img", { scale: 1.16, ease: "none", scrollTrigger: { trigger: ".hero,.phero", start: "top top", end: "bottom top", scrub: true } });

    var m = document.getElementById("mst");
    if (m) {
      m.innerHTML = m.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
      gsap.to("#mst .w", { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: "#mst", start: "top 82%", end: "bottom 50%", scrub: 0.4 } });
    }
    gsap.utils.toArray(".split .im img,.lease img").forEach(function (el) {
      gsap.fromTo(el, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: el.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
    });
    [".sect .k", ".st", ".man p", ".pc", ".bc", ".fc", ".mgrid figure", ".nrow", ".split h3", ".split p", ".specs div", ".ent", ".of", ".lgrid .cell", ".pr", ".vc", ".cf", ".cinfo .cell", ".lease h2", ".lease p"].forEach(function (s) {
      gsap.utils.toArray(s).forEach(function (e, i) {
        gsap.from(e, { opacity: 0, y: 26, duration: 0.8, delay: (i % 6) * 0.04, ease: "power3.out", scrollTrigger: { trigger: e, start: "top 95%" } });
      });
    });
  } else {
    document.querySelectorAll("h1 .l>span").forEach(function (s) { s.style.transform = "none"; });
    var p = document.getElementById("pre"); if (p) p.style.display = "none";
  }

  // ---------- modal ----------
  var modal = document.getElementById("modal"), mbody = document.getElementById("mbody");
  function openModal(html) { mbody.innerHTML = html; modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); if (lenis) lenis.stop(); }
  function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); if (lenis) lenis.start(); }
  modal.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-brand]");
    if (b && window.BRANDS) {
      var x = window.BRANDS.find(function (r) { return r.name === b.getAttribute("data-brand"); });
      if (!x) return;
      openModal('<div class="mgr"><div class="mi"><img src="' + x.logo + '" alt=""/></div><div class="mt"><i class="c">' + esc(x.cat) + "</i><h3>" + esc(x.name) + "</h3>" +
        (x.desc ? "<p>" + esc(x.desc) + "</p>" : "") +
        "<dl><dt>Location</dt><dd>" + (x.soon ? "Opening soon" : esc(x.floor) + (x.wing ? " · " + esc(x.wing) : "")) + "</dd>" +
        (x.hours ? "<dt>Hours</dt><dd>" + esc(x.hours) + "</dd>" : "") +
        (x.phone ? '<dt>Phone</dt><dd><a href="tel:' + x.phone.replace(/[^+\d]/g, "") + '">' + esc(x.phone) + "</a></dd>" : "") +
        (x.web ? '<dt>Website</dt><dd><a href="' + x.web + '" target="_blank" rel="noopener">' + esc(x.web.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")) + "</a></dd>" : "") +
        "</dl></div></div>");
      return;
    }
    var ev = e.target.closest("[data-event]");
    if (ev && window.EVENTS) {
      var y = window.EVENTS.find(function (r) { return r.slug === ev.getAttribute("data-event"); });
      if (!y) return;
      openModal('<div class="mgr"><div class="mi poster">' + (y.poster ? '<img src="' + y.poster + '" alt=""/>' : "") + '</div><div class="mt"><i class="c">' + esc(y.date) + "</i><h3>" + esc(y.title) + "</h3>" +
        y.body.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div></div>" +
        (y.photos.length ? '<div class="mph">' + y.photos.slice(0, 12).map(function (p) { return '<img loading="lazy" src="' + p + '" alt=""/>'; }).join("") + "</div>" : ""));
      return;
    }
    var gi = e.target.closest(".gi");
    if (gi) { e.preventDefault(); openModal('<div class="lb"><img src="' + gi.getAttribute("href") + '" alt=""/></div>'); }
  });

  // ---------- brand directory filters ----------
  var grid = document.getElementById("bgrid");
  if (grid) {
    var g = "all", q = document.getElementById("q"), fl = document.getElementById("fl"), count = document.getElementById("count");
    function apply() {
      var term = (q.value || "").toLowerCase(), f = fl.value, n = 0;
      grid.querySelectorAll(".bc").forEach(function (c) {
        var ok = (g === "all" || c.dataset.group === g) && (f === "all" || c.dataset.floor === f) && c.dataset.brand.toLowerCase().indexOf(term) > -1;
        c.style.display = ok ? "" : "none"; if (ok) n++;
      });
      count.textContent = n + (n === 1 ? " brand" : " brands");
      if (hasGsap) ScrollTrigger.refresh();
    }
    document.querySelectorAll("#gchips button").forEach(function (bt) {
      bt.addEventListener("click", function () {
        document.querySelectorAll("#gchips button").forEach(function (o) { o.classList.remove("on"); });
        bt.classList.add("on"); g = bt.dataset.g; apply();
      });
    });
    q.addEventListener("input", apply); fl.addEventListener("change", apply); apply();
  }

  // ---------- gallery filter ----------
  var mas = document.getElementById("mas");
  if (mas) {
    document.querySelectorAll("#gchips button").forEach(function (bt) {
      bt.addEventListener("click", function () {
        document.querySelectorAll("#gchips button").forEach(function (o) { o.classList.remove("on"); });
        bt.classList.add("on");
        var e = bt.dataset.e;
        mas.querySelectorAll(".gi").forEach(function (i) { i.classList.toggle("hide", e !== "all" && i.dataset.e !== e); });
        if (hasGsap) ScrollTrigger.refresh();
      });
    });
  }

  // ---------- floor plan ----------
  var ft = document.getElementById("ftabs");
  if (ft && window.FLOORS) {
    var img = document.getElementById("fpimg"), name = document.getElementById("fpn"), list = document.getElementById("fplist");
    function show(fid) {
      var f = window.FLOORS.find(function (r) { return r[0] === fid; });
      img.style.opacity = 0;
      setTimeout(function () { img.src = "floor/" + f[0] + ".jpg"; img.alt = f[1] + " plan"; img.onload = function () { img.style.opacity = 1; }; }, 150);
      name.textContent = f[1];
      var bs = (window.BRANDS || []).filter(function (b) { return !b.soon && f[2].indexOf(b.floor) > -1; });
      list.innerHTML = bs.length ? bs.map(function (b) { return '<a href="#" data-brand="' + esc(b.name) + '">' + esc(b.name) + "<span>" + esc(b.wing) + "</span></a>"; }).join("") : "<p>Offices and upcoming spaces. Talk to leasing: +91 73470 26265</p>";
      ft.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.f === fid); });
    }
    ft.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.f); }); });
    list.addEventListener("click", function (e) { if (e.target.closest("a")) e.preventDefault(); });
    show(window.FLOORS[0][0]);
  }

  // ---------- anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); if (id.length < 2) return;
      var t = document.querySelector(id); if (t && lenis) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.2, offset: -80 }); }
    });
  });
})();
