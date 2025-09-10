document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Animazione di ingresso per il contenuto ---
    // Usa GSAP per far apparire il testo con un effetto fade-in + leggero slide-up
    gsap.from('.hero-content', {
        duration: 1.5,
        opacity: 0,
        y: 50,
        ease: 'power3.out',
        delay: 0.5
    });

    // --- 2. Logica per l'effetto di battitura a macchina ---
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
