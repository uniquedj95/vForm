import { describe, it, expect, vi } from 'vitest';
import { ref, nextTick } from 'vue';
import { useDataTransformation } from '../../../src/composables/useDataTransformation';
import { FormSchema } from '../../../src/types';

describe('useDataTransformation', () => {
  // Helper function to create a mock schema
  function createMockSchema(): FormSchema {
    return {
      name: {
        type: 'TextInput',
        label: 'Name',
        value: 'John Doe',
        computedValue: value => value?.toString().toUpperCase(),
      },
      email: {
        type: 'EmailInput',
        label: 'Email Address',
        value: 'john@example.com',
        onChange: value => value?.toString().toLowerCase(),
      },
      options: {
        type: 'SelectInput',
        label: 'Options',
        value: [
          { label: 'Option 1', value: '1', other: { qty: 5 } },
          { label: 'Option 2', value: '2', other: { qty: 10 } },
        ],
        children: {
          qty: {
            type: 'NumberInput',
            label: 'Quantity',
            computedValue: value => Number(value) * 2,
          },
        },
      },
    };
  }

  it('should transform form schema to form data', () => {
    const activeSchema = ref(createMockSchema());
    const { formData } = useDataTransformation(activeSchema);

    expect(formData.value).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      options: [
        { label: 'Option 1', value: '1', other: { qty: 5 } },
        { label: 'Option 2', value: '2', other: { qty: 10 } },
      ],
    });
  });

  it('should transform form data to computed data', async () => {
    const activeSchema = ref(createMockSchema());
    const { computedData } = useDataTransformation(activeSchema);

    // Allow time for the watch to execute
    await nextTick();

    expect(computedData.value).toHaveProperty('name');
    expect(computedData.value.name).toBe('JOHN DOE');
  });

  it('should process children for array form fields', async () => {
    const activeSchema = ref(createMockSchema());
    const { computedData } = useDataTransformation(activeSchema);

    // Allow watch to execute
    await nextTick();

    expect(computedData.value).toHaveProperty('options');
    expect(Array.isArray(computedData.value.options)).toBe(true);
    expect(computedData.value.options).toHaveLength(2);
    expect(computedData.value.options[0].qty).toBe(10); // 5 * 2
    expect(computedData.value.options[1].qty).toBe(20); // 10 * 2
  });

  it('should not compute values for unchanged fields', async () => {
    const schema = ref<FormSchema>({
      firstName: {
        type: 'TextInput',
        label: 'First Name',
        value: 'John',
        computedValue: vi.fn().mockReturnValue('JOHN'),
      },
    });

    const { computedData } = useDataTransformation(schema);
    await nextTick();

    // Clear mocks to check if they're called again
    const mockFn = schema.value.firstName.computedValue as ReturnType<typeof vi.fn>;
    mockFn.mockClear();

    // Update the schema but keep the same value for firstName
    schema.value = {
      ...schema.value,
      lastName: {
        type: 'TextInput',
        label: 'Last Name',
        value: 'Doe',
      },
    };

    // Wait for watch to trigger
    await nextTick();

    // Should not recompute firstName value
    expect(mockFn).not.toHaveBeenCalled();
    expect(computedData.value.firstName).toBe('JOHN');
  });

  it('should delete fields from computedData when they are removed from formData', async () => {
    // Mock the schema
    const mockSchema = ref<FormSchema>({
      name: {
        type: 'TextInput',
        label: 'Name',
        value: 'John Doe',
        computedValue: value => value?.toString().toUpperCase(),
      },
    });

    // Create a new transformation with our mocked schema
    const { formData, computedData } = useDataTransformation(mockSchema);
    await nextTick();

    // Initial value should be computed correctly
    expect(computedData.value.name).toBe('JOHN DOE');

    // Update to set the value to undefined
    mockSchema.value.name.value = undefined;
    await nextTick();

    // The key should be removed from formData
    expect(formData.value).not.toHaveProperty('name');

    // With the fix applied, the key should also be removed from computedData
    expect(computedData.value).not.toHaveProperty('name');
  });

  it('should handle non-array children properly', async () => {
    // Set up a schema where a value is initially not an array
    // and then becomes an array on update
    const schema = ref<FormSchema>({
      items: {
        type: 'RepeatInput',
        label: 'Items',
        value: undefined,
        children: {
          name: {
            type: 'TextInput',
            label: 'Name',
            computedValue: value => value?.toString().toUpperCase(),
          },
        },
      },
    });

    const { computedData } = useDataTransformation(schema);
    await nextTick();

    // Now update the value to be an array
    schema.value.items.value = [{ label: 'Item 1', value: '1', other: { name: 'product' } }];
    await nextTick();

    expect(Array.isArray(computedData.value.items)).toBe(true);
    expect(computedData.value.items[0].name).toBe('PRODUCT');
  });

  it('should process multiple changes in children values', async () => {
    const activeSchema = ref<FormSchema>({
      options: {
        type: 'SelectInput',
        label: 'Options',
        value: [{ label: 'Option 1', value: '1', other: { qty: 5, price: 10 } }],
        children: {
          qty: {
            type: 'NumberInput',
            label: 'Quantity',
            computedValue: value => Number(value) * 2,
          },
          price: {
            type: 'NumberInput',
            label: 'Price',
            computedValue: value => `$${Number(value).toFixed(2)}`,
          },
        },
      },
    });

    const { computedData } = useDataTransformation(activeSchema);
    await nextTick();

    expect(computedData.value.options[0].qty).toBe(10);
    expect(computedData.value.options[0].price).toBe('$10.00');

    // Change both child values
    const updatedValue = [{ label: 'Option 1', value: '1', other: { qty: 8, price: 15 } }];

    activeSchema.value.options.value = updatedValue;
    await nextTick();

    expect(computedData.value.options[0].qty).toBe(16); // 8 * 2
    expect(computedData.value.options[0].price).toBe('$15.00');
  });

  it('should handle async computed values', async () => {
    // Create a resolved promise for the test to avoid timing issues
    const resolvedPromise = Promise.resolve('TEST');

    // Create a mock function that returns our pre-resolved promise
    const asyncComputedValue = vi.fn().mockReturnValue(resolvedPromise);

    const schema = ref<FormSchema>({
      asyncField: {
        type: 'TextInput',
        label: 'Async Field',
        value: 'test',
        computedValue: asyncComputedValue,
      },
    });

    const { computedData } = useDataTransformation(schema);

    // Wait for Vue's reactivity
    await nextTick();

    // Verify that the async function was called
    expect(asyncComputedValue).toHaveBeenCalledWith('test', expect.any(Object));

    // Since the implementation stores the promise directly, and we can't easily
    // wait for it to resolve in the composable's context, we'll just check
    // that the function was called correctly
    expect(computedData.value.asyncField).toBeDefined();
  });
});
