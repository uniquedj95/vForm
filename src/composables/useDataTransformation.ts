import { computed, reactive, Ref, watch } from 'vue';
import { FormData, FormSchema, ComputedData, Option } from 'types';
import { deepEqual } from '../utils';

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

  /**
   * Process a child value using its computed value function or return as is
   */
  const processChildValue = (key: string, childId: string, value: any): any => {
    if (typeof activeSchema.value[key].children![childId]?.computedValue === 'function') {
      return activeSchema.value[key].children![childId].computedValue(value, activeSchema.value);
    }
    return value;
  };

  /**
   * Process a single item's children
   */
  const processItemChildren = (key: string, item: Option, oldItem: Option, index: number): void => {
    // Create the object if it doesn't exist
    if (!computedData[key][index]) {
      computedData[key][index] = {};
    }

    // Only process children that have changed
    Object.entries(item.other ?? {}).forEach(([id, value]: [string, any]) => {
      const hasChildChanged = !deepEqual(value, oldItem.other?.[id]);

      if (hasChildChanged) {
        computedData[key][index][id] = processChildValue(key, id, value);
      }
    });
  };

  /**
   * Process items when old data is an array
   */
  const processArrayItems = (
    key: string,
    valueArray: Array<Option>,
    oldArray: Array<Option>
  ): void => {
    valueArray.forEach((item, index) => {
      // Get the old item or empty object if it doesn't exist
      const oldItem = oldArray[index] ?? { other: {} };
      processItemChildren(key, item, oldItem, index);
    });
  };

  /**
   * Process a single item for the non-array case
   */
  const processNonArrayItem = (key: string, { other }: Option): Record<string, any> => {
    return Object.entries(other ?? {}).reduce(
      (results, [id, value]: [string, any]) => {
        results[id] = processChildValue(key, id, value);
        return results;
      },
      {} as Record<string, any>
    );
  };

  /**
   * Process children for the entire form field
   */
  const processChildren = (key: string, value: any, oldData: Record<string, any>): void => {
    // Initialize if needed
    if (!computedData[key]) {
      computedData[key] = [];
    }

    const valueArray = value as Array<Option>;

    // For arrays, compare each item and its children
    if (Array.isArray(oldData[key])) {
      processArrayItems(key, valueArray, oldData[key] as Array<Option>);
    } else {
      // Fallback for when oldData[key] is not an array
      computedData[key] = valueArray.map(item => processNonArrayItem(key, item));
    }
  };

  /**
   * Process a single form field value
   */
  const processFormField = (key: string, value: any, oldData: Record<string, any>): void => {
    if (!value) {
      // Value is undefined, delete the key from the computed data if it exists
      delete computedData[key];
      return;
    }

    const schema = activeSchema.value[key];

    if (schema.children !== undefined) {
      processChildren(key, value, oldData);
    }
    // Only compute the value if no children were processed
    // This prevents overwriting child transformations
    else if (typeof schema.computedValue === 'function') {
      computedData[key] = schema.computedValue(value, activeSchema.value);
    }
  };

  watch(
    formData,
    (newData, oldData = {}) => {
      // Process only values that have changed
      Object.keys(newData).forEach(key => {
        // Check if this specific value has changed using our custom deep equality
        const isEqual = deepEqual(newData[key], oldData[key]);
        if (isEqual) return;

        processFormField(key, newData[key], oldData);
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
