# Building MuPDF.js from source

The WebAssembly build has only been tested on Linux & MacOS at the moment. If you use
any other platform then you are on your own!

## Dependencies

This project has two dependencies that MUST be resolved FIRST!

### Emscripten

You need to install the Emscripten SDK in `/opt/emsdk`.
If you install it elsewhere, you will need to edit the `build.sh` script to point to the appropriate location.

We have only tested against EMSDK version 3.1.55. Use another version at your own peril!

https://emscripten.org/docs/getting_started/downloads.html

	/opt/emsdk/emsdk install 3.1.55
	/opt/emsdk/emsdk activate 3.1.55

### MuPDF Submodule

This project needs the main MuPDF library to be checked out as `libmupdf`.
If the build fails, ensure that you either cloned this repository recursively, or run:

	git submodule update --init --recursive

## Building

The following command will download and install all the NPM project dependencies,
and also compile the WebAssembly and Typescript files:

	npm install

To re-build the library:

	npm run prepare

The results of the build are put into the `dist` directory:

- `dist/mupdf-wasm.wasm`
- `dist/mupdf-wasm.js`
- `dist/mupdf.d.ts`
- `dist/mupdf.js`

The `mupdf-wasm.wasm` file is quite large, because it contains not only the
MuPDF library code, but also the 14 core PDF fonts, various CJK mapping
resources, and ICC profiles.

In order to keep it as small as possible, it is built with a minimal feature set
that excludes the more refined CJK fonts, PDF scripting, XPS format, and EPUB format support.

## Installing and Running

The main module is the `mupdf.js` file.

### Use the MuPDF.js module in a browser

To use MuPDF.js directly in the browser, put the `dist/mupdf-wasm.wasm`,
`dist/mupdf-wasm.js`, and `dist/mupdf.js` somewhere on your site, and import
the `mupdf.js` module.

There's an example of using MuPDF.js in the browser with a WebWorker in `examples/simple-viewer`.

### Use the MuPDF.js module in Node

You can `npm pack` and `npm install` the project in another directory.

You can also run the examples directly from here.

## Editing

The main source files are:

- `src/mupdf.c`
- `src/mupdf.ts`
