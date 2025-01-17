<script>
    import { goto } from "$app/navigation";
  import { isLoggedIn, userStore } from "../../store.js";
    let carousel;
    let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;
    let showLeftIcon = false, showRightIcon = true;
  
    const updateIcons = () => {
      const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
      showLeftIcon = carousel.scrollLeft === 0 ? false : true;
      showRightIcon = carousel.scrollLeft === scrollWidth ? false : true;
    }
  
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
  </script>
  {#if $isLoggedIn}
     <div class="content mt-5">
      <div class="container mt-4">
        <h2 class="mb-5">Watchlist</h2>
  <div class="wrapper">
    <i id="left" class="bi bi-arrow-left bg-danger" on:click={() => moveCarousel('left')} style="display: {showLeftIcon ? 'block' : 'none'}"></i>
    <div class="carousel" bind:this={carousel} on:mousedown={dragStart} on:touchstart={dragStart} on:mousemove={dragging} on:touchmove={dragging} on:mouseup={dragStop} on:touchend={dragStop}>
      <img src="https://placehold.co/400x600" alt="img" draggable="false">
      <img src="https://placehold.co/400x600" alt="img" draggable="false">
      <img src="https://placehold.co/400x600" alt="img" draggable="false">
      <img src="https://placehold.co/400x600" alt="img" draggable="false">
      <img src="https://placehold.co/400x600" alt="img" draggable="false">
      <img src="https://placehold.co/400x600" alt="img" draggable="false">
      <img src="https://placehold.co/400x600" alt="img" draggable="false">
      <img src="https://placehold.co/400x600" alt="img" draggable="false">
      <img src="https://placehold.co/400x600" alt="img" draggable="false">
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
      overflow-x: hidden;
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
      z-index: 1;
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
  