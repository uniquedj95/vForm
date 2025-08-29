import { ref, Ref, onMounted, watch } from 'vue';
import { FormField, FormFieldValue, FormValue } from '@/types';
import { resolveFormFieldValue } from '@/utils';

/**
 * Composable for handling form field value resolution
 * Supports direct values, functions that return values, and Promises that resolve to values
 */
export function useFormFieldValue(model: Ref<FormField>) {
  const resolvedValue = ref<FormValue | undefined>(undefined);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Resolves the current field value and updates the resolved value
   */
  async function resolveValue(): Promise<void> {
    if (!model.value.value) {
      resolvedValue.value = undefined;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const resolved = await resolveFormFieldValue(model.value.value);
      resolvedValue.value = resolved;

      // Update the model's value to the resolved value for consistency
      // This ensures that other parts of the form can access the resolved value
      model.value.value = resolved;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to resolve field value';
      console.error('Error resolving field value:', err);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Updates the field value with a new FormFieldValue
   */
  async function updateValue(newValue: FormFieldValue | undefined): Promise<void> {
    model.value.value = newValue;
    await resolveValue();
  }

  // Watch for changes in the model value and resolve accordingly
  watch(
    () => model.value.value,
    async () => {
      await resolveValue();
    },
    { immediate: false }
  );

  // Resolve initial value on mount
  onMounted(async () => {
    await resolveValue();
  });

  return {
    resolvedValue,
    isLoading,
    error,
    resolveValue,
    updateValue,
  };
}
