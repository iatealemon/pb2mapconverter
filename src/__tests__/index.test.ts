import fs from 'fs/promises';
import path from 'node:path';
import { expect, test } from 'vitest';
import { parseStringPromise } from 'xml2js';

import convertPB2XMLFile from '#convert.js';

test('Main testing entry point', async () => {
    const testMapDirectory = path.join(process.cwd(), 'src', '__tests__', 'maps');
    const testMap = path.join(testMapDirectory, 'nyove-simple.xml');

    // Read from sample PB2 maps..
    const fileContent = await fs.readFile(testMap, 'utf-8');

    // Try to parse as XML (i disabled ESlint here cause.. it's an unknown data structure..)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const xmlFile = await parseStringPromise(fileContent);

    expect(convertPB2XMLFile(xmlFile)).toBe('stub');
});
