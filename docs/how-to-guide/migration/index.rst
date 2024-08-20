.. include:: ../../header.rst

.. _How_To_Guide_Migration:

Migrating from `mupdf-js`
===========================

This guide is intended to help you migrate from the https://github.com/andytango/mupdf-js
library to this one.

Whilst this package offers a more comprehensive API, we also provide functions
that are similar to those in `mupdf-js` to make the migration easier. These are
available in the `mupdf/tasks` module.

1. Initialization
-------------------

Unlike `mupdf-js`, you don't need to initialize the library before using it.

So you can remove code like this:

.. code-block:: javascript

    import { createMuPdf } from "mupdf-js";

    async function handleSomePdf(file: File) {
      const mupdf = await createMuPdf(); // this is no longer needed
    }
----

2. Loading a document
-------------------

Just like with `mupdf-js`, you can load a document either as a Buffer
(in Node.js), an ArrayBuffer (in the browser), or a Uint8Array (in both environments).

We provide a `loadPDF` function that is similar to the `load` method in `mupdf-js`.
So you can replace this:

.. code-block:: javascript

    import { createMuPdf } from "mupdf-js";

    async function handleSomePdf(file) {
      const mupdf = await createMuPdf();
      const buf = await file.arrayBuffer();
      const arrayBuf = new Uint8Array(buf);
      const doc = mupdf.load(arrayBuf);
    }
----

With this:

.. code-block:: javascript

    import { loadPDF } from "mupdf/tasks";

    async function handleSomePdf(file) {
      const buf = await file.arrayBuffer();
      const arrayBuf = new Uint8Array(buf);
      const doc = loadPDF(arrayBuf); // Returns a Document instance
    }
----

3. Converting a page to an image
-------------------

In `mupdf-js`, you would convert a page to an image like this:

.. code-block:: javascript

    import { createMuPdf } from "mupdf-js";

    async function handleSomePdf(file) {
      const mupdf = await createMuPdf();
      const buf = await file.arrayBuffer();
      const arrayBuf = new Uint8Array(buf);
      const doc = mupdf.load(arrayBuf);

      // Each of these returns a string:

      const png = mupdf.drawPageAsPNG(doc, 1, 300);
      const svg = mupdf.drawPageAsSVG(doc, 1);
      const html = mupdf.drawPageAsHTML(doc, 1);
    }
----

Here's how you would do it with this package:

.. code-block:: javascript

    import {
      loadPDF,
      drawPageAsPNG,
      drawPageAsSVG,
      drawPageAsHTML
    } from "mupdf/tasks";

    async function handleSomePdf(file) {
      const buf = await file.arrayBuffer();
      const arrayBuf = new Uint8Array(buf);
      const doc = loadPDF(arrayBuf);

      // Each of these returns a string:

      const png = drawPageAsPNG(doc, 1, 300);
      const svg = drawPageAsSVG(doc, 1);
      const html = drawPageAsHTML(doc, 1);
    }

----

4. Text operations
-------------------

Finally, we provide two functions to replace the `mupdf-js` `getPageText` and
`searchPageText` functions:

.. code-block:: javascript

    import {
      loadPDF,
      getPageText,
      searchPageText
    } from "mupdf/tasks";

    async function handleSomePdf(file) {
      const buf = await file.arrayBuffer();
      const arrayBuf = new Uint8Array(buf);
      const doc = loadPDF(arrayBuf);

      // Returns plain text for the first page
      const pageText = getPageText(doc, 1);

      // Returns an array of objects with the bounding box for each match:
      const searchResults = searchPageText(doc, 1, "some text");

    }

----

5. Tests
-------------------

You can also
`see the tests <https://github.com/ArtifexSoftware/mupdf.js/blob/master/examples/tests/src/tasks.test.ts>`_
for these functions for more examples of how to use them.


.. include:: ../../footer.rst