## 📝 Description

### Contexte
<!-- Pourquoi cette MR est-elle nécessaire ? -->

### Impact
<!-- Quel est l'impact sur l'application ? -->
- Modules affectés: 
- APIs modifiées:
- Breaking changes: Oui/Non

### Comment tester localement
```bash
# 1. Checkout la branche
git checkout backend

# 2. Installer dépendances
cd api-gateway && npm install
cd auth-service && npm install

# 3. Lancer les services
npm run start:dev
```

## ✅ Checklist

- [ ] Pipeline passe (build, lint, test)
- [ ] Code suit les conventions
- [ ] Tests unitaires passent
- [ ] Aucun secret committé
- [ ] Documentation à jour

## 👥 Reviewers
@maintenairs

## 🏷️ Labels
`backend` `authentication` `needs-review`