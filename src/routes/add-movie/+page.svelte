<script>
  import { onMount } from 'svelte';
  import { API_Url } from '../../store.js';

  let title = '';
  let director = '';
  let description = '';
  let actor1 = '';
  let actor2 = '';
  let actor3 = '';
  let releasedDate = '';
  let genre = '';
  let length = 0;
  let isSeries = false; // Checkbox beállítása
  let numberOfSeasons = 0;
  let numberOfEpisodes = 0;
  let fileInput;
  let showAlert = false;
  let alertMessage = 'Film sikeresen létrehozva!';
  let filmId = null;

  async function createMovie() {
    const movieData = {
      id: 0,
      title,
      genre,
      director,
      description,
      actor1,
      actor2,
      actor3,
      releasedDate: releasedDate ? new Date(releasedDate).toISOString() : "",
      addedAt: new Date().toISOString(), // Automatikus hozzáadási idő
      length,
      isSeries
    };

    // Ha sorozat, hozzáadjuk az évadok és epizódok számát
    if (isSeries) {
      movieData.numberOfSeasons = numberOfSeasons;
      movieData.numberOfEpisodes = numberOfEpisodes;
    }

    console.log("POST kérés a film létrehozásához:", movieData);

    try {
      const response = await fetch(`${API_Url}Movie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Hiba a válaszban:", errorResponse);
        return;
      }

      // Az ID-t a válaszból olvassuk ki (ez most számként jön vissza)
      const data = await response.text();  // Az ID-t szövegként kapjuk
      filmId = parseInt(data, 10);  // A válaszból számként dolgozzuk fel az ID-t

      console.log("Film létrehozva, id:", filmId);

      // Ha sikeres volt a film létrehozása, és van fájl, akkor feltöltjük a képet
      if (filmId && fileInput.files.length > 0) {
        await uploadImage(filmId);
      }

      showAlert = true;
      setTimeout(() => {
        showAlert = false;
        window.location.href = `/movies/${filmId}`;  // A film oldalára irányítunk
      }, 3000);

    } catch (error) {
      console.error('Hiba a film létrehozásakor:', error);
    }
  }

  async function uploadImage(filmId) {
    if (!fileInput || !fileInput.files.length) {
      console.error("Nincs fájl kiválasztva!");
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

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Hiba a válaszban:", errorResponse);
        throw new Error("Hiba a kép feltöltésekor");
      }

      console.log("A kép sikeresen feltöltve");
    } catch (error) {
      console.error("Hiba:", error);
    }
  }
</script>

<main>
  <div class="content py-5 pt-5 w-75">
    {#if showAlert}
      <div class="alert alert-success">
        {alertMessage}
      </div>
    {/if}
    <h2 class="mt-4">Tartalom hozzáadása</h2>
    <table class="pt-5">
      <tbody>
        <tr>
          <td rowspan="2">
            <div class="picture">
              <input type="file" bind:this={fileInput} />
            </div>
          </td>
          <td class="desc" style="padding-left:10px; padding-right:10px;">
            <div class="contents">
              <p>
                <input type="text" placeholder="Cím" bind:value={title} />
              </p>
              <p><strong><input type="text" placeholder="Műfaj" bind:value={genre} /></strong></p>
              <input type="date" placeholder="Megjelenési idő" bind:value={releasedDate} /><br />
              <p class="input-label">
                Játékidő (percben):  
                <input type="number" placeholder="Hossz percben" bind:value={length} />
              </p>
              <p>
                <textarea placeholder="Leírás" rows="10" cols="40" bind:value={description}></textarea>
              </p>
              <input id="isSeries" type="checkbox" bind:checked={isSeries} />
              {#if isSeries}
  <p class="input-label">
    Évadok száma: 
    <input type="number" placeholder="Évadok száma" bind:value={numberOfSeasons} />
  </p>
  <p class="input-label">
    Epizódok száma: 
    <input type="number" placeholder="Epizódok száma" bind:value={numberOfEpisodes} />
  </p>
{:else}
  <div style="height: 59px;"></div> <!-- Üres helykitöltés -->
{/if}
            </div>
          </td>
          <td>
            <div class="people">
              <table class="table table-dark table-striped">
                <tbody>
                  <tr>
                    <td class="hide">Rendező</td>
                    <td><input type="text" placeholder="Rendező" bind:value={director} /></td>
                  </tr>
                  <tr>
                    <td class="hide"></td>
                    <td><input id="actor1" type="text" placeholder="Színész" bind:value={actor1} /></td>
                  </tr>
                  <tr>
                    <td class="hide">Színészek</td>
                    <td><input id="actor2" type="text" placeholder="Színész" bind:value={actor2} /></td>
                  </tr>
                  <tr>
                    <td class="hide"></td>
                    <td><input id="actor3" type="text" placeholder="Színész" bind:value={actor3} /></td>
                  </tr>
                </tbody>
              </table>
              <button class="btn btn-success" on:click={createMovie}>Film létrehozása</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</main>

<style>
  
  #isSeries{
    text-align: center;
    appearance: none;
    background-color: white;
  }
  #isSeries::before{
    content: "Film";
  }
  #isSeries:checked::before{
    content: "Sorozat";
  }
  .input-label {
  display: flex;
  align-items: center; /* Középre igazítja a szöveget és az input mezőt */
  margin-bottom: 10px; /* Kis távolság a mezők között */
}
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

  .content {
    margin-left: 300px;
    padding: 20px;
    color: white;
    margin-top: 25px;
  }

  textarea {
    border-radius: 10px;
    width: 100%; /* A textarea kitölti a rendelkezésre álló helyet */
  }

  table {
    width: 100%;
    table-layout: fixed; /* Fix táblázat elrendezés */
  }

  .picture {
    border: 1px solid black;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .contents,
  .people {
    width: 100%;
    padding: 10px;
    vertical-align: top;
    display: flex;
    flex-direction: column;
  }

  /* Fix méret a td elemhez */
  td {
    vertical-align: top;
    width: 33%; /* Egyenlő szélesség minden td számára */
  }

  td input {
    width: 100%; /* Az inputok kitöltik a td teljes szélességét */
  }

  
  .table td {
    vertical-align: middle;
  }
  /* Checkbox stílus */
  input[type="checkbox"] {
    margin: 10px 0; /* Térköz a checkbox körül */
  }
  @media screen and (max-width: 768px) {
  table,
  tbody,
  tr {
    display: block;
    width: 100%;
  }
  .hide{
    display: none !important;
  }

  

  td {
    display: block;
    width: 100%;
    margin-bottom: 15px; /* Távolság az elemek között */
  }

  .picture {
    width: 100%; /* A kép konténer kitölti a szélességet */
  }

  .people {
    width: 100%;
    padding: 0;
  }

  .contents {
    width: 100%;
    padding: 0;
  }

  /* A szereplők és szerepek táblázat is rugalmas lesz */
  .table {
    width: 100%;
    display: block;
    overflow-x: auto;
  }

  .table td {
    text-align: center;
    display: block;
    width: 100%;
  }

  /* A film létrehozása gomb középre igazítva */
  .btn-success {
    width: 100%;
    margin-top: 10px;
  }
}
  /* Tartalom reszponzív elhelyezése */
  .content {
    padding: 20px;
    color: white;
    margin-left: 60px; /* Mobilon kisebb eltolás */
  }
  
  @media (min-width: 768px) {
    .content {
      margin-left: 100px; /* Tableten nagyobb */
    }
  }
  
  @media (min-width: 1024px) {
    .content {
      margin-left: 300px; /* Nagy képernyőn teljes eltolás */
    }
  }

</style>

