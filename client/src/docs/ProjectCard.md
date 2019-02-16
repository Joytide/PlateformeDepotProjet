---
title: ProjectCard component
material-ui_components: Card, CardContent, CardActions, Typography, Grid, Chip
route_components : Link
---

# Project Card

Composant qui affiche les informations textuelles d'un projet avec les 220 premiers caractères de la description.

## Display

Avec les composants typography et Grid, on organise le titre et les informations de manière responsive.

Les années/majeurs/mot-clés sont affichées sur la même ligne, en les mappant dans des composants 'Chip'

## Link

La carte de projet est clickable et mène vers la page composant ProjectPage. Cela est rendu possible par le composant 'Link' utilisé qui redirige vers la page /Projects/ObjectId du projet concerné.