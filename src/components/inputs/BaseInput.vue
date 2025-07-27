<template>
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
    :placeholder="maskitoOptions?.placeholder ?? model.placeholder"
    :disabled="model.disabled"
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
    <InputLabel :model="model" />
    <ion-label v-if="model.prefix" slot="start">{{ model.prefix }}</ion-label>
    <ion-label v-if="model.suffix" slot="end">{{ model.suffix }} </ion-label>
    <ion-input-password-toggle slot="end" v-if="type === 'password'" />
  </ion-input>
</template>

<script lang="ts" setup>
import { IonInput, IonLabel, IonInputPasswordToggle } from '@ionic/vue';
import { FormField, FormSchema, BaseFieldTypes } from '@/types';
import { generateMaskitoOptions } from '@/utils';
import { ComponentPublicInstance, computed, PropType, ref, watch } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import InputLabel from '../shared/InputLabel.vue';

const props = defineProps<{ schema?: FormSchema; type?: BaseFieldTypes }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const input = ref(model.value.value as string);
const schema = computed(() => props.schema);

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

watch(
  () => model.value.value,
  v => (input.value = v as string)
);

defineExpose({
  onValueUpdate,
  onReset,
  getErrors,
  isValid,
});
</script>
