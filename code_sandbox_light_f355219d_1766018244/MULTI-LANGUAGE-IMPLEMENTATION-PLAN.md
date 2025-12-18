# 🌍 Multi-Language Website Implementation Plan

## 📊 Current Status

### ✅ **Completed (English Version)**
- ✅ index.html - Homepage with new AMS branding
- ✅ diagnostic.html - Smart diagnostic system
- ✅ order.html - Order form
- ✅ payment.html - Payment page
- ✅ thank-you.html - Confirmation page
- ✅ All CSS files (style.css, diagnostic.css, payment.css)
- ✅ All JavaScript files (config.js, main.js, diagnostic.js, order.js, payment.js)
- ✅ Payment system (PayPal & Wise)
- ✅ 30% first-order discount system
- ✅ Auto-redirect from forms to payment

### ⏳ **Pending (4 Language Versions)**
- ⏳ Chinese (Traditional) - index-zh.html exists but needs complete update
- ⏳ Japanese - Needs full creation
- ⏳ Korean - Needs full creation
- ⏳ Hindi - Needs full creation

---

## 🎯 Implementation Strategy

### **Phase 1: Update Existing Files** ⭐ PRIORITY
1. Update `index-zh.html` with new AMS branding
2. Update `css/style-zh.css` with new styles
3. Update `js/main-zh.js` with new functionality

### **Phase 2: Create Core Pages for Each Language**
For each language (ja, ko, hi):
1. Homepage (index-{lang}.html)
2. Diagnostic page (diagnostic-{lang}.html)
3. Order page (order-{lang}.html)
4. Payment page (payment-{lang}.html)
5. Thank you page (thank-you-{lang}.html)

### **Phase 3: Language-Specific Assets**
1. CSS files with proper fonts for each language
2. JavaScript files with translated strings
3. Update language switcher on all pages

### **Phase 4: Testing & Integration**
1. Test all language versions
2. Verify payment flow in each language
3. Check mobile responsiveness
4. Final QA

---

## 📝 Detailed File Requirements

### **Chinese (Traditional) Version**

#### Files to Update/Create:
```
✅ translations.json - Complete
⏳ index-zh.html - Update with AMS branding
⏳ diagnostic-zh.html - New file
⏳ order-zh.html - New file
⏳ payment-zh.html - New file
⏳ thank-you-zh.html - New file
⏳ css/style-zh.css - Update
⏳ js/main-zh.js - Update
⏳ js/diagnostic-zh.js - New file
⏳ js/order-zh.js - New file
⏳ js/payment-zh.js - New file
```

#### Key Translations:
- Brand: Academic Masterpiece Studio → 學術傑作工作室
- Slogan: Turning Academic Stress into Success Stories Since 2009 → 自2009年起，將學術壓力轉化為成功故事
- Undergraduate → 本科
- Postgraduate → 研究生
- PhD → 博士
- From £80/1000 words → 起價 £80/千字

#### Font Requirements:
```css
font-family: 'Noto Sans TC', 'Noto Serif TC', sans-serif;
```

---

### **Japanese Version**

#### Files to Create:
```
⏳ index-ja.html
⏳ diagnostic-ja.html
⏳ order-ja.html
⏳ payment-ja.html
⏳ thank-you-ja.html
⏳ css/style-ja.css
⏳ js/main-ja.js
⏳ js/diagnostic-ja.js
⏳ js/order-ja.js
⏳ js/payment-ja.js
```

#### Key Translations:
- Brand: Academic Masterpiece Studio → アカデミック・マスターピース・スタジオ
- Slogan: → 2009年より、学術的ストレスを成功物語に変えています
- Undergraduate → 学部
- Postgraduate → 大学院
- PhD → 博士
- From £80/1000 words → £80/1000ワードから

#### Font Requirements:
```css
font-family: 'Noto Sans JP', 'Noto Serif JP', sans-serif;
```

---

### **Korean Version**

#### Files to Create:
```
⏳ index-ko.html
⏳ diagnostic-ko.html
⏳ order-ko.html
⏳ payment-ko.html
⏳ thank-you-ko.html
⏳ css/style-ko.css
⏳ js/main-ko.js
⏳ js/diagnostic-ko.js
⏳ js/order-ko.js
⏳ js/payment-ko.js
```

#### Key Translations:
- Brand: Academic Masterpiece Studio → 학술 걸작 스튜디오
- Slogan: → 2009년부터 학업 스트레스를 성공 스토리로 전환합니다
- Undergraduate → 학부
- Postgraduate → 대학원
- PhD → 박사
- From £80/1000 words → £80/1000단어부터

#### Font Requirements:
```css
font-family: 'Noto Sans KR', 'Noto Serif KR', sans-serif;
```

---

### **Hindi Version**

#### Files to Create:
```
⏳ index-hi.html
⏳ diagnostic-hi.html
⏳ order-hi.html
⏳ payment-hi.html
⏳ thank-you-hi.html
⏳ css/style-hi.css
⏳ js/main-hi.js
⏳ js/diagnostic-hi.js
⏳ js/order-hi.js
⏳ js/payment-hi.js
```

#### Key Translations:
- Brand: Academic Masterpiece Studio → अकादमिक मास्टरपीस स्टूडियो
- Slogan: → 2009 से, अकादमिक तनाव को सफलता की कहानियों में बदल रहे हैं
- Undergraduate → स्नातक
- Postgraduate → स्नातकोत्तर
- PhD → पीएचडी
- From £80/1000 words → £80/1000 शब्द से

#### Font Requirements:
```css
font-family: 'Noto Sans Devanagari', 'Noto Serif Devanagari', sans-serif;
```

---

## 🔤 Font Integration

### **Google Fonts CDN Links by Language:**

#### Chinese:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&family=Noto+Serif+TC:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### Japanese:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### Korean:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Noto+Serif+KR:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### Hindi:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700&family=Noto+Serif+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 🌐 Language Switcher Component

### **HTML Structure (Add to all pages):**
```html
<!-- Language Selector -->
<div class="language-selector">
    <button class="lang-btn active" data-lang="en">EN</button>
    <button class="lang-btn" data-lang="zh" onclick="switchLanguage('zh')">中文</button>
    <button class="lang-btn" data-lang="ja" onclick="switchLanguage('ja')">日本語</button>
    <button class="lang-btn" data-lang="ko" onclick="switchLanguage('ko')">한국어</button>
    <button class="lang-btn" data-lang="hi" onclick="switchLanguage('hi')">हिन्दी</button>
</div>
```

### **JavaScript Function:**
```javascript
function switchLanguage(lang) {
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    const pageName = currentPage.replace(/-[a-z]{2}$/, ''); // Remove language suffix
    
    let targetPage;
    if (lang === 'en') {
        targetPage = `${pageName}.html`;
    } else {
        targetPage = `${pageName}-${lang}.html`;
    }
    
    window.location.href = targetPage;
}
```

---

## 💰 Pricing Display by Language

### **English:**
```
From £80/1000 words
```

### **Chinese:**
```
起價 £80/千字
```

### **Japanese:**
```
£80/1000ワードから
```

### **Korean:**
```
£80/1000단어부터
```

### **Hindi:**
```
£80/1000 शब्द से
```

---

## 📋 Content Translation Matrix

### **Homepage Sections:**

| Section | English | Chinese | Japanese | Korean | Hindi |
|---------|---------|---------|----------|--------|-------|
| Hero Title | Your Academic Excellence Partner | 您的學術卓越夥伴 | あなたの学術的卓越性のパートナー | 귀하의 학문적 우수성 파트너 | आपके शैक्षणिक उत्कृष्टता भागीदार |
| Discount Banner | New Member Special Offer | 新會員專屬優惠 | 新規会員特別オファー | 신규 회원 특별 혜택 | नए सदस्य विशेष ऑफर |
| Discount Text | Get 30% OFF | 30% 折扣 | 30%オフ | 30% 할인 | 30% छूट |
| Smart Diagnostic | Smart Diagnostic (Recommended) | 智能診斷（推薦） | スマート診断（推奨） | 스마트 진단 (추천) | स्मार्ट निदान (अनुशंसित) |

### **Service Levels:**

| Level | English | Chinese | Japanese | Korean | Hindi |
|-------|---------|---------|----------|--------|-------|
| Undergraduate | Undergraduate | 本科 | 学部 | 학부 | स्नातक |
| Postgraduate | Postgraduate | 研究生 | 大学院 | 대학원 | स्नातकोत्तर |
| PhD | PhD/Doctorate | 博士 | 博士 | 박사 | पीएचडी |
| Scientific | Scientific Publication | 科學出版 | 科学出版 | 과학 출판 | वैज्ञानिक प्रकाशन |

---

## 🚀 Quick Implementation Steps

### **For Immediate Launch (Minimum Viable):**

1. **English Version** (Already Complete ✅)
   - Use as-is for international audience

2. **Chinese Version** (Priority - Update Existing)
   - Update index-zh.html with AMS branding
   - Add diagnostic-zh.html
   - Add payment-zh.html
   - Test complete flow

3. **Defer Other Languages** (Optional)
   - Japanese, Korean, Hindi can be added later
   - English + Chinese covers majority of target audience

### **For Complete Multi-Language Launch:**

**Week 1: Chinese**
- Day 1-2: Update homepage
- Day 3: Create diagnostic page
- Day 4: Create order page
- Day 5: Create payment pages
- Day 6-7: Testing

**Week 2: Japanese**
- Repeat process for Japanese

**Week 3: Korean**
- Repeat process for Korean

**Week 4: Hindi**
- Repeat process for Hindi

---

## 🎨 Typography Considerations

### **Line Height Adjustments:**
```css
/* English */
body { line-height: 1.6; }

/* Chinese */
body { line-height: 1.8; }

/* Japanese */
body { line-height: 1.7; }

/* Korean */
body { line-height: 1.7; }

/* Hindi */
body { line-height: 1.9; }
```

### **Font Size Adjustments:**
```css
/* Asian Languages (Chinese, Japanese, Korean) */
body { font-size: 16px; }
h1 { font-size: 2.5rem; }

/* Hindi (Devanagari Script) */
body { font-size: 17px; }
h1 { font-size: 2.3rem; }
```

---

## 🔧 Technical Implementation Notes

### **HTML Lang Attribute:**
```html
<!-- English -->
<html lang="en">

<!-- Chinese (Traditional) -->
<html lang="zh-TW">

<!-- Japanese -->
<html lang="ja">

<!-- Korean -->
<html lang="ko">

<!-- Hindi -->
<html lang="hi">
```

### **Meta Tags for Each Language:**
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="[Translated description]">
<meta name="keywords" content="[Translated keywords]">
```

---

## 📊 File Structure (Complete)

```
ams-website/
├── index.html (EN) ✅
├── index-zh.html (CN) ⏳
├── index-ja.html (JP) ⏳
├── index-ko.html (KO) ⏳
├── index-hi.html (HI) ⏳
│
├── diagnostic.html (EN) ✅
├── diagnostic-zh.html (CN) ⏳
├── diagnostic-ja.html (JP) ⏳
├── diagnostic-ko.html (KO) ⏳
├── diagnostic-hi.html (HI) ⏳
│
├── order.html (EN) ✅
├── order-zh.html (CN) ⏳
├── order-ja.html (JP) ⏳
├── order-ko.html (KO) ⏳
├── order-hi.html (HI) ⏳
│
├── payment.html (EN) ✅
├── payment-zh.html (CN) ⏳
├── payment-ja.html (JP) ⏳
├── payment-ko.html (KO) ⏳
├── payment-hi.html (HI) ⏳
│
├── thank-you.html (EN) ✅
├── thank-you-zh.html (CN) ⏳
├── thank-you-ja.html (JP) ⏳
├── thank-you-ko.html (KO) ⏳
├── thank-you-hi.html (HI) ⏳
│
├── css/
│   ├── style.css ✅
│   ├── style-zh.css ⏳
│   ├── style-ja.css ⏳
│   ├── style-ko.css ⏳
│   ├── style-hi.css ⏳
│   ├── diagnostic.css ✅
│   ├── payment.css ✅
│   └── order.css ✅
│
├── js/
│   ├── config.js ✅
│   ├── main.js ✅
│   ├── main-zh.js ⏳
│   ├── main-ja.js ⏳
│   ├── main-ko.js ⏳
│   ├── main-hi.js ⏳
│   ├── diagnostic.js ✅
│   ├── order.js ✅
│   ├── payment.js ✅
│
├── images/
│   └── ams-logo.png ✅
│
└── translations.json ✅
```

**Total Files:**
- ✅ Completed: 15 files
- ⏳ Pending: 40 files
- **Total: 55 files**

---

## 🎯 Recommended Approach

### **Option A: Phased Launch (Recommended)**

**Phase 1 (Launch Now):**
- English version (Complete ✅)
- Basic Chinese version
- ~80% of target market covered

**Phase 2 (1-2 weeks later):**
- Complete Chinese version
- Add Japanese version
- ~95% of target market covered

**Phase 3 (1 month later):**
- Add Korean version
- Add Hindi version
- 100% coverage

### **Option B: Complete Launch**

- Wait until all 5 languages complete
- Launch all at once
- Estimated time: 2-3 weeks full-time work
- ~55 files to create/update

### **Option C: Automated Translation Tool**

Use translation management system:
1. Export English content
2. Professional translation service
3. Import to templates
4. Faster but costs money

---

## 💰 Budget Estimation (if hiring translator)

### **Professional Translation Costs:**
- Chinese: $500-800
- Japanese: $600-900
- Korean: $500-800
- Hindi: $400-700
- **Total: $2,000 - $3,200**

### **DIY with Current AI:**
- Cost: $0 (your time)
- Time: 2-3 weeks
- Quality: Good with review

---

## ✅ Quality Checklist (Per Language)

- [ ] All text translated accurately
- [ ] Cultural appropriateness checked
- [ ] Currency symbols correct (£)
- [ ] Date formats appropriate
- [ ] Phone numbers formatted correctly
- [ ] WhatsApp messages translated
- [ ] Email templates translated
- [ ] Form validation messages translated
- [ ] Error messages translated
- [ ] Success messages translated
- [ ] Button text translated
- [ ] Navigation menu translated
- [ ] Footer content translated
- [ ] Meta descriptions translated
- [ ] Page titles translated

---

## 🚀 Next Steps

**Immediate Action:**
1. Decide on launch strategy (A, B, or C)
2. Prioritize languages (EN + CN recommended minimum)
3. Set timeline
4. Begin implementation

**I can help you:**
1. ✅ Update Chinese version (highest priority)
2. ✅ Create template system for other languages
3. ✅ Generate translations
4. ✅ Test and debug

**What do you want to prioritize?**
- A: Update Chinese version only (fastest)
- B: Chinese + one other language
- C: All 5 languages (longest)

Let me know and I'll proceed with your choice!

---

**Last Updated:** 2025-12-16
**Status:** Planning Complete, Ready for Implementation
