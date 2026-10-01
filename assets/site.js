
const T = { // strings used from script
  en:{days:"days to the show",today:"The show is on now. Find us at the stand.",after:"Missed us at the show? Request a video call below.",anytime:"Any time",sending:"Sending…",
      ok:n=>`Thank you${n?", "+n:""}. We'll confirm your slot by email within one working day.`,
      err:e=>`The form couldn't be sent from here. Copy the summary below and email it to ${e}.`,
      need:"Please fill in name, company, a valid email and tick the consent box.",copied:"Copied",copySum:"Copy summary",title:"DRUKAR Production"},
  pl:{days:"dni do targów",today:"Targi trwają. Zapraszamy na stoisko.",after:"Nie udało się spotkać na targach? Poproś o rozmowę wideo poniżej.",anytime:"Dowolna godzina",sending:"Wysyłanie…",
      ok:n=>`Dziękujemy${n?", "+n:""}. Potwierdzimy termin e-mailem w ciągu jednego dnia roboczego.`,
      err:e=>`Nie udało się wysłać formularza. Skopiuj podsumowanie i wyślij je na ${e}.`,
      need:"Uzupełnij imię i nazwisko, firmę, poprawny e-mail i zaznacz zgodę.",copied:"Skopiowano",copySum:"Kopiuj podsumowanie",title:"DRUKAR Production"}
};

const LANG = T[document.documentElement.lang] ? document.documentElement.lang : "en";
const $ = (s,r=document)=>r.querySelector(s), $$ = (s,r=document)=>[...r.querySelectorAll(s)];

/* ---------- config into page ---------- */
function applyConfig(){
  $$("[data-cfg]").forEach(el=>{
    const v = CONFIG[el.dataset.cfg];
    if(v!==undefined && v!=="") el.textContent=v;
  });
}

/* ---------- industries filter ---------- */
let currentFilter="all";
function applyFilter(f){
  currentFilter=f;
  $$(".filters button").forEach(b=>b.setAttribute("aria-pressed", String(b.dataset.f===f)));
  $$(".ind").forEach(li=>{ li.hidden = !(f==="all" || li.dataset.brand===f); });
}
$$(".filters button").forEach(b=>b.addEventListener("click",()=>applyFilter(b.dataset.f)));

/* ---------- dots ---------- */
$$(".dots").forEach(d=>{ d.innerHTML = "<i></i>".repeat(+d.dataset.n); });

/* ---------- time slots ---------- */
function renderSlots(){
  const s=$("#f-slot"); const keep=s.value;
  let o=`<option value="Any time">${T[LANG].anytime}</option>`;
  for(let m=10*60;m<=16*60+30;m+=30){const t=String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");o+=`<option value="${t}">${t}</option>`;}
  s.innerHTML=o; if(keep) s.value=keep;
}

/* ---------- countdown / post-show mode ---------- */
function countdown(){
  const el=$("#countdown"); const now=Date.now(), s=Date.parse(CONFIG.showStart), e=Date.parse(CONFIG.showEnd);
  if(now<s){ const d=Math.ceil((s-now)/864e5); el.textContent = `${d} ${T[LANG].days}`; }
  else if(now<=e){ el.textContent=T[LANG].today; }
  else { el.textContent=T[LANG].after; $("#f-video").checked=true; }
}

/* ---------- file helpers (.ics / .vcf) ---------- */
function download(name, text, type){
  try{
    const url=URL.createObjectURL(new Blob([text],{type}));
    const a=document.createElement("a"); a.href=url; a.download=name; document.body.appendChild(a); a.click();
    setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},500);
  }catch(e){}
}
$("#icsBtn").addEventListener("click",()=>{
  const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//DRUKAR Production//WIW2026//EN","BEGIN:VEVENT",
    "UID:wiw2026-drukar@drukar","DTSTAMP:20261001T000000Z","DTSTART;VALUE=DATE:20261103","DTEND;VALUE=DATE:20261106",
    "SUMMARY:Warsaw Industry Week · DRUKAR Production, stand "+CONFIG.booth,
    "LOCATION:Ptak Warsaw Expo\\, Al. Katowicka 62\\, 05-830 Nadarzyn\\, Poland",
    "DESCRIPTION:Serial 3D printing (EASY3DPRINT)\\, filament (DRUKAR) and custom materials (PLEXIWIRE). "+CONFIG.email,
    "END:VEVENT","END:VCALENDAR"].join("\r\n");
  download("DRUKAR-WIW2026.ics",ics,"text/calendar");
});
$("#vcfBtn").addEventListener("click",()=>{
  const v=["BEGIN:VCARD","VERSION:3.0","N:Production;DRUKAR;;;","FN:DRUKAR Production","ORG:DRUKAR Production",
    "TEL;TYPE=WORK,VOICE:"+CONFIG.phone,"EMAIL;TYPE=WORK:"+CONFIG.email,"EMAIL;TYPE=WORK:"+CONFIG.email2,
    "URL:"+location.href.split("#")[0],"NOTE:Serial 3D printing · Filament · Custom materials. Warsaw Industry Week 2026, stand "+CONFIG.booth,"END:VCARD"].join("\r\n");
  download("DRUKAR-Production.vcf",v,"text/vcard");
});

/* ---------- copy ---------- */
function copyText(text, btn){
  const done=()=>{ const o=btn.textContent; btn.textContent=T[LANG].copied; setTimeout(()=>btn.textContent=o,1400); };
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(()=>{}); }
}
$$("[data-copy-text]").forEach(b=>b.addEventListener("click",()=>copyText(b.dataset.copyText,b)));

/* ---------- test-print CTA pre-fills message ---------- */
$$("[data-test]").forEach(a=>a.addEventListener("click",()=>{
  const m=$("#f-msg"); if(!m.value) m.value = LANG==="pl" ? "Proszę o bezpłatny wydruk testowy. Część: " : "I'd like a free test print. Part: ";
}));

/* ---------- UTM capture ---------- */
const UTM={}; try{ const q=new URLSearchParams(location.search); ["utm_source","utm_medium","utm_campaign"].forEach(k=>{ if(q.get(k)) UTM[k]=q.get(k); }); }catch(e){}

/* ---------- form ---------- */
$("#leadForm").addEventListener("submit", async ev=>{
  ev.preventDefault();
  const f=ev.target, st=$("#f-status"), btn=$("#f-submit");
  if(f.website.value) return; // bot
  const email=f.email.value.trim();
  if(!f.name.value.trim() || !f.company.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !f.consent.checked){
    st.className="f-msg err"; st.textContent=T[LANG].need; return;
  }
  const data={
    name:f.name.value.trim(), company:f.company.value.trim(), role:f.role.value.trim(), email, phone:f.phone.value.trim(),
    country:f.country.value, interests:$$('input[name="interest"]:checked',f).map(i=>i.value).join(", "),
    volume:f.volume.value, day:($('input[name="day"]:checked',f)||{}).value||"", slot:f.slot.value,
    video:f.video.checked?"yes":"no", message:f.message.value.trim(), lang:LANG, page:location.href.split("#")[0], ...UTM
  };
  const summary=Object.entries(data).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join("\n");
  btn.disabled=true; st.className="f-msg"; st.textContent=T[LANG].sending;
  let sent=false;
  if(CONFIG.endpoint){
    try{ await fetch(CONFIG.endpoint,{method:"POST",mode:"no-cors",body:new URLSearchParams(data)}); sent=true; }catch(e){ sent=false; }
  }
  btn.disabled=false;
  if(sent){
    st.className="f-msg ok"; st.textContent=T[LANG].ok(data.name.split(" ")[0]); f.reset(); renderSlots();
  }else{
    const subj=encodeURIComponent("Meeting request · Warsaw Industry Week · "+data.company);
    st.className="f-msg err";
    st.innerHTML=`<span></span><pre></pre><div class="f-actions"><button type="button" class="btn btn-ghost" id="cpSum"></button><a class="btn btn-ghost" href="mailto:${CONFIG.email}?subject=${subj}&body=${encodeURIComponent(summary)}">${CONFIG.email}</a></div>`;
    st.querySelector("span").textContent=T[LANG].err(CONFIG.email);
    st.querySelector("pre").textContent=summary;
    const cb=st.querySelector("#cpSum"); cb.textContent=T[LANG].copySum; cb.addEventListener("click",()=>copyText(summary,cb));
  }
});

/* ---------- boot ---------- */
applyConfig(); renderSlots(); countdown();
(function(){ // suggest the Polish version to Polish browsers; never auto-redirect
  if(LANG!=="en") return;
  let dismissed=false; try{ dismissed = localStorage.getItem("drk-hint")==="1"; }catch(e){}
  if(!dismissed && (navigator.languages||[navigator.language||""]).some(l=>/^pl\b/i.test(l))) $("#langHint").hidden=false;
  $("#hintClose").addEventListener("click",()=>{ $("#langHint").hidden=true; try{ localStorage.setItem("drk-hint","1"); }catch(e){} });
})();
