---
title: Nav component
global_components: i18n, Link
material-ui_components: AppBar, Toolbar, IconButton, MenuItem, Menu, withStyles, AccountCircle, MoreIcon, Button
---

# Nav

La barre de navigation statique de la plateforme, qui propose l'accès aux différentes pages du site selon l'ulitilisateur connecté.

## Links

En utilisant le composant AppBar de material-ui, on définit une liste de Link à toutes les pages dont on donne accès par la barre de navigation. Chaque adresse d'un Link doit correspondre à une route définie dans App.js

L'accès aux pages de connexion pour les élèves et de lien oublié pour les partenaires se fait par un sous-menu inclu dans "AccountCircle IconButton".

## Gestion Mobile

le passage en version mobile fait rentrer tous les liens dans un sous-menu dépliable. 

## Style

L'affichage s'adapte à la nature de l'écran c'est à dire s'il s'agit d'une interface mobile ou non, et switch entre les groupes de composants renderMenu et renderMobileMenu.