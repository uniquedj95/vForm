<template>
  <div class="textarea-container" :class="{ loading: isLoading }">
    <ion-textarea
      ref="inputRef"
      v-model="input"
      :class="model.className"
      :clear-input="true"
      :fill="model.fill ?? 'solid'"
      :label-placement="model.labelPlacement ?? 'stacked'"
      :required="model.required"
      :error-text="model.error"
      :autofocus="model.autoFocus"
      :placeholder="isLoading ? 'Loading...' : model.placeholder"
      :disabled="model.disabled || isLoading"
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
      style="width: 100%"
    >
      <InputLabel :model="model" slot-name="label" />
      <ion-spinner v-if="isLoading" slot="end" name="crescent" class="loading-spinner" />
    </ion-textarea>
  </div>
</template>

<script lang="ts" setup>
import { IonTextarea, IonSpinner } from '@ionic/vue';
import { FormField, FormSchema } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { useFormFieldValue } from '@/composables/useFormFieldValue';
import InputLabel from '../shared/InputLabel.vue';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const schema = computed(() => props.schema);

// Use form field value resolution
const { resolvedValue, isLoading, error: valueError } = useFormFieldValue(model);

// Initialize input with resolved value
const input = ref<string>('');

// Watch for resolved value changes and update input
watch(
  resolvedValue,
  newValue => {
    if (newValue !== undefined && newValue !== null) {
      input.value = String(newValue);
    } else {
      input.value = '';
    }
  },
  { immediate: true }
);

// Use input validation composable
const { onValueUpdate, onFocus, onReset, getErrors } = useInputValidation(
  inputRef,
  model,
  input,
  schema
);

// Enhanced getErrors to include value resolution errors
const getErrorsWithValueErrors = () => {
  const validationErrors = getErrors();
  if (valueError.value) {
    return [...validationErrors, valueError.value];
  }
  return validationErrors;
};

defineExpose({
  onReset,
  onValueUpdate,
  getErrors: getErrorsWithValueErrors,
  isLoading,
  valueError,
});
</script>

<style scoped>
.textarea-container {
  position: relative;
  width: 100%;
}

.textarea-container.loading {
  opacity: 0.8;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.loading-spinner::part(native) {
  color: var(--ion-color-primary, #3880ff);
}
</style>
