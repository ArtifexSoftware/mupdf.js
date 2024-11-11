# MuPDF.js

Welcome to official MuPDF.js library from [Artifex](https://artifex.com) - the maintainers of MuPDF.

This is a build of [MuPDF](https://mupdf.com) for **JavaScript** and **TypeScript**,
using the speed and performance of **WebAssembly**.

The **MuPDF.js** library can be used both in browsers and in Node.js.

## Features

- Render PDF pages to images
- Extract text and images from PDF
- Edit PDF documents
- Search PDF file text contents
- Create and edit PDF annotations
- Access and fill out PDF forms
- Supports basic CJK (Chinese, Japanese, Korean) fonts

## Installing

From the command line, go to the folder you want to work from and run:

```
npm install mupdf
```

The mupdf module is only available as an ESM module.
Either use the `.mjs` file extension or change the project type:

```
npm pkg set type=module
```

## Running

The following example script demonstrates how to load a document and then print out the page count.

Create a file `count-pages.mjs`:

```js
import * as process from "node:process"
import * as fs from "node:fs"
import * as mupdfjs from "mupdf/mupdfjs"

if (process.argv.length < 3) {
    console.error("usage: node count-pages.mjs file.pdf");
    process.exit(1);
}

const filename = process.argv[2];
const doc = mupdfjs.PDFDocument.openDocument(fs.readFileSync(filename), "application/pdf");
const count = doc.countPages();

console.log(`${filename} has ${count} pages.`);
```

Run the script:

```
node count-pages.mjs file.pdf
```

## Using Typescript

To use TypeScript you need to create a `tsconfig.json` project file to tell the
compiler and Visual Studio Code to use the "nodenext" module resolution:

```json
{
    "compilerOptions": {
        "module": "nodenext"
    }
}
```

## License and Copyright

**MuPDF.js** is available under Open Source [AGPL](https://www.gnu.org/licenses/agpl-3.0.html) and commercial license agreements.
If you determine you cannot meet the requirements of the AGPL, please [contact Artifex](https://artifex.com/contact/mupdf-inquiry.php) for more information regarding a commercial license.

## Documentation

For documentation please refer to [mupdfjs.readthedocs.io](https://mupdfjs.readthedocs.io).

## Code Examples

Check out the [example projects](https://github.com/ArtifexSoftware/mupdf.js/tree/master/examples) to help you get started.
The examples include a simple PDF Viewer that runs MuPDF in the browser, several command line scripts, and more! 

## Getting Started with Local Development

You can build the MuPDF.js library from source by referring to [BUILDING.md](https://github.com/ArtifexSoftware/mupdf.js/blob/master/BUILDING.md).

## Contributing

To contribute please open up (or help answer!) an Issue on our **Github** board and create a Pull Request (PR) for review.
Find us on **Discord** at [#mupdf-js](https://discord.gg/zpyAHM7XtF) to chat with us directly.
