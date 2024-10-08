import { App, Plugin } from 'vue';
import Form from './components/vForm.vue';
import TextInput from './components/inputs/TextInput.vue';
import DateInput from './components/inputs/DateInput.vue';
import NumberInput from './components/inputs/NumberInput.vue';
import EmailInput from './components/inputs/EmailInput.vue';
import PasswordInput from './components/inputs/PasswordInput.vue';
import SelectInput from './components/inputs/SelectInput.vue';

export const VForm: Plugin = {
    install(app: App) {
        app.component('VForm', Form);
        app.component('TextInput', TextInput);
        app.component('DateInput', DateInput);
        app.component('NumberInput', NumberInput);
        app.component('EmailInput', EmailInput);
        app.component('PasswordInput', PasswordInput);
        app.component('SelectInput', SelectInput);
    }
}

export * from "./types";

export default VForm;