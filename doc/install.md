# Procédure d'installation de la plateforme sur Debian 10

## Liste des logiciels nécessaires pour le fonctionnement de la plateforme

* NodeJS (testé avec la version 12.x)
* MongoDB (testé avec la version 4.2.x)
* Nginx (testé avec la version 1.14.x)
* Redis (testé avec la version 6.0.5)
* Wkhtmltopdf (testé avec la version 12.5)
* Pdfunite (testé avec la version )

# Table des matières

- [Pré-requis](#Pré-requis)
- [NodeJS](#NodeJS)
- [MongoDB](#MongoDB)
- [Redis](#Redis)
- [Wkhtmltopdf](#Wkhtmltopdf)
- [Pdfunite](#Pdfunite)
- [Plateforme](#Plateforme)
- [Nginx](#Nginx)

## Pré-requis 

```
sudo apt update
sudo apt upgrade
sudo apt install sudo curl git build-essential -y
```

## NodeJS

1. Installation

[Procédure d'installtion](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions)

2. Vérification

Vérifier que Node est bien installé :
```
node -v
```
Vous devriez voir la version de NodeJS s'afficher (v12.x.x)


## MongoDB

1. Installation

[Procédure d'installation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/)

2. Vérification

Vérifier que MongoDB est bien installé. Vous devriez voir que le service existe mais qu'il n'est pas démarré (inactive)
```
systemctl status mongod.service
```

3. Configuration

Par défault le service gérant MongoDB est éteint et il ne s'allume pas au démarrage de la machine.
Pour le démarrer manuellement :
```
systemctl start mongod.service
```

Pour le faire démarrer automatiquement lorsque le serveur démarre :
```
systemctl enable mongod.service
```

## Redis

1. Installation

```
wget http://download.redis.io/releases/redis-6.0.5.tar.gz
tar xzf redis-6.0.5.tar.gz
cd redis-6.0.5
make
sudo make install
```

2. Configuration de redis

```
mkdir /var/lib/redis
mkdir /var/log/redis
mkdir /etc/redis
chown redis /var/lib/redis
chown redis /var/log/redis
chown redis /etc/redis

cd /etc/redis 
sudo -u redis wget https://raw.githubusercontent.com/tbornon/PING/master/doc/config/redis.conf
```

3. Création d'un service pour Redis

```
cd /etc/systemd/system
wget 
cd /etc/systemd/system
wget https://raw.githubusercontent.com/tbornon/PING/master/doc/config/redis.service
systemctl enable redis
systemctl start redis
```

4. Tester l'installation

```
redis-cli ping
```

Si l'installation a été correctement faite, le résultat devrait être pong


## Wkhtmltopdf

1. Installation

```
wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.buster_amd64.deb
sudo dpkg -i wkhtmltox_0.12.5-1.buster_amd64.deb 
sudo apt -f install
```

2. Vérification

Si l'installation s'est déroulée correctement, la commande suivante devrait afficher la version 12.5
```
wkhtmltopdf -V
```

## PdfUnite

1. Installation

```
sudo apt install poppler-utils
pdfunite -v
```

Devrait afficher la version de pdfunite si l'installation s'est déroulée correctement

## Plateforme

1. Téléchargement
```
cd /var/www
git clone https://github.com/tbornon/PING.git --depth 1
chown -R www-data:www-data PING
```

2. Configuration

Pour la configuration des mails, vous devez avoir : 
* L'adresse mail qui envoie les mails
* Le port auquel il faut se connecter pour envoyer les mails (par defaut 587)
* L'adresse du serveur mail
* Le nom d'utilisateur lié à l'adresse mail
* Le mot de passe de l'adresse mail

Pour la configuration de la base de données :
* Adresse de la base de données (par défaut localhost)
* Port de la base de données (par défaut 27017)
* Le nom de la base de données (:warning: En changeant le nom de la base de données, le contenu de la plateforme sera remis à zéro)

Pour la configuration du client :
* Host : adresse du site (par exemple projets-esilv.devinci.fr)
* Port : port du site (par défault 443 pour HTTPS)
* Protocol : http ou https (par défaut HTTPS)

Pour la configuration de JWT :
* Secret : Clef utilisée pour crypter les tokens clients. Il est conseillé que la clef soit la plus longue et aléatoire possible

Il est déconseillé de changer la configuration par défaut de l'api.

```
cd /var/www/PING/server/
cp config.exemple.json config.json
nano config.json # puis éditer la configuration
```

3. Installation de pm2

PM2 permet de garder la plateforme en ligne. Il la redémarre si elle plante et la démarre automatiquement au démarrage du serveur.

``` 
sudo npm i -g pm2
cd /var/www/PING/server
sudo -u node pm2 start app.js
sudo -u node pm2 save
sudo -u node pm2 startup
# copier la commande donnée pour que le service soit créé
```

Pour vérifier que l'installation s'est déroulée correctement, redémarrer le serveur puis vérifier que l'application est toujours lancée.

```
sudo -u node pm2 list
```

## Nginx

1. Installation

```
sudo apt update
sudo apt upgrade
sudo apt install nginx -y
```

2. Vérification

Vérifier que Nginx est bien installé :
```
nginx -v
```
Vous devriez voir la version de Nginx s'afficher.

3. Génération des ceritifcats SSL

cf [Certbot](https://certbot.eff.org/lets-encrypt/debianbuster-nginx)

4. Configuration 


```
cd /etc/nginx/sites-available
wget https://github.com/tbornon/PING/blob/master/doc/config/dvp.conf # mettre à jour l'emplacement des certificats SSL si besoin
ln -s /etc/nginx/sites-available/dvp.conf /etc/nginx/sites-enabled
nginx -t # si nginx ne détecte aucun problème, poursuivre. Sinon il faut régler le problème
service nginx start
```



# Tester
Vérfier que la plateforme fonctionne correctement