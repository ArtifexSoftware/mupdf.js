
.. _Classes_Device:

Device
===================

All built-in devices have the methods listed below. Any function that accepts a device will also accept a :title:`JavaScript` object with the same methods. Any missing methods are simply ignored, so you only need to create methods for the device calls you care about.

Many of the methods take graphics objects as arguments: :doc:`Path`, :doc:`Text`, :doc:`Image` and `Shade`.

Colors are specified as arrays with the appropriate number of components for the color space.

The methods that clip graphics must be balanced with a corresponding `popClip`.

|constructor_tag|


.. method:: constructor(callbacks: DeviceFunctions)

    Create a `Device` with callback functions.

    :arg callbacks: object containing optional functions which conform to the `DeviceFunctions` interface.


|instance_method_tag|

.. method:: fillPath(path:Path, evenOdd: boolean, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number)


    Fill a path.

    :arg path: :doc:`Path` object.
    :arg evenOdd: `boolean`. The `even odd rule`_ to use.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.
    :arg colorspace: The :doc:`ColorSpace`.
    :arg color: :ref:`Color <Glossary_Colors>`.
    :arg alpha: `number`. The :ref:`alpha <Glossary_Alpha>`.


    |example_tag|

    .. code-block:: javascript

        device.fillPath(path, false, mupdf.Matrix.identity, mupdf.ColorSpace.DeviceRGB, [1,0,0], true);


.. method:: strokePath(path: Path, stroke: StrokeState, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number)

    Stroke a path.

    :arg path: :doc:`Path` object.
    :arg stroke: :doc:`StrokeState`.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.
    :arg colorspace: The :doc:`ColorSpace`.
    :arg color: :ref:`Color <Glossary_Colors>`.
    :arg alpha: `number`. The :ref:`alpha <Glossary_Alpha>`.

    |example_tag|

    .. code-block:: javascript

        device.strokePath(path,
                          {dashes:[5,10], lineWidth:3, lineCap:'Round'},
                          mupdf.Matrix.identity,
                          mupdf.ColorSpace.DeviceRGB,
                          [0,1,0],
                          0.5);



.. method:: clipPath(path: Path, evenOdd: boolean, ctm: Matrix)


    Clip a path.

    :arg path: `Path` object.
    :arg evenOdd: `boolean`. The `even odd rule`_ to use.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.


    |example_tag|

    .. code-block:: javascript

        device.clipPath(path, true, mupdf.Matrix.identity);



.. method:: clipStrokePath(path: Path, stroke: StrokeState, ctm: Matrix)


    Clip & stroke a path.

    :arg path: :doc:`Path` object.
    :arg stroke: :doc:`StrokeState` object.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        device.clipStrokePath(path, true, mupdf.Matrix.identity);




.. method:: fillText(text: Text, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number)


    Fill a text object.

    :arg text: :doc:`Text` object.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.
    :arg colorspace: The :doc:`ColorSpace`.
    :arg color: :ref:`Color <Glossary_Colors>`.
    :arg alpha: `number`. The :ref:`alpha <Glossary_Alpha>`.

    |example_tag|

    .. code-block:: javascript

        device.fillText(text, mupdf.Matrix.identity, mupdf.ColorSpace.DeviceRGB, [1,0,0], 1);

.. method:: strokeText(text: Text, stroke: StrokeState, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number)


    Stroke a text object.

    :arg text: :doc:`Text` object.
    :arg stroke: :doc:`StrokeState` object.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.
    :arg colorspace: The :doc:`ColorSpace`.
    :arg color: :ref:`Color <Glossary_Colors>`.
    :arg alpha: `number`. The :ref:`alpha <Glossary_Alpha>`.

    |example_tag|

    .. code-block:: javascript

        device.strokeText(text,
                          {dashes:[5,10], lineWidth:3, lineCap:'Round'},
                          mupdf.Matrix.identity, mupdf.ColorSpace.DeviceRGB,
                          [1,0,0],
                          1);


.. method:: clipText(text: Text, ctm: Matrix)

    Clip a text object.

    :arg text: :doc:`Text` object.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        device.clipText(text, mupdf.Matrix.identity);


.. method:: clipStrokeText(text: Text, stroke: StrokeState, ctm: Matrix)


    Clip & stroke a text object.

    :arg text: :doc:`Text` object.
    :arg stroke: `StrokeState` object.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        device.clipStrokeText(text, {dashes:[5,10], lineWidth:3, lineCap:'Round'},  mupdf.Matrix.identity);



.. method:: ignoreText(text: Text, ctm: Matrix) 


    Invisible text that can be searched but should not be visible, such as for overlaying a scanned OCR image.

    :arg text: :doc:`Text` object.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        device.ignoreText(text, mupdf.Matrix.identity);



.. method:: fillShade(shade: Shade, ctm: Matrix, alpha: number)

    Fill a shade (a.k.a. gradient).

    .. note::

        The details of gradient fills are not exposed to :title:`JavaScript` yet.


    :arg shade: `Shade`. The gradient.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.
    :arg alpha: `number`. The :ref:`alpha <Glossary_Alpha>`.


    |example_tag|

    .. code-block:: javascript

        device.fillShade(shade, mupdf.Matrix.identity, true, {overPrinting:true});



.. method:: fillImage(image: Image, ctm: Matrix, alpha: number) 


    Draw an image. An image always fills a unit rectangle `[0,0,1,1]`, so must be transformed to be placed and drawn at the appropriate size.

    :arg image: `Image` object.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.
    :arg alpha: `number`. The :ref:`alpha <Glossary_Alpha>`.


    |example_tag|

    .. code-block:: javascript

        device.fillImage(image, mupdf.Matrix.identity, false, {overPrinting:true});



.. method:: fillImageMask(image: Image, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number)


    An image mask is an image without color. Fill with the color where the image is opaque.

    :arg image: :doc:`Image` object.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.
    :arg colorspace: The :doc:`ColorSpace`.
    :arg color: :ref:`Color <Glossary_Colors>`.
    :arg alpha: `number`. The :ref:`alpha <Glossary_Alpha>`.


    |example_tag|

    .. code-block:: javascript

        device.fillImageMask(image, mupdf.Matrix.identity, mupdf.ColorSpace.DeviceRGB, [0,1,0], true);



.. method:: clipImageMask(image: Image, ctm: Matrix)


    Clip graphics using the image to mask the areas to be drawn.

    :arg image: :doc:`Image` object.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.


    |example_tag|

    .. code-block:: javascript

        device.clipImageMask(image, mupdf.Matrix.identity);


.. method:: popClip()

    Pop the clip mask installed by the last clipping operation.

    |example_tag|

    .. code-block:: javascript

        device.popClip();


.. method:: beginMask(area: Rect, luminosity: boolean, colorspace: ColorSpace, color: Color)


    Create a soft mask. Any drawing commands between `beginMask` and `endMask` are grouped and used as a clip mask.

    :arg area: :ref:`Rect <Glossary_Rectangles>`. Mask area.
    :arg luminosity: `boolean`. If luminosity is *true*, the mask is derived from the luminosity (grayscale value) of the graphics drawn; otherwise the color is ignored completely and the mask is derived from the alpha of the group.
    :arg colorspace: :doc:`ColorSpace`.
    :arg color: :ref:`Color <Glossary_Colors>`.


    |example_tag|

    .. code-block:: javascript

        device.beginMask([0,0,100,100], true, mupdf.ColorSpace.DeviceRGB, [1,0,1]);



.. method:: endMask()

    Ends the mask.

    |example_tag|

    .. code-block:: javascript

        device.endMask();



.. method:: beginGroup(area: Rect, colorspace: ColorSpace, isolated: boolean, knockout: boolean, blendmode: BlendMode, alpha: number)


    Push/pop a transparency blending group. See the PDF reference for details on `isolated` and `knockout`.

    :arg area: :ref:`Rect <Glossary_Rectangles>`. The blend area.
    :arg colorspace: :doc:`ColorSpace`.
    :arg isolated: `boolean`.
    :arg knockout: `boolean`.
    :arg blendmode: :ref:`BlendMode <Glossary_BlendMode>` is one of the standard :title:`PDF` blend modes.
    :arg alpha: `nu,ber`. The :ref:`alpha <Glossary_Alpha>`.


    .. image:: ../images/isolated-and-knockout.png
       :align: center
       :scale: 50%


    |example_tag|

    .. code-block:: javascript

        device.beginGroup([0,0,100,100], mupdf.ColorSpace.DeviceRGB, true, true, "Multiply", 0.5);



.. method:: endGroup()

    Ends the blending group.

    |example_tag|

    .. code-block:: javascript

        device.endGroup();


.. method:: beginTile(area: Rect, view: Rect, xstep: number, ystep: number, ctm: Matrix, id: number)

    Draw a tiling pattern. Any drawing commands between `beginTile` and `endTile` are grouped and then repeated across the whole page. Apply a clip mask to restrict the pattern to the desired shape.

    :arg area: :ref:`Rect <Glossary_Rectangles>`.
    :arg view: :ref:`Rect <Glossary_Rectangles>`.
    :arg xstep: `number` representing `x` step.
    :arg ystep: `number` representing `y` step.
    :arg ctm: :ref:`Matrix <Glossary_Matrix>`.
    :arg id: `number`. The purpose of `id` is to allow for efficient caching of rendered tiles. If `id` is `0`, then no caching is performed. If it is non-zero, then it assumed to uniquely identify this tile.


    |example_tag|

    .. code-block:: javascript

        device.beginTile([0,0,100,100], [100,100,200,200], 10, 10, mupdf.Matrix.identity, 0);


.. method:: endTile()

    Ends the tiling pattern.

    |example_tag|

    .. code-block:: javascript

        device.endTile();


.. method:: beginLayer(name: string)

    Begin a marked-content layer with the given name.

    :arg name: `string`.

    |example_tag|

    .. code-block:: javascript

        device.beginLayer("my tag");


.. method:: endLayer()

    End a marked-content layer.

    |example_tag|

    .. code-block:: javascript

        device.endLayer();


.. method:: close()

    Tell the device that we are done, and flush any pending output. Ensure that no items are left on the stack before closing.


    |example_tag|

    .. code-block:: javascript

        device.close();



.. External links:

.. _even odd rule: https://en.wikipedia.org/wiki/Even–odd_rule

