const world = document.querySelector('.world');
const rover = document.querySelector('.rover');
const resetButton = document.querySelector('.world-reset');

let roverX = 0;
let roverY = 0;

function moveRover(deltaX, deltaY) {
  const maxX = Math.max(70, world.clientWidth / 2 - 60);
  const maxY = Math.max(80, world.clientHeight / 2 - 52);
  roverX = Math.max(-maxX, Math.min(maxX, roverX + deltaX));
  roverY = Math.max(-maxY, Math.min(maxY, roverY + deltaY));
  rover.style.setProperty('--x', `${roverX}px`);
  rover.style.setProperty('--y', `${roverY}px`);
}

function resetRover() {
  roverX = 0;
  roverY = 0;
  moveRover(0, 0);
}

world.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const moves = {
    arrowup: [0, -18], w: [0, -18],
    arrowdown: [0, 18], s: [0, 18],
    arrowleft: [-18, 0], a: [-18, 0],
    arrowright: [18, 0], d: [18, 0]
  };
  if (moves[key]) {
    event.preventDefault();
    moveRover(...moves[key]);
  }
});

resetButton.addEventListener('click', () => {
  resetRover();
  world.focus();
});

document.querySelector('#year').textContent = new Date().getFullYear();

const observedSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-header nav a');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'page');
      });
    });
  }, { rootMargin: '-35% 0px -55%' });
  observedSections.forEach((section) => observer.observe(section));
}
