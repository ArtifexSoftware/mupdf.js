# MuPDF.js

[![NPM](https://img.shields.io/npm/v/mupdf)](https://www.npmjs.com/package/mupdf)
[![Docs](https://img.shields.io/badge/docs-live-brightgreen)](https://mupdfjs.readthedocs.io)
[![Discord](https://img.shields.io/discord/770681584617652264?color=6A7EC2&logo=discord&logoColor=ffffff)](https://discord.gg/zpyAHM7XtF)
[![License: AGPL](https://img.shields.io/badge/license-AGPL%20%7C%20Commercial-orange)](https://www.gnu.org/licenses/agpl-3.0.html)

**MuPDF.js** is the official JavaScript and TypeScript library for reading, rendering, and manipulating PDF documents. It wraps the [MuPDF](https://mupdf.com) C engine in WebAssembly, so the same high-fidelity rendering runs in Node.js, browsers, Bun, and Deno — with no native dependencies.

```bash
npm install mupdf
```

> **Note:** `mupdf` is an ESM-only module. Use `import`, not `require()`. For TypeScript, set `"module": "nodenext"` in `tsconfig.json`. There is also an older community package called `mupdf-js` (with a hyphen) — that package is deprecated; use `mupdf` instead.

---

## Contents

- [Why mupdf.js](#why-mupdfjs)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Key capabilities](#key-capabilities)
- [Code examples](#code-examples)
- [API overview](#api-overview)
- [Supported formats](#supported-formats)
- [Examples & demos](#examples--demos)
- [Documentation](#documentation)
- [License](#license)

---

## Why mupdf.js

- **High-fidelity rendering** — built on the same MuPDF C engine used in many commercial PDF viewers; pixel-perfect output at any resolution
- **Runs everywhere** — Node.js 14+, Bun, Deno, and all modern browsers via WebAssembly
- **Full editing** — render, annotate, redact, merge, split, and save PDFs; not just a viewer
- **TypeScript-first** — bundled `.d.ts` definitions, no `@types` package required; full IDE auto-completion
- **Zero native dependencies** — the WebAssembly binary is self-contained; no platform-specific builds needed
- **Official & maintained** — developed by Artifex Software, the creators of MuPDF and Ghostscript

---

## Requirements

| Requirement | Version |
|---|---|
| Node.js | 14+ (18+ recommended) |
| Bun | Any current release |
| Deno | With npm compatibility enabled |
| Browsers | Chrome, Firefox, Safari, Edge (all modern versions supporting WebAssembly) |
| Module format | ESM only (`import`, not `require`) |

---

## Installation

```bash
# npm
npm install mupdf

# yarn
yarn add mupdf

# pnpm
pnpm add mupdf
```

The package includes both the JavaScript wrapper and the WebAssembly binary. No additional downloads or build steps are needed.

**ESM module setup**

If your project uses CommonJS by default, set the type to module:

```bash
npm pkg set type=module
```

**TypeScript setup**

Create a `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "module": "nodenext"
  }
}
```

TypeScript definitions are included in the package at `node_modules/mupdf/dist/mupdf.d.ts`. VS Code will pick these up automatically for IntelliSense.

---

## Quick start

**Node.js — render all pages to PNG**

```js
import * as fs from "fs"
import * as mupdf from "mupdf"

const doc = mupdf.Document.openDocument(fs.readFileSync("input.pdf"), "application/pdf")
const n = doc.countPages()

for (let i = 0; i < n; i++) {
  const page = doc.loadPage(i)
  const pixmap = page.toPixmap(
    mupdf.Matrix.scale(96 / 72, 96 / 72),  // 96 DPI
    mupdf.ColorSpace.DeviceRGB
  )
  fs.writeFileSync(`page${i + 1}.png`, pixmap.asPNG())
  pixmap.destroy()
  page.destroy()
}

doc.destroy()
```

**Browser — render the first page to canvas**

```html
<!DOCTYPE html>
<script type="module">
  import * as mupdf from "./node_modules/mupdf/dist/mupdf.js"

  const response = await fetch("./input.pdf")
  const buffer = await response.arrayBuffer()

  const doc = mupdf.Document.openDocument(buffer, "application/pdf")
  const page = doc.loadPage(0)
  const pixmap = page.toPixmap(
    mupdf.Matrix.scale(96 / 72, 96 / 72),
    mupdf.ColorSpace.DeviceRGB
  )

  const blob = new Blob([pixmap.asPNG()], { type: "image/png" })
  const img = document.createElement("img")
  img.src = URL.createObjectURL(blob)
  document.body.appendChild(img)
</script>
```

Serve with a local server (required for Web Workers and WASM loading):

```bash
npx http-server -o index.html
```

---

## Key capabilities

| Area | What you can do |
|---|---|
| **Rendering** | Render pages to PNG, JPEG, or raw pixel data at any DPI via `Pixmap` |
| **Canvas output** | Paint pages directly to an HTML5 Canvas element in the browser |
| **Text extraction** | Extract plain text or structured JSON with font, position, and bounding box data |
| **Text search** | Search across pages; results returned as `Quad` coordinates for highlighting |
| **Annotations** | Create and edit highlights, underlines, sticky notes, free text, shapes, and stamps |
| **Redaction** | Mark regions for redaction and permanently apply them |
| **Page operations** | Insert, delete, reorder, rotate, and crop pages |
| **Document merging** | Graft pages from one PDF into another |
| **Metadata** | Read and write document metadata (title, author, dates, etc.) |
| **Outlines / TOC** | Read and modify the document table of contents |
| **Forms** | Read and write PDF form field (widget) values |
| **Password handling** | Open password-protected PDFs; check and set permissions |
| **Save options** | Incremental updates, garbage collection, compression |
| **TypeScript** | Full type definitions bundled; works with `.mts` or ESM `.ts` files |

---

## Code examples

### Extract text from a PDF

```js
import * as fs from "fs"
import * as mupdf from "mupdf"

const doc = mupdf.Document.openDocument(fs.readFileSync("input.pdf"), "application/pdf")

for (let i = 0; i < doc.countPages(); i++) {
  const page = doc.loadPage(i)
  const text = page.toStructuredText("preserve-whitespace").asText()
  console.log(`--- Page ${i + 1} ---\n${text}`)
  page.destroy()
}

doc.destroy()
```

### Extract structured text as JSON

```js
import * as fs from "fs"
import * as mupdf from "mupdf"

const doc = mupdf.Document.openDocument(fs.readFileSync("input.pdf"), "application/pdf")

const page = doc.loadPage(0)
const json = JSON.parse(page.toStructuredText("preserve-spans").asJSON())

for (const block of json.blocks) {
  if (block.type === "text") {
    for (const line of block.lines) {
      console.log(`[${line.bbox.x}, ${line.bbox.y}] ${line.text}`)
    }
  }
}
```

### Search for text and get match locations

```js
import * as fs from "fs"
import * as mupdf from "mupdf"

const doc = mupdf.Document.openDocument(fs.readFileSync("input.pdf"), "application/pdf")

const page = doc.loadPage(0)
const hits = page.search("invoice number")  // returns array of Quad arrays
console.log(`Found ${hits.length} matches`)
page.destroy()
```

### Add a highlight annotation

```js
import * as fs from "fs"
import * as mupdf from "mupdf"

const doc = mupdf.Document.openDocument(fs.readFileSync("input.pdf"), "application/pdf")
const pdfDoc = doc.asPDF()
const page = pdfDoc.loadPage(0)

const stext = page.toStructuredText()
const quads = stext.search("important")

if (quads.length > 0) {
  const annot = page.createAnnotation("Highlight")
  annot.setQuadPoints(quads)
  annot.setColor([1, 1, 0])  // yellow
  annot.update()
}

fs.writeFileSync("highlighted.pdf", pdfDoc.saveToBuffer("incremental").asUint8Array())
stext.destroy()
page.destroy()
doc.destroy()
```

### Apply redactions

```js
import * as fs from "fs"
import * as mupdf from "mupdf"

const doc = mupdf.Document.openDocument(fs.readFileSync("input.pdf"), "application/pdf")
const pdfDoc = doc.asPDF()
const page = pdfDoc.loadPage(0)

const redact = page.createAnnotation("Redact")
redact.setRect([100, 200, 300, 220])
redact.update()

page.applyRedactions()  // permanently removes content

fs.writeFileSync("redacted.pdf", pdfDoc.saveToBuffer("").asUint8Array())
page.destroy()
doc.destroy()
```

### Merge two PDFs

```js
import * as fs from "fs"
import * as mupdf from "mupdf"

const docA = mupdf.Document.openDocument(fs.readFileSync("first.pdf"), "application/pdf")
const docB = mupdf.Document.openDocument(fs.readFileSync("second.pdf"), "application/pdf")
const pdfA = docA.asPDF()

// Graft all pages from docB to the end of docA
for (let i = 0; i < docB.countPages(); i++) {
  pdfA.graftPage(-1, docB.asPDF(), i)
}

fs.writeFileSync("merged.pdf", pdfA.saveToBuffer("garbage").asUint8Array())
docA.destroy()
docB.destroy()
```

### Load a remote PDF

```js
import * as mupdf from "mupdf"

async function loadRemote(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(response.statusText)
  const buffer = await response.arrayBuffer()
  return mupdf.Document.openDocument(buffer, url)
}

const doc = await loadRemote("https://example.com/report.pdf")
console.log(`Pages: ${doc.countPages()}`)
doc.destroy()
```

### TypeScript example

```ts
import * as mupdf from "mupdf"
import * as fs from "fs"

const buffer: Buffer = fs.readFileSync("input.pdf")
const doc: mupdf.Document = mupdf.Document.openDocument(buffer, "application/pdf")
const page: mupdf.PDFPage = doc.loadPage(0) as mupdf.PDFPage
const pixmap: mupdf.Pixmap = page.toPixmap(
  mupdf.Matrix.identity,
  mupdf.ColorSpace.DeviceRGB,
  false,
  true
)

fs.writeFileSync("output.png", pixmap.asPNG())
pixmap.destroy()
page.destroy()
doc.destroy()
```

### Memory management

MuPDF.js uses WebAssembly memory that is not garbage-collected automatically. Call `.destroy()` on every object when you are done with it:

```js
import * as mupdf from "mupdf"
import * as fs from "fs"

const buffer = fs.readFileSync("input.pdf")
const doc = mupdf.Document.openDocument(buffer, "application/pdf")
try {
  const page = doc.loadPage(0)
  try {
    const pixmap = page.toPixmap(mupdf.Matrix.identity, mupdf.ColorSpace.DeviceRGB, false, true)
    try {
      fs.writeFileSync("output.png", pixmap.asPNG())
    } finally {
      pixmap.destroy()
    }
  } finally {
    page.destroy()
  }
} finally {
  doc.destroy()
}
```

---

## API overview

The main entry points are `Document` (or `PDFDocument` for PDF-specific operations) and `Page` / `PDFPage`.

### Core classes

| Class | Purpose |
|---|---|
| `Document` | Open any supported format; count pages; extract metadata and outline |
| `PDFDocument` | PDF-specific operations: save, encrypt, merge, graft, journal, layers |
| `Page` | Render, extract text, search, and get links from a page |
| `PDFPage` | PDF-specific page operations: annotations, widgets, redactions |
| `Pixmap` | Raster image; save to PNG, JPEG, PAM or draw to Canvas |
| `StructuredText` | Analysed text with blocks, lines, spans, and bounding boxes |
| `PDFAnnotation` | Create and modify PDF annotations |
| `Matrix` | Affine transform for scaling, rotation, and translation |
| `ColorSpace` | Colour spaces: `DeviceRGB`, `DeviceGray`, `DeviceCMYK` |
| `Buffer` | Raw byte buffer for reading/writing file data |

### Key `Document` methods

| Method | Description |
|---|---|
| `Document.openDocument(buffer, magic)` | Open a document from a `Buffer`, `ArrayBuffer`, or file path |
| `doc.countPages()` | Total number of pages |
| `doc.loadPage(n)` | Load page at zero-based index `n`; returns `Page` or `PDFPage` |
| `doc.getMetaData(key)` | Read metadata: `"info:Title"`, `"info:Author"`, `"format"`, etc. |
| `doc.setMetaData(key, value)` | Write metadata fields |
| `doc.loadOutline()` | Return the table of contents as a nested array |
| `doc.isPDF()` | Returns `true` if the document is a PDF |
| `doc.asPDF()` | Cast to `PDFDocument` for PDF-specific operations |
| `doc.needsPassword()` | Returns `true` if the document is password-protected |
| `doc.authenticatePassword(pw)` | Unlock a password-protected document |
| `doc.destroy()` | Release WebAssembly memory |

### Key `Page` / `PDFPage` methods

| Method | Description |
|---|---|
| `page.getBounds()` | Returns `[x0, y0, x1, y1]` bounding rectangle |
| `page.toPixmap(matrix, colorspace, alpha, showExtras)` | Render to a `Pixmap` |
| `page.toStructuredText(options)` | Extract text as a `StructuredText` object |
| `page.search(needle)` | Search for text; returns array of `Quad` arrays |
| `page.getLinks()` | Returns all links on the page |
| `page.getAnnotations()` | Returns all annotations on the page |
| `page.createAnnotation(type)` | Create a new annotation (`"Highlight"`, `"Text"`, `"Redact"`, etc.) |
| `page.applyRedactions()` | Permanently apply all redaction annotations |
| `page.setPageBox(box, rect)` | Set a page box (`"CropBox"`, `"MediaBox"`, etc.) |
| `page.destroy()` | Release WebAssembly memory |

### Key `PDFDocument` methods

| Method | Description |
|---|---|
| `pdfDoc.saveToBuffer(options)` | Serialise to a `Buffer` for saving; options: `"incremental"`, `"garbage"`, `"compress"` |
| `pdfDoc.graftPage(to, srcDoc, srcPage)` | Copy a page from another PDF document |
| `pdfDoc.deletePage(index)` | Delete a page by zero-based index |
| `pdfDoc.rearrangePages(pages)` | Reorder or remove pages by index array |
| `pdfDoc.countVersions()` | Count incremental saves in the file history |
| `pdfDoc.enableJournal()` | Enable undo/redo journalling |

### Key `Pixmap` methods

| Method | Description |
|---|---|
| `pixmap.asPNG()` | Returns the image as a PNG `Buffer` |
| `pixmap.asJPEG(quality)` | Returns the image as a JPEG `Buffer` |
| `pixmap.getWidth()` / `getHeight()` | Pixel dimensions |
| `pixmap.getPixels()` | Raw RGBA pixel data as `Uint8Array` (use with Canvas `ImageData`) |
| `pixmap.setResolution(x, y)` | Set DPI metadata |
| `pixmap.destroy()` | Release WebAssembly memory |

### Key `StructuredText` methods

| Method | Description |
|---|---|
| `stext.asText()` | Plain text string |
| `stext.asJSON(scale)` | JSON with blocks, lines, fonts, and bounding boxes |
| `stext.asHTML(id)` | HTML rendering of the text |
| `stext.search(needle)` | Search within extracted text; returns `Quad` arrays |
| `stext.walk(walker)` | Iterate blocks, lines, and characters with callbacks |
| `stext.destroy()` | Release WebAssembly memory |

---

## Supported formats

**Input:** PDF, XPS, EPUB, MOBI, FB2, CBZ, SVG, TXT, JPEG, PNG, BMP, GIF, TIFF, and other common image formats

**Output:** PDF (via `saveToBuffer`), PNG, JPEG, PAM (via `Pixmap`)

---

## Examples & demos

The [`examples/`](./examples/) directory contains ready-to-run projects:

| Example | Description |
|---|---|
| `examples/simple-viewer/` | PDF viewer running MuPDF in the browser |
| `examples/node-server/` | Node.js REST API for PDF processing |
| `examples/nextjs/` | Next.js client/server PDF app |
| `examples/convert/` | Command-line batch conversion to PNG |
| `examples/text-extract/` | Command-line text extraction script |

See [mupdfjs.readthedocs.io](https://mupdfjs.readthedocs.io) for guides on building web apps, server-side rendering, and desktop apps.

---

## Documentation

| Resource | URL |
|---|---|
| Getting started & how-to guides | https://mupdfjs.readthedocs.io |
| API reference (full JS/TS) | https://mupdf.readthedocs.io/en/latest/reference/javascript/ |
| MuPDF core documentation | https://mupdf.readthedocs.io |
| NPM package | https://www.npmjs.com/package/mupdf |
| Forum | https://forum.mupdf.com |
| GitHub issues | https://github.com/ArtifexSoftware/mupdf.js/issues |

---

## License

mupdf.js is available under two licences:

- **[GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html)** — free for open-source projects. If you distribute software that uses mupdf.js, or provide it as a network service, you must release your source code under the AGPL.
- **Commercial licence** — required for proprietary applications and SaaS products where AGPL compliance is not possible. [Contact Artifex](https://artifex.com/contact/mupdf-js) for pricing.

> The licence applies to both the JavaScript wrapper and the underlying MuPDF WebAssembly binary.