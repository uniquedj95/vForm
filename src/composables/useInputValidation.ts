import { Ref, computed } from 'vue';
import { FormField, FormSchema } from '../types';
import { useValidationStyles } from './useValidationStyles';
import { ComponentPublicInstance } from 'vue';

/**
 * Composable for common input validation logic
 * Reduces duplication across input components with standard validation patterns
 */
export function useInputValidation(
  inputRef: Ref<ComponentPublicInstance | null>,
  model: Ref<FormField>,
  inputValue: Ref<any>,
  schema?: Ref<FormSchema | undefined>,
  customValidation?: (value: any) => Promise<boolean | string>
) {
  const { applyValidationState, resetValidationState } = useValidationStyles(inputRef);

  /**
   * Standard validation logic for form inputs
   */
  async function isValid(): Promise<boolean> {
    // Check required field validation
    if (model.value.required && !inputValue.value) {
      model.value.error = 'This field is required';
      return false;
    }

    // Run custom validation if provided
    if (customValidation) {
      const customResult = await customValidation(inputValue.value);
      if (typeof customResult === 'string') {
        model.value.error = customResult;
        return false;
      }
      if (customResult === false) {
        return false;
      }
    }

    // Run field-specific validation function
    if (model.value.validation) {
      const errors = await model.value.validation(inputValue.value, schema?.value);
      if (errors && errors.length) {
        model.value.error = errors.join();
        return false;
      }
    }

    return true;
  }

  /**
   * Standard onValueUpdate handler
   */
  async function onValueUpdate(): Promise<void> {
    const validationResult = await isValid();

    if (validationResult) {
      model.value.error = '';
      model.value.value = inputValue.value;
    }

    await applyValidationState(validationResult);
  }

  /**
   * Standard onFocus handler
   */
  function onFocus(): void {
    resetValidationState();
    model.value.error = '';
  }

  /**
   * Standard onReset handler
   */
  function onReset(defaultValue: any = ''): void {
    inputValue.value = defaultValue;
    model.value.error = '';
    model.value.value = defaultValue;
  }

  /**
   * Standard getErrors handler
   */
  const getErrors = computed(() => model.value.error);

  return {
    isValid,
    onValueUpdate,
    onFocus,
    onReset,
    getErrors,
    applyValidationState,
    resetValidationState,
  };
}
