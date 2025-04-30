# Super Simple viewer

This is an extremely simple example of using the MuPDF.js module from a web browser.

> You CANNOT run this from the file system!
>
> Modern web browsers refuse to load and run scripts from the file system, so
> this project must be served up by a web server.

Initialize the project:

	npm install

Then to start the HTTP server and open your browser to the viewer:

	npm start

Then click the "Browse..." button to load a local PDF file into the viewer.
The viewer will then render all the pages in the PDF and insert them as
images into the document.
