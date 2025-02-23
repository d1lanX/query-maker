<script lang="ts">
  import MainContainer from '$components/MainContainer.svelte';
  import RightSideContainer from '$components/RightSideContainer.svelte';
  import FileLoader from '$components/FileLoader.svelte';
  import LeftSideContainer from '$components/LeftSideContainer.svelte';
  import QueryWriter from '$components/QueryWriter.svelte';
  import Query from '$components/Query.svelte';
  import { onMount } from 'svelte';
  import { globalState } from '$lib/state.svelte';
  import type { RecentQuery } from '$lib/types';

  let columnsHTML: string = $state(
    '<small class="p-4 text-gray-600">importa primero un archivo para ver sus columnas</small>',
  );
  let excelData: any = $state();

  onMount(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      if (!key.includes('query')) {
        continue;
      }

      const item = localStorage.getItem(key) || '';
      const json = JSON.parse(item);
      globalState.recentQueries.set(key, json);
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

    /* Para encontrar los $numeros en la query */
    const matches: any = sqlQuery.match(/\$\d|#\d/g);

    const query: RecentQuery = {
      consecutivo: 0,
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
        const tipoColumna = (match as string).replaceAll(/\d/g, '');
        const indexColumna = (match as string).replaceAll(/\$\d|#\d/g, '');

        if (tipoColumna === '#') {
          currentQuery = currentQuery.replace(match, `${column[+indexColumna]}`);
          continue;
        }

        if (tipoColumna === '$') {
          currentQuery = currentQuery.replace(match, `'${column[+indexColumna]}'`);
          continue;
        }
      }

      query.content.push(currentQuery);
    });

    /* Se obtiene el consecutivo actual */
    const consecut = Number(localStorage.getItem('consecut') || 0);
    const nuevoConsecutivo = consecut + 1;
    query.consecutivo = nuevoConsecutivo;

    globalState.recentQueries.set(`query_${nuevoConsecutivo}`, query);

    /* Para guardar la query en recientes */
    localStorage.setItem(`query_${nuevoConsecutivo}`, JSON.stringify(query));
    localStorage.setItem('consecut', `${nuevoConsecutivo}`);
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
    {#each [...globalState.recentQueries] as [key, recent]}
      <Query queryDetails={recent} />
    {:else}
      <small class="p-4 text-gray-600">crea una nueva query para visualizarla aqui!</small>
    {/each}
  </RightSideContainer>
</MainContainer>
