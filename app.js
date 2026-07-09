const CONFIG = {
  phone: "",       // 发布前填写，例如：13800000000
  wechat: "",      // 发布前填写商务微信
  qrImage: "assets/contact-qr.png"
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const toast = (message) => {
  const el = $(".toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(window.__toastTimer); window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
};

const topbar = $(".topbar"), progress = $(".scroll-progress span");
addEventListener("scroll", () => {
  topbar.classList.toggle("scrolled", scrollY > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max ? scrollY / max * 100 : 0}%`;
}, {passive:true});

const navToggle = $(".nav-toggle"), nav = $(".nav");
navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open"); navToggle.setAttribute("aria-expanded", open);
});
$$('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if(entry.isIntersecting){ entry.target.style.transitionDelay = `${entry.target.dataset.delay || 0}ms`; entry.target.classList.add("visible"); observer.unobserve(entry.target); }
}), {threshold:.12});
$$('.reveal').forEach(el => observer.observe(el));

$$('.product-tabs button').forEach(button => button.addEventListener('click', () => {
  $$('.product-tabs button').forEach(b => b.classList.remove('active')); button.classList.add('active');
  $$('.product-card').forEach(card => card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter);
}));

const gallery = $('.gallery-modal');
$$('.product-card').forEach(card => card.addEventListener('click', () => {
  $('img', gallery).src = `assets/web/${card.dataset.image}.webp`;
  $('img', gallery).alt = card.dataset.title; $('p', gallery).textContent = card.dataset.title; gallery.showModal();
}));
$$('.modal-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$$('dialog').forEach(dialog => dialog.addEventListener('click', e => { if(e.target === dialog) dialog.close(); }));

const consult = $('.consult-modal');
$$('.js-consult').forEach(button => button.addEventListener('click', () => consult.showModal()));
$('#copy-consult').addEventListener('click', async () => {
  const name = $('#name').value.trim() || '未填写';
  const need = $('#need').value.trim() || '希望了解企业 AI 全域增长方案';
  const text = `【创非凡方案咨询】\n称呼：${name}\n需求：${need}`;
  try { await navigator.clipboard.writeText(text); toast('咨询信息已复制'); $('#contact-note').textContent = CONFIG.phone || CONFIG.wechat ? `商务联系：${CONFIG.phone || CONFIG.wechat}` : '已复制，请发送给创非凡商务顾问。'; }
  catch { $('#contact-note').textContent = text; toast('请长按复制咨询信息'); }
});

if(CONFIG.phone){
  const call = document.createElement('a'); call.className = 'btn ghost'; call.href = `tel:${CONFIG.phone}`; call.textContent = `致电 ${CONFIG.phone}`;
  $('.contact-copy').append(call);
}
