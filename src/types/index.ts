import { Component } from 'vue';

/**
 * Represents the possible value types that can be stored in a form field.
 *
 * @type FormValue
 */
export type FormValue = string | number | boolean | Option | Array<Option>;

/**
 * A function type for validating form field values.
 *
 * The function takes a `value` of type `FormValue` and an optional `schema` of type `FormSchema`.
 * It returns a promise that resolves to an array of error messages or null if validation passes.
 * Alternatively, it can return an array of error messages or null directly without a promise.
 *
 * @type FormValidator
 */
export type FormValidator = (
  value: FormValue,
  schema?: FormSchema
) => Promise<Array<string> | null> | Array<string> | null;

/**
 * A function type for computing derived values based on a form field value.
 *
 * @type ComputedValueHandler
 */
export type ComputedValueHandler = (value: FormValue, schema: FormSchema) => any;

/**
 * Represents the options for a form, which can be either an array of `Option` objects
 * or a function that returns an array of `Option` objects.
 *
 * The function can optionally take a `filter` string as parameter, and a
 * `dependencyValues` object containing values from fields this field depends on.
 */
export type FormOptions =
  | Array<Option>
  | ((
      filter?: string,
      dependencyValues?: Record<string, FormValue>
    ) => Array<Option> | Promise<Array<Option>>);

/**
 * Represents the data of all form fields, mapped by field ID.
 *
 * @type FormData
 */
export type FormData = Record<string, FormValue | undefined>;

/**
 * Represents computed data derived from form fields, mapped by field ID.
 *
 * @type ComputedData
 */
export type ComputedData = Record<string, any>;

/**
 * Represents the structure of a form, with field IDs as keys and FormField objects as values.
 *
 * @type FormSchema
 */
export type FormSchema = Record<string, FormField>;

/**
 * Represents the position of step indicators in a multi-step form.
 *
 * @type StepPosition
 */
export type StepPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Represents the display mode for step indicators.
 *
 * @type StepDisplayMode
 */
export type StepDisplayMode = 'numbers' | 'labels';

/**
 * Represents a single step in a multi-step form.
 *
 * @interface FormStep
 */
export interface FormStep {
  /**
   * Unique identifier for the step.
   */
  id: string;

  /**
   * The title of the step.
   */
  title: string;

  /**
   * Optional subtitle for the step.
   */
  subtitle?: string;

  /**
   * The form schema for this step.
   * Not required if customComponent is provided.
   */
  schema?: FormSchema;

  /**
   * Optional custom component to use for this step instead of a form schema.
   * This should be a Vue component reference.
   */
  component?: Component;

  /**
   * Optional props to pass to the custom component.
   */
  componentProps?: Record<string, any>;

  /**
   * Optional condition function that determines if this step should be displayed.
   *
   * When a step is hidden:
   * - It won't appear in the step indicator
   * - Navigation will skip over it automatically
   * - Its data will be cleared to prevent submission of skipped information
   * - If the step becomes visible again, it will start with empty or default values
   *
   * @param formData - The form data organized by step ID to avoid key conflicts.
   * @param computedData - The computed data organized by step ID to avoid key conflicts.
   *
   * @returns {boolean} - If the function returns true, the step will be displayed. The step will be hidden otherwise.
   */
  condition?: (
    formData: Record<string, FormData>,
    computedData: Record<string, ComputedData>
  ) => boolean;

  /**
   * Custom validation function for the entire step.
   */
  validation?: (
    formData: FormData,
    computedData: ComputedData
  ) => Promise<Array<string> | null> | Array<string> | null;
}

/**
 * Configuration for multi-step forms.
 *
 * @interface MultiStepConfig
 */
export interface MultiStepConfig {
  /**
   * Array of form steps.
   */
  steps: FormStep[];

  /**
   * Position of the step indicators.
   */
  stepPosition?: StepPosition;

  /**
   * Display mode for step indicators.
   */
  stepDisplayMode?: StepDisplayMode;

  /**
   * Whether to show step progress.
   */
  showProgress?: boolean;

  /**
   * Whether to allow clicking on step indicators to navigate.
   */
  allowStepNavigation?: boolean;
}

/**
 * Data structure for multi-step form submission.
 *
 * @interface MultiStepFormData
 */
export interface MultiStepFormData {
  /**
   * Form data for each step, mapped by step ID.
   * Access specific step data using: formData['step-id']
   */
  formData: Record<string, FormData>;

  /**
   * Computed data for each step, mapped by step ID.
   * Access specific step computed data using: computedData['step-id']
   */
  computedData: Record<string, ComputedData>;
}

/**
 * Defines responsive grid sizes for form fields across different viewport breakpoints.
 *
 * @interface GridSize
 */
export interface GridSize {
  /**
   * Grid size for extra-small screens.
   */
  xs?: string;
  /**
   * Grid size for small screens.
   */
  sm?: string;
  /**
   * Grid size for medium screens.
   */
  md?: string;
  /**
   * Grid size for large screens.
   */
  lg?: string;
  /**
   * Grid size for extra-large screens.
   */
  xl?: string;
}

/**
 * Represents a form input field or form section divider with various properties to define its behavior and appearance.
 *
 * @interface FormField
 */
export interface FormField {
  /**
   * The type of input for the form input field, or form section for section headers.
   *
   * @type InputType
   */
  type: InputType;

  /**
   * The current value of the form input field.
   *
   * @type FormValue
   */
  value?: FormValue;

  /**
   * The label for the form input field.
   *
   * @type string
   */
  label?: string;

  /**
   * The optional section title when type is 'FormSection'.
   *
   * @type string
   */
  title?: string;

  /**
   * Optional subtitle for the section when type is 'FormSection'.
   *
   * @type string
   */
  subtitle?: string;

  /**
   * Optional styling class for the section or input field.
   *
   * @type string
   */
  className?: string;

  /**
   * Indicates if the form input field is required.
   *
   * @type boolean
   */
  required?: boolean;

  /**
   * Options for select-type form input fields.
   *
   * @type FormOptions
   */
  options?: FormOptions;

  /**
   * Indicates if multiple selections are allowed.
   *
   * @type boolean
   */
  multiple?: boolean;

  /**
   * The minimum value or length for the form input field.
   *
   * @type number | string
   */
  min?: number | string;

  /**
   * The maximum value or length for the form input field.
   *
   * @type number | string
   */
  max?: number | string;

  /**
   * The number of columns for textarea-type form input fields.
   *
   * @type number
   */
  cols?: number;

  /**
   * The number of rows for textarea-type form input fields.
   *
   * @type number
   */
  rows?: number;

  /**
   * Indicates if the textarea should automatically grow in height.
   *
   * @type boolean
   */
  autoGrow?: boolean;

  /**
   * Indicates if a character counter should be displayed.
   *
   * @type boolean
   */
  counter?: boolean;

  /**
   * The minimum length for the form input field.
   *
   * @type number
   */
  minLength?: number;

  /**
   * The maximum length for the form input field.
   *
   * @type number
   */
  maxLength?: number;

  /**
   * Indicates if the date input field should include a time picker.
   *
   * @type boolean
   */
  enableTime?: boolean;

  /**
   * Indicates if the form input field is disabled.
   *
   * @type boolean
   */
  disabled?: boolean;

  /**
   * Indicates if the form input field is read-only.
   *
   * @type boolean
   */
  hidden?: boolean;

  /**
   * The size of the form input field.
   *
   * @type GridSize
   */
  grid?: GridSize;

  /**
   * The placeholder text for the form input field.
   *
   * @type string
   */
  placeholder?: string;

  /**
   * The icon for the form input field.
   *
   * @type string
   */
  icon?: string;

  /**
   * The prefix for the form input field.
   *
   * @type string
   */
  prefix?: string;

  /**
   * The suffix for the form input field.
   *
   * @type string
   */
  suffix?: string;

  /**
   * The error message for the form input field.
   *
   * @type string
   */
  error?: string;

  /**
   * The pattern for the form input field.
   * If the pattern is not matched, an error message will be displayed.
   *
   * @type string
   */
  pattern?: string;

  /**
   * Auto-focuses the form input field when the page loads.
   *
   * @type boolean
   */
  autoFocus?: boolean;

  /**
   * Indicates if the form input field should be filled with a solid or outlined color.
   *
   * @type "solid" | "outline"
   */
  fill?: 'solid' | 'outline';

  /**
   * The position of the label for the form input field.
   *
   * @type "stacked" | "start" | "end" | "fixed" | "floating"
   */
  labelPlacement?: 'stacked' | 'start' | 'end' | 'fixed' | 'floating';

  /**
   * The position of the options for select-type form input fields.
   *
   * For multiple selections, action-sheet will fallback to popover.
   *
   * @type "popover" | "action-sheet" | "alert"
   */
  interface?: 'popover' | 'action-sheet' | 'alert';

  /**
   * The position of the popover options list for select-type form input fields when interface is "popover".
   *
   * @type "top" | "bottom"
   */
  optionsPlacement?: 'top' | 'bottom';

  /**
   * The children form fields for the repeat-type form input field.
   *
   * @type FormSchema
   */
  children?: FormSchema;

  /**
   * Specifies other field IDs that this field depends on.
   * Can be a single field ID or an array of field IDs.
   *
   * When dependsOn is specified, the options function will receive dependency values
   * as its second parameter when other fields change.
   *
   * @type string | string[]
   */
  dependsOn?: string | string[];

  /**
   * Whether to display separators between options in select-type inputs.
   *
   * @type boolean
   */
  showOptionsSeparator?: boolean;

  /**
   * The custom validation function for the form input field.
   *
   * @type FormValidator
   */
  validation?: FormValidator;

  /**
   * The custom function for listening to changes in the form input field.
   *
   * @param value - The new value of the form input field.
   * @param schema - The schema of the form.
   * @returns {FormValue} The processed form value.
   */
  onChange?: (
    value: FormValue,
    schema: FormSchema
  ) =>
    | FormValue // This return type will be removed as the hook is mainly for handling side effects not transforming data. Use computedValue instead.
    | void;

  /**
   * The custom function used for computing alternative values based on the current value of the form input field.
   *
   * @type ComputedValueHandler
   */
  computedValue?: ComputedValueHandler;

  /**
   * The custom function for checking if the form input field should be displayed.
   *
   * @type (data: FormData, computedData: ComputedData) => boolean
   */
  condition?: (data: FormData, computedData: ComputedData) => boolean;
}

/**
 * Represents a description for an option in a select or checkbox input.
 *
 * @interface OptionDescription
 */
export interface OptionDescription {
  /**
   * The color to display the description text in.
   */
  color: 'primary' | 'warning' | 'danger' | 'secondary' | 'light';

  /**
   * The description text to display.
   */
  text: string;
}
/**
 * Represents a selectable option in inputs like Select, Checkbox, etc.
 *
 * @interface Option
 */
export interface Option {
  /**
   * The display text for the option.
   */
  label: string;

  /**
   * The underlying value of the option.
   */
  value: string | number;

  /**
   * Additional data associated with this option.
   */
  other?: any;

  /**
   * Indicates if the option is currently selected.
   */
  isChecked?: boolean;

  /**
   * Indicates if the option is disabled and cannot be selected.
   */
  disabled?: boolean;

  /**
   * Optional descriptive information about the option.
   */
  description?: OptionDescription;
}

/**
 * Represents the types of inputs that can be used in a form.
 *
 * @type InputType
 */
export type InputType =
  | 'TextInput'
  | 'DateInput'
  | 'NumberInput'
  | 'EmailInput'
  | 'PasswordInput'
  | 'SelectInput'
  | 'TextAreaInput'
  | 'RepeatInput'
  | 'CheckboxInput'
  | 'RadioInput'
  | 'FormSection';

/**
 * Represents the basic field types for HTML input elements.
 *
 * @type BaseFieldTypes
 */
export type BaseFieldTypes =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'time'
  | 'month'
  | 'week'
  | 'date'
  | 'datetime-local';

/**
 * Interface for custom buttons that can be added to forms.
 *
 * @interface CustomButton
 */
export interface CustomButton {
  /**
   * The text label displayed on the button.
   */
  label: string;

  /**
   * The icon name to display on the button (uses Ionic icons).
   */
  icon: string;

  /**
   * The fill style of the button.
   */
  fill?: 'solid' | 'outline';

  /**
   * The expand style of the button.
   */
  expand?: 'full' | 'block';

  /**
   * The size of the button.
   */
  size?: 'default' | 'small' | 'large';

  /**
   * The color theme of the button.
   */
  color?: 'primary' | 'warning' | 'danger' | 'secondary' | 'light';

  /**
   * The function to execute when the button is clicked.
   */
  action: () => void;
}

/**
 * Configuration interface for the vForm component properties.
 *
 * This interface defines all the props that can be passed to configure
 * the form's appearance, behavior, and functionality. It supports both
 * single-step and multi-step forms with extensive customization options.
 *
 * @interface FormProps
 */
export interface FormProps {
  /**
   * The form schema defining the structure and fields of a single-step form.
   * This property is used for regular forms. For multi-step forms, use `multiStepConfig`.
   *
   * @type FormSchema
   */
  schema?: FormSchema;

  /**
   * Configuration for multi-step forms including steps, navigation, and display options.
   * When provided, the form will operate in multi-step mode and `schema` will be ignored.
   *
   * @type MultiStepConfig
   */
  multiStepConfig?: MultiStepConfig;

  /**
   * Whether to display field labels. When set to false, labels will be hidden
   * but placeholders and other field identifiers may still be visible.
   *
   * @default true
   */
  showLabels?: boolean;

  /**
   * Whether to display a clear/reset button that allows users to reset
   * the form to its initial state.
   *
   * @default true
   */
  showClearButton?: boolean;

  /**
   * Whether to display a cancel button that allows users to cancel
   * the current form operation.
   *
   * @default true
   */
  showCancelButton?: boolean;

  /**
   * Controls the horizontal alignment of form buttons.
   * - 'start': Buttons aligned to the left
   * - 'middle': Buttons centered
   * - 'end': Buttons aligned to the right
   *
   * @default 'start'
   */
  buttonPlacement?: 'start' | 'middle' | 'end';

  /**
   * Custom text for the submit button. If not provided, defaults to 'Submit'.
   *
   * @default 'Submit'
   */
  submitButtonText?: string;

  /**
   * Custom text for the clear/reset button. If not provided, defaults to 'Reset'.
   *
   * @default 'Reset'
   */
  clearButtonText?: string;

  /**
   * Custom text for the cancel button. If not provided, defaults to 'Cancel'.
   *
   * @default 'Cancel'
   */
  cancelButtonText?: string;

  /**
   * Custom text for the next button. If not provided, defaults to 'Next'.
   *
   * @default 'Next'
   */
  nextButtonText?: string;

  /**
   * Custom text for the previous button. If not provided, defaults to 'Previous'.
   *
   * @default 'Previous'
   */
  previousButtonText?: string;

  /**
   * Whether to hide all default form buttons (submit, clear, cancel).
   * When true, only custom buttons will be displayed if provided.
   *
   * @default false
   */
  hideButtons?: boolean;

  /**
   * Array of custom buttons to add to the form. These buttons will appear
   * alongside or instead of the default buttons depending on configuration.
   * Each button can have custom styling, icons, and click handlers.
   *
   * @type Array<CustomButton>
   */
  customButtons?: Array<CustomButton>;
}

/**
 * Form validation error messages.
 *
 * @type ErrorMessage
 */
export type ErrorMessage =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'InvalidEmail'
  | 'invalidDate'
  | 'InvalidPattern'
  | 'customError';

/**
 * Type for action button variants.
 *
 * @type ActionButtonType
 */
export type ActionButtonType = 'submit' | 'next' | 'cancel' | 'clear' | 'previous' | 'ok';

/**
 * Interface for global form configuration options.
 * These settings apply to all forms in the application unless overridden locally.
 *
 * @interface GlobalConfig
 */
export interface GlobalConfig {
  /**
   * Custom error messages to use across all forms.
   */
  errorMessages?: Partial<Record<ErrorMessage, string>>;

  /**
   * Action buttons configuration to use across all forms.
   */
  buttons?: Partial<Record<ActionButtonType, Omit<CustomButton, 'action'>>>;
}
