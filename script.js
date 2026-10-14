/* =========================================================
   EDIT ME — your links live here
   Leave a value as "" to hide that button automatically.
   ========================================================= */
const CONFIG = {
  email: "akash16072003@gmail.com",
  linkedin: "https://www.linkedin.com/in/akash-s-4b1339226",
  github: "https://github.com/Hackerbot16",
  resume: "resume.pdf",   // file sits next to index.html; set to "" to hide the button
  gloveSite: "https://arvigithub03.github.io/smartglove/index.html"
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
  lget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  lset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Apply config to links ---------- */
$$("[data-link]").forEach(el => {
  const key = el.dataset.link;
  const val = CONFIG[key];
  if (!val) { el.hidden = true; el.style.display = "none"; return; }
  el.href = key === "email" ? "mailto:" + val : val;
});
$("#yr").textContent = new Date().getFullYear();

/* ---------- Boot sequence ---------- */
(function boot() {
  const el = $("#boot"), log = $("#bootlog");
  const finish = () => { el.classList.add("done"); store.set("booted", "1"); };
  if (store.get("booted") || reduced) { el.classList.add("done"); return; }
  const lines = [
    "AKASH-S BIOS v1.0",
    "[ OK ] Reset vector found @ 0x08000000",
    "[ OK ] HAL_Init() ......................... done",
    "[ OK ] SystemClock_Config() ............... done",
    "[ OK ] DMA1_Channel5 → UART circular buffer armed",
    "[ OK ] I2C / SPI / UART peripherals online",
    "[ OK ] MQTT session established",
    "[ OK ] OTA bootloader verified",
    "[ OK ] Loading portfolio.bin ..............",
    "",
    "Welcome. Booting interface_"
  ];
  let skipped = false;
  $("#bootskip").addEventListener("click", () => { skipped = true; finish(); });
  (async () => {
    for (const l of lines) {
      if (skipped) return;
      log.textContent += l + "\n";
      await sleep(l.startsWith("[") ? 190 : 330);
    }
    await sleep(350);
    if (!skipped) finish();
  })();
})();

/* ---------- Typing roles ---------- */
(function typing() {
  const roles = ["STM32 & ESP32.", "industrial IoT trackers.", "OTA updates that just work.", "MQTT pipelines with zero packet loss.", "devices that help people."];
  const out = $("#typed");
  if (reduced) { out.textContent = roles[0]; return; }
  let i = 0, j = 0, del = false;
  (function tick() {
    const word = roles[i];
    out.textContent = word.slice(0, j);
    if (!del && j === word.length) { del = true; return setTimeout(tick, 1600); }
    if (del && j === 0) { del = false; i = (i + 1) % roles.length; }
    j += del ? -1 : 1;
    setTimeout(tick, del ? 28 : 70);
  })();
})();

/* ---------- Oscilloscope background ---------- */
(function scope() {
  const cv = $("#scope"), ctx = cv.getContext("2d");
  let w, h, t = 0, mx = 0.5, my = 0.5, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr;
  }
  addEventListener("resize", resize); resize();
  addEventListener("pointermove", e => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; });
  const bit = n => { const x = Math.sin(n * 127.1) * 43758.5453; return (x - Math.floor(x)) > 0.5 ? 1 : 0; };
  function trace(yFrac, kind) {
    const base = yFrac * h, amp = (28 + my * 30) * dpr;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3 * dpr) {
      const u = x / dpr; let y = 0;
      if (kind === "sine") y = Math.sin(u * 0.012 * (0.6 + mx) + t * 2) * amp;
      if (kind === "square") y = (Math.sin(u * 0.02 + t * 3) > 0 ? 1 : -1) * amp * 0.7;
      if (kind === "uart") y = (bit(Math.floor((u + t * 160) / 18)) ? -1 : 1) * amp * 0.7;
      if (kind === "saw") y = (((u * 0.01 + t * 2) % 2) - 1) * amp;
      x === 0 ? ctx.moveTo(x, base + y) : ctx.lineTo(x, base + y);
    }
    ctx.stroke();
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    const col = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#39ff9c";
    ctx.strokeStyle = col; ctx.lineWidth = 1.4 * dpr; ctx.shadowColor = col; ctx.shadowBlur = 8 * dpr;
    ctx.globalAlpha = 0.9;
    trace(0.18, "sine"); trace(0.4, "square"); trace(0.62, "uart"); trace(0.84, "saw");
    ctx.globalAlpha = 0.07; ctx.shadowBlur = 0; ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 80 * dpr) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 80 * dpr) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    t += 0.008;
    if (!reduced) requestAnimationFrame(frame);
  }
  frame();
})();

/* ---------- Theme toggle ---------- */
(function theme() {
  const themes = ["green", "amber", "cyan"], root = document.documentElement;
  const saved = store.lget("theme");
  if (themes.includes(saved)) root.dataset.theme = saved;
  $("#themeBtn").addEventListener("click", () => {
    const next = themes[(themes.indexOf(root.dataset.theme) + 1) % themes.length];
    root.dataset.theme = next; store.lset("theme", next);
  });
})();

/* ---------- Scroll reveal + counters ---------- */
(function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$("[data-count]", e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: 0.12 });
  $$(".reveal").forEach(s => io.observe(s));
  function countUp(el) {
    const end = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const fmt = n => pre + n.toLocaleString("en-US") + suf;
    if (reduced || end === 0) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1400;
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
})();

/* ---------- Pinout skills ---------- */
(function pinout() {
  const pins = [
    ["UART", "Non-blocking UART drivers on STM32 using circular DMA buffers to talk to GSM/GPRS modules — zero packet loss during continuous MQTT transmission."],
    ["SPI", "Configured and optimised SPI for sensor data acquisition and peripheral communication on custom PCB hardware."],
    ["I2C", "I2C bring-up for sensors on custom PCBs, including debugging bus conflicts with a logic analyzer."],
    ["DMA", "DMA-driven memory transfers and circular buffers so the CPU never blocks on communication."],
    ["NVIC", "Interrupt-driven design: hardware interrupts, priorities and timing issues validated on the scope."],
    ["TIM/PWM", "Timers and PWM on STM32 for timing-critical control and signalling."],
    ["GPIO", "GPIO-level control and signalling on custom PCB hardware, alongside interrupts, timers and bus peripherals."],
    ["MQTT", "Architected reliable MQTT pipelines for industrial trackers and ESP32 edge devices, plus cloud-driven automation workflows."],
    ["HTTP", "Lightweight HTTP alongside MQTT for ESP32 cloud workflows."],
    ["GSM/GPRS", "Interfacing GSM/GPRS modems for cellular telemetry on vehicle trackers."],
    ["OTA", "Designed and deployed secure over-the-air firmware updates for STM32 trackers and electronic locks, ending manual on-site flashing."],
    ["CMSIS", "Bare-metal driver work and register manipulation using CMSIS and HAL on ARM Cortex-M."],
    ["HAL", "STM32 HAL architecture with STM32CubeIDE and ST-Link for flashing and debugging."],
    ["ESP32", "Edge devices running MQTT and HTTP, wired into cloud automation workflows."],
    ["YOLOv8", "Edge computer vision at Innospace: real-time forklift-entry detection with 95% anomaly-detection accuracy."],
    ["Linux", "Linux (Ubuntu) with Raspberry Pi and Jetson Nano for edge and vision projects."]
  ];
  const slots = { Top: pins.slice(0, 4), Right: pins.slice(4, 8), Bottom: pins.slice(8, 12), Left: pins.slice(12, 16) };
  const info = $("#pinText");
  let typingId = 0;
  async function show(name, text, btn) {
    $$(".pin.on").forEach(b => b.classList.remove("on")); btn.classList.add("on");
    const id = ++typingId;
    if (reduced) { info.textContent = name + " — " + text; return; }
    info.textContent = "";
    const full = name + " — " + text;
    for (let i = 0; i <= full.length; i += 3) {
      if (id !== typingId) return;
      info.textContent = full.slice(0, i); await sleep(8);
    }
    if (id === typingId) info.textContent = full;
  }
  Object.entries(slots).forEach(([side, list]) => {
    const box = $("#pins" + side);
    list.forEach(([n, d]) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "pin"; b.textContent = n;
      b.addEventListener("click", () => show(n, d, b));
      box.appendChild(b);
    });
  });
  $("#pinsTop .pin").click();
})();

/* ---------- Project cards ---------- */
$$(".card").forEach(c => {
  const toggle = () => c.classList.toggle("open");
  c.addEventListener("click", e => { if (e.target.closest("a")) return; toggle(); $(".expand", c).textContent = c.classList.contains("open") ? "− collapse" : "+ details"; });
  c.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c.click(); } });
  c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (e.clientX - r.left) + "px");
    c.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
});

/* ---------- OTA simulation ---------- */
(function ota() {
  const btn = $("#otaBtn"), bar = $("#otaBar"), log = $("#otaLog"), verNew = $("#verNew");
  let busy = false, n = 3;
  const say = m => { log.textContent += m + "\n"; log.scrollTop = log.scrollHeight; };
  btn.addEventListener("click", async () => {
    if (busy) return; busy = true; btn.disabled = true;
    log.textContent = ""; bar.style.width = "0%";
    const stages = [
      ["Manifest received over MQTT (new version announced)", 8],
      ["Entering bootloader, staging area erased", 18],
      ["Downloading firmware in chunks …", 55],
      ["Chunks reassembled in flash staging bank", 70],
      ["Verifying image integrity & authenticity", 82],
      ["Verification OK — marking image as pending", 90],
      ["Rebooting into new firmware", 96],
      ["Self-test passed. Reporting success to cloud", 100]
    ];
    for (const [msg, pct] of stages) { say("[" + String(pct).padStart(3) + "%] " + msg); bar.style.width = pct + "%"; await sleep(reduced ? 50 : 650); }
    say("\n✔ update complete — no technician required.");
    n++; verNew.textContent = "v1.3." + n; busy = false; btn.disabled = false; btn.textContent = "▶ Push another update";
  });
})();

/* ---------- MQTT simulation ---------- */
(function mqtt() {
  const pkt = $("#pkt"), log = $("#mqttLog");
  const say = m => { log.textContent += m + "\n"; log.scrollTop = log.scrollHeight; };
  let busy = false;
  const X = { dev: 70, brk: 260, dash: 450 };
  function move(from, to, ms) {
    return new Promise(res => {
      if (reduced) { res(); return; }
      pkt.setAttribute("opacity", "1");
      const t0 = performance.now();
      (function step(now) {
        const p = Math.min((now - t0) / ms, 1);
        pkt.setAttribute("cx", from + (to - from) * p);
        if (p < 1) requestAnimationFrame(step); else res();
      })(t0);
    });
  }
  async function run(path, label, lines) {
    if (busy) return; busy = true;
    say(lines[0]);
    for (let i = 0; i < path.length - 1; i++) { await move(path[i], path[i + 1], 700); say(lines[i + 1]); }
    pkt.setAttribute("opacity", "0"); busy = false;
  }
  $("#pubTelemetry").addEventListener("click", () =>
    run([X.dev, X.brk, X.dash], "telemetry", [
      "device → PUBLISH tracker/001/telemetry",
      "broker  → routed to subscribers",
      "dashboard ← location + sensor data received"]));
  $("#pubUnlock").addEventListener("click", () =>
    run([X.dash, X.brk, X.dev], "unlock", [
      "dashboard → PUBLISH lock/001/cmd {\"action\":\"unlock\"}",
      "broker  → forwarded to device",
      "device  ← command received, actuating lock ✔"]));
  pkt.setAttribute("cx", X.dev);
})();

/* ---------- Terminal ---------- */
(function terminal() {
  const out = $("#termOut"), form = $("#termForm"), input = $("#termInput");
  const hist = []; let hi = 0;
  const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const link = (u, t) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
  const cmds = {
    help: () => "Available commands:\n  about       who I am\n  skills      what I work with\n  projects    things I've built\n  experience  where I've worked\n  education   college & certs\n  contact     how to reach me\n  whoami      quick intro\n  clear       clean the screen",
    about: () => "Embedded Firmware Engineer (STM32, ESP32) shipping production firmware for industrial IoT trackers and electronic locks. Passionate about reliable drivers, OTA updates and assistive technology.",
    whoami: () => "akash — firmware engineer · Chennai · open to firmware / product development roles",
    skills: () => "Languages   : Embedded C, C, Python, DSA (C)\nMCUs        : STM32 (ARM Cortex-M), ESP32\nProtocols   : UART, SPI, I2C, DMA, MQTT, HTTP, GSM/GPRS\nFirmware    : OTA, state machines, circular buffers, register-level drivers\nTools       : ST-Link, STM32CubeIDE, logic analyzer, oscilloscope, Git",
    projects: () => "1. Vehicle Tracking System + OTA (KritiLabs)\n2. MQTT Long-Range Lock Controller (KritiLabs)\n3. Multimodal Smart Glove — IEEE EPICS, $5,050 → " + (CONFIG.gloveSite ? link(CONFIG.gloveSite, "site ↗") : "") + "\n4. Smart Spectacles — obstacle detection for the visually impaired (IEEE paper)",
    experience: () => "May 2025 – now   Embedded Firmware Engineer, KritiLabs Technologies\nJun 2023 – Sep 2024   Embedded & AI Trainee, Innospace Automation",
    education: () => "B.E. Electronics & Communication Engineering — Sri Sairam Engineering College (2021–2025), CGPA 7.34\nCCNA (Modules 1–3) · Raspberry Pi & Hardware Integration (EC-Council) · C & Python (Cisco / Spoken Tutorial)",
    contact: () => "email    : " + link("mailto:" + CONFIG.email, CONFIG.email) + "\nlinkedin : " + link(CONFIG.linkedin, "akash-s-4b1339226") + (CONFIG.github ? "\ngithub   : " + link(CONFIG.github, CONFIG.github.replace("https://", "")) : ""),
    ls: () => "about  skills  projects  experience  education  contact",
    "sudo hire akash": () => "[sudo] permission granted ✔\nOffer letter generated. Please email " + link("mailto:" + CONFIG.email, CONFIG.email) + " to continue. 😉",
    clear: () => null
  };
  function print(html, cls) { const d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html; out.appendChild(d); out.scrollTop = out.scrollHeight; }
  print("Welcome to akash-os 1.0 — type <code>help</code> to get started.");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const raw = input.value.trim(); input.value = ""; if (!raw) return;
    hist.push(raw); hi = hist.length;
    print(`<span class="cmd">akash@portfolio:~$</span> ${esc(raw)}`);
    const key = raw.toLowerCase();
    if (key === "clear") { out.innerHTML = ""; return; }
    const fn = cmds[key];
    fn ? print(fn()) : print(`command not found: ${esc(raw)} — try <code>help</code>`, "e");
  });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && hist.length) { hi = Math.max(0, hi - 1); input.value = hist[hi]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ""; e.preventDefault(); }
  });
  $("#term").addEventListener("click", () => input.focus({ preventScroll: true }));
})();

/* ---------- Konami easter egg ---------- */
(function konami() {
  const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let i = 0;
  addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT") return;
    i = (e.key.toLowerCase() === seq[i].toLowerCase()) ? i + 1 : 0;
    if (i === seq.length) { i = 0; document.body.classList.add("konami"); setTimeout(() => document.body.classList.remove("konami"), 2200); }
  });
})();
