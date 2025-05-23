import * as mupdf from "mupdf"

export function insertImage(
	doc: mupdf.PDFDocument,
	page: mupdf.PDFPage,
	data: { image: mupdf.Image, name: string },
	metrics: { x?: number, y?: number, width?: number, height?: number } = { x: 0, y: 0, width: 0, height: 0 }
) {
	if (data.image == null) {
		throw new Error("Invalid image");
	}

	if (data.name == null || data.name.length == 0) {
		throw new Error("Invalid name");
	}

	let page_obj = page.getObject()

	// add image object to page/Resources/XObject/MyCats dictionary (creating nested dictionaries as needed)
	var res = page_obj.get("Resources")
	if (!res.isDictionary())
		page_obj.put("Resources", res = doc.newDictionary())

	var res_xobj = res.get("XObject")
	if (!res_xobj.isDictionary())
		res.put("XObject", res_xobj = doc.newDictionary())

	const image = doc.addImage(data.image)

	// source some metrics data from sensible defaults if it isn't provided
	if (metrics.width == 0 || metrics.width == undefined) {
		metrics.width = data.image.getWidth()
	}

	if (metrics.height == 0 || metrics.height == undefined) {
		metrics.height = data.image.getHeight()
	}

	if (metrics.x == undefined) {
		metrics.x = 0
	}

	// invert the Y point
	if (metrics.y == undefined) {
		metrics.y = page.getBounds()[3] - metrics.height;
	} else {
		metrics.y = page.getBounds()[3] - (metrics.y + metrics.height);
	}

	res_xobj.put(data.name, image)

	let contentStream: string = "q " + metrics.width + " 0 0 " + metrics.height + " " + metrics.x + " " + metrics.y + " cm /" + data.name + " Do Q"

	console.log(`Inserting image to page with content stream:\n${contentStream}`)

	// create drawing operations
	var extra_contents = doc.addStream(contentStream, null)

	// add drawing operations to page contents
	var page_contents = page_obj.get("Contents")

	if (page_contents.isNull()) {
		page_obj.put("Contents", extra_contents)
	}
	else if (page_contents.isArray()) {
		// Contents is already an array, so append our new buffer object.
		page_contents.push(extra_contents)
	} else {
		// Contents is not an array, so change it into an array
		// and then append our new buffer object.
		var new_page_contents = doc.newArray()
		new_page_contents.push(page_contents)
		new_page_contents.push(extra_contents)
		page_obj.put("Contents", new_page_contents)
	}

}
