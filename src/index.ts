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
import { maskito } from '@maskito/vue';

export const VForm: Plugin = {
  install(app: App) {
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
    app.directive('maskito', maskito);
  },
};

export * from './types';

export type VFormRef = typeof Form;

export default VForm;
