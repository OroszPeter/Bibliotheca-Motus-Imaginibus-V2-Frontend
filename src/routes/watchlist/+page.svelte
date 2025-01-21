<script>
  import { goto } from "$app/navigation";
  import { isLoggedIn, userStore, authToken } from "../../store.js";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
    let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;
    const moveCarousel = (direction) => {
      const firstImgWidth = carousel.querySelector("img").clientWidth + 14;
      carousel.scrollLeft += direction === 'left' ? -firstImgWidth : firstImgWidth;
      setTimeout(updateIcons, 60);
    }
  
    const autoSlide = () => {
      if (carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 || carousel.scrollLeft <= 0) return;
  
      positionDiff = Math.abs(positionDiff);
      const firstImgWidth = carousel.querySelector("img").clientWidth + 14;
      const valDifference = firstImgWidth - positionDiff;
  
      if (carousel.scrollLeft > prevScrollLeft) {
        carousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
      } else {
        carousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
      }
    }
  
    const dragStart = (e) => {
      isDragStart = true;
      prevPageX = e.pageX || e.touches[0].pageX;
      prevScrollLeft = carousel.scrollLeft;
    }
  
    const dragging = (e) => {
      if (!isDragStart) return;
      e.preventDefault();
      isDragging = true;
      carousel.classList.add("dragging");
      positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
      carousel.scrollLeft = prevScrollLeft - positionDiff;
      updateIcons();
    }
  
    const dragStop = () => {
      isDragStart = false;
      carousel.classList.remove("dragging");
  
      if (!isDragging) return;
      isDragging = false;
      autoSlide();
    }
    function Goto() {
      window.location.href = "/login";
    }

  let movies = writable([]); // A filmek adatainak tárolása
  let showLeftIcon = false, showRightIcon = true;
  let carousel;

  // API URL és egyéb szükséges adat
  const API_Url = "https://bmiwebapi.tryasp.net/api/";

  const updateIcons = () => {
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    showLeftIcon = carousel.scrollLeft === 0 ? false : true;
    showRightIcon = carousel.scrollLeft === scrollWidth ? false : true;
  }

  // Kérés a watchlisthez és a movie adatokhoz
  const fetchWatchlist = async () => {
    const token = $authToken.token;
    const userId = $userStore.id;
    
    // GET kérés a /Watchlist végpontra
    const response = await fetch(`${API_Url}Watchlist?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const watchlist = await response.json();
      
      // A watchlist-ben lévő movieId-k listájának feldolgozása
      const movieDetails = await Promise.all(watchlist.map(async (item) => {
        const movieId = item.movieId; // Csak a movieId-t használjuk
        const movieResponse = await fetch(`${API_Url}movie/${movieId}`);
        const movieData = await movieResponse.json();
        
        // Kép lekérése a movie-hoz
        const imageResponse = await fetch(`${API_Url}movie/${movieId}/kep`);
        const imageBlob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        
        return {
          id: movieData.id,
          title: movieData.title,
          genre: movieData.genre,
          imageUrl: imageUrl
        };
      }));
      
      // Filmek adatainak beállítása
      movies.set(movieDetails);
    }
  };
    // Kattintás esemény a filmre, ami átirányít a film oldalra
    const handleMovieClick = (movieId) => {
    goto(`/movies/${movieId}`);
  };

  onMount(() => {
    if ($isLoggedIn) {
      fetchWatchlist();
    }
  });
</script>

{#if $isLoggedIn}
  <div class="content mt-5">
    <div class="container mt-4">
      <h2 class="mb-5">Watchlist</h2>
      <div class="wrapper">
        <i id="left" class="bi bi-arrow-left bg-danger" on:click={() => moveCarousel('left')} style="display: {showLeftIcon ? 'block' : 'none'}"></i>
        <div class="carousel" bind:this={carousel} on:mousedown={dragStart} on:touchstart={dragStart} on:mousemove={dragging} on:touchmove={dragging} on:mouseup={dragStop} on:touchend={dragStop}>
          {#each $movies as movie (movie.id)}
          <div class="movie-item" on:click={() => handleMovieClick(movie.id)}>
              <img src={movie.imageUrl} alt={movie.title} draggable="false">
              <div class="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.genre}</p>
              </div>
            </div>
          {/each}
        </div>
        <i id="right" class="bi bi-arrow-right bg-danger" on:click={() => moveCarousel('right')} style="display: {showRightIcon ? 'block' : 'none'}"></i>
      </div>
    </div>
  </div>
{:else}
  <div class="content mt-5">
    <div class="container mt-4">
      <h2 class="text-center">Jelentkezz vagy regisztrálj hogy hozzáférj a watchlist oldalhoz</h2>
      <div class="d-flex align-items-center justify-content-center mt-3">
        <button on:click={Goto()} class="btn btn-danger p-3">Bejelentkezés</button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Import Google font - Poppins */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }

  .bi{
    color: white;
  }

  body {
    display: flex;
    padding: 0 35px;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    background: #343F4F;
  }

  .content {
    margin-left: 300px; /* Sidebar szélességének megfelelő eltolás */
    padding: 20px; /* Extra belső tér a tartalom körül */
    color: white; /* Alapértelmezett fehér szín a szövegekhez */
  }

  .wrapper {
    position: relative;

  }

  .wrapper i {
    top: 50%;
    height: 44px;
    width: 44px;
    color: #343F4F;
    cursor: pointer;
    font-size: 1.15rem;
    position: absolute;
    text-align: center;
    line-height: 44px;
    background: #fff;
    border-radius: 50%;
    transform: translateY(-50%);
    transition: transform 0.1s linear;
    z-index: 100;
  }

  .wrapper i:active {
    transform: translateY(-50%) scale(0.9);
  }

  .wrapper i:hover {
    background: #f2f2f2;
  }

  .wrapper i:first-child {
    left: -22px;
  }

  .wrapper i:last-child {
    right: -22px;
  }

  .wrapper .carousel {
    font-size: 0px;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    scroll-behavior: smooth;
  }

  #left, #right{
    z-index: 100;
    color: white;
  }

  .carousel.dragging {
    cursor: grab;
    scroll-behavior: auto;
  }

  .carousel.dragging img {
    pointer-events: none;
  }

  .carousel img {
    height: 400px;
    object-fit: cover;
    user-select: none;
    margin-left: 14px;
    width: calc(100% / 3);
  }

  .carousel img:first-child {
    margin-left: 0px;
  }

  .movie-item {
    display: inline-block;
    width: 200px;
    margin-right: 14px;
    text-align: center;
  }

  .movie-item img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  .movie-info {
    color: white;
    margin-top: 10px;
  }

  .movie-info h3 {
    font-size: 1rem;
    margin: 0;
  }

  .movie-info p {
    font-size: 0.9rem;
    margin: 0;
  }

  @media screen and (max-width: 900px) {
    .carousel img {
      width: calc(100% / 2);
    }
  }

  @media screen and (max-width: 550px) {
    .carousel img {
      width: 100%;
    }
  }
</style>
