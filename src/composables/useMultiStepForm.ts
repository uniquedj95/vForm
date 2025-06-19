import { ref, computed } from 'vue';
import type { MultiStepConfig, MultiStepFormData, FormData, ComputedData } from '@/types';

export function useMultiStepForm(config: MultiStepConfig) {
  const currentStepIndex = ref(0);
  const stepData = ref<Record<string, FormData>>({});
  const stepComputedData = ref<Record<string, ComputedData>>({});
  const stepValidationErrors = ref<Record<string, string[]>>({});

  // Initialize step data
  config.steps.forEach(step => {
    stepData.value[step.id] = {};
    stepComputedData.value[step.id] = {};
    stepValidationErrors.value[step.id] = [];
  });

  const currentStep = computed(() => config.steps[currentStepIndex.value]);
  const isFirstStep = computed(() => currentStepIndex.value === 0);
  const isLastStep = computed(() => currentStepIndex.value === config.steps.length - 1);
  const canGoNext = computed(() => !isLastStep.value);
  const canGoPrevious = computed(() => !isFirstStep.value);

  const totalSteps = computed(() => config.steps.length);
  const progressPercentage = computed(() => {
    if (totalSteps.value === 0) return 0;
    return ((currentStepIndex.value + 1) / totalSteps.value) * 100;
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
      const clearedData: FormData = {};
      Object.entries(step.schema).forEach(([fieldId, field]) => {
        clearedData[fieldId] = field.value;
      });
      stepData.value[stepId] = clearedData;
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
    if (stepIndex < 0 || stepIndex >= config.steps.length) {
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
      return goToStep(currentStepIndex.value + 1);
    }
    return false;
  }

  async function previousStep(): Promise<boolean> {
    if (canGoPrevious.value) {
      return goToStep(currentStepIndex.value - 1);
    }
    return false;
  }

  function resetForm() {
    currentStepIndex.value = 0;
    config.steps.forEach(step => {
      clearStepData(step.id);
    });
    stepValidationErrors.value = {};
    config.steps.forEach(step => {
      stepValidationErrors.value[step.id] = [];
    });
  }

  async function validateAllSteps(): Promise<boolean> {
    let allValid = true;

    for (const step of config.steps) {
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
