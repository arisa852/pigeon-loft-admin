<script setup>
const keyword = defineModel('keyword', { type: String, default: '' })

defineProps({
  total: { type: Number, required: true },
})

const emit = defineEmits(['refresh'])

const btnBase =
  'rounded px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
</script>

<template>
  <div class="space-y-4 border-b border-gray-100 p-4">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <h1 class="text-lg font-bold text-gray-800">鴿舍清單</h1>

      <div class="grid grid-cols-2 gap-2 sm:flex">
        <button type="button" :class="[btnBase, 'bg-blue-500 text-white hover:bg-blue-600']">
          ＋ 添加鴿舍
        </button>
        <button type="button" :class="[btnBase, 'bg-green-500 text-white hover:bg-green-600']">
          ↑ 導入鴿舍
        </button>
        <button type="button" :class="[btnBase, 'bg-gray-500 text-white hover:bg-gray-600']">
          ↓ 下載模板
        </button>
        <button
          type="button"
          :class="[btnBase, 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100']"
          @click="emit('refresh')"
        >
          ↻ 刷新
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full sm:max-w-xs">
        <label for="loft-search" class="sr-only">搜尋鴿舍</label>
        <svg
          class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="loft-search"
          v-model="keyword"
          type="search"
          placeholder="搜尋鴿舍名稱、編號、地址..."
          class="w-full rounded border border-gray-300 py-2 pr-3 pl-9 text-base sm:text-smm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
        />
      </div>
      <p class="text-base sm:text-sm text-gray-500">共 {{ total }} 筆</p>
    </div>
  </div>
</template>