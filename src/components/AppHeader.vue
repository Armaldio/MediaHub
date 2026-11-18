<template>
  <header class="app-header">
    <div class="ui-container">
      <div class="app-header-inner">
        <div class="flex min-w-0 items-center gap-2">
          <button
            v-if="back"
            type="button"
            class="ui-button ui-button--ghost ui-icon-button"
            aria-label="Go back"
            @click="emit('back')"
          >
            <ArrowLeft :size="19" aria-hidden="true" />
          </button>
          <RouterLink to="/home" class="app-brand" aria-label="MediaHub home">
            <span class="app-brand-mark"
              ><Layers :size="19" :stroke-width="1.8" aria-hidden="true"
            /></span>
            MediaHub
          </RouterLink>
        </div>
        <div class="app-header-actions"><slot /></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft, Layers } from "lucide-vue-next";
defineProps<{ back?: boolean }>();
const emit = defineEmits<{ back: [] }>();
</script>

<style scoped>
.app-header {
  padding-top: env(safe-area-inset-top, 0px);
  background: var(--color-canvas);
}
.app-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 68px;
  border-bottom: 1px solid var(--color-line-soft);
}
.app-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-ink);
  font-size: 17px;
  font-weight: 650;
  text-decoration: none;
  letter-spacing: -0.5px;
  white-space: nowrap;
}
.app-brand-mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
}
.app-header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}
@media (max-width: 380px) {
  .app-brand {
    font-size: 15px;
    gap: 7px;
  }
  .app-header-actions {
    gap: 2px;
  }
}
</style>
