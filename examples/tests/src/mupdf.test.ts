import * as fs from 'fs';
import * as mupdf from 'mupdf';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('mupdf.js', () => {
    let document: mupdf.PDFDocument;
    let page: mupdf.PDFPage;

    beforeAll(async () => {
        const data = fs.readFileSync('./test.pdf');
        document = await mupdf.Document.openDocument(data, 'application/pdf') as mupdf.PDFDocument;
        page = await document.loadPage(2);
    });

    afterAll(() => {
        document.destroy();
        page.destroy();
    });

    // mupdf.Buffer.slice
    it('slice', () => {
        const buffer = new mupdf.Buffer();
        buffer.write('Hello, world!');
        const slicedBuffer = buffer.slice(7, -1);
        expect(slicedBuffer.asString()).toBe('world');
    });

    // PDFPage.toDisplayList().search()
    it('DisplayList.search()', async () => {
        const displayList = await page.toDisplayList();
        const searchResults = displayList.search('Welcome to the Node server test.pdf file.');
        console.log(searchResults);
        expect(searchResults.length).toBeGreaterThan(0);
    });
});
