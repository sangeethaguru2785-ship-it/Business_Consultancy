/* ================================================================
   STACKLY — SHARED SITE SCRIPT
   Navigation, scroll reveals, counters and small UI helpers.
   ================================================================ */
(function () {
    'use strict';

    /* ---------- NAVBAR SCROLL STATE ---------- */
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        const updateNavbar = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
        updateNavbar();
        window.addEventListener('scroll', updateNavbar, { passive: true });
    }

    /* ---------- ACTIVE NAV LINK (fallback if not hard-coded) ---------- */
    const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
        const href = (link.getAttribute('href') || '').split('#')[0].toLowerCase();
        if (href && href === currentPage) {
            link.classList.add('active');
        }
    });

    /* ---------- CLOSE MOBILE MENU ON LINK CLICK ---------- */
    document.querySelectorAll('#navbarNav .nav-link, #navbarNav .btn-consult').forEach((link) => {
        link.addEventListener('click', () => {
            const collapse = document.querySelector('.navbar-collapse');
            if (collapse && collapse.classList.contains('show') && window.bootstrap) {
                window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
            }
        });
    });

    /* ---------- ANIMATED COUNTERS ---------- */
    const animateCounter = (el) => {
        if (el.dataset.animated === 'true') return;
        el.dataset.animated = 'true';

        const target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target + suffix;
            }
        };

        requestAnimationFrame(tick);
    };

    const counters = document.querySelectorAll('[data-count]');

    if (counters.length) {
        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });

            counters.forEach((el) => counterObserver.observe(el));
        } else {
            counters.forEach(animateCounter);
        }
    }

    /* ---------- SCROLL PROGRESS BAR ---------- */
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.prepend(progressBar);

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    };
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    /* ---------- SCROLL REVEAL ANIMATIONS ---------- */
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        // Hero & Page-Hero background parallax on scroll
        gsap.utils.toArray('.hero-bg, .page-hero-bg').forEach((bg) => {
            gsap.to(bg, {
                yPercent: 18,
                ease: 'none',
                scrollTrigger: {
                    trigger: bg.parentElement,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Section headers (badge, title, subtitle)
        gsap.utils.toArray('.section-header').forEach((header) => {
            const children = header.children;
            gsap.from(children.length ? children : header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                },
                y: 36,
                opacity: 0,
                duration: 0.75,
                stagger: 0.12,
                ease: 'power3.out'
            });
        });

        // Card & item groups with per-section stagger
        const revealSelectors = [
            '.service-card',
            '.value-card',
            '.metric-card',
            '.team-card',
            '.timeline-item',
            '.service-row',
            '.process-step',
            '.industry-card',
            '.case-card',
            '.testimonial-card',
            '.office-card',
            '.accordion-item',
            '.contact-item',
            '.feature-item'
        ];

        revealSelectors.forEach((selector) => {
            gsap.utils.toArray(selector).forEach((el, index) => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 48,
                    scale: 0.96,
                    opacity: 0,
                    duration: 0.8,
                    delay: (index % 4) * 0.09,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity'
                });
            });
        });

        // Directional slide-in blocks
        [
            { selector: '.about-image-wrapper', x: -65, y: 0 },
            { selector: '.about-content', x: 65, y: 0 },
            { selector: '.contact-info', x: -55, y: 0 },
            { selector: '.contact-form-wrapper', x: 55, y: 0 },
            { selector: '.map-panel', x: 0, y: 50 },
            { selector: '.cta-inner', x: 0, y: 40 }
        ].forEach((item) => {
            gsap.utils.toArray(item.selector).forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse'
                    },
                    x: item.x || 0,
                    y: item.y || 0,
                    opacity: 0,
                    duration: 0.95,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity'
                });
            });
        });

        const splitTitleWords = (titleEl) => {
            if (!titleEl || titleEl.querySelector('.hero-word')) return;
            let idx = 0;
            const wrapWords = (node, extraClass) => {
                if (node.nodeType === 3) {
                    const parts = node.nodeValue.split(/(\s+)/);
                    const frag = document.createDocumentFragment();
                    parts.forEach((part) => {
                        if (/^\s+$/.test(part) || !part) {
                            frag.appendChild(document.createTextNode(part));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'hero-word' + (extraClass ? ' ' + extraClass : '');
                            span.style.setProperty('--word-index', idx++);
                            span.textContent = part;
                            frag.appendChild(span);
                        }
                    });
                    node.parentNode.replaceChild(frag, node);
                } else if (node.nodeType === 1) {
                    const isAccent = node.classList.contains('text-accent');
                    Array.from(node.childNodes).forEach((child) => wrapWords(child, isAccent ? 'text-accent' : extraClass));
                    if (isAccent) {
                        const frag = document.createDocumentFragment();
                        while (node.firstChild) frag.appendChild(node.firstChild);
                        node.parentNode.replaceChild(frag, node);
                    }
                }
            };
            Array.from(titleEl.childNodes).forEach((n) => wrapWords(n, ''));
        };

        document.querySelectorAll('.hero-title, .page-hero-title').forEach(splitTitleWords);

        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (document.querySelector('.hero-content')) {
            heroTimeline
                .fromTo('.hero-badge', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 })
                .fromTo('.hero-subtitle', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, '+=0.7')
                .fromTo('.hero-actions .btn', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.14 }, '-=0.45')
                .fromTo('.hero-stats .stat-item', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.12 }, '-=0.4')
                .fromTo('.scroll-indicator', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.35');
        }

        if (document.querySelector('.page-hero-content')) {
            heroTimeline
                .fromTo('.page-hero .hero-badge', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 })
                .fromTo('.page-hero-subtitle', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, '+=0.6')
                .fromTo('.page-hero .breadcrumb-nav', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, '-=0.45');
        }
    } else if ('IntersectionObserver' in window) {
        const fallbackTargets = document.querySelectorAll(
            '.section-header, .service-card, .value-card, .metric-card, .team-card, .timeline-item, ' +
            '.service-row, .process-step, .industry-card, .case-card, .testimonial-card, .office-card, ' +
            '.accordion-item, .about-image-wrapper, .about-content, .contact-info, .contact-form-wrapper, ' +
            '.map-panel, .cta-inner, .footer .row > div'
        );
        fallbackTargets.forEach((el) => el.classList.add('reveal-on-scroll'));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('is-visible', entry.isIntersecting);
            });
        }, { threshold: 0.12 });
        fallbackTargets.forEach((el) => observer.observe(el));
    }

    /* ---------- NEWSLETTER FORMS ---------- */
    const emailValidator = window.StacklyEmail;

    const getNewsletterMessage = (form) => {
        let message = form.nextElementSibling;

        if (!message || !message.classList.contains('newsletter-message')) {
            message = document.createElement('p');
            message.className = 'newsletter-message';
            message.setAttribute('role', 'alert');
            message.setAttribute('aria-live', 'polite');
            form.insertAdjacentElement('afterend', message);
        }

        return message;
    };

    const showNewsletterError = (form, input, text) => {
        const message = getNewsletterMessage(form);
        message.textContent = text;
        message.classList.add('show');
        form.classList.add('is-error');
        emailValidator.markInvalid(input);
    };

    const clearNewsletterError = (form, input) => {
        const message = form.nextElementSibling;
        form.classList.remove('is-error');
        emailValidator.clearInvalid(input);

        if (message && message.classList.contains('newsletter-message')) {
            message.textContent = '';
            message.classList.remove('show');
        }
    };

    document.querySelectorAll('.newsletter-form').forEach((form) => {
        const input = form.querySelector('.newsletter-input');
        if (!input) return;

        input.addEventListener('input', () => clearNewsletterError(form, input));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearNewsletterError(form, input);

            const email = input.value.trim();

            if (!email) {
                showNewsletterError(form, input, emailValidator.emptyMessage);
                input.focus();
                return;
            }

            if (!emailValidator.isValid(email)) {
                showNewsletterError(form, input, emailValidator.invalidMessage);
                input.focus();
                return;
            }

            window.location.href = '404.html';
        });
    });

    /* ---------- CURRENT YEAR ---------- */
    document.querySelectorAll('.js-year').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });

    /* ---------- SMOOTH SCROLL FOR IN-PAGE ANCHORS ---------- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const hash = this.getAttribute('href');
            if (!hash || hash === '#') return;

            const target = document.querySelector(hash);
            if (!target) return;

            e.preventDefault();
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({ top: targetPosition, behavior: 'smooth' });

            const collapse = document.querySelector('.navbar-collapse');
            if (collapse && collapse.classList.contains('show') && window.bootstrap) {
                window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
            }
        });
    });
})();
