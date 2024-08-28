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

import * as mupdf from "mupdf"

export class PDFDocument {

    // default A4 size is 595x842
    static createBlankDocument(w:number = 595, h:number = 842): mupdf.PDFDocument {
        let pdfDocument = new mupdf.PDFDocument()
        let pageObj = pdfDocument.addPage([0,0,w,h], 0, [], "")
        pdfDocument.insertPage(-1, pageObj)
        return pdfDocument
    }

}

export class PDFPage {

    _doc: mupdf.PDFDocument
    _page: mupdf.PDFPage

    constructor(doc: mupdf.PDFDocument, page: mupdf.PDFPage) {
        this._doc = doc
		this._page = page
	}

    insertText(value:string, 
               point: [number, number], 
               fontName:string = "Times-Roman", 
               fontSize:number = 18,
               graphics: {strokeColor:[number,number,number,number], 
                       fillColor:[number,number,number,number],
                       strokeThickness:number} = {strokeColor:[0,0,0,1], fillColor:[0,0,0,1], strokeThickness:1}) {
        let doc = this._doc
        let page = this._page
        let page_obj = page.getObject()
        let font = doc.addSimpleFont(new mupdf.Font(fontName))

        // add object to page/Resources/XObject/F1 dictionary (creating nested dictionaries as needed)
        var res = page_obj.get("Resources")
        if (!res.isDictionary())
            page_obj.put("Resources", res = doc.newDictionary())

        var res_font = res.get("Font")
        if (!res_font.isDictionary())
            res.put("Font", res_font = doc.newDictionary())

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

        let graphicsState = "/fitzca"+strokeOpacity+""+fillOpacity+" gs"

        let contentStream = "q " + graphicsState + " BT /F1 " + fontSize + " Tf 1 0 0 1 " + strokeThicknessMarkup + " " + strokeColor + " " + fillColor + " " + point[0] + " " + point[1] + " Tm (" + value + ") Tj ET Q"

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

}

// convenience methods for the mupdf.js migration
// see: https://mupdfjs.readthedocs.io/en/latest/how-to-guide/migration/index.html
export function loadPDF(data: Buffer | ArrayBuffer | Uint8Array) {
    return new mupdf.PDFDocument(data)
}

export function drawPageAsPNG(document: mupdf.PDFDocument, pageNumber: number, dpi: number): Uint8Array {
    const page = document.loadPage(pageNumber)
    const zoom = dpi / 72

    return page.toPixmap(
      [zoom, 0, 0, zoom, 0, 0],
      mupdf.ColorSpace.DeviceRGB
    ).asPNG()
}

export function drawPageAsHTML(document: mupdf.PDFDocument, pageNumber: number, id: number): string {
    return document.loadPage(pageNumber).toStructuredText().asHTML(id)
}

export function drawPageAsSVG(document: mupdf.PDFDocument, pageNumber: number): string {
    const page = document.loadPage(pageNumber)
    const buffer = new mupdf.Buffer()
    const writer = new mupdf.DocumentWriter(buffer, "svg", "")
    const device = writer.beginPage(page.getBounds())
    page.run(device, mupdf.Matrix.identity)
    device.close()
    writer.endPage()
    return buffer.asString()
}

export function getPageText(document: mupdf.PDFDocument, pageNumber: number): string {
    return document.loadPage(pageNumber).toStructuredText().asText()
}

export function searchPageText(document: mupdf.PDFDocument, pageNumber: number, searchString: string, maxHits = 500) {
    return document.loadPage(pageNumber).toStructuredText().search(searchString, maxHits)
}



