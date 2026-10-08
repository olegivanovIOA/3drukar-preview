/* =========================================================
   CONFIG — the only file you normally edit after launch.
   Shared by every page and language.
   ========================================================= */
var CONFIG = {
  booth: "TBA",                         // e.g. "Hall C · C2.14"
  endpoint: "",                         // Google Apps Script Web App URL (…/exec) — leads go to Google Sheet
  gtmId: "",                            // Google Tag Manager container, e.g. "GTM-ABC1234". Empty = no tracking scripts at all

  // Form
  phonePrefix: "+48",                   // default country code in the phone field
  emailRequired: false,                 // true = email becomes mandatory

  // Contacts (vCard, calendar entry, fallback when the form can't be sent)
  email: "sales@drukar.com",
  email2: "sales@easy3dprint.com.ua",
  phone: "+380738111337",

  // Messenger buttons. Leave a value empty ("") to hide that button everywhere.
  messengers: {
    whatsapp: "",                       // digits only with country code, e.g. "48600123456"
    telegram: "easy3dprint_bot",        // username without @
    viber:    "easy3dprint",            // Viber public account URI (viber://pa?chatURI=…)
    phone:    "+380738111337"           // tap-to-call
  },

  showStart: "2026-11-03T10:00:00+01:00",
  showEnd:   "2026-11-05T17:00:00+01:00"
};
