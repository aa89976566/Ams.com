// ===========================
// AMS - Price Configuration
// Easy to modify all pricing
// ===========================

const PRICING_CONFIG = {
    // Base prices per 1000 words (£/1000 words, standard delivery: 5+ days)
    basePrice: {
        undergraduate: 80,          // £80 per 1000 words
        postgraduate: 100,          // £100 per 1000 words
        phd: {
            proposal: 180,          // £180 per 1000 words
            dissertation: 280,      // £280 per 1000 words (full)
            editing: 60             // £60 per 1000 words
        },
        scientific: 380             // £380 per 1000 words (scientific publications)
    },
    
    // Academic field multipliers
    fieldMultipliers: {
        'standard': 1.0,            // General subjects
        'professional': 1.15,       // Business, Law, Education
        'technical': 1.25,          // Engineering, Computer Science, Mathematics
        'medical': 1.30             // Medicine, Healthcare, Clinical Research
    },
    
    // Urgent/rush fees (£ per 1000 words) - added to base price
    rushFees: {
        '5days': 0,                 // Standard: 5+ days (no extra charge)
        '4days': 15,                // +£15 per 1000 words
        '3days': 30,                // +£30 per 1000 words
        '2days': 50,                // +£50 per 1000 words
        '24hours': 80,              // +£80 per 1000 words
        '12hours': 120,             // +£120 per 1000 words
        '6hours': 180,              // +£180 per 1000 words
        '3hours': 250,              // +£250 per 1000 words
        '1hour': 400                // +£400 per 1000 words
    },
    
    // Additional services - custom quote system
    // NOTE: These are removed from standard calculator
    // Writers will identify needs and provide custom quotes
    addons: {
        customQuote: true,          // All additional services require custom quotes
        message: 'Our expert will assess your specific needs and provide a personalized quote for any additional services such as data analysis, visualization, or specialized tools.'
    },
    
    // Member benefits
    memberBenefits: {
        firstOrderDiscount: 0.30,   // 30% off for first-time registered members
        enabled: true
    },
    
    // Currency symbol
    currency: '£',
    
    // Company information
    company: {
        name: 'Academic Masterpiece Studio',
        abbr: 'AMS',
        slogan: 'Turning Academic Stress into Success Stories Since 2009',
        foundedYear: 2009,
        successRate: 97.6,
        studentsHelped: 2500,
        yearsExperience: 15,
        countriesServed: 50
    },
    
    // Contact information
    contact: {
        whatsapp: '+44 7481 747436',
        email: 'info@academicmasterpiece.com',
        tawkId: '69342c34f66a4c198b42833e/1jbpspbrq'
    },
    
    // Payment structure
    payment: {
        undergraduate: {
            deposit: 50,        // 50% deposit
            beforeSubmission: 50  // 50% before submission
        },
        postgraduate: {
            deposit: 50,
            beforeSubmission: 50
        },
        phd: {
            deposit: 33,        // 33% deposit
            atOneThird: 34,     // 34% at 1/3 completion
            beforeSubmission: 33  // 33% before submission
        }
    },
    
    // Timeline
    timeline: {
        undergraduate: {
            min: '1 hour',
            max: '3 months'
        },
        postgraduate: {
            min: '1 hour',
            max: '3 months'
        },
        phd: {
            min: '3 weeks',
            max: '3 months'
        }
    }
};

// Helper function to get base price per 1000 words
function getBasePrice(level, serviceType = null) {
    if (level === 'undergraduate') {
        return PRICING_CONFIG.basePrice.undergraduate;
    } else if (level === 'postgraduate') {
        return PRICING_CONFIG.basePrice.postgraduate;
    } else if (level === 'scientific') {
        return PRICING_CONFIG.basePrice.scientific;
    } else if (level === 'phd') {
        // For PhD, need to specify type
        if (serviceType === 'proposal') {
            return PRICING_CONFIG.basePrice.phd.proposal;
        } else if (serviceType === 'editing') {
            return PRICING_CONFIG.basePrice.phd.editing;
        } else if (serviceType === 'full') {
            return PRICING_CONFIG.basePrice.phd.dissertation;
        } else {
            return PRICING_CONFIG.basePrice.phd.dissertation; // default to full dissertation
        }
    }
    return 0;
}

// Helper function to get field multiplier
function getFieldMultiplier(field) {
    return PRICING_CONFIG.fieldMultipliers[field] || 1.0;
}

// Helper function to get rush fee (flat amount per 1000 words)
function getRushFee(deadline) {
    return PRICING_CONFIG.rushFees[deadline] || 0;
}

// Calculate total price
function calculatePrice(level, wordCount, deadline = '5days', field = 'standard', serviceType = null, isFirstOrder = false) {
    // Get base price per 1000 words
    const basePricePer1000 = getBasePrice(level, serviceType);
    
    // Calculate base cost for total word count
    const baseTotal = (basePricePer1000 * wordCount) / 1000;
    
    // Apply field multiplier
    const fieldMultiplier = getFieldMultiplier(field);
    const withFieldCost = baseTotal * fieldMultiplier;
    
    // Add rush fee
    const rushFee = getRushFee(deadline);
    const rushTotal = (rushFee * wordCount) / 1000;
    const totalWithRush = withFieldCost + rushTotal;
    
    // Apply first-order discount if applicable
    let finalTotal = totalWithRush;
    if (isFirstOrder && PRICING_CONFIG.memberBenefits.enabled) {
        const discount = totalWithRush * PRICING_CONFIG.memberBenefits.firstOrderDiscount;
        finalTotal = totalWithRush - discount;
    }
    
    return {
        basePrice: basePricePer1000,
        baseTotal: baseTotal,
        fieldMultiplier: fieldMultiplier,
        fieldCost: withFieldCost,
        rushFee: rushFee,
        rushTotal: rushTotal,
        subtotal: totalWithRush,
        discount: isFirstOrder ? (totalWithRush * PRICING_CONFIG.memberBenefits.firstOrderDiscount) : 0,
        finalTotal: finalTotal
    };
}

// Helper function to format price
function formatPrice(amount) {
    return `${PRICING_CONFIG.currency}${Math.round(amount)}`;
}

// Additional services pricing (used in price calculator)
const ADDON_PRICES = {
    // Data Analysis
    spss: 350,
    stata: 400,
    r: 450,
    python: 525,
    nvivo: 400,
    atlas: 400,
    excel: 225,
    
    // Charts & Visualization
    charts: 50,  // per chart
    infographic: 150,
    visualization: 300,
    presentation: 225,
    
    // Professional Analysis Tools
    swot: 150,
    pestel: 150,
    porter: 180,
    canvas: 200,
    financial: 600,
    regression: 375,
    factor: 300,
    sem: 650,
    
    // Literature & Citations
    systematic: 750,
    meta: 900,
    bibliography: 100,
    citation: 80,
    
    // Editing & Quality Check
    plagiarism: 50,
    turnitin: 50,
    abstract: 100,
    executive: 150
};

// Helper function to get addon price
function getAddonPrice(addonName) {
    return ADDON_PRICES[addonName] || 0;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PRICING_CONFIG;
}
