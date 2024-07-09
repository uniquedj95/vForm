import { App } from 'vue';
import Form from './components/FormBuilder.vue';
import TextInput from './components/inputs/TextInput.vue';

export * from "./types";

export default {
  install(app: App) {
    app.component('FormBuilder', Form);
    app.component('TextInput', TextInput);
  }
}