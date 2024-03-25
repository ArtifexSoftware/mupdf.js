import * as mupdf from "mupdf"

export function loadPDF(data: Buffer | ArrayBuffer | Uint8Array) {
        let document = new mupdf.PDFDocument(data)
        return document
}
