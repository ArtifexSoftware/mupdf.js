import * as mupdf from "mupdf"

function copyPage(dstDoc, srcDoc, pageNumber, insertAt, dstFromSrc) {
	var srcPage = srcDoc.findPage(pageNumber)
	var dstPage = dstDoc.newDictionary()
	dstPage.put("Type", dstDoc.newName("Page"))
	if (srcPage.get("MediaBox"))
		dstPage.put("MediaBox", dstFromSrc.graftObject(srcPage.get("MediaBox")))
	if (srcPage.get("Rotate"))
		dstPage.put("Rotate", dstFromSrc.graftObject(srcPage.get("Rotate")))
	if (srcPage.get("Resources"))
		dstPage.put("Resources", dstFromSrc.graftObject(srcPage.get("Resources")))
	if (srcPage.get("Contents"))
		dstPage.put("Contents", dstFromSrc.graftObject(srcPage.get("Contents")))
	dstDoc.insertPage(insertAt, dstDoc.addObject(dstPage))
}

export function merge(targetPDF, sourcePDF, fromPage = 0, toPage = -1, startAt = -1) {
	const sourcePageCount = sourcePDF.countPages()
	const targetPageCount = targetPDF.countPages()
	const graftMap = targetPDF.newGraftMap()
	fromPage = Math.max(0, Math.min(fromPage, sourcePageCount - 1))
	toPage = toPage < 0 ? sourcePageCount - 1 : Math.min(toPage, sourcePageCount - 1)
	startAt = startAt < 0 ? targetPageCount : Math.min(startAt, targetPageCount)
	for (let i = fromPage; i <= toPage; i++)
		copyPage(targetPDF, sourcePDF, i, startAt + (i-fromPage), graftMap)
}
