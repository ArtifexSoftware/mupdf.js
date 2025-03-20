.. include:: ../header.rst

.. _Classes_Buffer:

Buffer
===================


`Buffer` objects are used for working with binary data. They can be used much like arrays, but are much more efficient since they only store bytes.


|constructor_tag|

.. method:: Buffer()

    *Constructor method*.

    Create a new empty buffer.

    :return: `Buffer`.

    |example_tag|

    .. code-block:: javascript

        var buffer = new mupdf.Buffer();

.. method:: Buffer(data: string)

    New Buffer initialized with string contents as UTF-8.

    :arg data: `string`.

    :return: `Buffer`.


.. method:: Buffer(data: ArrayBuffer | Uint8Array)

    New Buffer initialized with typed array contents.

    :arg data: `ArrayBuffer` | `Uint8Array`.

    :return: `Buffer`.

    |example_tag|

    .. code-block:: javascript

        let buffer = new mupdf.Buffer(fs.readFileSync("test.pdf"))



|instance_method_tag|

.. method:: getLength()

    Returns the number of bytes in the buffer.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var length = buffer.getLength();


.. method:: writeByte(byte:number)

    Append a single byte to the end of the buffer.

    :arg byte: `number`. The byte value. Only the least significant 8 bits of the value are appended to the buffer.

    |example_tag|

    .. code-block:: javascript

        buffer.writeByte(0x2a);


.. method:: readByte(at:number)

    Read the byte at the supplied index.

    :arg at: `number`.

    |example_tag|

    .. code-block:: javascript

        buffer.readByte(0);


.. method:: write(str: string)

    Append string to the end of the buffer.

    :arg str: `string`.

    |example_tag|

    .. code-block:: javascript

        buffer.write("hello world");

.. method:: writeLine(str: string)

    Append string to the end of the buffer ending with a newline.

    :arg str: `string`.

    |example_tag|

    .. code-block:: javascript

        buffer.writeLine("a line");





.. method:: writeBuffer(data: Buffer | ArrayBuffer | Uint8Array | string)

    Append the contents of the `data` buffer to the end of the buffer.

    :arg data: `Buffer` | `ArrayBuffer` | `Uint8Array` | `string`. Data buffer.

    |example_tag|

    .. code-block:: javascript

        buffer.writeBuffer(anotherBuffer);


.. method:: slice(start: number, end: number)

    Create a new buffer containing a (subset of) the data in this buffer. Start and end are offsets from the beginning of this buffer, and if negative from the end of this buffer.

    :arg start: `number`. Start index.
    :arg end: `number`. End index.

    :return: `Buffer`.

    |example_tag|

    .. code-block:: javascript

        var buffer = new mupdf.Buffer();
        buffer.write("hello world"); // buffer contains "hello world"
        var newBuffer = buffer.slice(1, -1); // newBuffer contains "ello worl"


.. method:: asUint8Array()

    Returns the buffer as a `Uint8Array`.

    :return: `Uint8Array`.

    |example_tag|

    .. code-block:: javascript

        var arr = buffer.asUint8Array();


.. method:: asString()

    Returns the buffer as a `string`.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var str = buffer.asString();


.. include:: footer.rst
.. include:: ../footer.rst



