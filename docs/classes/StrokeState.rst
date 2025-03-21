.. include:: ../header.rst

.. _Classes_StrokeState:

StrokeState
===================

A `StrokeState` object is used to define stroke styles.

|constructor_tag|

.. method:: StrokeState()

    Create a new empty stroke state object.

    :return: `StrokeState`.

    |example_tag|

    .. code-block:: javascript

        var strokeState = new mupdf.StrokeState();


|instance_method_tag|

.. method:: setLineCap(style:number | string)

    Sets a line cap from an enumeration.

    :arg style: `string` | `number`. See :ref:`LINE_CAP <StrokeState_enumerations>`.

    |example_tag|

    .. code-block:: javascript

        strokeState.setLineCap("Butt");


.. method:: getLineCap()

    Gets a line cap from an enumeration.

    :return: `number`. See :ref:`LINE_CAP <StrokeState_enumerations>`.

    |example_tag|

    .. code-block:: javascript

        var lineCap = strokeState.getLineCap();


.. method:: setLineJoin(style:number | string)

    Sets a line join from an enumeration.

    :arg style: `string` | `number`. See :ref:`LINE_JOIN <StrokeState_enumerations>`.

    |example_tag|

    .. code-block:: javascript

        strokeState.setLineJoin("Round");


.. method:: getLineJoin()

    Gets a line join from an enumeration.

    :return: `number`. See :ref:`LINE_JOIN <StrokeState_enumerations>`.

    |example_tag|

    .. code-block:: javascript

        var lineJoin = strokeState.getLineJoin();


.. method:: setLineWidth(width:number)

    :arg width: `number`.

    |example_tag|

    .. code-block:: javascript

        strokeState.setLineWidth(2);


.. method:: getLineWidth()

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var width = strokeState.getLineWidth();


.. method:: setMiterLimit(width:number)

    :arg width: `number`.

    |example_tag|

    .. code-block:: javascript

        strokeState.setMiterLimit(2);


.. method:: getMiterLimit()


    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var limit = strokeState.getMiterLimit();


.. _StrokeState_enumerations:

Class enumerations
--------------------

The following enumerations are available for line caps and joins.

.. code-block:: javascript

    static readonly LINE_CAP: LineCap[] = [
        "Butt",
        "Round",
        "Square",
        "Triangle"
    ]

    static readonly LINE_JOIN: LineJoin[] = [
        "Miter",
        "Round",
        "Bevel",
        "MiterXPS"
    ]



.. include:: footer.rst
.. include:: ../footer.rst



