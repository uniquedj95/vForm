<template>
  <base-input
    v-model="model"
    :type="model.enableTime ? 'datetime-local' : 'date'"
    :schema="schema"
    ref="inputRef"
  />
</template>

<script lang="ts" setup>
import type { FormField, FormSchema } from '@/types';
import { PropType, ref } from 'vue';
import BaseInput from './BaseInput.vue';

defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<InstanceType<typeof BaseInput> | null>(null);

defineExpose({
  onValueUpdate: () => inputRef.value?.onValueUpdate(),
  onReset: () => inputRef.value?.onReset(),
  getErrors: () => inputRef.value?.getErrors?.() ?? [],
});
</script>
