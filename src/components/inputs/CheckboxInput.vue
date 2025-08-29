<template>
  <div class="checkbox-container" :class="{ loading: isLoading }">
    <ion-checkbox
      v-model="input"
      ref="inputRef"
      justify="start"
      :class="model.className"
      :required="model.required"
      :error-text="model.error"
      :disabled="model.disabled || isLoading"
      @ionFocus="onFocus"
      @ionChange="onValueUpdate"
      @ion-blur="onValueUpdate"
      style="width: 100%"
    >
      {{ isLoading ? 'Loading...' : labelTextWithAsterisk }}
      <ion-spinner v-if="isLoading" name="crescent" class="loading-spinner" />
    </ion-checkbox>
  </div>
</template>

<script lang="ts" setup>
import { IonCheckbox, IonSpinner } from '@ionic/vue';
import { FormField, FormSchema } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { useFormFieldValue } from '@/composables/useFormFieldValue';
import { getLabelText } from '@/utils';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const schema = computed(() => props.schema);

// Use form field value resolution
const { resolvedValue, isLoading, error: valueError } = useFormFieldValue(model);

// Initialize input with resolved value
const input = ref<boolean>(false);

// Watch for resolved value changes and update input
watch(
  resolvedValue,
  newValue => {
    if (newValue !== undefined && newValue !== null) {
      input.value = Boolean(newValue);
    } else {
      input.value = false;
    }
  },
  { immediate: true }
);

// Use checkbox label text composable
const labelTextWithAsterisk = computed(() => getLabelText(model.value));

// Use input validation composable with custom default value for checkbox
const { onValueUpdate, onFocus, getErrors } = useInputValidation(inputRef, model, input, schema);

// Custom onReset for checkbox (default to false)
function onReset() {
  input.value = false;
  model.value.error = '';
  model.value.value = false;
}

// Enhanced getErrors to include value resolution errors
const getErrorsWithValueErrors = () => {
  const validationErrors = getErrors();
  if (valueError.value) {
    return [...validationErrors, valueError.value];
  }
  return validationErrors;
};

defineExpose({
  onValueUpdate,
  onReset,
  getErrors: getErrorsWithValueErrors,
  isLoading,
  valueError,
});
</script>

<style scoped>
.checkbox-container {
  position: relative;
  width: 100%;
}

.checkbox-container.loading {
  opacity: 0.8;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  margin-left: 8px;
}

.loading-spinner::part(native) {
  color: var(--ion-color-primary, #3880ff);
}
</style>
