/**
 * Home Tour TV — Landing Page
 *
 * Set appLive to true when submityourlisting.ca is ready.
 * That flips the hero CTA from the waitlist form to the app link.
 */
var appLive = false;
var APP_URL = 'https://submityourlisting.ca';

(function () {
  // --- App-live toggle ---
  var heroCta = document.getElementById('hero-cta');
  if (appLive && heroCta) {
    heroCta.href = APP_URL;
    heroCta.textContent = 'Submit Your Listing';
    heroCta.removeAttribute('data-track');
    heroCta.setAttribute('data-track', 'cta_click');
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- GA4 event tracking ---
  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      var eventName = this.getAttribute('data-track');
      if (typeof gtag === 'function') {
        gtag('event', eventName);
      }
    });
  });

  // --- Waitlist form ---
  var form = document.getElementById('waitlist-form');
  var successBox = document.getElementById('success-box');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fname = document.getElementById('fname');
      var email = document.getElementById('email');
      var province = document.getElementById('province');
      var lname = document.getElementById('lname');
      var brokerage = document.getElementById('brokerage');

      // Clear previous errors
      [fname, email, province].forEach(function (f) {
        f.classList.remove('field-error');
      });

      // Validate
      var valid = true;
      if (!fname.value.trim()) { fname.classList.add('field-error'); valid = false; }
      if (!email.value.trim() || !isValidEmail(email.value)) { email.classList.add('field-error'); valid = false; }
      if (!province.value) { province.classList.add('field-error'); valid = false; }

      if (!valid) return;

      var submitBtn = form.querySelector('.submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'JOINING...';

      var data = {
        first_name: fname.value.trim(),
        last_name: lname.value.trim(),
        email: email.value.trim(),
        province: province.value,
        brokerage: brokerage.value.trim(),
        source: 'hometourtv-waitlist'
      };

      // TODO: Replace with Kajabi or Kit API endpoint
      // For now, simulate a short delay then show success
      setTimeout(function () {
        form.style.display = 'none';
        successBox.style.display = 'block';

        if (typeof gtag === 'function') {
          gtag('event', 'waitlist_signup', { province: data.province });
        }
      }, 600);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();
