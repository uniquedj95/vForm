import { computed, reactive, Ref, watch } from 'vue';
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
  const computedData = reactive({} as ComputedData);

  watch(
    formData,
    (newData, oldData = {}) => {
      // Process only values that have changed
      Object.keys(newData).forEach(key => {
        // Check if this specific value has changed
        const hasValueChanged = JSON.stringify(newData[key]) !== JSON.stringify(oldData[key]);
        if (!hasValueChanged) return;

        const value = newData[key];

        if (value) {
          if (activeSchema.value[key].children !== undefined) {
            // Initialize if needed
            if (!computedData[key]) {
              computedData[key] = [];
            }

            const valueArray = value as Array<Option>;

            // For arrays, compare each item and its children
            if (Array.isArray(oldData[key])) {
              const oldArray = oldData[key] as Array<Option>;

              // Process each item in the array
              valueArray.forEach((item, index) => {
                // Create the object if it doesn't exist
                if (!computedData[key][index]) {
                  computedData[key][index] = {};
                }

                // Get the old item or empty object if it doesn't exist
                const oldItem = oldArray[index] || { other: {} };

                // Only process children that have changed
                Object.entries(item.other || {}).forEach(([id, v]: [string, any]) => {
                  const hasChildChanged = JSON.stringify(v) !== JSON.stringify(oldItem.other?.[id]);

                  if (hasChildChanged) {
                    if (
                      typeof activeSchema.value[key].children![id]?.computedValue === 'function'
                    ) {
                      computedData[key][index][id] = activeSchema.value[key].children![
                        id
                      ].computedValue(v, activeSchema.value);
                    } else {
                      computedData[key][index][id] = v;
                    }
                  }
                });
              });
            } else {
              // Fallback for when oldData[key] is not an array
              computedData[key] = valueArray.map(({ other }: Option) => {
                return Object.entries(other || {}).reduce(
                  (results, [id, v]: [string, any]) => {
                    if (
                      typeof activeSchema.value[key].children![id]?.computedValue === 'function'
                    ) {
                      results[id] = activeSchema.value[key].children![id].computedValue(
                        v,
                        activeSchema.value
                      );
                    } else {
                      results[id] = v;
                    }
                    return results;
                  },
                  {} as Record<string, any>
                );
              });
            }
          }

          // Compute the value if a computedValue function exists
          if (typeof activeSchema.value[key].computedValue === 'function') {
            computedData[key] = activeSchema.value[key].computedValue(value, activeSchema.value);
          }
        } else {
          // Value is undefined, delete the key from the computed data if it exists
          delete computedData[key];
        }
      });
    },
    {
      immediate: true,
      deep: true,
    }
  );

  return {
    formData,
    computedData,
  };
}
