#!/usr/bin/env node

/**
 * Script principal pour générer tous les assets App Stores
 * - Feature Graphic Google Play (1024x500)
 * - Store Logo Microsoft (300x300)
 * - Créer les dossiers nécessaires
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Génération de tous les assets App Stores...\n');
console.log('='.repeat(60));

// Créer les dossiers
const dirs = [
  path.join(__dirname, '..', 'public', 'store-assets', 'google-play'),
  path.join(__dirname, '..', 'public', 'store-assets', 'microsoft'),
  path.join(__dirname, '..', 'public', '.well-known')
];

console.log('\n📁 Création des dossiers...\n');
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('   ✅ Créé:', dir);
  } else {
    console.log('   ℹ️  Existe déjà:', dir);
  }
});

// Scripts à exécuter
const scripts = [
  {
    name: 'Feature Graphic (Google Play)',
    script: 'generate-feature-graphic.js',
    emoji: '📱'
  },
  {
    name: 'Store Logo (Microsoft)',
    script: 'generate-store-logo.js',
    emoji: '🪟'
  }
];

console.log('\n' + '='.repeat(60));
console.log('🎨 Génération des images...\n');

let successCount = 0;
let failedScripts = [];

scripts.forEach(({ name, script, emoji }) => {
  try {
    console.log(`${emoji} ${name}...`);
    console.log('-'.repeat(60));

    const scriptPath = path.join(__dirname, script);
    execSync(`node "${scriptPath}"`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    successCount++;
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error(`\n❌ Échec: ${name}`);
    console.error(error.message);
    failedScripts.push(name);
    console.log('='.repeat(60) + '\n');
  }
});

// Résumé final
console.log('='.repeat(60));
console.log('📊 RÉSUMÉ DE LA GÉNÉRATION\n');
console.log(`✅ Succès: ${successCount}/${scripts.length}`);

if (failedScripts.length > 0) {
  console.log(`❌ Échecs: ${failedScripts.length}`);
  console.log('   Scripts échoués:');
  failedScripts.forEach(script => console.log(`   - ${script}`));
}

console.log('\n' + '='.repeat(60));
console.log('📂 Assets générés dans:');
console.log('   • public/store-assets/google-play/');
console.log('   • public/store-assets/microsoft/\n');

console.log('⚠️  IMPORTANT - Prochaines étapes:\n');
console.log('1. Google Play TWA:');
console.log('   • Installer Bubblewrap: npm install -g @bubblewrap/cli');
console.log('   • Initialiser le projet: bubblewrap init --manifest https://front-alice.alicebot.online/manifest.json');
console.log('   • Générer le fingerprint: bubblewrap fingerprint');
console.log('   • Mettre à jour public/.well-known/assetlinks.json avec le SHA256\n');

console.log('2. Microsoft Store:');
console.log('   • Aller sur https://www.pwabuilder.com/');
console.log('   • Entrer: https://front-alice.alicebot.online');
console.log('   • Télécharger le package Windows\n');

console.log('3. Vérifier les assets:');
console.log('   • cd public/store-assets/');
console.log('   • Ouvrir les images pour vérifier la qualité\n');

console.log('='.repeat(60));

if (failedScripts.length > 0) {
  process.exit(1);
}
