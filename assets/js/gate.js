/* ============================================================
   KR11 gate.js —— 全站访问密码门
   只存 SHA-256 哈希，不存明文；验证通过记入 localStorage。
   纯 JS sha256（兼容 file:// 等非安全上下文，crypto.subtle 不可用时也能跑）。
   ============================================================ */
(function () {
  "use strict";
  /* SHA-256("jld03150110") —— 明文不出现在本文件 */
  var HASH = "e4aa028542cde595eaa7887d77559829d8deee5a59ebaa81df0a84fb5229d82e";
  var KEY = "kr-gate-ok";
  var root = document.documentElement;

  function sha256(ascii) {
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    var maxWord = Math.pow(2, 32), result = "";
    var words = [], asciiBitLength = ascii.length * 8;
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [], primeCounter = k.length;
    var isComposite = {}, i, j, candidate;
    for (candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += "\x80";
    while (ascii.length % 64 - 56) ascii += "\x00";
    for (i = 0; i < ascii.length; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return "";
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16), oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var a = hash[0], e = hash[4];
        var t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25))
          + ((e & hash[5]) ^ (~e & hash[6])) + k[i]
          + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(t1 + t2) | 0].concat(hash);
        hash[4] = (hash[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? "0" : "") + b.toString(16);
      }
    }
    return result;
  }

  var unlocked = false;
  try { unlocked = localStorage.getItem(KEY) === HASH; } catch (e) {}
  if (unlocked) { root.classList.add("gate-ok"); return; }

  /* 上锁：CSS 会隐藏 body 全部直接子元素（#gate 除外） */
  root.classList.add("gate-locked");

  function build() {
    if (document.getElementById("gate")) return;
    var g = document.createElement("div");
    g.id = "gate";
    g.innerHTML =
      '<div class="gate-box">' +
        '<div class="gate-brand">KR<span class="dot">✦</span></div>' +
        '<div class="gate-k">PRIVATE ARCHIVE · 私人档案</div>' +
        '<h1 class="gate-title">输入访问密码</h1>' +
        '<div class="gate-row">' +
          '<input type="password" placeholder="ACCESS CODE" autocomplete="off" spellcheck="false" aria-label="访问密码">' +
          '<button type="button">进入 →</button>' +
        '</div>' +
        '<div class="gate-err" role="alert"></div>' +
        '<div class="gate-foot">KR11 FAN PROJECT · UNOFFICIAL</div>' +
      '</div>';
    document.body.appendChild(g);
    var input = g.querySelector("input");
    var err = g.querySelector(".gate-err");
    setTimeout(function () { try { input.focus(); } catch (e) {} }, 300);
    function attempt() {
      var h = sha256(input.value);
      if (h && h === HASH) {
        try { localStorage.setItem(KEY, HASH); } catch (e) {}
        g.classList.add("off");
        root.classList.remove("gate-locked");
        root.classList.add("gate-ok");
        setTimeout(function () { if (g.parentNode) g.parentNode.removeChild(g); }, 700);
      } else {
        g.classList.remove("shake"); void g.offsetWidth; g.classList.add("shake");
        err.textContent = "密码不对 · 再试一次";
        input.select();
      }
    }
    g.querySelector("button").addEventListener("click", attempt);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") attempt(); });
    input.addEventListener("input", function () { err.textContent = ""; });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
