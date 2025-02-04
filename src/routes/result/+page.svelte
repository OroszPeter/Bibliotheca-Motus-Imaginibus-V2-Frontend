<script>
  import { onMount } from 'svelte';
  import { API_Url } from '../../store.js';

  let searchQuery = '';
  let movies = [];
  let totalResults = 0;
  let ratings = [];

  onMount(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  searchQuery = urlParams.get('query');

  if (searchQuery) {
    // Fetch movies based on search query
    const response = await fetch(`${API_Url}Movie/search?query=${searchQuery}`);
    if (response.ok) {
      const data = await response.json();
      if (data.length === 0) {
        totalResults = 0;
        movies = [];
      } else {
        movies = data.map((movie) => ({
          id: movie.id,
          title: movie.title,
          description: movie.genre,
          image: `https://placehold.co/400x600`, // Placeholder
          averageRating: 'N/A', // Default value
        }));
        totalResults = movies.length;

        // Fetch images for each movie
        await Promise.all(
          movies.map(async (movie) => {
            try {
              movie.image = `${API_Url}Movie/${movie.id}/kep`;
            } catch (error) {
              console.error(`Error loading image for movie ${movie.title}:`, error);
            }
          })
        );

        // Fetch ratings
        const ratingsResponse = await fetch(`${API_Url}Ratings`);
        if (ratingsResponse.ok) {
          ratings = await ratingsResponse.json();

          // Calculate average rating for each movie
          movies.forEach((movie) => {
            const movieRatings = ratings.filter((rating) => rating.movieId === movie.id);

            if (movieRatings.length > 0) {
              const average = movieRatings.reduce((sum, rating) => sum + rating.ratingNumber, 0) / movieRatings.length;
              movie.averageRating = average.toFixed(1);
            } else {
              movie.averageRating = 'N/A';
            }
          });
          movies = [...movies]; // Force reactivity in Svelte
        }
      }
    }
  }
});
</script>

<main>
  <div class="content mt-5">
    <div class="container mt-4">
      <h2 id="resultnumber" class="mb-5">Összesen: {totalResults} találat</h2>
      <div class="row">
        {#each movies as movie}
        <div class="col mb-4">
          <div class="card" id={`movie-${movie.id}`}>
            <a href={`/movies/${movie.id}`} class="image-link">
              <div class="image-container">
                <img src={movie.image} class="card-img-top" alt={movie.title} />
                <div class="badge">{movie.averageRating || 'N/A'}</div>
              </div>
            </a>
            <div class="card-body">
              <h5 class="card-title">{movie.title}</h5>
              <small class="text-white">{movie.description}</small>
            </div>
          </div>
        </div>
        {/each}
      </div>
    </div>
  </div>


</main>
<style>
  /* Betöltés animáció */
.spinner-grow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
}

/* Tartalom reszponzív elhelyezése */
.content {
  padding: 20px;
  color: white;
  margin-left: 60px; /* Mobilon kisebb eltolás */
}

@media (min-width: 768px) {
  .content {
    margin-left: 100px; /* Tableten nagyobb */
  }
}

@media (min-width: 1024px) {
  .content {
    margin-left: 300px; /* Nagy képernyőn teljes eltolás */
  }
}

/* Kategória gombok */
.category-button {
  display: inline-block;
  margin-right: 20px; /* Növelt margó a nagy képernyőkhöz */
  padding: 12px 20px; /* Kisebb gombok paddingja */
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem; /* Nagyobb betűméret */
}

.category-button.active {
  background-color: #811331;
  font-weight: bold;
}

.category-button:hover {
  background-color: #555;
}

/* Kártyák és elrendezés */
.card {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #333333;
  color: white;
  border: 5px solid #811331;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

/* Kép konténer */
.image-container {
  width: 100%;
  height: auto;
  max-height: 500px; /* Maximális magasság, ha szükséges */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* A badge elhelyezéséhez szükséges */
  /* overflow: hidden; Kép ne lógjon ki */
}

.image-container img {
  width: 100%;
  height: 425px;
  object-fit: cover;
}

/* Értékelés badge */
.badge {
  position: absolute;
  top: -10px; /* Eltoljuk a badge-t, hogy kilógjon a kép tetejéből */
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffc107;
  width: 50px;
  height: 20px;
  border-radius: 50px;
  z-index: 1; /* Biztosítja, hogy a badge mindig a kép fölött legyen */
}

/* Rács elrendezés a kártyákhoz */
.row {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(1, 1fr); /* Mobilon 1 oszlop */
}

@media (min-width: 768px) {
  .row {
    grid-template-columns: repeat(2, 1fr); /* Tableten 2 oszlop */
  }
}

@media (min-width: 1024px) {
  .row {
    grid-template-columns: repeat(3, 1fr); /* Nagy képernyőn 3 oszlop */
  }
}

@media (min-width: 1200px) {
  .row {
    grid-template-columns: repeat(4, 1fr); /* Nagyon nagy képernyőkön 4 oszlop */
  }
}

/* Kártya cím */
.card-title {
  margin-bottom: 5px;
  font-size: 1rem;
  line-height: 1.2;
  text-align: center;
  word-wrap: break-word;
  white-space: normal;
  min-height: 3em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* Kártya belső része */
.card-body {
  padding: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Kártyák szélességét biztosítjuk */
.card {
  width: 100%; /* A kártyák 100%-ban kitöltik az oszlopot */
}

/* Reszponzív kártyák mobilon és asztali nézeten */
@media (max-width: 768px) {
  .card {
    width: 100%; /* Mobilon biztosítja, hogy a kártyák kitöltsék az oszlopot */
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .card {
    width: 100%; /* Tableten is biztosítja, hogy a kártyák megfelelően elrendeződjenek */
  }
}

@media (min-width: 1024px) {
  .card {
    width: 100%; /* Nagyobb képernyőkön is rugalmasan alkalmazkodik */
  }
}

/* Szövegek */
small {
  font-size: 0.875rem;
  color: white !important;
}

</style>
