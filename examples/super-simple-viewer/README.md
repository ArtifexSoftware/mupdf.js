This is an extremely simple example of using the MuPDF.js module from a web browser.

Since you can't use Javascript modules when the HTML has been opened as a file,
you need to serve the demo up in a web server. For testing you can run a standalone
HTTP server locally (in the top mupdf.js directory, so that the "dist/" directory
that contains the MuPDF.js module is accessible):

	python -m http.server

Then open your browser to the demo page:

	firefox http://localhost:8000/examples/super-simple-viewer/

Then click the "Browse..." button to load a local PDF file into the viewer.
The viewer will then render all the pages in the PDF and insert them as
images into the document.
