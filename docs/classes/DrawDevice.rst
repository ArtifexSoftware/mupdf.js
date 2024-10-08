.. include:: ../header.rst

.. _Classes_DrawDevice:

DrawDevice
===================

The `DrawDevice` can be used to render to a :doc:`Pixmap`; either by :ref:`running a PDFPage <PDFPage_run>` with it or by calling its methods directly.


|constructor_tag|

.. method:: DrawDevice(matrix: Matrix, pixmap: Pixmap)

    Create a device for drawing into a :doc:`Pixmap`. The :doc:`Pixmap` bounds used should match the transformed page bounds, or you can adjust them to only draw a part of the page.

    :arg matrix: `[a,b,c,d,e,f]`. The transform :ref:`matrix <Glossary_Matrix>`.
    :arg pixmap: :doc:`Pixmap`.

    :return: `DrawDevice`.

    |example_tag|

    .. code-block:: javascript

        var drawDevice = new mupdfjs.DrawDevice(mupdf.Matrix.identity, pixmap);



.. include:: footer.rst
.. include:: ../footer.rst



