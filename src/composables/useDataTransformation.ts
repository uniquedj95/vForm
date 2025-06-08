import { computed, Ref } from 'vue';
import { FormData, FormSchema, ComputedData, Option } from 'types';

/**
 * Composable for data transformation logic
 * Reduces duplication in computed data processing
 */
export function useDataTransformation(activeSchema: Ref<FormSchema>) {
  /**
   * Transform form schema to form data
   */
  const formData = computed(() =>
    Object.entries(activeSchema.value).reduce((acc, [key, form]) => {
      if (form.value !== undefined) {
        if (typeof form.onChange === 'function') {
          acc[key] = form.onChange(form.value);
        } else {
          acc[key] = form.value;
        }
      }
      return acc;
    }, {} as FormData)
  );

  /**
   * Transform form data to computed data
   */
  const computedData = computed(() => {
    return Object.entries(formData.value).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        // Handle children transformations
        if (activeSchema.value[key].children !== undefined) {
          acc[key] = (value as Array<Option>).map(({ other }) => {
            return Object.entries(other).reduce((results, [id, v]: [string, any]) => {
              if (typeof activeSchema.value[key].children![id].computedValue === 'function') {
                results[id] = activeSchema.value[key].children![id].computedValue(
                  v,
                  activeSchema.value
                );
              } else {
                results[id] = v;
              }
              return results;
            }, {} as ComputedData);
          });
        }

        // Handle computed values
        if (typeof activeSchema.value[key].computedValue === 'function' && value !== undefined) {
          acc[key] = activeSchema.value[key].computedValue(value, activeSchema.value);
        }
      }
      return acc;
    }, {} as ComputedData);
  });

  return {
    formData,
    computedData,
  };
}
