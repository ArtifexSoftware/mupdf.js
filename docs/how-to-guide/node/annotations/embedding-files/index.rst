.. include:: ../../../../header.rst
.. include:: ../../node-header.rst

.. _Node_How_To_Guide_Annotations_Embedding_Files:



Embedding Files
===============================



Adding an Embedded File
-----------------------------

Embedding files onto annotation objects requires us to associate a buffer of file data against a `"FileAttachment"` annotation object.

We need to:

- Get a document reference to the file we want to attach.
- Get a document reference to the file we want to add the attachment to.
- Source the page we want to add the file attachment to.
- Create a "FileAttachment" type annotation and set its position.
- Create a `file specification object <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#file-specification-object>`_ and add the attached file data to it.
- Associate the annotation with our newly created file specification object.

|example_tag|

.. code-block:: javascript

    const fs = require("fs")
    const mupdf = require("mupdf")

    let embedMe = mupdf.Document.openDocument(fs.readFileSync("embedMe.pdf"), "application/pdf")
    let document = mupdf.Document.openDocument(fs.readFileSync("test.pdf"), "application/pdf")

    let pdfPage = document.loadPage(0)
    let annotation = pdfPage.createAnnotation("FileAttachment")

    annotation.setRect([50,50,100,100])

    let buffer = embedMe.saveToBuffer("compress")

    let fileSpecObject = document.addEmbeddedFile("embedMe.pdf",
                                                "application/pdf",
                                                buffer,
                                                new Date(),
                                                new Date(),
                                                false)

    annotation.setFileSpec(fileSpecObject)

    fs.writeFileSync("output.pdf", document.saveToBuffer("incremental").asUint8Array())




.. include:: ../../node-footer.rst
.. include:: ../../../../footer.rst
