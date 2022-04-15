# Procédure d'installation de la plateforme sur Debian 10 avec Docker

## Liste des logiciels nécessaires pour le fonctionnement de la plateforme

* Docker (testé avec la version 20.10.7)
* Docker-compose (testé avec la version 1.29.2)

## Installation

0. Installer docker et docker-compose:
   https://docs.docker.com/engine/install/debian/
   https://docs.docker.com/compose/install/ 

1. Clone le repo

2. Dans les dossiers admin et client, adapter les fichiers ``config.json``:

```
mv config.example.json config.json
```

Exemple d'un ``config.json`` en dev:

```json
{
    "api": {
        "host": "http://localhost",
        "port": 3000
    }
}
```

Exemple d'un ``config.json`` en prod:

```json
{
    "api": {
        "host": "https://projets-esilv.devinci.fr",
        "port": 443
    }
}
```

3. Dans le dossier server, faire les modifications nécessaires (jetons API, config API) dans la config et ensuite:

```
mv config.example.json config.json
```

Changer le mot de passe par défaut de l'admin dans ``server/app.js``



4. Changer les mots de passes pas défaut dans le docker-compose.yml

5. Compiler et lancer la plateforme

```bash
docker-compose up --build
```

6. Relancer la plateforme après un ```docker-compose up```

```bash
docker-compose start
```

7. Lancer la plateforme en recompilant

```bash
docker-compose up --build
```

8. Si prod, stopper les client et server, puis lancer le multi-stage dockerfile présent à la racine:

```bash
docker build -t react-app -f Dockerfile.prod .
docker run -dp 443:443 react-app 
```



## Développement

- Utiliser ``docker system prune`` fréquemment car la commande apt upgrade du docker de l'api prend de la place.

api: http://localhost:3000

front admin: http://localhost:3001

front client http://localhost:3002

mongo-express: http://localhost:8081

Default user: ``root@member.com``:``azerT1234``




## Update certificat


```bash

docker stop [react-app]
sudo certbot certonly --force-renew -d projets-esilv.devinci.fr
# 1 standalone
cd ~/PING/nginx
rm *.pem
sudo cp /etc/letsencrypt/live/projets-esilv.devinci.fr/fullchain.pem
sudo cp /etc/letsencrypt/live/projets-esilv.devinci.fr/privkey.pem
sudo chown -R clovis:clovis .
# [follow command to rebuild and start react prod dockerfile]

```
