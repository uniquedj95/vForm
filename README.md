<div align="center">

# vForm

<img src="https://img.icons8.com/color/96/000000/form.png" alt="vForm Logo"/>

A dynamic form builder for Vue.js with Ionic components

[![Version](https://img.shields.io/badge/version-3.7.0-blue.svg)](https://github.com/uniquedj95/vform/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue Version](https://img.shields.io/badge/vue-3.5+-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Downloads](https://img.shields.io/npm/dt/@uniquedj95/vform.svg)](https://www.npmjs.com/package/@uniquedj95/vform)
[![Ionic Vue](https://img.shields.io/badge/Ionic-8.2+-blue)](https://ionicframework.com/)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@uniquedj95/vform)](https://bundlephobia.com/package/@uniquedj95/vform)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/uniquedj95/vform/pulls)

</div>

## Table of Contents

- [Overview](#overview)
- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Schema Structure](#schema-structure)
  - [Example Schema](#example-schema)
  - [Field Configuration Options](#field-configuration-options)
  - [Input Masking](#input-masking)
- [Multi-Step Forms](#multi-step-forms)
  - [Basic Multi-Step Setup](#basic-multi-step-setup)
  - [Step Configuration](#step-configuration)
  - [Step Indicator Positioning](#step-indicator-positioning)
  - [Conditional Steps](#conditional-steps)
  - [Custom Components in Steps](#custom-components-in-steps)
  - [Step Validation](#step-validation)
- [Form Sections](#form-sections)
  - [Basic Section Usage](#basic-section-usage)
  - [Section Configuration](#section-configuration)
- [Form Events](#form-events)
- [Form Methods](#form-methods)
- [Composables](#composables)
- [Input Dependencies](#input-dependencies)
  - [Dynamic Options](#dynamic-options)
  - [Resetting Dependent Fields](#resetting-dependent-fields)
- [Advanced Components](#advanced-components)
  - [SelectInput](#selectinput)
  - [Custom Buttons](#custom-buttons)
  - [RepeatInput](#repeatinput)
  - [Option Descriptions](#option-descriptions)
- [Component Exports](#component-exports)
- [Issue Reporting and Feedback](#issue-reporting-and-feedback)
- [Contributors](#contributors)

## Overview

vForm is a Vue.js component that dynamically generates forms based on a provided schema. It leverages Ionic components for a responsive and mobile-friendly design, supporting complex forms with conditional rendering and validation logic. It provides a robust and flexible form-building solution for Vue.js applications, allowing for a high degree of customization and control over the form behavior and appearance.

## Demo

Explore all VForm features with our comprehensive interactive demo:

```bash
# Clone the repository
git clone https://github.com/uniquedj95/vform.git
cd vform

# Setup and run the demo
npm run demo:setup
npm run demo:dev
```

The demo showcases:

- **Basic Forms**: All input types and basic functionality
- **Form Sections**: Organized forms with section headers and titles
- **Multi-Step Forms**: Step indicators, validation, and smart navigation
- **Custom Components**: Integration of custom Vue components within multi-step workflows
- **Advanced Features**: Masking, computed fields, custom buttons
- **Validation Examples**: Custom validators and error handling
- **Dependent Fields**: Dynamic field behavior and cascading options
- **Custom Styles**: Theming and visual customization

Visit the displayed URL (usually `http://localhost:3000`) to explore the interactive examples.

### Development Workflow

When working on the library and wanting to test changes in the demo:

```bash
# Update demo with latest library changes
npm run demo:update
```

## Features

- **Multi-Step Forms**: Create guided, step-by-step forms with configurable step indicators, validation, and smart navigation.
- **Custom Components**: Integrate custom Vue components directly into multi-step forms for advanced visualizations and workflows.
- **Form Sections**: Organize forms into logical sections with titles and subtitles for better user experience.
- **Dynamic Form Generation**: Create forms dynamically based on a schema definition.
- **Input Masking**: Built-in support for input masking using Maskito for consistent data entry formatting.
- **Conditional Field Rendering**: Fields can be shown or hidden based on other form values.
- **Dependent Options**: Load options for select inputs based on the values of other fields.
- **Responsive Grid Layout**: Utilizes Ionic Grid for a responsive design that works across different screen sizes.
- **Enhanced Date Input Field**: Built-in date and datetime picker support with Ionic components.
- **Multiple Selection Interfaces**: Three different interfaces for select inputs (popover, action sheet, alert).
- **Repeatable Field Groups**: Create dynamic, repeatable sets of form fields.
- **Advanced Validation**: Built-in validation with support for custom validation functions and step-by-step validation.
- **Computed Values**: Generate and transform values based on other form fields.
- **Customizable Styling**: Complete control over appearance with `className` property support across all input components and sections.
- **Form Actions**: Customizable buttons with support for additional custom actions.
- **Rich Text Areas**: Textarea inputs with auto-grow capability and character counting.
- **Form Field Dependencies**: Create relationships between fields that react to changes.
- **Option Descriptions**: Add helpful descriptions to select and checkbox options.

## Installation

1. Install the package using your preferred package manager:

   ```bash
   npm install @uniquedj95/vform
   # or
   yarn add @uniquedj95/vform
   # or
   pnpm add @uniquedj95/vform
   ```

2. Make sure you have the required peer dependencies:

   ```bash
   npm install vue@^3.5.10 @ionic/vue@^8.2.5 ionicons@^8.0.9
   ```

## Usage

1. Register `VForm` component in your Vue.js application:

   ```typescript
   import { createApp } from 'vue';
   import VForm from '@uniquedj95/vform';
   import '@uniquedj95/vform/vform.css';

   const app = createApp({});
   app.use(VForm);
   ```

2. Use the component in your template:

   ```vue
   <template>
     <v-form :schema="formSchema" @submit="handleSubmit" />
   </template>

   <script setup lang="ts">
   import { reactive } from 'vue';
   import { FormSchema, FormData, ComputedData } from '@uniquedj95/vform';

   const formSchema: FormSchema = {
     // Your form fields here
   };

   function handleSubmit(formData: FormData, computedData: ComputedData) {
     console.log('Form submitted:', { formData, computedData });
   }
   </script>
   ```

## Schema Structure

The schema object should define the structure of the form. Each key in the schema represents a form field with its configuration.

### Example Schema

```typescript
const formSchema: FormSchema = {
  firstName: {
    type: 'TextInput',
    label: 'First Name',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  lastName: {
    type: 'TextInput',
    label: 'Last Name',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  birthDate: {
    type: 'DateInput',
    label: 'Date of Birth',
    required: true,
    pattern: 'DD/MMM/YYYY',
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    required: true,
    validation: value => {
      if (!value.includes('@')) {
        return ['Invalid email format'];
      }
      return null;
    },
  },
  category: {
    type: 'SelectInput',
    label: 'Category',
    options: [
      { label: 'Option 1', value: '1' },
      {
        label: 'Option 2',
        value: '2',
        description: { text: 'With an explanation', color: 'secondary', show: 'always' },
      },
    ],
  },
  notes: {
    type: 'TextAreaInput',
    label: 'Notes',
    rows: 4,
    autoGrow: true,
  },
};
```

### Field Configuration Options

#### Input Types

The following input types are supported:

| Type            | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `TextInput`     | Standard text input field                                       |
| `DateInput`     | Date picker with customizable format                            |
| `NumberInput`   | Numeric input field                                             |
| `EmailInput`    | Input field with email validation                               |
| `PasswordInput` | Secure password input with toggle visibility                    |
| `TextAreaInput` | Multi-line text input                                           |
| `SelectInput`   | Dropdown selection                                              |
| `CheckboxInput` | Toggle on/off input                                             |
| `RadioInput`    | Single selection from multiple radio options                    |
| `RepeatInput`   | Repeatable group of fields                                      |
| `FormSection`   | Section header with title and subtitle (unified with FormField) |

#### Common Properties

| Property         | Type                                                     | Description                                             | Applies To        |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------- | ----------------- |
| `label`          | `string`                                                 | The label displayed for the form field                  | All               |
| `placeholder`    | `string`                                                 | Placeholder text for the input field                    | Text-based inputs |
| `required`       | `boolean`                                                | Determines if the field is required for form submission | All               |
| `disabled`       | `boolean`                                                | Disables the input field if set to `true`               | All               |
| `hidden`         | `boolean`                                                | Hides the field completely if set to `true`             | All               |
| `autoFocus`      | `boolean`                                                | Automatically focuses the input field on form load      | All               |
| `error`          | `string`                                                 | Custom error message for the field                      | All               |
| `fill`           | `"solid" \| "outline"`                                   | Defines the fill style of the input field               | All               |
| `labelPlacement` | `"stacked" \| "start" \| "end" \| "fixed" \| "floating"` | Determines the position of the label                    | All               |

#### Layout Properties

| Property    | Type       | Description                                                   |
| ----------- | ---------- | ------------------------------------------------------------- |
| `grid`      | `GridSize` | Specifies responsive grid sizes: `xs`, `sm`, `md`, `lg`, `xl` |
| `className` | `string`   | Custom CSS class for styling input fields and sections        |
| `icon`      | `string`   | Icon to display within the input field                        |
| `prefix`    | `string`   | Text to display before the input value                        |
| `suffix`    | `string`   | Text to display after the input value                         |

#### Validation and Dynamic Behavior

| Property        | Type                   | Description                                                                                                                       |
| --------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `validation`    | `FormValidator`        | Custom validation function: `(value: FormValue, schema?: FormSchema) => Promise<Array<string> \| null> \| Array<string> \| null>` |
| `condition`     | `Function`             | Function to determine if field should be rendered: `(data: FormData, computedData: ComputedData) => boolean`                      |
| `computedValue` | `ComputedValueHandler` | Function to compute derived values: `(value: FormValue, schema: FormSchema) => Promise<any> \| any`                               |
| `onChange`      | `Function`             | Function triggered on field value changes: `(value: FormValue) => FormValue`                                                      |

#### Text Input Properties

| Property    | Type     | Description                                                                | Applies To        |
| ----------- | -------- | -------------------------------------------------------------------------- | ----------------- |
| `minLength` | `number` | Minimum text length                                                        | Text-based inputs |
| `maxLength` | `number` | Maximum text length                                                        | Text-based inputs |
| `pattern`   | `string` | Regular expression pattern for validation and input masking (uses Maskito) | Text-based inputs |

#### Number Input Properties

| Property | Type               | Description   |
| -------- | ------------------ | ------------- |
| `min`    | `number \| string` | Minimum value |
| `max`    | `number \| string` | Maximum value |

#### TextArea Properties

| Property   | Type      | Description                                  |
| ---------- | --------- | -------------------------------------------- |
| `rows`     | `number`  | Number of visible text lines                 |
| `cols`     | `number`  | Visible width in characters                  |
| `autoGrow` | `boolean` | Automatic height adjustment based on content |
| `counter`  | `boolean` | Show character counter                       |

#### Date Input Properties

| Property     | Type      | Description                                 |
| ------------ | --------- | ------------------------------------------- |
| `pattern`    | `string`  | Date format pattern (e.g., "DD/MMM/YYYY")   |
| `enableTime` | `boolean` | Enable time picker alongside date selection |

#### Select Input Properties

| Property           | Type                                     | Description                                    |
| ------------------ | ---------------------------------------- | ---------------------------------------------- |
| `options`          | `FormOptions`                            | Array of options or function returning options |
| `multiple`         | `boolean`                                | Allow multiple selections                      |
| `interface`        | `"popover" \| "action-sheet" \| "alert"` | How select options are displayed               |
| `optionsPlacement` | `"top" \| "bottom"`                      | Position of popover options list               |

#### RepeatInput Properties

| Property   | Type         | Description                           |
| ---------- | ------------ | ------------------------------------- |
| `children` | `FormSchema` | Schema for the repeatable field group |

#### RadioInput Properties

| Property               | Type          | Description                                                      |
| ---------------------- | ------------- | ---------------------------------------------------------------- |
| `options`              | `FormOptions` | Array of options or function returning options                   |
| `showOptionsSeparator` | `boolean`     | Whether to show lines between radio options                      |
| `compareWith`          | `Function`    | Custom comparison function for option selection                  |
| `allowEmptySelection`  | `boolean`     | Whether to allow deselecting all options (defaults to !required) |

#### CheckboxInput Properties

| Property  | Type      | Description                           |
| --------- | --------- | ------------------------------------- |
| `checked` | `boolean` | Initial checked state of the checkbox |

### Custom Styling with className

All form input components now support the `className` property for custom styling. This allows you to apply CSS classes to individual input fields and form sections for complete visual customization.

#### Usage Examples

```typescript
const formSchema: FormSchema = {
  // Custom styled text input
  customInput: {
    type: 'TextInput',
    label: 'Styled Input',
    className: 'my-custom-input',
    placeholder: 'Enter text here',
  },

  // Custom styled section
  styledSection: {
    type: 'FormSection',
    title: 'Custom Section',
    subtitle: 'This section has custom styling',
    className: 'my-custom-section',
  },

  // Custom styled select input
  styledSelect: {
    type: 'SelectInput',
    label: 'Styled Select',
    className: 'my-custom-select',
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ],
  },
};
```

#### CSS Implementation

```css
/* Custom input styling */
.my-custom-input {
  --background: #f8f9fa;
  --border-color: #007bff;
  --color: #333;
}

/* Custom section styling */
.my-custom-section .form-section-title {
  color: #007bff;
  font-size: 1.5rem;
  font-weight: 600;
}

.my-custom-section .form-section-subtitle {
  color: #6c757d;
  font-style: italic;
}

/* Custom select styling */
.my-custom-select {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --color: white;
}
```

#### Component Support

The `className` property is supported across all input components:

- **BaseInput**: Applied to `ion-input` element (covers TextInput, EmailInput, NumberInput, PasswordInput, DateInput)
- **TextAreaInput**: Applied to `ion-textarea` element
- **SelectInput**: Applied to the wrapper container
- **CheckboxInput**: Applied to `ion-checkbox` element
- **RadioInput**: Applied to `ion-radio-group` element
- **RepeatInput**: Applied to each repeat group wrapper
- **FormSection**: Applied to the section container

### Input Masking

vForm includes built-in support for input masking using [Maskito](https://maskito.dev/), which provides consistent data entry formatting for various input types.

#### Basic Usage

Use the `pattern` property on text-based inputs to apply masking:

```typescript
const formSchema: FormSchema = {
  phoneNumber: {
    type: 'TextInput',
    label: 'Phone Number',
    pattern: '+1 (000) 000-0000',
    placeholder: '+1 (555) 123-4567',
  },
  creditCard: {
    type: 'TextInput',
    label: 'Credit Card',
    pattern: '0000 0000 0000 0000',
    placeholder: '1234 5678 9012 3456',
  },
  socialSecurity: {
    type: 'TextInput',
    label: 'SSN',
    pattern: '000-00-0000',
    placeholder: '123-45-6789',
  },
};
```

#### Common Mask Patterns

| Pattern                 | Description        | Example Output        |
| ----------------------- | ------------------ | --------------------- |
| `'000-00-0000'`         | US Social Security | `123-45-6789`         |
| `'+1 (000) 000-0000'`   | US Phone Number    | `+1 (555) 123-4567`   |
| `'0000 0000 0000 0000'` | Credit Card        | `1234 5678 9012 3456` |
| `'00/00/0000'`          | Date (MM/DD/YYYY)  | `12/25/2023`          |
| `'00:00'`               | Time (HH:MM)       | `14:30`               |

#### Advanced Masking

For more complex masking requirements, you can use regular expressions:

```typescript
const emailMask = {
  type: 'EmailInput',
  label: 'Email',
  pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
};
```

The masking is automatically applied when the user types, providing real-time formatting and validation feedback.

## Multi-Step Forms

vForm supports multi-step forms with configurable step indicators, validation, and smart navigation. Multi-step forms break complex forms into manageable sections, improving user experience and data collection.

### Basic Multi-Step Setup

To create a multi-step form, define a `multiStepConfig` prop:

```vue
<template>
  <v-form
    :multi-step-config="multiStepConfig"
    @multi-step-submit="handleSubmit"
    @step-change="handleStepChange"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { FormSchema, MultiStepConfig } from '@uniquedj95/vform';

const multiStepConfig: MultiStepConfig = {
  steps: [
    {
      id: 'personal',
      title: 'Personal Information',
      subtitle: 'Basic details about you',
      schema: {
        firstName: {
          type: 'TextInput',
          label: 'First Name',
          required: true,
        },
        lastName: {
          type: 'TextInput',
          label: 'Last Name',
          required: true,
        },
      },
    },
    {
      id: 'contact',
      title: 'Contact Details',
      subtitle: 'How we can reach you',
      schema: {
        email: {
          type: 'EmailInput',
          label: 'Email',
          required: true,
        },
        phone: {
          type: 'TextInput',
          label: 'Phone Number',
        },
      },
    },
    {
      id: 'review',
      title: 'Review & Submit',
      subtitle: 'Final review of your information',
      schema: {
        comments: {
          type: 'TextAreaInput',
          label: 'Additional Comments',
        },
      },
    },
  ],
  stepPosition: 'top',
  showProgress: true,
  allowStepNavigation: true,
};

function handleSubmit(allData: MultiStepFormData) {
  console.log('All form data:', allData);
}

function handleStepChange(stepIndex: number, stepId: string) {
  console.log(`Moved to step ${stepIndex + 1}: ${stepId}`);
}
</script>
```

### Step Configuration

Each step in the multi-step configuration supports the following properties:

| Property         | Type         | Description                                                              | Required |
| ---------------- | ------------ | ------------------------------------------------------------------------ | -------- |
| `id`             | `string`     | Unique identifier for the step                                           | Yes      |
| `title`          | `string`     | Display title for the step                                               | Yes      |
| `subtitle`       | `string`     | Optional subtitle/description for the step                               | No       |
| `schema`         | `FormSchema` | Schema object containing fields for this step                            | No       |
| `component`      | `Component`  | Custom Vue component to render instead of a schema                       | No       |
| `componentProps` | `Object`     | Props to pass to the custom component                                    | No       |
| `condition`      | `function`   | Function that determines if the step should be shown, based on form data | No       |
| `validation`     | `function`   | Custom validation function for the step                                  | No       |

\*Either `schema` or `component` must be provided.

### Custom Components in Steps

vForm allows you to use custom Vue components in multi-step forms instead of schema-defined fields. This is useful for complex steps that require custom layouts, visualizations, or integration with other components.

```vue
<template>
  <v-form :multi-step-config="multiStepConfig" @multi-step-submit="handleSubmit" />
</template>

<script setup lang="ts">
import { MultiStepConfig } from '@uniquedj95/vform';
import PreviousResultsTable from './components/PreviousResultsTable.vue';

const multiStepConfig: MultiStepConfig = {
  steps: [
    {
      id: 'patient-info',
      title: 'Patient Information',
      schema: {
        // Regular form schema for step 1
        patientId: {
          type: 'TextInput',
          label: 'Patient ID',
          required: true,
        },
      },
    },
    {
      id: 'previous-results',
      title: 'Previous ANC Results',
      // Use a custom component instead of a schema
      component: PreviousResultsTable,
      componentProps: {
        // Props to pass to your component
        clinicId: 123,
        showDetails: true,
      },
    },
    {
      id: 'new-visit',
      title: 'New ANC Visit',
      schema: {
        // Back to regular schema for step 3
        visitDate: {
          type: 'DateInput',
          label: 'Visit Date',
          required: true,
        },
      },
    },
  ],
};
</script>
```

Custom components need to implement a `validate()` method that returns a boolean to integrate with the form validation workflow, and emit an `update:data` event to pass data back to the form.

For detailed implementation examples and best practices, see the [Custom Components Guide](./docs/CUSTOM_COMPONENTS.md).

A complete working example is available in the demo app under `demo/src/examples/CustomComponentExample.vue` that demonstrates a real-world ANC (Antenatal Care) workflow using a custom component to display previous visit history.

### Step Indicator Positioning

The step indicator can be positioned in four different locations:

```typescript
const multiStepConfig: MultiStepConfig = {
  stepPosition: 'top', // Above the form content (default)
  // stepPosition: 'bottom', // Below the form content
  // stepPosition: 'left',   // Left side of the form content
  // stepPosition: 'right',  // Right side of the form content
  // ... other config
};
```

#### Position Behaviors

- **Top/Bottom**: Step indicators display horizontally with connecting lines
- **Left**: Step indicators display vertically with titles to the right of numbered markers
- **Right**: Step indicators display vertically with titles to the left of numbered markers

### Conditional Steps

vForm allows you to conditionally show or hide steps based on the values entered in previous steps. This is useful for creating dynamic workflows that adapt to user input.

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { MultiStepConfig } from '@uniquedj95/vform';

const multiStepConfig = reactive<MultiStepConfig>({
  steps: [
    {
      id: 'account-type',
      title: 'Account Type',
      schema: {
        accountType: {
          type: 'SelectInput',
          label: 'Account Type',
          options: [
            { label: 'Personal', value: 'personal' },
            { label: 'Business', value: 'business' },
          ],
          value: 'personal',
          required: true,
        },
      },
    },
    {
      id: 'business-details',
      title: 'Business Details',
      schema: {
        businessName: {
          type: 'TextInput',
          label: 'Business Name',
          required: true,
        },
      },
      // Only show this step if accountType is 'business'
      // Using stepData with step ID to avoid field name conflicts
      condition: (stepData, stepComputedData) => {
        return /business/i.test(stepData['account-type'].accountType.label);
      },
    },
    {
      id: 'review',
      title: 'Review',
      schema: {
        // Review fields
      },
    },
  ],
});
</script>
```

The `condition` function receives two arguments:

- `stepData`: Form data organized by step ID to avoid key conflicts
- `stepComputedData`: Computed data organized by step ID

```typescript
condition: (stepData, stepComputedData) => {
  const firstStepData = stepData['first-step-id'];
  return firstStepData.someField === 'expectedValue';
};
```

When a step is hidden:

- It won't be visible in the step indicator
- Navigation will skip over it automatically
- The step count and progress indicators will update accordingly
- **Data behavior**: Form data from hidden steps is automatically cleared
  - Hidden step data is not included in the final submission
  - If a step becomes visible again, it starts with empty/default values
  - This prevents processing of data that was meant to be skipped

> **Note:** The data clearing happens whenever the visibility of steps changes. If you need
> to preserve data from conditionally hidden steps for some specific use case, you can
> store a backup of the data separately before the condition changes:
>
> ```typescript
> // Save data before hiding a step
> const backupData = { ...stepData.value['step-to-be-hidden'] };
>
> // Later, if you need to restore the data when the step becomes visible again
> updateStepData('step-to-be-hidden', backupData);
> ```

### Step Validation

Multi-step forms include built-in validation that prevents users from proceeding to the next step until the current step is valid:

- **Next Step**: Validates all fields in the current step before advancing
- **Step Navigation**: When clicking step indicators, validates current step if moving forward
- **Submit**: Validates all steps before final submission

```typescript
const multiStepConfig: MultiStepConfig = {
  steps: [
    {
      id: 'personal',
      title: 'Personal Information',
      schema: {
        /* fields */
      },
      // Optional custom validation for this step
      validation: async (stepData, computedData) => {
        const errors: string[] = [];

        // Custom validation logic
        if (stepData.firstName && stepData.lastName && stepData.firstName === stepData.lastName) {
          errors.push('First and last name cannot be the same');
        }

        return errors;
      },
    },
    // ... other steps
  ],
  // ... other config
};
```

### Multi-Step Configuration Options

| Property              | Type                                     | Description                                   | Default     |
| --------------------- | ---------------------------------------- | --------------------------------------------- | ----------- |
| `steps`               | `FormStep[]`                             | Array of step configurations                  | Required    |
| `stepPosition`        | `'top' \| 'bottom' \| 'left' \| 'right'` | Position of the step indicator                | `'top'`     |
| `stepDisplayMode`     | `'numbers' \| 'labels'`                  | Display mode for step indicators              | `'numbers'` |
| `showProgress`        | `boolean`                                | Show progress bar and step counter            | `true`      |
| `allowStepNavigation` | `boolean`                                | Allow clicking on step indicators to navigate | `false`     |

### Multi-Step Events

| Event         | Description                               | Signature                                                       |
| ------------- | ----------------------------------------- | --------------------------------------------------------------- |
| `step-change` | Emitted when user navigates between steps | `(stepIndex: number, stepId: string) => void`                   |
| `submit`      | Emitted when multi-step form is submitted | `(allData: FormData, multiStepData: MultiStepFormData) => void` |

The `submit` event provides both the combined data from all steps and the per-step data structure:

```typescript
// multi-step data structure
multiStepData: MultiStepFormData = {
  formData: {
    personal: { firstName: 'John', lastName: 'Doe' },
    contact: { email: 'john@example.com', phone: '...' },
    review: { comments: '...' },
  },
  computedData: {
    /* computed values per step */
  },
};
```

## Form Sections

Form sections allow you to organize your forms into logical groups with titles and subtitles, making complex forms more readable and user-friendly. Sections are now fully integrated into the FormField interface, providing a unified approach to form building.

### Basic Section Usage

To create sections in your form, add FormField items with `type: 'FormSection'` to your schema alongside regular form fields:

```vue
<template>
  <v-form :schema="formSchema" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { FormSchema, FormData, ComputedData } from '@uniquedj95/vform';

const formSchema: FormSchema = {
  // Personal Information Section
  personalInfoSection: {
    type: 'FormSection',
    title: 'Personal Information',
    subtitle: 'Basic details about yourself',
  },
  firstName: {
    type: 'TextInput',
    label: 'First Name',
    required: true,
  },
  lastName: {
    type: 'TextInput',
    label: 'Last Name',
    required: true,
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    required: true,
  },

  // Employment Section
  employmentSection: {
    type: 'FormSection',
    title: 'Employment Details',
    subtitle: 'Information about your job',
  },
  jobTitle: {
    type: 'TextInput',
    label: 'Job Title',
    required: true,
  },
  department: {
    type: 'SelectInput',
    label: 'Department',
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Sales', value: 'sales' },
    ],
  },

  // Address Section
  addressSection: {
    type: 'FormSection',
    title: 'Address Information',
  },
  streetAddress: {
    type: 'TextInput',
    label: 'Street Address',
    required: true,
  },
  city: {
    type: 'TextInput',
    label: 'City',
    required: true,
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Form submitted:', { formData, computedData });
  // Note: Section items don't appear in form data as they're display-only
}
</script>
```

### Section Configuration

Form sections are FormField objects with `type: 'FormSection'` and support the following configuration options:

| Property    | Type            | Description                                | Required |
| ----------- | --------------- | ------------------------------------------ | -------- |
| `type`      | `'FormSection'` | Identifies this as a section (not a field) | ✓        |
| `title`     | `string`        | The main section title                     | ✓        |
| `subtitle`  | `string`        | Optional subtitle for additional context   |          |
| `className` | `string`        | Optional CSS class for custom styling      |          |
| `grid`      | `GridSize`      | Grid layout configuration for the section  |          |
| `label`     | `string`        | Alternative to `title` for section header  |          |

> **Note**: For sections, you can use either `title` or `label` for the section header. The `title` property is recommended for clarity, but `label` is supported for consistency with other form fields.

#### Grid Configuration

Sections support the same responsive grid configuration as form fields:

```typescript
const sectionWithGrid: FormSchema = {
  customSection: {
    type: 'FormSection',
    title: 'Custom Section',
    subtitle: 'This section has custom grid settings',
    grid: {
      xs: '12', // Full width on extra small screens
      md: '10', // 10/12 width on medium screens
      lg: '8', // 8/12 width on large screens
    },
    className: 'my-custom-section',
  },
  // ... form fields
};
```

#### Section Styling

Sections are styled with default CSS that provides a clean, professional appearance:

- **Title**: Primary color, medium font weight, clear hierarchy
- **Subtitle**: Muted color, smaller font size
- **Border**: Bottom border in primary color for visual separation
- **Spacing**: Appropriate margins for visual grouping

You can customize section appearance using the `className` property and your own CSS:

```css
.my-custom-section .form-section-title {
  color: #custom-color;
  font-size: 1.5rem;
}

.my-custom-section .form-section-subtitle {
  font-style: italic;
}
```

#### Important Notes

- **Unified Interface**: Form sections are now part of the FormField interface, providing a consistent API for all form elements
- **Data Handling**: Form sections are display-only components and do not contribute to form data
- **Validation**: Sections cannot have validation rules as they don't hold values
- **Order**: Sections will appear in the form in the order they're defined in your schema
- **Multi-Step Compatibility**: Sections work seamlessly within multi-step forms
- **Responsive**: Sections automatically adapt to different screen sizes using Ionic's grid system
- **Custom Styling**: Use the `className` property to apply custom CSS classes to sections

## Form Events

### Single-Step Form Events

| Event    | Description                                                      | Signature                                                      |
| -------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| `submit` | Emitted when the form is submitted successfully after validation | `(formData: FormData, computedFormData: ComputedData) => void` |
| `clear`  | Emitted when the form fields are cleared to their initial state  | `() => void`                                                   |
| `cancel` | Emitted when the form submission is canceled, resetting fields   | `() => void`                                                   |

### Multi-Step Form Events

| Event               | Description                               | Signature                                     |
| ------------------- | ----------------------------------------- | --------------------------------------------- |
| `multi-step-submit` | Emitted when multi-step form is submitted | `(data: multiStepData) => void`               |
| `step-change`       | Emitted when user navigates between steps | `(stepIndex: number, stepId: string) => void` |

The `multi-step-submit` event provides both the combined data from all steps and the per-step data structure:

```typescript
// multi-step data structure
multiStepData: MultiStepFormData = {
  formData: {
    personal: { firstName: 'John', lastName: 'Doe' },
    contact: { email: 'john@example.com' },
    // ... other step data
  },
  computedData: {
    personal: { fullName: 'John Doe' },
    contact: { domain: 'example.com' },
    // ... other computed step data
  },
};
```

## Form Methods

When accessing the VForm via a template ref, you can utilize these methods:

### Single-Step Form Methods

| Method          | Description                                            | Return Type                                          |
| --------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| `resetForm()`   | Resets all form fields to their initial state          | `void`                                               |
| `isFormValid()` | Validates all form fields and returns validation state | `Promise<boolean>`                                   |
| `resolveData()` | Returns the current form data and computed data        | `{ formData: FormData, computedData: ComputedData }` |

### Multi-Step Form Methods

| Method                  | Description                              | Return Type             |
| ----------------------- | ---------------------------------------- | ----------------------- |
| `nextStep()`            | Moves to the next step (with validation) | `Promise<void>`         |
| `previousStep()`        | Moves to the previous step               | `void`                  |
| `goToStep(index)`       | Navigates to a specific step by index    | `Promise<void>`         |
| `getCurrentStep()`      | Returns the current step configuration   | `FormStep \| undefined` |
| `getCurrentStepIndex()` | Returns the current step index           | `number`                |

## Composables

vForm exports several composables that you can use to build custom form solutions or extend functionality:

### Available Composables

| Composable              | Description                                        | Use Case                                      |
| ----------------------- | -------------------------------------------------- | --------------------------------------------- |
| `useFormValidation`     | Core form validation logic and state management    | Building custom form wrappers                 |
| `useInputValidation`    | Input-specific validation and error handling       | Creating custom input components              |
| `useDataTransformation` | Data transformation and computed value handling    | Processing form data for display/submission   |
| `useDependentOptions`   | Managing dependent field options and relationships | Dynamic option loading and field dependencies |
| `useMultiStepForm`      | Multi-step form navigation and state management    | Custom multi-step form implementations        |

### Example Usage

```typescript
import { useFormValidation, useInputValidation } from '@uniquedj95/vform';

// In your custom form component
const { isValid, validateForm, getErrors } = useFormValidation();

// In your custom input component
const { onValueUpdate, onFocus, getErrors } = useInputValidation(inputRef, model, input, schema);
```

For detailed usage examples of these composables, see the [source code](./src/composables/) or examine how they're used in the built-in components.

## Input Dependencies

vForm provides a powerful system for creating dependent form inputs, where the options displayed in one input depend on the values selected in another. This is especially useful for hierarchical selections like country → state → city or category → subcategory.

#### Dynamic Options

To create dependent select inputs, use the `dependsOn` property and the extended `options` function:

```javascript
const formSchema = {
  country: {
    type: 'SelectInput',
    label: 'Country',
    value: '',
    options: [
      { label: 'Malawi', value: 'malawi' },
      { label: 'Zambia', value: 'zambia' },
    ],
    required: true,
  },
  district: {
    type: 'SelectInput',
    label: 'District',
    value: '',
    dependsOn: 'country', // This field depends on the country field
    options: async (filter, dependencyValues) => {
      // Get the country value
      if (!dependencyValues?.country) return [];

      const countryId =
        typeof dependencyValues.country === 'object'
          ? dependencyValues.country.value
          : dependencyValues.country;

      // In a real app, you would make an API call here
      if (countryId === 'malawi') {
        return [
          { label: 'Lilongwe', value: 'lilongwe' },
          { label: 'Blantyre', value: 'blantyre' },
        ];
      }
      return []; // Return empty options for unknown countries
    },
    required: true,
  },
};
```

#### Multiple Dependencies

An input can also depend on multiple other inputs:

```javascript
{
  locality: {
    type: 'SelectInput',
    label: 'Locality',
    dependsOn: ['country', 'region'],  // Array of field IDs this depends on
    options: async (filter, dependencyValues) => {
      // Access to all dependency values
      if (!dependencyValues) return [];

      const country = dependencyValues.country;
      const region = dependencyValues.region;

      // Return options based on both dependencies
      // ...
    }
  }
}
```

For more details and examples, see the [Dependencies Documentation](./docs/DEPENDENCIES.md).

#### Resetting Dependent Fields

When a dependency changes, you often want to reset the dependent field's value to prevent invalid combinations (e.g., when changing from "USA" to "Canada", the previously selected "California" state should be cleared).

**Method 1: Automatic Reset (Built-in)**

The SelectInput component automatically detects dependency changes and resets the field value when using the `dependsOn` property:

```javascript
const formSchema = {
  country: {
    type: 'SelectInput',
    label: 'Country',
    options: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
    ],
  },
  state: {
    type: 'SelectInput',
    label: 'State/Province',
    dependsOn: 'country',
    options: (filter, dependencyValues) => {
      const country = dependencyValues?.country?.value;
      return getStatesForCountry(country);
    },
  },
};
```

When the country changes, the state field automatically resets to empty and reloads options.

**Method 2: Manual Reset (Workaround)**

If the automatic reset doesn't work as expected, you can manually reset dependent fields using the `onChange` callback:

```javascript
{
  country: {
    type: 'SelectInput',
    label: 'Country',
    options: [...],
    onChange: (value, schema) => {
      // Manual reset as workaround
      schema.state.value = '';
      return value;
    },
  }
}
```

**Method 3: Multiple Field Reset**

You can reset multiple dependent fields at once using onChange:

```javascript
{
  country: {
    type: 'SelectInput',
    label: 'Country',
    options: [...],
    onChange: (value, schema) => {
      // Reset all location-dependent fields
      schema.state.value = '';
      schema.city.value = '';
      schema.zipCode.value = '';
      return value;
    },
  }
}
```

**Note:** Use the onChange approach as a workaround when the automatic reset doesn't work properly, or when you need to reset multiple fields or perform additional logic when dependencies change.

### Advanced Components

#### DateInput

The DateInput component supports both date-only and date-time inputs, with different format requirements for setting default values:

- **Date Only Format**: When using DateInput without time selection.

  ```js
  {
    type: 'DateInput',
    label: 'Date of Birth',
    value: '', // Format: YYYY-MM-DD
    required: true
  }
  ```

- **Date Time Format**: When using DateInput with time selection enabled.

  ```js
  {
    type: 'DateInput',
    label: 'Appointment Date & Time',
    value: '', // Format: YYYY-MM-DDTHH:MM:SS
    enableTime: true,
    required: true
  }
  ```

Setting the `enableTime` property to `true` will render a datetime-local input that allows users to select both date and time.

#### SelectInput

The SelectInput component provides various display modes for selection options:

- **Popover Interface**: Default presentation that displays options in a dropdown.

  ```js
  {
    type: 'SelectInput',
    label: 'Choose an option',
    interface: 'popover', // default
    optionsPlacement: 'bottom', // 'top' or 'bottom'
    options: [...]
  }
  ```

- **Action Sheet Interface**: Opens a sheet from the bottom of the screen with options.
  ```js
  {
    type: 'SelectInput',
    label: 'Choose an option',
    interface: 'action-sheet',
    options: [...]
  }
  ```
- **Alert Interface**: Displays options in a modal dialog.
  ```js
  {
    type: 'SelectInput',
    label: 'Choose an option',
    interface: 'alert',
    options: [...]
  }
  ```

#### Custom Buttons

You can add custom action buttons to the form with the `customButtons` prop:

```js
const customButtons = [
  {
    label: 'Save Draft',
    icon: 'save',
    fill: 'outline',
    color: 'secondary',
    action: () => saveDraft(),
  },
];
```

#### RepeatInput

The RepeatInput component allows for creating repeatable groups of fields:

```js
{
  type: 'RepeatInput',
  label: 'Add Items',
  children: {
    name: {
      type: 'TextInput',
      label: 'Item Name',
      required: true
    },
    quantity: {
      type: 'NumberInput',
      label: 'Quantity',
      required: true
    }
  }
}
```

Each repeated set includes add and remove buttons, allowing the user to dynamically create or delete instances of the field group.

#### Option Descriptions

When using SelectInput or CheckboxInput, you can add descriptions to options:

```js
{
  type: 'SelectInput',
  label: 'Subscription Plan',
  options: [
    {
      label: 'Basic',
      value: 'basic',
      description: {
        text: 'Free plan with limited features',
        color: 'secondary', // 'primary', 'warning', 'danger', 'secondary', 'light'
        show: 'always' // or 'onChecked' to show only when selected
      }
    },
    {
      label: 'Premium',
      value: 'premium',
      description: {
        text: 'Full access to all features',
        color: 'primary',
        show: 'always'
      }
    }
  ]
}
```

### Form Props

| Property             | Type                           | Description                                                            | Default      |
| -------------------- | ------------------------------ | ---------------------------------------------------------------------- | ------------ |
| `schema`             | `FormSchema`                   | The schema object defining the form structure and field configurations | _Required_   |
| `multiStepConfig`    | `MultiStepConfig`              | Configuration for multi-step forms (optional)                          | `undefined`  |
| `showLabels`         | `boolean`                      | Determines if labels are displayed for each field                      | `true`       |
| `showClearButton`    | `boolean`                      | Controls the visibility of the clear/reset button                      | `true`       |
| `showCancelButton`   | `boolean`                      | Controls the visibility of the cancel button                           | `true`       |
| `buttonPlacement`    | `'start' \| 'middle' \| 'end'` | Specifies the alignment of action buttons within the form              | `'start'`    |
| `submitButtonText`   | `string`                       | Custom text for the submit button                                      | `"Submit"`   |
| `clearButtonText`    | `string`                       | Custom text for the clear/reset button                                 | `"Reset"`    |
| `cancelButtonText`   | `string`                       | Custom text for the cancel button                                      | `"Cancel"`   |
| `nextButtonText`     | `string`                       | Custom text for the next button (multi-step forms)                     | `"Next"`     |
| `previousButtonText` | `string`                       | Custom text for the previous button (multi-step forms)                 | `"Previous"` |
| `hideButtons`        | `boolean`                      | When true, hides all action buttons                                    | `false`      |
| `customButtons`      | `Array<CustomButton>`          | Array of custom buttons to add to the form                             | `[]`         |

## Component Exports

vForm exports individual components that you can use directly in your applications for more granular control:

### Available Components

```typescript
import {
  VForm, // Main form component
  FormBuilder, // Alias for VForm
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
} from '@uniquedj95/vform';
```

### Usage Example

```vue
<template>
  <div>
    <!-- Use individual components directly -->
    <TextInput v-model="textField" />
    <SelectInput v-model="selectField" />
    <CheckboxInput v-model="checkboxField" />

    <!-- Or use within a custom form -->
    <form @submit="handleSubmit">
      <DateInput v-model="dateField" />
      <NumberInput v-model="numberField" />
      <ion-button type="submit">Submit</ion-button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TextInput, SelectInput, CheckboxInput, DateInput, NumberInput } from '@uniquedj95/vform';
import { FormField } from '@uniquedj95/vform';

const textField = ref<FormField>({
  type: 'TextInput',
  label: 'Name',
  placeholder: 'Enter your name',
});

const selectField = ref<FormField>({
  type: 'SelectInput',
  label: 'Country',
  options: [
    { label: 'USA', value: 'us' },
    { label: 'Canada', value: 'ca' },
  ],
});

// ... other field definitions
</script>
```

### Component Props

All individual components accept the following props:

| Prop      | Type         | Description                                              | Required |
| --------- | ------------ | -------------------------------------------------------- | -------- |
| `v-model` | `FormField`  | The form field configuration object                      | ✓        |
| `schema`  | `FormSchema` | Optional schema for validation and dependency resolution | No       |

## Issue Reporting and Feedback

If you encounter any issues or have suggestions for improvements, please feel free to report them on the [GitHub Issues page](https://github.com/uniquedj95/vform/issues). Your feedback is invaluable in helping us enhance this project.

## Contributors

I welcome contributions from the community! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Implement your changes and commit them to your branch.
4. Submit a pull request detailing your changes.

Thank you to all the [contributors](https://github.com/uniquedj95/vform/graphs/contributors) who have helped make vForm better!

## TypeScript Support

vForm is built with TypeScript and provides complete type definitions for all components and interfaces. Import the types to get full IntelliSense support in your IDE:

```typescript
import {
  FormSchema,
  FormData,
  ComputedData,
  FormField,
  Option,
  InputType,
  FormValidator,
  ComputedValueHandler,
  FormOptions,
  GridSize,
  CustomButton,
  // Multi-step types
  MultiStepConfig,
  MultiStepFormData,
  FormStep,
  StepPosition,
} from '@uniquedj95/vform';
```

When defining your form schema, you can use these types for proper type checking:

```typescript
import { reactive } from 'vue';
import { FormSchema } from '@uniquedj95/vform';

const myFormSchema = reactive<FormSchema>({
  // Your form fields here with proper type checking
});
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Build for production
npm run build
```

### Quality Tools

vForm uses several tools to ensure code quality:

- **ESLint**: Enforces code style and detects potential issues

  ```bash
  # Run linting
  npm run lint
  ```

- **Prettier**: Formats code consistently

  ```bash
  # Format code
  npm run format
  ```

- **Vitest**: Runs unit tests
  ```bash
  # Run tests
  npm run test
  # Run tests with coverage report
  npm run test:coverage
  # Run tests in watch mode
  npm run test:watch
  ```

### Versioning

vForm includes scripts to help with versioning:

```bash
# Patch update (0.0.x)
npm run version:patch

# Minor update (0.x.0)
npm run version:minor

# Major update (x.0.0)
npm run version:major
```

### Continuous Integration

This project uses GitHub Actions for CI/CD:

- Pull requests trigger linting, building, and testing
- Releases are automatically published to npm

## License

vForm is licensed under the MIT License. See the LICENSE file for more information.
