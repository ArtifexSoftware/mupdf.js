
.. _Classes_Path:

Path
===================

A `Path` object represents vector graphics as drawn by a pen. A path can be either stroked or filled, or used as a clip mask.

|constructor_tag|

.. method:: Path()

    Create a new empty path.

    :return: `Path`.

    |example_tag|

    .. code-block:: javascript

        var path = new mupdf.Path();




|instance_method_tag|

.. method:: getBounds(strokeState: StrokeState, transform: Matrix)

    Return a bounding rectangle for the path.

    :arg stroke: :doc:`StrokeState`. The stroke for the path.
    :arg transform: :ref:`Matrix <Glossary_Matrix>`. The transform matrix for the path.

    :return: :ref:`Rect <Glossary_Rectangles>`.


    |example_tag|

    .. code-block:: javascript

        var rect = path.getBounds(1.0, mupdf.Matrix.identity);



.. method:: moveTo(x:number, y:number)

    Lift and move the pen to the coordinate.

    :arg x: `number`. X coordinate.
    :arg y: `number`. Y coordinate.

    |example_tag|

    .. code-block:: javascript

        path.moveTo(10, 10);


.. method:: lineTo(x:number, y:number)

    Draw a line to the coordinate.

    :arg x: `number`. X coordinate.
    :arg y: `number`. Y coordinate.

    |example_tag|

    .. code-block:: javascript

        path.lineTo(20,20);


.. method:: curveTo(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number)

    Draw a cubic bezier curve to (`x3`, `y3`) using (`x1`, `y1`) and (`x2`, `y2`) as control points.

    :arg x1: `number`. X1 coordinate.
    :arg y1: `number`. Y1 coordinate.
    :arg x2: `number`. X2 coordinate.
    :arg y2: `number`. Y2 coordinate.
    :arg x3: `number`. X3 coordinate.
    :arg y3: `number`. Y3 coordinate.

    |example_tag|

    .. code-block:: javascript

        path.curveTo(0, 0, 10, 10, 100, 100);


.. method:: curveToV(cx: number, cy: number, ex: number, ey: number)

    Draw a cubic bezier curve to (`ex`, `ey`) using the start point and (`cx`, `cy`) as control points.

    :arg cx: `number`. CX coordinate.
    :arg cy: `number`. CY coordinate.
    :arg ex: `number`. EX coordinate.
    :arg ey: `number`. EY coordinate.

    |example_tag|

    .. code-block:: javascript

        path.curveToV(0, 0, 100, 100);


.. method:: curveToY(cx: number, cy: number, ex: number, ey: number)

    Draw a cubic bezier curve to (`ex`, `ey`) using the (`cx`, `cy`) and (`ex`, `ey`) as control points.

    :arg cx: `number`. CX coordinate.
    :arg cy: `number`. CY coordinate.
    :arg ex: `number`. EX coordinate.
    :arg ey: `number`. EY coordinate.

    |example_tag|

    .. code-block:: javascript

        path.curveToY(0, 0, 100, 100);


.. method:: closePath()

    Close the path by drawing a line to the last :meth:`moveTo`.

    |example_tag|

    .. code-block:: javascript

        path.closePath();


.. method:: rect(x1: number, y1: number, x2: number, y2: number)

    Shorthand for sequence: `moveTo`, `lineTo`, `lineTo`, `lineTo`, `closePath` to draw a rectangle.

    :arg x1: `number`. X1 coordinate.
    :arg y1: `number`. Y1 coordinate.
    :arg x2: `number`. X2 coordinate.
    :arg y2: `number`. Y2 coordinate.


    |example_tag|

    .. code-block:: javascript

        path.rect(0,0,100,100);


.. method:: transform(matrix: Matrix)

    Transform path by the given transform matrix.

    :arg matrix: :ref:`Matrix <Glossary_Matrix>`.


    |example_tag|

    .. code-block:: javascript

        path.transform(mupdf.Matrix.scale(2,2));



.. method:: walk(walker: PathWalker)

    :arg walker: `PathWalker`. Function with protocol methods, see example below for details.

    |example_tag|

    .. code-block:: javascript
            
        function print(...args) {
            console.log(args.join(" "))
        }

        var pathPrinter = {
            moveTo: function (x,y) { print("moveTo", x, y) },
            lineTo: function (x,y) { print("lineTo", x, y) },
            curveTo: function (x1,y1,x2,y2,x3,y3) { print("curveTo", x1, y1, x2, y2, x3, y3) },
            closePath: function () { print("closePath") },
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
                print("strokePath", JSON.stringify(stroke), ctm, colorSpace, color, alpha)
                path.walk(pathPrinter)
            },
            clipStrokePath: function (path, stroke, ctm) {
                print("clipStrokePath", JSON.stringify(stroke), ctm)
                path.walk(pathPrinter)
            }
        }

        var doc = mupdf.Document.openDocument(fs.readFileSync("test.pdf"), "application/pdf")
        var page = doc.loadPage(0)
        var device = new mupdf.Device(traceDevice)
        page.run(device, mupdf.Matrix.identity)






