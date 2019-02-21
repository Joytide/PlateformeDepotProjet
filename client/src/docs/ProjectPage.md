---
title: ProjectPage page component
material-ui_components: Grid, Typography, Paper, Chip, IconButton, FavoriteIcon, ToolTip, WithStyles
---

# ProjectPage

Page affichant un unique projet en affichant entièrement sa description et ses mots-clés/années/majeures

## Display

Avec les composants typography et Grid, on organise le titre et les informations de manière responsive.

Les années/majeurs/mot-clés sont affichées sur la même ligne, en les mappant dans des composants 'Chip'

## Data fetching

Avec la fonction de React ComponentDidMount, récupération du projet sur le server en passant par son objectId qui a été passé en paramètre du composant ProjectPage. 
