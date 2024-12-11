<script>
    import Navbar from '../component/Navbar.svelte';
    import { nightMode } from '../store.js'; // Importáld a nightMode store-t
    import { onMount } from 'svelte';

    // Hozzáférés a nightMode store-hoz
    let isNightMode = false;
    
    nightMode.subscribe(value => {
        isNightMode = value; // Frissíti az állapotot, ha változik
    });
</script>

<div class="{isNightMode ? 'nightMode' : ''} d-flex flex-column w-100 h-100">
    <Navbar {nightMode} /> <!-- Átadjuk a nightMode prop-ot -->
    <main class="w-100 flex-grow-1">
        <slot />
    </main>
</div>

<style>
    .nightMode {
        background-color: black; /* Háttér szín sötét módban */
        color: white; /* Szöveg szín sötét módban */
    }

    /* További stílusok sötét módban */
    main {
        transition: background-color 0.3s;
    }
</style>
