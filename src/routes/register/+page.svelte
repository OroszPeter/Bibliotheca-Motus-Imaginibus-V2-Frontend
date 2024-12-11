<script>
    import { nightMode } from '../../store.js'; // Importáld a nightMode store-t
    import { writable } from 'svelte/store'; // Üzenet store
    
    let isNightMode; // Változó a sötét mód állapotához
    let successMessage = writable('');
    let errorMessage = writable('');
    
    // Subscribe a nightMode store-hoz
    nightMode.subscribe(value => {
        isNightMode = value;
    });

    // A regisztrációs űrlap adatainak tárolása
    let formData = {
        firstName: '', // kereszt név
        lastName: '', // vezetéknév
        email: '',
        password: ''
    };

    // A regisztrációs kérelem küldése
    const submitForm = async (event) => {
        event.preventDefault(); // Ne frissítse az oldalt

        // Töröljük az esetleges előző üzeneteket
        successMessage.set('');
        errorMessage.set('');

        // Post kérés az API-ra
        try {
            const response = await fetch('https://localhost:7214/api/Account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.text(); // A szöveges válasz feldolgozása

            // A regisztrációs kérelem sikeres végrehajtása után
if (response.status === 200) {
    successMessage.set(data); // A sikeres üzenet

    // Pár másodperc múlva átirányítjuk a felhasználót a login oldalra
    setTimeout(() => {
        window.location.href = '/login'; // Átirányítás a /login oldalra
    }, 2000); // 2 másodperc várakozás

            } else {
                errorMessage.set(data || 'Hiba történt a regisztráció során.');
            }
        } catch (error) {
            errorMessage.set('Hiba történt a regisztráció során.');
        }
    };
</script>

<main class="{isNightMode ? 'nightMode' : ''} vh-100">
    <div class="container d-flex justify-content-center pt-3 vh-75">
        <div class="card p-3" style="width: 300px; height:575px;">
            <h3 class="text-center mb-2">Regisztráció</h3>
            <form on:submit={submitForm}>
                <div class="mb-1">
                    <label for="firstName" class="form-label">Keresztnév</label>
                    <input type="text" class="form-control" id="firstName" bind:value={formData.firstName} placeholder="Keresztnév" required>
                </div>
                <div class="mb-1">
                    <label for="lastName" class="form-label">Vezetéknév</label>
                    <input type="text" class="form-control" id="lastName" bind:value={formData.lastName} placeholder="Vezetéknév" required>
                </div>
                <div class="mb-1">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" bind:value={formData.email} placeholder="Email" required>
                </div>
                <div class="mb-1">
                    <label for="password" class="form-label">Jelszó</label>
                    <input type="password" class="form-control" id="password" bind:value={formData.password} placeholder="Jelszó" required>
                </div>
                <div class="d-flex flex-column justify-content-center">
                    <button type="submit" class="btn my-2">Regisztráció</button>
                </div>
                <hr class="my-3">
                <div class="d-flex flex-column justify-content-center">
                    <h5 class="text-center">Már van fiókod?</h5><br>
                    <a href="/login" class="btn">Bejelentkezés</a>
                </div>
            </form>

            <!-- Üzenet megjelenítése a regisztráció eredményéről -->
            {#if $successMessage}
                <div class="alert alert-success mt-3" role="alert">
                    {$successMessage}
                </div>
            {/if}
            {#if $errorMessage}
                <div class="alert alert-danger mt-3" role="alert">
                    {$errorMessage}
                </div>
            {/if}
        </div>
    </div>
</main>

<style>
    main{
        background-color: #FFF2D7;
    }
    .card, a{
        background-color:  #FF7D29;
        text-decoration: none;
        color: #FEFFD2;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: normal;
    }
    a:hover{
        color: white;
    }
    input{
        outline: none;
    }
    .btn{
        background-color: #FFBF78;
    }
    .nightMode {
        background-color: #444; /* Háttérszín sötét módban */
    }
    .nightMode .card {
        background-color: black; /* Kártya háttérszíne sötét módban */
        color: white; /* Kártya szöveg színe sötét módban */
    }
    .nightMode a {
        background-color: black; /* Link háttérszíne sötét módban */
        color: red; /* Link színe sötét módban */
    }
    .nightMode .btn{
        background-color: #444;
    }
</style>
