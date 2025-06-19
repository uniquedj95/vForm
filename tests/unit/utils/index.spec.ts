import { describe, it, expect } from 'vitest';
import { uncheckAllOptions, deepEqual } from '../../../src/utils';
import { Option } from '../../../src/types';

describe('utils', () => {
  describe('uncheckAllOptions', () => {
    it('should uncheck all options when all options are checked', () => {
      const options: Option[] = [
        { label: 'Option 1', value: '1', isChecked: true },
        { label: 'Option 2', value: '2', isChecked: true },
        { label: 'Option 3', value: '3', isChecked: true },
      ];

      uncheckAllOptions(options);

      expect(options.every(option => option.isChecked === false)).toBe(true);
    });

    it('should handle options with mixed checked states', () => {
      const options: Option[] = [
        { label: 'Option 1', value: '1', isChecked: true },
        { label: 'Option 2', value: '2', isChecked: false },
        { label: 'Option 3', value: '3', isChecked: true },
      ];

      uncheckAllOptions(options);

      expect(options.every(option => option.isChecked === false)).toBe(true);
    });

    it('should handle empty options array', () => {
      const options: Option[] = [];

      uncheckAllOptions(options);

      expect(options).toEqual([]);
    });

    it('should handle options where all are already unchecked', () => {
      const options: Option[] = [
        { label: 'Option 1', value: '1', isChecked: false },
        { label: 'Option 2', value: '2', isChecked: false },
      ];

      uncheckAllOptions(options);

      expect(options.every(option => option.isChecked === false)).toBe(true);
    });

    it('should preserve other option properties while unchecking', () => {
      const options: Option[] = [
        { label: 'Option 1', value: '1', isChecked: true, disabled: true },
        { label: 'Option 2', value: '2', isChecked: true, other: { customProp: 'test' } },
      ];

      uncheckAllOptions(options);

      expect(options[0]).toEqual({
        label: 'Option 1',
        value: '1',
        isChecked: false,
        disabled: true,
      });
      expect(options[1]).toEqual({
        label: 'Option 2',
        value: '2',
        isChecked: false,
        other: { customProp: 'test' },
      });
    });
  });

  describe('deepEqual', () => {
    it('should return true for identical primitive values', () => {
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual('test', 'test')).toBe(true);
      expect(deepEqual(true, true)).toBe(true);
      expect(deepEqual(null, null)).toBe(true);
      expect(deepEqual(undefined, undefined)).toBe(true);
    });

    it('should return false for different primitive values', () => {
      expect(deepEqual(1, 2)).toBe(false);
      expect(deepEqual('test', 'other')).toBe(false);
      expect(deepEqual(true, false)).toBe(false);
      expect(deepEqual(null, undefined)).toBe(false);
    });

    it('should return true for deeply equal objects', () => {
      const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
      const obj2 = { a: 1, b: { c: 2, d: [3, 4] } };
      expect(deepEqual(obj1, obj2)).toBe(true);
    });

    it('should return false for objects with different values', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 3 } };
      expect(deepEqual(obj1, obj2)).toBe(false);
    });

    it('should return true for deeply equal arrays', () => {
      const arr1 = [1, 2, { a: 3 }];
      const arr2 = [1, 2, { a: 3 }];
      expect(deepEqual(arr1, arr2)).toBe(true);
    });

    it('should return false for arrays with different lengths', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2];
      expect(deepEqual(arr1, arr2)).toBe(false);
    });
  });
});
