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
export type ComputedValueHandler = (value: FormValue, schema: FormSchema) => Promise<any> | any;

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
   */
  schema: FormSchema;

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
   */
  steps: Record<string, FormData>;

  /**
   * Computed data for each step, mapped by step ID.
   */
  computedSteps: Record<string, ComputedData>;

  /**
   * Combined form data from all steps.
   */
  allFormData: FormData;

  /**
   * Combined computed data from all steps.
   */
  allComputedData: ComputedData;
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
 * Represents a form field with various properties to define its behavior and appearance.
 *
 * @interface FormField
 */
export interface FormField {
  /**
   * The current value of the form input field.
   *
   * @type FormValue
   */
  value?: FormValue;

  /**
   * The type of input for the form input field.
   *
   * @type InputType
   */
  type: InputType;

  /**
   * The label for the form input field.
   *
   * @type string
   */
  label?: string;

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
  onChange?: (value: FormValue, schema: FormSchema) => FormValue;

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
   * When to show the description.
   * - 'onChecked': Only display when the option is selected.
   * - 'always': Always display the description.
   */
  show?: 'onChecked' | 'always';

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
  | 'RadioInput';

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
   * The color theme of the button.
   */
  color?: 'primary' | 'warning' | 'danger' | 'secondary' | 'light';

  /**
   * The function to execute when the button is clicked.
   */
  action: () => void;
}
