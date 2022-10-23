import { ValidationResult } from './ask-for.js';
import { isString } from './lib/is.js';

/**
 * A function that validates prompt input.
 */
export type Validator = (value: string) => ValidationResult;

/**
 * Apply several validators to a prompt.
 *
 * Only the first error will be shown.
 *
 * @param validators - The validator functions.
 * @returns A single validator function composed from the array of validators.
 *
 * @example
 * validateAll([ required(), maxLength(5) ])
 */
export const validateAll = (validators: Validator[]): Validator =>
	value => validators.map(f => f(value)).filter(isString)[0] || true;

/**
 * Create a custom prompt input validator.
 *
 * @param isValid - A function that returns `true` if the value is valid.
 * @param error - The error message to show when the value is not valid.
 * @returns A function that validates prompt input.
 */
export const validator = (isValid: (value: string) => boolean, error: string) =>
	(value: string): ValidationResult =>
		isValid(value) ? true : error;


// SPECIFIC VALIDATORS

/**
 * A validator that checks the value exists.
 *
 * @param error - A custom error message to show when the value does not exist.
 * @returns A function that validates prompt input.
 */
export const required = (error = 'Please enter a value.'): Validator =>
	minLength(1, error);

/**
 * A validator that checks the value's length is >= the specified `length`.
 *
 * This is an inclusive check so `minLength(3)('123') === true` (**valid**).
 *
 * @param length - The minimum length.
 * @param error - A custom error message to show when the value is >= `length`.
 * @returns A function that validates prompt input.
 */
export const minLength = (length: number, error?: string): Validator =>
	validator(value => value.length >= length, error || `Value must be greater than ${length}.`);

/**
 * A validator that checks the value's length is <= the specified `length`.
 *
 * This is an inclusive check so `maxLength(3)('123') === true` (**valid**).
 *
 * @param length - The maximum length.
 * @param error - A custom error message to show when the value is <= `length`.
 * @returns A function that validates prompt input.
 */
export const maxLength = (length: number, error?: string): Validator =>
	validator(value => value.length <= length, error || `Value must be less than ${length}.`);
