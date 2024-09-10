import * as fs from "fs"
import * as tasks from "../../../dist/tasks.js"
import * as mupdfjs from "../../../dist/mupdfjs.js"

const filename = "../test.pdf"
const file = fs.readFileSync(filename)

//let document = tasks.loadPDF(file)

let document = mupdfjs.PDFDocument.createBlankDocument()

let mupdfJSPage = new mupdfjs.PDFPage(document, document.loadPage(0))
mupdfJSPage.insertText("HELLO WORLD", 
                       [100,200], 
                       "Times-Roman", 
                       65, 
                       {strokeColor:[0,0,0,0.8], fillColor:[1,0,0,0.75]})
                 
let image = new mupdfjs.Image(fs.readFileSync("../logo.png"))

mupdfJSPage.insertImage({image:image, name:"MyLogo"}, {x:200, y:300})

fs.writeFileSync("output.pdf", document.saveToBuffer("").asUint8Array())



