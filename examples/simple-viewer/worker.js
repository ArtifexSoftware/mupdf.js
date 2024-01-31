// Copyright (C) 2022, 2024 Artifex Software, Inc.
//
// This file is part of MuPDF.
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

/* global mupdf */

"use strict"

// Import the WASM module.
globalThis.__filename = "../../lib/mupdf-wasm.js"
importScripts("../../lib/mupdf-wasm.js")

// Import the MuPDF bindings.
importScripts("../../lib/mupdf.js")

const methods = {}

onmessage = async function (event) {
	let [ func, id, args ] = event.data
	try {
		let result = methods[func](...args)
		postMessage([ "RESULT", id, result ])
	} catch (error) {
		postMessage([ "ERROR", id, { name: error.name, message: error.message, stack: error.stack } ])
	}
}

var openDocument = null

methods.openDocumentFromBuffer = function (buffer, magic) {
	if (openDocument)
		openDocument.destroy()
	openDocument = mupdf.Document.openDocument(buffer, magic)
}

methods.documentTitle = function () {
	return openDocument.getMetaData(Document.META_INFO_TITLE)
}

methods.documentOutline = function () {
	return openDocument.loadOutline()
}

methods.countPages = function () {
	return openDocument.countPages()
}

methods.getPageSize = function (pageNumber) {
	let page = openDocument.loadPage(pageNumber)
	let bounds = page.getBounds()
	return { width: bounds[2] - bounds[0], height: bounds[3] - bounds[1] }
}

methods.getPageLinks = function (pageNumber) {
	let page = openDocument.loadPage(pageNumber)
	let links = page.getLinks()

	return links.map((link) => {
		const [ x0, y0, x1, y1 ] = link.getBounds()

		let href
		if (link.isExternal())
			href = link.getURI()
		else
			href = `#page${openDocument.resolveLink(link) + 1}`

		return {
			x: x0,
			y: y0,
			w: x1 - x0,
			h: y1 - y0,
			href,
		}
	})
}

methods.getPageText = function (pageNumber) {
	let page = openDocument.loadPage(pageNumber)
	let text = page.toStructuredText(1).asJSON()
	return JSON.parse(text)
}

methods.search = function (pageNumber, needle) {
	let page = openDocument.loadPage(pageNumber)
	const hits = page.search(needle)
	let result = []
	for (let hit of hits) {
		for (let quad of hit) {
			const [ ulx, uly, urx, ury, llx, lly, lrx, lry ] = quad
			result.push({
				x: ulx,
				y: uly,
				w: urx - ulx,
				h: lly - uly,
			})
		}
	}
	return result
}

methods.getPageAnnotations = function (pageNumber, dpi) {
	let page = openDocument.loadPage(pageNumber)

	if (page == null) {
		return []
	}

	const annotations = page.getAnnotations()
	const doc_to_screen = [ dpi = 72, 0, 0, dpi / 72, 0, 0 ]

	return annotations.map((annotation) => {
		const [ x0, y0, x1, y1 ] = Matrix.transformRect(annotation.getBounds())
		return {
			x: x0,
			y: y0,
			w: x1 - x0,
			h: y1 - y0,
			type: annotation.getType(),
			ref: annotation.pointer,
		}
	})
}

methods.drawPageAsPixmap = function (pageNumber, dpi) {
	const doc_to_screen = mupdf.Matrix.scale(dpi / 72, dpi / 72)

	let page = openDocument.loadPage(pageNumber)
	let bbox = Rect.transform(page.getBounds(), doc_to_screen)
	let pixmap = new mupdf.Pixmap(mupdf.ColorSpace.DeviceRGB, bbox, true)
	pixmap.clear(255)

	let device = new mupdf.DrawDevice(doc_to_screen, pixmap)
	page.run(device, Matrix.identity)
	device.close()

	let pixArray = pixmap.getPixels()
	let pixW = pixmap.getWidth()
	let pixH = pixmap.getHeight()

	let imageData = new ImageData(pixArray.slice(), pixW, pixH)

	pixmap.destroy()

	return imageData
}

postMessage([ "INIT", 0, Object.keys(methods) ])
