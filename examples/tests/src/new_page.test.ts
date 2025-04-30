import * as fs from "fs";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as mupdf from "mupdf";
import * as tasks from "../mupdfjs.ts";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "..", "resources", "test.pdf");

describe("mupdf PDFDocument newPage tests", () => {
  let document: mupdf.PDFDocument;

  beforeAll(() => {
    const data = fs.readFileSync(filename);
    document = mupdf.PDFDocument.openDocument(data, "application/pdf")
  });

  afterAll(() => {
    document.destroy();
  });

  it("should add a new page at the end of the document", () => {
    const initialPageCount = document.countPages();
    const newPage = tasks.newPage(document);
    expect(document.countPages()).toBe(initialPageCount + 1);
    expect(newPage).toBeDefined();
  });

  it("should add a new page at the specified position", () => {
    const initialPageCount = document.countPages();
    const insertPosition = 1;
    const newPage = tasks.newPage(document, insertPosition);
    expect(document.countPages()).toBe(initialPageCount + 1);
    expect(newPage).toBeDefined();
  });

  it("should add a new page with custom dimensions", () => {
    const width = 400;
    const height = 600;
    const newPage = tasks.newPage(document, -1, width, height);
    expect(newPage).toBeDefined();
    const pageBounds = newPage.getBounds();
    expect(pageBounds[2] - pageBounds[0]).toBeCloseTo(width);
    expect(pageBounds[3] - pageBounds[1]).toBeCloseTo(height);
  });

  it("should throw an error for invalid page dimensions", () => {
    expect(() => tasks.newPage(document, -1, 0, 100)).toThrow("Invalid page dimensions");
    expect(() => tasks.newPage(document, -1, 100, -1)).toThrow("Invalid page dimensions");
  });

  it("should throw an error for invalid page number", () => {
    const invalidPageNumber = document.countPages() + 1;
    expect(() => tasks.newPage(document, invalidPageNumber)).toThrow("Invalid page number");
  });
});
