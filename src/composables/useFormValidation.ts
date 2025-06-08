import { ref } from 'vue';
import { isEmpty } from '../utils';

/**
 * Composable for common form validation logic
 */
export function useFormValidation() {
  const dynamicRefs = ref<Array<any>>([]);

  /**
   * Check if form is valid by validating all input refs
   */
  async function isFormValid(): Promise<boolean> {
    const errors: Array<string> = [];
    for (const inputRef of dynamicRefs.value) {
      if (typeof inputRef?.onValueUpdate === 'function') {
        await inputRef.onValueUpdate();
      }
      if (typeof inputRef?.getErrors === 'function') {
        errors.push(...inputRef.getErrors());
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
        errors.push(...inputRef.getErrors());
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
