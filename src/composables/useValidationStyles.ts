import { ComponentPublicInstance, Ref } from 'vue';

/**
 * Composable for managing Ionic validation CSS classes
 * Reduces duplication in input validation state management
 */
export function useValidationStyles(inputRef: Ref<ComponentPublicInstance | null>) {
  /**
   * Apply validation state CSS classes to input element
   */
  const applyValidationState = async (isValid: boolean) => {
    // Remove existing validation classes
    inputRef.value?.$el.classList.remove('ion-invalid');
    inputRef.value?.$el.classList.remove('ion-valid');

    // Apply appropriate validation class
    if (isValid) {
      inputRef.value?.$el.classList.add('ion-valid');
    } else {
      inputRef.value?.$el.classList.add('ion-invalid');
    }

    // Mark as touched
    inputRef.value?.$el.classList.add('ion-touched');
  };

  /**
   * Reset validation classes when focusing
   */
  const resetValidationState = () => {
    inputRef.value?.$el.classList.remove('ion-touched');
    inputRef.value?.$el.classList.remove('ion-invalid');
  };

  return {
    applyValidationState,
    resetValidationState,
  };
}
