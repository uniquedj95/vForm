<template>
  <div class="autocomplete-container">
    <ion-input
      ref="inputRef"
      v-model="filter"
      :clear-input="true"
      :fill="model.fill ?? 'outline'"
      :label-placement="model.labelPlacement ?? 'stacked'"
      :type="type ?? 'text'"
      :required="model.required"
      :error-text="model.error"
      :auto-focus="model.autoFocus"
      :placeholder="placeholder"
      :disabled="model.disabled"
      :counter="model.counter"
      @ion-blur="onValueUpdate"
      @ion-focus="onFocus"
      :debounce="300"
    >
      <ion-label slot="label" v-if="model.label">
        {{ model.label }}
        <ion-text color="danger" v-if="model.required">*</ion-text>
      </ion-label>
      <ion-chip v-for="(tag, index) of tags" :key="index" slot="start">
        <ion-label>{{ tag.label }}</ion-label>
        <ion-icon
          :icon="closeCircle"
          color="danger"
          @click="diselect(tag)"
          style="z-index: 20"
        ></ion-icon>
      </ion-chip>
      <ion-icon slot="end" :icon="chevronDown" />
    </ion-input>

    <ion-list v-if="showOptions && options.length > 0" class="suggestions-list">
      <ion-item
        v-for="option in options"
        button
        :key="option.label"
        @click="onSelect(option)"
      >
        <ion-checkbox
          slot="start"
          :checked="option.isChecked"
          v-if="model.multiple"
        />
        <ion-label>{{ option.label }}</ion-label>
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch } from "vue";
import { chevronDown, closeCircle } from "ionicons/icons";
import { FormSchema, BaseFieldTypes, FormField, Option } from "types";
import { isEmpty, checkOption, getFilteredOptions, findOption, uncheckOption } from "../../utils";
import {
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonText,
  IonIcon,
  IonCheckbox,
} from "@ionic/vue";

const props = defineProps<{ schema?: FormSchema; type?: BaseFieldTypes }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<typeof IonInput | null>(null);
const showOptions = ref(false);
const options = ref<Option[]>([]);
const filter = ref("");

const tags = computed<Option[]>(() =>
  options.value.filter(({ isChecked }) => isChecked)
);

const placeholder = computed(() => {
  return !filter.value && isEmpty(tags.value) && !showOptions.value
    ? model.value.placeholder ?? "Select an option"
    : "";
});

watch(() => model.value.options, filterOptions, { immediate: true, deep: true });
watch(() => model.value.value, initialize, { immediate: true, deep: true });

function onReset() {
  options.value.forEach(diselect);
  model.value.error = "";
  model.value.value = model.value.multiple ? [] : "";
}

function diselect(tag: Option) {
  const option = options.value.findIndex((o) => o.value === tag.value);
  if (option) options.value[option].isChecked = false;
}

function onSelect(item: Option) {
  if (item.isChecked) uncheckOption(item, options.value);
  else {
    checkOption(item, options.value);
    if (!model.value.multiple) onValueUpdate();
  }
}

function onFocus() {
  inputRef.value?.$el.classList.remove("ion-touched");
  inputRef.value?.$el.classList.remove("ion-invalid");
  model.value.error = "";
  showOptions.value = true;
}

async function isValid() {
  if (model.value.required && isEmpty(tags.value)) {
    model.value.error = "This field is required";
    return false;
  }
  if (model.value.validation) {
    const errors = await model.value.validation(tags.value, props?.schema);
    if (errors && errors.length) {
      model.value.error = errors.join();
      return false;
    }
  }
  return true;
}

async function onValueUpdate() {
  showOptions.value = false;
  inputRef.value?.$el.classList.remove("ion-invalid");
  inputRef.value?.$el.classList.remove("ion-valid");

  if (await isValid()) {
    model.value.error = "";
    model.value.value = model.value.multiple ? tags.value : tags.value[0];
    inputRef.value?.$el.classList.add("ion-valid");
  } else {
    inputRef.value?.$el.classList.add("ion-invalid");
  }

  inputRef.value?.$el.classList.add("ion-touched");
}

async function filterOptions() {
  const filtered =
    typeof model.value.options === "function"
      ? await model.value.options(filter.value)
      : getFilteredOptions(model.value.options ?? [], filter.value);

  tags.value.forEach((tag) => checkOption(tag, filtered));
  options.value = filtered.filter((o) => !!o.label);
}

function initialize() {
  onReset();
  const defaultValue = model.value.value;
  if (defaultValue) {
    if (Array.isArray(defaultValue)) {
      defaultValue.forEach((opt) => checkOption(opt, options.value));
    } else if (typeof defaultValue === "object") {
      checkOption(defaultValue, options.value);
    } else {
      checkOption(
        {
          value: defaultValue as any,
          label: defaultValue as string,
        },
        options.value
      );
    }
  }
}

defineExpose({
  onValueUpdate,
  onReset,
  getErrors: () => model.value.error,
});
</script>

<style scoped>
.autocomplete-container {
  position: relative;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  z-index: 99000;
  max-height: 65vh;
  overflow-y: auto;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
