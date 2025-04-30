import * as fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as mupdf from "mupdf";
import * as tasks from "../mupdfjs.ts";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "..", "resources", "test.pdf");

describe('PDF get images tests', () => {

    let document: mupdf.PDFDocument;

    beforeEach(() => {
        const data = fs.readFileSync(filename);
        document = mupdf.PDFDocument.openDocument(data, "application/pdf")
    });
  
    afterEach(() => {
      document.destroy();
    });

    it('should get an array of images from the page', async () => {

        let page = document.loadPage(0)
        let images: {bbox:mupdf.Rect, matrix:mupdf.Matrix, image:mupdf.Image}[] = tasks.getPageImages(page)

        expect(images.length).toBe(1);

    });
});
