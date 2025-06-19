<template>
  <base-input v-model="model" type="number" :schema="schema" ref="inputRef" />
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue';
import { FormField, FormSchema } from '@/types';
import BaseInput from './BaseInput.vue';

defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<typeof BaseInput | null>(null);

defineExpose({
  onReset: () => inputRef.value?.onReset(),
  onValueUpdate: () => inputRef.value?.onValueUpdate(),
  getErrors: () => inputRef.value?.getErrors?.() ?? [],
});
</script>
