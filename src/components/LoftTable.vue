<script setup>
import { formatDMS, formatDateTime } from '@/utils/formatters'

const props = defineProps({
  lofts: { type: Array, required: true },
  sortKey: { type: String, default: '' },
  sortOrder: { type: String, default: 'asc' },
})

const emit = defineEmits(['sort', 'action'])
const columns = [
  { key: 'index', label: '序號' },
  { key: 'code', label: '編號', sortable: true },
  { key: 'name', label: '名稱', sortable: true },
  { key: 'longitude', label: '經度' },
  { key: 'latitude', label: '緯度' },
  { key: 'address', label: '地址' },
  { key: 'createdAt', label: '創建時間', sortable: true },
  { key: 'actions', label: '操作' },
]

const btnBase =
  'rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400'

const actions = [
  { key: 'edit', label: '編輯', class: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100' },
  { key: 'view', label: '查看', class: 'bg-gray-500 text-white hover:bg-gray-600' },
  { key: 'delete', label: '刪除', class: 'bg-red-500 text-white hover:bg-red-600' },
]

function sortIcon(key) {
  if (props.sortKey !== key) return '⇅'
  return props.sortOrder === 'asc' ? '↑' : '↓'
}

function ariaSort(col) {
  if (!col.sortable) return undefined
  if (props.sortKey !== col.key) return 'none'
  return props.sortOrder === 'asc' ? 'ascending' : 'descending'
}
</script>

<template>
  <!-- 手機：卡片 -->
  <ul class="space-y-3 p-4 md:hidden">
    <li
      v-for="(loft,index) in lofts"
      :key="loft.key"
      class="overflow-hidden rounded-lg border border-gray-200"
    >
      <div class="flex items-center gap-3 bg-blue-50 px-4 py-3">
        <span class="flex size-7 items-center justify-center rounded bg-white text-sm font-semibold text-blue-600">
          {{ index + 1 }}
        </span>
        <span class="rounded bg-sky-100 px-2 py-0.5 font-semibold text-sky-700">{{ loft.code }}</span>
        <span class="ml-auto font-medium text-gray-800">{{ loft.name }}</span>
      </div>

      <dl class="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3 text-sm">
        <div>
          <dt class="text-xs text-gray-400">經度</dt>
          <dd class="tabular-nums">{{ formatDMS(loft.longitude) }}</dd>
        </div>
        <div>
          <dt class="text-xs text-gray-400">緯度</dt>
          <dd class="tabular-nums">{{ formatDMS(loft.latitude) }}</dd>
        </div>
        <div class="col-span-2">
          <dt class="text-xs text-gray-400">地址</dt>
          <dd>{{ loft.address || '—' }}</dd>
        </div>
        <div class="col-span-2">
          <dt class="text-xs text-gray-400">創建時間</dt>
          <dd class="tabular-nums">{{ formatDateTime(loft.createdAt) }}</dd>
        </div>
      </dl>

      <div class="grid grid-cols-3 gap-2 border-t border-gray-100 px-4 py-3">
        <button
          v-for="(action,index) in actions"
          :key="action.key"
          type="button"
          class="py-2 text-sm"
          :class="[btnBase, action.class]"
          @click="emit('action', action.key, loft)"
        >
          {{ action.label }}
        </button>
      </div>
    </li>
  </ul>

  <!-- 平板以上：表格 -->
 <div class="hidden md:block">
  <div class="overflow-x-auto">
    <table class="w-full min-w-[960px] text-left text-sm">
      <thead class="bg-blue-50 text-gray-700">
    <tr>
    <th
      v-for="col in columns"
      :key="col.key"
      scope="col"
      class="whitespace-nowrap px-4 py-3 font-semibold"
      :aria-sort="ariaSort(col)"
    >
      <button
        v-if="col.sortable"
        type="button"
        class="inline-flex items-center gap-1 rounded transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        @click="emit('sort', col.key)"
      >
        {{ col.label }}
        <span
          aria-hidden="true"
          :class="sortKey === col.key ? 'text-blue-600' : 'text-gray-400'"
        >
          {{ sortIcon(col.key) }}
        </span>
      </button>
      <template v-else>{{ col.label }}</template>
      </th>
    </tr>
  </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="(loft, index) in lofts"
          :key="loft.id"
          class="transition-colors even:bg-gray-50 hover:bg-blue-50/60"
        >
          <td class="px-4 py-3 text-gray-500">{{ index + 1 }}</td>
          <td class="px-4 py-3">
            <span class="rounded bg-sky-100 px-2 py-0.5 font-semibold text-sky-700">
              {{ loft.code }}
            </span>
          </td>
          <td class="whitespace-nowrap px-4 py-3">{{ loft.name }}</td>
          <td class="whitespace-nowrap px-4 py-3 tabular-nums">{{ formatDMS(loft.longitude) }}</td>
          <td class="whitespace-nowrap px-4 py-3 tabular-nums">{{ formatDMS(loft.latitude) }}</td>
          <td class="px-4 py-3">{{ loft.address || '—' }}</td>
          <td class="whitespace-nowrap px-4 py-3 tabular-nums">{{ formatDateTime(loft.createdAt) }}</td>
          <td class="px-4 py-3">
            <div class="flex gap-2">
              <button
                v-for="action in actions"
                :key="action.key"
                type="button"
                class="px-3 py-1 text-xs"
                :class="[btnBase, action.class]"
                @click="emit('action', action.key, loft)"
              >
                {{ action.label }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="border-t border-gray-100 px-4 py-2 text-xs text-gray-400 lg:hidden">
    表格較寬，可左右滑動檢視全部欄位
  </p>
</div>
</template>