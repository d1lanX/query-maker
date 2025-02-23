<script lang="ts">
  import { slide } from 'svelte/transition';
  type QueryDetails = {
    preview: string;
    content: string[];
  };
  let { queryDetails }: { queryDetails: QueryDetails } = $props();
</script>

{#if queryDetails}
  <article class="hover:bg-gray-100 select-none" transition:slide>
    <details class="p-4 border rounded cursor-pointer my-2">
      <summary class="text-gray-600">{queryDetails.preview}</summary>
      <textarea class="w-full my-8 border text-gray-700 p-2"
        >{[...queryDetails.content].join('\n')}</textarea
      >
    </details>
  </article>
{/if}
