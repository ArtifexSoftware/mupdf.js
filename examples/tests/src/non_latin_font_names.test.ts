import * as fs from "fs";
import * as mupdf from "../../../dist/mupdf";
import * as path from "path";
import { describe, expect, it } from "vitest";

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "resources", "has-bad-fonts.pdf");
const fileData = fs.readFileSync(filename);

describe("Non-Latin font names test", () => {
  it("should handle PDFs with non-Latin font names", async () => {
    const document = await mupdf.Document.openDocument(fileData, "application/pdf") as mupdf.PDFDocument;
    const page = document.loadPage(0);
    const pageObj = page.getObject();
    const resources = pageObj.get("Resources");
    const fonts = resources.get("Font");

    console.log(`File '${filename}' uses the following fonts on page 0:`);
    
    const fontNames: string[] = [];
    fonts.forEach((value, key) => {
      const fontName = value.get("BaseFont").asName();
      fontNames.push(fontName);
    });

    expect(fontNames.length).toBeGreaterThan(0);
    
    const hasNonLatinFont = fontNames.some(name => /[^\u0000-\u007F]/.test(name));
    expect(hasNonLatinFont).toBe(true);

    document.destroy();
  });
});