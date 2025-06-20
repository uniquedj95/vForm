import { describe, it, expect, beforeEach } from 'vitest';
import { useMultiStepForm } from '../../../src/composables/useMultiStepForm';
import type { MultiStepConfig } from '../../../src/types';

describe('useMultiStepForm', () => {
  let multiStepConfig: MultiStepConfig;

  beforeEach(() => {
    multiStepConfig = {
      steps: [
        {
          id: 'step1',
          title: 'Step 1',
          subtitle: 'First step',
          schema: {
            field1: { type: 'TextInput', label: 'Field 1', value: '' },
            field2: { type: 'TextInput', label: 'Field 2', value: '' },
          },
        },
        {
          id: 'step2',
          title: 'Step 2',
          subtitle: 'Second step',
          schema: {
            field3: { type: 'TextInput', label: 'Field 3', value: '' },
            field4: { type: 'TextInput', label: 'Field 4', value: '' },
          },
        },
      ],
      stepPosition: 'top',
      stepDisplayMode: 'numbers',
      showProgress: true,
      allowStepNavigation: false,
    };
  });

  it('should initialize with first step as current', () => {
    const { currentStepIndex, currentStep, isFirstStep, isLastStep } =
      useMultiStepForm(multiStepConfig);

    expect(currentStepIndex.value).toBe(0);
    expect(currentStep.value?.id).toBe('step1');
    expect(isFirstStep.value).toBe(true);
    expect(isLastStep.value).toBe(false);
  });

  it('should navigate to next step', async () => {
    const { currentStepIndex, nextStep, canGoNext } = useMultiStepForm(multiStepConfig);

    expect(canGoNext.value).toBe(true);
    const success = await nextStep();
    expect(success).toBe(true);
    expect(currentStepIndex.value).toBe(1);
  });

  it('should navigate to previous step', async () => {
    const { currentStepIndex, nextStep, previousStep, canGoPrevious } =
      useMultiStepForm(multiStepConfig);

    // Go to second step first
    await nextStep();
    expect(currentStepIndex.value).toBe(1);
    expect(canGoPrevious.value).toBe(true);

    // Go back to first step
    const success = await previousStep();
    expect(success).toBe(true);
    expect(currentStepIndex.value).toBe(0);
  });

  it('should update step data', () => {
    const { updateStepData, stepData } = useMultiStepForm(multiStepConfig);

    const testData = { field1: 'test value', field2: 'another value' };
    updateStepData('step1', testData);

    expect(stepData.value['step1']).toEqual(testData);
  });

  it('should clear step data', () => {
    const { updateStepData, clearStepData, stepData } = useMultiStepForm(multiStepConfig);

    // Add some data
    updateStepData('step1', { field1: 'test value' });
    expect(stepData.value['step1'].field1).toBe('test value');

    // Clear the data
    clearStepData('step1');
    expect(stepData.value['step1'].field1).toBe('');
  });

  it('should provide combined form data', () => {
    const { updateStepData, allFormData } = useMultiStepForm(multiStepConfig);

    updateStepData('step1', { field1: 'value1', field2: 'value2' });
    updateStepData('step2', { field3: 'value3', field4: 'value4' });

    expect(allFormData.value).toEqual({
      field1: 'value1',
      field2: 'value2',
      field3: 'value3',
      field4: 'value4',
    });
  });

  it('should calculate progress percentage', async () => {
    const { progressPercentage, nextStep } = useMultiStepForm(multiStepConfig);

    expect(progressPercentage.value).toBe(50); // 1/2 * 100

    await nextStep();
    expect(progressPercentage.value).toBe(100); // 2/2 * 100
  });

  it('should reset form', () => {
    const { updateStepData, resetForm, currentStepIndex, stepData } =
      useMultiStepForm(multiStepConfig);

    // Add data and navigate
    updateStepData('step1', { field1: 'test' });
    // Go to step 2
    currentStepIndex.value = 1;

    // Reset
    resetForm();

    expect(currentStepIndex.value).toBe(0);
    expect(stepData.value['step1'].field1).toBe('');
  });

  it('should prevent navigation beyond bounds', async () => {
    const { currentStepIndex, nextStep, previousStep } = useMultiStepForm(multiStepConfig);

    // Try to go previous from first step
    expect(currentStepIndex.value).toBe(0);
    const prevSuccess = await previousStep();
    expect(prevSuccess).toBe(false);
    expect(currentStepIndex.value).toBe(0);

    // Go to last step
    await nextStep();
    expect(currentStepIndex.value).toBe(1);

    // Try to go next from last step
    const nextSuccess = await nextStep();
    expect(nextSuccess).toBe(false);
    expect(currentStepIndex.value).toBe(1);
  });

  it('should validate individual steps', async () => {
    const configWithValidation: MultiStepConfig = {
      ...multiStepConfig,
      steps: [
        {
          ...multiStepConfig.steps[0],
          validation: formData => {
            const errors: string[] = [];
            if (!formData.field1) errors.push('Field 1 is required');
            return errors.length > 0 ? errors : null;
          },
        },
        multiStepConfig.steps[1],
      ],
    };

    const { validateCurrentStep, updateStepData } = useMultiStepForm(configWithValidation);

    // Should fail validation without data
    const isValid1 = await validateCurrentStep();
    expect(isValid1).toBe(false);

    // Should pass validation with data
    updateStepData('step1', { field1: 'value' });
    const isValid2 = await validateCurrentStep();
    expect(isValid2).toBe(true);
  });

  it('should get multi-step form data', () => {
    const { updateStepData, updateStepComputedData, getMultiStepFormData } =
      useMultiStepForm(multiStepConfig);

    updateStepData('step1', { field1: 'value1' });
    updateStepData('step2', { field3: 'value3' });
    updateStepComputedData('step1', { computed1: 'computed value' });

    const data = getMultiStepFormData();

    // Step data should include both updated values and default values from schema
    expect(data.steps['step1']).toEqual({ field1: 'value1', field2: '' });
    expect(data.steps['step2']).toEqual({ field3: 'value3', field4: '' });
    expect(data.computedSteps['step1']).toEqual({ computed1: 'computed value' });
    expect(data.allFormData).toEqual({
      field1: 'value1',
      field2: '',
      field3: 'value3',
      field4: '',
    });
    expect(data.allComputedData).toEqual({ computed1: 'computed value' });
  });

  it('should initialize step data with default values from schema', () => {
    const { stepData } = useMultiStepForm(multiStepConfig);

    // Check that step data is initialized with default values from schema
    expect(stepData.value['step1']).toEqual({ field1: '', field2: '' });
    expect(stepData.value['step2']).toEqual({ field3: '', field4: '' });
  });
});
