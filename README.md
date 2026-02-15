# StockMyProducts

## Description
Projet étudiant : Application de gestion de stock (Inventory Management System).
Il s'agit d'une API REST sécurisée développée en Node.js permettant de gérer des produits, leur stock, leurs catégories ainsi que les mouvements d'entrée et de sortie.

## Objectifs
- Concevoir une API REST professionnelle.
- Implémenter un système d'authentification sécurisé (JWT).
- Gérer un stock avec cohérence et traçabilité.

## Pré-requis
Avant de commencer, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (ou disposer d'un accès à une base MongoDB Atlas)

## Installation

1. **Initialisation** (si vous partez de zéro) :
   ```bash
   npm init -y
   ```

2. **Installation des dépendances** :
   Lancez la commande suivante pour installer toutes les bibliothèques nécessaires (Express, Mongoose, JWT, Bcrypt, etc.) :
   ```bash
   npm install express mongoose dotenv jsonwebtoken bcrypt cors helmet express-rate-limit
   ```

3. **Installation des outils de développement** :
   Pour faciliter le développement (redémarrage automatique du serveur), installez `nodemon` :
   ```bash
   npm install --save-dev nodemon
   ```

   *Note : Si vous récupérez le projet via `git clone`, il suffit de lancer `npm install` à la racine pour tout installer automatiquement grâce au fichier `package.json`.*

## Configuration du projet

1. Créez un fichier `.env` à la racine du projet.
2. Ajoutez-y les variables d'environnement suivantes (exemple) :
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/stockmyproducts
   JWT_SECRET=votre_secret_super_securise
   ```

## Démarrage

- **Mode développement** (avec `nodemon`) :
  ```bash
  npm run dev
  ```

- **Mode production** :
  ```bash
  npm start
  ```

## Structure du projet (Recommandée)
L'architecture suit le modèle MVC (Models, Views/Routes, Controllers) :
- `models/` : Schémas Mongoose (User, Product, Category, StockMovement)
- `controllers/` : Logique métier
- `routes/` : Définition des endpoints API
- `middleware/` : Authentication (auth.js), validation, erreurs
- `server.js` (ou `index.js`) : Point d'entrée de l'application

## Technologies utilisées
- **Node.js** & **Express.js** : Serveur et API
- **MongoDB** & **Mongoose** : Base de données NoSQL
- **JWT** (JSON Web Tokens) : Authentification
- **Bcrypt** : Hachage des mots de passe
- **Helmet** & **Cors** : Sécurité et gestion des requêtes
- **Express-rate-limit** : Protection contre le brute-force
