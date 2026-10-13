/**
 * ==============================================================================
 * PORTFOLIO CLIENT-SIDE SCRIPT — MANAN RATHORE
 * B.Tech ECE (Semiconductor & Chip Design) | JECRC University
 * Pure Vanilla JavaScript • Zero external dependencies • Offline-ready
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. DYNAMIC FOOTER COPYRIGHT YEAR
    // --------------------------------------------------------------------------
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --------------------------------------------------------------------------
    // 2. MOBILE NAVIGATION MENU TOGGLE & ACCESSIBILITY
    // --------------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        if (!mobileToggle || !mobileNav) return;
        mobileToggle.classList.add('is-active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileNav.removeAttribute('hidden');
    }

    function closeMobileMenu() {
        if (!mobileToggle || !mobileNav) return;
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('hidden', '');
    }

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when a link inside it is clicked
        mobileNavLinks.forEach((link) => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.hasAttribute('hidden') && 
                !mobileNav.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileNav.hasAttribute('hidden')) {
                closeMobileMenu();
                mobileToggle.focus();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 3. HEADER BACKGROUND SHADOW ON SCROLL
    // --------------------------------------------------------------------------
    const siteHeader = document.getElementById('header');
    const backToTopBtn = document.getElementById('back-to-top');

    function handleScrollEffects() {
        const scrollY = window.scrollY || window.pageYOffset;

        // Header shadow
        if (siteHeader) {
            if (scrollY > 30) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        }

        // Back to top button visibility
        if (backToTopBtn) {
            if (scrollY > 350) {
                backToTopBtn.removeAttribute('hidden');
            } else {
                backToTopBtn.setAttribute('hidden', '');
            }
        }
    }

    window.addEventListener('scroll', handleScrollEffects, { passive: true });
    handleScrollEffects(); // Initial check

    // Back to top click handler
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --------------------------------------------------------------------------
    // 4. ACTIVE NAVIGATION LINK HIGHLIGHTING VIA INTERSECTION OBSERVER
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-desktop .nav-link, .mobile-nav-link');

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    
                    navLinks.forEach((link) => {
                        const href = link.getAttribute('href');
                        if (href === `#${currentId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    // --------------------------------------------------------------------------
    // 5. ROTATING ROLE / TAGLINE TEXT (Subtle & Accessible)
    // --------------------------------------------------------------------------
    const rotatingTextElement = document.getElementById('rotating-text');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (rotatingTextElement && !prefersReducedMotion) {
        const roles = [
            'Semiconductors, Chip Design & Embedded Systems',
            'ECE Student & Hardware Enthusiast',
            'Embedded Systems Learner',
            'Aspiring Semiconductor Engineer'
        ];

        let roleIndex = 0;

        function updateRole() {
            roleIndex = (roleIndex + 1) % roles.length;
            
            // Fade out smoothly
            rotatingTextElement.style.opacity = '0';
            rotatingTextElement.style.transition = 'opacity 0.25s ease';

            setTimeout(() => {
                rotatingTextElement.textContent = roles[roleIndex];
                rotatingTextElement.style.opacity = '1';
            }, 250);
        }

        // Change text every 3.5 seconds
        setInterval(updateRole, 3500);
    }

    // --------------------------------------------------------------------------
    // 6. CLIENT-SIDE CONTACT FORM VALIDATION & MAILTO PREPARATION
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const copyMessageBtn = document.getElementById('copy-message-btn');

    // Input fields & error spans
    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const subjectInput = document.getElementById('msg-subject');
    const contentInput = document.getElementById('msg-content');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const contentError = document.getElementById('content-error');

    // Basic email validation regex
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).trim());
    }

    function clearFieldError(input, errorElement) {
        if (input && errorElement) {
            input.classList.remove('is-invalid');
            errorElement.classList.remove('visible');
        }
    }

    function setFieldError(input, errorElement) {
        if (input && errorElement) {
            input.classList.add('is-invalid');
            errorElement.classList.add('visible');
        }
    }

    // Live validation clearing on input
    [
        [nameInput, nameError],
        [emailInput, emailError],
        [subjectInput, subjectError],
        [contentInput, contentError]
    ].forEach(([input, errorElement]) => {
        if (input) {
            input.addEventListener('input', () => {
                clearFieldError(input, errorElement);
            });
        }
    });

    let lastPreparedMessage = '';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = contentInput ? contentInput.value.trim() : '';

            // Name check
            if (!name) {
                setFieldError(nameInput, nameError);
                isValid = false;
            } else {
                clearFieldError(nameInput, nameError);
            }

            // Email check
            if (!email || !isValidEmail(email)) {
                setFieldError(emailInput, emailError);
                isValid = false;
            } else {
                clearFieldError(emailInput, emailError);
            }

            // Subject check
            if (!subject) {
                setFieldError(subjectInput, subjectError);
                isValid = false;
            } else {
                clearFieldError(subjectInput, subjectError);
            }

            // Message check
            if (!message) {
                setFieldError(contentInput, contentError);
                isValid = false;
            } else {
                clearFieldError(contentInput, contentError);
            }

            if (!isValid) {
                return;
            }

            // Formatted body for mailto and clipboard
            const formattedBody = `From: ${name} (${email})\n\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSent via Portfolio Contact Form (Manan Rathore | B.Tech ECE)`;
            lastPreparedMessage = formattedBody;

            // Target recipient (Editable in HTML/Script)
            const recipientEmail = 'mananrathore.ece@example.com';
            
            // Build encoded mailto URL
            const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent('[Portfolio] ' + subject)}&body=${encodeURIComponent(formattedBody)}`;

            // Display transparent feedback card
            if (formFeedback) {
                formFeedback.removeAttribute('hidden');
                formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Attempt to trigger user's default email client
            try {
                window.location.href = mailtoUrl;
            } catch (err) {
                console.warn('Unable to automatically launch mail client via mailto:', err);
            }
        });
    }

    // Copy to clipboard fallback button
    if (copyMessageBtn) {
        copyMessageBtn.addEventListener('click', () => {
            if (!lastPreparedMessage) {
                const name = nameInput ? nameInput.value.trim() : '';
                const email = emailInput ? emailInput.value.trim() : '';
                const subject = subjectInput ? subjectInput.value.trim() : '';
                const message = contentInput ? contentInput.value.trim() : '';
                lastPreparedMessage = `From: ${name} (${email})\nSubject: ${subject}\n\n${message}`;
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(lastPreparedMessage)
                    .then(() => {
                        const originalText = copyMessageBtn.innerHTML;
                        copyMessageBtn.innerHTML = '<span>Copied to Clipboard! ✓</span>';
                        setTimeout(() => {
                            copyMessageBtn.innerHTML = originalText;
                        }, 2500);
                    })
                    .catch(() => {
                        fallbackCopy(lastPreparedMessage);
                    });
            } else {
                fallbackCopy(lastPreparedMessage);
            }
        });
    }

    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            if (copyMessageBtn) {
                const originalText = copyMessageBtn.innerHTML;
                copyMessageBtn.innerHTML = '<span>Copied to Clipboard! ✓</span>';
                setTimeout(() => {
                    copyMessageBtn.innerHTML = originalText;
                }, 2500);
            }
        } catch (err) {
            alert('Could not auto-copy. Please select and copy your text manually.');
        }
        document.body.removeChild(textArea);
    }
});
