<template>
  <ion-input
    type="text"
    ref="inputRef"
    :clear-input="true"
    :fill="model.fill ?? 'outline'"
    :label-placement="model.labelPlacement ?? 'stacked'"
    :label="model.label"
    :required="model.required"
    :error-text="model.error"
    :auto-focus="model.autoFocus"
    :disabled="model.disabled"
    @ion-focus="onFocus"
    @ion-blur="onValueUpdate"
  >
    <template v-for="part, index in patternParts">
      <ion-select
        slot="start"
        interface="popover"
        style="min-width: 30%"
        :placeholder="part"
        :value="partValues[part]"
        @ion-focus="onFocus"
        @ion-input="buildInputDate(part, undefined, $event)"
        @ion-blur="buildInputDate(part, undefined, $event)"
        v-if="/MM|MMM|MMMM/.test(part)"
      >
        <ion-select-option v-for="month, i in monthNames" :key="month" :value="getMonth(i + 1, part)">
          {{ getMonth(i + 1, part) }}
        </ion-select-option>
      </ion-select>
      <ion-input
        v-else
        slot="start"
        :placeholder="part"
        :auto-focus="model.autoFocus"
        :value="partValues[part]"
        @ion-focus="onFocus"
        @ion-input="buildInputDate(part, undefined, $event)"
        @ion-blur="buildInputDate(part, undefined, $event)"
      />
      <ion-label slot="start" v-if="index < (patternParts.length - 1)">
        &nbsp;{{ separators[index] }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </ion-label>
    </template>
    <ion-label slot="end">
      <vue-date-picker
        auto-apply
        :model-value="pickerDate"
        :enable-time-picker="false"
        teleport
        :maxDate="maxDate"
        :minDate="minDate"
        @date-update="buildPickerDate"
      >
        <template #trigger>
          <ion-button fill="clear">
            <ion-icon slot="icon-only" :icon="calendar" aria-hidden="true" ></ion-icon>
          </ion-button>
        </template>
      </vue-date-picker>
    </ion-label>
  </ion-input>
</template>

<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { IonInput, IonLabel, IonIcon, IonSelect, IonSelectOption, IonButton } from "@ionic/vue";
import { calendar } from "ionicons/icons";
import type { FormField, FormSchema } from "../../types";
import { computed, onMounted, PropType, ref } from "vue";
import { formatDate, getMonth, zeroPad, monthNames } from "../../utils";

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<typeof IonInput | null>(null);
const maxDate = ref(model.value.max as string | undefined); 
const minDate = ref(model.value.max as string | undefined); 
const pickerDate = ref<string>(model.value.value as string);
const pattern = (model.value.pattern ?? "DD/MMM/YYYY").toUpperCase();
const separatorRegex = /[-/.,:\s]+/;
const patternParts = computed(() => pattern.split(separatorRegex));
const separators = computed(() => pattern.match(/[-/.,:\s]+/g) || []);
const partValues = ref({} as Record<string, any>); 

async function isValid() {
  if(/undefined/i.test(pickerDate.value)) {
    if(model.value.required) {
      model.value.error = "This field is required";
      return false;
    }
    return true;
  }

  const _date = new Date(pickerDate.value);
  if (isNaN(_date.getTime())) {
    model.value.error = 'Invalid date string';
    return false;
  }

  if (minDate.value && _date < new Date(minDate.value)) {
    model.value.error = `Date must be greater than ${minDate.value}`;
    return false;
  }

  if (maxDate.value && _date > new Date(maxDate.value)) {
    model.value.error = `Date must be less than ${maxDate.value}`;
    return false;
  }

  if (model.value.validation) {
    const errors = await model.value.validation(pickerDate.value, props?.schema);
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
  monthNames
  if (await isValid()) {
    model.value.error = "";
    model.value.value = pickerDate.value;
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

async function buildInputDate(part: string, defaultValue?: string, e?: Event) {
  let value = defaultValue ?? (e?.target as HTMLInputElement).value;
  if(/MM|MMM|MMMM/.test(part)) value = getMonth(value, part);
  if(Number.isInteger(parseInt(value))) value = zeroPad(parseInt(value));
  partValues.value[part] = value;
  const formattedDate = patternParts.value.reduce((date, part, index) => {
    date += partValues.value[part] + (index < patternParts.value.length - 1 ? separators.value[index] : '');
    return date
  }, '');
  pickerDate.value = formattedDate;
  await onValueUpdate();
}

async function buildPickerDate(date: string) {
  onFocus();
  const parts = formatDate(date, pattern).split(separatorRegex);
  patternParts.value.forEach((part, index) => buildInputDate(part, parts[index]));
  await onValueUpdate();
}

function onReset() {
  pickerDate.value = '';
  model.value.error = '';
  model.value.value = '';
}

defineExpose({
  onValueUpdate,
  onReset,
  getErrors: () => model.value.error
})

onMounted(() => {
  patternParts.value.forEach((part, index) => {
    partValues.value[part] = pickerDate.value.split(separatorRegex)[index] ?? '';
  });
});
</script>
