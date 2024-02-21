const mupdf = require('./mupdf.js')

const tasks = {

    loadPDF: (data) => {
        let document = mupdf.Document.openDocument(data, "application/pdf")
        return document
    }

}

if (typeof require === "function") {
    module.exports = tasks
}

