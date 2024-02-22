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


Getting the Page Bounds
----------------------------------

To get the bounds of page do the following:

|example_tag|

.. code-block:: javascript

    let rect = page.getBounds()

This returns a numerical array object in the following format: `[ulx,uly,lrx,lry]`.
    

Convert a Page to an Image
------------------------------

To convert a page to an image use the `toPixmap` method, after this the `Pixmap`_ data can be converted to the image format you require.

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



Extracting Page Text
-------------------------

To get the text for a page we can retrieve a StructuredText_ object as `JSON` as follows:


|example_tag|

.. code-block:: javascript

    const json = page.toStructuredText("preserve-whitespace").asJSON()
    console.log(`json=${json}`)


StructuredText_ contains objects from a page that have been analyzed and grouped into blocks, lines and spans. As such the `JSON` returned is *structured* and contains positional data and font data alongside text values, e.g.:

|example_tag|

.. literalinclude:: ../structured-text-example.json
   :language: json



Extracting Page Images
----------------------------------


To get the images for a page we can retrieve a StructuredText_ object and `walk <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#walk>`_ through it looking for images as follows:

|example_tag|

.. code-block:: javascript

    page.toStructuredText("preserve-images").walk({
        onImageBlock(bbox, matrix, image) {
            // Image found!
            console.log(`onImageBlock, bbox=${bbox}, transform=${transform}, image=${image}`)
        }
    })

.. note::

    When we obtain StructuredText_ using `toStructuredText` decoding images **does not** happen by default - we have to pass through the `"preserve-images"` parameter. This is because decoding images takes a bit more processing power, so we only do it if requested.


Adding Pages
---------------

Initially you should create a page instance with the `addPage <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#addPage>`_ method on the `Document`_ instance. Then to add the newly created page to the document tree use the `insertPage <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#insertPage>`_ method.

|example_tag|

.. code-block:: javascript

    // create a page with a font and some text
    let helvetica = document.newDictionary()
    helvetica.put("Type", document.newName("Font"))
    helvetica.put("Subtype", document.newName("Type1"))
    helvetica.put("Name", document.newName("Helv"))
    helvetica.put("BaseFont", document.newName("Helvetica"))
    helvetica.put("Encoding", document.newName("WinAnsiEncoding"))
    let fonts = document.newDictionary()
    fonts.put("Helv", helvetica)
    let resources = document.addObject(document.newDictionary())
    resources.put("Font", fonts)
    let page = document.addPage([0,0,300,350], 0, resources, "BT /Helv 12 Tf 100 100 Td (MuPDF!)Tj ET")

    // insert the page at the end of the document
    document.insertPage(-1, page)


Copying Pages
-----------------

To copy a page we can use the `graftPage` method and insert it into a new document.

The following script would copy the last page (`-1`) of another document to the first page (`0`) of a new document:

|example_tag|

.. code-block:: javascript

    let newDocument = new mupdf.PDFDocument()
    newDocument.graftPage(0, anotherDocument, -1)



Deleting Pages
-------------------

To delete a page from a document use the `deletePage <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#deletePage>`_ method on the `Document`_ instance.


|example_tag|

.. code-block:: javascript

    // delete the first page of a document
    document.deletePage(0)

.. note::

    The page number is zero-indexed.


Rotating Pages
---------------------

Rotating a page involves updating keys on the associated `PDFObject`_ for the page. 

The sample code below retrieves the `PDFObject`_ then assigns a 90 degree clockwise rotation to the page.

|example_tag|

.. code-block:: javascript

    // Get the PDF object corresponding to the page
    const page_obj = page.getObject()

    // Update the Rotate value
    page_obj.put("Rotate", rotate + 90)


.. note::

    Positive rotation values are clockwise, negative are anti-clockwise.


Cropping Pages
--------------------

To crop a page we just need to set its "CropBox" value with `setPageBox` and an associated Rectangle_.

|example_tag|

.. code-block:: javascript
    
    page.setPageBox("CropBox", [ 0, 0, 500, 500 ])



.. include:: ../node-footer.rst
.. include:: ../../../footer.rst



