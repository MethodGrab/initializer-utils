export type TemplateVars = Record<string, string>;

/**
 * Basic template variable replacement.
 *
 * **This is not safe to use on untrusted data!**
 *
 * @param value - Source string to apply replacements to.
 * @param data - Map of replacement variables and data.
 * @returns Modified source string.
 *
 * @example
 * template('{{foo}} bar {{ foo }} {{baz}} qux {{foobar}}', { foo: 'A', baz: 'B' })
 * // 'A bar A B qux {{foobar}}'
 */
export const template = (value: string, data: TemplateVars): string =>
	// TODO: This is probably not very efficient.
	Object.entries(data).reduce((acc, [name, replacement]): string =>
		acc.replaceAll(new RegExp(`{{\\s*${name}\\s*}}`, 'g'), replacement)
	, value);
