<template>
  <div class="v-form-container">
    <!-- Multi-step form with step indicator -->
    <div v-if="isMultiStep" class="multi-step-form">
      <!-- Step Indicator -->
      <StepIndicator
        v-if="multiStepConfig && multiStepConfig.stepPosition === 'top'"
        :steps="visibleSteps"
        :active-step-index="currentStepIndex"
        :position="multiStepConfig.stepPosition || 'top'"
        :show-progress="multiStepConfig.showProgress"
        :allow-navigation="multiStepConfig.allowStepNavigation"
        @step-click="handleStepClick"
      />

      <div
        class="multi-step-content"
        :class="`multi-step-content--${multiStepConfig?.stepPosition || 'top'}`"
      >
        <!-- Left Step Indicator -->
        <StepIndicator
          v-if="multiStepConfig && multiStepConfig.stepPosition === 'left'"
          :steps="visibleSteps"
          :active-step-index="currentStepIndex"
          :position="multiStepConfig.stepPosition ?? 'top'"
          :show-progress="multiStepConfig.showProgress"
          :allow-navigation="multiStepConfig.allowStepNavigation"
          @step-click="handleStepClick"
          class="multi-step-sidebar"
        />

        <!-- Form Content -->
        <div class="multi-step-form-content">
          <!-- Custom Component if provided -->
          <component
            v-if="currentStep?.component"
            :is="currentStep.component"
            v-bind="currentStep.componentProps || {}"
            @update:data="handleCustomComponentDataUpdate"
            ref="customComponentRef"
          />
          <!-- Regular schema-based form -->
          <IonGrid v-else>
            <IonRow>
              <template v-for="formId of Object.keys(activeSchema)" :key="formId">
                <IonCol
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
                    :form-id="formId"
                    ref="dynamicRefs"
                    :ref-key="formId"
                  />
                </IonCol>
              </template>
            </IonRow>
          </IonGrid>

          <!-- Multi-step buttons -->
          <IonRow v-if="!hideButtons" class="multi-step-buttons">
            <IonCol size="12" class="button-container">
              <div class="step-nav-buttons">
                <IonButton @click="handlePreviousStep" v-if="canGoPrevious" fill="outline">
                  Previous
                </IonButton>
              </div>

              <div class="step-action-buttons">
                <IonButton @click="handleCancelAction" v-if="showCancelButton" fill="outline">
                  {{ cancelButtonText ?? 'Cancel' }}
                </IonButton>
                <IonButton @click="handleClearCurrentStep" v-if="showClearButton" fill="outline">
                  {{ clearButtonText ?? 'Reset' }}
                </IonButton>
                <template v-for="button of customButtons" :key="button.label">
                  <IonButton @click="button.action" :color="button.color ?? 'primary'">
                    {{ button.label }}
                  </IonButton>
                </template>
              </div>

              <div class="step-nav-buttons">
                <IonButton @click="handleNextStep" v-if="canGoNext"> Next </IonButton>
                <IonButton @click="submitForm" v-if="isLastStep">
                  {{ submitButtonText ?? 'Submit' }}
                </IonButton>
              </div>
            </IonCol>
          </IonRow>

          <!-- Progress for left/right positioned step indicators -->
          <div
            v-if="
              multiStepConfig &&
              (multiStepConfig.stepPosition === 'left' ||
                multiStepConfig.stepPosition === 'right') &&
              multiStepConfig.showProgress
            "
            class="step-progress-bottom"
          >
            <div class="step-progress-bar">
              <div class="step-progress-fill" :style="{ width: `${progressPercentage}%` }"></div>
            </div>
            <div class="step-progress-text">
              Step {{ currentStepIndex + 1 }} of {{ visibleSteps.length }}
            </div>
          </div>
        </div>

        <!-- Right Step Indicator -->
        <StepIndicator
          v-if="multiStepConfig && multiStepConfig.stepPosition === 'right'"
          :steps="visibleSteps"
          :active-step-index="currentStepIndex"
          :position="multiStepConfig.stepPosition"
          :show-progress="multiStepConfig.showProgress"
          :allow-navigation="multiStepConfig.allowStepNavigation"
          @step-click="handleStepClick"
          class="multi-step-sidebar"
        />
      </div>

      <!-- Bottom Step Indicator -->
      <StepIndicator
        v-if="multiStepConfig && multiStepConfig.stepPosition === 'bottom'"
        :steps="visibleSteps"
        :active-step-index="currentStepIndex"
        :position="multiStepConfig.stepPosition"
        :show-progress="multiStepConfig.showProgress"
        :allow-navigation="multiStepConfig.allowStepNavigation"
        @step-click="handleStepClick"
      />
    </div>

    <!-- Single-step form -->
    <IonGrid v-else>
      <IonRow>
        <template v-for="formId of Object.keys(activeSchema)" :key="formId">
          <IonCol
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
              :form-id="formId"
              ref="dynamicRefs"
              :ref-key="formId"
              style="width: 100%"
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
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/vue';
import type {
  FormData,
  ComputedData,
  FormSchema,
  CustomButton,
  MultiStepConfig,
  MultiStepFormData,
} from '@/types';
import { canRenderField, isFormField } from '@/utils';
import { useFormValidation } from '@/composables/useFormValidation';
import { useDataTransformation } from '@/composables/useDataTransformation';
import { useMultiStepForm } from '@/composables/useMultiStepForm';
import StepIndicator from '@/components/shared/StepIndicator.vue';

interface FormProps {
  schema?: FormSchema;
  multiStepConfig?: MultiStepConfig;
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
  (e: 'multi-step-submit', data: MultiStepFormData): void;
  (e: 'step-change', stepIndex: number, stepId: string): void;
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

// Computed properties for multi-step detection
const isMultiStep = computed(() => !!props.multiStepConfig);
const activeSchema = ref(props.schema || {});

// Multi-step form logic
const multiStepForm = props.multiStepConfig ? useMultiStepForm(props.multiStepConfig) : null;

// Single-step form logic
const { dynamicRefs, isFormValid, resetForm } = useFormValidation();
const { formData: data, computedData } = useDataTransformation(activeSchema);
// Use any type for the custom component ref since we don't know its structure
const customComponentRef = ref<any>(null);

// Multi-step computed properties
const currentStepIndex = computed(() => multiStepForm?.currentStepIndex.value ?? 0);
const currentStep = computed(() => multiStepForm?.currentStep.value);
const visibleSteps = computed(() => multiStepForm?.visibleSteps.value ?? []);
const isLastStep = computed(() => multiStepForm?.isLastStep.value ?? true);
const canGoNext = computed(() => multiStepForm?.canGoNext.value ?? false);
const canGoPrevious = computed(() => multiStepForm?.canGoPrevious.value ?? false);

// Progress percentage for left/right indicators
const progressPercentage = computed(() => {
  if (!isMultiStep.value || !multiStepForm) return 0;
  return multiStepForm.progressPercentage.value;
});

// Update active schema when step changes
watch(
  () => currentStep.value,
  newStep => {
    if (newStep && isMultiStep.value) {
      activeSchema.value = newStep.schema || {};
    }
  },
  { immediate: true }
);

// Update multi-step data when form data changes
watch(
  [data, computedData],
  ([newData, newComputedData]) => {
    if (isMultiStep.value && multiStepForm && currentStep.value) {
      multiStepForm.updateStepData(currentStep.value.id, newData);
      multiStepForm.updateStepComputedData(currentStep.value.id, newComputedData);
    }
  },
  { deep: true }
);

// Initialize single-step form if no multi-step config
watch(
  () => props.schema,
  newSchema => {
    if (!isMultiStep.value && newSchema) {
      activeSchema.value = newSchema;
      for (const [key, field] of Object.entries(newSchema)) {
        // Only process FormField items, not FormSection items
        if (isFormField(field) && 'value' in field && field.value !== undefined) {
          (activeSchema.value[key] as any).value = field.value;
        }
      }
    }
  },
  { deep: true, immediate: true }
);

async function submitForm() {
  if (isMultiStep.value && multiStepForm) {
    // Multi-step form submission

    // Handle validation for the current step if it has a custom component
    if (currentStep.value?.component && customComponentRef.value) {
      if (typeof customComponentRef.value.validate === 'function') {
        const isValid = await customComponentRef.value.validate();
        if (!isValid) return;
      }
    }

    // Validate all steps
    const isValid = await multiStepForm.validateAllSteps();
    if (!isValid) return;

    const multiStepData = multiStepForm.getMultiStepFormData();
    emit('multi-step-submit', multiStepData);
  } else {
    // Single-step form submission
    if (!(await isFormValid())) return;
    emit('submit', data.value, computedData.value);
  }
}

function handleClearAction() {
  if (isMultiStep.value && multiStepForm) {
    multiStepForm.resetForm();
  } else {
    resetForm();
  }
  emit('clear');
}

function handleClearCurrentStep() {
  if (isMultiStep.value && multiStepForm && currentStep.value) {
    multiStepForm.clearStepData(currentStep.value.id);
  }
}

function handleCancelAction() {
  if (isMultiStep.value && multiStepForm) {
    multiStepForm.resetForm();
  } else {
    resetForm();
  }
  emit('cancel');
}

async function handleNextStep() {
  if (isMultiStep.value && multiStepForm) {
    // First validate the current step's form inputs
    let isCurrentStepValid = true;

    if (currentStep.value?.component && customComponentRef.value) {
      // If custom component has a validate method, use it
      if (typeof customComponentRef.value.validate === 'function') {
        isCurrentStepValid = await customComponentRef.value.validate();
      }
    } else {
      // Otherwise use regular form validation
      isCurrentStepValid = await isFormValid();
    }

    if (!isCurrentStepValid) {
      // Show validation errors - they're already displayed by the form inputs
      return;
    }

    const success = await multiStepForm.nextStep();
    if (success && currentStep.value) {
      emit('step-change', currentStepIndex.value, currentStep.value.id);
    }
  }
}

async function handlePreviousStep() {
  if (multiStepForm) {
    const success = await multiStepForm.previousStep();
    if (success && currentStep.value) {
      emit('step-change', currentStepIndex.value, currentStep.value.id);
    }
  }
}

async function handleStepClick(stepIndex: number) {
  if (multiStepForm) {
    // If moving forward, validate current step first
    if (stepIndex > currentStepIndex.value) {
      let isCurrentStepValid = true;

      if (currentStep.value?.component && customComponentRef.value) {
        // If custom component has a validate method, use it
        if (typeof customComponentRef.value.validate === 'function') {
          isCurrentStepValid = await customComponentRef.value.validate();
        }
      } else {
        // Otherwise use regular form validation
        isCurrentStepValid = await isFormValid();
      }

      if (!isCurrentStepValid) {
        // Show validation errors - they're already displayed by the form inputs
        return;
      }
    }

    const success = await multiStepForm.goToStep(stepIndex);
    if (success && currentStep.value) {
      emit('step-change', stepIndex, currentStep.value.id);
    }
  }
}

// Field visibility logic
watch(
  data,
  async () => {
    for (const [k, f] of Object.entries(activeSchema.value)) {
      if (!canRenderField(f as any, data.value, computedData.value)) {
        // Reset the value of the field if it's not rendered
        const originalSchema =
          isMultiStep.value && currentStep.value && currentStep.value.schema
            ? currentStep.value.schema[k]
            : props.schema?.[k];
        if (originalSchema && isFormField(originalSchema) && 'value' in originalSchema) {
          (f as any).value = originalSchema.value;
        }
      }
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

// Handle data updates from custom components
function handleCustomComponentDataUpdate(data: any) {
  if (isMultiStep.value && multiStepForm && currentStep.value) {
    multiStepForm.updateStepData(currentStep.value.id, data);
  }
}

defineExpose({
  resetForm: handleClearAction,
  isFormValid,
  resolveData: () => {
    if (isMultiStep.value && multiStepForm) {
      return multiStepForm.getMultiStepFormData();
    }
    return {
      formData: data.value,
      computedData: computedData.value,
    };
  },
  // Multi-step specific methods
  nextStep: handleNextStep,
  previousStep: handlePreviousStep,
  goToStep: handleStepClick,
  getCurrentStep: () => currentStep.value,
  getCurrentStepIndex: () => currentStepIndex.value,
});
</script>

<style scoped>
.input-label {
  font-size: large;
  font-weight: bold;
}

/* Multi-step form styles */
.v-form-container {
  width: 100%;
}

.multi-step-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.multi-step-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  width: 100%;
}

.multi-step-content--top,
.multi-step-content--bottom {
  flex-direction: column;
}

.multi-step-content--left {
  flex-direction: row;
}

.multi-step-content--right {
  flex-direction: row;
}

.multi-step-sidebar {
  flex-shrink: 0;
  min-width: 250px;
}

.multi-step-form-content {
  flex: 1;
  min-width: 0;
}

.multi-step-buttons {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--ion-color-light);
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.step-nav-buttons {
  min-width: 120px;
  display: flex;
  justify-content: flex-start;
}

.step-nav-buttons:last-child {
  justify-content: flex-end;
}

.step-action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex: 1;
}

.step-progress-bottom {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--ion-color-light);
}

.step-progress-bar {
  height: 4px;
  background: var(--ion-color-light);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.step-progress-fill {
  height: 100%;
  background: var(--ion-color-primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.step-progress-text {
  font-size: 0.75rem;
  color: var(--ion-color-medium);
  text-align: center;
}

/* Responsive design */
@media (max-width: 768px) {
  .multi-step-content--left,
  .multi-step-content--right {
    flex-direction: column;
  }

  .multi-step-sidebar {
    min-width: unset;
    width: 100%;
  }

  .multi-step-buttons .button-container {
    flex-direction: column;
    gap: 1rem;
  }

  .step-nav-buttons,
  .step-action-buttons {
    min-width: unset;
    width: 100%;
    justify-content: center;
  }

  .step-nav-buttons:last-child {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .multi-step-form {
    gap: 1rem;
  }

  .multi-step-content {
    gap: 1rem;
  }

  .multi-step-buttons {
    margin-top: 1rem;
  }
}
</style>
