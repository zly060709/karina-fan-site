/* sleeve.js — 概念唱片封套工厂（与碟面同用一套时代纹样基因） */
window.sleeveSVG = function (d) {
  function seeded(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; };
  }
  const rnd = seeded("sl-" + (d.id || "kr"));
  const id = "sl-" + (d.id || "x") + "-" + Math.floor(rnd() * 1e6);
  const bg = d.labelBg || "#101014", ink = d.labelInk || "#F2F4F8", ac = d.accent || "#8FA6FF";
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" class="sleeve-svg" role="img" aria-label="' + d.name + ' 概念封面">';
  s += '<defs>'
    + '<radialGradient id="slchr-' + id + '" cx="0.32" cy="0.26" r="1.1">'
    + '<stop offset="0" stop-color="#98A1B4"/><stop offset="0.3" stop-color="#4A5162"/><stop offset="0.68" stop-color="#1B1D25"/><stop offset="1" stop-color="#383E4B"/></radialGradient>'
    + '<linearGradient id="slglow-' + id + '" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="' + ac + '" stop-opacity=".3"/><stop offset="1" stop-color="' + ac + '" stop-opacity="0"/></linearGradient>'
    + '<clipPath id="slclip-' + id + '"><rect width="600" height="600"/></clipPath></defs>';
  s += '<g clip-path="url(#slclip-' + id + ')">';
  s += '<rect width="600" height="600" fill="' + (d.treat === "chrome" ? "url(#slchr-" + id + ")" : bg) + '"/>';
  if (d.treat === "splatter") {
    const cols = d.colors || ["#2E55FF"];
    for (let i = 0; i < 46; i++) {
      const x = rnd() * 600, y = rnd() * 600, sz = 4 + rnd() * rnd() * 30;
      const col = cols[Math.floor(rnd() * cols.length)];
      s += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + sz.toFixed(1) + '" fill="' + col + '" opacity="' + (0.32 + rnd() * 0.4).toFixed(2) + '"/>';
    }
  } else if (d.treat === "scales") {
    for (let ry = 0; ry < 22; ry++) for (let cx = 0; cx < 24; cx++) {
      const x = cx * 27 + (ry % 2 ? 13 : 0), y = ry * 24 - 10;
      s += '<path d="M ' + x + ' ' + y + ' a 13.5 13.5 0 0 0 27 0" fill="none" stroke="' + (rnd() > 0.93 ? "#C8102E" : "#22232B") + '" stroke-opacity="' + (rnd() > 0.93 ? 0.85 : 0.6) + '" stroke-width="2.6"/>';
    }
  } else if (d.treat === "etched") {
    s += '<g transform="rotate(26 300 300)">';
    for (let i = -18; i <= 18; i++)
      s += '<line x1="' + (300 + i * 22) + '" y1="-40" x2="' + (300 + i * 22) + '" y2="640" stroke="#D7DCE6" stroke-opacity="' + (i % 3 ? 0.16 : 0.3) + '" stroke-width="' + (i % 3 ? 1.6 : 3) + '"/>';
    s += '</g>';
  } else if (d.treat === "chrome") {
    for (let i = 0; i < 14; i++) {
      const x = rnd() * 600, y = rnd() * 600;
      s += '<ellipse cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="' + (30 + rnd() * 70).toFixed(0) + '" ry="' + (5 + rnd() * 9).toFixed(1) + '" transform="rotate(' + (rnd() * 180).toFixed(0) + ' ' + x.toFixed(0) + ' ' + y.toFixed(0) + ')" fill="#07070B" opacity="' + (0.5 + rnd() * 0.35).toFixed(2) + '"/>';
    }
    s += '<ellipse cx="170" cy="150" rx="130" ry="80" transform="rotate(-28 170 150)" fill="#FFFFFF" opacity="0.16"/>';
  } else if (d.treat === "stars") {
    const cols = d.colors || ["#4E79FF", "#C9CFDA"];
    for (let i = 0; i < 60; i++) {
      const x = rnd() * 600, y = rnd() * 600, sz = 3 + rnd() * 11;
      const col = cols[Math.floor(rnd() * cols.length)];
      s += '<path d="M ' + x.toFixed(0) + ' ' + (y - sz).toFixed(1) + ' Q ' + (x + sz * 0.16).toFixed(1) + ' ' + (y - sz * 0.16).toFixed(1) + ' ' + (x + sz).toFixed(0) + ' ' + y.toFixed(1) + ' Q ' + (x + sz * 0.16).toFixed(1) + ' ' + (y + sz * 0.16).toFixed(1) + ' ' + x.toFixed(0) + ' ' + (y + sz).toFixed(1) + ' Q ' + (x - sz * 0.16).toFixed(1) + ' ' + (y + sz * 0.16).toFixed(1) + ' ' + (x - sz).toFixed(0) + ' ' + y.toFixed(1) + ' Q ' + (x - sz * 0.16).toFixed(1) + ' ' + (y - sz * 0.16).toFixed(1) + ' ' + x.toFixed(0) + ' ' + (y - sz).toFixed(1) + ' Z" fill="' + col + '" opacity="' + (0.4 + rnd() * 0.55).toFixed(2) + '"/>';
    }
  }
  s += '<rect width="600" height="600" fill="url(#slglow-' + id + ')"/>';
  const parts = (d.name || "").split(" ");
  const l1 = parts[0] || d.name, l2 = parts.slice(1).join(" ");
  s += '<text x="46" y="66" font-family="IBM Plex Mono,monospace" font-size="13" letter-spacing="4" fill="' + ink + '" opacity=".78">aespa · KARINA</text>';
  s += '<text x="40" y="212" font-family="Archivo,\'Arial Black\',sans-serif" font-weight="700" font-size="' + (l1.length > 8 ? 72 : 94) + '" letter-spacing="-3" fill="' + ink + '">' + l1 + '</text>';
  if (l2) s += '<text x="40" y="300" font-family="Archivo,\'Arial Black\',sans-serif" font-weight="700" font-size="94" letter-spacing="-3" fill="none" stroke="' + ink + '" stroke-width="1.5">' + l2 + '</text>';
  s += '<rect x="44" y="330" width="128" height="9" fill="' + ac + '"/>';
  s += '<text x="46" y="546" font-family="IBM Plex Mono,monospace" font-size="12" letter-spacing="3" fill="' + ink + '" opacity=".7">LP · 33⅓ · ' + (d.year || "") + ' · KR11</text>';
  s += '<text x="554" y="558" text-anchor="end" font-family="Archivo,\'Arial Black\',sans-serif" font-weight="700" font-size="62" fill="' + ac + '">11</text>';
  s += '<rect x="0.5" y="0.5" width="599" height="599" fill="none" stroke="rgba(255,255,255,.22)"/>';
  s += '<line x1="30" y1="0" x2="30" y2="600" stroke="rgba(255,255,255,.16)"/>';
  s += '<text x="18" y="392" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="2.5" fill="' + ink + '" opacity=".55" transform="rotate(-90 18 392)">SIDE A · ' + (d.name || "") + '</text>';
  s += '</g></svg>';
  return s;
};
