# TP5

Le but de ce travail pratique est de vous familiariser avec le développement d'une application web full stack utilisant une base de données pour assurer la persistance des données. Pour ce faire, vous utiliserez la librairie React pour le côté client et vous vous connecterez à une base de données MongoDB à partir d'un environnement NodeJS/Express pour le côté serveur.

## Structure du projet

Pour ce travail pratique, le code source contient deux applications distinctes, soit une application ReactJS côté client (répertoire `client`) ainsi qu'une application NodeJS/Express côté serveur (répertoire `server`). L'application React est constituée de composants, d'écrans et de services qui se retrouvent respectivement dans les répertoires `client/src/components`, `client/src/screens` et `client/src/services`. Les fichiers statiques tels que les images et la page HTML de base se trouvent dans `client/public`. Au lancement de l'application, c'est le fichier `index.jsx` qui sera exécuté. 

Le serveur, pour sa part, comprend des contrôleurs, des services et des données par défaut que vous pourrez retrouver dans `server/controllers`, `server/services` et `server/data`. C'est le fichier `server.js` qui sera exécuté au lancement du serveur.

## Configuration de la base de données

Vous devez configurer une instance MongoDB pour la persistance de vos données. Vous devez utiliser le service [Cloud Atlas](https://www.mongodb.com/cloud/atlas) qui permet d'héberger des instances d'une taille de 512 MB gratuitement. 

Vous devez configurer votre instance avant de pouvoir effectuer le travail demandé. Un guide pour la configuration d'instances MongoDB avec Cloud Atlas est disponible sur le projet [GitHub du cours](https://github.com/LOG2440/MongoDB/blob/master/README.MD) de l'exemple sur MongoDB présenté en classe.

## Installation des librairies nécessaires

Pour pouvoir installer les librairies nécessaires pour le TP, vous aurez besoin de l'environnement d'exécution NodeJS et le gestionnaire de paquet npm. Vous pouvez les installer sur votre machine à partir du [lien suivant](https://nodejs.org/en/download/). On vous recommande d'installer la version _LTS_.

Pour installer les dépendances nécessaires, lancez la commande `npm install` dans la racine de chaque application (et donc deux fois au total). Ceci installera toutes les librairies définies dans le fichier `package.json`. Vous pouvez par la suite utiliser les libraires de test (pour le serveur) et les scripts définis dans le même fichier.

## Déploiement local

Lors du développement, vous pouvez faire un déploiement local de votre application ReactJS et de votre serveur Express avec la commande `npm start`. Notez bien qu'il faut executer la commande à la racine de chaque application (dans `/client` et `/server`) dans deux consoles distinctes afin que les deux fonctionnent en parallèle. 

L'application React sera lancée à l'adresse `localhost:5010` (ou `<votre-adresse IP>:5010`) et vous pourrez donc visualiser votre site web à cette même adresse. Le serveur sera déployé à l'adresse `localhost:5000` et commencera à écouter le port 5010.


## Exécution des tests

Le code source du serveur est accompagné d'une série de tests qui permettent de vérifier les interactions entre votre serveur et une instance MongoDB. Le code source des tests est disponible dans le répertoire `server/tests`.

Les tests unitaires utilisent la librairie _Jest_ que vous avez utilisée tout au long de la session. La librairie _MongoMemoryServer_ est utilisée pour remplacer une vraie instance de MongoDB par une instance _mocké_ pour les tests. Il est très important de se connecter à une base de données locale et contrôlée et non à votre instance MongoDB déployée en mode __production__ pendant vos tests.

Vous êtes fortement encouragés de consulter les tests fournis. Ils vous aideront à mieux comprendre le travail à faire et le bon comportement du serveur.

Vous pouvez exécuter les tests unitaires automatisés avec la commande `npm test`. Ceci exécutera les tests et produira un rapport dans votre terminal.

Auncun test n'est fourni pour le côté client de votre site web dans le cadre de ce travail pratique. Nous vous recommandons de tester manuellement les différentes fonctionnalités pour vous assurer de leur bon fonctionnement et vérifier que chaque élément UI de votre page web se situe au bon endroit et est inchangé depuis le dernier travail pratique.

## ESLint et Prettier

Le projet qui vous est fourni pour ce TP utilise un outil d'analyse statique, appelé __Linter__ , notamment l'outil __ESLint__ qui permet de définir un ensemble de règles à respecter afin de pouvoir applique une convention de codage unique pour le projet. Le projet utilise également un outil de formatage automatique __Prettier__ pour vous aider à formater votre code de façon consistante et à déceler les erreurs de style. 

Vous pourrez remarquer que lorsqu'un élément ne répond pas aux exigences et aux normes de style de codage, il causera un avertissement ou une erreur. Par défaut, le projet a été configuré pour corriger automatiquement les avertissements en lien avec le style lors de la sauvegarde d'un fichier si vous utilisez l'éditeur _VSCode_ et que vous avez téléchargé les extensions __ESLint__ et __Prettier__ sur ce même éditeur. Vous avez également la commande `lint` exécutable avec `npm run lint` qui permet d'analyser l'ensemble des fichiers source de vos projets (client et serveur) et vous présenter l'ensemble des problèmes détectés directement dans votre terminal.
