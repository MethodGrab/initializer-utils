import test from 'ava';
import { sleep } from '../sleep.js';
import { filter } from './array.js';

test('correctly applies the predicate function', async t => {
	t.deepEqual(
		await filter([1, 2, 3, 4, 5], v => Promise.resolve(v > 2)),
		[3, 4, 5],
	);
});

test('waits for the filter callback to asynchronously resolve', async t => {
	t.deepEqual(
		await filter([1, 2, 3, 4, 5], v => sleep(1000).then(() => v > 2)),
		[3, 4, 5],
	);
});
