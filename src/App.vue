<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import LoftPage from "@/views/LoftPage.vue"

const activeKey = ref('lofts')
const isSidebarOpen = ref(false)

function handleSelect(key) {
  activeKey.value = key
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="flex h-dvh overflow-hidden">
    <AppSidebar
      :active-key="activeKey"
      :open="isSidebarOpen"
      @select="handleSelect"
      @close="isSidebarOpen = false"
    />

    <div class="flex min-w-0 flex-1 flex-col">
     <header
  class="flex h-14 shrink-0 items-center gap-3 bg-linear-to-r from-blue-700 to-blue-500 px-4 font-bold text-white"
>
  <button
    type="button"
    class="rounded p-1 hover:bg-white/20 lg:hidden"
    aria-label="開啟選單"
    aria-controls="sidebar"
    :aria-expanded="isSidebarOpen"
    @click="isSidebarOpen = true"
  >
    ☰
    </button>
    鴿舍管理後台
    <button
    type="button"
    class="ml-auto hidden items-center gap-1 rounded px-2 py-1 text-sm font-normal transition-colors hover:bg-white/20 sm:inline-flex"
    >
    屏東青田鴿會 <span aria-hidden="true">▾</span>
  </button>
  </header>

      <main class="flex-1 overflow-y-auto bg-gray-100 p-4">
        <LoftPage v-if="activeKey === 'lofts'" />
        <p v-else class="py-20 text-center text-gray-400">此功能開發中</p>
      </main>
    </div>
  </div>
</template>
