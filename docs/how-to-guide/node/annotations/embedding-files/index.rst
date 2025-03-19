.. include:: ../../../../header.rst
.. include:: ../../node-header.rst

.. _Node_How_To_Guide_Annotations_Embedding_Files:


File Attachment Annotations
============================================


There are two ways to embed files - :ref:`directly to a document <Node_How_To_Attach_File_To_Document>` (attaching a file to the whole document)
or as an embedded file on a `"FileAttachment"` annotation.


Creating an Annotation File Attachment
-----------------------------------------

Embedding files onto annotation objects requires us to associate a buffer of file data against a `"FileAttachment"` annotation object.

We need to:

- Create a buffer with the contents of the file we want to attach.
- Get a document reference to the file we want to add the attachment to.
- Source the page we want to add the file attachment to.
- Create a "FileAttachment" type annotation and set its position.
- Create a :ref:`file specification object <Glossary_Object_Filespec_Params_Object>` and add the attached file data to it.
- Associate the annotation with our newly created file specification object.

The following code exemplifies the steps outlined above:

|example_tag|

.. code-block:: javascript

    let embedMe = fs.readFileSync("embedMe.doc")
    let document = mupdf.Document.openDocument(fs.readFileSync("test.pdf"), "application/pdf")

    let page = document.loadPage(0)
    let annotation = page.createAnnotation("FileAttachment")

    annotation.setRect([50,50,100,100])

    let fileSpecObject = document.addEmbeddedFile("embedMe.doc",
                                                "application/msword",
                                                embedMe,
                                                new Date(),
                                                new Date(),
                                                false)

    annotation.setFileSpec(fileSpecObject)

    fs.writeFileSync("output.pdf", document.saveToBuffer("incremental").asUint8Array())


The file attachment will appear as a "push pin" icon by default on the **PDF** document, clicking on the icon will open the attachment.

You can also change the look of the icon with :meth:`setIcon` for this annotation (to a paper clip for example) if required.

Removing an Embedded File on a File Attachment
----------------------------------------------------------------------

To remove an embedded file, retrieve the required "FileAttachment" annotation and set it to `null`.

|example_tag|

.. code-block:: javascript

    annotation.setFileSpec(null)


.. include:: ../../node-footer.rst
.. include:: ../../../../footer.rst
