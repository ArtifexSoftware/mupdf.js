import * as fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as mupdf from "mupdf";
import * as tasks from "../mupdfjs.ts";

const scriptdir = path.resolve(__dirname);
const imageData = fs.readFileSync(path.join(scriptdir, "..", "resources", "logo.png"));

describe('PDF insert image tests', () => {

    let document:mupdf.PDFDocument = tasks.createBlankDocument()
    let mupdfJSPage: mupdf.PDFPage;
    let logo:mupdf.Image;

    beforeEach(() => {    
      mupdfJSPage = document.loadPage(0);
      logo = new mupdf.Image(imageData);
    });
  
    afterEach(() => {
      document.destroy();
    });

    it('should insert an image on to the page', async () => {

        tasks.insertImage(document, mupdfJSPage, {image:logo, name:"MyLogo"}, {x:0, y:0, width:200, height:200});

        mupdfJSPage.toStructuredText("preserve-images").walk({
            onImageBlock(bbox, transform, image) {
                // Image found!
                console.log(`onImageBlock, bbox=${bbox}, transform=${transform}, image=${image}`);
                expect(bbox[0] == 0);
                expect(bbox[1] == 0);
                expect(bbox[2] == 200);
                expect(bbox[3] == 200);
            }
        })

    });
});
