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

    if (!inputValue.match(/(\$\d)+/g)) {
      alert('Escribe la query utilizando algunas de las columnas ($0, $1, $2, ... $69)');
      return;
    }

    onQueryReady(inputValue);
  }
</script>

<section class="mb-12">
  <header class="text-xl bg-gray-200 rounded p-2 font-bold text-gray-700">nueva query</header>
  <footer class="flex mt-5">
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
