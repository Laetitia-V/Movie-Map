// <!-- API donnant accès à une base de données sur les films (acteur, nom, date de sortie etc..) -->
// <!-- Utilisation principale : données sur les films prochainement à l'affiche -->

//variable qui récupère la clé de l'API de themoviedb enregistrée dans config.js
var movie_key = config.MOVIE_KEY
				
var date = new Date()
var day = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
var j7 = new Date(date.setDate(date.getDate()+15))
var day7 = j7.getFullYear()+"-"+(j7.getMonth()+1)+"-"+j7.getDate()

var url = 'https://api.themoviedb.org/3/discover/movie?primary_release_date.gte='+day+'&primary_release_date.lte='+day7+'&api_key='+movie_key;
//recherche des films à sortir dans les 7 prochains jours				
fetch(url).then(function(response){
	response.json().then(function(film){ 
		
		var myFilm = document.getElementById('film')
		var boutons = document.getElementById('boutons')
						
		//affichage des 6 prochaines sorties 
		for (var i = 0; i < 6; i++){
			// Récupération des données title, release_date, poster_path, overview
			// test de la présence de l'affiche, pour ne pas afficher les films qui n'en ont pas
			if (film.results[i].poster_path != null){
				//récupération de l'id du film pour réinterroger l'api et obtenir plus de détails
				var id = film.results[i].id;
				var url2 = 'https://api.themoviedb.org/3/movie/'+id+'?api_key='+movie_key;
								
				var elt = document.createElement("div")
				elt.className = "slide"
														
				//recherche du genre, tag et lien pour affichage
				fetch(url2).then(function(reponse){
					reponse.json().then(function(id_film){ 
						console.log(id_film)
										
						var genre = id_film.genres[0].name;
						// <!-- elt.innerHTML += '<p>Genre : '+genre+'</p>'; -->
						var title=id_film.title;
						var date=id_film.release_date;
						
						if (id_film.homepage != null){
							var page = id_film.homepage;
							elt.innerHTML += '<p>Lien vers le site : '+page+'</p>';
						}
										
						if (id_film.tagline != ""){
							var tag = id_film.tagline;
							elt.innerHTML += '<p>Tag : '+tag+'</p>';
						}
										
						// <!-- var titreElt = document.createElement("h2"); -->
						// <!-- titreElt.textContent = film.results[i].title; -->
										
						var titleElt = document.createElement("h3");
						titleElt.textContent = 'Titre : '+title;
										
						var dateElt = document.createElement("h3");
						dateElt.textContent = 'date : '+date;
									
						var genreElt = document.createElement("h3");
						genreElt.textContent = 'Genre : '+genre
									
						elt.appendChild(titleElt);
						elt.appendChild(dateElt);
						elt.appendChild(genreElt);
										
						elt.innerHTML += '<img src=https://image.tmdb.org/t/p/w185_and_h278_bestv2'+id_film.poster_path+' title='+JSON.stringify(id_film.overview)+'>';
										
					});
									
				});
								
				// En commentaire pour l'instant car la bande annonce ne fonctionne pas	
				//var a = document.createElement('a');
				//var b = document.createElement("h3");
				//a.appendChild(b);

				// <!-- var linkText = document.createTextNode("Voir la bande annonce"); -->
				// <!-- a.appendChild(linkText); -->
								
				// <!-- a.href = "http://services.cineserie.com/v1/search/movies?q=Road%20to%20Christmas&release_date=2018-11-04"; -->
								
				
															
				var bouton = document.createElement("span");
				bouton.className = "dot"
				//ajouter onclick="currentSlide(i)" pour acceder au film en cliquant sur bouton (juste affichage mais fonctionnent pas)
											
				//elt.appendChild(a);
								
				// <!-- la fonction stringify caste le champ overview en chaine de caractère -->
				// <!-- Affichage de l'affiche du film et du résumé au survol de l'affiche -->
								
				// elt.innerHTML += '<img src=https://image.tmdb.org/t/p/w185_and_h278_bestv2'+film.results[i].poster_path+' title='+JSON.stringify(film.results[i].overview)+'>';
								
				myFilm.append(elt);
				boutons.append(bouton);
								
			}
		}			
	})
})

//Carousel : 
				
var slideIndex = 1;
showSlides(slideIndex);

//faire défiler les films dans le carousel par clic sur fleches
function plusSlides(n) {
  	showSlides(slideIndex += n);
}

//afficher un film par clic sur bouton
function currentSlide(n) {
  	showSlides(slideIndex = n);
}

//fonctionnalités d'affichage des films dans le carousel
function showSlides(n) {
  	var i;
  	var slides = document.getElementsByClassName("slide");
  	var dots = document.getElementsByClassName("dot");
  	if (n > slides.length) {slideIndex = 1} 
  	if (n < 1) {slideIndex = slides.length}
  	for (i = 0; i < slides.length; i++) {slides[i].style.display = "none"; }
  	for (i = 0; i < dots.length; i++) {
      	dots[i].className = dots[i].className.replace(" active", "");
  	}
  	slides[slideIndex-1].style.display = "block"; 
  	dots[slideIndex-1].className += " active";
}