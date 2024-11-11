import * as fs from "fs";
import * as mupdfjs from "../../../dist/mupdfjs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "test.pdf");


describe('Delete Xref tests', () => {

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

    it('should delete a page PDF object by xref reference', async () => {
        let page:mupdfjs.PDFPage = new mupdfjs.PDFPage(document, 0); 
        let xrefObjs:{key:string | number, value:string}[] = page.getResourcesXrefObjects();

        for (var obj in xrefObjs) {
            console.log(xrefObjs[obj].key)
        }

        expect(xrefObjs[xrefObjs.length-1].key).toBe("Im0");

        // note it doesn;t really delete the object - rather it sets it to a 1x1 transparent pixel
        // this test needs to update to check for the 1x1 transparent pixel
        page.delete("Im0")

        xrefObjs = page.getResourcesXrefObjects();

        expect(xrefObjs[xrefObjs.length-1].key).toBe("Im0");

    });
});