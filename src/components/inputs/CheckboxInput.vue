<template>
  <ion-checkbox
    v-model="input"
    ref="inputRef"
    :required="model.required"
    :error-text="model.error"
    :disabled="model.disabled"
    @ionFocus="onFocus"
    @ionChange="onValueUpdate"
    @ion-blur="onValueUpdate"
  >
    {{ model.label }} 
    <ion-text color="danger" v-if="model.required">*</ion-text>
  </ion-checkbox>
</template>

<script lang="ts" setup>
import { IonCheckbox, IonText } from "@ionic/vue";
import { FormField, FormSchema } from "types";
import { ComponentPublicInstance, PropType, ref, watch } from "vue";

const props = defineProps<{ schema?: FormSchema; }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const input = ref(model.value.value as boolean);

watch(() => model.value.value, v => input.value = v as boolean);

function onReset() {
  input.value = false;
  model.value.error = "";
  model.value.value = false;
}

async function isValid() {
  if (model.value.required && !input.value) {
    model.value.error = "This field is required";
    return false;
  }
  if (model.value.validation) {
    const errors = await model.value.validation(input.value, props?.schema);
    if (errors && errors.length) {
      model.value.error = errors.join();
      return false;
    }
  }
  return true;
}

async function onValueUpdate() {
  inputRef.value?.$el.classList.remove("ion-invalid");
  inputRef.value?.$el.classList.remove("ion-valid");

  if (await isValid()) {
    model.value.error = "";
    model.value.value = input.value;
    inputRef.value?.$el.classList.add("ion-valid");
  } else {
    inputRef.value?.$el.classList.add("ion-invalid");
  }

  inputRef.value?.$el.classList.add("ion-touched");
}

function onFocus() {
  inputRef.value?.$el.classList.remove("ion-touched");
  inputRef.value?.$el.classList.remove("ion-invalid");
  model.value.error = "";
}

defineExpose({
  onValueUpdate,
  onReset,
  getErrors: () => model.value.error,
});
</script>