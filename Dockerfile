FROM node:20-alpine

# Créer le dossier de travail
WORKDIR /app

# Copier seulement les package*.json pour profiter du cache Docker
COPY api-gateway/package*.json api-gateway/
COPY auth-service/package*.json auth-service/

# Installer les dépendances pour chaque service
RUN cd api-gateway && npm ci --prefer-offline --no-audit
RUN cd auth-service && npm ci --prefer-offline --no-audit

# Copier le reste du code
COPY . .

# Exposer dossier de travail pour volume si nécessaire
VOLUME ["/app"]

# Définir commande par défaut
CMD ["sh"]
