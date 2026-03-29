/* =========================================
   W2K-DIGITAL AUTO-SCROLL PREMIUM
   Module de défilement automatique intelligent
   Développé par W2K-Digital
   Version 1.0 - 2025
   ========================================= */

/**
 * W2KAutoScroll - Module de défilement automatique premium
 * 
 * Fonctionnalités :
 * - Défilement automatique lent et élégant
 * - Pause sur interaction utilisateur (clic, scroll, touch)
 * - Reprise automatique après période d'inactivité
 * - Boucle infinie (retour au début après dernière section)
 * - Indicateur visuel animé
 * - Compatible desktop, tablette, mobile et TV/écrans d'agence
 */

const W2KAutoScroll = (function() {
    'use strict';

    /* =========================================
       CONFIGURATION PAR DÉFAUT
       ========================================= */
    
    const defaultConfig = {
        speed: 'slow',              // 'slow', 'medium', 'fast'
        pauseDuration: 12,          // Secondes de pause par section
        inactivityDelay: 45,        // Secondes avant reprise après interaction
        showIndicator: true,        // Afficher l'indicateur visuel
        sectionSelector: '[data-autoscroll]', // Sélecteur des sections
        scrollBehavior: 'smooth'    // 'smooth' ou 'auto'
    };

    /* =========================================
       VARIABLES INTERNES
       ========================================= */
    
    let config = {};
    let sections = [];
    let currentSectionIndex = 0;
    let isScrolling = false;
    let isPaused = false;
    let isUserInteracting = false;
    let scrollTimer = null;
    let inactivityTimer = null;
    let indicator = null;

    /* =========================================
       VITESSES DE DÉFILEMENT (en ms)
       ========================================= */
    
    const speedSettings = {
        slow: 1000,
        medium: 600,
        fast: 300
    };

    /* =========================================
       INITIALISATION
       ========================================= */
    
    function init(userConfig = {}) {
        // Fusionner configuration utilisateur avec défaut
        config = Object.assign({}, defaultConfig, userConfig);
        
        // Récupérer les sections
        sections = document.querySelectorAll(config.sectionSelector);
        
        if (sections.length === 0) {
            console.warn('W2KAutoScroll: Aucune section trouvée avec le sélecteur', config.sectionSelector);
            return;
        }
        
        // Initialiser l'indicateur
        if (config.showIndicator) {
            initIndicator();
        }
        
        // Attacher les écouteurs d'événements
        attachEventListeners();
        
        // Démarrer le défilement automatique après un délai initial
        setTimeout(function() {
            startAutoScroll();
        }, 3000); // 3 secondes de pause initiale
        
        console.log('W2KAutoScroll: Initialisé avec', sections.length, 'sections');
    }

    /* =========================================
       INDICATEUR VISUEL
       ========================================= */
    
    function initIndicator() {
        indicator = document.getElementById('scroll-indicator');
        
        if (!indicator) {
            // Créer l'indicateur s'il n'existe pas
            indicator = document.createElement('div');
            indicator.id = 'scroll-indicator';
            indicator.className = 'w2k-scroll-indicator';
            indicator.title = 'Défilement automatique actif';
            document.body.appendChild(indicator);
        }
        
        // Clic sur l'indicateur pour basculer pause/reprise
        indicator.addEventListener('click', function() {
            if (isPaused) {
                resumeAutoScroll();
            } else {
                pauseAutoScroll();
            }
        });
    }

    function updateIndicator(paused) {
        if (!indicator) return;
        
        if (paused) {
            indicator.classList.add('paused');
            indicator.title = 'Défilement automatique en pause - Cliquez pour reprendre';
        } else {
            indicator.classList.remove('paused');
            indicator.title = 'Défilement automatique actif - Cliquez pour mettre en pause';
        }
    }

    /* =========================================
       ÉCOUTEURS D'ÉVÉNEMENTS
       ========================================= */
    
    function attachEventListeners() {
        // Détection du scroll manuel
        window.addEventListener('wheel', handleUserInteraction, { passive: true });
        
        // Détection du touch (mobile/tablette)
        window.addEventListener('touchstart', handleUserInteraction, { passive: true });
        window.addEventListener('touchmove', handleUserInteraction, { passive: true });
        
        // Détection des clics (sauf sur l'indicateur)
        document.addEventListener('click', function(e) {
            if (e.target !== indicator && !indicator.contains(e.target)) {
                handleUserInteraction(e);
            }
        });
        
        // Détection des touches clavier (flèches, espace, etc.)
        document.addEventListener('keydown', function(e) {
            const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
            if (scrollKeys.includes(e.key)) {
                handleUserInteraction(e);
            }
        });
        
        // Détection de la visibilité de la page
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                pauseAutoScroll();
            } else {
                // Reprendre après un court délai
                setTimeout(function() {
                    if (!isUserInteracting) {
                        resumeAutoScroll();
                    }
                }, 2000);
            }
        });
    }

    /* =========================================
       GESTION DES INTERACTIONS UTILISATEUR
       ========================================= */
    
    function handleUserInteraction(e) {
        // Marquer comme interaction utilisateur
        isUserInteracting = true;
        
        // Mettre en pause immédiatement
        pauseAutoScroll();
        
        // Annuler le timer d'inactivité précédent
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        
        // Démarrer un nouveau timer d'inactivité
        inactivityTimer = setTimeout(function() {
            isUserInteracting = false;
            resumeAutoScroll();
        }, config.inactivityDelay * 1000);
    }

    /* =========================================
       DÉFILEMENT AUTOMATIQUE
       ========================================= */
    
    function startAutoScroll() {
        if (isPaused || isScrolling || isUserInteracting) return;
        
        scheduleNextScroll();
    }

    function scheduleNextScroll() {
        if (isPaused || isUserInteracting) return;
        
        // Annuler le timer précédent
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        
        // Programmer le prochain défilement
        scrollTimer = setTimeout(function() {
            scrollToNextSection();
        }, config.pauseDuration * 1000);
    }

    function scrollToNextSection() {
        if (isPaused || isUserInteracting) return;
        
        isScrolling = true;
        
        // Calculer la prochaine section
        currentSectionIndex++;
        
        // Boucle infinie : revenir au début après la dernière section
        if (currentSectionIndex >= sections.length) {
            currentSectionIndex = 0;
            
            // Scroll vers le haut de la page
            window.scrollTo({
                top: 0,
                behavior: config.scrollBehavior
            });
        } else {
            // Scroll vers la section suivante
            const targetSection = sections[currentSectionIndex];
            const headerHeight = document.getElementById('header')?.offsetHeight || 80;
            const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: config.scrollBehavior
            });
        }
        
        // Marquer la fin du scroll après la durée de l'animation
        const scrollDuration = speedSettings[config.speed] || speedSettings.slow;
        
        setTimeout(function() {
            isScrolling = false;
            
            // Programmer le prochain défilement
            if (!isPaused && !isUserInteracting) {
                scheduleNextScroll();
            }
        }, scrollDuration);
    }

    /* =========================================
       PAUSE ET REPRISE
       ========================================= */
    
    function pauseAutoScroll() {
        if (isPaused) return;
        
        isPaused = true;
        
        // Annuler le timer de défilement
        if (scrollTimer) {
            clearTimeout(scrollTimer);
            scrollTimer = null;
        }
        
        // Mettre à jour l'indicateur
        updateIndicator(true);
        
        console.log('W2KAutoScroll: Mis en pause');
    }

    function resumeAutoScroll() {
        if (!isPaused) return;
        
        isPaused = false;
        isUserInteracting = false;
        
        // Mettre à jour l'indicateur
        updateIndicator(false);
        
        // Reprendre le défilement
        scheduleNextScroll();
        
        console.log('W2KAutoScroll: Reprise du défilement');
    }

    /* =========================================
       CONTRÔLES PUBLICS
       ========================================= */
    
    function pause() {
        pauseAutoScroll();
    }

    function resume() {
        // Annuler le timer d'inactivité
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        resumeAutoScroll();
    }

    function goToSection(index) {
        if (index < 0 || index >= sections.length) {
            console.warn('W2KAutoScroll: Index de section invalide');
            return;
        }
        
        currentSectionIndex = index;
        
        const targetSection = sections[currentSectionIndex];
        const headerHeight = document.getElementById('header')?.offsetHeight || 80;
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: config.scrollBehavior
        });
    }

    function destroy() {
        // Nettoyer les timers
        if (scrollTimer) clearTimeout(scrollTimer);
        if (inactivityTimer) clearTimeout(inactivityTimer);
        
        // Supprimer l'indicateur s'il a été créé dynamiquement
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
        
        // Réinitialiser les variables
        sections = [];
        currentSectionIndex = 0;
        isScrolling = false;
        isPaused = true;
        
        console.log('W2KAutoScroll: Détruit');
    }

    function getStatus() {
        return {
            isPaused: isPaused,
            isScrolling: isScrolling,
            isUserInteracting: isUserInteracting,
            currentSectionIndex: currentSectionIndex,
            totalSections: sections.length,
            config: config
        };
    }

    /* =========================================
       API PUBLIQUE
       ========================================= */
    
    return {
        init: init,
        pause: pause,
        resume: resume,
        goToSection: goToSection,
        destroy: destroy,
        getStatus: getStatus
    };

})();

// Exporter pour utilisation module si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = W2KAutoScroll;
}
