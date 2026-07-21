// ===========================
// Patrick Writer - 中文版 JavaScript
// 博士論文輔導服務網站
// ===========================

// === 初始化 ===
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 AOS 動畫
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // 初始化所有功能
    initNavigation();
    initHeroParallax();
    initCounters();
    initServiceTabs();
    initTestimonialCarousel();
    initFAQ();
    initContactForm();
    initScrollButtons();
    initMobileMenu();
});

// === 導航功能 ===
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 滾動時添加陰影
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // 平滑滾動到錨點
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80; // navbar height
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // 關閉移動選單
                    const navMenu = document.getElementById('navMenu');
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                    }
                }
            }
        });
    });
}

// === 移動選單 ===
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // 動畫效果
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

// === 英雄區塊視差效果 ===
function initHeroParallax() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
}

// === 動畫計數器 ===
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
                    counter.textContent = current.toFixed(1);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toFixed(1);
                }
            };
            
            updateCounter();
        });
        
        animated = true;
    };
    
    // 使用 Intersection Observer 觸發動畫
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

// === 服務標籤切換 ===
function initServiceTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // 移除所有 active 類
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加 active 到當前標籤
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// === 推薦輪播 ===
function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    let currentIndex = 0;
    let autoplayInterval;
    
    // 創建指示點
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function updateCarousel() {
        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentIndex) {
                card.classList.add('active');
            }
        });
        
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoplay();
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // 事件監聽
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
    
    // 懸停時暫停
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // 觸控滑動支援
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
            resetAutoplay();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
            resetAutoplay();
        }
    }
    
    // 啟動自動播放
    startAutoplay();
}

// === FAQ 手風琴 ===
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 關閉所有項目
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // 如果當前項目未激活，則打開它
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// === 多步驟聯繫表單 ===
function initContactForm() {
    const form = document.getElementById('consultationForm');
    if (!form) return;
    
    let currentStep = 1;
    const totalSteps = 3;
    
    // 更新進度條
    window.updateProgress = function() {
        const progressFill = document.getElementById('progressFill');
        const percentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = percentage + '%';
        
        // 更新步驟指示器
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    };
    
    // 下一步
    window.nextStep = function() {
        const currentStepElement = document.getElementById(`step${currentStep}`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#dc3545';
                
                // 添加錯誤訊息
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('span');
                    errorMsg.classList.add('error-message');
                    errorMsg.style.color = '#dc3545';
                    errorMsg.style.fontSize = '0.85rem';
                    errorMsg.textContent = '此欄位為必填';
                    input.parentNode.insertBefore(errorMsg, input.nextSibling);
                }
            } else {
                input.style.borderColor = '';
                const errorMsg = input.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
                
                // 郵箱驗證
                if (input.type === 'email') {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value)) {
                        isValid = false;
                        input.style.borderColor = '#dc3545';
                        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                            const errorMsg = document.createElement('span');
                            errorMsg.classList.add('error-message');
                            errorMsg.style.color = '#dc3545';
                            errorMsg.style.fontSize = '0.85rem';
                            errorMsg.textContent = '請輸入有效的電子郵件地址';
                            input.parentNode.insertBefore(errorMsg, input.nextSibling);
                        }
                    }
                }
            }
        });
        
        if (!isValid) {
            return;
        }
        
        if (currentStep < totalSteps) {
            currentStepElement.classList.remove('active');
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            updateProgress();
            
            // 滾動到表單頂部
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    
    // 上一步
    window.prevStep = function() {
        if (currentStep > 1) {
            document.getElementById(`step${currentStep}`).classList.remove('active');
            currentStep--;
            document.getElementById(`step${currentStep}`).classList.add('active');
            updateProgress();
            
            // 滾動到表單頂部
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    
    // 表單提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 檢查條款同意
        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            alert('請同意條款與條件');
            return;
        }
        
        // 收集表單數據
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            field: document.getElementById('field').value,
            university: document.getElementById('university').value,
            stage: document.getElementById('stage').value,
            deadline: document.getElementById('deadline').value,
            challenges: document.getElementById('challenges').value,
            preferredTime: document.getElementById('preferredTime').value,
            hearAbout: document.getElementById('hearAbout').value
        };
        
        // 創建 WhatsApp 訊息
        const message = `
您好，我想諮詢博士論文輔導服務！

姓名：${formData.fullName}
電子郵件：${formData.email}
電話：${formData.phone}

學術領域：${formData.field}
大學/機構：${formData.university}
當前階段：${formData.stage}
目標完成日期：${formData.deadline}

具體挑戰：
${formData.challenges}

偏好諮詢時間：${formData.preferredTime}

期待您的回覆，謝謝！
        `.trim();
        
        // 顯示成功訊息
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 10000;
            text-align: center;
            max-width: 90%;
            width: 400px;
        `;
        
        successMessage.innerHTML = `
            <div style="font-size: 3rem; color: #d4af37; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 style="color: #1a2b4a; margin-bottom: 1rem;">提交成功！</h3>
            <p style="color: #6c757d; margin-bottom: 1.5rem;">
                感謝您的諮詢申請。我們將立即透過 WhatsApp 與您聯繫。
            </p>
            <button id="closeSuccess" style="
                padding: 0.75rem 2rem;
                background: linear-gradient(135deg, #d4af37, #e6c563);
                color: white;
                border: none;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
            ">確定</button>
        `;
        
        document.body.appendChild(successMessage);
        
        // 關閉按鈕
        document.getElementById('closeSuccess').addEventListener('click', () => {
            successMessage.remove();
            
            // 跳轉到 WhatsApp
            const whatsappUrl = `https://wa.me/447481747436?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            // 重置表單
            form.reset();
            currentStep = 1;
            document.querySelectorAll('.form-step').forEach((step, index) => {
                if (index === 0) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
            updateProgress();
        });
        
        // 3秒後自動關閉並跳轉
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                document.getElementById('closeSuccess').click();
            }
        }, 3000);
    });
    
    // 即時驗證
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailPattern.test(this.value)) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '';
            }
        });
    }
    
    // 電話號碼格式化
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // 移除所有非數字和加號
            let value = this.value.replace(/[^\d+]/g, '');
            this.value = value;
        });
    }
}

// === 滾動按鈕 ===
function initScrollButtons() {
    const backToTop = document.getElementById('backToTop');
    
    // 返回頂部按鈕
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

// === 圖片懶加載 ===
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// === 阻止右鍵（可選） ===
// 取消註釋以啟用
/*
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});
*/

// === 性能優化 - 防抖函數 ===
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

// === 性能優化 - 節流函數 ===
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

// === 控制台訊息 ===
console.log('%c歡迎來到 Patrick Writer！', 'color: #d4af37; font-size: 24px; font-weight: bold;');
console.log('%c我們提供頂尖的博士論文輔導服務', 'color: #1a2b4a; font-size: 16px;');
console.log('%c聯繫我們：WhatsApp +44 7481 747436', 'color: #6c757d; font-size: 14px;');