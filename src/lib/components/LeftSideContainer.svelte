<script lang="ts">
    let { fileReader, htmlColumns } = $props();
</script>

<section class="border p-2 rounded-lg">
    <header class="text-4xl font-bold text-gray-700">query maker</header>
    <h1 class="text-gray-600">genera una nueva query a partir de un archivo</h1>
    {@render fileReader()}
    <section class="mt-5">
        <h1 class="text-xl text-gray-700 font-bold bg-gray-100 p-2 flex items-center gap-2">
            columnas
        </h1>
        <hr />
        {@render htmlColumns()}
    </section>
</section>
