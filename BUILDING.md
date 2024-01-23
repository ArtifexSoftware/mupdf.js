# Building MuPDF.js from source

The **WebAssembly** build has only been tested on **Linux** & **MacOS** at the moment. If you use
any other platform then you are on your own 🙂.


## Dependencies 

### Emscripten

In order to build you will need to install the **Emscripten SDK** in
`/opt/emsdk`. If you install it elsewhere, you will need to edit the `build.sh`
script to point to the appropriate location.

**See:**

[https://emscripten.org/docs/getting_started/downloads.html](https://emscripten.org/docs/getting_started/downloads.html)


### MuPDF Submodule

This project needs the main **MuPDF** library to be checked out as `libmupdf`.
If the build fails, ensure that you either cloned this repository recursively,
or run: 

	git submodule update --init --recursive

## Running a Build

To build the **WebAssembly** library. On the command line simply run:

	make

---

The results of the build are the files:

- `lib/mupdf-wasm.wasm`
- `lib/mupdf-wasm.js`

These files are not intended for direct use, but only to be used via `lib/mupdf.js` which provides the **MuPDF.js** module.

The `mupdf-wasm.wasm` binary is quite large, because it contains not only the
**MuPDF** library code, but also the 14 core **PDF** fonts, various **CJK** mapping
resources, and **ICC** profiles.

In order to keep it as small as possible, it is built with a minimal feature set
that excludes the more refined **CJK** fonts, **PDF** scripting, **XPS** format, and **EPUB** format support.


---

Separate from the build files in `lib/` is the file `mupdf.js` which is a module that provides a usable **Javascript API** on top of the **MuPDF Wasm** binary. This library works both in [Node.js](https://nodejs.org) and in browsers.


## Cleaning a Build

To clean the **WebAssembly** library. On the command line simply run:

	make clean


