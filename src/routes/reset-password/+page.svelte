<script>
    import { API_Url } from '../../store.js';
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router'; // Ha SPA routingot használsz
  
    let email = '';
  
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
        const successMessageDiv = document.createElement('div');
            successMessageDiv.textContent = 'Visszaállító email elküldve!';
            successMessageDiv.style.position = 'fixed';
            successMessageDiv.style.top = '20px';
            successMessageDiv.style.left = '50%';
            successMessageDiv.style.transform = 'translateX(-50%)';
            successMessageDiv.style.backgroundColor = 'green';
            successMessageDiv.style.border = '1px solid black';
            successMessageDiv.style.color = 'white';
            successMessageDiv.style.padding = '10px 20px';
            successMessageDiv.style.borderRadius = '5px';
            successMessageDiv.style.zIndex = '1000';
            document.body.appendChild(successMessageDiv);

            setTimeout(() => {
                successMessageDiv.remove();
                window.location.href = "/login";
                            }, 3000);
        
      } else {
        const errorData = await response.text();
      }
    }
  </script>
  
  <div class="form-bg">
    <div class="container">
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
  
<style>

      .form-container {
    position: absolute; /* A formot az ablakhoz igazítjuk */
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
  @media only screen and (max-width:576px){
      .form-container{ padding-bottom: 15px; }
      .form-container .form-icon{
          width: 100%;
          padding: 20px 0;
      }
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