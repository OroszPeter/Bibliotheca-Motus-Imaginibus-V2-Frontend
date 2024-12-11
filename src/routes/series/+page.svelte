<script>
    let movies = [
      { 
        title: "Terminátor", 
        description: "Akció/sci-fi", 
        image: "https://placehold.co/400x600" 
      },
      { 
        title: "Eredet", 
        description: "Akció/sci-fi", 
        image: "https://placehold.co/400x600" 
      },
      { 
        title: "Mátrix", 
        description: "Akció/sci-fi", 
        image: "https://placehold.co/400x600" 
      },
      { 
        title: "Keresztapa", 
        description: "Krimi", 
        image: "https://placehold.co/400x600" 
      },
    ];
  </script>
  
  <div class="content mt-5">
    <div class="container mt-4">
      <h2 class="mb-5">Sorozatok</h2>
      <h3>Akció</h3>
      <div class="row">
        {#each movies as movie}
          <div class="col-md-3 mb-4">
            <div class="card">
              <!-- Link a képhez -->
              <a href="https://www.google.com/search?q=ov%C3%A1lis&oq=ov%C3%A1lis&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDE1NjhqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8" class="image-link">
                <div class="image-container">
                  <img src={movie.image} class="card-img-top" alt={movie.title} />
                  <div class="badge">5.0</div> <!-- Sárga ovális -->
                </div>
              </a>
              <div class="card-body">
                <h5 class="card-title">{movie.title}</h5>
                <small class="text-muted">{movie.description}</small>
              </div>
            </div>
          </div>
        {/each}
      </div>
      <h3>Dráma</h3>
      <div class="row">
        {#each movies as movie}
          <div class="col-md-3 mb-4">
            <div class="card">
              <!-- Link a képhez -->
              <a href="https://www.google.com/search?q=ov%C3%A1lis&oq=ov%C3%A1lis&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDE1NjhqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8" class="image-link">
                <div class="image-container">
                  <img src={movie.image} class="card-img-top" alt={movie.title} />
                  <div class="badge">5.0</div> <!-- Sárga ovális -->
                </div>
              </a>
              <div class="card-body">
                <h5 class="card-title">{movie.title}</h5>
                <small class="text-muted">{movie.description}</small>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <style>
    .content {
      margin-left: 300px; /* Sidebar szélességének megfelelő eltolás */
      padding: 20px; /* Extra belső tér a tartalom körül */
      color: white; /* Alapértelmezett fehér szín a szövegekhez */
    }
  
    /* Kártya alapstílus */
    .card {
      border: none;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      background-color: #333333; /* Eredeti háttérszín */
      color: white; /* Fehér szín a kártya szövegeinek */
    }
  
    .card:hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      transform: translateY(-5px);
      transition: all 0.3s ease-in-out;
    }
  
    /* Link a képen */
    .image-link {
      display: block; /* A link legyen blokkszintű, hogy a teljes képet lefedje */
      text-decoration: none; /* Link alapértelmezett aláhúzása eltávolítva */
    }
  
    /* A képre vonatkozó stílusok */
    .image-container {
      position: relative;
    }
  
    .card-img-top {
      padding-bottom: 10px; /* A kép és a szöveg közötti távolság csökkentése */
      margin-bottom: 10px; /* Kis távolság a kép alatt */
    }
  
    /* Sárga ovális elem a kép felső részén */
    .badge {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ffc107; /* Sárga szín */
      width: 50px;
      height: 20px;
      border-radius: 50px; /* Ovális forma */
      z-index: 5; /* A badge biztosan a kép előtt legyen */
    }
  
    /* Kártya tartalmának illesztése */
    .card-body {
      padding-top: 5px; /* Kevesebb padding a tetején */
      padding-bottom: 5px; /* Kevesebb padding az alján */
    }
  
    .card-title {
      margin-bottom: 5px; /* A cím és a leírás közötti távolság csökkentése */
      color: white; /* Cím színének fehérre állítása */
    }
  
    /* Fehér szín a small tag számára */
    small {
      font-size: 0.875rem; /* A leírás szöveg méretének csökkentése */
      color: white !important; /* Biztosítja, hogy a small szöveg fehér legyen */
    }
  
    .card:hover .card-body {
      background-color: #333333; /* Az alap háttérszín megmarad hover során is */
    }
  </style>
  