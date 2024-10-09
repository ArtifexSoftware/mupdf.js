.. include:: ../header.rst

.. _Classes_Link:

Link
===================

`Link` objects contain information about page links. To create a link on a page see the :meth:`createLink` method.


.. method:: getBounds()

    Returns a :ref:`rectangle <Glossary_rectangles>` describing the link's location on the page.

    :return: :ref:`Rect <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        var rect = link.getBounds();

.. method:: setBounds(rect: Rect) 

    Sets the :ref:`bounds <Glossary_rectangles>` for the link's location on the page.

    :arg rect: :ref:`Rect <Glossary_Rectangles>`.


.. method:: getURI()

    Returns a string URI describing the link's destination. If :meth:`isExternal` returns *true*, this is a URI for a suitable browser, if it returns *false* pass it to :meth:`resolveLink` to access to the destination page in the document.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var uri = link.getURI();


.. method:: setURI(uri: string) 

    Sets the URI for the link's destination. To create links to other pages within the document see the :meth:`formatLinkURI` method.

    :arg uri: `string`.

.. method:: isExternal()

    Returns a boolean indicating if the link is external or not. If the link URI has a valid scheme followed by `:` (e.g. `https://example.com`, `mailto:test@example.com`) then it considered to be external.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var isExternal = link.isExternal();


.. include:: footer.rst
.. include:: ../footer.rst



