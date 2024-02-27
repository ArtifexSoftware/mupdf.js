.. include:: ../../../../header.rst
.. include:: ../../node-header.rst

.. _Node_How_To_Guide_Annotations_Drawing_and_Shapes:



Drawing & Shapes
===============================


.. _Node_How_To_Guide_Annotations_Drawing_and_Shapes_Drawing:

Drawing
-------------

Drawing freehand on a **PDF** is used to typically add scribbled notations and can be acheived by adding ink lists to an annotation of type `Ink`.

By using the following **JavaScript** methods you should be able to create and manage `Ink` annotations with the following **API**:

- `PDFAnnotation.hasInkList <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#hasInkList>`_
- `PDFAnnotation.getInkList <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#getInkList>`_
- `PDFAnnotation.setInkList <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#setInkList>`_
- `PDFAnnotation.clearInkList <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#clearInkList>`_
- `PDFAnnotation.addInkList <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#addInkList>`_
- `PDFAnnotation.addInkListStroke <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#addInkListStroke>`_
- `PDFAnnotation.addInkListStrokeVertex <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#addInkListStrokeVertex>`_


|example_tag|

.. code-block:: javascript

    let fileData = fs.readFileSync("test.pdf")

    let document = mupdf.Document.openDocument(fileData, "application/pdf")
    let page = document.loadPage(0)
    let annotation = page.createAnnotation("Ink")

    annotation.setInkList([
        [
            [0,0]
        ],
        [
            [10,10], [20,20], [30,30]
        ],
        [
            [30,30], [55,20], [60,30]
        ]
    ])

    annotation.update()

    fs.writeFileSync("output-ink.pdf", document.saveToBuffer("incremental").asUint8Array())


.. note::

    By default the color of an `Ink` annotation is red (`[1,0,0]`). Use `PDFAnnotation.setColor <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#setColor>`_ to change it.



----

.. _Node_How_To_Guide_Annotations_Drawing_and_Shapes_Shapes:

Shapes
---------------

Adding a shape involves creating an annotation with one of the following types:

- `Square`
- `Circle`
- `Line`
- `Polygon`
- `PolyLine`

Adding Circles & Squares
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Circles and Squares take a rectangle to set their size & position and have a variety of options.

For example, let's draw a large square with different stroke & fill colors, a border effect and at 50% opacity.

|example_tag|

.. code-block:: javascript

    let fileData = fs.readFileSync("test.pdf")

    let document = mupdf.Document.openDocument(fileData, "application/pdf")
    let page = document.loadPage(0)
    let annotation = page.createAnnotation("Square")
    annotation.setRect([100, 100, 300, 300])
    annotation.setColor([0, 0, 0])
    annotation.setInteriorColor([0.5, 0, 0])
    annotation.setBorderEffect("Cloudy")
    annotation.setBorderEffectIntensity(0.3)
    annotation.setBorderWidth(5)
    annotation.setOpacity(0.5)

    fs.writeFileSync("output-circle.pdf", document.saveToBuffer("incremental").asUint8Array())

The available **API** for both `Circle` & `Square` is the same and you are able to get/set the following:

- `Color <https://mupdf.readthedocs.io/en/latest/mutool-object-pdf-annotation.html#getColor>`_ (the "stroke" color of the shape)
- `Interior Color <https://mupdf.readthedocs.io/en/latest/mutool-object-pdf-annotation.html#getInteriorColor>`_ (the "fill" color of the shape)
- `Opacity <https://mupdf.readthedocs.io/en/latest/mutool-object-pdf-annotation.html#getOpacity>`_ 
- `Border width <https://mupdf.readthedocs.io/en/latest/mutool-object-pdf-annotation.html#getBorder>`_ (the "stroke" thickness)
- `Border style <https://mupdf.readthedocs.io/en/latest/mutool-object-pdf-annotation.html#getBorderStyle>`_ (the "stroke" style)
- `Border effect <https://mupdf.readthedocs.io/en/latest/mutool-object-pdf-annotation.html#getBorderEffect>`_ (the "stroke" effect)
- `Border effect intensity <https://mupdf.readthedocs.io/en/latest/mutool-object-pdf-annotation.html#getBorderEffectIntensity>`_ (the "stroke" effect intensity)


Adding Lines, Polygons & PolyLines
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

These type of shapes take an either an array of `line points <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#getLine>`_ (`Line`) or `vertex points <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#getVertices>`_ (`Polygon` & `PolyLine`) to make the drawings.


The following example draws a line with a closed arrow `line ending <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#mutool-pdf-annotation-line-ending-styles>`_.

|example_tag|

.. code-block:: javascript

    let fileData = fs.readFileSync("test.pdf")

    let document = mupdf.Document.openDocument(fileData, "application/pdf")
    let page = document.loadPage(0)
    let annotation = page.createAnnotation("Line")
    annotation.setColor([1, 0, 0])
    annotation.setInteriorColor([0, 0, 1])
    annotation.setLine([10, 300], [200, 500])
    annotation.setLineEndingStyles("None", "ClosedArrow")
    annotation.update()

    fs.writeFileSync("output-line.pdf", document.saveToBuffer("incremental").asUint8Array())

.. note::

    Setting the interior color ("fill") of a line only applies to the line ending style - in the example above the "fill" of the arrow is green.

----

This example creates a blue triangle on the page using the `Polygon` type.

|example_tag|

.. code-block:: javascript

    let fileData = fs.readFileSync("test.pdf")

    let document = mupdf.Document.openDocument(fileData, "application/pdf")
    let page = document.loadPage(0)
    let annotation = page.createAnnotation("Polygon")
    annotation.setColor([0, 0, 1])
    annotation.setInteriorColor([0, 0, 1])
    annotation.addVertex([10, 100])
    annotation.addVertex([200, 200])
    annotation.addVertex([30, 300])
    annotation.update()

    fs.writeFileSync("output-polygon.pdf", document.saveToBuffer("incremental").asUint8Array())



.. include:: ../../node-footer.rst
.. include:: ../../../../footer.rst
