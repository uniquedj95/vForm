import { App, Plugin } from 'vue';
import Form from './components/FormBuilder.vue';
import TextInput from './components/inputs/TextInput.vue';

export const FormBuilder: Plugin = {
  install(app: App) {
    app.component('FormBuilder', Form);
    app.component('TextInput', TextInput);
  }
}