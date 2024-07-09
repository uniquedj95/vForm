/**
 * Checks if a value is "empty".
 *
 * @param value - The value to check for emptiness.
 * @returns `true` if the value is `null` or `undefined`, an empty string, an empty array, or an empty object.
 * Returns `false` otherwise.
 */
export function isEmpty(value: any): boolean {
  return value === null 
    || value === undefined 
    || (Array.isArray(value) && !value.length) 
    || (typeof value === 'object' && !Object.keys(value).length) 
    || !value;
}