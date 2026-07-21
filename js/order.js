// Order Form JavaScript
let currentStep = 1;
const totalSteps = 7;
let uploadedFiles = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    initFileUpload();
    populateServiceOptions();
});

// Update progress bar
function updateProgress() {
    const percentage = (currentStep / totalSteps) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Next step
function nextStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    inputs.forEach(input => {
        if (!input.value.trim() && input.type !== 'checkbox') {
            isValid = false;
            input.style.borderColor = '#dc3545';
            
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('small');
                errorMsg.classList.add('error-message');
                errorMsg.style.color = '#dc3545';
                errorMsg.textContent = 'This field is required';
                input.parentNode.appendChild(errorMsg);
            }
        } else {
            input.style.borderColor = '';
            const errorMsg = input.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
            
            // Email validation
            if (input.type === 'email' && input.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value)) {
                    isValid = false;
                    input.style.borderColor = '#dc3545';
                }
            }
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields correctly');
        return;
    }
    
    if (currentStep < totalSteps) {
        currentStepElement.classList.remove('active');
        currentStep++;
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // If moving to review step, populate review
        if (currentStep === 7) {
            populateReview();
        }
    }
}

// Previous step
function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Populate service options based on academic level
function updateServiceOptions() {
    const level = document.querySelector('select[name="academicLevel"]').value;
    const serviceSelect = document.getElementById('serviceType');
    
    serviceSelect.innerHTML = '<option value="">Select...</option>';
    
    if (level === 'undergraduate') {
        serviceSelect.innerHTML += `
            <option value="Essay">Essay (1000-5000 words)</option>
            <option value="Coursework">Coursework/Assignment</option>
            <option value="Research Paper">Research Paper</option>
            <option value="Lab Report">Lab Report</option>
            <option value="Case Study">Case Study</option>
            <option value="Dissertation">Undergraduate Dissertation</option>
            <option value="Editing">Editing & Proofreading</option>
        `;
    } else if (level === 'postgraduate') {
        serviceSelect.innerHTML += `
            <option value="Master Thesis">Master's Thesis (Full)</option>
            <option value="Thesis Chapter">Thesis Chapter</option>
            <option value="Literature Review">Literature Review</option>
            <option value="Research Proposal">Research Proposal</option>
            <option value="Methodology">Methodology Chapter</option>
            <option value="Data Analysis">Data Analysis</option>
            <option value="Editing">Editing & Proofreading</option>
        `;
    } else if (level === 'phd') {
        serviceSelect.innerHTML += `
            <option value="PhD Proposal">PhD Research Proposal</option>
            <option value="Literature Review">Literature Review</option>
            <option value="Methodology">Methodology Development</option>
            <option value="Full Dissertation">Full PhD Dissertation</option>
            <option value="Individual Chapters">Individual Chapters</option>
            <option value="Data Analysis">Statistical/Data Analysis</option>
            <option value="Editing">Professional Editing</option>
            <option value="Viva Preparation">Viva/Defense Preparation</option>
        `;
    }
}

function populateServiceOptions() {
    // Initial call if level already selected
    const levelSelect = document.querySelector('select[name="academicLevel"]');
    if (levelSelect && levelSelect.value) {
        updateServiceOptions();
    }
}

// File upload handling
function initFileUpload() {
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    
    // Click to upload
    uploadBox.addEventListener('click', () => fileInput.click());
    
    // Drag & drop
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = 'var(--accent-gold)';
    });
    
    uploadBox.addEventListener('dragleave', () => {
        uploadBox.style.borderColor = 'var(--border-color)';
    });
    
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = 'var(--border-color)';
        handleFiles(e.dataTransfer.files);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    for (let file of files) {
        if (file.size > maxSize) {
            alert(`${file.name} is too large. Max size is 5MB`);
            continue;
        }
        
        if (uploadedFiles.length >= 10) {
            alert('Maximum 10 files allowed');
            break;
        }
        
        uploadedFiles.push(file);
        displayFile(file);
    }
}

function displayFile(file) {
    const fileList = document.getElementById('fileList');
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const icon = getFileIcon(file.name);
    
    fileItem.innerHTML = `
        <div class="file-info">
            <div class="file-icon">${icon}</div>
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
        </div>
        <button type="button" class="file-remove" onclick="removeFile('${file.name}')">
            <i class="fas fa-times"></i> Remove
        </button>
    `;
    
    fileList.appendChild(fileItem);
}

function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
    
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        if (item.querySelector('.file-name').textContent === fileName) {
            item.remove();
        }
    });
}

function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '<i class="fas fa-file-pdf"></i>',
        'doc': '<i class="fas fa-file-word"></i>',
        'docx': '<i class="fas fa-file-word"></i>',
        'xls': '<i class="fas fa-file-excel"></i>',
        'xlsx': '<i class="fas fa-file-excel"></i>',
        'ppt': '<i class="fas fa-file-powerpoint"></i>',
        'pptx': '<i class="fas fa-file-powerpoint"></i>',
        'txt': '<i class="fas fa-file-alt"></i>'
    };
    return icons[ext] || '<i class="fas fa-file"></i>';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Populate review section
function populateReview() {
    const form = document.getElementById('orderForm');
    const formData = new FormData(form);
    const reviewContent = document.getElementById('reviewContent');
    
    let html = '';
    
    // Basic Information
    html += '<div class="review-group"><h3>Basic Information</h3>';
    html += `<div class="review-item"><span class="review-label">Name:</span><span class="review-value">${formData.get('fullName')}</span></div>`;
    html += `<div class="review-item"><span class="review-label">Email:</span><span class="review-value">${formData.get('email')}</span></div>`;
    html += `<div class="review-item"><span class="review-label">Phone:</span><span class="review-value">${formData.get('phone')}</span></div>`;
    html += `<div class="review-item"><span class="review-label">Country:</span><span class="review-value">${formData.get('country')}</span></div>`;
    html += '</div>';
    
    // Academic Background
    html += '<div class="review-group"><h3>Academic Background</h3>';
    html += `<div class="review-item"><span class="review-label">Level:</span><span class="review-value">${formData.get('academicLevel')}</span></div>`;
    html += `<div class="review-item"><span class="review-label">University:</span><span class="review-value">${formData.get('university')}</span></div>`;
    html += `<div class="review-item"><span class="review-label">Field:</span><span class="review-value">${formData.get('academicField')}</span></div>`;
    html += '</div>';
    
    // Project Requirements
    html += '<div class="review-group"><h3>Project Requirements</h3>';
    html += `<div class="review-item"><span class="review-label">Service Type:</span><span class="review-value">${formData.get('serviceType')}</span></div>`;
    html += `<div class="review-item"><span class="review-label">Title:</span><span class="review-value">${formData.get('projectTitle')}</span></div>`;
    html += `<div class="review-item"><span class="review-label">Word Count:</span><span class="review-value">${formData.get('wordCount')}</span></div>`;
    html += `<div class="review-item"><span class="review-label">Deadline:</span><span class="review-value">${formData.get('deadline')}</span></div>`;
    html += '</div>';
    
    // Files
    if (uploadedFiles.length > 0) {
        html += '<div class="review-group"><h3>Uploaded Files</h3>';
        uploadedFiles.forEach(file => {
            html += `<div class="review-item"><span class="review-label">${file.name}</span><span class="review-value">${formatFileSize(file.size)}</span></div>`;
        });
        html += '</div>';
    }
    
    // Budget
    html += '<div class="review-group"><h3>Budget & Timeline</h3>';
    html += `<div class="review-item"><span class="review-label">Budget:</span><span class="review-value">${formData.get('budget')}</span></div>`;
    html += `<div class="review-item"><span class="review-label">Rush Service:</span><span class="review-value">${formData.get('rushService')}</span></div>`;
    html += '</div>';
    
    reviewContent.innerHTML = html;
}

// Form submission
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Check all agreements
    const agreements = ['agreePrivacy', 'agreeTerms', 'agreeAcademic', 'agreeData'];
    for (let agreement of agreements) {
        if (!document.querySelector(`input[name="${agreement}"]`).checked) {
            alert('Please accept all terms and conditions');
            return;
        }
    }
    
    // Show loading
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Collect form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Add files info
        data.files = uploadedFiles.map(f => ({ name: f.name, size: f.size }));
        
        // Prepare order data for payment page
        const orderData = {
            level: data.academicLevel,
            serviceType: data.serviceType,
            wordCount: parseInt(data.wordCount) || 0,
            deadline: data.deadline,
            field: data.academicField,
            isFirstOrder: true, // You can add a checkbox for this in the form
            name: data.fullName,
            email: data.email,
            phone: data.phone || '',
            projectTitle: data.projectTitle || '',
            budget: data.budget || ''
        };
        
        // Save order data to localStorage for payment page
        localStorage.setItem('ams_order_data', JSON.stringify(orderData));
        
        // Send via EmailJS (optional - can be done after payment)
        // await sendEmail(data);
        
        // Show success message and redirect to payment
        showSuccessModal();
        
    } catch (error) {
        alert('Error submitting form. Please try again or contact us via live chat.');
        console.error(error);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

async function sendEmail(data) {
    // Prepare email content
    const emailContent = {
        to_email: 'info@academicmasterpiece.com',
        from_name: data.fullName,
        from_email: data.email,
        subject: `New Order: ${data.serviceType} - ${data.academicLevel}`,
        message: JSON.stringify(data, null, 2)
    };
    
    // Send email using EmailJS
    // Note: You need to set up EmailJS account and get your keys
    return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailContent);
}

function showSuccessModal() {
    // Instead of showing modal, redirect to payment page with order data
    const modal = document.createElement('div');
    modal.className = 'success-modal show';
    modal.innerHTML = `
        <div class="success-content">
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <h2>Order Submitted Successfully!</h2>
            <p>Redirecting you to secure payment page...</p>
            <div style="margin: 20px 0;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #d4af37;"></i>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Redirect to payment page after 2 seconds
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 2000);
}