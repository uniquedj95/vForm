import { describe, it, expect, vi } from 'vitest';
import {
  uncheckAllOptions,
  deepEqual,
  shouldPreserveFieldValue,
  resetFormInputsWithCustomResolver,
} from '../../../src/utils';
import { Option, FormField, FormData, ComputedData } from '../../../src/types';

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

  describe('shouldPreserveFieldValue', () => {
    it('should return true for disabled fields', () => {
      const field: FormField = {
        type: 'TextInput',
        disabled: true,
        value: 'test',
      };
      const formData: FormData = {};
      const computedData: ComputedData = {};

      expect(shouldPreserveFieldValue(field, formData, computedData)).toBe(true);
    });

    it('should return true for hidden fields', () => {
      const field: FormField = {
        type: 'TextInput',
        hidden: true,
        value: 'test',
      };
      const formData: FormData = {};
      const computedData: ComputedData = {};

      expect(shouldPreserveFieldValue(field, formData, computedData)).toBe(true);
    });

    it('should return true when condition evaluates to false', () => {
      const field: FormField = {
        type: 'TextInput',
        value: 'test',
        condition: () => false, // Field should be hidden
      };
      const formData: FormData = {};
      const computedData: ComputedData = {};

      expect(shouldPreserveFieldValue(field, formData, computedData)).toBe(true);
    });

    it('should return false for normal visible fields', () => {
      const field: FormField = {
        type: 'TextInput',
        value: 'test',
      };
      const formData: FormData = {};
      const computedData: ComputedData = {};

      expect(shouldPreserveFieldValue(field, formData, computedData)).toBe(false);
    });

    it('should return false when condition evaluates to true', () => {
      const field: FormField = {
        type: 'TextInput',
        value: 'test',
        condition: () => true, // Field should be visible
      };
      const formData: FormData = {};
      const computedData: ComputedData = {};

      expect(shouldPreserveFieldValue(field, formData, computedData)).toBe(false);
    });
  });

  describe('resetFormInputsWithCustomResolver', () => {
    it('should reset form inputs while preserving disabled and hidden fields using custom resolver', () => {
      const mockInputRefs = [
        {
          onReset: vi.fn(),
          $attrs: { 'ref-key': '0-normalField' },
        },
        {
          onReset: vi.fn(),
          $attrs: { 'ref-key': '0-disabledField' },
        },
        {
          onReset: vi.fn(),
          $attrs: { 'ref-key': '1-hiddenField' },
        },
      ];

      // Mock nested schema structure like RepeatInput
      const nestedSchemas = [
        {
          normalField: { type: 'TextInput', disabled: false, hidden: false },
          disabledField: { type: 'TextInput', disabled: true },
        },
        {
          hiddenField: { type: 'TextInput', hidden: true },
        },
      ];

      const getFieldFromRefKey = (refKey: string) => {
        const [indexStr, formId] = refKey.split('-');
        const index = parseInt(indexStr, 10);
        return nestedSchemas[index]?.[formId] || null;
      };

      resetFormInputsWithCustomResolver(mockInputRefs, {}, {}, getFieldFromRefKey);

      // Normal field should be reset
      expect(mockInputRefs[0].onReset).toHaveBeenCalled();
      // Disabled field should not be reset
      expect(mockInputRefs[1].onReset).not.toHaveBeenCalled();
      // Hidden field should not be reset
      expect(mockInputRefs[2].onReset).not.toHaveBeenCalled();
    });
  });
});
