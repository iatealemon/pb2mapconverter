import fs from 'fs/promises';
import path from 'node:path';
import { expect, test } from 'vitest';

import convertPB2XMLFile from '#process.js';

test('Main testing entry point', async () => {
	const testMapDirectory = path.join(process.cwd(), 'src', '__tests__', 'maps');
	const testMap = path.join(testMapDirectory, 'nyove-bg.xml');

	// Read from sample PB2 maps..
	const fileContent = await fs.readFile(testMap, 'utf-8');

	const result = await convertPB2XMLFile(fileContent);

	console.log(result);
	expect(typeof result).toBe('string');
});
