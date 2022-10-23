/**
 * Returns the elements of an array that meet the condition specified in an async callback function.
 *
 * @param array - The array to filter.
 * @param predicate - A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
 * @returns The filtered array.
 *
 * @example await filter([1, 2, 3], v => Promise.resolve(v > 2)) // [3]
 */
export const filter = async <T>(array: T[], predicate: (value: T, index: number, array: T[]) => Promise<boolean>): Promise<T[]> => {
	const reject = Symbol();

	const isNotRejected = <U>(item: U | typeof reject): item is U => item !== reject;

	return (
		(await Promise.all(
			array.map(async (value, index, array_) => (await predicate(value, index, array_)) ? value : reject),
		)).filter(isNotRejected)
	);
};
