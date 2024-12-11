<script>
    let subject = '';
    let description = '';
    let message = '';
  
    // Form submit handler
    const submitForm = () => {
      if (subject && description) {
        message = `Visszajelzés elküldve!\nTárgy: ${subject}\nLeírás: ${description}`;
        subject = '';
        description = '';
      } else {
        message = 'Kérem, töltse ki az összes mezőt!';
      }
    };
    import { nightMode } from '../../store.js'; // Importáld a nightMode store-t
    import { onMount } from 'svelte'; // Opcióként, ha szükség van rá

    let isNightMode; // Változó a sötét mód állapotához

    // Subscribe a nightMode store-hoz
    nightMode.subscribe(value => {
        isNightMode = value;
    });
  </script>
<main class="{isNightMode ? 'nightMode' : ''} vh-100">
  <div class="pt-3">
  <div class="form-container pt-5">
    <h2>Visszajelzés küldése</h2>
  
    <form on:submit|preventDefault={submitForm}>
      <div class="mb-3">
        <label for="subject" class="form-label">Tárgy</label>
        <input
          type="text"
          id="subject"
          class="form-control"
          bind:value={subject}
          placeholder="Írd ide a visszajelzés tárgyát"
        />
      </div>
  
      <div class="mb-3">
        <label for="description" class="form-label">Leírás</label>
        <textarea
          id="description"
          class="form-control"
          bind:value={description}
          rows="4"
          placeholder="Írd ide a visszajelzés leírását"
        ></textarea>
      </div>
  
      <button type="submit" class="btn">Visszajelzés Küldése</button>
    </form>
  
    {#if message}
      <div class="mt-3 alert" class:bg={message.includes('elküldve') ? 'alert-success' : 'alert-danger'}>
        {message}
      </div>
    {/if}
  </div>
</div>
</main>

<style>
    main {
        background-color: #FFF2D7; /* Eredeti háttérszín */
        transition: background-color 0.3s; /* Simább átmenet */
    }
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #FF7D29;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        color:  #FEFFD2;
    }
    .btn{
        background-color: #FFBF78;
        color:  #FEFFD2;
    }
    .nightMode {
        background-color: #444; /* Háttérszín sötét módban */
    }
    .nightMode .form-container {
        background-color: black; /* Kártya háttérszíne sötét módban */
        color: white; /* Kártya szöveg színe sötét módban */
    }
    .nightMode h2 {
        color: red; /* Link színe sötét módban */
    }
    .nightMode .btn{
        background-color: #444;
        color: red;
    }
  </style>