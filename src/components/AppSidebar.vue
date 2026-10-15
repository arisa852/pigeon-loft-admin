<script setup>
defineProps({
  activeKey: { type: String, required: true },
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'close'])

const menuItems = [
  { key: 'password', label: '密碼修改' },
  { key: 'lofts', label: '鴿舍管理' },
  { key: 'rings', label: '鴿環管理' },
  { key: 'clocks', label: '鴿舍鴿鐘' },
  { key: 'races', label: '比賽管理' },
  { key: 'results', label: '比賽成績' },
  { key: 'devices', label: '設備狀態' },
  { key: 'flights', label: '飛行記錄' },
]
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/50 lg:hidden"
    aria-hidden="true"
    @click="emit('close')"
  />

  <aside
    id="sidebar"
    class="fixed inset-y-0 left-0 z-40 w-60 shrink-0 bg-gray-700 text-white transition-transform duration-200 lg:static lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex h-14 items-center justify-between px-6 text-lg font-bold">
      鴿會
      <button
        type="button"
        class="rounded p-1 hover:bg-gray-600 lg:hidden"
        aria-label="關閉選單"
        @click="emit('close')"
      >
        ✕
      </button>
    </div>

    <nav aria-label="主選單">
      <ul class="space-y-1 px-3">
        <li v-for="item in menuItems" :key="item.key">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-300"
            :class="
              activeKey === item.key
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-600 hover:text-white'
            "
            :aria-current="activeKey === item.key ? 'page' : undefined"
            @click="emit('select', item.key)"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>