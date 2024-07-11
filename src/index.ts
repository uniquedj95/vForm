import { App, Plugin } from 'vue';
import FormBuilder from './components/FormBuilder.vue';
import TextInput from './components/inputs/TextInput.vue';

export const VForm: Plugin = {
    install(app: App) {
        app.component('VForm', FormBuilder);
        app.component('TextInput', TextInput);
    }
}

export * from "./types";