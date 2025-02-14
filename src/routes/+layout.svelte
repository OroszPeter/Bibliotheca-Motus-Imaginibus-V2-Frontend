<script>
    import Navbar from '../component/Navbar.svelte';
</script>

<div class="d-flex flex-column w-100 h-100">
    <Navbar/>
    <main class="w-100 flex-grow-1">
        <slot />
    </main>
</div>
