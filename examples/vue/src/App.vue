<script setup lang="ts">
import { useMupdf } from '@/composables/useMupdf';
import { ref, watch } from 'vue';

const { workerInitialized, loadDocument, renderPage } = useMupdf()
const pdfUrl = ref<string | null>(null)

// ===> This is a demo callback which uses functions <===
// ===> from useMupdf to load and display the first page <===
// ===> of the pdf as an image. <===
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
