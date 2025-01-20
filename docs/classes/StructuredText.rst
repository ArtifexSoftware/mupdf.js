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

    |example_tag|

    .. code-block:: javascript

        var json = sText.asJSON();

    .. note::

        If you want the coordinates to be 300 DPI then pass (300/72) as the `scale` parameter.


.. method:: asHTML(id:number)

    Returns the instance in :title:`HTML` format.

    :arg id: `number`. Used to identify the page `id` of the main div, if omitted then html in the top node will be: `<div id="page0">`.

    :return: `string`.

.. method:: asText()

    Returns the instance in plain text format.

    :return: `string`.


.. include:: footer.rst
.. include:: ../footer.rst



