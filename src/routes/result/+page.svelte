<script>
  import { onMount } from 'svelte';

  let searchQuery = '';
  let movies = [];
  let totalResults = 0;
  let ratings = [];

  onMount(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  searchQuery = urlParams.get('query');

  if (searchQuery) {
    // Fetch movies based on search query
    const response = await fetch(`https://localhost:7214/api/Movie/search?query=${searchQuery}`);
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
              movie.image = `https://localhost:7214/api/Movie/${movie.id}/kep`;
            } catch (error) {
              console.error(`Error loading image for movie ${movie.title}:`, error);
            }
          })
        );

        // Fetch ratings
        const ratingsResponse = await fetch('https://localhost:7214/api/Ratings');
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
              <small class="text-muted">{movie.description}</small>
            </div>
          </div>
        </div>
        {/each}
      </div>
    </div>
  </div>

  <style>
    .content {
      margin-left: 300px;
      padding: 20px;
      color: white;
    }

    .card {
      border: none;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      background-color: #333333;
      color: white;
    }

    .card:hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      transform: translateY(-5px);
      transition: all 0.3s ease-in-out;
    }

    .image-link {
      display: block;
      text-decoration: none;
    }

    .image-container {
      position: relative;
    }

    .card-img-top {
      padding-bottom: 10px;
      margin-bottom: 10px;
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
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
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

    .card:hover .card-body {
      background-color: #333333;
    }
  </style>
</main>
