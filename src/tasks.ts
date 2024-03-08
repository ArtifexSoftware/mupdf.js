import * as mupdf from "mupdf"

export function loadPDF(data) {
        let document = new mupdf.PDFDocument(data)
        return document
}
