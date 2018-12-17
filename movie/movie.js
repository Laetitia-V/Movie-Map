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
		
		var myFilm = document.getElementById('films')
		var boutons = document.getElementById('boutons')
						
		//affichage des prochaines sorties 
		for (var i = 0; i < 30; i++){
			// Récupération des données title, release_date, poster_path, overview
			// test de la présence de l'affiche, pour ne pas afficher les films qui n'en ont pas
			if (film.results[i].poster_path != null){
				//récupération de l'id du film pour réinterroger l'api et obtenir plus de détails
				var id = film.results[i].id;
				var url2 = 'https://api.themoviedb.org/3/movie/'+id+'?api_key='+movie_key;
																						
				//recherche du genre, tag et lien pour affichage
				fetch(url2).then(function(reponse){
					reponse.json().then(function(id_film){ 
						console.log(id_film)
						var elt = document.createElement("div")
						elt.className = "film"
						
						elt.innerHTML += '<img src=https://image.tmdb.org/t/p/w185_and_h278_bestv2'+id_film.poster_path+' title='+JSON.stringify(id_film.overview)+'>';
										
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
										
						var titleElt = document.createElement("h2");
						titleElt.textContent = title;
										
						var dateElt = document.createElement("h3");
						dateElt.textContent = 'Date : '+date;
									
						var genreElt = document.createElement("h3");
						genreElt.textContent = 'Genre : '+genre
								
						elt.appendChild(titleElt);
						elt.appendChild(dateElt);
						elt.appendChild(genreElt);
										
						
						myFilm.append(elt);				
					});
									
				});
								
								
			}
		}			
	})
})
