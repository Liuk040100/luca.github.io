/* =========================================================================
   Sito personale di Luca — traduzioni e cambio lingua.
   Vanilla, nessuna dipendenza. Cinque lingue: it (predefinita), en, es, fr, de.

   Come funziona
   -------------
   L'italiano è già scritto nell'HTML: senza JavaScript il sito resta completo
   e leggibile. Questo file tiene il dizionario delle altre quattro lingue e
   riscrive i testi marcati con `data-i18n` (contenuto) o `data-i18n-attr`
   (attributi, es. `content:meta.description` o `href:presentazione.url`).

   La lingua viene decisa dallo script in testa a index.html / 404.html
   (localStorage, poi navigator.language, poi italiano) e messa su
   `window.__lucaLingua`; qui viene solo applicata.

   `LucaI18n.alCambio(fn)` registra chi deve reagire al cambio lingua:
   main.js lo usa per rimettere a posto il terminale e il bottone del tema.
   ========================================================================= */
(function () {
  'use strict';

  var LINGUE = ['it', 'en', 'es', 'fr', 'de'];
  var PREDEFINITA = 'it';
  var CHIAVE = 'luca:lingua';

  /* ---------- Dizionario ------------------------------------------------
     L'italiano c'è per intero anche qui: serve per tornare indietro dopo
     aver scelto un'altra lingua. */

  var D = {

    it: {
      'meta.title': 'Luca Bertaggia — product & technical lead',
      'meta.description': "Luca Bertaggia, product & technical lead. Trasformo processi ripetitivi in software: AI applicata, automazione, sviluppo full-stack. Costruisco fid.ai, l'assistente WhatsApp per professionisti.",
      'og.title': 'Luca Bertaggia — product & technical lead',
      'og.description': "Trasformo processi ripetitivi in software: AI applicata, automazione, sviluppo full-stack. Costruisco fid.ai, l'assistente WhatsApp per professionisti.",
      'og.locale': 'it_IT',

      'skip': 'Salta al contenuto',
      'aria.monogramma': 'Torna in cima e rianima il monogramma',
      'aria.nav': 'Sezioni della pagina',
      'aria.lingue': 'Lingua del sito',
      'aria.terminale': 'Presentazione in forma di terminale',
      'aria.home': 'Torna alla home',

      'tema.a-chiaro': 'Passa al tema chiaro',
      'tema.a-scuro': 'Passa al tema scuro',
      'tema.et-chiaro': 'Chiaro',
      'tema.et-scuro': 'Scuro',

      'hero.eyebrow': 'Product & technical lead · 2026',
      'hero.tagline': 'Trasformo processi ripetitivi in software: AI applicata, automazione, sviluppo full-stack.',

      'term.nome': 'luca — presentazione',
      'term.cmd1': 'chi-sono',
      'term.out1': 'Luca Bertaggia — product & technical lead',
      'term.cmd2': 'dove',
      'term.out2': 'Torino, Italia',
      'term.cmd3': 'a-cosa-lavoro',
      'term.out3': 'costruisco fid.ai',
      'scorri': 'scorri per continuare',

      'sez1.titolo': 'Chi sono',
      'bio1': 'Vengo dal mondo accademico, dove ho imparato a scrivere codice automatizzando i noiosi processi amministrativi. Adesso sono founder e technical lead di fid.ai e partner di Dotspace.',
      'bio2': "Lavoro sui processi che le persone ripetono a mano: li smonto e li rimonto in flussi automatici. Sull'AI costruisco pipeline RAG e orchestrazione di modelli, ma con una persona che valida quando la posta in gioco è alta. Sicurezza, permessi e dati personali me li guardo prima, non dopo. Scrivo e parlo italiano, spagnolo e inglese.",

      'sez2.titolo': 'Cosa costruisco',
      'sez2.intro': "Progetti che porto avanti da solo, dall'idea al server.",
      'scheda.fidai.testo': 'La tua segreteria digitale e intelligente: gestisce per te le richieste di tutti i tuoi clienti.',
      'scheda.easybrain.testo': 'Il no-profit di cui sono socio co-fondatore: una rete di professionisti che accompagna le persone con fragilità.',
      'scheda.dotspace.testo': 'Lo studio di cui sono partner. Una riga su cosa facciamo arriva a breve.',
      'scheda.dotspace.piede': 'dotspace.it — presto',

      'sez3.titolo': 'Scrivimi',
      'sez3.testo': 'Il modo più diretto è la posta. Rispondo a tutto quello che non è una proposta di link building.',
      'presentazione': 'Conoscimi guardando la mia presentazione',
      'presentazione.url': 'https://gamma.app/docs/Luca-Bertaggia-Innovazione-automazione-htcu85ashw4fz9i',

      'piede.credits': '© 2026 Luca Bertaggia · fatto a mano, senza tracker',
      'piede.cima': 'Torna in cima',

      '404.meta.title': 'Pagina non trovata — Luca Bertaggia',
      '404.meta.description': 'La pagina cercata non esiste sul sito di Luca Bertaggia.',
      '404.og.title': 'Pagina non trovata — Luca Bertaggia',
      '404.og.description': 'La pagina cercata non esiste.',
      '404.etichetta': 'Errore 404',
      '404.codice': "Non c'è.",
      '404.testo': 'Questa pagina non esiste, o non esiste più. Nessun dramma: si riparte dalla prima.',
      '404.bottone': 'Torna alla home'
    },

    en: {
      'meta.title': 'Luca Bertaggia — product & technical lead',
      'meta.description': 'Luca Bertaggia, product & technical lead. I turn repetitive processes into software: applied AI, automation, full-stack development. I build fid.ai, the WhatsApp assistant for independent professionals.',
      'og.title': 'Luca Bertaggia — product & technical lead',
      'og.description': 'I turn repetitive processes into software: applied AI, automation, full-stack development. I build fid.ai, the WhatsApp assistant for independent professionals.',
      'og.locale': 'en_US',

      'skip': 'Skip to content',
      'aria.monogramma': 'Back to top and replay the monogram',
      'aria.nav': 'Page sections',
      'aria.lingue': 'Site language',
      'aria.terminale': 'Introduction shown as a terminal',
      'aria.home': 'Back to home',

      'tema.a-chiaro': 'Switch to the light theme',
      'tema.a-scuro': 'Switch to the dark theme',
      'tema.et-chiaro': 'Light',
      'tema.et-scuro': 'Dark',

      'hero.eyebrow': 'Product & technical lead · 2026',
      'hero.tagline': 'I turn repetitive processes into software: applied AI, automation, full-stack development.',

      'term.nome': 'luca — introduction',
      'term.cmd1': 'about-me',
      'term.out1': 'Luca Bertaggia — product & technical lead',
      'term.cmd2': 'where',
      'term.out2': 'Turin, Italy',
      'term.cmd3': 'current-work',
      'term.out3': 'building fid.ai',
      'scorri': 'scroll to continue',

      'sez1.titolo': 'About me',
      'bio1': 'I come from academia, where I learned to write code by automating tedious administrative work. Today I am founder and technical lead of fid.ai, and a partner at Dotspace.',
      'bio2': 'I work on the processes people repeat by hand: I take them apart and put them back together as automated flows. On the AI side I build RAG pipelines and model orchestration, but with a person validating whenever the stakes are high. Security, permissions and personal data I look at up front, not afterwards. I write and speak Italian, Spanish and English.',

      'sez2.titolo': 'What I build',
      'sez2.intro': 'Projects I carry on my own, from the idea to the server.',
      'scheda.fidai.testo': 'Your smart digital front desk: it handles every request from every client for you.',
      'scheda.easybrain.testo': 'The non-profit I co-founded: a network of professionals supporting people with fragilities.',
      'scheda.dotspace.testo': 'The studio I am a partner in. A line about what we do is coming shortly.',
      'scheda.dotspace.piede': 'dotspace.it — soon',

      'sez3.titolo': 'Write to me',
      'sez3.testo': 'Email is the most direct way. I answer everything that is not a link building pitch.',
      'presentazione': 'Get to know me through my presentation',
      'presentazione.url': 'https://gamma.app/docs/English-Luca-Bertaggia-Innovation-Automation-mjmzijwons7d90q',

      'piede.credits': '© 2026 Luca Bertaggia · handmade, no trackers',
      'piede.cima': 'Back to top',

      '404.meta.title': 'Page not found — Luca Bertaggia',
      '404.meta.description': "The page you are looking for does not exist on Luca Bertaggia's site.",
      '404.og.title': 'Page not found — Luca Bertaggia',
      '404.og.description': 'The page you are looking for does not exist.',
      '404.etichetta': 'Error 404',
      '404.codice': 'Not here.',
      '404.testo': 'This page does not exist, or does not exist any more. No drama: we start again from the first one.',
      '404.bottone': 'Back to home'
    },

    es: {
      'meta.title': 'Luca Bertaggia — product & technical lead',
      'meta.description': 'Luca Bertaggia, product & technical lead. Convierto procesos repetitivos en software: IA aplicada, automatización, desarrollo full-stack. Construyo fid.ai, el asistente de WhatsApp para profesionales.',
      'og.title': 'Luca Bertaggia — product & technical lead',
      'og.description': 'Convierto procesos repetitivos en software: IA aplicada, automatización, desarrollo full-stack. Construyo fid.ai, el asistente de WhatsApp para profesionales.',
      'og.locale': 'es_ES',

      'skip': 'Saltar al contenido',
      'aria.monogramma': 'Volver arriba y reanimar el monograma',
      'aria.nav': 'Secciones de la página',
      'aria.lingue': 'Idioma del sitio',
      'aria.terminale': 'Presentación en forma de terminal',
      'aria.home': 'Volver al inicio',

      'tema.a-chiaro': 'Cambiar al tema claro',
      'tema.a-scuro': 'Cambiar al tema oscuro',
      'tema.et-chiaro': 'Claro',
      'tema.et-scuro': 'Oscuro',

      'hero.eyebrow': 'Product & technical lead · 2026',
      'hero.tagline': 'Convierto procesos repetitivos en software: IA aplicada, automatización, desarrollo full-stack.',

      'term.nome': 'luca — presentación',
      'term.cmd1': 'quien-soy',
      'term.out1': 'Luca Bertaggia — product & technical lead',
      'term.cmd2': 'donde',
      'term.out2': 'Turín, Italia',
      'term.cmd3': 'en-que-trabajo',
      'term.out3': 'construyo fid.ai',
      'scorri': 'desplázate para continuar',

      'sez1.titolo': 'Quién soy',
      'bio1': 'Vengo del mundo académico, donde aprendí a programar automatizando procesos administrativos tediosos. Hoy soy fundador y technical lead de fid.ai y socio de Dotspace.',
      'bio2': 'Trabajo sobre los procesos que la gente repite a mano: los desmonto y los vuelvo a montar como flujos automáticos. En IA construyo pipelines RAG y orquestación de modelos, pero con una persona que valida cuando hay mucho en juego. La seguridad, los permisos y los datos personales los miro antes, no después. Escribo y hablo italiano, español e inglés.',

      'sez2.titolo': 'Qué construyo',
      'sez2.intro': 'Proyectos que llevo adelante solo, de la idea al servidor.',
      'scheda.fidai.testo': 'Tu secretaría digital e inteligente: gestiona por ti las peticiones de todos tus clientes.',
      'scheda.easybrain.testo': 'La asociación sin ánimo de lucro que cofundé: una red de profesionales que acompaña a personas con fragilidades.',
      'scheda.dotspace.testo': 'El estudio del que soy socio. Una línea sobre lo que hacemos llega muy pronto.',
      'scheda.dotspace.piede': 'dotspace.it — pronto',

      'sez3.titolo': 'Escríbeme',
      'sez3.testo': 'Lo más directo es el correo. Respondo a todo lo que no sea una propuesta de link building.',
      'presentazione': 'Conóceme viendo mi presentación',
      'presentazione.url': 'https://gamma.app/docs/Espanol-Luca-Bertaggia-Innovacion-y-Automatizacion-kzipqfqik54h3vd',

      'piede.credits': '© 2026 Luca Bertaggia · hecho a mano, sin rastreadores',
      'piede.cima': 'Volver arriba',

      '404.meta.title': 'Página no encontrada — Luca Bertaggia',
      '404.meta.description': 'La página que buscas no existe en el sitio de Luca Bertaggia.',
      '404.og.title': 'Página no encontrada — Luca Bertaggia',
      '404.og.description': 'La página que buscas no existe.',
      '404.etichetta': 'Error 404',
      '404.codice': 'No está.',
      '404.testo': 'Esta página no existe, o ya no existe. Sin dramas: se vuelve a empezar por la primera.',
      '404.bottone': 'Volver al inicio'
    },

    fr: {
      'meta.title': 'Luca Bertaggia — product & technical lead',
      'meta.description': "Luca Bertaggia, product & technical lead. Je transforme les processus répétitifs en logiciels : IA appliquée, automatisation, développement full-stack. Je construis fid.ai, l'assistant WhatsApp pour les indépendants.",
      'og.title': 'Luca Bertaggia — product & technical lead',
      'og.description': "Je transforme les processus répétitifs en logiciels : IA appliquée, automatisation, développement full-stack. Je construis fid.ai, l'assistant WhatsApp pour les indépendants.",
      'og.locale': 'fr_FR',

      'skip': 'Aller au contenu',
      'aria.monogramma': 'Retour en haut et rejouer le monogramme',
      'aria.nav': 'Sections de la page',
      'aria.lingue': 'Langue du site',
      'aria.terminale': 'Présentation sous forme de terminal',
      'aria.home': "Retour à l'accueil",

      'tema.a-chiaro': 'Passer au thème clair',
      'tema.a-scuro': 'Passer au thème sombre',
      'tema.et-chiaro': 'Clair',
      'tema.et-scuro': 'Sombre',

      'hero.eyebrow': 'Product & technical lead · 2026',
      'hero.tagline': 'Je transforme les processus répétitifs en logiciels : IA appliquée, automatisation, développement full-stack.',

      'term.nome': 'luca — présentation',
      'term.cmd1': 'qui-suis-je',
      'term.out1': 'Luca Bertaggia — product & technical lead',
      'term.cmd2': 'ma-ville',
      'term.out2': 'Turin, Italie',
      'term.cmd3': 'sur-quoi-je-travaille',
      'term.out3': 'je construis fid.ai',
      'scorri': 'défiler pour continuer',

      'sez1.titolo': 'Qui je suis',
      'bio1': "Je viens du monde universitaire, où j'ai appris à coder en automatisant des processus administratifs fastidieux. Aujourd'hui je suis fondateur et technical lead de fid.ai, et partner chez Dotspace.",
      'bio2': "Je travaille sur les processus que les gens répètent à la main : je les démonte et je les remonte en flux automatiques. Côté IA, je construis des pipelines RAG et de l'orchestration de modèles, mais avec une personne qui valide quand l'enjeu est élevé. Sécurité, permissions et données personnelles, je les regarde avant, pas après. J'écris et je parle italien, espagnol et anglais.",

      'sez2.titolo': 'Ce que je construis',
      'sez2.intro': "Des projets que je mène seul, de l'idée au serveur.",
      'scheda.fidai.testo': 'Votre secrétariat numérique et intelligent : il gère pour vous les demandes de tous vos clients.',
      'scheda.easybrain.testo': "L'association à but non lucratif que j'ai cofondée : un réseau de professionnels au service des personnes fragiles.",
      'scheda.dotspace.testo': 'Le studio dont je suis partner. Une ligne sur ce que nous faisons arrive très bientôt.',
      'scheda.dotspace.piede': 'dotspace.it — bientôt',

      'sez3.titolo': 'Écrivez-moi',
      'sez3.testo': "Le plus direct, c'est l'e-mail. Je réponds à tout ce qui n'est pas une proposition de link building.",
      'presentazione': 'Découvrez-moi à travers ma présentation',
      'presentazione.url': 'https://gamma.app/docs/Francais-Luca-Bertaggia-Innovation-Automatisation-4psju7ckyiizn71',

      'piede.credits': '© 2026 Luca Bertaggia · fait à la main, sans traqueurs',
      'piede.cima': 'Retour en haut',

      '404.meta.title': 'Page introuvable — Luca Bertaggia',
      '404.meta.description': "La page recherchée n'existe pas sur le site de Luca Bertaggia.",
      '404.og.title': 'Page introuvable — Luca Bertaggia',
      '404.og.description': "La page recherchée n'existe pas.",
      '404.etichetta': 'Erreur 404',
      '404.codice': 'Rien ici.',
      '404.testo': "Cette page n'existe pas, ou n'existe plus. Pas de drame : on repart de la première.",
      '404.bottone': "Retour à l'accueil"
    },

    de: {
      'meta.title': 'Luca Bertaggia — product & technical lead',
      'meta.description': 'Luca Bertaggia, product & technical lead. Ich verwandle wiederkehrende Abläufe in Software: angewandte KI, Automatisierung, Full-Stack-Entwicklung. Ich baue fid.ai, den WhatsApp-Assistenten für Selbstständige.',
      'og.title': 'Luca Bertaggia — product & technical lead',
      'og.description': 'Ich verwandle wiederkehrende Abläufe in Software: angewandte KI, Automatisierung, Full-Stack-Entwicklung. Ich baue fid.ai, den WhatsApp-Assistenten für Selbstständige.',
      'og.locale': 'de_DE',

      'skip': 'Zum Inhalt springen',
      'aria.monogramma': 'Nach oben und Monogramm neu zeichnen',
      'aria.nav': 'Abschnitte der Seite',
      'aria.lingue': 'Sprache der Website',
      'aria.terminale': 'Vorstellung in Form eines Terminals',
      'aria.home': 'Zurück zur Startseite',

      'tema.a-chiaro': 'Zum hellen Design wechseln',
      'tema.a-scuro': 'Zum dunklen Design wechseln',
      'tema.et-chiaro': 'Hell',
      'tema.et-scuro': 'Dunkel',

      'hero.eyebrow': 'Product & technical lead · 2026',
      'hero.tagline': 'Ich verwandle wiederkehrende Abläufe in Software: angewandte KI, Automatisierung, Full-Stack-Entwicklung.',

      'term.nome': 'luca — vorstellung',
      'term.cmd1': 'wer-bin-ich',
      'term.out1': 'Luca Bertaggia — product & technical lead',
      'term.cmd2': 'wo',
      'term.out2': 'Turin, Italien',
      'term.cmd3': 'woran-ich-arbeite',
      'term.out3': 'ich baue fid.ai',
      'scorri': 'weiterscrollen',

      'sez1.titolo': 'Über mich',
      'bio1': 'Ich komme aus der Universitätswelt, wo ich das Programmieren gelernt habe, indem ich mühsame Verwaltungsabläufe automatisiert habe. Heute bin ich Gründer und technical lead von fid.ai und Partner bei Dotspace.',
      'bio2': 'Ich arbeite an den Abläufen, die Menschen von Hand wiederholen: Ich zerlege sie und setze sie als automatische Flows wieder zusammen. Bei der KI baue ich RAG-Pipelines und Modell-Orchestrierung, aber mit einem Menschen, der prüft, wenn viel auf dem Spiel steht. Sicherheit, Berechtigungen und personenbezogene Daten schaue ich mir vorher an, nicht hinterher. Ich schreibe und spreche Italienisch, Spanisch und Englisch.',

      'sez2.titolo': 'Was ich baue',
      'sez2.intro': 'Projekte, die ich allein trage, von der Idee bis zum Server.',
      'scheda.fidai.testo': 'Dein digitales und intelligentes Sekretariat: Es bearbeitet die Anfragen all deiner Kunden für dich.',
      'scheda.easybrain.testo': 'Der gemeinnützige Verein, den ich mitgegründet habe: ein Netzwerk von Fachleuten für Menschen mit Beeinträchtigungen.',
      'scheda.dotspace.testo': 'Das Studio, dessen Partner ich bin. Eine Zeile darüber, was wir tun, folgt in Kürze.',
      'scheda.dotspace.piede': 'dotspace.it — bald',

      'sez3.titolo': 'Schreib mir',
      'sez3.testo': 'Am direktesten geht es per E-Mail. Ich antworte auf alles, was kein Linkbuilding-Angebot ist.',
      'presentazione': 'Lern mich über meine Präsentation kennen',
      'presentazione.url': 'https://gamma.app/docs/Deutsch-Luca-Bertaggia-Innovation-Automatisierung-yzsomfeuz5bj3xy',

      'piede.credits': '© 2026 Luca Bertaggia · handgemacht, ohne Tracker',
      'piede.cima': 'Nach oben',

      '404.meta.title': 'Seite nicht gefunden — Luca Bertaggia',
      '404.meta.description': 'Die gesuchte Seite gibt es auf der Website von Luca Bertaggia nicht.',
      '404.og.title': 'Seite nicht gefunden — Luca Bertaggia',
      '404.og.description': 'Die gesuchte Seite gibt es nicht.',
      '404.etichetta': 'Fehler 404',
      '404.codice': 'Nicht da.',
      '404.testo': 'Diese Seite gibt es nicht, oder nicht mehr. Kein Drama: Wir fangen wieder von vorne an.',
      '404.bottone': 'Zurück zur Startseite'
    }

  };

  /* ---------- Motore ---------------------------------------------------- */

  var radice = document.documentElement;
  var ascoltatori = [];
  var corrente = PREDEFINITA;

  function valida(lingua) {
    return LINGUE.indexOf(lingua) === -1 ? PREDEFINITA : lingua;
  }

  function t(chiave) {
    var dz = D[corrente];
    if (dz && dz[chiave] != null) return dz[chiave];
    return D[PREDEFINITA][chiave] != null ? D[PREDEFINITA][chiave] : '';
  }

  function applicaTesti(dz) {
    var nodi = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodi.length; i++) {
      var chiave = nodi[i].getAttribute('data-i18n');
      if (dz[chiave] != null) nodi[i].textContent = dz[chiave];
    }

    // attributi: "aria-label:aria.nav" oppure "content:og.title;href:presentazione.url"
    var conAttr = document.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < conAttr.length; j++) {
      var coppie = conAttr[j].getAttribute('data-i18n-attr').split(';');
      for (var k = 0; k < coppie.length; k++) {
        var pezzo = coppie[k].trim();
        if (!pezzo) continue;
        var taglio = pezzo.indexOf(':');
        if (taglio < 1) continue;
        var attributo = pezzo.slice(0, taglio).trim();
        var chiave2 = pezzo.slice(taglio + 1).trim();
        if (dz[chiave2] != null) conAttr[j].setAttribute(attributo, dz[chiave2]);
      }
    }
  }

  function segnaBottoni(lingua) {
    var bottoni = document.querySelectorAll('[data-lingua]');
    for (var i = 0; i < bottoni.length; i++) {
      var attiva = bottoni[i].getAttribute('data-lingua') === lingua;
      bottoni[i].setAttribute('aria-pressed', attiva ? 'true' : 'false');
      if (attiva) bottoni[i].classList.add('attiva');
      else bottoni[i].classList.remove('attiva');
    }
  }

  function applica(lingua, salva) {
    lingua = valida(lingua);
    corrente = lingua;

    radice.setAttribute('lang', lingua);
    applicaTesti(D[lingua]);
    segnaBottoni(lingua);

    if (salva) {
      try { localStorage.setItem(CHIAVE, lingua); } catch (e) { /* ignorato */ }
    }

    for (var i = 0; i < ascoltatori.length; i++) {
      try { ascoltatori[i](lingua); } catch (e) { /* un ascoltatore rotto non ferma gli altri */ }
    }
  }

  window.LucaI18n = {
    lingue: LINGUE.slice(),
    corrente: function () { return corrente; },
    t: t,
    applica: applica,
    alCambio: function (fn) { if (typeof fn === 'function') ascoltatori.push(fn); }
  };

  /* Prima applicazione: la lingua l'ha già decisa lo script in testa. */
  applica(valida(window.__lucaLingua), false);

  /* Selettore lingua */
  var bottoni = document.querySelectorAll('[data-lingua]');
  for (var i = 0; i < bottoni.length; i++) {
    bottoni[i].addEventListener('click', function () {
      applica(this.getAttribute('data-lingua'), true);
    });
  }
})();
