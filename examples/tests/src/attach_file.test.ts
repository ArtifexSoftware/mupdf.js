import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as mupdf from "mupdf";
import * as tasks from "../mupdfjs.ts";

describe('PDFDocument attachFile tests', () => {
    let doc: mupdf.PDFDocument;

    beforeEach(() => {
        doc = tasks.createBlankDocument();
    });

    afterEach(() => {
        doc.destroy();
    });

    describe('Basic functionality', () => {
        it('should attach and retrieve a text file', () => {
            const content = "Test content";
            tasks.attachFile(doc, "test.txt", new TextEncoder().encode(content));

            const files = doc.getEmbeddedFiles();
            expect("test.txt" in files).toBe(true);

            const fileContent = doc.getEmbeddedFileContents(files["test.txt"]);
            expect(fileContent?.asString().trim()).toBe(content);
        });

        it('should handle different file types', () => {
            const buffer = new TextEncoder().encode("test");

            tasks.attachFile(doc, "test.pdf", buffer);
            tasks.attachFile(doc, "test.txt", buffer);
            tasks.attachFile(doc, "test.xyz", buffer);

            const files = doc.getEmbeddedFiles();
            expect(doc.getEmbeddedFileParams(files["test.pdf"]).mimetype).toBe("application/pdf");
            expect(doc.getEmbeddedFileParams(files["test.txt"]).mimetype).toBe("text/plain");
            expect(doc.getEmbeddedFileParams(files["test.xyz"]).mimetype).toBe("application/octet-stream");
        });
    });

    describe('Document persistence', () => {
        it('should save and load PDF with attachments', () => {
            const buffer = new TextEncoder().encode("Test content");
            tasks.attachFile(doc, "test.txt", buffer);

            const pdfData = doc.saveToBuffer("").asUint8Array();
            const newDoc = new mupdf.PDFDocument(pdfData);

            try {
                const files = newDoc.getEmbeddedFiles();
                expect("test.txt" in files).toBe(true);
                const content = newDoc.getEmbeddedFileContents(files["test.txt"]);
                expect(content?.asString().trim()).toBe("Test content");
            } finally {
                newDoc.destroy();
            }
        });
    });
});
