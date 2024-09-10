// Copyright (C) 2024 Artifex Software, Inc.
//
// This file is part of MuPDF.js library.
//
// MuPDF is free software: you can redistribute it and/or modify it under the
// terms of the GNU Affero General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// MuPDF is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// along with MuPDF. If not, see <https://www.gnu.org/licenses/agpl-3.0.en.html>
//
// Alternative licensing terms are available from the licensor.
// For commercial licensing, see <https://www.artifex.com/> or contact
// Artifex Software, Inc., 39 Mesa Street, Suite 108A, San Francisco,
// CA 94129, USA, for further information.

import * as mupdf from "mupdf";

export class PDFDocument extends mupdf.PDFDocument {

    // creates a new blank document with one page and adds a font resource, default size is A4 @ 595x842
    static createBlankDocument(w:number = 595, h:number = 842): mupdf.PDFDocument {
        let pdfDocument = new mupdf.PDFDocument()
        let helvetica = pdfDocument.newDictionary();
        helvetica.put("Type", pdfDocument.newName("Font"));
        helvetica.put("Subtype", pdfDocument.newName("Type1"));
        helvetica.put("Name", pdfDocument.newName("Helv"));
        helvetica.put("BaseFont", pdfDocument.newName("Helvetica"));
        helvetica.put("Encoding", pdfDocument.newName("WinAnsiEncoding"));
        let fonts = pdfDocument.newDictionary();
        fonts.put("Helv", helvetica);
        let resources = pdfDocument.addObject(pdfDocument.newDictionary());
        resources.put("Font", fonts);

        let pageObj = pdfDocument.addPage([0,0,w,h], 0, resources, "BT /Helv ET")
        pdfDocument.insertPage(-1, pageObj)

        return pdfDocument
    }

    static override openDocument(from: mupdf.Buffer | ArrayBuffer | Uint8Array | mupdf.Stream, magic: string): PDFDocument {
        const doc = mupdf.Document.openDocument(from, magic);
        if (doc instanceof mupdf.PDFDocument) {
            return new PDFDocument(doc.pointer);
        }
        throw new Error("Not a PDF document");
    }

    copyPage(pno: number, to: number = -1): void {
        if (!this.isPDF()) {
            throw new Error("This operation is only available for PDF documents.");
        }
    
        const pageCount = this.countPages();
        if (pno < 0 || pno >= pageCount || to < -1 || to >= pageCount) {
            throw new Error("bad page number");
        }
    
        let before = 1;
        if (to === -1) {
            to = pageCount - 1;
            before = 0;
        }
    
        const sourcePageObj = this.findPage(pno);
        
        if (before) {
            this.insertPage(to, sourcePageObj);
        } else {
            this.insertPage(to + 1, sourcePageObj);
        }
    }

    newPage(pno: number = -1, width: number = 595, height: number = 842): mupdf.PDFPage {
        if (width <= 0 || height <= 0) {
          throw new Error("Invalid page dimensions: width and height must be positive numbers");
        }
      
        const pageCount = this.countPages();
        if (pno > pageCount) {
          throw new Error(`Invalid page number: ${pno}. The document has only ${pageCount} pages.`);
        }
      
        const insertPosition = (pno < 0 || pno > pageCount) ? pageCount : pno;
      
        const mediabox: [number, number, number, number] = [0, 0, width, height];
        const newPageObj = this.addPage(mediabox, 0, this.newDictionary(), "");
      
        this.insertPage(insertPosition, newPageObj);
        return this.loadPage(insertPosition);
      }

}

export class Image extends mupdf.Image {

}

export class PDFPage extends mupdf.PDFPage {

    constructor(doc: mupdf.PDFDocument, page: mupdf.PDFPage) {
        super(doc, page.pointer)
	}

    insertText(value:string, 
               point: [number, number], 
               fontName:string = "Times-Roman", 
               fontSize:number = 18,
               graphics: {strokeColor:[number,number,number,number], 
                       fillColor:[number,number,number,number],
                       strokeThickness:number} = {strokeColor:[0,0,0,1], fillColor:[0,0,0,1], strokeThickness:1}) {
        let doc = this._doc
        let page = this
        let page_obj = page.getObject()
        let font = doc.addSimpleFont(new mupdf.Font(fontName))

        // add object to page/Resources/XObject/F1 dictionary (creating nested dictionaries as needed)
        var resources = page_obj.get("Resources")
        if (!resources.isDictionary())
            page_obj.put("Resources", resources = doc.newDictionary())

        var res_font = resources.get("Font")
        if (!res_font.isDictionary())
            resources.put("Font", res_font = doc.newDictionary())

        res_font.put("F1", font)

        // format this for the PDF markup language

        // this guards against people not sending through the complete parameter set in their "graphics" object 
        // i.e. maybe they send just one or two of them, not all three
        if (graphics.strokeColor == undefined) {
            graphics.strokeColor = [0,0,0,1]
        }

        if (graphics.fillColor == undefined) {
            graphics.fillColor = [0,0,0,1]
        }

        if (graphics.strokeThickness == undefined) {
            graphics.strokeThickness = 1
        }

        let strokeColor:string = graphics.strokeColor[0] + " " + graphics.strokeColor[1] + " " + graphics.strokeColor[2] + " RG"
        let fillColor:string = graphics.fillColor[0] + " " + graphics.fillColor[1] + " " + graphics.fillColor[2] + " rg"
        let strokeOpacity:string = (graphics.strokeColor[3]*100).toString()
        let fillOpacity:string = (graphics.fillColor[3]*100).toString()

        let strokeThicknessMarkup = "2 Tr " + graphics.strokeThickness + " w"

        if (graphics.strokeThickness == 0) {
            strokeThicknessMarkup = ""
        }

        // add the graphics state object to the resources dictionary
        var res_graphics_state = resources.get("ExtGState")
        if (!res_graphics_state.isDictionary())
            resources.put("ExtGState", res_graphics_state = doc.newDictionary())

        var graphicsDict = doc.newDictionary()
        graphicsDict.put("CA", graphics.strokeColor[3])
        graphicsDict.put("ca", graphics.fillColor[3])

        let graphicsStateIdentifier:string = "fitzca"+strokeOpacity+""+fillOpacity
        res_graphics_state.put(graphicsStateIdentifier, graphicsDict)

        let graphicsState:string = "/"+graphicsStateIdentifier+" gs"

        let contentStream:string = "q " + graphicsState + " BT /F1 " + fontSize + " Tf 1 0 0 1 " + strokeThicknessMarkup + " " + strokeColor + " " + fillColor + " " + point[0] + " " + point[1] + " Tm (" + value + ") Tj ET Q"

        console.log(`Inserting text to page with content stream:\n${contentStream}`)

        // Create drawing operations
        var extra_contents = doc.addStream(contentStream, {})
       
        // Add drawing operations to page contents
        var page_contents = page_obj.get("Contents")
        if (page_contents.isArray()) {
            // Contents is already an array, so append our new buffer object.
            page_contents.push(extra_contents)
        } else {
            // Contents is not an array, so change it into an array
            // and then append our new buffer object.
            var new_page_contents = doc.newArray()
            new_page_contents.push(page_contents)
            new_page_contents.push(extra_contents)
            page_obj.put("Contents", new_page_contents)
        }
    }

    insertImage(data: {image:Image, name:string}, 
                rect: {x:number, y:number, width:number, height:number} = {x:0,y:0,width:0,height:0}) {

        if (data.image == null) {
            throw new Error("Invalid image");
        }

        if (data.name == null || data.name.length == 0) {
            throw new Error("Invalid name");
        }
    
        let doc = this._doc
        let page = this
        let page_obj = page.getObject()

        // add image object to page/Resources/XObject/MyCats dictionary (creating nested dictionaries as needed)
        var res = page_obj.get("Resources")
        if (!res.isDictionary())
            page_obj.put("Resources", res = doc.newDictionary())

        var res_xobj = res.get("XObject")
        if (!res_xobj.isDictionary())
            res.put("XObject", res_xobj = doc.newDictionary())

        const image = doc.addImage(data.image)

        // source some metrics data from sensible defaults if it isn't provided
        if (rect.x == undefined) {
            rect.x = 0
        }

        if (rect.y == undefined) {
            rect.y = 0
        }

        if (rect.width == 0 || rect.width == undefined) {
            rect.width = data.image.getWidth()
        }

        if (rect.height == 0 || rect.height == undefined) {
            rect.height = data.image.getHeight()
        }

        res_xobj.put(data.name, image)

        let contentStream:string = "q "+rect.width+" 0 0 "+rect.height+" "+rect.x+" "+rect.y+" cm /"+data.name+" Do Q"

        console.log(`Inserting image to page with content stream:\n${contentStream}`)

        // create drawing operations
        var extra_contents = doc.addStream(contentStream, null)

        // add drawing operations to page contents
        var page_contents = page_obj.get("Contents")
        if (page_contents.isArray()) {
            // Contents is already an array, so append our new buffer object.
            page_contents.push(extra_contents)
        } else {
            // Contents is not an array, so change it into an array
            // and then append our new buffer object.
            var new_page_contents = doc.newArray()
            new_page_contents.push(page_contents)
            new_page_contents.push(extra_contents)
            page_obj.put("Contents", new_page_contents)
        }

    }
}