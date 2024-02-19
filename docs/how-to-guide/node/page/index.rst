.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_Page:
.. _Node_How_To_The_Page_Instance:



Working with Pages
=========================

A **Page** instance has access to the :ref:`Core JavaScript API <Node_How_To_Guide_Document_Core_API>`.



.. _Node_How_To_Guide_Page_Core_API:

Core API
----------------------------------

Please see the `Page Class`_ methods within the `Core API`_ for *full details* on the available **JavaScript** methods.

|

----

**Below details some common operations you may need.**


Loading a Page
----------------------------------

To load a page from a :ref:`document <Node_How_To_Guide_Document>` use the `loadPage` method as follows:


|example_tag|

.. code-block:: javascript

    let page = document.loadPage(0)

.. note::

    Pages are zero-indexed, thus "Page 1" = index `0`.
    

Convert a Page to an Image
------------------------------

To convert pages to images use the `toPixmap` method, after this the `Pixmap` data can be converted to the image format you require.

The parameters for the method define:

- the resolution via a matrix
- the `ColorSpace`_ for rendering
- background transparency
- whether to render any annotations on the page.

See: `toPixmap`_ for full details.

|example_tag|

.. code-block:: javascript

    let pixmap = page.toPixmap(mupdf.Matrix.identity, mupdf.ColorSpace.DeviceRGB, false, true)
    let pngImage = pixmap.asPNG()
    let base64Image = Buffer.from(pngImage, 'binary').toString('base64')




.. include:: ../node-footer.rst
.. include:: ../../../footer.rst



