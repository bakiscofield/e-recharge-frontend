#!/usr/bin/env node

/**
 * Script de validation complète de la configuration PWA
 * Vérifie tous les fichiers requis et la configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration PWA AliceBot...\n');
console.log('='.repeat(60) + '\n');

let successCount = 0;
let warningCount = 0;
let errorCount = 0;

// Fichiers requis
const REQUIRED_FILES = [
  { path: 'public/manifest.json', name: 'Manifest PWA', critical: true },
  { path: 'public/sw.js', name: 'Service Worker', critical: true },
  { path: 'public/offline.html', name: 'Page offline', critical: true },
  { path: 'public/icons/icon-192x192.png', name: 'Icon 192x192', critical: true },
  { path: 'public/icons/icon-512x512.png', name: 'Icon 512x512', critical: true },
  { path: 'public/apple-touch-icon.png', name: 'Apple Touch Icon', critical: false },
  { path: 'public/favicon-16x16.png', name: 'Favicon 16x16', critical: false },
  { path: 'public/favicon-32x32.png', name: 'Favicon 32x32', critical: false },
  { path: 'public/favicon.ico', name: 'Favicon ICO', critical: false },
  { path: 'public/safari-pinned-tab.svg', name: 'Safari Pinned Tab', critical: false },
  { path: 'src/components/ServiceWorkerRegistration.tsx', name: 'SW Registration Component', critical: true },
  { path: 'src/components/PWAInstallPrompt.tsx', name: 'Install Prompt Component', critical: true },
  { path: 'src/lib/pwa-utils.ts', name: 'PWA Utilities', critical: true },
  { path: 'next.config.js', name: 'Next.js Config', critical: true },
  { path: 'public/.well-known/assetlinks.json', name: 'Asset Links (Android)', critical: false },
];

// Pages App Store requises
const APP_STORE_FILES = [
  { path: 'src/app/privacy/page.tsx', name: 'Privacy Policy Page', critical: true },
  { path: 'src/app/terms/page.tsx', name: 'Terms of Service Page', critical: true },
  { path: 'src/app/support/page.tsx', name: 'Support Page', critical: true },
];

// Assets App Stores
const STORE_ASSETS = [
  { path: 'public/store-assets/google-play/feature-graphic.png', name: 'Google Play Feature Graphic', critical: false },
  { path: 'public/store-assets/microsoft/store-logo.png', name: 'Microsoft Store Logo', critical: false },
];

// Screenshots
const SCREENSHOTS = [
  { path: 'public/screenshots/mobile-1.png', name: 'Mobile Screenshot', critical: false },
  { path: 'public/screenshots/desktop-1.png', name: 'Desktop Screenshot', critical: false },
];

console.log('📦 FICHIERS PWA CORE\n');
REQUIRED_FILES.forEach(file => {
  const filePath = path.join(__dirname, '..', file.path);
  const exists = fs.existsSync(filePath);

  if (exists) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${file.name}`);
    console.log(`   ${file.path} (${sizeKB} KB)`);
    successCount++;
  } else {
    if (file.critical) {
      console.log(`❌ ${file.name}`);
      console.log(`   MANQUANT: ${file.path}`);
      errorCount++;
    } else {
      console.log(`⚠️  ${file.name}`);
      console.log(`   Optionnel mais recommandé: ${file.path}`);
      warningCount++;
    }
  }
});

console.log('\n' + '='.repeat(60) + '\n');

console.log('📄 PAGES APP STORE\n');
APP_STORE_FILES.forEach(file => {
  const filePath = path.join(__dirname, '..', file.path);
  const exists = fs.existsSync(filePath);

  if (exists) {
    console.log(`✅ ${file.name}`);
    console.log(`   ${file.path}`);
    successCount++;
  } else {
    if (file.critical) {
      console.log(`❌ ${file.name}`);
      console.log(`   REQUIS pour App Store: ${file.path}`);
      errorCount++;
    } else {
      console.log(`⚠️  ${file.name}`);
      console.log(`   Optionnel: ${file.path}`);
      warningCount++;
    }
  }
});

console.log('\n' + '='.repeat(60) + '\n');

console.log('🎨 ASSETS APP STORES\n');
STORE_ASSETS.forEach(file => {
  const filePath = path.join(__dirname, '..', file.path);
  const exists = fs.existsSync(filePath);

  if (exists) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${file.name}`);
    console.log(`   ${file.path} (${sizeKB} KB)`);
    successCount++;
  } else {
    console.log(`⚠️  ${file.name}`);
    console.log(`   Générer avec: npm run generate:store-assets`);
    console.log(`   ${file.path}`);
    warningCount++;
  }
});

console.log('\n' + '='.repeat(60) + '\n');

console.log('📸 SCREENSHOTS PWA\n');
SCREENSHOTS.forEach(file => {
  const filePath = path.join(__dirname, '..', file.path);
  const exists = fs.existsSync(filePath);

  if (exists) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ ${file.name}`);
    console.log(`   ${file.path} (${sizeKB} KB)`);
    successCount++;
  } else {
    console.log(`⚠️  ${file.name}`);
    console.log(`   Créer avec: npm run generate:screenshots`);
    console.log(`   Ou suivre: public/screenshots/INSTRUCTIONS.md`);
    console.log(`   ${file.path}`);
    warningCount++;
  }
});

console.log('\n' + '='.repeat(60) + '\n');

// Vérifier le contenu de manifest.json
console.log('🔍 VALIDATION MANIFEST.JSON\n');
const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    const checks = [
      { key: 'name', value: manifest.name, required: true },
      { key: 'short_name', value: manifest.short_name, required: true },
      { key: 'start_url', value: manifest.start_url, required: true },
      { key: 'display', value: manifest.display, required: true },
      { key: 'theme_color', value: manifest.theme_color, required: true },
      { key: 'background_color', value: manifest.background_color, required: true },
      { key: 'icons', value: manifest.icons?.length >= 2, required: true },
      { key: 'shortcuts', value: manifest.shortcuts?.length > 0, required: false },
      { key: 'screenshots', value: manifest.screenshots?.length > 0, required: false },
    ];

    checks.forEach(check => {
      if (check.value) {
        console.log(`✅ ${check.key}: ${typeof check.value === 'boolean' ? 'OK' : check.value}`);
        successCount++;
      } else {
        if (check.required) {
          console.log(`❌ ${check.key}: MANQUANT (requis)`);
          errorCount++;
        } else {
          console.log(`⚠️  ${check.key}: Non défini (optionnel)`);
          warningCount++;
        }
      }
    });
  } catch (error) {
    console.log(`❌ Erreur de parsing: ${error.message}`);
    errorCount++;
  }
} else {
  console.log('❌ manifest.json non trouvé!');
  errorCount++;
}

console.log('\n' + '='.repeat(60) + '\n');

// Vérifier next.config.js
console.log('⚙️  CONFIGURATION NEXT.JS\n');
const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const configContent = fs.readFileSync(nextConfigPath, 'utf-8');

  const configChecks = [
    { name: 'swcMinify', pattern: /swcMinify:\s*true/, required: true },
    { name: 'compress', pattern: /compress:\s*true/, required: true },
    { name: 'Image optimization', pattern: /formats:\s*\[/, required: true },
    { name: 'Headers configuration', pattern: /async headers\(\)/, required: true },
    { name: 'SW headers', pattern: /\/sw\.js/, required: true },
  ];

  configChecks.forEach(check => {
    if (check.pattern.test(configContent)) {
      console.log(`✅ ${check.name}`);
      successCount++;
    } else {
      if (check.required) {
        console.log(`⚠️  ${check.name}: Non trouvé`);
        warningCount++;
      }
    }
  });
} else {
  console.log('❌ next.config.js non trouvé!');
  errorCount++;
}

console.log('\n' + '='.repeat(60) + '\n');

// Résumé final
console.log('📊 RÉSUMÉ\n');
console.log(`✅ Succès:         ${successCount}`);
console.log(`⚠️  Avertissements: ${warningCount}`);
console.log(`❌ Erreurs:        ${errorCount}`);

const total = successCount + warningCount + errorCount;
const percentage = total > 0 ? ((successCount / total) * 100).toFixed(1) : 0;
console.log(`\n📈 Score: ${percentage}%`);

console.log('\n' + '='.repeat(60) + '\n');

// Recommandations
if (errorCount > 0) {
  console.log('❌ ERREURS CRITIQUES DÉTECTÉES\n');
  console.log('Corrigez les erreurs ci-dessus avant de déployer en production.\n');
}

if (warningCount > 0) {
  console.log('⚠️  AMÉLIORATIONS RECOMMANDÉES\n');
  console.log('Actions suggérées:');

  if (!fs.existsSync(path.join(__dirname, '..', 'public', 'store-assets', 'google-play', 'feature-graphic.png'))) {
    console.log('• Générer assets stores: npm run generate:store-assets');
  }

  if (!fs.existsSync(path.join(__dirname, '..', 'public', 'screenshots', 'mobile-1.png'))) {
    console.log('• Créer screenshots PWA: npm run generate:screenshots');
  }

  if (!fs.existsSync(path.join(__dirname, '..', 'public', '.well-known', 'assetlinks.json'))) {
    console.log('• Configurer assetlinks.json: npm run update:assetlinks');
  }

  console.log('');
}

if (errorCount === 0 && warningCount === 0) {
  console.log('🎉 FÉLICITATIONS!\n');
  console.log('Votre PWA est parfaitement configurée!\n');
  console.log('Prochaines étapes:');
  console.log('1. Tester avec: npm run build && npm start');
  console.log('2. Audit Lighthouse: lighthouse http://localhost:3000');
  console.log('3. Déployer en production');
  console.log('4. Soumettre aux App Stores\n');
}

console.log('='.repeat(60) + '\n');

// Code de sortie
if (errorCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
