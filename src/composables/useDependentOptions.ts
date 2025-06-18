import { ref, watch, Ref } from 'vue';
import type { FormSchema, Option, FormData, ComputedData } from '../types';

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
      if (!dependencies.value[depId]) {
        dependencies.value[depId] = [];
      }
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
        values[depId] = data.value[depId] || computedData.value[depId];
        return values;
      },
      {} as Record<string, any>
    );
  }

  /**
   * Update options for a field based on its dependencies
   */
  async function updateOptions(fieldId: string) {
    if (!optionLoaders.value[fieldId]) return;

    const loader = optionLoaders.value[fieldId];
    const dependencyValues = getDependencyValues(fieldId);

    // Only proceed if we have all required dependency values
    const dependencyIds = Object.keys(dependencyValues);
    const allDependenciesHaveValues = dependencyIds.every(
      id => dependencyValues[id] !== undefined && dependencyValues[id] !== null
    );

    if (allDependenciesHaveValues && dependencyIds.length > 0) {
      try {
        // Load new options
        const options = await loader(undefined, dependencyValues);

        // Update the schema with new options
        if (schema.value[fieldId]) {
          schema.value[fieldId].options = options;

          // Reset the value if it's not in the new options
          const currentValue = schema.value[fieldId].value;

          if (currentValue) {
            const currentValueExists = options.some(option => {
              if (Array.isArray(currentValue)) {
                return currentValue.some(val => {
                  if (typeof val === 'object' && val !== null) {
                    return val.value === option.value;
                  }
                  return String(val) === String(option.value); // Convert to string for comparison
                });
              }

              if (typeof currentValue === 'object' && currentValue !== null) {
                return currentValue.value === option.value;
              }

              // Convert both to string for safer comparison
              return String(currentValue) === String(option.value);
            });

            if (!currentValueExists) {
              schema.value[fieldId].value = schema.value[fieldId].multiple ? [] : '';
            }
          }
        }
      } catch (error) {
        console.error(`Error loading options for ${fieldId}:`, error);
      }
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
            updateOptions(fieldId);
          });
        }
      });
    },
    { deep: true }
  );

  return {
    registerDependency,
    updateOptions,
  };
}
