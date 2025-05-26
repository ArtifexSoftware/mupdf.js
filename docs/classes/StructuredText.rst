.. include:: ../header.rst

.. _Classes_StructuredText:

StructuredText
===================

`StructuredText` objects hold text from a page that has been analyzed and
grouped into blocks, lines and spans. To obtain a `StructuredText`
instance use :meth:`toStructuredText`.


|instance_method_tag|

.. method:: search(needle:string)

    Search the text for all instances of `needle`, and return an array with all matches found on the page.

    Each match in the result is an array containing one or more :ref:`QuadPoints <Glossary_Quads>` that cover the matching text.

    :arg needle: `string`.
    :return: `Quad[][]`.

    |example_tag|

    .. code-block:: javascript

        var result = sText.search("Hello World!");



.. method:: highlight(p:Point, q:Point,  max_hits:number = 100)

    Return an array with :ref:`Quads <Glossary_Quads>`
    needed to highlight a selection defined by the start and end points.

    :arg p: :ref:`Point <Glossary_Points>`.
    :arg q: :ref:`Point <Glossary_Points>`.
    :arg max_hits: `number`. The number of results to return as a maximum for the search.

    :return: `Quad[]`.

    |example_tag|

    .. code-block:: javascript

        var result = sText.highlight([100,100], [200,100]);



.. method:: copy(p:Point, q:Point)

    Return the text from the selection defined by the start and end points.

    :arg p: :ref:`Point <Glossary_Points>`.
    :arg q: :ref:`Point <Glossary_Points>`.

    :return: `string`.


    |example_tag|

    .. code-block:: javascript

        var result = sText.copy([100,100], [200,100]);




.. method:: walk(walker: StructuredTextWalker)

    :arg walker: `StructuredTextWalker`. Function with protocol methods, see example below for details.

    Walk through the blocks (images or text blocks) of the structured text.
    For each text block walk over its lines of text, and for each line each
    of its characters. For each block, line or character the walker will
    have a method called.

    |example_tag|

    .. code-block:: javascript

        var sText = pdfPage.toStructuredText();
        sText.walk({
            beginLine: function (bbox, wmode, direction) {
                console.log("beginLine", bbox, wmode, direction);
            },
            beginTextBlock: function (bbox) {
                console.log("beginTextBlock", bbox);
            },
            endLine: function () {
                console.log("endLine");
            },
            endTextBlock: function () {
                console.log("endTextBlock");
            },
            onChar: function (utf, origin, font, size, quad) {
                console.log("onChar", utf, origin, font, size, quad);
            },
            onImageBlock: function (bbox, transform, image) {
                console.log("onImageBlock", bbox, transform, image);
            },
        });

    .. note::

        On `beginLine` the direction parameter is a vector (e.g. `[0, 1]`) and
        can you can calculate the rotation as an angle with some trigonometry on the vector.


.. method:: asJSON(scale:number = 1)

    Returns the instance in :title:`JSON` format.

    :arg scale: `number`. Default: `1`. Multiply all the coordinates by this factor to get the coordinates at another resolution. The structured text has all coordinates in points (72 DPI), however you may want to use the coordinates in the `StructuredText` data at another resolution.

    :return: `string`.

    The returned JSON has a property named ``blocks`` whose value is a list of
    ``block``.

    Each ``block`` has the following properties:

    ``type``
        ``"image"`` for an image block or ``"text"`` for a text block.
    ``bbox``
        bounding-box of the block with following properties:

        ``x``
             x-coordinate of the top-left point.
        ``y``
             y-coordinate of the top-left point.
        ``w``
             width of the box.
        ``h``
             height of the box.

    A text-block has a property named ``lines`` whose value is a list of
    ``line``.

    Each ``line`` has the following properties:

    ``wmode``
        writing mode, ``0`` for horizontal, ``1`` for vertical.
    ``bbox``
        bounding-box of the text (same structure as above).
    ``font``
        font used in the text with the following properties:

        ``name``
             name of the font.
        ``family``
             family of the font, can be ``"sans-serif"`` or ``"serif"`` or ``"monospace"``.
        ``weight``
             weight of the font, can be ``"bold"`` or ``"normal"``.
        ``style``
             style of the font, can be ``"italic"`` or ``"normal"``.
        ``size``
             size of the font.

    ``x``
        x-coordinate of the line's origin.
    ``y``
        y-coordinate of the line's origin.
    ``text``
        text value of the line.

    |example_tag|

    .. code-block:: javascript

        var json = sText.asJSON();
        console.log(JSON.stringify(JSON.parse(json), null, 2));
        {
          "blocks": [
            {
              "type": "text",
              "bbox": {
                "x": 220,
                "y": 69,
                "w": 154,
                "h": 31
              },
              "lines": [
                {
                  "wmode": 0,
                  "bbox": {
                    "x": 220,
                    "y": 69,
                    "w": 154,
                    "h": 31
                  },
                  "font": {
                    "name": "BAAAAA+LiberationSans-Bold",
                    "family": "serif",
                    "weight": "bold",
                    "style": "normal",
                    "size": 28
                  },
                  "x": 220,
                  "y": 94,
                  "text": "Hello World"
                }
              ]
            },
            {
              "type": "text",
              "bbox": {
                "x": 56,
                "y": 107,
                "w": 81,
                "h": 13
              },
              "lines": [
                {
                  "wmode": 0,
                  "bbox": {
                    "x": 56,
                    "y": 107,
                    "w": 81,
                    "h": 13
                  },
                  "font": {
                    "name": "CAAAAA+LiberationSerif",
                    "family": "serif",
                    "weight": "normal",
                    "style": "normal",
                    "size": 12
                  },
                  "x": 56,
                  "y": 118,
                  "text": "MuPDF.js rocks!"
                }
              ]
            },
            {
              "type": "text",
              "bbox": {
                "x": 56,
                "y": 130,
                "w": 206,
                "h": 13
              },
              "lines": [
                {
                  "wmode": 0,
                  "bbox": {
                    "x": 56,
                    "y": 130,
                    "w": 206,
                    "h": 13
                  },
                  "font": {
                    "name": "CAAAAA+LiberationSerif",
                    "family": "serif",
                    "weight": "normal",
                    "style": "normal",
                    "size": 12
                  },
                  "x": 56,
                  "y": 140,
                  "text": "No PDFs were harmed in making the docs."
                }
              ]
            }
          ]
        }

    .. note::

        If you want the coordinates to be 300 DPI then pass (300/72) as the `scale` parameter.

        All the numbers are rounded to integers. If you want high-precision
        output, consider using the :meth:`walk` method.

        ``origin`` of a line refers to its `baseline
        <https://en.wikipedia.org/wiki/Baseline_(typography)>`_. On the other
        hand, ``bbox`` will cover the full text including its ascenders and
        descenders. The height of a ``bbox`` is the `line's height
        <https://en.wikipedia.org/wiki/Leading>`_.


.. method:: asHTML(id:number)

    Returns the instance in :title:`HTML` format.

    :arg id: `number`. Used to identify the page `id` of the main div, if omitted then html in the top node will be: `<div id="page0">`.

    :return: `string`.

.. method:: asText()

    Returns the instance in plain text format.

    :return: `string`.


.. include:: footer.rst
.. include:: ../footer.rst



