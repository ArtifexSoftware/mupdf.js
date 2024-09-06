import * as fs from "fs";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as mupdfjs from "../../../dist/mupdfjs";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "test.pdf");

describe("mupdfjs PDFDocument newPage tests", () => {
  let document: mupdfjs.PDFDocument;

  beforeAll(async () => {
    const data = fs.readFileSync(filename);
    document = (await mupdfjs.PDFDocument.openDocument(
      data,
      "application/pdf"
    )) as mupdfjs.PDFDocument;
  });

  afterAll(() => {
    document.destroy();
  });

  it("should add a new page at the end of the document", () => {
    const initialPageCount = document.countPages();
    const newPage = document.newPage();
    expect(document.countPages()).toBe(initialPageCount + 1);
    expect(newPage).toBeDefined();
  });

  it("should add a new page at the specified position", () => {
    const initialPageCount = document.countPages();
    const insertPosition = 1;
    const newPage = document.newPage(insertPosition);
    expect(document.countPages()).toBe(initialPageCount + 1);
    expect(newPage).toBeDefined();
  });

  it("should add a new page with custom dimensions", () => {
    const width = 400;
    const height = 600;
    const newPage = document.newPage(-1, width, height);
    expect(newPage).toBeDefined();
    const pageBounds = newPage.getBounds();
    expect(pageBounds[2] - pageBounds[0]).toBeCloseTo(width);
    expect(pageBounds[3] - pageBounds[1]).toBeCloseTo(height);
  });

  it("should throw an error for invalid page dimensions", () => {
    expect(() => document.newPage(-1, 0, 100)).toThrow("Invalid page dimensions");
    expect(() => document.newPage(-1, 100, -1)).toThrow("Invalid page dimensions");
  });

  it("should throw an error for invalid page number", () => {
    const invalidPageNumber = document.countPages() + 1;
    expect(() => document.newPage(invalidPageNumber)).toThrow("Invalid page number");
  });
});