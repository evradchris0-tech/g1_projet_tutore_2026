@echo off
title Création de l'arborescence du projet
echo ===================================================
echo 🚀 Création de l'arborescence du projet...
echo ===================================================

REM --- Apps ---
mkdir apps
mkdir apps\web-admin
mkdir apps\mobile-client
mkdir apps\mobile-agent

REM --- Services ---
mkdir services
mkdir services\backend

REM --- Libs ---
mkdir libs
mkdir libs\ui-kit
mkdir libs\api-types

REM --- Infra ---
mkdir infra

REM --- Docs, scripts, GitLab config ---
mkdir docs
mkdir scripts
mkdir .gitlab
mkdir .gitlab\issue_templates
mkdir .gitlab\merge_request_templates

REM --- Fichiers de base ---
echo # Docker Compose - environnement de développement > infra\docker-compose.dev.yml

REM --- Placeholders pour éviter les dossiers vides ---
echo # web-admin > apps\web-admin\README.md
echo # mobile-client > apps\mobile-client\README.md
echo # mobile-agent > apps\mobile-agent\README.md
echo # backend > services\backend\README.md
echo # ui-kit > libs\ui-kit\README.md
echo # api-types > libs\api-types\README.md
echo # docs > docs\README.md
echo # scripts > scripts\README.md
echo # issue_templates > .gitlab\issue_templates\README.md
echo # merge_request_templates > .gitlab\merge_request_templates\README.md

echo.
echo 🌲 Arborescence du projet créée avec succès !
echo 📦 Tu peux maintenant initialiser ton monorepo (Nx ou Turborepo) et configurer tes apps.
pause
