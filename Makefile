.PHONY: help build up down logs restart clean test lint

# Variables
IMAGE_NAME := immo360-android
VERSION := 1.0.0
REGISTRY := ghcr.io

help: ## Affiche cette aide
	@echo "Commandes disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Construit l'APK Android dans Docker
	docker build -f Dockerfile.android -t $(IMAGE_NAME):$(VERSION) -t $(IMAGE_NAME):latest .

build-no-cache: ## Construit l'image Docker sans cache
	docker build --no-cache -f Dockerfile.android -t $(IMAGE_NAME):$(VERSION) -t $(IMAGE_NAME):latest .

build-debug: ## Construit l'APK Android en mode debug
	docker build --build-arg BUILD_TYPE=debug -f Dockerfile.android -t $(IMAGE_NAME):debug .

up: ## Démarre le conteneur Android
	docker-compose -f docker-compose.android.yml up -d

down: ## Arrête les conteneurs
	docker-compose -f docker-compose.android.yml down

logs: ## Affiche les logs
	docker-compose -f docker-compose.android.yml logs -f android-build

restart: ## Redémarre les conteneurs
	docker-compose -f docker-compose.android.yml restart

clean: ## Nettoie les conteneurs et images
	docker-compose -f docker-compose.android.yml down -v
	docker rmi $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):latest || true

extract-apk: ## Extrait l'APK du conteneur vers le répertoire courant
	docker cp immo360-android-apk:/usr/share/nginx/html/app-release.apk ./app-release.apk

test: ## Lance les tests Flutter
	flutter test

test-docker: ## Lance les tests dans Docker (unitaires + widgets uniquement)
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit

test-unit: ## Lance uniquement les tests unitaires
	flutter test test/unit/

test-widget: ## Lance uniquement les tests widgets
	flutter test test/widget/

test-integration: ## Lance les tests d'intégration (nécessite émulateur)
	flutter test integration_test/

lint: ## Vérifie le code avec flutter analyze
	flutter analyze

format: ## Formate le code
	docker run --rm -v $(PWD):/app -w /app ghcr.io/cirruslabs/flutter:stable flutter format .

health: ## Vérifie la santé du conteneur
	curl -f http://localhost:8080/ || echo "Service non disponible"

shell: ## Ouvre un shell dans le conteneur
	docker-compose -f docker-compose.android.yml exec android-build sh

push: ## Push l'image vers le registry
	docker tag $(IMAGE_NAME):latest $(REGISTRY)/$(IMAGE_NAME):$(VERSION)
	docker tag $(IMAGE_NAME):latest $(REGISTRY)/$(IMAGE_NAME):latest
	docker push $(REGISTRY)/$(IMAGE_NAME):$(VERSION)
	docker push $(REGISTRY)/$(IMAGE_NAME):latest
