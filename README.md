# Roast My Excuses - Mobile App

L'application mobile React Native / Expo pour se faire roaster ses excuses.

## Installation Rapide

1. **Pré-requis**

   - Installez l'application **Expo Go** sur votre téléphone (App Store / Play Store).
   - Assurez-vous d'avoir Node.js installé.

2. **Installation**

   ```bash
   git clone https://github.com/HrodWolfS/roast-my-excuses-mobile.git
   cd roast-my-excuses-mobile
   npm install
   ```

3. **Lancer l'application**

   ```bash
   npx expo start
   ```

   Scannez le QR Code avec votre téléphone.

## Architecture (Où coder ?)

Tout se passe dans le dossier src/ :

src/screens/ : Les pages de l'app (Login, Feed, Create...)

src/navigation/ : La gestion des routes (AppNavigator)

src/components/ : Les petits bouts d'interface réutilisables

src/redux/ : La gestion des données (User, Tasks)

src/services/ : Les appels API vers le backend
