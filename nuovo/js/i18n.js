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

      'term.nome': 'luca — sessione',
      'term.cmd1': 'whoami',
      'term.out1': 'costruisco software che fa il lavoro noioso al posto delle persone',
      'term.cmd2': 'dove',
      'term.out2': 'Torino. E un server acceso h24.',
      'term.cmd3': 'a-cosa-lavori-adesso',
      'term.out3': 'a fid.ai: insegno a una segreteria a rispondere ai clienti da sola',
      'scorri': 'scorri per continuare',

      'sez1.titolo': 'Chi sono',
      'bio1': 'Vengo dal mondo accademico, dove ho imparato a scrivere codice automatizzando i noiosi processi amministrativi. Adesso sono founder e technical lead di fid.ai e partner di Dotspace.',
      'bio2': "Lavoro sui processi che le persone ripetono a mano: li smonto e li rimonto in flussi automatici. Sull'AI costruisco pipeline RAG e orchestrazione di modelli, ma con una persona che valida quando la posta in gioco è alta. Sicurezza, permessi e dati personali me li guardo prima, non dopo. Scrivo e parlo italiano, spagnolo e inglese.",
      'ritratto.alt': 'Luca Bertaggia, ritratto',

      'percorso.titolo': 'Percorso',
      'percorso.intro': 'Dove ho studiato, dove ho lavorato e dove ho imparato a scrivere codice.',
      'percorso.t1.anno': '2016 — 2019',
      'percorso.t1.titolo': 'Laurea in Scienze delle attività motorie e sportive',
      'percorso.t1.testo': 'Università di Torino, SUISM. 110/110.',
      'percorso.t2.anno': '2020 — 2022',
      'percorso.t2.titolo': 'Erasmus+ alla Universidad de Almería',
      'percorso.t2.testo': 'Due periodi in Spagna: prima lo studio, poi la ricerca di tesi sulla resilienza durante la pandemia.',
      'percorso.t3.anno': '2022',
      'percorso.t3.titolo': 'Laurea magistrale in Scienze e tecniche avanzate dello sport',
      'percorso.t3.testo': '105/110 con dignità di stampa. La ricerca finisce al XV Convegno SIPI di Padova.',
      'percorso.t4.anno': '2023 — oggi',
      'percorso.t4.titolo': 'Università di Torino, SUISM',
      'percorso.t4.testo': 'Ufficio tirocini e tutorato tesi, oltre 600 enti convenzionati. È qui che comincio ad automatizzare, per non rifare a mano le stesse cose.',
      'percorso.t5.anno': '2025 — oggi',
      'percorso.t5.titolo': "fid.ai, Dotspace e l'aula",
      'percorso.t5.testo': 'Fondo fid.ai, divento partner di Dotspace e faccio da facilitatore nei percorsi di formazione di Towers Watson Italia e Challenge Network. Intanto studio informatica.',
      'percorso.t6.anno': '2026',
      'percorso.t6.titolo': 'TeachOUT, Universidad de Concepción',
      'percorso.t6.testo': "Borsa dell'Università di Torino in Cile: modelli di gestione dei tirocini, il congresso dei 50 anni della Pedagogia in Educazione Fisica e un prototipo per far incontrare studenti e aziende.",

      'sez2.titolo': 'Cosa costruisco',
      'sez2.intro': "Progetti che porto avanti, dall'idea al server.",
      'scheda.fidai.testo': 'La tua segreteria digitale e intelligente: gestisce per te le richieste di tutti i tuoi clienti.',
      'scheda.facilitazione.titolo': "Facilitazione d'aula",
      'scheda.facilitazione.testo': 'Faccio da facilitatore nei percorsi di formazione manageriale di Towers Watson Italia e Challenge Network: cloud, metodi agili, leadership, trasformazione digitale.',
      'scheda.facilitazione.piede': 'WTW · Challenge Network',
      'scheda.corsoia.titolo': 'Formazione IA a scuola',
      'scheda.corsoia.testo': 'Trenta ore per docenti di primaria e secondaria di primo grado: quindici incontri e un kit di attività pronte da usare in classe.',
      'scheda.corsoia.piede': '30 ore · 15 incontri',
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

      'term.nome': 'luca — session',
      'term.cmd1': 'whoami',
      'term.out1': 'I build software that does the boring work so people do not have to',
      'term.cmd2': 'where',
      'term.out2': 'Turin. And a server that is always on.',
      'term.cmd3': 'what-are-you-on-now',
      'term.out3': 'fid.ai: I am teaching a front desk to answer clients on its own',
      'scorri': 'scroll to continue',

      'sez1.titolo': 'About me',
      'bio1': 'I come from academia, where I learned to write code by automating tedious administrative work. Today I am founder and technical lead of fid.ai, and a partner at Dotspace.',
      'bio2': 'I work on the processes people repeat by hand: I take them apart and put them back together as automated flows. On the AI side I build RAG pipelines and model orchestration, but with a person validating whenever the stakes are high. Security, permissions and personal data I look at up front, not afterwards. I write and speak Italian, Spanish and English.',
      'ritratto.alt': 'Luca Bertaggia, portrait',

      'percorso.titolo': 'My path',
      'percorso.intro': 'Where I studied, where I worked and where I learned to write code.',
      'percorso.t1.anno': '2016 — 2019',
      'percorso.t1.titolo': 'BSc in Sport and Exercise Science',
      'percorso.t1.testo': 'University of Turin, SUISM. 110/110.',
      'percorso.t2.anno': '2020 — 2022',
      'percorso.t2.titolo': 'Erasmus+ at the Universidad de Almería',
      'percorso.t2.testo': 'Two stays in Spain: first the coursework, then the thesis research on resilience during the pandemic.',
      'percorso.t3.anno': '2022',
      'percorso.t3.titolo': 'MSc in Advanced Sport Science and Technology',
      'percorso.t3.testo': '105/110 with a recommendation for publication. The research was presented at the 15th SIPI conference in Padua.',
      'percorso.t4.anno': '2023 — today',
      'percorso.t4.titolo': 'University of Turin, SUISM',
      'percorso.t4.testo': 'Internship office and thesis tutoring, more than 600 partner organisations. This is where I start automating, so the same work is not done by hand twice.',
      'percorso.t5.anno': '2025 — today',
      'percorso.t5.titolo': 'fid.ai, Dotspace and the classroom',
      'percorso.t5.testo': 'I found fid.ai, become a partner at Dotspace and facilitate the training programmes of Towers Watson Italia and Challenge Network. Meanwhile I study computer science.',
      'percorso.t6.anno': '2026',
      'percorso.t6.titolo': 'TeachOUT, Universidad de Concepción',
      'percorso.t6.testo': 'A University of Turin grant in Chile: internship management models, the congress for the 50 years of Physical Education Pedagogy and a prototype to match students with companies.',

      'sez2.titolo': 'What I build',
      'sez2.intro': 'Projects I carry forward, from the idea to the server.',
      'scheda.fidai.testo': 'Your smart digital front desk: it handles every request from every client for you.',
      'scheda.facilitazione.titolo': 'Classroom facilitation',
      'scheda.facilitazione.testo': 'I facilitate the management training programmes of Towers Watson Italia and Challenge Network: cloud, agile methods, leadership, digital transformation.',
      'scheda.facilitazione.piede': 'WTW · Challenge Network',
      'scheda.corsoia.titolo': 'AI training for schools',
      'scheda.corsoia.testo': 'Thirty hours for primary and lower secondary teachers: fifteen sessions and a kit of activities ready to use in class.',
      'scheda.corsoia.piede': '30 hours · 15 sessions',
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

      'term.nome': 'luca — sesión',
      'term.cmd1': 'whoami',
      'term.out1': 'construyo software que hace el trabajo aburrido en lugar de las personas',
      'term.cmd2': 'donde',
      'term.out2': 'Turín. Y un servidor encendido 24/7.',
      'term.cmd3': 'en-que-trabajas-ahora',
      'term.out3': 'en fid.ai: enseño a una secretaría a responder sola a los clientes',
      'scorri': 'desplázate para continuar',

      'sez1.titolo': 'Quién soy',
      'bio1': 'Vengo del mundo académico, donde aprendí a programar automatizando procesos administrativos tediosos. Hoy soy fundador y technical lead de fid.ai y socio de Dotspace.',
      'bio2': 'Trabajo sobre los procesos que la gente repite a mano: los desmonto y los vuelvo a montar como flujos automáticos. En IA construyo pipelines RAG y orquestación de modelos, pero con una persona que valida cuando hay mucho en juego. La seguridad, los permisos y los datos personales los miro antes, no después. Escribo y hablo italiano, español e inglés.',
      'ritratto.alt': 'Luca Bertaggia, retrato',

      'percorso.titolo': 'Trayectoria',
      'percorso.intro': 'Dónde he estudiado, dónde he trabajado y dónde aprendí a programar.',
      'percorso.t1.anno': '2016 — 2019',
      'percorso.t1.titolo': 'Grado en Ciencias de la Actividad Física y del Deporte',
      'percorso.t1.testo': 'Universidad de Turín, SUISM. 110/110.',
      'percorso.t2.anno': '2020 — 2022',
      'percorso.t2.titolo': 'Erasmus+ en la Universidad de Almería',
      'percorso.t2.testo': 'Dos estancias en España: primero los estudios, después la investigación de la tesis sobre la resiliencia durante la pandemia.',
      'percorso.t3.anno': '2022',
      'percorso.t3.titolo': 'Máster en Ciencias y Técnicas Avanzadas del Deporte',
      'percorso.t3.testo': '105/110 con mención de publicación. La investigación se presentó en el XV Congreso SIPI de Padua.',
      'percorso.t4.anno': '2023 — hoy',
      'percorso.t4.titolo': 'Universidad de Turín, SUISM',
      'percorso.t4.testo': 'Oficina de prácticas y tutoría de tesis, más de 600 entidades con convenio. Aquí es donde empiezo a automatizar, para no repetir a mano lo mismo.',
      'percorso.t5.anno': '2025 — hoy',
      'percorso.t5.titolo': 'fid.ai, Dotspace y el aula',
      'percorso.t5.testo': 'Fundo fid.ai, me hago socio de Dotspace y facilito los programas de formación de Towers Watson Italia y Challenge Network. Mientras tanto estudio informática.',
      'percorso.t6.anno': '2026',
      'percorso.t6.titolo': 'TeachOUT, Universidad de Concepción',
      'percorso.t6.testo': 'Beca de la Universidad de Turín en Chile: modelos de gestión de las prácticas, el congreso por los 50 años de Pedagogía en Educación Física y un prototipo para conectar estudiantes y empresas.',

      'sez2.titolo': 'Qué construyo',
      'sez2.intro': 'Proyectos que llevo adelante, de la idea al servidor.',
      'scheda.fidai.testo': 'Tu secretaría digital e inteligente: gestiona por ti las peticiones de todos tus clientes.',
      'scheda.facilitazione.titolo': 'Facilitación de aula',
      'scheda.facilitazione.testo': 'Facilito los programas de formación directiva de Towers Watson Italia y Challenge Network: cloud, métodos ágiles, liderazgo y transformación digital.',
      'scheda.facilitazione.piede': 'WTW · Challenge Network',
      'scheda.corsoia.titolo': 'Formación en IA para la escuela',
      'scheda.corsoia.testo': 'Treinta horas para docentes de primaria y secundaria de primer ciclo: quince encuentros y un kit de actividades listas para el aula.',
      'scheda.corsoia.piede': '30 horas · 15 encuentros',
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

      'term.nome': 'luca — session',
      'term.cmd1': 'whoami',
      'term.out1': 'je construis des logiciels qui font le travail ennuyeux à la place des gens',
      'term.cmd2': 'ma-ville',
      'term.out2': 'Turin. Et un serveur allumé en permanence.',
      'term.cmd3': 'sur-quoi-tu-travailles',
      'term.out3': "fid.ai : j'apprends à un secrétariat à répondre tout seul aux clients",
      'scorri': 'défiler pour continuer',

      'sez1.titolo': 'Qui je suis',
      'bio1': "Je viens du monde universitaire, où j'ai appris à coder en automatisant des processus administratifs fastidieux. Aujourd'hui je suis fondateur et technical lead de fid.ai, et partner chez Dotspace.",
      'bio2': "Je travaille sur les processus que les gens répètent à la main : je les démonte et je les remonte en flux automatiques. Côté IA, je construis des pipelines RAG et de l'orchestration de modèles, mais avec une personne qui valide quand l'enjeu est élevé. Sécurité, permissions et données personnelles, je les regarde avant, pas après. J'écris et je parle italien, espagnol et anglais.",
      'ritratto.alt': 'Luca Bertaggia, portrait',

      'percorso.titolo': 'Parcours',
      'percorso.intro': "Où j'ai étudié, où j'ai travaillé et où j'ai appris à coder.",
      'percorso.t1.anno': '2016 — 2019',
      'percorso.t1.titolo': 'Licence en sciences des activités physiques et sportives',
      'percorso.t1.testo': 'Université de Turin, SUISM. 110/110.',
      'percorso.t2.anno': '2020 — 2022',
      'percorso.t2.titolo': "Erasmus+ à l'Universidad de Almería",
      'percorso.t2.testo': "Deux séjours en Espagne : d'abord les cours, puis la recherche de mémoire sur la résilience pendant la pandémie.",
      'percorso.t3.anno': '2022',
      'percorso.t3.titolo': 'Master en sciences et techniques avancées du sport',
      'percorso.t3.testo': '105/110 avec mention pour publication. La recherche a été présentée au XVe congrès SIPI de Padoue.',
      'percorso.t4.anno': "2023 — aujourd'hui",
      'percorso.t4.titolo': 'Université de Turin, SUISM',
      'percorso.t4.testo': "Bureau des stages et tutorat de mémoire, plus de 600 organismes conventionnés. C'est là que je commence à automatiser, pour ne plus refaire les mêmes choses à la main.",
      'percorso.t5.anno': "2025 — aujourd'hui",
      'percorso.t5.titolo': 'fid.ai, Dotspace et la salle de formation',
      'percorso.t5.testo': "Je fonde fid.ai, je deviens partner chez Dotspace et j'anime les parcours de formation de Towers Watson Italia et Challenge Network. En parallèle, j'étudie l'informatique.",
      'percorso.t6.anno': '2026',
      'percorso.t6.titolo': 'TeachOUT, Universidad de Concepción',
      'percorso.t6.testo': "Bourse de l'Université de Turin au Chili : modèles de gestion des stages, le congrès des 50 ans de la pédagogie en éducation physique et un prototype pour mettre en relation étudiants et entreprises.",

      'sez2.titolo': 'Ce que je construis',
      'sez2.intro': "Des projets que je mène, de l'idée au serveur.",
      'scheda.fidai.testo': 'Votre secrétariat numérique et intelligent : il gère pour vous les demandes de tous vos clients.',
      'scheda.facilitazione.titolo': 'Facilitation en salle',
      'scheda.facilitazione.testo': "J'anime les parcours de formation managériale de Towers Watson Italia et Challenge Network : cloud, méthodes agiles, leadership, transformation numérique.",
      'scheda.facilitazione.piede': 'WTW · Challenge Network',
      'scheda.corsoia.titolo': "Formation IA pour l'école",
      'scheda.corsoia.testo': "Trente heures pour les enseignants du primaire et du collège : quinze séances et un kit d'activités prêtes pour la classe.",
      'scheda.corsoia.piede': '30 heures · 15 séances',
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

      'term.nome': 'luca — sitzung',
      'term.cmd1': 'whoami',
      'term.out1': 'ich baue Software, die die langweilige Arbeit für andere erledigt',
      'term.cmd2': 'wo',
      'term.out2': 'Turin. Und ein Server, der nie ausgeht.',
      'term.cmd3': 'woran-arbeitest-du-gerade',
      'term.out3': 'an fid.ai: Ich bringe einem Sekretariat bei, Kunden selbst zu antworten',
      'scorri': 'weiterscrollen',

      'sez1.titolo': 'Über mich',
      'bio1': 'Ich komme aus der Universitätswelt, wo ich das Programmieren gelernt habe, indem ich mühsame Verwaltungsabläufe automatisiert habe. Heute bin ich Gründer und technical lead von fid.ai und Partner bei Dotspace.',
      'bio2': 'Ich arbeite an den Abläufen, die Menschen von Hand wiederholen: Ich zerlege sie und setze sie als automatische Flows wieder zusammen. Bei der KI baue ich RAG-Pipelines und Modell-Orchestrierung, aber mit einem Menschen, der prüft, wenn viel auf dem Spiel steht. Sicherheit, Berechtigungen und personenbezogene Daten schaue ich mir vorher an, nicht hinterher. Ich schreibe und spreche Italienisch, Spanisch und Englisch.',
      'ritratto.alt': 'Luca Bertaggia, Porträt',

      'percorso.titolo': 'Werdegang',
      'percorso.intro': 'Wo ich studiert habe, wo ich gearbeitet habe und wo ich programmieren gelernt habe.',
      'percorso.t1.anno': '2016 — 2019',
      'percorso.t1.titolo': 'Bachelor in Sportwissenschaft',
      'percorso.t1.testo': 'Universität Turin, SUISM. 110/110.',
      'percorso.t2.anno': '2020 — 2022',
      'percorso.t2.titolo': 'Erasmus+ an der Universidad de Almería',
      'percorso.t2.testo': 'Zwei Aufenthalte in Spanien: zuerst das Studium, dann die Forschung für die Abschlussarbeit über Resilienz während der Pandemie.',
      'percorso.t3.anno': '2022',
      'percorso.t3.titolo': 'Master in fortgeschrittenen Sportwissenschaften',
      'percorso.t3.testo': '105/110 mit Druckempfehlung. Die Forschung wurde auf dem XV. SIPI-Kongress in Padua vorgestellt.',
      'percorso.t4.anno': '2023 — heute',
      'percorso.t4.titolo': 'Universität Turin, SUISM',
      'percorso.t4.testo': 'Praktikumsbüro und Betreuung von Abschlussarbeiten, über 600 Partnereinrichtungen. Hier fange ich an zu automatisieren, um dieselben Dinge nicht mehr von Hand zu machen.',
      'percorso.t5.anno': '2025 — heute',
      'percorso.t5.titolo': 'fid.ai, Dotspace und der Seminarraum',
      'percorso.t5.testo': 'Ich gründe fid.ai, werde Partner bei Dotspace und moderiere die Weiterbildungen von Towers Watson Italia und Challenge Network. Nebenbei studiere ich Informatik.',
      'percorso.t6.anno': '2026',
      'percorso.t6.titolo': 'TeachOUT, Universidad de Concepción',
      'percorso.t6.testo': 'Stipendium der Universität Turin in Chile: Modelle für die Praktikumsverwaltung, der Kongress zum 50-jährigen Bestehen der Sportpädagogik und ein Prototyp, der Studierende und Unternehmen zusammenbringt.',

      'sez2.titolo': 'Was ich baue',
      'sez2.intro': 'Projekte, die ich vorantreibe — von der Idee bis zum Server.',
      'scheda.fidai.testo': 'Dein digitales und intelligentes Sekretariat: Es bearbeitet die Anfragen all deiner Kunden für dich.',
      'scheda.facilitazione.titolo': 'Seminarmoderation',
      'scheda.facilitazione.testo': 'Ich moderiere die Managementtrainings von Towers Watson Italia und Challenge Network: Cloud, agile Methoden, Leadership, digitale Transformation.',
      'scheda.facilitazione.piede': 'WTW · Challenge Network',
      'scheda.corsoia.titolo': 'KI-Fortbildung für Schulen',
      'scheda.corsoia.testo': 'Dreißig Stunden für Lehrkräfte an Grund- und Mittelschulen: fünfzehn Termine und ein Baukasten mit fertigen Unterrichtsaktivitäten.',
      'scheda.corsoia.piede': '30 Stunden · 15 Termine',
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
