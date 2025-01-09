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
      isSeries,
      numberOfSeasons: isSeries ? numberOfSeasons : 0,
      numberOfEpisodes: isSeries ? numberOfEpisodes : 0
    };

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

      const data = await response.text();
      filmId = parseInt(data, 10);

      console.log("Film létrehozva, id:", filmId);

      if (filmId && fileInput.files.length > 0) {
        await uploadImage(filmId);
      }

      showAlert = true;
      setTimeout(() => {
        showAlert = false;
        window.location.href = `/movies/${filmId}`;
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
  <div class="container py-5 pt-5 w-75">
    {#if showAlert}
      <div class="alert alert-success">
        {alertMessage}
      </div>
    {/if}
    <table class="pt-5">
      <tbody>
        <tr>
          <td rowspan="2">
            <div class="picture">
              <input type="file" bind:this={fileInput} />
            </div>
          </td>
          <td class="desc">
            <div class="content">
              <h2>
                <input type="text" placeholder="Cím" bind:value={title} />
              </h2>
              <p><strong><input type="text" placeholder="Műfaj" bind:value={genre} /></strong></p>
              <input type="checkbox" bind:checked={isSeries} />
              <p style="display: inline;">Sorozat?</p><br />
              {#if isSeries}
                <input type="number" placeholder="Évadok" bind:value={numberOfSeasons} /><br />
                <input type="number" placeholder="Epizódok" bind:value={numberOfEpisodes} /><br />
              {/if}
              <input type="date" placeholder="Megjelenési idő" bind:value={releasedDate} /><br />
              <input type="number" placeholder="Hossz percben" bind:value={length} />
              <p>
                <textarea placeholder="Leírás" rows="10" cols="50" bind:value={description}></textarea>
              </p>
            </div>
          </td>
          <td>
            <div class="people">
              <table class="table table-dark table-striped">
                <thead>
                  <tr>
                    <th>Szereplők</th>
                    <th>Szerepek</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Rendező</td>
                    <td><input type="text" placeholder="Rendező" bind:value={director} /></td>
                  </tr>
                  <tr>
                    <td>Színész 1</td>
                    <td><input type="text" placeholder="Színész" bind:value={actor1} /></td>
                  </tr>
                  <tr>
                    <td>Színész 2</td>
                    <td><input type="text" placeholder="Színész" bind:value={actor2} /></td>
                  </tr>
                  <tr>
                    <td>Színész 3</td>
                    <td><input type="text" placeholder="Színész" bind:value={actor3} /></td>
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
  display: none;  /* Kezdetben nem látszik */
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
  .container {
    margin-left: 300px;
    padding: 20px;
    color: white;
    margin-top: 25px;
  }

  textarea {
    border-radius: 10px;
  }

  table {
    width: 100%;
    table-layout: fixed;
  }

  .picture {
    border: 1px solid black;
    width: 400px;
    height: 700px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content,
  .people {
    width: 100%;
    padding: 10px;
    vertical-align: top;
  }

  .star {
    font-size: 2rem;
    color: #ccc;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .star.selected,
  .star:hover,
  .star:active {
    color: gold;
  }

  .star-rating label:hover,
  .star-rating label.selected {
    color: gold;
  }
  td input{
    width: 100%;
  }

  .table th,
  .table td {
    vertical-align: middle;
  }

  .star-rating label {
    margin: 0 5px;
  }

  .addcomment {
    max-width: 100%;
  }

  .star-rating {
    display: flex;
    justify-content: flex-start;
  }
</style>
