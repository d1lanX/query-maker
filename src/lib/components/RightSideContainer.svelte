<section class="border p-2 rounded-lg">
  <slot name="query_writer"></slot>
  <header class="text-xl bg-gray-100 rounded p-2 font-bold text-gray-700">
    últimas queries generadas
  </header>
  <section class="mt-5">
    <slot>
      <small class="p-4 text-gray-600">sin queries generadas</small>
    </slot>
  </section>
</section>