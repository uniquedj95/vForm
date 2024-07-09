<template>
  <IonGrid>
    <IonRow>
      <IonCol 
        v-for="formId of Object.keys(schema)" 
        :key="formId" 
        :size="schema[formId].grid?.xs ?? '12'" 
        :size-sm="schema[formId].grid?.sm"
        :size-md="schema[formId].grid?.md"
        :size-lg="schema[formId].grid?.lg"
        :size-xl="schema[formId].grid?.xl"
        class="ion-margin-vertical"
      >
        <component 
          :is="schema[formId].type" 
          v-model="schema[formId]" 
          :schema="schema"
        />
      </IonCol>
    </IonRow>
    <IonRow>
      <IonCol size="12" style="display: flex;" :style="{ justifyContent: buttonPlacement }">
        <IonButton @click="submitForm" >
          {{ submitButtonText ?? "Submit" }}
        </IonButton>
        <IonButton @click="handleClearAction" v-if="showClearButton" >
          {{ clearButtonText ?? "Reset" }}
        </IonButton>
        <IonButton @click="handleCancelAction" v-if="showCancelButton" >
          {{ cancelButtonText ?? "Cancel" }}
        </IonButton>
      </IonCol>
    </IonRow>
  </IonGrid>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { IonGrid, IonRow, IonCol, IonButton } from "@ionic/vue";
import type { FormData, ComputedData, FormSchema, FormField } from "../types";
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
const origialSchema = { ...props.schema };

const data = computed(() => Object.entries(props.schema).reduce((acc, [key, form]) => {
  return { ...acc, [key]: (form as FormField).value };
}, {}) as FormData);

const computedData = computed(() => {
  return Object.entries(data.value).reduce((acc, [key, value]) => {
    if(typeof props.schema[key].computedValue === "function" && value !== undefined) {
      acc[key] = props.schema[key].computedValue(value, props.schema);
    }
    return acc;
  }, {} as ComputedData);
});

async function isFormValid() {
  const errors: Array<string> = [];
  for (const key in props.schema) { 
    const { required, value, validation } = props.schema[key];
    if (required && isEmpty(value)) {
      props.schema[key].error = "This field is required";
      errors.push("This field is required");
    } else if(typeof validation === 'function') {
      const errs = await validation(value!, props.schema);
      if(isEmpty(errs)) props.schema[key].error = "";
      else {
        props.schema[key].error = (errs as Array<string>).join();
        errors.push(...errs as Array<string>);
      }
    } else {
      props.schema[key].error = '';
    }
  }
  return errors.every(Boolean);
}

async function submitForm() {
  if(!await isFormValid()) return
  emit("submit", data.value, computedData.value);
}

function handleClearAction() {
  Object.keys(props.schema).forEach(key => {
    props.schema[key].value = origialSchema[key].value;
    props.schema[key].error = "";
  });
  emit("clear");
}

function handleCancelAction() {
  Object.keys(props.schema).forEach(key => {
    props.schema[key].value = origialSchema[key].value;
    props.schema[key].error = "";
  });
  emit("cancel");
}

</script>
