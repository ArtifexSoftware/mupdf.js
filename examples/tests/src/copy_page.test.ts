import * as fs from "fs";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as mupdf from "mupdf";
import * as tasks from "../mupdfjs.ts";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "..", "resources", "test.pdf");

describe("tasks copyPage tests", () => {
  let document: mupdf.PDFDocument;

  beforeAll(() => {
    const data = fs.readFileSync(filename);
    document = mupdf.PDFDocument.openDocument(data, "application/pdf")
  });

  afterAll(() => {
    document.destroy();
  });

  it("should copy a page to the end of the document", () => {
    const initialPageCount = document.countPages();
    tasks.copyPage(document, 0);  // Copy the first page to the end
    expect(document.countPages()).toBe(initialPageCount + 1);
    
    const firstPage = document.loadPage(0);
    const lastPage = document.loadPage(document.countPages() - 1);
    
    const firstPageText = firstPage.toStructuredText().asText();
    const lastPageText = lastPage.toStructuredText().asText();
    
    expect(firstPageText).toEqual(lastPageText);
    
    firstPage.destroy();
    lastPage.destroy();
  });

  it("should copy a page to a specific position", () => {
    const initialPageCount = document.countPages();
    const insertPosition = 1;
    tasks.copyPage(document, 0, insertPosition);  // Copy the first page to the second position
    
    expect(document.countPages()).toBe(initialPageCount + 1);
    
    const firstPage = document.loadPage(0);
    const copiedPage = document.loadPage(insertPosition);
    
    const firstPageText = firstPage.toStructuredText().asText();
    const copiedPageText = copiedPage.toStructuredText().asText();
    
    expect(firstPageText).toEqual(copiedPageText);
    
    firstPage.destroy();
    copiedPage.destroy();
  });

  it("should throw an error when copying an invalid page", () => {
    const invalidPageNumber = document.countPages() + 1;
    expect(() => tasks.copyPage(document, invalidPageNumber)).toThrow("bad page number");
  });

  it("should throw an error when copying to an invalid position", () => {
    const invalidInsertPosition = document.countPages() + 2;
    expect(() => tasks.copyPage(document, 0, invalidInsertPosition)).toThrow("bad page number");
  });
});
