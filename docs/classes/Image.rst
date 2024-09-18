.. include:: ../header.rst

.. _Classes_Image:

Image
===================

|constructor_tag|

.. method:: Image(data: AnyBuffer)

    *Constructor method*.

    Returns an `Image` from the supplied data buffer.

    :arg data: Buffer of file data.

    :return: `Image`.

    |example_tag|

    .. code-block:: javascript

        let image = new mupdfjs.Image(fs.readFileSync("logo.png"))


.. include:: footer.rst
.. include:: ../footer.rst



