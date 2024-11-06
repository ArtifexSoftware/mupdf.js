import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Buffer, PDFDocument } from "../../../dist/mupdfjs";

describe('PDFDocument attachFile tests', () => {
    let doc: PDFDocument;

    beforeEach(() => {
        doc = PDFDocument.createBlankDocument();
    });

    afterEach(() => {
        doc.destroy();
    });

    describe('Basic functionality', () => {
        it('should attach and retrieve a text file', () => {
            const content = "Test content";
            const buffer = new Buffer();
            buffer.writeLine(content);
            doc.attachFile("test.txt", buffer);

            const files = doc.getEmbeddedFiles();
            expect("test.txt" in files).toBe(true);

            const fileContent = doc.getEmbeddedFileContents(files["test.txt"]);
            expect(fileContent?.asString().trim()).toBe(content);
        });

        it('should handle different file types', () => {
            const buffer = new Buffer();
            buffer.writeLine("test");

            doc.attachFile("test.pdf", buffer);
            doc.attachFile("test.txt", buffer);
            doc.attachFile("test.xyz", buffer);

            const files = doc.getEmbeddedFiles();
            expect(doc.getEmbeddedFileParams(files["test.pdf"]).mimetype).toBe("application/pdf");
            expect(doc.getEmbeddedFileParams(files["test.txt"]).mimetype).toBe("text/plain");
            expect(doc.getEmbeddedFileParams(files["test.xyz"]).mimetype).toBe("application/octet-stream");
        });
    });

    describe('Document persistence', () => {
        it('should save and load PDF with attachments', () => {
            const buffer = new Buffer();
            buffer.writeLine("Test content");
            doc.attachFile("test.txt", buffer);

            const pdfData = doc.saveToBuffer("").asUint8Array();
            const newDoc = new PDFDocument(pdfData);

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