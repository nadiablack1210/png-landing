(() => {
  "use strict";

  // DESTINATIONS (exactly what you requested)
  const LINKS = {
    "2xbet": {
      contact: "https://shorturl.at/sXaPl",
      telegram: "https://t.me/kinasettoplist"
    },
    "675vip": {
      contact: "https://shorturl.at/KMY9g",
      telegram: "https://t.me/kinasettoplist"
    }
  };

  function getBrand() {
    const path = (location.pathname || "/").toLowerCase();
    return path.startsWith("/675vip") ? "675vip" : "2xbet";
  }

  function safeJsonParse(s) {
    try { return JSON.parse(s || "{}"); } catch { return {}; }
  }

  function utmPayload() {
    const p = new URLSearchParams(location.search);
    const keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid"];
    const out = {};
    keys.forEach(k => { if (p.get(k)) out[k] = p.get(k); });
    return out;
  }

  function track(eventName, params) {
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, params);
    }
  }

  const brand = getBrand();
  const dest = LINKS[brand];

  // Fade-in
  requestAnimationFrame(() => document.getElementById("app")?.classList.add("appear"));

  // CLICK HANDLER: WhatsApp / Contact
  document.addEventListener("click", (e) => {
    const el = e.target.closest(".js-contact");
    if (!el) return;

    e.preventDefault();

    const eventName = el.getAttribute("data-fb-event") || "LeadClick";
    const baseParams = safeJsonParse(el.getAttribute("data-fb-params"));
    const utm = utmPayload();

    track(eventName, {
      ...baseParams,
      brand,
      destination: "whatsapp",
      url: dest.contact,
      ...utm
    });

    setTimeout(() => window.location.assign(dest.contact), 120);
  }, { passive: false });

  // CLICK HANDLER: Telegram
  document.addEventListener("click", (e) => {
    const el = e.target.closest(".js-telegram");
    if (!el) return;

    e.preventDefault();

    const eventName = el.getAttribute("data-fb-event") || "TelegramJoinClick";
    const baseParams = safeJsonParse(el.getAttribute("data-fb-params"));
    const utm = utmPayload();

    track(eventName, {
      ...baseParams,
      brand,
      destination: "telegram",
      url: dest.telegram,
      ...utm
    });

    setTimeout(() => window.location.assign(dest.telegram), 120);
  }, { passive: false });

  // PARTICLES (lively background)
  (function particles(){
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const c = document.getElementById("bgParticles");
    if (!c) return;

    const ctx = c.getContext("2d", { alpha: true });
    let w, h, dpr;

    const P = [];
    const COUNT = 38;
    const rand = (a, b) => Math.random() * (b - a) + a;

    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.width = Math.floor(window.innerWidth * dpr);
      h = c.height = Math.floor(window.innerHeight * dpr);
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
    }

    function seed(){
      P.length = 0;
      for (let i = 0; i < COUNT; i++) {
        P.push({
          x: rand(0, w), y: rand(0, h),
          r: rand(1.2*dpr, 3.6*dpr),
          vx: rand(-.22*dpr, .22*dpr),
          vy: rand(-.16*dpr, .16*dpr),
          a: rand(.08, .18)
        });
      }
    }

    function tick(){
      ctx.clearRect(0, 0, w, h);
      for (const p of P) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener("resize", () => { resize(); seed(); }, { passive: true });
    resize(); seed(); tick();
  })();

})();
