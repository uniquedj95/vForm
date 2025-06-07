export type FormValue = 
  | string 
  | number 
  | boolean 
  | Option 
  | Array<Option>;

export type FormValidator = (
  value: FormValue,
  schema?: FormSchema
) => Promise<Array<string> | null> | Array<string> | null;

export type ComputedValueHandler = (
  value: FormValue,
  schema: FormSchema
) => Promise<any> | any;

/**
 * Represents a paginated set of options.
 */
export interface PaginatedOptions {
  options: Array<Option>;
  total?: number;
}

/**
 * Represents the options for a form, which can be either an array of `Option` objects
 * or a function that returns paginated options or an array of options.
 *
 * The function can optionally take a `filter` string and a `page` number as parameters.
 */
export type FormOptions = Array<Option> | ((
  filter?: string,
  page?: number,
) => PaginatedOptions | Promise<PaginatedOptions> | Array<Option> | Promise<Array<Option>>);

export type FormData = Record<string, FormValue | undefined>;
export type ComputedData = Record<string, any>;
export type FormSchema = Record<string, FormField>;

export interface GridSize {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
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
  fill?: "solid" | "outline";

  /**
   * The position of the label for the form input field.
   *
   * @type "stacked" | "start" | "end" | "fixed" | "floating"
   */
  labelPlacement?: "stacked" | "start" | "end" | "fixed" | "floating";

  /**
   * The position of the options for select-type form input fields.
   *
   * @type "popover" | "action-sheet" | "alert"
   */
  interface?: "popover" | "action-sheet" | "alert";

  /**
   * The children form fields for the repeat-type form input field.
   *
   * @type FormSchema
   */
  children?: FormSchema;

  /**
   * The custom validation function for the form input field.
   *
   * @type FormValidator
   */
  validation?: FormValidator;

  /**
   * The custom function for listening to changes in the form input field.
   *
   * @type ComputedValueHandler
   */
  onChange?: (value: FormValue) => FormValue;

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

export interface OptionDescription {
  color: "primary" | "warning" | "danger" | "secondary" | "light";
  show?: "onChecked" | "always";
  text: string;
}

export interface Option {
  label: string;
  value: string | number;
  other?: any;
  isChecked?: boolean;
  disabled?: boolean;
  description?: OptionDescription;
}

export type InputType =
  | "TextInput"
  | "DateInput"
  | "NumberInput"
  | "EmailInput"
  | "PasswordInput"
  | "SelectInput"
  | "TextAreaInput"
  | "RepeatInput"
  | "CheckboxInput"

export type BaseFieldTypes =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "time"
  | "month"
  | "week";

export interface CustomButton {
  label: string;
  icon: string;
  fill?: "solid" | "outline";
  color?: "primary" | "warning" | "danger" | "secondary" | "light";
  action: () => void;
}
