// A re-implementation of "mutool merge" in JavaScript.
//
// This example is lower-level than it needs to be in order to illustrate how to
// use the PDFGraftMap and PDFObject functions.
//
// For a real use, you should use map.graftPage() instead of creating and grafting
// the page objects yourself.

import * as fs from "fs"
import * as mupdf from "mupdf"

const scriptArgs = process.argv.slice(2)

function copyPage(dstDoc, srcDoc, pageNumber, dstFromSrc) {
	var srcPage, dstPage
	srcPage = srcDoc.findPage(pageNumber)
	dstPage = dstDoc.newDictionary()
	dstPage.put("Type", dstDoc.newName("Page"))
	if (srcPage.get("MediaBox"))
		dstPage.put("MediaBox", dstFromSrc.graftObject(srcPage.get("MediaBox")))
	if (srcPage.get("Rotate"))
		dstPage.put("Rotate", dstFromSrc.graftObject(srcPage.get("Rotate")))
	if (srcPage.get("Resources"))
		dstPage.put("Resources", dstFromSrc.graftObject(srcPage.get("Resources")))
	if (srcPage.get("Contents"))
		dstPage.put("Contents", dstFromSrc.graftObject(srcPage.get("Contents")))
	dstDoc.insertPage(-1, dstDoc.addObject(dstPage))
}

function copyAllPages(dstDoc, srcDoc) {
	var dstFromSrc = dstDoc.newGraftMap()
	var k,
		n = srcDoc.countPages()
	for (k = 0; k < n; ++k)
		copyPage(dstDoc, srcDoc, k, dstFromSrc)
}

function pdfMerge() {
	var srcDoc, dstDoc, i, srcBuf, dstBuf

	dstDoc = new mupdf.PDFDocument()
	for (i = 1; i < scriptArgs.length; ++i) {
		console.log("OPEN", scriptArgs[i])
		srcBuf = fs.readFileSync(scriptArgs[i])
		srcDoc = mupdf.Document.openDocument(srcBuf, "application/pdf")
		copyAllPages(dstDoc, srcDoc)
	}

	console.log("SAVE", scriptArgs[0])
	dstBuf = dstDoc.saveToBuffer("compress")
	fs.writeFileSync(scriptArgs[0], dstBuf.asUint8Array())
}

if (scriptArgs.length < 2)
	console.error("usage: node ./examples/tools/pdf-merge.js output.pdf input1.pdf input2.pdf ...")
else
	pdfMerge()
