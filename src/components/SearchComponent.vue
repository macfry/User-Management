<script setup lang="ts">
import { ref } from 'vue'
import debounce from './../helpers/debounce'

defineProps(['modelValue'])
const search = ref<string>('')
const emit = defineEmits(['update:modelValue'])
const onInput = debounce((query: string) => {
  emit('update:modelValue', query)
}, 1000)
</script>

<template>
  <div class="input-group">
    <input
      type="text"
      placeholder="Search for users..."
      class="form-control"
      aria-label="Search"
      v-model="search"
      @input="onInput($event.target.value)"
    />
    <button type="button" class="input-group-text" @click="emit('update:modelValue', search)">
      <span class="material-symbols-outlined">search</span>
    </button>
  </div>
</template>

<style scoped>
.input-group {
  max-width: 200px;
}
</style>
