import * as fs from "fs";
import * as mupdf from "../../../dist/mupdf";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "001003ED.pdf");
const metafile = path.join(scriptdir, "resources", "metadata.txt");

describe("mupdfjs metadata tests", () => {
  let document: mupdf.PDFDocument;

  beforeAll(async () => {
    const data = fs.readFileSync(filename);
    document = (await mupdf.Document.openDocument(
      data,
      "application/pdf"
    )) as mupdf.PDFDocument;
  });

  afterAll(() => {
    document.destroy();
  });

  it("should match metadata with expected result", async () => {
    const metadata = {
      format: document.getMetaData("format"),
      title: document.getMetaData("info:Title"),
      author: document.getMetaData("info:Author"),
      subject: document.getMetaData("info:Subject"),
      keywords: document.getMetaData("info:Keywords"),
      creator: document.getMetaData("info:Creator"),
      producer: document.getMetaData("info:Producer"),
      creationDate: document.getMetaData("info:CreationDate"),
      modDate: document.getMetaData("info:ModDate"),
      trapped: document.getMetaData("info:Trapped"),
      encryption: document.getMetaData("info:Encryption"),
    };

    const expectedMetadata = JSON.parse(fs.readFileSync(metafile, "utf8"));
    // Convert undefined to an empty string
    function normalize(obj: any) {
      return JSON.parse(
        JSON.stringify(obj, (key, value) => (value === undefined ? "" : value))
      );
    }
    expect(normalize(metadata)).toEqual(normalize(expectedMetadata));
  });
});
