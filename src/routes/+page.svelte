<script>
  import { onMount } from 'svelte';
  import { API_Url } from '../store.js';

  let movies = [];
  let ratings = [];
  let isLoading = true;

  onMount(async () => {
    try {
      const moviesResponse = await fetch(`${API_Url}Movie`);
      if (!moviesResponse.ok) throw new Error('Hiba a filmek lekérésekor');
      movies = await moviesResponse.json();

      const ratingsResponse = await fetch(`${API_Url}Ratings`);
      if (!ratingsResponse.ok) throw new Error('Hiba az értékelések lekérésekor');
      ratings = await ratingsResponse.json();

      // Rendezés és 8 legfrissebb film kiválasztása
      movies = movies
        .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
        .slice(0, 8);

      movies.forEach(movie => {
        const movieRatings = ratings.filter(rating => rating.movieId === movie.id);
        const averageRating = movieRatings.length
          ? movieRatings.reduce((sum, rating) => sum + rating.ratingNumber, 0) / movieRatings.length
          : 0;
        movie.averageRating = averageRating.toFixed(1);
      });

      await Promise.all(
        movies.map(async (movie) => {
          try {
            movie.image = `${API_Url}Movie/${movie.id}/kep`;
          } catch {
            movie.image = 'https://placehold.co/400x600';
          }
        })
      );

      isLoading = false;
    } catch (error) {
      console.error('Hiba:', error);
    }
  });
</script>

{#if isLoading}
<div class="spinner-grow" role="status"></div>
{:else}
<div class="content mt-5">
  <div class="container mt-4">
    <h2 class="mb-5">Újdonságok</h2>
    <!-- Első sor -->
    <div class="row">
      {#each movies.slice(0, 4) as movie}
        <div class="col mb-4">
          <div class="card">
            <a href={`/movies/${movie.id}`} class="image-link">
              <div class="image-container">
                <img src={movie.image} class="card-img-top" alt={movie.title} />
                <div class="badge">{movie.averageRating}</div>
              </div>
            </a>
            <div class="card-body">
              <h5 class="card-title">{movie.title}</h5>
              <small class="text-muted">{movie.genre}</small>
            </div>
          </div>
        </div>
      {/each}
    </div>
    <!-- Második sor -->
    <div class="row">
      {#each movies.slice(4, 8) as movie}
        <div class="col mb-4">
          <div class="card">
            <a href={`/movies/${movie.id}`} class="image-link">
              <div class="image-container">
                <img src={movie.image} class="card-img-top" alt={movie.title} />
                <div class="badge">{movie.averageRating}</div>
              </div>
            </a>
            <div class="card-body">
              <h5 class="card-title">{movie.title}</h5>
              <small class="text-muted">{movie.genre}</small>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
{/if}

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