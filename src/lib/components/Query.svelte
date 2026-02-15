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
        class="bg-gray-200 p-4 hover:bg-blue-600 hover:text-white absolute right-14 top-0"
        aria-label="copy preview"
        onclick={() => navigator.clipboard.writeText(queryDetails.preview)}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    </button>
    <button
        class="bg-gray-300 p-4 hover:bg-red-600 hover:text-white absolute right-0 top-0"
        aria-label="remove"
        data-index={queryDetails.consecutivo}
        onclick={removeQuery}
    >
        <Trash2 />
    </button>
</article>
