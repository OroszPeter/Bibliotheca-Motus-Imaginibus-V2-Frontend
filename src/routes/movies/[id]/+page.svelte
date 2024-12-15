<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    let { movie, movieRatings, averageRating } = $page.data;
    let imageUrl = '';
    let isLoading = !movie;
    let actualImageUrl = '';
    let rating = 0;
let hoverRatingValue = 0;

function hoverRating(value) {
    hoverRatingValue = value;
}

function setRating(value) {
    rating = value;
}

function resetRating() {
    hoverRatingValue = 0;
}
    // API hívás a film adatainak lekéréséhez
    onMount(async () => {
        try {
            if (movie) {
                const movieId = movie.id;
                // Kép URL beállítása
                imageUrl = `https://localhost:7214/api/Movie/${movieId}/kep`;

                // Ellenőrizzük, hogy az URL tényleg elérhető-e
                const response = await fetch(imageUrl);
                if (!response.ok) {
                    throw new Error('Kép nem érhető el');
                }
            } else {
                imageUrl = 'https://placehold.co/400x600'; // Alapértelmezett kép
            }
        } catch (error) {
            console.error('Hiba a film adatainak betöltésekor:', error);
            imageUrl = 'https://placehold.co/400x600'; // Hiba esetén alapértelmezett kép
        } finally {
            isLoading = false;
        }
    });
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
                                {#if imageUrl}
                                    <img
                                        src={imageUrl}
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
                        <td>
                            <!-- Rendező és színészek táblázat -->
                            <div class="people">
                                <table class="table table-dark table-striped">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Szereplő</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Rendező</td>
                                            <td>{movie.director}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Arnold Schwarzenegger</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Linda Hamilton</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <!-- Komment szakasz -->
                            <div class="addcomment mt-4">
                                <div class="star-rating mb-3" on:mouseleave={resetRating}>
                                    <!-- Csillagok -->
                                    <label for="star1" class="star" on:mouseover={() => hoverRating(1)} on:click={() => setRating(1)}>{rating >= 1 ? '★' : '☆'}</label>
                                    <label for="star2" class="star" on:mouseover={() => hoverRating(2)} on:click={() => setRating(2)}>{rating >= 2 ? '★' : '☆'}</label>
                                    <label for="star3" class="star" on:mouseover={() => hoverRating(3)} on:click={() => setRating(3)}>{rating >= 3 ? '★' : '☆'}</label>
                                    <label for="star4" class="star" on:mouseover={() => hoverRating(4)} on:click={() => setRating(4)}>{rating >= 4 ? '★' : '☆'}</label>
                                    <label for="star5" class="star" on:mouseover={() => hoverRating(5)} on:click={() => setRating(5)}>{rating >= 5 ? '★' : '☆'}</label>
                                </div>
                                <textarea name="komment" cols="75" rows="4"></textarea>
                                <button class="btn btn-success">Küldés</button>
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
    img{
        width: 400px;
        height: 600px;
    }
  </style>
  