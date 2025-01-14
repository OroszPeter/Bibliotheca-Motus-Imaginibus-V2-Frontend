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
                isUpdated = true;
            }
        }

        if (newEmail) {
            const success = await updateUserData('Account/update-email', { newEmail });
            if (success) {
                userStore.update((user) => ({ ...user, email: newEmail }));
                isUpdated = true;
            }
        }

        if (oldPassword && newPassword) {
            const success = await updateUserData('Account/password', { oldPassword, newPassword });
            if (success) {
                isUpdated = true;
            }
        }

        if (isUpdated) {
            const successMessageDiv = document.createElement('div');
            successMessageDiv.textContent = 'Adatok sikeresen frissítve!';
            successMessageDiv.style.position = 'fixed';
            successMessageDiv.style.top = '20px';
            successMessageDiv.style.left = '50%';
            successMessageDiv.style.transform = 'translateX(-50%)';
            successMessageDiv.style.backgroundColor = 'green';
            successMessageDiv.style.color = 'white';
            successMessageDiv.style.padding = '10px 20px';
            successMessageDiv.style.borderRadius = '5px';
            successMessageDiv.style.zIndex = '1000';
            document.body.appendChild(successMessageDiv);

            setTimeout(() => {
                selectedForm = 'userdata';
                successMessageDiv.remove();
            }, 3000);
        }
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
            const successMessageDiv = document.createElement('div');
            successMessageDiv.textContent = 'Profil sikeresen törölve!';
            successMessageDiv.style.position = 'fixed';
            successMessageDiv.style.top = '20px';
            successMessageDiv.style.left = '50%';
            successMessageDiv.style.transform = 'translateX(-50%)';
            successMessageDiv.style.backgroundColor = 'red';
            successMessageDiv.style.border = '1px solid black';
            successMessageDiv.style.color = 'white';
            successMessageDiv.style.padding = '10px 20px';
            successMessageDiv.style.borderRadius = '5px';
            successMessageDiv.style.zIndex = '1000';
            document.body.appendChild(successMessageDiv);

            // Adatok törlése a store-ból és a localStorage-ból
            userStore.set({});
            localStorage.removeItem('authToken');
            localStorage.removeItem('userStore');

            // Átirányítás a kezdőlapra vagy bejelentkező oldalra
            setTimeout(() => {
                window.location.href = '/';
                successMessageDiv.remove();
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
                                <input class="form-control" type="password" placeholder="Régi jelszó" bind:value={oldPassword}>
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-lock-fill"></i></span>
                                <input class="form-control" type="password" placeholder="Új jelszó" bind:value={newPassword}>
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
                            <h3 class="title">{lastName} {firstName}</h3>
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
    h5{
        font-size: 20px;
    }
    p{
        color: black;
        z-index: 100;
    }
    .form-container{
        position: relative;
        top: 50%;
        left: 75%;
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
    .form-horizontal .forgot-pass{
        font-size: 12px;
        text-align: center;
        display: block;
    }
    .form-horizontal .forgot-pass a{
        color: #999;
        transition: all 0.3s ease;
    }
    .form-horizontal .forgot-pass a:hover{
        color: #777;
        text-decoration: underline;
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
