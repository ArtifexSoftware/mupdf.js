import * as mupdf from "mupdf"

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
