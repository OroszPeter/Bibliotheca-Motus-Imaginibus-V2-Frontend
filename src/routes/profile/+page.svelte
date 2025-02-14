<script>
    import { slide } from 'svelte/transition';
    import { userStore, authToken, API_Url, isLoggedIn } from '../../store.js';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let selectedForm = 'userdata';

    // Felhasználói adatok figyelése
    $: userName = $userStore.userName || '';
    $: email = $userStore.email || '';
    $: firstName = $userStore.firstName || '';
    $: lastName = $userStore.lastName || '';
    $: token = $authToken.token;  // Token

    let newUsername = '';
    let newEmail = '';
    let oldPassword = '';
    let newPassword = '';
    let showAlert = false;
    let alertMessage = '';
    let alertColor = '';

    // PUT kérés küldése API végpontra
    async function updateUserData(endpoint, payload) {
        try {
            const response = await fetch(`${API_Url}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.text(); // Szöveges választ kapunk
                return true; // Sikeres módosítás
            } else {
                const errorData = await response.json();
                return false; // Sikertelen módosítás
            }
        } catch (error) {
            console.error('Hálózati hiba:', error);
            return false; // Hiba történt
        }
    }

    // Adatok módosítása
async function handleSubmit(event) {
    event.preventDefault();

    let isUpdated = false;

    if (newUsername) {
        const success = await updateUserData('Account/update-username', { newUsername });
        if (success) {
            userStore.update((user) => ({ ...user, userName: newUsername }));
            newUsername = ""; // Input törlése
            isUpdated = true;
        }
    }

    if (newEmail) {
        const success = await updateUserData('Account/update-email', { newEmail });
        if (success) {
            userStore.update((user) => ({ ...user, email: newEmail }));
            newEmail = ""; // Input törlése
            isUpdated = true;
        }
    }

    if (oldPassword && newPassword) {
        const success = await updateUserData('Account/update-password', { oldPassword, newPassword });
        if (success) {
            oldPassword = ""; // Input törlése
            newPassword = ""; // Input törlése
            isUpdated = true;
        }
    }

    if (isUpdated) {
        showSuccessMessage('Adatok sikeresen módosítva!', '#198754');
        selectedForm = 'userdata';
    }
}


    function showSuccessMessage(message, color) {
        alertMessage = message;
        alertColor = color;
        showAlert = true;
    
        setTimeout(() => {
            showAlert = false;
        }, 3000);
    }

    // Profil törlése
    async function handleDeleteProfile() {
    if (!confirm('Biztosan törölni szeretnéd a profilodat?')) {
        return; // Ha a felhasználó nem erősítette meg, kilépünk.
    }

    try {
        const response = await fetch(`${API_Url}Account/delete-profile`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const message = await response.text(); // Szöveges válasz feldolgozása
            showSuccessMessage('Profil sikeresen törölve', '#dc3545');

            // Adatok törlése a store-ból és a localStorage-ból
            userStore.set({});
            localStorage.removeItem('authToken');
            localStorage.removeItem('userStore');

            // Átirányítás a kezdőlapra vagy bejelentkező oldalra
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
            isLoggedIn.set(false);
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
    }
}
</script>

<div class="form-bg">
    <div class="container">
        {#if showAlert}
      <div class="alert alert-success">
        {alertMessage}
      </div>
    {/if}
        <div class="row">
            <div class="col-lg-offset-3 col-lg-6 col-md-offset-2 col-md-8">
                <div class="form-container bg-danger">
                    <!-- Profil szerkesztése Form -->
                    {#if selectedForm === 'edit'}
                        <div class="form-icon form-left" transition:slide>
                            <i class="bi bi-pencil-fill"></i>
                            <span class="signup">
                                <a href="#" on:click|preventDefault={() => selectedForm = 'userdata'}>
                                    Vissza a profil adatokhoz
                                </a>
                            </span>
                        </div>
                        <form class="form-horizontal form-left" transition:slide on:submit={handleSubmit}>
                            <h3 class="title">Adatok módosítása</h3>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-person-lines-fill"></i></span>
                                <input class="form-control" type="text" placeholder="Felhasználónév" bind:value={newUsername}>
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-envelope-fill"></i></span>
                                <input class="form-control" type="email" placeholder="E-mail cím" bind:value={newEmail}>
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-unlock-fill"></i></span>
                                
                        <!-- Jelszó mező -->
                        <input
                            type="password"
                            class="form-control current-password"
                            id="currentPassword"
                            bind:value={oldPassword}
                            placeholder="Jelenlegi jelszó"
                        />
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-lock-fill"></i></span>
                    
                        <!-- Jelszó mező -->
                        <input
                            type="password"
                            class="form-control new-password"
                            id="newPassword"
                            bind:value={newPassword}
                            placeholder="Új jelszó"
                        />
                    <span>
                    </span>
                            </div>
                            <button class="btn signin bg-danger" type="submit">Módosít</button>
                        </form>
                    {/if}

                    <!-- Profil adatok Form -->
                    {#if selectedForm === 'userdata'}
                        <div class="form-icon form-right" transition:slide>
                            <i class="bi bi-person-circle"></i>
                            <span class="signup">
                                <a href="#" on:click|preventDefault={() => selectedForm = 'edit'}>
                                    Profil módosítása
                                </a>
                            </span>
                        </div>
                        <form class="form-horizontal form-right" transition:slide>
                            {#if $isLoggedIn && ($userStore.roles) && $userStore.roles[0] === "Admin"}
                            <h3 class="title neontext">{lastName} {firstName}</h3>
                {:else}
                <h3 class="title">{lastName} {firstName}</h3>
                {/if}
                            <h5><b>Felhasználónév:</b> {userName}</h5>
                            <h5><b>Email:</b> {email}</h5>
                            <button class="btn btn-danger mt-5" on:click={handleDeleteProfile}>Profil törlése</button>
                        </form>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>



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
  }

  .alert.alert-success {
    display: block;
    animation: fadeOut 3s forwards;  /* Animáció, hogy eltűnjön */
  }
    
    @keyframes fadeOut {
        0% { opacity: 1; }
        90% { opacity: 1; }
        100% { opacity: 0; display: none; }
      }
        /* Mobilon kisebb eltolás */
    @media (max-width: 576px) {
        .form-container {
            left: 60%;
            transform: translate(-50%);
            margin-top: 30px; /* 60px eltolás */
            width: 80%; /* Szélesebb, hogy ne legyen túl kicsi */
        }
    }
    
    @media (min-width: 576px) and (max-width: 1024px) {
        .form-container {
            width: 80%; /* Tableten szélesebb, de nem teljes szélesség */
        }
    }
    @media (min-width: 1024px) {
        .form-container{
            position: relative;
            top: 50%;
            left: 75%;
        }
    }
        .form-container{
            position: relative;
            font-family: 'Roboto', sans-serif;
            font-size: 0;
            padding: 0 15px;
            border: 1px solid #DC2036;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
        }
        .form-container .form-icon{
            color: #fff;
            font-size: 13px;
            text-align: center;
            text-shadow: 0 0 20px rgba(0,0,0,0.2);
            width: 50%;
            padding: 70px 0;
            vertical-align: top;
            display: inline-block;
        }
        .form-container .form-icon i{
            font-size: 124px;
            margin: 0 0 15px;
            display: block;
        }
        .form-container .form-icon .signup a{
            color: #fff;
            text-transform: capitalize;
            transition: all 0.3s ease;
        }
        .form-container .form-icon .signup a:hover{ text-decoration: underline; }
        .form-container .form-horizontal{
            background: rgba(255,255,255,0.99);
            width: 50%;
            padding: 60px 30px;
            margin: -20px 0;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            display: inline-block;
        }
        .form-container .title{
            color: #454545;
            font-size: 23px;
            font-weight: 900;
            text-align: center;
            text-transform: capitalize;
            letter-spacing: 0.5px;
            margin: 0 0 30px 0;
        }
        .form-horizontal .form-group{
            background-color: rgba(255,255,255,0.15);
            margin: 0 0 15px;
            border: 1px solid #b5b5b5;
            border-radius: 20px;
        }
        .form-horizontal .input-icon{
            color: #b5b5b5;
            font-size: 15px;
            text-align: center;
            line-height: 38px;
            height: 35px;
            width: 40px;
            vertical-align: top;
            display: inline-block;
        }
        .form-horizontal .form-control{
            color: #b5b5b5;
            background-color: transparent;
            font-size: 14px;
            letter-spacing: 1px;
            width: calc(100% - 55px);
            height: 33px;
            padding: 2px 10px 0 0;
            box-shadow: none;
            border: none;
            border-radius: 0;
            display: inline-block;
            transition: all 0.3s;
        }
        .form-horizontal .form-control:focus{
            box-shadow: none;
            border: none;
        }
        .form-horizontal .form-control::placeholder{
            color: #b5b5b5;
            font-size: 13px;
            text-transform: capitalize;
        }
        .form-horizontal .btn{
            color: rgba(255,255,255,0.8);
            background: #E9374C;
            font-size: 15px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            width: 100%;
            margin: 0 0 10px 0;
            border: none;
            border-radius: 20px;
            transition: all 0.3s ease;
        }
        .form-horizontal .btn:hover,
        .form-horizontal .btn:focus{
            color: #fff;
            background-color: #D31128;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        @media only screen and (max-width:576px){
            .form-container{ padding-bottom: 15px; }
            .form-container .form-icon{
                width: 100%;
                padding: 20px 0;
            }
            .form-container .form-horizontal{
                width: 100%;
                margin: 0;
            }
        }
    </style>
    
