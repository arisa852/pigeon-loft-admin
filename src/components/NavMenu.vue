<script setup>
import { ref } from 'vue'

defineProps({
	activekey:{type:string,required:true}
})

const emit = defineEmits(['select'])

const menuItems = [
  { key: 'password', label: '密碼修改' },
  { key: 'lofts', label: '鴿舍管理' },
  { key:'rings',labe:'鴿環管理'},
  { key:'clocks',label:'鴿舍鴿鐘'},
  { key:'races',label:'比賽管理'},
  { key:'results',label:'比賽成績'},
  { key:'devices',label:'設備狀態'},
  { key:'flights',label:'飛行紀錄'}
]

const activeKey = ref('lofts')
</script>

<template>
  <!-- ...外層不變... -->
  <aside class="hidden w-60 shrink-0 bg-gray-700 text-white md:block">
    <div class="flex h-14 items-center px-6 text-lg font-bold">鴿會</div>

    <nav aria-label="主選單">
      <ul class="space-y-1 px-3">
        <li v-for="item in menuItems" :key="item.key">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-300"
            :class="activekey === item.key? 
			'bg-gray-600 text-white':'text-gray-300 hover:bg-gray-100'"
            :aria-current="activekey === item.key ? 'page': undefined"
            @click="emit('select',item.key)"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </nav>
  </aside>
  <!-- ... -->
</template>