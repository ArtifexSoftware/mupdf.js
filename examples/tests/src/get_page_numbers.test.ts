import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as mupdf from "mupdf";
import * as tasks from "../mupdfjs.ts";

describe("tasks getPageNumbers", () => {
    let doc: mupdf.PDFDocument;

    beforeAll(() => {
        doc = new mupdf.PDFDocument()
        for (let i = 0; i < 10; i++) {
            doc.insertPage(-1, doc.addPage([0, 0, 595, 842], 0, {}, ""))
        }

        doc.setPageLabels(0, "r", "Cover-");
        doc.setPageLabels(1, "D", "Page-");
        doc.setPageLabels(5, "A", "Appendix-");
    });

    afterAll(() => {
        doc.destroy();
    });

    it("should return correct page numbers for given labels", () => {
        expect(tasks.getPageNumbers(doc, "Cover-i")).toEqual([0]);
        expect(tasks.getPageNumbers(doc, "Page-1")).toEqual([1]);
        expect(tasks.getPageNumbers(doc, "Page-4")).toEqual([4]);
        expect(tasks.getPageNumbers(doc, "Appendix-A")).toEqual([5]);
        expect(tasks.getPageNumbers(doc, "Appendix-E")).toEqual([9]);

    });

    it("should return an empty array for non-existent labels", () => {
        expect(tasks.getPageNumbers(doc, "NonExistent")).toEqual([]);
    });

    it("should stop after first hit when onlyOne is true", () => {
        doc.deletePageLabels(0)
        doc.deletePageLabels(1)
        doc.deletePageLabels(5)
        doc.setPageLabels(0, "D", "Page-");
        doc.setPageLabels(5, "D", "Page-");

        expect(tasks.getPageNumbers(doc, "Page-1", true)).toEqual([0]);
        expect(tasks.getPageNumbers(doc, "Page-1", false)).toEqual([0, 5]);
    });
});
