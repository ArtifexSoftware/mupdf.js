const mupdf = require("mupdf")
const fs = require("fs")
const data = fs.readFileSync("test.pdf")

var document = null // the mupdf document instance

function loadDocument() {
    try {
        document = mupdf.Document.openDocument(data, "application/pdf")
        console.log(`loadDocument(): success`)
    }
    catch(err) {
        console.log(`loadDocument(): ${err.message}`)
    }
}

function countPages() {
    try {
        let pageCount = document.countPages()
        console.log(`countPages(): succcess. Page count: ${document.countPages()}`)
    }
    catch(err) {
        console.log(`countPages(): ${err.message}`)
    }
}

loadDocument()
countPages()
