# 🔥 Configuration Firebase pour APK Android

## Informations actuelles de votre projet

### Projet Firebase
- **Nom du projet**: `e-recharge-b75ee`
- **Project ID**: `e-recharge-b75ee`
- **URL Console**: https://console.firebase.google.com/project/e-recharge-b75ee

### Application Web (Actuelle)
- **App ID**: `1:700766162336:web:85a6daacb5ae1e8b5128c5`
- **Messaging Sender ID**: `700766162336`
- **API Key**: `AIzaSyC6_uWq5NwwuvRQGbW7dx7RAtM3L2VphLs`

## 📱 Ajouter une application Android

### Étape 1: Accéder à Firebase Console

1. Allez sur: https://console.firebase.google.com/project/e-recharge-b75ee
2. Cliquez sur l'icône ⚙️ (Settings) à côté de "Project Overview"
3. Sélectionnez "Project settings"
4. Allez dans l'onglet "General"
5. Descendez jusqu'à "Your apps"
6. Cliquez sur "Add app" et sélectionnez "Android" (icône Android)

### Étape 2: Enregistrer l'application Android

Remplissez le formulaire:

```
Android package name: online.alicebot.front_alice.twa
App nickname (optionnel): AliceBot APK
Debug signing certificate SHA-1 (optionnel): Laisser vide pour l'instant
```

Cliquez sur "Register app"

### Étape 3: Télécharger google-services.json

1. Après l'enregistrement, cliquez sur "Download google-services.json"
2. Sauvegardez le fichier dans un endroit sûr
3. **Important**: Ce fichier contient des informations sensibles, ne le commitez PAS dans git

Le fichier devrait ressembler à ceci:

```json
{
  "project_info": {
    "project_number": "700766162336",
    "project_id": "e-recharge-b75ee",
    "storage_bucket": "e-recharge-b75ee.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:700766162336:android:XXXXX",
        "android_client_info": {
          "package_name": "online.alicebot.front_alice.twa"
        }
      },
      "oauth_client": [...],
      "api_key": [...],
      "services": {
        "appinvite_service": {...}
      }
    }
  ],
  "configuration_version": "1"
}
```

### Étape 4: Activer Cloud Messaging

1. Dans Firebase Console, allez dans "Build" > "Cloud Messaging"
2. Vérifiez que Cloud Messaging API est activé
3. Si demandé, cliquez sur "Enable" pour activer l'API

### Étape 5: Configurer les certificats (Optionnel mais recommandé)

Pour la production, vous devriez ajouter votre SHA-256:

1. Dans Firebase Console > Project Settings > Your apps > Android app
2. Cliquez sur "Add fingerprint"
3. Ajoutez votre SHA-256:
   ```
   9C:B3:84:A8:5B:56:25:40:0E:2C:C0:64:8E:69:4E:2E:A2:78:B5:94:ED:0A:16:99:56:48:12:0D:9D:E5:FE:D2
   ```

### Étape 6: Intégrer google-services.json dans votre APK

#### Si vous utilisez PWABuilder:
```bash
# 1. Téléchargez le package depuis PWABuilder
# 2. Extrayez le ZIP
# 3. Copiez google-services.json dans:
#    android-package/app/google-services.json
# 4. Ouvrez le projet dans Android Studio
# 5. Build > Generate Signed Bundle / APK
```

#### Si vous utilisez Bubblewrap:
```bash
# 1. Initialisez Bubblewrap
bubblewrap init --manifest https://votre-domaine.com/manifest.json

# 2. Copiez google-services.json dans le dossier du projet
cp /path/to/google-services.json .

# 3. Ajoutez la configuration dans twa-manifest.json
{
  ...
  "enableNotifications": true,
  "gcmSenderId": "700766162336"
}

# 4. Générez l'APK
bubblewrap build
```

## 🔐 Sécurité

### Fichiers à ne PAS committer dans git:

Ajoutez dans votre `.gitignore`:
```
# Firebase
google-services.json
firebase-debug.log

# Android
*.keystore
*.jks
local.properties

# APK
*.apk
*.aab
```

### Protéger votre google-services.json

Ce fichier contient:
- ❌ Clés API (sensibles mais limitées par package name)
- ✅ Project ID (public)
- ✅ App ID (public)
- ❌ OAuth client secrets (très sensibles)

**Bonnes pratiques**:
1. Ne jamais committer ce fichier
2. Stocker dans un gestionnaire de secrets (1Password, etc.)
3. Utiliser des variables d'environnement pour CI/CD

## 📊 Vérification de la configuration

### Vérifier que tout fonctionne:

1. **Installez l'APK sur un appareil Android**
2. **Ouvrez l'application et connectez-vous**
3. **Vérifiez les logs ADB**:
   ```bash
   adb logcat | grep -E "FCM|Firebase|GCM"
   ```
   Vous devriez voir:
   ```
   I/FirebaseApp: Firebase initialized
   I/FCM: Token retrieved: [LONG_TOKEN_STRING]
   ```

4. **Vérifiez dans Firebase Console**:
   - Allez dans "Engage" > "Cloud Messaging"
   - Vous devriez voir les statistiques d'envoi

5. **Testez l'envoi depuis le backend**:
   - Utilisez le bouton "Tester notif" du super admin
   - La notification devrait arriver sur le téléphone

## 🆘 Problèmes courants

### Erreur: "google-services.json is missing"
**Solution**: Vérifiez que le fichier est dans `app/google-services.json`

### Erreur: "Package name mismatch"
**Solution**: Le package name dans `google-services.json` doit être `online.alicebot.front_alice.twa`

### Erreur: "Cloud Messaging API not enabled"
**Solution**: Activez l'API dans Firebase Console > Build > Cloud Messaging

### Les notifications n'arrivent pas
**Vérifiez**:
1. L'app est bien en production (HTTPS)
2. Le token FCM est enregistré dans la base de données
3. Les logs backend montrent l'envoi FCM
4. Firebase Console > Cloud Messaging montre les envois

## 🎯 Résumé rapide

```bash
# 1. Ajouter app Android sur Firebase
Package: online.alicebot.front_alice.twa

# 2. Télécharger google-services.json

# 3. L'intégrer dans le projet APK
# (PWABuilder ou Bubblewrap)

# 4. Générer et signer l'APK

# 5. Installer sur Android

# 6. Tester les notifications
```

## 📞 Support

Si vous avez des questions sur la configuration Firebase, consultez:
- [Firebase Console](https://console.firebase.google.com/project/e-recharge-b75ee)
- [Documentation FCM Android](https://firebase.google.com/docs/cloud-messaging/android/client)
- [Guide APK complet](./GUIDE_APK_NOTIFICATIONS.md)
