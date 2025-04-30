# Simple Viewer

This project contains a simple demo of a PDF viewer using the MuPDF.js Library.

This viewer uses a Worker background thread to do the heavy lifting, and
inserts rendered images and text in the DOM as pages scroll into view.

Initialize the project:

	npm install

Then to start the HTTP server and open your browser to the viewer:

	npm start

Use the File menu to open a PDF file.
