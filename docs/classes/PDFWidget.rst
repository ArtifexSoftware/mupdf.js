.. include:: ../header.rst

.. _Classes_PDFWidget:

PDFWidget
===================

Widgets refer to components which make up form items such as buttons, text inputs and signature fields.


To get the widgets on a page see: :meth:`getWidgets()`.


|instance_method_tag|


.. method:: getFieldType()

    Return `string` indicating :ref:`type of widget <Glossary_Widgets_Types>`.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var type = widget.getFieldType();


.. method:: getFieldFlags()

    Return the field flags. Refer to the :title:`PDF` specification for their meanings.

    :return: `number` which determines the bit-field value.

    |example_tag|

    .. code-block:: javascript

        var flags = widget.getFieldFlags();


.. method:: getRect()

    Get the widget bounding box.

    :return: :ref:`Rect <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        var rect = widget.getRect();


.. method:: setRect(rect:Rect)

    Set the widget bounding box.

    :arg rect: :ref:`Rect <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        widget.setRect([0,0,100,100]);


.. method:: getMaxLen()

    Get maximum allowed length of the string value.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var length = widget.getMaxLen();


.. method:: getValue()

    Get the widget value.

    :return: `string`.


    |example_tag|

    .. code-block:: javascript

        var value = widget.getValue();


.. method:: setTextValue(value: string)

    Set the widget string value.

    :arg value: `string`.

    |example_tag|

    .. code-block:: javascript

        widget.setTextValue("Hello World!");

.. method:: setChoiceValue(value: string)

    Sets the choice value against the widget.

    :arg value: `string`.

    |example_tag|

    .. code-block:: javascript

        widget.setChoiceValue("Yes");


.. method:: toggle()

    Toggle the state of the widget, returns `1` if the state changed.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var state = widget.toggle();

.. method:: getOptions()

    Returns an array of strings which represents the value for each corresponding radio button or checkbox field.

    :return: `string[]`.

    |example_tag|

    .. code-block:: javascript

        var options = widget.getOptions();


.. method:: getLabel()

    Get the field name as a string.

    :return: `string`.


    |example_tag|

    .. code-block:: javascript

        var label = widget.getLabel();


.. method:: update()

    Update the appearance stream to account for changes to the widget.

    |example_tag|

    .. code-block:: javascript

        widget.update();

.. method:: isReadOnly()

    If the value is read only and the widget cannot be interacted with.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var isReadOnly = widget.isReadOnly();


.. method:: isMultiline()

    Returns `true` if the widget is multiline.

    :return: `boolean`.


.. method:: isPassword()

    Returns `true` if the widget is a password input.

    :return: `boolean`.


.. method:: isComb()

    Returns `true` if the widget is a textfield layed out in "comb" style (forms where you write one character per square).

    :return: `boolean`. 

.. method:: isButton()

    Returns `true` if the widget is of "button", "checkbox" or "radiobutton" type.

    :return: `boolean`.

.. method:: isPushButton()

    Returns `true` if the widget is of "button" type.

    :return: `boolean`.

.. method:: isCheckbox()

    Returns `true` if the widget is of "checkbox" type.

    :return: `boolean`.

.. method:: isRadioButton()

    Returns `true` if the widget is of "radiobutton" type.

    :return: `boolean`.

.. method:: isText()

    Returns `true` if the widget is of "text" type.

    :return: `boolean`.

.. method:: isChoice()

    Returns `true` if the widget is of "combobox" or "listbox" type.

    :return: `boolean`.

.. method:: isListBox()

    Returns `true` if the widget is of "listbox" type.

    :return: `boolean`.

.. method:: isComboBox()

    Returns `true` if the widget is of "combobox" type.

    :return: `boolean`.




.. include:: footer.rst
.. include:: ../footer.rst



