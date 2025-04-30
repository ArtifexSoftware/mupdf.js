import * as fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as mupdf from "mupdf";
import * as tasks from "../mupdfjs.ts";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "..", "resources", "test.pdf");


describe('Delete Xref tests', () => {

    let document: mupdf.PDFDocument;

    beforeEach(() => {
        const data = fs.readFileSync(filename);
        document = mupdf.PDFDocument.openDocument(data, "application/pdf")
    });
 
    afterEach(() => {
      document.destroy();
    });

    it('should delete a page PDF object by xref reference', async () => {
        let page = document.loadPage(0);
        let xrefObjs:{key:string | number, value:string}[] = tasks.getPageResourcesXObjects(page);

        for (var obj in xrefObjs) {
            console.log(xrefObjs[obj].key)
        }

        expect(xrefObjs[xrefObjs.length-1].key).toBe("Im0");

        // note it doesn;t really delete the object - rather it sets it to a 1x1 transparent pixel
        // this test needs to update to check for the 1x1 transparent pixel
        tasks.deletePageResourcesXObject(document, page, "Im0")

        xrefObjs = tasks.getPageResourcesXObjects(page);

        expect(xrefObjs[xrefObjs.length-1].key).toBe("Im0");

    });
});
