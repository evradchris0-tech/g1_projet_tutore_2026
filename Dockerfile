FROM node:20-alpine

# Créer le dossier de travail
WORKDIR /app

# Copier seulement les package*.json pour npm install rapide
COPY api-gateway/package*.json api-gateway/
COPY auth-service/package*.json auth-service/

# Installer dependencies et devDependencies
RUN cd api-gateway && npm ci --prefer-offline --no-audit
RUN cd auth-service && npm ci --prefer-offline --no-audit

# Exposer dossier de travail pour volume
VOLUME ["/app"]

# Définir commande par défaut
CMD ["sh"]
