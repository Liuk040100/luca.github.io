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

    // --- 5. Logica per l'effetto di battitura a macchina ---
    const typingText = document.getElementById('typing-text');
    const phrases = [
        "per dare forma al futuro.",
        "per potenziare le persone.",
        "per costruire business solidi.",
        "per guidare il cambiamento.",
        "per creare nuove opportunità.",
        "per innovare con intelligenza."
    ];

    let currentPhraseIndex = 0;
    let isDeleting = false;
    let txt = '';
    let typeSpeed = 100; // Velocità di battitura

    function type() {
        const fullTxt = phrases[currentPhraseIndex];

        if (isDeleting) {
            // Rimuove il testo
            txt = fullTxt.substring(0, txt.length - 1);
        } else {
            // Aggiunge il testo
            txt = fullTxt.substring(0, txt.length + 1);
        }

        typingText.innerHTML = `<span class="typing-cursor">${txt}</span>`;

        let delta = typeSpeed;

        if (isDeleting) {
            delta /= 2; // Più veloce in cancellazione
        }

        if (!isDeleting && txt === fullTxt) {
            // Pausa alla fine della parola
            delta = 2000;
            isDeleting = true;
        } else if (isDeleting && txt === '') {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            delta = 500; // Pausa prima di iniziare la nuova frase
        }

        setTimeout(type, delta);
    }

    type(); // Avvia l'effetto di battitura
});
