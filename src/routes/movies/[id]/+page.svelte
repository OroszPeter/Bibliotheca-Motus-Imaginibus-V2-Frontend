<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { authToken, userStore } from '../../../store.js';

    let { movie, movieRatings, averageRating } = $page.data;
    let imageUrl = '';
    let isLoading = !movie;
    let rating = 0;
    let hoverRatingValue = 0;
    let comment = '';

    // Segédfüggvény a store-értékek szinkron kiolvasására
    function getStoreValue(store) {
        let value;
        store.subscribe(v => value = v)();
        return value;
    }

    function hoverRating(value) {
        hoverRatingValue = value;
    }

    function setRating(value) {
        rating = value;
    }

    function resetRating() {
        hoverRatingValue = 0;
    }

    async function submitRating() {
        // Token és userId lekérése a store-okból
        const token = getStoreValue(authToken)?.token;
        const userId = getStoreValue(userStore)?.id;

        if (!userId || !token) {
            alert('Hiba: Bejelentkezés szükséges az értékeléshez.');
            return;
        }

        const newRating = {
            movieId: movie.id,
            ratingNumber: rating,
            userId,
            comment
        };

        try {
            const response = await fetch('https://localhost:7214/api/Ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newRating)
            });

            if (!response.ok) {
                throw new Error('Nem sikerült az értékelés elküldése.');
            }

            const addedRating = await response.json();
            movieRatings = [...movieRatings, addedRating];
            comment = '';
            rating = 0;
            alert('Értékelés elküldve!');
        } catch (error) {
            console.error('Hiba az értékelés beküldésekor:', error);
        }
    }

    async function deleteRating(id) {
        // token lekérése a store-ból
        const token = getStoreValue(authToken)?.token;

        if (!token) {
            alert('Hiba: Bejelentkezés szükséges az értékelés törléséhez.');
            return;
        }

        try {
            const response = await fetch(`https://localhost:7214/api/Ratings/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Nem sikerült az értékelés törlése.');
            }

            movieRatings = movieRatings.filter(rating => rating.id !== id);
            alert('Értékelés törölve!');
        } catch (error) {
            console.error('Hiba az értékelés törlésekor:', error);
        }
    }

    onMount(async () => {
        try {
            if (movie) {
                const movieId = movie.id;
                imageUrl = `https://localhost:7214/api/Movie/${movieId}/kep`;

                const response = await fetch(imageUrl);
                if (!response.ok) {
                    throw new Error('Kép nem érhető el');
                }
            } else {
                imageUrl = 'https://placehold.co/400x600';
            }
        } catch (error) {
            console.error('Hiba a film adatainak betöltésekor:', error);
            imageUrl = 'https://placehold.co/400x600';
        } finally {
            isLoading = false;
        }
    });
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
                            <div class="picture">
                                {#if imageUrl}
                                    <img src={imageUrl} class="img-fluid" alt={movie.title} />
                                {:else}
                                    <img src="https://placehold.co/400x600" class="img-fluid" alt="Placeholder image" />
                                {/if}
                            </div>
                        </td>
                        <td>
                            <div class="content">
                                <h2>
                                    {movie.title}
                                    <button class="btn btn-primary btn-sm ms-2">+</button>
                                </h2>
                                <p><strong>{movie.genre}</strong></p>
                                <small>{averageRating.toFixed(1)} &#9733;</small>
                                <p>{movie.description || 'Film leírás nem elérhető.'}</p>
                            </div>
                        </td>
                        <td>
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
                            <div class="addcomment mt-4">
                                <div class="star-rating mb-3" on:mouseleave={resetRating}>
                                    {#each Array(5).fill(0) as _, index}
                                        <label
                                            class="star"
                                            on:mouseover={() => hoverRating(index + 1)}
                                            on:click={() => setRating(index + 1)}
                                        >
                                            {hoverRatingValue >= index + 1 || rating >= index + 1 ? '★' : '☆'}
                                        </label>
                                    {/each}
                                </div>
                                <textarea bind:value={comment} name="komment" cols="75" rows="4"></textarea>
                                <button class="btn btn-success" on:click={submitRating}>Küldés</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
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
                                        {#if getStoreValue(userStore)?.id === rating.userId}
                                            <button class="btn btn-danger" on:click={() => deleteRating(rating.id)}>Törlés</button>
                                        {/if}
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
    .container {
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
        cursor: pointer;
    }
    .star + .star {
        margin-left: 2px;
    }
    img {
        width: 400px;
        height: 600px;
    }
</style>
