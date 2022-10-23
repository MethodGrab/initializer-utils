import { stat, readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { filter } from './async/array.js';

export const normalizePath = (path: URL | string): string =>
	path instanceof URL ? fileURLToPath(path) : path;

const isDirectory = async (path: string): Promise<boolean> =>
	(await stat(path)).isDirectory();

const isFile = async (path: string): Promise<boolean> =>
	(await stat(path)).isFile();

const getDirectories = async (path: string): Promise<string[]> =>
	filter(
		(await readdir(path)).map(name => join(path, name)),
		isDirectory,
	);

const getFiles = async (path: string) =>
	filter(
		(await readdir(path)).map(name => join(path, name)),
		isFile,
	);

export const getFilesRecursively = async (path: URL | string): Promise<string[]> => {
	const normalizedPath = normalizePath(path);

	return (await Promise.all((await getDirectories(normalizedPath))
		.map(async dir => await getFilesRecursively(dir))))
		.flat()
		.concat(await getFiles(normalizedPath));
};

export const copyAndModify = async (options: { from: string; to: string; mapper: (fileData: Buffer) => Buffer | string }): Promise<void> => {
	const file = await readFile(options.from);
	await mkdirp(dirname(options.to));
	return await writeFile(options.to, options.mapper(file));
};

export const mkdirp = async (dirPath: string): Promise<void> => {
	await mkdir(dirPath, { recursive: true });
};
