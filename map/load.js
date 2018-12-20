// permet de charger la carte dès que l'on rentre dans index.html (se charge en arrière plan)


//variables qui récupèrent les clés des API enregistrées dans config.js
var movie_key = config.MOVIE_KEY;
var map_key = config.MAP_KEY;

//initialisation des variables
var url_movie, i, idFilm, url_film, pays, url_paysFilm, map, marker;

if (sessionStorage.getItem('initStorage') !== 'true') {

    var locations = [];
    sessionStorage.setItem('locations', JSON.stringify(locations));
    sessionStorage.setItem('initStorage', 'true');

	//limite du nombre de pages pour éviter des temps de chargement trop long
    for (var page = 1; page < 51; page++) {

        url_movie = 'https://api.themoviedb.org/3/discover/movie?primary_release_year=2018&page='
            + page
            + '&api_key=c5f2613afb0ffca9cfa80e9bb8221eb6';
        console.log(url_movie);
        fetch_function(url_movie);

    }
}

function fetch_function(url_movie) {
    //alert(url_movie);
    fetch(url_movie).then(function (response) {
        
        console.log(url_movie)
        //Récupération des données json
        response.json().then(function (film) {
            
            for (i = 0; i < film.results.length; i++) {
                //recherche du pays de production des films à partir de l'id
                idFilm = film.results[i].id;

                url_film = 'https://api.themoviedb.org/3/movie/' + idFilm + '?api_key=' + movie_key;

                fetch(url_film).then(function (reponse) {
                    reponse.json().then(function (id_film) {

                        //recherche des coordonnées GPS du pays à partir de son code pays (US, DE,..) en utilisant l'api google geocode
                        pays = id_film.production_countries[0].name;
                        url_paysFilm = 'https://maps.googleapis.com/maps/api/geocode/json?address='
                            + pays + '&key='
                            + map_key + '&sensor=false';

                        fetch(url_paysFilm).then(function (resp) {
                            resp.json().then(function (gps) {
                                //remplissage du tableau locations contenant les coordonnées GPS (lat, lng)
                                locations = JSON.parse(sessionStorage.getItem('locations'));

                                locations.push({
                                    lat: gps.results[0].geometry.location.lat,
                                    lng: gps.results[0].geometry.location.lng
                                });
                                // le problème avec cette suite de fetch est d'extraire locations d'où le sessionStorage
                                sessionStorage.setItem('locations', JSON.stringify(locations));
                                sessionStorage.setItem('initStorage', 'true');

                                //console.log(url_film);
                                console.log(locations);
                                console.log('---------------');
                            });
                        });
                    });
                });
            }
       
        });
    });

}

//parse du JSON si locations rempli
if (sessionStorage.getItem('initStorage') === 'true') {
    locations = JSON.parse(sessionStorage.getItem('locations'));

}
