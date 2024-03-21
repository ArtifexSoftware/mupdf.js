# MuPDF.js

This is a build of [MuPDF](https://mupdf.com) for **JavaScript** & [WebAssembly](https://webassembly.org) environments.

The **MuPDF.js** library (`lib/mupdf.js`) can be used both in browsers and in [Node.js](https://nodejs.org).

## Features

- Fast rendering of **PDF** files
- Search **PDF** files
- **PDF** editing & annotations
- Get **PDF** metadata information
- Manage **PDF** passwords
- Supports basic CJK (Chinese, Japanese, Korean) fonts

## Getting started using NPM

From the command line, go to the folder you want to work from and run:

```bash
npm install mupdf
```

To verify your installation you can create a file `test.mjs` with the following script:

```js
import * as mupdf from "mupdf"

console.log(Object.keys(mupdf))
```

Then, on the command line, run:

```bash
node test.mjs
```

If all is well, this will print the `mupdf` module object to the console.

### Loading a document

The following example demonstrates how to load a document and then print out the page count.
Ensure you have a `my_document.pdf` file alongside this example before trying it.

```js
import * as fs from "fs"
import * as mupdf from "mupdf"

const data = fs.readFileSync("my_document.pdf")
const doc = mupdf.Document.openDocument(data, "application/pdf")
console.log(doc.countPages())
```

## License and Copyright

**MuPDF.js** is available under [open-source AGPL](https://www.gnu.org/licenses/agpl-3.0.html) and commercial license agreements. If you determine you cannot meet the requirements of the **AGPL**, please [contact Artifex](https://artifex.com/contact/mupdf-inquiry.php) for more information regarding a commercial license.

## Documentation

For documentation please refer to: [mupdfjs.readthedocs.io](https://mupdfjs.readthedocs.io).

## Examples

Check the [Github repo](https://github.com/ArtifexSoftware/mupdf.js) for example implementations including a simple **PDF Viewer** to help you get started.

---

## Getting Started with Local Development

You can build the **MuPDF.js WebAssembly** libraries from source by referring to [BUILDING.md](https://github.com/ArtifexSoftware/mupdf.js/blob/master/BUILDING.md).

From here you can then try adding code to the main library file `mupdf.js` or adding your own **JavaScript** files or implementations.

## Contributing

To contribute please open up (or help answer!) an Issue on our **Github** board and create a Pull Request (PR) for review. Find us on **Discord** at [#mupdf-js](https://discord.gg/zpyAHM7XtF) to chat with us directly.
