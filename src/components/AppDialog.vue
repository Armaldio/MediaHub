<template>
  <dialog
    ref="dialog"
    class="ui-dialog"
    :aria-labelledby="labelledBy"
    @cancel.prevent="emit('close')"
    @keydown.tab="cycleFocus"
  >
    <slot />
  </dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps<{ labelledBy: string }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement | null>(null);

// Keep Tab cycling through the modal rather than moving to browser chrome.
function cycleFocus(event: KeyboardEvent) {
  const controls = [...(dialog.value?.querySelectorAll<HTMLElement>(
    'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
  ) ?? [])].filter(element => element.getClientRects().length > 0);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

// The native modal makes the page behind it inert and restores focus on close.
onMounted(() => {
  dialog.value?.showModal();
});
onBeforeUnmount(() => {
  dialog.value?.close();
});
</script>
