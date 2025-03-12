import * as fs from "fs"
import * as mupdfjs from "../../../dist/mupdfjs.js"

// A stress test for opening document and pages 

const filename = "../test.pdf"


// create a blank document and add an annotation
var iteration = 0;

async function start() {

	while (true) {
		// open the document
		const file = fs.readFileSync(filename)
		const doc = mupdfjs.PDFDocument.openDocument(file, 'application/pdf');

		console.log("################################################")
		console.log("open doc, iteration:"+iteration)
		console.log("################################################")

		// load pages, get text and destroy
		for (let pageIdx = 0; pageIdx < doc.countPages(); pageIdx++) {
			const page = new mupdfjs.PDFPage(doc, pageIdx);
			console.log(page.getText());
			page.destroy();
		}
		// close the document
		doc.destroy();

		iteration++;

		// wait for 0.5secs to not overload the CPU
		await new Promise((res) => setTimeout(res, 500));
	}
}


start()

