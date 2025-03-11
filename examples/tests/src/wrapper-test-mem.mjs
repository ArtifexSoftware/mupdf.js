import * as fs from "fs"
import * as mupdfjs from "../../../dist/mupdfjs.js"

// A stress test for opening document and pages 

//const filename = "../mupdf_explored.pdf"
const filename = "../test.pdf"
const file = fs.readFileSync(filename)

// create a blank document and add an annotation
let docManager = new mupdfjs.DocumentManager()
var iteration = 0;

async function start() {

	console.log("################################################")
	console.log("open doc:"+iteration)
	console.log("################################################")
	// open the document
	const doc = docManager.openDocument(file);
	for (let pageIdx = 0; pageIdx < doc.countPages(); pageIdx++) {
		// load some pages
		const page = new mupdfjs.PageManager(doc, pageIdx);
		console.log(page.getText())
		page.destroy();
	}
	// close the document
	doc.destroy();

	iteration++;

	// wait for 0.5secs to not overload the CPU
	setTimeout(start, 500);

} 

start()

