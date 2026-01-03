(() => {
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));

  // -----------------------------
  // Config you MUST edit
  // -----------------------------
  const CONFIG = {
    email: "eng.ahmedshaya@gmail.com",
    linkedin: "https://www.linkedin.com/in/ahmed-alsuraihi-7961b3245?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", // e.g. https://www.linkedin.com/in/yourname
    cv: "Ahmed_Alsuraihi.pdf" // e.g. a PDF in repo: assets/Ahmed-CV.pdf
  };

  // Inject config
  const emailLink = $("#emailLink");
  const linkedinLink = $("#linkedinLink");
  const linkedinText = $("#linkedinText");
  const cvLink = $("#cvLink");

  if (emailLink) {
    emailLink.textContent = CONFIG.email;
    emailLink.href = `mailto:${CONFIG.email}`;
  }
  if (linkedinLink) linkedinLink.href = CONFIG.linkedin;
  if (linkedinText) {
    linkedinText.href = CONFIG.linkedin;
    linkedinText.textContent = CONFIG.linkedin.includes("http") ? "Open profile ↗" : "Add your link";
  }
  if (cvLink) cvLink.href = CONFIG.cv;

  // -----------------------------
  // Year
  // -----------------------------
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // -----------------------------
  // Scroll progress bar
  // -----------------------------
  const scrollProgress = $("#scrollProgress");
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${p}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // -----------------------------
  // Typewriter
  // -----------------------------
  const roles = [
    "Front-End Developer",
    "Back-End Developer",
    "AI / Computer Vision Enthusiast",
    "Automation Builder",
    "Problem Solver"
  ];
  const typeTarget = $("#typeTarget");
  let r = 0, i = 0, deleting = false;

  function tick(){
    if (!typeTarget) return;
    const word = roles[r % roles.length];
    const speed = deleting ? 36 : 58;

    if (!deleting) {
      i++;
      typeTarget.textContent = word.slice(0, i);
      if (i >= word.length) {
        deleting = true;
        setTimeout(tick, 850);
        return;
      }
    } else {
      i--;
      typeTarget.textContent = word.slice(0, i);
      if (i <= 0) {
        deleting = false;
        r++;
      }
    }
    setTimeout(tick, speed);
  }
  tick();

  // -----------------------------
  // Reveal on scroll
  // -----------------------------
  const revealEls = $$(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // -----------------------------
  // Animated bars when visible
  // -----------------------------
  const bars = $$(".bar");
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const bar = e.target;
      const lvl = bar.getAttribute("data-level") || "0";
      const fill = bar.querySelector("span");
      if (fill) fill.style.width = `${lvl}%`;
      barIO.unobserve(bar);
    });
  }, { threshold: 0.35 });
  bars.forEach(b => barIO.observe(b));

  // -----------------------------
  // Count-up stats
  // -----------------------------
  const nums = $$(".stat-num");
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.getAttribute("data-count") || "0", 10);
      const start = performance.now();
      const dur = 900;

      function step(t){
        const p = Math.min(1, (t - start) / dur);
        el.textContent = Math.floor(p * target).toString();
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.55 });
  nums.forEach(n => countIO.observe(n));

  // -----------------------------
  // Tilt card (mouse move)
  // -----------------------------
  const card = $("#tiltCard");
  if (card) {
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    card.addEventListener("mousemove", (ev) => {
      const rect = card.getBoundingClientRect();
      const mx = ((ev.clientX - rect.left) / rect.width) * 100;
      const my = ((ev.clientY - rect.top) / rect.height) * 100;

      const rx = clamp(((my - 50) / 50) * -6, -7, 7);
      const ry = clamp(((mx - 50) / 50) *  8, -9, 9);

      card.style.setProperty("--mx", `${mx}%`);
      card.style.setProperty("--my", `${my}%`);
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0px)`;
      card.style.setProperty("--mx", `50%`);
      card.style.setProperty("--my", `30%`);
    });
  }

  // -----------------------------
  // Toast helper
  // -----------------------------
  const toast = $("#toast");
  let toastTimer = null;
  function showToast(msg){
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  // -----------------------------
  // Copy email / profile
  // -----------------------------
  const copyEmail = $("#copyEmail");
  if (copyEmail) {
    copyEmail.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(CONFIG.email);
        showToast("Email copied ✅");
      } catch {
        showToast("Copy failed — edit email first.");
      }
    });
  }

  const copyProfile = $("#copyProfile");
  if (copyProfile) {
    copyProfile.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Site link copied ✅");
      } catch {
        showToast("Copy failed.");
      }
    });
  }

  // -----------------------------
  // Build email draft
  // -----------------------------
  const buildEmail = $("#buildEmail");
  if (buildEmail) {
    buildEmail.addEventListener("click", () => {
      const name = ($("#msgName")?.value || "").trim();
      const body = ($("#msgBody")?.value || "").trim();
      const out = $("#emailDraft");

      if (!out) return;

      if (!body) {
        out.textContent = "Write a message first.";
        return;
      }

      const draft =
`To: ${CONFIG.email}
Subject: Hello Ahmed

Hi Ahmed${name ? `, I’m ${name}` : ""},

${body}

Best regards,
${name || "Your Name"}
`;
      out.textContent = draft;
      showToast("Draft generated ✅");
    });
  }

  // -----------------------------
  // Theme toggle (saved)
  // -----------------------------
  const themeBtn = $("#themeBtn");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

  function syncThemeIcon(){
    const t = document.documentElement.getAttribute("data-theme");
    const icon = themeBtn?.querySelector(".icon");
    if (!icon) return;
    icon.textContent = t === "light" ? "☀" : "☾";
  }
  syncThemeIcon();

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "light" ? "" : "light";
      if (next) document.documentElement.setAttribute("data-theme", next);
      else document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", next || "");
      syncThemeIcon();
      showToast(next === "light" ? "Light mode" : "Dark mode");
    });
  }

  // -----------------------------
  // Drawer menu
  // -----------------------------
  const drawer = $("#drawer");
  const menuBtn = $("#menuBtn");
  const closeDrawer = $("#closeDrawer");

  function openDrawer(){
    if (!drawer) return;
    drawer.classList.add("show");
    drawer.setAttribute("aria-hidden", "false");
  }
  function hideDrawer(){
    if (!drawer) return;
    drawer.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
  }

  if (menuBtn) menuBtn.addEventListener("click", openDrawer);
  if (closeDrawer) closeDrawer.addEventListener("click", hideDrawer);
  if (drawer) {
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) hideDrawer();
    });
    $$(".drawer-link", drawer).forEach(a => a.addEventListener("click", hideDrawer));
  }

  // -----------------------------
  // Confetti (canvas)
  // -----------------------------
  const confettiBtn = $("#confettiBtn");
  const canvas = $("#confettiCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let particles = [];
  let raf = null;

  function resizeCanvas(){
    if (!canvas || !card) return;
    const rect = card.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * devicePixelRatio);
    canvas.height = Math.floor(rect.height * devicePixelRatio);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    if (ctx) ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function burst(){
    if (!canvas || !ctx) return;
    resizeCanvas();
    particles = [];
    for (let i=0; i<120; i++){
      particles.push({
        x: canvas.width / devicePixelRatio / 2,
        y: canvas.height / devicePixelRatio / 2,
        vx: (Math.random() - .5) * 9,
        vy: (Math.random() - 1.2) * 10,
        g: 0.22 + Math.random() * 0.08,
        s: 3 + Math.random() * 4,
        r: Math.random() * Math.PI,
        vr: (Math.random() - .5) * .35,
        life: 70 + Math.random() * 40
      });
    }
    if (raf) cancelAnimationFrame(raf);
    animate();
    showToast("✨ Nice.");
  }

  function animate(){
    if (!ctx || !canvas) return;
    ctx.clearRect(0,0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);

    particles.forEach(p => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.life -= 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 90));
      ctx.fillStyle = `hsl(${(p.life * 4) % 360} 90% 60%)`;
      ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s);
      ctx.restore();
    });

    particles = particles.filter(p => p.life > 0 && p.y < (canvas.height / devicePixelRatio + 60));
    if (particles.length > 0) raf = requestAnimationFrame(animate);
  }

  if (confettiBtn) confettiBtn.addEventListener("click", burst);

  // -----------------------------
  // View source shortcut
  // -----------------------------
  const viewSource = $("#viewSource");
  if (viewSource) {
    viewSource.addEventListener("click", (e) => {
      e.preventDefault();
      window.open("https://github.com/Ahmedsuraihi/Ahmed-Alsuraihi", "_blank");
    });
  }
})();
// galleries
const galleries = {
  erpnext: [
    "assets/Gallery/erpNext_images/dashboard.png",
    "assets/Gallery/erpNext_images/Screenshot 2025-12-27 173555.png",
    "assets/Gallery/erpNext_images/Screenshot 2025-12-27 173030.png",
    "assets/Gallery/erpNext_images/Screenshot 2025-12-27 172925.png",
    "assets/Gallery/erpNext_images/Screenshot 2025-12-27 172831.png",
  ],
  chatbot: [
    "assets/Gallery/gpt_website/chat-detail.png",
    "assets/Gallery/gpt_website/settings-accernt-purple.png",
    "assets/Gallery/gpt_website/settings.png",
    "assets/Gallery/gpt_website/table-comparision.png",
    "assets/Gallery/gpt_website/projects.png",
    "assets/Gallery/gpt_website/move-chat-to-project.png",
    "assets/Gallery/gpt_website/homre-arabic.png",
    "assets/Gallery/gpt_website/home.png",
    "assets/Gallery/gpt_website/home-dark.png",
    "assets/Gallery/gpt_website/create-project.png",
    "assets/Gallery/gpt_website/connectors.png",
    "assets/Gallery/gpt_website/code-example.png",
    "assets/Gallery/gpt_website/chat-detail.png",
    "assets/Gallery/gpt_website/moblie-responsive.png",

  ],
  others:[
    "assets/Gallery/others/Screenshot 2025-12-29 185410.png",
    "assets/Gallery/others/Screenshot 2025-12-29 185202.png",
    "assets/Gallery/others/Screenshot 2025-12-29 184910.png",
    "assets/Gallery/others/Screenshot 2025-12-29 184650.png",
    "assets/Gallery/others/Screenshot 2025-12-29 184443.png",
    "assets/Gallery/others/Screenshot 2025-12-29 184301.png",
    "assets/Gallery/others/Screenshot 2025-12-29 185928.png",
    "assets/Gallery/others/dashboards.png",
    "assets/Gallery/others/webshop-analytics-dashboard ",
    "assets/Gallery/others/quantom-flow.png",
  ]
};

const overlay = document.getElementById("galleryOverlay");
const content = document.getElementById("galleryContent");

function openGallery(name) {
  content.innerHTML = "";

  galleries[name].forEach((src) => {
    const link = document.createElement("a");
    link.href = src;

    link.setAttribute("data-lightbox", "projects");

    const img = document.createElement("img");
    img.src = src;
    img.alt = name + " project image";

    link.appendChild(img);
    content.appendChild(link);
  });

  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}


function closeGallery() {
  overlay.classList.add("hidden");
  content.innerHTML = "";
  document.body.style.overflow = "";
}

document.querySelectorAll(".gallery-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    openGallery(btn.dataset.gallery);
  });
});

document.getElementById("galleryCloseTop").onclick = closeGallery;
document.getElementById("galleryCloseBottom").onclick = closeGallery;

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeGallery();
});
overlay.addEventListener("click", e => {
  if (e.target === overlay) closeGallery();
});
