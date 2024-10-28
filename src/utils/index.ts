/**
 * Form Builder Utility functions.
 * 
 * @packageDocumentation 
 * @module utils
 * @preferred
 * @author Daniel Justin.
 **/
import { ComputedData, FormData, FormField, Option } from "types";

/**
 * Full month names.
 **/
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
    (typeof value === "object" && !Object.keys(value).length) ||
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
export function formatDate(date: string, pattern: string = "DD/MMM/YYYY"): string {
  const _date = new Date(date);

  if (isNaN(_date.getTime())) {
    throw new Error("Invalid date string");
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
    (match) => replacements[match] || match
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
    if (part === "MMMM") return monthNames[Number(month) - 1];
    if (part === "MMM") return monthNames[Number(month) - 1].slice(0, 3);
    if (part === "MM") return zeroPad(Number(month));
  }
  return month as string;
}


/**
 * Maps a given value or array of values to corresponding options from a list.
 *
 * @param value - A string value or array of string values to map to options.
 * @param options - The list of options to map the value(s) to.
 * @param isMultiple - A boolean indicating if multiple values should be mapped. Defaults to `false`.
 * @returns The matched option(s) from the list. If `isMultiple` is `true`, returns an array of matched options. Otherwise, returns a single matched option.
 */
export function mapValueToOption(value: string | Array<string>, options: Array<Option>, isMultiple: boolean = false) {
  if(isMultiple && Array.isArray(value)) {
    return options.filter(option => value.includes(option.value as string))
  }
  return options.find(option => option.value === value) as Option;
}


/**
 * Retrieves the value(s) from a given form field model.
 *
 * @param model - The form field model containing the value(s).
 * @returns The extracted value(s) from the form field model.
 */
export function getModelValue(model: FormField): Array<string> | string {
  if(isEmpty(model.value)) return model.multiple ? [] : "";
  if(model.multiple && Array.isArray(model.value)) {
    return model.value.map(opt => opt.value) as Array<string>;
  }
  return typeof model.value === "object"
    ? (model.value as Option).value as string
    : model.value as string;
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
  if (typeof field.condition === "function") {
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
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // Handle Array
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as any;
  }

  // Handle Object
  const cloned: any = {};
  Object.entries(obj).forEach(([key, value]) => {
    // Bind functions to the cloned object
    if(typeof value === "function") {
      cloned[key] = value.bind(cloned);
    } else {
      cloned[key] = deepClone(value);
    }
  });

  return cloned;
}