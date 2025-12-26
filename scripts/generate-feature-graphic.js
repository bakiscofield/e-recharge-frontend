#!/usr/bin/env node

/**
 * Génère le Feature Graphic pour Google Play Store
 * Dimensions: 1024x500 pixels
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'store-assets', 'google-play');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'feature-graphic.png');
const LOGO_PATH = path.join(__dirname, '..', 'public', 'icons', 'icon-512x512.png');

async function generateFeatureGraphic() {
  console.log('🎨 Génération du Feature Graphic Google Play...\n');

  // Créer le dossier si nécessaire
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('📁 Dossier créé:', OUTPUT_DIR);
  }

  // Vérifier que le logo existe
  if (!fs.existsSync(LOGO_PATH)) {
    console.error('❌ Logo source non trouvé:', LOGO_PATH);
    console.log('   Assurez-vous que icon-512x512.png existe\n');
    process.exit(1);
  }

  try {
    // Créer un canvas 1024x500 avec fond bleu AliceBot
    const width = 1024;
    const height = 500;
    const logoSize = 256;

    // Créer le fond bleu
    const background = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 30, g: 64, b: 175, alpha: 1 } // #1E40AF (bleu AliceBot)
      }
    }).png().toBuffer();

    // Redimensionner le logo
    const resizedLogo = await sharp(LOGO_PATH)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();

    // Composer l'image finale avec le logo centré
    await sharp(background)
      .composite([
        {
          input: resizedLogo,
          top: Math.floor((height - logoSize) / 2),
          left: Math.floor((width - logoSize) / 2)
        }
      ])
      .png({
        quality: 100,
        compressionLevel: 9
      })
      .toFile(OUTPUT_PATH);

    console.log('✅ Feature graphic créé avec succès!\n');
    console.log('📍 Emplacement:', OUTPUT_PATH);
    console.log('📐 Dimensions: 1024x500 pixels');
    console.log('🎨 Format: PNG\n');

    // Afficher la taille du fichier
    const stats = fs.statSync(OUTPUT_PATH);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`📦 Taille: ${sizeKB} KB\n`);

    console.log('📝 Prochaines étapes:');
    console.log('   1. Vérifier l\'image dans:', OUTPUT_DIR);
    console.log('   2. Uploader sur Google Play Console');
    console.log('   3. Section: Store listing > Graphics\n');

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error.message);
    process.exit(1);
  }
}

generateFeatureGraphic();
