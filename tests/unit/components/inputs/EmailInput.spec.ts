import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import EmailInput from '../../../../src/components/inputs/EmailInput.vue';
import BaseInput from '../../../../src/components/inputs/BaseInput.vue';

vi.mock('../../../../src/components/inputs/BaseInput.vue', () => ({
  default: {
    name: 'BaseInput',
    props: ['modelValue', 'schema', 'type'],
    template: `
      <div class="base-input">
        <div v-if="modelValue.label" class="label">
          {{ modelValue.label }}
          <span v-if="modelValue.required" class="required-indicator">*</span>
        </div>
        <div class="input-field"></div>
        <div v-if="modelValue.error" class="error">{{ modelValue.error }}</div>
      </div>
    `,
    methods: {
      onReset: vi.fn(),
      onValueUpdate: vi.fn(),
      getErrors: vi.fn().mockReturnValue([]),
    },
  },
}));

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
    expect(typeof wrapper.vm.onReset).toBe('function');
    expect(typeof wrapper.vm.onValueUpdate).toBe('function');
    expect(typeof wrapper.vm.getErrors).toBe('function');
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
