.. include:: ../header.rst

.. _Classes_OutlineIterator:

OutlineIterator
===================

An outline iterator can be used to walk over all the items in an :title:`Outline` and query their properties. To be able to insert items at the end of a list of sibling items, it can also walk one item past the end of the list. To get an instance of `OutlineIterator` use :meth:`outlineIterator`.

.. note::

    In the context of a :title:`PDF` file, the document's :title:`Outline` is also known as :title:`Table of Contents` or :title:`Bookmarks`.

|instance_method_tag|

.. method:: item()

    Return an :ref:`OutlineItem <Glossary_Outline_Items>` or `null` if out of range.

    :return: `OutlineItem` | `null`.

    |example_tag|

    .. code-block:: javascript

        var obj = outlineIterator.item();

.. method:: next()

    Move the iterator position to "next".

    :return: `number` which is negative if this movement is not possible, `0` if the new position has a valid item, or `1` if the new position has no item but one can be inserted here.

    |example_tag|

    .. code-block:: javascript

        var result = outlineIterator.next();

.. method:: prev()

    Move the iterator position to "previous".

    :return: `number` which is negative if this movement is not possible, `0` if the new position has a valid item, or `1` if the new position has no item but one can be inserted here.

    |example_tag|

    .. code-block:: javascript

        var result = outlineIterator.prev();

.. method:: up()

    Move the iterator position "up".

    :return: `number` which is negative if this movement is not possible, `0` if the new position has a valid item, or `1` if the new position has no item but one can be inserted here.

    |example_tag|

    .. code-block:: javascript

        var result = outlineIterator.up();


.. method:: down()

    Move the iterator position "down".

    :return: `number` which is negative if this movement is not possible, `0` if the new position has a valid item, or `1` if the new position has no item but one can be inserted here.

    |example_tag|

    .. code-block:: javascript

        var result = outlineIterator.down();



.. method:: insert(item: OutlineItem)

    Insert item before the current item. The position does not change.

    :arg item: :ref:`OutlineItem <Glossary_Outline_Items>`.

    :return: `number` which is `0` if the current position has a valid item, or `1` if the position has no valid item.

    |example_tag|

    .. code-block:: javascript

        var result = outlineIterator.insert(item);


.. method:: delete()

    Delete the current item. This implicitly moves to the next item.

    :return: `number` which is `0` if the new position has a valid item, or `1` if the position contains no valid item, but one may be inserted at this position.

    |example_tag|

    .. code-block:: javascript

        outlineIterator.delete();

.. method:: update(item: OutlineItem)

    Updates the current item properties with values from the supplied item's properties.

    :arg item: :ref:`OutlineItem <Glossary_Outline_Items>`.


    |example_tag|

    .. code-block:: javascript

        outlineIterator.update(item);


.. include:: footer.rst
.. include:: ../footer.rst



