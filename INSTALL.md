# Install MuPDF.js from NPM

The MuPDF.js library is available on NPM.

From the command line, go to the folder you want to work from and run:

	npm install mupdf

The mupdf module is only available as an ESM module.
Change the NPM project type, or make sure to use the .mjs file extension.

	npm pkg set type=module

To use TypeScript you need to create a "tsconfig.json" project file to tell the
compiler and Visual Studio Code to use the "nodenext" module resolution:

	{
		"compilerOptions": {
			"module": "nodenext"
		}
	}

## Run with Node

The following example script demonstrates how to load a document and render
and save each page as a PNG image.

Save a PDF file named "input.pdf" in the current directory for use with the examples.

Create a file "example.mjs":

	import * as mupdf from "mupdf"

	var doc = mupdf.Document.openDocument("input.pdf")
	var n = doc.countPages()
	for (var i = 0; i < n; ++i) {
		console.log(`Rendering page ${i+1} / ${n}.`)
		var page = doc.loadPage(i)
		var pixmap = page.toPixmap(mupdf.Matrix.scale(96 / 72, 96 / 72), mupdf.ColorSpace.DeviceRGB)
		fs.writeFileSync(`page${i+1}.png`, pixmap.asPNG())
	}

Then run the example script:

	node example.mjs

## Run in the Browser

The following example script demonstrates how to load and render a PDF document in the browser.

Create a file "example.html":

	<!DOCTYPE html>
	<script type="module">
		import * as mupdf from "./node_modules/mupdf/dist/mupdf.js"

		// fetch PDF file
		var response = await fetch("./input.pdf")
		if (!response.ok)
			throw new Error(response.status + " " + response.statusText)
		var buffer = await response.arrayBuffer()

		// open the PDF file and render the first page
		var doc = mupdf.Document.openDocument(buffer)
		var page = doc.loadPage(0)
		var pixmap = page.toPixmap(mupdf.Matrix.scale(96 / 72, 96 / 72), mupdf.ColorSpace.DeviceRGB)

		// create and append an image to the HTML document
		var blob = new Blob([ pixmap.asPNG() ], { type: "image/png" })
		var img = document.createElement("img")
		img.src = URL.createObjectURL(blob)
		document.body.appendChild(img)
	</script>

Serve up this file in a local web server and browse to it.

	npx http-server -o example.html

## Next Steps

Once you've got these examples running, you are set to go!

Here are some useful links to documentation:

- See the [example projects](examples/).
- https://mupdf.readthedocs.io/en/latest/
- https://mupdfjs.readthedocs.io/en/latest/

Good luck!
