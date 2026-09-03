/* =========================================================================
   Sito personale di Luca — unico file JS, vanilla, nessuna dipendenza.
   Quattro comportamenti: tema, monogramma su canvas, terminale che digita,
   sezioni sincronizzate allo scorrimento.
   Con `prefers-reduced-motion: reduce` ogni animazione viene saltata e la
   pagina resta allo stato finale.
   ========================================================================= */
(function () {
  'use strict';

  var radice = document.documentElement;
  var motoRidotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Tema ------------------------------------------------- */

  var CHIAVE_TEMA = 'luca:tema';
  var COLORI_BARRA = { scuro: '#0F141B', chiaro: '#DACBC2' };

  function temaCorrente() {
    return radice.getAttribute('data-tema') === 'chiaro' ? 'chiaro' : 'scuro';
  }

  function applicaTema(tema, ridisegnaMonogramma) {
    radice.setAttribute('data-tema', tema);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', COLORI_BARRA[tema]);

    var bottone = document.querySelector('[data-tema-toggle]');
    if (bottone) {
      var prossimo = tema === 'scuro' ? 'chiaro' : 'scuro';
      bottone.setAttribute('aria-label', 'Passa al tema ' + prossimo);
      var testo = bottone.querySelector('.tema-testo');
      if (testo) testo.textContent = prossimo === 'chiaro' ? 'Chiaro' : 'Scuro';
    }

    // al primo giro il monogramma non è ancora stato disegnato: ci pensa
    // animaMonogramma(). Al cambio tema invece va ridisegnato coi nuovi colori.
    if (ridisegnaMonogramma) disegnaMonogramma(1);
  }

  // il tema è già scritto sul <html> dallo script in testa: qui si allineano
  // etichetta del bottone, aria-label e colore della barra del browser
  applicaTema(temaCorrente(), false);

  var bottoneTema = document.querySelector('[data-tema-toggle]');
  if (bottoneTema) {
    bottoneTema.addEventListener('click', function () {
      var prossimo = temaCorrente() === 'scuro' ? 'chiaro' : 'scuro';
      applicaTema(prossimo, true);
      try { localStorage.setItem(CHIAVE_TEMA, prossimo); } catch (e) { /* ignorato */ }
    });
  }

  /* ---------- 2. Monogramma animato su canvas -------------------------- */

  /* La «L» come polilinea: barra del serif in alto, asta, piede, piccolo
     ritorno verticale in fondo. Coordinate su una griglia 40x40. */
  var TRATTI = [
    [[12, 10], [22, 10]],
    [[17, 10], [17, 29]],
    [[17, 29], [30, 29]],
    [[30, 29], [30, 25.5]]
  ];

  var canvas = document.getElementById('monogramma');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var animazioneMono = null;

  function lunghezza(t) {
    return Math.hypot(t[1][0] - t[0][0], t[1][1] - t[0][1]);
  }
  var LUNGHEZZA_TOTALE = TRATTI.reduce(function (s, t) { return s + lunghezza(t); }, 0);

  function preparaCanvas() {
    if (!canvas || !ctx) return 1;
    var dpr = window.devicePixelRatio || 1;
    var lato = 40;
    canvas.width = lato * dpr;
    canvas.height = lato * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return lato;
  }

  function disegnaMonogramma(avanzamento) {
    if (!canvas || !ctx) return;
    var lato = preparaCanvas();
    var colore = getComputedStyle(radice).getPropertyValue('--accent').trim() || '#6A9FCC';

    ctx.clearRect(0, 0, lato, lato);
    ctx.strokeStyle = colore;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    var restante = LUNGHEZZA_TOTALE * avanzamento;
    for (var i = 0; i < TRATTI.length && restante > 0; i++) {
      var t = TRATTI[i];
      var len = lunghezza(t);
      var quota = Math.min(1, restante / len);
      ctx.beginPath();
      ctx.moveTo(t[0][0], t[0][1]);
      ctx.lineTo(t[0][0] + (t[1][0] - t[0][0]) * quota, t[0][1] + (t[1][1] - t[0][1]) * quota);
      ctx.stroke();
      restante -= len;
    }
  }

  function animaMonogramma() {
    if (!canvas || !ctx) return;
    if (motoRidotto) { disegnaMonogramma(1); return; }
    if (animazioneMono) cancelAnimationFrame(animazioneMono);

    var durata = 900;
    var inizio = null;
    function passo(ora) {
      if (inizio === null) inizio = ora;
      var q = Math.min(1, (ora - inizio) / durata);
      var eased = 1 - Math.pow(1 - q, 3);   // ease-out cubico
      disegnaMonogramma(eased);
      if (q < 1) animazioneMono = requestAnimationFrame(passo);
      else animazioneMono = null;
    }
    animazioneMono = requestAnimationFrame(passo);
  }

  if (canvas) {
    animaMonogramma();
    // il monogramma è dentro un link «torna in cima»: il clic rilancia il disegno
    canvas.parentNode.addEventListener('click', animaMonogramma);
    window.addEventListener('resize', function () { disegnaMonogramma(1); });
  }

  /* ---------- 3. Terminale che digita ---------------------------------- */

  /* Il testo è già nell'HTML (funziona senza JS e per i motori di ricerca):
     lo svuotiamo e lo riscriviamo carattere per carattere. L'altezza delle
     righe è fissata dal CSS, quindi la pagina non salta. */
  var terminale = document.querySelector('[data-terminale]');

  if (terminale && !motoRidotto) {
    var cursore = terminale.querySelector('.t-cursore');
    var righe = [].slice.call(terminale.querySelectorAll('.t-riga'));

    var testi = righe.map(function (riga) {
      var span = riga.querySelector('.t-testo');
      var valore = span.textContent;
      span.textContent = '';
      var prompt = riga.querySelector('.t-prompt');
      if (prompt) prompt.style.visibility = 'hidden';
      return { span: span, prompt: prompt, valore: valore, comando: riga.classList.contains('t-cmd') };
    });

    var indiceRiga = 0;
    var indiceCarattere = 0;

    function scriviCarattere() {
      if (indiceRiga >= testi.length) { if (cursore) cursore.hidden = false; return; }
      var r = testi[indiceRiga];

      if (indiceCarattere === 0) {
        if (r.prompt) r.prompt.style.visibility = 'visible';
        if (cursore) r.span.parentNode.appendChild(cursore);
      }

      if (indiceCarattere < r.valore.length) {
        r.span.textContent += r.valore.charAt(indiceCarattere);
        indiceCarattere++;
        // i comandi si «battono», l'output esce più svelto
        var ritmo = r.comando ? 42 + Math.random() * 34 : 14 + Math.random() * 14;
        setTimeout(scriviCarattere, ritmo);
      } else {
        indiceRiga++;
        indiceCarattere = 0;
        setTimeout(scriviCarattere, r.comando ? 300 : 180);
      }
    }

    if (cursore) cursore.hidden = true;
    // parte dopo l'ingresso scaglionato dell'hero
    setTimeout(function () {
      if (cursore) cursore.hidden = false;
      scriviCarattere();
    }, 950);
  }

  /* ---------- 4. Sezioni sincronizzate allo scorrimento ---------------- */

  var sezioni = [].slice.call(document.querySelectorAll('[data-sincro] .sezione'));
  var vociNav = [].slice.call(document.querySelectorAll('.nav a'));

  function segnaAttiva(sezione) {
    sezioni.forEach(function (s) { s.classList.toggle('attiva', s === sezione); });
    vociNav.forEach(function (a) {
      var bersaglio = a.getAttribute('href');
      if (sezione && bersaglio === '#' + sezione.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if (sezioni.length && 'IntersectionObserver' in window) {
    if (motoRidotto) {
      // stato finale statico: nessuna attenuazione
      sezioni.forEach(function (s) { s.classList.add('attiva'); });
    } else {
      var osservatore = new IntersectionObserver(function (voci) {
        voci.forEach(function (voce) {
          if (voce.isIntersecting) segnaAttiva(voce.target);
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

      sezioni.forEach(function (s) { osservatore.observe(s); });
    }
  } else {
    sezioni.forEach(function (s) { s.classList.add('attiva'); });
  }

  /* ---------- 5. Titoli rivelati all'ingresso nel viewport -------------- */

  var daRivelare = [].slice.call(document.querySelectorAll('.rivela'));

  if (!daRivelare.length) { /* niente da fare */ }
  else if (motoRidotto || !('IntersectionObserver' in window)) {
    daRivelare.forEach(function (el) { el.classList.add('rivelato'); });
  } else {
    var osservatoreRivela = new IntersectionObserver(function (voci, oss) {
      voci.forEach(function (voce) {
        if (!voce.isIntersecting) return;
        voce.target.classList.add('rivelato');
        oss.unobserve(voce.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

    daRivelare.forEach(function (el) { osservatoreRivela.observe(el); });
  }
})();
