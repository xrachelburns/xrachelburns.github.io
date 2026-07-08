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

function renderGuide() {
  guide.style.setProperty('--x', `${guideX}px`);
  guide.style.setProperty('--y', `${guideY}px`);
}

function moveGuide(dx, dy) {
  const maxX = Math.max(0, world.clientWidth / 2 - 45);
  const maxY = Math.max(0, world.clientHeight / 2 - 50);
  guideX = Math.max(-maxX, Math.min(maxX, guideX + dx));
  guideY = Math.max(-maxY, Math.min(maxY, guideY + dy));
  renderGuide();
}

world.addEventListener('keydown', (event) => {
  const moves = { arrowup: [0,-16], w: [0,-16], arrowdown: [0,16], s: [0,16], arrowleft: [-16,0], a: [-16,0], arrowright: [16,0], d: [16,0] };
  const move = moves[event.key.toLowerCase()];
  if (!move) return;
  event.preventDefault();
  moveGuide(...move);
});

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
