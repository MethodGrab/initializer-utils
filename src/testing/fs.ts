import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { normalizePath } from '../lib/fs.js';

/**
 * Check if a file exists.
 *
 * @param outputDir - The directory the CLI was run in.
 * @param filePath - The file to check exists.
 * @returns `true` if the file does exist, `false` if it does not.
 *
 * @example
 * const { outputDir } = await runCLI(new URL('../dist/cli.js', import.meta.url));
 * fileExists(outputDir, 'README.md');
 */
export const fileExists = async (outputDir: URL | string, filePath: string): Promise<boolean> => {
	try {
		await access(join(normalizePath(outputDir), filePath));
		return true;
	} catch (error) {
		return false;
	}
};
