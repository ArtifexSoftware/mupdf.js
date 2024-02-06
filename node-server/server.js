const express = require("express")
const app = express()
const cors = require("cors")
const PORT = 8080
const mupdf = require("mupdf")
const fs = require("fs")
const testDocument = "mupdf_explored.pdf"
var document = null // the mupdf document instance

app.use(cors()) // enables client to talk to server

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})

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

// Note: parameter @pageNumber is *not* zero indexed
function getPageImage(pageNumber, dpi) {

    pageNumber = Number(pageNumber)
    if (document == null) {
        return
    }

    const doc_to_screen = mupdf.Matrix.scale(dpi / 72, dpi / 72)

	let page = document.loadPage(pageNumber - 1)
	let bbox = Rect.transform(page.getBounds(), doc_to_screen)
	let pixmap = new mupdf.Pixmap(mupdf.ColorSpace.DeviceRGB, bbox, true)
	pixmap.clear(255)

	let device = new mupdf.DrawDevice(doc_to_screen, pixmap)
	page.run(device, mupdf.Matrix.identity)
	device.close()

	let pixArray = pixmap.getPixels()
	let pixW = pixmap.getWidth()
	let pixH = pixmap.getHeight()

    var img = pixmap.asPNG()
	pixmap.destroy()

    let base64Image = Buffer.from(img, 'binary').toString('base64')
    return "data:image/png;base64, "+base64Image
     
}


/** taken from lib/mupdf.js */
function checkType(value, type) {
	if (typeof type === "string" && typeof value !== type)
		throw new TypeError("expected " + type)
	if (typeof type === "function" && !(value instanceof type))
		throw new TypeError("expected " + type.name)
}

function checkPoint(value) {
	if (!Array.isArray(value) || value.length !== 2)
		throw new TypeError("expected point")
}

function checkRect(value) {
	if (!Array.isArray(value) || value.length !== 4)
		throw new TypeError("expected rectangle")
}

function checkMatrix(value) {
	if (!Array.isArray(value) || value.length !== 6)
		throw new TypeError("expected matrix")
}

function checkQuad(value) {
	if (!Array.isArray(value) || value.length !== 8)
		throw new TypeError("expected quad")
}

function checkColor(value) {
	if (!Array.isArray(value) || (value.length !== 1 && value.length !== 3 && value.length !== 4))
		throw new TypeError("expected color array")
}

const Rect = {
	MIN_INF_RECT: 0x80000000,
	MAX_INF_RECT: 0x7fffff80,
	isEmpty: function (rect) {
		checkRect(rect)
		return rect[0] >= rect[2] || rect[1] >= rect[3]
	},
	isValid: function (rect) {
		checkRect(rect)
		return rect[0] <= rect[2] && rect[1] <= rect[3]
	},
	isInfinite: function (rect) {
		checkRect(rect)
		return (
			rect[0] === Rect.MIN_INF_RECT &&
			rect[1] === Rect.MIN_INF_RECT &&
			rect[2] === Rect.MAX_INF_RECT &&
			rect[3] === Rect.MAX_INF_RECT
		)
	},
	transform: function (rect, matrix) {
		checkRect(rect)
		checkMatrix(matrix)
		var t

		if (Rect.isInfinite(rect))
			return rect
		if (!Rect.isValid(rect))
			return rect

		var ax0 = rect[0] * matrix[0]
		var ax1 = rect[2] * matrix[0]
		if (ax0 > ax1)
			t = ax0, ax0 = ax1, ax1 = t

		var cy0 = rect[1] * matrix[2]
		var cy1 = rect[3] * matrix[2]
		if (cy0 > cy1)
			t = cy0, cy0 = cy1, cy1 = t

		ax0 += cy0 + matrix[4]
		ax1 += cy1 + matrix[4]

		var bx0 = rect[0] * matrix[1]
		var bx1 = rect[2] * matrix[1]
		if (bx0 > bx1)
			t = bx0, bx0 = bx1, bx1 = t

		var dy0 = rect[1] * matrix[3]
		var dy1 = rect[3] * matrix[3]
		if (dy0 > dy1)
			t = dy0, dy0 = dy1, dy1 = t

		bx0 += dy0 + matrix[5]
		bx1 += dy1 + matrix[5]

		return [ ax0, bx0, ax1, bx1 ]
	},
}


