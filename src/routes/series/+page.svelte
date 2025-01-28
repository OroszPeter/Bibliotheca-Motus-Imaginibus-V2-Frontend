<script>
  import { onMount } from 'svelte';
  import { API_Url } from '../../store.js';

  let movies = []; // Filmek tárolása
  let ratings = []; // Értékelések tárolása
  let categorizedMovies = {}; // Filmek kategorizálása műfajok szerint
  let isLoading = true;
  let selectedCategory = 'Összes';

  // API hívás a filmek lekéréséhez
  onMount(async () => {
  try {
    const movieResponse = await fetch(`${API_Url}Movie`);
    if (!movieResponse.ok) throw new Error('Hiba a filmek lekérésekor');
    movies = (await movieResponse.json()).filter(movie => movie.isSeries); // Csak a filmek

    const ratingResponse = await fetch(`${API_Url}Ratings`);
    if (!ratingResponse.ok) throw new Error('Hiba az értékelések lekérésekor');
    ratings = await ratingResponse.json();

    categorizedMovies = movies.reduce((acc, movie) => {
      if (!acc[movie.genre]) acc[movie.genre] = [];
      acc[movie.genre].push(movie);
      return acc;
    }, {});

    movies.forEach(movie => {
      const movieRatings = ratings.filter(rating => rating.movieId === movie.id);
      const averageRating = movieRatings.reduce((sum, rating) => sum + rating.ratingNumber, 0) / movieRatings.length;
      movie.averageRating = averageRating || 0;
    });

    await Promise.all(
      movies.map(async (movie) => {
        try {
          movie.imageUrl = `${API_Url}Movie/${movie.id}/kep`;
        } catch (error) {
          console.error(`Hiba a(z) ${movie.title} képének betöltésekor:`, error);
          movie.imageUrl = 'https://placehold.co/400x600';
        }
      })
    );
  } catch (error) {
    console.error('Hiba a filmek vagy értékelések betöltésekor:', error);
  } finally {
    isLoading = false;
  }
});

  function filterCategory(category) {
    selectedCategory = category;
  }
</script>

<style>
  .spinner-grow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
  }
  
  .content {
    margin-left: 300px;
    padding: 20px;
    color: white;
  }
  
  .category-button {
    display: inline-block;
    margin-right: 10px;
    padding: 10px 15px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .category-button.active {
    background-color: #811331;
    font-weight: bold;
  }
  
  .category-button:hover {
    background-color: #555;
  }
  
  .card {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #333333;
    color: white;
    border: 5px solid #811331;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%; /* A kártyák egységes magasságának biztosítása */
  }
  
  .card:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
    transition: all 0.3s ease-in-out;
  }
  
  .card-title {
    margin-bottom: 5px;
    font-size: 1rem; /* Egységes betűméret */
    line-height: 1.2; /* Egyenletes sorok közötti távolság */
    text-align: center; /* Középre igazítás */
    word-wrap: break-word; /* Hosszú szavak tördelése */
    white-space: normal; /* Több soros tördelés engedélyezése */
    min-height: 3em; /* Legalább két sor hely fenntartása, ékezetek figyelembevételével */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .card-body {
    padding: 10px; /* Egyenletes belső margók */
    flex-grow: 1; /* A tartalom helykitöltése */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .image-container {
    width: 100%;
    height: auto;
    aspect-ratio: 2 / 3; /* Képek aránya */
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Képarányok megőrzése */
  }
  
  .badge {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ffc107;
      width: 50px;
      height: 20px;
      border-radius: 50px;
      z-index: 1;
    }
  
  
    .card-body {
      padding-top: 5px;
      padding-bottom: 5px;
    }
  
    .card-title {
      margin-bottom: 5px;
      color: white;
    }
  
    small {
      font-size: 0.875rem;
      color: white !important;
    }
  </style>

{#if isLoading}
<div class="spinner-grow" role="status"></div>
{:else}
<div class="content mt-5">
  <div class="container mt-4">
    <h2 class="mb-5">Sorozatok</h2>
    <h3>Kategóriák</h3>
    <hr>
    {#each ['Összes', ...Object.keys(categorizedMovies)] as genre}
      <button 
        class="category-button {selectedCategory === genre ? 'active' : ''}"
        on:click={() => filterCategory(genre)}>
        {genre}
      </button>
    {/each}
    <hr>

    {#if selectedCategory === 'Összes'}
      {#each Object.keys(categorizedMovies) as genre}
        <h4>{genre}</h4>
        <div class="row">
          {#each categorizedMovies[genre].slice(0, 4) as movie}
            <div class="col-md-3 mb-4">
              <div class="card">
                <a href={`/movies/${movie.id}`} class="image-link">
                  <div class="image-container">
                    <img src={movie.imageUrl || 'https://placehold.co/400x600'} class="card-img-top" alt={movie.title} />
                    <div class="badge">{movie.averageRating.toFixed(1)}</div>
                  </div>
                </a>

                <div class="card-body">
                  <h5 class="card-title">{movie.title}</h5>
                  <small class="text-muted">{movie.genre}</small>
                </div>
              </div>
            </div>
          {/each}
          <button 
            class="category-button" 
            on:click={() => filterCategory(genre)}>Összes megjelenítése</button>
        </div>
      {/each}
    {:else}
      <h4>{selectedCategory}</h4>
      <div class="row">
        {#each categorizedMovies[selectedCategory] as movie}
          <div class="col-md-3 mb-4">
            <div class="card">
              <a href={`/movies/${movie.id}`} class="image-link">
                <div class="image-container">
                  <img src={movie.imageUrl || 'https://placehold.co/400x600'} class="card-img-top" alt={movie.title} />
                  <div class="badge">{movie.averageRating.toFixed(1)}</div>
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
    {/if}
  </div>
</div>
{/if}