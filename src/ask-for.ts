import inquirer, { type Question as InquirerPrompt } from 'inquirer';

/** Non-specific prompts type. */
export type AnyPrompts = Record<string, Prompt>;

/** All possible prompt types. */
export type Prompt = StringPrompt;

/** A prompt that will return the users answer as a string. */
export type StringPrompt = {
	/** The prompt type. */
	type: 'string';
	/** The message to show to the user on the command line. */
	message: string;
	/** A default value to use if the user does not select one. Returning `undefined` is the same as not specifying a default. */
	// TODO: Ideally this would return the fully typed, but partial, answers intead of AnyAnswers.
	default?: string | ((answers: AnyAnswers) => string | undefined);
	/** Validate the users answer. It should return `true` if valid, an error message string to display to the user if invalid. */
	validate?: (value: string) => ValidationResult;
};

/** `true` if valid, an error message string to display to the user if invalid. */
export type ValidationResult = true | string;

/** Non-specific answers type. */
export type AnyAnswers = Record<string, string>;

/** Specific answers type. */
export type Answers<Prompts extends AnyPrompts> = {
	[P in keyof Prompts]: Answer<Prompts[P]>;
};

export type Answer<P extends Prompt> =
	P extends { type: 'string' }
		? string
		: never;

/**
 * A helper function for defining prompts so that you get autocompletions and type checking. Useful when storing them as an intermediate variable instead of passing them directly to `askFor`.
 *
 * @example
 * import { type Answers as CreateAnswers, askFor, definePrompts } from '@methodgrab/initializer-utils';
 * const prompts = definePrompts({ foo: { type: 'string', message: 'Foo?' });
 * export type Answers = CreateAnswers<typeof prompts>;
 * const answers = await askFor(prompts);
 */
export const definePrompts = <Prompts extends AnyPrompts>(prompts: Prompts): Prompts =>
	prompts;

/**
 * Ask the user for some input.
 * These will be displayed as interactive prompts.
 *
 * @param prompts - The questions to ask the user for.
 * @returns The users answers.
 */
export const askFor = async <Prompts extends AnyPrompts>(prompts: Prompts): Promise<Answers<Prompts>> => {
	const answers = await inquirer.prompt(toInquirerPrompts(prompts));
	// TODO: dont cast
	return answers as Answers<Prompts>;
};

const toInquirerPrompts = <Prompts extends AnyPrompts>(prompts: Prompts): InquirerPrompt[] => {
	const inquirerPrompts: InquirerPrompt[] = [];

	for (const name in prompts) {
		const prompt = prompts[name];

		if (prompt) {
			inquirerPrompts.push({
				type: toInquirerPromptType(prompt),
				name,
				message: prompt.message,
				default: prompt.default,
				validate: prompt.validate,
			});
		}
	}

	return inquirerPrompts;
};

const toInquirerPromptType = (prompt: Prompt): string => {
	switch (prompt.type) {
		case 'string':
			return 'input';
	}
};
