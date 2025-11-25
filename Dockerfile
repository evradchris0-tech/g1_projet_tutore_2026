# ==================== BASE STAGE ====================
FROM node:20-alpine AS base

# Installer dumb-init pour gestion correcte des signaux
RUN apk add --no-cache dumb-init

# Créer utilisateur non-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# ==================== DEPENDENCIES STAGE ====================
FROM base AS dependencies

# Argument pour choisir le service à builder
ARG SERVICE_NAME

# Copier les package.json et package-lock.json
COPY ${SERVICE_NAME}/package*.json ./${SERVICE_NAME}/

# Installer toutes les dépendances (dev + prod pour le build)
WORKDIR /app/${SERVICE_NAME}
RUN npm ci --prefer-offline --no-audit

# ==================== BUILD STAGE ====================
FROM dependencies AS build

ARG SERVICE_NAME

WORKDIR /app/${SERVICE_NAME}

# Copier le code source du service
COPY ${SERVICE_NAME}/ ./

# Builder l'application (TypeScript → JavaScript)
RUN npm run build

# ==================== PRODUCTION DEPENDENCIES ====================
FROM base AS prod-dependencies

ARG SERVICE_NAME

COPY ${SERVICE_NAME}/package*.json ./${SERVICE_NAME}/

WORKDIR /app/${SERVICE_NAME}

# Installer UNIQUEMENT les dépendances de production
RUN npm ci --omit=dev --prefer-offline --no-audit && npm cache clean --force

# ==================== PRODUCTION STAGE ====================
FROM base AS production

ARG SERVICE_NAME
ARG SERVICE_PORT=3000

WORKDIR /app/${SERVICE_NAME}

# Copier les dépendances de production
COPY --from=prod-dependencies --chown=nodejs:nodejs /app/${SERVICE_NAME}/node_modules ./node_modules

# Copier le code buildé (dist/)
COPY --from=build --chown=nodejs:nodejs /app/${SERVICE_NAME}/dist ./dist

# Copier package.json pour les métadonnées
COPY --chown=nodejs:nodejs ${SERVICE_NAME}/package*.json ./

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=${SERVICE_PORT}

# Changer vers utilisateur non-root
USER nodejs

# Exposer le port
EXPOSE ${SERVICE_PORT}

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${SERVICE_PORT}/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Point d'entrée avec dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage
CMD ["node", "dist/main.js"]