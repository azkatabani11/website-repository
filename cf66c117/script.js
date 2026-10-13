// HEAL site interactions: mobile nav + contact form validation

(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Contact form (demo: validates and confirms on screen)
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");

  function setInvalid(input, invalid) {
    var field = input.closest(".field");
    if (!field) return;
    field.classList.toggle("invalid", invalid);
    input.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;

    var nameBad = name.value.trim().length < 2;
    setInvalid(name, nameBad);
    if (nameBad) ok = false;

    var emailBad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    setInvalid(email, emailBad);
    if (emailBad) ok = false;

    var msgBad = message.value.trim().length < 10;
    setInvalid(message, msgBad);
    if (msgBad) ok = false;

    return ok;
  }

  ["name", "email", "message"].forEach(function (key) {
    var el = form.elements[key];
    el.addEventListener("input", function () {
      if (el.closest(".field").classList.contains("invalid")) validate();
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      status.classList.remove("show");
      var firstInvalid = form.querySelector(".field.invalid input, .field.invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    var topic = form.elements.topic.value;
    status.textContent =
      "Thank you, " + form.elements.name.value.trim().split(" ")[0] +
      "! Your \"" + topic + "\" inquiry was received. A HEAL advisor will reply within 2 hours.";
    status.classList.add("show");
    form.reset();
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
})();
