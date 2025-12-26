#!/usr/bin/env node

/**
 * Script pour mettre à jour assetlinks.json avec le SHA256 fingerprint
 * Obtenu via: bubblewrap fingerprint
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ASSETLINKS_PATH = path.join(__dirname, '..', 'public', '.well-known', 'assetlinks.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Mise à jour de assetlinks.json\n');
console.log('='.repeat(60));
console.log('\nPour obtenir votre SHA256 fingerprint:\n');
console.log('1. Initialisez le projet TWA:');
console.log('   npm install -g @bubblewrap/cli');
console.log('   bubblewrap init --manifest https://front-alice.alicebot.online/manifest.json\n');
console.log('2. Générez le fingerprint:');
console.log('   cd android-twa');
console.log('   bubblewrap fingerprint\n');
console.log('3. Copiez le SHA256 affiché (format: XX:XX:XX:...)\n');
console.log('='.repeat(60) + '\n');

rl.question('Entrez votre SHA256 fingerprint (ou ENTER pour annuler): ', (fingerprint) => {
  if (!fingerprint || fingerprint.trim() === '') {
    console.log('\n⚠️  Opération annulée\n');
    console.log('Le fichier assetlinks.json contient un placeholder.');
    console.log('Vous devrez le mettre à jour manuellement plus tard.\n');
    rl.close();
    return;
  }

  // Nettoyer le fingerprint (enlever les espaces)
  const cleanFingerprint = fingerprint.trim();

  // Créer le contenu assetlinks.json
  const assetlinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "online.alicebot.front.twa",
        sha256_cert_fingerprints: [cleanFingerprint]
      }
    }
  ];

  try {
    // Créer le dossier si nécessaire
    const dir = path.dirname(ASSETLINKS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Écrire le fichier
    fs.writeFileSync(
      ASSETLINKS_PATH,
      JSON.stringify(assetlinks, null, 2),
      'utf-8'
    );

    console.log('\n✅ assetlinks.json mis à jour avec succès!\n');
    console.log('📍 Emplacement:', ASSETLINKS_PATH);
    console.log('🔐 SHA256:', cleanFingerprint);
    console.log('\n📝 Prochaines étapes:\n');
    console.log('1. Déployer le fichier sur votre serveur');
    console.log('   Il doit être accessible à:');
    console.log('   https://front-alice.alicebot.online/.well-known/assetlinks.json\n');
    console.log('2. Vérifier avec Google Digital Asset Links:');
    console.log('   https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://front-alice.alicebot.online\n');
    console.log('3. Tester que le lien fonctionne:');
    console.log('   curl https://front-alice.alicebot.online/.well-known/assetlinks.json\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de l\'écriture du fichier:', error.message);
  }

  rl.close();
});
