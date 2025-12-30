# 📱 Guide: Notifications sur APK Android

## ✅ Ce qui est déjà configuré

### 1. Backend
- ✅ Notifications créées en base de données
- ✅ Envoi automatique via FCM
- ✅ Endpoint `/notifications/subscribe-fcm` prêt
- ✅ Gestion des tokens FCM par utilisateur

### 2. Frontend
- ✅ Service Worker avec Firebase intégré (`/public/sw.js`)
- ✅ Hook FCM actif sur production/mobile (`useFcmNotifications.tsx`)
- ✅ Logo AliceBot dans les notifications
- ✅ Manifest.json configuré pour APK
- ✅ Icons générés pour toutes tailles

### 3. Firebase
- ✅ Projet Firebase configuré (`e-recharge-b75ee`)
- ✅ Firebase Cloud Messaging activé
- ✅ Configuration compatible web + mobile

### 4. APK
- ✅ `assetlinks.json` configuré
- ✅ Package name: `online.alicebot.front_alice.twa`
- ✅ SHA256 fingerprint configuré

## 📋 Étapes pour tester les notifications sur mobile

### Étape 1: Déployer en production

Les notifications FCM nécessitent HTTPS. Déployez votre application sur:
- Vercel
- Netlify
- Votre propre serveur avec SSL

**Important**: Le backend doit aussi être accessible en HTTPS.

### Étape 2: Générer l'APK

#### Option A: PWABuilder (Recommandé)

1. Allez sur https://www.pwabuilder.com/
2. Entrez l'URL de votre PWA en production
3. Cliquez sur "Build"
4. Sélectionnez "Android" et téléchargez le package

#### Option B: Bubblewrap (Avancé)

```bash
# Installer Bubblewrap
npm install -g @bubblewrap/cli

# Initialiser le projet
bubblewrap init --manifest https://votre-domaine.com/manifest.json

# Générer l'APK
bubblewrap build

# L'APK sera dans: ./app-release-signed.apk
```

### Étape 3: Ajouter google-services.json (IMPORTANT!)

Pour que FCM fonctionne dans l'APK, vous devez:

1. **Aller sur Firebase Console**: https://console.firebase.google.com/
2. **Sélectionner votre projet**: `e-recharge-b75ee`
3. **Ajouter une application Android**:
   - Nom du package: `online.alicebot.front_alice.twa`
   - Télécharger `google-services.json`

4. **Intégrer google-services.json dans l'APK**:

   Si vous utilisez **PWABuilder**:
   - Extrayez le package téléchargé
   - Placez `google-services.json` dans `app/`
   - Rebuild avec Android Studio

   Si vous utilisez **Bubblewrap**:
   - Placez `google-services.json` dans le dossier racine
   - Run: `bubblewrap build`

### Étape 4: Signer l'APK

L'APK doit être signé avec le même certificat que celui dans `assetlinks.json`.

**Votre certificat actuel**:
```
SHA256: 9C:B3:84:A8:5B:56:25:40:0E:2C:C0:64:8E:69:4E:2E:A2:78:B5:94:ED:0A:16:99:56:48:12:0D:9D:E5:FE:D2
```

Pour signer l'APK:
```bash
# Générer un keystore (si vous n'en avez pas)
keytool -genkey -v -keystore release.keystore -alias alicebot -keyalg RSA -keysize 2048 -validity 10000

# Signer l'APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore release.keystore app-release-unsigned.apk alicebot

# Aligner l'APK
zipalign -v 4 app-release-unsigned.apk app-release-signed.apk

# Vérifier la signature
keytool -list -printcert -jarfile app-release-signed.apk
```

**IMPORTANT**: Le SHA256 de votre nouveau keystore doit correspondre à celui dans `assetlinks.json`. Si ce n'est pas le cas, mettez à jour `assetlinks.json` avec le nouveau SHA256.

### Étape 5: Installer et tester sur Android

```bash
# Installer via ADB
adb install app-release-signed.apk

# Ou transférez l'APK sur votre téléphone et installez manuellement
```

### Étape 6: Vérifier les notifications

1. **Ouvrez l'application** sur votre téléphone Android
2. **Connectez-vous** avec votre compte
3. **Autorisez les notifications** quand le modal apparaît
4. **Vérifiez les logs**:
   ```bash
   adb logcat | grep -i "fcm\|notification\|firebase"
   ```
5. **Envoyez une notification de test** depuis le super admin
6. **La notification devrait apparaître** même si l'app est fermée

## 🔍 Debugging sur mobile

### Activer Chrome DevTools pour Android

1. Activez le mode développeur sur Android
2. Connectez votre téléphone via USB
3. Ouvrez Chrome sur PC: `chrome://inspect`
4. Sélectionnez votre appareil
5. Inspectez l'application

### Vérifier le Service Worker

Dans la console Chrome DevTools:
```javascript
// Vérifier si le SW est actif
navigator.serviceWorker.controller

// Vérifier les registrations
navigator.serviceWorker.getRegistrations()

// Vérifier FCM token
// (Sera loggé automatiquement dans la console)
```

### Logs Backend

Sur le serveur, vérifiez:
```bash
# Tokens FCM enregistrés
tail -f logs/backend.log | grep "FCM token"

# Envois de notifications
tail -f logs/backend.log | grep "notification"
```

## ❗ Points importants

### 1. HTTPS obligatoire
FCM nécessite HTTPS. Sur localhost, FCM est désactivé automatiquement.

### 2. Token FCM unique par appareil
Chaque installation d'APK génère un token FCM unique. Le backend peut gérer plusieurs tokens par utilisateur.

### 3. Permissions Android
L'APK demandera automatiquement la permission de notifications au premier lancement.

### 4. Background notifications
Les notifications fonctionneront même si:
- L'app est fermée
- L'app est en arrière-plan
- Le téléphone est verrouillé

### 5. Icône des notifications
L'icône AliceBot (`/icons/icon-192x192.png`) sera affichée dans les notifications.

## 🧪 Tester sans générer d'APK

Vous pouvez tester sur mobile avant de générer l'APK:

1. Déployez en production (HTTPS)
2. Ouvrez sur mobile avec Chrome
3. Installez la PWA depuis Chrome (Add to Home Screen)
4. Les notifications fonctionneront comme dans l'APK

## 📊 Différences PWA vs APK

| Fonctionnalité | PWA (navigateur) | APK |
|----------------|------------------|-----|
| Notifications FCM | ✅ | ✅ |
| Fonctionne offline | ✅ | ✅ |
| Icône sur l'écran d'accueil | ✅ | ✅ |
| Installation via Play Store | ❌ | ✅ |
| Mises à jour automatiques | ✅ | Via Play Store |
| Taille | ~2-5 MB | ~10-15 MB |

## 🎯 Checklist finale avant déploiement mobile

- [ ] Application déployée en production (HTTPS)
- [ ] Backend accessible en HTTPS
- [ ] `google-services.json` ajouté au projet Android
- [ ] APK signé avec le bon certificat
- [ ] SHA256 du certificat correspond à `assetlinks.json`
- [ ] Test sur un appareil physique Android
- [ ] Notifications reçues en background
- [ ] Notifications reçues en foreground
- [ ] Logo AliceBot affiché correctement
- [ ] Modal de permission apparaît au premier lancement

## 📞 Aide supplémentaire

Si les notifications ne fonctionnent pas:

1. Vérifiez les logs Chrome DevTools (`chrome://inspect`)
2. Vérifiez les logs backend (`tail -f logs/backend.log`)
3. Vérifiez Firebase Console > Cloud Messaging
4. Utilisez `/reset-sw.html` pour réinitialiser le Service Worker
5. Vérifiez que le token FCM est bien enregistré en base de données

## 🔗 Ressources

- [PWABuilder](https://www.pwabuilder.com/)
- [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Digital Asset Links](https://developers.google.com/digital-asset-links)
