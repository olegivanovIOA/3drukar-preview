/* Consent Mode v2 + Google Tag Manager loader + cookie banner (EN/PL).
   Loaded in <head> right after config.js. Nothing is tracked until the visitor accepts:
   GTM loads in "denied" mode (cookieless pings only) and switches to "granted" on Accept. */
(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };

  var KEY = "drk-consent-v1";
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}

  gtag("consent", "default", {
    ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    functionality_storage: "granted", security_storage: "granted", wait_for_update: 500
  });
  gtag("set", "ads_data_redaction", true);
  gtag("set", "url_passthrough", true);
  if (saved && saved.v === "granted") grant();

  function grant() {
    gtag("consent", "update", { ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
  }
  function deny() {
    gtag("consent", "update", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  }

  // GTM (skipped on the github.io sandbox so reviews don't pollute statistics)
  var id = (window.CONFIG && CONFIG.gtmId) || "";
  if (id && !/github\.io$/.test(location.hostname)) {
    dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  var TXT = {
    en: { t: "Cookies", p: "We use cookies to measure visits and the performance of our ads. Nothing is stored until you accept.",
          a: "Accept", r: "Reject", m: "Privacy notice" },
    pl: { t: "Pliki cookie", p: "Używamy plików cookie do pomiaru odwiedzin i skuteczności reklam. Nic nie zapisujemy bez Twojej zgody.",
          a: "Akceptuję", r: "Odrzucam", m: "Polityka prywatności" }
  };

  function banner() {
    if (document.getElementById("ckBanner")) { document.getElementById("ckBanner").hidden = false; return; }
    var L = TXT[document.documentElement.lang] || TXT.en;
    var root = document.documentElement.getAttribute("data-root") || "";
    var lp = document.documentElement.getAttribute("data-langpath") || "";
    var d = document.createElement("div");
    d.id = "ckBanner"; d.className = "ck"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", L.t);
    d.innerHTML = '<div class="ck-in"><p><b>' + L.t + '.</b> ' + L.p + ' <a href="' + root + lp + 'privacy/">' + L.m + '</a></p>' +
      '<div class="ck-b"><button type="button" class="btn btn-ghost" data-ck="deny">' + L.r + '</button>' +
      '<button type="button" class="btn btn-primary" data-ck="grant">' + L.a + '</button></div></div>';
    document.body.appendChild(d);
    d.addEventListener("click", function (e) {
      var b = e.target.closest("[data-ck]"); if (!b) return;
      var v = b.getAttribute("data-ck") === "grant" ? "granted" : "denied";
      try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (x) {}
      v === "granted" ? grant() : deny();
      dataLayer.push({ event: "consent_" + v });
      d.hidden = true;
    });
  }

  window.drkConsent = { open: banner, granted: function () { try { return JSON.parse(localStorage.getItem(KEY) || "{}").v === "granted"; } catch (e) { return false; } } };
  document.addEventListener("DOMContentLoaded", function () {
    if (!saved) banner();
    var o = document.querySelectorAll("[data-cookie-settings]");
    for (var i = 0; i < o.length; i++) o[i].addEventListener("click", function (e) { e.preventDefault(); banner(); });
  });
})();
