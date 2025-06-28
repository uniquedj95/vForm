import { ref, watch, Ref } from 'vue';
import type { FormSchema, Option, FormData, ComputedData } from '@/types';
import { isFormField } from '@/utils';

/**
 * This composable manages dependent options for select inputs.
 * It allows options for a select input to depend on the value of other inputs.
 */
export function useDependentOptions(
  schema: Ref<FormSchema>,
  data: Ref<FormData>,
  computedData: Ref<ComputedData>
) {
  // Track which fields are dependent on others
  const dependencies = ref<Record<string, string[]>>({});

  // Map to store option loader functions for fields
  const optionLoaders = ref<
    Record<string, (filter?: string, dependencyValues?: Record<string, any>) => Promise<Option[]>>
  >({});

  /**
   * Register a field as dependent on another field
   * @param fieldId - The field that needs options loaded
   * @param dependsOn - IDs of fields this field depends on
   * @param loader - Function to load options based on dependency values
   */
  function registerDependency(
    fieldId: string,
    dependsOn: string[],
    loader: (filter?: string, dependencyValues?: Record<string, any>) => Promise<Option[]>
  ) {
    // Store the loader function
    optionLoaders.value[fieldId] = loader;

    // Register dependencies
    dependsOn.forEach(depId => {
      dependencies.value[depId] ??= [];

      if (!dependencies.value[depId].includes(fieldId)) {
        dependencies.value[depId].push(fieldId);
      }
    });

    // Initial load of options if dependencies have values
    updateOptions(fieldId);
  }

  /**
   * Get values of all dependencies for a specific field
   */
  function getDependencyValues(fieldId: string): Record<string, any> {
    const dependsOn = Object.entries(dependencies.value)
      .filter(([, dependents]) => dependents.includes(fieldId))
      .map(([depId]) => depId);

    return dependsOn.reduce(
      (values, depId) => {
        values[depId] = data.value[depId] ?? computedData.value[depId];
        return values;
      },
      {} as Record<string, any>
    );
  }

  /**
   * Check if a value exists in the options
   */
  function valueExistsInOptions(value: any, options: Option[]): boolean {
    if (!value) return false;

    // Handle array values (multiple selection)
    if (Array.isArray(value)) {
      return value.some(val => options.some(option => compareValues(val, option.value)));
    }

    // Handle single values
    return options.some(option => compareValues(value, option.value));
  }

  /**
   * Compare a form value with an option value
   */
  function compareValues(formValue: any, optionValue: string | number): boolean {
    // Handle object values (like Option objects)
    if (typeof formValue === 'object' && formValue !== null) {
      return formValue.value === optionValue;
    }

    // Convert to string for safer comparison of primitives
    return String(formValue) === String(optionValue);
  }

  /**
   * Update options for a field based on its dependencies
   * @param fieldId - The field ID to update options for
   * @param filterValue - Optional filter value to pass to the loader
   */
  async function updateOptions(fieldId: string, filterValue?: string) {
    // Skip if no loader registered for this field
    if (!optionLoaders.value[fieldId]) return;

    // Get dependency values and check if they exist
    const dependencyValues = getDependencyValues(fieldId);
    const dependencyIds = Object.keys(dependencyValues);

    // Skip if no dependencies or missing values
    if (dependencyIds.length === 0) return;

    const allDependenciesHaveValues = dependencyIds.every(
      id => dependencyValues[id] !== undefined && dependencyValues[id] !== null
    );
    if (!allDependenciesHaveValues) return;

    try {
      // Load new options
      const loader = optionLoaders.value[fieldId];
      const options = await loader(filterValue, dependencyValues);

      // Skip if schema field no longer exists
      if (!schema.value[fieldId]) return;

      const field = schema.value[fieldId];

      // Only process if it's a FormField, not a FormSection
      if (!isFormField(field)) return;

      // Update the options
      field.options = options;

      // Check if current value is still valid
      const currentValue = field.value;
      if (!currentValue) return;

      // Reset value if not found in new options
      if (!valueExistsInOptions(currentValue, options)) {
        field.value = field.multiple ? [] : '';
      }
    } catch (error) {
      console.error(`Error loading options for ${fieldId}:`, error);
    }
  }

  // Watch for changes in form data to trigger updates to dependent fields
  watch(
    [data, computedData],
    () => {
      // For each field that has dependencies
      Object.entries(dependencies.value).forEach(([depId, dependentFields]) => {
        // Check if the value of the dependency has changed
        if (data.value[depId] !== undefined || computedData.value[depId] !== undefined) {
          // Update all fields that depend on this one
          dependentFields.forEach(fieldId => {
            // Call updateOptions without a filterValue to maintain compatibility
            // The SelectInput component will pass the filter when needed
            updateOptions(fieldId);
          });
        }
      });
    },
    { deep: true, immediate: true }
  );

  return {
    registerDependency,
    updateOptions,
  };
}
