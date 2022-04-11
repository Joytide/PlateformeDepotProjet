# Procédure du passage à l'année suivante

1. Passer sur une nouvelle BDD en changant l'année dans le string de la variable `MONGO_DB_NAME` dans le fichier `server/api/helpers/mongo.js`

2. Faites un

```bash
docker-compose up --build
```

3. Recréer les utilisateurs (EGPE et responsables), les années, les majeures et les mots-clés.




## Procédure pour renouveller le certificat SSL
New keys will be in: ``/etc/letsencrypt/live/projets-esilv.devinci.fr/fullchain.pem``

```bash
docker stop $(reactapp)
sudo certbot renew --cert-name projets-esilv.devinci.fr --dry-run
# Move new keys in archive to ./nginx
# Update dvp_docker.conf for new keys
# Follow build and run steps in prod dockerfile
```