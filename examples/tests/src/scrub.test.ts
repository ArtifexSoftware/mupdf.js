import { afterEach, describe, expect, it } from "vitest";
import { PDFDocument } from "../../../dist/mupdfjs";

describe("PDFDocument scrub test", () => {
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

	it("should remove all links from pages", () => {
		// Create a new document
		const doc = PDFDocument.createBlankDocument();

		try {
			// Add a link to the first page
			const page = doc.loadPage(0);
			page.createLink([50, 50, 150, 100], "https://example.com");

			// Verify link exists
			const linksBeforeScrub = page.getLinks();
			expect(linksBeforeScrub.length).toBe(1);
			expect(linksBeforeScrub[0].getURI()).toBe("https://example.com");

			// Scrub links
			doc.scrub({ removeLinks: true });

			// Verify links are removed
			const linksAfterScrub = page.getLinks();
			expect(linksAfterScrub.length).toBe(0);
		} finally {
			doc.destroy();
		}
	});
});
