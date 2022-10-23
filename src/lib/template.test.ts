import test from 'ava';
import { template } from './template.js';

test('does not change strings without template variables', t => {
	t.is(template('Lorem ipsum dolor sit.', { dolor: 'ammet' }), 'Lorem ipsum dolor sit.');
	t.is(template('Lorem ipsum {dolor} sit.', { dolor: 'ammet' }), 'Lorem ipsum {dolor} sit.');
});

test('does not change template strings if there is no data', t => {
	t.is(template('Lorem ipsum dolor sit.', { foo: 'foo-value' }), 'Lorem ipsum dolor sit.');
	t.is(template('Lorem ipsum {{dolor}} sit.', { foo: 'foo-value' }), 'Lorem ipsum {{dolor}} sit.');
});

test('replaces the variable with its value from the supplied `data` object', t => {
	t.is(template('Lorem ipsum {{dolor}} sit.', { dolor: 'ammet' }), 'Lorem ipsum ammet sit.');
});

test('replaces the same template variable many times', t => {
	t.is(template('Lorem ipsum {{dolor}} sit {{dolor}}.', { dolor: 'ammet' }), 'Lorem ipsum ammet sit ammet.');
});

test('supports multiple variable names', t => {
	t.is(template('Lorem ipsum {{dolor}} sit ammet, {{consectetur}}.', { dolor: 'sed', consectetur: 'do' }), 'Lorem ipsum sed sit ammet, do.');
});

test('supports variables **without** whitespace: {{var}}', t => {
	t.is(template('Lorem ipsum {{dolor}} sit.', { dolor: 'ammet' }), 'Lorem ipsum ammet sit.');
});

test('supports variables **with** whitespace: {{ var }}', t => {
	t.is(template('Lorem ipsum {{ dolor }} sit.', { dolor: 'ammet' }), 'Lorem ipsum ammet sit.');
});
