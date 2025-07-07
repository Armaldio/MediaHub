import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import services  from '../../data/services.ts'
import { Service } from '../../types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function downloadImage(url: string, filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filePath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

async function getPlayStoreImageUrl(page: Page, appId: string): Promise<{ icon: string; icons: string[] }> {
  try {
    await page.goto(`https://play.google.com/store/apps/details?id=${appId}`);

    // More flexible selector that matches variations of icon elements
    const iconSelector = 'img';
    await page.waitForSelector(iconSelector, { timeout: 10000 });

    const imageUrl = await page.evaluate((selector) => {
      // Get all potential icon images
      const icons = Array.from(document.querySelectorAll(selector));
      const iconUrls = icons
        .filter(img => img.getAttribute('alt')?.includes('Icon image'))
        .map(img => img.getAttribute('src'))
        .filter(src => !!src);

      if (iconUrls.length === 0) return { icon: '', icons: iconUrls };

      return { icon: iconUrls[0]?.replace(/=s\d+/, '=s512'), icons: iconUrls };
    }, iconSelector);

    
    if (!imageUrl.icon) {
      console.log('imageUrl', imageUrl)
    }

    return { icon: imageUrl.icon, icons: imageUrl.icons };
  } catch (error) {
    console.error(`Error getting Play Store image for ${appId}:`, error);
    return { icon: '', icons: [] };
  }
}

// async function getAppStoreImageUrl(page: Page, appName: string): Promise<string | null> {
//   try {
//     await page.goto(`https://www.apple.com/us/search/${encodeURIComponent(appName)}?src=globalnav`);

//     // Wait for search results to load
//     await page.waitForSelector('a[data-testid="tile"]', { timeout: 10000 });

//     const imageUrl = await page.evaluate(() => {
//       const firstResult = document.querySelector('a[data-testid="tile"]');
//       if (!firstResult) return null;
      
//       const img = firstResult.querySelector('img');
//       return img ? img.src : null;
//     });

//     return imageUrl;
//   } catch (error) {
//     console.error(`Error getting App Store image for ${appName}:`, error);
//     return null;
//   }
// }

async function getFaviconUrl(page: Page, url: string): Promise<string | null> {
  try {
    // Ensure URL has protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Try to find favicon in various locations
    const faviconUrl = await page.evaluate(() => {
      // Check for link rel="icon" or "shortcut icon"
      const linkIcon = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
      if (linkIcon) return linkIcon.href;
      
      // Check for Apple touch icon
      const appleIcon = document.querySelector<HTMLLinkElement>('link[rel*="apple-touch-icon"]');
      if (appleIcon) return appleIcon.href;
      
      // Try default favicon.ico location
      const domain = window.location.origin;
      return `${domain}/favicon.ico`;
    });

    // Ensure the URL is absolute
    if (faviconUrl) {
      const urlObj = new URL(faviconUrl, fullUrl);
      return urlObj.href;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting favicon for ${url}:`, error);
    return null;
  }
}

interface ProcessAppOptions {
  force?: boolean;
}

async function processApp(browser: Browser, app: Service, outputDir: string, options: ProcessAppOptions = {}): Promise<void> {
  const page = await browser.newPage();
  const appDir = path.join(outputDir, app.id, 'assets');
  
  try {
    // Create app directory if it doesn't exist
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
      console.log(`Created directory: ${appDir}`);
    }

    const playStorePath = path.join(appDir, 'play_store.png');
    const faviconPath = path.join(appDir, 'favicon.png');
    
    // Skip if files exist and force is not enabled
    if (!options.force && fs.existsSync(playStorePath)) {
      console.log(`ℹ️  Play Store image already exists, skipping (use --force to re-download)`);
      return;
    }
    
    if (app.androidAppId) {
      // Process Play Store icon if app ID is available
      const playStoreLink = `https://play.google.com/store/apps/details?id=${app.androidAppId}`;
      console.log(`Play Store: ${playStoreLink}`);
      
      console.log(`Fetching image from Play Store...`);
      const playStoreUrl = await getPlayStoreImageUrl(page, app.androidAppId);
      
      if (playStoreUrl?.icon) {
        try {
          await downloadImage(playStoreUrl.icon, playStorePath);
          console.log(`✅ Successfully downloaded image to: ${playStorePath}`);
          return; // Exit after successful download
        } catch (downloadError) {
          console.error(`❌ Failed to download Play Store image: ${playStoreUrl.icon}`);
          console.error(`   Play Store URL: ${playStoreLink}`);
          console.error(`   Error:`, downloadError instanceof Error ? downloadError.message : String(downloadError));
          // Continue to try favicon as fallback
        }
      } else {
        console.warn(`⚠️  No valid Play Store image URL found for ${app.name}`);
      }
    }

    // Try to get favicon from website if no Play Store image was found or no app ID
    if (app.websiteUrl) {
      // Skip if favicon already exists and we're not forcing
      if (!options.force && fs.existsSync(faviconPath)) {
        console.log(`ℹ️  Favicon already exists, skipping (use --force to re-download)`);
        
        // If we were trying to get a Play Store icon but it failed, and play_store.png doesn't exist
        if (app.androidAppId && !fs.existsSync(playStorePath)) {
          fs.copyFileSync(faviconPath, playStorePath);
          console.log(`✅ Copied existing favicon as play_store.png`);
        }
        return;
      }
      
      console.log(`Trying to fetch favicon from ${app.websiteUrl}...`);
      try {
        const faviconUrl = await getFaviconUrl(page, app.websiteUrl);
        if (faviconUrl) {
          try {
            await downloadImage(faviconUrl, faviconPath);
            console.log(`✅ Successfully downloaded favicon to: ${faviconPath}`);
            
            // If we were trying to get a Play Store icon but it failed, copy favicon as play_store.png
            if (app.androidAppId) {
              fs.copyFileSync(faviconPath, playStorePath);
              console.log(`✅ Copied favicon as play_store.png`);
            }
          } catch (faviconError) {
            console.error(`❌ Failed to download favicon: ${faviconUrl}`);
            console.error(`   Error:`, faviconError instanceof Error ? faviconError.message : String(faviconError));
          }
        } else {
          console.warn(`⚠️  No favicon found for ${app.websiteUrl}`);
        }
      } catch (error) {
        console.error(`❌ Error fetching favicon for ${app.websiteUrl}:`, error instanceof Error ? error.message : String(error));
      }
    } else {
      console.warn(`⚠️  No website URL provided for ${app.name}, skipping favicon download`);
    }

  } catch (error) {
    const playStoreLink = app.androidAppId ? `https://play.google.com/store/apps/details?id=${app.androidAppId}` : 'N/A';
    console.error(`❌ Error processing ${app.name} (${app.id}):`, error instanceof Error ? error.message : String(error));
    console.error(`   Play Store URL: ${playStoreLink}`);
    
    // Log additional error details if available
    if (error instanceof Error && 'stack' in error) {
      console.error('   Stack:', error.stack?.split('\n').slice(0, 3).join('\n      '));
    }
  } finally {
    try {
      await page.close();
    } catch (closeError) {
      console.error(`⚠️  Error closing page for ${app.name}:`, closeError);
    }
  }
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: pnpm run download-app-icons [options]');
    console.log('Options:');
    console.log('  --force, -f    Force re-download of existing images');
    console.log('  --help, -h     Show this help message');
    process.exit(0);
  }
  
  const outputDir = path.join(__dirname, '..', '..', 'assets', 'apps', 'images');
  console.log('Output directory:', outputDir);
  if (force) {
    console.log('Force mode: ON - will re-download existing images');
  }
  
  if (!services || !Array.isArray(services) || services.length === 0) {
    console.error('Error: No apps found in services');
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Launch browser
  const browser = await chromium.launch({ headless: true });

  try {
    // Process each app
    for (const app of services) {
      console.log(`\nProcessing ${app.name} (${app.id})`);
      await processApp(browser, app, outputDir, { force });
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);