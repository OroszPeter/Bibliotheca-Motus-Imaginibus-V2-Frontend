<script>
    import { page } from '$app/stores';
  
    let { movie, movieRatings, averageRating } = $page.data;
    let imageUrl = '';
    let isLoading = !movie;
    let actualImageUrl = '';
  
    // Kép letöltése blob-ként, és megjelenítéshez base64 konvertálása
    async function fetchImageBlob(blobUrl) {
        try {
            // Kép URL beállítása
            imageUrl = `https://localhost:7214/api/Movie/${movie.id}/kep`;
      
      // Ha nincs kép vagy hiba van, használunk egy alapértelmezett képet
      if (!imageUrl) {
        imageUrl = 'https://placehold.co/400x600';
      }
        } catch (error) {
            console.error('Error fetching image blob:', error);
        }
    }
  
    // Kép betöltése, ha van URL
    $: if (imageUrl) {
        fetchImageBlob(imageUrl);
    }
  
    console.log('Movie data:', movie);
    console.log('Image URL:', imageUrl);
    console.log('Movie Ratings:', movieRatings);
    console.log('Average Rating:', averageRating);
  </script>
  
  <main>
    {#if isLoading}
        <div>Betöltés...</div>
    {:else if movie}
        <div class="container py-5 pt-5 w-75">
            <table class="pt-5">
                <tbody>
                    <tr>
                        <td rowspan="2">
                            <!-- Kép -->
                            <div class="picture">
                                {#if actualImageUrl}
                                    <img
                                        src={actualImageUrl}
                                        class="img-fluid"
                                        alt={movie.title}
                                    />
                                {:else}
                                    <img
                                        src="https://placehold.co/400x600"
                                        class="img-fluid"
                                        alt="Placeholder image"
                                    />
                                {/if}
                            </div>
                        </td>
                        <td>
                            <!-- Film cím, műfaj és értékelés -->
                            <div class="content">
                                <h2>
                                    {movie.title}
                                    <button class="btn btn-primary btn-sm ms-2">+</button>
                                </h2>
                                <p><strong>{movie.genre}</strong></p>
                                <small>{averageRating.toFixed(1)} &#9733;</small>
                                <p>
                                    {movie.description || 'Film leírás nem elérhető.'}
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <!-- Komment szakasz -->
                            <div class="ratings-section">
                                <h3>Értékelések:</h3>
                                {#each movieRatings as rating}
                                    <div class="rating">
                                        <p><strong>{rating.userId}</strong>: {rating.comment}</p>
                                        <div>
                                            {#each Array(rating.ratingNumber).fill('★') as _}
                                                <span class="star">★</span>
                                            {/each}
                                            {#each Array(5 - rating.ratingNumber).fill('☆') as _}
                                                <span class="star">☆</span>
                                            {/each}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    {:else}
        <div>Nem található a film adata.</div>
    {/if}
  </main>
  
  
  <style>
    .container{
        margin-left: 300px;
        padding: 20px;
        color: white;
    }
    .ratings-section {
        margin-top: 20px;
    }
  
    .rating {
        margin-bottom: 15px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
    }
  
    .rating p {
        margin: 0;
        color: #ddd;
    }
  
    .star {
        font-size: 1.5rem;
        color: gold;
    }
  
    .star + .star {
        margin-left: 2px;
    }
  </style>
  