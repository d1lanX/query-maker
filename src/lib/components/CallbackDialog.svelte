<script lang="ts">
    import { onMount } from 'svelte';

    let {
        callbackFn = $bindable(),
        sampleColumn = $bindable(),
        validarFn = $bindable(),
    } = $props();

    let dialog: HTMLDialogElement | null = $state(null);
    let textarea: HTMLTextAreaElement | null = $state(null);

    import { globalState } from '$lib/state.svelte';

    const defaultCode = `// Puedes utilizar 'row' (array) y 'index' (number)\nreturn row;`;

    function update() {
        let text = textarea?.value || '';
        let result_element = document.querySelector('#highlighting-content') as HTMLElement;
        if (text[text.length - 1] == '\n') {
            text += ' ';
        }
        result_element.innerHTML = text;

        if (!textarea) {
            console.warn('no textarea found');
            return;
        }

        sync_scroll(textarea);
    }

    export function setCallback() {
        if (!isValidJavaScript(textarea?.value || '')) {
            globalState.isCallbackValid = false;
            return;
        }
        const userCode = textarea?.value || '';
        try {
            // Test if it's syntactically valid
            new Function('row', 'index', userCode);
        } catch (e) {
            globalState.isCallbackValid = false;
            return;
        }

        callbackFn = (row: any[], index: number) => {
            const fn = new Function('row', 'index', userCode);
            return fn(row, index);
        };
        globalState.isCallbackValid = true;
    }

    function isValidJavaScript(code: string) {
        try {
            const fn = new Function('row', 'index', code);
            fn([], 0);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    onMount(() => {
        textarea!.value = defaultCode;
        update();
    });

    function sync_scroll(element: HTMLTextAreaElement) {
        /* Scroll result to scroll coords of event - sync with textarea */
        let result_element = document.querySelector('#highlighting')!;
        result_element.scrollTop = element.scrollTop;
        result_element.scrollLeft = element.scrollLeft;
    }

    function check_tab(element: HTMLTextAreaElement, event: KeyboardEvent) {
        let code = element.value;
        if (event.key == 'Tab') {
            /* Tab key pressed */
            event.preventDefault(); // stop normal
            let before_tab = code.slice(0, element.selectionStart); // text before tab
            let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
            let cursor_pos = element.selectionStart + 1; // where cursor moves after tab - moving forward by 1 char to after tab
            element.value = before_tab + '\t' + after_tab; // add tab char
            // move cursor
            element.selectionStart = cursor_pos;
            element.selectionEnd = cursor_pos;
            update(); // Update text to include indent
        }
    }
</script>

<dialog bind:this={dialog} class="backdrop:bg-black/75">
    <div class="p-2 h-[90vh] w-[90vw] relative flex flex-col">
        <div style="height: 300px;">
            <textarea
                bind:this={textarea}
                id="editing"
                spellcheck="false"
                oninput={update}
                onscroll={() => sync_scroll(textarea!)}
                onkeydown={(e) => check_tab(textarea!, e)}
                onchange={setCallback}
            ></textarea>
            <pre id="highlighting" aria-hidden="true">
<code class="language-javascript" id="highlighting-content"></code>
</pre>
        </div>
        <br />
        <details class="p-2 border rounded cursor-pointer my-2">
            <summary class="text-xs text-gray-500">para que es este callback?</summary>
            <p class="text-gray-500 text-xs mt-4">
                el codigo se ejecutara por cada fila del archivo. tienes acceso a variables: <mark
                    >row</mark
                >
                (array de celdas) e <mark>index</mark> (numero de fila).
            </p>
            <small class="text-gray-500 text-xs italic"
                >ejemplo: <mark>return row.map(cell => cell.toUpperCase())</mark></small
            >
        </details>
        <p class="text-red-500 italic text-sm p-2"></p>
        <button
            class="absolute bottom-0 right-0 bg-red-500 text-white p-2"
            onclick={() => dialog?.close()}>cerrar</button
        >
    </div>
</dialog>
<button
    class="bg-gray-100 text-gray-700 p-2 rounded-lg my-2 border border-gray-200 hover:bg-gray-200"
    onclick={() => dialog?.showModal()}><small>definir callback</small></button
>

<style>
    /* Please see the article */

    #editing,
    #highlighting {
        /* Both elements need the same text and space styling so they are directly on top of each other */
        margin: 10px;
        padding: 10px;
        border: 0;
        width: calc(100% - 32px);
        height: 300px;
    }
    #editing,
    #highlighting,
    #highlighting * {
        /* Also add text styles to highlighing tokens */
        font-size: 15pt;
        font-family: monospace;
        line-height: 1.5;
        tab-size: 2;
    }

    #editing,
    #highlighting {
        /* In the same place */
        position: absolute;
        top: 0;
        left: 0;
    }

    /* Move the textarea in front of the result */

    #editing {
        z-index: 1;
    }
    #highlighting {
        z-index: 0;
    }

    /* Make textarea almost completely transparent */

    #editing {
        color: transparent;
        background: transparent;
        caret-color: red; /* Or choose your favourite color */
    }

    /* Can be scrolled */
    #editing,
    #highlighting {
        overflow: auto;
        white-space: pre; /* Allows textarea to scroll horizontally */
    }

    /* No resize on textarea */
    #editing {
        resize: none;
    }

    /* Paragraphs; First Image */
    * {
        font-family: 'Fira Code', monospace;
    }
    button,
    p {
        font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
            'Segoe UI Symbol', 'Noto Color Emoji' !important;
    }
    p code {
        border-radius: 2px;
        background-color: #eee;
        color: #111;
    }

    code[class*='language-'],
    pre[class*='language-'] {
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        font-size: 1em;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        line-height: 1.5;

        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;

        -webkit-hyphens: none;
        -moz-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;
    }

    /* Code blocks */
    pre[class*='language-'] {
        padding: 0.4em 0.8em;
        margin: 0.5em 0;
        overflow: auto;
        background: black; /* - WebCoder49 */
    }

    code[class*='language-'] {
        /* background: black; */
        color: black;
        /* box-shadow:
            -0.3em 0 0 0.3em black,
            0.3em 0 0 0.3em black; */
    }

    /* Inline code */
    :not(pre) > code[class*='language-'] {
        padding: 0.2em;
        border-radius: 0.3em;
        box-shadow: none;
        white-space: normal;
    }

    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
        color: #aaa;
    }

    .token.punctuation {
        color: #999;
    }

    .token.namespace {
        opacity: 0.7;
    }

    .token.property,
    .token.tag,
    .token.boolean,
    .token.number,
    .token.constant,
    .token.symbol {
        color: #0cf;
    }

    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin {
        color: yellow;
    }

    .token.operator,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .token.variable,
    .token.inserted {
        color: yellowgreen;
    }

    .token.atrule,
    .token.attr-value,
    .token.keyword {
        color: deeppink;
    }

    .token.regex,
    .token.important {
        color: orange;
    }

    .token.important,
    .token.bold {
        font-weight: bold;
    }
    .token.italic {
        font-style: italic;
    }

    .token.entity {
        cursor: help;
    }

    .token.deleted {
        color: red;
    }

    /* Plugin styles: Diff Highlight */
    pre.diff-highlight.diff-highlight > code .token.deleted:not(.prefix),
    pre > code.diff-highlight.diff-highlight .token.deleted:not(.prefix) {
        background-color: rgba(255, 0, 0, 0.3);
        display: inline;
    }

    pre.diff-highlight.diff-highlight > code .token.inserted:not(.prefix),
    pre > code.diff-highlight.diff-highlight .token.inserted:not(.prefix) {
        background-color: rgba(0, 255, 128, 0.3);
        display: inline;
    }

    /* End of prism.js syntax highlighting*/
</style>
