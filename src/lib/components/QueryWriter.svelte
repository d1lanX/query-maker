<script lang="ts">
  import { Check } from 'lucide-svelte';
  import { keywords } from '$lib/index';
  let inputValue: string = $state('');

  let { excelData, onQueryReady } = $props();

  function uppercaseKeywords(e: Event) {
    const text = (e.target as HTMLInputElement)?.value.toLowerCase().split(' ');
    inputValue = text
      .map((word) => (keywords.includes(word) ? word.toUpperCase() : word))
      .join(' ');
  }

  function validateQuery() {
    if (!excelData) {
      alert('Primero importa un archivo');
      return;
    }

    if (!inputValue.match(/(\$\d|#\d)+/g)) {
      alert('Escribe la query utilizando algunas de las columnas ($0, $1, $2, ... $69)');
      return;
    }

    onQueryReady(inputValue);
  }
</script>

<section class="mb-12">
  <header class="text-xl bg-gray-100 rounded p-2 font-bold text-gray-700">nueva query</header>
  <details class="p-2 border rounded cursor-pointer my-2">
    <summary class="text-xs text-gray-500">cómo hago mi query?</summary>
    <p class="text-gray-500 text-xs mt-4">
      UPDATE users SET user_name = $1, user_address = $2, age = #3 WHERE user_id = $4
    </p>
    <small class="text-gray-500 text-xs italic"
      >utiliza los números de columnas en la izquierda para indicar qué datos usar, <mark>$</mark>
      para texto y <mark>#</mark> para números</small
    >
  </details>
  <footer class="flex mt-2">
    <label class="flex-grow">
      <input
        oninput={uppercaseKeywords}
        bind:value={inputValue}
        type="text"
        class="p-4 text-lg text-gray-600 border w-full"
        placeholder="escribe tu query aquí"
      />
    </label>
    <button class="bg-gray-300 p-4 hover:bg-gray-400" onclick={validateQuery} aria-label="check">
      <Check />
    </button>
  </footer>
</section>
