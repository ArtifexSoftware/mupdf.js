import * as fs from "fs"
import * as mupdf from "../../../dist/mupdf.js"

const filename = "../test.pdf"
const file = fs.readFileSync(filename)

let document = mupdf.PDFDocument.openDocument(file, "application/pdf")

const page = document.loadPage(0)
page.insertText("donkey kong",[10,400],"Times-Roman",50)

fs.writeFileSync("output.pdf", document.saveToBuffer("").asUint8Array())
