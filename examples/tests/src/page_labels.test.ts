import * as fs from "fs";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as mupdfjs from "../../../dist/mupdfjs";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "test.pdf");

describe("mupdfjs Page Labels tests", () => {
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

  it("should set and get page labels correctly", () => {
    const labels = [
      { startpage: 0, prefix: "A-", style: "D", firstpagenum: 2 },
      { startpage: 5, style: "R" },
      { startpage: 10, prefix: "B-", firstpagenum: 3 },
    ];

    document.setPageLabelsArray(labels);
    const retrievedLabels = document.getPageLabels();

    expect(retrievedLabels).toEqual([
      { startpage: 0, prefix: "A-", style: "D", firstpagenum: 2 },
      { startpage: 5, prefix: "", style: "R", firstpagenum: 1 },
      { startpage: 10, prefix: "B-", style: "", firstpagenum: 3 },
    ]);
});

it("should handle missing optional properties", () => {
    const labels = [
      { startpage: 0, style: "D" },
      { startpage: 5, prefix: "B-" },
      { startpage: 10, firstpagenum: 5 },
    ];

    document.setPageLabelsArray(labels);
    const retrievedLabels = document.getPageLabels();

    expect(retrievedLabels).toEqual([
      { startpage: 0, prefix: "", style: "D", firstpagenum: 1 },
      { startpage: 5, prefix: "B-", style: "", firstpagenum: 1 },
      { startpage: 10, prefix: "", style: "", firstpagenum: 5 },
    ]);
});

it("should use default value for firstpagenum when it's 1 or less", () => {
    const labels = [
      { startpage: 0, style: "D", firstpagenum: 1 },
      { startpage: 5, style: "R", firstpagenum: 0 },
      { startpage: 10, style: "A", firstpagenum: 2 },
    ];

    document.setPageLabelsArray(labels);
    const retrievedLabels = document.getPageLabels();

    expect(retrievedLabels).toEqual([
      { startpage: 0, prefix: "", style: "D", firstpagenum: 1 },
      { startpage: 5, prefix: "", style: "R", firstpagenum: 1 },
      { startpage: 10, prefix: "", style: "A", firstpagenum: 2 },
    ]);
});
});