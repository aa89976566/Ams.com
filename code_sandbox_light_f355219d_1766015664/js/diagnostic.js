// ===========================
// AMS Diagnostic System
// Intelligent recommendation engine
// ===========================

// User data collection
const diagnosticData = {
    level: '',
    phdService: '',
    challenges: [],
    field: '',
    wordCount: 0,
    topic: '',
    progress: '',
    requirements: '',
    deadline: '5days',
    isFirstOrder: true,
    name: '',
    email: '',
    phone: ''
};

// Tutor database
const tutors = [
    {
        id: 1,
        name: 'Dr. Eleanor Cambridge',
        university: 'University of Oxford',
        specialties: ['Literature', 'History', 'Philosophy', 'Arts'],
        fields: ['literature', 'history', 'philosophy', 'arts'],
        expertise: 'Humanities & Social Sciences',
        experience: 18,
        successRate: 98.5
    },
    {
        id: 2,
        name: 'Prof. James Richardson',
        university: 'University of Cambridge',
        specialties: ['Physics', 'Mathematics', 'Engineering', 'Computer Science'],
        fields: ['physics', 'mathematics', 'engineering', 'computer-science'],
        expertise: 'STEM & Technology',
        experience: 22,
        successRate: 97.8
    },
    {
        id: 3,
        name: 'Dr. Sarah Chen',
        university: 'Imperial College London',
        specialties: ['Medicine', 'Public Health', 'Biology', 'Nursing'],
        fields: ['medicine', 'public-health', 'biology', 'nursing', 'pharmacy'],
        expertise: 'Medical & Health Sciences',
        experience: 15,
        successRate: 99.2
    },
    {
        id: 4,
        name: 'Prof. Michael Thompson',
        university: 'London School of Economics',
        specialties: ['Economics', 'Business', 'Finance', 'Psychology'],
        fields: ['economics', 'business', 'finance', 'psychology', 'sociology'],
        expertise: 'Business & Social Sciences',
        experience: 20,
        successRate: 98.0
    },
    {
        id: 5,
        name: 'Dr. Rebecca Martinez',
        university: 'Harvard University',
        specialties: ['Law', 'Education', 'Chemistry', 'Environmental Science'],
        fields: ['law', 'education', 'chemistry'],
        expertise: 'Interdisciplinary Research',
        experience: 16,
        successRate: 97.5
    }
];

// Service recommendations based on challenges
const serviceRecommendations = {
    'topic-selection': {
        service: 'Topic Consultation & Brainstorming',
        icon: 'fa-lightbulb',
        description: 'One-on-one session to help you identify a compelling research topic that aligns with your interests and academic requirements.'
    },
    'literature-review': {
        service: 'Literature Review Support',
        icon: 'fa-book-open',
        description: 'Comprehensive assistance in finding, analyzing, and synthesizing relevant academic literature for your research.'
    },
    'methodology': {
        service: 'Research Methodology Design',
        icon: 'fa-flask',
        description: 'Expert guidance on selecting and implementing appropriate research methods and frameworks for your study.'
    },
    'data-analysis': {
        service: 'Statistical Analysis & Tools',
        icon: 'fa-chart-bar',
        description: 'Professional support with data analysis using SPSS, R, STATA, Python, or other statistical tools (custom quote required).'
    },
    'writing-structure': {
        service: 'Academic Writing Coaching',
        icon: 'fa-pen',
        description: 'Personalized coaching to improve your academic writing skills, structure, and argumentation.'
    },
    'time-management': {
        service: 'Accelerated Timeline Support',
        icon: 'fa-hourglass-half',
        description: 'Intensive support with rush services to help you meet tight deadlines without compromising quality.'
    },
    'english-language': {
        service: 'Language Editing & Proofreading',
        icon: 'fa-language',
        description: 'Comprehensive language editing to ensure clarity, fluency, and proper academic English style.'
    },
    'citation-formatting': {
        service: 'Citation & Formatting Service',
        icon: 'fa-quote-right',
        description: 'Meticulous formatting and citation checking in any style (APA, MLA, Chicago, Harvard, IEEE, etc.).'
    }
};

// Current step
let currentStep = 1;
const totalSteps = 5;

// DOM elements
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeDiagnostic();
    setupEventListeners();
    updateProgress();
});

function initializeDiagnostic() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

function setupEventListeners() {
    // Level selection
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            diagnosticData.level = this.dataset.level;
            
            // Show/hide PhD service type
            const phdServiceType = document.getElementById('phdServiceType');
            if (diagnosticData.level === 'phd') {
                phdServiceType.style.display = 'block';
            } else {
                phdServiceType.style.display = 'none';
            }
        });
    });
    
    // Challenge checkboxes
    document.querySelectorAll('input[name="challenge"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                diagnosticData.challenges.push(this.value);
            } else {
                diagnosticData.challenges = diagnosticData.challenges.filter(c => c !== this.value);
            }
        });
    });
    
    // PhD service type
    document.querySelectorAll('input[name="phd-service"]').forEach(radio => {
        radio.addEventListener('change', function() {
            diagnosticData.phdService = this.value;
            updatePriceEstimate();
        });
    });
    
    // Form inputs
    document.getElementById('academicField').addEventListener('change', function() {
        diagnosticData.field = this.value;
        updatePriceEstimate();
    });
    
    document.getElementById('wordCount').addEventListener('input', function() {
        diagnosticData.wordCount = parseInt(this.value) || 0;
        updatePriceEstimate();
    });
    
    document.querySelectorAll('input[name="deadline"]').forEach(radio => {
        radio.addEventListener('change', function() {
            diagnosticData.deadline = this.value;
            updatePriceEstimate();
        });
    });
    
    document.querySelectorAll('input[name="is-first-order"]').forEach(radio => {
        radio.addEventListener('change', function() {
            diagnosticData.isFirstOrder = this.value === 'yes';
            updatePriceEstimate();
        });
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', previousStep);
    nextBtn.addEventListener('click', nextStep);
}

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            step.classList.add('completed');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });
    
    // Show/hide navigation buttons
    prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    
    if (currentStep === totalSteps) {
        nextBtn.textContent = 'Proceed to Payment';
        nextBtn.innerHTML = '<i class="fas fa-credit-card"></i> Proceed to Payment';
        nextBtn.style.background = '#28a745';
        nextBtn.style.fontSize = '1.1rem';
        nextBtn.style.padding = '16px 40px';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        nextBtn.style.background = '';
        nextBtn.style.fontSize = '';
        nextBtn.style.padding = '';
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

function nextStep() {
    // Validate current step
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            
            // Generate recommendations if moving to last step
            if (currentStep === totalSteps) {
                generateRecommendations();
            }
            
            showStep(currentStep);
            updateProgress();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Final step - redirect to contact/order
            submitDiagnostic();
        }
    }
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach((formStep, index) => {
        formStep.classList.remove('active');
        if (index + 1 === step) {
            formStep.classList.add('active');
        }
    });
}

function validateStep(step) {
    switch(step) {
        case 1:
            if (!diagnosticData.level) {
                alert('Please select your academic level');
                return false;
            }
            return true;
            
        case 2:
            // Challenges are optional
            return true;
            
        case 3:
            const field = document.getElementById('academicField').value;
            const wordCount = document.getElementById('wordCount').value;
            
            if (!field) {
                alert('Please select your academic field');
                return false;
            }
            
            if (!wordCount || wordCount < 100) {
                alert('Please enter a valid word count (minimum 100 words)');
                return false;
            }
            
            if (diagnosticData.level === 'phd') {
                const phdService = document.querySelector('input[name="phd-service"]:checked');
                if (!phdService) {
                    alert('Please select a PhD service type');
                    return false;
                }
            }
            
            // Store form data
            diagnosticData.field = field;
            diagnosticData.wordCount = parseInt(wordCount);
            diagnosticData.topic = document.querySelector('input[name="topic"]').value;
            diagnosticData.progress = document.querySelector('input[name="progress"]:checked')?.value || '';
            diagnosticData.requirements = document.querySelector('textarea[name="requirements"]').value;
            
            return true;
            
        case 4:
            const name = document.querySelector('input[name="name"]').value;
            const email = document.querySelector('input[name="email"]').value;
            
            if (!name || !email) {
                alert('Please enter your name and email address');
                return false;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return false;
            }
            
            // Store contact data
            diagnosticData.name = name;
            diagnosticData.email = email;
            diagnosticData.phone = document.querySelector('input[name="phone"]').value;
            
            return true;
            
        case 5:
            return true;
            
        default:
            return true;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function updatePriceEstimate() {
    if (!diagnosticData.level || !diagnosticData.wordCount) {
        return;
    }
    
    // Determine service type for PhD
    let serviceType = null;
    if (diagnosticData.level === 'phd') {
        serviceType = diagnosticData.phdService || 'dissertation';
    }
    
    // Calculate price
    const priceBreakdown = calculatePrice(
        diagnosticData.level,
        diagnosticData.wordCount,
        diagnosticData.deadline,
        getFieldCategory(diagnosticData.field),
        serviceType,
        diagnosticData.isFirstOrder
    );
    
    // Update display
    document.getElementById('estimateBase').textContent = formatPrice(priceBreakdown.fieldCost);
    document.getElementById('estimateRush').textContent = formatPrice(priceBreakdown.rushTotal);
    document.getElementById('estimateTotal').textContent = formatPrice(priceBreakdown.finalTotal);
    
    if (diagnosticData.isFirstOrder && priceBreakdown.discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('estimateDiscount').textContent = '-' + formatPrice(priceBreakdown.discount);
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
}

function getFieldCategory(fieldCode) {
    const technicalFields = ['computer-science', 'engineering', 'mathematics', 'physics', 'chemistry'];
    const medicalFields = ['medicine', 'nursing', 'public-health', 'pharmacy'];
    const professionalFields = ['business', 'economics', 'finance', 'law'];
    
    if (technicalFields.includes(fieldCode)) {
        return 'technical';
    } else if (medicalFields.includes(fieldCode)) {
        return 'medical';
    } else if (professionalFields.includes(fieldCode)) {
        return 'professional';
    }
    return 'standard';
}

function generateRecommendations() {
    const container = document.getElementById('recommendationsContainer');
    
    // Calculate final price
    let serviceType = diagnosticData.level === 'phd' ? (diagnosticData.phdService || 'dissertation') : null;
    const priceBreakdown = calculatePrice(
        diagnosticData.level,
        diagnosticData.wordCount,
        diagnosticData.deadline,
        getFieldCategory(diagnosticData.field),
        serviceType,
        diagnosticData.isFirstOrder
    );
    
    // Find matching tutors
    const matchingTutors = findMatchingTutors();
    
    // Get recommended services
    const recommendedServices = diagnosticData.challenges.map(challenge => serviceRecommendations[challenge]).filter(Boolean);
    
    // Build HTML
    let html = `
        <div class="recommendation-header">
            <h2>🎯 Your Personalized Academic Plan</h2>
            <p>Based on your responses, we've created a customized recommendation for your academic success.</p>
        </div>
        
        <div class="recommendation-summary">
            <div class="summary-grid">
                <div class="summary-item">
                    <h4>Academic Level</h4>
                    <p>${getLevelName(diagnosticData.level)}</p>
                </div>
                <div class="summary-item">
                    <h4>Estimated Cost</h4>
                    <p>${formatPrice(priceBreakdown.finalTotal)}</p>
                    ${diagnosticData.isFirstOrder ? '<small style="color: #d4af37;">30% First Order Discount Applied</small>' : ''}
                </div>
                <div class="summary-item">
                    <h4>Delivery Time</h4>
                    <p>${getDeadlineName(diagnosticData.deadline)}</p>
                </div>
                <div class="summary-item">
                    <h4>Word Count</h4>
                    <p>${diagnosticData.wordCount.toLocaleString()} words</p>
                </div>
            </div>
        </div>
    `;
    
    // Recommended tutors
    if (matchingTutors.length > 0) {
        html += `
            <div class="recommended-tutors">
                <h3>👨‍🏫 Your Recommended Expert Tutors</h3>
                <div class="tutor-grid">
        `;
        
        matchingTutors.slice(0, 3).forEach(tutor => {
            html += `
                <div class="tutor-card">
                    <div class="tutor-header">
                        <div class="tutor-avatar">${tutor.name.split(' ').map(n => n[0]).join('')}</div>
                        <div class="tutor-info">
                            <h4>${tutor.name}</h4>
                            <p>${tutor.university}</p>
                        </div>
                    </div>
                    <div class="tutor-match">
                        <i class="fas fa-star"></i> ${tutor.successRate}% Success Rate | ${tutor.experience}+ Years
                    </div>
                    <div class="tutor-specialties">
                        <h5>Specializations:</h5>
                        <div class="specialty-tags">
                            ${tutor.specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Recommended services
    if (recommendedServices.length > 0) {
        html += `
            <div class="recommended-services">
                <h3>📋 Recommended Services for You</h3>
                <div class="services-list">
        `;
        
        recommendedServices.forEach(service => {
            html += `
                <div class="service-item">
                    <div class="service-icon">
                        <i class="fas ${service.icon}"></i>
                    </div>
                    <div class="service-details">
                        <h4>${service.service}</h4>
                        <p>${service.description}</p>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Next steps
    html += `
        <div class="next-steps">
            <h3>🚀 Ready to Get Started?</h3>
            <p>Proceed to secure payment to begin your academic success journey. Your expert tutor will be assigned immediately after payment confirmation.</p>
            <div class="cta-buttons">
                <button onclick="submitDiagnostic()" class="btn-cta primary">
                    <i class="fas fa-credit-card"></i> Proceed to Payment
                </button>
                <a href="https://wa.me/447481747436?text=Hi,%20I%20completed%20the%20Smart%20Diagnostic%20for%20${getLevelName(diagnosticData.level)}%20(${diagnosticData.wordCount}%20words).%20I'm%20interested%20in%20your%20services!" 
                   class="btn-cta secondary" target="_blank">
                    <i class="fab fa-whatsapp"></i> Chat First
                </a>
            </div>
            <p style="margin-top: 20px; font-size: 0.95rem; opacity: 0.9;">
                <i class="fas fa-shield-alt"></i> Secure payment via PayPal or Wise • 30% first-order discount applied
            </p>
        </div>
    `;
    
    container.innerHTML = html;
}

function findMatchingTutors() {
    // Find tutors whose fields match the user's academic field
    return tutors.filter(tutor => {
        return tutor.fields.includes(diagnosticData.field);
    }).sort((a, b) => b.successRate - a.successRate);
}

function getLevelName(level) {
    const names = {
        'undergraduate': 'Undergraduate',
        'postgraduate': 'Postgraduate (Master\'s)',
        'phd': 'PhD / Doctoral',
        'scientific': 'Scientific Publication'
    };
    return names[level] || level;
}

function getDeadlineName(deadline) {
    const names = {
        '5days': '5+ Days (Standard)',
        '4days': '4 Days',
        '3days': '3 Days',
        '2days': '2 Days',
        '24hours': '24 Hours',
        '12hours': '12 Hours',
        '6hours': '6 Hours',
        '3hours': '3 Hours',
        '1hour': '1 Hour'
    };
    return names[deadline] || deadline;
}

function submitDiagnostic() {
    // Prepare order data for payment page
    let serviceType = null;
    if (diagnosticData.level === 'phd') {
        serviceType = diagnosticData.phdService || 'dissertation';
    }
    
    const orderData = {
        level: diagnosticData.level,
        serviceType: serviceType,
        wordCount: diagnosticData.wordCount,
        deadline: diagnosticData.deadline,
        field: diagnosticData.field,
        isFirstOrder: diagnosticData.isFirstOrder,
        name: diagnosticData.name,
        email: diagnosticData.email,
        phone: diagnosticData.phone || '',
        projectTitle: diagnosticData.topic || '',
        challenges: diagnosticData.challenges,
        progress: diagnosticData.progress || '',
        requirements: diagnosticData.requirements || ''
    };
    
    // Save order data to localStorage for payment page
    localStorage.setItem('ams_order_data', JSON.stringify(orderData));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { diagnosticData, tutors, serviceRecommendations };
}
