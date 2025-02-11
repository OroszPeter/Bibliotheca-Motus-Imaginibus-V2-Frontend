<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { authToken, userStore, API_Url, isLoggedIn } from '../../../store.js';

    let { movie, movieRatings, averageRating } = $page.data;
    let imageUrl = '';
    let isLoading = !movie;
    let rating = 0;
    let hoverRatingValue = 0;
    let comment = '';
    let toast = { message: '', type: '', visible: false };
    let users = {}; // User ID -> username tárolás
    let releasedYear = new Date(movie.releasedDate).getFullYear();
    let isAtWatchlist = false;
    let fileInput;
    let showAlert = false;
    let alertMessage = '';
    let alertColor = '';

    let editingCommentId = null;
    let editedComment = '';
    let editedRating = 0;

    function showSuccessMessage(message, color) {
        alertMessage = message;
        alertColor = color;
        showAlert = true;
    
        setTimeout(() => {
            showAlert = false;
        }, 3000);
    }

    function startEditing(rating) {
        editingCommentId = rating.id;
        editedComment = rating.comment;
        editedRating = rating.ratingNumber;

        // Erőltetett állapotfrissítés Svelte számára
        editingCommentId = editingCommentId;
    }

    async function saveEditedComment(rating) {
    const token = getStoreValue(authToken)?.token;
    const userId = getStoreValue(userStore)?.id;

    if (!token || rating.userId !== userId) {
        return;
    }

    const updatedRating = {
        movieId: movie.id,
        ratingNumber: editedRating,
        userId: rating.userId,
        comment: editedComment
    };

    // Optimista frissítés: az UI-t azonnal frissítjük
    movieRatings = movieRatings.map(r => r.id === rating.id ? { ...r, comment: editedComment, ratingNumber: editedRating } : r);

    try {
        const response = await fetch(`${API_Url}Ratings/${rating.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedRating)
        });

        if (!response.ok) throw new Error(`Hiba a módosításkor: ${response.status} ${response.statusText}`);

        // Ellenőrizzük, hogy van-e válasz tartalom
        let updatedRatingResponse = null;
        const text = await response.text();
        if (text) {
            updatedRatingResponse = JSON.parse(text);
        }

        // Ha kaptunk választ, frissítsük az állapotot
        if (updatedRatingResponse) {
            movieRatings = movieRatings.map(r => r.id === rating.id ? updatedRatingResponse : r);
        }

        // Visszaállítjuk az állapotot
        editingCommentId = null;
        editedComment = '';
        editedRating = 0;
        showSuccessMessage('Sikeres módosítás!', 'orange');
    } catch (error) {
        console.error('Hiba a komment módosításakor:', error);

        // Hibakezelés: ha hiba történt, állítsuk vissza az optimista módosítást
        movieRatings = movieRatings.map(r => r.id === rating.id ? rating : r);
    }
}


    function cancelEdit() {
        editingCommentId = null;
        editedComment = '';
        editedRating = 0;

        // Állapotfrissítés kikényszerítése
        editingCommentId = editingCommentId;
    }

    function toLogin() {
        window.location.href = "/login";
    }

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

    async function deleteMovie(id) {
        const token = getStoreValue(authToken)?.token;

        if (!token) {
            return;
        }

        // Megerősítés alert
        const confirmed = confirm('Biztosan törölni szeretnéd ezt a filmet?');
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_Url}Movie/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Nem sikerült a film törlése.');

            // Sikerüzenet megjelenítése
            showSuccessMessage('Film törölve!', '#DC3545');
            window.location.href = "/";
        } catch (error) {
            console.error('Hiba a film törlésekor:', error);
        }
    }

    // ** Az updateMovie függvény visszaállítása **
    async function updateMovie(movieId) {
    const token = getStoreValue(authToken)?.token;

    if (!token) {
        return;
    }

    const updatedMovie = {
        title: movie.title,              // Film címe
        description: movie.description,  // Film leírása
        releasedDate: movie.releasedDate, // Film megjelenési dátuma
        genre: movie.genre,              // Műfaj
        length: movie.length,            // Film hossza
        director: movie.director,        // Rendező
        actor1: movie.actor1,            // Színész 1
        actor2: movie.actor2,            // Színész 2
        actor3: movie.actor3,            // Színész 3
        isSeries: movie.isSeries,        // Sorozat-e?
        numberOfSeasons: movie.numberOfSeasons, // Ha sorozat, hány évad?
        numberOfEpisodes: movie.numberOfEpisodes // Ha sorozat, hány epizód?
    };

    try {
        const response = await fetch(`${API_Url}Movie/${movieId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedMovie)
        });

        if (!response.ok) throw new Error('Hiba a film frissítésekor.');

        const updatedMovieResponse = await response.text();
        movie = updatedMovieResponse;

        // Sikerüzenet megjelenítése
        showSuccessMessage('Film frissítve!', '#28a745');
        isEditing = false;
    } catch (error) {
        console.error('Hiba a film frissítésekor:', error);
    }
}


    async function fetchUsernames() {
        try {
            const response = await fetch(`${API_Url}Account/users`);
            if (!response.ok) throw new Error('Nem sikerült a felhasználók betöltése.');

            const userData = await response.json();
            users = userData.reduce((acc, user) => {
                acc[user.id] = user.userName; // userName használata username helyett
                return acc;
            }, {});
        } catch (error) {
            console.error('Hiba a felhasználónevek lekérdezésekor:', error);
        }
    }

    let watchlistItemId = null; // A watchlist elem ID-jának tárolása

    async function fetchWatchlist() {
        const token = getStoreValue(authToken)?.token;
        const userId = getStoreValue(userStore)?.id;

        if (!token || !userId) {
            return;
        }

        try {
            const response = await fetch(`${API_Url}Watchlist`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Nem sikerült a watchlist lekérdezése.');

            const watchlist = await response.json();
            const item = watchlist.find(item => item.movieId === movie.id && item.userId === userId);
            isAtWatchlist = !!item;
            watchlistItemId = item ? item.id : null; // Az elem ID-jának mentése
        } catch (error) {
            console.error('Hiba a watchlist lekérdezésekor:', error);
        }
    }

    async function removeFromWatchlist() {
        const token = getStoreValue(authToken)?.token;

        if (!token || !watchlistItemId) {
            return;
        }

        try {
            const response = await fetch(`${API_Url}Watchlist/${watchlistItemId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Nem sikerült a film eltávolítása a watchlistből.');

            showSuccessMessage('Sikeresen eltávolítva a watchlistból!', '#dc3545');
            isAtWatchlist = false;
            watchlistItemId = null; // Törlés után nullázás
        } catch (error) {
            console.error('Hiba a film eltávolításakor:', error);
        }
    }

    async function submitRating() {
        const token = getStoreValue(authToken)?.token;
        const userId = getStoreValue(userStore)?.id;

        if (!userId || !token) {
            return;
        }

        const newRating = { movieId: movie.id, ratingNumber: rating, userId, comment };

        try {
            const response = await fetch(`${API_Url}Ratings`, {
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

            // Sikerüzenet megjelenítése
            showSuccessMessage('Értékelés elküldve!', '#198754');
        } catch (error) {
            console.error('Hiba az értékelés beküldésekor:', error);
        }
    }

    async function AddToWatchlist() {
        const addedDate = new Date().toISOString();
        const token = getStoreValue(authToken)?.token;
        const userId = getStoreValue(userStore)?.id;

        if (!userId || !token) {
            return;
        }

        const newWatchlist = { movieId: movie.id, userId, addedDate };

        try {
            const response = await fetch(`${API_Url}Watchlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newWatchlist)
            });

            if (!response.ok) {
                const errorMessage = `Hiba: ${response.status} - ${response.statusText}`;
                throw new Error(errorMessage);
            }

            // Sikerüzenet megjelenítése
            showSuccessMessage('Sikeresen hozzáadva a watchlisthez!', 'orange');
            isAtWatchlist = true;
        } catch (error) {
            console.error('Hiba a watchlisthez adáskor:', error);
        }
    }

    async function deleteRating(id) {
        const token = getStoreValue(authToken)?.token;

        if (!token) {
            return;
        }

        try {
            const response = await fetch(`${API_Url}Ratings/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Nem sikerült az értékelés törlése.');

            movieRatings = movieRatings.filter(rating => rating.id !== id);

            // Sikerüzenet megjelenítése
            showSuccessMessage('Értékelés törölve!', '#dc3545');
        } catch (error) {
            console.error('Hiba az értékelés törlésekor:', error);
        }
    }

    let isEditing = false; // A szerkesztési mód követése

    function toggleEdit() {
        isEditing = !isEditing;
    }

    async function uploadImage(filmId) {
    if (!fileInput || !fileInput.files.length) {
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    console.log("PUT kérés a kép feltöltéséhez, filmId:", filmId);

    try {
        const response = await fetch(`${API_Url}Movie/${filmId}/kep`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) throw new Error('Hiba a film képének feltöltésekor.');

        // **Frissítsd az imageUrl értékét az újonnan feltöltött fájlra**
        imageUrl = URL.createObjectURL(file);

        showSuccessMessage('Kép sikeresen feltöltve!', '#28a745');
        isEditing = false;
    } catch (error) {
        console.error('Hiba a kép feltöltésekor:', error);
    }
}


    onMount(async () => {
        try {
            await fetchUsernames();
            if (movie) {
                const movieId = movie.id;
                imageUrl = `${API_Url}Movie/${movieId}/kep`;

                const response = await fetch(imageUrl);
                if (!response.ok) throw new Error('Kép nem érhető el');

                await fetchWatchlist();
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
  <!-- Modal -->
  <div class="modal fade pt-5" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title text-white fs-5" id="staticBackdropLabel">Tartalom szerkesztése</h1>
        </div>
        <div class="modal-body">
            <div class=" w-75">
                <input type="text" bind:value={movie.title} class="form-control mt-1" />
                <input type="text" bind:value={movie.releasedDate} class="form-control mt-1" />
                <input type="text" bind:value={movie.genre} class="form-control mt-1" />
                <input type="text" bind:value={movie.length} class="form-control mt-1" />
                {#if movie.isSeries}
                <input type="text" bind:value={movie.numberOfSeasons} class="form-control mt-1" />
                <input type="text" bind:value={movie.numberOfEpisodes} class="form-control mt-1" />
                {/if}
                <textarea bind:value={movie.description} class="form-control mt-1"></textarea>
                <input type="text" bind:value={movie.director} class="form-control mt-1" />
                <input type="text" bind:value={movie.actor1} class="form-control mt-1" />
                <input type="text" bind:value={movie.actor2} class="form-control mt-1" />
                <input type="text" bind:value={movie.actor3} class="form-control mt-1" />
                <input type="file" bind:this={fileInput} class="form-controll mt-1"/>
                <!-- További mezők is hasonló módon -->
            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" on:click={toggleEdit}>Mégse</button>
          <button type="button" class="btn btn-success" data-bs-dismiss="modal" on:click={updateMovie && uploadImage(movie.id)}>Szerkesztés</button>
        </div>
      </div>
    </div>
  </div>
    {#if isLoading}
        <div>Betöltés...</div>
    {:else if movie}

    {#if showAlert}
  <div class="alert" style="background-color: {alertColor};">
    {alertMessage}
  </div>
{/if}

        <div class="container pt-5 w-75">
            <table class="pt-5">
                <tbody>
                    <tr>
                        <td rowspan="2">
                            <div class="picture align-top">
                                {#if imageUrl}
                                    <img src={imageUrl} class="img-fluid" alt={movie.title} />
                                {:else}
                                    <img src="https://placehold.co/400x600" class="img-fluid" alt="Placeholder image" />
                                {/if}
                            </div>
                        </td>
                        <td class="desc align-top">
                            <div class="content">
                                <h2>
                                    {movie.title} <small>({releasedYear})</small>
                                    {#if isAtWatchlist}
                                    <button class="btn btn-primary btn-sm ms-2" on:click={() => removeFromWatchlist()} title="Eltávolítás a watchlistből"><i class="bi bi-bookmark-fill"></i></button>
                                    {:else}
                                    <button class="btn btn-primary btn-sm ms-2" on:click={() => AddToWatchlist()} title="Hozzáadás watchlist-hez"><i class="bi bi-bookmark"></i></button>
                                    {/if}
                                    {#if $isLoggedIn && ($userStore.roles) && $userStore.roles[0] === "Admin"}
                                    <button class="btn btn-danger btn-sm ms-2" on:click={() => deleteMovie(movie.id)}><i class="bi bi-trash" title="Törlés"></i></button>
                                    {#if $isLoggedIn && $userStore.roles && $userStore.roles[0] === "Admin"}
                                        {#if isEditing}
                                        {:else}
                                        <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop" on:click={toggleEdit}><i class="bi bi-pencil" title="Szerkesztés"></i></button>
                                        {/if}
    {/if}
                                    {/if}
                                </h2>
                                
                                <p><strong>{movie.genre}</strong> - {movie.length}p</p>
                                {#if movie.isSeries}
                                    {#if movie.numberOfSeasons > 1}
                                    <p>{movie.numberOfSeasons} évad, {movie.numberOfEpisodes} epizód</p>
                                    {:else}
                                    <p>{movie.numberOfEpisodes} epizód</p>
                                    {/if}
                                {/if}
                                <small>{averageRating.toFixed(1)} &#9733;</small>
                                <p class="description">{movie.description || 'Film leírás nem elérhető.'}</p>
                            </div>
                        </td>
                        <td>
                            <div class="people align-top">
                                <table class="table table-dark table-striped">
                                    <thead>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="p"><b>Rendezte</b></td>
                                            <td class="p">{movie.director}</td>
                                        </tr>
                                        <tr>
                                            <td class="align-middle p" rowspan="3"><b>Szereplők</b></td>
                                            <td class="p">{movie.actor1}</td>
                                        </tr>
                                        <tr>
                                            <td class="p">{movie.actor2}</td>
                                        </tr>
                                        <tr>
                                            
                                            <td class="p">{movie.actor3}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        {#if $isLoggedIn}
                        <td class="comment" colspan="2">
                            <div class="addcomment mt-4 align-top">
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
                                <textarea bind:value={comment} name="komment" id="comment"></textarea>
                                <button id="send" class="btn btn-success" on:click={submitRating}>Küldés</button>
                            </div>
                        </td>
                        {:else}
                        <td colspan="2">
                        <div id="login" class="w-100">
                            <h5 class="text-center">Az értékeléshez jelentkezz be!</h5>
                            <button class="btn btn-warning" on:click={() => toLogin()}>Bejelentkezés</button>
                        </div>
                        </td>
                        {/if}
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div class="ratings-section">
                                <h3>Értékelések:</h3>
                                {#each movieRatings as rating (rating.id)}
                                    <div class="rating">
                                        <div>
                                            {#each Array(rating.ratingNumber).fill('★') as _}
                                                <span class="star">★</span>
                                            {/each}
                                            {#each Array(5 - rating.ratingNumber).fill('☆') as _}
                                                <span class="star">☆</span>
                                            {/each}
                            
                                            {#if editingCommentId === rating.id}
                                                <br>
                                                <textarea class="w-75" bind:value={editedComment}></textarea><br>
                                                <button class="btn btn-success" on:click={() => saveEditedComment(rating)}>Mentés</button>
                                                <button class="btn btn-secondary" on:click={() => cancelEdit()}>Mégse</button>
                                            {:else}
                                                <p>
                                                    <strong>{users[rating.userId] || 'Ismeretlen felhasználó'}</strong>: 
                                                    {rating.comment}
                                                </p>
                                            {/if}
                                        </div>
                            
                                        {#if getStoreValue(userStore)?.id === rating.userId}
                                            {#if editingCommentId !== rating.id}
                                                <button class="btn text-danger" on:click={() => deleteRating(rating.id)}>Törlés</button>
                                                <button class="btn text-warning" on:click={() => startEditing(rating)}>Szerkesztés</button>
                                            {/if}
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
      .alert {
    background-color: #28a745;  /* Zöld háttér */
    color: white;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: fadeOut 3s forwards;  /* Animáció, hogy eltűnjön */
  }

@keyframes fadeOut {
    0% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; display: none; }
  }
    .modal-content{
        border: 3px solid black;
        background-color: #333;
        opacity: 0.9;
    }
    input, textarea{
        field-sizing: content;
    }
    .p{
        border: 1px solid black;
    }
    #login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid black;
    padding: 10px;
    border-radius: 10px;
    height: 100%;
    background-color: #dc3545;
}

#login h5 {
    margin-bottom: 20px; /* Hely a szöveg és a gomb között */
}

#login .btn {
    padding: 10px 20px; /* A gomb méretének növelése */
    color: white;
}
#login .btn:hover {
    color: orange;
}
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
    .p {
        border: 1px solid black;
    }
    #login {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: 1px solid black;
        padding: 10px;
        border-radius: 10px;
        height: 100%;
        background-color: #dc3545;
    }
    #login h5 {
        margin-bottom: 20px;
    }
    #login .btn {
        padding: 10px 20px;
        color: white;
    }
    #login .btn:hover {
        color: orange;
    }
    .container {
        margin-left: auto;
        margin-right: auto;
        padding: 20px;
        color: white;
        margin-top: 25px;
        max-width: 90%;
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
        width: 100%;
        max-width: 400px;
        height: auto;
    }
    .desc {
        width: 100%;
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
    
    /* Reszponzivitás kisebb eszközökre */
    @media (max-width: 768px) {
        .container {
            margin-left: 60px;
        }
        table {
            display: block;
        }
        tbody,
        tr {
            display: block;
            width: 100%;
        }
        td {
            display: block;
            width: 100%;
        }
        .people,
        .desc,
        .comment {
            width: 100%;
        }
        .picture {
            text-align: center;
        }
        .picture img {
            max-width: 100%;
        }
    }
    #comment {
    width: 100%; /* A szülőelem teljes szélességét kihasználja */
    max-width: 700px; /* Nagy képernyőn ne legyen túl széles */
    min-width: 250px; /* Ne legyen túl keskeny */
    height: auto;
    min-height: 100px;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical; /* Engedi a méretállítást függőlegesen */
}

/* Mobilbarát beállítások */
@media (max-width: 768px) {
    #comment {
        width: 100%; /* Mobilon a teljes szélességet kitölti */
        min-width: unset;
    }
}
    @media (min-width: 1024px) {
        img {
        width: 400px;
        height: 700px;
    }
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
    @media (min-width: 1024px) {
    .container {
        margin-left: 300px;
        max-width: 80%; /* Szélesebb tartomány engedése */
    }
}
</style>
