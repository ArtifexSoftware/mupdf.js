import * as fs from "fs"
import * as mupdfjs from "../../../dist/tasks.js"

const filename = "../test.pdf"
const file = fs.readFileSync(filename)

let document = mupdfjs.loadPDF(file)
//let document = mupdfjs.PDFDocument.createBlankDocument()

let mupdfJSPage = new mupdfjs.PDFPage(document, document.loadPage(0))
mupdfJSPage.insertText("donkey kong junior", [100,200], "Times-Roman", 40, {strokeColor:[0,0,0,0.2], fillColor:[0,1,0,0.75]})

fs.writeFileSync("output.pdf", document.saveToBuffer("").asUint8Array())
