#!/usr/bin/env node

/**
 * Script pour générer les icônes PWA manquantes
 * à partir de l'icône 512x512 existante
 */

const fs = require('fs');
const path = require('path');

// Vérifier si sharp est disponible
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Sharp n\'est pas installé.');
  console.log('\nInstallez sharp avec:');
  console.log('  npm install sharp --save-dev\n');
  process.exit(1);
}

const ICONS_TO_GENERATE = [
  { size: 16, name: 'favicon-16x16.png', desc: 'Favicon 16x16' },
  { size: 32, name: 'favicon-32x32.png', desc: 'Favicon 32x32' },
  { size: 180, name: 'apple-touch-icon.png', desc: 'Apple Touch Icon' },
];

async function generateMissingIcons() {
  console.log('🎨 Génération des icônes PWA manquantes...\n');

  const publicDir = path.join(__dirname, '..', 'public');
  const iconsDir = path.join(publicDir, 'icons');
  const sourceIcon = path.join(iconsDir, 'icon-512x512.png');

  // Vérifier que l'icône source existe
  if (!fs.existsSync(sourceIcon)) {
    console.error('❌ Icône source non trouvée:', sourceIcon);
    process.exit(1);
  }

  console.log('✅ Icône source:', sourceIcon);
  console.log('');

  let successCount = 0;
  let errorCount = 0;

  // Générer chaque icône
  for (const icon of ICONS_TO_GENERATE) {
    const outputPath = path.join(publicDir, icon.name);

    try {
      await sharp(sourceIcon)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ ${icon.desc} (${icon.size}x${icon.size}) → ${icon.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erreur pour ${icon.name}:`, error.message);
      errorCount++;
    }
  }

  // Générer favicon.ico (nécessite un outil externe)
  console.log('\n📝 Note: Pour favicon.ico, utilisez:');
  console.log('   https://realfavicongenerator.net/');
  console.log('   ou installez: npm install -g to-ico');
  console.log('   puis: to-ico public/favicon-32x32.png > public/favicon.ico\n');

  // Générer safari-pinned-tab.svg (simpliste - noir sur transparent)
  try {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#000"/>
  <text x="256" y="340" font-size="280" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">A</text>
</svg>`;

    fs.writeFileSync(path.join(publicDir, 'safari-pinned-tab.svg'), svgContent);
    console.log('✅ safari-pinned-tab.svg généré (placeholder)');
    successCount++;
  } catch (error) {
    console.error('❌ Erreur svg:', error.message);
    errorCount++;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Succès: ${successCount}/${ICONS_TO_GENERATE.length + 1}`);
  if (errorCount > 0) {
    console.log(`❌ Erreurs: ${errorCount}`);
  }
  console.log('='.repeat(50) + '\n');

  return errorCount === 0;
}

generateMissingIcons()
  .then(success => {
    if (success) {
      console.log('✨ Icônes générées avec succès!\n');
      process.exit(0);
    } else {
      console.log('⚠️  Certaines icônes n\'ont pas pu être générées.\n');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
