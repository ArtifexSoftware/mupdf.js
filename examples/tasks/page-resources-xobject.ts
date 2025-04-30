import * as mupdf from "mupdf"

export function getPageResourcesXObjects(page: mupdf.PDFPage): { key: string | number; value: string }[] {
	let pageObj = page.getObject()
	var isIndirect = pageObj.isIndirect()

	if (isIndirect) {
		pageObj = pageObj.resolve()
	}

	let res = pageObj.get("Resources")
	let resXObj = res.get("XObject")
	let arr: { key: string | number; value: string }[] = []

	resXObj.forEach(function (value: mupdf.PDFObject, key: string | number) {
		arr.push({ key: key, value: value.toString() })
	})

	return arr
}

export function deletePageResourcesXObject(doc: mupdf.PDFDocument, page: mupdf.PDFPage, ref: string) {
	let pageObj = page.getObject()
	var isIndirect = pageObj.isIndirect()

	if (isIndirect) {
		pageObj = pageObj.resolve()
	}

	// replace the XObject with a 1x1 transparent pixel to "delete" it
	let res = pageObj.get("Resources")
	let resXObj = res.get("XObject")
	let pix = new mupdf.Pixmap(mupdf.ColorSpace.DeviceRGB, [ 0, 0, 1, 1 ], true)
	let imageRes = new mupdf.Image(pix)

	const image = doc.addImage(imageRes)
	resXObj.put(ref, image)

	res.put("XObject", resXObj)
	pageObj.put("Resources", res)
}
