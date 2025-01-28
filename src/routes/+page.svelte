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
        <div class="col-md-3 mb-4">
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
        <div class="col-md-3 mb-4">
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
