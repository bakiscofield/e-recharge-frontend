#!/usr/bin/env node

/**
 * Script de test du Service Worker
 * Vérifie que le SW est accessible et correctement configuré
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🧪 Test du Service Worker...\n');
console.log('='.repeat(60));

// Vérifier que sw.js existe
const swPath = path.join(__dirname, '..', 'public', 'sw.js');
if (!fs.existsSync(swPath)) {
  console.log('\n❌ ERREUR: sw.js non trouvé!');
  console.log('   Chemin attendu:', swPath);
  process.exit(1);
}

console.log('\n✅ sw.js trouvé:', swPath);

// Lire le contenu de sw.js
const swContent = fs.readFileSync(swPath, 'utf-8');

// Vérifier le contenu du SW
console.log('\n📋 Vérification du contenu du Service Worker:\n');

const checks = [
  { name: 'Version définie', pattern: /const CACHE_VERSION\s*=\s*['"]v\d+\.\d+\.\d+['"]/, critical: true },
  { name: 'Cache names définis', pattern: /const CACHE_NAMES\s*=/, critical: true },
  { name: 'Install event', pattern: /self\.addEventListener\(['"]install['"]/, critical: true },
  { name: 'Activate event', pattern: /self\.addEventListener\(['"]activate['"]/, critical: true },
  { name: 'Fetch event', pattern: /self\.addEventListener\(['"]fetch['"]/, critical: true },
  { name: 'Cache First strategy', pattern: /async function cacheFirst/, critical: false },
  { name: 'Network First strategy', pattern: /async function networkFirst/, critical: false },
  { name: 'Stale While Revalidate', pattern: /async function staleWhileRevalidate/, critical: false },
  { name: 'Network Only strategy', pattern: /async function networkOnly/, critical: false },
  { name: 'Background Sync', pattern: /self\.addEventListener\(['"]sync['"]/, critical: false },
  { name: 'Push notification', pattern: /self\.addEventListener\(['"]push['"]/, critical: false },
  { name: 'Message handling', pattern: /self\.addEventListener\(['"]message['"]/, critical: false },
];

let successCount = 0;
let warningCount = 0;
let errorCount = 0;

checks.forEach(check => {
  if (check.pattern.test(swContent)) {
    console.log(`✅ ${check.name}`);
    successCount++;
  } else {
    if (check.critical) {
      console.log(`❌ ${check.name} - CRITIQUE`);
      errorCount++;
    } else {
      console.log(`⚠️  ${check.name} - Optionnel`);
      warningCount++;
    }
  }
});

// Extraire la version
const versionMatch = swContent.match(/const CACHE_VERSION\s*=\s*['"]([^'"]+)['"]/);
if (versionMatch) {
  console.log(`\n📌 Version du Service Worker: ${versionMatch[1]}`);
}

// Vérifier la taille du fichier
const stats = fs.statSync(swPath);
const sizeKB = (stats.size / 1024).toFixed(2);
console.log(`📦 Taille du fichier: ${sizeKB} KB`);

console.log('\n' + '='.repeat(60));
console.log('\n📊 RÉSUMÉ DU TEST\n');
console.log(`✅ Succès:         ${successCount}/${checks.length}`);
console.log(`⚠️  Avertissements: ${warningCount}`);
console.log(`❌ Erreurs:        ${errorCount}`);

const percentage = ((successCount / checks.length) * 100).toFixed(1);
console.log(`\n📈 Score: ${percentage}%`);

console.log('\n' + '='.repeat(60));

// Vérifier manifest.json
console.log('\n📱 Vérification du manifest.json:\n');
const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  console.log('✅ manifest.json trouvé');

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    console.log(`   - Name: ${manifest.name}`);
    console.log(`   - Short name: ${manifest.short_name}`);
    console.log(`   - Start URL: ${manifest.start_url}`);
    console.log(`   - Display: ${manifest.display}`);
    console.log(`   - Icons: ${manifest.icons?.length || 0}`);
    console.log(`   - Shortcuts: ${manifest.shortcuts?.length || 0}`);
  } catch (error) {
    console.log('❌ Erreur de parsing manifest.json:', error.message);
    errorCount++;
  }
} else {
  console.log('❌ manifest.json non trouvé!');
  errorCount++;
}

console.log('\n' + '='.repeat(60));

// Vérifier offline.html
console.log('\n📄 Vérification de offline.html:\n');
const offlinePath = path.join(__dirname, '..', 'public', 'offline.html');
if (fs.existsSync(offlinePath)) {
  console.log('✅ offline.html trouvé');
  const offlineStats = fs.statSync(offlinePath);
  console.log(`   - Taille: ${(offlineStats.size / 1024).toFixed(2)} KB`);
} else {
  console.log('❌ offline.html non trouvé!');
  errorCount++;
}

console.log('\n' + '='.repeat(60));

// Recommandations
console.log('\n💡 RECOMMANDATIONS:\n');

if (errorCount === 0) {
  console.log('🎉 Tous les tests critiques sont passés!\n');
  console.log('Prochaines étapes:');
  console.log('1. Lancer le serveur de développement: npm run dev');
  console.log('2. Ouvrir http://localhost:3000');
  console.log('3. Ouvrir DevTools (F12) > Console');
  console.log('4. Chercher les logs: [SW] Service Worker registered');
  console.log('5. Ouvrir DevTools > Application > Service Workers');
  console.log('6. Vérifier que le SW est "activated and running"\n');
} else {
  console.log(`❌ ${errorCount} erreur(s) critique(s) détectée(s)\n`);
  console.log('Corrigez les erreurs avant de continuer.\n');
}

if (warningCount > 0) {
  console.log(`⚠️  ${warningCount} fonctionnalité(s) optionnelle(s) manquante(s)`);
  console.log('Ces fonctionnalités améliorent l\'expérience PWA mais ne sont pas critiques.\n');
}

console.log('='.repeat(60) + '\n');

// Code de sortie
process.exit(errorCount > 0 ? 1 : 0);
