// ============================================================
// TERMINAL × EDITORIAL PORTFOLIO — Complete JavaScript
// ============================================================

/* ===== 1. Terminal boot sequence ===== */
(function initBoot() {
  const boot = document.getElementById('boot');
  const lines = document.getElementById('boot-lines');
  if (!boot || !lines) return;

  const messages = [
    ['<strong>Vigitaaaaaa</strong>@purtfolio:~$ ', 'bisaya ako nag loloading...'],
    ['', 'Mga tomboyyyy<span class="ok">about.module</span>... done'],
    ['', 'Bai ako <span class="ok">work.module</span>... done'],
    ['', 'Bisakol ako <span class="ok">contact.module</span>... done'],
    ['', 'Subraaaaaa <span class="ok">/home</span>... done'],
    ['', ''],
    ['<strong>Vigitaaaaaa</strong>@purtfolio:~$ ', '<span class="ok">ready.</span>']
  ];

  const delay = 80;
  messages.forEach(([prompt, text], i) => {
    const div = document.createElement('div');
    div.innerHTML = prompt + text;
    div.style.animationDelay = (delay + i * 180) + 'ms';
    lines.appendChild(div);
  });

  const totalTime = delay + messages.length * 180 + 600;

  function endBoot() {
    boot.classList.add('done');
    setTimeout(() => boot.remove(), 700);
    document.removeEventListener('keydown', endBoot);
    document.removeEventListener('click', endBoot);
  }

  setTimeout(endBoot, totalTime);
  document.addEventListener('keydown', endBoot);
  document.addEventListener('click', endBoot);
})();

/* ===== 2. Text scramble on hero italic word ===== */
(function initScramble() {
  const target = document.querySelector('.scramble');
  if (!target) return;

  const original = target.dataset.word || target.textContent;
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  let frame = 0;
  let rafId = null;
  let isRunning = false;

  function scramble() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < original.length; i++) {
      if (frame > i * 4) {
        output += original[i];
        complete++;
      } else {
        output += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    target.textContent = output;

    if (complete === original.length) {
      isRunning = false;
      cancelAnimationFrame(rafId);
      return;
    }

    frame++;
    rafId = requestAnimationFrame(scramble);
  }

  function startScramble() {
    if (isRunning) return;
    isRunning = true;
    frame = 0;
    scramble();
  }

  // Run once on load
  setTimeout(startScramble, 2000);

  // Run again on hover
  target.addEventListener('mouseenter', startScramble);
})();

/* ===== 3. Project card stack data ===== */
const projects = [
  {
    tag: 'project',
    title: 'Personal Portfolio',
    description: 'This very site — built from scratch with HTML, CSS, and vanilla JavaScript. A small experiment in editorial + terminal aesthetics.',
    tags: ['HTML', 'CSS', 'JavaScript']
  },
  {
    tag: 'project',
    title: 'Database Project',
    description: 'A simple SQL database project built while learning data modeling — user records, clean queries, and a minimal interface.',
    tags: ['SQL', 'HTML', 'CSS']
  },
  {
    tag: 'project',
    title: 'Task Manager',
    description: 'A lightweight task manager that stores everything in the browser. Built to practice state management without any framework.',
    tags: ['JavaScript', 'LocalStorage']
  }
];

/* ===== 4. Card stack interactions ===== */
(function initStack() {
  const stack = document.getElementById('stack');
  const counter = document.getElementById('counter');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  if (!stack) return;

  // Build cards from the list below ONLY if the HTML doesn't already contain them
  if (!stack.querySelector('.stack-card')) projects.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'stack-card';
    card.dataset.index = i;
    card.innerHTML = `
      <span class="sc-tag">${p.tag}</span>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="sc-tags">
        ${p.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    `;
    stack.appendChild(card);
  });

  const cards = [...stack.querySelectorAll('.stack-card')];
  let current = 0;

  function updatePositions() {
    cards.forEach((card, i) => {
      const diff = (i - current + cards.length) % cards.length;
      if (diff === 0)      card.dataset.pos = '0';
      else if (diff === 1) card.dataset.pos = '1';
      else if (diff === 2) card.dataset.pos = '2';
      else                 card.dataset.pos = 'hidden';
    });

    if (counter) counter.textContent = `${current + 1} / ${cards.length}`;
  }

  function next() {
    current = (current + 1) % cards.length;
    updatePositions();
  }

  function prev() {
    current = (current - 1 + cards.length) % cards.length;
    updatePositions();
  }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // Arrow keys
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Drag support
  let startX = 0;
  let isDragging = false;

  stack.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.stack-card')) return;
    startX = e.clientX;
    isDragging = true;
  });

  stack.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const delta = e.clientX - startX;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) next();
    else prev();
  });

  updatePositions();
})();

/* ===== 5. Active nav link on scroll ===== */
(function initNavHighlight() {
  const links = [...document.querySelectorAll('.menu a')];
  const sections = document.querySelectorAll('main section');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) => {
          link.classList.toggle('on', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((s) => observer.observe(s));
})();

/* ===== 6. Contact form ===== */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const msg = form.elements.msg.value.trim();

    if (!name || !email || !msg) {
      if (note) {
        note.className = 'form-note err';
        note.textContent = 'Please fill in all fields.';
      }
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      if (note) {
        note.className = 'form-note err';
        note.textContent = 'Please enter a valid email address.';
      }
      return;
    }

    const body = encodeURIComponent(`${msg}\n\nFrom: ${name}\nEmail: ${email}`);
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    window.location.href = `mailto:kian.songcuan1@gmail.com?subject=${subject}&body=${body}`;

    if (note) {
      note.className = 'form-note';
      note.textContent = 'Opening your email app...';
    }
  });
})();

/* ===== 7. Footer year ===== */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ===== 8. Full-screen viewer for pictures and the resume PDF =====
   Any element with  data-viewer="image"  or  data-viewer="pdf"  opens in the
   viewer, zooming out from where you clicked. Close with ✕, Esc, or by
   clicking the dark area. */
(function initViewer() {
  const viewer = document.getElementById('viewer');
  const stage = document.getElementById('viewer-stage');
  const body = document.getElementById('viewer-body');
  const cap = document.getElementById('viewer-cap');
  const closeBtn = document.getElementById('viewer-close');
  if (!viewer || !stage || !body || !cap || !closeBtn) return;

  const DURATION = 380; // keep in sync with the CSS transition time
  let isOpen = false;
  let settled = false;
  let origin = null;
  let lastFocus = null;
  let finishTimer = null;
  let downX = 0, downY = 0, moved = 0;

  // transform that makes the stage look like the element it came from
  function flip(from) {
    if (!from || !document.body.contains(from)) return '';
    const a = from.getBoundingClientRect();
    const b = stage.getBoundingClientRect();
    if (!a.width || !a.height || !b.width || !b.height) return '';
    const s = Math.max(0.05, Math.min(1, a.width / b.width, a.height / b.height));
    const dx = a.left + a.width / 2 - (b.left + b.width / 2);
    const dy = a.top + a.height / 2 - (b.top + b.height / 2);
    return 'translate(' + dx + 'px, ' + dy + 'px) scale(' + s + ')';
  }

  function finish() {
    finishTimer = null;
    viewer.hidden = true;
    body.replaceChildren();
    stage.style.transition = '';
    stage.style.transform = '';
    stage.style.opacity = '';
    document.body.style.overflow = '';
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  async function open(kind, url, caption, from) {
    if (finishTimer) { clearTimeout(finishTimer); finish(); }
    lastFocus = document.activeElement;
    origin = from;
    settled = false;

    body.className = 'viewer-body ' + kind;
    body.replaceChildren();
    cap.textContent = caption || '';

    let ready = Promise.resolve();
    if (kind === 'image') {
      const img = new Image();
      img.alt = caption || '';
      img.draggable = false;
      ready = new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = () => {
          body.replaceChildren();
          const p = document.createElement('p');
          p.className = 'viewer-error';
          p.textContent = 'Picture not found: ' + url;
          body.appendChild(p);
          resolve();
        };
      });
      img.src = url;
      body.appendChild(img);
    } else {
      const obj = document.createElement('object');
      obj.data = url + '#view=FitH';
      obj.type = 'application/pdf';
      obj.setAttribute('aria-label', caption || 'PDF viewer');
      const fb = document.createElement('div');
      fb.className = 'resume-fallback';
      fb.innerHTML = '<p>Your browser can\'t show the PDF here (this is common on phones).</p>' +
        '<p><a target="_blank" rel="noopener">Open it in a new tab</a> or <a download>download it</a> instead.</p>';
      const links = fb.querySelectorAll('a');
      links[0].href = url;
      links[1].href = url;
      obj.appendChild(fb);
      body.appendChild(obj);
    }

    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    isOpen = true;

    await ready;
    if (!isOpen) return; // closed while the picture was loading

    // start state: shrunk down onto the thing that was clicked
    stage.style.transition = 'none';
    stage.style.transform = 'none';
    const start = flip(from);
    stage.style.transform = start || 'scale(.94)';
    stage.style.opacity = start ? '.15' : '0';
    void stage.offsetWidth; // apply the start state before animating
    stage.style.transition = '';
    stage.style.transform = '';
    stage.style.opacity = '';
    viewer.classList.add('open');
    closeBtn.focus({ preventScroll: true });
    setTimeout(() => { settled = true; }, DURATION);
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    const end = settled ? flip(origin) : '';
    stage.style.transform = end || 'scale(.94)';
    viewer.classList.remove('open');
    finishTimer = setTimeout(finish, DURATION);
  }

  /* ----- open: any element with data-viewer ----- */
  function openFrom(trigger) {
    const kind = trigger.dataset.viewer === 'pdf' ? 'pdf' : 'image';
    const img = trigger.querySelector('img');
    const url = trigger.dataset.src ||
      (kind === 'image' && img ? img.getAttribute('src') : trigger.getAttribute('href'));
    if (!url) return;
    const caption = trigger.dataset.caption || (img ? img.alt : '');
    open(kind, url, caption, trigger);
  }

  // remember pointer movement so dragging a project card doesn't open the viewer
  document.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY; moved = 0; }, true);
  document.addEventListener('pointerup', (e) => { moved = Math.hypot(e.clientX - downX, e.clientY - downY); }, true);

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-viewer]');
    if (!trigger) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let "open in new tab" shortcuts work
    const card = trigger.closest('.stack-card');
    if (card && (card.dataset.pos !== '0' || moved > 8)) return;
    e.preventDefault();
    openFrom(trigger);
  });

  // keyboard: Enter / Space on a focused picture
  document.addEventListener('keydown', (e) => {
    if (isOpen) return;
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('figure[data-viewer]')) {
      e.preventDefault();
      openFrom(e.target);
    }
  });

  /* ----- close ----- */
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer || e.target.classList.contains('viewer-backdrop') || e.target.closest('#viewer-close')) {
      close();
    }
  });

  // runs before the card-stack arrow keys so they don't flip cards behind the viewer
  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.stopPropagation(); return; }
    if (e.key === 'Tab') {
      const items = [...viewer.querySelectorAll('button, a[href]')];
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (!viewer.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, true);
})();