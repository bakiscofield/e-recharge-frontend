# Instructions pour Créer les Screenshots PWA

## 📸 Screenshots Requis

### 1. Screenshot Mobile (narrow form factor)
- **Dimensions** : 540x720 pixels
- **Ratio** : 3:4 (portrait)
- **Nom** : `mobile-1.png`
- **Contenu** : Page d'accueil ou dashboard principal

### 2. Screenshot Desktop (wide form factor)
- **Dimensions** : 1280x720 pixels
- **Ratio** : 16:9 (paysage)
- **Nom** : `desktop-1.png`
- **Contenu** : Vue complète du dashboard

---

## 🎯 Méthode 1 : Avec Chrome DevTools (Recommandé)

### Screenshot Mobile

```bash
1. Ouvrir votre app : https://front-alice.alicebot.online
2. F12 (DevTools)
3. Ctrl + Shift + M (Mode responsive)
4. Sélectionner "Edit..." dans la liste des devices
5. Ajouter un device custom :
   - Name: PWA Mobile
   - Width: 540
   - Height: 720
   - Device pixel ratio: 1
6. Sélectionner "PWA Mobile"
7. Naviguer vers la page principale (logged in)
8. Ctrl + Shift + P → "Capture screenshot"
9. Renommer en mobile-1.png
10. Copier dans frontend/public/screenshots/
```

### Screenshot Desktop

```bash
1. Fenêtre normale (pas DevTools)
2. Redimensionner la fenêtre :
   - F12 → Console
   - Taper: window.resizeTo(1280, 720)
   - OU utiliser une extension de redimensionnement
3. Naviguer vers le dashboard
4. Prendre capture :
   - Extension Chrome screenshot
   - Ou outil système (Print Screen)
5. Recadrer à exactement 1280x720
6. Renommer en desktop-1.png
7. Copier dans frontend/public/screenshots/
```

---

## 🎯 Méthode 2 : Script Automatique (Node.js)

Nous avons créé un script qui capture automatiquement :

```bash
cd frontend
node scripts/capture-screenshots.js
```

Ce script va :
1. Lancer Puppeteer
2. Se connecter à votre app
3. Capturer les deux screenshots
4. Les sauvegarder au bon format

**Note** : Nécessite `npm install puppeteer --save-dev`

---

## 🎯 Méthode 3 : Outils en Ligne

### Option A : Screely
1. Aller sur https://www.screely.com/
2. Uploader screenshot de votre app
3. Choisir template mobile ou desktop
4. Télécharger aux bonnes dimensions

### Option B : ScreenStab
1. Aller sur https://screenstab.com/
2. Même processus

---

## ✅ Checklist

Après création des screenshots :

```bash
☐ mobile-1.png existe (540x720)
☐ desktop-1.png existe (1280x720)
☐ Images en PNG
☐ Taille raisonnable (<500KB chacune)
☐ Pas de données sensibles visibles
☐ Pages représentatives de l'app
```

---

## 🚀 Vérification

Une fois créés, vérifier dans le manifest :

```bash
cd frontend
node scripts/check-pwa.js
```

Devrait afficher :
```
✅ mobile-1.png trouvé
✅ desktop-1.png trouvé
```

---

## 💡 Conseils

1. **Utilisez des données de démonstration** (pas de vraies données utilisateur)
2. **Montrez les fonctionnalités clés** (dépôt, retrait, historique)
3. **Assurez-vous que l'UI est clean** (pas d'erreurs, bon état)
4. **Mode clair de préférence** (meilleure visibilité)
5. **Optimisez les images** après création :
   ```bash
   npx @squoosh/cli --webp auto screenshots/*.png
   ```

---

## 🎨 Templates Disponibles

Nous avons créé des templates HTML que vous pouvez ouvrir dans le navigateur
et capturer directement :

```bash
frontend/public/screenshots/template-mobile.html
frontend/public/screenshots/template-desktop.html
```

Ouvrez-les, ils afficheront des guides visuels pour les bonnes dimensions.
