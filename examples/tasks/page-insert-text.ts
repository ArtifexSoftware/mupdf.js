import * as mupdf from "mupdf"

export function insertText(
	doc: mupdf.PDFDocument,
	page: mupdf.PDFPage,
	value: string,
	point: mupdf.Point,
	fontName: string = "Times-Roman",
	fontSize: number = 18,
	graphics: {
		strokeColor: mupdf.Color,
		fillColor: mupdf.Color,
		strokeThickness: number
	} = { strokeColor: [0, 0, 0, 1], fillColor: [0, 0, 0, 1], strokeThickness: 1 }
) {
	let page_obj = page.getObject()
	let font = new mupdf.Font(fontName)
	let fontResource = doc.addSimpleFont(font)

	// add object to page/Resources/XObject/F1 dictionary (creating nested dictionaries as needed)
	var resources = page_obj.get("Resources")
	if (!resources.isDictionary())
		page_obj.put("Resources", resources = doc.newDictionary())

	var res_font = resources.get("Font")
	if (!res_font.isDictionary())
		resources.put("Font", res_font = doc.newDictionary())

	res_font.put("F1", fontResource)

	// format this for the PDF markup language

	// this guards against people not sending through the complete parameter set in their "graphics" object 
	// i.e. maybe they send just one or two of them, not all three
	if (graphics.strokeColor == undefined) {
		graphics.strokeColor = [0, 0, 0, 1]
	}

	if (graphics.fillColor == undefined) {
		graphics.fillColor = [0, 0, 0, 1]
	}

	if (graphics.strokeThickness == undefined) {
		graphics.strokeThickness = 1
	}

	if (graphics.strokeColor[3] == undefined) {
		graphics.strokeColor[3] = 1
	}

	if (graphics.fillColor[3] == undefined) {
		graphics.fillColor[3] = 1
	}

	let strokeColor: string = graphics.strokeColor[0] + " " + graphics.strokeColor[1] + " " + graphics.strokeColor[2] + " RG"
	let fillColor: string = graphics.fillColor[0] + " " + graphics.fillColor[1] + " " + graphics.fillColor[2] + " rg"
	let strokeOpacity: string = (graphics.strokeColor[3] * 100).toString()
	let fillOpacity: string = (graphics.fillColor[3] * 100).toString()

	let strokeThicknessMarkup = "2 Tr " + graphics.strokeThickness + " w"

	if (graphics.strokeThickness == 0) {
		strokeThicknessMarkup = ""
	}

	// add the graphics state object to the resources dictionary
	var res_graphics_state = resources.get("ExtGState")
	if (!res_graphics_state.isDictionary())
		resources.put("ExtGState", res_graphics_state = doc.newDictionary())

	var graphicsDict = doc.newDictionary()
	graphicsDict.put("CA", graphics.strokeColor[3])
	graphicsDict.put("ca", graphics.fillColor[3])

	let graphicsStateIdentifier: string = "fitzca" + strokeOpacity + "" + fillOpacity
	res_graphics_state.put(graphicsStateIdentifier, graphicsDict)

	let graphicsState: string = "/" + graphicsStateIdentifier + " gs"

	// invert the Y point
	point[1] = page.getBounds()[3] - (point[1] + fontSize);

	let contentStream: string = "q " + graphicsState + " BT " + strokeColor + " " + fillColor + " " + strokeThicknessMarkup + " /F1 " + fontSize + " Tf " + point[0] + " " + point[1] + " Td (" + value + ") Tj ET Q"
	console.log(`Inserting text to page with content stream:\n${contentStream}`)

	// Create drawing operations
	var extra_contents = doc.addStream(contentStream, {})

	// Add drawing operations to page contents
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
