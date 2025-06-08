import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import {
  createVueRouterMock,
  createIonicMocks,
  createIonicIconsMock,
  ionicComponentStubs,
  expectStandardFormMethods,
} from '../../../utils/testHelpers';

// Mock dependencies
createVueRouterMock();
createIonicMocks();
createIonicIconsMock();

// Import the component after mocks
import SelectInput from '../../../../src/components/inputs/SelectInput.vue';

describe('SelectInput', () => {
  it('renders the component properly', () => {
    const wrapper = mount(SelectInput, {
      props: {
        modelValue: {
          type: 'SelectInput',
          label: 'Test Select',
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
          ],
        },
      },
      global: {
        stubs: ionicComponentStubs,
      },
    });

    expect(wrapper.exists()).toBeTruthy();
  });

  it('renders with the correct props', () => {
    const wrapper = mount(SelectInput, {
      props: {
        modelValue: {
          type: 'SelectInput',
          label: 'Test Select',
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
          ],
        },
      },
      global: {
        stubs: ionicComponentStubs,
      },
    });

    expect(wrapper.props().modelValue.label).toBe('Test Select');
    expect(wrapper.props().modelValue.options).toHaveLength(2);
  });

  it('exposes required methods', () => {
    const wrapper = mount(SelectInput, {
      props: {
        modelValue: {
          type: 'SelectInput',
          label: 'Test Select',
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
          ],
        },
      },
      global: {
        stubs: ionicComponentStubs,
      },
    });

    // Use shared helper function to check standard methods
    expectStandardFormMethods(wrapper);
  });
});
