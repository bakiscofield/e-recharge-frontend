# Quick Start - Soumission App Stores

Guide rapide pour soumettre AliceBot PWA aux App Stores.

---

## ✅ Prérequis Complétés

- ✅ PWA Score Lighthouse: 100/100
- ✅ Service Worker v2.0.0 fonctionnel
- ✅ Manifest.json complet
- ✅ Toutes les icônes générées (16x16 à 512x512)
- ✅ Screenshots PWA (mobile et desktop)
- ✅ Assets stores générés:
  - Feature Graphic Google Play (1024x500)
  - Store Logo Microsoft (300x300)
- ✅ Configuration Next.js optimisée
- ✅ Mode offline fonctionnel

---

## 📱 Option 1: Google Play Store (Android)

### Coût: 25 USD (frais unique)
### Délai: 1-7 jours

### Étape 1: Installer Bubblewrap CLI

```bash
npm install -g @bubblewrap/cli
```

### Étape 2: Créer le projet TWA

```bash
# Créer un dossier pour le projet Android
mkdir android-twa
cd android-twa

# Initialiser avec votre manifest
bubblewrap init --manifest https://front-alice.alicebot.online/manifest.json
```

**Répondre aux questions:**
```
Domain: front-alice.alicebot.online
Name: AliceBot
Short name: AliceBot
Application ID: online.alicebot.front.twa
Display mode: standalone
Orientation: default
Theme color: #1E40AF
Background color: #FFFFFF
Enable Site Settings: Yes
Enable Notifications: Yes
```

### Étape 3: Générer le certificat

```bash
# Obtenir le SHA256 fingerprint
bubblewrap fingerprint
```

Copiez le SHA256 affiché (format: XX:XX:XX:...)

### Étape 4: Mettre à jour assetlinks.json

```bash
cd ..
npm run update:assetlinks
# Collez le SHA256 quand demandé
```

**OU** éditez manuellement:
```bash
nano public/.well-known/assetlinks.json
# Remplacez "REMPLACER_PAR_VOTRE_SHA256_FINGERPRINT" par votre SHA256
```

### Étape 5: Déployer assetlinks.json

Le fichier `public/.well-known/assetlinks.json` doit être accessible à:
```
https://front-alice.alicebot.online/.well-known/assetlinks.json
```

Vérifiez avec:
```bash
curl https://front-alice.alicebot.online/.well-known/assetlinks.json
```

### Étape 6: Build l'APK

```bash
cd android-twa
bubblewrap build
```

Le fichier sera dans:
```
android-twa/app/build/outputs/bundle/release/app-release.aab
```

### Étape 7: Créer un compte Google Play

1. Aller sur: https://play.google.com/console/
2. Créer un compte développeur (25 USD)
3. Créer une nouvelle application

### Étape 8: Remplir les informations

**Informations de base:**
- Nom: AliceBot - Gestion Bookmaker
- Description courte: Gérez vos dépôts et retraits de bookmaker facilement
- Description complète: (voir APP_STORES_GUIDE.md)
- Catégorie: Finance
- Email: support@alicebot.online

**Assets requis:**
- ✅ Icon 512x512: `public/icons/icon-512x512.png`
- ✅ Feature Graphic: `public/store-assets/google-play/feature-graphic.png`
- ✅ Screenshots: `public/screenshots/mobile-1.png` (ajouter 1-2 de plus)

### Étape 9: Upload et Soumettre

1. Upload l'AAB dans "Production" ou "Internal Testing"
2. Remplir le questionnaire de contenu
3. Ajouter Privacy Policy: https://front-alice.alicebot.online/privacy
4. Soumettre pour révision

---

## 🪟 Option 2: Microsoft Store (Windows)

### Coût: 99 USD (frais unique)
### Délai: 3-5 jours

### Étape 1: Analyser avec PWABuilder

1. Aller sur: https://www.pwabuilder.com/
2. Entrer: `https://front-alice.alicebot.online`
3. Cliquer sur "Start"

### Étape 2: Générer le Package Windows

1. Cliquer sur "Package for Stores"
2. Sélectionner "Windows"
3. Configurer:
   - App ID: `com.alicebot.alicebot`
   - Publisher: AliceBot
   - Version: 1.0.0.0
   - Architecture: x64, ARM64
4. Télécharger le `.msixbundle`

### Étape 3: Créer un compte Microsoft

1. Aller sur: https://partner.microsoft.com/
2. Créer un compte Partner Center (99 USD)
3. Créer une nouvelle application

### Étape 4: Remplir les informations

**Informations de base:**
- Nom: AliceBot - Gestion Bookmaker
- Description: (voir APP_STORES_GUIDE.md)
- Catégorie: Finance & Business
- Age Rating: 12+

**Assets requis:**
- ✅ Store Logo: `public/store-assets/microsoft/store-logo.png`
- ✅ Screenshots: `public/screenshots/desktop-1.png` (ajouter 2-3 de plus)

### Étape 5: Upload et Soumettre

1. Upload le `.msixbundle`
2. Ajouter screenshots et logo
3. Privacy Policy: https://front-alice.alicebot.online/privacy
4. Support: https://front-alice.alicebot.online/support
5. Soumettre pour certification

---

## 🎨 Assets Disponibles

### Icons PWA (Déjà Générés)
```
public/icons/
├── icon-192x192.png
├── icon-512x512.png
├── apple-touch-icon.png (180x180)
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon.ico
└── safari-pinned-tab.svg
```

### Screenshots PWA (Templates Disponibles)
```
public/screenshots/
├── mobile-1.png (540x720) - Créer avec le template
├── desktop-1.png (1280x720) - Créer avec le template
├── template-mobile.html - Aide visuelle
├── template-desktop.html - Aide visuelle
└── INSTRUCTIONS.md - Instructions complètes
```

### Assets App Stores (Déjà Générés)
```
public/store-assets/
├── google-play/
│   └── feature-graphic.png (1024x500) ✅
└── microsoft/
    └── store-logo.png (300x300) ✅
```

---

## 📋 Checklist Avant Soumission

### Google Play Store
- [ ] Compte Google Play Developer créé (25 USD)
- [ ] Bubblewrap installé: `npm install -g @bubblewrap/cli`
- [ ] Projet TWA initialisé
- [ ] assetlinks.json généré avec SHA256 correct
- [ ] assetlinks.json accessible via HTTPS
- [ ] APK/AAB buildé sans erreurs
- [ ] 2-3 screenshots mobile ajoutés
- [ ] Privacy Policy page créée
- [ ] Informations store rédigées

### Microsoft Store
- [ ] Compte Partner Center créé (99 USD)
- [ ] PWABuilder analysé avec succès
- [ ] Package .msixbundle téléchargé
- [ ] 3-4 screenshots desktop ajoutés
- [ ] Privacy Policy page créée
- [ ] Support page créée
- [ ] Informations store rédigées

---

## 🚀 Scripts NPM Disponibles

```bash
# Vérifier la configuration PWA
npm run check-pwa

# Analyser le bundle
npm run analyze-bundle

# Générer les icônes PWA
npm run generate:icons

# Générer les screenshots PWA (automatique)
npm run generate:screenshots

# Générer tous les assets stores
npm run generate:store-assets

# Mettre à jour assetlinks.json
npm run update:assetlinks
```

---

## ⚠️ Pages Requises à Créer

Avant de soumettre, créez ces pages:

### 1. Privacy Policy (`/privacy`)
Créer: `src/app/privacy/page.tsx`

Contenu minimal:
- Quelles données sont collectées
- Comment elles sont utilisées
- Comment elles sont stockées
- Contact pour questions

### 2. Terms of Service (`/terms`)
Créer: `src/app/terms/page.tsx`

Contenu minimal:
- Conditions d'utilisation
- Responsabilités
- Limitations

### 3. Support (`/support`)
Créer: `src/app/support/page.tsx`

Contenu minimal:
- Email de support: support@alicebot.online
- FAQ
- Comment signaler un bug

---

## 📊 Comparaison des Stores

| Critère | Google Play | Microsoft Store |
|---------|-------------|-----------------|
| **Coût initial** | 25 USD | 99 USD |
| **Coût annuel** | 0 USD | 0 USD |
| **Délai** | 1-7 jours | 3-5 jours |
| **Plateformes** | Android | Windows 10/11 |
| **Complexité** | Moyenne | Facile |
| **Outils** | Bubblewrap | PWABuilder |

**Recommandation:** Commencez par Microsoft Store (plus facile), puis Google Play.

---

## 🔗 Liens Utiles

### Outils
- [PWABuilder](https://www.pwabuilder.com/) - Microsoft Store
- [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) - Google Play
- [Lighthouse](https://pagespeed.web.dev/) - Audit PWA

### Consoles
- [Google Play Console](https://play.google.com/console/)
- [Microsoft Partner Center](https://partner.microsoft.com/)

### Documentation Complète
- Voir `APP_STORES_GUIDE.md` pour le guide détaillé

---

## 💡 Conseils

1. **Testez d'abord localement**
   - Google Play: Testez l'APK sur un appareil Android
   - Microsoft: Testez le package avec App Installer

2. **Préparez vos assets à l'avance**
   - Tous les scripts de génération sont prêts
   - Vérifiez la qualité des images avant upload

3. **Privacy Policy est OBLIGATOIRE**
   - Google Play et Microsoft Store le demandent
   - Créez la page avant de soumettre

4. **Version de test d'abord**
   - Google Play: Utilisez "Internal Testing" d'abord
   - Microsoft: Soumettez en "Draft" pour vérifier

5. **Suivez les guidelines**
   - Google: [Play Console Help](https://support.google.com/googleplay/android-developer/)
   - Microsoft: [Windows App Certification](https://learn.microsoft.com/en-us/windows/apps/develop/)

---

## ❓ Questions Fréquentes

**Q: Dois-je soumettre aux deux stores?**
A: Non, c'est optionnel. Soumettez d'abord à un store pour tester le processus.

**Q: Combien de temps avant l'approbation?**
A: Google Play: 1-7 jours, Microsoft: 3-5 jours. Peut être plus long si des corrections sont demandées.

**Q: Puis-je mettre à jour l'app après soumission?**
A: Oui, vous pouvez upload de nouvelles versions à tout moment.

**Q: Le certificat SHA256 peut-il changer?**
A: Oui, si vous régénérez le projet TWA. Gardez vos clés de signature en sécurité!

**Q: Que faire si ma soumission est rejetée?**
A: Lisez attentivement les raisons du rejet, corrigez, et resoumettez.

---

## 🎯 Prochaines Étapes

1. Choisissez un store (recommandé: Microsoft d'abord)
2. Créez les pages Privacy Policy, Terms, Support
3. Suivez les étapes de ce guide
4. Soumettez et attendez l'approbation
5. Une fois approuvé, faites la promotion de votre app!

---

**Besoin d'aide?** Consultez le guide détaillé dans `APP_STORES_GUIDE.md`
