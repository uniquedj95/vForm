/**
 * Form Builder Utility functions
 *
 * This module provides utility functions for form handling, including date formatting,
 * field rendering checks, deep cloning, option management, and more.
 *
 * It is designed to be used in conjunction with vform form builder components and can be extended
 * or modified as needed for specific use cases.
 *
 * @packageDocumentation
 * @module utils
 * @preferred
 * @author Daniel Justin.
 **/
import {
  ComputedData,
  FormData,
  FormField,
  FormFieldValue,
  FormSchema,
  FormValue,
  Option,
} from '@/types';
export * from './maskito';

/**
 * Resolves a FormFieldValue to its actual FormValue.
 * Handles direct values, functions that return values, and Promises that resolve to values.
 *
 * @param fieldValue - The form field value to resolve
 * @returns A Promise that resolves to the actual FormValue
 */
export async function resolveFormFieldValue(
  fieldValue: FormFieldValue | undefined
): Promise<FormValue | undefined> {
  if (fieldValue === undefined || fieldValue === null) {
    return undefined;
  }

  // If it's already a FormValue (not a function or Promise), return it directly
  if (typeof fieldValue !== 'function' && !(fieldValue instanceof Promise)) {
    return fieldValue;
  }

  // If it's a function, call it and check if the result is a Promise
  if (typeof fieldValue === 'function') {
    const result = fieldValue();
    if (result instanceof Promise) {
      return await result;
    }
    return result;
  }

  // If it's a Promise, await it
  if (fieldValue instanceof Promise) {
    return await fieldValue;
  }
}

/**
 * Full month names.
 **/
export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Checks if a value is "empty".
 *
 * @param value - The value to check for emptiness.
 * @returns `true` if the value is `null` or `undefined`, an empty string, an empty array, or an empty object.
 * Returns `false` otherwise.
 */
export function isEmpty(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    (Array.isArray(value) && !value.length) ||
    (typeof value === 'object' && !Object.keys(value).length) ||
    !value
  );
}

/**
 * Determines if a field value should be preserved during form reset.
 * A field should be preserved if it's disabled, hidden, or its condition evaluates to false.
 *
 * @param field - The form field to check
 * @param formData - Current form data for condition evaluation
 * @param computedData - Current computed data for condition evaluation
 * @returns `true` if the field value should be preserved, `false` if it should be reset
 */
export function shouldPreserveFieldValue(
  field: FormField,
  formData: FormData,
  computedData: ComputedData
): boolean {
  return (
    field.disabled ||
    field.hidden ||
    (typeof field.condition === 'function' && !field.condition(formData, computedData))
  );
}

/**
 * Resets form inputs while respecting disabled, hidden, and conditional fields.
 * This function will skip resetting fields that should be preserved based on their state.
 *
 * @param dynamicRefs - Array of input component references
 * @param activeSchema - The current form schema
 * @param formData - Current form data for condition evaluation
 * @param computedData - Current computed data for condition evaluation
 */
export function resetFormInputsWithFieldCheck(
  dynamicRefs: any[],
  activeSchema: FormSchema,
  formData: FormData,
  computedData: ComputedData
): void {
  dynamicRefs.forEach((inputRef: any) => {
    if (typeof inputRef?.onReset === 'function' && inputRef?.$attrs?.['ref-key']) {
      const formId = inputRef.$attrs['ref-key'];

      if (formId && activeSchema[formId]) {
        const field = activeSchema[formId];

        // Skip reset if field should be preserved (disabled, hidden, or condition is false)
        if (shouldPreserveFieldValue(field, formData, computedData)) {
          return;
        }
      }

      inputRef.onReset();
    }
  });
}

/**
 * Reset form inputs with field condition checking using a custom schema resolver
 *
 * @param dynamicRefs - Array of form input references
 * @param formData - Current form data for condition evaluation
 * @param computedData - Current computed data for condition evaluation
 * @param getFieldFromRefKey - Function to resolve field from ref-key
 */
export function resetFormInputsWithCustomResolver(
  dynamicRefs: any[],
  formData: FormData,
  computedData: ComputedData,
  getFieldFromRefKey: (refKey: string) => FormField | null
): void {
  dynamicRefs.forEach((inputRef: any) => {
    if (typeof inputRef?.onReset === 'function' && inputRef?.$attrs?.['ref-key']) {
      const refKey = inputRef.$attrs['ref-key'];
      const field = getFieldFromRefKey(refKey);

      if (field) {
        // Skip reset if field should be preserved (disabled, hidden, or condition is false)
        if (shouldPreserveFieldValue(field, formData, computedData)) {
          return;
        }
      }

      inputRef.onReset();
    }
  });
}

/**
 * Determines if a form field can be rendered based on a condition.
 *
 * @param field - The form field to check.
 * @param data - The current form data.
 * @param computedData - Additional computed data that may influence the condition.
 * @returns A boolean indicating whether the field can be rendered.
 */
export function canRenderField(field: FormField, data: FormData, computedData: ComputedData) {
  if (typeof field.condition === 'function') {
    return field.condition(data, computedData);
  }
  return true;
}

/**
 * Deep clone an object.
 *
 * @param obj - The object to clone.
 * @returns The cloned object.
 */
export function deepClone<T = any>(obj: T): T {
  // Handle primitive types
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Handle Array
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any;
  }

  // Handle Object
  const cloned: any = {};
  Object.entries(obj).forEach(([key, value]) => {
    // Bind functions to the cloned object
    if (typeof value === 'function') {
      cloned[key] = value.bind(cloned);
    } else {
      cloned[key] = deepClone(value);
    }
  });

  return cloned;
}

/**
 * Finds an option in a list of options that matches the given option.
 *
 * The function checks for a match based on the `value` and `label` properties
 * of the `Option` object. It returns the first option that satisfies any of
 * the following conditions:
 * - The `value` of the option matches the `value` of the given option.
 * - The `label` of the option matches the `label` of the given option.
 * - The `value` of the option matches the `label` of the given option.
 * - The `label` of the option matches the `value` of the given option.
 *
 * @param {Option} option - The option to find in the list.
 * @param {Array<Option>} options - The list of options to search through.
 * @returns {number} - The index first matching option, or -1 if no match is found.
 */
export function findOption(option: Option, options: Array<Option>): number {
  return options.findIndex(opt => {
    return (
      opt.value === option.value ||
      opt.label === option.label ||
      opt.value === option.label ||
      opt.label === option.value
    );
  });
}

/**
 * Checks if an option exists in the provided options array. If the option is found,
 * it sets the `isChecked` property to `true`. If the option is not found, it adds
 * the option to the array with the `isChecked` property set to `true`.
 *
 * @param {Option} option - The option to check or add.
 * @param {Array<Option>} options - The array of options to search within.
 */
export function checkOption(option: Option, options: Array<Option>) {
  const index = findOption(option, options);
  if (index >= 0) options[index].isChecked = true;
  else options.push({ ...option, isChecked: true });
}

/**
 * Unchecks the specified option in the given array of options.
 *
 * @param option - The option to uncheck.
 * @param options - The array of options to search within.
 */
export function uncheckOption(option: Option, options: Array<Option>) {
  const index = findOption(option, options);
  if (index >= 0) options[index].isChecked = false;
}

/**
 * Unchecks all options in the provided array of options.
 *
 * @param {Array<Option>} options - The array of options to uncheck.
 */
export function uncheckAllOptions(options: Array<Option>) {
  options.forEach(option => {
    option.isChecked = false;
  });
}

/**
 * Determines if an option's description should be displayed based on its configuration.
 *
 * @param {Option} option - The option to check.
 * @param {boolean} [isSelected] - Whether the option is currently selected.
 * @returns {boolean} `true` if the option has a description that should be displayed, `false` otherwise.
 */
export function shouldShowDescription(option: Option, isSelected?: boolean): boolean {
  if (!option.description) {
    return false;
  }

  const showMode = option.description.show ?? 'always';

  if (showMode === 'always') {
    return true;
  }

  if (showMode === 'onSelected') {
    return !!isSelected;
  }

  return false;
}

/**
 * Filters an array of options based on a provided filter string.
 *
 * @param {Array<Option>} options - The array of options to filter.
 * @param {string} filter - The string to filter the options by.
 * @returns An array of options that match the filter string.
 */
export function getFilteredOptions(options: Array<Option>, filter: string): Array<Option> {
  if (!filter) return options;
  return options.filter(option =>
    JSON.stringify(option).toLowerCase().includes(filter.toLowerCase())
  );
}

/**
 * Generates a label text for a form field, appending an asterisk if the field is required.
 *
 * @param model - The form field model containing the label and required status.
 * @returns The label text with an optional asterisk for required fields.
 */
export function getLabelText(model: FormField): string {
  const label = model.label || '';
  const asterisk = model.required ? ` *` : '';
  return label + asterisk;
}

/**
 * Utility for deep comparison between two values.
 *
 * @param obj1 - The first value to compare.
 * @param obj2 - The second value to compare.
 * @returns `true` if the values are deeply equal, `false` otherwise.
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  // Handle simple cases
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== typeof obj2) return false;

  // Handle primitive types
  if (typeof obj1 !== 'object') return obj1 === obj2;

  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, i) => deepEqual(item, obj2[i]));
  }

  // Handle objects
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every(key => Object.hasOwn(obj2, key) && deepEqual(obj1[key], obj2[key]));
}

/**
 * Type guard to check if an item is a FormField (not a FormSection)
 *
 * @param item - The item to check
 * @returns `true` if the item is a FormField, `false` if it's a FormSection
 */
export function isFormField(item: FormField): boolean {
  return item.type !== 'FormSection';
}

/**
 * Type guard to check if an item is a FormSection (not a FormField)
 *
 * @param item - The item to check
 * @returns `true` if the item is a FormSection, `false` if it's a FormField
 */
export function isFormSection(item: FormField): boolean {
  return item.type === 'FormSection';
}
