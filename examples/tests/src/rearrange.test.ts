import * as fs from "fs";
import * as mupdf from "mupdf";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "..", "resources", "test.pdf");
const data = fs.readFileSync(filename);

describe("mupdf rearrangePages operation", () => {
  let document: mupdf.PDFDocument;

  beforeEach(async () => {
    document = mupdf.Document.openDocument(
      data,
      "application/pdf"
    ) as mupdf.PDFDocument;
  });

  afterEach(() => {
    document.destroy();
  });

  it("should rearrange all pages in document", () => {
    const structedTextFirstPage = document
      .loadPage(0)
      .toStructuredText()
      .asJSON();
    const structedTextSecondPage = document
      .loadPage(1)
      .toStructuredText()
      .asJSON();
    const structedTextThirdPage = document
      .loadPage(2)
      .toStructuredText()
      .asJSON();

    document.rearrangePages([2, 1, 0]);

    expect(document.countPages()).toBe(3);
    expect(document.loadPage(0).toStructuredText().asJSON()).toStrictEqual(
      structedTextThirdPage
    );
    expect(document.loadPage(1).toStructuredText().asJSON()).toStrictEqual(
      structedTextSecondPage
    );
    expect(document.loadPage(2).toStructuredText().asJSON()).toStrictEqual(
      structedTextFirstPage
    );
  });

  it("should rearrange some pages in document", () => {
    document.rearrangePages([2, 1]);

    expect(document.countPages()).toBe(2);
    expect(document.loadPage(0)).toBeInstanceOf(mupdf.PDFPage);
    expect(document.loadPage(1)).toBeInstanceOf(mupdf.PDFPage);
    expect(() => document.loadPage(2)).toThrowError("invalid page number: 3");
  });
});
