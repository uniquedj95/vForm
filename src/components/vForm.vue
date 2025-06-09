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
          v-if="canRenderField(activeSchema[formId], data, computedData)"
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
    <IonRow v-if="!hideButtons">
      <IonCol size="12" style="display: flex" :style="{ justifyContent: buttonPlacement }">
        <IonButton @click="handleCancelAction" v-if="showCancelButton">
          {{ cancelButtonText ?? 'Cancel' }}
        </IonButton>
        <IonButton @click="handleClearAction" v-if="showClearButton">
          {{ clearButtonText ?? 'Reset' }}
        </IonButton>
        <template v-for="button of customButtons" :key="button.label">
          <IonButton @click="button.action" :color="button.color ?? 'primary'">
            {{ button.label }}
          </IonButton>
        </template>
        <IonButton @click="submitForm">
          {{ submitButtonText ?? 'Submit' }}
        </IonButton>
      </IonCol>
    </IonRow>
  </IonGrid>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/vue';
import type { FormData, ComputedData, FormSchema, CustomButton } from '../types';
import { canRenderField } from '../utils';
import { useFormValidation } from '../composables/useFormValidation';
import { useDataTransformation } from '../composables/useDataTransformation';

interface FormProps {
  schema: FormSchema;
  showLabels?: boolean;
  showClearButton?: boolean;
  showCancelButton?: boolean;
  buttonPlacement?: 'start' | 'middle' | 'end';
  submitButtonText?: string;
  clearButtonText?: string;
  cancelButtonText?: string;
  hideButtons?: boolean;
  customButtons?: Array<CustomButton>;
}

interface FormEmits {
  (e: 'submit', formData: FormData, computedFormData: ComputedData): void;
  (e: 'clear'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<FormProps>(), {
  showLabels: true,
  showClearButton: true,
  showCancelButton: true,
  hideButtons: false,
  buttonPlacement: 'start',
  submitButtonText: 'Submit',
  clearButtonText: 'Reset',
  cancelButtonText: 'Cancel',
});

const emit = defineEmits<FormEmits>();
const activeSchema = ref(props.schema);

// Use form validation composable
const { dynamicRefs, isFormValid, resetForm } = useFormValidation();

// Use data transformation composable
const { formData: data, computedData } = useDataTransformation(activeSchema);

async function submitForm() {
  if (!(await isFormValid())) return;
  emit('submit', data.value, computedData.value);
}

function handleClearAction() {
  resetForm();
  emit('clear');
}

function handleCancelAction() {
  resetForm();
  emit('cancel');
}

watch(
  data,
  async () => {
    for (const [k, f] of Object.entries(activeSchema.value)) {
      if (!canRenderField(f, data.value, computedData.value)) {
        // Reset the value of the field if it's not rendered
        f.value = props.schema[k].value;
      }
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => props.schema,
  newSchema => {
    for (const [key, field] of Object.entries(newSchema)) {
      if (field.value !== undefined) {
        activeSchema.value[key].value = field.value;
      }
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

defineExpose({
  resetForm,
  isFormValid,
  resolveData: () => ({
    formData: data.value,
    computedData: computedData.value,
  }),
});
</script>

<style>
.input-label {
  font-size: large;
  font-weight: bold;
}
</style>
