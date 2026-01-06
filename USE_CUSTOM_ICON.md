# Using Your Custom Image as Favicon & App Icon

## Step 1: Add Your Custom Image

1. **Place your image file** in the `public/` folder
   - Supported formats: PNG, JPG, JPEG, SVG, WEBP
   - Recommended: PNG or SVG (high quality, square format)
   - Recommended size: At least 512x512 pixels (larger is better)

2. **Name it** `icon-source.png` (or `.jpg`, `.svg`, etc.)
   - You can use any name, but we'll reference it in the script

## Step 2: Update the Script

The script will automatically detect your image. Just make sure it's in the `public/` folder.

## Step 3: Generate All Icon Sizes

Run the icon generator:

```bash
npm install --save-dev sharp
npm run generate-icons
```

This will:
- Read your custom image from `public/icon-source.png` (or the file you specify)
- Generate all required sizes:
  - `favicon.svg` (if your source is SVG, or converted from PNG)
  - `apple-touch-icon.png` (180x180)
  - `android-chrome-192x192.png` (192x192)
  - `android-chrome-512x512.png` (512x512)
  - `favicon-32x32.png` (32x32)
  - `favicon-16x16.png` (16x16)
  - `favicon.ico` (for older browsers)

## Alternative: Quick Setup

If you want to use your image directly without generation:

1. **For SVG**: 
   - Rename your file to `favicon.svg` and place in `public/`
   - The HTML is already configured to use it

2. **For PNG**:
   - Create these sizes manually or use an online tool:
     - `apple-touch-icon.png` (180x180)
     - `android-chrome-192x192.png` (192x192)
     - `android-chrome-512x512.png` (512x512)
   - Place all in `public/` folder

## Recommended Image Specs

- **Format**: PNG or SVG
- **Size**: Square (1:1 aspect ratio)
- **Dimensions**: At least 512x512px (1024x1024px is ideal)
- **Background**: Transparent or solid color
- **Content**: Simple, recognizable design (works well at small sizes)

## Testing

After adding your icons:

1. Build: `npm run build`
2. Preview: `npm run preview`
3. Check browser tab for favicon
4. Test on mobile: Add to home screen

---

**Quick Start:**
1. Add your image to `public/icon-source.png`
2. Run `npm install --save-dev sharp && npm run generate-icons`
3. Done! ✅

