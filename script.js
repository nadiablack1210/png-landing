// Reads WhatsApp link per page from: <body data-whatsapp="...">
const WHATSAPP_URL = (document.body && document.body.dataset && document.body.dataset.whatsapp)
  ? document.body.dataset.whatsapp.trim()
  : "";

if (!WHATSAPP_URL) {
  console.warn("Missing WhatsApp URL. Add: <body data-whatsapp='https://...'>");
}

const cards = document.querySelectorAll("[data-wa]");

// Reveal animation
window.addEventListener("load", () => {
  cards.forEach((el, i) => {
    el.classList.add("reveal");
    if (i === 1) el.classList.add("delay");
  });
});

function openWhatsApp() {
  if (!WHATSAPP_URL) return;
  window.location.assign(WHATSAPP_URL);
}

// Ripple effect
function ripple(e, el){
  const r = document.createElement("span");
  r.className = "ripple";
  const rect = el.getBoundingClientRect();
  const x = (e.clientX || (rect.left + rect.width/2)) - rect.left;
  const y = (e.clientY || (rect.top + rect.height/2)) - rect.top;
  r.style.left = x + "px";
  r.style.top = y + "px";
  el.appendChild(r);
  setTimeout(() => r.remove(), 520);
}

// Inject ripple CSS
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
  .ripple{
    position:absolute;
    width:10px; height:10px;
    border-radius:999px;
    background: rgba(255,255,255,.22);
    transform: translate(-50%,-50%) scale(1);
    animation: rip .52s ease-out forwards;
    pointer-events:none;
  }
  @keyframes rip{
    to{ transform: translate(-50%,-50%) scale(28); opacity:0; }
  }
`;
document.head.appendChild(rippleStyle);

/* ===== confetti ===== */
const canvas = document.getElementById("confetti");
const ctx = canvas ? canvas.getContext("2d") : null;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
  canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let confetti = [];
function fireConfetti() {
  if (!canvas || !ctx) return;

  confetti = [];
  const count = 160;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.40;

  for (let i = 0; i < count; i++) {
    // bias hues toward gold + blue
    const hue = Math.random() < 0.55 ? (38 + Math.random()*18) : (200 + Math.random()*40);
    confetti.push({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 1.2) * 12,
      g: 0.34 + Math.random() * 0.22,
      w: 4 + Math.random() * 6,
      h: 3 + Math.random() * 5,
      a: 1,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.28,
      hue
    });
  }

  const start = performance.now();
  (function anim(t) {
    const dt = (t - start) / 1000;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    confetti.forEach(p => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.a -= 0.012;

      ctx.save();
      ctx.globalAlpha = Math.max(p.a, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      ctx.fillStyle = `hsl(${p.hue}, 95%, 60%)`;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);

      ctx.restore();
    });

    confetti = confetti.filter(p => p.a > 0 && p.y < window.innerHeight + 70);

    if (dt < 1.2 && confetti.length) requestAnimationFrame(anim);
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  })(performance.now());
}

// Bind clicks + pixel tracking
cards.forEach(card => {
  card.addEventListener("click", (e) => {
    ripple(e, card);
    fireConfetti();

    // Meta Pixel click tracking (safe to call if pixel exists)
    try {
      if (window.fbq) {
        fbq("track", "Contact");
        const tier = card.getAttribute("data-tier") || "unknown";
        fbq("trackCustom", "WhatsAppClick", { tier, page: location.pathname });
      }
    } catch (_) {}

    // press feedback
    card.style.transform = "translateY(-2px) scale(1.01)";
    setTimeout(() => { card.style.transform = ""; }, 180);

    // delay for “reveal” feel
    setTimeout(openWhatsApp, 520);
  });
});