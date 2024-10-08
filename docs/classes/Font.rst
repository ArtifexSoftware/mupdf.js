.. include:: ../header.rst

.. _Classes_Font:

Font
===================



`Font` objects can be created from :title:`TrueType`, :title:`OpenType`, :title:`Type1` or :title:`CFF` fonts. In :title:`PDF` there are also special :title:`Type3` fonts.

|constructor_tag|

.. method:: Font(ref: string)

    Create a new font, either using a built-in font name or a file name.

    The built-in standard :title:`PDF` fonts are:

    - :title:`Times-Roman`.
    - :title:`Times-Italic`.
    - :title:`Times-Bold`.
    - :title:`Times-BoldItalic`.
    - :title:`Helvetica`.
    - :title:`Helvetica-Oblique`.
    - :title:`Helvetica-Bold`.
    - :title:`Helvetica-BoldOblique`.
    - :title:`Courier`.
    - :title:`Courier-Oblique`.
    - :title:`Courier-Bold`.
    - :title:`Courier-BoldOblique`.
    - :title:`Symbol`.
    - :title:`ZapfDingbats`.

    The built-in CJK fonts are referenced by language code: `zh-Hant`, `zh-Hans`, `ja`, `ko`.

    :arg ref: `string`. Font name or file name.

    :return: `Font`.

    |example_tag|

    .. code-block:: javascript

        var font = new mupdfjs.Font("Times-Roman");



|instance_method_tag|


.. method:: getName()

    Get the font name.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var name = font.getName();


.. method:: encodeCharacter(unicode: number)

    Get the glyph index for a unicode character. Glyph `0` is returned if the font does not have a glyph for the character.

    :arg unicode: `number`. The unicode character.

    :return: `number`. Glyph index.

    |example_tag|

    .. code-block:: javascript

        var index = font.encodeCharacter(0x42);


.. method:: advanceGlyph(glyph: number, wmode: number = 0)

    Return advance width for a glyph in either horizontal or vertical writing mode.

    :arg glyph: `number`. The glyph as unicode character.
    :arg wmode: `number`. `0` for horizontal writing, and `1` for vertical writing.

    :return: `number`. Width for the glyph.

    |example_tag|

    .. code-block:: javascript

        var width = font.advanceGlyph(0x42);


.. method:: isBold()

    Returns `true` if font is bold.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var isBold = font.isBold();


.. method:: isItalic()

    Returns `true` if font is italic.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var isItalic = font.isItalic();


.. method:: isMono()

    Returns `true` if font is monospaced.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var isMono = font.isMono();


.. method:: isSerif()

    Returns `true` if font is serif.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var isSerif = font.isSerif();


.. include:: footer.rst
.. include:: ../footer.rst



