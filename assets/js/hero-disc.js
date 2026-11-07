/* ============================================================
   KR11 hero-disc.js —— 首屏黑胶 2.5D（复刻 landonorris.com 头盔行为）
   鼠标视差 / 滚动搓碟 / 拖拽惯性 / hover NEXT STAGE 换碟
   仅「换碟」依赖 main.js 的 window.KR11 钩子，缺失时其余功能照常
   ============================================================ */
(function () {
  "use strict";
  const stage = document.getElementById("heroVisual");
  const tilt = document.getElementById("hvmTilt");
  const spinEl = document.getElementById("hvmSpin");
  if (!stage || !tilt || !spinEl) return;

  const fine = matchMedia("(pointer:fine)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* —— 调参区 —— */
  const BASE_RX = 16;     // 静止俯仰角
  const BASE_RY = -8;     // 静止偏航角
  const TILT_AMP = 7;     // 鼠标纵向视差幅度
  const YAW_AMP = 14;     // 鼠标横向视差幅度
  const IDLE_SPIN = 0.12; // 每帧常速旋转（度/帧，60fps 下约 43°/s）
  const SCROLL_GAIN = 0.06;
  const FRICTION = 0.972; // 拖拽惯性衰减

  let rx = BASE_RX, ry = BASE_RY, trx = BASE_RX, tryy = BASE_RY;
  let rot = 0, vel = 0, scrollBoost = 0, lastY = scrollY;
  let dragging = false, lastA = 0, lastT = 0, discGroup = null;
  let inView = true, pageVisible = !document.hidden;
  new IntersectionObserver((es) => { inView = es[0].isIntersecting; }).observe(stage);
  document.addEventListener("visibilitychange", () => { pageVisible = !document.hidden; });

  const lerp = (a, b, t) => a + (b - a) * t;
  const angleAt = (e) => {
    const r = stage.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2),
                      e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
  };
  const findGroup = () => { discGroup = spinEl.querySelector(".rot-g"); };

  /* 1) 鼠标视差 */
  if (fine && !reduce) {
    addEventListener("pointermove", (e) => {
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      trx = BASE_RX - ny * TILT_AMP;
      tryy = BASE_RY + nx * YAW_AMP;
    }, { passive: true });
  }

  /* 2) 滚动搓碟：往下滚正转，往上滚倒转 */
  addEventListener("scroll", () => {
    scrollBoost += (scrollY - lastY) * SCROLL_GAIN;
    lastY = scrollY;
  }, { passive: true });

  /* 3) 拖拽甩碟（手感同 footer disc360） */
  spinEl.addEventListener("pointerdown", (e) => {
    if (!fine || reduce) return;
    dragging = true; vel = 0; lastA = angleAt(e); lastT = performance.now();
    try { spinEl.setPointerCapture(e.pointerId); } catch (_) {}
    spinEl.classList.add("grabbing");
  });
  ["pointerup", "pointercancel"].forEach((ev) =>
    addEventListener(ev, () => { dragging = false; spinEl.classList.remove("grabbing"); }));
  addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const a = angleAt(e), t = performance.now();
    let da = a - lastA;
    if (da > 180) da -= 360; if (da < -180) da += 360;
    rot += da;
    const dt = Math.max(16, t - lastT);
    vel = vel * 0.5 + (da / dt * 16) * 0.5;
    lastA = a; lastT = t;
  }, { passive: true });

  /* 4) hover NEXT STAGE → 换碟 + 说明文字同步 */
  const cap = document.getElementById("hvCap");
  const swap = (id, capText) => {
    const api = window.KR11;
    if (!api) return;
    const d = api.discById(id);
    const slot = spinEl.querySelector("[data-disc]");
    if (d && slot) { slot.innerHTML = api.discSVG(d, { sparkles: true }); findGroup(); }
    if (cap && capText) cap.textContent = capText;
  };
  const ns = document.querySelector(".next-stage");
  if (ns) {
    ns.addEventListener("mouseenter", () => swap("seoul", "SEOUL · 0411 PRESSING · 10"));
    ns.addEventListener("mouseleave", () => swap("supernova", "SUPERNOVA PRESSING · 01"));
  }

  /* 渲染循环 */
  (function loop() {
    if (!discGroup) findGroup();               /* main.js 异步填碟后再挂载 */
    if (inView && pageVisible) {
    if (!dragging) {
      rot += vel + (reduce ? 0 : IDLE_SPIN);
      vel *= FRICTION;
      rot += scrollBoost;
      scrollBoost *= 0.8;
    }
    rx = lerp(rx, trx, 0.07);
    ry = lerp(ry, tryy, 0.07);
    if (!reduce) tilt.style.transform =
      `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    if (discGroup)
      discGroup.setAttribute("transform", `rotate(${(rot % 360).toFixed(2)} 300 300)`);
    }
    requestAnimationFrame(loop);
  })();
})();
