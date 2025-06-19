import { ref } from 'vue';
import { isEmpty } from '@/utils';

/**
 * Composable for common form validation logic
 */
export function useFormValidation() {
  const dynamicRefs = ref<Array<any>>([]);

  /**
   * Check if form is valid by validating all input refs
   */
  async function isFormValid(): Promise<boolean> {
    console.debug('Validating form inputs');
    const errors: Array<string> = [];
    for (const inputRef of dynamicRefs.value) {
      if (typeof inputRef?.onValueUpdate === 'function') {
        await inputRef.onValueUpdate();
      }
      if (typeof inputRef?.getErrors === 'function') {
        try {
          const componentErrors = inputRef.getErrors();
          if (Array.isArray(componentErrors)) {
            errors.push(...componentErrors);
          } else {
            console.warn('getErrors() returned non-array value:', componentErrors);
          }
        } catch (error) {
          console.error('Error calling getErrors on component:', error, inputRef);
        }
      } else {
        console.warn('Component does not have getErrors function:', inputRef);
      }
    }
    return errors.every(isEmpty);
  }

  /**
   * Reset all form inputs
   */
  function resetForm(): void {
    dynamicRefs.value.forEach((inputRef: any) => {
      if (typeof inputRef?.onReset === 'function') {
        inputRef.onReset();
      }
    });
  }

  /**
   * Get all validation errors from form inputs
   */
  function getFormErrors(): string[] {
    const errors: Array<string> = [];
    for (const inputRef of dynamicRefs.value) {
      if (typeof inputRef?.getErrors === 'function') {
        try {
          const componentErrors = inputRef.getErrors();
          if (Array.isArray(componentErrors)) {
            errors.push(...componentErrors);
          } else {
            errors.push(String(componentErrors));
          }
        } catch (error) {
          console.error('Error calling getErrors on component:', error, inputRef);
        }
      }
    }
    return errors;
  }

  /**
   * Update all form input values
   */
  async function updateFormValues(): Promise<void> {
    for (const inputRef of dynamicRefs.value) {
      if (typeof inputRef?.onValueUpdate === 'function') {
        await inputRef.onValueUpdate();
      }
    }
  }

  return {
    dynamicRefs,
    isFormValid,
    resetForm,
    getFormErrors,
    updateFormValues,
  };
}
