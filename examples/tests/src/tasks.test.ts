import {describe, expect, it} from 'vitest'
import path from "path"
import * as fs from "node:fs"
import * as mupdf from "../../../dist/mupdf"
import {drawPageAsPng, loadPDF, drawPageAsHtml, drawPageAsSvg} from "../../../dist/tasks"

const scriptdir = path.resolve(__dirname)
const filename = path.join(scriptdir, "..", "test.pdf")
const outputDir = path.join(scriptdir, "resources")

const file = fs.readFileSync(filename)

describe("loadPDF", () => {
    it("successfully loads a PDF document", () => {
        const file = fs.readFileSync(filename)
        let document: null | mupdf.PDFDocument = null

        expect(() => {
            document = loadPDF(file)
        }).not.toThrow()

        expect(document).not.toBeNull()
    })
})

describe("drawPageAsPng", () => {
    it("successfully renders a page as PNG", () => {
        const document = loadPDF(file)
        const pageNumber = 0

        const result = drawPageAsPng(document, pageNumber, 150)
        expect(result).toHaveLength(173738)
        fs.writeFileSync(
          path.join(outputDir, "output-tasks.png"),
          Buffer.from(result)
        )
    })
})

describe("drawPageAsHtml", () => {
    it("successfully renders a page as HTML", () => {
        const document = loadPDF(file)
        const pageNumber = 0
        const result = drawPageAsHtml(document, pageNumber, 0)

        expect(result).toHaveLength(654)
        fs.writeFileSync(
          path.join(outputDir, "output-tasks.html"),
          Buffer.from(result)
        )
    })
})

describe("drawPageAsSvg", () => {
    it("successfully renders a page as SVG", () => {
        const document = loadPDF(file)
        const pageNumber = 0
        const result = drawPageAsSvg(document, pageNumber)

        expect(result).toHaveLength(91454)
        fs.writeFileSync(
          path.join(outputDir, "output-tasks.svg"),
          Buffer.from(result)
        )
    })
})