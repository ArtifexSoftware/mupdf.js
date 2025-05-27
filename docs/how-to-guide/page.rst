.. _Node_How_To_Guide_Page:
.. _Node_How_To_The_Page_Instance:

Working with Pages
=========================

.. _Node_How_To_Guide_Page_Core_API:

A **Page** is an instance of the :doc:`../../../classes/PDFPage` class.

Loading a Page
----------------------------------

To load a :ref:`page <Node_How_To_Guide_Page>` of a :ref:`document <Node_How_To_Guide_Document>` use the :meth:`document.loadPage` method to return a page instance.

|example_tag|

.. code-block:: javascript

    // load the 1st page of the document
    let page = document.loadPage(0)

Getting the Page Bounds
----------------------------------

To get the bounds of page do the following:

|example_tag|

.. code-block:: javascript

    let rect = page.getBounds()

This returns a numerical array object in the following format: `[ulx,uly,lrx,lry]`.

Convert a Page to an Image
------------------------------

To convert a page to an image use the :meth:`toPixmap` method, after this the :doc:`../../../classes/Pixmap` data can be converted to the image format you require.

The parameters for the method define:

- the resolution via a matrix
- the :doc:`../../../classes/ColorSpace` for rendering
- background transparency
- whether to render any annotations on the page.

|example_tag|

.. code-block:: javascript

    let pixmap = page.toPixmap(mupdf.Matrix.identity, mupdf.ColorSpace.DeviceRGB, false, true)
    let pngImage = pixmap.asPNG()
    let base64Image = Buffer.from(pngImage, 'binary').toString('base64')

Extracting Page Text
-------------------------

There are two methods for extracting text, one which simply gives the plain text and another which delivers a more detailed text object.

Basic Text
~~~~~~~~~~~~~~~~~~~~~~~~~~~

To get the plain text for a page we can retrieve a `string` as follows:

|example_tag|

.. code-block:: javascript

    const text = page.toStructuredText().asText()
    console.log(`text=${text}`)

Advanced Text
~~~~~~~~~~~~~~~~~~~~~~

To get a more advanced representation of the page text we can retrieve a :doc:`../../../classes/StructuredText` object as `JSON` as follows:

|example_tag|

.. code-block:: javascript

    const json = page.toStructuredText("preserve-whitespace").asJSON()
    console.log(`json=${json}`)

:doc:`../../../classes/StructuredText` contains objects from a page that have been analyzed and grouped into blocks, lines and spans. As such the `JSON` returned is *structured* and contains positional data and font data alongside text values, e.g.:

|example_tag|

.. literalinclude:: structured-text-example.json
   :language: json

Extracting Page Images
----------------------------------

To get the images for a page we can use the :meth:`getImages` method as follows:

|example_tag|

.. code-block:: javascript

    var result = page.getImages()

This returns an array of objects which includes the image (:doc:`../../../classes/Image`) along with the bounding box and matrix transform.

The following example would extract all the images from a page and save them as individual files:

.. code-block:: javascript

    var imageStack = page.getImages()

    for (var i in imageStack) {
        var image = imageStack[i].image;
        var pixmap = image.toPixmap();
        let raster = pixmap.asJPEG(80);
        fs.writeFileSync('image-'+i+'.jpg', raster);
    }

Extracting Page Annotations
-----------------------------------

We can retrieve :ref:`Annotation objects <Node_How_To_Guide_Annotations>` from pages by querying with `getAnnotations()`.

|example_tag|

.. code-block:: javascript

    const annots = page.getAnnotations()
    console.log(`Annotations=${annots}`)

Copying pages from another document
------------------------------------------

The following script uses :meth:`graftPage` to copy the first page (`0`) of another document to the end (`-1`) of the current document:

|example_tag|

.. code-block:: javascript

    let anotherDocument = mupdf.PDFDocument.openDocument(fs.readFileSync("test.pdf"), "application/pdf")
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

Cropping Pages
--------------------

To crop a page we just need to set its "CropBox" value with :meth:`setPageBox` and an associated :ref:`rectangle <Glossary_Rectangles>`.

|example_tag|

.. code-block:: javascript

    page.setPageBox("CropBox", [ 0, 0, 500, 500 ])

Implement a Device to print out PDF page contents
-------------------------------------------------------

If you need to invesigate the internals of a PDF page then you can run a :doc:`../../../classes/Device` on a page to detect objects.

|example_tag|

.. code-block:: javascript

    const Q = JSON.stringify

    function print(...args) {
        console.log(args.join(" "))
    }

    var pathPrinter = {
        moveTo: function (x,y) { print("moveTo", x, y) },
        lineTo: function (x,y) { print("lineTo", x, y) },
        curveTo: function (x1,y1,x2,y2,x3,y3) { print("curveTo", x1, y1, x2, y2, x3, y3) },
        closePath: function () { print("closePath") },
    }

    var textPrinter = {
        beginSpan: function (f,m,wmode, bidi, dir, lang) {
            print("beginSpan",f,m,wmode,bidi,dir,Q(lang));
        },
        showGlyph: function (f,m,g,u,v,b) { print("glyph",f,m,g,String.fromCodePoint(u),v,b) },
        endSpan: function () { print("endSpan"); }
    }

    var traceDevice = {
        fillPath: function (path, evenOdd, ctm, colorSpace, color, alpha) {
            print("fillPath", evenOdd, ctm, colorSpace, color, alpha)
            path.walk(pathPrinter)
        },
        clipPath: function (path, evenOdd, ctm) {
            print("clipPath", evenOdd, ctm)
            path.walk(pathPrinter)
        },
        strokePath: function (path, stroke, ctm, colorSpace, color, alpha) {
            print("strokePath", Q(stroke), ctm, colorSpace, color, alpha)
            path.walk(pathPrinter)
        },
        clipStrokePath: function (path, stroke, ctm) {
            print("clipStrokePath", Q(stroke), ctm)
            path.walk(pathPrinter)
        },

        fillText: function (text, ctm, colorSpace, color, alpha) {
            print("fillText", ctm, colorSpace, color, alpha)
            text.walk(textPrinter)
        },
        clipText: function (text, ctm) {
            print("clipText", ctm)
            text.walk(textPrinter)
        },
        strokeText: function (text, stroke, ctm, colorSpace, color, alpha) {
            print("strokeText", Q(stroke), ctm, colorSpace, color, alpha)
            text.walk(textPrinter)
        },
        clipStrokeText: function (text, stroke, ctm) {
            print("clipStrokeText", Q(stroke), ctm)
            text.walk(textPrinter)
        },
        ignoreText: function (text, ctm) {
            print("ignoreText", ctm)
            text.walk(textPrinter)
        },

        fillShade: function (shade, ctm, alpha) {
            print("fillShade", shade, ctm, alpha)
        },
        fillImage: function (image, ctm, alpha) {
            print("fillImage", image, ctm, alpha)
        },
        fillImageMask: function (image, ctm, colorSpace, color, alpha) {
            print("fillImageMask", image, ctm, colorSpace, color, alpha)
        },
        clipImageMask: function (image, ctm) {
            print("clipImageMask", image, ctm)
        },

        beginMask: function (area, luminosity, colorspace, color) {
            print("beginMask", area, luminosity, colorspace, color)
        },
        endMask: function () {
            print("endMask")
        },

        popClip: function () {
            print("popClip")
        },

        beginGroup: function (area, isolated, knockout, blendmode, alpha) {
            print("beginGroup", area, isolated, knockout, blendmode, alpha)
        },
        endGroup: function () {
            print("endGroup")
        },
        beginTile: function (area, view, xstep, ystep, ctm, id) {
            print("beginTile", area, view, xstep, ystep, ctm, id)
            return 0
        },
        endTile: function () {
            print("endTile")
        },
        beginLayer: function (name) {
            print("beginLayer", name)
        },
        endLayer: function () {
            print("endLayer")
        },
        beginStructure: function (structure, raw, uid) {
            print("beginStructure", structure, raw, uid)
        },
        endStructure: function () {
            print("endStructure")
        },
        beginMetatext: function (meta, metatext) {
            print("beginMetatext", meta, metatext)
        },
        endMetatext: function () {
            print("endMetatext")
        },

        renderFlags: function (set, clear) {
            print("renderFlags", set, clear)
        },
        setDefaultColorSpaces: function (colorSpaces) {
            print("setDefaultColorSpaces", colorSpaces.getDefaultGray(),
            colorSpaces.getDefaultRGB(), colorSpaces.getDefaultCMYK(),
            colorSpaces.getOutputIntent())
        },

        close: function () {
            print("close")
        },
    }

    var doc = mupdf.PDFDocument.openDocument(fs.readFileSync("test.pdf"), "application/pdf")
    var page = doc.loadPage(0)
    var device = new mupdf.Device(traceDevice)
    page.run(device, mupdf.Matrix.identity)
