const express = require("express")
const app = express()
const cors = require("cors")
const PORT = 8080
const mupdf = require("mupdf")
const fs = require("fs")

var document = null // the mupdf document instance

app.use(cors()) // enables client to talk to server

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})


/** Public API  **/
app.get("/mupdfjs/", (req,res) => {
    res.json({"result":"Hello World!"})
})

app.get("/mupdfjs/openFile/", (req,res) => {
    console.log(`requesting: ${req.query.pdf}`)
    const data = fs.readFileSync(req.query.pdf)
    document = mupdf.Document.openDocument(data, "application/pdf")
    console.log(`Document page count: ${document.countPages()}`)

    res.json({"result": "success",
              "title": req.query.pdf,
              "pageImageData": getPageImage(req.query.pageNumber, 300),
              "pageCount": document.countPages()
            })
})

app.get("/mupdfjs/countPages/", (req,res) => {
    if (document != null) {
        res.json({"result":document.countPages()})
    } else {
        res.json({"result":"No document"})
    } 
})


/* Private methods */
// Note: parameter @pageNumber is *not* zero indexed
function getPageImage(pageNumber, dpi) {

    pageNumber = Number(pageNumber)
    if (document == null) {
        return
    }

    const doc_to_screen = mupdf.Matrix.scale(dpi / 72, dpi / 72)

	let page = document.loadPage(pageNumber - 1)
	let pixmap = page.toPixmap(doc_to_screen, mupdf.ColorSpace.DeviceRGB, false, true)

    let img = pixmap.asPNG()
	pixmap.destroy()

    let base64Image = Buffer.from(img, 'binary').toString('base64')
    return "data:image/png;base64, "+base64Image
     
}

