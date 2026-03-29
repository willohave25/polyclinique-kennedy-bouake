/* =========================================
   POLYCLINIQUE KENNEDY BOUAKÉ - MAIN.JS
   Développé par W2K-Digital
   Version 1.0 - 2025
   ========================================= */

(function() {
    'use strict';

    /* =========================================
       VARIABLES GLOBALES
       ========================================= */
    
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const backToTop = document.getElementById('back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    /* =========================================
       MENU MOBILE TOGGLE
       ========================================= */
    
    function toggleMobileMenu() {
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Empêcher le scroll du body quand menu ouvert
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });
        }
    }

    /* =========================================
       DROPDOWN MENU MOBILE
       ========================================= */
    
    function handleDropdownMobile() {
        dropdownItems.forEach(function(item) {
            const link = item.querySelector('.nav-link');
            
            link.addEventListener('click', function(e) {
                // Seulement en mode mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    item.classList.toggle('open');
                }
            });
        });
    }

    /* =========================================
       FERMER MENU AU CLIC SUR LIEN
       ========================================= */
    
    function closeMenuOnClick() {
        const menuLinks = navMenu.querySelectorAll('a');
        
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Fermer le menu mobile après clic sur un lien
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /* =========================================
       HEADER STICKY AU SCROLL
       ========================================= */
    
    function handleStickyHeader() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            // Ajouter classe scrolled pour shadow
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    /* =========================================
       BOUTON RETOUR EN HAUT
       ========================================= */
    
    function handleBackToTop() {
        if (!backToTop) return;
        
        // Afficher/masquer le bouton selon le scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });
        
        // Action au clic
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* =========================================
       SMOOTH SCROLL POUR ANCRES
       ========================================= */
    
    function handleSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Ignorer si c'est juste "#"
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /* =========================================
       HIGHLIGHT PAGE ACTIVE NAVIGATION
       ========================================= */
    
    function highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            
            if (href === currentPage) {
                link.parentElement.classList.add('active');
            } else {
                link.parentElement.classList.remove('active');
            }
        });
    }

    /* =========================================
       FERMER MENU AU CLIC EXTÉRIEUR
       ========================================= */
    
    function closeMenuOnOutsideClick() {
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    /* =========================================
       FERMER MENU AU REDIMENSIONNEMENT
       ========================================= */
    
    function handleResize() {
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // Fermer les dropdowns ouverts
                dropdownItems.forEach(function(item) {
                    item.classList.remove('open');
                });
            }
        });
    }

    /* =========================================
       ANIMATION AU SCROLL (Intersection Observer)
       ========================================= */
    
    function handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-autoscroll]');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fadeInUp');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            animatedElements.forEach(function(el) {
                observer.observe(el);
            });
        }
    }

    /* =========================================
       NUMÉROS DE TÉLÉPHONE CLIQUABLES
       ========================================= */
    
    function formatPhoneLinks() {
        // S'assurer que les liens téléphone fonctionnent sur mobile
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                // Tracker si nécessaire
                console.log('Appel vers:', this.href);
            });
        });
    }

    /* =========================================
       LAZY LOADING DES IMAGES
       ========================================= */
    
    function handleLazyLoading() {
        // Fallback pour les navigateurs ne supportant pas le lazy loading natif
        if ('loading' in HTMLImageElement.prototype) {
            // Le navigateur supporte le lazy loading natif
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(function(img) {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Fallback avec Intersection Observer
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                            }
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(function(img) {
                    imageObserver.observe(img);
                });
            }
        }
    }

    /* =========================================
       PRÉCHARGEMENT DES IMAGES CRITIQUES
       ========================================= */
    
    function preloadCriticalImages() {
        // Précharger l'image hero pour un affichage plus rapide
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const bgImage = getComputedStyle(heroSection).backgroundImage;
            if (bgImage && bgImage !== 'none') {
                const imageUrl = bgImage.replace(/url\(['"]?([^'"]+)['"]?\)/i, '$1');
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = imageUrl;
                document.head.appendChild(link);
            }
        }
    }

    /* =========================================
       ACCESSIBILITÉ - FOCUS VISIBLE
       ========================================= */
    
    function handleFocusAccessibility() {
        // Ajouter une classe quand on navigue au clavier
        document.body.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.body.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-nav');
        });
    }

    /* =========================================
       ACCESSIBILITÉ - ÉCHAP POUR FERMER MENU
       ========================================= */
    
    function handleEscapeKey() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Fermer le menu mobile
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    /* =========================================
       INITIALISATION
       ========================================= */
    
    function init() {
        // Attendre que le DOM soit prêt
        toggleMobileMenu();
        handleDropdownMobile();
        closeMenuOnClick();
        handleStickyHeader();
        handleBackToTop();
        handleSmoothScroll();
        highlightActivePage();
        closeMenuOnOutsideClick();
        handleResize();
        handleScrollAnimations();
        formatPhoneLinks();
        handleLazyLoading();
        preloadCriticalImages();
        handleFocusAccessibility();
        handleEscapeKey();
        
        console.log('Polyclinique Kennedy - Scripts initialisés');
    }

    // Lancer l'initialisation quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
