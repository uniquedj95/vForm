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
import { ComputedData, FormData, FormField, Option } from 'types';
export * from './maskito';

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
 * Format a date string according to a given pattern.
 *
 * @param date - The date string to format.
 * @param pattern - The pattern to format the date string with. default is 'DD/MMM/2024'.
 * @returns The formatted date string.
 */
export function formatDate(date: string, pattern: string = 'DD/MMM/YYYY'): string {
  const _date = new Date(date);

  if (isNaN(_date.getTime())) {
    throw new Error('Invalid date string');
  }

  const day = zeroPad(_date.getDate());
  const month = _date.getMonth() + 1; // months are zero-based
  const year = _date.getFullYear();
  const hour = zeroPad(_date.getHours());
  const minute = zeroPad(_date.getMinutes());
  const second = zeroPad(_date.getSeconds());
  const milliseconds = _date.getMilliseconds();

  const replacements: { [key: string]: string } = {
    DD: day,
    D: _date.getDate().toString(),
    MMM: monthNames[_date.getMonth()].slice(0, 3),
    MMMM: monthNames[_date.getMonth()],
    MM: zeroPad(month),
    M: month.toString(),
    YYYY: year.toString(),
    YY: year.toString().slice(-2),
    HH: hour,
    H: _date.getHours().toString(),
    mm: minute,
    m: _date.getMinutes().toString(),
    ss: second,
    s: _date.getSeconds().toString(),
    SSS: zeroPad(milliseconds),
    S: milliseconds.toString().slice(0, 1),
    // Add more replacements as needed
  };

  return pattern.replace(
    /DD|D|MMMM|MMM|MM|M|YYYY|YY|HH|H|mm|m|ss|s|SSS|S/g,
    match => replacements[match] || match
  );
}

/**
 * Append a zero to a number if it is less than 10.
 *
 * @param num - The number to append a zero to.
 * @returns The number as a string with a zero appended if it is less than 10.
 */
export function zeroPad(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Get the month name or number.
 *
 * @param month - The month number or name.
 * @param part - The part of the month to get. Either 'MMMM', 'MMM', or 'MM'.
 * @returns The month name or number.
 */
export function getMonth(month: number | string, part: string) {
  if (Number.isInteger(parseInt(month as string)) && Number(month) > 0) {
    if (part === 'MMMM') return monthNames[Number(month) - 1];
    if (part === 'MMM') return monthNames[Number(month) - 1].slice(0, 3);
    if (part === 'MM') return zeroPad(Number(month));
  }
  return month as string;
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
