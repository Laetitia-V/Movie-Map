var locations = [];
var date = new Date();
var j15 = new Date(date.setDate(date.getDate()+15))
var day15 = j15.getFullYear()+"-"+(j15.getMonth()+1)+"-"+j15.getDate()
	
//limite des 40 films => 2 pages
for (var p = 1; p < 3; p++){	 
			
	//variables qui récupèrent les clés des API enregistrées dans config.js
	var movie_key = config.MOVIE_KEY;
	var map_key = config.MAP_KEY;
	//recherche des films des 15 prochains jours
	var url = 'https://api.themoviedb.org/3/discover/movie?primary_release_date.gte='+day+'&primary_release_date.lte='+day15+'&api_key='+movie_key;

	fetch(url).then(function(response){
		response.json().then(function(film){ 
			console.log(film)
	
			//films sortis en 2018
			for (var i = 0; i < film.results.length; i++){
				//recherche du pays de production des films à partir de l'id
				var id = film.results[i].id;
				var url2 = 'https://api.themoviedb.org/3/movie/'+id+'?api_key='+movie_key;

				fetch(url2).then(function(reponse){
					reponse.json().then(function(id_film){ 
						console.log(id_film)
					
						// test de l'existence du pays de production
						if (id_film.hasOwnProperty('production_countries')){											
							//recherche des coordonnées GPS du pays à partir de son code pays (US, DE,..) en utilisant l'api google geocode
							var pays = id_film.production_countries[0].iso_3166_1;
							var url3 = 'https://maps.googleapis.com/maps/api/geocode/json?key='+map_key+'&address='+pays+'&sensor=false'

							fetch(url3).then(function(resp){
								resp.json().then(function(gps){
									//remplissage du tableau locations contenant les coordonnées GPS (lat, lng)
									locations.push({lat:gps.results[0].geometry.location.lat, lng:gps.results[0].geometry.location.lng});
									console.log(locations);
									return locations;
								});											
							});										
						}
					});
				});						
			}
		});
	});
}

function initMap() {
	//console.log(locations)
	var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 3,
	center: {lat: 48.85, lng: 2.34}
});

// Create an array of alphabetical characters used to label the markers.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Add some markers to the map.
// Note: The code uses the JavaScript Array.prototype.map() method to
// create an array of markers based on a given "locations" array.
// The map() method here has nothing to do with the Google Maps API.
var markers = locations.map(function(location, i) {
	return new google.maps.Marker({
		position: location,
		label: labels[i % labels.length]
	});
});

// Add a marker clusterer to manage the markers.
var markerCluster = new MarkerClusterer(map, markers,
				{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js'});
		}
		
//appel de la fonction de création des markers
src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js"
		