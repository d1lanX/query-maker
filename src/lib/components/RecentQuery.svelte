<script lang="ts">
  export let queryDetails: { queryPreview: string, queryContent: string };
</script>

<article class="hover:bg-gray-100">
  <details class="p-4 border rounded cursor-pointer my-2">
    <summary class="text-gray-600">{queryDetails.queryPreview}</summary>
    <textarea class="w-full my-8 border">{queryDetails.queryContent}</textarea>
  </details>
</article>