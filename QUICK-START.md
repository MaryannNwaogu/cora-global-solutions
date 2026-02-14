# Cora Global Solutions - Quick Start Guide

## 🚀 Get Your Website Live in 5 Minutes

### Step 1: Download or Clone
- Download the entire project folder
- Or clone if using Git

### Step 2: Open in Browser
```bash
# Navigate to the folder
cd "Cora Global Solutions LTD"

# Option A: Double-click index.html
# Option B: Use live server (recommended)

# Using Python 3:
python -m http.server 8000

# Using Node.js:
npx http-server

# Then visit: http://localhost:8000
```

### Step 3: Customize Content
1. **Edit company info** → Footer, Navigation, Contact details
2. **Update services** → Edit service cards in index.html
3. **Add testimonials** → Add your client testimonials
4. **Create blog posts** → Follow blog template structure

### Step 4: Deploy (Choose One)

#### Option A: Deploy to Netlify (Free)
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Option B: Deploy to GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/cora-website
git push -u origin main
```

#### Option C: Traditional Hosting
Upload all files to your web server via FTP/SFTP

## 📝 Essential Customizations

### 1. Update Navigation
**File:** index.html, booking.html, blog.html
```html
<a href="https://yourwebsite.com">Your New Logo/Title</a>
```

### 2. Change Colors
**File:** css/style.css
```css
:root {
  --primary: #1a3a52;      /* Main color */
  --secondary: #00a8e8;    /* Accent color */
  --accent: #ffd700;       /* Highlight color */
}
```

### 3. Update Contact Information
**File:** Footer section in all pages
```html
<li>📧 <a href="mailto:your-email@company.com">your-email@company.com</a></li>
<li>📱 +1 (your-phone)</li>
```

### 4. Configure Chat Responses
**File:** js/chatbot.js (Line 200)
Update the `generateResponse()` function with your services

### 5. Setup Form Submissions
**File:** js/forms.js (Line 100)
```javascript
fetch('/api/submit-form', {  // Change to your API endpoint
  method: 'POST',
  body: JSON.stringify(data)
})
```

## 🔗 Add Important Links

### Connect Your Domains
1. Update `og:url` in meta tags to your domain
2. Update `xmlns` in sitemap.xml
3. Update Sitemap URL in robots.txt

### Link Blog Posts
Ensure all blog links work:
- `blog.html` links to individual posts
- Individual posts link back to `blog.html`

## 📊 Analytics Setup

### Add Google Analytics
1. Get your Tracking ID from Google Analytics
2. Add to `<head>` of all pages:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎯 Create Blog Posts

### Using the Template
1. Copy `blog/cheap-flights.html` as template
2. Update:
   - Title and heading
   - Meta description and keywords
   - Article content
   - Date published
   - Author info
3. Save as `blog/new-post-name.html`
4. Add link to `blog.html`
5. Update `sitemap.xml`

## 🔐 Security Checklist

- [ ] Change default email addresses
- [ ] Update phone numbers
- [ ] Add HTTPS certificate
- [ ] Set up email notifications for forms
- [ ] Add CAPTCHA to forms (optional)
- [ ] Review privacy policy
- [ ] Add terms of service

## ✅ Pre-Launch Checklist

- [ ] All links working
- [ ] Forms tested
- [ ] Chat assistant responding
- [ ] Mobile responsive check
- [ ] Page load speed optimized
- [ ] SEO tags updated
- [ ] Analytics installed
- [ ] Sitemap submitted to Google
- [ ] Robots.txt configured
- [ ] SSL certificate active

## 🚨 Troubleshooting

### Chat Not Appearing
- Check browser console for errors
- Ensure `js/chatbot.js` is loaded
- Check for JavaScript errors

### Forms Not Submitting
- Open browser DevTools (F12)
- Check Console tab for errors
- Verify form field names match

### Styling Looks Off
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file paths are correct
- Ensure all CSS files are linked

### Page Won't Load
- Check file paths in links
- Ensure all linked files exist
- Check browser console for 404 errors

## 📞 Support & Help

- **Documentation:** See README.md
- **Code Issues:** Check browser console (F12)
- **Form Problems:** Enable debug mode in LocalStorage
- **Chat Help:** Check js/chatbot.js comments

## 🎓 Learn More

### Resources
- [MDN Documentation](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)
- [SEO Guide](https://moz.com/beginners-guide-to-seo)

### Next Steps
1. Customize content
2. Add your images
3. Deploy to web
4. Submit to search engines
5. Monitor analytics
6. Iterate and improve

---

**Questions?** Review the README.md file or check the code comments for more details.

Good luck with your Cora Global Solutions website! 🚀
