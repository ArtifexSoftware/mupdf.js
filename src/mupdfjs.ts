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

export const Rect = mupdf.Rect
export const Matrix = mupdf.Matrix
export type Matrix = [number, number, number, number, number, number]
export type Rect = [number, number, number, number]
export type Point = [number, number]
export type Quad = [number, number, number, number, number, number, number, number]
export type Color = [number] | [number, number, number] | [number, number, number, number]

export class Buffer extends mupdf.Buffer {}
export class ColorSpace extends mupdf.ColorSpace {}
export class Device extends mupdf.Device {}
export class DocumentWriter extends mupdf.DocumentWriter {}
export class DrawDevice extends mupdf.DrawDevice {}
export class DisplayList extends mupdf.DisplayList {}
export class DisplayListDevice extends mupdf.DisplayListDevice {}
export class Font extends mupdf.Font {}
export class Image extends mupdf.Image {}
export class Link extends mupdf.Link {}
export class OutlineIterator extends mupdf.OutlineIterator {}
export class Path extends mupdf.Path {}
export class PDFAnnotation extends mupdf.PDFAnnotation {}
export class PDFGraftMap extends mupdf.PDFGraftMap {}
export class PDFObject extends mupdf.PDFObject {}
export class PDFWidget extends mupdf.PDFWidget {}
export class Pixmap extends mupdf.Pixmap {}
export class StrokeState extends mupdf.StrokeState {}
export class StructuredText extends mupdf.StructuredText {}
export class Text extends mupdf.Text {}

export type CreatableAnnotationType =
    "Text" |
	"FreeText" |
	"Line" |
	"Square" |
	"Circle" |
	"Polygon" |
	"PolyLine" |
	"Highlight" |
	"Underline" |
	"Squiggly" |
	"StrikeOut" |
	"Redact" |
	"Stamp" |
	"Caret" |
	"Ink" |
	"FileAttachment"


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

    getPageNumbers(label: string, onlyOne: boolean = false): number[] {
        const numbers: number[] = [];
        if (!label) {
            return numbers;
        }

        const labels = this.getPageLabels();
        if (labels.length === 0) {
            return numbers;
        }

        for (let i = 0; i < this.countPages(); i++) {
            const pageLabel = this.getPageLabel(i, labels);
            if (pageLabel === label) {
                numbers.push(i);
                if (onlyOne) {
                    break;
                }
            }
        }

        return numbers;
    }

    private getPageLabel(pageNum: number, labels: PageLabelRule[]): string {
        let currentRule: PageLabelRule | undefined;
        for (const rule of labels) {
            if (rule.startpage <= pageNum) {
                currentRule = rule;
            } else {
                break;
            }
        }

        if (!currentRule) {
            return (pageNum + 1).toString();
        }

        let labelNum = pageNum - currentRule.startpage + (currentRule.firstpagenum || 1);
        let prefix = currentRule.prefix || '';

        switch (currentRule.style) {
            case 'D':
                return prefix + labelNum;
            case 'r':
                return prefix + this.toRoman(labelNum).toLowerCase();
            case 'R':
                return prefix + this.toRoman(labelNum);
            case 'a':
                return prefix + this.toAlpha(labelNum).toLowerCase();
            case 'A':
                return prefix + this.toAlpha(labelNum);
            default:
                return prefix + labelNum;
        }
    }

    private toRoman(num: number): string {
        const roman: string[][] = [
            ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
            ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'],
            ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'],
            ['', 'M', 'MM', 'MMM']
        ];
        
        const thousands = Math.floor(num / 1000);
        const hundreds = Math.floor((num % 1000) / 100);
        const tens = Math.floor((num % 100) / 10);
        const ones = num % 10;
    
        return (roman[3]?.[thousands] ?? '') +
        (roman[2]?.[hundreds] ?? '') +
        (roman[1]?.[tens] ?? '') +
        (roman[0]?.[ones] ?? '');
    }

    private toAlpha(num: number): string {
        let result = '';
        while (num > 0) {
            num--;
            result = String.fromCharCode(65 + (num % 26)) + result;
            num = Math.floor(num / 26);
        }
        return result;
    }

    merge(
        sourcePDF: mupdf.PDFDocument,
        fromPage: number = 0,
        toPage: number = -1,
        startAt: number = -1,
        rotate: 0 | 90 | 180 | 270 = 0,
        copyLinks: boolean = true,
        copyAnnotations: boolean = true
    ): void {
        if (this.pointer === 0) {
            throw new Error("document closed");
        }
        if (sourcePDF.pointer === 0) {
            throw new Error("source document closed");
        }
        if (this === sourcePDF) {
            throw new Error("Cannot merge a document with itself");
        }

        const sourcePageCount = sourcePDF.countPages();
        const targetPageCount = this.countPages();

        // Normalize page numbers
        fromPage = Math.max(0, Math.min(fromPage, sourcePageCount - 1));
        toPage = toPage < 0 ? sourcePageCount - 1 : Math.min(toPage, sourcePageCount - 1);
        startAt = startAt < 0 ? targetPageCount : Math.min(startAt, targetPageCount);

        // Ensure fromPage <= toPage
        if (fromPage > toPage) {
            [fromPage, toPage] = [toPage, fromPage];
        }

        for (let i = fromPage; i <= toPage; i++) {
            const sourcePage = sourcePDF.loadPage(i);
            const pageObj = sourcePage.getObject();
            
            // Create a new page in the target document
            const newPageObj = this.addPage(sourcePage.getBounds(), rotate, this.newDictionary(), "");
            
            // Copy page contents
            const contents = pageObj.get("Contents");
            if (contents) {
                newPageObj.put("Contents", this.graftObject(contents));
            }
            
            // Copy page resources
            const resources = pageObj.get("Resources");
            if (resources) {
                newPageObj.put("Resources", this.graftObject(resources));
            }

            // Insert the new page at the specified position
            this.insertPage(startAt + (i - fromPage), newPageObj);

            if (copyLinks || copyAnnotations) {
                const targetPage = this.loadPage(startAt + (i - fromPage));
                if (copyLinks) {
                    this.copyPageLinks(sourcePage, targetPage);
                }
                if (copyAnnotations) {
                    this.copyPageAnnotations(sourcePage, targetPage);
                }
            }
        }
    }

    private copyPageLinks(sourcePage: mupdf.PDFPage, targetPage: mupdf.PDFPage): void {
        const links = sourcePage.getLinks();
        for (const link of links) {
            targetPage.createLink(link.getBounds(), link.getURI());
        }
    }

    private copyPageAnnotations(sourcePage: mupdf.PDFPage, targetPage: mupdf.PDFPage): void {
        const annotations = sourcePage.getAnnotations();
        for (const annotation of annotations) {
            const newAnnotation = targetPage.createAnnotation(annotation.getType());
            newAnnotation.setRect(annotation.getRect());
            newAnnotation.setContents(annotation.getContents());
        }
    }
}

export class PDFPage extends mupdf.PDFPage {

    // note page number is zero-indexed here
    constructor(doc: mupdf.PDFDocument, pno: number) {
        if (pno < 0) {
            pno = 0
        }
        let page: mupdf.PDFPage = doc.loadPage(pno)
        super(doc, page.pointer)
	}

    insertText(value: string, 
               point: Point, 
               fontName: string = "Times-Roman", 
               fontSize: number = 18,
               graphics: {strokeColor:Color, 
                       fillColor:Color,
                       strokeThickness:number} = {strokeColor:[0,0,0,1], fillColor:[0,0,0,1], strokeThickness:1}) {
        let doc = this._doc
        let page = this
        let page_obj = page.getObject()
        let font = new mupdf.Font(fontName)
        let fontResource = doc.addSimpleFont(font)

        // add object to page/Resources/XObject/F1 dictionary (creating nested dictionaries as needed)
        var resources = page_obj.get("Resources")
        if (!resources.isDictionary())
            page_obj.put("Resources", resources = doc.newDictionary())

        var res_font = resources.get("Font")
        if (!res_font.isDictionary())
            resources.put("Font", res_font = doc.newDictionary())

        res_font.put("F1", fontResource)

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

        if (graphics.strokeColor[3] == undefined) {
            graphics.strokeColor[3] = 1
        }

        if (graphics.fillColor[3] == undefined) {
            graphics.fillColor[3] = 1
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

        let contentStream:string = "q " + graphicsState + " BT " + strokeColor + " " + fillColor + " " + strokeThicknessMarkup +" /F1 " + fontSize + " Tf " + point[0] + " " + point[1] + " Td (" + value + ") Tj ET Q"
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
                metrics: {x?:number, y?:number, width?:number, height?:number} = {x:0,y:0,width:0,height:0}) {

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
        if (metrics.width == 0 || metrics.width == undefined) {
            metrics.width = data.image.getWidth()
        }

        if (metrics.height == 0 || metrics.height == undefined) {
            metrics.height = data.image.getHeight()
        }

        if (metrics.x == undefined) {
            metrics.x = 0
        }

        // invert the Y point
        if (metrics.y == undefined) {
            metrics.y = page.getBounds()[3]-metrics.height;
        } else {
            metrics.y = page.getBounds()[3]-(metrics.y+metrics.height);
        }
      
        res_xobj.put(data.name, image)

        let contentStream:string = "q "+metrics.width+" 0 0 "+metrics.height+" "+metrics.x+" "+metrics.y+" cm /"+data.name+" Do Q"

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

    insertLink(metrics: {x:number, y:number, width:number, height:number}, uri: string) {
        super.createLink([metrics.x,metrics.y,metrics.x+metrics.width,metrics.y+metrics.height], uri)
    }

    rotate(r: number) {
        let page = this

        // Get the PDF object corresponding to the page
        const page_obj = page.getObject()

        // Get the current page rotation
        var rotate = page_obj.getInheritable("Rotate")

        // Update the Rotate value
        page_obj.put("Rotate", Number(rotate) + r)
    }

    addAnnotation(type: CreatableAnnotationType, 
                  metrics: {x:number, y:number, width:number, height:number}, 
                  author?:string,
                  contents?:string): PDFAnnotation {
        let page = this
        let annotation = page.createAnnotation(type)
        annotation.setRect([metrics.x,metrics.y,metrics.x+metrics.width,metrics.y+metrics.height])
        if (author) {
            annotation.setAuthor(author)
        }

        if (contents) {
            annotation.setContents(contents)
        }
        annotation.update()
        return annotation
    }

    addRedaction(metrics: {x:number, y:number, width:number, height:number}): PDFAnnotation {
        let page = this
        let redaction = page.createAnnotation("Redact")
        redaction.setRect([metrics.x,metrics.y,metrics.x+metrics.width,metrics.y+metrics.height])
        redaction.update()
        return redaction
    }

    override applyRedactions(blackBoxes: boolean | number = true, imageMethod: number = PDFPage.REDACT_IMAGE_PIXELS) {
        var num:number
        if (typeof blackBoxes === "boolean") {
            num = blackBoxes ? 1 : 0
        } else {
            num = blackBoxes
        }
        super.applyRedactions(num, imageMethod)
    }

    override search(needle: string, maxHits: number = 50): Quad[][] {
        return super.search(needle, maxHits)
    }

    setCropBox(rect: Rect) {
        super.setPageBox("CropBox", rect)
    }

    setArtBox(rect: Rect) {
        super.setPageBox("ArtBox", rect)
    }

    setBleedBox(rect: Rect) {
        super.setPageBox("BleedBox", rect)
    }

    setTrimBox(rect: Rect) {
        super.setPageBox("TrimBox", rect)
    }

    setMediaBox(rect: Rect) {
        super.setPageBox("MediaBox", rect)
    }

    getImages(): {bbox:Rect, matrix:Matrix, image:Image}[] {
        var images:{bbox:Rect, matrix:Matrix, image:Image}[] = []
        let page = this

        page.toStructuredText("preserve-images").walk({
            onImageBlock(bbox, matrix, image) {
                images.push({bbox:bbox, matrix:matrix, image:image})
            }
        })

        return images
    }

    delete(ref:PDFAnnotation | PDFWidget | Link | string) {
        if (ref.constructor.name === "PDFAnnotation") {
            super.deleteAnnotation(ref as PDFAnnotation)
        } else if (ref.constructor.name === "PDFWidget") {
            super.deleteAnnotation(ref as PDFWidget)
        } else if (ref.constructor.name === "Link") {
            super.deleteLink(ref as Link)
        } else if (typeof ref === "string") {
            let pageObj = this.getObject()
            var isIndirect = pageObj.isIndirect()

            if (isIndirect) {
                pageObj = pageObj.resolve()
            }

            // replace the XObject with a 1x1 transparent pixel to "delete" it
            let res = pageObj.get("Resources")
            let resXObj = res.get("XObject")
            let pix = new Pixmap(ColorSpace.DeviceRGB, [0,0,1,1], true)
            let imageRes = new Image(pix)

            const image = this._doc.addImage(imageRes)
            resXObj.put(ref, image)

            res.put("XObject", resXObj)
            pageObj.put("Resources", res)
        }
    }

    getResourcesXrefObjects(): {key:string | number, value:string}[] {
        let pageObj = this.getObject()
        var isIndirect = pageObj.isIndirect()

        if (isIndirect) {
            pageObj = pageObj.resolve()
        }

        let res = pageObj.get("Resources")
        let resXObj = res.get("XObject")
        let arr: {key:string | number, value:string}[] = []

        resXObj.forEach(function(value:PDFObject, key:string | number) {
            arr.push({key:key, value:value.toString()})
        })

        return arr
    }
}

//Type
interface PageLabelRule {
    startpage: number;
    prefix?: string;
    style?: string;
    firstpagenum?: number;
}