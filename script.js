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

document.querySelectorAll('.journey, .wallpaper-strip').forEach((section) => section.remove());

const initializeTransparentSketchfabModels = () => {
  if (!window.Sketchfab) return;

  document.querySelectorAll('[data-sketchfab-uid]').forEach((iframe) => {
    const uid = iframe.dataset.sketchfabUid;
    if (!uid || iframe.dataset.sketchfabApiReady) return;

    const client = new window.Sketchfab(iframe);
    client.init(uid, {
      autostart: 1,
      preload: 1,
      transparent: 1,
      ui_infos: 0,
      ui_controls: 0,
      ui_stop: 0,
      ui_watermark: 0,
      ui_watermark_link: 0,
      ui_hint: 0,
      ui_ar: 0,
      ui_vr: 0,
      ui_settings: 0,
      ui_fullscreen: 0,
      ui_help: 0,
      ui_inspector: 0,
      ui_annotations: 0,
      dnt: 1,
      success(api) {
        iframe.dataset.sketchfabApiReady = 'true';
        api.start();
        api.addEventListener('viewerready', () => {
          if (typeof api.setBackground === 'function') {
            api.setBackground({ transparent: true });
          }
        });
      }
    });
  });
};

window.addEventListener('load', initializeTransparentSketchfabModels);

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
const ipodTrack = new Audio('assets/audio/on-my-knees.mp3');
ipodTrack.preload = 'auto';
ipodTrack.volume = 0.74;
let ipodTrackMissing = false;

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

const setIpodState = (status) => {
  const isPlaying = status === 'playing';
  document.body.classList.toggle('ipod-playing', isPlaying);
  ipodPlayButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(isPlaying));
    button.textContent = isPlaying ? 'Ⅱ' : '▶';
    button.setAttribute('aria-label', isPlaying ? 'Pause On My Knees' : 'Play On My Knees from the beginning');
  });
  ipodStates.forEach((state) => {
    if (status === 'missing') {
      state.textContent = 'Missing song file';
    } else if (status === 'paused') {
      state.textContent = 'Paused';
    } else {
      state.textContent = isPlaying ? 'Playing from 0:00' : 'Starts at 0:00';
    }
  });
};

ipodTrack.addEventListener('ended', () => setIpodState('ready'));
ipodTrack.addEventListener('error', () => {
  ipodTrackMissing = true;
  setIpodState('missing');
});

const toggleIpodPlayback = () => {
  if (ipodTrackMissing) {
    setIpodState('missing');
    return;
  }

  if (!ipodTrack.paused) {
    ipodTrack.pause();
    setIpodState('paused');
    return;
  }

  ipodTrack.currentTime = 0;
  ipodTrack.play()
    .then(() => setIpodState('playing'))
    .catch(() => setIpodState('paused'));
};

ipodPlayButtons.forEach((button) => {
  button.addEventListener('click', toggleIpodPlayback);
});

ipodStage?.addEventListener('click', (event) => {
  if (event.target.closest('[data-ipod-play]')) return;
  toggleIpodPlayback();
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

const scheduleDailyWordRefresh = () => {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const delay = Math.max(1000, nextMidnight.getTime() - now.getTime() + 1000);
  window.setTimeout(() => {
    applyDailyWords();
    scheduleDailyWordRefresh();
  }, delay);
};

scheduleDailyWordRefresh();

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
  playNamiSound();
  window.setTimeout(() => {
    window.location.href = `mailto:dossier@xrachelburns.com?subject=${subject}&body=${body}`;
  }, 900);
});

const updateVisitorCounter = async () => {
  if (!visitorCount) return;

  try {
    const response = await fetch('https://api.counterapi.dev/v1/xrachelburns-portfolio/page-views/up', { cache: 'no-store' });
    if (!response.ok) throw new Error('Counter request failed');
    const data = await response.json();
    const count = Number(data.count);
    if (!Number.isFinite(count)) throw new Error('Counter response missing count');
    visitorCount.textContent = String(count).padStart(4, '0');
  } catch {
    visitorCount.textContent = '----';
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
    wordIndex: 'Word of the day', wordOverline: 'DAILY LANGUAGE DROP', wordTitle: 'Two words,', wordEmphasis: 'one fresh reset.',
    wordCopy: 'The English pick leans advanced; the Spanish pick stays practical while you build confidence.',
    englishWordLabel: 'Advanced English', spanishWordLabel: 'Spanish practice',
    namiIndex: 'Anime cameos', namiOverline: 'LIVE MODELS', namiTitle: 'Nami dropped by', namiEmphasis: 'the portfolio.',
    namiQuote: 'Hi, it’s Nami... Rachel’s alter ego... err, I mean nickname. Haha. Maybe just one of the many anime favorites she’s watched.',
    killuaFact: 'Fun fact: Killua is also what Rachel named her baby boy... err, her cat, who is absolutely her baby boy and turned one in May.',
    workIndex: 'Selected work', workOverline: 'BUILT WITH INTENTION', workTitle: 'A few things I’ve made.',
    luffyIndex: 'Floating cameo', luffyOverline: 'GEAR 5 ENERGY', luffyTitle: 'Luffy floats in', luffyEmphasis: 'for the side quest.',
    luffyCopy: 'A tiny animated One Piece cameo for the page, because sometimes the portfolio needs a little extra chaos and motion.',
    ipodIndex: 'Now playing', ipodOverline: 'PRESS PLAY', ipodTitle: 'A little soundtrack', ipodEmphasis: 'for the scroll.',
    skillsIndex: 'Toolkit', skillsOverline: 'CURRENTLY LOADING...', skillsTitle: 'Strong foundations.', skillsEmphasis: 'Expanding range.',
    languages: 'Languages', technologies: 'Technologies', concepts: 'Concepts', conceptsCopy: 'Responsive design · Networking · Cybersecurity · Relational databases · OOP · Scrum',
    learningNext: 'Learning next', learningCopy: 'Intelligent systems · Responsible AI · Production machine learning',
    chatIndex: 'Live contact', chatOverline: 'SERIOUS INQUIRIES ONLY', chatTitle: 'Shoot me a message', chatEmphasis: 'if you want to chat.',
    chatCopy: 'Drop a quick note about the opportunity, project, or collaboration. It is styled like a live 3D chat and ready to connect to private SMS delivery.',
    visitorLabel: 'Live page views', visitorSince: 'Counts each loaded visit to xrachelburns.com',
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
    wordIndex: 'Palabras del día', wordOverline: 'DOSIS DIARIA DE LENGUAJE', wordTitle: 'Dos palabras,', wordEmphasis: 'un reinicio fresco.',
    wordCopy: 'La palabra en inglés es más avanzada; la palabra en español se mantiene práctica para ganar confianza.',
    englishWordLabel: 'Inglés avanzado', spanishWordLabel: 'Práctica de español',
    namiIndex: 'Cameos de anime', namiOverline: 'MODELOS EN VIVO', namiTitle: 'Nami pasó por', namiEmphasis: 'el portfolio.',
    namiQuote: 'Hola, soy Nami... el alter ego de Rachel... digo, su apodo. Jaja. Tal vez solo una de sus muchas favoritas de anime.',
    killuaFact: 'Dato curioso: Killua también es el nombre que Rachel le puso a su bebé... digo, a su gato, que definitivamente es su bebé y cumplió un año en mayo.',
    workIndex: 'Proyectos destacados', workOverline: 'HECHO CON INTENCIÓN', workTitle: 'Algunas cosas que he creado.',
    luffyIndex: 'Cameo flotante', luffyOverline: 'ENERGIA GEAR 5', luffyTitle: 'Luffy flota en', luffyEmphasis: 'la side quest.',
    luffyCopy: 'Un pequeno cameo animado de One Piece para la pagina, porque a veces el portfolio necesita un poco mas de caos y movimiento.',
    ipodIndex: 'Sonando ahora', ipodOverline: 'DALE PLAY', ipodTitle: 'Un soundtrack pequeño', ipodEmphasis: 'para scrollear.',
    skillsIndex: 'Herramientas', skillsOverline: 'CARGANDO...', skillsTitle: 'Bases sólidas.', skillsEmphasis: 'Rango en expansión.',
    languages: 'Lenguajes', technologies: 'Tecnologías', concepts: 'Conceptos', conceptsCopy: 'Diseño responsive · Redes · Ciberseguridad · Bases de datos relacionales · OOP · Scrum',
    learningNext: 'Lo próximo', learningCopy: 'Sistemas inteligentes · IA responsable · Machine learning en producción',
    chatIndex: 'Contacto en vivo', chatOverline: 'SOLO CONSULTAS SERIAS', chatTitle: 'Mándame un mensaje', chatEmphasis: 'si quieres hablar.',
    chatCopy: 'Deja una nota breve sobre la oportunidad, proyecto o colaboración. Se ve como un chat 3D en vivo y queda listo para conectar envío privado por SMS.',
    visitorLabel: 'Vistas en vivo', visitorSince: 'Cuenta cada visita cargada a xrachelburns.com',
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

document.querySelector('#year').textContent = new Date().getFullYear();
