/* =========================================================================
   Sito personale di Luca — unico file JS di comportamento, vanilla,
   nessuna dipendenza. Le traduzioni stanno in js/i18n.js, che gira prima.
   Quattro comportamenti: tema, monogramma su canvas, terminale che digita,
   sezioni sincronizzate allo scorrimento.
   Con `prefers-reduced-motion: reduce` ogni animazione viene saltata e la
   pagina resta allo stato finale.
   ========================================================================= */
(function () {
  'use strict';

  var radice = document.documentElement;
  var motoRidotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Testo tradotto, con ripiego in italiano se i18n.js non c'è. */
  function T(chiave, ripiego) {
    if (window.LucaI18n) {
      var v = window.LucaI18n.t(chiave);
      if (v) return v;
    }
    return ripiego;
  }

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
      bottone.setAttribute('aria-label', prossimo === 'chiaro'
        ? T('tema.a-chiaro', 'Passa al tema chiaro')
        : T('tema.a-scuro', 'Passa al tema scuro'));
      var testo = bottone.querySelector('.tema-testo');
      if (testo) {
        testo.textContent = prossimo === 'chiaro'
          ? T('tema.et-chiaro', 'Chiaro')
          : T('tema.et-scuro', 'Scuro');
      }
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

  /* ---------- 3. Terminale che digita ----------------------------------

     Il testo definitivo è già nell'HTML (funziona senza JS e per i motori di
     ricerca): viene messo da parte, i campi si svuotano e si riscrivono un
     carattere alla volta. L'altezza delle righe è fissata dal CSS, quindi la
     pagina non salta mai.
     Il cursore lampeggia sul primo prompt prima che parta la battitura, dopo
     ogni comando c'è una pausa (la macchina "pensa") e alla fine resta un
     prompt vuoto col cursore acceso: sembra una sessione ancora aperta.
     Un clic sul riquadro la ribatte da capo. */

  var terminale = document.querySelector('[data-terminale]');
  var timerTerminale = null;

  function righeTerminale() {
    return [].slice.call(terminale.querySelectorAll('.t-riga')).map(function (riga) {
      return {
        span: riga.querySelector('.t-testo'),
        prompt: riga.querySelector('.t-prompt'),
        comando: riga.classList.contains('t-cmd')
      };
    });
  }

  /* Il testo pieno viene messo da parte: serve per ribattere e per rimetterlo
     a posto quando cambia la lingua. */
  function memorizzaTesti() {
    righeTerminale().forEach(function (r) {
      r.span.setAttribute('data-pieno', r.span.textContent);
    });
  }

  function fermaTerminale() {
    if (timerTerminale) { clearTimeout(timerTerminale); timerTerminale = null; }
  }

  function chiudiTerminale() {
    if (!terminale) return;
    fermaTerminale();
    var righe = righeTerminale();
    righe.forEach(function (r) {
      if (r.prompt) r.prompt.style.visibility = 'visible';
      var pieno = r.span.getAttribute('data-pieno');
      if (pieno !== null) r.span.textContent = pieno;
    });
    var cursore = terminale.querySelector('.t-cursore');
    var ultima = righe[righe.length - 1];
    if (cursore && ultima) {
      ultima.span.parentNode.appendChild(cursore);
      cursore.hidden = false;
    }
  }

  function battiTerminale() {
    if (!terminale || motoRidotto) return;
    fermaTerminale();

    var righe = righeTerminale();
    var cursore = terminale.querySelector('.t-cursore');

    righe.forEach(function (r) {
      r.span.textContent = '';
      if (r.prompt) r.prompt.style.visibility = 'hidden';
    });

    // sessione aperta e ferma: solo il primo prompt, col cursore che lampeggia
    var primo = righe[0];
    if (primo) {
      if (primo.prompt) primo.prompt.style.visibility = 'visible';
      if (cursore) { primo.span.parentNode.appendChild(cursore); cursore.hidden = false; }
    }

    var indiceRiga = 0;
    var indiceCarattere = 0;

    function passo() {
      if (indiceRiga >= righe.length) { timerTerminale = null; return; }
      var r = righe[indiceRiga];
      var pieno = r.span.getAttribute('data-pieno') || '';

      if (indiceCarattere === 0) {
        if (r.prompt) r.prompt.style.visibility = 'visible';
        if (cursore) r.span.parentNode.appendChild(cursore);
      }

      if (indiceCarattere < pieno.length) {
        r.span.textContent += pieno.charAt(indiceCarattere);
        indiceCarattere++;
        // i comandi si «battono» a mano, l'output esce di macchina
        var ritmo = r.comando ? 44 + Math.random() * 34 : 10 + Math.random() * 10;
        timerTerminale = setTimeout(passo, ritmo);
      } else {
        indiceRiga++;
        indiceCarattere = 0;
        // dopo un comando la macchina ci pensa su, poi risponde
        timerTerminale = setTimeout(passo, r.comando ? 360 + Math.random() * 200 : 240);
      }
    }

    timerTerminale = setTimeout(passo, 950);
  }

  if (terminale) {
    memorizzaTesti();
    if (motoRidotto) chiudiTerminale();
    else battiTerminale();
    // un clic sul riquadro rifà la sessione da capo
    terminale.parentNode.addEventListener('click', battiTerminale);
  }

  /* ---------- 4. Cambio lingua -----------------------------------------

     i18n.js ha già riscritto i testi quando arriva qui: il terminale rilegge
     il testo nuovo e chiude la battitura in corso, il bottone del tema rifà
     l'etichetta. */

  if (window.LucaI18n) {
    window.LucaI18n.alCambio(function () {
      if (terminale) { memorizzaTesti(); chiudiTerminale(); }
      applicaTema(temaCorrente(), false);
    });
  }

  /* ---------- 5. Sezioni sincronizzate allo scorrimento ---------------- */

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

  /* ---------- 6. Titoli rivelati all'ingresso nel viewport -------------- */

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
