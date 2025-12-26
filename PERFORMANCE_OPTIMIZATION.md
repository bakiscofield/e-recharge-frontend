# Guide d'Optimisation des Performances - AliceBot PWA

## 🎯 Objectifs Lighthouse

| Catégorie | Score Cible | Score Actuel |
|-----------|-------------|--------------|
| Performance | 90+ | À tester |
| Accessibility | 90+ | À tester |
| Best Practices | 90+ | À tester |
| SEO | 90+ | À tester |
| **PWA** | **100** | **100 ✅** |

---

## ✅ Optimisations Déjà Implémentées

### Configuration Next.js
- ✅ `swcMinify: true` - Minification rapide avec SWC
- ✅ `compress: true` - Compression Gzip activée
- ✅ `removeConsole` en production
- ✅ Headers de sécurité configurés
- ✅ Cache headers optimisés

### Images
- ✅ Support WebP et AVIF
- ✅ Tailles d'images responsive
- ✅ Cache immutable pour les assets

### PWA
- ✅ Service Worker v2.0.0 avec cache intelligent
- ✅ 4 stratégies de cache (Cache First, Network First, etc.)
- ✅ Support offline complet
- ✅ Gestion automatique des versions

---

## 🚀 Audit Lighthouse - Comment Faire

### 1. Audit Local

```bash
# Installer Lighthouse CLI
npm install -g lighthouse

# Lancer audit
lighthouse http://localhost:3000 --view

# Audit PWA uniquement
lighthouse http://localhost:3000 --only-categories=pwa --view
```

### 2. Audit Production

```bash
lighthouse https://front-alice.alicebot.online --view
```

### 3. Chrome DevTools

```
1. F12 (DevTools)
2. Lighthouse tab
3. Cocher toutes les catégories
4. Mode: Navigation
5. Device: Mobile puis Desktop
6. Generate report
```

---

## 📊 Optimisations Recommandées par Priorité

### 🔴 HAUTE PRIORITÉ

#### 1. Optimiser les Images

**Problème** : Images non optimisées ralentissent le chargement

**Actions** :
```bash
# Convertir en WebP
npm install --save-dev sharp
node scripts/optimize-images.js

# Ou utiliser next/image partout
import Image from 'next/image'
<Image src="/path.png" width={500} height={300} alt="..." />
```

#### 2. Éliminer les Resources Bloquantes

**Problème** : JavaScript/CSS bloque le rendu

**Actions** :
- Utiliser `next/dynamic` pour les composants lourds
- Lazy load les composants non critiques
- Preload des polices

```javascript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Chargement...</p>,
  ssr: false
})
```

#### 3. Réduire le JavaScript Inutilisé

**Actions** :
```bash
# Analyser le bundle
npm run analyze-bundle

# Installer bundle analyzer
npm install --save-dev @next/bundle-analyzer
```

---

### 🟡 MOYENNE PRIORITÉ

#### 4. Utiliser un CDN

**Recommandation** : Cloudflare, Vercel, ou Netlify

**Avantages** :
- Cache géographique
- Compression automatique Brotli
- HTTP/2 et HTTP/3

#### 5. Optimiser les Polices

**Actions** :
```javascript
// Dans layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
})
```

#### 6. Activer la Compression

**Nginx** :
```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;

# Brotli (si disponible)
brotli on;
brotli_types text/plain text/css application/json application/javascript;
```

---

### 🔵 BASSE PRIORITÉ

#### 7. Preconnect aux Origines Externes

```html
<link rel="preconnect" href="https://back-alice.alicebot.online" />
<link rel="dns-prefetch" href="https://back-alice.alicebot.online" />
```

#### 8. Utiliser Resource Hints

```html
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
```

---

## 🎨 Optimisation des Images

### Script d'Optimisation

Nous avons créé un script pour optimiser toutes les images :

```bash
node scripts/optimize-images.js
```

### Checklist Images

- [ ] Toutes les images utilisent `next/image`
- [ ] Format WebP/AVIF activé
- [ ] Lazy loading activé
- [ ] Tailles appropriées (pas de 4K pour un thumbnail)
- [ ] Alt text présent partout

---

## 📱 Performance Mobile

### Test de Performance Mobile

```bash
lighthouse https://front-alice.alicebot.online \
  --preset=mobile \
  --throttling.cpuSlowdownMultiplier=4 \
  --view
```

### Optimisations Spécifiques Mobile

1. **Réduire le JavaScript**
   - Utiliser dynamic imports
   - Code splitting par route

2. **Images Responsive**
   - Servir des images adaptées à la taille d'écran
   - next/image fait ça automatiquement

3. **Limiter les Requêtes**
   - Combiner les ressources
   - Utiliser HTTP/2 multiplexing

---

## 🔍 Debugging Performance

### Chrome Performance Tab

```
1. F12 > Performance
2. Start Recording
3. Charger la page
4. Stop Recording
5. Analyser :
   - Long Tasks (> 50ms)
   - Layout Shifts
   - Paint operations
```

### Web Vitals

Surveiller les Core Web Vitals :

- **LCP** (Largest Contentful Paint) : < 2.5s
- **FID** (First Input Delay) : < 100ms
- **CLS** (Cumulative Layout Shift) : < 0.1

```javascript
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

---

## 📈 Monitoring Continu

### Tools Recommandés

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/

2. **WebPageTest**
   - https://www.webpagetest.org/

3. **GTmetrix**
   - https://gtmetrix.com/

### Automatisation

```bash
# CI/CD - Lighthouse CI
npm install --save-dev @lhci/cli

# Configuration
npx lhci init

# Run
lhci autorun
```

---

## ✅ Checklist Finale

```
AVANT DEPLOYMENT :

Performance
☐ Images optimisées (WebP/AVIF)
☐ JavaScript minifié
☐ CSS minifié
☐ Compression Gzip/Brotli activée
☐ CDN configuré
☐ Cache headers optimisés

Lighthouse Scores
☐ Performance : 90+ ✅
☐ Accessibility : 90+ ✅
☐ Best Practices : 90+ ✅
☐ SEO : 90+ ✅
☐ PWA : 100 ✅

Web Vitals
☐ LCP < 2.5s ✅
☐ FID < 100ms ✅
☐ CLS < 0.1 ✅
```

---

## 🎯 Résultats Attendus

### Avant Optimisation
```
Performance: 60-70
Accessibility: 80
Best Practices: 75
SEO: 85
PWA: 100 ✅
```

### Après Optimisation
```
Performance: 90+ ✅
Accessibility: 95+ ✅
Best Practices: 95+ ✅
SEO: 95+ ✅
PWA: 100 ✅
```

---

## 📞 Support

Pour plus d'aide sur l'optimisation :

- Next.js Performance Docs : https://nextjs.org/docs/advanced-features/measuring-performance
- Web.dev Learn Performance : https://web.dev/learn/#performance
- MDN Performance : https://developer.mozilla.org/en-US/docs/Web/Performance
