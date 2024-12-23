import { afterEach, describe, expect, it } from "vitest";
import { PDFDocument } from "../../../dist/mupdfjs";

describe("PDFDocument scrub metadata test", () => {
	it("should clean metadata from a new document", () => {
		// Create a new document
		const doc = PDFDocument.createBlankDocument();

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
			doc.scrub({ metadata: true });

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
});
