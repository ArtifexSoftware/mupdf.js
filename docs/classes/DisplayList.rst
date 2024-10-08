.. include:: ../header.rst

.. _Classes_DisplayList:

DisplayList
===================


A display list records all the device calls for playback later. If you want to run a page through several devices, or run it multiple times for any other reason, recording the page to a display list and replaying the display list may be a performance gain since then you can avoid reinterpreting the page each time. Be aware though, that a display list will keep all the graphics required in memory, so will increase the amount of memory required.


|constructor_tag|

.. method:: DisplayList(mediabox:Rect)


    Create an empty display list. The mediabox rectangle should be the bounds of the page.

    :arg mediabox: `[ulx,uly,lrx,lry]` :ref:`Rectangle <Glossary_Rectangles>`.

    :return: `DisplayList`.

    |example_tag|

    .. code-block:: javascript

        var displayList = new mupdfjs.DisplayList([0,0,100,100]);



|instance_method_tag|


.. method:: run(device: Device, matrix: Matrix)

    Play back the recorded device calls onto the device.

    :arg device: :doc:`Device`.
    :arg matrix: `[a,b,c,d,e,f]`. The transform :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        displayList.run(device, mupdfjs.Matrix.identity);



.. method:: getBounds()

    Returns a rectangle containing the dimensions of the display list contents.

    :return: `[ulx,uly,lrx,lry]` :ref:`Rectangle <Glossary_Rectangles>`.


    |example_tag|

    .. code-block:: javascript

        var bounds = displayList.getBounds();




.. method:: toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha = false)

    Render display list to a :doc:`Pixmap`.

    :arg matrix: `[a,b,c,d,e,f]`. The transform :ref:`Matrix <Glossary_Matrix>`.
    :arg colorspace: `ColorSpace`.
    :arg alpha: `boolean`. If alpha is *true*, a transparent background, otherwise white.

    :return: :doc:`Pixmap`.


    |example_tag|

    .. code-block:: javascript

        var pixmap = displayList.toPixmap(mupdfjs.Matrix.identity, mupdfjs.ColorSpace.DeviceRGB, false);


.. method:: toStructuredText(options:string = "")


    Extract the text on the page into a `StructuredText` object. The options argument is a comma separated list of flags: "preserve-ligatures", "preserve-whitespace", "preserve-spans", and "preserve-images".

    :arg options: `string`.
    :return: :doc:`StructuredText`.

    |example_tag|

    .. code-block:: javascript

        var sText = displayList.toStructuredText("preserve-whitespace");



.. method:: search(needle: string, max_hits:number = 500)


    Search the display list text for all instances of the `needle` value,
    and return an array of search hits.
    Each search hit is an array of :ref:`Quads <Glossary_Object_Points_and_QuadPoints>`
    corresponding to all characters in the search hit.

    :arg needle: `string`.
    :arg max_hits: `number` Use to limit number of results, defaults to 500.
    :return: `Quad[][]`.


    |example_tag|

    .. code-block:: javascript

        var results = displayList.search("my search phrase");


.. include:: footer.rst
.. include:: ../footer.rst



