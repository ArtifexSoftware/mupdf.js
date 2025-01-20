.. include:: ../header.rst

.. _Classes_Text:

Text
===================



A `Text` object contains text. See the :meth:`fillText` method on :doc:`Device` for more.


|constructor_tag|

.. method:: Text()

    Create a new empty text object.

    :return: `Text`.

    |example_tag|

    .. code-block:: javascript

        var text = new mupdfjs.Text();


|instance_method_tag|

.. method:: getBounds(strokeState: StrokeState, transform: Matrix)

    Get the bounds of the instance.

    :arg strokeState: `StrokeState`.
    :arg transform: :ref:`Matrix <Glossary_Matrix>`.


.. method:: showGlyph(font: Font, trm: Matrix, gid: number, uni: number, wmode: number = 0)

    Add a glyph to the text object.

    Transform is the text matrix, specifying font size and glyph location. For example: `[size,0,0,-size,x,y]`.

    Glyph and unicode may be `-1` for n-to-m cluster mappings. For example, the "fi" ligature would be added in two steps: first the glyph for the 'fi' ligature and the unicode value for 'f'; then glyph `-1` and the unicode value for 'i'.

    :arg font: `Font` object.
    :arg trm: :ref:`Matrix <Glossary_Matrix>`.
    :arg gid: `number`. Glyph id.
    :arg uni: `number`. Unicode.
    :arg wmode: `number`. `0` (default) for horizontal writing, and `1` for vertical writing.

    |example_tag|

    .. code-block:: javascript

        text.showGlyph(new mupdfjs.Font("Times-Roman"), mupdfjs.Matrix.identity, 21, 0x66, 0);
        text.showGlyph(new mupdfjs.Font("Times-Roman"), mupdfjs.Matrix.identity, -1, 0x69, 0);


.. method:: showString(font: Font, trm: Matrix, str: string, wmode: number = 0)

    Add a simple string to the `Text` object. Will do font substitution if the font does not have all the unicode characters required.

    :arg font: `Font` object.
    :arg trm: :ref:`Matrix <Glossary_Matrix>`.
    :arg str: `string`. Content for `Text` object.
    :arg wmode: `number`. `0` (default) for horizontal writing, and `1` for vertical writing.

    |example_tag|

    .. code-block:: javascript

        text.showString(new mupdfjs.Font("Times-Roman"), mupdfjs.Matrix.identity, "Hello World");


.. method:: walk(walker: TextWalker)

    :arg walker: `TextWalker`. Function with protocol methods, see example below for details.


    |example_tag|

    .. code-block:: javascript
            
        function print(...args) {
            console.log(args.join(" "))
        }

        var textPrinter = {
            beginSpan: function (f,m,wmode, bidi, dir, lang) {
                print("beginSpan",f,m,wmode,bidi,dir,Q(lang));
            },
            showGlyph: function (f,m,g,u,v,b) { print("glyph",f,m,g,String.fromCodePoint(u),v,b)},
            endSpan: function () { print("endSpan"); }
        }

        var traceDevice = {
            fillText: function (text, ctm, colorSpace, color, alpha) {
                print("fillText", ctm, colorSpace, color, alpha)
                text.walk(textPrinter)
            },
            clipText: function (text, ctm) {
                print("clipText", ctm)
                text.walk(textPrinter)
            },
            strokeText: function (text, stroke, ctm, colorSpace, color, alpha) {
                print("strokeText", Q(stroke), ctm, colorSpace, color, alpha)
                text.walk(textPrinter)
            },
            clipStrokeText: function (text, stroke, ctm) {
                print("clipStrokeText", Q(stroke), ctm)
                text.walk(textPrinter)
            },
            ignoreText: function (text, ctm) {
                print("ignoreText", ctm)
                text.walk(textPrinter)
            }
        }

        var doc = mupdfjs.PDFDocument.openDocument(fs.readFileSync("test.pdf"), "application/pdf")
        var page = doc.loadPage(0)
        var device = new mupdfjs.Device(traceDevice)
        page.run(device, mupdfjs.Matrix.identity)



.. include:: footer.rst
.. include:: ../footer.rst



