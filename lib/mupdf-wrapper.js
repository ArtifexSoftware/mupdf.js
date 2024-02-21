const mupdfjs = require('./mupdf.js')

const mupdf_wrapper = {

    getMuPDFJS: () => {
        return mupdfjs
    },

    loadPDF: (data) => {
        let document = mupdfjs.Document.openDocument(data, "application/pdf")
        return document
    }

}

if (typeof require === "function") {
    module.exports = mupdf_wrapper
}

