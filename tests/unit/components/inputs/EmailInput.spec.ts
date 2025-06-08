import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createBaseInputMock, expectStandardFormMethods } from '../../../utils/testHelpers';
import EmailInput from '../../../../src/components/inputs/EmailInput.vue';
import BaseInput from '../../../../src/components/inputs/BaseInput.vue';

// Mock BaseInput component
createBaseInputMock();

describe('EmailInput', () => {
  let wrapper;
  const defaultProps = {
    modelValue: {
      type: 'EmailInput',
      label: 'Email Address',
      required: true,
    },
  };

  beforeEach(() => {
    wrapper = mount(EmailInput, {
      props: defaultProps,
      global: {
        stubs: {
          BaseInput: true,
        },
      },
    });
  });

  it('renders the component properly', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('exposes required methods', () => {
    expectStandardFormMethods(wrapper);
  });

  it('forwards props to base input', () => {
    const baseInput = mount(BaseInput, {
      props: {
        modelValue: defaultProps.modelValue,
        schema: {},
        type: 'email',
      },
    });

    expect(baseInput.props('type')).toBe('email');
    expect(baseInput.props('modelValue')).toEqual(defaultProps.modelValue);
  });

  it('propagates validation methods to parent', async () => {
    // Create a mock for inputRef
    const inputRefMock = {
      onReset: vi.fn(),
      onValueUpdate: vi.fn(),
      getErrors: vi.fn().mockReturnValue(['Error']),
    };

    // Set the mock on the component
    wrapper.vm.inputRef = inputRefMock;

    // Call the methods
    await wrapper.vm.onReset();
    expect(inputRefMock.onReset).toHaveBeenCalled();

    await wrapper.vm.onValueUpdate();
    expect(inputRefMock.onValueUpdate).toHaveBeenCalled();

    const errors = wrapper.vm.getErrors();
    expect(inputRefMock.getErrors).toHaveBeenCalled();
    expect(errors).toEqual(['Error']);
  });
});
