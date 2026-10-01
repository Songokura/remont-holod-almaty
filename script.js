(function(){
"use strict";
var WA = "77773496904";
var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";
var root = document.documentElement;

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

var WA_TXT = {
  hero:   "Здравствуйте! Нужен ремонт холодильника в Алматы.\nЧто случилось: ",
  diag:   "Здравствуйте! Нужна диагностика холодильника.\nМарка и адрес: ",
  nem:    "Здравствуйте! Холодильник не морозит.\nМарка и адрес: ",
  komp:   "Здравствуйте! Нужна замена компрессора холодильника.\nМарка и адрес: ",
  freon:  "Здравствуйте! Похоже, утечка фреона, нужна заправка.\nМарка и адрес: ",
  el:     "Здравствуйте! Нужен ремонт платы или модуля управления холодильника.\nМарка и адрес: ",
  nemor:  "Здравствуйте! Холодильник не морозит.\nМарка и адрес: ",
  techet: "Здравствуйте! Холодильник течёт.\nМарка и адрес: ",
  shumit: "Здравствуйте! Холодильник шумит или гудит.\nМарка и адрес: ",
  led:    "Здравствуйте! Холодильник намораживает лёд.\nМарка и адрес: ",
  nevkl:  "Здравствуйте! Холодильник не включается.\nМарка и адрес: ",
  neotkl: "Здравствуйте! Холодильник работает без остановки, не отключается.\nМарка и адрес: ",
  foto:   "Здравствуйте! Отправляю фото или видео поломки холодильника.\nМарка и адрес: ",
  kont:   "Здравствуйте! Пишу с сайта. Нужен мастер по холодильникам.\nЧто случилось: "
};
document.querySelectorAll("[data-wa]").forEach(function(a){
  var t = WA_TXT[a.dataset.wa] || WA_TXT.hero;
  a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
  a.target = "_blank"; a.rel = "noopener";
});

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

var HH = function(){ return parseFloat(getComputedStyle(root).getPropertyValue("--hh")) || 64; };
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a) return;
  var id = a.getAttribute("href").slice(1); if (!id) return;
  var t = document.getElementById(id); if (!t) return;
  e.preventDefault();
  closeMenu();
  var hdr = document.getElementById("hdr");
  var off = hdr && getComputedStyle(hdr).position === "fixed" && !document.body.classList.contains("menu-open") ? HH() + 12 : 12;
  var top = t.getBoundingClientRect().top + scrollY - off;
  scrollTo({ top: Math.max(0, top), behavior: RED ? "auto" : "smooth" });
  try { history.pushState(null, "", "#" + id); } catch(err){}
});

var bar = document.getElementById("bar");
var kont = document.getElementById("kontakty");
function barState(){
  if (!bar) return;
  var H = innerHeight || root.clientHeight;
  var onKont = kont && kont.getBoundingClientRect().top < H * .6;
  bar.classList.toggle("show", scrollY > H * .55 && !onKont);
}
addEventListener("scroll", barState, {passive:true});
barState();

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
addEventListener("resize", function(){ clearTimeout(rsTimer); rsTimer = setTimeout(function(){ lanes.forEach(function(l){ l.state(); }); }, 200); });

var form = document.getElementById("form");
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = document.getElementById("fmok"), err = document.getElementById("fmerr");
  if (form.company && form.company.value) return;
  var name = form.name.value.trim(), phone = form.phone.value.trim(), msg = form.msg.value.trim();
  if (!name || phone.replace(/\D/g, "").length < 10) { err.hidden = false; ok.hidden = true; return; }
  err.hidden = true;
  var t = "Здравствуйте! Заявка с сайта.\nИмя: " + name + "\nТелефон: " + phone + (msg ? "\nЧто случилось: " + msg : "");
  ok.hidden = false;
  conv("lead");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

var y = document.getElementById("year"); if (y) y.textContent = String(new Date().getFullYear());
})();

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
