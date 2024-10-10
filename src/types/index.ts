export type FormValue = string | number | boolean | Option | Array<Option>;
export type FormValidator = (
  value: FormValue,
  schema?: FormSchema
) => Promise<Array<string> | null> | Array<string> | null;
export type ComputedValueHandler = (
  value: FormValue,
  schema: FormSchema
) => Promise<any> | any;
export type FormOptions = Array<Option> | (() => Promise<Array<Option>>);
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

export interface FormField {
  value?: FormValue;
  type: InputType;
  label?: string;
  required?: boolean;
  options?: FormOptions;
  multiple?: boolean;
  min?: number | string;
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
   * Indicates if a character counter should be displayed.
   * 
   * @type boolean
   */
  counter?: boolean;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  hidden?: boolean;
  grid?: GridSize;
  placeholder?: string;
  icon?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  pattern?: string;
  autoFocus?: boolean;
  fill?: "solid" | "outline";
  labelPlacement?: "stacked" | "start" | "end" | "fixed" | "floating";
  validation?: FormValidator;
  onChange?: (value: FormValue) => FormValue;
  computedValue?: ComputedValueHandler;
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
  | "TextArea"

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
  | "week"


export interface CustomButton {
  label: string;
  icon: string;
  fill?: "solid" | "outline";
  color?: "primary" | "warning" | "danger" | "secondary" | "light";
  action: () => void;
}