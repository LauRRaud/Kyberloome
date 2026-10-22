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
    if (open && hint) hint.classList.add('seen');
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
      if (hint) hint.classList.add('seen');
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
    else { times = !times; layout(); }
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
  document.documentElement.classList.add('travel');

  // The screens in the order of the trip, and how long (in screen heights of scrolling) it stays.
  var stops = [
    { at: [0, 0], stay: 0.35 },
    { at: [1, 0], stay: 1.2 },
    { at: [1, 1], stay: 0.45 },
    { at: [0, 1], stay: 0.6 }
  ];
  var MOVE = 1;
  var length = stops.reduce(function (n, s) { return n + s.stay; }, 0) + MOVE * (stops.length - 1);
  function size() { world.style.height = (length + 1) * window.innerHeight + 'px'; }
  size();

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
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
