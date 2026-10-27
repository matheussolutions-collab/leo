(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }


  // Ano do copyright
  document.querySelectorAll('[data-ano]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Faixa rolando: duplica os itens para o loop ficar contínuo
  var tk = document.querySelector('.ticker div');
  if (tk) tk.innerHTML += tk.innerHTML;

  /* ---------- Idioma ----------
     Português vem do próprio HTML; inglês de assets/js/i18n.js. */
  var TEXTS = { pt: {}, en: window.TEXTOS_EN || {} };
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    TEXTS.pt[el.getAttribute('data-i18n')] = el.innerHTML.replace(/\s+/g, ' ').trim();
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    TEXTS.pt[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label');
  });

  // Junta a última palavra de cada linha com a anterior (sem palavra sozinha)
  function noOrphan(t) {
    return t.split('<br>').map(function (p) { return p.replace(/\s+(\S+)\s*$/, ' $1'); }).join('<br>');
  }

  function apply(l) {
    var d = TEXTS[l];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      el.innerHTML = noOrphan(d[k] || TEXTS.pt[k]);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', d[k] || TEXTS.pt[k]);
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l));
    });
    root.setAttribute('lang', l === 'en' ? 'en' : 'pt-BR');
    set('bio-lang', l);
  }

  var curLang = null;
  function setLang(l, animate) {
    if (l === curLang) return;
    var first = curLang === null;
    curLang = l;
    if (first || !animate || reduce) { apply(l); return; }

    var els = [].slice.call(document.querySelectorAll('[data-i18n]')).filter(function (e) {
      var r = e.getBoundingClientRect();
      return r.bottom > -50 && r.top < innerHeight + 50;
    });
    var sw = document.querySelector('.lang-sweep');
    if (sw) { sw.classList.remove('go'); void sw.offsetWidth; sw.classList.add('go'); }
    els.forEach(function (e, i) { e.style.animationDelay = (i * 18) + 'ms'; e.classList.add('i18n-out'); });
    setTimeout(function () {
      apply(l);
      els.forEach(function (e, i) {
        e.classList.remove('i18n-out');
        e.style.animationDelay = (i * 22) + 'ms';
        e.classList.add('i18n-in');
      });
      setTimeout(function () {
        els.forEach(function (e) { e.classList.remove('i18n-in'); e.style.animationDelay = ''; });
      }, 900);
    }, 220 + els.length * 18);
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });
  setLang(get('bio-lang') === 'en' ? 'en' : 'pt', false);

  /* ---------- Tema ----------
     O tema salvo é aplicado no <head> do index.html, antes de pintar. */
  function isLight() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'light';
    return matchMedia('(prefers-color-scheme: light)').matches;
  }

  var tb = document.getElementById('theme');
  tb.addEventListener('click', function () {
    var next = isLight() ? 'dark' : 'light';
    function go() { root.setAttribute('data-theme', next); set('bio-theme', next); }

    tb.classList.add('spin');
    setTimeout(function () { tb.classList.remove('spin'); }, 500);
    if (reduce) { go(); return; }

    if (document.startViewTransition) {
      // Círculo que cresce a partir do botão
      var r = tb.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(go).ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 700, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () {});
    } else {
      root.classList.add('theme-fade');
      go();
      setTimeout(function () { root.classList.remove('theme-fade'); }, 600);
    }
  });

  /* ---------- Cursor personalizado (só mouse, sem redução de movimento) ---------- */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cur-dot';
    ring.className = 'cur-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    root.classList.add('cur-ready');

    var mx = -100, my = -100, rx = -100, ry = -100, running = false;
    addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!running) { running = true; requestAnimationFrame(loop); }
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      root.classList.add('cur-on');
      root.classList.toggle('cur-hover', !!(e.target.closest && e.target.closest('a,button')));
    });
    // Esconde o cursor quando o mouse sai da janela
    document.addEventListener('mouseout', function (e) { if (!e.relatedTarget) root.classList.remove('cur-on'); });
    addEventListener('pointerdown', function () { root.classList.add('cur-down'); });
    addEventListener('pointerup', function () { root.classList.remove('cur-down'); });

    // Anel segue o ponto com atraso suave; para quando alcança (não gasta CPU parado)
    function loop() {
      if (Math.abs(mx - rx) > .3 || Math.abs(my - ry) > .3) {
        rx += (mx - rx) * .18; ry += (my - ry) * .18;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    }
  }

  // Brilho que segue o mouse no CTA e nos links
  document.querySelectorAll('.sheen-host').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();
