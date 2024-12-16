.. include:: ../header.rst

.. _Classes_Image:

Image
===================

|constructor_tag|

.. method:: Image(data: Buffer | ArrayBuffer | Uint8Array | string)

    Returns an `Image` from the supplied data buffer.

    :arg data: :doc:`Buffer` | `ArrayBuffer` | `Uint8Array` | `string`. Buffer of file data.

    :return: `Image`.

    |example_tag|

    .. code-block:: javascript

        let image = new mupdfjs.Image(fs.readFileSync("logo.png"))


|instance_method_tag|

.. method:: getWidth()

    Get the image width in pixels.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var width = image.getWidth();


.. method:: getHeight()

    Get the image height in pixels.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var height = image.getHeight();

.. method:: getXResolution()

    Returns the x resolution for the `Image` in dots per inch.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var xRes = image.getXResolution();


.. method:: getYResolution()

    Returns the y resolution for the `Image` in dots per inch.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var yRes = image.getYResolution();


.. method:: getColorSpace()

    Returns the :doc:`ColorSpace` for the `Image`.

    :return: :doc:`ColorSpace`.

    |example_tag|

    .. code-block:: javascript

        var cs = image.getColorSpace();


.. method:: getNumberOfComponents()

    Number of colors; plus one if an alpha channel is present.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var num = image.getNumberOfComponents();


.. method:: getBitsPerComponent()

    Returns the number of bits per component.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var bits = image.getBitsPerComponent();

.. method:: getImageMask()

    Returns *true* if this image is an image mask.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasMask = image.getImageMask();


.. method:: getMask()

    Get another `Image` used as a mask for this one.

    :return: `Image` (or `null`).

    |example_tag|

    .. code-block:: javascript

        var mask = image.getMask();



.. method:: toPixmap()

    Create a :doc:`Pixmap` from the image.

    :return: :doc:`Pixmap`.


    |example_tag|

    .. code-block:: javascript

        var pixmap = image.toPixmap();


.. include:: footer.rst
.. include:: ../footer.rst



