# Guide de Soumission aux App Stores - AliceBot PWA

## 📱 Vue d'ensemble

Ce guide vous aide à publier votre PWA AliceBot sur:
- **Microsoft Store** (Windows 10/11)
- **Google Play Store** (Android via TWA)

---

## 🪟 Microsoft Store - Soumission PWA

### Prérequis

- Compte Microsoft Partner Center (99 USD unique)
- PWA installable avec score Lighthouse PWA 100/100 ✅
- URL de production: https://front-alice.alicebot.online

### Étape 1: Utiliser PWABuilder

**PWABuilder** convertit automatiquement votre PWA en package Windows.

```bash
# Aller sur PWABuilder
https://www.pwabuilder.com/

# Entrer l'URL de votre PWA
https://front-alice.alicebot.online

# Cliquer sur "Start" pour analyser
```

### Étape 2: Générer le Package Windows

1. Après l'analyse, cliquer sur "Package for Stores"
2. Sélectionner "Windows"
3. Configurer les options:
   - **App ID**: `com.alicebot.alicebot`
   - **Publisher Display Name**: AliceBot
   - **Package Version**: 1.0.0.0
   - **Package Architecture**: x64, ARM64

4. Télécharger le package `.msixbundle`

### Étape 3: Assets Requis

Microsoft Store nécessite plusieurs captures d'écran:

#### Screenshots Desktop (déjà créés)
- ✅ `public/screenshots/desktop-1.png` (1280x720)
- Ajouter 3-4 captures supplémentaires de différentes pages

#### Store Listing Images
```
Créer dans /public/store-assets/microsoft/

1. Store Logo (300x300)
   - Logo carré de l'app

2. Promotional Images (optionnel)
   - 2400×1200 (Hero image)
   - 1920×1080 (Feature image)
```

### Étape 4: Informations Store

Préparer ces informations pour la soumission:

```yaml
App Name: AliceBot - Gestion Bookmaker
Short Description: >
  Gérez vos dépôts et retraits de bookmaker en toute simplicité

Description: >
  AliceBot est votre assistant personnel pour la gestion de comptes bookmaker.

  Fonctionnalités:
  • Suivi des dépôts et retraits
  • Historique complet des transactions
  • Support multi-bookmakers
  • Mode hors ligne
  • Synchronisation automatique
  • Interface intuitive et rapide

Category: Finance & Business
Age Rating: 12+
Privacy Policy URL: https://front-alice.alicebot.online/privacy
Support URL: https://front-alice.alicebot.online/support
```

### Étape 5: Soumission

1. Créer un compte sur [Partner Center](https://partner.microsoft.com/)
2. Créer une nouvelle application
3. Upload le `.msixbundle`
4. Remplir les informations store
5. Upload les screenshots et images
6. Soumettre pour certification (3-5 jours)

---

## 🤖 Google Play Store - TWA (Trusted Web Activities)

### Prérequis

- Compte Google Play Developer (25 USD unique)
- Android Studio installé
- Java JDK 11+
- PWA avec HTTPS ✅

### Étape 1: Installer Bubblewrap CLI

Bubblewrap convertit votre PWA en APK Android.

```bash
# Installer Node.js (si pas déjà fait)
node --version  # Doit être 14+

# Installer Bubblewrap
npm install -g @bubblewrap/cli

# Vérifier l'installation
bubblewrap --version
```

### Étape 2: Initialiser le Projet TWA

```bash
# Créer un dossier pour le projet Android
mkdir -p android-twa
cd android-twa

# Initialiser Bubblewrap
bubblewrap init --manifest https://front-alice.alicebot.online/manifest.json
```

**Répondre aux questions:**
```
Domain being opened in the TWA: front-alice.alicebot.online
Name of the application: AliceBot
Short name of the application: AliceBot
Application ID: online.alicebot.front.twa
Display mode: standalone
Orientation: default
Theme color: #1E40AF (bleu de l'app)
Background color: #FFFFFF
Enable Site Settings Shortcut: Yes
Enable Notifications: Yes
Signing key information: (généré automatiquement)
```

### Étape 3: Personnaliser les Icons

Bubblewrap utilise les icons de votre manifest, mais vous pouvez les personnaliser:

```bash
# Remplacer les icons dans le projet Android
# Les icons sont dans: android-twa/app/src/main/res/

# Utiliser vos icons existants
cp ../../frontend/public/icons/icon-192x192.png \
   android-twa/app/src/main/res/drawable-mdpi/ic_launcher.png

cp ../../frontend/public/icons/icon-512x512.png \
   android-twa/app/src/main/res/drawable-xxxhdpi/ic_launcher.png
```

### Étape 4: Configurer Digital Asset Links

Pour que Google vérifie que vous possédez le domaine:

```bash
# Générer le fichier assetlinks.json
bubblewrap fingerprint

# Cela affiche le SHA256 de votre certificat
# Exemple: 12:34:56:78:90:AB:CD:EF...
```

Créer le fichier sur votre serveur:
```bash
# Créer dans frontend/public/.well-known/assetlinks.json
```

### Étape 5: Build l'APK

```bash
# Build l'APK de production
cd android-twa
bubblewrap build

# Le fichier APK sera dans:
# android-twa/app/build/outputs/bundle/release/app-release.aab
```

### Étape 6: Assets Google Play Store

Créer les assets requis par Google Play:

```bash
mkdir -p ../public/store-assets/google-play
```

**Images requises:**

1. **Icon (512x512)** - ✅ Déjà disponible
   - `public/icons/icon-512x512.png`

2. **Feature Graphic (1024x500)** - À créer
   - Image promotionnelle en haut de la page store
   - Doit contenir le logo et le nom de l'app

3. **Screenshots (minimum 2, maximum 8)**
   - Téléphone: 320-3840px (largeur ou hauteur)
   - Utiliser: `public/screenshots/mobile-1.png` (540x720) ✅
   - Créer 2-3 screenshots supplémentaires

4. **Optionnel: Vidéo YouTube**
   - Démo de l'application

### Étape 7: Informations Store

Préparer pour la console Google Play:

```yaml
App Name: AliceBot - Gestion Bookmaker

Short Description (80 caractères max): >
  Gérez vos dépôts et retraits de bookmaker facilement

Full Description (4000 caractères max): >
  AliceBot est votre assistant personnel pour gérer vos comptes bookmaker.

  ✨ FONCTIONNALITÉS PRINCIPALES
  • Suivi en temps réel de vos dépôts et retraits
  • Historique détaillé de toutes vos transactions
  • Support de multiples bookmakers
  • Notifications push pour les mises à jour importantes
  • Mode hors ligne - Fonctionne sans connexion Internet
  • Synchronisation automatique cloud
  • Interface moderne et intuitive
  • Rapports et statistiques détaillés

  📊 GESTION SIMPLIFIÉE
  Suivez facilement vos gains et pertes, gérez plusieurs comptes,
  et gardez un historique complet de toutes vos opérations.

  🔒 SÉCURITÉ
  Vos données sont cryptées et stockées de manière sécurisée.

  💡 INSTALLATION PWA
  Cette application utilise la technologie Progressive Web App
  pour offrir une expérience native sur Android.

Category: Finance
Content Rating: Everyone
Contact Email: support@alicebot.online
Privacy Policy: https://front-alice.alicebot.online/privacy
```

### Étape 8: Tester l'APK

```bash
# Installer l'APK sur un appareil Android pour test
adb install app-release.aab

# Ou utiliser l'émulateur Android Studio
```

### Étape 9: Soumission Google Play

1. Aller sur [Google Play Console](https://play.google.com/console/)
2. Créer une nouvelle application
3. Remplir les informations store
4. Upload l'AAB dans "Production" ou "Internal Testing"
5. Uploader screenshots et feature graphic
6. Remplir le questionnaire de contenu
7. Soumettre pour révision (1-7 jours)

---

## 📋 Checklist Complète de Soumission

### Préparation Générale
- [ ] PWA score Lighthouse 100/100 ✅
- [ ] HTTPS activé sur production ✅
- [ ] Manifest.json complet ✅
- [ ] Service Worker fonctionnel ✅
- [ ] Icons toutes tailles générés ✅
- [ ] Mode offline testé ✅

### Microsoft Store
- [ ] Compte Partner Center créé
- [ ] Package .msixbundle généré via PWABuilder
- [ ] 3-4 screenshots desktop (1280x720)
- [ ] Store logo (300x300)
- [ ] Informations store rédigées
- [ ] Privacy policy URL configurée
- [ ] Application soumise

### Google Play Store
- [ ] Compte Google Play Developer créé
- [ ] Bubblewrap CLI installé
- [ ] Projet TWA initialisé
- [ ] APK/AAB buildé
- [ ] assetlinks.json configuré et déployé
- [ ] Feature graphic créé (1024x500)
- [ ] 2-3 screenshots mobile
- [ ] Informations store rédigées
- [ ] Content rating complété
- [ ] Application soumise

---

## 🎨 Scripts pour Générer les Assets Manquants

### Script 1: Feature Graphic Google Play (1024x500)

Créer `/frontend/scripts/generate-feature-graphic.js`:

```javascript
const sharp = require('sharp');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'store-assets', 'google-play', 'feature-graphic.png');

async function generateFeatureGraphic() {
  // Créer un canvas 1024x500 avec fond bleu
  const background = await sharp({
    create: {
      width: 1024,
      height: 500,
      channels: 4,
      background: { r: 30, g: 64, b: 175, alpha: 1 } // #1E40AF
    }
  }).png();

  // Ajouter le logo centré
  const logo = path.join(__dirname, '..', 'public', 'icons', 'icon-512x512.png');

  await background
    .composite([
      {
        input: logo,
        top: Math.floor((500 - 256) / 2),
        left: Math.floor((1024 - 256) / 2)
      }
    ])
    .toFile(OUTPUT_PATH);

  console.log('✅ Feature graphic créé:', OUTPUT_PATH);
}

generateFeatureGraphic().catch(console.error);
```

### Script 2: Store Logo Microsoft (300x300)

Créer `/frontend/scripts/generate-store-logo.js`:

```javascript
const sharp = require('sharp');
const path = require('path');

const SOURCE = path.join(__dirname, '..', 'public', 'icons', 'icon-512x512.png');
const OUTPUT = path.join(__dirname, '..', 'public', 'store-assets', 'microsoft', 'store-logo.png');

async function generateStoreLogo() {
  await sharp(SOURCE)
    .resize(300, 300, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toFile(OUTPUT);

  console.log('✅ Store logo créé:', OUTPUT);
}

generateStoreLogo().catch(console.error);
```

---

## 🚀 Commandes Rapides

### Générer tous les assets stores

```bash
# Créer les dossiers
mkdir -p public/store-assets/google-play
mkdir -p public/store-assets/microsoft

# Générer feature graphic
node scripts/generate-feature-graphic.js

# Générer store logo
node scripts/generate-store-logo.js
```

### Build Google Play APK

```bash
cd android-twa
bubblewrap build
cd ..
```

### Télécharger Microsoft Package

```bash
# Aller sur PWABuilder
open https://www.pwabuilder.com/

# Analyser et télécharger
# Entrer: https://front-alice.alicebot.online
```

---

## 📊 Coûts et Délais

| Store | Coût Initial | Coût Annuel | Délai Approbation |
|-------|--------------|-------------|-------------------|
| Microsoft Store | 99 USD | 0 USD | 3-5 jours |
| Google Play Store | 25 USD | 0 USD | 1-7 jours |

---

## 🔗 Ressources Utiles

### Microsoft Store
- [PWABuilder](https://www.pwabuilder.com/)
- [Partner Center](https://partner.microsoft.com/)
- [Documentation PWA Windows](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/)

### Google Play Store
- [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap)
- [Google Play Console](https://play.google.com/console/)
- [TWA Documentation](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started)

---

## ⚠️ Notes Importantes

### Vérification de Propriété du Domaine

Pour Google Play TWA, vous DEVEZ prouver que vous possédez le domaine.

1. Créer `assetlinks.json` (voir ci-dessous)
2. Le placer dans `.well-known/` sur votre serveur
3. Accessible via: `https://front-alice.alicebot.online/.well-known/assetlinks.json`
4. Vérifier avec: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://front-alice.alicebot.online

### Mises à Jour

- **Microsoft Store**: Uploader une nouvelle version via Partner Center
- **Google Play**: Build une nouvelle version avec `bubblewrap build`, puis upload

### Support et Contact

Les stores peuvent demander:
- Privacy Policy (page /privacy)
- Terms of Service (page /terms)
- Support Email (support@alicebot.online)
- Site web officiel

Assurez-vous que ces pages existent avant de soumettre.

---

## 📝 Prochaines Étapes

1. Créer les scripts de génération d'assets
2. Générer le fichier `assetlinks.json`
3. Créer les pages Privacy Policy et Terms of Service
4. Générer tous les assets manquants
5. Tester le package TWA localement
6. Soumettre aux stores

Voulez-vous que je crée les scripts et fichiers nécessaires maintenant?
