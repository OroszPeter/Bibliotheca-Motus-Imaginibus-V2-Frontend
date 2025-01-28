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
        <div class="col-md-3 mb-4">
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
</main>
