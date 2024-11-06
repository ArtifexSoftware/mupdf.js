import * as fs from "fs";
import * as mupdfjs from "../../../dist/mupdfjs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "test.pdf");

describe('PDF split tests', () => {

    let document: mupdfjs.PDFDocument;

    beforeEach(async () => {
        const data = fs.readFileSync(filename);
        document = (await mupdfjs.PDFDocument.openDocument(
            data,
            "application/pdf"
        )) as mupdfjs.PDFDocument;
    });
  
    afterEach(() => {
      document.destroy();
    });

    it('should split the document into two documents of 2 pages (0,1) and 1 page (2)', async () => {

        let split:mupdfjs.PDFDocument[] = document.split([0,2])

        expect(split.length).toBe(2);

        let docA:mupdfjs.PDFDocument = split[0];
        let docB:mupdfjs.PDFDocument = split[1];

        let countA:number = docA.countPages()
        expect(countA).toBe(2);

        let countB:number = docB.countPages()
        expect(countB).toBe(1);

    });
});
