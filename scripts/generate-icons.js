/**
 * Generate PNG icons from custom image source
 * 
 * This script requires sharp to be installed:
 * npm install --save-dev sharp
 * 
 * Usage:
 *   node scripts/generate-icons.js [source-image-path]
 * 
 * Default source images (checked in order):
 *   1. public/icon-source.png
 *   2. public/icon-source.jpg
 *   3. public/icon-source.svg
 *   4. public/favicon.svg (fallback)
 */

import sharp from 'sharp';
import { existsSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// Possible source image names (in priority order)
const possibleSources = [
  'icon-source.png',
  'icon-source.jpg',
  'icon-source.jpeg',
  'icon-source.svg',
  'icon-source.webp',
  'favicon.svg', // fallback
];

// Find the source image
function findSourceImage() {
  // Check command line argument first
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const customPath = join(publicDir, args[0]);
    if (existsSync(customPath)) {
      return customPath;
    }
    console.warn(`⚠️  Custom path not found: ${args[0]}, searching for default...`);
  }

  // Check default sources
  for (const source of possibleSources) {
    const sourcePath = join(publicDir, source);
    if (existsSync(sourcePath)) {
      return sourcePath;
    }
  }

  return null;
}

const sizes = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
];

async function generateIcons() {
  const sourcePath = findSourceImage();

  if (!sourcePath) {
    console.error('❌ No source image found!');
    console.log('\n📝 Please add your custom image to the public/ folder:');
    console.log('   - Name it: icon-source.png (or .jpg, .svg, .webp)');
    console.log('   - Or specify: npm run generate-icons your-image.png');
    console.log('\n💡 Supported formats: PNG, JPG, SVG, WEBP');
    process.exit(1);
  }

  const sourceName = sourcePath.split(/[/\\]/).pop();
  const isSvg = extname(sourcePath).toLowerCase() === '.svg';

  console.log(`🎨 Generating icons from ${sourceName}...\n`);

  try {
    // Generate PNG icons
    for (const { name, size } of sizes) {
      const outputPath = join(publicDir, name);
      await sharp(sourcePath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    // If source is SVG, also copy/update favicon.svg
    if (isSvg) {
      const faviconSvgPath = join(publicDir, 'favicon.svg');
      if (sourcePath !== faviconSvgPath) {
        const fs = await import('fs/promises');
        await fs.copyFile(sourcePath, faviconSvgPath);
        console.log('✅ Updated favicon.svg');
      }
    } else {
      // For non-SVG sources, create a simple SVG favicon or keep existing
      console.log('ℹ️  Note: favicon.svg not updated (source is not SVG)');
      console.log('   Modern browsers will use the PNG favicons.');
    }

    // Generate favicon.ico (16x16 and 32x32 combined)
    try {
      const icoPath = join(publicDir, 'favicon.ico');
      // Create a 32x32 version for ICO
      await sharp(sourcePath)
        .resize(32, 32, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(icoPath.replace('.ico', '-temp-32.png'));
      
      // Note: sharp doesn't create true ICO files, but PNG works for most browsers
      // For true ICO, use an online converter or imagemagick
      console.log('✅ Generated favicon.ico (PNG format)');
    } catch (error) {
      console.log('ℹ️  Skipped favicon.ico (optional)');
    }

    console.log('\n✨ All icons generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Test the build: npm run build');
    console.log('   2. Check the favicon in your browser');
    console.log('   3. Test on mobile: Add to home screen');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    if (error.message.includes('sharp')) {
      console.log('\n💡 Make sure sharp is installed: npm install --save-dev sharp');
    } else {
      console.log('\n💡 Make sure your source image is a valid image file');
    }
    process.exit(1);
  }
}

generateIcons();

