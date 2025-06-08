<template>
  <ion-textarea
    ref="inputRef"
    v-model="input"
    :clear-input="true"
    :fill="model.fill ?? 'outline'"
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
    <ion-label slot="label" v-if="model.label">
      {{ model.label }}
      <ion-text color="danger" v-if="model.required">*</ion-text>
    </ion-label>
  </ion-textarea>
</template>

<script lang="ts" setup>
import { IonTextarea, IonLabel, IonText } from '@ionic/vue';
import { FormField, FormSchema } from 'types';
import { ComponentPublicInstance, PropType, ref, watch } from 'vue';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const input = ref(model.value.value as string);

watch(
  () => model.value.value,
  v => (input.value = v as string)
);

function onFocus() {
  inputRef.value?.$el.classList.remove('ion-touched');
  inputRef.value?.$el.classList.remove('ion-invalid');
  model.value.error = '';
}

function onReset() {
  input.value = '';
  model.value.error = '';
  model.value.value = '';
}

async function isValid() {
  if (model.value.required && !input.value) {
    model.value.error = 'This field is required';
    return false;
  }

  if (typeof model.value.validation === 'function') {
    const errors = await model.value.validation(input.value, props.schema);
    if (errors && errors.length) {
      model.value.error = errors.join();
      return false;
    }
  }
  return true;
}

async function onValueUpdate() {
  inputRef.value?.$el.classList.remove('ion-invalid');
  inputRef.value?.$el.classList.remove('ion-valid');

  if (await isValid()) {
    model.value.error = '';
    model.value.value = input.value;
    inputRef.value?.$el.classList.add('ion-valid');
  } else {
    inputRef.value?.$el.classList.add('ion-invalid');
  }

  inputRef.value?.$el.classList.add('ion-touched');
}

defineExpose({
  onReset,
  onValueUpdate,
  getErrors: () => model.value.error,
});
</script>
