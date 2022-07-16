# Procédure d'installation de la plateforme sur Debian avec Docker

## Liste des logiciels nécessaires pour le fonctionnement de la plateforme

* Docker et Docker-compose

Testé avec les versions suivantes:

Debian 10 / Docker 20.10.7 / Docker compose 1.29.2

Debian 11 / Docker 20.10.17 / Docker compose 2.6.0



## Installation

0. Installer [docker](https://docs.docker.com/engine/install/debian/) et [docker-compose](https://docs.docker.com/compose/install/compose-plugin/#installing-compose-on-linux-systems)
    This might require other commands such as:

    ```bash
    sudo usermod -aG docker $USER
    ```

1. Clone le [repo](https://github.com/Joytide/PlateformeDepotProjet)

2. Installer [certbot](https://certbot.eff.org/instructions?ws=nginx&os=debianbuster)

3. Generate and move certificates:
   ```bash
   sudo certbot certonly --nginx
   cd PlateformeDepotProjet/
   mkdir nginx
   sudo cp /etc/letsencrypt/live/projets-esilv.devinci.fr/fullchain.pem .
   sudo cp /etc/letsencrypt/live/projets-esilv.devinci.fr/privkey.pem .
   sudo chown -R debian:debian .
   ```

4. Dans les dossiers ``admin/src`` et ``client/src``, adapter les fichiers ``config.json``:

```
cp config.example.json config.json
```

Exemple d'un ``config.json`` en dev local:

```json
{
    "api": {
        "host": "http://localhost",
        "port": 3000
    }
}
```

Exemple d'un ``config.json`` en staging:

```json
{
    "api": {
        "host": "http://projets-esilv.devinci.fr",
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

3. Dans le dossier server, faire les modifications nécessaires (jetons API, config API) dans la config, ainsi que le mdp root user dans ``App.js``, ensuite:

```bash
cp config.example.json config.json
```

4. Changer les mots de passes pas défaut dans le ``docker-compose.example.yml ``, puis:
   ```bash
   cp docker-compose.example.yml docker-compose.yml
   ```

   

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
cd ~/PlateformeDepotProjet/nginx
rm *.pem
sudo cp /etc/letsencrypt/live/projets-esilv.devinci.fr/fullchain.pem .
sudo cp /etc/letsencrypt/live/projets-esilv.devinci.fr/privkey.pem .
sudo chown -R debian:debian .
# [follow command to rebuild and start react prod dockerfile]

```



## Dump and restore MongoDB collections



Restore: https://stackoverflow.com/questions/6770498/how-to-import-bson-file-format-on-mongodb
