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
    static createBlankDocument(width:number = 595, height:number = 842): PDFDocument {
        let doc = new mupdf.PDFDocument()
        let helvetica = doc.newDictionary();
        helvetica.put("Type", doc.newName("Font"));
        helvetica.put("Subtype", doc.newName("Type1"));
        helvetica.put("Name", doc.newName("Helv"));
        helvetica.put("BaseFont", doc.newName("Helvetica"));
        helvetica.put("Encoding", doc.newName("WinAnsiEncoding"));
        let fonts = doc.newDictionary();
        fonts.put("Helv", helvetica);
        let resources = doc.addObject(doc.newDictionary());
        resources.put("Font", fonts);

        let pageObj = doc.addPage([0,0,width,height], 0, resources, "BT /Helv ET")
        doc.insertPage(-1, pageObj)

        if (doc instanceof mupdf.PDFDocument) {
            return new PDFDocument(doc.pointer);
        }
        throw new Error("Not a PDF document");
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

      deletePages(...args: any[]): void {
        if (!this.isPDF()) {
            throw new Error("This operation is only available for PDF documents.");
        }
    
        const pageCount = this.countPages();
        let pagesToDelete: number[] = [];
    
        if (typeof args[0] === 'object' && !Array.isArray(args[0])) {
            // Format 1: Keywords
            let fromPage = args[0].fromPage ?? 0;
            let toPage = args[0].toPage ?? pageCount - 1;
            fromPage = fromPage < 0 ? fromPage + pageCount : fromPage;
            toPage = toPage < 0 ? toPage + pageCount : toPage;
            if (fromPage > toPage || fromPage < 0 || toPage >= pageCount) {
                throw new Error("Bad page number(s)");
            }
            pagesToDelete = Array.from({length: toPage - fromPage + 1}, (_, i) => fromPage + i);
        } else if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
            // Format 2: Two integers
            let [start, end] = args[0] <= args[1] ? [args[0], args[1]] : [args[1], args[0]];
            start = start < 0 ? start + pageCount : start;
            end = end < 0 ? end + pageCount : end;
            if (start < 0 || end >= pageCount) {
                throw new Error("Bad page number(s)");
            }
            pagesToDelete = Array.from({length: end - start + 1}, (_, i) => start + i);
        } else if (args.length === 1) {
            if (typeof args[0] === 'number') {
                // Format 3: Single integer
                let pageNum = args[0] < 0 ? args[0] + pageCount : args[0];
                if (pageNum < 0 || pageNum >= pageCount) {
                    throw new Error("Bad page number");
                }
                pagesToDelete = [pageNum];
            } else if (Array.isArray(args[0]) || args[0] instanceof Set) {
                // Format 4: Array, Set, or Range
                pagesToDelete = [...new Set(args[0])].map(n => {
                    const pageNum = typeof n === 'number' ? (n < 0 ? n + pageCount : n) : NaN;
                    if (isNaN(pageNum) || pageNum < 0 || pageNum >= pageCount) {
                        throw new Error("Bad page number(s)");
                    }
                    return pageNum;
                });
            } else {
                throw new Error("Invalid argument type");
            }
        } else {
            throw new Error("Invalid arguments for deletePages");
        }
    
        if (pagesToDelete.length === 0) {
            console.log("Nothing to delete");
            return;
        }
    
        pagesToDelete.sort((a, b) => a - b);
    
        // TODO: Implement TOC and link processing (refer to PyMuPDF)
    
        for (const pageNum of pagesToDelete.reverse()) {
            this.deletePage(pageNum);
        }
    
        // TODO: Implement page reference reset (refer to PyMuPDF)
    }

    getPageLabels(): PageLabelRule[] {
        const root = this.getTrailer().get("Root");
        if (!root) return [];
        
        const pageLabels = root.get("PageLabels");
        if (!pageLabels) return [];
    
        const nums = pageLabels.get("Nums");
        if (!nums || !nums.isArray()) return [];
    
        const labels: PageLabelRule[] = [];
    
        for (let i = 0; i < nums.length; i += 2) {
            const startPage = nums.get(i).asNumber();
            const labelDict = nums.get(i + 1);
    
            if (labelDict.isDictionary()) {
                const rule: PageLabelRule = {
                    startpage: startPage,
                    prefix: "",
                    style: "",
                    firstpagenum: 1
                };
        
                const prefix = labelDict.get("P");
                if (prefix) {
                    rule.prefix = prefix.asString();
                }
        
                const style = labelDict.get("S");
                if (style) {
                    rule.style = style.asName();
                }
        
                const firstPageNum = labelDict.get("St");
                if (firstPageNum) {
                    const num = firstPageNum.asNumber();
                    if (num > 1) {
                        rule.firstpagenum = num;
                    }
                }
        
                labels.push(rule);
            }
        }
    
        return labels;
    }
    
    setPageLabelsArray(labels: PageLabelRule[]): void {
        const root = this.getTrailer().get("Root");
        const pageLabelsDict = this.newDictionary();
        const numsArray = this.newArray();
    
        labels.forEach(rule => {
            numsArray.push(this.newInteger(rule.startpage));
            
            const ruleDict = this.newDictionary();
            if (rule.prefix !== undefined) {
                ruleDict.put("P", this.newString(rule.prefix));
            }
            if (rule.style !== undefined) {
                ruleDict.put("S", this.newName(rule.style));
            }
            if (rule.firstpagenum !== undefined && rule.firstpagenum > 1) {
                ruleDict.put("St", this.newInteger(rule.firstpagenum));
            }
    
            numsArray.push(ruleDict);
        });
    
        pageLabelsDict.put("Nums", numsArray);
        root.put("PageLabels", pageLabelsDict);
    }

    authenticate(password: string): number {
        if (this.pointer === 0) {
          throw new Error("document closed");
        } 
        const val = super.authenticatePassword(password);
        return val;
    }

}

export const Rect = mupdf.Rect
export const Matrix = mupdf.Matrix

export class Image extends mupdf.Image {

}

export class ColorSpace extends mupdf.ColorSpace {

}

export class PDFPage extends mupdf.PDFPage {

    // note page number is zero-indexed here
    constructor(doc: mupdf.PDFDocument, pno:number) {
        if (pno < 0) {
            pno = 0
        }
        let page: mupdf.PDFPage = doc.loadPage(pno)
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

        // invert the Y point
        point[1] = page.getBounds()[3]-(point[1]+fontSize);

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
                rect: {x?:number, y?:number, width?:number, height?:number} = {x:0,y:0,width:0,height:0}) {

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
        if (rect.width == 0 || rect.width == undefined) {
            rect.width = data.image.getWidth()
        }

        if (rect.height == 0 || rect.height == undefined) {
            rect.height = data.image.getHeight()
        }

        if (rect.x == undefined) {
            rect.x = 0
        }

        // invert the Y point
        if (rect.y == undefined) {
            rect.y = page.getBounds()[3]-rect.height;
        } else {
            rect.y = page.getBounds()[3]-(rect.y+rect.height);
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

    rotate(r:number) {
        let page = this

        // Get the PDF object corresponding to the page
        const page_obj = page.getObject()

        // Get the current page rotation
        var rotate = page_obj.getInheritable("Rotate")

        // Update the Rotate value
        page_obj.put("Rotate", Number(rotate) + r)
    }
}

//Type
interface PageLabelRule {
    startpage: number;
    prefix?: string;
    style?: string;
    firstpagenum?: number;
}