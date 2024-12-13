<script>
  import { page } from '$app/stores';

  let movie = $page.data.movie;

  // Ellenőrizzük, hogy az adatok töltése befejeződött-e
  let isLoading = false;

  $: if (!movie) {
    isLoading = true;
  }

  console.log('Movie data received in [id] component:', movie);
</script>

<main>
  {#if isLoading}
      <div>Betöltés...</div>
  {:else if movie}
      <div class="container py-5 pt-5 w-75">
          <table class="pt-5">
              <tbody>
                  <tr>
                      <td rowspan="2">
                          <!-- Kép -->
                          <div class="picture">
                              <img
                                  src={movie.imageUrl || 'https://placehold.co/400x600'}
                                  class="img-fluid"
                                  alt={movie.title}
                              />
                          </div>
                      </td>
                      <td>
                          <!-- Film cím, műfaj és értékelés -->
                          <div class="content">
                              <h2>
                                  {movie.title}
                                  <button class="btn btn-primary btn-sm ms-2">+</button>
                              </h2>
                              <p><strong>{movie.genre}</strong></p>
                              <small>&#9733;</small>
                              <p>
                                  {movie.description || 'Film leírás nem elérhető.'}
                              </p>
                          </div>
                      </td>
                      <td>
                          <!-- Rendező és színészek táblázat -->
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
                                          <td>{movie.director}</td>
                                      </tr>
                                      <tr>
                                          <td>Színész 1</td>
                                          <td>Arnold Schwarzenegger</td>
                                      </tr>
                                      <tr>
                                          <td>Színész 2</td>
                                          <td>Linda Hamilton</td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </td>
                  </tr>
                  <tr>
                      <td colspan="2">
                          <!-- Komment szakasz -->
                          <div class="addcomment mt-4">
                              <div class="star-rating mb-3">
                                  <!-- Csillagok -->
                                  <label for="star1" class="star" on:mouseover={() => hoverRating(1)} on:click={() => setRating(1)}>{0 >= 1 ? '★' : '☆'}</label>
                                  <label for="star2" class="star" on:mouseover={() => hoverRating(2)} on:click={() => setRating(2)}>{0 >= 2 ? '★' : '☆'}</label>
                                  <label for="star3" class="star" on:mouseover={() => hoverRating(3)} on:click={() => setRating(3)}>{0 >= 3 ? '★' : '☆'}</label>
                                  <label for="star4" class="star" on:mouseover={() => hoverRating(4)} on:click={() => setRating(4)}>{0 >= 4 ? '★' : '☆'}</label>
                                  <label for="star5" class="star" on:mouseover={() => hoverRating(5)} on:click={() => setRating(5)}>{0 >= 5 ? '★' : '☆'}</label>
                              </div>
                              <textarea name="komment" cols="100" rows="4"></textarea>
                              <button class="btn btn-success">Küldés</button>
                          </div>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  {/if}
</main>

<style>
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

  .picture,
  .content,
  .people {
      width: 100%;
      padding: 10px;
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
