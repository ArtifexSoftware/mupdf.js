# MuPDF.js

Welcome to the official MuPDF.js library from [Artifex](https://artifex.com).

This is a build of [MuPDF](https://mupdf.com) for JavaScript and TypeScript,
powered by WebAssembly.

The MuPDF.js library can be used in all common JavaScript environments:
Firefox, Safari, Chrome, Node, Bun, and many others.

## Features

You can use MuPDF.js to build a PDF viewer, or a PDF editor, or to batch
convert PDF files to other formats, or extract text contents. If you can
imagine it, you can build it!

- Open, manipulate, and save PDF files
- Render documents to raster images
- Extract structured text
- Create and edit annotations
- Fill out forms
- Redact sensitive content

## License and Copyright

MuPDF.js is available under Open Source [AGPL](https://www.gnu.org/licenses/agpl-3.0.html) and commercial license agreements.
If you determine you cannot meet the requirements of the AGPL, please [contact Artifex](https://artifex.com/contact/mupdf-inquiry.php) for more information regarding a commercial license.

## Installing the Library

See [INSTALL.md](INSTALL.md) for how to get started using the library.

## Using the Library

Check out the [example projects](examples/) to help you get started.
The examples include a simple PDF Viewer that runs MuPDF in the browser, several command line scripts, and more! 

## Building the Library

See [BUILDING.md](BUILDING.md) for instructions on building the MuPDF.js library from source.

## The "mupdf" module.

This is the stable API that shares its design with our other language bindings for the mutool run command line environment and the Java and Android libraries.
Using this API gives you full control, but assumes some basic knowledge about the PDF file format internals.

The documentation for this module is available here:

https://mupdf.readthedocs.io/en/latest/mupdf-js.html

## The "mupdf/mupdfjs" module.

This is a new and experimental API that aims to provide higher level functionality much like pymupdf does for Python.

The documentation for this module is available here:

https://mupdfjs.readthedocs.io/en/latest/

## Contributing

To contribute please open up (or help answer!) an Issue on our Github project, or create a Pull Request for review.

Find us on Discord at [#mupdf-js](https://discord.gg/zpyAHM7XtF) to chat with us directly.
