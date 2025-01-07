<script>
  import { onMount } from 'svelte';
  import { API_Url } from '../store.js';

  let movies = [];
  let ratings = [];
  let isLoading = true;

  // API hívás a filmek és értékelések lekéréséree
  onMount(async () => {
  try {
    // Filmek és értékelések betöltése
    const moviesResponse = await fetch(`${API_Url}Movie`);
    if (!moviesResponse.ok) throw new Error('Hiba a filmek lekérésekor');
    movies = await moviesResponse.json();

    const ratingsResponse = await fetch(`${API_Url}Ratings`);
    if (!ratingsResponse.ok) throw new Error('Hiba az értékelések lekérésekor');
    ratings = await ratingsResponse.json();

    // Csak a 4 legfrissebb film kiválasztása az addedAt alapján
    movies = movies
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)) // Rendezés csökkenő sorrendbe
      .slice(0, 4); // Az első 4 film kiválasztása

    // Átlag kiszámítása és hozzáadása minden filmhez
    movies.forEach(movie => {
      const movieRatings = ratings.filter(rating => rating.movieId === movie.id);
      const averageRating = movieRatings.length
        ? movieRatings.reduce((sum, rating) => sum + rating.ratingNumber, 0) / movieRatings.length
        : 0;
      movie.averageRating = averageRating.toFixed(1);
    });

    // Képek betöltése
    await Promise.all(
      movies.map(async (movie) => {
        try {
          movie.image = `${API_Url}Movie/${movie.id}/kep`;
        } catch {
          movie.image = 'https://placehold.co/400x600';
        }
      })
    );

    isLoading = false; // Betöltés vége
  } catch (error) {
    console.error('Hiba:', error);
  }
});
</script>
{#if isLoading}
<div class="spinner-grow" role="status">
</div>
{:else}
<div class="content mt-5">
  <div class="container mt-4">
    <h2 class="mb-5">Újdonságok</h2>
    <div class="row">
      {#each movies as movie}
        <div class="col-md-3 mb-4">
          <div class="card">
            <!-- Link a képhez -->
            <a href={`/movies/${movie.id}`} class="image-link">
              <div class="image-container">
                <img src={movie.image} class="card-img-top" alt={movie.title} />
                <div class="badge">{movie.averageRating}</div> <!-- Átlagértékelés a sárga oválisban -->
              </div>
            </a>
            <div class="card-body">
              <h5 class="card-title">{movie.title}</h5>
              <small class="text-muted">{movie.genre}</small> <!-- A leírás helyett genre jelenik meg -->
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
{/if}

<style>
  .spinner-grow{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
  }
  
  .content {
    margin-left: 300px; /* Sidebar szélességének megfelelő eltolás */
    padding: 20px; /* Extra belső tér a tartalom körül */
    color: white; /* Alapértelmezett fehér szín a szövegekhez */
  }

  /* Kártya alapstílus */
  .card {
    border: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #333333; /* Eredeti háttérszín */
    color: white; /* Fehér szín a kártya szövegeinek */
  }

  .card:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
    transition: all 0.3s ease-in-out;
  }

  /* Link a képen */
  .image-link {
    display: block; /* A link legyen blokkszintű, hogy a teljes képet lefedje */
    text-decoration: none; /* Link alapértelmezett aláhúzása eltávolítva */
  }

  /* A képre vonatkozó stílusok */
  .image-container {
    position: relative;
  }

  .card-img-top {
    padding-bottom: 10px; /* A kép és a szöveg közötti távolság csökkentése */
    margin-bottom: 10px; /* Kis távolság a kép alatt */
  }

  /* Sárga ovális elem a kép felső részén */
  .badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffc107;
  width: 50px;
  height: 20px;
  border-radius: 50px;
  z-index: 5;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  line-height: 20px;
}

  /* Kártya tartalmának illesztése */
  .card-body {
    padding-top: 5px; /* Kevesebb padding a tetején */
    padding-bottom: 5px; /* Kevesebb padding az alján */
  }

  .card-title {
    margin-bottom: 5px; /* A cím és a leírás közötti távolság csökkentése */
    color: white; /* Cím színének fehérre állítása */
  }

  /* Fehér szín a small tag számára */
  small {
    font-size: 0.875rem; /* A leírás szöveg méretének csökkentése */
    color: white !important; /* Biztosítja, hogy a small szöveg fehér legyen */
  }

  .card:hover .card-body {
    background-color: #333333; /* Az alap háttérszín megmarad hover során is */
  }
</style>
