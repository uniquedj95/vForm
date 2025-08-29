import { App, Plugin } from 'vue';
import Form from './components/vForm.vue';
import TextInput from './components/inputs/TextInput.vue';
import DateInput from './components/inputs/DateInput.vue';
import NumberInput from './components/inputs/NumberInput.vue';
import EmailInput from './components/inputs/EmailInput.vue';
import PasswordInput from './components/inputs/PasswordInput.vue';
import SelectInput from './components/inputs/SelectInput.vue';
import TextAreaInput from './components/inputs/TextAreaInput.vue';
import RepeatInput from './components/inputs/RepeatInput.vue';
import CheckboxInput from './components/inputs/CheckboxInput.vue';
import RadioInput from './components/inputs/RadioInput.vue';
import FormSection from './components/shared/SectionTitle.vue';
import { maskito } from '@maskito/vue';
import { GlobalConfig } from './types';

// Export composables
export { useFormValidation } from './composables/useFormValidation';
export { useInputValidation } from './composables/useInputValidation';
export { useDataTransformation } from './composables/useDataTransformation';
export { useDependentOptions } from './composables/useDependentOptions';
export { useMultiStepForm } from './composables/useMultiStepForm';
export { useFormFieldValue } from './composables/useFormFieldValue';

// Export types
export * from './types';

// Export utilities
export { resolveFormFieldValue } from './utils';

export const VForm: Plugin = {
  install(app: App, opts?: GlobalConfig) {
    if (opts) app.provide('globalConfig', opts);
    app.component('VForm', Form);
    app.component('TextInput', TextInput);
    app.component('DateInput', DateInput);
    app.component('NumberInput', NumberInput);
    app.component('EmailInput', EmailInput);
    app.component('PasswordInput', PasswordInput);
    app.component('SelectInput', SelectInput);
    app.component('TextAreaInput', TextAreaInput);
    app.component('RepeatInput', RepeatInput);
    app.component('CheckboxInput', CheckboxInput);
    app.component('RadioInput', RadioInput);
    app.component('FormSection', FormSection);
    app.directive('maskito', maskito);
  },
};

export type VFormRef = typeof Form;

// Export components for direct use
export {
  Form as FormBuilder,
  TextInput,
  DateInput,
  NumberInput,
  EmailInput,
  PasswordInput,
  SelectInput,
  TextAreaInput,
  RepeatInput,
  CheckboxInput,
  RadioInput,
  FormSection,
};

export default VForm;
