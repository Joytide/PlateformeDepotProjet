# Procédure d'installation de la plateforme sur Debian 10

## Liste des logiciels nécessaires pour le fonctionnement de la plateforme

* NodeJS (testé avec la version 12.x)
* MongoDB (testé avec la version 4.2.x)
* Nginx (testé avec la version 1.14.x)
* Redis (testé avec la version )
* Wkhtmltopdf (testé avec la version )
* Pdfunite (testé avec la version )


## Installation de pré-requis (en tant que root)
```
apt update
apt install sudo curl git build-essential -y
```


## Installation de NodeJS

[Procédure d'installtion](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions)

Vérifier que Node est bien installé :
```
node -v
```
Vous devriez voir la version de NodeJS s'afficher (v12.x.x)



## Installation de MongoDB

[Procédure d'installation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/)

Vérifier que MongoDB est bien installé. Vous devriez voir que le service existe mais qu'il n'est pas démarré (inactive)
```
systemctl status mongod.service
```

Par défault le service gérant MongoDB est éteint et il ne s'allume pas au démarrage de la machine.
Pour le démarrer manuellement :
```
systemctl start mongod.service
```

Pour le faire démarrer automatiquement lorsque le serveur démarre :
```
systemctl enable mongod.service
```

## Installation de Nginx

```
sudo apt update
sudo apt install nginx -y
```

Vérifier que Nginx est bien installé :
```
nginx -v
```
Vous devriez voir la version de Nginx s'afficher.

### Installation de Redis

1. Télécharger, compiler et installer Redis
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
```


### Installation de Wkhtmltopdf

### Installatoin de PdfUnite