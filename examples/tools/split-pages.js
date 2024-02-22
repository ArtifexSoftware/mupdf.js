// This example splits the pages of an input PDF into a separate PDF for each page

const mupdf = require('mupdf')
const fs = require("fs")
const scriptArgs = process.argv.slice(2)

function splitPDFPages() {
    let fileData = fs.readFileSync(scriptArgs[0])

    let document = mupdf.Document.openDocument(fileData, "application/pdf")
    let i = 0

    while (i < document.countPages()) {

        let dstDoc = new mupdf.PDFDocument()
        dstDoc.graftPage(0, document, i)

        // save new pdf document in a buffer
        const buffer = dstDoc.saveToBuffer("compress")

        i++

        fs.writeFileSync("page-"+i+".pdf", buffer.asUint8Array())
    }

}

if (scriptArgs.length < 1)
    console.error("usage: node ./examples/tools/pdf-split.js input.pdf")
else
    splitPDFPages()
