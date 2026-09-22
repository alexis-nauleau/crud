
# ===== BASE DE DONNÉES POSTGRESQL =====

# Crée une nouvelle base de données PostgreSQL createdb mon_projet_crud

# Même commande avec le chemin complet (
& "C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres mon_projet_crud

# Liste toutes les bases de données existantes pour vérifier la création
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -l


# ===== CRÉATION DU PROJET NEXT.JS =====

# Génère un nouveau projet Next.js (TypeScript, App Router, Tailwind)
npx create-next-app@latest mon-projet-crud

# Entre dans le dossier du projet et démarre le serveur de dev
cd crud
npm run dev

# Installation de lucide react
npm i lucide-react

# ===== MISE À JOUR DE NODE.JS ET NPM =====

# Tentative de mise à jour de npm (a échoué, Node trop ancien)
npm install -g npm@12.0.2

# Nouvelle tentative après mise à jour manuelle de Node.js
npm install -g npm@latest



# ===== INSTALLATION ET CONFIGURATION DE PRISMA =====

# Installe le CLI de Prisma (outil de développement uniquement)
npm install prisma --save-dev

# Installe le client Prisma, utilisé réellement par le code
npm install @prisma/client

# Première init (a créé une config "agent skills" à cause d'une version RC)
npx prisma init

# Réinitialisation propre, en précisant PostgreSQL explicitement
npx prisma init --datasource-provider postgresql

# Test de connexion à la base (erreur normale car base vide à ce stade)
npx prisma db pull

# Crée la table dans PostgreSQL à partir du schema.prisma
npx prisma migrate dev --name init

# Migration Prisma
npx prisma migrate dev --name categories              ajout d'une colonne catégorie
npx prisma generate                 régénérer prisma


# Régénère manuellement le client Prisma (depuis la racine du projet)
npx prisma generate

# Installer l'extension Prisma Studio pour voir la base de donées
npx prisma studio
npx prisma migrate dev --name rename_Fait_to_fait 
npx prisma migrate dev --name rename_DateCreation_to_dateCreation 

# Faire une migration dans la base de donées
npx prisma migrate dev --name rename_fields



# ===== GESTION DES VULNÉRABILITÉS NPM =====

# Affiche le détail des vulnérabilités de sécurité détectées
npm audit

# Liste toutes les versions disponibles de Prisma sur npm
npm view prisma versions --json

# Vérifie quelle version précise de ces packages est installée
npm ls mysql2
npm ls deepmerge-ts

# Remplace la version RC instable par la dernière version stable connue
npm uninstall prisma
npm install prisma@7.10.0 --save-dev


# ===== CONFIGURATION DE LA CONNEXION BASE DE DONNÉES =====

# Installe le package de chargement des variables .env (requis par Prisma 7)
npm install dotenv

# ===== DRIVER ADAPTER POSTGRESQL =====

# Installe l'adaptateur PostgreSQL requis par la nouvelle architecture Prisma 7
npm install @prisma/adapter-pg pg
npm install --save-dev @types/pg

# ===== STRUCTURE DU PROJET =====

# Crée le dossier lib/, absent par défaut, pour y placer prisma.ts
mkdir lib

# ===== NETTOYAGE FINAL DES RÉSIDUS =====

# Suppression des derniers fichiers/dossiers liés à "agent skills"
rm -r .agents, .claude, .windsurf
rm AGENTS.md, CLAUDE.md
rm skills-lock.json
# Supprimer le cache
rm -r .next

# ===== GIT / GITHUB =====

# Vérifier si .env est dans GitIgnor
cat .gitignore

# Vérifier l'état de git
git status

# Séquence classique pour publier un projet local sur un dépôt GitHub distant
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ton-pseudo/nom-du-repo.git
git branch -M main
git push -u origin main

# Norme de commit 
feat(taches): ajoute la modification d'une tâche
fix: corrige le nom de colonne dateCreation
style(ui): applique un nouveau design sombre
chore: nettoie les fichiers résiduels
docs: met à jour le README
refactor(taches): extrait la logique de filtre dans une fonction séparée
style: applique un fond sombre
test(actions): ajoute un test pour createTache
perf(taches): limite le nombre de tâches chargées à 50 par page
# Merge sur master
git checkout master 
git merge dev →  le contenu de dev dans master
git push 



