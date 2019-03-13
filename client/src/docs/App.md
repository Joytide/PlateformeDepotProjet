---
title: App React component
route_components: Route, Switch, BrowserRouter, Nav
page_components : Home, Projects, Deposit, Connection, Partner, Login, Protected, EditDeposit, ForgetPass, ProjectPage
material-ui_components: Grid, Paper, Typography 
---

# App

Le composant principal de la partie client en React

## BrowserRouter

Définit les routes vers toutes les pages accessibles de l'application : { Home, Projects, Deposit, Connection, Partner, Login, Protected, EditDeposit, ForgetPass, ProjectPage } et vers la page par défault si on tente d'accéder à une page qui n'existe pas. A chaque Route est associé à un composant à appeller.

Ces routes sont ensuite principalement appellées par la barre de navigation "Nav".

## Global Props

La propriété de langue "lng" de l'application est définit globalement ici, puis transmise aux composants fils. Le changement de langue est géré par la fonction handleLngChange()
