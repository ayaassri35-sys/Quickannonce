# 🚀 QuickAnnonce

> Plateforme web de petites annonces moderne développée en **SPA (Single Page Application)**, permettant aux utilisateurs de consulter, rechercher et publier des annonces dans plusieurs catégories.

---

## 📌 Présentation

**QuickAnnonce** est une application web full stack conçue pour la gestion d’annonces en ligne.  
Elle permet aux utilisateurs de :

- consulter des annonces
- rechercher par catégorie ou mot-clé
- créer un compte et se connecter
- publier leurs propres annonces
- gérer la modération via un espace d’administration

Le projet couvre plusieurs catégories populaires :

- 🏠 Immobilier
- 🚗 Véhicules
- 👗 Mode
- 💄 Beauté
- 💻 Électronique

L’application a été pensée sous forme de **SPA**, afin d’offrir une navigation rapide, fluide et moderne sans rechargement complet des pages.

---

## 🎯 Objectifs pédagogiques

Ce projet m’a permis de mettre en pratique plusieurs compétences en développement web full stack, notamment :

- conception d’une application **SPA**
- organisation d’un projet **front-end / back-end**
- création d’un système d’authentification
- sécurisation des routes avec **JWT**
- gestion de données avec **MongoDB**
- création d’une API REST avec **Node.js** et **Express.js**
- mise en place d’un système de modération d’annonces
- développement d’une interface d’administration

---

## ✨ Fonctionnalités principales

### 🔍 Affichage et recherche d’annonces
Les utilisateurs peuvent consulter les annonces publiées et effectuer des recherches selon :

- le titre
- la catégorie
- des mots-clés

### 👤 Inscription et connexion utilisateur
Le projet inclut un système d’authentification **front only** pour l’interface utilisateur, avec gestion des accès aux fonctionnalités protégées.

### 🔐 Authentification avec JWT
L’authentification est sécurisée grâce à **JWT (JSON Web Token)**, ce qui permet :

- d’identifier l’utilisateur connecté
- de protéger certaines routes
- de sécuriser les actions sensibles comme la publication ou l’administration

### 📝 Publication d’annonces
Un utilisateur authentifié peut publier une annonce avec :

- un titre
- une description
- un prix
- une catégorie
- des images

### ✅ Modération des annonces
L’administrateur peut gérer les annonces soumises et décider de :

- accepter une annonce
- refuser une annonce
- supprimer une annonce

### 🛠️ Administration
Un espace d’administration permet également de :

- gérer les utilisateurs
- supprimer un utilisateur
- consulter des routes de debug pour les tests

---

## 🧰 Technologies utilisées

### Front-end
- **React.js**
- **HTML5**
- **CSS3**
- **JavaScript**
- Architecture **SPA**

### Base de données
- **MongoDB**

### Authentification
- **JWT (JSON Web Token)**

###🧪 Routes de debug administration

Les routes suivantes sont disponibles pour les tests et le développement :

Debug général admin
GET http://localhost:3001/api/admin/debug
Liste des utilisateurs
GET http://localhost:3001/api/admin/debug/users
