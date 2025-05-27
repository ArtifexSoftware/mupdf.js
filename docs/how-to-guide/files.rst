.. _Node_How_To_Guide_Loading_Files:

Working with Files
===================

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
