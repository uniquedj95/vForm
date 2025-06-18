import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useDependentOptions } from '../../../src/composables/useDependentOptions';

describe('useDependentOptions composable', () => {
  let schema: any;
  let data: any;
  let computedData: any;

  beforeEach(() => {
    // Reset test data before each test
    schema = ref({
      country: {
        type: 'SelectInput',
        label: 'Country',
        value: '',
        options: [
          { label: 'Malawi', value: 'malawi' },
          { label: 'Zambia', value: 'zambia' },
        ],
      },
      district: {
        type: 'SelectInput',
        label: 'District',
        value: '',
        options: [],
      },
    });

    data = ref({});
    computedData = ref({});
  });

  it('registers a dependency correctly', async () => {
    // Create the composable
    const { registerDependency } = useDependentOptions(schema, data, computedData);

    // Set up a mock options function
    const mockOptionsFunction = vi.fn().mockResolvedValue([
      { label: 'Lilongwe', value: 'lilongwe' },
      { label: 'Blantyre', value: 'blantyre' },
    ]);

    // Register the dependency
    registerDependency('district', ['country'], mockOptionsFunction);

    // The options function should not be called yet (no country value)
    expect(mockOptionsFunction).not.toHaveBeenCalled();

    // Set a country value
    data.value.country = 'malawi';

    // Wait for any promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    // The options function should have been called with the country value
    expect(mockOptionsFunction).toHaveBeenCalledWith(undefined, { country: 'malawi' });

    // The district options should be updated
    expect(schema.value.district.options).toEqual([
      { label: 'Lilongwe', value: 'lilongwe' },
      { label: 'Blantyre', value: 'blantyre' },
    ]);
  });

  it('updates options when dependencies change', async () => {
    // Create the composable
    const { registerDependency } = useDependentOptions(schema, data, computedData);

    // Mock options function that returns different options based on dependency values
    const mockOptionsFunction = vi.fn().mockImplementation((filter, deps) => {
      if (deps?.country === 'malawi') {
        return Promise.resolve([
          { label: 'Lilongwe', value: 'lilongwe' },
          { label: 'Blantyre', value: 'blantyre' },
        ]);
      } else if (deps?.country === 'zambia') {
        return Promise.resolve([
          { label: 'Lusaka', value: 'lusaka' },
          { label: 'Ndola', value: 'ndola' },
        ]);
      }
      return Promise.resolve([]);
    });

    // Register the dependency
    registerDependency('district', ['country'], mockOptionsFunction);

    // Set a country value
    data.value = { country: 'malawi' };

    // Wait for any promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    // Check the options for Malawi
    expect(schema.value.district.options).toEqual([
      { label: 'Lilongwe', value: 'lilongwe' },
      { label: 'Blantyre', value: 'blantyre' },
    ]);

    // Change the country
    data.value = { country: 'zambia' };

    // Wait for any promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    // Check the options for Zambia
    expect(schema.value.district.options).toEqual([
      { label: 'Lusaka', value: 'lusaka' },
      { label: 'Ndola', value: 'ndola' },
    ]);
  });

  it('resets the value when options change and current value is invalid', async () => {
    // Create the composable
    const { registerDependency } = useDependentOptions(schema, data, computedData);

    // Set up initial district value and options
    schema.value.district.value = { label: 'Lilongwe', value: 'lilongwe' };
    schema.value.district.options = [
      { label: 'Lilongwe', value: 'lilongwe' },
      { label: 'Blantyre', value: 'blantyre' },
    ];

    // Mock loader that returns different options
    const mockOptionsFunction = vi.fn().mockImplementation((filter, deps) => {
      if (deps?.country === 'zambia') {
        return Promise.resolve([
          { label: 'Lusaka', value: 'lusaka' },
          { label: 'Ndola', value: 'ndola' },
        ]);
      }
      return Promise.resolve([]);
    });

    // Register the dependency
    registerDependency('district', ['country'], mockOptionsFunction);

    // Change country to Zambia
    data.value = { country: 'zambia' };

    // Wait for any promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    // The district value should be reset because 'lilongwe' is not a valid option for Zambia
    expect(schema.value.district.value).toBe('');
  });
});
