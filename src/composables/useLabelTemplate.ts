import { computed, type Ref } from 'vue';
import type { FormField } from '@/types';

/**
 * Composable for common label template logic
 * Reduces duplication across input components that render labels with required asterisks
 */
export function useLabelTemplate(model: Ref<FormField>) {
  /**
   * Computed property to determine if the label should be shown
   */
  const showLabel = computed(() => !!model.value.label);

  /**
   * Computed property to determine if the required asterisk should be shown
   */
  const showRequired = computed(() => !!model.value.required);

  /**
   * Computed property for the label text
   */
  const labelText = computed(() => model.value.label || '');

  return {
    showLabel,
    showRequired,
    labelText,
  };
}
