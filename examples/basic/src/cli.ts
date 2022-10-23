#!/usr/bin/env node

import { URL } from 'node:url';
import { type Answers as CreateAnswers, askFor, definePrompts, copyFile, copyFiles, required } from '@methodgrab/initializer-utils';

const prompts = definePrompts({
	foo: {
		type: 'string',
		message: 'Foo name?',
		validate: required(),
	},
	bar: {
		type: 'string',
		message: 'Bar name?',
		validate: required(),
	},
	baz: {
		type: 'string',
		message: 'Baz name?',
		default: 'default baz name',
	},
});

export type Answers = CreateAnswers<typeof prompts>;

try {
	const answers = await askFor(prompts);

	await copyFiles({
		from: new URL('../templates/base', import.meta.url),
		data: answers,
	});

	const bazFile = answers.baz === prompts.baz.default ? 'default' : 'custom';

	await copyFile({
		from: new URL(`../templates/baz/baz-${bazFile}.json`, import.meta.url),
		to: 'baz.json',
		data: answers,
	});
} catch (error) {
	const message = error instanceof Error ? error.message : 'Unknown error';
	// eslint-disable-next-line no-console
	console.error(message);
	process.exitCode = 1;
}
