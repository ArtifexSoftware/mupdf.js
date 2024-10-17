.. include:: ../header.rst

.. _Classes_PDFObject:

PDFObject
===================

All functions that take `PDFObjects`, do automatic translation between
:title:`JavaScript` objects and `PDFObjects` using a few basic rules:


- Null, booleans, and numbers are translated directly.
- :title:`JavaScript` strings are translated to :title:`PDF` names, unless they are surrounded by parentheses: "Foo" becomes the :title:`PDF` name `/Foo` and "(Foo)" becomes the :title:`PDF` string (Foo).
- Arrays and dictionaries are recursively translated to :title:`PDF` arrays and dictionaries. Be aware of cycles though! The translation does NOT cope with cyclic references!
- The translation goes both ways: :title:`PDF` dictionaries and arrays can be accessed similarly to :title:`JavaScript` objects and arrays by getting and setting their properties.


|instance_property_tag|

`length` Length of the `PDFObject`.


|instance_method_tag|

.. method:: get(...path: PDFObjectPath)

    Access dictionaries and arrays in the `PDFObject`.

    :arg ...path: :ref:`PDFObjectPath <PDFObject_PDFObjectPath>`.
    :return: The value for the key or index.

    |example_tag|

    .. code-block:: javascript

        var dict = pdfDocument.newDictionary();
        var value = dict.get("my_key");
        var arr = pdfDocument.newArray();
        var value = arr.get(1);


.. method:: put(key: number | string | PDFObject, value: any)

    Put information into dictionaries and arrays in the `PDFObject`.
    Dictionaries and arrays can also be accessed using normal property syntax: `obj.Foo = 42; delete obj.Foo; x = obj[5]`.

    :arg key: `number` | `string` | `PDFObject`.
    :arg value: `any`. The value for the key or index.

    |example_tag|

    .. code-block:: javascript

        var dict = pdfDocument.newDictionary();
        dict.put("my_key", "my_value");
        var arr = pdfDocument.newArray();
        arr.put(0, 42);


.. method:: delete(key: number | string | PDFObject)

    Delete a reference from a `PDFObject`.

    :arg key: `number` | `string` | `PDFObject`.

    |example_tag|

    .. code-block:: javascript

        pdfObj.delete("my_key");
        var dict = pdfDocument.newDictionary();
        dict.put("my_key", "my_value");
        dict.delete("my_key");
        var arr = pdfDocument.newArray();
        arr.put(1, 42);
        arr.delete(1);


.. method:: resolve()

    If the object is an indirect reference, return the object it points to; otherwise return the object itself.

    :return: `PDFObject`.

    |example_tag|

    .. code-block:: javascript

        var resolvedObj = pdfObj.resolve();


.. method:: isArray()

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var result = pdfObj.isArray();

.. method:: isDictionary()

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var result = pdfObj.isDictionary();

.. method:: forEach(fn: (val: PDFObject, key: number | string, self: PDFObject) => void)

    Iterate over all the entries in a dictionary or array and call a function for each value-key pair.

    :arg fn: Function in the format `function(value,key){...}`.

    |example_tag|

    .. code-block:: javascript

        pdfObj.forEach(function(value,key){console.log("value="+value+",key="+key)});


.. method:: push(value: any)

    Append `value` to the end of the object.

    :arg value: `any`. Item to add.

    |example_tag|

    .. code-block:: javascript

        pdfObj.push("item");


.. method:: toString()

    Returns the object as a pretty-printed string.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var str = pdfObj.toString();


.. method:: valueOf()

    Convert primitive :title:`PDF` objects to a corresponding primitive `null`,
    `boolean`, `number` or `string` :title:`JavaScript` objects.
    Indirect :title:`PDF` objects get converted to the string "R"
    while :title:`PDF` names are converted to plain strings.
    :title:`PDF` arrays or dictionaries are returned unchanged.

    :return: `null` | `boolean` | `number` | `string`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.valueOf();


.. method:: isIndirect()

    Is the object an indirect reference.

    :return: `boolean`.


    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.isIndirect();


.. method:: asIndirect()

    Return the object number the indirect reference points to.

    :return: `number`.


    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.asIndirect();


.. method:: isFilespec()

    Is the object a file specification (or a reference to a file specification).

    :return: `boolean`.


    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.isFilespec();




:title:`PDF` streams
------------------------------------------

The only way to access a stream is via an indirect object, since all streams are numbered objects.


.. method:: isStream()

    *True* if the object is an indirect reference pointing to a stream.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.isStream();


.. method:: readStream()

    Read the contents of the stream object into a `Buffer`.

    :return: `Buffer`.

    |example_tag|

    .. code-block:: javascript

        var buffer = pdfObj.readStream();

.. method:: readRawStream()

    Read the raw, uncompressed, contents of the stream object into a `Buffer`.

    :return: `Buffer`.

    |example_tag|

    .. code-block:: javascript

        var buffer = pdfObj.readRawStream();

.. method:: writeObject(obj: any)

    Update the object the indirect reference points to.

    :arg obj: `any`.

    |example_tag|

    .. code-block:: javascript

        pdfObj.writeObject(obj);

.. method:: writeStream(buf: AnyBuffer)

    Update the contents of the stream the indirect reference points to.
    This will update the "Length", "Filter" and "DecodeParms" automatically.

    :arg buf: `AnyBuffer`.

    |example_tag|

    .. code-block:: javascript

        pdfObj.writeStream(buffer);

.. method:: writeRawStream(buf: AnyBuffer)

    Update the contents of the stream the indirect reference points to.
    The buffer must contain already compressed data that matches
    the "Filter" and "DecodeParms". This will update the "Length"
    automatically, but leave the "Filter" and "DecodeParms" untouched.


    :arg buf: `AnyBuffer`.


    |example_tag|

    .. code-block:: javascript

        pdfObj.writeRawStream(buffer);


Primitive Objects
---------------------


Primitive :title:`PDF` objects such as booleans, names, and numbers can usually be treated like :title:`JavaScript` values. When that is not sufficient use these functions:


.. method:: isNull()

    Returns *true* if the object is a `null` object.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.isNull();

.. method:: isBoolean()

    Returns *true* if the object is a `boolean` object.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.isBoolean();

.. method:: asBoolean()

    Get the boolean primitive value.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.asBoolean();

.. method:: isInteger()

    Returns *true* if the object is an `integer` object.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.isInteger();

.. method:: isNumber()

    Returns *true* if the object is a `number` object.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.isNumber();

.. method:: asNumber()

    Get the number primitive value.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.asNumber();

.. method:: isName()

    Returns *true* if the object is a `name` object.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.isName();

.. method:: asName()

    Get the name as a string.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.asName();

.. method:: isString()

    Returns *true* if the object is a `string` object.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.isString();

.. method:: asString()

    Convert a "text string" to a :title:`JavaScript` unicode string.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.asString();

.. method:: asByteString()

    Convert a string to an array of byte values.

    :return: `Uint8Array`.

    |example_tag|

    .. code-block:: javascript

        var val = pdfObj.asByteString();


.. _PDFObject_PDFObjectPath:

PDFObjectPath
----------------------------------

This represents a type alias as follows:

.. code-block:: javascript

    type PDFObjectPath = Array<number | string | PDFObject>




.. include:: footer.rst
.. include:: ../footer.rst



