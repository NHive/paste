<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { inBrowser, useData } from 'vitepress'
import { computed, watchEffect } from 'vue'
import { migration } from './migration'

const { lang, page } = useData()
const copy = computed(() => lang.value === 'zh-CN' ? migration['zh-cn'] : lang.value === 'zh-HK' ? migration['zh-hk'] : migration.en)
const isArchive = computed(() => page.value.relativePath.includes('/guide/'))
watchEffect(() => {
    if (inBrowser) {
        document.cookie = `nf_lang=${lang.value}; expires=Mon, 1 Jan 2030 00:00:00 UTC; path=/`
    }
})
</script>

<template>
    <DefaultTheme.Layout>
        <template #doc-before>
            <aside v-if="isArchive" class="migration-notice" aria-label="Paste">
                <p>{{ copy.note }}</p>
                <a :href="copy.link">{{ copy.button }}</a>
            </aside>
        </template>
    </DefaultTheme.Layout>
</template>
