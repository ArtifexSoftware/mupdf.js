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

// These functions come from the old mupdfjs package.
// They have been rewritten to not use inheritance.

// creates a new blank document with one page and adds a font resource, default size is A4 @ 595x842
export function createBlankDocument(width: number = 595, height: number = 842): mupdf.PDFDocument {
	let doc = new mupdf.PDFDocument()
	doc.insertPage(-1, doc.addPage([0, 0, width, height], 0, {}, ""))
	return doc
}

export function copyPage(doc: mupdf.PDFDocument, pno: number, to: number = -1): void {
	if (!doc.isPDF()) {
		throw new Error("This operation is only available for PDF documents.")
	}

	const pageCount = doc.countPages()
	if (pno < 0 || pno >= pageCount || to < -1 || to >= pageCount) {
		throw new Error("bad page number")
	}

	let before = 1
	if (to === -1) {
		to = pageCount - 1
		before = 0
	}

	const sourcePageObj = doc.findPage(pno)

	if (before) {
		doc.insertPage(to, sourcePageObj)
	} else {
		doc.insertPage(to + 1, sourcePageObj)
	}
}

export function newPage(doc: mupdf.PDFDocument, pno: number = -1, width: number = 595, height: number = 842): mupdf.PDFPage {
	if (width <= 0 || height <= 0) {
		throw new Error("Invalid page dimensions: width and height must be positive numbers")
	}

	const pageCount = doc.countPages()
	if (pno > pageCount) {
		throw new Error(`Invalid page number: ${pno}. The document has only ${pageCount} pages.`)
	}

	const insertPosition = pno < 0 || pno > pageCount ? pageCount : pno

	const mediabox: [number, number, number, number] = [ 0, 0, width, height ]
	const newPageObj = doc.addPage(mediabox, 0, doc.newDictionary(), "")

	doc.insertPage(insertPosition, newPageObj)
	return doc.loadPage(insertPosition)
}

export function deletePages(doc: mupdf.PDFDocument, ...args: any[]): void {
	if (!doc.isPDF()) {
		throw new Error("This operation is only available for PDF documents.")
	}

	const pageCount = doc.countPages()
	let pagesToDelete: number[] = []

	if (typeof args[0] === "object" && !Array.isArray(args[0])) {
		// Format 1: Keywords
		let fromPage = args[0].fromPage ?? 0
		let toPage = args[0].toPage ?? pageCount - 1
		fromPage = fromPage < 0 ? fromPage + pageCount : fromPage
		toPage = toPage < 0 ? toPage + pageCount : toPage
		if (fromPage > toPage || fromPage < 0 || toPage >= pageCount) {
			throw new Error("Bad page number(s)")
		}
		pagesToDelete = Array.from({ length: toPage - fromPage + 1 }, (_, i) => fromPage + i)
	} else if (args.length === 2 && typeof args[0] === "number" && typeof args[1] === "number") {
		// Format 2: Two integers
		let [ start, end ] = args[0] <= args[1] ? [ args[0], args[1] ] : [ args[1], args[0] ]
		start = start < 0 ? start + pageCount : start
		end = end < 0 ? end + pageCount : end
		if (start < 0 || end >= pageCount) {
			throw new Error("Bad page number(s)")
		}
		pagesToDelete = Array.from({ length: end - start + 1 }, (_, i) => start + i)
	} else if (args.length === 1) {
		if (typeof args[0] === "number") {
			// Format 3: Single integer
			let pageNum = args[0] < 0 ? args[0] + pageCount : args[0]
			if (pageNum < 0 || pageNum >= pageCount) {
				throw new Error("Bad page number")
			}
			pagesToDelete = [ pageNum ]
		} else if (Array.isArray(args[0]) || args[0] instanceof Set) {
			// Format 4: Array, Set, or Range
			pagesToDelete = [ ...new Set(args[0]) ].map(n => {
				const pageNum = typeof n === "number" ? (n < 0 ? n + pageCount : n) : NaN
				if (isNaN(pageNum) || pageNum < 0 || pageNum >= pageCount) {
					throw new Error("Bad page number(s)")
				}
				return pageNum
			})
		} else {
			throw new Error("Invalid argument type")
		}
	} else {
		throw new Error("Invalid arguments for deletePages")
	}

	if (pagesToDelete.length === 0) {
		return
	}

	pagesToDelete.sort((a, b) => a - b)

	// TODO: Implement TOC and link processing (refer to PyMuPDF)

	for (const pageNum of pagesToDelete.reverse()) {
		doc.deletePage(pageNum)
	}

	// TODO: Implement page reference reset (refer to PyMuPDF)
}

export function getPageNumbers(doc: mupdf.PDFDocument, matchLabel: string, onlyOne: boolean = false): number[] {
	const numbers: number[] = []
	for (let i = 0; i < doc.countPages(); i++) {
		const thisLabel = doc.loadPage(i).getLabel()
		if (thisLabel === matchLabel) {
			numbers.push(i)
			if (onlyOne) {
				break
			}
		}
	}
	return numbers
}

export function merge(
	targetPDF: mupdf.PDFDocument,
	sourcePDF: mupdf.PDFDocument,
	fromPage: number = 0,
	toPage: number = -1,
	startAt: number = -1,
	rotate: 0 | 90 | 180 | 270 = 0,
	copyLinks: boolean = true,
	copyAnnotations: boolean = true
): void {
	if (targetPDF.pointer === 0) {
		throw new Error("document closed")
	}
	if (sourcePDF.pointer === 0) {
		throw new Error("source document closed")
	}
	if (targetPDF === sourcePDF) {
		throw new Error("Cannot merge a document with itself")
	}

	const sourcePageCount = sourcePDF.countPages()
	const targetPageCount = targetPDF.countPages()
	const graftMap = targetPDF.newGraftMap()

	// Normalize page numbers
	fromPage = Math.max(0, Math.min(fromPage, sourcePageCount - 1))
	toPage = toPage < 0 ? sourcePageCount - 1 : Math.min(toPage, sourcePageCount - 1)
	startAt = startAt < 0 ? targetPageCount : Math.min(startAt, targetPageCount)

	// Ensure fromPage <= toPage
	if (fromPage > toPage) {
		;[ fromPage, toPage ] = [ toPage, fromPage ]
	}

	for (let i = fromPage; i <= toPage; i++) {
		const sourcePage = sourcePDF.loadPage(i)
		const pageObj = sourcePage.getObject()

		// Create a new page in the target document
		const newPageObj = targetPDF.addPage(sourcePage.getBounds(), rotate, targetPDF.newDictionary(), "")

		// Copy page contents
		const contents = pageObj.get("Contents")
		if (contents) {
			newPageObj.put("Contents", graftMap.graftObject(contents))
		}

		// Copy page resources
		const resources = pageObj.get("Resources")
		if (resources) {
			newPageObj.put("Resources", graftMap.graftObject(resources))
		}

		// Insert the new page at the specified position
		targetPDF.insertPage(startAt + (i - fromPage), newPageObj)

		if (copyLinks || copyAnnotations) {
			const targetPage = targetPDF.loadPage(startAt + (i - fromPage))
			if (copyLinks) {
				copyPageLinks(sourcePage, targetPage)
			}
			if (copyAnnotations) {
				copyPageAnnotations(sourcePage, targetPage)
			}
		}
	}
}

function copyPageLinks(sourcePage: mupdf.PDFPage, targetPage: mupdf.PDFPage): void {
	const links = sourcePage.getLinks()
	for (const link of links) {
		// TODO: internal links are broken
		targetPage.createLink(link.getBounds(), link.getURI())
	}
}

function copyPageAnnotations(sourcePage: mupdf.PDFPage, targetPage: mupdf.PDFPage): void {
	const annotations = sourcePage.getAnnotations()
	for (const annotation of annotations) {
		// TODO: copy all other annotation properties
		const newAnnotation = targetPage.createAnnotation(annotation.getType())
		newAnnotation.setRect(annotation.getRect())
		newAnnotation.setContents(annotation.getContents())
	}
}

export function split(document: mupdf.PDFDocument, range: number[] | undefined) {
	let documents: mupdf.PDFDocument[] = [];

	if (range == undefined || range.length == 0) { // just split out all pages as single PDFs
		let i = 0;
		while (i < document.countPages()) {
			let newDoc: mupdf.PDFDocument = new mupdf.PDFDocument()
			newDoc.graftPage(0, document, i);
			documents.push(newDoc);
			i++;
		}
	} else { // we have a defined page ranges to consider, create the correct PDFs
		let i = 0

		// build range arrays according to input 
		let ranges: number[][] = [];

		while (i < range.length) {

			var a: number = range[i] as number;

			if (a < 0) {
				throw new Error("Split error: document page indexes cannot be less than zero");
			}

			var nextIndex: number = i + 1;
			var b: number;
			if (nextIndex > range.length - 1) {
				b = document.countPages();
			} else {
				b = range[nextIndex] as number;
			}

			var set: number[] = [];

			while (a < b) {
				set.push(a);
				a++;
			}

			ranges.push(set);

			i++;
		}

		// now cycle the ranges and create the new documents as required
		var n: number = 0;
		while (n < ranges.length) {
			let newDoc = new mupdf.PDFDocument()
			let graftMap = newDoc.newGraftMap()

			if (ranges[n] != undefined) {
				for (let o: number = 0; o < ranges[n]!.length; o++) {
					// note: "o" is the "to" number for graftPage()
					graftMap.graftPage(o, document, ranges[n]![o]!);
				}
				documents.push(newDoc);
			}
			n++;
		}
	}
	return documents
}

export function scrub(
	document: mupdf.PDFDocument,
	options: {
		attachedFiles?: boolean,
		cleanPages?: boolean,
		embeddedFiles?: boolean,
		hiddenText?: boolean,
		javascript?: boolean,
		metadata?: boolean,
		redactions?: boolean,
		redactImages?: number,
		removeLinks?: boolean,
		resetFields?: boolean,
		resetResponses?: boolean,
		thumbnails?: boolean,
		xmlMetadata?: boolean,
	}
): void {
	const {
		attachedFiles = true,
		cleanPages = true,
		embeddedFiles = true,
		hiddenText = true,
		javascript = true,
		metadata = true,
		redactions = true,
		redactImages = 0,
		removeLinks = true,
		resetFields = true,
		resetResponses = true,
		thumbnails = true,
		xmlMetadata = true,
	} = options

	// Basic validation
	if (!document.isPDF()) {
		throw new Error("is not PDF")
	}

	if (document.needsPassword()) {
		throw new Error("encrypted doc")
	}

	// Metadata cleaning
	if (metadata) {
		// Clear all standard PDF metadata fields
		document.setMetaData("info:Title", "")
		document.setMetaData("info:Author", "")
		document.setMetaData("info:Subject", "")
		document.setMetaData("info:Keywords", "")
		document.setMetaData("info:Creator", "")
		document.setMetaData("info:Producer", "")
		document.setMetaData("info:CreationDate", "")
		document.setMetaData("info:ModDate", "")
	}

	// Process each page
	const pageCount = document.countPages()
	for (let i = 0; i < pageCount; i++) {
		// Remove links
		if (removeLinks) {
			const page = document.loadPage(i)
			const links = page.getLinks()
			for (const link of links) {
				page.deleteLink(link)
			}
		}

		// Handle attached files
		if (attachedFiles) {
			const page = document.loadPage(i)
			const annotations = page.getAnnotations()
			for (const annot of annotations) {
				if (annot.getType() === "FileAttachment") {
					annot.setFileSpec(document.newNull())
				}
			}
		}

		// Clean pages
		if (cleanPages) {
			const cleanBuffer = document.saveToBuffer("clean=yes")
			const cleanDoc = mupdf.PDFDocument.openDocument(cleanBuffer, "application/pdf") as mupdf.PDFDocument
			// Copy all objects from the cleaned document back to this document
			const pageCount = cleanDoc.countPages()
			for (let j = 0; j < pageCount; j++) {
				const cleanPage = cleanDoc.loadPage(j)
				const cleanPageObj = cleanPage.getObject()
				const thisPage = document.loadPage(j)
				const thisPageObj = thisPage.getObject()
				thisPageObj.put("Contents", document.graftObject(cleanPageObj.get("Contents")))
			}
		}

		// Handle hidden text
		if (hiddenText) {
			// TODO: Implement hidden text removal
		}

		// Handle redactions
		if (redactions) {
			// TODO: Implement redactions
			if (redactImages >= 0) {
				// TODO: Handle redacted images
			}
		}

		// Reset form fields
		if (resetFields) {
			const page = document.loadPage(i)
			const widgets = page.getWidgets()
			for (const widget of widgets) {
				const widgetObj = widget.getObject()
				// Get default value
				const defaultValue = widgetObj.get("DV")
				// Reset value
				if (defaultValue.isNull()) {
					widgetObj.delete("V")
				} else {
					widgetObj.put("V", defaultValue)
				}
				// Update appearance state for checkboxes and radio buttons
				const widgetType = widget.getFieldType()
				if (widgetType === "checkbox" || widgetType === "radiobutton") {
					widgetObj.put("AS", defaultValue.isNull() ? document.newName("Off") : defaultValue)
				}
				widget.update()
			}
		}

		// Reset responses
		if (resetResponses) {
			const page = document.loadPage(i)
			const annotations = page.getAnnotations()
			for (const annot of annotations) {
				const annotObj = annot.getObject()
				// Remove response type and in-response-to reference
				annotObj.delete("RT")
				annotObj.delete("IRT")
				annot.update()
			}
		}

		// Remove thumbnails
		if (thumbnails) {
			const page = document.loadPage(i)
			const pageObj = page.getObject()
			pageObj.delete("Thumb")
		}
	}

	// Handle embedded files
	if (embeddedFiles) {
		const root = document.getTrailer().get("Root")
		const names = root.get("Names")
		if (!names.isNull() && names.isDictionary()) {
			const embeddedFilesDict = names.get("EmbeddedFiles")
			if (!embeddedFilesDict.isNull() && embeddedFilesDict.isDictionary()) {
				const emptyArray = document.newArray()
				embeddedFilesDict.put("Names", emptyArray)
			}
		}
	}

	// Handle JavaScript
	if (javascript) {
		const xrefLength = document.countObjects()
		for (let xref = 1; xref < xrefLength; xref++) {
			const obj = document.newIndirect(xref)
			const resolvedObj = obj.resolve()
			if (resolvedObj.isDictionary()) {
				const type = resolvedObj.get("S")
				if (!type.isNull() && type.asName() === "JavaScript") {
					const newObj = document.newDictionary()
					newObj.put("S", document.newName("JavaScript"))
					newObj.put("JS", document.newString(""))
					obj.writeObject(newObj)
				}
			}
		}
	}

	// Handle XML metadata
	if (xmlMetadata) {
		const root = document.getTrailer().get("Root")
		root.delete("Metadata")
	}
}

export function attachFile(
	doc: mupdf.PDFDocument,
	name: string,
	data: Buffer | ArrayBuffer | Uint8Array,
	options?: {
		filename?: string,
		creationDate?: Date,
		modificationDate?: Date,
	}
): void {
	// Set default values for optional parameters
	const now = new Date()
	const { filename = name, creationDate = now, modificationDate = now } = options || {}

	// Determine MIME type based on file extension
	const mimeType = guessMimeType(name)

	// Convert input data to mupdf Buffer format
	// Handles multiple input formats: Buffer, ArrayBuffer, Uint8Array
	let buffer: mupdf.Buffer
	if (data instanceof mupdf.Buffer) {
		buffer = data
	} else {
		buffer = new mupdf.Buffer()
		if (data instanceof ArrayBuffer) {
			buffer.writeBuffer(new Uint8Array(data))
		} else if (data instanceof Uint8Array) {
			buffer.writeBuffer(data)
		} else {
			throw new Error("Invalid input data type")
		}
	}

	// Create file specification object with metadata
	const fileSpec = doc.addEmbeddedFile(filename, mimeType, buffer, creationDate, modificationDate)

	// Add the file to the PDF document's embedded files collection
	doc.insertEmbeddedFile(name, fileSpec)
}

function guessMimeType(filename: string): string {
	// Extract and normalize the file extension
	const ext = filename.split(".").pop()?.toLowerCase()

	// Define mapping of file extensions to MIME types
	const mimeTypes: { [key: string]: string } = {
		pdf: "application/pdf",
		txt: "text/plain",
		html: "text/html",
		htm: "text/html",
		json: "application/json",
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		png: "image/png",
		gif: "image/gif",
		svg: "image/svg+xml",
		xml: "application/xml",
		zip: "application/zip",
	}

	// Return the corresponding MIME type or default to octet-stream
	return mimeTypes[ext || ""] || "application/octet-stream"
}

export function insertText(
	doc: mupdf.PDFDocument,
	page: mupdf.PDFPage,
	value: string,
	point: mupdf.Point,
	fontName: string = "Times-Roman",
	fontSize: number = 18,
	graphics: {
		strokeColor: mupdf.Color,
		fillColor: mupdf.Color,
		strokeThickness: number
	} = { strokeColor: [0, 0, 0, 1], fillColor: [0, 0, 0, 1], strokeThickness: 1 }
) {
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
		graphics.strokeColor = [0, 0, 0, 1]
	}

	if (graphics.fillColor == undefined) {
		graphics.fillColor = [0, 0, 0, 1]
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

	let strokeColor: string = graphics.strokeColor[0] + " " + graphics.strokeColor[1] + " " + graphics.strokeColor[2] + " RG"
	let fillColor: string = graphics.fillColor[0] + " " + graphics.fillColor[1] + " " + graphics.fillColor[2] + " rg"
	let strokeOpacity: string = (graphics.strokeColor[3] * 100).toString()
	let fillOpacity: string = (graphics.fillColor[3] * 100).toString()

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

	let graphicsStateIdentifier: string = "fitzca" + strokeOpacity + "" + fillOpacity
	res_graphics_state.put(graphicsStateIdentifier, graphicsDict)

	let graphicsState: string = "/" + graphicsStateIdentifier + " gs"

	// invert the Y point
	point[1] = page.getBounds()[3] - (point[1] + fontSize);

	let contentStream: string = "q " + graphicsState + " BT " + strokeColor + " " + fillColor + " " + strokeThicknessMarkup + " /F1 " + fontSize + " Tf " + point[0] + " " + point[1] + " Td (" + value + ") Tj ET Q"

	// Create drawing operations
	var extra_contents = doc.addStream(contentStream, {})

	// Add drawing operations to page contents
	var page_contents = page_obj.get("Contents")

	if (page_contents.isNull()) {
		page_obj.put("Contents", extra_contents)
	}
	else if (page_contents.isArray()) {
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

export function insertImage(
	doc: mupdf.PDFDocument,
	page: mupdf.PDFPage,
	data: { image: mupdf.Image, name: string },
	metrics: { x?: number, y?: number, width?: number, height?: number } = { x: 0, y: 0, width: 0, height: 0 }
) {
	if (data.image == null) {
		throw new Error("Invalid image");
	}

	if (data.name == null || data.name.length == 0) {
		throw new Error("Invalid name");
	}

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
		metrics.y = page.getBounds()[3] - metrics.height;
	} else {
		metrics.y = page.getBounds()[3] - (metrics.y + metrics.height);
	}

	res_xobj.put(data.name, image)

	let contentStream: string = "q " + metrics.width + " 0 0 " + metrics.height + " " + metrics.x + " " + metrics.y + " cm /" + data.name + " Do Q"

	// create drawing operations
	var extra_contents = doc.addStream(contentStream, null)

	// add drawing operations to page contents
	var page_contents = page_obj.get("Contents")

	if (page_contents.isNull()) {
		page_obj.put("Contents", extra_contents)
	}
	else if (page_contents.isArray()) {
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

export function rotatePage(page: mupdf.PDFPage, r: number) {
	// Get the PDF object corresponding to the page
	const page_obj = page.getObject()
	// Get the current page rotation
	var rotate = page_obj.getInheritable("Rotate")
	// Update the Rotate value
	page_obj.put("Rotate", (Number(rotate) + r) % 360)
}

export function addAnnotation(
	page: mupdf.PDFPage,
	type: mupdf.PDFAnnotationType,
	metrics: { x: number; y: number; width: number; height: number },
	author?: string,
	contents?: string
): mupdf.PDFAnnotation {
	let annotation = page.createAnnotation(type)
	annotation.setRect([ metrics.x, metrics.y, metrics.x + metrics.width, metrics.y + metrics.height ])
	if (author)
		annotation.setAuthor(author)
	if (contents)
		annotation.setContents(contents)
	annotation.update()
	return annotation
}
export function addRedaction(
	page: mupdf.PDFPage,
	metrics: { x: number; y: number; width: number; height: number }
): mupdf.PDFAnnotation {
	let redaction = page.createAnnotation("Redact")
	redaction.setRect([ metrics.x, metrics.y, metrics.x + metrics.width, metrics.y + metrics.height ])
	redaction.update()
	return redaction
}

export type MyWord = {
	rect: mupdf.Rect,
	text: string,
	font: mupdf.Font,
	size: number,
};

export function getPageWords(page: mupdf.PDFPage): MyWord[] {
	const words: MyWord[] = []
	let cwordRect: mupdf.Rect | undefined
	let cwordFont: mupdf.Font | undefined
	let cwordSize: number | undefined
	let cwordText = ""

	const endWord = () => {
		// if word is complete, append to list
		if (cwordRect !== undefined && cwordFont !== undefined && cwordSize !== undefined && cwordText !== "") {
			words.push({
				rect: cwordRect,
				text: cwordText,
				font: cwordFont,
				size: cwordSize,
			})
		}

		// Reset values
		cwordRect = undefined
		cwordFont = undefined
		cwordSize = undefined
		cwordText = ""
	}

	const enlargeRect = (quad: mupdf.Quad) => {
		if (cwordRect === undefined) {
			cwordRect = [ quad[0], quad[1], quad[6], quad[7] ]
			return
		}

		cwordRect[0] = Math.min(cwordRect[0], quad[0])
		cwordRect[1] = Math.min(cwordRect[1], quad[1])
		cwordRect[2] = Math.max(cwordRect[2], quad[6])
		cwordRect[3] = Math.max(cwordRect[3], quad[7])
	}

	// extract the words from the page
	page.toStructuredText("preserve-whitespace,preserve-spans").walk({
		onChar(c, _origin, font, size, quad) {
			enlargeRect(quad)

			cwordFont = font
			cwordSize = size

			// split by whitespace
			if (c == " ") {
				endWord()
			} else {
				cwordText += c
			}
		},
		// split by block
		endLine: endWord,
		endTextBlock: endWord,
	})

	return words
}

export function getPageImages(page: mupdf.PDFPage): { bbox: mupdf.Rect; matrix: mupdf.Matrix; image: mupdf.Image }[] {
	var images: { bbox: mupdf.Rect; matrix: mupdf.Matrix; image: mupdf.Image }[] = []
	page.toStructuredText("preserve-images").walk({
		onImageBlock(bbox, matrix, image) {
			images.push({ bbox: bbox, matrix: matrix, image: image })
		},
	})
	return images
}

export function deletePageResourcesXObject(doc: mupdf.PDFDocument, page: mupdf.PDFPage, ref: string) {
	let pageObj = page.getObject()
	var isIndirect = pageObj.isIndirect()

	if (isIndirect) {
		pageObj = pageObj.resolve()
	}

	// replace the XObject with a 1x1 transparent pixel to "delete" it
	let res = pageObj.get("Resources")
	let resXObj = res.get("XObject")
	let pix = new mupdf.Pixmap(mupdf.ColorSpace.DeviceRGB, [ 0, 0, 1, 1 ], true)
	let imageRes = new mupdf.Image(pix)

	const image = doc.addImage(imageRes)
	resXObj.put(ref, image)

	res.put("XObject", resXObj)
	pageObj.put("Resources", res)
}

export function getPageResourcesXObjects(page: mupdf.PDFPage): { key: string | number; value: string }[] {
	let pageObj = page.getObject()
	var isIndirect = pageObj.isIndirect()

	if (isIndirect) {
		pageObj = pageObj.resolve()
	}

	let res = pageObj.get("Resources")
	let resXObj = res.get("XObject")
	let arr: { key: string | number; value: string }[] = []

	resXObj.forEach(function (value: mupdf.PDFObject, key: string | number) {
		arr.push({ key: key, value: value.toString() })
	})

	return arr
}
