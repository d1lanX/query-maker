<script lang="ts">
  let { fileReader, htmlColumns } = $props();
</script>

<section class="border p-2 rounded-lg">
  <header class="text-4xl font-bold text-gray-700">query maker</header>
  <h1 class="text-gray-600">genera una nueva query a partir de un archivo</h1>
  {@render fileReader()}
  <section class="mt-5">
    <h1 class="text-xl text-gray-700 font-bold">columnas</h1>
    <small class="mt-1 mb-5 text-gray-700">
      reemplaza las columnas que deseas por los campos con signo $ (si quieres que salgan entre
      comillas como string) o # (si quieres que salgan como dato numerico)
      <br />
    </small>
    <code class="text-gray-500 text-xs"
      >Ejemplo: UPDATE users SET user_name = $1, user_address = $2, age = #3 WHERE user_id = $4</code
    >
    <hr class="my-6" />
    {@render htmlColumns()}
  </section>
</section>
