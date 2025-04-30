import * as mupdf from "mupdf"

export function split(document: mupdf.PDFDocument, range: number[] | undefined) {
	let documents: mupdf.PDFDocument[] = [];
	if (range == undefined || range.length == 0) { // just split out all pages as single PDFs
		for (let i = 0; i < document.countPages(); ++i) {
			let newDoc: mupdf.PDFDocument = new mupdf.PDFDocument()
			newDoc.graftPage(0, document, i);
			documents.push(newDoc);
		}
	} else {
		// we have a defined page ranges to consider, create the correct PDFs
		// build range arrays according to input 
		let ranges: number[][] = [];
		for (let i = 0; i < range.length; ++i) {
			var a: number = range[i] as number;
			if (a < 0)
				throw new Error("Split error: document page indexes cannot be less than zero");
			var nextIndex: number = i + 1;
			var b: number;
			if (nextIndex > range.length - 1)
				b = document.countPages();
			else
				b = range[nextIndex] as number;
			var set: number[] = [];
			for (; a < b; ++a)
				set.push(a);
			ranges.push(set);
		}
		// now cycle the ranges and create the new documents as required
		for (let n = 0; n < ranges.length; ++n) {
			let newDoc = new mupdf.PDFDocument()
			let graftMap = newDoc.newGraftMap()
			if (ranges[n] != undefined) {
				for (let o: number = 0; o < ranges[n]!.length; o++) {
					// note: "o" is the "to" number for graftPage()
					graftMap.graftPage(o, document, ranges[n]![o]!);
				}
				documents.push(newDoc);
			}
		}
	}
	return documents
}
