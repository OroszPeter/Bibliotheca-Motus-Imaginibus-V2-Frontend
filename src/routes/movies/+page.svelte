<script>
  import { onMount } from 'svelte';

  let movies = []; // Filmek tárolása
  let ratings = []; // Értékelések tárolása
  let categorizedMovies = {}; // Filmek kategorizálása műfajok szerint

  // API hívás a filmek lekéréséhez
  onMount(async () => {
    try {
      // Lekérjük a filmeket
      const movieResponse = await fetch('https://localhost:7214/api/Movie');
      if (!movieResponse.ok) throw new Error('Hiba a filmek lekérésekor');
      movies = await movieResponse.json();

      // Lekérjük az értékeléseket
      const ratingResponse = await fetch('https://localhost:7214/api/Ratings');
      if (!ratingResponse.ok) throw new Error('Hiba az értékelések lekérésekor');
      ratings = await ratingResponse.json();

      // Kategorizáljuk a filmeket műfajok szerint
      categorizedMovies = movies.reduce((acc, movie) => {
        if (!acc[movie.genre]) acc[movie.genre] = [];
        acc[movie.genre].push(movie);
        return acc;
      }, {});

      // Kiszámoljuk az átlagos értékelést minden filmhez
      movies.forEach(movie => {
        const movieRatings = ratings.filter(rating => rating.movieId === movie.id);
        const averageRating = movieRatings.reduce((sum, rating) => sum + rating.ratingNumber, 0) / movieRatings.length;
        movie.averageRating = averageRating || 0; // Ha nincs értékelés, akkor 0
      });

      // Lekérjük a képeket minden filmhez
      await Promise.all(
  movies.map(async (movie) => {
    try {
      movie.imageUrl = `https://localhost:7214/api/Movie/${movie.id}/kep`; // Közvetlen kép URL
    } catch (error) {
      console.error(`Hiba a(z) ${movie.title} képének betöltésekor:`, error);
      movie.imageUrl = 'https://placehold.co/400x600'; // Placeholder kép
    }
  })
);

    } catch (error) {
      console.error('Hiba a filmek vagy értékelések betöltésekor:', error);
    }
  });
</script>

<style>
  .content {
    margin-left: 300px;
    padding: 20px;
    color: white;
  }

  /* Kártya alapstílus */
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
    width: 100%; /* Szülő elem szélessége */
    height: 450px; /* Fix magasság */
    overflow: hidden; /* Ha a kép túl nagy, levágjuk */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-img-top {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover; /* A kép méretezése úgy, hogy teljesen kitöltse a területet */
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
    text-align: center;
    font-size: 0.9rem;
    display: flex; /* Flexbox a középre igazításhoz */
    justify-content: center; /* Vízszintes középre igazítás */
    align-items: center; /* Függőleges középre igazítás */
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

<div class="content mt-5">
  <div class="container mt-4">
    <h2 class="mb-5">Filmek</h2>
    
    {#each Object.keys(categorizedMovies) as genre}
      <h3>{genre}</h3>
      <div class="row">
        {#each categorizedMovies[genre] as movie}
          <div class="col-md-3 mb-4">
            <div class="card">
              <!-- Link a képhez -->
              <a href="https://www.google.com/search?q={movie.title}" class="image-link">
                <div class="image-container">
                  <img src={movie.imageUrl || 'https://placehold.co/400x600'} class="card-img-top" alt={movie.title} />
                  <div class="badge">{movie.averageRating.toFixed(1)}</div> <!-- Az átlagos értékelés -->
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
    {/each}
  </div>
</div>
