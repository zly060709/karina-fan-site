/* ============================================================
   KR11 FAN PROJECT — main.js
   F01 预加载彩蛋 / F02 全屏菜单 / F04 平滑滚动开关 / F05 横向滑锁
   F06 跑马灯 / F09 时代碟墙 / F10 计数 / F11 时代标签
   F12 日程 / F13 卡墙 / F14 拨转唱片 / reveal / 导航
   ============================================================ */
(function () {
  "use strict";
  const reduceOn = () => matchMedia("(prefers-reduced-motion: reduce)").matches ||
                 document.documentElement.classList.contains("reduce-motion");
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const root = document.documentElement;

  /* ---------- seeded random ---------- */
  function seeded(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      return ((h >>> 0) % 100000) / 100000;
    };
  }

  /* ============================================================
     discSVG —— 参数化黑胶工厂
     treat: splatter 洒溅 / etched 蚀刻 / chrome 铬镜 / scales 蛇鳞 / stars 星芒
     ============================================================ */
  function discSVG(d, opts) {
    opts = opts || {};
    const rnd = seeded(d.id || "kr");
    const S = 600, C = 300, R = 292;
    const rotId = "rot-" + (d.id || "x") + "-" + Math.floor(rnd() * 1e6);
    const spinCls = opts.spin ? " spin" : "";
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" class="disc-svg${opts.cls ? " " + opts.cls : ""}" role="img" aria-label="${d.name} 概念黑胶">`;
    s += `<defs>
      <radialGradient id="vin-${rotId}" cx="0.5" cy="0.42" r="0.75">
        <stop offset="0" stop-color="#15161B"/><stop offset="0.72" stop-color="#0B0C0F"/><stop offset="1" stop-color="#060608"/>
      </radialGradient>
      <radialGradient id="chr-${rotId}" cx="0.36" cy="0.3" r="1">
        <stop offset="0" stop-color="#98A1B4"/><stop offset="0.3" stop-color="#4A5162"/><stop offset="0.68" stop-color="#1B1D25"/><stop offset="1" stop-color="#383E4B"/>
      </radialGradient>
      <linearGradient id="sheen-${rotId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity=".16"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
      </linearGradient>
      <clipPath id="clip-${rotId}"><circle cx="${C}" cy="${C}" r="${R - 8}"/></clipPath>
    </defs>`;
    /* 旋转组：盘基 + 纹理 + 标签 */
    s += `<g id="${rotId}" class="rot-g${spinCls}">`;
    s += `<circle cx="${C}" cy="${C}" r="${R}" fill="${d.treat === "chrome" ? `url(#chr-${rotId})` : `url(#vin-${rotId})`}" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/>`;
    s += `<g clip-path="url(#clip-${rotId})">`;
    /* 声槽 */
    for (let r = 128; r <= R - 10; r += 6.5) {
      const op = 0.028 + (r % 26 < 6.5 ? 0.028 : 0) + rnd() * 0.02;
      s += `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="#FFFFFF" stroke-opacity="${op.toFixed(3)}" stroke-width="1"/>`;
    }
    /* 工艺层 */
    if (d.treat === "splatter") {
      const cols = d.colors || ["#2E55FF"];
      for (let i = 0; i < 44; i++) {
        const a = rnd() * Math.PI * 2, rr = 105 + rnd() * 178;
        const x = C + Math.cos(a) * rr, y = C + Math.sin(a) * rr;
        const sz = 2.5 + rnd() * rnd() * 24;
        const col = cols[Math.floor(rnd() * cols.length)];
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(1)}" fill="${col}" opacity="${(0.5 + rnd() * 0.45).toFixed(2)}"/>`;
        if (rnd() > 0.68) s += `<circle cx="${(x + sz).toFixed(1)}" cy="${(y - sz * 0.8).toFixed(1)}" r="${(sz * 0.3).toFixed(1)}" fill="${col}" opacity="0.7"/>`;
        if (rnd() > 0.9) s += `<circle cx="${(x - sz * 1.4).toFixed(1)}" cy="${(y + sz * 1.2).toFixed(1)}" r="${(sz * 0.18).toFixed(1)}" fill="${col}" opacity="0.85"/>`;
      }
    } else if (d.treat === "scales") {
      for (let ry = 6; ry < 20; ry++) {
        for (let cx2 = 0; cx2 < 26; cx2++) {
          const x = cx2 * 26 + (ry % 2 ? 13 : 0) - 30, y = ry * 20 - 60;
          if (Math.hypot(x - C, y - C) > R - 14) continue;
          s += `<path d="M ${x} ${y} a 13 13 0 0 0 26 0" fill="none" stroke="${rnd() > 0.94 ? "#C8102E" : "#1F2027"}" stroke-opacity="${rnd() > 0.94 ? 0.8 : 0.55}" stroke-width="2.4"/>`;
        }
      }
    } else if (d.treat === "etched") {
      s += `<g transform="rotate(26 ${C} ${C})">`;
      for (let i = -16; i <= 16; i++) {
        s += `<line x1="${C + i * 22}" y1="-30" x2="${C + i * 22}" y2="630" stroke="#D7DCE6" stroke-opacity="${i % 3 ? 0.22 : 0.4}" stroke-width="${i % 3 ? 1.6 : 3}"/>`;
      }
      s += `</g>`;
    } else if (d.treat === "chrome") {
      for (let i = 0; i < 11; i++) {
        const a = rnd() * Math.PI * 2, rr = 115 + rnd() * 165;
        const x = C + Math.cos(a) * rr, y = C + Math.sin(a) * rr;
        s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(26 + rnd() * 52).toFixed(1)}" ry="${(4 + rnd() * 7).toFixed(1)}" transform="rotate(${(rnd() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="#07070B" opacity="${(0.6 + rnd() * 0.3).toFixed(2)}"/>`;
      }
      s += `<ellipse cx="${C - 105}" cy="${C - 120}" rx="86" ry="52" transform="rotate(-28 ${C - 105} ${C - 120})" fill="#FFFFFF" opacity="0.14"/>`;
      s += `<ellipse cx="${C + 150}" cy="${C + 140}" rx="60" ry="34" transform="rotate(-20 ${C + 150} ${C + 140})" fill="#FFFFFF" opacity="0.07"/>`;
      s += `<circle cx="${C}" cy="${C}" r="${R - 2}" fill="none" stroke="#FF3EC8" stroke-opacity="0.55" stroke-width="2.5"/>`;
      /* 铬面上的声槽（深色刻线） */
      for (let r = 128; r <= R - 10; r += 6.5) {
        s += `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="#000000" stroke-opacity="0.1" stroke-width="1"/>`;
      }
    } else if (d.treat === "stars") {
      const cols = d.colors || ["#4E79FF", "#C9CFDA"];
      for (let i = 0; i < 42; i++) {
        const a = rnd() * Math.PI * 2, rr = 104 + rnd() * 180;
        const x = C + Math.cos(a) * rr, y = C + Math.sin(a) * rr;
        const sz2 = 3 + rnd() * 9;
        const col = cols[Math.floor(rnd() * cols.length)];
        s += `<path d="M ${x.toFixed(1)} ${(y - sz2).toFixed(1)} Q ${(x + sz2 * 0.16).toFixed(1)} ${(y - sz2 * 0.16).toFixed(1)} ${(x + sz2).toFixed(1)} ${y.toFixed(1)} Q ${(x + sz2 * 0.16).toFixed(1)} ${(y + sz2 * 0.16).toFixed(1)} ${x.toFixed(1)} ${(y + sz2).toFixed(1)} Q ${(x - sz2 * 0.16).toFixed(1)} ${(y + sz2 * 0.16).toFixed(1)} ${(x - sz2).toFixed(1)} ${y.toFixed(1)} Q ${(x - sz2 * 0.16).toFixed(1)} ${(y - sz2 * 0.16).toFixed(1)} ${x.toFixed(1)} ${(y - sz2).toFixed(1)} Z" fill="${col}" opacity="${(0.5 + rnd() * 0.5).toFixed(2)}"/>`;
      }
    }
    /* 标签 */
    const lb = d.labelBg || "#101014", li = d.labelInk || "#F2F4F8";
    s += `<circle cx="${C}" cy="${C}" r="92" fill="${lb}" stroke="rgba(255,255,255,.2)" stroke-width="1.5"/>`;
    s += `<circle cx="${C}" cy="${C}" r="86" fill="none" stroke="rgba(255,255,255,.09)" stroke-width="1"/>`;
    s += `<text x="${C}" y="${C - 38}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="11" letter-spacing="3" fill="${li}" opacity=".72">aespa · KARINA</text>`;
    s += `<text x="${C}" y="${C + 20}" text-anchor="middle" font-family="Archivo,'Arial Black',sans-serif" font-weight="700" font-size="${d.name.length > 12 ? 15 : 19}" letter-spacing="1" fill="${li}">${d.name}</text>`;
    s += `<text x="${C}" y="${C + 44}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="9.5" letter-spacing="2.5" fill="${li}" opacity=".6">LP · 33⅓ · ${d.year || ''}</text>`;
    s += `<text x="${C + 58}" y="${C + 66}" text-anchor="middle" font-family="Archivo,'Arial Black',sans-serif" font-weight="700" font-size="22" fill="${d.accent || "#8FA6FF"}">11</text>`;
    s += `</g>`; /* /clip */
    s += `<circle cx="${C}" cy="${C}" r="9" fill="#0C0C10" stroke="#8D94A3" stroke-width="2"/>`;
    s += `</g>`; /* /rot */
    /* 静态光泽（不随盘旋转） */
    s += `<path d="M ${C - 265} ${C - 90} A ${R - 4} ${R - 4} 0 0 1 ${C + 40} ${C - 288} L ${C - 10} ${C - 200} A ${R - 96} ${R - 96} 0 0 0 ${C - 190} ${C - 60} Z" fill="url(#sheen-${rotId})" opacity=".8"/>`;
    s += `<path d="M ${C + 265} ${C + 90} A ${R - 4} ${R - 4} 0 0 1 ${C - 30} ${C + 288} L ${C + 6} ${C + 196} A ${R - 100} ${R - 100} 0 0 0 ${C + 186} ${C + 56} Z" fill="url(#sheen-${rotId})" opacity=".45"/>`;
    if (opts.sparkles) {
      s += `<g fill="#8FA6FF"><path d="M 64 96 Q 66.5 108.5 79 111 Q 66.5 113.5 64 126 Q 61.5 113.5 49 111 Q 61.5 108.5 64 96 Z"/><path d="M 536 130 Q 538 140 548 142 Q 538 144 536 154 Q 534 144 524 142 Q 534 140 536 130 Z" opacity=".8"/><path d="M 92 470 Q 94 480 104 482 Q 94 484 92 494 Q 90 484 80 482 Q 90 480 92 470 Z" opacity=".7"/></g>`;
    }
    s += `</svg>`;
    return s;
  }

  /* ---------- F01 preloader: LOADINA ---------- */
  const loader = $("#loader");
  if (loader) {
    const word = loader.querySelector(".load-word");
    const WORD = "LOADINA";
    function playLoader() {
      word.innerHTML = "";
      [...WORD].forEach((ch, i) => {
        const sp = document.createElement("span");
        sp.className = "ch" + (i >= 4 ? " sp" : "");
        sp.textContent = ch;
        sp.style.animationDelay = i * 0.09 + "s";
        word.appendChild(sp);
      });
    }
    playLoader();
    word.addEventListener("click", playLoader);
    const done = () => loader.classList.add("done");
    /* S13: 真进度——四任务各占 25% */
    const bar = loader.querySelector(".load-bar i");
    let prog = 0;
    const tick = (n) => { prog = Math.min(1, prog + n); if (bar) bar.style.transform = `scaleX(${prog.toFixed(3)})`; };
    tick(0.15);
    Promise.allSettled([document.fonts.ready]).then(() => tick(0.35));
    fetch("data/discs.json").then(() => tick(0.2)).catch(() => tick(0.2));
    fetch("data/results.json").then(() => tick(0.15)).catch(() => tick(0.15));
    const hi = new Image(); hi.src = "assets/img/karina/k-stage-05.jpg";
    hi.decode().then(() => tick(0.15)).catch(() => tick(0.15));
    /* 字体挂起也会拖住 load 事件：DCL+0.7s 先收，load 后再补一次 */
    const t0 = performance.now();
    const cap = () => { if (performance.now() - t0 < 2000) setTimeout(done, 2000 - (performance.now() - t0)); else done(); };
    if (document.readyState !== "loading") { setTimeout(done, 500); cap(); }
    else { document.addEventListener("DOMContentLoaded", () => { setTimeout(done, 500); cap(); }); }
    window.addEventListener("load", () => setTimeout(done, 200));
  }

  /* ---------- nav scrolled ---------- */
  const nav = $(".nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- F02 fullscreen menu ---------- */
  const burger = $(".burger"), menu = $("#menu");
  if (burger && menu) {

    const imgs = $$(".menu-imgcol img", menu);
    const show = (i) => imgs.forEach((im, k) => im.classList.toggle("show", k === (i ?? 0)));
    const links = $$(".menu-links a", menu);
    links.forEach((a) => a.addEventListener("mouseenter", () => show(+a.dataset.mi || 0)));
    menu.addEventListener("focusin", (e) => {
      const a = e.target.closest(".menu-links a");
      if (a) show(+a.dataset.mi || 0);
    });
    menu.addEventListener("mouseleave", () => show(0));
    const setOpen = (open) => {
      menu.classList.toggle("open", open);
      burger.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      if (open) setTimeout(() => { const a0 = links[0]; if (a0) a0.focus(); }, 80);
      else burger.focus();
    };
    burger.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) setOpen(false);
    });
  }

  /* ---------- F04 smooth scroll toggle ---------- */

  /* ---------- F05 pinned horizontal strip（P1-5/6/7 + R-02 三连修 + N05 惯性甩动） ---------- */
  const pin = $(".hstrip-pin");
  const NARROWmq = matchMedia("(max-width:900px)");
  if (pin && !NARROWmq.matches) {
    const track = $(".hstrip-track", pin);
    const vp = $(".hstrip-viewport", pin);
    const btn = $("#swipe-lock");
    const bar = $(".hstrip-progress i");
    let max = 0, cruise = false, cdir = 1, cruiseTarget = 0, cur = 0;
    let drag = null, vel = 0, lastX = 0, lastT = 0;
    const measure = function () {
      max = Math.max(0, track.scrollWidth - vp.clientWidth);
      /* pin 高度 = 视口高 + 实际横滚距离 + 200px 缓冲（不留大片空黑） */
      pin.style.height = Math.max(800, window.innerHeight + max * 0.35) + "px";
      total = Math.max(1, pin.offsetHeight - window.innerHeight);
    };
    var total = 1;
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", function () { measure(); });
    const pinTop = () => pin.getBoundingClientRect().top + window.scrollY;   /* 文档坐标（R-02 修复） */
    const pOfOff = (off) => (max ? Math.min(1, Math.max(0, off / max)) : 0);
    const setOffset = (off) => { track.style.transform = `translateX(${-off.toFixed(1)}px)`; };
    const syncScroll = () => {   /* 反算并 instant 写回（R-02 修复 3） */
      window.scrollTo({ top: pinTop() + pOfOff(cur) * (pin.offsetHeight - window.innerHeight), behavior: "instant" });
    };
    const update = () => {
      if (drag || cruise) return;
      var r = pin.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, -r.top / total));
      cur = p * max;
      setOffset(cur);
      if (bar) bar.style.left = (p * 80).toFixed(1) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    update();

    vp.addEventListener("pointerdown", (e) => {
      drag = { x0: e.clientX, start: cur };
      vel = 0; lastX = e.clientX; lastT = performance.now();
      cruise = false;
      if (btn) { btn.classList.remove("on"); btn.textContent = "TAP TO LOCK"; }
      vp.setPointerCapture(e.pointerId);
    });
    vp.addEventListener("pointermove", (e) => {
      if (!drag) return;
      cur = Math.min(max, Math.max(0, drag.start - (e.clientX - drag.x0)));
      const t = performance.now(), dt = Math.max(8, t - lastT);
      vel = vel * 0.6 + ((lastX - e.clientX) / dt * 16) * 0.4;
      lastX = e.clientX; lastT = t;
      setOffset(cur);
      if (bar) bar.style.left = (pOfOff(cur) * 80).toFixed(1) + "%";
      var tgt = pinTop() + pOfOff(cur) * (pin.offsetHeight - window.innerHeight);
      if (Math.abs(window.scrollY - tgt) > 2) window.scrollTo({ top: tgt, behavior: "auto" });
    });
    /* up 与 cancel 分开：cancel 不回写滚动（R-02 修复 4） */
    vp.addEventListener("pointerup", (e) => {
      if (!drag) return;
      drag = null;
      vp.releasePointerCapture && vp.releasePointerCapture(e.pointerId);
      syncScroll();
    });
    vp.addEventListener("pointercancel", () => { drag = null; });

    if (btn) {
      btn.addEventListener("click", () => {
        cruise = !cruise;
        btn.classList.toggle("on", cruise);
        btn.textContent = cruise ? "BACK TO SCROLL" : "TAP TO LOCK";
        if (!cruise) syncScroll(); else cruiseTarget = cur;
      });
    }
    (function cruiseLoop() {
      if (cruise && !drag && !reduceOn()) {
        cruiseTarget += cdir * 2.2;
        if (cruiseTarget >= max) { cruiseTarget = max; cdir = -1; }
        if (cruiseTarget <= 0) { cruiseTarget = 0; cdir = 1; }
        cur += (cruiseTarget - cur) * 0.12;
        setOffset(cur);
        if (bar) bar.style.left = (pOfOff(cur) * 80).toFixed(1) + "%";
      }
      requestAnimationFrame(cruiseLoop);
    })();
  }

  /* ---------- scroll parallax ---------- */
  const plx = $$("[data-plx]");
  if (plx.length) {
    const onPlx = () => {
      const y = window.scrollY;
      if (y > window.innerHeight * 1.4) return;
      plx.forEach((el) => {
        el.style.translate = `0 ${(y * parseFloat(el.dataset.plx)).toFixed(1)}px`;
      });
    };
    window.addEventListener("scroll", onPlx, { passive: true });
    onPlx();
  }

  /* F04：Reduce motion 总闸（P1-11/30：JS 动效与 CSS 同关） */
  const motionBtn = $("#smooth-toggle");
  const applyMotion = (on) => {
    root.classList.toggle("reduce-motion", on);
    if (motionBtn) motionBtn.textContent = on ? "Reduce motion: ON" : "Reduce motion: OFF";
  };
  if (motionBtn) {
    applyMotion(localStorage.getItem("kr-reduce") === "on");
    motionBtn.addEventListener("click", () => {
      const on = !root.classList.contains("reduce-motion");
      localStorage.setItem("kr-reduce", on ? "on" : "off");
      applyMotion(on);
    });
  }


  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$(".rv").forEach((el) => io.observe(el));

  /* ---------- F10 count-up ---------- */
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = parseInt(el.dataset.count, 10);
    if (Number.isNaN(target)) { el.textContent = "—"; return cio.unobserve(el); }
    if (reduceOn()) { el.textContent = target; return cio.unobserve(el); }
    const t0 = performance.now(), dur = 1400;
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    cio.unobserve(el);
  }), { threshold: 0.4 });
  $$("[data-count]").forEach((el) => cio.observe(el));

  /* ---------- F11 era tabs ---------- */
  $$(".era-tabs").forEach((list) => {
    list.setAttribute("role", "tablist");
    const tabs = $$(".era-tab", list);
    const activate = (t) => {
      tabs.forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); x.setAttribute("tabindex", "-1"); });
      $$(".era-panel.is-active").forEach((p2) => p2.classList.remove("is-active"));
      t.classList.add("is-active"); t.setAttribute("aria-selected", "true"); t.setAttribute("tabindex", "0");
      const p = $(`.era-panel[data-era="${t.dataset.era}"]`);
      if (p) p.classList.add("is-active");
    };
    tabs.forEach((t) => {
      t.setAttribute("role", "tab");
      t.setAttribute("aria-selected", String(t.classList.contains("is-active")));
      t.setAttribute("tabindex", t.classList.contains("is-active") ? "0" : "-1");
      t.addEventListener("click", () => activate(t));
      const panel = $(`.era-panel[data-era="${t.dataset.era}"]`);
      if (panel) { panel.setAttribute("role", "tabpanel"); panel.setAttribute("aria-labelledby", t.id || ""); }
    });
    list.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + tabs.length) % tabs.length;
      if (j !== null) { activate(tabs[j]); tabs[j].focus(); e.preventDefault(); }
    });
  });

  /* ---------- F09b era setlist 卡（on-stage 专属，区别于首页碟墙） ---------- */
  const SETLISTS = [
    { era: "2020", year: "'20", name: "BLACK MAMBA", bar: "#C8102E",
      songs: ["Black Mamba"], stage: "出道舞台 · KBS2 音乐银行", result: "出道后首个音乐节目一位" },
    { era: "2021", year: "'21", name: "NEXT LEVEL → SAVAGE", bar: "#D22730",
      songs: ["Forever", "Next Level", "Savage"], stage: "三连回归 · 首张迷你专辑", result: "Savage 累计 8 个一位" },
    { era: "2022", year: "'22", name: "GIRLS", bar: "#D4AF37",
      songs: ["Girls", "Life's Too Short", "Illusion"], stage: "Coachella 主舞台 · 美国首演", result: "首个登上主舞台的 K-pop 女团" },
    { era: "2023", year: "'23", name: "MY WORLD → DRAMA", bar: "#FF4060",
      songs: ["Spicy", "Thirsty", "Drama"], stage: "两连回归 · MY WORLD 预售 168 万", result: "Spicy 4 个一位 · DRAMA 定位曲" },
    { era: "2024", year: "'24", name: "SUPERNOVA → WHIPLASH", bar: "#2E55FF",
      songs: ["Supernova", "Armageddon", "Whiplash", "Up"], stage: "PARALLEL LINE · Tokyo Dome", result: "全年 20 个一位 · 年度最强女团" },
    { era: "2025", year: "'25", name: "DIRTY WORK → RICH MAN", bar: "#8FA6FF",
      songs: ["Dirty Work", "Rich Man", "Good Stuff"], stage: "aeXIS LINE · KSPO DOME 三连开", result: "Rich Man 10 个一位" },
  ];
  function renderSetlists() {
    const host = $("[data-setlists]");
    if (!host) return;
    host.innerHTML = SETLISTS.map((e) => `
      <article class="set-card" style="--bar:${e.bar}">
        <div class="sc-head"><span class="sc-year">${e.era}</span><span class="sc-name">${e.name}</span></div>
        <ul class="sc-songs">${e.songs.map((x) => `<li>${x}</li>`).join("")}</ul>
        <div class="sc-stage"><span class="k">KEY STAGE</span>${e.stage}</div>
        <div class="sc-result"><span class="k">RESULT</span>${e.result}</div>
      </article>`).join("");
  }
  renderSetlists();

  /* ---------- F09 era disc wall ---------- */
  let DISCS = [];
  async function loadDiscs() {
    try { DISCS = await (await fetch("data/discs.json")).json(); }
    catch (e) { DISCS = await (await fetch("../data/discs.json")).json(); }
  }
  function discById(id) { return DISCS.find((d) => d.id === id) || DISCS[0]; }

  async function renderDiscs() {
    if (!DISCS.length) return;
    const host = $("[data-discs]");
    if (host) {
      host.innerHTML = DISCS.map((d) => `
        <div class="disc-card" title="${d.name} ${d.year}">
          <div class="flip">
            <div class="face face-front">
              <img src="${d.photo}" alt="${d.name} 时代照片" loading="lazy">
              <div class="ff-veil"></div>
              <div class="ff-meta"><span class="ff-nm">${d.name}</span><span class="ff-yr">${d.year}</span></div>
              <span class="ff-hint">FLIP ⟶</span>
            </div>
            <div class="face face-back">
              <div class="fb-top"><div class="pl-cover">${sleeveSVG(d)}</div><div class="pl-disc">${discSVG(d)}</div></div>
              <div class="fb-honor">
                <span class="fh-k">CERTIFIED · ${d.date || d.year}</span>
                <span class="fh-t">${d.award || ""}</span>
              </div>
              <div class="pl-plate">
                <span class="pl-nm">${d.name}</span>
                <span class="pl-aw">CERT-№${d.no} · KR11 FAN ARCHIVE</span>
              </div>
            </div>
          </div>
          <span class="disc-no">№ ${d.no}</span>
          <div class="disc-meta"><div class="nm">${d.name}</div><div class="yr">${d.year} · ${d.tagline}</div></div>
        </div>`).join("");
      /* 翻面点击：仅触屏/无 hover 设备（P1-8 桌面走 hover） */
      if (matchMedia("(hover: none), (pointer: coarse)").matches) {
        host.addEventListener("click", (e) => {
          const c = e.target.closest(".disc-card");
          if (c) c.classList.toggle("flipped");
        });
      }
    }
    /* data-disc 占位填充（独立于碟墙是否存在）（hero / era panels / collection），与碟墙有无无关 */
    $$("[data-disc]").forEach((el) => {
      const d = discById(el.dataset.disc);
      el.innerHTML = discSVG(d, { cls: el.dataset.cls || "", sparkles: el.dataset.sparkle === "1", spin: el.dataset.spin === "1" });
    });
  }

  /* ---------- F14 spinning disc ---------- */
  function initDisc360() {
    const box = $(".disc360");
    if (!box || !DISCS.length) return;
    const d = discById(box.dataset.disc || "supernova");
    if (!box.querySelector("svg")) box.insertAdjacentHTML("afterbegin", discSVG(d));
    /* 点击碟 → 悬停显示时代认证 tooltip */
    var infoPanel = document.createElement("div");
    infoPanel.className = "disc-info";
    infoPanel.innerHTML = '<span class="di-k">CERTIFIED</span><span class="di-t">' + d.name + '</span><span class="di-d">' + (d.date || d.year) + ' · ' + (d.award || "") + '</span>';
    infoPanel.style.cssText = "position:absolute;top:-8px;left:50%;transform:translateX(-50%) translateY(6px);background:rgba(10,10,14,.92);border:1px solid rgba(201,207,218,.2);padding:10px 16px;font-family:var(--f-mono);font-size:10px;letter-spacing:.14em;color:var(--metal);white-space:nowrap;opacity:0;transition:.3s;pointer-events:none;z-index:5";
    box.style.position = "relative";
    box.appendChild(infoPanel);
    box.addEventListener("mouseenter", function() { infoPanel.style.opacity = "1"; infoPanel.style.transform = "translateX(-50%) translateY(0)"; });
    box.addEventListener("mouseleave", function() { infoPanel.style.opacity = "0"; infoPanel.style.transform = "translateX(-50%) translateY(6px)"; });
    const rot = box.querySelector("svg g:first-of-type");
    let ang = 0, vel = 0.55, down = false, lastA = 0, lastT = 0, idleTimer = 0;
    const getA = (e) => {
      const r = box.getBoundingClientRect();
      return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
    };
    box.addEventListener("pointerdown", (e) => {
      down = true; vel = 0; lastA = getA(e); lastT = performance.now();
      box.setPointerCapture(e.pointerId); box.classList.add("grabbing");
    });
    box.addEventListener("pointermove", (e) => {
      if (!down) return;
      const a = getA(e), t = performance.now();
      let da = a - lastA; if (da > 180) da -= 360; if (da < -180) da += 360;
      ang += da;
      const dt = Math.max(16, t - lastT);
      vel = vel * 0.5 + (da / dt * 16) * 0.5;
      lastA = a; lastT = t;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => box.addEventListener(ev, () => {
      down = false; box.classList.remove("grabbing");
      clearTimeout(idleTimer);
    }));
    (function loop() {
      if (!down) {
        ang += vel;
        vel *= 0.975;
        if (Math.abs(vel) < 0.55) vel += (0.55 - vel) * 0.02; /* 缓慢回到常速 */
      }
      if (rot) rot.setAttribute("transform", `rotate(${(ang % 360).toFixed(2)} 300 300)`);
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- F12 schedule rows ---------- */
  async function renderSchedule() {
    const up = $("[data-sched-up]"), ar = $("[data-sched-arch]");
    if (!up && !ar) return;
    try {
      const base = $("base") ? "../" : "";
      const data = await (await fetch(base + "data/schedule.json")).json();
      const row = (r, tba) => `
        <div class="srow${tba ? " tba" : ""}">
          <div class="sd">${r.date}<small>${r.sub}</small></div>
          <img class="flag" src="${base}assets/svg/flags/${r.flag}.svg" alt="${({kr:"韩国",jp:"日本",us:"美国",gb:"英国",id:"印尼",th:"泰国",my:"马来西亚",sg:"新加坡",ph:"菲律宾",au:"澳大利亚",mx:"墨西哥",br:"巴西",ae:"阿联酋",cn:"中国"})[r.flag] || r.flag}">
          <div class="se">${r.event}<small>${r.extra}</small></div>
          <div class="sv">${r.venue}</div>
        </div>`;
      if (up) up.innerHTML = data.upcoming.map((r) => row(r, true)).join("");
      if (ar) ar.innerHTML = data.archive.map((r) => row(r, false)).join("");
    } catch (e) { console.warn("schedule data failed", e); }
  }

  /* ---------- F13 results wall ---------- */
  async function renderResults() {
    const host = $("[data-results]");
    if (!host) return;
    try {
      const base = $("base") ? "../" : "";
      const data = await (await fetch(base + "data/results.json")).json();
      host.innerHTML = data.eras.map((era) => `
        <section class="rw-year"><span class="y">${era.year}</span><span class="c">era archive · ${era.cards.length} STAGES</span></section>
        <div class="rw-grid">
          ${era.cards.map((c) => `
            <article class="rcard">
              <div class="rc-img">
                <img src="${c.img}" alt="${c.title}" loading="lazy">
                <img class="rc-hover" src="${c.img2 || c.img}" alt="" loading="lazy">
                <img class="rc-flag" src="${base}assets/svg/flags/${c.flag}.svg" alt="">
              </div>
              <div class="rc-body">
                <div class="rc-t">${c.title}</div>
                <div class="rc-v">${c.venueSvg ? `<img class="vmark" src="${base}assets/svg/venues/${c.venueSvg}.svg" alt="">` : ""}<span>${c.city} · ${c.date}</span></div>
                ${c.note ? `<div class="rc-note">${c.note}</div>` : ""}
              </div>
            </article>`).join("")}
        </div>`).join("");
    } catch (e) { console.warn("results data failed", e); }
  }

  /* ---------- F16 signup ---------- */
  $$(".f-signup form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = f.parentElement.querySelector(".su-note");
    if (note) note.textContent = "※ 粉丝项目静态演示：未接入后端，邮箱未被发送或存储。";
  }));

  /* A04: 名字逐字进场（轻量 SplitText） */
  $$("[data-chars]").forEach((el) => {
    const txt = el.textContent;
    el.textContent = "";
    [...txt].forEach((ch, i) => {
      const sp = document.createElement("span");
      sp.className = "ch" + (i >= 3 ? " sp" : "");
      sp.textContent = ch;
      sp.style.animationDelay = (0.12 + i * 0.055).toFixed(3) + "s";
      el.appendChild(sp);
    });
  });

  loadDiscs().then(() => {
    window.KR11 = { discSVG, sleeveSVG, discById }; /* 钩子先于一切渲染暴露 */
    renderDiscs();
    initDisc360();
    $$("[data-sleeve]").forEach((el) => { el.innerHTML = sleeveSVG(discById(el.dataset.sleeve)); });
  });

  /* ---------- F06 跑马灯 / 品牌墙：内容渲染两份 ---------- */
  /* 跑马灯/品牌墙：内容复制一份（bw-half 包裹保证 -50% 无缝，P2-17） */
  $$("[data-mq]").forEach((t) => { t.innerHTML += t.innerHTML; });
  $$("[data-dup]").forEach((t) => {
    const half = t.firstElementChild;
    if (half) { t.appendChild(half.cloneNode(true)); }
    else t.innerHTML += t.innerHTML;
  });

  /* ---------- hero 滚动叙事：人物后退变暗 + 手绘签名显现 ---------- */
  const heroPhoto = $("#heroAe");
  const heroSig = $("#heroSig");
  if (heroPhoto && heroSig) {
    const heroFx = () => {
      const p = Math.min(1, window.scrollY / window.innerHeight);
      if (p >= 1) { /* 只影响首屏内 */ }
      const fade = Math.min(1, p * 1.15);
      heroPhoto.style.opacity = (1 - fade * 0.68).toFixed(3);
      var narrow = matchMedia('(max-width:900px)').matches;
      heroPhoto.style.transform = narrow ? '' : `translateX(-50%) scale(${(1 - fade * 0.055).toFixed(3)})`;
      heroPhoto.style.filter = `brightness(${(1 - fade * 0.45).toFixed(3)})`;
      const so = Math.max(0, Math.min(1, (p - 0.22) / 0.4));
      heroSig.style.opacity = so.toFixed(3);
      heroSig.style.transform = `translateX(-50%) translateY(${((1 - so) * 34).toFixed(1)}px) rotate(${(-6 + so * 4).toFixed(1)}deg)`;
    };
    window.addEventListener("scroll", heroFx, { passive: true });
    heroFx();
  }

  /* ---------- 全局滚动进度条 ---------- */
  const prog = document.createElement("div");
  prog.id = "scroll-indicator";
  document.body.appendChild(prog);
  const setProg = () => {
    const h = document.body.scrollHeight - window.innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? (window.scrollY / h).toFixed(4) : 0})`;
  };
  window.addEventListener("scroll", setProg, { passive: true });
  setProg();

  /* ---------- F10 出道年数自动计算 ---------- */
  $$("[data-years-since]").forEach((el) => {
    const [y, m2, d] = (el.dataset.yearsSince + "-01-01").split("-").map(Number);
    const then = new Date(y, (m2 || 1) - 1, d || 1);
    const now = new Date();
    let yrs = now.getFullYear() - then.getFullYear();
    const before = now.getMonth() < then.getMonth() ||
      (now.getMonth() === then.getMonth() && now.getDate() < then.getDate());
    if (before) yrs -= 1;
    el.dataset.count = Math.max(0, yrs);
    cio.observe(el);
  });
  renderSchedule(); renderResults();

  /* ---------- C-04: skip-link 统一注入 ---------- */
  if (!document.querySelector(".skip-link")) {
    const sk = document.createElement("a");
    sk.className = "skip-link";
    sk.href = "#hc-rail";
    sk.textContent = "跳到主要内容";
    document.body.prepend(sk);
    const rail = $("#hc-rail");
    if (rail) { rail.id = "hc-rail"; rail.setAttribute("tabindex", "-1"); }
  }

  /* ---------- S12/A10: 页面转场 veil ---------- */
  /* veil 只用于页面间跳转：首次加载不创建，仅在 pageswap 后的页面创建 */
  if (sessionStorage.getItem("kr-veil") === "1") {
    var veil = document.createElement("div");
    veil.id = "veil";
    document.body.appendChild(veil);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.documentElement.classList.add("veil-off");
      sessionStorage.removeItem("kr-veil");
    }));
  }
  window.addEventListener("pageswap", () => {
    document.documentElement.classList.remove("veil-off");
    sessionStorage.setItem("kr-veil", "1");
  });

  const path = location.pathname.split("/").pop() || "index.html";
  $$(".menu-links a").forEach((a) => {
    if ((a.getAttribute("href") || "") === path) a.classList.add("active");
  });
})();
