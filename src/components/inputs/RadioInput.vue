<template>
  <input-label :model="model" /><br />
  <ion-note color="danger" v-if="model.error">{{ model.error }}</ion-note>
  <ion-item>
    <ion-radio-group
      v-model="input"
      :class="model.className"
      :required="model.required"
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
        <ion-radio
          :value="option"
          :disabled="model.disabled || option.disabled"
          label-placement="end"
          justify="start"
        >
          <div class="radio-content">
            <div class="radio-label">{{ option.label }}</div>
            <ion-text
              v-if="shouldShowDescription(option, isOptionSelected(option))"
              :color="option.description?.color"
              class="radio-description"
            >
              {{ option.description?.text }}
            </ion-text>
          </div>
        </ion-radio>
      </ion-item>
    </ion-radio-group>
  </ion-item>
</template>

<script lang="ts" setup>
import { IonRadioGroup, IonRadio, IonItem, IonNote, IonText } from '@ionic/vue';
import { FormField, FormSchema, Option } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed, onMounted } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { shouldShowDescription } from '@/utils';
import InputLabel from '../shared/InputLabel.vue';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const input = ref(model.value.value as Option | undefined);
const schema = computed(() => props.schema);
const options = ref<Option[]>([]);

// Use the input validation helpers
const { onValueUpdate, onFocus, getErrors, isValid } = useInputValidation(
  inputRef,
  model,
  input,
  schema
);

// Custom onReset for radio group
function onReset() {
  model.value.error = '';
  input.value = undefined;
  model.value.value = undefined;
}

// Custom compare function for radio group
function compareWith(a: Option, b: Option): boolean {
  return a?.value === b?.value;
}

// Check if an option is currently selected
function isOptionSelected(option: Option): boolean {
  return input.value ? compareWith(input.value, option) : false;
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
  isValid,
});

onMounted(initializeOptions);
</script>

<style scoped>
.radio-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radio-label {
  font-weight: normal;
}

.radio-description {
  font-size: 0.875rem;
  line-height: 1.2;
}

ion-radio[disabled] + .radio-content,
ion-radio[disabled] + .radio-content .radio-label,
ion-radio[disabled] + .radio-content .radio-description {
  opacity: 0.5;
}
</style>
