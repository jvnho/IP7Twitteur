- Ouvrir un terminal dans le répertoire courant, dans l'interpréteur mySQL, entrez `source tables.sql` (si vous êtes bien à la racine du projet) ce qui devrait créer la base de données et ses données
associés, vous pouvez fermer mySQL.

- Ouvrir un terminal dans le répertoire courant, entrez `npm install` pour installer toutes les dépendances nécessaires au fonctionnement du site.

- Ouvrir `app.js` avec votre éditeur de texte préféré, à partir de la **ligne 36**, modifiez par vos identifiants mySQL si nécessaires en l'occurrence `host, user et password`
 (il se peut que le programme rencontre un problème avec la BDD durant l'exécution, si c'est le cas, remplacez `127.0.0.1 par localhost`)

- Vous pouvez maintenant utiliser le site en entrant `node app.js`

- Ouvrir un navigateur internet (Chrome, Mozilla ou Brave de préférence) et entrez `http://localhost:8080/` 

- Vous pouvez maintenant vous connecter au site, vous avez la possibilité de soit créer un compte ou utiliser un compte existant, id: client, mdp: client