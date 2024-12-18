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
    let toast = { message: '', type: '', visible: false };
    let users = {}; // User ID -> username tárolás

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

    function showToast(message, type) {
        toast = { message, type, visible: true };
        setTimeout(() => (toast.visible = false), 3000);
    }

    async function fetchUsernames() {
        try {
            const response = await fetch('https://localhost:7214/api/Users');
            if (!response.ok) throw new Error('Nem sikerült a felhasználók betöltése.');

            const userData = await response.json();
            users = userData.reduce((acc, user) => {
                acc[user.id] = user.username;
                return acc;
            }, {});
        } catch (error) {
            console.error('Hiba a felhasználónevek lekérdezésekor:', error);
        }
    }

    async function submitRating() {
        const token = getStoreValue(authToken)?.token;
        const userId = getStoreValue(userStore)?.id;

        if (!userId || !token) {
            showToast('Hiba: Bejelentkezés szükséges az értékeléshez.', 'error');
            return;
        }

        const newRating = { movieId: movie.id, ratingNumber: rating, userId, comment };

        try {
            const response = await fetch('https://localhost:7214/api/Ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newRating)
            });

            if (!response.ok) throw new Error('Nem sikerült az értékelés elküldése.');

            const addedRating = await response.json();
            addedRating.username = users[userId] || 'Ismeretlen felhasználó';
            movieRatings = [...movieRatings, addedRating];
            comment = '';
            rating = 0;
            showToast('Értékelés elküldve!', 'success');
        } catch (error) {
            console.error('Hiba az értékelés beküldésekor:', error);
            showToast('Nem sikerült az értékelés elküldése.', 'error');
        }
    }

    async function deleteRating(id) {
        const token = getStoreValue(authToken)?.token;

        if (!token) {
            showToast('Hiba: Bejelentkezés szükséges az értékelés törléséhez.', 'error');
            return;
        }

        try {
            const response = await fetch(`https://localhost:7214/api/Ratings/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Nem sikerült az értékelés törlése.');

            movieRatings = movieRatings.filter(rating => rating.id !== id);
            showToast('Értékelés törölve!', 'error');
        } catch (error) {
            console.error('Hiba az értékelés törlésekor:', error);
            showToast('Nem sikerült az értékelés törlése.', 'error');
        }
    }

    onMount(async () => {
        try {
            await fetchUsernames();
            if (movie) {
                const movieId = movie.id;
                imageUrl = `https://localhost:7214/api/Movie/${movieId}/kep`;

                const response = await fetch(imageUrl);
                if (!response.ok) throw new Error('Kép nem érhető el');
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
        <div class="container pt-5 w-75">
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
                        <td class="desc">
                            <div class="content">
                                <h2>
                                    {movie.title}
                                    <button class="btn btn-primary btn-sm ms-2">+</button>
                                </h2>
                                <p><strong>{movie.genre}</strong></p>
                                <small>{averageRating.toFixed(1)} &#9733;</small>
                                <p class="description">{movie.description || 'Film leírás nem elérhető.'}</p>
                            </div>
                        </td>
                        <td>
                            <div class="people">
                                <table class="table table-dark table-striped">
                                    <thead>
                                        <tr>
                                            <th colspan="2" class="text-center">Rendezte</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colspan="2" class="text-center">{movie.director}</td>
                                        </tr>
                                        <tr><td colspan="2" class="text-center"><strong>Színészek</strong></td></tr>
                                        <tr>
                                            <td colspan="2" class="text-center">{movie.actor1}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" class="text-center">{movie.actor2}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" class="text-center">{movie.actor3}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="comment" colspan="2">
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
                                <textarea bind:value={comment} name="komment" cols="75" rows="4" id="comment"></textarea><br>
                                <button id="send" class="btn btn-success" on:click={submitRating}>Küldés</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div class="ratings-section">
                                <h3>Értékelések:</h3>
                                {#each movieRatings as rating}
                                    <div class="rating">
                                        <div>
                                            {#each Array(rating.ratingNumber).fill('★') as _}
                                                <span class="star">★</span>
                                            {/each}
                                            {#each Array(5 - rating.ratingNumber).fill('☆') as _}
                                                <span class="star">☆</span>
                                            {/each}
                                            <p><strong>{rating.username || 'Ismeretlen felhasználó'}</strong>: {rating.comment}</p>
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

    <div class="toast" class:success={toast.type === 'success'} class:error={toast.type === 'error'} class:visible={toast.visible}>
        {toast.message}
    </div>
</main>

<style>
    .container {
        margin-left: 300px;
        padding: 20px;
        color: white;
        margin-top: 25px;
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
    .picture,
    .content,
    .people {
        width: 100%;
        padding: 10px;
    }
    .star {
        font-size: 2.0rem;
        color: gold;
        cursor: pointer;
    }
    .star + .star {
        margin-left: 2px;
    }
    img {
        width: 400px;
        height: 700px;
    }
    .desc {
        width: 300px;
    }
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        transform: translateY(-20px);
    }
    .toast.visible {
        opacity: 1;
        transform: translateY(0);
    }
    .toast.success {
        background-color: #28a745;
    }
    .toast.error {
        background-color: #dc3545;
    }
</style>
