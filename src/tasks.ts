import * as mupdf from "mupdf"

export function loadPDF(data: Buffer | ArrayBuffer | Uint8Array) {
    return new mupdf.PDFDocument(data)
}

export function drawPageAsPng(document: mupdf.PDFDocument, pageNumber: number, dpi: number): Uint8Array {
    const page = document.loadPage(pageNumber)
    const zoom = dpi / 72

    return page.toPixmap(
      [zoom, 0, 0, zoom, 0, 0],
      mupdf.ColorSpace.DeviceRGB
    ).asPNG()
}

export function drawPageAsHtml(document: mupdf.PDFDocument, pageNumber: number, id: number): string {
    return document.loadPage(pageNumber).toStructuredText().asHTML(id)
}

export function drawPageAsSvg(document: mupdf.PDFDocument, pageNumber: number): string {
    return document.loadPage(pageNumber).asSvg()
}

export function getPageText(document: mupdf.PDFDocument, pageNumber: number): string {
    return document.loadPage(pageNumber).toStructuredText().asText()
}

export function searchPageText(document: mupdf.PDFDocument, pageNumber: number, searchString: string, maxHits = 500) {
    return document.loadPage(pageNumber).toStructuredText().search(searchString, maxHits)
}