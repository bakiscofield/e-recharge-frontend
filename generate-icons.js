const fs = require('fs');
const path = require('path');

// Créer un SVG simple pour l'icône
const createIconSVG = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond dégradé bleu -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#bgGradient)" rx="${size * 0.15}"/>

  <!-- Lettre A stylisée -->
  <text
    x="50%"
    y="50%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-weight="bold"
    font-size="${size * 0.6}"
    fill="white">A</text>

  <!-- Petit $ symbole en bas à droite -->
  <text
    x="${size * 0.75}"
    y="${size * 0.8}"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-weight="bold"
    font-size="${size * 0.25}"
    fill="#10B981"
    opacity="0.9">$</text>
</svg>`;
};

// Tailles d'icônes nécessaires pour PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Créer le dossier icons s'il n'existe pas
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 Génération des icônes PWA...\n');

// Vérifier si sharp est disponible
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Module sharp trouvé, génération PNG...\n');

  // Générer les icônes PNG avec sharp
  Promise.all(
    sizes.map(async (size) => {
      const svg = createIconSVG(size);
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

      try {
        await sharp(Buffer.from(svg))
          .resize(size, size)
          .png()
          .toFile(outputPath);
        console.log(`✅ icon-${size}x${size}.png créée`);
      } catch (error) {
        console.error(`❌ Erreur pour icon-${size}x${size}.png:`, error.message);
      }
    })
  ).then(() => {
    console.log('\n🎉 Toutes les icônes ont été générées avec succès!');
  }).catch((error) => {
    console.error('\n❌ Erreur lors de la génération:', error);
  });

} catch (error) {
  console.log('⚠️  Module sharp non trouvé, génération SVG uniquement...\n');

  // Générer les icônes SVG uniquement
  sizes.forEach((size) => {
    const svg = createIconSVG(size);
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    fs.writeFileSync(outputPath, svg);
    console.log(`✅ icon-${size}x${size}.svg créée`);
  });

  console.log('\n⚠️  Pour générer des PNG, installez sharp:');
  console.log('npm install sharp --save-dev\n');
}

// Créer aussi un favicon.ico basique
const faviconSVG = createIconSVG(32);
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSVG);
console.log('✅ favicon.svg créé\n');
