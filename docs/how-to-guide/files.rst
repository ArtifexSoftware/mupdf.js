.. _Node_How_To_Guide_Loading_Files:

Working with Files
===================

File Types
-----------------

MuPDF.js supports `these file types <https://mupdf.readthedocs.io/en/1.28.0/guide/what-is-mupdf.html#formats>`_.



Local Files
----------------------------------

An example of loading a local file using the :meth:`openDocument` method with a local string to reference the file path.

|example_tag|

.. code-block:: javascript

    let document = mupdf.PDFDocument.openDocument(fs.readFileSync("test.pdf"),
                                                    "application/pdf")

Remote Files
----------------------------------

An example of loading a remote file which waits for the remote data and then uses the :meth:`openDocument` method with the resulting buffer data.

|example_tag|

.. code-block:: javascript

    async function loadRemoteFile(url) {
        let response = await fetch(url)
        if (!response.ok) {
            console.error(`Cannot fetch document: ${response.statusText}`)
            return
        }
        let data = await response.arrayBuffer()
        let document = mupdf.PDFDocument.openDocument(data, url)
    }

    loadRemoteFile("https://mupdf.com/docs/mupdf_explored.pdf")

.. note::

    After loading a file we receive a :ref:`Document instance <Node_How_To_Guide_Document>` in return.

Saving Files
-----------------

It is up the application developer to work out exactly how they may want to save their file data, however once we have a document instance we can obtain the data in a buffer and use this to save the new file.

For the simplest implementation, which saves the file locally to the current folder location, use the following:

|example_tag|

.. code-block:: javascript

    fs.writeFileSync("output.pdf", document.saveToBuffer("incremental").asUint8Array())

For full details refer to the :meth:`saveToBuffer` method.


Converting Files
-----------------

Files can be converted to image or PDF using various methods.

Document to Image
~~~~~~~~~~~~~~~~~

Here a document is loaded and the first page is converted to an image using the `toPixmap` method. The resulting pixmap is then saved to a new file.

|example_tag|

.. code-block:: javascript

    let doc = mupdf.PDFDocument.openDocument(fs.readFileSync("sample.pdf"))

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


Markdown to PDF
~~~~~~~~~~~~~~~~~

Here a document is loaded from a markdown file and converted to PDF using the `DocumentWriter` class. The resulting buffer is then saved to a new file.

|example_tag|

.. code-block:: javascript

    function convertDocument(input, format, options) {
        var buffer = new mupdf.Buffer()
        var writer = new mupdf.DocumentWriter(buffer, format, options)
        for (var i = 0; i < input.countPages(); ++i) {
                var page = input.loadPage(i)
                var device = writer.beginPage(page.getBounds("CropBox"))
                page.run(device, mupdf.Matrix.identity)
                writer.endPage()
        }
        writer.close()
        return buffer
    }
    
    var doc = mupdf.Document.openDocument("test.md")
    var out = convertDocument(doc, "pdf", "compress")
    out.save("md.pdf")

