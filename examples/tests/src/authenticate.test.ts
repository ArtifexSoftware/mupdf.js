import * as fs from "fs";
import * as mupdf from "mupdf";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as mupdfjs from "../../../dist/mupdfjs";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "encrypted.pdf");

describe("mupdfjs authenticate tests", () => {
  let document: mupdf.PDFDocument;
  let mupdfDocument: mupdfjs.PDFDocument;

  beforeAll(async () => {
    const data = fs.readFileSync(filename);
    document = (await mupdf.Document.openDocument(
      data,
      "application/pdf"
    )) as mupdf.PDFDocument;
    mupdfDocument = (await mupdfjs.PDFDocument.openDocument(
      data,
      "application/pdf"
    )) as mupdfjs.PDFDocument;
  });

  afterAll(() => {
    document.destroy();
    mupdfDocument.destroy();
  });

  it("should authenticate with correct user password", () => {
    const result = mupdfDocument.authenticate("correctpassword");
    expect(result).toBe(2); // 2 indicates user password authentication
  });

  it("should authenticate with correct owner password", () => {
    const result = mupdfDocument.authenticate("ownerpassword");
    expect(result).toBe(4); // 4 indicates owner password authentication
  });

  it("should fail to authenticate with incorrect password", () => {
    const result = mupdfDocument.authenticate("wrongpassword");
    expect(result).toBe(0);
  });

  it("should throw error when document is closed", () => {
    const tempDoc = mupdfjs.PDFDocument.createBlankDocument();
    tempDoc.destroy();
    expect(() => tempDoc.authenticate("anypassword")).toThrow("document closed");
  });
});