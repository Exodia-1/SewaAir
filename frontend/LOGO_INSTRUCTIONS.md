# How to Add Your Custom Logo to SewaAir

Your SewaAir consent form application is now ready for your custom logo! Follow these simple steps to add it.

---

## 📋 **Quick Steps**

### **Option 1: Using the File Name `logo.png` (Easiest)**

1. **Prepare Your Logo:**
   - Recommended size: **200x200 pixels or larger**
   - Recommended format: **PNG with transparent background**
   - Name your file: **`logo.png`**

2. **Upload Your Logo:**
   - Place your `logo.png` file in the `/app/frontend/public/` folder
   - The logo will automatically appear in both the Consent Form and Admin Dashboard

3. **That's It!**
   - Refresh your browser
   - Your logo should now be visible in the white box with gold border

---

### **Option 2: Using a Different File Name**

If your logo has a different name (e.g., `company-logo.png`, `sewaair-logo.svg`):

1. **Upload Your Logo:**
   - Place your logo file in `/app/frontend/public/`

2. **Update the Code:**
   - Open `/app/frontend/src/pages/ConsentForm.jsx`
   - Find line 152 (inside the logo placeholder section)
   - Change `src="/logo.png"` to `src="/your-logo-name.png"` or `src="/your-logo-name.svg"`

3. **Update Admin Dashboard:**
   - Open `/app/frontend/src/pages/AdminDashboard.jsx`
   - Find the similar logo section (around line 110)
   - Change `src="/logo.png"` to `src="/your-logo-name.png"` or `src="/your-logo-name.svg"`

4. **Save and Refresh**

---

## 🎨 **Logo Design Tips**

- **Size:** 200x200px to 512x512px works best
- **Format:** PNG or SVG recommended
- **Background:** Transparent background looks most professional
- **Colors:** Your logo will be displayed in a white container with a gold border, so design accordingly
- **Shape:** Square or circular logos work best in the current layout

---

## 🔧 **Current Fallback**

Until you add your logo, the placeholder shows **"SA"** (SewaAir initials) in burgundy red color.

---

## 📍 **Logo Location**

Your logo appears in **two places**:
1. **Consent Form Header** (top-left corner)
2. **Admin Dashboard Header** (top-left corner)

Both locations use the same logo file, so you only need to upload it once!

---

## 🚨 **Troubleshooting**

**Logo not showing?**
- Check file name matches exactly (case-sensitive)
- Verify file is in `/app/frontend/public/` folder
- Clear browser cache and refresh
- Check browser console for errors (F12 → Console tab)

**Logo looks stretched or pixelated?**
- Use a higher resolution image (at least 200x200px)
- Consider using SVG format for perfect scaling

---

## 🎨 **Current Color Scheme**

Your application uses **Air India's signature colors**:
- **Primary:** Burgundy Red (#8B0000, #A52A2A)
- **Accent:** Gold (#D4AF37, #FFD700)
- **Background:** Cream/Off-white (#FAF9F6, #FFF8DC)

Make sure your logo complements these colors!

---

## ✅ **Example**

```
Before: 
/app/frontend/public/
  ├── index.html
  └── ...

After:
/app/frontend/public/
  ├── index.html
  ├── logo.png  ← Your logo here!
  └── ...
```

---

**Need Help?** Contact your development team or refer to the code comments in the files mentioned above.
