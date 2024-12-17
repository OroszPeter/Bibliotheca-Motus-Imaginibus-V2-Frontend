<script>
  import { onMount } from 'svelte';

  let title = '';
  let director = '';
  let releasedDate = '';
  let genre = '';
  let length = 0;
  let fileInput;
  let showAlert = false;  // A zöld ablak megjelenítéséhez
  let alertMessage = 'Film sikeresen létrehozva!';  // Üzenet a sikeres film létrehozásáról
  let filmId = null;  // Itt tároljuk az éppen létrehozott film id-ját

  // Film létrehozása
  async function createMovie() {
    const movieData = {
      id: 0, // Az id majd a válaszból érkezik
      title,
      director,
      releasedDate: releasedDate ? new Date(releasedDate).toISOString() : "",  // Formázd ISO formátumra
      genre,
      length
    };

    console.log("POST kérés a film létrehozásához:", movieData);

    try {
      // POST kérés a film létrehozásához
      const response = await fetch('https://localhost:7214/api/Movie', {
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

      const data = await response.text();  // Mivel id-t ad vissza a szerver, szöveges válaszként kérjük
      filmId = parseInt(data, 10); // A szöveges választ számra konvertáljuk

      console.log("Film létrehozva, id:", filmId);

      // Ha van filmId és fájl, akkor próbáljuk feltölteni a képet
      if (filmId && fileInput.files.length > 0) {
        await uploadImage(filmId);
      }

      // Sikeres film létrehozás után jelenítsük meg a zöld ablakot
      showAlert = true;
      setTimeout(() => {
        showAlert = false;
        // Átirányítás a létrejött film oldalára
        window.location.href = `/movies/${filmId}`;
      }, 3000); // 3 másodperc múlva eltűnik, és átirányít

    } catch (error) {
      console.error('Hiba a film létrehozásakor:', error);
    }
  }

  // Kép feltöltésének funkciója
  async function uploadImage(filmId) {
    if (!fileInput || !fileInput.files.length) {
      console.error("Nincs fájl kiválasztva!");
      return;
    }

    const file = fileInput.files[0]; // Az első fájl kiválasztása
    const formData = new FormData();
    formData.append("file", file);

    console.log("PUT kérés a kép feltöltéséhez, filmId:", filmId);

    try {
      const response = await fetch(`https://localhost:7214/api/Movie/${filmId}/kep`, {
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
              <!-- Fájl input mező -->
              <input type="file" bind:this={fileInput} />
            </div>
          </td>
          <td>
            <div class="content">
              <h2>
                <input type="text" placeholder="Cím" bind:value={title} />
              </h2>
              <p><strong><input type="text" placeholder="Műfaj" bind:value={genre} /></strong></p>
              <input type="checkbox" placeholder="Sorozat?" style="display: inline;" />
              <p style="display: inline;">Sorozat?</p><br />
              <input type="number" placeholder="Évadok" /><br />
              <input type="number" placeholder="Epizódok" /><br />
              <input type="date" placeholder="Megjelenési idő" bind:value={releasedDate} /><br />
              <input type="number" placeholder="Hossz percben" bind:value={length} />
              <p>
                <textarea placeholder="Leírás" rows="10" cols="50"></textarea>
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
                    <td><input type="text" placeholder="Műfaj" bind:value={director} /></td>
                  </tr>
                  <tr>
                    <td>Színész 1</td>
                    <td><input type="text" placeholder="Színész" /></td>
                  </tr>
                  <tr>
                    <td>Színész 2</td>
                    <td><input type="text" placeholder="Színész" /></td>
                  </tr>
                  <tr>
                    <td>Színész 3</td>
                    <td><input type="text" placeholder="Színész" /></td>
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
