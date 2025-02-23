<script lang="ts">
  import MainContainer from '$components/MainContainer.svelte';
  import RightSideContainer from '$components/RightSideContainer.svelte';
  import FileLoader from '$components/FileLoader.svelte';
  import LeftSideContainer from '$components/LeftSideContainer.svelte';
  import QueryWriter from '$components/QueryWriter.svelte';
  import Query from '$components/Query.svelte';

  import type { RecentQuery } from '$lib/types';
  import { onMount } from 'svelte';

  let recentQueries: Array<RecentQuery> = $state([]);
  let columnsHTML: string = $state(
    '<small class="p-4 text-gray-600">importa primero un archivo para ver sus columnas</small>',
  );
  let excelData: any = $state();

  onMount(() => {
    if (localStorage.getItem('consecut')) {
      localStorage.setItem('consecut', '1');
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (!key.includes('consecut')) {
        continue;
      }

      const item = localStorage.getItem(key) || '';
      const json = JSON.parse(item);
      recentQueries = [...recentQueries, json];
    }
  });

  function setConvertedData(data: any) {
    excelData = data;
    buildColumns(data[0]);
  }

  function buildColumns(data: string[]) {
    columnsHTML = data
      .map((column, index) => {
        return `<article>
        <label for="$${index}" class="text-gray-600">$${index}</label>
        <input type="text" id="$${index}" class="border p-2 text-gray-600 w-full" value="${column}" disabled>
      </article>`;
      })
      .join('');
  }

  function buidAllQueries(queryString: any) {
    let sqlQuery: string = queryString;

    /* Para encontrar los $numero en la query */
    const matches: any = sqlQuery.match(/(\$\d)/g);

    const query: RecentQuery = {
      preview: '',
      content: [],
    };

    excelData.forEach((column: [], index: number) => {
      let currentQuery = sqlQuery;

      if (index === 0) {
        query.preview = sqlQuery;
        return;
      }

      for (let match of matches) {
        if (isNaN(column[match.replace('$', '')])) {
          currentQuery = currentQuery.replace(match, `'${column[Number(match.replace('$', ''))]}'`);
        } else {
          currentQuery = currentQuery.replace(match, `${column[Number(match.replace('$', ''))]}`);
        }
      }

      query.content.push(currentQuery);
    });

    recentQueries = [...recentQueries, query];

    /* Se obtiene el consecutivo actual */
    const consecut = Number(localStorage.getItem('consecut')) || 1;

    /* Para guardar la query en recientes */
    localStorage.setItem(`${consecut + 1}`, JSON.stringify(query));
  }
</script>

<MainContainer>
  <LeftSideContainer>
    {#snippet fileReader()}
      <FileLoader onData={setConvertedData} />
    {/snippet}
    {#snippet htmlColumns()}
      <section class="grid grid-cols-2 gap-2 p-8 my-5">
        {@html columnsHTML}
      </section>
    {/snippet}
  </LeftSideContainer>

  <RightSideContainer>
    {#snippet queryWriter()}
      <QueryWriter {excelData} onQueryReady={buidAllQueries} />
    {/snippet}
    {#each recentQueries as recent}
      <Query queryDetails={recent} />
    {/each}
  </RightSideContainer>
</MainContainer>
