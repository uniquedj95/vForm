import { App, Plugin } from 'vue';
import FormBuilder from './components/FormBuilder.vue';
import TextInput from './components/inputs/TextInput.vue';

export const FormBuilderPlugin: Plugin = {
  install(app: App) {
    app.component('FormBuilder', FormBuilder);
    app.component('TextInput', TextInput);
  }
}