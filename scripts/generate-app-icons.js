#!/usr/bin/env node

/**
 * Génère toutes les icônes de l'application PWA à partir du logo EMB Money
 * - Icônes PWA: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
 * - Favicons: 16x16, 32x32, favicon.ico
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Chemins
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');
const SOURCE_LOGO = path.join(__dirname, '..', '..', 'emb-logo.png');

// Tailles des icônes PWA
const PWA_ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Tailles des favicons
const FAVICON_SIZES = [16, 32];

// Couleur de fond
const BACKGROUND_COLOR = '#000000';

async function generateAllIcons() {
  console.log('🎨 Génération des icônes EMB Money...\n');

  // Vérifier que la source existe
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error('❌ Logo source non trouvé:', SOURCE_LOGO);
    process.exit(1);
  }

  // Créer les dossiers si nécessaire
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  const metadata = await sharp(SOURCE_LOGO).metadata();
  console.log(`📐 Logo source: ${metadata.width}x${metadata.height} px\n`);

  try {
    // 1. Générer les icônes PWA
    console.log('🔷 Génération des icônes PWA...');
    for (const size of PWA_ICON_SIZES) {
      await generatePWAIcon(size);
    }

    // 2. Générer les favicons PNG
    console.log('\n🔷 Génération des favicons...');
    for (const size of FAVICON_SIZES) {
      await generateFavicon(size);
    }

    // 3. Générer favicon.ico (utilise le 32x32)
    await generateFaviconICO();

    console.log('\n✅ Toutes les icônes ont été générées avec succès!\n');

    // Lister les fichiers générés
    console.log('📝 Icônes PWA générées:');
    PWA_ICON_SIZES.forEach(size => {
      const filePath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
      const stats = fs.statSync(filePath);
      console.log(`   - icon-${size}x${size}.png (${(stats.size / 1024).toFixed(2)} KB)`);
    });

    console.log('\n📝 Favicons générés:');
    FAVICON_SIZES.forEach(size => {
      const filePath = path.join(PUBLIC_DIR, `favicon-${size}x${size}.png`);
      const stats = fs.statSync(filePath);
      console.log(`   - favicon-${size}x${size}.png (${(stats.size / 1024).toFixed(2)} KB)`);
    });

    const icoStats = fs.statSync(path.join(PUBLIC_DIR, 'favicon.ico'));
    console.log(`   - favicon.ico (${(icoStats.size / 1024).toFixed(2)} KB)`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

async function generatePWAIcon(size) {
  const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);

  // Calculer la taille du logo dans l'icône (80% de l'espace)
  const logoSize = Math.round(size * 0.85);

  // Redimensionner le logo
  const logoBuffer = await sharp(SOURCE_LOGO)
    .resize(logoSize, Math.round(logoSize * 0.67), {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  // Créer l'icône avec fond noir et logo centré
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BACKGROUND_COLOR
    }
  })
    .composite([{
      input: logoBuffer,
      gravity: 'center'
    }])
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`   ✅ icon-${size}x${size}.png`);
}

async function generateFavicon(size) {
  const outputPath = path.join(PUBLIC_DIR, `favicon-${size}x${size}.png`);

  // Pour les petites tailles, utiliser tout l'espace
  const logoBuffer = await sharp(SOURCE_LOGO)
    .resize(size, Math.round(size * 0.67), {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BACKGROUND_COLOR
    }
  })
    .composite([{
      input: logoBuffer,
      gravity: 'center'
    }])
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`   ✅ favicon-${size}x${size}.png`);
}

async function generateFaviconICO() {
  const outputPath = path.join(PUBLIC_DIR, 'favicon.ico');

  // Générer un PNG 32x32 pour le favicon.ico
  const logoBuffer = await sharp(SOURCE_LOGO)
    .resize(32, 21, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  // Créer le PNG puis le convertir en ICO (sharp ne supporte pas ICO directement)
  // On crée un PNG qui sera utilisé comme favicon.ico
  await sharp({
    create: {
      width: 32,
      height: 32,
      channels: 4,
      background: BACKGROUND_COLOR
    }
  })
    .composite([{
      input: logoBuffer,
      gravity: 'center'
    }])
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log(`   ✅ favicon.ico`);
}

generateAllIcons();
