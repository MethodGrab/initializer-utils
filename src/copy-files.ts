import { relative, join } from 'node:path';
import { URL } from 'node:url';
import { copyAndModify, getFilesRecursively, normalizePath } from './lib/fs.js';
import { template, TemplateVars } from './lib/template.js';

/**
 * Copy files recursively from a directory to the directory the initializer was run in.
 *
 * In all files, variables deliminated by pairs of curly braces will be replaced with the corresponding value in the `data` object.
 *
 * @param options - The options. `options.from` should be a directory path.
 *
 * @example
 * copyFiles({ from: new URL('../templates', import.meta.url), data: { foo: 'bar' } })
 * // Assuming a file called templates/example.json looked something like this:
 * // { "foo": "{{ foo }}" }
 * // It would be transformed like so:
 * // { "foo": "bar" }
 * // Note the whitespace inside the variable is optional, you can write it as `{{ foo }}`, `{{foo}}`, `{{    foo    }}`, etc.
 */
export const copyFiles = async <TemplateVarsT extends TemplateVars>(options: {
	/** The source directory. */
	from: URL | string;
	/** The dictionary of template data. */
	data?: TemplateVarsT | null;
}): Promise<void> => {
	const normalizedFrom = normalizePath(options.from);
	const templateFiles = (await getFilesRecursively(options.from))
		.map(file => relative(normalizedFrom, file));

	const templateTasks = templateFiles.map(filePath =>
		copyFile({
			from: join(normalizedFrom, filePath),
			to: filePath,
			data: options.data || null,
		}),
	);

	await Promise.all(templateTasks);
};

/**
 * Copy a single file to a path inside the directory the initializer was run in.
 *
 * In the file, variables deliminated by pairs of curly braces will be replaced with the corresponding value in the `data` object.
 *
 * @param options - The options. Both `options.from` and `options.to` should be **file** paths.
 *
 * @example
 * copyFile({ from: new URL(`../templates/license/LICENSE-${answers.license}`, import.meta.url), to: 'LICENSE', data: { currentYear: 2022 } })
 * // Assuming `answers.license = 'FOO'` and a file called templates/license/LICENSE-FOO looked something like this:
 * // Copyright (c) {{ currentYear }}
 * // It would be transformed like so:
 * // Copyright (c) 2022
 * // Note the whitespace inside the variable is optional, you can write it as `{{ currentYear }}`, `{{currentYear}}`, `{{    currentYear    }}`, etc.
 */
export const copyFile = async <TemplateVarsT extends TemplateVars>(options: {
	/** The source file. */
	from: URL | string;
	/** The target file inside the directory the initializer was run in. */
	to: string;
	/** The dictionary of template data. */
	data?: TemplateVarsT | null;
}): Promise<void> => {
	return await copyAndModify({
		from: normalizePath(options.from),
		to: join(process.cwd(), normalizePath(options.to)),
		mapper: fileData =>
			options.data
				? template(fileData.toString(), options.data)
				: fileData,
	});
};
