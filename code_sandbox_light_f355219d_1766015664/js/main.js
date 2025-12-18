// ===========================
// AMS - Academic Masterpiece Studio
// Main JavaScript
// ===========================

// === Initialization ===
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Initialize all functions
    initNavigation();
    initHeroParallax();
    initCounters();
    initServiceTabs();
    initScrollButtons();
    initMobileMenu();
    initPriceCalculator();
});

// === Navigation ===
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll to anchors
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu
                    const navMenu = document.getElementById('navMenu');
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                    }
                }
            }
        });
    });
}

// === Mobile Menu ===
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('active') ? 
                'rotate(45deg) translateY(8px)' : 'none';
            spans[1].style.opacity = navMenu.classList.contains('active') ? 
                '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('active') ? 
                'rotate(-45deg) translateY(-8px)' : 'none';
        });
    }
}

// === Hero Parallax Effect ===
function initHeroParallax() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
}

// === Animated Counters ===
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const animateCounters = () => {
        if (animated) return;
        
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target % 1 === 0 ? target : target.toFixed(1);
                }
            };
            
            updateCounter();
        });
        
        animated = true;
    };
    
    // Use Intersection Observer to trigger animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

// === Service Tabs ===
function initServiceTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove all active classes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active to current tab
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// === Service Level Selection ===
function selectLevel(level) {
    // Store selected level
    sessionStorage.setItem('selectedLevel', level);
    
    // Scroll to pricing calculator
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update calculator dropdown
    setTimeout(() => {
        const calcLevel = document.getElementById('calc-level');
        if (calcLevel) {
            if (level === 'undergraduate') {
                calcLevel.value = 'undergraduate';
            } else if (level === 'postgraduate') {
                calcLevel.value = 'postgraduate';
            } else if (level === 'phd') {
                calcLevel.value = 'phd-full';
            }
            updatePrice();
        }
    }, 500);
}

// === Price Calculator ===
function initPriceCalculator() {
    // Check if level was pre-selected
    const selectedLevel = sessionStorage.getItem('selectedLevel');
    if (selectedLevel) {
        const calcLevel = document.getElementById('calc-level');
        if (calcLevel) {
            if (selectedLevel === 'undergraduate') {
                calcLevel.value = 'undergraduate';
            } else if (selectedLevel === 'postgraduate') {
                calcLevel.value = 'postgraduate';
            } else if (selectedLevel === 'phd') {
                calcLevel.value = 'phd-full';
            }
        }
        sessionStorage.removeItem('selectedLevel');
    }
    
    updatePrice();
}

function updatePrice() {
    const level = document.getElementById('calc-level').value;
    const words = parseInt(document.getElementById('calc-words').value) || 0;
    const deadline = document.getElementById('calc-deadline').value;
    
    // Get base price per word
    let pricePerWord = getBasePrice(level);
    
    // Calculate base price
    let basePrice = words * pricePerWord;
    
    // Calculate rush fee
    let rushMultiplier = getRushFeeMultiplier(deadline);
    let rushFee = basePrice * rushMultiplier;
    
    // Calculate additional services
    let addonPrice = 0;
    
    // Data Analysis
    if (safeCheckbox('addon-spss')) addonPrice += getAddonPrice('spss');
    if (safeCheckbox('addon-stata')) addonPrice += getAddonPrice('stata');
    if (safeCheckbox('addon-r')) addonPrice += getAddonPrice('r');
    if (safeCheckbox('addon-python')) addonPrice += getAddonPrice('python');
    if (safeCheckbox('addon-nvivo')) addonPrice += getAddonPrice('nvivo');
    if (safeCheckbox('addon-atlas')) addonPrice += getAddonPrice('atlas');
    if (safeCheckbox('addon-excel')) addonPrice += getAddonPrice('excel');
    
    // Charts & Visualization
    if (safeCheckbox('addon-charts')) {
        const chartCount = parseInt(document.getElementById('chart-count').value) || 0;
        addonPrice += chartCount * getAddonPrice('charts');
    }
    if (safeCheckbox('addon-infographic')) addonPrice += getAddonPrice('infographic');
    if (safeCheckbox('addon-visualization')) addonPrice += getAddonPrice('visualization');
    if (safeCheckbox('addon-presentation')) addonPrice += getAddonPrice('presentation');
    
    // Professional Analysis Tools
    if (safeCheckbox('addon-swot')) addonPrice += getAddonPrice('swot');
    if (safeCheckbox('addon-pestel')) addonPrice += getAddonPrice('pestel');
    if (safeCheckbox('addon-porter')) addonPrice += getAddonPrice('porter');
    if (safeCheckbox('addon-canvas')) addonPrice += getAddonPrice('canvas');
    if (safeCheckbox('addon-financial')) addonPrice += getAddonPrice('financial');
    if (safeCheckbox('addon-regression')) addonPrice += getAddonPrice('regression');
    if (safeCheckbox('addon-factor')) addonPrice += getAddonPrice('factor');
    if (safeCheckbox('addon-sem')) addonPrice += getAddonPrice('sem');
    
    // Literature & Citations
    if (safeCheckbox('addon-systematic')) addonPrice += getAddonPrice('systematic');
    if (safeCheckbox('addon-meta')) addonPrice += getAddonPrice('meta');
    if (safeCheckbox('addon-bibliography')) addonPrice += getAddonPrice('bibliography');
    if (safeCheckbox('addon-citation')) addonPrice += getAddonPrice('citation');
    
    // Editing & Quality Check
    if (safeCheckbox('addon-plagiarism')) addonPrice += getAddonPrice('plagiarism');
    if (safeCheckbox('addon-turnitin')) addonPrice += getAddonPrice('turnitin');
    if (safeCheckbox('addon-abstract')) addonPrice += getAddonPrice('abstract');
    if (safeCheckbox('addon-executive')) addonPrice += getAddonPrice('executive');
    
    // Calculate total
    const totalPrice = basePrice + rushFee + addonPrice;
    
    // Update display
    document.getElementById('base-price').textContent = formatPrice(basePrice);
    document.getElementById('rush-fee').textContent = formatPrice(rushFee);
    document.getElementById('addon-price').textContent = formatPrice(addonPrice);
    document.getElementById('total-price').textContent = formatPrice(totalPrice);
}

// Helper function to safely check checkbox
function safeCheckbox(id) {
    const element = document.getElementById(id);
    return element && element.checked;
}

function proceedToOrder() {
    const level = document.getElementById('calc-level').value;
    const words = document.getElementById('calc-words').value;
    const totalPrice = document.getElementById('total-price').textContent;
    
    // Store order details
    sessionStorage.setItem('orderDetails', JSON.stringify({
        level: level,
        words: words,
        totalPrice: totalPrice
    }));
    
    // Redirect to order page
    window.location.href = 'order.html';
}

// === Scroll Buttons ===
function initScrollButtons() {
    const backToTop = document.getElementById('backToTop');
    
    // Back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// === Utility Functions ===

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// === Console Message ===
console.log('%cWelcome to Academic Masterpiece Studio!', 'color: #d4af37; font-size: 24px; font-weight: bold;');
console.log('%cProfessional Academic Writing Services', 'color: #1a2b4a; font-size: 16px;');
console.log('%cContact: +44 7481 747436', 'color: #6c757d; font-size: 14px;');