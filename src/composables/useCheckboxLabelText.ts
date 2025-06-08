import { computed, type Ref } from 'vue';
import type { FormField } from '../types';

/**
 * Composable for checkbox label text content
 * Handles the specific pattern where labels are rendered as text content with asterisks
 */
export function useCheckboxLabelText(model: Ref<FormField>) {
  /**
   * Computed property for the complete label text including required asterisk
   */
  const labelTextWithAsterisk = computed(() => {
    const label = model.value.label || '';
    const asterisk = model.value.required ? ' *' : '';
    return label + asterisk;
  });

  return {
    labelTextWithAsterisk,
  };
}
