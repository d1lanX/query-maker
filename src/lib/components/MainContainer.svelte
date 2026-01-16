<script lang="ts">
    let { children } = $props();
</script>

<main class="m-5 grid grid-cols-1 md:grid-cols-2 gap-2 min-h-screen">
    {#if children}
        {@render children()}
    {:else}
        no deberia haber algo aqui? 🤔
    {/if}
</main>
