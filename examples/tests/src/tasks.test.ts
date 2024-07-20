import {describe, expect, it} from 'vitest'
import path from "path"
import * as fs from "node:fs"
import * as mupdf from "../../../dist/mupdf"
import {drawPageAsPng, loadPDF} from "../../../dist/tasks"
import {drawPageAsPngDataUri} from "../../../src/tasks.ts"

const scriptdir = path.resolve(__dirname)
const filename = path.join(scriptdir, "..", "test.pdf")
const outputDir = path.join(scriptdir, "resources")

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
        const file = fs.readFileSync(filename)
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