const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];

const menu = $('.menu');
const hamburger = $('.hamburger');
hamburger?.addEventListener('click', () => menu.classList.toggle('open'));

const themeToggle = $('.theme-toggle');
const savedTheme = localStorage.getItem('cbc-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('cbc-theme', next);
});

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

const filterButtons = $$('.filter-btn');
const catalogCards = $$('.catalog-card');
filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  catalogCards.forEach(card => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.style.display = show ? 'grid' : 'none';
  });
}));

const steps = $$('.form-step');
const nextButtons = $$('[data-next]');
const prevButtons = $$('[data-prev]');
const bar = $('.bar');
let stepIndex = 0;
function showStep(i){
  stepIndex = Math.max(0, Math.min(i, steps.length - 1));
  steps.forEach((s, idx) => s.classList.toggle('active', idx === stepIndex));
  if (bar) bar.style.width = `${((stepIndex + 1) / steps.length) * 100}%`;
  updateSummary();
}
nextButtons.forEach(btn => btn.addEventListener('click', () => showStep(stepIndex + 1)));
prevButtons.forEach(btn => btn.addEventListener('click', () => showStep(stepIndex - 1)));

const fields = $$('input, select, textarea');
fields.forEach(f => f.addEventListener('input', updateSummary));
fields.forEach(f => f.addEventListener('change', updateSummary));
function valueOf(name){
  const checked = $(`[name="${name}"]:checked`);
  if (checked) return checked.value;
  return $(`[name="${name}"]`)?.value || '—';
}
function updateSummary(){
  const map = {
    sumService: valueOf('service'),
    sumSize: valueOf('size'),
    sumQty: valueOf('quantity'),
    sumColor: valueOf('color'),
    sumFinish: valueOf('finish'),
    sumBranch: valueOf('branch'),
    sumDeadline: valueOf('deadline')
  };
  Object.entries(map).forEach(([id,val]) => { const el = document.getElementById(id); if(el) el.textContent = val || '—'; });
}
$$('#whatsappSubmit').forEach(whatsappBtn => whatsappBtn.addEventListener('click', () => {
  updateSummary();
  const phone = '919422062887';
  const message = `Hello Classic Business Centre, I want to PRINT NOW.%0A%0AService: ${valueOf('service')}%0ASize: ${valueOf('size')}%0AQuantity: ${valueOf('quantity')}%0AColour: ${valueOf('color')}%0AFinishing: ${valueOf('finish')}%0ABranch: ${valueOf('branch')}%0ADeadline: ${valueOf('deadline')}%0AName: ${valueOf('name')}%0APhone: ${valueOf('phone')}%0ANotes: ${valueOf('notes')}%0A%0AI will attach the file/design here in WhatsApp.`;
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}));
showStep(0);
