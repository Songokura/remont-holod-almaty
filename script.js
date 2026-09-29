/* ============================================================
   Ремонт холодильников в Алматы - скрипт страницы.
   Плиты · марево (срезы кадра и заголовка) · кривая термостата в герое ·
   меню · бегущая строка · лента с кнопками · WhatsApp-ссылки · форма.
   Библиотек нет. Только русский язык.
   ============================================================ */
(function(){
"use strict";
var WA = "77773496904";
var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";
var root = document.documentElement;

/* ---------------- КОНВЕРСИИ GOOGLE ADS ----------------
   Ярлыки задаёт index.html (window.RH_CONV): phone, contact, lead. Пустой ярлык - не шлём. */
function conv(key){
  var id = (window.RH_CONV || {})[key];
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {send_to: id, value: 1.0, currency: "USD", transport_type: "beacon"});
}
document.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  if (h.indexOf("tel:") === 0) conv("phone");
  else if (h.indexOf("wa.me") > -1) conv("contact");
}, true);

/* ---------------- ССЫЛКИ WHATSAPP ----------------
   Готовый текст по ключу data-wa. Ставится один раз на загрузке, не в момент клика -
   трекер LeadBot дописывает код обращения в href при клике и ничего не затирает. */
var WA_TXT = {
  hero:   "Здравствуйте! Нужен ремонт холодильника в Алматы.\nЧто случилось: ",
  diag:   "Здравствуйте! Нужна диагностика холодильника.\nМарка и адрес: ",
  nem:    "Здравствуйте! Холодильник не морозит.\nМарка и адрес: ",
  komp:   "Здравствуйте! Нужна замена компрессора холодильника.\nМарка и адрес: ",
  freon:  "Здравствуйте! Похоже, утечка фреона, нужна заправка.\nМарка и адрес: ",
  el:     "Здравствуйте! Нужен ремонт платы или модуля управления холодильника.\nМарка и адрес: ",
  techet: "Здравствуйте! Холодильник течёт.\nМарка и адрес: ",
  shumit: "Здравствуйте! Холодильник шумит или гудит.\nМарка и адрес: ",
  led:    "Здравствуйте! В холодильнике намерзает лёд и снег.\nМарка и адрес: ",
  nevkl:  "Здравствуйте! Холодильник не включается.\nМарка и адрес: ",
  neotkl: "Здравствуйте! Холодильник не отключается, работает без остановки.\nМарка и адрес: ",
  nofrost:"Здравствуйте! Не работает No Frost.\nМарка и адрес: ",
  kont:   "Здравствуйте! Пишу с сайта. Нужен мастер по холодильникам.\nЧто случилось: "
};
document.querySelectorAll("[data-wa]").forEach(function(a){
  var t = WA_TXT[a.dataset.wa] || WA_TXT.hero;
  a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
  a.target = "_blank"; a.rel = "noopener";
});

/* ---------------- БЕГУЩАЯ СТРОКА ---------------- */
var TICK = ["Не морозит","Течёт вода","Шумит и гудит","Намерзает лёд","Не включается","Не отключается","No Frost","Замена компрессора","Заправка фреоном","Ремонт платы","Side-by-side","Морозильные камеры"];
function fillTicker(){
  var el = document.getElementById("ticker"); if (!el) return;
  var one = TICK.map(function(t){ return "<b>" + t + "</b>"; }).join("");
  el.innerHTML = one;
  var w = el.scrollWidth || 1000;
  var need = Math.max(2, Math.ceil((innerWidth * 2) / w) + 1);
  var html = "";
  for (var i = 0; i < need; i++) html += one;
  el.innerHTML = html;
  el.style.setProperty("--tkw", w + "px");
  el.style.setProperty("--tkd", Math.max(14, w / 48) + "s");
}

/* ---------------- МЕНЮ ---------------- */
var burger = document.getElementById("burger");
var mnav = document.getElementById("mnav");
function closeMenu(){
  document.body.classList.remove("menu-open");
  if (burger) burger.setAttribute("aria-expanded", "false");
}
if (burger) burger.addEventListener("click", function(){
  var open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});
if (mnav) mnav.addEventListener("click", function(e){ if (e.target.closest("a")) closeMenu(); });
addEventListener("keydown", function(e){ if (e.key === "Escape") closeMenu(); });

/* ---------------- ЯКОРЯ ---------------- */
var HH = function(){ return parseFloat(getComputedStyle(root).getPropertyValue("--hh")) || 64; };
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a) return;
  var id = a.getAttribute("href").slice(1); if (!id) return;
  var t = document.getElementById(id); if (!t) return;
  e.preventDefault();
  closeMenu();
  var top = t.getBoundingClientRect().top + scrollY - (t.classList.contains("pw") ? 0 : HH() + 12);
  scrollTo({ top: Math.max(0, top), behavior: RED ? "auto" : "smooth" });
  try { history.pushState(null, "", "#" + id); } catch(err){}
});

/* ---------------- ШАПКА ---------------- */
var hdr = document.getElementById("hdr");
function hdrState(){ if (hdr) hdr.classList.toggle("solid", scrollY > 40); }

/* ---------------- МАРЕВО: срезы кадра ----------------
   В каждый .ph и в фон героя кладём 12 пустых срезов; фон им задаётся через --src,
   когда плита подходит к экрану (иначе картинки грузились бы все сразу). */
function addStrips(box, n){
  var frag = document.createDocumentFragment();
  for (var i = 0; i < n; i++) frag.appendChild(document.createElement("i")).className = "st";
  box.appendChild(frag);
}
var phs = [].slice.call(document.querySelectorAll(".ph"));
var hbg = document.getElementById("hbg");
if (!RED) {
  phs.forEach(function(ph){ addStrips(ph, 12); });
  if (hbg) addStrips(hbg, 12);
  /* заголовок героя: пять копий-срезов */
  var kin = document.getElementById("kin");
  if (kin) {
    var txt = kin.querySelector(".kb").textContent;
    for (var k = 0; k < 5; k++) {
      var c = document.createElement("span");
      c.className = "kc"; c.setAttribute("aria-hidden", "true"); c.textContent = txt;
      kin.appendChild(c);
    }
  }
}
function heroSrc(){
  if (!hbg || hbg.dataset.ready) return;
  var img = hbg.querySelector("img");
  var src = img && img.currentSrc;
  if (!src) return;
  hbg.style.setProperty("--src", 'url("' + src + '")');
  hbg.dataset.ready = "1";
}
function phSrc(ph){
  if (ph.dataset.ready) return;
  ph.style.setProperty("--src", 'url("' + ph.dataset.src + '")');
  ph.dataset.ready = "1";
}

/* ---------------- КРИВАЯ ТЕРМОСТАТА ----------------
   k = 0: сбой, температура плавает и растёт (янтарный); k = 1: норма, ровный цикл
   термостата внутри полосы допуска (ледяной синий). Путь строится в JS, всё остальное - CSS. */
var curve = document.getElementById("curve");
var cpath = document.getElementById("cpath");
var ctag = document.getElementById("ctag");
var lastK = -1;
var N = 96;
function saw(x){ var p = x - Math.floor(x); return p < .8 ? -1 + 2 * (p / .8) : 1 - 2 * ((p - .8) / .2); }
function drawCurve(k){
  if (!cpath) return;
  if (Math.abs(k - lastK) < .003 && lastK >= 0) return;
  lastK = k;
  var d = "";
  for (var i = 0; i <= N; i++) {
    var x = i / N;
    var calm = 50 - 9 * saw(x * 5.5 + .3);
    var noise = 24 * Math.sin(x * 23.7 + 1.3) + 15 * Math.sin(x * 41.1 + .4) + 9 * Math.sin(x * 67 + 2) - 46 * x + 14;
    var y = calm + (1 - k) * noise;
    if (y < 4) y = 4; if (y > 96) y = 96;
    d += (i ? "L" : "M") + (x * 1000).toFixed(1) + "," + y.toFixed(2);
  }
  cpath.setAttribute("d", d);
  var calmNow = k > .82;
  if (curve) {
    curve.classList.toggle("calm", calmNow);
    curve.style.setProperty("--k", Math.max(0, (k - .5) * 2).toFixed(2));
  }
  if (ctag) ctag.textContent = calmNow ? "Норма: стабильно" : "Сбой: греется";
}

/* ---------------- ПЛИТЫ ----------------
   Один слушатель scroll через rAF. На каждую обёртку .pw пишем
   --enter / --exit / --stay и --open (марево застывает), герою ещё --f (интро). */
var pws = [].slice.call(document.querySelectorAll(".pw"));
var heroPw = document.getElementById("top");
var hero = document.getElementById("hero");
var bar = document.getElementById("bar");
var kont = document.getElementById("kontakty");
var introK = 1, introDone = true;
function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
function easeOut(t){ return 1 - Math.pow(1 - t, 2.6); }
function update(){
  var H = innerHeight || root.clientHeight;
  pws.forEach(function(pw){
    var r = pw.getBoundingClientRect();
    var enter = clamp(1 - r.top / H);
    var exit  = clamp(1 - r.bottom / H);
    var stay  = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : enter;
    var open  = easeOut(clamp((enter - .22) / .62));
    pw.style.setProperty("--enter", enter.toFixed(3));
    pw.style.setProperty("--exit",  exit.toFixed(3));
    pw.style.setProperty("--stay",  stay.toFixed(3));
    pw.style.setProperty("--open",  open.toFixed(3));
    pw.classList.toggle("gone", exit >= 1);
    pw.classList.toggle("on", enter > .6);
    if (pw === heroPw) {
      pw.style.setProperty("--f", introK.toFixed(3));
      pw.classList.toggle("still", introK >= .999);
      if (exit < 1) drawCurve(clamp(introK * (.86 + .14 * easeOut(stay))));
    } else {
      pw.classList.toggle("still", open >= .999 || enter <= 0);
      if (r.top < H * 2.2) { var ph = pw.querySelector(".ph"); if (ph) phSrc(ph); }
    }
  });
  hdrState();
  /* липкая панель: после 55 % первого экрана, прячется на контактах */
  if (bar) {
    var onKont = kont && kont.getBoundingClientRect().top < H * .6;
    bar.classList.toggle("show", scrollY > H * .55 && !onKont);
  }
}
if (RED) {
  root.classList.add("no-plate");
  root.classList.add("no-intro");
  if (heroPw) { heroPw.classList.add("on"); heroPw.classList.add("still"); }
  pws.forEach(function(pw){ pw.classList.add("on"); pw.classList.add("still"); var ph = pw.querySelector(".ph"); if (ph) phSrc(ph); });
  drawCurve(1);
  addEventListener("scroll", function(){ hdrState(); if (bar) bar.classList.toggle("show", scrollY > innerHeight * .55); }, {passive:true});
  hdrState();
} else {
  var tick = false;
  addEventListener("scroll", function(){
    if (tick) return; tick = true;
    requestAnimationFrame(function(){ tick = false; update(); });
  }, {passive:true});
  addEventListener("resize", update);
  addEventListener("load", function(){ heroSrc(); update(); });
  var himg = hbg && hbg.querySelector("img");
  if (himg) { if (himg.complete) heroSrc(); else himg.addEventListener("load", heroSrc); }
  /* интро 1250 мс: кадр и заголовок застывают из марева, кривая термостата прочерчивается.
     Пропускаем при хэше / прокрутке - человек из рекламы сразу видит собранный экран. */
  var skip = location.hash || scrollY > 80;
  if (skip) {
    root.classList.add("no-intro");
    if (heroPw) heroPw.classList.add("on");
    update();
  } else {
    introK = 0; introDone = false; update();
    if (cpath) { cpath.style.strokeDasharray = "1"; cpath.style.strokeDashoffset = "1"; }
    var t0 = null;
    var step = function(ts){
      if (introDone) return;
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / 1250);
      introK = easeOut(p);
      if (cpath) cpath.style.strokeDashoffset = String(1 - clamp(p * 1.15));
      update();
      if (p < 1) requestAnimationFrame(step);
      else { introDone = true; if (cpath) { cpath.style.strokeDasharray = ""; cpath.style.strokeDashoffset = ""; } }
    };
    requestAnimationFrame(function(){ if (heroPw) heroPw.classList.add("on"); requestAnimationFrame(step); });
    /* страховка: если rAF не тикает (фоновая вкладка), собрать экран по таймеру */
    setTimeout(function(){ if (heroPw) heroPw.classList.add("on"); }, 400);
    setTimeout(function(){ if (!introDone) { introDone = true; introK = 1; if (cpath) { cpath.style.strokeDasharray = ""; cpath.style.strokeDashoffset = ""; } update(); } }, 1900);
  }
}
window.plateSync = function(){ introDone = true; introK = 1; if (cpath) { cpath.style.strokeDasharray = ""; cpath.style.strokeDashoffset = ""; } if (heroPw) heroPw.classList.add("on"); update(); };
addEventListener("hashchange", function(){ root.classList.add("no-intro"); });

/* ---------------- ПОЯВЛЕНИЕ В КАТАЛОЖНЫХ СЕКЦИЯХ ---------------- */
if (HAS_IO && !RED) {
  root.classList.add("js");
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.1, rootMargin:"0px 0px -6% 0px"});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
  setTimeout(function(){ document.querySelectorAll(".rv:not(.in)").forEach(function(el){
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
  }); }, 1500);
} else {
  document.querySelectorAll(".rv").forEach(function(el){ el.classList.add("in"); });
}

/* ---------------- ЛЕНТА С КНОПКАМИ ----------------
   Шаг - ровно одна карточка (ширина + gap из стилей), крайняя кнопка гаснет,
   обе прячутся, если всё влезло. Ленте tabindex=0 - листается стрелками. */
var lanes = [];
document.querySelectorAll(".lane-w").forEach(function(w){
  var lane = w.querySelector(".lane"), prev = w.querySelector(".lbtn.prev"), next = w.querySelector(".lbtn.next");
  if (!lane || !prev || !next) return;
  function stepW(){
    var c = lane.firstElementChild; if (!c) return 300;
    var cs = getComputedStyle(lane);
    var gap = parseFloat(cs.columnGap || cs.gap) || 16;
    return c.getBoundingClientRect().width + gap;
  }
  function state(){
    var max = lane.scrollWidth - lane.clientWidth;
    var none = max <= 1;
    prev.hidden = none; next.hidden = none;
    prev.disabled = lane.scrollLeft <= 1;
    next.disabled = lane.scrollLeft >= max - 1;
  }
  prev.addEventListener("click", function(){ lane.scrollBy({left: -stepW(), behavior: RED ? "auto" : "smooth"}); });
  next.addEventListener("click", function(){ lane.scrollBy({left: stepW(), behavior: RED ? "auto" : "smooth"}); });
  lane.addEventListener("scroll", state, {passive:true});
  lane.addEventListener("keydown", function(e){
    if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev.click(); }
  });
  state();
  addEventListener("load", state);
  lanes.push({state: state});
});
var rsTimer;
addEventListener("resize", function(){ clearTimeout(rsTimer); rsTimer = setTimeout(function(){ fillTicker(); lanes.forEach(function(l){ l.state(); }); }, 200); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fillTicker);

/* ---------------- ФОРМА → WhatsApp ---------------- */
var form = document.getElementById("form");
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = document.getElementById("fmok"), err = document.getElementById("fmerr");
  if (form.company && form.company.value) return;          /* honeypot */
  var name = form.name.value.trim(), phone = form.phone.value.trim(), msg = form.msg.value.trim();
  if (!name || phone.replace(/\D/g, "").length < 10) { err.hidden = false; ok.hidden = true; return; }
  err.hidden = true;
  var t = "Здравствуйте! Заявка с сайта.\nИмя: " + name + "\nТелефон: " + phone + (msg ? "\nЧто случилось: " + msg : "");
  ok.hidden = false;
  conv("lead");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

/* ---------------- СТАРТ ---------------- */
var y = document.getElementById("year"); if (y) y.textContent = String(new Date().getFullYear());
fillTicker();
hdrState();
})();

/* Немая петля в фото-плите: src только в кадре, показ по событию playing */
(function(){
  var vids = [].slice.call(document.querySelectorAll("video.loop[data-src]"));
  if (!vids.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  vids.forEach(function(v){ v.addEventListener("playing", function(){ v.classList.add("is-live"); }); });
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      var v = e.target;
      if (e.isIntersecting) {
        if (!v.getAttribute("src")) v.src = v.dataset.src;
        var p = v.play(); if (p && p.catch) p.catch(function(){});
      } else if (v.getAttribute("src")) {
        v.pause(); v.classList.remove("is-live"); v.removeAttribute("src"); v.load();
      }
    });
  }, { threshold: 0.55 });
  vids.forEach(function(v){ io.observe(v); });
})();
