/**
 * Shared constants and default values for form components
 */

/**
 * Default fill style for input components
 */
export const DEFAULT_FILL = 'outline';

/**
 * Default label placement for input components
 */
export const DEFAULT_LABEL_PLACEMENT = 'stacked';

/**
 * Default error messages for validation
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_DATE: 'Please enter a valid date',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  PATTERN_MISMATCH: 'Input format is not valid',
} as const;

/**
 * Default date pattern
 */
export const DEFAULT_DATE_PATTERN = 'DD/MMM/YYYY';

/**
 * Default icon size
 */
export const DEFAULT_ICON_SIZE = 24;

/**
 * Common CSS classes for form styling
 */
export const FORM_CSS_CLASSES = {
  FLEX_END: 'flex-end-buttons',
  FLEX_BETWEEN: 'flex-between',
  MARGIN_VERTICAL: 'ion-margin-vertical',
  MARGIN_BOTTOM: 'ion-margin-bottom',
  MARGIN_END: 'ion-margin-end',
} as const;
