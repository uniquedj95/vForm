<template>
  <ion-select
    v-model="selectedOption"
    ref="inputRef"
    interface="popover"
    :label="model.label"
    :placeholder="model.placeholder"
    :multiple="model.multiple"
    :disabled="model.disabled"
    :required="model.required"
    :error-text="model.error"
    :auto-focus="model.autoFocus"
    :clear-input="true"
    :fill="model.fill ?? 'outline'"
    :label-placement="model.labelPlacement ?? 'stacked'"
    @ion-focus="onFocus"
    @ion-blur="onValueUpdate"
  >
    <ion-select-option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </ion-select-option>
  </ion-select>
</template>

<script setup lang="ts">
import { IonSelect, IonSelectOption } from "@ionic/vue";
import { FormField, FormSchema, Option } from "types";
import { getModelValue, mapValueToOption } from "../../utils";
import { PropType, ref, watch } from "vue";

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<typeof IonSelect | null>(null);
const selectedOption = ref(getModelValue(model.value));
const options = ref<Array<Option>>([]);
  
watch(() => model.value.options, async () => {
  if(typeof model.value.options === "function") {
    options.value = await model.value.options();
  } else {
    options.value = model.value.options ?? [];
  }
}, 
{
  immediate: true, 
  deep: true
});

async function isValid() {
  if (model.value.required && !selectedOption.value) {
    model.value.error = "This field is required";
    return false;
  }
  if (!model.value.allowUnknown && /Unknown|N\/A/i.test(selectedOption.value as string)) {
    model.value.error = "Unknown or N/A values are not allowed";
    return false;
  }
  if (typeof model.value.validation === "function") {
    const errors = await model.value.validation(selectedOption.value as string, props?.schema);
    if (errors && errors.length) {
      model.value.error = errors.toString();
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
    model.value.value = mapValueToOption(selectedOption.value, options.value, model.value.multiple);
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
</script>
