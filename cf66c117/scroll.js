// Scroll interactions: section reveal, card stagger, top progress bar
(function () {
  "use strict";

  var root = document.documentElement;
  var sections = document.querySelectorAll("main > section");

  function showAll() {
    sections.forEach(function (s) { s.classList.add("in-view"); });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in-view");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  } else {
    showAll();
  }

  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  var ticking = false;
  function update() {
    var max = root.scrollHeight - root.clientHeight;
    var pos = root.scrollTop || document.body.scrollTop;
    bar.style.width = (max > 0 ? pos / max * 100 : 0) + "%";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();
