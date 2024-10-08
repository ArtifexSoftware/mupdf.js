import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as mupdfjs from "../../../dist/mupdfjs";

describe("PDFDocument getPageNumbers", () => {
    let doc: mupdfjs.PDFDocument;

    beforeAll(() => {
        doc = mupdfjs.PDFDocument.createBlankDocument();
        for (let i = 0; i < 9; i++) {
            doc.newPage();
        }

        doc.setPageLabelsArray([
            { startpage: 0, style: "r", prefix: "Cover-" },
            { startpage: 1, style: "D", prefix: "Page-" },
            { startpage: 5, style: "A", prefix: "Appendix-" }
        ]);
    });

    afterAll(() => {
        doc.destroy();
    });

    it("should return correct page numbers for given labels", () => {
        expect(doc.getPageNumbers("Cover-i")).toEqual([0]);
        expect(doc.getPageNumbers("Page-1")).toEqual([1]);
        expect(doc.getPageNumbers("Page-4")).toEqual([4]);
        expect(doc.getPageNumbers("Appendix-A")).toEqual([5]);
        expect(doc.getPageNumbers("Appendix-E")).toEqual([9]);

    });

    it("should return an empty array for non-existent labels", () => {
        expect(doc.getPageNumbers("NonExistent")).toEqual([]);
    });

    it("should stop after first hit when onlyOne is true", () => {
        doc.setPageLabelsArray([
            { startpage: 0, style: "D", prefix: "Page-" },
            { startpage: 5, style: "D", prefix: "Page-" }
        ]);

        expect(doc.getPageNumbers("Page-1", true)).toEqual([0]);
        expect(doc.getPageNumbers("Page-1", false)).toEqual([0, 5]);
    });
});