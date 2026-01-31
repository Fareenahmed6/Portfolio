import './style.css'

console.log('Portfolio app loaded');

// Custom Cursor Elements
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button, .project-card');

// Advanced Cursor Physics
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;
let velX = 0;
let velY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  // Main dot follows instantly but smoothly
  cursorX += (mouseX - cursorX) * 0.2;
  cursorY += (mouseY - cursorY) * 0.2;
  cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

  // Follower with inertia and elasticity
  let distX = mouseX - followerX;
  let distY = mouseY - followerY;

  velX += (distX - velX) * 0.1;
  velY += (distY - velY) * 0.1;

  followerX += velX * 0.5; // Damping
  followerY += velY * 0.5;

  // Calculate squeeze/stretch based on velocity
  const speed = Math.sqrt(velX ** 2 + velY ** 2);
  const scale = Math.min(1 + speed * 0.005, 1.5); // Stretch up to 1.5x
  const angle = Math.atan2(velY, velX) * 180 / Math.PI;

  // Apply changes
  // When idle, add a subtle breathing effect
  const idleScale = speed < 0.1 ? 1 + Math.sin(Date.now() * 0.002) * 0.05 : 1;
  const finalScale = speed > 0.1 ? `scale(${scale}, ${1 / scale}) rotate(${angle}deg)` : `scale(${idleScale})`;

  follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%) ${finalScale}`;

  requestAnimationFrame(animate);
}

animate();

// Hover effects
links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
    follower.classList.add('active');
  });

  link.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
    follower.classList.remove('active');
  });
});

// Simple intersection observer for fade-in animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all elements with fade-in-section class
document.querySelectorAll('.fade-in-section').forEach(element => {
  observer.observe(element);
});

// === About Page Functionality ===

// Scroll Progress Bar
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    const progress = (scrollPosition / scrollTotal) * 100;
    scrollProgress.style.width = progress + '%';
  });
}

// Counter Animation Logic
const animateCounter = (element, target, duration = 2000, suffix = '') => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix; // Ensure exact target at end with suffix
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
};

// Stats Observer
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.number');
      numbers.forEach(num => {
        const originalText = num.textContent;
        // Special case for "24/7"
        if (originalText === '24/7') {
          return; // Don't animate, keep as is
        }
        const target = originalText.includes('+')
          ? parseInt(originalText)
          : originalText.includes('.')
            ? parseFloat(originalText)
            : parseInt(originalText);

        if (typeof target === 'number' && !isNaN(target)) {
          // Reset content to 0 before animating, or animate from 0
          // Ideally we preserve the suffix like '+' if needed, but current logic mimics original which might replace it.
          // Let's assume the user accepts the number replacing text.
          // Or better: animate the number ref.
          animateCounter(num, target);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsPanel = document.querySelector('.stats-floating');
if (statsPanel) {
  statsObserver.observe(statsPanel);
}

// === Skills Page Functionality ===

// Proficiency bars animation
const proficiencyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.proficiency-fill');
      fills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 200);
      });
      proficiencyObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const proficiencySection = document.querySelector('.proficiency-section');
if (proficiencySection) {
  proficiencyObserver.observe(proficiencySection);
}

// Initialize proficiency bars at 0%
document.querySelectorAll('.proficiency-fill').forEach(fill => {
  fill.style.width = '0%';
});

// Counter animation for stats (skills page specific)
const skillsStatsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach(num => {
        const text = num.textContent;
        const hasPlus = text.includes('+');
        const target = parseInt(text);
        const suffix = hasPlus ? '+' : '';

        if (!isNaN(target)) {
          num.textContent = '0' + suffix;
          animateCounter(num, target, 2000, suffix);
        }
      });
      skillsStatsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const skillsStatsSection = document.querySelector('.skills-stats');
if (skillsStatsSection) {
  skillsStatsObserver.observe(skillsStatsSection);
}

// Add click effect to skill tags
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('click', function () {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 200);
  });
});

// Skills search functionality
const skillSearch = document.getElementById('skillSearch');
if (skillSearch) {
  const skillTags = document.querySelectorAll('.skill-tag');

  skillSearch.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    skillTags.forEach(tag => {
      const text = tag.textContent.toLowerCase();
      if (text.includes(query)) {
        tag.style.display = 'flex';
        tag.style.opacity = '1';
        tag.style.transform = 'scale(1)';
      } else {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        setTimeout(() => {
          tag.style.display = 'none';
        }, 300);
      }
    });
  });
}

// === Projects Carousel Logic ===
const carousel = document.querySelector('.projects-carousel');
if (carousel) {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const scrollAmount = 350; // Approx card width + gap

  if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  // Drag to scroll functionality
  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('active');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.style.cursor = 'grabbing';
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('active');
    carousel.style.cursor = 'grab';
  });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('active');
    carousel.style.cursor = 'grab';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    carousel.scrollLeft = scrollLeft - walk;
  });
}

// Contact Form Functionality
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    // Construct mailto link
    // Using encodeURIComponent to ensure special characters don't break the link
    const mailtoLink = `mailto:fareenahmed08@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  });
}

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  const mobileBackBtn = document.querySelector('.mobile-back-btn');
  if (mobileBackBtn) {
    mobileBackBtn.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  }
}

// Close menu when clicking a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (hamburger && mobileMenu && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && hamburger && mobileMenu) {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  }
});
