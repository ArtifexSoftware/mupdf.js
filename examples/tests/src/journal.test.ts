import * as fs from "fs";
import * as mupdf from "mupdf";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "..", "test.pdf");
const data = fs.readFileSync(filename);

describe("mupdfjs journal operations", () => {
  let document: mupdf.PDFDocument;

  beforeEach(() => {
    document = mupdf.Document.openDocument(
      data,
      "application/pdf"
    ) as mupdf.PDFDocument;

    document.enableJournal();
  });

  afterEach(() => {
    document.destroy();
  });

  it("should reflect operations in journal", () => {
    document.beginOperation("deletePage");
    document.deletePage(0);
    document.endOperation();

    expect(document.countPages()).toBe(2);
    expect(document.canUndo()).toBe(true);
    expect(document.hasUnsavedChanges()).toBe(true);
    expect(document.getJournal()).toStrictEqual({
      position: 1,
      steps: ["deletePage"],
    });
  });

  it("should undo an operation", () => {
    document.beginOperation("deletePage");
    document.deletePage(0);
    document.endOperation();
    document.undo();

    expect(document.canUndo()).toBe(false);
    expect(document.countPages()).toBe(3);
    expect(document.hasUnsavedChanges()).toBe(false);
    expect(document.getJournal()).toStrictEqual({
      position: 0,
      steps: ["deletePage"],
    });
    expect(() => document.loadPage(2)).not.toThrowError(
      "invalid page number: 3"
    );
  });

  it("should redo an operation", () => {
    document.beginOperation("deletePage");
    document.deletePage(0);
    document.endOperation();
    document.undo();
    document.redo();

    expect(document.countPages()).toBe(2);
    expect(() => document.loadPage(2)).toThrowError("invalid page number: 3");
    expect(document.hasUnsavedChanges()).toBe(true);
    expect(document.getJournal()).toStrictEqual({
      position: 1,
      steps: ["deletePage"],
    });
  });
});
