#!/usr/bin/env node

/**
 * Génère les assets pour Google Play Store
 * - Icône: 512x512 px
 * - Image de présentation (Feature Graphic): 1024x500 px
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Chemins
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'store-assets', 'google-play');
const SOURCE_LOGO = path.join(__dirname, '..', '..', 'emb-logo.png');

// Couleurs EMB Money
const COLORS = {
  background: '#000000',
  red: '#E63946',
  white: '#FFFFFF'
};

async function generatePlayStoreAssets() {
  console.log('🎨 Génération des assets Google Play Store...\n');

  // Créer le dossier si nécessaire
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('📁 Dossier créé:', OUTPUT_DIR);
  }

  // Vérifier que la source existe
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error('❌ Logo source non trouvé:', SOURCE_LOGO);
    console.log('   Assurez-vous que emb-logo.png existe à la racine du projet\n');
    process.exit(1);
  }

  try {
    // Obtenir les dimensions du logo source
    const metadata = await sharp(SOURCE_LOGO).metadata();
    console.log(`📐 Logo source: ${metadata.width}x${metadata.height} px\n`);

    // 1. Générer l'icône 512x512
    await generateIcon();

    // 2. Générer l'image de présentation 1024x500
    await generateFeatureGraphic(metadata);

    console.log('\n✅ Tous les assets ont été générés avec succès!\n');
    console.log('📍 Emplacement:', OUTPUT_DIR);
    console.log('\n📝 Assets générés:');

    const files = fs.readdirSync(OUTPUT_DIR);
    files.forEach(file => {
      const filePath = path.join(OUTPUT_DIR, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   - ${file} (${sizeKB} KB)`);
    });

    console.log('\n📝 Prochaines étapes:');
    console.log('   1. Vérifier les images dans:', OUTPUT_DIR);
    console.log('   2. Uploader sur Google Play Console');
    console.log('   3. Section: Fiches Play Store > Éléments graphiques\n');

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error.message);
    process.exit(1);
  }
}

async function generateIcon() {
  console.log('🔷 Génération de l\'icône 512x512...');

  const iconPath = path.join(OUTPUT_DIR, 'icon-512x512.png');

  // Utiliser le logo complet redimensionné pour l'icône
  // Le logo horizontal sera centré dans un carré
  const logoBuffer = await sharp(SOURCE_LOGO)
    .resize(450, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: COLORS.background
    }
  })
    .composite([{
      input: logoBuffer,
      gravity: 'center'
    }])
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(iconPath);

  console.log('   ✅ icon-512x512.png créé');
}

async function generateFeatureGraphic(sourceMetadata) {
  console.log('🔷 Génération de l\'image de présentation 1024x500...');

  const featurePath = path.join(OUTPUT_DIR, 'feature-graphic.png');

  // Redimensionner le logo pour qu'il tienne dans 1024x500
  const logoHeight = 350;
  const logoWidth = Math.round((sourceMetadata.width / sourceMetadata.height) * logoHeight);

  const logoBuffer = await sharp(SOURCE_LOGO)
    .resize(logoWidth, logoHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 1024,
      height: 500,
      channels: 4,
      background: COLORS.background
    }
  })
    .composite([{
      input: logoBuffer,
      gravity: 'center'
    }])
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(featurePath);

  console.log('   ✅ feature-graphic.png créé');
}

generatePlayStoreAssets();
