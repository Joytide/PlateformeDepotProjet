## 2.2.6 ()
* Meilleure gestion des permissions lors de l'affichage du profil d'un utilisateur

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