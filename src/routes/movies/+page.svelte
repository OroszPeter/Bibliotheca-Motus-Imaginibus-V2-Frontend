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
    movies = (await movieResponse.json()).filter(movie => !movie.isSeries); // Csak a filmek

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
  .card:hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      transform: translateY(-5px);
      transition: all 0.3s ease-in-out;
    }
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
    height: 300px;
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
      grid-template-columns: repeat(4, 1fr); /* Nagy képernyőn 3 oszlop */
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

{#if isLoading}
<div class="spinner-grow" role="status"></div>
{:else}
<div class="content mt-5">
  <div class="container mt-4">
    <h2 class="mb-5">Filmek</h2>
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
            <div class="col mb-4">
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
          <div class="col mb-4">
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