document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Logica per il menu mobile ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('is-active');
    });

    // --- 2. Logica per la rotazione delle card su tocco ---
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.querySelector('.flip-card-inner').classList.toggle('is-flipped');
        });
    });

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
                observer.unobserve(entry.target); // Opzionale: smette di osservare dopo l'animazione
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
