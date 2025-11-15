# Guide de Contribution Backend - IMMO360

## 🎯 Workflow Git

### Structure des branches
```
main           → Production (déploiement manuel)
  ├── develop  → Staging (déploiement auto)
      ├── backend        → Développement backend
      ├── web            → Développement frontend React
      ├── mobile_1       → Développement mobile (dev 1)
      └── mobile_2       → Développement mobile (dev 2)
```

### Règles de nommage des branches
```bash
# Features
feat/auth-jwt
feat/notifications
feat/payment-integration

# Bugfixes
fix/auth-token-expiration
fix/db-connection-pool

# Hotfixes
hotfix/critical-security-patch
```

### Règles de commits (Conventional Commits)
```bash
# Format
<type>(<scope>): <subject>

# Types autorisés
feat:     Nouvelle fonctionnalité
fix:      Correction de bug
docs:     Documentation uniquement
style:    Formatage (pas de changement de code)
refactor: Refactoring (ni feat ni fix)
test:     Ajout/modification de tests
chore:    Tâches de maintenance

# Exemples
feat(auth): add JWT refresh token mechanism
fix(users): prevent duplicate email registration
docs(api): update Swagger documentation
test(auth): add unit tests for login service
```

## 🚀 Créer une Merge Request

### 1. Développement
```bash
# Créer une branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feat/votre-feature

# Développer + tests locaux
npm run test:watch
npm run lint

# Commits réguliers
git add .
git commit -m "feat(auth): implement JWT strategy"
```

### 2. Préparer la MR
```bash
# Push
git push origin feat/votre-feature
```

### 3. Créer la MR sur GitLab
- **Source**: `feat/votre-feature`
- **Target**: `develop`
- **Titre**: Suivre Conventional Commits
- **Assignee**: Vous-même
- **Reviewers**: @tech-lead, @backend-team
- **Labels**: `backend`, `feature`, `needs-review`

## 🧪 Tests

### Tests unitaires
```bash
# Lancer tous les tests
npm run test

# Tests en watch mode
npm run test:watch

# Coverage
npm run test:cov
```

### Règles de coverage
- Minimum 70% de coverage global
- Minimum 80% pour les services critiques (auth, payment)

## 📝 Checklist avant MR

- [ ] Code compile sans erreur
- [ ] Tests unitaires passent
- [ ] Lint passe (npm run lint)
- [ ] Coverage ≥ 70%
- [ ] Documentation à jour (README, Swagger)
- [ ] Aucun secret committé
- [ ] .env.example à jour
- [ ] Migration DB créée (si applicable)

## 🔒 Sécurité

### Ne JAMAIS committer
- Fichiers .env
- Clés privées (*.pem, *.key)
- Credentials (passwords, tokens)
- node_modules/ ← JAMAIS
- dist/ ← Généré par build

### À TOUJOURS committer
- package.json ← Oui
- package-lock.json ← OUI (important pour CI/CD)
- tsconfig.json ← Oui
- .env.example ← Oui (sans valeurs sensibles)

### Vérifier avant commit
```bash
git diff --cached | grep -E "(password|secret|api_key|token)"
```

## 📖 Documentation

### Swagger
- Documenter tous les endpoints avec @ApiOperation
- Ajouter des exemples avec @ApiProperty
- Définir les réponses avec @ApiResponse

## 🆘 Support

- Questions techniques: #backend-help (Slack)
- Bugs urgents: @tech-lead
- Documentation: https://docs.immo360.com

## 📦 Gestion des dépendances

### Ajouter une dépendance
```bash
# Production
npm install --save nom-package

# Development
npm install --save-dev nom-package

# TOUJOURS commiter package-lock.json après !
git add package.json package-lock.json
git commit -m "chore(deps): add nom-package"
```

### Mettre à jour les dépendances
```bash
# Vérifier les updates
npm outdated

# Mettre à jour (attention aux breaking changes)
npm update

# Commiter les changements
git add package-lock.json
git commit -m "chore(deps): update dependencies"
```

## 🔍 Debugging

### Logs
```bash
# Development
npm run start:dev

# Debug mode
npm run start:debug
```

### Tests qui échouent
```bash
# Lancer un seul fichier de test
npm test -- auth.service.spec.ts

# Mode verbose
npm test -- --verbose

# Voir le coverage détaillé
npm run test:cov
open coverage/lcov-report/index.html
```