// ===========================
// AMS Payment System
// Handles PayPal and Wise payments
// ===========================

// Generate unique order reference
function generateOrderReference() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `AMS-${timestamp}-${random}`;
}

// Get order data from localStorage or URL parameters
function getOrderData() {
    // Try to get from localStorage first
    const storedOrder = localStorage.getItem('ams_order_data');
    if (storedOrder) {
        return JSON.parse(storedOrder);
    }
    
    // Try to get from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('level')) {
        return {
            level: urlParams.get('level'),
            wordCount: parseInt(urlParams.get('wordCount')) || 0,
            deadline: urlParams.get('deadline') || '5days',
            field: urlParams.get('field') || 'standard',
            serviceType: urlParams.get('serviceType'),
            isFirstOrder: urlParams.get('isFirstOrder') === 'true',
            name: urlParams.get('name') || '',
            email: urlParams.get('email') || '',
            phone: urlParams.get('phone') || ''
        };
    }
    
    return null;
}

// Display order summary
function displayOrderSummary(orderData) {
    if (!orderData) {
        return;
    }
    
    // Calculate price
    const priceDetails = calculatePrice(
        orderData.level,
        orderData.wordCount,
        orderData.deadline,
        getFieldCategory(orderData.field),
        orderData.serviceType,
        orderData.isFirstOrder
    );
    
    // Generate order reference
    const orderRef = generateOrderReference();
    localStorage.setItem('ams_order_reference', orderRef);
    
    // Build summary HTML
    const summaryHTML = `
        <div class="summary-details">
            <div class="summary-row">
                <span class="label">Academic Level:</span>
                <span class="value">${getLevelName(orderData.level)}</span>
            </div>
            <div class="summary-row">
                <span class="label">Word Count:</span>
                <span class="value">${orderData.wordCount.toLocaleString()} words</span>
            </div>
            <div class="summary-row">
                <span class="label">Deadline:</span>
                <span class="value">${getDeadlineName(orderData.deadline)}</span>
            </div>
            <div class="summary-row">
                <span class="label">Academic Field:</span>
                <span class="value">${getFieldName(orderData.field)}</span>
            </div>
            ${orderData.name ? `
            <div class="summary-row">
                <span class="label">Your Name:</span>
                <span class="value">${orderData.name}</span>
            </div>
            ` : ''}
            ${orderData.email ? `
            <div class="summary-row">
                <span class="label">Email:</span>
                <span class="value">${orderData.email}</span>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('orderSummary').innerHTML = summaryHTML;
    
    // Display price breakdown
    document.getElementById('priceBreakdown').style.display = 'block';
    document.getElementById('basePrice').textContent = formatPrice(priceDetails.fieldCost);
    document.getElementById('fieldMultiplier').textContent = `${priceDetails.fieldMultiplier.toFixed(2)}x`;
    document.getElementById('urgentFee').textContent = formatPrice(priceDetails.rushTotal);
    document.getElementById('totalAmount').textContent = formatPrice(priceDetails.finalTotal);
    
    if (orderData.isFirstOrder && priceDetails.discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discountAmount').textContent = '-' + formatPrice(priceDetails.discount);
    }
    
    // Display payment plans
    document.getElementById('paymentPlans').style.display = 'block';
    document.getElementById('fullAmount').textContent = formatPrice(priceDetails.finalTotal);
    
    // Calculate deposit amount based on level
    let depositPercentage = 50; // Default for UG/PG
    let depositDescription = '50% now, 50% before delivery';
    
    if (orderData.level === 'phd') {
        depositPercentage = 33;
        depositDescription = '33% now, 34% at 1/3 completion, 33% before delivery';
    }
    
    const depositAmount = (priceDetails.finalTotal * depositPercentage) / 100;
    document.getElementById('depositAmount').textContent = formatPrice(depositAmount);
    document.getElementById('depositDesc').textContent = depositDescription;
    
    // Display order reference
    document.getElementById('orderReference').style.display = 'block';
    document.getElementById('referenceNumber').textContent = orderRef;
    
    // Update Wise payment details
    updateWisePaymentDetails(priceDetails.finalTotal, depositAmount, orderRef);
    
    // Update PayPal reference
    document.getElementById('paypalReference').textContent = orderRef;
    
    // Store amounts for payment plan selection
    window.paymentAmounts = {
        full: priceDetails.finalTotal,
        deposit: depositAmount,
        reference: orderRef
    };
    
    // Add payment plan change listener
    document.querySelectorAll('input[name="payment-plan"]').forEach(radio => {
        radio.addEventListener('change', updatePaymentAmounts);
    });
    
    // Initial update
    updatePaymentAmounts();
}

// Update payment amounts when plan changes
function updatePaymentAmounts() {
    if (!window.paymentAmounts) return;
    
    const selectedPlan = document.querySelector('input[name="payment-plan"]:checked').value;
    const amount = selectedPlan === 'full' ? window.paymentAmounts.full : window.paymentAmounts.deposit;
    
    // Update Wise amount display
    document.getElementById('wiseAmount').value = `£${Math.round(amount).toFixed(2)}`;
    
    // Update PayPal.me link (you'll need to replace YOURUSERNAME with your actual PayPal.me username)
    const paypalLink = `https://paypal.me/YOURUSERNAME/${Math.round(amount)}GBP`;
    document.getElementById('paypalLink').value = paypalLink;
}

// Update Wise payment details
function updateWisePaymentDetails(fullAmount, depositAmount, reference) {
    // Replace with your actual Wise email
    const wiseEmail = 'your-wise-email@example.com';
    
    document.getElementById('wiseEmail').value = wiseEmail;
    document.getElementById('wiseAmount').value = `£${Math.round(fullAmount).toFixed(2)}`;
    document.getElementById('wiseReference').value = reference;
}

// Helper function to get field category
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

// Helper functions
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

function getFieldName(field) {
    const fieldNames = {
        'computer-science': 'Computer Science & IT',
        'engineering': 'Engineering',
        'mathematics': 'Mathematics & Statistics',
        'physics': 'Physics & Astronomy',
        'chemistry': 'Chemistry',
        'biology': 'Biology & Life Sciences',
        'business': 'Business Management',
        'economics': 'Economics',
        'finance': 'Finance & Accounting',
        'psychology': 'Psychology',
        'sociology': 'Sociology',
        'education': 'Education',
        'medicine': 'Medicine',
        'nursing': 'Nursing',
        'public-health': 'Public Health',
        'pharmacy': 'Pharmacy',
        'literature': 'Literature',
        'history': 'History',
        'philosophy': 'Philosophy',
        'law': 'Law',
        'arts': 'Arts & Design'
    };
    return fieldNames[field] || field;
}

// Copy functions
function copyPayPalLink() {
    const linkInput = document.getElementById('paypalLink');
    linkInput.select();
    document.execCommand('copy');
    
    // Show feedback
    const btn = event.target.closest('button');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    btn.style.background = '#28a745';
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
    }, 2000);
}

function copyToClipboard(elementId) {
    const input = document.getElementById(elementId);
    input.select();
    document.execCommand('copy');
    
    // Show feedback
    const btn = event.target.closest('button');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = '#28a745';
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
    }, 2000);
}

// Initialize mobile menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Get and display order data
    const orderData = getOrderData();
    if (orderData) {
        displayOrderSummary(orderData);
    }
    
    // Note: PayPal Smart Payment Buttons integration would go here
    // You would need to add the PayPal SDK script and initialize buttons
    // For now, we're using the manual PayPal.me link approach
});

// PayPal Smart Payment Buttons (Optional Enhancement)
// To use this, you need to:
// 1. Add PayPal SDK script to payment.html: <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=GBP"></script>
// 2. Uncomment and configure the code below

/*
function initializePayPalButtons() {
    if (!window.paypal || !window.paymentAmounts) return;
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            const selectedPlan = document.querySelector('input[name="payment-plan"]:checked').value;
            const amount = selectedPlan === 'full' ? window.paymentAmounts.full : window.paymentAmounts.deposit;
            
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: Math.round(amount).toFixed(2),
                        currency_code: 'GBP'
                    },
                    description: `AMS Order ${window.paymentAmounts.reference}`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Payment successful
                alert('Payment completed successfully!');
                // Redirect to thank you page
                window.location.href = `thank-you.html?transaction=${details.id}&reference=${window.paymentAmounts.reference}`;
            });
        },
        onError: function(err) {
            console.error('PayPal Error:', err);
            alert('Payment failed. Please try again or contact support.');
        }
    }).render('#paypal-button-container');
}

// Call this after order data is loaded
// initializePayPalButtons();
*/

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateOrderReference,
        getOrderData,
        displayOrderSummary
    };
}
