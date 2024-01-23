# MuPDF.js

This is a build of [MuPDF](https://mupdf.com) targeting [WebAssembly](https://webassembly.org) environments.

The **MuPDF.js** library (`lib/mupdf.js`) can be used both in browsers and in [Node.js](https://nodejs.org).

This library is very similar in design and use to the **MuPDF Java** library.
The same classes and methods can be used in the same way - but there are also a few
conveniences available here thanks to the dynamic nature of **Javascript** that are
not available in the **Java API**.




## Getting started using NPM

From the command line, go to the folder you want to work from and run:

	npm install mupdf

To verify your installation you can create a file `test.js` with the following script:

	const mupdf = require("mupdf")
	console.log(mupdf)

Then, on the command line, run:

	node test.js

If all is well, this will print the `mupdf` module object to the console.

## Loading a document

The following example demonstrates how to load a document and then print out the page count.
Ensure you have a `my_document.pdf` file alongside this example before trying it.

	const fs = require("fs")
	const mupdf = require("mupdf")
	var data = fs.readFileSync("my_document.pdf")
	var doc = mupdf.Document.openDocument(data, "application/pdf")
	console.log(doc.countPages())

## License and Copyright

**MuPDF.js** is available under [open-source AGPL](https://www.gnu.org/licenses/agpl-3.0.html) and commercial license agreements. If you determine you cannot meet the requirements of the **AGPL**, please [contact Artifex](https://artifex.com/contact/mupdf-inquiry.php) for more information regarding a commercial license.

## Documentation

For documentation please refer to: [https://mupdf.readthedocs.io/](https://mupdf.readthedocs.io/).


---

# Getting Started with Local Development

You can build the **MuPDF.js WebAssembly** libraries from source by referring to [BUILDING.md](https://github.com/ArtifexSoftware/mupdf.js/blob/master/BUILDING.md).

From here you can then try adding code to the main library file `mupdf.js` or adding your own **JavaScript** files or implementations.

Additionally the `viewer` folder contains a simple **HTML PDF Viewer** with its own [README.md](https://github.com/ArtifexSoftware/mupdf.js/blob/master/viewer/README.md) to help you get started.


# Contributing


To contribute please open up (or help answer!) an issue on our **Github** board and create a Pull Request (PR) for review. Find us on **Discord** at [#mupdf](https://discord.gg/DQjvZ6ERqH) to chat with us directly.

