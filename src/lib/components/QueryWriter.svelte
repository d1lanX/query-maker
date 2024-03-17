<script lang="ts">
  export let data: any;
  import { keywords } from "$lib/index";
  import { createEventDispatcher } from "svelte";
  let inputValue: string = '';

  const dispatch = createEventDispatcher();

  function uppercaseKeywords(e: Event) {
    const text = (e.target as HTMLInputElement)?.value.toLowerCase().split(' ');
    inputValue = text.map(word => (
      keywords.includes(word) ? word.toUpperCase() : word
    )).join(' ');
  }

  function validateQuery() {
    if (!data) {
      alert('Primero importa un archivo');
      return;
    }

    if (!inputValue.match(/(\$\d)+/g)) {
      alert('Escribe la query utilizando algunas de las columnas ($0, $1, $2, ... $69)');
      return;
    }

    dispatch('query_ready', inputValue);
  }
</script>

<section class="mb-12">
  <header class="text-xl bg-gray-200 rounded p-2 font-bold text-gray-700">
    nueva query
  </header>
  <footer class="flex mt-5">
    <label class="flex-grow">
      <input 
        on:input={uppercaseKeywords} 
        bind:value={inputValue} 
        type="text" 
        class="p-4 text-lg text-gray-600 border w-full" 
        placeholder="escribe tu query aquí" 
      />
    </label>
    <button class="bg-gray-300 p-4 hover:bg-gray-400" on:click={validateQuery}>
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
      </svg>
    </button>
  </footer>
</section>
