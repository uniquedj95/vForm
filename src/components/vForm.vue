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
          />
        </IonCol>
      </template>
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
import { computed, ref, watch } from "vue";
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
  for (const key in activeSchema.value) { 
    const { required, value, validation } = activeSchema.value[key];
    if (required && isEmpty(value)) {
      activeSchema.value[key].error = "This field is required";
      errors.push("This field is required");
    } else if(typeof validation === 'function') {
      const errs = await validation(value!, activeSchema.value);
      if(isEmpty(errs)) activeSchema.value[key].error = "";
      else {
        activeSchema.value[key].error = (errs as Array<string>).join();
        errors.push(...errs as Array<string>);
      }
    } else {
      activeSchema.value[key].error = '';
    }
  }
  return errors.every(Boolean);
}

async function submitForm() {
  if(!await isFormValid()) return
  emit("submit", data.value, computedData.value);
}

function handleClearAction() {
  Object.keys(activeSchema.value).forEach(key => {
    activeSchema.value[key].value = props.schema[key].value;
    activeSchema.value[key].error = "";
  });
  emit("clear");
}

function handleCancelAction() {
  Object.keys(activeSchema.value).forEach(key => {
    activeSchema.value[key].value = props.schema[key].value;
    activeSchema.value[key].error = "";
  });
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
