/* ============================================================
   KR11 hero-ae.js v2 —— 大面积液态显影（对标 LN 头盔交互量级）
   鼠标 = 200px 柔边探照灯，扫过处渐变到另一风格的柳智敏
   不动 = 效果 3 秒缓慢蒸发；点击 = 定格
   色差偏移 = 笔刷边缘 RGB 三通道微偏移，模拟镜头色散
   ============================================================ */
(function () {
  "use strict";
  const box = document.querySelector(".hero-photo");
  if (!box) return;

  var REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches ||
               document.documentElement.classList.contains("reduce-motion");

  var baseImg = new Image();
  var visorImg = new Image();
  var ready = 0;
  baseImg.onload = visorImg.onload = function () { if (++ready === 2) build(); };
  baseImg.src = "assets/img/karina/k-stage-05.jpg";
  visorImg.src = "assets/img/karina/k-hero-synk.jpg";

  function build() {
    var cvs = document.createElement("canvas");
    cvs.className = "ae-canvas";
    box.appendChild(cvs);
    var ctx = cvs.getContext("2d");
    var mask = document.createElement("canvas");
    var mctx = mask.getContext("2d");
    var layerB = document.createElement("canvas");
    var lctx = layerB.getContext("2d");

    var W = 0, H = 0;
    var DPR = Math.min(2, devicePixelRatio || 1);
    function size() {
      var r = box.getBoundingClientRect();
      W = Math.max(2, Math.round(r.width * DPR));
      H = Math.max(2, Math.round(r.height * DPR));
      cvs.width = mask.width = layerB.width = W;
      cvs.height = mask.height = layerB.height = H;
      cvs.style.width = r.width + "px";
      cvs.style.height = r.height + "px";
    }
    size();
    addEventListener("resize", size);

    function coverDraw(c, img, x, y, w, h) {
      var iw = img.naturalWidth || 500, ih = img.naturalHeight || 822;
      var sc = Math.max(w / iw, h / ih);
      var dw = iw * sc, dh = ih * sc;
      c.drawImage(img, x + (w - dw) / 2, y + (h - dh) * 0.06, dw, dh);
    }

    var locked = false;
    var mx = -1, my = -1;         /* 鼠标目标位置 */
    var bx = -1, by = -1;         /* 笔刷当前位置（lerp 追踪） */
    var hover = false;
    var inView = true, pageVisible = !document.hidden;

    new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { threshold: 0.02 }).observe(box);
    document.addEventListener("visibilitychange", function () { pageVisible = !document.hidden; });

    var hint = document.createElement("span");
    hint.className = "ae-hint";
    hint.textContent = "MOVE TO REVEAL · TAP TO LOCK";
    box.appendChild(hint);

    function setLock(v) {
      locked = v;
      hint.textContent = locked ? "LOCKED · TAP TO RELEASE" : "MOVE TO REVEAL · TAP TO LOCK";
      box.classList.toggle("locked", v);
    }
    box.addEventListener("click", function () { setLock(!locked); });

    box.addEventListener("pointermove", function (e) {
      var r = box.getBoundingClientRect();
      mx = (e.clientX - r.left) * DPR;
      my = (e.clientY - r.top) * DPR;
      hover = true;
    }, { passive: true });
    box.addEventListener("pointerleave", function () { hover = false; });

    /* 合成一帧 */
    function composite() {
      /* 笔刷追踪鼠标（lerp 0.08 = 柔性滞后） */
      if (mx >= 0) {
        if (bx < 0) { bx = mx; by = my; }
        bx += (mx - bx) * 0.08;
        by += (my - by) * 0.08;
      }

      /* 掩码衰减：不动时 3 秒蒸发 */
      if (!locked) {
        mctx.globalCompositeOperation = "destination-out";
        mctx.fillStyle = "rgba(0,0,0,0.018)";
        mctx.fillRect(0, 0, W, H);
      }

      /* 大面积柔边笔刷（半径 180px） */
      if (bx >= 0 && (hover || locked)) {
        var R = 180 * DPR;
        var g = mctx.createRadialGradient(bx, by, 0, bx, by, R);
        g.addColorStop(0, "rgba(255,255,255,0.6)");
        g.addColorStop(0.4, "rgba(255,255,255,0.42)");
        g.addColorStop(0.7, "rgba(255,255,255,0.18)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        mctx.globalCompositeOperation = "source-over";
        mctx.fillStyle = g;
        mctx.fillRect(bx - R, by - R, R * 2, R * 2);
      }

      /* 合成：底层 + 掩码下的面层（带色差偏移） */
      ctx.clearRect(0, 0, W, H);
      coverDraw(ctx, baseImg, 0, 0, W, H);

      lctx.globalCompositeOperation = "source-over";
      lctx.clearRect(0, 0, W, H);
      coverDraw(lctx, visorImg, 0, 0, W, H);
      lctx.globalCompositeOperation = "destination-in";
      lctx.drawImage(mask, 0, 0);

      /* 色差偏移：R/B 通道微移 */
      var caShift = 2 * DPR;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      /* 红通道偏左 */
      ctx.globalAlpha = 0.15;
      ctx.drawImage(layerB, -caShift, 0);
      /* 蓝通道偏右 */
      ctx.globalAlpha = 0.15;
      ctx.drawImage(layerB, caShift, 0);
      ctx.globalAlpha = 1;
      /* 正常合成 */
      ctx.drawImage(layerB, 0, 0);
      ctx.restore();

      /* 笔刷边缘微光 */
      if (bx >= 0 && (hover || locked)) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        var glow = ctx.createRadialGradient(bx, by, R * 0.6, bx, by, R * 1.1);
        glow.addColorStop(0, "rgba(100,140,255,0)");
        glow.addColorStop(0.7, "rgba(100,140,255,0.06)");
        glow.addColorStop(1, "rgba(100,140,255,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(bx - R * 1.2, by - R * 1.2, R * 2.4, R * 2.4);
        ctx.restore();
      }
    }

    /* REDUCE：只画一帧静态显影盘 */
    if (REDUCE) {
      size();
      mctx.fillStyle = "rgba(255,255,255,0.45)";
      mctx.beginPath();
      mctx.arc(W * 0.55, H * 0.35, 140 * DPR, 0, 6.283);
      mctx.fill();
      composite();
      return;
    }

    /* kick/stop 模式：离屏与切页时停排帧 */
    var raf = 0, running = false;
    function kick() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }
    new IntersectionObserver(function (es) {
      es[0].isIntersecting ? kick() : stop();
    }, { threshold: 0.02 }).observe(box);
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : kick();
    });

    function loop() {
      composite();
      raf = requestAnimationFrame(loop);
    }
    kick();
  }
})();
