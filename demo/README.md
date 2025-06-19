# VForm Demo Application

This demo application showcases all the features and capabilities of the VForm library - a simplified Ionic Vue form builder.

## Features Demonstrated

### 1. Basic Form (BasicDemo.vue)

- All input types: Text, Email, Password, Number, Date, Select, Checkbox, TextArea
- Form validation and submission
- Responsive grid layout
- Form events (submit, clear, cancel)

### 2. Advanced Features (AdvancedDemo.vue)

- Input masking with Maskito
- Computed/calculated fields
- Custom buttons
- Complex form layouts
- Dynamic field updates

### 3. Validation Examples (ValidationDemo.vue)

- Custom synchronous validators
- Async validation (simulated email domain check)
- Field-specific error messages
- Form-wide validation
- Required field handling

### 4. Dependent Fields (DependentFieldsDemo.vue)

- Dynamic field visibility based on other field values
- Cascading select options (Country → State)
- Conditional required fields
- Field dependencies

### 5. Custom Styles (CustomStylesDemo.vue)

- Theme switching (Default, Dark, Colorful)
- Custom CSS styling
- Responsive design examples
- Animation effects

## Available Input Components

- **TextInput**: Basic text input with optional masking
- **EmailInput**: Email validation and formatting
- **PasswordInput**: Secure password input
- **NumberInput**: Numeric input with min/max validation
- **DateInput**: Date picker
- **SelectInput**: Dropdown selection with dynamic options
- **TextAreaInput**: Multi-line text input
- **CheckboxInput**: Boolean checkbox
- **RadioInput**: Single selection from multiple options
- **RepeatInput**: Repeatable field groups

## Key Features

### Form Schema

Forms are defined using a declarative schema that includes:

- Field types and validation rules
- Grid layout configuration
- Conditional visibility
- Dynamic options
- Computed values

### Validation System

- Built-in validation for all input types
- Custom validator functions
- Async validation support
- Real-time validation feedback
- Form-wide validation state

### Responsive Grid

- Ionic's responsive grid system
- Breakpoint-specific sizing (xs, sm, md, lg, xl)
- Automatic layout adaptation

### Dependency Management

- Field visibility based on other field values
- Dynamic options loading
- Conditional validation rules
- Computed field values

## Running the Demo

1. First build and install the VForm library:

   ```bash
   cd /path/to/vform
   npm run demo:setup
   ```

   This will:

   - Build the VForm library
   - Install demo dependencies
   - Install the local VForm package in the demo

2. Start the development server:

   ```bash
   npm run demo:dev
   ```

   Or from the demo directory:

   ```bash
   cd demo
   npm run dev
   ```

3. Open your browser to the displayed URL (usually `http://localhost:3000`)

### Development Workflow

When making changes to the VForm library and wanting to see them in the demo:

```bash
# Update the demo with the latest VForm build
npm run demo:update
```

This command rebuilds the library and reinstalls it in the demo.

## Demo Navigation

The demo includes a sidebar navigation with the following sections:

- **Basic Form**: Simple form with all input types
- **Advanced Features**: Masking, computed fields, custom buttons
- **Validation Examples**: Various validation scenarios
- **Dependent Fields**: Dynamic field behavior
- **Custom Styles**: Theming and styling examples

Each demo includes:

- Interactive form
- Real-time form data display
- Feature explanations
- Code examples

## Form Schema Example

```javascript
const formSchema = {
  firstName: {
    type: 'TextInput',
    label: 'First Name',
    value: '',
    placeholder: 'Enter your first name',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  email: {
    type: 'EmailInput',
    label: 'Email',
    value: '',
    required: true,
    validator: customEmailValidator,
    grid: { xs: '12' },
  },
  country: {
    type: 'SelectInput',
    label: 'Country',
    value: '',
    options: countryOptions,
    grid: { xs: '12', md: '6' },
  },
  state: {
    type: 'SelectInput',
    label: 'State',
    value: '',
    options: (filter, dependencyValues) => {
      return getStatesForCountry(dependencyValues.country);
    },
    dependencies: ['country'],
    visible: schema => !!schema.country?.value,
    grid: { xs: '12', md: '6' },
  },
};
```

## Integration Example

```vue
<template>
  <VForm
    :schema="formSchema"
    @submit="handleSubmit"
    @clear="handleClear"
    :show-labels="true"
    submit-button-text="Submit"
  />
</template>

<script setup>
import { VForm } from '@uniquedj95/vform';

function handleSubmit(formData, computedData) {
  console.log('Form data:', formData);
  console.log('Computed data:', computedData);
}
</script>
```

## Learn More

- Explore each demo section to see different features in action
- Check the browser console for form submission data
- Modify the schema objects to experiment with different configurations
- View the component source code to understand implementation details
