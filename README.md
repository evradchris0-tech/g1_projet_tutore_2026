# IMMO360 Frontend - Application Mobile Flutter

Application mobile Flutter pour la gestion des équipements et incidents.

## 📋 Table des matières

- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Développement](#développement)
- [Build Android avec Docker](#build-android-avec-docker)
- [Tests](#tests)
- [Configuration API](#configuration-api)
- [Dépannage](#dépannage)

## 🚀 Installation

### Prérequis

- Flutter SDK 3.0.0+
- Dart SDK 3.0.0+
- Android Studio / Xcode
- CocoaPods (pour iOS)

### Installation des dépendances

```bash
cd frontend
flutter pub get
```

### Configuration iOS

```bash
cd ios
pod install
cd ..
```

## 🏗️ Structure du projet

```
frontend/
├── lib/
│   ├── main.dart              # Point d'entrée
│   ├── core/                  # Configuration de base
│   │   ├── constants/         # Constantes
│   │   ├── theme/             # Thème et styles
│   │   ├── routes/            # Navigation
│   │   ├── services/          # Services API
│   │   └── utils/             # Utilitaires
│   ├── models/                # Modèles de données
│   ├── providers/             # State management (Riverpod)
│   ├── screens/               # Écrans
│   │   ├── auth/             # Authentification
│   │   └── agent/            # Écrans agent/superviseur
│   └── widgets/               # Widgets réutilisables
├── test/                      # Tests
├── android/                   # Configuration Android
├── ios/                       # Configuration iOS
└── assets/                    # Ressources
```

## 💻 Développement

### Démarrer l'application

```bash
flutter run
```

### Commandes utiles

```bash
flutter pub get          # Installer les dépendances
flutter run              # Lancer l'application
flutter clean            # Nettoyer le build
flutter doctor           # Vérifier la configuration
flutter analyze          # Analyser le code
```

## 🐳 Build Android avec Docker

### Prérequis

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB d'espace disque libre

### Build rapide

```bash
# Option 1: Makefile (recommandé)
make build
make up

# Option 2: Docker Compose
docker-compose -f docker-compose.android.yml up -d

# Option 3: Docker directement
docker build -f Dockerfile.android -t immo360-android:latest .
docker run -d -p 8080:80 --name immo360-android immo360-android:latest
```

### Télécharger l'APK

Une fois le conteneur démarré :

1. Ouvrez http://localhost:8080
2. Cliquez sur "📥 Télécharger l'APK"
3. Installez l'APK sur votre appareil Android

### Commandes Docker

```bash
make help          # Affiche toutes les commandes
make build         # Construit l'APK Android
make up            # Démarre le conteneur
make logs          # Affiche les logs
make extract-apk   # Extrait l'APK du conteneur
make down          # Arrête les conteneurs
make clean         # Nettoie tout
```

### Types de build

- **Release** (production) : `make build`
- **Debug** (développement) : `make build-debug`

## 🧪 Tests

### Types de tests

| Type            | Docker | Temps    | Commande                             |
| --------------- | ------ | -------- | ------------------------------------ |
| **Unitaires**   | ✅ Oui | ~5-10s   | `make test-unit`                     |
| **Widgets**     | ✅ Oui | ~10-30s  | `make test-widget`                   |
| **Intégration** | ❌ Non | ~2-5min  | `make test-integration`              |
| **E2E**         | ❌ Non | ~5-15min | `flutter test integration_test/e2e/` |

### Tests avec Docker

```bash
# Tests unitaires/widgets dans Docker
make test-docker

# Ou avec docker-compose
docker-compose -f docker-compose.test.yml up
```

### Tests locaux

```bash
# Tous les tests (nécessite émulateur pour intégration)
make test

# Tests unitaires uniquement
make test-unit

# Tests widgets uniquement
make test-widget

# Tests d'intégration (nécessite émulateur)
make test-integration
```

**Note** : Les tests d'intégration nécessitent un émulateur Android/iOS. Voir [CI/CD](#cicd) pour les tests automatisés.

## 🔌 Configuration API

### Endpoints disponibles

- `GET /incidents` - Liste des incidents
- `GET /incidents/:id` - Détails d'un incident
- `POST /incidents` - Créer un incident
- `PUT /incidents/:id` - Mettre à jour un incident
- `GET /agents` - Liste des agents
- `PUT /agents/:id` - Mettre à jour un agent
- `GET /buildings` - Liste des bâtiments
- `GET /notifications` - Liste des notifications

### Configuration automatique

L'application détecte automatiquement la plateforme :

- **Android Emulator** : `http://10.0.2.2:3000`
- **iOS Simulator** : `http://localhost:3000`
- **Web** : `http://localhost:3000`
- **Appareil physique** : Utilisez l'IP de votre machine

### Démarrer l'API Mock

```bash
cd ../mock-api
npm install
npm start
```

L'API sera accessible sur **http://localhost:3000**

## 📦 Build

### Build Android local

```bash
flutter build apk --release
# APK dans: build/app/outputs/flutter-apk/app-release.apk
```

### Build Android avec Docker

```bash
make build
make up
# APK disponible sur http://localhost:8080
```

### Build iOS

```bash
flutter build ios --release
```

## 🔄 CI/CD

Le workflow GitHub Actions (`.github/workflows/frontend-ci-cd.yml`) effectue :

1. ✅ **Lint & Tests** : Analyse du code et tests unitaires/widgets
2. 🐳 **Build Docker** : Compilation de l'APK Android
3. 🔒 **Security Scan** : Scan de vulnérabilités avec Trivy
4. 📦 **Upload APK** : Upload de l'APK comme artifact
5. 🚀 **Deploy** : Déploiement automatique selon la branche

### Tests Android dans CI/CD

Le workflow `.github/workflows/android-test.yml` exécute les tests d'intégration avec un émulateur Android.

## 🛠️ Technologies utilisées

- **Flutter** : Framework de développement
- **Riverpod** : Gestion d'état réactive
- **GoRouter** : Navigation déclarative
- **Hive** : Base de données locale
- **Firebase** : Notifications push
- **Google Maps** : Cartes et géolocalisation
- **FL Chart** : Graphiques et visualisations

## 🐛 Dépannage

### L'application ne se connecte pas à l'API

1. Vérifiez que l'API Mock est démarrée : http://localhost:3000
2. Pour appareil physique, utilisez l'IP de votre machine au lieu de `localhost`
3. Vérifiez `lib/core/services/api_service.dart` pour la configuration

### Erreur "No devices found"

```bash
flutter doctor
flutter devices
```

### Build Docker échoue

```bash
# Vérifier les logs
docker-compose -f docker-compose.android.yml logs android-build

# Rebuild sans cache
make build-no-cache
```

### Erreur "Android licenses not accepted"

```bash
docker exec -it immo360-android-apk sh
flutter doctor --android-licenses
```

## 📝 Fonctionnalités

### Agent/Superviseur

- ✅ Authentification sécurisée
- ✅ Tableau de bord avec KPI et graphiques
- ✅ Gestion des incidents (prise en charge, résolution)
- ✅ Consultation de l'historique avec filtres
- ✅ Export Excel (à implémenter)
- ✅ Géolocalisation indoor
- ✅ Gestion des agents (superviseur)
- ✅ Notifications push
- ✅ Mode hors ligne

## 📚 Ressources

- [Flutter Documentation](https://docs.flutter.dev/)
- [Riverpod Documentation](https://riverpod.dev/)
- [Docker Documentation](https://docs.docker.com/)

---

Pour plus de détails sur le projet complet, consultez [../README.md](../README.md)
