<script lang="ts">
  import { Trash2 } from 'lucide-svelte';
  import { slide } from 'svelte/transition';
  import type { RecentQuery } from '$lib/types';
  let { queryDetails }: { queryDetails: RecentQuery } = $props();
  import { globalState } from '$lib/state.svelte';

  function removeQuery(e: Event) {
    const index = (e.target as HTMLButtonElement).closest('button')?.dataset.index;
    if (!index) {
      console.warn('no se pudo obtener a la referencia de la query');
      return;
    }
    try {
      localStorage.removeItem(`query_${index}`);
      globalState.recentQueries.delete(`query_${index}`);
    } catch (err) {
      alert('tuvimos un error borrando el registo de la query');
    }
  }
</script>

<article class="hover:bg-gray-100 select-none relative" transition:slide>
  <details class="p-4 border rounded cursor-pointer my-2">
    <summary class="text-gray-600">{queryDetails.preview}</summary>
    <textarea class="w-full my-8 border text-gray-700 p-2"
      >{[...queryDetails.content].join('\n')}</textarea
    >
  </details>
  <button
    class="bg-gray-300 p-4 hover:bg-red-600 hover:text-white absolute right-0 top-0"
    aria-label="remove"
    data-index={queryDetails.consecutivo}
    onclick={removeQuery}
  >
    <Trash2 />
  </button>
</article>
