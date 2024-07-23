<script setup lang="ts">
import { useMupdf } from '@/composables/useMupdf'
import { watch, ref } from 'vue'

const { workerInitialized, loadDocument, renderPage, currentPage } = useMupdf()
const pdfUrl = ref<string | null>(null)

watch(workerInitialized, async (isInitialized) => {
  if (isInitialized) {
    const response = await fetch('/test.pdf')
    const arrayBuffer = await response.arrayBuffer()
    await loadDocument(arrayBuffer)
    const pngData = await renderPage(0)
    pdfUrl.value = URL.createObjectURL(new Blob([pngData], { type: 'image/png' }))
  }
})
</script>

<template>
  <img v-if="pdfUrl" :src="pdfUrl" alt="PDF page" />
</template>
