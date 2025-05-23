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

// convenience methods for the andytango mupdf.js migration
// see: https://mupdfjs.readthedocs.io/en/latest/how-to-guide/migration/mupdf-js.html

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
