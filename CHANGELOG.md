## 2.5.2 (13 Août 2021)

- :lipstick: Ajout de nouveau filtres de tri sur la liste des projets pour le status ainsi qu'un tri par mot-clé (`56aa6bd25c61ea42058dfd0ec0e712a6027e9391` et `c46da3aeec0a92c52fbe7a216fbc754d0f58dacf`)

- :sparkles: Ajout du status de validation internationale (`0789172da05ef1a8d2ee5252b8944f8e95c8b1df`)

## 2.5.1 (04 Août 2021)

- :sparkles: Panels ajout/suppression/modification des mots-clés pour les admins (`25ea358551a52bdffd1024b2b4a5297783591e20`)
- :sparkles: Champ sélection mots-clés lors du dépot de projet (`1f8062433cccff39366fb4af138c5409a1728d70`)
- :bug: Redirection vers liste au lieu de dashboard lors de la création d'années, users ou majeures (`637d3792281c25bc4e9d5fc9ebebc83929456781` et `c3345b93c83e746df4963e3f2a4a3c3d35572e99`)
- :sparkles: Champ booléen pour plus grande équipe et nombre étudiants lors du dépot de projet, mutuellement exclusif avec le champ plusieurs équipes (`1cf895bb6145478aa9b4a66d9dcff2cf229c4d98`)

# 2.5.0 (11 octobre 2021)

* :lipstick: Changement de l'ordre des colonnes pour l'importation des PRMs
* :lipstick: Message d'information sur la manière d'importer les PRMs
* :lipstick: Affichage des mots clefs associés aux PRMs directement dans la liste des PRMs
* :sparkles: Affichage du nombre de projets restants pour un PRM lors de l'assignation des PRMs aux équipes
* :sparkles: Télécharger les associations PRM / équipe en csv

## 2.4.2 (14 septembre 2020)
* :bug: Affichage du nom des mots clefs au lieu de leur identifiant dans le csv
* :bug: Il était impossible de télécharger le fichier zip contenant tous les projets au format pdf

## 2.4.1 (26 juin 2020)
* :sparkles: Possibilité d'insérer du html dans le markdown
* :lipstick: Changement du titre du bandeau sur la page listant les PRMs

## 2.4.0 (24 juin 2020)
* Possibilité d'éditer la page d'accueil depuis l'interface d'administration

## 2.3.3 (9 juin 2020)
* :bug: Affichage incorrect des projets qui sont confidentiels ou non

## 2.3.2 (9 juin 2020)
* :art: Changement du titre de la page de l'interface d'administration

## 2.3.1 (7 juin 2020)
* :bug: Correction des warnings react
* :bug: Cliquer sur un lien sur la page d'accueil ouvrait 2 fenêtres
* :lipstick: Affiche des notifications d'état lors du changement du mot de passe
* :art: Possibilité de trier la liste des équipes par année et numéro d'équipe ou par numéro de projet
* :sparkles: Nouveau filtre permettant de ne pas afficher les projets qui ont déjà été traités par le responsable de la majeure

## 2.3.0 (14 mai 2020)
* :sparkles: Intégration du module de gestion des PRMs

## 2.2.8 (5 mai 2020)
* :art: Redirection automatique vers la page de dépôt de projet lorsque l'utilisateur est déjà connecté
* :lipstick: Affichage des majeures en colonnes
* :sparkles: Les partenaires peuvent suggérer des mots clefs 
* :sparkles: Au moins deux mots clefs doivent être saisis pour qu'un projet puisse être validé

## 2.2.7 (29 avril 2020)
* :lipstick: Affichage de l'adresse et le numéro de téléphone du partenaire
* :art: Meilleure gestion des permissions lors de l'affichage du profil d'un utilisateur et sur le menu des réglages
* :bug: Bugfix: User cannot change his password


## 2.2.6 (28 avril 2020)
* Bugfix: le numéro de téléphone était devenu un champ requis
* Bugfix: le formulaire de soumission d'un projet était remis à zéro de manière inopinée

## 2.2.5 (28 avril 2020)
* Correction d'un bug empêchant parfois l'admin de voir le bouton pour supprimer une année / une majeure
* Correction d'un bug lors du chargement du message affiché lorsque la plateforme est fermée
* La taille maximale d'une adresse mail est maintenant de 254 caractères ([cf stackoverflow](https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address))
* Correction des messages d'erreurs qui étaient incorrectes lors de la saisie d'une adresse ou d'un numéro de téléphone trop longs
* Bouton pour commencer le dépôt de projet mieux mis en avant
* Validation du numéro de téléphone lors de la création d'un partenaire
* Longueur maximale d'une adresse augmentée à 500 caractères
* Message d'erreur lorsqu'un fichier est déposé et qu'il n'est pas accepté (mauvais type)
* Correction d'une erreur d'affichage de la date de dépôt d'un projet
* Longeur maximale des champs Compétences et Informations complémentaires lors du dépôt d'un projet passés à 1000 caractères
* Affichage d'un message plus explicite quant aux chanmps manquants lors de la saisie d'un projet
* Bugfix: Il est maintenant possible de cliquer sur Soumettre un projet pour soumettre un nouveau projet

## 2.2.4 (22 avril 2020)
* Correction de bug (mauvaise méthode utilisée pour créer une année)

## 2.2.3 (17 avril 2020)
* Plus d'usage des évènements pour gérer les projets
* Possibilité de choisir l'interface sur laquelle le serveur écoute

## 2.2.2 (14 avril 2020)
* Affichage du numéro de version sur la partie client
* Affichage du numéro de projet sur le profil projet
* Affichage du numéro de projet dans la liste des projets

## 2.2.1 (9 avril 2020)
* Compilation avec les bons fichiers de config

## 2.2.0 (9 avril 2020)
* Affichage de la date de dépot et de la date de la dernière modification effectuée sur la page projet
* Il est maintenant possible de déposer un projet confidentiel qui est uniquement visible par l'EGPE et les responsables des majeures concernnées
* Identification des utilisateurs pour autoriser le téléchargement d'un fichier
* Affichage de l'adresse et du numéro du téléphone du partenaire sur sa page de profil
* Possibilité d'éditer en markdown la page qui s'affiche lorsque la plateforme est fermée
* Detail de la description demandée au partenaire lors du dépôt d'un projet
* Ajouter des commentaires sur un projet
* Affichage du numéro de la version sur le bas de la page

## 2.1.0 (4 avril 2020)
* Les mots clefs sont rangés dans l'ordre croissant
* Les permissions pour l'interface admin sont gérées dans le fichier permissions.json

## 2.0.0 (3 avril 2020)
* L'API  respecte l'architecture [REST](https://fr.wikipedia.org/wiki/Representational_state_transfer)
* L'API renvoie des messages d'erreurs plus clairs et de manière plus consistante selon les points de l'API appelés
* L'interface client utlise la nouvelle API
* L'interface client gère les erreurs de manière plus transparente pour les utilisateurs
* L'interface admin utilise la nouvelle API
* L'interface admin gère les erreurs de manière plus transparente pour les utilisateurs