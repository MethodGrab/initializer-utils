import test from 'ava';
import { maxLength, minLength, required, validateAll } from './validation.js';

test('validateAll - returns the first error, if there is one', t => {
	const requiredError = 'Please enter a value.';
	const maxLengthError = 'Value must be <= specified length.';
	const validator = validateAll([ required(requiredError), maxLength(5, maxLengthError) ]);

	t.is(validator(''), requiredError);
	t.is(validator('123456'), maxLengthError);
	t.is(validator('12345'), true);
});

test('required - must have a value', t => {
	const error = 'Please enter a value.';

	t.is(required(error)(''), error);

	t.is(required(error)('0'), true);
	t.is(required(error)('foo'), true);
});

test('minLength - must be >= specified length', t => {
	const error = 'Value must be >= specified length.';

	t.is(minLength(1, error)(''), error);
	t.is(minLength(1, error)('1'), true);

	t.is(minLength(5, error)('1234'), error);
	t.is(minLength(5, error)('12345'), true);
	t.is(minLength(5, error)('123456'), true);
});

test('maxLength - must be <= specified length', t => {
	const error = 'Value must be <= specified length.';

	t.is(maxLength(1, error)('12'), error);
	t.is(maxLength(1, error)('1'), true);

	t.is(maxLength(5, error)('1234'), true);
	t.is(maxLength(5, error)('12345'), true);
	t.is(maxLength(5, error)('123456'), error);
});
