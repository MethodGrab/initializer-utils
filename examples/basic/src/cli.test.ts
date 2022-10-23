import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import anyTest, { TestFn } from 'ava';
import { fileExists, runCLI } from '@methodgrab/initializer-utils/testing';
import { Answers } from './cli.js';

const test = anyTest as TestFn<Context>;

type Context = {
	result: Awaited<ReturnType<typeof runCLI>>;
};

const answers: Answers = {
	foo: 'test-foo',
	bar: 'test-bar',
	baz: 'test-baz',
};

const run = async () =>
	await runCLI(new URL('../dist/cli.js', import.meta.url), {
		answers: Object.values(answers),
	});

test.before('Run the CLI', async t => {
	t.context.result = await run();
});

test.after.always('Clean up temp files', async t => {
	if (t.context.result && typeof t.context.result.cleanup === 'function') {
		await t.context.result.cleanup();
	}
});

test('it creates the expected files', async t => {
	const files = [
		'foo.json',
		'bar.json',
		'baz.json',
	];

	for (const file of files) {
		t.true(await fileExists(t.context.result.outputDir, file), `Could not find \`${file}\` in the output dir.`);
	}
});

test('it replaces the template variables in the files with the prompt answers', async t => {
	const foo = (await readFileJSON(outputFile(t.context, 'foo.json'))) as Record<string, unknown>;
	t.is(foo.name, answers.foo);

	const bar = (await readFileJSON(outputFile(t.context, 'bar.json'))) as Record<string, unknown>;
	t.is(bar.name, answers.bar);

	const baz = (await readFileJSON(outputFile(t.context, 'baz.json'))) as Record<string, unknown>;
	t.is(baz.name, answers.baz);
	t.is(baz.custom, true);
});

const outputFile = (context: Context, file: string): string =>
	join(context.result.outputDir, file);

const readFileString = async (path: string): Promise<string> =>
	await readFile(path, 'utf-8');

const readFileJSON = async (path: string): Promise<unknown> =>
	JSON.parse(await readFileString(path)) as unknown;
