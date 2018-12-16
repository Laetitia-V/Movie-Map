function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 2,
            center: {lat: 37.024, lng: -100.887}
        });

        // Create an array of alphabetical characters used to label the markers.
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.
        var markers = locations.map(function (location, i) {
            return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length]
            });
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'images/m'});
    }

// initialisation des variables date pour rechercher les films qui vont sortir dans les 15 prochains jours
var date = new Date();
var day = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
var j15 = new Date(date.setDate(date.getDate()+15))
var day15 = j15.getFullYear()+"-"+(j15.getMonth()+1)+"-"+j15.getDate()
	

			
//variables qui récupèrent les clés des API enregistrées dans config.js
var movie_key = config.MOVIE_KEY;
var map_key = config.MAP_KEY;

//initialisation des variables 
let url_movie, i, idFilm, url_film, pays, url_paysFilm, map, infowindow, marker, locations;

//recherche des films des 15 prochains jours
url_movie = 'https://api.themoviedb.org/3/discover/movie?primary_release_date.gte='+ day + '&primary_release_date.lte='+ day15 + '&api_key='+movie_key;

	fetch(url_movie).then(function (response) {
	if (response.status === 200) {
		
		//Récupération des données json

		response.json().then(function (film) {
			//films à sortir les 15 prochains jours
			for (i = 0; i < film.results.length; i++) {

				//recherche du pays de production des films à partir de l'id
				idFilm = film.results[i].id;

				url_film = 'https://api.themoviedb.org/3/movie/'+idFilm+'?api_key='+movie_key;

				fetch(url_film).then(function (reponse) {
					reponse.json().then(function (id_film) {
						
						//recherche des coordonnées GPS du pays à partir de son code pays (US, DE,..) en utilisant l'api google geocode
						pays = id_film.production_countries[0].iso_3166_1;
						url_paysFilm = 'https://maps.googleapis.com/maps/api/geocode/json?address='+pays+'&key='+map_key+'&sensor=false';

						//initialisation de la session storage pour locations
                        if (sessionStorage.getItem('initStorage') !== 'true') {
							locations = [];
							sessionStorage.setItem('locations', locations);
							sessionStorage.setItem('initStorage', 'true');
							sessionStorage.setItem('initStorage', 'false');
                        }

						fetch(url_paysFilm).then(function (resp) {
							resp.json().then(function (gps) {
								//remplissage du tableau locations contenant les coordonnées GPS (lat, lng)
								locations.push({
									lat: gps.results[0].geometry.location.lat,
									lng: gps.results[0].geometry.location.lng
								});
								// le problème avec cette suite de fetch est d'extraire locations d'où le sessionStorage
								sessionStorage.setItem('locations', JSON.stringify(locations));
								sessionStorage.setItem('initStorage', 'true');
								sessionStorage.setItem('dataStorage', 'true');
								
								console.log(url_paysFilm);
								console.log(locations);
								console.log('---------------');
							});
						});
					});
				});
			}
		});
	}
});

//Si pas de sessionStorge valide faire F5
if (sessionStorage.getItem('dataStorage') === 'true') {
	locations = JSON.parse(sessionStorage.getItem('locations'));

} else {
	alert('Refresher the page with F5');

}
