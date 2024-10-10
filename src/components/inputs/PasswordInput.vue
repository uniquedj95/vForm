<template>
  <base-input
    v-model="model"
    type="password"
    :schema="props.schema"
    ref="inputRef"
  />
</template>

<script lang="ts" setup>
import { FormField, FormSchema } from "types";
import { PropType, ref } from "vue";
import BaseInput from "./BaseInput.vue";

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {}});
const inputRef = ref<typeof BaseInput | null>(null);

defineExpose({
  onReset: () => inputRef.value?.onReset(),
  onValueUpdate: () => inputRef.value?.onValueUpdate(),
  getErrors: () => inputRef.value?.getErrors()
});
</script>