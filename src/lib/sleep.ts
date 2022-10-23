/** Pause for a specified amount of time before continuing. */
export const sleep = (ms: number): Promise<void> =>
	new Promise(resolve => setTimeout(resolve, ms));
