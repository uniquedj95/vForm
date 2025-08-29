<template>
  <div class="input-container" :class="{ loading: isLoading }">
    <ion-input
      ref="inputRef"
      v-model="input"
      v-maskito="maskitoOptions"
      :class="model.className"
      :clear-input="true"
      :fill="model.fill ?? 'solid'"
      :label-placement="model.labelPlacement ?? 'stacked'"
      :type="type ?? 'text'"
      :required="model.required"
      :error-text="model.error"
      :autofocus="model.autoFocus"
      :placeholder="isLoading ? 'Loading...' : (maskitoOptions?.placeholder ?? model.placeholder)"
      :disabled="model.disabled || isLoading"
      :counter="model.counter"
      :min="model.min"
      :max="model.max"
      :max-length="model.maxLength"
      :min-length="model.minLength"
      :pattern="model.pattern"
      style="width: 100%"
      @ionFocus="onFocus"
      @ionChange="onValueUpdate"
      @ion-blur="onValueUpdate"
    >
      <InputLabel :model="model" slot-name="label" />
      <ion-label v-if="model.prefix" slot="start">{{ model.prefix }}</ion-label>
      <ion-label v-if="model.suffix" slot="end">{{ model.suffix }} </ion-label>
      <ion-input-password-toggle slot="end" v-if="type === 'password'" />
      <ion-spinner v-if="isLoading" slot="end" name="crescent" class="loading-spinner" />
    </ion-input>
  </div>
</template>

<script lang="ts" setup>
import { IonInput, IonLabel, IonInputPasswordToggle, IonSpinner } from '@ionic/vue';
import { FormField, FormSchema, BaseFieldTypes } from '@/types';
import { generateMaskitoOptions } from '@/utils';
import { ComponentPublicInstance, computed, PropType, ref, watch } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { useFormFieldValue } from '@/composables/useFormFieldValue';
import InputLabel from '../shared/InputLabel.vue';

const props = defineProps<{ schema?: FormSchema; type?: BaseFieldTypes }>();
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
const { isValid, onValueUpdate, onFocus, onReset, getErrors } = useInputValidation(
  inputRef,
  model,
  input,
  schema
);

const maskitoOptions = computed(() => {
  if (model.value.pattern) return generateMaskitoOptions(model.value.pattern);
  return undefined;
});

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
  isValid,
  isLoading,
  valueError,
});
</script>

<style scoped>
.input-container {
  position: relative;
  width: 100%;
}

.input-container.loading {
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
