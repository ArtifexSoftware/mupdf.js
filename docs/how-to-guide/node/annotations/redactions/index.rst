
.. _Node_How_To_Guide_Annotations_Redactions:



Redactions
===============================

Creating Redactions
------------------------

Redactions can be created with the `Redact` type annotation. 

The defined rectangle for the annotation defines the area to redact. If this area **touches document text** then any letters it touches will be completely removed.


Applying a Redaction
~~~~~~~~~~~~~~~~~~~~~~

Once a redaction has been created it will not commit the redaction to the document area until it is applied.

The following example creates a redaction area on the page and then applies the redaction, with options to paint the redacted area in black, and then saves the result as a new file.


|example_tag|

.. code-block:: javascript

    let fileData = fs.readFileSync("test.pdf")

    let document = mupdf.Document.openDocument(fileData, "application/pdf")
    let page = document.loadPage(0)
    let annotation = page.createAnnotation("Redact")
    annotation.setRect([40, 40, 300, 20])
    annotation.applyRedaction(true)

    fs.writeFileSync("output-redact.pdf", document.saveToBuffer("incremental").asUint8Array())


You can also apply all the current redaction annotations on a page at the page-level with:

|example_tag|

.. code-block:: javascript

    page.applyRedactions()


.. note::

    Redactions are secure and any textual or pixel data is irretrievable.

    Find out more on the :meth:`applyRedaction` method.



