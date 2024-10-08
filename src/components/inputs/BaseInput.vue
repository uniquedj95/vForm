<template>
    <ion-input
      ref="inputRef"
      v-model="input"
      :clear-input="true"
      :fill="model.fill ?? 'outline'"
      :label-placement="model.labelPlacement ?? 'stacked'"
      :label="model.label"
      :type="type ?? 'text'"
      :required="model.required"
      :error-text="model.error"
      :auto-focus="model.autoFocus"
      :placeholder="model.placeholder"
      :disabled="model.disabled"
      :counter="model.counter"
      :min="model.min"
      :max="model.max"
      :max-length="model.maxLength"
      :min-length="model.minLength"
      :pattern="model.pattern"
      @ionFocus="onFocus"
      @ionChange="onValueUpdate"
      @ion-blur="onValueUpdate"
    >
      <ion-label v-if="model.prefix" slot="start">{{ model.prefix }}</ion-label>
      <ion-label v-if="model.suffix" slot="end">{{ model.suffix }} </ion-label>
      <ion-input-password-toggle slot="end" v-if="type === 'password'" />
    </ion-input>
  </template>
  
  <script lang="ts" setup>
  import { IonInput, IonLabel,IonInputPasswordToggle } from "@ionic/vue";
  import { FormField, FormSchema, BaseFieldTypes } from "types";
  import { PropType, ref } from "vue";

  const props = defineProps<{ schema?: FormSchema; type?: BaseFieldTypes }>();
  const model = defineModel({ type: Object as PropType<FormField>, default: {}});
  const inputRef = ref<typeof IonInput | null>(null);
  const input = ref(model.value.value as string);
  
  async function isValid() {
    if(model.value.required && !input.value) {
      model.value.error = "This field is required";
      return false;
    }
    if (model.value.validation) {
      const errors = await model.value.validation(input.value, props?.schema);
      if (errors && errors.length) {
        model.value.error = errors.toString();
        return false
      }
    }
    return true;
};

async function onValueUpdate() {
    inputRef.value?.$el.classList.remove("ion-invalid");
    inputRef.value?.$el.classList.remove("ion-valid");
    
    if(await isValid()) {
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
  getErrors: () => model.value.error 
});
</script>