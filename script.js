document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Logica per il menu mobile ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('a');

    // Apre e chiude il menu al click sull'hamburger
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('is-active');
    });

    // Chiude il menu quando si clicca su un link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('is-active')) {
                mainNav.classList.remove('is-active');
            }
        });
    });

    // --- 2. Logica avanzata per la rotazione delle card ---
    const flipCards = document.querySelectorAll('.flip-card');

    const closeAllCards = () => {
        flipCards.forEach(card => {
            card.querySelector('.flip-card-inner').classList.remove('is-flipped');
        });
    };

    flipCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentCardInner = card.querySelector('.flip-card-inner');
            const wasFlipped = currentCardInner.classList.contains('is-flipped');
            
            closeAllCards();

            if (!wasFlipped) {
                currentCardInner.classList.add('is-flipped');
            }
        });
    });

    // Chiude le card se si clicca fuori o si scorre
    document.addEventListener('click', closeAllCards);
    window.addEventListener('scroll', closeAllCards);

    // --- 3. Logica per l'animazione degli elementi a scorrimento ---
    const fadeInElements = document.querySelectorAll('.fade-in-element');

    const observerOptions = {
        root: null, // rispetto al viewport
        rootMargin: '0px',
        threshold: 0.1 // l'elemento è considerato visibile se almeno il 10% è nel viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Smette di osservare dopo l'animazione
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        observer.observe(el);
    });


    // --- 4. Animazione di ingresso per il contenuto (GSAP) ---
    gsap.from('.hero-content', {
        duration: 1.5,
        opacity: 0,
        y: 50,
        ease: 'power3.out',
        delay: 0.5
    });

    // --- 5. Logica per l'effetto di battitura a macchina translabile ---
    const typingText = document.getElementById('typing-text');
    let currentPhraseIndex = 0;
    let isDeleting = false;
    let txt = '';
    let typeSpeed = 100; // Velocità di battitura
    let dynamicPhrases = [];
    let typingTimeout;

    function type() {
        if (!dynamicPhrases || dynamicPhrases.length === 0) return;
        const fullTxt = dynamicPhrases[currentPhraseIndex];

        if (isDeleting) {
            txt = fullTxt.substring(0, txt.length - 1);
        } else {
            txt = fullTxt.substring(0, txt.length + 1);
        }

        if (typingText) {
            typingText.innerHTML = `<span class="typing-cursor">${txt}</span>`;
        }

        let delta = typeSpeed;

        if (isDeleting) {
            delta /= 2; // Più veloce in cancellazione
        }

        if (!isDeleting && txt === fullTxt) {
            delta = 2000;
            isDeleting = true;
        } else if (isDeleting && txt === '') {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % dynamicPhrases.length;
            delta = 500;
        }

        typingTimeout = setTimeout(type, delta);
    }


    // --- 6. Logica di Internazionalizzazione (i18n Client-Side) ---
    const supportedLanguages = ['IT', 'EN', 'FR', 'DE', 'ES'];
    let currentLang = 'EN'; // fallback di default

    function setLanguage(lang) {
        if (!supportedLanguages.includes(lang)) {
            lang = 'EN';
        }
        currentLang = lang;
        
        try {
            localStorage.setItem('preferred-lang', lang);
        } catch (e) {
            console.warn('LocalStorage non disponibile:', e);
        }

        // Aggiorna l'attributo lang del documento HTML
        document.documentElement.lang = lang.toLowerCase();

        // Traduce tutti gli elementi con l'attributo data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
                const textValue = translations[lang][key];
                
                // Usa innerHTML se contiene HTML, altrimenti textContent per sicurezza
                if (textValue.includes('<br>') || textValue.includes('<span>') || textValue.includes('&copy;')) {
                    el.innerHTML = textValue;
                } else {
                    el.textContent = textValue;
                }
            }
        });

        // Traduce gli attributi (es. aria-label) con l'attributo data-i18n-attr
        const attrElements = document.querySelectorAll('[data-i18n-attr]');
        attrElements.forEach(el => {
            const attrMapping = el.getAttribute('data-i18n-attr');
            const parts = attrMapping.split(':');
            if (parts.length === 2) {
                const attrName = parts[0];
                const key = parts[1];
                if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
                    el.setAttribute(attrName, translations[lang][key]);
                }
            }
        });

        // Aggiorna lo stato visivo (pulsante attivo) dei selettori di lingua nell'header
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Aggiorna le frasi dell'effetto di battitura ed esegue il reset
        updateTypingPhrases(lang);
    }

    function updateTypingPhrases(lang) {
        if (typeof translations === 'undefined' || !translations[lang]) return;
        
        dynamicPhrases = [
            translations[lang]['hero.typing_1'],
            translations[lang]['hero.typing_2'],
            translations[lang]['hero.typing_3'],
            translations[lang]['hero.typing_4'],
            translations[lang]['hero.typing_5'],
            translations[lang]['hero.typing_6']
        ];
        
        // Interrompe e resetta la digitazione corrente per evitare anomalie visive
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        
        if (typingText) {
            currentPhraseIndex = 0;
            isDeleting = false;
            txt = '';
            type();
        }
    }

    function detectLanguage() {
        // 1. Controlla il localStorage
        let savedLang = null;
        try {
            savedLang = localStorage.getItem('preferred-lang');
        } catch (e) {
            console.warn('LocalStorage non disponibile:', e);
        }
        
        if (savedLang && supportedLanguages.includes(savedLang)) {
            return savedLang;
        }

        // 2. Controlla la lingua del browser
        const browserLang = (navigator.language || navigator.userLanguage || '').substring(0, 2).toUpperCase();
        if (supportedLanguages.includes(browserLang)) {
            return browserLang;
        }

        // 3. Fallback
        return 'EN';
    }

    // Inizializza la lingua all'avvio
    const initialLang = detectLanguage();
    setLanguage(initialLang);

    // Registra il click handler per i selettori nell'header
    const langSelectorButtons = document.querySelectorAll('.lang-btn');
    langSelectorButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedLang = e.currentTarget.getAttribute('data-lang');
            if (selectedLang && selectedLang !== currentLang) {
                setLanguage(selectedLang);
            }
        });
    });
});
