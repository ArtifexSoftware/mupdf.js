import * as fs from 'fs';
import * as mupdf from "mupdf";
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const scriptdir = path.resolve(__dirname);
const filename = path.join(scriptdir, "..", "resources", "test.pdf");
const outputFilename = path.join(scriptdir, "..", "resources", "output-annotations.pdf");

describe('tasks annotations tests', () => {
    let document: mupdf.PDFDocument;
    let page: mupdf.PDFPage;

    beforeAll(async () => {
        const data = fs.readFileSync(filename);
        document = await mupdf.Document.openDocument(data, 'application/pdf') as mupdf.PDFDocument;
        page = document.loadPage(0);
    });

    afterAll(() => {
        fs.writeFileSync(outputFilename, document.saveToBuffer("incremental").asUint8Array());
        document.destroy();
    });

    it('should add and verify Caret annotation', async () => {
        let caret = page.createAnnotation("Caret");
        caret.setContents("I'm a caret!");
        caret.setRect([100, 50, 0, 0]);
        caret.update();

        const annotations = page.getAnnotations();
        const caretAnnotation = annotations.find(ann => ann.getType() === 'Caret');
        expect(caretAnnotation).toBeDefined();
        if (caretAnnotation) {
            expect(caretAnnotation.getContents()).toBe("I'm a caret!");
        }
    });

    it('should add and verify FreeText annotation', async () => {
        let freeText = page.createAnnotation("FreeText")
        const text = "I'm free text!";
        freeText.setContents(text);
        freeText.setDefaultAppearance("Helv", 16, [0, 1, 0]);
        freeText.setRect([0, 0, 200, 50]);
        freeText.update();

        const annotations = page.getAnnotations();
        const freeTextAnnotation = annotations.find(ann => ann.getType() === 'FreeText');
        expect(freeTextAnnotation).toBeDefined();
        if (freeTextAnnotation) {
            expect(freeTextAnnotation.getContents()).toBe(text);
        }
    });

    it('should add and verify Text annotation', async () => {
        let note = page.createAnnotation("Text");
        const text = "I'm a note!";
        note.setContents(text);
        note.setRect([50, 50, 0, 0]);
        note.update();

        const annotations = page.getAnnotations();
        const textAnnotation = annotations.find(ann => ann.getType() === 'Text');
        expect(textAnnotation).toBeDefined();
        if (textAnnotation) {
            expect(textAnnotation.getContents()).toBe(text);
        }
    });

    it('should add and verify Highlight annotation', async () => {
        let highlight = page.createAnnotation("Highlight");
        highlight.setColor([1, 1, 0]);
        highlight.setQuadPoints([
            [20, 65, 230, 65, 20, 85, 230, 85],
            [20, 90, 230, 90, 20, 110, 230, 110],
        ]);
        highlight.update();

        const annotations = page.getAnnotations();
        const highlightAnnotation = annotations.find(ann => ann.getType() === 'Highlight');
        expect(highlightAnnotation).toBeDefined();
        if (highlightAnnotation) {
            expect(highlightAnnotation.getQuadPoints()).toEqual([
                [20, 65, 230, 65, 20, 85, 230, 85],
                [20, 90, 230, 90, 20, 110, 230, 110],
            ]);
        }
    });

    it('should add and verify Underline annotation', async () => {
        let underline = page.createAnnotation("Underline");
        underline.setColor([0, 1, 0]);
        underline.setQuadPoints([[50, 50, 150, 50, 50, 100, 150, 100]]);
        underline.update();

        const annotations = page.getAnnotations();
        const underlineAnnotation = annotations.find(ann => ann.getType() === 'Underline');
        expect(underlineAnnotation).toBeDefined();
        if (underlineAnnotation) {
            expect(underlineAnnotation.getQuadPoints()).toEqual([[50, 50, 150, 50, 50, 100, 150, 100]]);
        }
    });

    it('should add and verify Squiggly annotation', async () => {
        let squiggly = page.createAnnotation("Squiggly");
        squiggly.setColor([0, 0, 1]);
        squiggly.setQuadPoints([[50, 150, 150, 150, 50, 200, 150, 200]]);
        squiggly.update();

        const annotations = page.getAnnotations();
        const squigglyAnnotation = annotations.find(ann => ann.getType() === 'Squiggly');
        expect(squigglyAnnotation).toBeDefined();
        if (squigglyAnnotation) {
            expect(squigglyAnnotation.getQuadPoints()).toEqual([[50, 150, 150, 150, 50, 200, 150, 200]]);
        }
    });

    it('should add and verify Line annotation', async () => {
        let line = page.createAnnotation("Line");
        line.setColor([0, 0, 0]);
        line.setLine([50, 350], [150, 350]);
        line.update();
    
        const annotations = page.getAnnotations();
        const lineAnnotation = annotations.find(ann => ann.getType() === 'Line');
        expect(lineAnnotation).toBeDefined();
        if (lineAnnotation) {
            expect(lineAnnotation.getLine()).toEqual([[50, 350], [150, 350]]);
        }
    });

    // it('should add and verify Square annotation', async () => {
    //     let square = page.createAnnotation("Square");
    //     square.setColor([0, 1, 1]);
    //     square.setRect([50, 450, 150, 500]);
    //     square.update();

    //     const annotations = page.getAnnotations();
    //     const squareAnnotation = annotations.find(ann => ann.getType() === 'Square');
    //     expect(squareAnnotation).toBeDefined();
    //     if (squareAnnotation) {
    //         expect(squareAnnotation.getRect()).toEqual([50, 450, 150, 500]);
    //     }
    // });

    // it('should add and verify Circle annotation', async () => {
    //     let circle = page.createAnnotation("Circle");
    //     circle.setColor([1, 0, 1]);
    //     circle.setRect([200, 50, 300, 100]);
    //     circle.update();

    //     const annotations = page.getAnnotations();
    //     const circleAnnotation = annotations.find(ann => ann.getType() === 'Circle');
    //     expect(circleAnnotation).toBeDefined();
    //     if (circleAnnotation) {
    //         expect(circleAnnotation.getRect()).toEqual([200, 50, 300, 100]);
    //     }
    // });

    it('should add and verify Polygon annotation', async () => {
        let polygon = page.createAnnotation("Polygon");
        polygon.setColor([1, 1, 0]);
        polygon.setVertices([[100, 150], [200, 150], [150, 200]]);
        polygon.update();

        const annotations = page.getAnnotations();
        const polygonAnnotation = annotations.find(ann => ann.getType() === 'Polygon');
        expect(polygonAnnotation).toBeDefined();
        if (polygonAnnotation) {
            expect(polygonAnnotation.getVertices()).toEqual([[100, 150], [200, 150], [150, 200]]);
        }
    });

    it('should add and verify PolyLine annotation', async () => {
        let polyline = page.createAnnotation("PolyLine");
        polyline.setColor([0, 1, 1]);
        polyline.setVertices([[100, 250], [200, 250], [150, 300]]);
        polyline.update();

        const annotations = page.getAnnotations();
        const polylineAnnotation = annotations.find(ann => ann.getType() === 'PolyLine');
        expect(polylineAnnotation).toBeDefined();
        if (polylineAnnotation) {
            expect(polylineAnnotation.getVertices()).toEqual([[100, 250], [200, 250], [150, 300]]);
        }
    });

    // it('should add and verify Stamp annotation', async () => {
    //     let stamp = page.createAnnotation("Stamp");
    //     stamp.setRect([50, 650, 150, 700]);
    //     stamp.setContents("Approved");
    //     stamp.update();

    //     const annotations = page.getAnnotations();
    //     const stampAnnotation = annotations.find(ann => ann.getType() === 'Stamp');
    //     expect(stampAnnotation).toBeDefined();
    //     if (stampAnnotation) {
    //         expect(stampAnnotation.getRect()).toEqual([50, 650, 150, 700]);
    //         expect(stampAnnotation.getContents()).toBe("Approved");
    //     }
    // });

    it('should delete an annotation', async () => {
        let note = page.createAnnotation("Text");
        const text = "This is a temporary note.";
        note.setContents(text);
        note.setRect([100, 100, 0, 0]);
        note.update();

        let annotations = page.getAnnotations();
        const textAnnotation = annotations.find(ann => ann.getType() === 'Text' && ann.getContents() === text);
        expect(textAnnotation).toBeDefined();

        if (textAnnotation) {
            page.deleteAnnotation(textAnnotation);
            annotations = page.getAnnotations();
            expect(annotations.find(ann => ann.getType() === 'Text' && ann.getContents() === text)).toBeUndefined();
        }
    });
    
});
