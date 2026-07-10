const body = document.body;
const themeButton = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const savedTheme = localStorage.getItem('rachel-theme');
let sequoiaScrollFrame;

const updateSequoiaShift = () => {
  const progress = Math.min(1, window.scrollY / Math.max(window.innerHeight * 1.35, 1));
  const wave = (Math.sin((window.scrollY / Math.max(window.innerHeight, 1)) * Math.PI) + 1) / 2;
  document.documentElement.style.setProperty('--sequoia-shift', String(Math.min(1, (progress * 0.72) + (wave * 0.18))));
  sequoiaScrollFrame = undefined;
};

window.addEventListener('scroll', () => {
  if (sequoiaScrollFrame) return;
  sequoiaScrollFrame = window.requestAnimationFrame(updateSequoiaShift);
}, { passive: true });
updateSequoiaShift();

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

const namiSound = new Audio('assets/audio/one-piece-nami.mp3');
namiSound.preload = 'auto';
namiSound.volume = 0.72;
const ipodFullTrackUrl = 'https://music.apple.com/us/album/on-my-knees/1585865534?i=1585865541';

const playNamiSound = () => {
  namiSound.pause();
  namiSound.currentTime = 0;
  return namiSound.play().catch(() => {});
};

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

document.querySelectorAll('[data-nami-sound]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    if (trigger.matches('a[href^="mailto:"]')) {
      event.preventDefault();
      playNamiSound();
      window.setTimeout(() => {
        window.location.href = trigger.href;
      }, 1200);
      return;
    }

    playNamiSound();
  });
});

const ipodStage = document.querySelector('.ipod-stage');
const ipodPlayButtons = document.querySelectorAll('[data-ipod-play]');
const ipodStates = document.querySelectorAll('.ipod-state, .ipod-float-state');

const setIpodState = (isOpening) => {
  document.body.classList.toggle('ipod-playing', isOpening);
  ipodPlayButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(isOpening));
    button.textContent = isOpening ? '↗' : '▶';
    button.setAttribute('aria-label', 'Open On My Knees from the beginning in Apple Music');
  });
  ipodStates.forEach((state) => {
    state.textContent = isOpening ? 'Opening full song' : 'Starts at 0:00';
  });
};

ipodPlayButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setIpodState(true);
    window.open(ipodFullTrackUrl, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => setIpodState(false), 1800);
  });
});

ipodStage?.addEventListener('pointermove', (event) => {
  const rect = ipodStage.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * -14;
  ipodStage.style.setProperty('--tilt-x', `${y}deg`);
  ipodStage.style.setProperty('--tilt-y', `${x}deg`);
});

ipodStage?.addEventListener('pointerleave', () => {
  ipodStage.style.setProperty('--tilt-x', '0deg');
  ipodStage.style.setProperty('--tilt-y', '0deg');
});

const languageButton = document.querySelector('.language-toggle');
const wordsOfTheDay = [
  {
    english: { term: 'Liminal', pronunciation: 'LIM-uh-nuhl', definition: 'At a threshold or transition point.', example: 'She stood in the liminal space between student and engineer.' },
    spanish: { term: 'Aprender', pronunciation: 'ah-pren-DEHR', definition: 'To learn.', example: 'Quiero aprender algo nuevo hoy.' }
  },
  {
    english: { term: 'Perspicacious', pronunciation: 'pur-spih-KAY-shuhs', definition: 'Quick to notice and understand subtle things.', example: 'Her perspicacious debugging caught the quietest failure first.' },
    spanish: { term: 'Crear', pronunciation: 'kreh-AHR', definition: 'To create.', example: 'Me gusta crear proyectos útiles.' }
  },
  {
    english: { term: 'Ephemeral', pronunciation: 'ih-FEM-er-uhl', definition: 'Lasting for a very short time.', example: 'The ephemeral prototype taught her what the final version needed.' },
    spanish: { term: 'Mejorar', pronunciation: 'meh-hoh-RAHR', definition: 'To improve.', example: 'Practico para mejorar cada día.' }
  },
  {
    english: { term: 'Sagacious', pronunciation: 'suh-GAY-shuhs', definition: 'Showing wise, practical judgment.', example: 'A sagacious engineer asks why before choosing how.' },
    spanish: { term: 'Pantalla', pronunciation: 'pahn-TAH-yah', definition: 'Screen.', example: 'La pantalla muestra mi portfolio.' }
  },
  {
    english: { term: 'Ineffable', pronunciation: 'in-EF-uh-buhl', definition: 'Too great or intense to put into words.', example: 'Finishing the feature brought an ineffable little spark of relief.' },
    spanish: { term: 'Nube', pronunciation: 'NOO-beh', definition: 'Cloud.', example: 'Estoy aprendiendo sobre la nube.' }
  },
  {
    english: { term: 'Assiduous', pronunciation: 'uh-SIJ-oo-uhs', definition: 'Showing steady care and effort.', example: 'Assiduous practice turns unfamiliar syntax into instinct.' },
    spanish: { term: 'Seguro', pronunciation: 'seh-GOO-roh', definition: 'Safe or secure.', example: 'Quiero escribir código seguro.' }
  },
  {
    english: { term: 'Confluence', pronunciation: 'KON-floo-uhns', definition: 'A flowing together or meeting point.', example: 'Her portfolio sits at the confluence of design, code, and curiosity.' },
    spanish: { term: 'Pregunta', pronunciation: 'preh-GOON-tah', definition: 'Question.', example: 'Una buena pregunta abre el camino.' }
  },
  {
    english: { term: 'Resonant', pronunciation: 'REZ-uh-nuhnt', definition: 'Having lasting emotional or intellectual impact.', example: 'The most resonant interfaces make people feel capable.' },
    spanish: { term: 'Respuesta', pronunciation: 'rehs-PWEHS-tah', definition: 'Answer.', example: 'Busco la respuesta con calma.' }
  },
  {
    english: { term: 'Incisive', pronunciation: 'in-SY-siv', definition: 'Clear, sharp, and direct in thought.', example: 'An incisive review can save hours of wandering.' },
    spanish: { term: 'Enlace', pronunciation: 'en-LAH-seh', definition: 'Link.', example: 'Haz clic en el enlace.' }
  },
  {
    english: { term: 'Tenacious', pronunciation: 'tuh-NAY-shuhs', definition: 'Persistent and determined.', example: 'She stayed tenacious through every messy first draft.' },
    spanish: { term: 'Logro', pronunciation: 'LOH-groh', definition: 'Achievement.', example: 'Cada proyecto es un logro.' }
  }
];

const getLocalDayIndex = () => {
  const now = new Date();
  return Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000);
};

const setWordText = (selector, text) => {
  const element = document.querySelector(`[data-word="${selector}"]`);
  if (element) element.textContent = text;
};

const applyDailyWords = () => {
  const entry = wordsOfTheDay[getLocalDayIndex() % wordsOfTheDay.length];
  setWordText('english-term', entry.english.term);
  setWordText('english-pronunciation', entry.english.pronunciation);
  setWordText('english-definition', entry.english.definition);
  setWordText('english-example', entry.english.example);
  setWordText('spanish-term', entry.spanish.term);
  setWordText('spanish-pronunciation', entry.spanish.pronunciation);
  setWordText('spanish-definition', entry.spanish.definition);
  setWordText('spanish-example', entry.spanish.example);
};

applyDailyWords();

const wordStage = document.querySelector('.word-3d-stage');

wordStage?.addEventListener('pointermove', (event) => {
  const rect = wordStage.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * -16;
  wordStage.style.setProperty('--word-tilt-x', `${y}deg`);
  wordStage.style.setProperty('--word-tilt-y', `${x}deg`);
  wordStage.style.setProperty('--word-glow-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
  wordStage.style.setProperty('--word-glow-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
});

wordStage?.addEventListener('pointerleave', () => {
  wordStage.style.setProperty('--word-tilt-x', '0deg');
  wordStage.style.setProperty('--word-tilt-y', '0deg');
  wordStage.style.setProperty('--word-glow-x', '50%');
  wordStage.style.setProperty('--word-glow-y', '42%');
});

const chatStage = document.querySelector('.chat-3d-stage');
const chatForm = document.querySelector('[data-chat-form]');
const chatNote = document.querySelector('[data-chat-note]');
const visitorCount = document.querySelector('[data-visitor-count]');

chatStage?.addEventListener('pointermove', (event) => {
  const rect = chatStage.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * -14;
  chatStage.style.setProperty('--chat-tilt-x', `${y}deg`);
  chatStage.style.setProperty('--chat-tilt-y', `${x}deg`);
  chatStage.style.setProperty('--chat-glow-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
  chatStage.style.setProperty('--chat-glow-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
});

chatStage?.addEventListener('pointerleave', () => {
  chatStage.style.setProperty('--chat-tilt-x', '0deg');
  chatStage.style.setProperty('--chat-tilt-y', '0deg');
  chatStage.style.setProperty('--chat-glow-x', '50%');
  chatStage.style.setProperty('--chat-glow-y', '35%');
});

chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(chatForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'a visitor'}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply email: ${email}\n\nSent from Rachel's portfolio chat box.`);
  if (chatNote) {
    chatNote.textContent = 'Opening your email app so the full message can send safely.';
  }
  window.location.href = `mailto:dossier@xrachelburns.com?subject=${subject}&body=${body}`;
});

const updateVisitorCounter = async () => {
  if (!visitorCount) return;

  const fallbackKey = 'rachel-portfolio-local-visits';
  const hasVisitedKey = 'rachel-portfolio-visited';
  const localVisits = Number(localStorage.getItem(fallbackKey) || '0') + (localStorage.getItem(hasVisitedKey) ? 0 : 1);
  localStorage.setItem(hasVisitedKey, 'true');
  localStorage.setItem(fallbackKey, String(Math.max(localVisits, 1)));
  visitorCount.textContent = String(Math.max(localVisits, 1)).padStart(4, '0');

  try {
    const response = await fetch('/api/visitor-count', { method: 'POST' });
    if (!response.ok) return;
    const data = await response.json();
    if (Number.isFinite(data.count)) {
      visitorCount.textContent = String(data.count).padStart(4, '0');
    }
  } catch {
    // The static version shows a local counter until a hosted visitor endpoint is connected.
  }
};

updateVisitorCounter();

const translations = {
  en: {
    navAbout: 'About', navWork: 'Work', navSkills: 'Skills', navContact: 'Contact',
    availability: 'Open to internships & collaboration',
    heroTitle: 'Engineering with', heroEmphasis: 'curiosity.',
    heroLead: 'I’m Rachel—a software engineering student building thoughtful, human-centered experiences across the web, cloud, cybersecurity, and AI.',
    exploreWork: 'Explore my work', viewResume: 'View résumé',
    aboutTitle: 'I turn complex ideas into experiences that feel', aboutEmphasis: 'clear.',
    aboutCopyOne: "I'm pursuing an accelerated B.S. Software Engineering / M.S. AI Engineering pathway at Western Governors University. I care about software that is useful, accessible, and quietly delightful.",
    aboutCopyTwo: 'My customer-service background taught me to listen carefully, communicate clearly, and stay composed under pressure. Those are engineering skills too—and I bring them to every project.',
    basedIn: 'Based in', basedPlace: 'Wisconsin, USA', studying: 'Studying', studyName: 'Software Engineering', exploring: 'Exploring', exploreAreas: 'AI · Cloud · Security',
    worldIndex: 'Interactive world', worldOverline: 'SEQUOIA MODE', worldTitle: 'A tiny 3D world for everything I’m building.',
    worldCopy: 'Click a station to jump through the portfolio like a miniature landscape: work, learning, music, skills, and contact all become part of the map.',
    paletteSequoia: 'Sequoia', paletteLive: 'Live Mac',
    wordIndex: 'Word of the day', wordOverline: 'DAILY LANGUAGE DROP', wordTitle: 'Two words,', wordEmphasis: 'one fresh reset.',
    wordCopy: 'The English pick leans advanced; the Spanish pick stays practical while you build confidence.',
    englishWordLabel: 'Advanced English', spanishWordLabel: 'Spanish practice',
    namiIndex: 'Anime cameos', namiOverline: 'LIVE MODELS', namiTitle: 'Nami dropped by', namiEmphasis: 'the portfolio.',
    namiQuote: 'Hi, it’s Nami... Rachel’s alter ego... err, I mean nickname. Haha. Maybe just one of the many anime favorites she’s watched.',
    killuaFact: 'Fun fact: Killua is also what Rachel named her baby boy... err, her cat, who is absolutely her baby boy and turned one in May.',
    worldAbout: 'About', worldWork: 'Work', worldMusic: 'Music', worldSkills: 'Skills', worldContact: 'Contact',
    workIndex: 'Selected work', workOverline: 'BUILT WITH INTENTION', workTitle: 'A few things I’ve made.',
    luffyIndex: 'Floating cameo', luffyOverline: 'GEAR 5 ENERGY', luffyTitle: 'Luffy floats in', luffyEmphasis: 'for the side quest.',
    luffyCopy: 'A tiny animated One Piece cameo for the page, because sometimes the portfolio needs a little extra chaos and motion.',
    ipodIndex: 'Now playing', ipodOverline: 'PRESS PLAY', ipodTitle: 'A little soundtrack', ipodEmphasis: 'for the scroll.',
    skillsIndex: 'Toolkit', skillsOverline: 'CURRENTLY LOADING...', skillsTitle: 'Strong foundations.', skillsEmphasis: 'Expanding range.',
    languages: 'Languages', technologies: 'Technologies', concepts: 'Concepts', conceptsCopy: 'Responsive design · Networking · Cybersecurity · Relational databases · OOP · Scrum',
    learningNext: 'Learning next', learningCopy: 'Intelligent systems · Responsible AI · Production machine learning',
    chatIndex: 'Live contact', chatOverline: 'SERIOUS INQUIRIES ONLY', chatTitle: 'Shoot me a message', chatEmphasis: 'if you want to chat.',
    chatCopy: 'Drop a quick note about the opportunity, project, or collaboration. It is styled like a live 3D chat and ready to connect to private SMS delivery.',
    visitorLabel: 'Visits since launch', visitorSince: 'Tracking from July 10, 2026',
    chatStatus: 'Live message portal', chatName: 'Your name', chatReply: 'Reply email', chatMessage: 'Message', chatSend: 'Send message',
    chatNote: 'Opens your email app for now; SMS delivery can be connected privately after launch.',
    contactOverline: 'ONE MORE THING...', contactTitle: 'Let’s build something', contactEmphasis: 'worth remembering.',
    contactCopy: 'I’m growing my experience one thoughtful project at a time. If you’re working in software, cloud, cybersecurity, or AI, I’d love to connect.'
  },
  es: {
    navAbout: 'Sobre mí', navWork: 'Proyectos', navSkills: 'Habilidades', navContact: 'Contacto',
    availability: 'Abierta a internships y colaboración',
    heroTitle: 'Ingeniería con', heroEmphasis: 'curiosidad.',
    heroLead: 'Soy Rachel, estudiante de ingeniería de software creando experiencias humanas y claras para web, nube, ciberseguridad e IA.',
    exploreWork: 'Ver mis proyectos', viewResume: 'Ver résumé',
    aboutTitle: 'Convierto ideas complejas en experiencias que se sienten', aboutEmphasis: 'claras.',
    aboutCopyOne: 'Estoy cursando una ruta acelerada de B.S. en Ingeniería de Software / M.S. en Ingeniería de IA en Western Governors University. Me importa crear software útil, accesible y discretamente encantador.',
    aboutCopyTwo: 'Mi experiencia en servicio al cliente me enseñó a escuchar con cuidado, comunicar con claridad y mantener la calma bajo presión. Esas también son habilidades de ingeniería, y las llevo a cada proyecto.',
    basedIn: 'Ubicación', basedPlace: 'Wisconsin, EE. UU.', studying: 'Estudiando', studyName: 'Ingeniería de Software', exploring: 'Explorando', exploreAreas: 'IA · Nube · Seguridad',
    worldIndex: 'Mundo interactivo', worldOverline: 'MODO SEQUOIA', worldTitle: 'Un pequeño mundo 3D para todo lo que estoy construyendo.',
    worldCopy: 'Haz clic en una estación para recorrer el portfolio como un paisaje en miniatura: proyectos, aprendizaje, música, habilidades y contacto viven en el mapa.',
    paletteSequoia: 'Sequoia', paletteLive: 'Mac vivo',
    wordIndex: 'Palabras del día', wordOverline: 'DOSIS DIARIA DE LENGUAJE', wordTitle: 'Dos palabras,', wordEmphasis: 'un reinicio fresco.',
    wordCopy: 'La palabra en inglés es más avanzada; la palabra en español se mantiene práctica para ganar confianza.',
    englishWordLabel: 'Inglés avanzado', spanishWordLabel: 'Práctica de español',
    namiIndex: 'Cameos de anime', namiOverline: 'MODELOS EN VIVO', namiTitle: 'Nami pasó por', namiEmphasis: 'el portfolio.',
    namiQuote: 'Hola, soy Nami... el alter ego de Rachel... digo, su apodo. Jaja. Tal vez solo una de sus muchas favoritas de anime.',
    killuaFact: 'Dato curioso: Killua también es el nombre que Rachel le puso a su bebé... digo, a su gato, que definitivamente es su bebé y cumplió un año en mayo.',
    worldAbout: 'Sobre mí', worldWork: 'Proyectos', worldMusic: 'Música', worldSkills: 'Skills', worldContact: 'Contacto',
    workIndex: 'Proyectos destacados', workOverline: 'HECHO CON INTENCIÓN', workTitle: 'Algunas cosas que he creado.',
    luffyIndex: 'Cameo flotante', luffyOverline: 'ENERGIA GEAR 5', luffyTitle: 'Luffy flota en', luffyEmphasis: 'la side quest.',
    luffyCopy: 'Un pequeno cameo animado de One Piece para la pagina, porque a veces el portfolio necesita un poco mas de caos y movimiento.',
    ipodIndex: 'Sonando ahora', ipodOverline: 'DALE PLAY', ipodTitle: 'Un soundtrack pequeño', ipodEmphasis: 'para scrollear.',
    skillsIndex: 'Herramientas', skillsOverline: 'CARGANDO...', skillsTitle: 'Bases sólidas.', skillsEmphasis: 'Rango en expansión.',
    languages: 'Lenguajes', technologies: 'Tecnologías', concepts: 'Conceptos', conceptsCopy: 'Diseño responsive · Redes · Ciberseguridad · Bases de datos relacionales · OOP · Scrum',
    learningNext: 'Lo próximo', learningCopy: 'Sistemas inteligentes · IA responsable · Machine learning en producción',
    chatIndex: 'Contacto en vivo', chatOverline: 'SOLO CONSULTAS SERIAS', chatTitle: 'Mándame un mensaje', chatEmphasis: 'si quieres hablar.',
    chatCopy: 'Deja una nota breve sobre la oportunidad, proyecto o colaboración. Se ve como un chat 3D en vivo y queda listo para conectar envío privado por SMS.',
    visitorLabel: 'Visitas desde el lanzamiento', visitorSince: 'Contando desde el 10 de julio de 2026',
    chatStatus: 'Portal de mensaje en vivo', chatName: 'Tu nombre', chatReply: 'Email de respuesta', chatMessage: 'Mensaje', chatSend: 'Enviar mensaje',
    chatNote: 'Por ahora abre tu app de email; el envío por SMS se puede conectar en privado después del lanzamiento.',
    contactOverline: 'UNA COSA MÁS...', contactTitle: 'Construyamos algo', contactEmphasis: 'para recordar.',
    contactCopy: 'Estoy creciendo mi experiencia un proyecto reflexivo a la vez. Si trabajas en software, nube, ciberseguridad o IA, me encantaría conectar.'
  }
};

const applyLanguage = (language) => {
  const dictionary = translations[language] || translations.en;
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key]) element.textContent = dictionary[key];
  });
  languageButton?.setAttribute('aria-pressed', String(language === 'es'));
  localStorage.setItem('rachel-language', language);
};

applyLanguage(localStorage.getItem('rachel-language') || 'en');

languageButton?.addEventListener('click', () => {
  const nextLanguage = document.documentElement.lang === 'es' ? 'en' : 'es';
  applyLanguage(nextLanguage);
});

document.querySelectorAll('.world-station').forEach((station) => {
  station.addEventListener('click', () => {
    document.querySelector('.mini-world-stage')?.classList.add('is-active');
    window.setTimeout(() => document.querySelector('.mini-world-stage')?.classList.remove('is-active'), 2200);
  });
});

const worldPaletteButtons = document.querySelectorAll('[data-world-palette]');
const worldLiveVideo = document.querySelector('.world-live-video');

const applyWorldPalette = (palette) => {
  const isLive = palette === 'live';
  document.body.classList.toggle('world-live-mode', isLive);
  worldPaletteButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.worldPalette === palette);
  });

  if (isLive) {
    worldLiveVideo?.play().catch(() => {});
  } else {
    worldLiveVideo?.pause();
  }

  localStorage.setItem('rachel-world-palette', palette);
};

worldPaletteButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyWorldPalette(button.dataset.worldPalette || 'sequoia');
  });
});

applyWorldPalette(localStorage.getItem('rachel-world-palette') || 'sequoia');

document.querySelector('#year').textContent = new Date().getFullYear();
