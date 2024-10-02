// merge.test.ts
import * as fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { PDFDocument } from "../../../dist/mupdfjs";

const scriptdir = path.resolve(__dirname);
const filename1 = path.join(scriptdir, "resources", "test.pdf");
const filename2 = path.join(scriptdir, "resources", "test.pdf");

describe("PDFDocument merge tests", () => {
    it("should merge two PDF documents", async () => {
        const data1 = fs.readFileSync(filename1);
        const data2 = fs.readFileSync(filename2);
        
        const doc1 = await PDFDocument.openDocument(data1, "application/pdf") as PDFDocument;
        const doc2 = await PDFDocument.openDocument(data2, "application/pdf") as PDFDocument;

        const initialPageCount1 = doc1.countPages();
        const initialPageCount2 = doc2.countPages();

        doc1.merge(doc2);

        expect(doc1.countPages()).toBe(initialPageCount1 + initialPageCount2);

        // Check if the first page of doc2 is now present in doc1
        const mergedPage = doc1.loadPage(initialPageCount1);
        const originalPage = doc2.loadPage(0);
        
        expect(mergedPage.getBounds()).toEqual(originalPage.getBounds());

        doc1.destroy();
        doc2.destroy();
    });

    it("should merge specific pages with rotation", async () => {
        const data1 = fs.readFileSync(filename1);
        const data2 = fs.readFileSync(filename2);
        
        const doc1 = await PDFDocument.openDocument(data1, "application/pdf") as PDFDocument;
        const doc2 = await PDFDocument.openDocument(data2, "application/pdf") as PDFDocument;

        const initialPageCount1 = doc1.countPages();
        
        doc1.merge(doc2, 1, 2, 1, 90); // Merge pages 1-2 from doc2, insert at index 1, rotate 90 degrees

        expect(doc1.countPages()).toBe(initialPageCount1 + 2);

        const mergedPage = doc1.loadPage(1);
        const pageObj = mergedPage.getObject();
        const rotation = pageObj.get("Rotate");
        
        expect(rotation ? rotation.asNumber() : 0).toBe(90);

        doc1.destroy();
        doc2.destroy();
    });
});