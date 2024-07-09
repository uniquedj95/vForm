import { Component } from "vue";

export type FormValue = string | number | boolean | Option | Array<Option>;
export type FormValidator = (value: FormValue, schema: FormSchema) => Promise<Array<string> | null> | Array<string> | null;
export type ComputedValueHandler = (value: FormValue, schema: FormSchema) => Promise<any> | any;
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
  type: Component;
  label?: string;
  required?: boolean;
  options?: FormOptions;
  multiple?: boolean;
  min?: number;
  max?: number;
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
  allowUnknown?: boolean;
  allowCustom?: boolean;
  autoFocus?: boolean;
  validation?: FormValidator;
  onChange?: (value: FormValue) => FormValue;
  computedValue?: ComputedValueHandler;
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
