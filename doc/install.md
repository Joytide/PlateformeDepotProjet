# Procédure d'installation de la plateforme sur Debian 10 avec Docker

## Liste des logiciels nécessaires pour le fonctionnement de la plateforme

* Docker (testé avec la version 20.10.7)
* Docker-compose (testé avec la version 1.29.2)

## Installation

0. Installer docker et docker-compose:
https://docs.docker.com/engine/install/debian/
https://docs.docker.com/compose/install/ 

1. Dans les dossiers admin et client, faire les modifications nécessaires (jetons API, config API) dans la config et ensuite:

```
mv config.example.json config.json
```

2.  Changer les mots de passes pas défaut dans le docker-compose.yml


3. Compiler et lancer la plateforme

```
docker-compose up
```

4. Relancer la plateforme après un ```docker-compose up```

```
docker-compose start
```

5. Lancer la plateforme en recompilant

```
docker-compose up --build
```

api: http://localhost:3000

front admin: http://localhost:3001

front client http://localhost:3002

mongo-express: http://localhost:8081



## Développement

- Utiliser ``docker system prune`` fréquemment car la commande apt upgrade du docker de l'api prend de la place.


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