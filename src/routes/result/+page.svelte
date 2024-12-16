<script>
  import { onMount } from 'svelte';

  let searchQuery = '';
  let movies = [];
  let totalResults = 0;

  // API lekérés, ha van query
  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    searchQuery = urlParams.get('query');
    
    if (searchQuery) {
      const response = await fetch(`https://localhost:7214/api/Movie/search?query=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        movies = data.map(movie => ({
          id: movie.id, // hozzáadjuk az id-t is
          title: movie.title,
          description: movie.genre, // Példa alapján a "genre" a description
          image: `https://placehold.co/400x600` // Ha nem érkezik kép, ezt használjuk
        }));
        totalResults = movies.length; // A találatok száma
      }
    }
  });
</script>

<main>
  <div class="content mt-5">
    <div class="container mt-4">
      <h2 class="mb-5">Összesen: {totalResults} találat</h2>
      <div class="row">
        {#each movies as movie}
        <div class="col-md-3 mb-4">
          <div class="card" id={`movie-${movie.id}`}> <!-- Card id dinamikus beállítása -->
            <!-- A film linkjének módosítása, az id-vel -->
            <a href={`/movies/${movie.id}`} class="image-link">
              <div class="image-container">
                <img src={movie.image} class="card-img-top" alt={movie.title} />
                <div class="badge">5.0</div>
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
      background-color: #ffc107; /* Sárga szín */
      width: 50px;
      height: 20px;
      border-radius: 50px; /* Ovális forma */
      z-index: 5; /* A badge biztosan a kép előtt legyen */
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
</main>
