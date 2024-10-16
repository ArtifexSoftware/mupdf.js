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

        page.delete("Im0")

        xrefObjs = page.getResourcesXrefObjects();

        for (var obj in xrefObjs) {
            console.log(xrefObjs[obj].key)
        }

        expect(xrefObjs[xrefObjs.length-1].key).toBe("Fm1");

    });
});