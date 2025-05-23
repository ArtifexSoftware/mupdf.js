
.. _Classes_Pixmap:

Pixmap
===================


A `Pixmap` object contains a color raster image (short for pixel map).
The components in a pixel in the `Pixmap` are all byte values,
with the transparency as the last component.

A `Pixmap` also has a location (x, y) in addition to its size;
so that they can easily be used to represent tiles of a page.

|constructor_tag|

.. method:: Pixmap(colorspace: ColorSpace, bbox?: Rect, alpha: boolean = false)


    Create a new `Pixmap`. Note: The pixel data is **not** initialized.

    :arg colorspace: `ColorSpace`.
    :arg bbox: :ref:`Rect <Glossary_Rectangles>`.
    :arg alpha: `boolean`.

    :return: `Pixmap`.

    |example_tag|

    .. code-block:: javascript

        var pixmap = new mupdf.Pixmap(mupdf.ColorSpace.DeviceRGB, [0,0,100,100], true);



|instance_method_tag|


.. method:: clear(value?: number)

    Clear the pixels to the specified value. Pass `255` for white, `0` for black, or omit for transparent.

    :arg value: `number`.

    |example_tag|

    .. code-block:: javascript

        pixmap.clear(255);


.. method:: getBounds()

    Return the pixmap bounds.

    :return: :ref:`Rect <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        var rect = pixmap.getBounds();


.. method:: getWidth()

    :return: `number`. The width value.

    |example_tag|

    .. code-block:: javascript

        var w = pixmap.getWidth();

.. method:: getHeight()

    :return: `number`. The height value.

    |example_tag|

    .. code-block:: javascript

        var h = pixmap.getHeight();

.. method:: getNumberOfComponents()

    Number of colors; plus one if an alpha channel is present.

    :return: `number`. Number of color components.

    |example_tag|

    .. code-block:: javascript

        var num = pixmap.getNumberOfComponents();

.. method:: getAlpha()

    *True* if alpha channel is present.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var alpha = pixmap.getAlpha();

.. method:: getStride()

    Number of bytes per row.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var stride = pixmap.getStride();

.. method:: getColorSpace()

    Returns the `ColorSpace` for the `Pixmap`.

    :return: `ColorSpace`.

    |example_tag|

    .. code-block:: javascript

        var cs = pixmap.getColorSpace();


.. method:: setResolution(x: number, y: number)

    Set `x` & `y` resolution.

    :arg x: `number`. X resolution in dots per inch.
    :arg y: `number`. Y resolution in dots per inch.

    |example_tag|

    .. code-block:: javascript

        pixmap.setResolution(300, 300);


.. method:: getXResolution()

    Returns the `x` resolution for the `Pixmap`.

    :return: `number`. Resolution in dots per inch.

    |example_tag|

    .. code-block:: javascript

        var xRes = pixmap.getXResolution();


.. method:: getYResolution()

    Returns the `y` resolution for the `Pixmap`.

    :return: `number`. Resolution in dots per inch.

    |example_tag|

    .. code-block:: javascript

        var yRes = pixmap.getYResolution();


.. method:: invert()

    Invert all pixels. All components are processed, except alpha which is unchanged.

    |example_tag|

    .. code-block:: javascript

        pixmap.invert();

.. method:: invertLuminance()

    Transform all pixels so that luminance of each pixel is inverted,
    and the chrominance remains as unchanged as possible.
    All components are processed, except alpha which is unchanged.

    |example_tag|

    .. code-block:: javascript

        pixmap.invertLuminance();

.. method:: gamma(p: number)

    Apply gamma correction to `Pixmap`. All components are processed,
    except alpha which is unchanged.

    Values ``>= 0.1 & < 1`` = darken, ``> 1 & < 10`` = lighten.

    :arg p: `number`.

    |example_tag|

    .. code-block:: javascript

        pixmap.gamma(3.5);

.. method:: tint(black: number | Color, white: number | Color)

    Tint all pixels in a :title:`RGB`, :title:`BGR` or :title:`Gray` `Pixmap`.
     Map black and white respectively to the given hex :title:`RGB` values.

    :arg black: `number` | :ref:`Color <Glossary_Color_Type>`.
    :arg white: `number` | :ref:`Color <Glossary_Color_Type>`.

    |example_tag|

    .. code-block:: javascript

        pixmap.tint(0xffff00, 0xffff00);



.. method:: warp(points: Point[], width: number, height: number)

    Return a warped subsection of the `Pixmap`, where the result has the requested dimensions.

    :arg points: `Point[]`. :ref:`Points <Glossary_Points>` give the corner points of a convex quadrilateral within the `Pixmap` to be warped.
    :arg width: `number`.
    :arg height: `number`.

    :return: `Pixmap`.

    |example_tag|

    .. code-block:: javascript

        var warpedPixmap = pixmap.warp([[0,0], [100,100], [130,170], [150,200]],200,200);


.. method:: convertToColorSpace(colorspace: ColorSpace, keepAlpha:boolean = false)

    Convert pixmap into a new pixmap of a desired colorspace.
    A proofing colorspace, a set of default colorspaces and color
    parameters used during conversion may be specified.
    Finally a boolean indicates if alpha should be preserved
    (default is to not preserve alpha).

    :arg colorspace: `Colorspace`.
    :arg keepAlpha: `boolean`.

    :return: `Pixmap`.



.. method:: getPixels()

    Returns an array of pixels for the `Pixmap`.

    :return: `[...]`.

    |example_tag|

    .. code-block:: javascript

        var pixels = pixmap.getPixels();


.. method:: asPNG()

    Returns a buffer of the `Pixmap` as a :title:`PNG`.

    :return: `Buffer`.

    |example_tag|

    .. code-block:: javascript

        var buffer = pixmap.asPNG();



.. method:: asPSD()

    Returns a buffer of the `Pixmap` as a :title:`PSD`.

    :return: `Buffer`.

    |example_tag|

    .. code-block:: javascript

        var buffer = pixmap.asPSD();


.. method:: asPAM()

    Returns a buffer of the `Pixmap` as a :title:`PAM`.

    :return: `Buffer`.

    |example_tag|

    .. code-block:: javascript

        var buffer = pixmap.asPAM();



.. method:: asJPEG(quality: number, invert_cmyk: boolean)

    Returns a buffer of the `Pixmap` as a :title:`JPEG`.
    Note, if the `Pixmap` has an alpha channel then an exception will be thrown.

    :arg quality: `number`. Should be between `0 - 100`.
    :arg invert_cmyk: `boolean`.

    :return: `Buffer`.

    |example_tag|

    .. code-block:: javascript

        var buffer = pixmap.asJPEG(80, false);





