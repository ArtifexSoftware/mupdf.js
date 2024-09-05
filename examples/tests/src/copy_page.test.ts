import * as fs from "fs";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as mupdfjs from "../../../dist/mupdfjs";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "test.pdf");

describe("mupdfjs copyPage tests", () => {
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

  it("should copy a page to the end of the document", () => {
    const initialPageCount = document.countPages();
    document.copyPage(0);  // Copy the first page to the end
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
    document.copyPage(0, insertPosition);  // Copy the first page to the second position
    
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
    expect(() => document.copyPage(invalidPageNumber)).toThrow("bad page number");
  });

  it("should throw an error when copying to an invalid position", () => {
    const invalidInsertPosition = document.countPages() + 2;
    expect(() => document.copyPage(0, invalidInsertPosition)).toThrow("bad page number");
  });
});