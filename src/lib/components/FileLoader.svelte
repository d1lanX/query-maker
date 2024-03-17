<script lang="ts">
  import type { ReadFileOptions } from "$lib/types";
  import { read, utils } from "xlsx";
  import { createEventDispatcher } from "svelte";
  
  const dispatch = createEventDispatcher();
  
  let somethingElse: string | null;

  async function validateFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];

    if (!file) {
      alert('Por favor ingresa un archivo');
      return;
    }

    const excelFile = file.name.endsWith('.xlsx');
    const csvFile = file.name.endsWith('.csv');

    if (!(excelFile || csvFile)) {
      alert('El archivo no tiene una extension válida');
      return;
    }

    somethingElse = file.name;

    if (excelFile) {
      const data = await readFile<ArrayBuffer>({ file, readAs: 'readAsArrayBuffer' });
      readExcel(data);
    } else {
      const data = await readFile<string>({ file, readAs: 'readAsText' });
      readCsv(data);
    }
    
  }

  function readFile<T extends string | ArrayBuffer>(params: ReadFileOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader[params.readAs](params.file);
      reader.onerror = (error) => reject(error);
      reader.onloadend = () => resolve(reader.result as T);
    });
  }

  function readExcel(data: ArrayBuffer) {
    const excel = read(data);
    const worksheet = excel.Sheets[excel.SheetNames[0]];
    const rawData = utils.sheet_to_json(worksheet, {header:1});
    dispatch('data', rawData);
  }

  function readCsv(data: string) {
    const rawData: string[][] = [];
    for (let column of data.split('\n')) {
      if (column == '') continue;
      rawData.push(column.split(';'));
    }
    dispatch('data', rawData);
  }

</script>

<section class="mt-5">
  <label for="file" class="border p-2 cursor-pointer rounded-lg text-gray-600 flex justify-center gap-4 items-center hover:bg-gray-100">
    {somethingElse ? somethingElse : 'cargar archivo csv o excel'}
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
      <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
    </svg>
  </label>
  <input type="file" name="file" id="file" class="sr-only" on:change={validateFile} accept=".xlsx, .csv">
</section>