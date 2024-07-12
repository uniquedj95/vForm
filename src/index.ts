import { App, Plugin } from 'vue';
import FormBuilder from './components/FormBuilder.vue';
import TextInput from './components/inputs/TextInput.vue';
import DateInput from './components/inputs/DateInput.vue';
import NumberInput from './components/inputs/NumberInput.vue';
import EmailInput from './components/inputs/EmailInput.vue';
import PasswordInput from './components/inputs/PasswordInput.vue';

export const VForm: Plugin = {
    install(app: App) {
        app.component('VForm', FormBuilder);
        app.component('TextInput', TextInput);
        app.component('DateInput', DateInput);
        app.component('NumberInput', NumberInput);
        app.component('EmailInput', EmailInput);
        app.component('PasswordInput', PasswordInput);
    }
}

export * from "./types";