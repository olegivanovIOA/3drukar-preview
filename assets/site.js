/* DRUKAR Production · WIW2026 site script (all pages, all languages). Settings live in config.js. */
(function () {
"use strict";

const T = {
  en: {
    days: "days to the show", today: "The show is on now. Find us at the stand.",
    after: "Missed us at the show? Leave your number and we'll set up a video call.",
    copied: "Copied", sending: "Sending…",
    eName: "Please enter your name and company.", ePhone: "Please enter a valid phone number.",
    ePhonePL: "A Polish number has 9 digits, e.g. 600 123 456.", eEmail: "Please check the email address.",
    eEmailReq: "Please enter your email.", saved: "Saved. We'll confirm this day when we call.",
    hi: n => `Thank you, ${n}.`, demo: "Test mode: the form endpoint isn't configured yet, so this request was not saved."
  },
  pl: {
    days: "dni do targów", today: "Targi trwają. Zapraszamy na stoisko.",
    after: "Nie udało się spotkać na targach? Zostaw numer, a umówimy rozmowę wideo.",
    copied: "Skopiowano", sending: "Wysyłanie…",
    eName: "Podaj imię i nazwę firmy.", ePhone: "Podaj poprawny numer telefonu.",
    ePhonePL: "Polski numer ma 9 cyfr, np. 600 123 456.", eEmail: "Sprawdź adres e-mail.",
    eEmailReq: "Podaj adres e-mail.", saved: "Zapisane. Potwierdzimy ten dzień podczas rozmowy.",
    hi: n => `Dziękujemy, ${n}.`, demo: "Tryb testowy: formularz nie jest jeszcze podłączony, zgłoszenie nie zostało zapisane."
  }
};
const LANG = T[document.documentElement.lang] ? document.documentElement.lang : "en";
const L = T[LANG];
const ROOT = document.documentElement.getAttribute("data-root") || "";
const LP = document.documentElement.getAttribute("data-langpath") || "";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const dl = o => { (window.dataLayer = window.dataLayer || []).push(o); };
const store = {
  get(k, s) { try { return JSON.parse((s ? sessionStorage : localStorage).getItem(k) || "null"); } catch (e) { return null; } },
  set(k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- config into page ---------- */
$$("[data-cfg]").forEach(el => { const v = CONFIG[el.dataset.cfg]; if (v) el.textContent = v; });

/* ---------- attribution: UTM + ad click ids, kept 30 days (first touch) ---------- */
const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid", "li_fat_id", "msclkid"];
(function () {
  const q = new URLSearchParams(location.search), now = Date.now();
  let a = store.get("drk-attr");
  if (a && now - a.ts > 30 * 864e5) a = null;
  const fresh = {}; ATTR_KEYS.forEach(k => { if (q.get(k)) fresh[k] = q.get(k).slice(0, 200); });
  if (Object.keys(fresh).length) a = Object.assign({ ts: now, landing: location.href.split("#")[0], referrer: document.referrer }, fresh);
  else if (!a) a = { ts: now, landing: location.href.split("#")[0], referrer: document.referrer };
  store.set("drk-attr", a);
})();

/* ---------- messenger buttons ---------- */
const ICON = {
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.2 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.4.7 1 1.4 1.7 1.9.6.4 1 .6 1.3.7.2.1.3 0 .5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .6-.2 1.3-.8 1.6-.6.4-1.5.6-2.6.2-1.3-.4-2.6-1.3-3.6-2.4-1-1.1-1.7-2.3-1.8-3.3-.1-.9.2-1.6.4-2z" fill="currentColor"/></svg>',
  telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 4.1 2.9 11.2c-.8.3-.8 1.4 0 1.6l4.6 1.5 1.8 5.5c.2.7 1.1.9 1.6.4l2.6-2.4 4.7 3.5c.6.4 1.4.1 1.6-.6l3-14.2c.2-.9-.6-1.6-1.4-1.3zM9.8 14.6l-.4 3.4-1.3-4.1 9.5-6.1-7.8 6.8z" fill="currentColor"/></svg>',
  viber: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8c-4.8 0-8.4 1.5-8.4 7.4 0 3 .8 5 2.4 6.2v3.8c0 .5.6.8 1 .4l2.7-2.6c.7.1 1.5.1 2.3.1 4.8 0 8.4-1.5 8.4-7.6S16.8 2.8 12 2.8z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.3 7.4c.2-.2.5-.2.7 0l1 1.3c.2.2.2.5 0 .7l-.5.5c.4.9 1.1 1.7 2 2.1l.5-.5c.2-.2.5-.2.7 0l1.3 1c.2.2.2.5 0 .7l-.6.7c-.3.3-.8.4-1.2.3-2.1-.6-3.8-2.3-4.4-4.4-.1-.4 0-.9.3-1.2l.2-.2zM12.6 6.9a3.4 3.4 0 0 1 3.1 3.1M12.6 5.4a4.9 4.9 0 0 1 4.6 4.6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1l-2.2 2.2z" fill="currentColor"/></svg>'
};
const MSGR = {
  whatsapp: v => ({ href: "https://wa.me/" + v.replace(/\D/g, ""), label: "WhatsApp" }),
  telegram: v => ({ href: "https://t.me/" + v.replace(/^@/, ""), label: "Telegram" }),
  viber:    v => ({ href: "viber://pa?chatURI=" + encodeURIComponent(v), label: "Viber" }),
  phone:    v => ({ href: "tel:" + v.replace(/[^\d+]/g, ""), label: LANG === "pl" ? "Zadzwoń" : "Call" })
};
$$("[data-msgr]").forEach(box => {
  const only = (box.dataset.msgr || "").split(",").map(s => s.trim()).filter(Boolean);
  const m = CONFIG.messengers || {};
  box.innerHTML = Object.keys(MSGR).filter(k => m[k] && (!only.length || only.includes(k))).map(k => {
    const x = MSGR[k](m[k]); const ext = /^https/.test(x.href) ? ' target="_blank" rel="noopener"' : "";
    return `<a class="msgr msgr-${k}" href="${x.href}"${ext} data-channel="${k}" aria-label="${x.label}">${ICON[k]}<span>${x.label}</span></a>`;
  }).join("");
});
document.addEventListener("click", e => {
  const a = e.target.closest("a[data-channel], a[href^='mailto:'], a[href^='tel:']"); if (!a) return;
  const ch = a.dataset.channel || (a.href.startsWith("mailto:") ? "email" : "phone");
  dl({ event: "contact_click", channel: ch, page_type: document.body.dataset.page || "landing" });
});

/* ---------- industries filter + dots ---------- */
$$(".filters button").forEach(b => b.addEventListener("click", () => {
  $$(".filters button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  $$(".ind").forEach(li => { li.hidden = !(b.dataset.f === "all" || li.dataset.brand === b.dataset.f); });
}));
$$(".dots").forEach(d => { d.innerHTML = "<i></i>".repeat(+d.dataset.n); });

/* ---------- countdown ---------- */
const cd = $("#countdown");
if (cd) {
  const now = Date.now(), s = Date.parse(CONFIG.showStart), e = Date.parse(CONFIG.showEnd);
  cd.textContent = now < s ? `${Math.ceil((s - now) / 864e5)} ${L.days}` : now <= e ? L.today : L.after;
}

/* ---------- .ics / .vcf ---------- */
function download(name, text, type) {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 500);
  } catch (e) {}
}
$$("[data-ics]").forEach(b => b.addEventListener("click", () => {
  download("DRUKAR-WIW2026.ics", ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DRUKAR Production//WIW2026//EN", "BEGIN:VEVENT",
    "UID:wiw2026-drukar@3drukar.com", "DTSTAMP:20261001T000000Z", "DTSTART;VALUE=DATE:20261103", "DTEND;VALUE=DATE:20261106",
    "SUMMARY:Warsaw Industry Week · DRUKAR Production, stand " + CONFIG.booth,
    "LOCATION:Ptak Warsaw Expo\\, Al. Katowicka 62\\, 05-830 Nadarzyn\\, Poland",
    "DESCRIPTION:Serial 3D printing (EASY3DPRINT)\\, filament (DRUKAR) and custom materials (PLEXIWIRE). " + CONFIG.email,
    "END:VEVENT", "END:VCALENDAR"].join("\r\n"), "text/calendar");
  dl({ event: "add_to_calendar" });
}));
$$("[data-vcf]").forEach(b => b.addEventListener("click", () => {
  download("DRUKAR-Production.vcf", ["BEGIN:VCARD", "VERSION:3.0", "N:Production;DRUKAR;;;", "FN:DRUKAR Production", "ORG:DRUKAR Production",
    "TEL;TYPE=WORK,VOICE:" + CONFIG.phone, "EMAIL;TYPE=WORK:" + CONFIG.email, "EMAIL;TYPE=WORK:" + CONFIG.email2,
    "URL:" + location.origin + "/", "NOTE:Serial 3D printing · Filament · Custom materials. Warsaw Industry Week 2026, stand " + CONFIG.booth, "END:VCARD"].join("\r\n"), "text/vcard");
  dl({ event: "save_vcard" });
}));

/* ---------- copy ---------- */
$$("[data-copy-text]").forEach(b => b.addEventListener("click", () => {
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(b.dataset.copyText).then(() => { const o = b.textContent; b.textContent = L.copied; setTimeout(() => b.textContent = o, 1400); }).catch(() => {});
}));

/* ---------- send to Google Sheet (Apps Script) ---------- */
function send(data) {
  if (!CONFIG.endpoint) return false;
  const body = new URLSearchParams(data);
  let queued = false;
  try { queued = navigator.sendBeacon && navigator.sendBeacon(CONFIG.endpoint, body); } catch (e) {}
  if (!queued) { try { fetch(CONFIG.endpoint, { method: "POST", mode: "no-cors", body, keepalive: true }); } catch (e) {} }
  return true;
}

/* ---------- lead form ---------- */
const form = $("#leadForm");
if (form) {
  const pre = $("#f-prefix"), ph = $("#f-phone"), em = $("#f-email"), nm = $("#f-name"), cta = $("#f-cta");
  if (pre && CONFIG.phonePrefix) pre.value = CONFIG.phonePrefix;
  if (CONFIG.emailRequired) { em.required = true; $("#f-email-opt").hidden = true; $("#f-email-req").hidden = false; }

  const INTEREST = { "easy3dprint": "Serial 3D printing", "test-print": "Serial 3D printing", "drukar": "Filament", "plexiwire": "Custom materials" };
  $$("[data-cta]").forEach(a => a.addEventListener("click", () => {
    cta.value = a.dataset.cta;
    dl({ event: "cta_click", cta: a.dataset.cta });
    setTimeout(() => { try { nm.focus({ preventScroll: true }); } catch (e) {} }, 600);
  }));

  const isPL = () => pre.value === "+48";
  const fmt = d => (d.match(/.{1,3}/g) || []).join(" ");
  function maskPhone() {
    let raw = ph.value, d = raw.replace(/\D/g, "");
    if (/^\s*(\+|00)/.test(raw)) {               // pasted an international number: pick the prefix
      d = d.replace(/^00/, "");
      const codes = [...pre.options].map(o => o.value.replace("+", "")).filter(Boolean).sort((a, b) => b.length - a.length);
      const c = codes.find(c => d.startsWith(c));
      if (c) { pre.value = "+" + c; d = d.slice(c.length); }
    }
    if (isPL() && d.length === 11 && d.startsWith("48")) d = d.slice(2);
    d = d.slice(0, isPL() ? 9 : 12);
    ph.value = fmt(d);
  }
  ph.addEventListener("input", maskPhone);
  pre.addEventListener("change", () => { ph.placeholder = isPL() ? "600 123 456" : "123 456 789"; maskPhone(); ph.focus(); });

  function setErr(input, msg) {
    const box = input.closest(".fld"), out = box.querySelector(".f-err");
    box.classList.toggle("bad", !!msg); input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (out) { out.textContent = msg || ""; out.hidden = !msg; }
    return !msg;
  }
  // Clear an error while typing (so the button doesn't jump under the cursor on click); flag new errors on blur.
  [nm, ph, em].forEach(i => {
    i.addEventListener("input", () => { if (i.closest(".fld").classList.contains("bad")) validate(i); });
    i.addEventListener("blur", () => { if (i.value && !i.closest(".fld").classList.contains("bad")) validate(i); });
  });
  function validate(only) {
    let ok = true;
    if (!only || only === nm) ok = setErr(nm, nm.value.trim().length < 2 ? L.eName : "") && ok;
    if (!only || only === ph) {
      const d = ph.value.replace(/\D/g, "");
      ok = setErr(ph, isPL() ? (d.length === 9 ? "" : L.ePhonePL) : (d.length >= 6 && d.length <= 12 ? "" : L.ePhone)) && ok;
    }
    if (!only || only === em) {
      const v = em.value.trim();
      ok = setErr(em, !v ? (CONFIG.emailRequired ? L.eEmailReq : "") : (/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v) ? "" : L.eEmail)) && ok;
    }
    return ok;
  }

  form.addEventListener("submit", ev => {
    ev.preventDefault();
    if (form.website.value) return;                // honeypot
    if (!validate()) { const b = $(".fld.bad input", form); if (b) b.focus(); dl({ event: "form_error" }); return; }
    const btn = $("#f-submit"); btn.disabled = true; btn.querySelector("span").textContent = L.sending;
    const id = "L" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
    const a = store.get("drk-attr") || {};
    const phone = pre.value + ph.value.replace(/\D/g, "");
    const data = {
      lead_id: id, name: nm.value.trim(), phone, email: em.value.trim(),
      cta: cta.value || "form", interest: INTEREST[cta.value] || "", lang: LANG,
      page: location.href.split("#")[0], landing: a.landing || "", referrer: a.referrer || "",
      consent: window.drkConsent && drkConsent.granted() ? "granted" : "denied"
    };
    ATTR_KEYS.forEach(k => { if (a[k]) data[k] = a[k]; });
    const sent = send(data);
    store.set("drk-lead", { id, name: data.name.split(/[,/]/)[0].trim().split(" ")[0], email: data.email, phone, cta: data.cta, ts: Date.now(), demo: !sent, fired: false }, true);
    dl({ event: "lead_form_submit", cta: data.cta });
    setTimeout(() => { location.href = ROOT + LP + "thanks/"; }, 250);
  });
}

/* ---------- thank-you page ---------- */
if (document.body.dataset.page === "thanks") {
  const lead = store.get("drk-lead", true);
  if (lead) {
    if (lead.name) $("#thxHi").textContent = L.hi(lead.name);
    if (lead.demo) { const n = $("#thxDemo"); n.textContent = L.demo; n.hidden = false; }
    if (!lead.fired && Date.now() - lead.ts < 30 * 60e3) {   // conversion fires once per submitted form
      const ev = { event: "generate_lead", lead_id: lead.id, cta: lead.cta, form_language: LANG };
      if (window.drkConsent && drkConsent.granted()) ev.user_data = { email: lead.email || undefined, phone_number: lead.phone };
      dl(ev);
      lead.fired = true; store.set("drk-lead", lead, true);
    }
    $("#thxStep2").hidden = false;
    $$("[data-day]").forEach(b => b.addEventListener("click", () => {
      $$("[data-day]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      send({ action: "update", lead_id: lead.id, day: b.dataset.day });
      dl({ event: "meeting_day_selected", day: b.dataset.day });
      const s = $("#thxSaved"); s.textContent = L.saved; s.hidden = false;
    }));
  }
}

/* ---------- Polish-version hint for Polish browsers (no auto-redirect) ---------- */
const hint = $("#langHint");
if (hint && LANG === "en") {
  const dismissed = store.get("drk-hint");
  if (!dismissed && (navigator.languages || [navigator.language || ""]).some(l => /^pl\b/i.test(l))) hint.hidden = false;
  $("#hintClose").addEventListener("click", () => { hint.hidden = true; store.set("drk-hint", 1); });
}
})();
