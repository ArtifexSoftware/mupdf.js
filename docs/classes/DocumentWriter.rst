.. include:: ../header.rst

.. _Classes_DocumentWriter:

DocumentWriter
===================

`DocumentWriter` objects are used to create new documents in several formats.

|constructor_tag|

.. method:: DocumentWriter(buffer: Buffer, format: string, options: string)

    Create a new document writer to create a document with the specified format and output options. The `options` argument is a comma separated list of flags and key-value pairs.

    The output `format` & `options` are the same as in the `mutool convert <https://mupdf.readthedocs.io/en/latest/mutool-convert.html>`_ command.

    :arg buffer: :doc:`Buffer`. The buffer to output to.
    :arg format: `string`. The file format.
    :arg options: `string`. The options as key-value pairs.
    :return: `DocumentWriter`.

    |example_tag|

    .. code-block:: javascript

        var writer = new mupdfjs.DocumentWriter(buffer, "PDF", "");


|instance_method_tag|


.. method:: beginPage(mediabox: Rect)

    Begin rendering a new page. Returns a `Device` that can be used to render the page graphics.

    :arg mediabox: :ref:`Rect <Glossary_Rectangles>`.

    :return: `Device`.

    |example_tag|

    .. code-block:: javascript

        var device = writer.beginPage([0,0,100,100]);


.. method:: endPage()

    Finish the page rendering.

    |example_tag|

    .. code-block:: javascript

        writer.endPage();


.. method:: close()

    Finish the document and flush any pending output.

    |example_tag|

    .. code-block:: javascript

        writer.close();


.. include:: footer.rst
.. include:: ../footer.rst



