import * as fs from "fs";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import * as mupdfjs from "../../../dist/mupdfjs";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "test.pdf");

describe("mupdfjs deletePages tests", () => {
    let document: mupdfjs.PDFDocument;

    beforeEach(async () => {
        const data = fs.readFileSync(filename);
        document = (await mupdfjs.PDFDocument.openDocument(
            data,
            "application/pdf"
        )) as mupdfjs.PDFDocument;
    });

    afterEach(() => {
        document.destroy();
    });

    it("should delete a single page", () => {
        const initialPageCount = document.countPages();
        document.deletePages(1);
        expect(document.countPages()).toBe(initialPageCount - 1);
    });

    it("should delete a range of pages", () => {
        const initialPageCount = document.countPages();
        document.deletePages(0, 1);
        expect(document.countPages()).toBe(initialPageCount - 2);
    });

    it("should delete pages using keyword arguments", () => {
        const initialPageCount = document.countPages();
        document.deletePages({fromPage: 0, toPage: 1});
        expect(document.countPages()).toBe(initialPageCount - 2);
    });

    it("should delete pages from a list", () => {
        const initialPageCount = document.countPages();
        document.deletePages([0, 2]);
        expect(document.countPages()).toBe(initialPageCount - 2);
    });

    it("should handle negative indices", () => {
        const initialPageCount = document.countPages();
        document.deletePages({fromPage: -2, toPage: -1});
        expect(document.countPages()).toBe(initialPageCount - 2);
    
        const newPageCount = document.countPages();
        document.deletePages(-1);
        expect(document.countPages()).toBe(newPageCount - 1);
    });
    
    it("should throw an error for out of range page numbers", () => {
        const initialPageCount = document.countPages();
        expect(() => document.deletePages(initialPageCount)).toThrow("Bad page number");
        expect(() => document.deletePages([0, initialPageCount])).toThrow("Bad page number(s)");
        expect(document.countPages()).toBe(initialPageCount);
    });

    it("should do nothing when no valid pages are specified", () => {
        const initialPageCount = document.countPages();
        document.deletePages([]);
        expect(document.countPages()).toBe(initialPageCount);
    });

    it("should throw an error for invalid input", () => {
        expect(() => document.deletePages("invalid" as any)).toThrow("Invalid argument type");
    });
});