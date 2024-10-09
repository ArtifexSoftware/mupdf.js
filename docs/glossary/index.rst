.. include:: ../header.rst

Glossary
===========

.. _Glossary_Colors:

Colors
----------

Colors are specified as arrays with the appropriate number of components for the :doc:`../classes/ColorSpace`. Each number is a floating point between `0` and `1` for the component value.

Therefore colors are represented as an array of up to 4 component values.

For example:

- In the `DeviceCMYK` color space a color would be `[Cyan,Magenta,Yellow,Black]`. A full magenta color would therefore be `[0,1,0,0]`.
- In the `DeviceRGB` color space a color would be `[Red,Green,Blue]`. A full green color would therefore be `[0,1,0]`.
- In the `DeviceGray` color space a color would be `[Black]`. A full black color would therefore be `[0]`.

.. _Glossary_Color_Type:

Color Type
~~~~~~~~~~~~~~

The convenience type is defined as follows:

.. code-block:: javascript

    type Color = [number] | [number, number, number] | [number, number, number, number]


.. _Glossary_Alpha:

Alpha
~~~~~~~~~~~~

Alpha values are floats between `0` and `1`, whereby `0` denotes full transparency & `1` denotes full opacity.

.. _Glossary_Matrix:

Matrices
-------------

Matrices are simply 6-element arrays representing a 3-by-3 transformation matrix as:


.. code-block:: bash

    / a b 0 \
    | c d 0 |
    \ e f 1 /

This matrix is represented in :title:`JavaScript` as `[a,b,c,d,e,f]`.


Matrix Type
~~~~~~~~~~~~~~

The convenience type is defined as follows:

.. code-block:: bash

    type Matrix = [number, number, number, number, number, number]

`Matrix`
~~~~~~~~~~~

**Properties**

`identity`

   The identity matrix, short hand for `[1,0,0,1,0,0]`.

   |example_tag|

   .. code-block:: javascript

      var m = mupdfjs.Matrix.identity;

**Methods**

.. method:: scale(sx:number, sy:number)

   Returns a scaling matrix, short hand for `[sx,0,0,sy,0,0]`.

   :arg sx: `number`. X scale as a floating point number.
   :arg sy: `number`. Y scale as a floating point number.

   :return: `[a,b,c,d,e,f]`.

   |example_tag|

   .. code-block:: javascript

      var m = mupdfjs.Matrix.scale(2,2);


.. method:: translate(tx:number, ty:number)

   Return a translation matrix, short hand for `[1,0,0,1,tx,ty]`.

   :arg tx: `number`. X translation as a floating point number.
   :arg ty: `number`. Y translation as a floating point number.

   :return: `[a,b,c,d,e,f]`.

   |example_tag|

   .. code-block:: javascript

      var m = mupdfjs.Matrix.translate(2,2);

.. method:: rotate(theta:number)

   Return a rotation matrix, short hand for `[cos(theta),sin(theta),-sin(theta),cos(theta),0,0]`.

   :arg theta: `number`. Rotation value.

   :return: `[a,b,c,d,e,f]`.

   |example_tag|

   .. code-block:: javascript

      var m = mupdfjs.Matrix.rotate(90);

.. method:: concat(a:[a,b,c,d,e,f], b:[a,b,c,d,e,f])

   Concatenate matrices `a` and `b`. Bear in mind that matrix multiplication is not commutative.

   :arg a: `[a,b,c,d,e,f]`. Matrix "a".
   :arg b: `[a,b,c,d,e,f]`. Matrix "b".

   :return: `[a,b,c,d,e,f]`.

   |example_tag|

   .. code-block:: javascript

      var m = mupdfjs.Matrix.concat([1,1,1,1,1,1], [2,2,2,2,2,2]);


.. method:: invert(matrix:[a,b,c,d,e,f])

   Inverts the supplied matrix and returns the result.

   :arg matrix: `[a,b,c,d,e,f]`. Matrix array.

   :return: `[a,b,c,d,e,f]`.

   |example_tag|

   .. code-block:: javascript

      var m = mupdfjs.Matrix.invert([1,0.5,1,1,1,1]);



.. _Glossary_Rectangles:

Rectangles
--------------------

Rectangles are 4-element arrays, specifying the minimum and maximum corners (typically upper left and lower right, in a coordinate space with the origin at the top left with descending y): `[ulx,uly,lrx,lry]`. Rectangles are always X- and Y-axis aligned.

If the minimum x coordinate is bigger than the maximum x coordinate, :title:`MuPDF` treats the rectangle as infinite in size.


Rect Type
~~~~~~~~~~~~~~

The convenience type is defined as follows:

.. code-block:: bash

    type Rect = [number, number, number, number]

`Rect`
~~~~~~~~~~~~~~

**Methods**

.. method:: isEmpty(rect:[x1,y1,x2,y2])

   Returns a boolean indicating if the rectangle is empty or not.

   :arg rect: `[x1,y1,x2,y2]`. Rectangle array.

   :return: `boolean`.

   |example_tag|

   .. code-block:: javascript

      var isEmpty = mupdfjs.Rect.isEmpty([0,0,0,0]); // true
      var isEmpty = mupdfjs.Rect.isEmpty([0,0,100,100]); // false



.. method:: isValid(rect:[x1,y1,x2,y2])

   Returns a boolean indicating if the rectangle is valid or not. Rectangles are considered "invalid" if `lrx` < `ulx` and/or if `lry` < `uly`.

   :arg rect: `[x1,y1,x2,y2]`. Rectangle array.

   :return: `boolean`.

   |example_tag|

   .. code-block:: javascript

      var isValid = mupdfjs.Rect.isValid([0,0,100,100]); // true
      var isValid = mupdfjs.Rect.isValid([0,0,-100,100]); // false


.. method:: isInfinite(rect:[x1,y1,x2,y2])

   Returns a boolean indicating if the rectangle is infinite or not.

   :arg rect: `[x1,y1,x2,y2]`. Rectangle array.

   :return: `boolean`.

   |example_tag|

   .. code-block:: javascript

      var isInfinite = mupdfjs.Rect.isInfinite([0x80000000,0x80000000,0x7fffff80,0x7fffff80]); //true
      var isInfinite = mupdfjs.Rect.isInfinite([0,0,100,100]); // false



.. method:: transform(rect:[x1,y1,x2,y2], matrix:[a,b,c,d,e,f])

   Returns a rectangle generated by transforming the supplied `rect` by the `matrix`.

   :arg rect: `[x1,y1,x2,y2`. `Rectangle` array.
   :arg matrix: `[a,b,c,d,e,f]`. `Matrix` array.

   :return: `[x1,y1,x2,y2]`.

   |example_tag|

   .. code-block:: javascript

      var m = mupdfjs.Rect.transform([0,0,100,100], [1,0.5,1,1,1,1]);



.. _Glossary_Object_Points_and_QuadPoints:

.. _Glossary_Points:

Points
---------

**Points** objects are two-dimensonial numeric arrays in the format: `[x, y]`.


Point Type
~~~~~~~~~~~~~~

The convenience type is defined as follows:

.. code-block:: javascript

    type Point = [number, number]



.. _Glossary_Quads:

Quads
----------------

**QuadPoint** or **Quad** objects are arrays of 8 elements, where each pair are the X/Y coordinates of a corner of the quad, i.e.: `[ulx, uly, urx, ury, llx, lly, lrx, lry]`.



Quad Type
~~~~~~~~~~~~~~

The convenience type is defined as follows:

.. code-block:: javascript

    type Quad = [number, number, number, number, number, number, number, number]



.. _Glossary_Annotations:

Annotations
--------------


.. _Glossary_Annotation_Types:

Annotation Types
~~~~~~~~~~~~~~~~~~~~~

`PDFAnnotationType`

.. list-table::
   :header-rows: 1

   * - **Name**
     - **Supported**
     - **Notes**
   * - Text
     - Yes
     -
   * - Link
     - Yes
     - Please use :meth:`createLink`.
   * - FreeText
     - Yes
     -
   * - Square
     - Yes
     -
   * - Circle
     - Yes
     -
   * - Line
     - Yes
     -
   * - Polygon
     - Yes
     -
   * - PolyLine
     - Yes
     -
   * - Highlight
     - Yes
     -
   * - Underline
     - Yes
     -
   * - Squiggly
     - Yes
     -
   * - StrikeOut
     - Yes
     -
   * - Redact
     - Yes
     -
   * - Stamp
     - Yes
     -
   * - Caret
     - Yes
     -
   * - Ink
     - Yes
     -
   * - Popup
     - No
     -
   * - FileAttachment
     - Yes
     -
   * - Sound
     - No
     -
   * - Movie
     - No
     -
   * - RichMedia
     - No
     -
   * - Widget
     - No
     -
   * - Screen
     - No
     -
   * - PrinterMark
     - No
     -
   * - TrapNet
     - No
     -
   * - Watermark
     - No
     -
   * - 3D
     - No
     -
   * - Projection
     - No
     -

.. note::

    Annotation types are also referred to as "subtypes".



.. _Glossary_Widgets_Types:

Widgets Types
~~~~~~~~~~~~~~~~~~~~~

Widgets are a special type of interactive annotation used for form filling in :title:`PDF`.

.. list-table::
   :header-rows: 1

   * - **Name**
   * - button
   * - checkbox
   * - combobox
   * - listbox
   * - radiobutton
   * - signature
   * - text




.. _Glossary_Line_Ending_Styles:

Line Ending Styles
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following table lists line ending styles for use with :doc:`../classes/PDFAnnotation`.

`PDFAnnotationLineEndingStyle`

.. list-table::
   :header-rows: 1

   * - **Line ending names**
   * - "None"
   * - "Square"
   * - "Circle"
   * - "Diamond"
   * - "OpenArrow"
   * - "ClosedArrow"
   * - "Butt"
   * - "ROpenArrow"
   * - "RClosedArrow"
   * - "Slash"

.. _Glossary_Icon_Names:

Icon Names
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


The following table lists icon names for use with :doc:`../classes/PDFAnnotation`.

.. list-table::
   :header-rows: 1

   * - **Icon type**
     - **Icon name**
   * - File attachment
     - "Graph"
   * -
     - "PaperClip"
   * -
     - "PushPin"
   * -
     - "Tag"
   * - Sound
     - "Mic"
   * -
     - "Speaker"
   * - Stamp
     - "Approved"
   * -
     - "AsIs"
   * -
     - "Confidential"
   * -
     - "Departmental"
   * -
     - "Draft"
   * -
     - "Experimental"
   * -
     - "Expired"
   * -
     - "Final"
   * -
     - "ForComment"
   * -
     - "ForPublicRelease"
   * -
     - "NotApproved"
   * -
     - "NotForPublicRelease"
   * -
     - "Sold"
   * -
     - "TopSecret"
   * - Text
     - "Comment"
   * -
     - "Help"
   * -
     - "Insert"
   * -
     - "Key"
   * -
     - "NewParagraph"
   * -
     - "Note"
   * -
     - "Paragraph"

.. _Glossary_Border_Style:

Border Style
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Annotation border styles are one of:

.. list-table::
   :header-rows: 0

   * - "Solid"
   * - "Dashed"

.. _Glossary_Border_Effect:

Border Effect
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Annotation border effects are one of:

.. list-table::
   :header-rows: 0

   * - "None"
   * - "Cloudy"


.. _Glossary_Object_Protocols:

Object Protocols
---------------------------


The following objects are standard :title:`JavaScript` objects with assumed properties (i.e. they follow their outlined protocol). They are used throughout the :title:`API` to support object types for various methods.



.. _Glossary_Object_Protocols_Link_Destination_Object:


Link Destination Object
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A link destination points to a location within a document and how a document viewer should show that destination.

It consists of a dictionary with keys for:

`chapter`
    The chapter within the document.

`page`
    The page within the document.

`type`
    Either "Fit", "FitB", "FitH", "FitBH", "FitV", "FitBV", "FitR" or "XYZ", controlling which of the keys below exist.

`x`
    The left coordinate, valid for "FitV", "FitBV", "FitR" and "XYZ".

`y`
    The top coordinate, valid for "FitH", "FitBH", "FitR" and "XYZ".

`width`
    The width of the zoomed in region, valid for "XYZ".

`height`
    The height of the zoomed in region, valid for "XYZ".

`zoom`
    The zoom factor, valid for "XYZ".



.. _Glossary_Object_Protocols_File_Specification_Object:

File Specification Object
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This object is used to represent a file.

In order to retrieve information from this object see methods described within :ref:`Embedded files in PDFs<mutool_object_pdf_document_embedded_files>`.


.. _Glossary_Object_Filespec_Params_Object:

Filespec Params Object
""""""""""""""""""""""""""""

This `Object` contains metadata about a filespec, it has properties for:

`filename`
    The name of the embedded file.

`mimetype`
    The :title:`MIME` type of the embedded file, or `undefined` if none exists.

`size`
    The size in bytes of the embedded file contents.

`creationDate`
    The creation date of the embedded file.

`modificationDate`
    The modification date of the embedded file.


.. _Glossary_Object_Protocols_PDF_Journal_Object:

PDF Journal Object
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This `Object` contains a numbered array of operations and a reference into this list indicating the current position.

`position`
    The current position in the journal.

`steps`
    An array containing the name of each step in the journal.




.. _Glossary_Object_Protocols_Stroking_State_Object:

Stroking State Object
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The stroking state is a dictionary with keys for:

`startCap`, `dashCap`, `endCap`
    "Butt", "Round", "Square", or "Triangle".

`lineCap`
    Set `startCap`, `dashCap`, and `endCap` all at once.

`lineJoin`
    "Miter", "Round", "Bevel", or "MiterXPS".

`lineWidth`
    Thickness of the line.

`miterLimit`
    Maximum ratio of the miter length to line width, before beveling the join instead.

`dashPhase`
    Starting offset for dash pattern.

`dashes`
    Array of on/off dash lengths.


|example_tag|

    `{dashes:[5,10], lineWidth:3, lineCap:'Round'}`


.. _Glossary_Default_Appearance_Text_Object:

Default Appearance Text Object
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


`font`
    String representing the font.

`size`
    Number representing the size of the font.

`color`
    Array representing the :ref:`color value <Glossary_Colors>`.



.. _Glossary_Page_Labels:

Page Labels
--------------------------------

Page labels are used to label your pages - giving them a name, usually this is the page number, however there may be prefixes or other kinds of labels (e.g. roman numerals) that you may want to use.

There is a common interface object in :title:`MuPDF.js` which is used to define a page label rule as follows:

.. code-block:: javascript

    interface PageLabelRule {
        startpage: number;
        prefix?: string;
        style?: string;
        firstpagenum?: number;
    }


.. _Glossary_Outline_Items:

Outline Items
----------------------------------

Outline items are returned from the :meth:`loadOutline` method and represent a table of contents entry.


.. code-block:: javascript

    interface OutlineItem {
        title: string | undefined,
        uri: string | undefined,
        open: boolean,
        down?: OutlineItem[],
        page?: number,
    }



.. _Glossary_BlendMode:


Blend Modes
----------------------------------

`BlendMode` is defined as a string as one of:

.. list-table::
   :header-rows: 0

   * - Normal
   * - Multiply
   * - Screen
   * - Overlay
   * - Darken
   * - Lighten
   * - ColorDodge
   * - ColorBurn
   * - HardLight
   * - SoftLight
   * - Difference
   * - Exclusion
   * - Hue
   * - Saturation
   * - Color
   * - Luminosity



.. include:: ../footer.rst
