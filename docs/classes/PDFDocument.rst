.. include:: ../header.rst

.. _Classes_PDFDocument:

PDFDocument
===================


|instance_method_tag|

.. method:: createBlankDocument(width:number = 595, height:number = 842)

    *Static method*.

    Creates and returns a one paged :doc:`PDFDocument`. If no width or height is supplied then the default values for an A4 sized document will be used.

    :arg width: Width of document. 
    :arg height: Height of document.

    :return: `PDFDocument`.

    |example_tag|

    .. code-block:: javascript

        let document = mupdfjs.PDFDocument.createBlankDocument()


.. method:: newPage(pno: number = -1, width: number = 595, height: number = 842)

    Creates and returns a :doc:`PDFPage` at a given place location in a document. If no width or height is supplied then the default values for an A4 sized document will be used.

    :arg pno: The page location in the document to insert the page `0` = start of document, `-1` = end of document.
    :arg width: Width of document. 
    :arg height: Height of document.

    :return: :doc:`PDFPage`.

.. method:: copyPage(pno: number, to: number = -1)

    Copys a page from one index to another in the document.

    :arg pno: The page location in the document to copy the page from, `0` = start of document, `-1` = end of document.
    :arg to: The page location in the document to copy the page to, `0` = start of document, `-1` = end of document.


.. method:: graftPage(insertIndex:number, doc:mupdf.Document, pnoIndexToCopy:number)

    :arg insertIndex: `number`. The page location in the document to copy the page to, `0` = start of document, `-1` = end of document.
    :arg doc: :doc:`PDFDocument`. The document to copy from.
    :arg pnoIndexToCopy: `number`. The page location in the document to copy the page to, `0` = start of document, note you cannot specify `-1` here for the end of the document as the page tree may not be ready. Therefore the page to copy must be explicity defined.


.. method:: deletePage(index)

    Deletes a page at a specific index. Zero-indexed.

    :arg index: `number`. `0` = first page of document.


.. include:: footer.rst
.. include:: ../footer.rst



