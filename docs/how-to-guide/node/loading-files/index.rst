.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_Loading_Files:



Loading Files
===================

Local Files
----------------------------------

An example of loading a local file using the `mupdf.Document.openDocument` method with a local string to reference the file path.

.. code-block:: javascript

    async function loadLocalFile(url) {
        let document = mupdf.Document.openDocument(fs.readFileSync(url), "application/pdf")
    }

    loadLocalFile("test.pdf")

Remote Files
----------------------------------

An example of loading a remote file which waits for the remote data and then uses the `mupdf.Document.openDocument` method with the resulting buffer data.

.. code-block:: javascript

    async function loadRemoteFile(url) {
        let response = await fetch(url)
        if (!response.ok) {
            console.error(`Cannot fetch document: ${response.statusText}`)
            return
        }
        let data = await response.arrayBuffer()
        let document = mupdf.Document.openDocument(data, url)
    }

    loadRemoteFile("https://mupdf.com/docs/mupdf_explored.pdf")

.. note::

    After loading a file we receive a :ref:`Document instance <Node_How_To_Guide_Document>` in return.



.. include:: ../node-footer.rst

.. include:: ../../../footer.rst



