# IMMO360 CAMEROUN CLIENT

Application mobile **Flutter** destinée aux clients de la plateforme **IMMO360 Cameroun**.  
Elle permet aux utilisateurs de **signaler des incidents** liés à leurs équipements ou à leur logement, de **suivre la résolution** et d’interagir avec les équipes techniques.  

> **Statut :** Début du développement (phase d’initialisation du projet)

---

## Objectif de l’application

- Faciliter la **déclaration d’incidents** (pannes, anomalies, maintenance, etc.).
- Permettre un **suivi en temps réel** de la prise en charge et de la résolution.
- Fonctionner **en mode hors ligne** avec synchronisation automatique une fois la connexion rétablie.
- Offrir une **expérience fluide et moderne**, adaptée à Android (v1).

---

## Architecture du projet

Le projet suit le **pattern MVVM (Model - View - ViewModel)**, appliqué **par fonctionnalité** pour une meilleure modularité.  
Deux dossiers centraux — `core` et `shared` — contiennent les éléments communs à toutes les features.

lib/
│
├── core/ # Logique et ressources globales
│ ├── error/ # Gestion des erreurs et exceptions
│ ├── network/ # Services réseau (API, synchronisation)
│ ├── database/ # Gestion du stockage local (SQLite, Hive, etc.)
│ └── utils/ # Helpers, extensions, constantes
│
├── shared/ # Composants et widgets réutilisables
│ ├── widgets/
│ ├── themes/
│ └── styles/
│
├── features/
│ ├── report_incident/ # Exemple de feature : déclaration d’incident
│ │ ├── model/
│ │ ├── view/
│ │ └── view_model/
│ └── ...
│
└── main.dart # Point d’entrée de l’application


---

### Schéma simplifié du flux MVVM

┌───────────────┐
│ View │ ← Interface utilisateur (Widgets Flutter)
└──────┬────────┘
│ observe / notify
▼
┌───────────────┐
│ ViewModel │ ← Gère l’état et la logique de présentation
└──────┬────────┘
│ utilise
▼
┌───────────────┐
│ Model │ ← Représente les données (locales ou API)
└───────────────┘


---

## Installation et exécution du projet

### Prérequis
- Flutter SDK (version stable la plus récente)
- Android Studio ou VS Code
- Un appareil ou émulateur Android
- Accès au dépôt GitLab du projet

### Étapes

# 1. Installer les dépendances
flutter pub get

# 2. Lancer l’application
flutter run

## Communication avec le backend

Les services backend seront fournis par l’équipe backend sous forme d’API REST.

Chaque ViewModel communique avec le backend via un Repository localisé dans core/network/.

Les requêtes sont gérées via Dio ou http (à définir plus tard).

La logique d’offline-first sera assurée via une base locale (SQLite).

## Gestion du mode hors-ligne

Le mode hors-ligne garantit :

L’accès aux données locales sans connexion.

La synchronisation automatique lors du retour en ligne.

La gestion des files d’attente d’actions (ex. incidents créés en offline).

## Conventions de commits (Conventional Commits)

Format :

<type>(scope): message


Exemples :

feat(report): ajout du formulaire de déclaration
fix(api): correction du parsing JSON
refactor(viewmodel): simplification de la logique d’état
docs(readme): mise à jour de la documentation

Types courants :

feat → nouvelle fonctionnalité

fix → correction de bug

docs → documentation

style → mise en forme (indentation, formatage)

refactor → modification du code sans impact fonctionnel

test → ajout ou modification de tests

chore → tâches diverses (build, dépendances…)

## Contribution

Créer une nouvelle branche à partir de **mobile_2**.

Développer votre fonctionnalité.

Vérifier le bon fonctionnement avec `flutter analyze` et `flutter test`.

Commiter vos changements avec un message clair.

Créer une Merge Request vers **mobile_2**.

Attendre la revue d’un pair avant validation.