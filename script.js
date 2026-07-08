const body = document.body;
const themeButton = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const savedTheme = localStorage.getItem('rachel-theme');

if (savedTheme === 'light') {
  body.classList.add('light');
  themeLabel.textContent = 'Dark';
}

themeButton.addEventListener('click', () => {
  body.classList.toggle('light');
  const isLight = body.classList.contains('light');
  themeLabel.textContent = isLight ? 'Dark' : 'Light';
  localStorage.setItem('rachel-theme', isLight ? 'light' : 'dark');
});

const world = document.querySelector('.world');
const guide = document.querySelector('.guide');
const reset = document.querySelector('.map-reset');
let guideX = 0;
let guideY = 0;
let idleTimer;
let autoStep = 0;
const patrol = [[-120,-90],[105,-80],[125,105],[-110,110],[0,0]];

function renderGuide() {
  guide.style.setProperty('--x', `${guideX}px`);
  guide.style.setProperty('--y', `${guideY}px`);
}

function moveGuide(dx, dy) {
  const maxX = Math.max(0, world.clientWidth / 2 - 45);
  const maxY = Math.max(0, world.clientHeight / 2 - 50);
  guideX = Math.max(-maxX, Math.min(maxX, guideX + dx));
  guideY = Math.max(-maxY, Math.min(maxY, guideY + dy));
  guide.classList.toggle('facing-left', dx < 0);
  guide.classList.add('moving');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => guide.classList.remove('moving'), 420);
  renderGuide();
}

function moveGuideTo(x, y) {
  const maxX = Math.max(0, world.clientWidth / 2 - 45);
  const maxY = Math.max(0, world.clientHeight / 2 - 50);
  const nextX = Math.max(-maxX, Math.min(maxX, x));
  const nextY = Math.max(-maxY, Math.min(maxY, y));
  guide.classList.toggle('facing-left', nextX < guideX);
  guide.classList.add('moving');
  guideX = nextX;
  guideY = nextY;
  renderGuide();
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => guide.classList.remove('moving'), 900);
}

world.addEventListener('keydown', (event) => {
  const moves = { arrowup: [0,-16], w: [0,-16], arrowdown: [0,16], s: [0,16], arrowleft: [-16,0], a: [-16,0], arrowright: [16,0], d: [16,0] };
  const move = moves[event.key.toLowerCase()];
  if (!move) return;
  event.preventDefault();
  moveGuide(...move);
});

world.addEventListener('pointerdown', (event) => {
  if (event.target.closest('.map-node')) return;
  const bounds = world.getBoundingClientRect();
  moveGuideTo(event.clientX - bounds.left - bounds.width / 2, event.clientY - bounds.top - bounds.height / 2);
  world.focus();
});

document.querySelectorAll('.map-node').forEach((node) => {
  node.addEventListener('click', () => {
    const worldBounds = world.getBoundingClientRect();
    const nodeBounds = node.getBoundingClientRect();
    moveGuideTo(nodeBounds.left + nodeBounds.width / 2 - worldBounds.left - worldBounds.width / 2, nodeBounds.top + nodeBounds.height / 2 - worldBounds.top - worldBounds.height / 2);
  });
});

const autoPatrol = window.setInterval(() => {
  if (document.hidden || world.matches(':focus-within') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  moveGuideTo(...patrol[autoStep]);
  autoStep = (autoStep + 1) % patrol.length;
}, 2600);

reset.addEventListener('click', () => {
  guideX = 0;
  guideY = 0;
  renderGuide();
  world.focus();
});

const navLinks = document.querySelectorAll('.menu-bar nav a');
const sections = document.querySelectorAll('section[id]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.toggleAttribute('aria-current', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55%' });
  sections.forEach((section) => observer.observe(section));
}

document.querySelector('#year').textContent = new Date().getFullYear();
