#!/usr/bin/env node

/**
 * Script pour capturer automatiquement les screenshots PWA
 * Utilise Puppeteer pour capturer l'app aux bonnes dimensions
 */

const fs = require('fs');
const path = require('path');

// Vérifier si puppeteer est disponible
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  console.error('❌ Puppeteer n\'est pas installé.');
  console.log('\nInstallez puppeteer avec:');
  console.log('  npm install puppeteer --save-dev\n');
  console.log('Ou créez les screenshots manuellement (voir INSTRUCTIONS.md)\n');
  process.exit(1);
}

const APP_URL = process.env.APP_URL || 'https://front-alice.alicebot.online';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');

const SCREENSHOTS = [
  {
    name: 'mobile-1.png',
    width: 540,
    height: 720,
    desc: 'Screenshot Mobile',
    url: '/' // Page d'accueil
  },
  {
    name: 'desktop-1.png',
    width: 1280,
    height: 720,
    desc: 'Screenshot Desktop',
    url: '/' // Dashboard
  }
];

async function captureScreenshots() {
  console.log('📸 Capture des screenshots PWA...\n');
  console.log(`URL: ${APP_URL}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const screenshot of SCREENSHOTS) {
      const page = await browser.newPage();

      // Définir les dimensions
      await page.setViewport({
        width: screenshot.width,
        height: screenshot.height,
        deviceScaleFactor: 1,
      });

      console.log(`📷 Capture: ${screenshot.desc} (${screenshot.width}x${screenshot.height})`);

      // Naviguer vers la page
      const fullUrl = `${APP_URL}${screenshot.url}`;
      console.log(`   URL: ${fullUrl}`);

      await page.goto(fullUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Attendre un peu pour que tout se charge
      await page.waitForTimeout(2000);

      // Capturer
      const outputPath = path.join(SCREENSHOTS_DIR, screenshot.name);
      await page.screenshot({
        path: outputPath,
        type: 'png',
        fullPage: false
      });

      console.log(`✅ Sauvegardé: ${screenshot.name}\n`);

      await page.close();
    }

    console.log('='.repeat(50));
    console.log(`✅ ${SCREENSHOTS.length} screenshots capturés avec succès !`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Erreur lors de la capture:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// Vérifier que le dossier screenshots existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

captureScreenshots()
  .then(() => {
    console.log('✨ Screenshots créés avec succès!\n');
    console.log('Vérifiez-les dans:', SCREENSHOTS_DIR);
    console.log('\nProchaine étape:');
    console.log('  git add public/screenshots/*.png');
    console.log('  git commit -m "Add PWA screenshots"');
    console.log('  git push\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Échec de la capture des screenshots');
    console.log('\n💡 Alternative: Créez-les manuellement');
    console.log('   Voir: public/screenshots/INSTRUCTIONS.md\n');
    process.exit(1);
  });
