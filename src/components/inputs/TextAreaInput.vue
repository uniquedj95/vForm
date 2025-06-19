<template>
  <ion-textarea
    ref="inputRef"
    v-model="input"
    :clear-input="true"
    :fill="model.fill ?? 'solid'"
    :label-placement="model.labelPlacement ?? 'stacked'"
    :required="model.required"
    :error-text="model.error"
    :autofocus="model.autoFocus"
    :placeholder="model.placeholder"
    :disabled="model.disabled"
    :counter="model.counter"
    :min="model.min"
    :max="model.max"
    :rows="model.rows"
    :cols="model.cols"
    :auto-grow="model.autoGrow"
    :max-length="model.maxLength"
    :min-length="model.minLength"
    :pattern="model.pattern"
    @ionFocus="onFocus"
    @ionChange="onValueUpdate"
    @ion-blur="onValueUpdate"
  >
    <InputLabel :model="model" />
  </ion-textarea>
</template>

<script lang="ts" setup>
import { IonTextarea } from '@ionic/vue';
import { FormField, FormSchema } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import InputLabel from '../shared/InputLabel.vue';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const input = ref(model.value.value as string);
const schema = computed(() => props.schema);

// Use input validation composable
const { onValueUpdate, onFocus, onReset, getErrors } = useInputValidation(
  inputRef,
  model,
  input,
  schema
);

watch(
  () => model.value.value,
  v => (input.value = v as string)
);

defineExpose({
  onReset,
  onValueUpdate,
  getErrors,
});
</script>
