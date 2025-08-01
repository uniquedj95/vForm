<template>
  <ion-radio-group
    v-model="input"
    ref="inputRef"
    :class="model.className"
    :required="model.required"
    :helper-text="helpText"
    :error-text="model.error"
    :disabled="model.disabled"
    :compareWith="compareWith"
    :allow-empty-selection="!model.required"
    @ionFocus="onFocus"
    @ionChange="onValueUpdate"
    @ionBlur="onValueUpdate"
    style="width: 100%"
  >
    <ion-item
      v-for="option of options"
      :key="option.value"
      :lines="model.showOptionsSeparator ? 'none' : 'full'"
    >
      <ion-radio :value="option" :disabled="model.disabled" label-placement="end" justify="start">
        {{ option.label }}
      </ion-radio>
    </ion-item>
  </ion-radio-group>
</template>

<script lang="ts" setup>
import { IonRadioGroup, IonRadio, IonItem } from '@ionic/vue';
import { FormField, FormSchema, Option } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed, onMounted } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { getLabelText } from '@/utils';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const input = ref(model.value.value as Option | undefined);
const schema = computed(() => props.schema);
const options = ref<Option[]>([]);

const helpText = computed(() => getLabelText(model.value));

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
