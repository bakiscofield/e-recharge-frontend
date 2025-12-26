#!/usr/bin/env node

/**
 * Script pour analyser le bundle Next.js
 * et identifier les opportunités d'optimisation
 */

const fs = require('fs');
const path = require('path');

console.log('📊 Analyse du bundle Next.js...\n');

const buildManifestPath = path.join(__dirname, '..', '.next', 'build-manifest.json');

if (!fs.existsSync(buildManifestPath)) {
  console.log('❌ Build manifest non trouvé.');
  console.log('   Lancez d\'abord: npm run build\n');
  process.exit(1);
}

const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf-8'));

console.log('='.repeat(60));
console.log('ANALYSE DU BUNDLE');
console.log('='.repeat(60) + '\n');

// Analyser les pages
const pages = buildManifest.pages;
const pageNames = Object.keys(pages);

console.log(`📄 Pages statiques: ${pageNames.length}\n`);

let totalSize = 0;
const pageSizes = [];

for (const [pageName, files] of Object.entries(pages)) {
  const pageSize = files.reduce((acc, file) => {
    const filePath = path.join(__dirname, '..', '.next', file);
    if (fs.existsSync(filePath)) {
      return acc + fs.statSync(filePath).size;
    }
    return acc;
  }, 0);

  totalSize += pageSize;
  pageSizes.push({
    page: pageName,
    size: pageSize,
    files: files.length
  });
}

// Trier par taille
pageSizes.sort((a, b) => b.size - a.size);

// Afficher les plus grosses pages
console.log('🔍 Top 10 pages les plus lourdes:\n');
pageSizes.slice(0, 10).forEach((page, index) => {
  const sizeKB = (page.size / 1024).toFixed(2);
  console.log(`${index + 1}. ${page.page}`);
  console.log(`   Taille: ${sizeKB} KB (${page.files} fichiers)\n`);
});

console.log('='.repeat(60));
console.log(`Taille totale estimée: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log('='.repeat(60) + '\n');

// Recommandations
console.log('💡 RECOMMANDATIONS D\'OPTIMISATION:\n');

const recommendations = [];

// Vérifier si certaines pages sont trop lourdes
const heavyPages = pageSizes.filter(p => p.size > 200 * 1024); // > 200KB
if (heavyPages.length > 0) {
  recommendations.push({
    priority: 'HIGH',
    title: 'Pages lourdes détectées',
    desc: `${heavyPages.length} pages dépassent 200KB`,
    actions: [
      'Utiliser dynamic imports pour le code splitting',
      'Lazy load les composants non critiques',
      'Vérifier les imports inutilisés'
    ]
  });
}

// Vérifier le nombre total de fichiers
if (totalSize > 5 * 1024 * 1024) { // > 5MB
  recommendations.push({
    priority: 'MEDIUM',
    title: 'Bundle total important',
    desc: `Taille totale: ${(totalSize / 1024 / 1024).toFixed(2)} MB`,
    actions: [
      'Activer la compression Gzip/Brotli sur le serveur',
      'Utiliser next/dynamic pour les composants lourds',
      'Analyser avec @next/bundle-analyzer'
    ]
  });
}

// Toujours recommander ces optimisations
recommendations.push({
  priority: 'INFO',
  title: 'Optimisations générales',
  desc: 'Bonnes pratiques Next.js',
  actions: [
    'Utiliser next/image pour toutes les images',
    'Activer swcMinify (déjà fait ✅)',
    'Configurer fonts.google.com pour les polices',
    'Utiliser les Server Components (App Router)'
  ]
});

// Afficher les recommandations
recommendations.forEach((rec, index) => {
  const emoji = rec.priority === 'HIGH' ? '🔴' : rec.priority === 'MEDIUM' ? '🟡' : '🔵';
  console.log(`${emoji} [${rec.priority}] ${rec.title}`);
  console.log(`   ${rec.desc}\n`);
  console.log('   Actions:');
  rec.actions.forEach(action => {
    console.log(`   • ${action}`);
  });
  console.log('');
});

console.log('='.repeat(60));
console.log('📝 Pour une analyse détaillée, installez:');
console.log('   npm install --save-dev @next/bundle-analyzer');
console.log('\nPuis ajoutez dans next.config.js:');
console.log('   const withBundleAnalyzer = require(\'@next/bundle-analyzer\')({');
console.log('     enabled: process.env.ANALYZE === \'true\'');
console.log('   });');
console.log('\nEt lancez:');
console.log('   ANALYZE=true npm run build');
console.log('='.repeat(60) + '\n');
