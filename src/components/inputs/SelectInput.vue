<template>
  <div>
    <ion-select
      v-model="input"
      ref="inputRef"
      interface="popover"
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
      @ion-change="onValueUpdate"
      @ion-blur="onValueUpdate"
    >
      <ion-label slot="label" v-if="model.label">
        {{ model.label }} 
        <ion-text color="danger" v-if="model.required">*</ion-text>
      </ion-label>
      <ion-select-option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </ion-select-option>
    </ion-select>
    <ion-note v-if="model.error" color="danger" class="ion-padding-start">
      {{ model.error }}
    </ion-note>
  </div>
</template>

<script setup lang="ts">
import { IonSelect, IonSelectOption, IonNote, IonLabel, IonText } from "@ionic/vue";
import { FormField, FormSchema, Option } from "types";
import { getModelValue, isEmpty, mapValueToOption } from "../../utils";
import { PropType, ref, watch } from "vue";

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<typeof IonSelect | null>(null);
const input = ref(getModelValue(model.value));
const options = ref<Array<Option>>([]);

watch(() => model.value.value, () => input.value = getModelValue(model.value));
  
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
  if (model.value.required && isEmpty(input.value)) {
    model.value.error = "This field is required";
    return false;
  }
  if (typeof model.value.validation === "function") {
    const errors = await model.value.validation(input.value as string, props?.schema);
    if (errors && errors.length) {
      model.value.error = errors.toString();
      return false;
    }
  }
  return true;
}

async function onValueUpdate() {
  inputRef.value?.$el.classList.remove("ion-valid", "ion-invalid");

  if (await isValid()) {
    model.value.error = "";
    model.value.value = mapValueToOption(input.value, options.value, model.value.multiple);
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

function onReset() {
  input.value = model.value.multiple ? [] : "";
  model.value.error = "";
  model.value.value = "";
}

defineExpose({
  onValueUpdate, 
  onReset,
  getErrors: () => model.value.error 
});
</script>
