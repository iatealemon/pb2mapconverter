// Runs the Express JS web server backend.
// Handles POST request to /upload for file conversion.
// https://medium.com/@gabrieldrouin/node-js-2025-guide-how-to-setup-express-js-with-typescript-eslint-and-prettier-b342cd21c30d#2245

import type { Request, Response } from 'express';
import type { Multer } from 'multer';

import express from 'express';
import fs from 'fs/promises';
import multer from 'multer';
import { parseStringPromise } from 'xml2js';

import convertPB2XMLFile from '#convert.js';

const app = express();
const port = process.env.PORT ?? '9001';

const upload: Multer = multer({ storage: multer.memoryStorage() });

// This is a static web application.

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});

// API endpoint to handle conversion..
app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        // Type guard for file
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Read the file content
        const fileContent = req.file.buffer.toString('utf-8');

        // Try to parse as XML (i disabled ESlint here cause.. it's an unknown data structure..)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const xmlFile: Record<string, any> = (await parseStringPromise(fileContent)) as Record<string, any>;

        // Process the PB2 XML file into PB3 source code in a form of a string (may fail)
        const result = convertPB2XMLFile(xmlFile);

        if (!result) {
            return res.status(400).json({
                details: 'Error encountered when converting file.',
                error: 'Invalid XML file',
            });
        }

        // If parsing succeeds, it's valid XML
        return res.json({
            data: result,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(400).json({
            details: errorMessage,
            error: 'Invalid XML file',
        });
    }
});
