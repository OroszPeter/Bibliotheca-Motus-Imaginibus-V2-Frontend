<script>
    import { slide } from 'svelte/transition';
    import { userStore, isLoggedIn, authToken, API_Url } from '../../store.js';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let selectedForm = 'login';
 // Felhasználói adatok figyelése
    let isUserLoggedIn;
    $: isUserLoggedIn = $isLoggedIn;
    $: userName = $userStore.userName || '';
    $: email = $userStore.email || '';
    $: firstName = $userStore.firstName || '';
    $: lastName = $userStore.lastName || '';

    // Az authToken store-ból kinyerjük a token-t
    let token = $authToken.token;  // Itt már az authToken store értékét használjuk

    onMount(() => {
        if (browser) {
            // Ha van token a localStorage-ban, beállítjuk a store értékét
            const authTokenFromStorage = localStorage.getItem("authToken");
            if (authTokenFromStorage) {
                const parsedToken = JSON.parse(authTokenFromStorage);
                token = parsedToken.token;
                console.log('Token sikeresen betöltve:', token);
            } else {
                console.log('Token nem található a localStorage-ban');
            }
        }
    });


</script>


<div class="form-bg">
    <div class="container">
        <div class="row">
            <div class="col-lg-offset-3 col-lg-6 col-md-offset-2 col-md-8">
                <div class="form-container bg-danger">
                    <!-- Profil szerkesztése Form -->
                    {#if selectedForm === 'register'}
                        <div class="form-icon form-left" transition:slide>
                            <i class="bi bi-pencil-fill"></i>
                            <span class="signup">
                                <a href="#" on:click|preventDefault={() => selectedForm = 'login'}>
                                    Vissza a profil adatokhoz
                                </a>
                            </span>
                        </div>
                        <form class="form-horizontal form-left" transition:slide>
                            <h3 class="title">Adatok módosítása</h3>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-person-lines-fill"></i></span>
                                <input class="form-control" type="text" placeholder="Felhasználónév">
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-envelope-fill"></span>
                                <input class="form-control" type="text" placeholder="E-mail cím">
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-unlock-fill"></i></span>
                                <input class="form-control" type="password" placeholder="Jelszó">
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-lock-fill"></i></span>
                                <input class="form-control" type="password" placeholder="Jelszó újra">
                            </div>
                            <button class="btn signin bg-danger">Módosít</button>
                        </form>
                    {/if}

                    <!-- Profil adatok Form -->
                    {#if selectedForm === 'login'}
                        <div class="form-icon form-right" transition:slide>
                            <i class="bi bi-person-circle"></i>
                            <span class="signup">
                                <a href="#" on:click|preventDefault={() => selectedForm = 'register'}>
                                    Profil módosítása
                                </a>
                            </span>
                        </div>
                        <form class="form-horizontal form-right" transition:slide>
                            <h3 class="title">{lastName} {firstName}</h3>
                            <h5>Felhasználónév: {userName}</h5>
                            <h5>Email: {email}</h5>
                            <button class="btn btn-danger mt-5">Profil törlése</button>
                            
                            
                        </form>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
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
