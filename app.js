// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contactForm');

// Mobile Navigation Toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (hamburger && navMenu && navbar && !navbar.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scrolling for navigation links - Fixed version
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navbarHeight = navbar ? navbar.offsetHeight : 70;
            const offsetTop = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: Math.max(0, offsetTop),
                behavior: 'smooth'
            });
            
            // Update URL hash
            history.pushState(null, null, targetId);
        }
    });
});

// Navbar scroll effect and active link highlighting
let lastScrollTop = 0;

function updateActiveNavLink() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let current = 'home'; // default to home
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Navbar background effect on scroll
    if (navbar) {
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Update active nav link
    updateActiveNavLink();
    
    lastScrollTop = scrollTop;
});

// Contact Form Handling - Fixed version
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name')?.trim() || '';
        const email = formData.get('email')?.trim() || '';
        const subject = formData.get('subject')?.trim() || '';
        const message = formData.get('message')?.trim() || '';
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Create mailto link
        const mailtoSubject = `Portfolio Contact: ${subject}`;
        const mailtoBody = `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:1790.abi@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
        
        try {
            // Create a temporary link and click it
            const tempLink = document.createElement('a');
            tempLink.href = mailtoLink;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            
            // Show success message
            showNotification('Your email client should open with the message ready to send!', 'success');
            
            // Reset form after a short delay
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
        } catch (error) {
            showNotification('Unable to open email client. Please send an email directly to 1790.abi@gmail.com', 'error');
        }
    });
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</div>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.closest('.notification').remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    const notificationStyles = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: white;
        border: 1px solid ${type === 'success' ? '#8BC34A' : type === 'error' ? '#f44336' : '#2196F3'};
        border-radius: 10px;
        padding: 1rem 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'border-left: 4px solid #8BC34A;' : ''}
        ${type === 'error' ? 'border-left: 4px solid #f44336;' : ''}
    `;
    
    notification.style.cssText = notificationStyles;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Trigger slide-in animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add notification styles to head
function addNotificationStyles() {
    if (document.querySelector('#notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .notification-icon {
            font-size: 1.25rem;
            flex-shrink: 0;
        }
        .notification-message {
            color: #333;
            font-size: 0.9rem;
            line-height: 1.4;
            flex: 1;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 1.25rem;
            color: #666;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s ease;
            flex-shrink: 0;
        }
        .notification-close:hover {
            background: rgba(0, 0, 0, 0.1);
            color: #333;
        }
    `;
    document.head.appendChild(style);
}

// Scroll animations for elements
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

// Initialize scroll animations
function initScrollAnimations() {
    // Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .skill-category.animate-element {
            transition-delay: calc(var(--animation-order) * 0.1s);
        }
        .timeline-item.animate-element {
            transition-delay: calc(var(--animation-order) * 0.2s);
        }
        .certification-card.animate-element {
            transition-delay: calc(var(--animation-order) * 0.15s);
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll(`
        .about-card,
        .skill-category,
        .timeline-item,
        .education-card,
        .certification-card,
        .highlight-item
    `);
    
    animatedElements.forEach((el, index) => {
        el.classList.add('animate-element');
        el.style.setProperty('--animation-order', index);
        observer.observe(el);
    });
}

// Typing effect for hero subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid #8BC34A';
    
    let i = 0;
    const typeSpeed = 150;
    
    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, typeSpeed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing effect after page load
    setTimeout(typeWriter, 1500);
}

// Enhanced skills hover effects
function initSkillsEffects() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    // Add hover styles if not already present
    if (!document.querySelector('#skill-hover-styles')) {
        const skillHoverStyle = document.createElement('style');
        skillHoverStyle.id = 'skill-hover-styles';
        skillHoverStyle.textContent = `
            .skill-tag {
                transition: all 0.3s ease !important;
                cursor: pointer;
            }
            .skill-tag:hover {
                transform: translateY(-3px) scale(1.05) !important;
                box-shadow: 0 5px 15px rgba(139, 195, 74, 0.3) !important;
            }
            .skill-tag--primary:hover {
                box-shadow: 0 5px 15px rgba(139, 195, 74, 0.5) !important;
            }
        `;
        document.head.appendChild(skillHoverStyle);
    }
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-3px) scale(1.05)';
            if (tag.classList.contains('skill-tag--primary')) {
                tag.style.boxShadow = '0 5px 15px rgba(139, 195, 74, 0.5)';
            } else {
                tag.style.boxShadow = '0 5px 15px rgba(139, 195, 74, 0.3)';
            }
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = '';
            tag.style.boxShadow = '';
        });
    });
}

// Form validation and enhancement
function enhanceForm() {
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            
            // Add validation feedback
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.style.borderColor = '#f44336';
            } else {
                input.style.borderColor = '';
            }
        });
        
        // Real-time email validation
        if (input.type === 'email') {
            input.addEventListener('input', () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (input.value && !emailRegex.test(input.value)) {
                    input.style.borderColor = '#f44336';
                } else {
                    input.style.borderColor = '';
                }
            });
        }
    });
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // Add styles for scroll to top button
    const scrollButtonStyle = document.createElement('style');
    scrollButtonStyle.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #8BC34A;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(139, 195, 74, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .scroll-to-top:hover {
            background: #689F38;
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(139, 195, 74, 0.4);
        }
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 1.25rem;
            }
        }
    `;
    document.head.appendChild(scrollButtonStyle);
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    addNotificationStyles();
    initScrollAnimations();
    initTypingEffect();
    initSkillsEffects();
    enhanceForm();
    initScrollToTop();
    
    // Set initial active nav link based on current hash or default to home
    const currentHash = window.location.hash || '#home';
    const targetLink = document.querySelector(`a[href="${currentHash}"]`);
    if (targetLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        targetLink.classList.add('active');
    } else {
        // Default to home
        const homeLink = document.querySelector('a[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
    }
    
    // Update active nav link on page load
    setTimeout(() => {
        updateActiveNavLink();
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768 && hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        if (hamburger) hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Prevent horizontal scroll
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflowX = 'hidden';
});

// Add smooth scroll behavior to root
if (document.documentElement) {
    document.documentElement.style.scrollBehavior = 'smooth';
}