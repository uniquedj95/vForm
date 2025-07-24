import { ref, computed } from 'vue';
import type { MultiStepConfig, MultiStepFormData, FormData, ComputedData, FormStep } from '@/types';
import { isFormField } from '@/utils';

export function useMultiStepForm(config: MultiStepConfig) {
  const currentStepIndex = ref(0);
  const stepData = ref<Record<string, FormData>>({});
  const stepComputedData = ref<Record<string, ComputedData>>({});
  const stepValidationErrors = ref<Record<string, string[]>>({});

  // Helper function to get default values from step schema
  function getStepDefaults(step: FormStep): FormData {
    const defaults: FormData = {};
    // If using a custom component, return empty defaults
    if (step.component || !step.schema) {
      return defaults;
    }

    Object.entries(step.schema).forEach(([fieldId, field]) => {
      // Only process FormField items, not FormSection items
      if (isFormField(field)) {
        defaults[fieldId] = field.value;
      }
    });
    return defaults;
  } // Initialize step data with default values from schema
  config.steps.forEach(step => {
    stepData.value[step.id] = getStepDefaults(step);
    stepComputedData.value[step.id] = {};
    stepValidationErrors.value[step.id] = [];
  });

  // Filter steps based on their condition property
  const visibleSteps = computed(() => {
    return config.steps.filter(step => {
      if (!step.condition) return true;
      return step.condition(allFormData.value, allComputedData.value);
    });
  });

  const currentStep = computed(() => {
    // If we have visible steps, return the current one
    if (visibleSteps.value.length > 0) {
      // Make sure the currentStepIndex is within bounds of visible steps
      if (currentStepIndex.value >= visibleSteps.value.length) {
        return visibleSteps.value[visibleSteps.value.length - 1];
      }
      return visibleSteps.value[currentStepIndex.value];
    }
    // Fallback to the original step if no visible steps (should never happen)
    return config.steps[currentStepIndex.value];
  });

  const isFirstStep = computed(() => currentStepIndex.value === 0);
  const isLastStep = computed(() => currentStepIndex.value === visibleSteps.value.length - 1);
  const canGoNext = computed(() => !isLastStep.value);
  const canGoPrevious = computed(() => !isFirstStep.value);

  const totalSteps = computed(() => visibleSteps.value.length);
  const progressPercentage = computed(() => {
    if (totalSteps.value === 0) return 0;
    return Math.round(((currentStepIndex.value + 1) / totalSteps.value) * 100);
  });

  // Combined data from all steps
  const allFormData = computed(() => {
    const combined: FormData = {};
    Object.values(stepData.value).forEach(data => {
      Object.assign(combined, data);
    });
    return combined;
  });

  const allComputedData = computed(() => {
    const combined: ComputedData = {};
    Object.values(stepComputedData.value).forEach(data => {
      Object.assign(combined, data);
    });
    return combined;
  });

  function updateStepData(stepId: string, data: FormData) {
    stepData.value[stepId] = { ...stepData.value[stepId], ...data };
  }

  function updateStepComputedData(stepId: string, data: ComputedData) {
    stepComputedData.value[stepId] = { ...stepComputedData.value[stepId], ...data };
  }

  function clearStepData(stepId: string) {
    // Reset to initial values from step schema
    const step = config.steps.find(s => s.id === stepId);
    if (step) {
      stepData.value[stepId] = getStepDefaults(step);
      stepComputedData.value[stepId] = {};
    }
  }

  async function validateCurrentStep(): Promise<boolean> {
    const step = currentStep.value;
    if (!step) return true;

    const errors: string[] = [];

    // Run step-level validation if provided
    if (step.validation) {
      const stepErrors = await step.validation(
        stepData.value[step.id],
        stepComputedData.value[step.id]
      );
      if (stepErrors) {
        errors.push(...stepErrors);
      }
    }

    stepValidationErrors.value[step.id] = errors;
    return errors.length === 0;
  }

  async function goToStep(stepIndex: number): Promise<boolean> {
    if (stepIndex < 0 || stepIndex >= visibleSteps.value.length) {
      return false;
    }

    // If moving forward, validate current step
    if (stepIndex > currentStepIndex.value) {
      const isValid = await validateCurrentStep();
      if (!isValid) {
        return false;
      }
    }

    currentStepIndex.value = stepIndex;
    return true;
  }

  async function nextStep(): Promise<boolean> {
    if (canGoNext.value) {
      // Find the next visible step
      return goToStep(currentStepIndex.value + 1);
    }
    return false;
  }

  async function previousStep(): Promise<boolean> {
    if (canGoPrevious.value) {
      // Find the previous visible step
      return goToStep(currentStepIndex.value - 1);
    }
    return false;
  }

  function resetForm() {
    currentStepIndex.value = 0;
    stepValidationErrors.value = {};
    config.steps.forEach(step => {
      clearStepData(step.id);
      stepValidationErrors.value[step.id] = [];
    });
  }

  async function validateAllSteps(): Promise<boolean> {
    let allValid = true;

    for (const step of config.steps) {
      // Standard step validation
      if (step.validation) {
        const errors = await step.validation(
          stepData.value[step.id],
          stepComputedData.value[step.id]
        );
        stepValidationErrors.value[step.id] = errors || [];
        if (errors && errors.length > 0) {
          allValid = false;
        }
      }
    }

    return allValid;
  }

  function getMultiStepFormData(): MultiStepFormData {
    return {
      steps: { ...stepData.value },
      computedSteps: { ...stepComputedData.value },
      allFormData: allFormData.value,
      allComputedData: allComputedData.value,
    };
  }

  return {
    // State
    currentStepIndex,
    currentStep,
    stepData,
    stepComputedData,
    stepValidationErrors,

    // Computed
    visibleSteps,
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrevious,
    totalSteps,
    progressPercentage,
    allFormData,
    allComputedData,

    // Methods
    updateStepData,
    updateStepComputedData,
    clearStepData,
    validateCurrentStep,
    goToStep,
    nextStep,
    previousStep,
    resetForm,
    validateAllSteps,
    getMultiStepFormData,
  };
}
