# Procédure du passage à l'année suivante

1. Passer sur une nouvelle BDD en changant l'année dans le string de la variable `MONGO_DB_NAME` dans le fichier `server/api/helpers/mongo.js`

2. Faites un

```
docker-compose up --build
```

3. Recréer les utilisateurs (EGPE et responsables), les années, les majeures et les mot-clés.