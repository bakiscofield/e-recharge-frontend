#!/usr/bin/env node

/**
 * Génère le Store Logo pour Microsoft Store
 * Dimensions: 300x300 pixels
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'store-assets', 'microsoft');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'store-logo.png');
const SOURCE_LOGO = path.join(__dirname, '..', 'public', 'icons', 'icon-512x512.png');

async function generateStoreLogo() {
  console.log('🎨 Génération du Store Logo Microsoft Store...\n');

  // Créer le dossier si nécessaire
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('📁 Dossier créé:', OUTPUT_DIR);
  }

  // Vérifier que la source existe
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error('❌ Logo source non trouvé:', SOURCE_LOGO);
    console.log('   Assurez-vous que icon-512x512.png existe\n');
    process.exit(1);
  }

  try {
    await sharp(SOURCE_LOGO)
      .resize(300, 300, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 } // Fond transparent
      })
      .png({
        quality: 100,
        compressionLevel: 9
      })
      .toFile(OUTPUT_PATH);

    console.log('✅ Store logo créé avec succès!\n');
    console.log('📍 Emplacement:', OUTPUT_PATH);
    console.log('📐 Dimensions: 300x300 pixels');
    console.log('🎨 Format: PNG avec transparence\n');

    // Afficher la taille du fichier
    const stats = fs.statSync(OUTPUT_PATH);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`📦 Taille: ${sizeKB} KB\n`);

    console.log('📝 Prochaines étapes:');
    console.log('   1. Vérifier l\'image dans:', OUTPUT_DIR);
    console.log('   2. Uploader sur Microsoft Partner Center');
    console.log('   3. Section: Store listings > Logos\n');

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error.message);
    process.exit(1);
  }
}

generateStoreLogo();
