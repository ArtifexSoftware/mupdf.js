import * as fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as mupdf from "mupdf";
import * as tasks from "../mupdfjs.ts";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "..", "resources", "test.pdf");

describe('PDF split tests', () => {

    let document: mupdf.PDFDocument;

    beforeEach(() => {
        const data = fs.readFileSync(filename);
        document = mupdf.PDFDocument.openDocument(data, "application/pdf")
    });
  
    afterEach(() => {
      document.destroy();
    });

    it('should split the document into two documents of 2 pages (0,1) and 1 page (2)', async () => {

        let split:mupdf.PDFDocument[] = tasks.split(document, [0,2])

        expect(split.length).toBe(2);

        let docA:mupdf.PDFDocument = split[0];
        let docB:mupdf.PDFDocument = split[1];

        let countA:number = docA.countPages()
        expect(countA).toBe(2);

        let countB:number = docB.countPages()
        expect(countB).toBe(1);

    });
});
