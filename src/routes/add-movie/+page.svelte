<script>
    export let movie; // A film adatokat itt kapjuk a load függvényből
    let rating = 0; // A kiválasztott csillagok száma
  
    // Függvény, amely a csillagok állapotát frissíti
    function setRating(value) {
      rating = value;
    }
  
    // Függvény a hover eseményhez
    function hoverRating(value) {
      rating = value;
    }
  
    // A csillagok resetelése
    function resetRating() {
      rating = 0;
    }
  </script>
  
  <main>
    <div class="container py-5 pt-5 w-75">
      <table class="pt-5">
        <tbody>
          <tr>
            <td rowspan="2">
              <!-- Kép -->
              <div class="picture">
                <input type="file" placeholder="Kép">
              </div>
            </td>
            <td>
              <!-- Film cím, műfaj és értékelés -->
              <div class="content">
                <h2>
                  <input type="text" placeholder="Cím">
                  <!-- <button class="btn btn-primary btn-sm ms-2">+</button> -->
                </h2>
                <p><strong><input type="text" placeholder="Műfaj"></strong></p>
                <p>Sorozat?</p><input type="checkbox" placeholder="Sorozat?"><br>
                <input type="number" placeholder="Évadok"><br>
                <input type="number" placeholder="Epizódok"><br>
                <input type="date" placeholder="Megjelenési idő"><br>
                <input type="number" placeholder="Hossz percben">
                <!-- <small>5.0 &#9733;</small> -->
                <p>
                  <textarea placeholder="Leírás" rows="10" cols="50"></textarea>
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
                      <td><input type="text" placeholder="Rendező"></td>
                    </tr>
                    <!-- Színészek itt adhatóak hozzá az API válasza alapján -->
                    <tr>
                      <td>Színész 1</td>
                      <td><input type="text" placeholder="Színész"></td>
                    </tr>
                    <tr>
                      <td>Színész 2</td>
                      <td><input type="text" placeholder="Színész"></td>
                    </tr>
                    <tr>
                      <td>Színész 3</td>
                      <td><input type="text" placeholder="Színész"></td>
                    </tr>
                  </tbody>
                </table>
                <button class="btn btn-success">Hozzáad</button>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <!-- Komment szakasz -->
              <div class="addcomment mt-4">
                
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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

.picture {
  border: 1px solid black;
  width: 400px;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.picture input {
  text-align: center;
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
  