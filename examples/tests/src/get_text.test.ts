import * as fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as mupdf from "mupdf";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "..", "resources", "test.pdf");

describe('PDF get text tests', () => {

    let document: mupdf.PDFDocument;

    beforeEach(() => {
        const data = fs.readFileSync(filename);
        document = mupdf.PDFDocument.openDocument(data, "application/pdf")
    });
  
    afterEach(() => {
      document.destroy();
    });

    it('should get all the text from a page', async () => {

	let page = document.loadPage(2)
	let text = page.toStructuredText().asText()

        expect(text).toBe("Welcome to the Node server test.pdf file.\n\nSorry there is not much to see here!\n\n3\n\nPage 3 footer\n\n");

    });
});
