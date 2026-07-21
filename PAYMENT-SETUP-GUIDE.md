# 💳 AMS Payment System Setup Guide

## Overview
This guide will help you configure PayPal and Wise payments for your AMS website.

---

## 🎯 What's Included

Your payment system includes:
- ✅ Professional payment page (`payment.html`)
- ✅ Order summary with dynamic pricing
- ✅ PayPal payment integration
- ✅ Wise bank transfer instructions
- ✅ Automatic order reference generation
- ✅ Payment plan selection (Full / Deposit)
- ✅ Thank you confirmation page
- ✅ Mobile responsive design

---

## 📝 Step-by-Step Setup

### **STEP 1: Configure Your Payment Details**

#### A. PayPal Configuration

1. **Get Your PayPal.me Link:**
   - Login to your PayPal account
   - Go to https://paypal.me
   - Create or find your PayPal.me username
   - Your link will be: `https://paypal.me/YOURUSERNAME`

2. **Update in payment.html:**
   
   Open `payment.html` and find line ~185:
   ```html
   <input type="text" id="paypalLink" readonly value="https://paypal.me/YOURUSERNAME" class="payment-link-input">
   ```
   
   **Replace `YOURUSERNAME` with your actual PayPal.me username**
   
   Example:
   ```html
   <input type="text" id="paypalLink" readonly value="https://paypal.me/AMSacademic" class="payment-link-input">
   ```

3. **Update in payment.js:**
   
   Open `js/payment.js` and find line ~92:
   ```javascript
   const paypalLink = `https://paypal.me/YOURUSERNAME/${Math.round(amount)}GBP`;
   ```
   
   **Replace `YOURUSERNAME` with your PayPal.me username**

---

#### B. Wise Configuration

1. **Get Your Wise Email:**
   - Login to your Wise account
   - Go to Settings → Your Email
   - Copy your Wise registered email

2. **Update in payment.html:**
   
   Find line ~250 (in the Wise section):
   ```html
   <input type="text" readonly value="your-wise-email@example.com" id="wiseEmail">
   ```
   
   **Replace `your-wise-email@example.com` with your actual Wise email**

3. **Update in payment.js:**
   
   Find line ~96:
   ```javascript
   const wiseEmail = 'your-wise-email@example.com';
   ```
   
   **Replace with your actual Wise email**

4. **Update Wise Link (line ~295 in payment.html):**
   ```html
   <small>Login to Wise and send to: <strong>your-wise-email@example.com</strong></small>
   ```
   
   **Replace with your Wise email**

---

### **STEP 2: Test Your Setup**

1. **Create Test Order:**
   - Go to `order.html` or `diagnostic.html`
   - Fill out the form with test data
   - Click "Proceed to Payment" or "Place Order"

2. **Check Payment Page:**
   - Verify order summary displays correctly
   - Check pricing calculations
   - Confirm PayPal.me link works
   - Verify Wise details are correct

3. **Test Payment Plans:**
   - Select "Pay Full Amount" → Check amount updates
   - Select "Pay Deposit" → Check deposit amount (50% or 33%)

---

### **STEP 3: Link Order Form to Payment Page**

Update your order form to redirect to payment page after submission.

In `js/order.js` (or diagnostic.js), after form validation, add:

```javascript
// Store order data
const orderData = {
    level: selectedLevel,
    wordCount: wordCount,
    deadline: selectedDeadline,
    field: selectedField,
    serviceType: serviceType,
    isFirstOrder: isFirstOrder,
    name: customerName,
    email: customerEmail,
    phone: customerPhone
};

// Save to localStorage
localStorage.setItem('ams_order_data', JSON.stringify(orderData));

// Redirect to payment page
window.location.href = 'payment.html';
```

---

## 🚀 Advanced Setup (Optional)

### **Option 1: PayPal Smart Payment Buttons**

For fully integrated PayPal checkout (automatic payment processing):

1. **Get PayPal Client ID:**
   - Go to https://developer.paypal.com
   - Create a REST API app
   - Copy your Client ID

2. **Add PayPal SDK to payment.html** (in `<head>` section):
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=GBP"></script>
   ```

3. **Uncomment PayPal Button Code** in `js/payment.js` (lines ~133-165)

4. **Benefits:**
   - ✅ Customers pay directly on your site
   - ✅ Automatic payment confirmation
   - ✅ Auto-redirect to thank you page
   - ✅ Better user experience

---

### **Option 2: Wise API Integration**

For automatic Wise payment verification:

1. Get Wise API Key from Wise Business account
2. Requires backend server (cannot be done with static site)
3. Consider hiring developer if you need this feature

---

## 📧 Email Notifications Setup

To receive email notifications when customers complete orders:

1. **Use EmailJS** (already in your order form)
2. **Or setup webhook** with PayPal/Wise business accounts

---

## 💡 Customer Payment Journey

### **Full Flow:**

```
1. Customer fills order/diagnostic form
   ↓
2. System calculates price (with 30% discount if first order)
   ↓
3. Redirected to payment.html
   ↓
4. Customer sees:
   - Order summary
   - Price breakdown
   - Payment plan options (Full / Deposit)
   - Payment methods (PayPal / Wise)
   ↓
5. Customer chooses payment method:
   
   OPTION A: PayPal
   - Clicks PayPal.me link
   - Opens PayPal in new tab
   - Completes payment
   - Includes order reference in notes
   
   OPTION B: Wise
   - Copies payment details
   - Opens Wise app/website
   - Sends payment with reference
   ↓
6. Customer contacts you via WhatsApp/Email with:
   - Order reference: AMS-1234567890-123
   - Payment confirmation
   ↓
7. You confirm payment received
   ↓
8. Assign tutor and start work
```

---

## 🔒 Security Best Practices

1. **SSL Certificate:** Always use HTTPS for your website
2. **Never Store Payment Info:** PayPal and Wise handle all sensitive data
3. **Order References:** Use unique references for tracking
4. **Backup Data:** Regularly export order records

---

## 📋 Required Updates Checklist

Before going live, update these in `payment.html`:

- [ ] PayPal.me username (line ~185)
- [ ] Wise email address (line ~250)
- [ ] Wise email in description (line ~295)
- [ ] Contact email if different (footer)
- [ ] WhatsApp number if different

And in `js/payment.js`:

- [ ] PayPal.me username (line ~92)
- [ ] Wise email (line ~96)

---

## 🎨 Customization Options

### Change Payment Page Colors:

Edit `css/payment.css`:
- Primary color: `#1a2b4a`
- Accent color: `#d4af37`
- Success color: `#28a745`

### Add More Payment Methods:

1. Copy existing payment method HTML block
2. Update logo, colors, instructions
3. Add integration code

### Modify Payment Plans:

In `js/payment.js`, adjust deposit percentages:
```javascript
let depositPercentage = 50; // Change to 40, 60, etc.
```

---

## 📞 Support & Troubleshooting

### Common Issues:

**Issue: Order summary not showing**
- Check localStorage is storing order data
- Verify form redirects to payment.html
- Check browser console for errors

**Issue: PayPal link not working**
- Confirm PayPal.me username is correct
- Check if PayPal.me is activated in your account
- Try link in incognito mode

**Issue: Wrong amounts calculating**
- Check `js/config.js` pricing structure
- Verify field multipliers
- Test with different word counts

**Issue: Mobile display problems**
- Clear browser cache
- Check CSS media queries
- Test on actual device, not just browser

---

## 🌟 Tips for Success

1. **Test Everything:** Do multiple test orders before launch
2. **Clear Instructions:** Make sure payment steps are obvious
3. **Quick Response:** Reply to payment confirmations within 2 hours
4. **Track Orders:** Use a spreadsheet to log all orders
5. **Professional Communication:** Send confirmation emails promptly

---

## 📊 Tracking Payments

### Manual Tracking Spreadsheet:

Create Google Sheet with columns:
- Date
- Order Reference
- Customer Name
- Email
- Amount
- Payment Method
- Status (Paid/Pending/Refunded)
- Project Status
- Tutor Assigned

---

## 🔄 Future Enhancements

Consider adding:
- [ ] Stripe payment integration
- [ ] Automatic email confirmations
- [ ] Order tracking dashboard
- [ ] Recurring payments for ongoing services
- [ ] Invoice generation
- [ ] Payment analytics

---

## ✅ Final Checklist Before Launch

- [ ] All payment details updated
- [ ] Test order completed successfully
- [ ] PayPal.me link tested and working
- [ ] Wise details correct and copied
- [ ] Mobile responsive checked
- [ ] Thank you page displays correctly
- [ ] WhatsApp links work with order reference
- [ ] Email addresses correct
- [ ] SSL certificate installed (HTTPS)
- [ ] Backup of all files created

---

## 📧 Need Help?

If you need assistance:
1. Check browser console for error messages
2. Test in different browsers (Chrome, Firefox, Safari)
3. Try incognito/private mode
4. Clear cache and cookies
5. Verify all file paths are correct

---

**Your payment system is now ready! 🎉**

Remember to update your PayPal.me username and Wise email address before going live.

---

**Last Updated:** 2025-12-16
**Version:** 1.0.0
