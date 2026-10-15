<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import loftsData from '@/data/loft.json'
import LoftToolbar from '@/components/LoftToolbar.vue'
import LoftTable from '@/components/LoftTable.vue'
import BaseModal from '@/components/BaseModal.vue'
import { formatDMS, formatDateTime } from '@/utils/formatters'

const lofts = ref([...loftsData])
const keyword = ref('')
const sortKey = ref('')
const sortOrder = ref('asc')

const filteredLofts = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return lofts.value

  return lofts.value.filter((loft) =>
    [loft.code, loft.name, loft.address].some((field) =>
      field.toLowerCase().includes(q),
    ),
  )
})

const compareFns = {
  code: (a, b) => a.code.localeCompare(b.code),
  name: (a, b) => a.name.localeCompare(b.name, 'zh-Hant'),
  createdAt: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
}

const sortedLofts = computed(() => {
  const list = [...filteredLofts.value]
  if (!sortKey.value) return list

  const compare = compareFns[sortKey.value]
  return list.sort((a, b) =>
    sortOrder.value === 'asc' ? compare(a, b) : -compare(a, b),
  )
})

function handleSort(key) {
  if (sortKey.value !== key) {
    sortKey.value = key
    sortOrder.value = 'asc'
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc'
  } else {
    sortKey.value = ''
    sortOrder.value = 'asc'
  }
}

const sortOptions = [
  { value: '', label: '預設順序' },
  { value: 'code-asc', label: '編號（小 → 大）' },
  { value: 'code-desc', label: '編號（大 → 小）' },
  { value: 'name-asc', label: '名稱（筆畫少 → 多）' },
  { value: 'name-desc', label: '名稱（筆畫多 → 少）' },
  { value: 'createdAt-asc', label: '創建時間（舊 → 新）' },
  { value: 'createdAt-desc', label: '創建時間（新 → 舊）' },
]

const mobileSort = computed({
  get: () => (sortKey.value ? `${sortKey.value}-${sortOrder.value}` : ''),
  set: (value) => {
    const [key = '', order = 'asc'] = value.split('-')
    sortKey.value = key
    sortOrder.value = order
  },
})

const toastMessage = ref('')
let toastTimer = null

function showToast(message) {
  toastMessage.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

onBeforeUnmount(() => clearTimeout(toastTimer))

function handleRefresh() {
  lofts.value = [...loftsData]
  keyword.value = ''
  sortKey.value = ''
  sortOrder.value = 'asc'
  showToast('資料已重新整理')
}

const deletingLoft = ref(null)
const viewingLoft = ref(null)

const editingLoft = ref(null)
const editForm = ref({ name: '', address: '' })
const editError = ref('')

function openEdit(loft) {
  editingLoft.value = loft
  editForm.value.name = loft.name
  editForm.value.address = loft.address
  editError.value = ''
}

function saveEdit() {
  const name = editForm.value.name.trim()
  const address = editForm.value.address.trim()

  if (!name) {
    editError.value = '名稱為必填'
    return
  }

  lofts.value = lofts.value.map((loft) =>
    // TODO 2：id 相同的那筆換成更新後的新物件，其他維持原樣
    loft.id === editingLoft.value.id ?{...loft,name,address} :loft
  )

  showToast(`已更新「${name}」`)
  editingLoft.value = null
}

function handleAction(type, loft) {
  if (type === 'delete') deletingLoft.value = loft
  else if (type === 'view') viewingLoft.value = loft
  else if (type === 'edit') openEdit(loft)
}

function confirmDelete() {
  lofts.value = lofts.value.filter((loft) => loft.id !== deletingLoft.value.id)
  showToast(`已刪除「${deletingLoft.value.name}」`)
  deletingLoft.value = null
}
</script>

<template>
  <section class="rounded-lg bg-white shadow-sm">
    <LoftToolbar
      v-model:keyword="keyword"
      :total="filteredLofts.length"
      @refresh="handleRefresh"
    />

    <div class="flex items-center gap-2 px-4 pt-4 md:hidden">
      <label for="mobile-sort" class="shrink-0 text-sm text-gray-500">排序</label>
      <select
        id="mobile-sort"
        v-model="mobileSort"
        class="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
      >
        <option v-for="option in sortOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <LoftTable
      v-if="sortedLofts.length"
      :lofts="sortedLofts"
      :sort-key="sortKey"
      :sort-order="sortOrder"
      @sort="handleSort"
      @action="handleAction"
    />
    <p v-else class="py-16 text-center text-sm text-gray-400">
      {{ keyword ? `查無符合「${keyword}」的鴿舍` : '目前沒有鴿舍資料' }}
    </p>

    <BaseModal :open="deletingLoft !== null" title="刪除鴿舍" @close="deletingLoft = null">
      <p class="text-sm leading-relaxed text-gray-600">
        確定要刪除
        <strong class="text-gray-800">{{ deletingLoft?.name }}</strong>
        （編號 {{ deletingLoft?.code }}）嗎？此動作無法復原。
      </p>

      <template #footer>
        <button
          type="button"
          class="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          @click="deletingLoft = null"
        >
          取消
        </button>
        <button
          type="button"
          class="rounded bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          @click="confirmDelete"
        >
          確定刪除
        </button>
      </template>
    </BaseModal>

    <BaseModal :open="viewingLoft !== null" title="鴿舍資料" @close="viewingLoft = null">
    <dl v-if="viewingLoft" class="grid grid-cols-[5rem_1fr] gap-x-4 gap-y-3 text-sm">
    <dt class="text-gray-400">編號</dt>
    <dd>
      <span class="rounded bg-sky-100 px-2 py-0.5 font-semibold text-sky-700">
        {{ viewingLoft.code }}
      </span>
    </dd>

    <dt class="text-gray-400">名稱</dt>
    <dd class="text-gray-800">{{ viewingLoft.name }}</dd>

    <dt class="text-gray-400">經度</dt>
    <dd class="tabular-nums text-gray-800">
      {{ formatDMS(viewingLoft.longitude) }}
      <span class="ml-1 text-xs text-gray-400">（{{ viewingLoft.longitude }}）</span>
    </dd>

    <dt class="text-gray-400">緯度</dt>
    <dd class="tabular-nums text-gray-800">
      {{ formatDMS(viewingLoft.latitude) }}
      <span class="ml-1 text-xs text-gray-400">（{{ viewingLoft.latitude }}）</span>
    </dd>

    <dt class="text-gray-400">地址</dt>
    <dd class="text-gray-800">{{ viewingLoft.address || '—' }}</dd>

    <dt class="text-gray-400">創建時間</dt>
    <dd class="tabular-nums text-gray-800">{{ formatDateTime(viewingLoft.createdAt) }}</dd>
  </dl>

  <template #footer>
    <button
      type="button"
      class="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
      @click="viewingLoft = null"
    >
      關閉
    </button>
    </template>
  </BaseModal>

  <BaseModal :open="editingLoft !== null" title="編輯鴿舍" @close="editingLoft = null">
  <form
    v-if="editingLoft"
    id="edit-loft-form"
    class="space-y-4"
    novalidate
    @submit.prevent="saveEdit"
  >
    <p class="text-xs text-gray-400">
      編號
      <span class="font-semibold text-sky-700">{{ editingLoft.code }}</span>
      ・編號與座標不開放編輯
    </p>

    <div>
      <label for="edit-name" class="mb-1 block text-sm text-gray-600">
        名稱 <span class="text-red-500" aria-hidden="true">*</span>
      </label>
      <input
        id="edit-name"
        v-model="editForm.name"
        type="text"
        required
        :aria-invalid="editError ? 'true' : undefined"
        aria-describedby="edit-name-error"
        class="w-full rounded border px-3 py-2 text-base sm:text-sm focus:ring-2 focus:outline-none"
        :class="
          editError
            ? 'border-red-400 focus:ring-red-500/20'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
        "
        @input="editError = ''"
      />
      <p v-if="editError" id="edit-name-error" class="mt-1 text-xs text-red-500">
        {{ editError }}
      </p>
    </div>

    <div>
      <label for="edit-address" class="mb-1 block text-sm text-gray-600">地址</label>
      <input
        id="edit-address"
        v-model="editForm.address"
        type="text"
        placeholder="未填寫"
        class="w-full rounded border border-gray-300 px-3 py-2 text-base sm:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
      />
    </div>
  </form>

  <template #footer>
    <button
      type="button"
      class="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
      @click="editingLoft = null"
    >
      取消
    </button>
    <button
      type="submit"
      form="edit-loft-form"
      class="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
    >
      儲存
    </button>
  </template>
</BaseModal>
    <div
      role="status"
      aria-live="polite"
      class="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="translate-y-2 opacity-0"
        leave-active-class="transition duration-200"
        leave-to-class="translate-y-2 opacity-0"
      >
        <p
          v-if="toastMessage"
          class="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white shadow-lg"
        >
          {{ toastMessage }}
        </p>
      </Transition>
    </div>
  </section>
</template>