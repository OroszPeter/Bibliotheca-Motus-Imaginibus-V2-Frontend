<script>
  import { goto } from "$app/navigation";
  import { isLoggedIn, userStore, authToken } from "../../store.js";
  import { onMount } from "svelte";
  import { writable, get } from "svelte/store";

  let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;
  let movies = writable([]);
  let showLeftIcon = false, showRightIcon = true;
  let carousel;
  
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

  const API_Url = "https://bmiwebapi.tryasp.net/api/";

  const moveCarousel = (direction) => {
    const firstImgWidth = carousel.querySelector("img").clientWidth + 14;
    carousel.scrollLeft += direction === 'left' ? -firstImgWidth : firstImgWidth;
    setTimeout(updateIcons, 60);
  };

  const updateIcons = () => {
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    showLeftIcon = carousel.scrollLeft === 0 ? false : true;
    showRightIcon = carousel.scrollLeft === scrollWidth ? false : true;
  };

  const fetchWatchlist = async () => {
    const token = get(authToken).token;
    const userId = get(userStore).id; 
    
    if (!userId) return;

    const response = await fetch(`${API_Url}Watchlist`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const watchlist = await response.json();
      const userWatchlist = watchlist.filter(item => item.userId === userId); // Szűrés a bejelentkezett felhasználóra

      const movieDetails = await Promise.all(userWatchlist.map(async (item) => {
        const movieId = item.movieId;
        const movieResponse = await fetch(`${API_Url}movie/${movieId}`);
        const movieData = await movieResponse.json();

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
      
      movies.set(movieDetails);
    }
  };

  const handleMovieClick = (movieId) => {
    goto(`/movies/${movieId}`);
  };

  function Goto() {
    window.location.href = "/login";
  }

  onMount(() => {
    if (get(isLoggedIn)) {
      fetchWatchlist();
    }
  });
</script>

{#if $isLoggedIn}
  <div class="content mt-5">
    <div class="container mt-4">
      <h2 class="mb-5">Watchlist</h2>
      <div class="wrapper w-100">
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

.bi {
  color: white;
}

body {
  display: flex;
  padding: 0 20px;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: #343F4F;
}

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

.wrapper {
  position: relative;
  max-width: 100%;
  /* overflow: hidden; */
}

.wrapper i {
  position: absolute;
  top: 50%;
  height: 44px;
  width: 44px;
  color: #343F4F;
  cursor: pointer;
  font-size: 1.15rem;
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

.carousel {
  display: flex;
  gap: 14px;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
}

.carousel.dragging {
  cursor: grab;
  scroll-behavior: auto;
}

.carousel.dragging img {
  pointer-events: none;
}

.movie-item {
  flex: 0 0 calc(100% / 3);
  text-align: center;
  width: 100px;
}

.movie-item img {
  width: 100%;
  object-fit: cover;
  display: block;
  margin-bottom: 10px;
}

.movie-info {
  text-align: center;
  word-wrap: break-word;
  /* overflow: hidden; */
  text-overflow: ellipsis;
  white-space: normal;
}

.movie-info h3 {
  font-size: 1rem;
  margin: 0;
}

.movie-info p {
  font-size: 0.9rem;
  margin: 0;
}

/* Reszponzív beállítások */
@media screen and (max-width: 900px) {
  .movie-item {
    flex: 0 0 calc(100% / 2);
  }
}

@media screen and (max-width: 550px) {
  .movie-item {
    flex: 0 0 100%;
  }

  .wrapper i {
    display: block;
  }
}

</style>