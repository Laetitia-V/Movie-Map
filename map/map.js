// function d'affichage de la carte
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
//parse du JSON si locations rempli
if (sessionStorage.getItem('initStorage') === 'true') {
    locations = JSON.parse(sessionStorage.getItem('locations'));

}

