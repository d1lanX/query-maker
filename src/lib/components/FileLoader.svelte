<script lang="ts">
    import Dropzone from 'svelte-file-dropzone';
    import { CloudUpload } from 'lucide-svelte';
    import type { ReadFileOptions } from '$lib/types';
    import { read, utils } from 'xlsx';
    let { onData } = $props();

    let filename: string | null = $state(null);
    let separador: string = $state(';');
    let draggingOver: boolean = $state(false);
    let callback: string = $state(`
    function callback(data) {
        console.log(data);
    }
    `.trim());

    async function validateFile(file: File) {
        if (!file) {
            alert('Por favor ingresa un archivo');
            return;
        }

        const excelFile = file.name.endsWith('.xlsx');
        const csvFile = file.name.endsWith('.csv');

        if (!(excelFile || csvFile)) {
            alert('El archivo no tiene una extension v�lida');
            return;
        }

        filename = file.name;

        if (excelFile) {
            const data = await readFile<ArrayBuffer>({ file, readAs: 'readAsArrayBuffer' });
            readExcel(data);
        } else {
            separador = prompt('el csv se separa por: ', ';') || ';';
            const data = await readFile<string>({ file, readAs: 'readAsText' });
            readCsv(data);
        }

        draggingOver = false;
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
        for (let row of data.split('\n')) {
            if (row == '') continue;
            rawData.push(row.split(separador));
        }
        onData(rawData);
    }
</script>

<section class="mt-5">
    <Dropzone
        class="border-dashed border-2 border-gray-300 rounded-lg mt-4 p-12 text-center text-gray-600 cursor-pointer hover:bg-gray-100 {draggingOver? 'border-blue-700': ''}"
        maxFiles={1}
        accept=".xlsx, .csv"
        containerClasses="border-blue-500"
        on:drop={(e) => validateFile(e.detail.acceptedFiles[0])}
        on:dragenter={() => (draggingOver = true)}
        on:dragleave={() => (draggingOver = false)}
        ><label
            for="file"
            class="text-gray-600 flex justify-center gap-4 items-center hover:bg-gray-100"
        >
            {filename ? filename : 'cargar archivo csv o excel'}
            <CloudUpload />
        </label></Dropzone
    >
    <fieldset>
        <legend class="text-gray-600 mt-4">callback:</legend>
        <label>
            <!-- <input
                type="text"
                id="separador"
                class="border p-2 text-gray-600 w-16"
                bind:value={separador}
            /> -->
            <textarea name="callback" id="callback" bind:value={callback} class="border p-2 text-gray-600 w-full"></textarea>
        </label>
    </fieldset>
</section>
