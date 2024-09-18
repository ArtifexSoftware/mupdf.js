import * as fs from "fs";
import * as mupdfjs from "../../../dist/mupdfjs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const scriptdir = path.resolve(__dirname);
const imageData = fs.readFileSync(path.join(scriptdir, "..", "logo.png"));

describe('PDF insert image tests', () => {

    let document:mupdfjs.PDFDocument = mupdfjs.PDFDocument.createBlankDocument()
    let mupdfJSPage: mupdfjs.PDFPage;
    let logo:mupdfjs.Image;

    beforeEach(() => {    
      mupdfJSPage = new mupdfjs.PDFPage(document, document.loadPage(0))
      logo = new mupdfjs.Image(imageData);
    });
  
    afterEach(() => {
      document.destroy();
    });

    it('should insert an image on to the page', async () => {

        mupdfJSPage.insertImage({image:logo, name:"MyLogo"}, {x:0, y:0, width:200, height:200});

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