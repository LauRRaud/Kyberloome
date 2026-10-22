// The notch at the top of the page behaves like the app's. It opens while the pointer is on it
// (with a short grace period on leaving); a click shows the reset times, which go again when it
// closes. It can be dragged: along the top edge, off it to anywhere, or against the left or right
// edge, where it sits flush and stands upright - with the app's own distances for joining and
// leaving an edge. The place is remembered in this browser. On a touch screen a tap opens it,
// the next tap shows the times, a tap elsewhere closes it.
(function () {
  var notch = document.getElementById('notch');
  var hint = document.getElementById('try');
  var rowMini = notch.querySelector('.lay.row .notch-mini'), rowFull = notch.querySelector('.lay.row .notch-full');
  var stackMini = notch.querySelector('.lay.stack .notch-mini'), stackFull = notch.querySelector('.lay.stack .notch-full');
  // Pulled this far from the edge it is on, it comes off; closer than ATTACH to an edge, it joins it.
  var DETACH = 14, ATTACH = 6;
  var PLACE_KEY = 'limitnotch-place';
  var loaded = Date.now();
  var size = {};
  var open = false, times = false;
  var closeTimer = 0, morphTimer = 0, drag = null, dragged = false;

  // "Try it": three short steps under the panel - open it, click for the times, drag it - each
  // worded once the one before is done; gone after the drag.
  var say = hint && hint.querySelector('.say');
  var steps = window.matchMedia('(hover: none)').matches
    ? ['Try it', 'Tap again', 'Drag it']
    : ['Try it', 'Click it', 'Drag it'];
  var step = 0, swapTimer = 0;
  if (say) say.textContent = steps[0];
  function reach(n) {
    if (!hint || n <= step) return;
    step = n;
    if (step >= steps.length) { hint.classList.add('seen'); return; }
    hint.classList.add('swap');
    clearTimeout(swapTimer);
    swapTimer = setTimeout(function () { say.textContent = steps[step]; hint.classList.remove('swap'); }, 180);
  }

  function viewport() { return { w: document.documentElement.clientWidth, h: window.innerHeight }; }
  // Where it is: on the top edge, against the left or right edge, or loose; x is its centre, y its top.
  var at = { dock: 'top', x: viewport().w / 2, y: 0 };
  try {
    var saved = JSON.parse(localStorage.getItem(PLACE_KEY));
    if (saved && /^(top|left|right|loose)$/.test(saved.dock)) {
      var v = viewport();
      at = { dock: saved.dock, x: saved.x * v.w, y: saved.y * v.h };
    }
  } catch (e) { /* no storage: it starts on the top edge */ }
  function save() {
    try {
      var v = viewport();
      localStorage.setItem(PLACE_KEY, JSON.stringify({ dock: at.dock, x: at.x / v.w, y: at.y / v.h }));
    } catch (e) { /* not remembered, nothing else lost */ }
  }

  // The countdowns run, as the real ones do.
  function remaining(minutes) {
    if (minutes < 60) return Math.max(1, Math.floor(minutes)) + 'm';
    if (minutes < 1440) return Math.floor(minutes / 60) + 'h ' + Math.floor(minutes % 60) + 'm';
    return Math.floor(minutes / 1440) + 'd ' + Math.floor((minutes % 1440) / 60) + 'h';
  }
  function tick() {
    var passed = (Date.now() - loaded) / 60000;
    Array.prototype.forEach.call(notch.querySelectorAll('.time[data-minutes]'), function (cell) {
      cell.lastElementChild.textContent = remaining(cell.getAttribute('data-minutes') - passed);
    });
  }

  function side() { return at.dock === 'left' || at.dock === 'right'; }
  function current() {
    if (!open) return side() ? size.stackClosed : size.rowClosed;
    if (side()) return times ? size.stackTimes : size.stackOpen;
    return times ? size.rowTimes : size.rowOpen;
  }
  // Puts the panel where `at` says, at its current size, inside the window.
  function layout() {
    var v = viewport(), s = current(), left, top = 0;
    if (at.dock === 'left') left = 0;
    else if (at.dock === 'right') left = v.w - s[0];
    else left = Math.max(0, Math.min(v.w - s[0], at.x - s[0] / 2));
    if (at.dock !== 'top') top = Math.max(0, Math.min(v.h - s[1], at.y));
    notch.style.left = left + 'px';
    notch.style.top = top + 'px';
    notch.style.width = s[0] + 'px';
    notch.style.height = s[1] + 'px';
    if (hint) { hint.style.left = left + s[0] / 2 + 'px'; hint.style.top = s[1] + 6 + 'px'; }
    notch.classList.toggle('open', open);
    notch.classList.toggle('times', times);
    notch.classList.toggle('side', side());
    notch.classList.toggle('left', at.dock === 'left');
    notch.classList.toggle('right', at.dock === 'right');
    notch.classList.toggle('loose', at.dock === 'loose');
    notch.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  // The panel's top centre as it now stands, after any fitting into the window.
  function standing() {
    return { x: parseFloat(notch.style.left) + current()[0] / 2, y: parseFloat(notch.style.top) };
  }

  // Its sizes in both layouts come from the content, as in the app; measured without motion.
  function measure() {
    notch.classList.add('measure', 'times');
    var rowTimes = rowFull.offsetWidth, stackTimes = stackFull.offsetWidth;
    notch.classList.remove('times');
    size.rowClosed = [rowMini.offsetWidth + 32, 29];
    size.rowOpen = [rowFull.offsetWidth + 32, rowFull.offsetHeight + 22];
    size.rowTimes = [rowTimes + 32, size.rowOpen[1]];
    size.stackClosed = [stackMini.offsetWidth + 32, stackMini.offsetHeight + 16];
    size.stackOpen = [stackFull.offsetWidth + 32, stackFull.offsetHeight + 22];
    size.stackTimes = [stackTimes + 32, size.stackOpen[1]];
    layout();
    void notch.offsetWidth;
    notch.classList.remove('measure');
  }

  function setOpen(value) {
    clearTimeout(closeTimer);
    if (open === value) return;
    open = value;
    if (!open) times = false;
    layout();
    if (open) reach(1);
  }
  function closeSoon() { closeTimer = setTimeout(function () { setOpen(false); }, 160); }

  function near(edge, distance) { return distance < (at.dock === edge ? DETACH : ATTACH); }
  // One step of a drag, the pointer at (cx, cy). The top edge wins in a corner.
  function dragTo(cx, cy) {
    var v = viewport(), s = current(), before = at.dock;
    var x = cx - drag.grab.x, y = cy - drag.grab.y;
    var dock = near('top', y) ? 'top'
      : near('left', x - s[0] / 2) ? 'left'
      : near('right', v.w - (x + s[0] / 2)) ? 'right'
      : 'loose';
    at = { dock: dock, x: x, y: y };
    if (dock === before) { layout(); return; }
    // Off a side edge it is wider again: it starts clear of that edge.
    if (dock === 'loose') {
      var half = current()[0] / 2;
      if (before === 'right') at.x = Math.min(at.x, v.w - DETACH - half);
      if (before === 'left') at.x = Math.max(at.x, DETACH + half);
    }
    notch.classList.add('morph');
    clearTimeout(morphTimer);
    morphTimer = setTimeout(function () { notch.classList.remove('morph'); }, 230);
    layout();
    // The hold is taken anew on the panel as it now is, so its jump is not taken for a pull away.
    var p = standing();
    drag.grab = { x: cx - p.x, y: cy - p.y };
  }

  notch.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') setOpen(true); });
  notch.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !drag) closeSoon(); });
  notch.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    var p = standing();
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, grab: { x: e.clientX - p.x, y: e.clientY - p.y } };
    try { notch.setPointerCapture(e.pointerId); } catch (err) { /* drags then end at the edge of the panel */ }
  });
  notch.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved && Math.abs(e.clientX - drag.x0) < 4 && Math.abs(e.clientY - drag.y0) < 4) return;
    if (!drag.moved) {
      drag.moved = true;
      notch.classList.add('dragging');
      reach(3);
    }
    dragTo(e.clientX, e.clientY);
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.moved) { dragged = true; save(); }
    drag = null;
    notch.classList.remove('dragging', 'morph');
    // Let go outside the panel: it closes, as when the pointer leaves it.
    if (e.pointerType === 'mouse' && !notch.matches(':hover')) closeSoon();
  }
  notch.addEventListener('pointerup', endDrag);
  notch.addEventListener('pointercancel', endDrag);
  notch.addEventListener('click', function () {
    // The end of a drag is no click.
    if (dragged) { dragged = false; return; }
    if (!open) setOpen(true);
    else { times = !times; layout(); if (times) reach(2); }
  });
  // From the keyboard: opens on focus, closes on leaving; Enter or Space shows the times.
  notch.addEventListener('focus', function () { if (notch.matches(':focus-visible')) setOpen(true); });
  notch.addEventListener('blur', closeSoon);
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' && !notch.contains(e.target)) setOpen(false);
  });
  window.addEventListener('resize', layout);

  if (at.dock !== 'top' && hint) hint.classList.add('seen');
  tick();
  setInterval(tick, 30000);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  else measure();

  // Sections come in as they are reached.
  var sections = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(sections, function (s) { s.classList.add('in'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  Array.prototype.forEach.call(sections, function (s) { observer.observe(s); });
})();

// How it works: the same panel on a small screen, used by a cursor, step by step, in a loop.
// The screen is a 1100 x 687.5 desktop scaled to fit, so the panel keeps the app's sizes.
(function () {
  var screen = document.getElementById('screen');
  if (!screen) return;
  var section = screen.closest('section');
  var desk = document.getElementById('desk');
  var dn = document.getElementById('dn');
  var cur = document.getElementById('dcur');
  var ring = document.getElementById('ring');
  var caption = document.getElementById('caption');
  var steps = section.querySelectorAll('.steps b');
  var W = 1100, H = 687.5, TASKBAR = 48;

  function fit() { desk.style.setProperty('--s', screen.clientWidth / W); }
  fit();
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(screen);
  else window.addEventListener('resize', fit);

  // The panel's sizes in each layout, from its own content.
  var size = {};
  function measure() {
    var row = dn.querySelector('.lay.row'), stack = dn.querySelector('.lay.stack');
    var rowMini = row.querySelector('.notch-mini'), rowFull = row.querySelector('.notch-full');
    var stackMini = stack.querySelector('.notch-mini'), stackFull = stack.querySelector('.notch-full');
    dn.classList.add('measure', 'times');
    var withTimes = rowFull.offsetWidth;
    dn.classList.remove('times');
    size.rowClosed = [rowMini.offsetWidth + 32, 29];
    size.rowOpen = [rowFull.offsetWidth + 32, rowFull.offsetHeight + 22];
    size.rowTimes = [withTimes + 32, rowFull.offsetHeight + 22];
    size.stackClosed = [stackMini.offsetWidth + 32, stackMini.offsetHeight + 16];
    size.stackOpen = [stackFull.offsetWidth + 32, stackFull.offsetHeight + 22];
    void dn.offsetWidth;
    dn.classList.remove('measure');
  }

  // Where the panel is: on the top edge, against the right edge, or loose (its top centre at x, y).
  var panel;
  function show(ms) {
    var side = panel.dock === 'right';
    var s = side ? (panel.open ? size.stackOpen : size.stackClosed)
      : panel.open ? (panel.times ? size.rowTimes : size.rowOpen) : size.rowClosed;
    var left = side ? W - s[0] : Math.max(0, Math.min(W - s[0], panel.x - s[0] / 2));
    var top = panel.dock === 'top' ? 0 : Math.max(0, Math.min(H - TASKBAR - s[1], panel.y));
    dn.style.setProperty('--d', (ms || 420) + 'ms');
    dn.style.width = s[0] + 'px';
    dn.style.height = s[1] + 'px';
    dn.style.left = left + 'px';
    dn.style.top = top + 'px';
    dn.classList.toggle('open', panel.open);
    dn.classList.toggle('times', panel.times);
    dn.classList.toggle('side', side);
    dn.classList.toggle('right', side);
    dn.classList.toggle('loose', panel.dock === 'loose');
  }

  var cursorAt = { x: 860, y: 540 };
  function cursor(x, y, ms) {
    cursorAt = { x: x, y: y };
    cur.style.setProperty('--d', ms + 'ms');
    // The arrow's tip is its top-left corner.
    cur.style.setProperty('--x', (x - 1) + 'px');
    cur.style.setProperty('--y', (y - 1) + 'px');
  }
  function click() {
    ring.style.setProperty('--x', cursorAt.x + 'px');
    ring.style.setProperty('--y', cursorAt.y + 'px');
    ring.classList.remove('go');
    void ring.offsetWidth;
    ring.classList.add('go');
  }
  // The cursor takes the panel along: both arrive together.
  function drag(x, y, place, ms) {
    panel.dock = place.dock;
    if (place.x !== undefined) panel.x = place.x;
    if (place.y !== undefined) panel.y = place.y;
    cursor(x, y, ms);
    show(ms);
  }
  // Joining or leaving an edge where the panel is: one short glide, the new layout fading in.
  function dock(place) {
    panel.dock = place.dock;
    if (place.x !== undefined) panel.x = place.x;
    if (place.y !== undefined) panel.y = place.y;
    dn.classList.add('morph');
    show(220);
    return wait(240).then(function () { dn.classList.remove('morph'); });
  }

  // Step n of four: its bar fills for as long as the step lasts.
  function step(n, text, ms) {
    Array.prototype.forEach.call(steps, function (bar, i) {
      bar.style.transition = 'none';
      bar.style.width = i < n - 1 ? '100%' : '0';
      if (i === n - 1) {
        void bar.offsetWidth;
        bar.style.transition = 'width ' + ms + 'ms linear';
        bar.style.width = '100%';
      }
    });
    caption.classList.add('out');
    setTimeout(function () { caption.innerHTML = text; caption.classList.remove('out'); }, 300);
  }
  function word(i) {
    Array.prototype.forEach.call(caption.querySelectorAll('.w'), function (w, j) { w.classList.toggle('on', j === i); });
  }

  // The loop waits while the screen is out of view.
  var visible = false, resume = null;
  function wait(ms) {
    return new Promise(function (done) { setTimeout(done, ms); }).then(function () {
      if (visible) return;
      return new Promise(function (done) { resume = done; });
    });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && resume) { var go = resume; resume = null; go(); }
    }, { threshold: 0.2 }).observe(section);
  } else visible = true;

  async function play() {
    for (;;) {
      panel = { dock: 'top', open: false, times: false, x: W / 2, y: 0 };
      show(0);
      cur.classList.remove('on');
      cursor(860, 540, 0);

      // 1. The bars at the top edge: the limits at a glance.
      step(1, 'Glance.', 2600);
      await wait(900);
      cur.classList.add('on');
      await wait(1700);

      // 2. Hover: the numbers.
      step(2, 'Hover for the numbers.', 3000);
      cursor(W / 2, 14, 1100);
      await wait(1150);
      panel.open = true; show();
      await wait(1850);

      // 3. Click: the time until each limit resets.
      step(3, 'Click for the reset times.', 3100);
      click(); panel.times = true; show();
      await wait(2600);
      click(); panel.times = false; show();
      await wait(500);

      // 4. Drag it. Pulled down it comes off the top edge; at the right edge it joins it and
      //    stands upright; from there out onto the screen; and back up to the top edge.
      step(4, '<span class="w">Top.</span> <span class="w">Side.</span> <span class="w">Anywhere.</span>', 13800);
      await wait(350);
      word(0);
      await wait(450);
      cursor(W / 2, 32, 220);
      await dock({ dock: 'loose', x: W / 2, y: 18 });
      drag(762, 184, { dock: 'loose', x: 762, y: 170 }, 650);
      await wait(650);
      var edge = W - 12 - size.rowOpen[0] / 2;
      drag(edge, 214, { dock: 'loose', x: edge, y: 200 }, 550);
      await wait(560);
      word(1);
      await dock({ dock: 'right', y: 200 });
      await wait(860);
      cursor(860, 430, 700);
      await wait(250);
      panel.open = false; show();
      await wait(1150);
      cursor(W - 40, 222, 800);
      await wait(820);
      panel.open = true; show();
      await wait(550);
      var off = W - 16 - size.rowOpen[0] / 2;
      await dock({ dock: 'loose', x: off, y: 200 });
      drag(420 + (W - 40 - off), 362, { dock: 'loose', x: 420, y: 340 }, 850);
      word(2);
      await wait(1000);
      cursor(660, 560, 700);
      await wait(250);
      panel.open = false; show();
      await wait(1300);
      cursor(420, 354, 800);
      await wait(820);
      panel.open = true; show();
      await wait(550);
      drag(W / 2, 22, { dock: 'loose', x: W / 2, y: 8 }, 800);
      await wait(810);
      word(0);
      cursor(W / 2, 14, 220);
      await dock({ dock: 'top', x: W / 2, y: 0 });
      await wait(760);
      cursor(800, 430, 800);
      await wait(250);
      panel.open = false; show();
      await wait(1400);
      cur.classList.remove('on');
      await wait(500);
    }
  }

  measure();
  panel = { dock: 'top', open: false, times: false, x: W / 2, y: 0 };
  show(0);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // No motion: the open panel with its reset times, standing still.
    panel.open = true; panel.times = true; show(0);
    caption.textContent = 'Hover for the numbers. Click for the reset times.';
    return;
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); play(); });
  else play();
})();

// The trip: scrolling travels through the page's four screens - right, down, then left - with a
// short stay at each. The page is as tall as the trip; the screens stay put while the view moves
// over them. The squares in the corner show where you are and take you to a screen.
(function () {
  var world = document.getElementById('world');
  var plane = document.getElementById('plane');
  if (!world || !plane || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var squares = document.querySelectorAll('#map button');
  var notch = document.getElementById('notch');
  document.documentElement.classList.add('travel');

  // The screens in the order of the trip, and how long (in screen heights of scrolling) it stays.
  var stops = [
    { at: [0, 0], stay: 0.05 },
    { at: [1, 0], stay: 0.35 },
    { at: [1, 1], stay: 0.2 },
    { at: [0, 1], stay: 0.3 }
  ];
  var MOVE = 0.6;
  var length = stops.reduce(function (n, s) { return n + s.stay; }, 0) + MOVE * (stops.length - 1);
  function size() { world.style.height = (length + 1) * window.innerHeight + 'px'; }
  size();

  // Soft at both ends, but moving from the first bit of scrolling.
  function ease(t) { return t * t * (3 - 2 * t); }
  // Where the view should be, `p` screen heights into the trip.
  function where(p) {
    for (var i = 0; i < stops.length; i++) {
      if (p <= stops[i].stay || i === stops.length - 1) return { x: stops[i].at[0], y: stops[i].at[1], stop: i };
      p -= stops[i].stay;
      if (p < MOVE) {
        var t = ease(p / MOVE), a = stops[i].at, b = stops[i + 1].at;
        return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, stop: t < 0.5 ? i : i + 1 };
      }
      p -= MOVE;
    }
  }
  // The scroll position at the middle of a screen's stay.
  function startOf(i) {
    var p = 0;
    for (var j = 0; j < i; j++) p += stops[j].stay + MOVE;
    return (p + stops[i].stay / 2) * window.innerHeight;
  }

  // The view follows the scroll with a little give, so the travel stays smooth.
  var x = 0, y = 0, running = false, last = 0, shown = -1;
  function frame(now) {
    var target = where(window.scrollY / window.innerHeight);
    var k = last ? 1 - Math.pow(1 - 0.16, (now - last) / 16.7) : 1;
    last = now;
    x += (target.x - x) * k;
    y += (target.y - y) * k;
    var settled = Math.abs(target.x - x) < 0.0005 && Math.abs(target.y - y) < 0.0005;
    if (settled) { x = target.x; y = target.y; }
    // In halves of the ground (which is two screens wide and high), so it needs no measuring.
    plane.style.transform = 'translate3d(' + (-x * 50) + '%,' + (-y * 50) + '%,0)';
    // Nearer the demo's screen than any other, the live panel steps aside.
    notch.classList.toggle('away', x > 0.5 && y < 0.5);
    if (target.stop !== shown) {
      shown = target.stop;
      Array.prototype.forEach.call(squares, function (b) { b.classList.toggle('on', +b.getAttribute('data-stop') === shown); });
    }
    if (settled) { running = false; last = 0; return; }
    requestAnimationFrame(frame);
  }
  function wake() { if (!running) { running = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', wake, { passive: true });
  window.addEventListener('resize', function () { size(); wake(); });
  Array.prototype.forEach.call(squares, function (b) {
    b.addEventListener('click', function () {
      window.scrollTo({ top: startOf(+b.getAttribute('data-stop')), behavior: 'smooth' });
    });
  });
  // Arriving from a link or a reload part-way: start where the scroll already is.
  var first = where(window.scrollY / window.innerHeight);
  x = first.x; y = first.y;
  wake();
})();

// The ground under the screens is code - faint lines of it, indented as code is, which move with
// the screens. Around the pointer it lights up, decoding out of other characters, and fades once
// the pointer has moved on; never under a button or the panel, whose glass would show it. A Store
// button is pulled a little towards the pointer. The lighting only with a mouse, and not when
// less motion is wanted.
(function () {
  var plane = document.getElementById('plane');
  if (!plane) return;
  var CODE = [
    'const usage = await claude.usage();',
    'for (const limit of usage.limits) {',
    '  const left = limit.max - limit.used;',
    '  notch.bar(limit.name).fill(limit.used / limit.max);',
    '  if (left < limit.max * 0.1) notch.warn(limit.name);',
    '}',
    '',
    "codex.on('rate_limits', (r) => {",
    "  notch.bar('30d').fill(r.primary.used_percent / 100);",
    "  notch.time('30d', r.primary.resets_at);",
    '});',
    '',
    '// nothing here leaves this machine',
    'function resetIn(at) {',
    '  const m = Math.max(0, at - Date.now()) / 60000;',
    "  return m < 60 ? (m | 0) + 'm' : (m / 60 | 0) + 'h';",
    '}',
    ''
  ];
  var KEYWORDS = /\b(const|for|of|if|await|function|return)\b/g;
  // Per line, which letters are keywords and whether it is a comment.
  var kinds = CODE.map(function (line) {
    var marks = [], m;
    if (/^\s*\/\//.test(line)) { for (var i = 0; i < line.length; i++) marks[i] = 'note'; return marks; }
    KEYWORDS.lastIndex = 0;
    while ((m = KEYWORDS.exec(line))) for (var j = m.index; j < m.index + m[0].length; j++) marks[j] = 'word';
    return marks;
  });
  // A letter cell is CW by LH; the code comes in blocks BLOCK letters wide, each of the three in
  // a row a few lines further on, and the three repeat.
  var CW = 8, LH = 18, BLOCK = 64, BLOCKS = 3, SHIFT = 6;
  var FONT = '"Cascadia Mono", Consolas, ui-monospace, monospace';
  function letter(c, r) {
    var block = Math.floor(c / BLOCK), k = c - block * BLOCK - 3;
    var n = ((r + (block % BLOCKS) * SHIFT) % CODE.length + CODE.length) % CODE.length;
    var line = CODE[n];
    if (k < 0 || k >= line.length || line.charAt(k) === ' ') return null;
    return { ch: line.charAt(k), kind: kinds[n][k] };
  }

  // The faint ground: one tile of it as a picture, repeated over the plane.
  var tw = BLOCK * BLOCKS * CW, th = CODE.length * LH, parts = { plain: [], word: [], note: [] };
  for (var r = 0; r < CODE.length; r++)
    for (var c = 0; c < BLOCK * BLOCKS; c++) {
      var l = letter(c, r);
      if (l) parts[l.kind || 'plain'].push({ x: (c + 0.5) * CW, y: (r + 0.5) * LH, ch: l.ch });
    }
  function esc(ch) { return ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch; }
  // One <text> per line and kind, each letter at its own place.
  function texts(list, fill, alpha) {
    var rows = {}, out = '';
    list.forEach(function (g) { (rows[g.y] = rows[g.y] || []).push(g); });
    Object.keys(rows).forEach(function (y) {
      var row = rows[y];
      out += '<text y="' + y + '" x="' + row.map(function (g) { return g.x; }).join(' ') + '" fill="' + fill + '" fill-opacity="' + alpha + '">' + row.map(function (g) { return esc(g.ch); }).join('') + '</text>';
    });
    return out;
  }
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + tw + '" height="' + th + '">'
    + '<g font-family=\'' + FONT + '\' font-size="12" font-weight="500" text-anchor="middle" dominant-baseline="central">'
    + texts(parts.plain, '#fff', .045) + texts(parts.word, '#f0883e', .07) + texts(parts.note, '#fff', .03)
    + '</g></svg>';
  plane.style.backgroundImage = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  plane.style.backgroundSize = tw + 'px ' + th + 'px';

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var NOISE = '01{}[]()<>/=+-*;:#$&|~%?!abcdefx';
  var RADIUS = 110, LIFE = 1200;
  var canvas = document.createElement('canvas');
  canvas.className = 'code';
  canvas.setAttribute('aria-hidden', 'true');
  // First in the stage, so the screens and their words lie over it.
  var stage = document.querySelector('.stage');
  stage.insertBefore(canvas, stage.firstChild);
  var ctx = canvas.getContext('2d');
  // The glass it must not show through: the buttons and the panel.
  var glass = Array.prototype.slice.call(document.querySelectorAll('.store, #notch'));
  var cells = new Map(), running = false, last = 0, lx = null, ly = null;

  function size() {
    var k = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(window.innerWidth * k);
    canvas.height = Math.round(window.innerHeight * k);
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.font = '500 12px ' + FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }
  size();
  window.addEventListener('resize', size);

  // The cells around (x, y) on the window come up: the nearer, the brighter. Cells are kept in
  // the plane's own places, so they travel with it.
  function touch(x, y) {
    var o = plane.getBoundingClientRect(), px = x - o.left, py = y - o.top;
    for (var r = Math.max(0, Math.floor((py - RADIUS) / LH)); r <= Math.floor((py + RADIUS) / LH); r++)
      for (var c = Math.max(0, Math.floor((px - RADIUS) / CW)); c <= Math.floor((px + RADIUS) / CW); c++) {
        var dx = (c + 0.5) * CW - px, dy = (r + 0.5) * LH - py;
        var near = 1 - Math.sqrt(dx * dx + dy * dy) / RADIUS;
        if (near <= 0) continue;
        var key = r * 100000 + c, cell = cells.get(key);
        if (cell) { if (near > cell.life) cell.life = near; continue; }
        var l = letter(c, r);
        if (!l) continue;
        // It decodes: a few other characters first.
        cells.set(key, { x: (c + 0.5) * CW, y: (r + 0.5) * LH, ch: l.ch, kind: l.kind, life: near, noise: 3 + (Math.random() * 6 | 0) });
      }
  }
  function frame(now) {
    var dt = last ? now - last : 16.7;
    last = now;
    var o = plane.getBoundingClientRect();
    var keep = glass.map(function (el) { var b = el.getBoundingClientRect(); return [b.left - 10, b.top - 8, b.right + 10, b.bottom + 8]; });
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    cells.forEach(function (cell, key) {
      cell.life -= dt / LIFE;
      if (cell.life <= 0) { cells.delete(key); return; }
      var x = o.left + cell.x, y = o.top + cell.y;
      for (var i = 0; i < keep.length; i++) if (x > keep[i][0] && x < keep[i][2] && y > keep[i][1] && y < keep[i][3]) return;
      var a = Math.pow(cell.life, 1.3), ch = cell.ch;
      if (cell.noise > 0) { cell.noise--; ch = NOISE.charAt(Math.random() * NOISE.length | 0); }
      ctx.fillStyle = cell.noise > 0 ? 'rgba(240,136,62,' + (a * 0.55).toFixed(3) + ')'
        : cell.kind === 'word' ? 'rgba(240,136,62,' + (a * 0.75).toFixed(3) + ')'
        : cell.kind === 'note' ? 'rgba(255,255,255,' + (a * 0.28).toFixed(3) + ')'
        : 'rgba(255,255,255,' + (a * 0.5).toFixed(3) + ')';
      ctx.fillText(ch, x, y);
    });
    if (!cells.size) { running = false; last = 0; return; }
    requestAnimationFrame(frame);
  }
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var x = e.clientX, y = e.clientY;
    // A quick move leaves no gaps: the way from the last point is touched along its length.
    if (lx !== null) {
      var steps = Math.min(12, Math.ceil(Math.hypot(x - lx, y - ly) / 24));
      for (var i = 1; i < steps; i++) touch(lx + (x - lx) * i / steps, ly + (y - ly) * i / steps);
    }
    touch(x, y);
    lx = x; ly = y;
    if (!running) { running = true; requestAnimationFrame(frame); }
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { lx = ly = null; });

  // The Store buttons.
  Array.prototype.forEach.call(document.querySelectorAll('.cta'), function (cta) {
    var button = cta.querySelector('.store');
    cta.addEventListener('pointermove', function (e) {
      var b = button.getBoundingClientRect();
      var dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
      cta.classList.add('pull');
      cta.style.translate = (dx * 0.12).toFixed(1) + 'px ' + (dy * 0.18).toFixed(1) + 'px';
      button.style.translate = (dx * 0.06).toFixed(1) + 'px ' + (dy * 0.08).toFixed(1) + 'px';
    });
    cta.addEventListener('pointerleave', function () {
      cta.classList.remove('pull');
      cta.style.translate = '';
      button.style.translate = '';
    });
  });
})();

// Words that come in like an AI's: the tagline streams in, a few letters at a time, with a caret;
// some lines decode out of code characters when they are reached; and on the demo's desktop a
// terminal shows an AI at work. With less motion wanted, all of it is simply there.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function wait(ms) { return new Promise(function (done) { setTimeout(done, ms); }); }

  // The tagline, in pieces the size of a model's tokens.
  var tagline = document.querySelector('.tagline');
  var TOKENS = ['Your', ' AI', ' lim', 'its.', ' Always', ' in', ' sight.'];
  if (tagline && TOKENS.join('') === tagline.textContent) {
    tagline.textContent = '';
    var pieces = TOKENS.map(function (t) {
      var span = document.createElement('span');
      span.className = 'tk';
      span.textContent = t;
      tagline.appendChild(span);
      return span;
    });
    var caret = document.createElement('span');
    caret.className = 'caret';
    tagline.insertBefore(caret, pieces[0]);
    (async function () {
      await wait(700);
      for (var i = 0; i < pieces.length; i++) {
        pieces[i].classList.add('on');
        pieces[i].after(caret);
        await wait(70 + Math.random() * 90);
      }
      await wait(2200);
      caret.classList.add('gone');
    })();
  }

  // Lines that decode as they come into view: each letter in turn, out of code characters.
  var NOISE = '01{}[]<>/=+*#$%&;:abcdefx';
  function decode(el) {
    var text = el.textContent, letters = Array.from(text);
    el.classList.add('decoding');
    el.textContent = '';
    var spans = letters.map(function (ch) {
      var span = document.createElement('span');
      span.textContent = ch;
      el.appendChild(span);
      return span;
    });
    // Each keeps the width of its own letter, so the line stands still while it changes.
    var widths = spans.map(function (span) { return span.getBoundingClientRect().width; });
    spans.forEach(function (span, i) { span.style.width = widths[i] + 'px'; });
    var start = performance.now(), length = 650;
    function frame(now) {
      var t = now - start, done = true;
      spans.forEach(function (span, i) {
        if (letters[i] === ' ' || span.done) return;
        if (t >= 120 + i / letters.length * length) { span.textContent = letters[i]; span.className = ''; span.done = true; return; }
        done = false;
        span.className = 'g';
        if (Math.random() < 0.4) span.textContent = NOISE.charAt(Math.random() * NOISE.length | 0);
      });
      if (!done) { requestAnimationFrame(frame); return; }
      el.classList.remove('decoding');
      el.textContent = text;
    }
    requestAnimationFrame(frame);
  }
  var lines = document.querySelectorAll('[data-decode]');
  if ('IntersectionObserver' in window) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        seen.unobserve(entry.target);
        decode(entry.target);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(lines, function (el) { seen.observe(el); });
  }

  // The terminal: a short session, typed and answered, again and again while it is in view.
  var term = document.getElementById('term');
  if (!term) return;
  var SESSION = [
    ['you', 'add a retry to the sync job'],
    ['tool', 'Read src/sync.ts'],
    ['tool', 'Edit src/sync.ts  +18 \u22123'],
    ['tool', 'Bash npm test'],
    ['dim', '  42 passed'],
    ['say', 'Done. A failed sync now retries three times.'],
    ['you', 'write the changelog entry'],
    ['tool', 'Edit CHANGELOG.md  +4'],
    ['say', 'Added under 1.4.0.']
  ];
  var visible = false, resume = null;
  function ready() { return visible ? Promise.resolve() : new Promise(function (done) { resume = done; }); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && resume) { var go = resume; resume = null; go(); }
    }).observe(term);
  } else visible = true;
  function line(kind, text) {
    var p = document.createElement('p');
    p.className = kind;
    p.textContent = text;
    term.appendChild(p);
    // Lines pushed out at the top are no longer needed.
    while (term.children.length > 14) term.removeChild(term.firstChild);
    return p;
  }
  (async function () {
    for (;;) {
      for (var i = 0; i < SESSION.length; i++) {
        await ready();
        var kind = SESSION[i][0], text = SESSION[i][1];
        if (kind === 'you') {
          await wait(900);
          var p = line('you typing', '');
          for (var k = 1; k <= text.length; k++) { p.textContent = text.slice(0, k); await wait(32 + Math.random() * 40); }
          await wait(350);
          p.classList.remove('typing');
          await wait(500);
        } else {
          line(kind, text);
          await wait(kind === 'tool' ? 650 : 450);
        }
      }
      await wait(2600);
      term.classList.add('out');
      await wait(600);
      term.textContent = '';
      term.classList.remove('out');
    }
  })();
})();

// The pointer itself: a caret, as in a terminal, and a ring that follows a moment later. The
// caret blinks while the pointer rests; over what can be clicked or dragged the ring opens around
// it. Only with a mouse; with less motion wanted the ring keeps up at once.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var root = document.documentElement;
  var notch = document.getElementById('notch');
  var caret = document.createElement('div'), ring = document.createElement('div');
  caret.className = 'cur-caret';
  ring.className = 'cur-ring';
  ring.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.4"/></svg>';
  [ring, caret].forEach(function (el) { el.setAttribute('aria-hidden', 'true'); document.body.appendChild(el); });
  root.classList.add('own-cursor');
  var GIVE = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.2;
  var x = 0, y = 0, rx = 0, ry = 0, running = false, last = 0, idleTimer = 0, placed = false;

  function frame(now) {
    var k = last ? 1 - Math.pow(1 - GIVE, (now - last) / 16.7) : GIVE;
    last = now;
    rx += (x - rx) * k;
    ry += (y - ry) * k;
    var settled = Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1;
    if (settled) { rx = x; ry = y; }
    // Placed with translate, so the ring's own scale leaves its place alone.
    ring.style.translate = rx + 'px ' + ry + 'px';
    if (settled) { running = false; last = 0; return; }
    requestAnimationFrame(frame);
  }
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!placed) { placed = true; rx = x; ry = y; }
    caret.style.translate = x + 'px ' + y + 'px';
    root.classList.add('cursor-on');
    root.classList.toggle('cursor-over', !!(e.target.closest && e.target.closest('a, button')));
    root.classList.toggle('cursor-drag', notch.classList.contains('dragging'));
    caret.classList.remove('idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { caret.classList.add('idle'); }, 900);
    if (!running) { running = true; requestAnimationFrame(frame); }
  }, { passive: true });
  window.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') root.classList.add('cursor-down'); });
  window.addEventListener('pointerup', function () { root.classList.remove('cursor-down', 'cursor-drag'); });
  document.documentElement.addEventListener('mouseleave', function () { root.classList.remove('cursor-on'); });
})();
