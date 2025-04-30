import * as fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as mupdf from "mupdf";
import * as tasks from "../mupdfjs.ts";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "..", "resources", "test.pdf");

describe("tasks deletePages tests", () => {
    let document: mupdf.PDFDocument;

    beforeEach(() => {
        const data = fs.readFileSync(filename);
        document = mupdf.PDFDocument.openDocument(data, "application/pdf")
    });

    afterEach(() => {
        document.destroy();
    });

    it("should delete a single page", () => {
        const initialPageCount = document.countPages();
        tasks.deletePages(document, 1);
        expect(document.countPages()).toBe(initialPageCount - 1);
    });

    it("should delete a range of pages", () => {
        const initialPageCount = document.countPages();
        tasks.deletePages(document, 0, 1);
        expect(document.countPages()).toBe(initialPageCount - 2);
    });

    it("should delete pages using keyword arguments", () => {
        const initialPageCount = document.countPages();
        tasks.deletePages(document, {fromPage: 0, toPage: 1});
        expect(document.countPages()).toBe(initialPageCount - 2);
    });

    it("should delete pages from a list", () => {
        const initialPageCount = document.countPages();
        tasks.deletePages(document, [0, 2]);
        expect(document.countPages()).toBe(initialPageCount - 2);
    });

    it("should handle negative indices", () => {
        const initialPageCount = document.countPages();
        tasks.deletePages(document, {fromPage: -2, toPage: -1});
        expect(document.countPages()).toBe(initialPageCount - 2);
    
        const newPageCount = document.countPages();
        tasks.deletePages(document, -1);
        expect(document.countPages()).toBe(newPageCount - 1);
    });
    
    it("should throw an error for out of range page numbers", () => {
        const initialPageCount = document.countPages();
        expect(() => tasks.deletePages(document, initialPageCount)).toThrow("Bad page number");
        expect(() => tasks.deletePages(document, [0, initialPageCount])).toThrow("Bad page number(s)");
        expect(document.countPages()).toBe(initialPageCount);
    });

    it("should do nothing when no valid pages are specified", () => {
        const initialPageCount = document.countPages();
        tasks.deletePages(document, []);
        expect(document.countPages()).toBe(initialPageCount);
    });

    it("should throw an error for invalid input", () => {
        expect(() => tasks.deletePages(document, "invalid" as any)).toThrow("Invalid argument type");
    });
});
