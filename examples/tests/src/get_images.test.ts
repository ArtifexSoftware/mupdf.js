import * as fs from "fs";
import * as mupdfjs from "../../../dist/mupdfjs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "test.pdf");

describe('PDF get images tests', () => {

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

    it('should get an array of images from the page', async () => {

        let page = new mupdfjs.PDFPage(document, 0)
        let images: {bbox:mupdfjs.Rect, matrix:mupdfjs.Matrix, image:mupdfjs.Image}[] = page.getImages()

        expect(images.length).toBe(1);

    });
});
