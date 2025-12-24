# AliceBot PWA - Frontend

Frontend moderne et responsive pour AliceBot, plateforme de gestion de dépôts et retraits pour bookmakers.

## 🚀 Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Langage typé pour la sécurité du code
- **Redux Toolkit** - Gestion d'état moderne et efficace
- **TailwindCSS** - Styling utility-first
- **Framer Motion** - Animations fluides
- **Lucide Icons** - Icônes modernes
- **Axios** - Client HTTP
- **PWA** - Progressive Web App ready

## ✨ Fonctionnalités

### Interface Utilisateur
- ✅ Design moderne et responsive (mobile-first)
- ✅ Animations fluides avec Framer Motion
- ✅ Thèmes personnalisables (couleurs, logo, nom)
- ✅ Mode sombre/clair
- ✅ PWA avec installation possible
- ✅ Optimisations performance (code splitting, lazy loading)

### Authentification
- ✅ Inscription avec email/téléphone
- ✅ Vérification par code OTP
- ✅ Connexion sécurisée avec JWT
- ✅ Gestion de session persistante
- ✅ Redirection automatique selon le rôle

### Client
- ✅ Dashboard avec statistiques personnelles
- ✅ Création de demandes de dépôt/retrait
- ✅ Historique des transactions
- ✅ Gestion des IDs bookmakers
- ✅ Système de parrainage
- ✅ Chat avec les agents
- ✅ Notifications en temps réel

### Administrateur
- ✅ Dashboard avec statistiques
- ✅ Gestion des demandes assignées
- ✅ Validation/rejet des transactions
- ✅ Chat avec les clients

### Super Admin
- ✅ Vue globale de toutes les transactions
- ✅ Gestion des administrateurs
- ✅ Gestion des utilisateurs
- ✅ Configuration des bookmakers
- ✅ Configuration des moyens de paiement
- ✅ Assignation agents-bookmakers-paiements
- ✅ Personnalisation de l'app (logo, couleurs, nom)
- ✅ Statistiques globales
- ✅ Configurateur de thèmes

### Notifications
- ✅ Centre de notifications
- ✅ Notifications push web
- ✅ Compteur de notifications non lues
- ✅ Marquage comme lu

## 🛠 Installation

### Prérequis

- Node.js >= 18
- npm ou yarn
- Backend API en cours d'exécution

### Configuration

1. **Cloner le dépôt**
```bash
git clone https://github.com/bakiscofield/e-recharge-frontend.git
cd e-recharge-frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

Modifiez le fichier `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_NAME=AliceBot
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Générer les icônes PWA (optionnel)**
```bash
node generate-icons.js
```

## 🚀 Démarrage

### Développement
```bash
npm run dev
```

L'application démarre sur http://localhost:3000

### Production

```bash
# Build
npm run build

# Démarrer
npm start
```

### Build standalone (recommandé pour déploiement)
```bash
npm run build
# Les fichiers sont dans .next/standalone/
```

## 📱 PWA

L'application est configurée comme Progressive Web App :
- ✅ Manifeste web (`/public/manifest.json`)
- ✅ Service Worker (génération automatique)
- ✅ Icônes adaptatives (72x72 à 512x512)
- ✅ Installation sur mobile/desktop
- ✅ Mode hors ligne (à activer dans `next.config.js`)

## 🏗 Structure du Projet

```
src/
├── app/                      # App Router (Next.js 14)
│   ├── admin/               # Pages admin
│   ├── super-admin/         # Pages super admin
│   ├── depot/               # Page dépôt
│   ├── retrait/             # Page retrait
│   ├── historique/          # Historique des transactions
│   ├── login/               # Connexion
│   ├── register/            # Inscription
│   └── ...
├── components/              # Composants réutilisables
│   ├── Animations/          # Composants d'animation
│   ├── Auth/                # Guards d'authentification
│   ├── Layout/              # Layouts (Admin, SuperAdmin)
│   └── Navigation/          # Headers et menus
├── hooks/                   # Custom hooks
│   ├── useAppConfig.ts      # Hook config dynamique
│   └── useRoleRedirect.ts   # Redirection par rôle
├── lib/                     # Utilitaires
│   └── api.ts              # Client API Axios
└── store/                   # Redux store
    └── slices/              # Redux slices
        ├── authSlice.ts     # Authentification
        ├── configSlice.ts   # Configuration
        ├── ordersSlice.ts   # Commandes
        ├── chatSlice.ts     # Chat
        └── notificationsSlice.ts
```

## 🎨 Personnalisation

### Configuration dynamique

L'application charge sa configuration depuis l'API backend :
- Logo personnalisé
- Nom de l'application
- Couleurs du thème
- Favicon

Configuration dans le backend via :
```
POST /api/v1/config/branding
{
  "appName": "MonApp",
  "appLogo": "https://...",
  "primaryColor": "#3B82F6",
  "favicon": "https://..."
}
```

### Thèmes

Les couleurs sont configurables via TailwindCSS :
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        // ...
      }
    }
  }
}
```

## 🔐 Authentification

### Flux d'authentification

1. **Inscription**
   - Envoi du numéro de téléphone
   - Réception du code OTP
   - Vérification du code
   - Création du compte

2. **Connexion**
   - Identifiant + mot de passe
   - Ou connexion OTP

3. **Session**
   - JWT stocké dans Redux et localStorage
   - Refresh automatique
   - Déconnexion automatique si token expiré

### Protection des routes

```tsx
import { RoleGuard } from '@/components/Auth/RoleGuard';

<RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
  {children}
</RoleGuard>
```

## 📊 State Management

Redux Toolkit avec slices :

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';

const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
```

## 🌐 API Client

Client Axios configuré avec intercepteurs :

```typescript
import api from '@/lib/api';

// GET
const response = await api.get('/orders');

// POST
const response = await api.post('/orders', data);
```

- ✅ Ajout automatique du token JWT
- ✅ Gestion des erreurs
- ✅ Refresh token automatique
- ✅ Déconnexion si 401

## 🎯 Routes Principales

| Route | Description | Rôle requis |
|-------|-------------|-------------|
| `/` | Page d'accueil | Public |
| `/login` | Connexion | Public |
| `/register` | Inscription | Public |
| `/admin` | Dashboard admin | ADMIN, AGENT |
| `/admin/demandes` | Gestion demandes | ADMIN, AGENT |
| `/super-admin` | Dashboard super admin | SUPER_ADMIN |
| `/super-admin/configuration` | Configuration app | SUPER_ADMIN |
| `/depot` | Créer un dépôt | CLIENT |
| `/retrait` | Créer un retrait | CLIENT |
| `/historique` | Historique | CLIENT |

## 🧪 Tests

```bash
# Tests unitaires (à configurer)
npm run test

# Tests e2e (à configurer)
npm run test:e2e
```

## 📦 Build & Déploiement

### Build optimisé
```bash
npm run build
```

Optimisations automatiques :
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Image optimization
- ✅ Font optimization

### Déploiement avec PM2
```bash
npm run build
pm2 start npm --name "alicebot-frontend" -- start
pm2 save
```

### Déploiement avec Docker
```bash
docker build -t alicebot-frontend .
docker run -p 3000:3000 alicebot-frontend
```

## 🌐 Configuration Nginx

Exemple de configuration nginx disponible dans `nginx-front-alice.conf`

```nginx
server {
    listen 80;
    server_name alicebot.online www.alicebot.online;

    location / {
        proxy_pass http://localhost:3000;
        # ...
    }
}
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Lint
npm run lint

# Générer les icônes PWA
node generate-icons.js
```

## 📱 Responsive Design

L'application est optimisée pour toutes les tailles d'écran :
- 📱 Mobile (< 640px)
- 📱 Tablet (640px - 1024px)
- 💻 Desktop (> 1024px)

Breakpoints TailwindCSS :
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

## ⚡ Performance

- ✅ Next.js 14 App Router (Server Components)
- ✅ Code splitting automatique
- ✅ Image optimization
- ✅ Font optimization
- ✅ Lazy loading des composants
- ✅ Memoization avec React.memo
- ✅ Virtual scrolling pour les listes longues

## 🐛 Debug

### Dev Tools

- Redux DevTools pour l'état
- React DevTools pour les composants
- Next.js DevTools

### Logs

Activer les logs détaillés :
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est privé et propriétaire.

## 👥 Auteur

**AliceBot Team**

## 🔗 Liens Utiles

- [Backend Repository](https://github.com/bakiscofield/e-recharge-backend)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
