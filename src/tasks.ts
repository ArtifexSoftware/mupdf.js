import * as mupdf from "mupdf"

export function loadPDF(data: Buffer | ArrayBuffer | Uint8Array) {
    let document = new mupdf.PDFDocument(data)
    return document
}

export function drawPageAsPng(document: mupdf.PDFDocument, pageNumber: number, dpi: number): Uint8Array {
    const page = document.loadPage(pageNumber)
    const zoom = dpi / 72

    return page.toPixmap(
      [zoom, 0, 0, zoom, 0, 0],
      mupdf.ColorSpace.DeviceRGB
    ).asPNG()
}

export function drawPageAsHtml(document: mupdf.PDFDocument, pageNumber: number, id: number) {
    const page = document.loadPage(pageNumber)
    return page.toStructuredText().asHTML(id)
}