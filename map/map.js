//fonction d'affichage de la carte
function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 2,
            center: {lat: 37.024, lng: -100.887}
        });

        // Etiquettes pour les markers
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // Ajout des markers
        var markers = locations.map(function (location, i) {
            return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length]
            });
        });

        // Ajout des markerClusters pour grouper les markers
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'images/m'});
			
		
}
	
//variables qui récupèrent les clés des API enregistrées dans config.js
var movie_key = config.MOVIE_KEY;
var map_key = config.MAP_KEY;

//initialisation des variables 
var url_movie, i, idFilm, url_film, pays, url_paysFilm, map, marker;

var tableau_film = new Array();

// fonction asynchrone qui retourne une promesse de tableau_film (qui stocke les identifiants de films)
async function retrieve_movies(page)
{
	//recherche des films sortis en 2018 pour affichage par pays de production
	url_movie = 'https://api.themoviedb.org/3/discover/movie?primary_release_year=2018&page='+page+'&api_key=c5f2613afb0ffca9cfa80e9bb8221eb6';
	console.log(url_movie);
	return fetch(url_movie).then(function (response) {
		return response.json()
	}).then(function (film) {
			console.log(film)
			for (var i=0; i<film.results.length;i++){
				tableau_film.push(film.results[i].id);
			}

			return Promise.resolve(tableau_film);
			
	});
	
}

// limite à 50 pages de films 
async function get_results (){
	for (var page = 1; page < 51; page++){
		res = await retrieve_movies(page)
		
	}
	return res;
}
// renvoie le résultat des 50 pages de films pour traitement de recherche des coordonnées des pays de production
get_results().then(function(tableau_film){
	
	console.log(tableau_film);
	for (i = 0; i < tableau_film.length; i++) {

			//recherche du pays de production des films à partir de l'id
			idFilm = tableau_film[i];
			
			url_film = 'https://api.themoviedb.org/3/movie/'+idFilm+'?api_key='+movie_key;
			console.log(url_film)
			fetch(url_film).then(function (reponse) {
				reponse.json().then(function (id_film) {
					
					//recherche des coordonnées GPS du pays à partir de son code pays (US, DE,..) en utilisant l'api google geocode
					pays = id_film.production_countries[0].iso_3166_1;
					url_paysFilm = 'https://maps.googleapis.com/maps/api/geocode/json?address='+pays+'&key='+map_key+'&sensor=false';

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
															
							console.log(url_paysFilm);
							console.log(locations);
							console.log('---------------');
						});
					});
				});
			}); 
			
	}
	// remise à zéro des variables de session pour éviter de doubler à chaque refresh
	var locations = [];
	sessionStorage.setItem('locations', locations);
	sessionStorage.setItem('initStorage', 'true');
});


//Si pas de sessionStorge valide faire F5
//if (sessionStorage.getItem('dataStorage') === 'true') {
if (sessionStorage.getItem('initStorage') === 'true') {
	locations = JSON.parse(sessionStorage.getItem('locations'));

} else {
	alert('Faire F5 pour obtenir les Markercluster avec le nombre de films par pays de production');
	
}

