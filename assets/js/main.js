// Enhanced mobile navigation with touch support
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
const body = document.body;

if (toggle && links) {
  // Toggle navigation
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    links.classList.toggle('open');
    body.classList.toggle('nav-open');
    
    // Prevent body scroll when menu is open
    if (links.classList.contains('open')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) {
      links.classList.remove('open');
      body.classList.remove('nav-open');
      body.style.overflow = '';
    }
  });
  
  // Close menu when clicking on a link
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      body.classList.remove('nav-open');
      body.style.overflow = '';
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      body.classList.remove('nav-open');
      body.style.overflow = '';
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 767 && links.classList.contains('open')) {
      links.classList.remove('open');
      body.classList.remove('nav-open');
      body.style.overflow = '';
    }
  });
}

// Smooth scroll for internal anchors
document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;
  if (target.matches('a[href^="#"]')) {
    const id = target.getAttribute('href');
    if (!id) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Enhanced lazy loading with smooth transitions
function setupEnhancedLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  const markLoaded = (img) => {
    img.classList.add('loaded');
    img.setAttribute('data-loaded', 'true');
  };

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // If already loaded from cache, mark immediately
          if (img.complete) {
            markLoaded(img);
            observer.unobserve(img);
            return;
          }

          // Add loaded class for smooth transition
          img.addEventListener('load', () => markLoaded(img), { once: true });

          // Handle load error gracefully
          img.addEventListener('error', () => {
            markLoaded(img);
            console.warn('Failed to load image:', img.src);
          }, { once: true });

          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(img => {
      // If image is already in cache before observer fires
      if (img.complete) {
        markLoaded(img);
      } else {
        imageObserver.observe(img);
      }
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      if (img.complete) {
        markLoaded(img);
      } else {
        img.addEventListener('load', () => markLoaded(img), { once: true });
      }
    });
  }
}

// Preload critical images (only on pages that use them)
function preloadCriticalImages() {
  // Only preload images on pages that actually use them
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Check if current page is gallery or home page where these images might be used
  if (currentPage === 'gallery.html' || currentPage === 'index.html' || currentPage === '') {
    const criticalImages = [
      'assets/img/room_1.jpeg,
      'assets/img/room_2.jpeg'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
}

// Reveal on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Simple lightbox for gallery
function setupLightbox() {
  const images = document.querySelectorAll('[data-lightbox]');
  if (images.length === 0) return;

  let overlay = document.querySelector('.lightbox');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = '<span class="close" aria-label="Close">×</span><img alt="Gallery image" />';
    document.body.appendChild(overlay);
  }

  const imgEl = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.close');

  images.forEach((img) => {
    img.addEventListener('click', () => {
      if (!(img instanceof HTMLImageElement)) return;
      if (!imgEl) return;
      imgEl.src = img.src;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
}

setupLightbox();

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
  setupEnhancedLazyLoading();
  preloadCriticalImages();
});



