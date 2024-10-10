<template>
  <IonGrid>
    <IonRow>
      <template v-for="formId of Object.keys(activeSchema)">
        <IonCol 
          :key="formId" 
          :size="activeSchema[formId].grid?.xs ?? '12'" 
          :size-sm="activeSchema[formId].grid?.sm"
          :size-md="activeSchema[formId].grid?.md"
          :size-lg="activeSchema[formId].grid?.lg"
          :size-xl="activeSchema[formId].grid?.xl"
          class="ion-margin-vertical"
          v-if="canRenderField(activeSchema[formId])"
        >
          <component 
            :is="activeSchema[formId].type" 
            v-model="activeSchema[formId]" 
            :schema="activeSchema"
            ref="dynamicRefs"
            :ref-key="formId"
          />
        </IonCol>
      </template>
    </IonRow>
    <IonRow>
      <IonCol size="12" style="display: flex;" :style="{ justifyContent: buttonPlacement }">
        <IonButton @click="handleCancelAction" v-if="showCancelButton" >
          {{ cancelButtonText ?? "Cancel" }}
        </IonButton>
        <IonButton @click="handleClearAction" v-if="showClearButton" >
          {{ clearButtonText ?? "Reset" }}
        </IonButton>
        <template v-for="button of customButtons">
          <IonButton @click="button.action">
            {{ button.label }}
          </IonButton>
        </template>
        <IonButton @click="submitForm" >
          {{ submitButtonText ?? "Submit" }}
        </IonButton>
      </IonCol>
    </IonRow>
  </IonGrid>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { IonGrid, IonRow, IonCol, IonButton } from "@ionic/vue";
import type { FormData, ComputedData, FormSchema, FormField, CustomButton } from "../types";
import { isEmpty } from "../utils";

interface FormProps {
  schema: FormSchema;
  showLabels?: boolean;
  showClearButton?: boolean;
  showCancelButton?: boolean;
  buttonPlacement?: 'start' | 'middle' | 'end';
  submitButtonText?: string;
  clearButtonText?: string;
  cancelButtonText?: string;
  customButtons?: Array<CustomButton>;
}

interface FormEmits {
  (e: "submit", formData: FormData, computedFormData: ComputedData): void;
  (e: "clear"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<FormProps>(), {
  showLabels: true,
  showClearButton: true,
  showCancelButton: true,
  buttonPlacement: "start",
  submitButtonText: "Submit",
  clearButtonText: "Reset",
  cancelButtonText: "Cancel",
})
const emit = defineEmits<FormEmits>();
const dynamicRefs = ref<Array<any>>([]);
const activeSchema = ref({...props.schema});

const data = computed(() => Object.entries(activeSchema.value).reduce((acc, [key, form]) => {
  return { ...acc, [key]: (form as FormField).value };
}, {}) as FormData);

const computedData = computed(() => {
  return Object.entries(data.value).reduce((acc, [key, value]) => {
    if(typeof activeSchema.value[key].computedValue === "function" && value !== undefined) {
      acc[key] = activeSchema.value[key].computedValue(value, activeSchema.value);
    }
    return acc;
  }, {} as ComputedData);
});

async function isFormValid() {
  const errors: Array<string> = [];
  for (const inputRef of dynamicRefs.value) {
    if (typeof inputRef?.onValueUpdate === 'function') await inputRef.onValueUpdate();
    if (typeof inputRef?.getErrors === 'function') errors.push(inputRef.getErrors());
  }
  return errors.every(isEmpty);
}

async function submitForm() {
  if(!await isFormValid()) return
  emit("submit", data.value, computedData.value);
}

function resetForm() {
  dynamicRefs.value.forEach((inputRef: any) => {
    if (typeof inputRef?.onReset === 'function') inputRef.onReset();
  });
}

function handleClearAction() {
  console.log("Clearing form", activeSchema.value);
  resetForm();
  emit("clear");
  console.log("Cleared form", activeSchema.value);
}

function handleCancelAction() {
  resetForm();
  emit("cancel");
}

function canRenderField(field: FormField) {
  if (typeof field.condition === "function") {
    return field.condition(data.value, computedData.value);
  }
  return true;
}

watch(data, async () => {
  for (const [k, f] of Object.entries(activeSchema.value)) {
    if (!canRenderField(f)) {
      // Reset the value of the field if it's not rendered
      f.value = props.schema[k].value;
    }
  }
}, 
{ 
  deep: true, 
  immediate: true 
});
</script>
