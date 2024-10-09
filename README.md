# vForm

## Overview
vForm is a Vue.js component that dynamically generates forms based on a provided schema. It leverages Ionic components for a responsive and mobile-friendly design, supporting complex forms with conditional rendering and validation logic. It provides a robust and flexible form-building solution for Vue.js applications, allowing for a high degree of customization and control over the form behavior and appearance.

## Features
- **Dynamic Form Generation**: Create forms dynamically based on a schema definition.
- **Conditional Field Rendering**: Fields can be shown or hidden based on other form values.
- **Responsive Grid Layout**: Utilizes Ionic Grid for a responsive design that works across different screen sizes.
- **Enhanced Date Input Field**: Custom date formatting and handling.
- **Customizable Form Fields**: Support for a variety of input types with customizable properties.
- **Built-in Validation**: Validate fields with custom or built-in validation functions.
- **Customizable Button Text**: Easily change the text of action buttons.

## Installation
1. Using NPM package manager
    ```sh
    npm install @uniquedj95/vform
    ```
2. Using YARN package manager
    ```sh
    yarn add @uniquedj95/vform
    ```

## Usage
1. Register `VForm` component in your Vue.js application:
    ```typescript
    // src/main.ts
    import { createApp, Plugin } from 'vue';
    import App from './App.vue';
    import router from './router';
    import { IonicVue } from '@ionic/vue';
    import { VForm } from '@uniquedj95/vform';

    /* Import CSS styles and other components here */
    import '@uniquedj95/vform/styles.css'

    const app = createApp(App)
        .use(IonicVue)
        .use(VForm as Plugin)
        .use(router);
        
    router.isReady().then(() => {
        app.mount('#app');
    });
    ```

2. Use the component in your template:
    ```vue
    <template>
      <v-form :schema="formSchema" button-placement="end" @submit="onSubmit" />
    </template>

    <script setup lang="ts">
    import { reactive } from "vue";
    import { FormSchema, FormData, ComputedData } from "@uniquedj95/vform";

    const formSchema = reactive<FormSchema>({
        // Define your form schema here
        fieldId: {
            type: 'TextInput', // or other InputType
            label: 'Field Label',
            placeholder: 'Enter a value',
            required: true,
            // additional field configuration options
        },
        // Additional fields
    });

    function onSubmit(data: FormData, computedData: ComputedData) {
        console.log(data, computedData);
    }
    </script>
    ```

## Schema Structure
The schema object should define the structure of the form. Each key in the schema represents a form field with its configuration:

### Field Configuration Options
- **type** (`InputType`): Specifies the type of the input field. Supported types include:
  - `TextInput`
  - `DateInput`
  - `NumberInput`
  - `EmailInput`
  - `PasswordInput`
- **label** (`string`): The label displayed for the form field.
- **placeholder** (`string`): Placeholder text for the input field.
- **required** (`boolean`): Determines if the field is required for form submission.
- **grid** (`GridSize`): Specifies the grid size for different screen sizes, allowing responsive design:
  - `xs`, `sm`, `md`, `lg`, `xl`: Control the column size at various breakpoints.
- **validation** (`FormValidator`): A custom validation function that returns an array of error messages if any.
  - The function signature is `(value: FormValue, schema?: FormSchema) => Promise<Array<string> | null> | Array<string> | null`.
- **condition** (`(data: FormData, computedData: ComputedData) => boolean`): A function to determine if the field should be rendered based on other form values.
- **computedValue** (`ComputedValueHandler`): A function to compute a value based on the current field value and schema, allowing dynamic updates.
  - The function signature is `(value: FormValue, schema: FormSchema) => Promise<any> | any`.
- **options** (`FormOptions`): Used for select-type fields, providing options as an array or a function that returns a promise with the options.
- **multiple** (`boolean`): Allows multiple selections for fields with options.
- **min**/ **max** (`number | string`): Specifies minimum and maximum values for number inputs.
- **minLength**/ **maxLength** (`number`): Sets minimum and maximum length for text inputs.
- **disabled** (`boolean`): Disables the input field if set to `true`.
- **hidden** (`boolean`): Hides the field completely if set to `true`.
- **icon** (`string`): Icon to display within the input field.
- **prefix**/ **suffix** (`string`): Text to display before or after the input value.
- **error** (`string`): Custom error message for the field.
- **pattern** (`string`): Regular expression pattern for input validation.
- **allowUnknown**/ **allowCustom** (`boolean`): Allows unknown or custom values for the input.
- **autoFocus** (`boolean`): Automatically focuses the input field on form load.
- **fill** (`"solid" | "outline"`): Defines the fill style of the input field.
- **labelPlacement** (`"stacked" | "start" | "end" | "fixed" | "floating"`): Determines the position of the label relative to the input field.
- **onChange** (`(value: FormValue) => FormValue`): Function that is triggered when the field value changes, allowing for dynamic transformations.

### Form Events
- **submit**: Emitted when the form is submitted successfully after passing validation.
  - Signature: `(formData: FormData, computedFormData: ComputedData) => void`
- **clear**: Emitted when the form fields are cleared to their initial state.
  - Signature: `() => void`
- **cancel**: Emitted when the form submission is canceled, resetting fields.
  - Signature: `() => void`

### Form Props
- **schema** (`FormSchema`): The schema object defining the form structure and field configurations.
- **showLabels** (`boolean`): Determines if labels are displayed for each field. Default is `true`.
- **showClearButton** (`boolean`): Controls the visibility of the clear/reset button. Default is `true`.
- **showCancelButton** (`boolean`): Controls the visibility of the cancel button. Default is `true`.
- **buttonPlacement** (`'start' | 'middle' | 'end'`): Specifies the alignment of action buttons within the form.
- **submitButtonText** (`string`): Custom text for the submit button. Default is `"Submit"`.
- **clearButtonText** (`string`): Custom text for the clear/reset button. Default is `"Reset"`.
- **cancelButtonText** (`string`): Custom text for the cancel button. Default is `"Cancel"`.

## Issue Reporting and Feedback
If you encounter any issues or have suggestions for improvements, please feel free to report them on the [GitHub Issues page](https://github.com/uniquedj95/vform/issues). Your feedback is invaluable in helping us enhance this project.

## Contributors
I welcome contributions from the community! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Implement your changes and commit them to your branch.
4. Submit a pull request detailing your changes.

Thank you to all the [contributors](https://github.com/uniquedj95/vform/graphs/contributors) who have helped make vForm better!

