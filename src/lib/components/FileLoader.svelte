<script lang="ts">
  import { CloudUpload } from 'lucide-svelte';
  import type { ReadFileOptions } from '$lib/types';
  import { read, utils } from 'xlsx';
  let { onData } = $props();

  let filename: string | null = $state(null);

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

    filename = file.name;

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
    const rawData = utils.sheet_to_json(worksheet, { header: 1 });
    onData(rawData);
  }

  function readCsv(data: string) {
    const rawData: string[][] = [];
    for (let column of data.split('\n')) {
      if (column == '') continue;
      rawData.push(column.split(';'));
    }
    onData(rawData);
  }
</script>

<section class="mt-5">
  <label
    for="file"
    class="border p-2 cursor-pointer rounded-lg text-gray-600 flex justify-center gap-4 items-center hover:bg-gray-100"
  >
    {filename ? filename : 'cargar archivo csv o excel'}
    <CloudUpload />
  </label>
  <input
    type="file"
    name="file"
    id="file"
    class="sr-only"
    onchange={validateFile}
    accept=".xlsx, .csv"
  />
</section>
