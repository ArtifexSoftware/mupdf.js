import * as fs from "fs";
import * as mupdf from "../../../dist/mupdf";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "encrypted.pdf");

describe("mupdf authenticate tests", () => {
  let document: mupdf.PDFDocument;

  beforeAll(() => {
    const data = fs.readFileSync(filename);
    document = mupdf.Document.openDocument(data, "application/pdf") as mupdf.PDFDocument;
  });

  afterAll(() => {
    document.destroy();
  });

  it("should authenticate with correct user password", () => {
    const result = document.authenticatePassword("correctpassword");
    expect(result).toBe(2); // 2 indicates user password authentication
  });

  it("should authenticate with correct owner password", () => {
    const result = document.authenticatePassword("ownerpassword");
    expect(result).toBe(4); // 4 indicates owner password authentication
  });

  it("should fail to authenticate with incorrect password", () => {
    const result = document.authenticatePassword("wrongpassword");
    expect(result).toBe(0);
  });
});
