<script>
    import { API_Url, isLoggedIn } from '../../store.js';
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router'; // Ha SPA routingot használsz
  
    let email = '';
    let showAlert = false;
    let alertMessage = 'Jelszó visszaállító email elküldve!';
  
    async function handleForgotPassword() {
      const url = `${API_Url}Account/forget-password`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        const data = await response.text();
        showAlert = true;

            setTimeout(() => {
                showAlert= false;
                window.location.href = "/login";
                            }, 3000);
        
      } else {
        const errorData = await response.text();
      }
    }
    onMount(async () => {
    if ($isLoggedIn) {
        window.location.href = "/";
    }
})
  </script>
  {#if $isLoggedIn}
  {:else}
  <div class="form-bg">
    <div class="container">
      {#if showAlert}
        <div class="alert alert-success">
          {alertMessage}
        </div>
      {/if}
      <div class="row">
        <div class="col-lg-offset-3 col-lg-6 col-md-offset-2 col-md-8">
          <div class="form-container p-5 bg-danger">
            <h3 class="title text-white">Elfelejtett jelszó</h3>
            <div class="form-group">
              <span class="input-icon"><i class="bi bi-envelope-fill"></i></span>
              <input class="form-control" type="email" placeholder="E-mail cím" bind:value={email}>
            </div>
            <button id="login" class="btn signin mt-3" on:click={handleForgotPassword}>Küldés</button>
            <span class="info text-dark">
              Fontos, hogy a felhasználódhoz tartozó érvényes email címedet add meg.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/if}
  
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
  /* Tartalom reszponzív elhelyezése */
.container {
  padding: 20px;
  color: white;
  margin-left: 100px; /* Mobilon kisebb eltolás */
}

@media (min-width: 768px) {
  .container {
    margin-left: 100px; /* Tableten nagyobb */
  }
}

@media (min-width: 1024px) {
  .container {
    margin-left: 300px; /* Nagy képernyőn teljes eltolás */
  }
}

      .form-container {
    position: relative; /* A formot az ablakhoz igazítjuk */
    margin-top: 50px;
    top: 50%; /* Függőlegesen középre */
    left: 50%; /* Vízszintesen középre */
    transform: translate(-50%, -50%); /* Pontosan középre tolás */
    font-family: 'Roboto', sans-serif;
    font-size: 0;
    padding: 15px;
    border: 1px solid #DC2036;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    background-color: #fff; /* Biztosítja, hogy a háttér ne legyen átlátszó */
}
.btn{
    color: black;
    background-color: whitesmoke;
    width: 100%;
}
.btn:hover{
    color: gray;
    background-color: wheat;
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
  @media only screen and (max-width:576px){
      .form-container{ padding-bottom: 15px; }
  }
  .form-group {
    position: relative;
    margin-bottom: 15px;
}

.input-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: gray;
}

.form-control {
    padding-left: 35px; /* Helyet hagyunk az ikon számára */
    height: 40px;
}
</style>