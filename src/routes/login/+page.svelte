<script>
    import { slide } from 'svelte/transition';
    import { userStore, isLoggedIn, authToken, API_Url } from '../../store.js';
    let showAlert = false;
    let alertMessage = '';
    let alertColor = '';
    let selectedForm = 'login';

    let loginData = {
        userName: '',
        password: ''
    };

    let registerData = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    };

    function showSuccessMessage(message, color) {
        alertMessage = message;
        alertColor = color;
        showAlert = true;
    
        setTimeout(() => {
            showAlert = false;
        }, 3000);
    }
    


    async function handleLogin() {
        try {
            const response = await fetch(`${API_Url}Account/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                throw new Error('Bejelentkezési hiba');
            }

            const data = await response.json();
            const token = data.token;

            // Token mentése a localStorage-ba és store-ba
            localStorage.setItem('authToken', token);
            authToken.set({ token });

            // Felhasználói adatok lekérése
            const userResponse = await fetch(`${API_Url}Account/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!userResponse.ok) {
                throw new Error('Felhasználói adatok lekérése sikertelen');
            }

            const userData = await userResponse.json();

            // Felhasználói adatok mentése a localStorage-ba és store-ba
            localStorage.setItem('user', JSON.stringify(userData));
            userStore.set(userData);

            // Bejelentkezett állapot frissítése
            isLoggedIn.set(true);

            showSuccessMessage('Sikeres bejelentkezés!', '#198754');
            setTimeout(() => {
                window.location.href = "/"; // Átirányítás a főoldalra
            }, 3000);
        } catch (error) {
            console.error('Bejelentkezési hiba:', error);
            alert('Sikertelen bejelentkezés');
        }
    }
    async function handleRegister() {
    try {
        const response = await fetch(`${API_Url}Account/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        if (!response.ok) {
            throw new Error('Regisztrációs hiba');
        }

        const message = await response.text();

        // Automatikus bejelentkezés regisztráció után
        const usernameFromEmail = registerData.email.split('@')[0]; // Az e-mail cím "@" előtti része
        loginData = {
            userName: usernameFromEmail,
            password: registerData.password
        };
        showSuccessMessage('Sikeres regisztráció!', '#198754');
        await handleLogin(); // Regisztráció után automatikus bejelentkezés
    } catch (error) {
        console.error('Regisztrációs hiba:', error);
        alert('Sikertelen regisztráció');
    }
}
</script>


<div class="form-bg">
    <div class="container">
        {#if showAlert}
  <div class="alert" style="background-color: {alertColor};">
    {alertMessage}
  </div>
{/if}
        <div class="row">
            <div class="col-lg-offset-3 col-lg-6 col-md-offset-2 col-md-8">
                <div class="form-container bg-danger">
                    <!-- Regisztrációs Form -->
                    {#if selectedForm === 'register'}
                        <div class="form-icon form-left" transition:slide>
                            <i class="bi bi-person-fill-add"></i>
                            <span class="signup">
                                <a href="#" on:click|preventDefault={() => selectedForm = 'login'}>
                                    Már van profilod? Bejelentkezés
                                </a>
                            </span>
                        </div>
                        <form class="form-horizontal form-left" transition:slide on:submit|preventDefault={handleRegister}>
                            <h3 class="title">Regisztráció</h3>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-person-lines-fill"></i></span>
                                <input class="form-control" type="text" placeholder="Vezetéknév" bind:value={registerData.lastName}>
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-person-lines-fill"></i></span>
                                <input class="form-control" type="text" placeholder="Keresztnév" bind:value={registerData.firstName}>
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-envelope-fill"></i></span>
                                <input class="form-control" type="email" placeholder="E-mail cím" bind:value={registerData.email}>
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-lock-fill"></i></span>
                                <input class="form-control" type="password" placeholder="Jelszó" bind:value={registerData.password}>
                            </div>
                            <button class="btn signin bg-danger">Regisztráció</button>
                        </form>
                    {/if}

                    <!-- Bejelentkezési Form -->
                    {#if selectedForm === 'login'}
                        <div class="form-icon form-right" transition:slide>
                            <i class="bi bi-person-circle"></i>
                            <span class="signup">
                                <a href="#" on:click|preventDefault={() => selectedForm = 'register'}>
                                    Nincs profilod? Regisztráció
                                </a>
                            </span>
                        </div>
                        <form class="form-horizontal form-right" transition:slide on:submit|preventDefault={handleLogin}>
                            <h3 class="title">Bejelentkezés</h3>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-person-square"></i></span>
                                <input id="username" class="form-control" type="text" placeholder="Felhasználónév" bind:value={loginData.userName}>
                            </div>
                            <div class="form-group">
                                <span class="input-icon"><i class="bi bi-lock-fill"></i></span>
                                <input id="password" class="form-control" type="password" placeholder="Jelszó" bind:value={loginData.password}>
                            </div>
                            <button id="login" class="btn signin bg-danger">Bejelentkezés</button>
                            <span class="forgot-pass">
                                <a href="/reset-password">Elfelejtetted a jelszavad?</a>
                            </span>
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
