<template>
  <ion-input
    ref="inputRef"
    v-model="input"
    :clear-input="true"
    :fill="model.fill ?? 'outline'"
    :label-placement="model.labelPlacement ?? 'stacked'"
    :label="model.label"
    :required="model.required"
    :error-text="model.error"
    :auto-focus="model.autoFocus"
    :placeholder="model.placeholder"
    :disabled="model.disabled"
    :counter="model.counter"
    :max-length="model.maxLength"
    :min-length="model.minLength"
    @ionFocus="model.error = ''"
    @ionBlur="validate"
    @ionInput="validate"
  >
    <ion-label v-if="model.prefix" slot="start">{{ model.prefix }}</ion-label>
    <ion-label v-if="model.suffix" slot="end">{{ model.suffix }} </ion-label>
  </ion-input>
</template>

<script lang="ts" setup>
import { IonInput, IonLabel } from "@ionic/vue";
import { FormField, FormSchema } from "types";
import { PropType, ref } from "vue";

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {}});
const inputRef = ref<typeof IonInput | null>(null);
const input = ref(model.value.value as string);

async function validate() {
  inputRef.value?.$el.classList.remove("ion-invalid");
  inputRef.value?.$el.classList.remove("ion-valid");
  if ((!model.value.allowUnknown && input.value === "Unknown") || input.value === "N/A") {
    model.value.error = "Unknown is not allowed";
    inputRef.value?.$el.classList.add("ion-invalid");
    return; 
  }
  if (model.value.validation) {
    const errors = await model.value.validation(input.value, props?.schema);
    if (errors && errors.length) {
      model.value.error = errors.toString();
      inputRef.value?.$el.classList.add("ion-invalid");
      return
    }
  }
  model.value.error = "";
  model.value.value = input.value;
  inputRef.value?.$el.classList.add("ion-valid");
};
</script>