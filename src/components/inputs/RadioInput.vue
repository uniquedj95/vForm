<template>
  <ion-radio-group
    v-model="input"
    ref="inputRef"
    :required="model.required"
    :help-text="helpText"
    :error-text="model.error"
    :disabled="model.disabled"
    :compareWith="compareWith"
    @ionFocus="onFocus"
    @ionChange="onValueUpdate"
    @ionBlur="onValueUpdate"
  >
    <ion-radio
      v-for="option of options"
      :key="option.value"
      :value="option"
      :disabled="model.disabled"
      :label-placement="labelPlacement"
    >
      {{ option.label }}
    </ion-radio>
  </ion-radio-group>
</template>

<script lang="ts" setup>
import { IonRadioGroup, IonRadio } from '@ionic/vue';
import { FormField, FormSchema, Option } from '../../types';
import { ComponentPublicInstance, PropType, ref, watch, computed, onMounted } from 'vue';
import { useInputValidation } from '../../composables/useInputValidation';
import { getLabelText } from '../../utils';
const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const input = ref(model.value.value as Option | undefined);
const schema = computed(() => props.schema);
const options = ref<Option[]>([]);

const helpText = computed(() => getLabelText(model.value));

const labelPlacement = computed<'start' | 'end'>(() => {
  return model.value.labelPlacement ? (model.value.labelPlacement as 'start' | 'end') : 'end';
});

// Use the input validation helpers
const { onValueUpdate, onFocus, getErrors } = useInputValidation(inputRef, model, input, schema);

// Custom onReset for radio group (default to null)
function onReset() {
  model.value.error = '';
  input.value = undefined;
  model.value.value = undefined;
}

// Custom compare function for radio group
function compareWith(a: Option, b: Option): boolean {
  return a.value === b.value;
}

async function initializeOptions() {
  if (typeof model.value.options === 'function') {
    options.value = await model.value.options();
  } else {
    options.value = model.value.options as Option[];
  }
}

watch(
  () => model.value.value,
  v => (input.value = v as Option | undefined)
);

defineExpose({
  onValueUpdate,
  onReset,
  getErrors,
});

onMounted(initializeOptions);
</script>
