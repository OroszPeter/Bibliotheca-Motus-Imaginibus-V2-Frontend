<script>
  import { slide } from 'svelte/transition';
  import { userStore, isLoggedIn, authToken } from '../store.js';

  let searchQuery = '';
  const handleSearch = () => {
    // Átirányítás a keresett kifejezés alapján a result oldalra
    window.location.href = `/result?query=${searchQuery}`;
  };

  $: isUserLoggedIn = $isLoggedIn; // Automatikus frissítés a store alapján
  $: userName = $userStore.userName || ''; // Felhasználónév figyelése

  // Dinamikusan frissülő menüelemek
  $: menuItems = [
    { name: `Újdonságok`, link: "/", icon: "bi-house" },
    { name: "Filmek", link: "/movies", icon: "bi-film" },
    { name: "Sorozatok", link: "/series", icon: "bi-collection-play" },
    { name: "Watchlist", link: "/watchlist", icon: "bi-bookmark" },
    ...(isUserLoggedIn
      ? [
          { name: "Kijelentkezés", link: "#logout", icon: "bi-box-arrow-right" },
          // Ellenőrizzük, hogy a roles létezik-e és hogy az első elem "Admin"
          ...(Array.isArray($userStore.roles) && $userStore.roles[0] === "Admin"
            ? [{ name: "Tartalom hozzáadása", link: "/add-content", icon: "bi-plus-circle" }]
            : [])
        ]
      : [{ name: "Bejelentkezés", link: "/login", icon: "bi-box-arrow-in-right" }]),
  ];

  function handleLogout() {
      localStorage.removeItem('authToken');
      userStore.set({
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          photo: null,
          roles: [],
          userName: ''
      });
      isLoggedIn.set(false);
      authToken.set('');
      // window.location.href = '/login'; // Visszairányítás a bejelentkezéshez
  }
</script>




<div class="navigation">
  <!-- Navbar -->
  <nav class="navbar navbar-expand navbar-dark bg-danger">
      <div class="container-fluid">
          <a class="navbar-brand px-1" href="#">Bibliotheca Motus Imaginibus</a>
          <div class="search-container d-flex align-items-center w-75">
              <input
                  class="form-control custom-search"
                  type="search"
                  placeholder="Keresés"
                  aria-label="Keresés"
                  bind:value={searchQuery}
              />
              <button class="btn btn-search-icon" type="button" on:click={handleSearch}>
                  <i class="bi bi-search"></i>
              </button>
          </div>
          <div id="profile" class="text-center">
              {#if isUserLoggedIn}
              <a class="text-white" href="/profile">
                <span>{userName}</span>
              </a>
              {/if}
          </div>
      </div>
  </nav>

  <!-- Sidebar -->
  <div class="sidebar bg-dark text-white pt-1">
    <ul class="list-unstyled">
      {#each menuItems as item, i}
        <li
          class="py-2 px-3 sidebar-item {i === 0 ? 'first-item' : ''}"
          on:click={item.link === "#logout" ? handleLogout : null}
        >
          <a
            class="text-white text-decoration-none"
            href={item.link}
          >
            <i class={`bi ${item.icon}`}></i>
            {item.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>
  
  <style>
    .navigation {
      display: flex;
      flex-direction: column;
    }
    #profile{
      width: 275px;
    }
    #profile>a{
      text-decoration: none;
    }
  
    .navbar-brand {
      width: 300px;
    }
  
    /* Search container styles */
    .search-container {
      display: flex;
      align-items: center;
      width: auto;
      /* width: 500px; Igény szerint módosítható */
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.4);


      border-radius: 5px 0 0 5px; /* Lekerekített bal oldal */
    }
  
    .custom-search {
      background-color: rgba(255, 255, 255, 0.2);
      border: none;
    }
  
    .custom-search::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  
    .custom-search:focus {
      background-color: rgba(255, 255, 255, 0.3);
      outline: none;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
  
    .btn-search-icon {
      /* background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-left: none;
      color: white;
      padding: 3px 10px; */
      display: flex;
      align-items: center;
      justify-content: center;
      /* border-radius: 0 5px 5px 0; Lekerekített jobb oldal */
      cursor: pointer;
      color: white;
    }
  
    .btn-search-icon:hover {
      background-color: rgba(255, 255, 255, 0.4);
    }
  
    .bi-search {
      font-size: 1.2rem; /* Igény szerint módosítható */
    }
  
    /* Sidebar stílusok */
    .sidebar {
      width: 300px;
      height: 100vh;
      position: fixed;
      top: 56px;
      left: 0;
      overflow-y: auto;
      z-index: 0;
    }
  
    .sidebar ul {
      margin-top: 0;
    }
  
    .sidebar-item {
      transition: background-color 0.3s ease;
      font-size: 125%;
    }
  
    .sidebar-item:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  
    .sidebar-item .arrow {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  
    .sidebar-item:hover .arrow {
      opacity: 1;
      color: red;
    }
  
    .sidebar-item a:hover {
      color: #ffc107;
    }
  
    .first-item {
      margin-top: 0;
    }
  
    /* Navbar stílusok */
    nav.navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 2;
    }
    input{
      color: white;
    }
    .sidebar-item a {
  display: flex; /* Ikon és szöveg egymás mellett */
  align-items: center; /* Vertikálisan középre igazítás */
  text-align: left; /* Szöveg balra igazítása */
}

.sidebar-item i {
  margin-right: 10px; /* Térköz az ikon és a szöveg között */
}
  </style>
  
  