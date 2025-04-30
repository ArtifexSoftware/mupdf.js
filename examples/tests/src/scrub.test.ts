import { describe, expect, it } from "vitest";
import * as mupdf from "mupdf";
import * as tasks from "../mupdfjs.ts";

describe("PDFDocument scrub test", () => {
	it("should clean metadata from a new document", () => {
		// Create a new document
		const doc = tasks.createBlankDocument();

		try {
			// Set and verify Title
			doc.setMetaData("info:Title", "Test Document");
			doc.setMetaData("info:Author", "Test Author");
			doc.setMetaData("info:Subject", "Test Subject");
			doc.setMetaData("info:Keywords", "test, pdf");
			doc.setMetaData("info:Creator", "Test Creator");
			doc.setMetaData("info:Producer", "Test Producer");
			doc.setMetaData("info:CreationDate", "D:20240101000000Z");
			doc.setMetaData("info:ModDate", "D:20240101120000Z");

			expect(doc.getMetaData("info:Title")).toBe("Test Document");
			expect(doc.getMetaData("info:Author")).toBe("Test Author");
			expect(doc.getMetaData("info:Subject")).toBe("Test Subject");
			expect(doc.getMetaData("info:Keywords")).toBe("test, pdf");
			expect(doc.getMetaData("info:Creator")).toBe("Test Creator");
			expect(doc.getMetaData("info:Producer")).toBe("Test Producer");
			expect(doc.getMetaData("info:CreationDate")).toBe("D:20240101000000Z");
			expect(doc.getMetaData("info:ModDate")).toBe("D:20240101120000Z");

			// Scrub metadata
			tasks.scrub(doc, { metadata: true });

			// Verify all metadata is cleaned after scrub
			expect(doc.getMetaData("info:Title")).toBeUndefined();
			expect(doc.getMetaData("info:Author")).toBeUndefined();
			expect(doc.getMetaData("info:Subject")).toBeUndefined();
			expect(doc.getMetaData("info:Keywords")).toBeUndefined();
			expect(doc.getMetaData("info:Creator")).toBeUndefined();
			expect(doc.getMetaData("info:Producer")).toBeUndefined();
			expect(doc.getMetaData("info:CreationDate")).toBeUndefined();
			expect(doc.getMetaData("info:ModDate")).toBeUndefined();
		} finally {
			doc.destroy();
		}
	});

	it("should remove all links from pages", () => {
		// Create a new document
		const doc = tasks.createBlankDocument();

		try {
			// Add a link to the first page
			const page = doc.loadPage(0);
			page.createLink([50, 50, 150, 100], "https://example.com");

			// Verify link exists
			const linksBeforeScrub = page.getLinks();
			expect(linksBeforeScrub.length).toBe(1);
			expect(linksBeforeScrub[0].getURI()).toBe("https://example.com");

			// Scrub links
			tasks.scrub(doc, { removeLinks: true });

			// Verify links are removed
			const linksAfterScrub = page.getLinks();
			expect(linksAfterScrub.length).toBe(0);
		} finally {
			doc.destroy();
		}
	});

	it("should remove file attachment annotations", () => {
		// Create a new document
		const doc = tasks.createBlankDocument();

		try {
			// Add a file attachment annotation to the first page
			const page = doc.loadPage(0);
			const annot = page.createAnnotation("FileAttachment");
			annot.setRect([50, 50, 100, 100]);
			annot.setContents("Test attachment");
			annot.update();

			// Verify file attachment exists
			const annotationsBeforeScrub = page.getAnnotations();
			const fileAttachment = annotationsBeforeScrub.find(
				(a) => a.getType() === "FileAttachment",
			);
			expect(fileAttachment).toBeDefined();

			// Scrub file attachments
			tasks.scrub(doc, { attachedFiles: true });

			// Verify file attachment exists but content is empty
			const annotationsAfterScrub = page.getAnnotations();
			const scrubbedAttachment = annotationsAfterScrub.find(
				(a) => a.getType() === "FileAttachment",
			);
			expect(scrubbedAttachment).toBeDefined();
			expect(annotationsAfterScrub.length).toBe(annotationsBeforeScrub.length);

			// Verify file content is empty
			expect(scrubbedAttachment).toBeDefined();
			if (!scrubbedAttachment) {
				throw new Error("File attachment not found");
			}
			const fileSpec = scrubbedAttachment.getFileSpec();
			expect(fileSpec.isNull()).toBe(true);
		} finally {
			doc.destroy();
		}
	});

	it("should remove JavaScript actions", () => {
		// Create a new document
		const doc = tasks.createBlankDocument();

		try {
			// Add JavaScript action
			const jsAction = doc.newDictionary();
			jsAction.put("S", doc.newName("JavaScript"));
			jsAction.put("JS", doc.newString("app.alert('Hello');"));
			const actionObj = doc.addObject(jsAction);

			// Verify JavaScript exists
			expect(actionObj.get("S").asName()).toBe("JavaScript");
			expect(actionObj.get("JS").asString()).toBe("app.alert('Hello');");

			// Scrub JavaScript
			tasks.scrub(doc, { javascript: true });

			// Verify JavaScript is removed
			const scrubbedObj = doc.newIndirect(actionObj.asIndirect()).resolve();
			expect(scrubbedObj.get("S").asName()).toBe("JavaScript");
			expect(scrubbedObj.get("JS").asString()).toBe("");
		} finally {
			doc.destroy();
		}
	});

	it("should remove XML metadata", () => {
		// Create a new document
		const doc = tasks.createBlankDocument();

		try {
			// Add XML metadata
			const xmlMetadata = `<?xml version="1.0" encoding="UTF-8"?>
				<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
					<rdf:Description>
						<test>Test Value</test>
					</rdf:Description>
				</rdf:RDF>`;
			const root = doc.getTrailer().get("Root");
			const metadata = doc.newDictionary();
			metadata.put("Type", doc.newName("Metadata"));
			metadata.put("Subtype", doc.newName("XML"));
			const stream = doc.addStream(xmlMetadata, {});
			root.put("Metadata", stream);

			// Verify XML metadata exists
			const metadataBeforeScrub = root.get("Metadata");
			expect(metadataBeforeScrub.isStream()).toBe(true);
			const streamBeforeScrub = metadataBeforeScrub.readStream().asString();
			expect(streamBeforeScrub).toContain("Test Value");

			// Scrub XML metadata
			tasks.scrub(doc, { xmlMetadata: true });

			// Verify XML metadata is removed
			const metadataAfterScrub = root.get("Metadata");
			expect(metadataAfterScrub.isNull()).toBe(true);
		} finally {
			doc.destroy();
		}
	});

	it("should remove embedded files", () => {
		// Create a new document
		const doc = tasks.createBlankDocument();

		try {
			// Add embedded file
			const data = new TextEncoder().encode("test data");
			tasks.attachFile(doc, "test.txt", data);

			// Verify embedded file exists
			const root = doc.getTrailer().get("Root");
			const names = root.get("Names");
			expect(names.isDictionary()).toBe(true);
			const embeddedFiles = names.get("EmbeddedFiles");
			expect(embeddedFiles.isDictionary()).toBe(true);
			const dests = embeddedFiles.get("Names");
			expect(dests.isArray()).toBe(true);
			expect(dests.length).toBe(2); // [name, filespec]
			expect(dests.get(0).asString()).toBe("test.txt");

			// Scrub embedded files
			tasks.scrub(doc, { embeddedFiles: true });

			// Verify embedded files are removed
			const namesAfterScrub = root.get("Names");
			const embeddedFilesAfterScrub = namesAfterScrub.get("EmbeddedFiles");
			const destsAfterScrub = embeddedFilesAfterScrub.get("Names");
			expect(destsAfterScrub.isArray()).toBe(true);
			expect(destsAfterScrub.length).toBe(0);
		} finally {
			doc.destroy();
		}
	});

	it("should clean page contents", () => {
		// Create a new document
		const doc = tasks.createBlankDocument();

		try {
			// Create redundant graphics state by adding text content
			const page = doc.loadPage(0);
			const pageObj = page.getObject();

			// Create content with redundant graphics state commands
			const contentStream = `
				BT
				/F1 12 Tf
				1 0 0 1 50 750 Tm
				1 0 0 1 0 0 Tm
				1 0 0 1 0 0 Tm
				(Test) Tj
				1 0 0 1 0 -20 Tm
				1 0 0 1 0 0 Tm
				(Test) Tj
				ET
			`;

			// Add content to page
			const contents = doc.addStream(contentStream, {});
			pageObj.put("Contents", contents);

			// Get initial content size
			const contentsBefore = pageObj.get("Contents");
			const sizeBefore = contentsBefore.readStream().getLength();

			// Scrub with cleanPages option
			tasks.scrub(doc, { cleanPages: true });

			// Verify content is cleaned (should be smaller due to optimization)
			const contentsAfter = pageObj.get("Contents");
			const sizeAfter = contentsAfter.readStream().getLength();

			// Content should not be larger after cleaning
			expect(sizeAfter).toBeLessThanOrEqual(sizeBefore)

			// Content should still be readable
			const text = page.toStructuredText().asText();
			expect(text.trim()).toBe("Test\nTest");
		} finally {
			doc.destroy();
		}
	});

	it("should remove page thumbnails", () => {
		// Create a new document
		const doc = tasks.createBlankDocument();

		try {
			// Add a thumbnail to the first page
			const page = doc.loadPage(0);
			const pageObj = page.getObject();
			const thumbData = new TextEncoder().encode("dummy thumbnail data");
			const thumbStream = doc.addStream(thumbData, {});
			pageObj.put("Thumb", thumbStream);

			// Verify thumbnail exists
			expect(pageObj.get("Thumb").isStream()).toBe(true);

			// Scrub thumbnails
			tasks.scrub(doc, { thumbnails: true });

			// Verify thumbnail is removed
			expect(pageObj.get("Thumb").isNull()).toBe(true);
		} finally {
			doc.destroy();
		}
	});

	it("should reset form fields", () => {
		const doc = tasks.createBlankDocument();

		try {
			// Create and test checkbox
			const page = doc.loadPage(0);
			const checkbox = page.createAnnotation("Widget") as PDFWidget;
			checkbox.setRect([10, 10, 30, 30]);
			const checkboxObj = checkbox.getObject();
			checkboxObj.put("FT", doc.newName("Btn"));
			checkboxObj.put("V", doc.newName("Yes"));
			checkboxObj.put("DV", doc.newName("Off"));
			checkbox.update();

			// Create and test text field
			const textfield = page.createAnnotation("Widget") as PDFWidget;
			textfield.setRect([40, 10, 140, 30]);
			const textObj = textfield.getObject();
			textObj.put("FT", doc.newName("Tx"));
			textObj.put("V", doc.newString("Current Value"));
			textObj.put("DV", doc.newString("Default Value"));
			textfield.update();

			// Verify initial values
			const widgets = page.getWidgets();
			expect(widgets.length).toBe(2);
			expect(widgets[0].getObject().get("V").asName()).toBe("Yes");
			expect(widgets[1].getObject().get("V").asString()).toBe("Current Value");

			// Reset fields
			tasks.scrub(doc, { resetFields: true });

			// Verify reset values
			expect(widgets[0].getObject().get("V").asName()).toBe("Off");
			expect(widgets[1].getObject().get("V").asString()).toBe("Default Value");
		} finally {
			doc.destroy();
		}
	});

	it("should reset annotation responses", () => {
		// Create a new document
		const doc = tasks.createBlankDocument();

		try {
			// Create parent annotation
			const page = doc.loadPage(0);
			const parentAnnot = page.createAnnotation("Text");
			parentAnnot.setRect([50, 50, 70, 70]);
			parentAnnot.setContents("Parent comment");
			parentAnnot.update();

			// Create response annotation
			const responseAnnot = page.createAnnotation("Text");
			responseAnnot.setRect([80, 50, 100, 70]);
			responseAnnot.setContents("Response comment");

			// Set basic response properties
			const responseObj = responseAnnot.getObject();
			responseObj.put("IRT", parentAnnot.getObject());
			responseObj.put("RT", doc.newName("R"));
			responseAnnot.update();

			// Verify response properties exist
			expect(responseObj.get("IRT").isIndirect()).toBe(true);
			expect(responseObj.get("RT").asName()).toBe("R");

			// Scrub responses
			tasks.scrub(doc, { resetResponses: true });

			// Verify response properties are removed
			expect(responseObj.get("IRT").isNull()).toBe(true);
			expect(responseObj.get("RT").isNull()).toBe(true);
		} finally {
			doc.destroy();
		}
	});
});
