import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';

// Mock vue-router first
vi.mock('vue-router', () => ({
  routeLocationKey: Symbol('routeLocationKey'),
  matchedRouteKey: Symbol('matchedRouteKey'),
  useRoute: vi.fn(),
}));

// Import the component after mocks
import SelectInput from '../../../../src/components/inputs/SelectInput.vue';

// Individual stubs for specific components used by SelectInput
const ionicComponentStubs = {
  'ion-input': {
    template:
      '<div class="ion-input"><slot name="label"></slot><slot name="start"></slot><slot></slot><slot name="end"></slot></div>',
  },
  'ion-list': {
    template: '<div class="ion-list"><slot></slot></div>',
  },
  'ion-item': {
    template: '<div class="ion-item"><slot name="start"></slot><slot></slot></div>',
  },
  'ion-label': {
    template: '<div class="ion-label"><slot></slot></div>',
  },
  'ion-chip': {
    template: '<div class="ion-chip"><slot></slot></div>',
  },
  'ion-text': {
    template: '<div class="ion-text"><slot></slot></div>',
  },
  'ion-icon': {
    template: '<div class="ion-icon"></div>',
  },
  'ion-checkbox': {
    template: '<div class="ion-checkbox"></div>',
  },
};

// Mock ionic controls directly
vi.mock('@ionic/vue', () => ({
  actionSheetController: {
    create: vi.fn().mockResolvedValue({ present: vi.fn() }),
  },
  alertController: {
    create: vi.fn().mockResolvedValue({ present: vi.fn() }),
  },
  // Add other components needed from Ionic
  IonInput: { template: '<div></div>' },
  IonList: { template: '<div></div>' },
  IonItem: { template: '<div></div>' },
  IonLabel: { template: '<div></div>' },
  IonChip: { template: '<div></div>' },
  IonText: { template: '<div></div>' },
  IonIcon: { template: '<div></div>' },
  IonCheckbox: { template: '<div></div>' },
}));

// Mock ionicons
vi.mock('ionicons/icons', () => ({
  chevronDown: 'chevron-down',
  close: 'close',
}));

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

    // Check that the component exposes the required methods
    const vm = wrapper.vm as any;
    expect(typeof vm.onValueUpdate).toBe('function');
    expect(typeof vm.onReset).toBe('function');
    expect(typeof vm.getErrors).toBe('function');
  });
});
