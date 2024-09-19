.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_Page:
.. _Node_How_To_The_Page_Instance:



Working with Pages
=========================


..
    A **Page** instance has access to the :ref:`Core JavaScript API <Node_How_To_Guide_Document_Core_API>`.



.. _Node_How_To_Guide_Page_Core_API:

.. Core API
    ----------------------------------

    Please see the `Page Class`_ methods within the `Core API`_ for *full details* on the available **JavaScript** methods.

    |

    ----

    **Below details some common operations you may need.**


Loading a Page
----------------------------------

To load a :ref:`page <Node_How_To_Guide_Page>` of a :ref:`document <Node_How_To_Guide_Document>` use the :ref:`PDFPage constructor <Classes_PDFPage>` method to return a page instance. 


|example_tag|

.. code-block:: javascript

    // load the 1st page of the document
    let page = new mupdfjs.PDFPage(document, 0)


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


Extracting Page Annotations
-----------------------------------

We can retrieve :ref:`Annotation objects <Node_How_To_Guide_Annotations>` from pages by querying with `getAnnotations()`.

|example_tag|

.. code-block:: javascript

    const annots = page.getAnnotations()
    console.log(`Annotations=${annots}`)
    


Adding Text to Pages
-------------------------------

The following script creates a blank **PDF** document, adds some styled text to the top of the document using the :meth:`insertText` method, and then saves the result to a file.

|example_tag|

.. code-block:: javascript

    let document = mupdfjs.PDFDocument.createBlankDocument()
    let page = new mupdfjs.PDFPage(document, 0) // get the 1st page of the document
    page.insertText("HELLO WORLD", 
                    [0,0], 
                    "Times-Roman", 
                    20, 
                    {
                        strokeColor:[0,0,0,1], 
                        fillColor:[1,0,0,0.75], 
                        strokeThickness:0.5
                    }
                    )

    fs.writeFileSync("output.pdf", document.saveToBuffer("").asUint8Array())


Adding Images to Pages
-------------------------------

The following script creates a blank **PDF** document, adds an :ref:`Image <Classes_Image>` to the top of the document using the :meth:`insertImage` method, and then saves the result to a file.

|example_tag|

.. code-block:: javascript

    let image = new mupdfjs.Image(fs.readFileSync("logo.png"))
    page.insertImage({image:image, name:"MyLogo"})

    fs.writeFileSync("output.pdf", document.saveToBuffer("").asUint8Array())

.. note::

    See :ref:`coordinate space and PDFObject <How_To_Guide_Coordinate_System_PDF>` for more about how the image is sized and positioned with the `addStream` method.


Adding Pages
---------------

Use the :meth:`newPage` method to add pages to a document, you can choose where to insert the page in the document and the metrics for the new page.

|example_tag|

The code below creates a blank document with a default A4 sized page and then adds a new 300x500 point sized page at the end of the document.

.. code-block:: javascript
    
    // Create a blank document with a blank page
    let document = mupdfjs.PDFDocument.createBlankDocument()

    // Add a page to the end of the document
    document.newPage(-1, 300, 500)




Copying Pages
-----------------

To copy a page we can use the :meth:`copyPage` method and insert it as a new page of the document.

|example_tag|

.. code-block:: javascript

    document.copyPage(0,-1)


Copying pages from another document
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following script uses :meth:`graftPage` to copy the first page (`0`) of another document to the end (`-1`) of the current document:

|example_tag|

.. code-block:: javascript

    let anotherDocument = mupdfjs.PDFDocument.openDocument(fs.readFileSync("test.pdf"), "application/pdf")
    document.graftPage(-1, anotherDocument, 0)



Deleting Pages
-------------------

To delete a page from a document use the :meth:`deletePage` method on the :meth:`Document` instance.


|example_tag|

.. code-block:: javascript

    // delete the first page of a document
    document.deletePage(0)

.. note::

    The page number is zero-indexed.


Rotating Pages
---------------------

|TODO|

Rotating a page involves updating keys on the associated `PDFObject`_ for the page. 

The sample code below retrieves the `PDFObject`_ , then gets the current rotation value, then adds a 90 degree clockwise rotation it.

|example_tag|

.. code-block:: javascript

    // Get the PDF object corresponding to the page
    const page_obj = page.getObject()

    // get the current page rotation
    var rotate = page_obj.getInheritable("Rotate")

    // Update the Rotate value
    page_obj.put("Rotate", rotate + 90)


.. note::

    Positive rotation values are clockwise, negative are anti-clockwise.


Cropping Pages
--------------------

|TODO|

To crop a page we just need to set its "CropBox" value with `setPageBox` and an associated Rectangle_.

|example_tag|

.. code-block:: javascript
    
    page.setPageBox("CropBox", [ 0, 0, 500, 500 ])



.. include:: ../node-footer.rst
.. include:: ../../../footer.rst



