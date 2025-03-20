
.. _Classes_PDFGraftMap:

PDFGraftMap
===================

See :meth:`newGraftMap` on the :doc:`PDFDocument` class to create a graft map.

|instance_method_tag|

.. method:: graftObject(obj: PDFObject)

    Use the graft map to copy objects, with the ability to remember previously copied objects.

    :arg object: `PDFObject` to graft.

    |example_tag|

    .. code-block:: javascript

        var map = document.newGraftMap();
        map.graftObject(obj);



.. method:: graftPage(to: number, srcDoc: PDFDocument, srcPage: number)

    Graft a page and its resources at the given page number from the source document to the requested page number in the destination document connected to the map.

    :arg to: `number`. The page number to insert the page before. Page numbers start at `0` and `-1` means at the end of the document.
    :arg srcDoc: `PDFDocument`. Source document.
    :arg srcPage: `number`. Source page number.

    |example_tag|

    .. code-block:: javascript

        var map = dstdoc.newGraftMap();
        map.graftObject(-1, srcdoc, 0);






