// Nirvanica Resort JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and effects
    initScrollAnimations();
    initParallaxEffect();
    initSmoothScrolling();
    initHoverEffects();
    initCounterAnimations();
});

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.room-card, .gallery-item, .facility-item, .highlight-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background img');
    
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced hover effects
function initHoverEffects() {
    // Room cards hover effect
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Gallery items hover effect
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1) rotate(1deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Facility items pulse effect
    const facilityItems = document.querySelectorAll('.facility-item');
    facilityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.facility-icon');
            if (icon) {
                icon.style.animation = 'pulse 0.5s ease-in-out infinite';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.facility-icon');
            if (icon) {
                icon.style.animation = 'pulse 2s infinite';
            }
        });
    });
}

// Counter animations for statistics
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Button click animations
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        // Create ripple effect
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add ripple effect CSS dynamically
const rippleCSS = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
initLazyLoading();

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBarElement = document.querySelector('.scroll-progress-bar');
        if (progressBarElement) {
            progressBarElement.style.width = scrollPercent + '%';
        }
    });
}

// Add scroll progress CSS
const progressCSS = `
.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(0, 77, 77, 0.1);
    z-index: 1000;
}

.scroll-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ffb845, #004d4d);
    width: 0%;
    transition: width 0.1s ease;
}
`;

const progressStyle = document.createElement('style');
progressStyle.textContent = progressCSS;
document.head.appendChild(progressStyle);

// Initialize scroll progress
initScrollProgress();

// Typing animation for hero title
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Initialize typing animation
initTypingAnimation();

// Mobile menu toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Initialize mobile menu
initMobileMenu();

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loaded class CSS
const loadedCSS = `
body {
    opacity: 0;
    transition: opacity 0.5s ease;
}

body.loaded {
    opacity: 1;
}
`;

const loadedStyle = document.createElement('style');
loadedStyle.textContent = loadedCSS;
document.head.appendChild(loadedStyle);
