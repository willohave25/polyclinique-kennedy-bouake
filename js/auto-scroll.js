/* =========================================
   POLYCLINIQUE KENNEDY - AUTO-SCROLL PREMIUM
   Défilement lent continu sans pause
   Développé par W2K-Digital
   ========================================= */

(function() {
    'use strict';

    const W2KAutoScroll = {
        // Configuration
        config: {
            speed: 1,                    // Pixels par frame (1 = très lent, 2 = lent, 3 = moyen)
            pauseOnInteraction: true,    // Pause quand l'utilisateur interagit
            resumeDelay: 30000,          // Délai avant reprise après interaction (30 sec)
            smoothness: 16               // Intervalle en ms (16 = 60fps)
        },

        // État
        state: {
            isScrolling: false,
            isPaused: false,
            scrollInterval: null,
            resumeTimeout: null
        },

        // Initialisation
        init: function(options) {
            // Fusionner options personnalisées
            if (options) {
                Object.assign(this.config, options);
            }

            // Démarrer après chargement complet
            if (document.readyState === 'complete') {
                this.start();
            } else {
                window.addEventListener('load', () => this.start());
            }

            // Écouter les interactions utilisateur
            this.bindEvents();

            console.log('W2K Auto-Scroll initialisé');
        },

        // Démarrer le défilement
        start: function() {
            if (this.state.isScrolling) return;

            this.state.isScrolling = true;
            this.state.isPaused = false;

            this.state.scrollInterval = setInterval(() => {
                if (this.state.isPaused) return;

                // Calculer position actuelle et max
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

                // Si on atteint la fin, retour au début
                if (currentScroll >= maxScroll - 5) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'instant'
                    });
                } else {
                    // Continuer à défiler
                    window.scrollBy(0, this.config.speed);
                }
            }, this.config.smoothness);
        },

        // Arrêter le défilement
        stop: function() {
            this.state.isScrolling = false;
            if (this.state.scrollInterval) {
                clearInterval(this.state.scrollInterval);
                this.state.scrollInterval = null;
            }
        },

        // Pause temporaire
        pause: function() {
            this.state.isPaused = true;

            // Annuler le timeout précédent
            if (this.state.resumeTimeout) {
                clearTimeout(this.state.resumeTimeout);
            }

            // Reprendre après délai
            this.state.resumeTimeout = setTimeout(() => {
                this.resume();
            }, this.config.resumeDelay);
        },

        // Reprendre le défilement
        resume: function() {
            this.state.isPaused = false;
        },

        // Écouter les interactions utilisateur
        bindEvents: function() {
            if (!this.config.pauseOnInteraction) return;

            const events = ['mousedown', 'wheel', 'touchstart', 'keydown'];

            events.forEach(event => {
                document.addEventListener(event, (e) => {
                    // Ignorer si c'est une touche qui ne scroll pas
                    if (event === 'keydown') {
                        const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
                        if (!scrollKeys.includes(e.key)) return;
                    }

                    this.pause();
                }, { passive: true });
            });

            // Reprendre quand la souris quitte la fenêtre (mode vitrine)
            document.addEventListener('mouseleave', () => {
                if (this.state.isPaused) {
                    // Reprendre après un court délai
                    setTimeout(() => this.resume(), 3000);
                }
            });
        }
    };

    // Exposer globalement
    window.W2KAutoScroll = W2KAutoScroll;

    // Auto-init si data-autoscroll présent sur body
    document.addEventListener('DOMContentLoaded', function() {
        if (document.body.hasAttribute('data-autoscroll')) {
            W2KAutoScroll.init();
        }
    });

})();
