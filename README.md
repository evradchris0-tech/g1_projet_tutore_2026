# SJI Tutore Ing5 - Projet React

Projet frontend React créé avec Vite.

## 🚀 Démarrage rapide

### Installation des dépendances

```bash
npm install
```

### Développement

Lancez le serveur de développement :

```bash
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5173`

### Build de production

Pour créer une version de production :

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Prévisualisation du build

Pour prévisualiser le build de production :

```bash
npm run preview
```

## 📁 Structure du projet

```
.
├── public/          # Fichiers statiques (images référencées par URL)
├── src/
│   ├── assets/      # Images et ressources importées dans les composants
│   ├── App.jsx     # Composant principal
│   ├── App.css     # Styles du composant App
│   ├── main.jsx    # Point d'entrée de l'application
│   └── index.css   # Styles globaux
├── index.html      # Template HTML
├── vite.config.js  # Configuration Vite
└── package.json    # Dépendances et scripts
```

## 🖼️ Gestion des images

### Dossier `src/assets/` (Recommandé)
Utilisez ce dossier pour les images **importées dans vos composants**. Vite optimisera automatiquement ces images.

**Exemple d'utilisation :**
```jsx
import logo from './assets/logo.png'

function App() {
  return <img src={logo} alt="Logo" />
}
```

**Avantages :**
- Optimisation automatique par Vite
- Vérification à la compilation (erreur si l'image n'existe pas)
- Hash dans le nom pour le cache (en production)

### Dossier `public/`
Utilisez ce dossier pour les images **référencées par URL statique** (favicon, images dans le HTML, etc.).

**Exemple d'utilisation :**
```jsx
// Dans public/logo.png
<img src="/logo.png" alt="Logo" />
```

**Avantages :**
- Accessible directement via l'URL `/nom-image.png`
- Pas de traitement par Vite
- Utile pour les fichiers qui doivent avoir un chemin fixe

## 🛠️ Technologies utilisées

- **React 18** - Bibliothèque UI
- **Vite** - Outil de build et serveur de développement
- **JavaScript/JSX** - Langage de programmation

## 📝 Notes

- Le Hot Module Replacement (HMR) est activé par défaut
- Modifiez les fichiers dans `src/` pour voir les changements en temps réel

