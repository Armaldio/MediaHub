import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Service {
  id: string;
  name: string;
  androidAppId?: string;
  websiteUrl?: string;
}

function extractField(content: string, field: string): string | undefined {
  const re = new RegExp(`^\\s*${field}:\\s*['"\`]([^'"\`]+)['"\`]`, 'm');
  const m = content.match(re);
  return m?.[1];
}

function loadServices(servicesDir: string): Service[] {
  const files = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts') && f !== 'requestServiceFactory.ts');
  const services: Service[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(servicesDir, file), 'utf-8');
    const id = extractField(content, 'id');
    const name = extractField(content, 'name');
    if (!id || !name) continue;
    services.push({
      id,
      name,
      androidAppId: extractField(content, 'androidAppId'),
      websiteUrl: extractField(content, 'websiteUrl'),
    });
  }
  return services;
}

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
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function getPlayStoreImageUrl(page: Page, appId: string): Promise<{ icon: string; icons: string[] }> {
  try {
    await page.goto(`https://play.google.com/store/apps/details?id=${appId}`);

    const iconSelector = 'img';
    await page.waitForSelector(iconSelector, { timeout: 10000 });

    const imageUrl = await page.evaluate((selector) => {
      const icons = Array.from(document.querySelectorAll(selector));
      const iconUrls = icons
        .filter(img => img.getAttribute('alt')?.includes('Icon image'))
        .map(img => img.getAttribute('src'))
        .filter((src): src is string => !!src);

      if (iconUrls.length === 0) return { icon: '', icons: iconUrls };

      return { icon: iconUrls[0]?.replace(/=s\d+/, '=s512') ?? '', icons: iconUrls };
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

async function getFaviconUrl(page: Page, url: string): Promise<string | null> {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const faviconUrl = await page.evaluate(() => {
      const linkIcon = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
      if (linkIcon) return linkIcon.href;

      const appleIcon = document.querySelector<HTMLLinkElement>('link[rel*="apple-touch-icon"]');
      if (appleIcon) return appleIcon.href;

      const domain = window.location.origin;
      return `${domain}/favicon.ico`;
    });

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
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
      console.log(`Created directory: ${appDir}`);
    }

    const playStorePath = path.join(appDir, 'play_store.png');
    const faviconPath = path.join(appDir, 'favicon.png');

    if (!options.force && fs.existsSync(playStorePath)) {
      console.log(`ℹ️  Play Store image already exists, skipping (use --force to re-download)`);
      return;
    }

    if (app.androidAppId) {
      const playStoreLink = `https://play.google.com/store/apps/details?id=${app.androidAppId}`;
      console.log(`Play Store: ${playStoreLink}`);

      console.log(`Fetching image from Play Store...`);
      const playStoreUrl = await getPlayStoreImageUrl(page, app.androidAppId);

      if (playStoreUrl?.icon) {
        try {
          await downloadImage(playStoreUrl.icon, playStorePath);
          console.log(`✅ Successfully downloaded image to: ${playStorePath}`);
          return;
        } catch (downloadError) {
          console.error(`❌ Failed to download Play Store image: ${playStoreUrl.icon}`);
          console.error(`   Play Store URL: ${playStoreLink}`);
          console.error(`   Error:`, downloadError instanceof Error ? downloadError.message : String(downloadError));
        }
      } else {
        console.warn(`⚠️  No valid Play Store image URL found for ${app.name}`);
      }
    }

    if (app.websiteUrl) {
      if (!options.force && fs.existsSync(faviconPath)) {
        console.log(`ℹ️  Favicon already exists, skipping (use --force to re-download)`);

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
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: pnpm run download-app-icons [options]');
    console.log('Options:');
    console.log('  --force, -f    Force re-download of existing images');
    console.log('  --help, -h     Show this help message');
    process.exit(0);
  }

  const servicesDir = path.join(__dirname, '..', '..', 'data', 'services');
  const outputDir = path.join(__dirname, '..', '..', 'assets', 'apps', 'images');
  console.log('Output directory:', outputDir);
  if (force) {
    console.log('Force mode: ON - will re-download existing images');
  }

  const services = loadServices(servicesDir);
  if (services.length === 0) {
    console.error('Error: No services found');
    process.exit(1);
  }
  console.log(`Found ${services.length} services`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  try {
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
