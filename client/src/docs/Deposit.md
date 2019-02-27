---
title: Deposit Page component
route_components: Link
form_components : FilesInputs, KeyWords
material-ui_components: Paper, Button, CheckBox, FormControlLabel, MenuItem, CircularProgress, Stepper, Step, StepLabel, Typography, Grid
form_validator_components : TextValidator, ValidatorForm, FormControl, InputLabel, Select, Input
---

# Deposit

La page deposit sert aux partenaires de déposer un projet en le décrivant en plusieurs étapes, en récupérant principalement des informations textuels mais égalements des keywords et des fichiers joints qui sont gérés séparément dans les composants FilesInput et Keywords



## Stepping

La demande de dépot de projet est gérée en 4 étapes/pages différentes par le composant Stepper et l'indice stepIndex qui suit l'avancement


| Step 0 | Step 1|
|---|:----:|
|Affichage d'un texte de présentation de la procédure | Informations sur le partenaire : mail, nom entreprise, nom, prénom|
|Step 2 | Step 3 |
|Informations du projet : Titre, années concernées, majeurs concernées, description, mots clé, fichiers| Upload du projet - affiche si succès|


## Validators

Toutes les informations demandées textuellement sont obligatoires donc  chaque composant TextValidator utilisé est marqué 'required' et si l'utilisateur l'oublie, un message d'erreur s'affiche et sa progression est bloquée.

Une limite a également été posée sur le nombre de caractères maximums possibles par champ, avec la propriété 'maxStringLength', qui est par exeple fixée à 30 pour le nom du partenaire. Un message d'erreur correspondant s'affiche en cas de non respect de la contrainte.

Pour la demande de l'email, sa forme est vérifiée par la propriété 'isEmail'

## Upload

L'upload du groupe d'informations passe par la fonction 'handleSubmit' qui vérifie si le dépot de projet est bien marqué comme fini et crée un objet form contenant toutes les informations rentrées ainsi que le chemin d'accès aux fichiers joints. L'upload est ensuite géré par la méthode POST qui passe l'objet form au server.