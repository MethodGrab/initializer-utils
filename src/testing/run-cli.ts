import { rm } from 'node:fs/promises';
import { execa } from 'execa';
import { temporaryDirectory } from 'tempy';
import { normalizePath } from '../lib/fs.js';
import { sleep } from '../lib/sleep.js';

/**
 * A helper for running an initializer CLI programatically, e.g. in tests.
 *
 * If your initializer prompts for answers, you can specify the answers you want to run it with in `options.answers`.
 *
 * Note: The time it takes for the CLI to respond to answers can vary depending on the environment running the tests (available resources, processor, memory, shell).
 * If the CLI is not running as expected try increasing the value of `options.timeout`.
 *
 * @param binPath - The path to the CLI binary.
 * @param options - Additional options.
 *
 * @example
 * runCLI(new URL('../dist/cli.js', import.meta.url), { answers: ['foo', 'bar', 'baz'] })
 */
export const runCLI = async (binPath: URL | string, options: {
	/** The prompt answers. After each one the Enter key will be automatically "pressed". */
	answers?: string[];
	/** Other arguments needed by the binary script. */
	arguments?: string[];
	/** The directory to run the initializer CLI in. If not specified, a temp directory will be created for you. */
	outputDir?: URL | string;
	/**
	 * The interval to wait (in milliseconds) between answers for the CLI to respond.
	 *
	 * @default 250
	 */
	timeout?: number;
} = {}): Promise<{
	/**
	 * Call this function to clean up (delete) the temp directory.
	 * This function is only available if you did **not** specify `options.outputDir` so a temp directory was created for you.
	 * If you did specify `options.outputDir`, `cleanup` will be `undefined`.
	 */
	// TODO: ideally the type of `cleanup` would only be `undefined` if `options.outputDir` was specified.
	cleanup: (() => Promise<void>) | undefined;
	/** The directory where the initializer CLI was run. It will either be the same value as `options.outputDir` or the path to the temp directory that was created. */
	outputDir: string;
	/** stdout from the running the CLI. */
	stdout: string | null;
}> => {
	const originalCwd = process.cwd();

	try {
		const { tempDir, outputDir } = getDirs(options.outputDir);
		const answers = options.answers ? insertAfterEach(options.answers, ENTER) : undefined;
		const timeout = options.timeout ?? 250;

		process.chdir(outputDir);

		const cliProcess = execa(normalizePath(binPath), options.arguments);
		cliProcess.stdin?.setDefaultEncoding('utf-8');

		let errored = false;

		void cliProcess.on('error', () => {
			errored = true;
		});

		cliProcess.stderr?.once('data', () => {
			errored = true;
		});

		if (answers && answers.length > 0) {
			for (const answer of answers) {
				if (!errored) {
					cliProcess.stdin?.write(answer);
					await sleep(timeout);
				}
			}

			cliProcess.stdin?.end();
		}

		const result = await cliProcess;
		const stderr = result.stderr === '' ? null : result.stderr;

		if (stderr !== null) {
			throw new RunCLIError({ stderr });
		}

		return {
			outputDir,
			stdout: result.stdout,
			cleanup: tempDir
				? () => cleanupTempDir(tempDir)
				: undefined,
		};
	} finally {
		process.chdir(originalCwd);
	}
};

export class RunCLIError extends Error {
	error: unknown;
	stderr: unknown;

	constructor({ error, stderr }: { error?: unknown; stderr?: unknown }) {
		super('Failed to run the CLI.');
		this.error = error;
		this.stderr = stderr;
	}
}

/** Key code for the `Enter` key. */
export const ENTER = '\x0D';

const getDirs = (outputDir: string | URL | undefined) => {
	if (outputDir) {
		return { outputDir: normalizePath(outputDir), tempDir: undefined };
	} else {
		const tempDir = temporaryDirectory();
		return { outputDir: tempDir, tempDir };
	}
};

const cleanupTempDir = async (tempDir: string): Promise<void> =>
	await rm(tempDir, { recursive: true, force: true });

/**
 * Insert something after each value in an array.
 *
 * @example insertAfterEach([ 1, 2, 3 ], 0) // [ 1, 0, 2, 0, 3, 0 ]
 */
const insertAfterEach = <T>(array: T[], separator: T): T[] =>
	array.reduce((acc: T[], a: T) => [...acc, a, separator], []);
