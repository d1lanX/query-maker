<script lang="ts">
    let { children, queryWriter } = $props();
</script>

<section class="border p-2 rounded-lg">
    {#if queryWriter}
        {@render queryWriter()}
    {/if}
    <header class="text-xl bg-gray-100 rounded p-2 font-bold text-gray-700">
        últimas queries generadas
    </header>
    <section class="mt-5">
        {#if children}
            {@render children()}
        {:else}
            <small class="p-4 text-gray-600">sin queries generadas</small>
        {/if}
    </section>
</section>
