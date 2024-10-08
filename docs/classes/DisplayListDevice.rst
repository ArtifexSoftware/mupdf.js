.. include:: ../header.rst

.. _Classes_DisplayListDevice:

DisplayListDevice
===================


|constructor_tag|

.. method:: DisplayListDevice(displayList:DisplayList)

    Create a device for recording onto a display list.

    :arg displayList: `DisplayList`.

    :return: `DisplayListDevice`.

    |example_tag|

    .. code-block:: javascript

        var myDisplayList = new mupdfjs.DisplayList([0,0,100,100]);
        var displayListDevice = new mupdfjs.DisplayListDevice(myDisplayList);



.. include:: footer.rst
.. include:: ../footer.rst



