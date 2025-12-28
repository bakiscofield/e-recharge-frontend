#!/bin/bash

# Script d'installation et configuration de Capacitor pour générer l'APK
# Usage: bash setup-capacitor.sh

set -e

echo "🚀 Installation de Capacitor..."

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier que nous sommes dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le dossier frontend/"
    exit 1
fi

echo -e "${BLUE}📦 Installation des packages Capacitor...${NC}"
npm install @capacitor/core @capacitor/cli @capacitor/android

echo -e "${BLUE}🔧 Ajout de la plateforme Android...${NC}"
npx cap add android

echo -e "${BLUE}🔄 Synchronisation...${NC}"
npx cap sync

echo -e "${GREEN}✅ Capacitor installé avec succès!${NC}"
echo ""
echo -e "${YELLOW}📝 Prochaines étapes:${NC}"
echo ""
echo "1. Modifier capacitor.config.ts:"
echo "   - Changez 'com.alicebot.app' par votre ID d'application"
echo "   - Changez 'AliceBot' par le nom de votre application"
echo "   - Changez l'URL du serveur par votre domaine déployé"
echo ""
echo "2. Installer Android Studio:"
echo "   https://developer.android.com/studio"
echo ""
echo "3. Générer l'APK:"
echo "   npm run cap:open    # Ouvre Android Studio"
echo "   # Puis: Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo ""
echo "4. Ou générer via CLI:"
echo "   npm run cap:build:debug    # Pour debug"
echo "   npm run cap:build:release  # Pour production (après config keystore)"
echo ""
echo -e "${BLUE}📖 Lisez GUIDE_CAPACITOR_APK.md pour plus de détails${NC}"
