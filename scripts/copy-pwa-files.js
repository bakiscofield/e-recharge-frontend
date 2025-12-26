#!/usr/bin/env node

/**
 * Script pour copier les fichiers PWA dans le build de production
 * Exécuté après le build Next.js
 */

const fs = require('fs');
const path = require('path');

const PWA_FILES = [
  'sw.js',
  'manifest.json',
  'offline.html',
  'browserconfig.xml',
  'robots.txt',
];

function copyPWAFiles() {
  console.log('📦 Copie des fichiers PWA dans le build...\n');

  const publicDir = path.join(__dirname, '..', 'public');
  const standalonePublic = path.join(__dirname, '..', '.next', 'standalone', 'public');
  const staticPublic = path.join(__dirname, '..', '.next', 'static');

  let successCount = 0;
  let errorCount = 0;

  // Créer les dossiers de destination s'ils n'existent pas
  if (fs.existsSync(standalonePublic)) {
    console.log('✅ Dossier standalone/public trouvé');
  } else {
    console.log('⚠️  Dossier standalone/public non trouvé, création...');
    fs.mkdirSync(standalonePublic, { recursive: true });
  }

  PWA_FILES.forEach(file => {
    const source = path.join(publicDir, file);

    if (!fs.existsSync(source)) {
      console.log(`⚠️  ${file} - Fichier source non trouvé`);
      errorCount++;
      return;
    }

    try {
      // Copier dans standalone/public
      if (fs.existsSync(standalonePublic)) {
        const dest = path.join(standalonePublic, file);
        fs.copyFileSync(source, dest);
        console.log(`✅ ${file} → standalone/public/`);
        successCount++;
      }

      // Aussi copier dans .next/static pour être sûr
      if (fs.existsSync(staticPublic)) {
        const dest2 = path.join(staticPublic, file);
        fs.copyFileSync(source, dest2);
        console.log(`✅ ${file} → .next/static/`);
      }

    } catch (error) {
      console.log(`❌ ${file} - Erreur: ${error.message}`);
      errorCount++;
    }
  });

  // Copier le dossier icons
  const iconsSource = path.join(publicDir, 'icons');
  if (fs.existsSync(iconsSource)) {
    try {
      const iconsDest = path.join(standalonePublic, 'icons');
      fs.mkdirSync(iconsDest, { recursive: true });

      const iconFiles = fs.readdirSync(iconsSource);
      iconFiles.forEach(icon => {
        fs.copyFileSync(
          path.join(iconsSource, icon),
          path.join(iconsDest, icon)
        );
      });

      console.log(`✅ icons/ (${iconFiles.length} fichiers) → standalone/public/icons/`);
      successCount++;
    } catch (error) {
      console.log(`❌ icons/ - Erreur: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Succès: ${successCount}`);
  if (errorCount > 0) {
    console.log(`❌ Erreurs: ${errorCount}`);
  }
  console.log('='.repeat(50) + '\n');

  if (errorCount > 0) {
    process.exit(1);
  }
}

copyPWAFiles();
