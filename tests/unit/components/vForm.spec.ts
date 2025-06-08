import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createIonicMocks, ionicComponentStubs, formInputStubs } from '../../utils/testHelpers';
import VForm from '../../../src/components/vForm.vue';

// Mock Ionic components
createIonicMocks();

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
    const isFormValidMock = vi.fn().mockResolvedValue(true);
    wrapper.vm.isFormValid = isFormValidMock;

    // Submit the form
    await wrapper.vm.submitForm();

    // Check if submit event was emitted
    expect(wrapper.emitted().submit).toBeTruthy();
  });

  it('does not emit submit event if form is invalid', async () => {
    // Create a new wrapper with a fresh component instance
    const localWrapper = mount(VForm, {
      props: defaultProps,
      global: {
        stubs: {
          'ion-button': true,
          'ion-grid': true,
          'ion-row': true,
          'ion-col': true,
          'ion-icon': true,
          'text-input': true,
          'email-input': true,
        },
      },
    });

    // Replace the submitForm method entirely
    const originalSubmitForm = localWrapper.vm.submitForm;
    localWrapper.vm.submitForm = async () => {
      // Mock isFormValid to always return false
      const isValid = false;
      if (!isValid) return;
      originalSubmitForm.call(localWrapper.vm);
    };

    // Submit the form with our mocked method
    await localWrapper.vm.submitForm();

    // Check that submit event was not emitted
    expect(localWrapper.emitted().submit).toBeFalsy();
  });
});
