import { computed, type Ref } from 'vue';
import type { FormField } from '../types';
import { DEFAULT_FILL, DEFAULT_LABEL_PLACEMENT } from '../constants';

/**
 * Composable for common input component props
 * Reduces duplication of standard input properties across components
 */
export function useInputProps(model: Ref<FormField>) {
  /**
   * Common input fill style with default fallback
   */
  const fill = computed(() => model.value.fill ?? DEFAULT_FILL);

  /**
   * Common label placement with default fallback
   */
  const labelPlacement = computed(() => model.value.labelPlacement ?? DEFAULT_LABEL_PLACEMENT);

  /**
   * Required attribute
   */
  const required = computed(() => model.value.required);

  /**
   * Error text for validation
   */
  const errorText = computed(() => model.value.error);

  /**
   * Autofocus attribute
   */
  const autofocus = computed(() => model.value.autoFocus);

  /**
   * Placeholder text
   */
  const placeholder = computed(() => model.value.placeholder);

  /**
   * Disabled state
   */
  const disabled = computed(() => model.value.disabled);

  /**
   * Common props object for input components
   */
  const commonInputProps = computed(() => ({
    fill: fill.value,
    labelPlacement: labelPlacement.value,
    required: required.value,
    errorText: errorText.value,
    autofocus: autofocus.value,
    placeholder: placeholder.value,
    disabled: disabled.value,
  }));

  return {
    fill,
    labelPlacement,
    required,
    errorText,
    autofocus,
    placeholder,
    disabled,
    commonInputProps,
  };
}
