import * as mupdf from "mupdf"

export function scrub(
	document: mupdf.PDFDocument,
	options: {
		attachedFiles?: boolean,
		cleanPages?: boolean,
		embeddedFiles?: boolean,
		hiddenText?: boolean,
		javascript?: boolean,
		metadata?: boolean,
		redactions?: boolean,
		redactImages?: number,
		removeLinks?: boolean,
		resetFields?: boolean,
		resetResponses?: boolean,
		thumbnails?: boolean,
		xmlMetadata?: boolean,
	}
): void {
	const {
		attachedFiles = true,
		cleanPages = true,
		embeddedFiles = true,
		hiddenText = true,
		javascript = true,
		metadata = true,
		redactions = true,
		redactImages = 0,
		removeLinks = true,
		resetFields = true,
		resetResponses = true,
		thumbnails = true,
		xmlMetadata = true,
	} = options

	// Basic validation
	if (!document.isPDF()) {
		throw new Error("is not PDF")
	}

	if (document.needsPassword()) {
		throw new Error("encrypted doc")
	}

	// Metadata cleaning
	if (metadata) {
		// Clear all standard PDF metadata fields
		document.setMetaData("info:Title", "")
		document.setMetaData("info:Author", "")
		document.setMetaData("info:Subject", "")
		document.setMetaData("info:Keywords", "")
		document.setMetaData("info:Creator", "")
		document.setMetaData("info:Producer", "")
		document.setMetaData("info:CreationDate", "")
		document.setMetaData("info:ModDate", "")
	}

	// Process each page
	const pageCount = document.countPages()
	for (let i = 0; i < pageCount; i++) {
		// Remove links
		if (removeLinks) {
			const page = document.loadPage(i)
			const links = page.getLinks()
			for (const link of links) {
				page.deleteLink(link)
			}
		}

		// Handle attached files
		if (attachedFiles) {
			const page = document.loadPage(i)
			const annotations = page.getAnnotations()
			for (const annot of annotations) {
				if (annot.getType() === "FileAttachment") {
					annot.setFileSpec(document.newNull())
				}
			}
		}

		// Clean pages
		if (cleanPages) {
			const cleanBuffer = document.saveToBuffer("clean=yes")
			const cleanDoc = mupdf.PDFDocument.openDocument(cleanBuffer, "application/pdf") as mupdf.PDFDocument
			// Copy all objects from the cleaned document back to this document
			const pageCount = cleanDoc.countPages()
			for (let j = 0; j < pageCount; j++) {
				const cleanPage = cleanDoc.loadPage(j)
				const cleanPageObj = cleanPage.getObject()
				const thisPage = document.loadPage(j)
				const thisPageObj = thisPage.getObject()
				thisPageObj.put("Contents", document.graftObject(cleanPageObj.get("Contents")))
			}
		}

		// Handle hidden text
		if (hiddenText) {
			// TODO: Implement hidden text removal
		}

		// Handle redactions
		if (redactions) {
			// TODO: Implement redactions
			if (redactImages >= 0) {
				// TODO: Handle redacted images
			}
		}

		// Reset form fields
		if (resetFields) {
			const page = document.loadPage(i)
			const widgets = page.getWidgets()
			for (const widget of widgets) {
				const widgetObj = widget.getObject()
				// Get default value
				const defaultValue = widgetObj.get("DV")
				// Reset value
				if (defaultValue.isNull()) {
					widgetObj.delete("V")
				} else {
					widgetObj.put("V", defaultValue)
				}
				// Update appearance state for checkboxes and radio buttons
				const widgetType = widget.getFieldType()
				if (widgetType === "checkbox" || widgetType === "radiobutton") {
					widgetObj.put("AS", defaultValue.isNull() ? document.newName("Off") : defaultValue)
				}
				widget.update()
			}
		}

		// Reset responses
		if (resetResponses) {
			const page = document.loadPage(i)
			const annotations = page.getAnnotations()
			for (const annot of annotations) {
				const annotObj = annot.getObject()
				// Remove response type and in-response-to reference
				annotObj.delete("RT")
				annotObj.delete("IRT")
				annot.update()
			}
		}

		// Remove thumbnails
		if (thumbnails) {
			const page = document.loadPage(i)
			const pageObj = page.getObject()
			pageObj.delete("Thumb")
		}
	}

	// Handle embedded files
	if (embeddedFiles) {
		const root = document.getTrailer().get("Root")
		const names = root.get("Names")
		if (!names.isNull() && names.isDictionary()) {
			const embeddedFilesDict = names.get("EmbeddedFiles")
			if (!embeddedFilesDict.isNull() && embeddedFilesDict.isDictionary()) {
				const emptyArray = document.newArray()
				embeddedFilesDict.put("Names", emptyArray)
			}
		}
	}

	// Handle JavaScript
	if (javascript) {
		const xrefLength = document.countObjects()
		for (let xref = 1; xref < xrefLength; xref++) {
			const obj = document.newIndirect(xref)
			const resolvedObj = obj.resolve()
			if (resolvedObj.isDictionary()) {
				const type = resolvedObj.get("S")
				if (!type.isNull() && type.asName() === "JavaScript") {
					const newObj = document.newDictionary()
					newObj.put("S", document.newName("JavaScript"))
					newObj.put("JS", document.newString(""))
					obj.writeObject(newObj)
				}
			}
		}
	}

	// Handle XML metadata
	if (xmlMetadata) {
		const root = document.getTrailer().get("Root")
		root.delete("Metadata")
	}
}
