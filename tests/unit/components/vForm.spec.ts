import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createIonicMocks, ionicComponentStubs, formInputStubs } from '../../utils/testHelpers';
import VForm from '../../../src/components/vForm.vue';

// Mock Ionic components
createIonicMocks();

// Mock the useFormValidation composable
const mockIsFormValid = vi.fn();
vi.mock('../../../src/composables/useFormValidation', () => ({
  useFormValidation: () => ({
    dynamicRefs: { value: [] },
    isFormValid: mockIsFormValid,
    getFormErrors: vi.fn().mockReturnValue([]),
    updateFormValues: vi.fn(),
  }),
}));

describe('VForm', () => {
  let wrapper;
  const defaultProps = {
    schema: {
      firstName: {
        type: 'TextInput',
        label: 'First Name',
        required: true,
      },
      email: {
        type: 'EmailInput',
        label: 'Email',
        required: true,
      },
    },
    buttonPlacement: 'end',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    wrapper = mount(VForm, {
      props: defaultProps,
      global: {
        stubs: {
          // Use shared Ionic and form input stubs
          ...ionicComponentStubs,
          ...formInputStubs,
        },
      },
    });
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('renders the form fields based on schema', () => {
    // Check if component renders two form fields
    expect(Object.keys(wrapper.vm.activeSchema).length).toBe(2);
    expect(Object.keys(wrapper.vm.activeSchema)).toContain('firstName');
    expect(Object.keys(wrapper.vm.activeSchema)).toContain('email');
  });

  it('has the correct button placement', () => {
    expect(wrapper.props('buttonPlacement')).toBe('end');
  });

  it('emits submit event when form is submitted', async () => {
    // Mock isFormValid to return true
    mockIsFormValid.mockResolvedValue(true);

    // Submit the form
    await wrapper.vm.submitForm();

    // Check if submit event was emitted
    expect(wrapper.emitted().submit).toBeTruthy();
  });

  it('does not emit submit event if form is invalid', async () => {
    // Mock isFormValid to return false
    mockIsFormValid.mockResolvedValue(false);

    // Submit the form
    await wrapper.vm.submitForm();

    // Verify that isFormValid was called
    expect(mockIsFormValid).toHaveBeenCalled();

    // Check that submit event was not emitted because form is invalid
    expect(wrapper.emitted().submit).toBeFalsy();
  });
});
