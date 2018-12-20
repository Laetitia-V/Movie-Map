# Movie n' Map
Projet du module "Intégration de données connectées" par Maryse Nougaillac, Alexia Brocero et Laëtitia Viau.

https://laetitia-v.github.io/Movie-Map/

**Description du projet** : Création d'un mashup permettant de connaitre les films qui vont sortir dans les 7 prochains jours et de visualiser sur une carte les pays de production des films sortis en 2018. L'affichage sur la carte Google se fait à travers des markers (point affichés sur une carte) et des markerclusters qui regroupent les markers d'un même point. **Faire un refresh de la page si pas de données affichées.**

**Utilisation de 3 API :**

1) **themoviedb** pour la recherche des films sortis sur une période donnée :       
-> les films des 7 prochains jours pour la page d'accueil : avec affiche de film, titre du film, genre, date de sortie, lien vers le site officiel, tag et **résumé du film au survol de l'affiche**    
-> tous les films sortis en 2018 (avec une boucle sur 50 pages de 20 films pour ne pas avoir des temps de réponse trop long) pour afficher le nombre de films produit par pays   

Exemple d'url utilisée dans un fetch pour rechercher des films entre 2 dates de sortie :             
https://api.themoviedb.org/3/discover/movie?primary_release_date.gte='+day+'&primary_release_date.lte='+day7+'&api_key='+movie_key;
     
     
Nous avons ensuite utilisé une autre fetch pour avoir le détail des films (genre, pays de production par exemple) à partir de l'identifiant du film à l'aide de l'url suivante :
https://api.themoviedb.org/3/movie/'+id+'?api_key='+movie_key;

Documentation : https://www.themoviedb.org/documentation/api          

2) **Google API geocode** pour connaitre les coordonnées GPS d'un pays à partir d'un nom de pays en utilisant l'url suivante :       
https://maps.googleapis.com/maps/api/geocode/json?address='+pays+'&key='+map_key+'&sensor=false';

Documentation : https://www.vertuoz.fr/fr/blog/9265-utiliser-api-geocoding-google-pour-recuperer-des-coordonnees-gps.html    

Utilisation de la librairy markerclusterer.js et des images png pour afficher les markers et clustermarkers sur la carte
A chaque film sorti en 2018, on recherche son pays de production, puis les coordonnées GPS du pays que l'on stocke dans le tableau "locations".
Ce tableau est ensuite utilisé dans la fonction InitMap() qui sert à afficher les markers correspondants aux coordonnées stockées dans le tableau.

3) **Google API MAPS** pour l'affichage de la carte du monde et des markers 

Documentation : https://developers.google.com/maps/documentation/javascript/tutorial

**ATTENTION** : la clé d'API google a une durée limitée dans le temps (usage gratuit pendant le mois de décembre)
