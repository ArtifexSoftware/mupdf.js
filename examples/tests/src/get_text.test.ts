import * as fs from "fs";
import * as mupdfjs from "../../../dist/mupdfjs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "test.pdf");

describe('PDF get text tests', () => {

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

    it('should get all the text from a page', async () => {

        let page = document.loadPage(2)
        let text: string= page.getText()

        expect(text).toBe("Welcome to the Node server test.pdf file.\nSorry there is not much to see here!\n3\nPage 3 footer\n");

    });
});
