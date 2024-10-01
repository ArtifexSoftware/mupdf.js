.. include:: ../header.rst

.. _Classes_PDFPage:

PDFPage
===================

.. 
    A **PDFPage** instance has access to the :ref:`Core JavaScript API <Node_How_To_Guide_Document_Core_API>`. Please see the `Page Class`_ methods within the `Core API`_ for *full details* on all the available **JavaScript** methods.


|constructor_tag|

.. method:: PDFPage(doc: PDFDocument, pno: number)

    *Constructor method*.

    Returns a `PDFPage` from a supplied document and page number.

    :arg doc: :doc:`PDFDocument`.
    :arg pno: `number`. Note: zero-indexed! - to get page `1` of the document use `0` here!

    :return: `PDFPage`.

    |example_tag|

    .. code-block:: javascript

        let page = new mupdfjs.PDFPage(doc, 0); // loads the first page of the document


|instance_method_tag|

.. method:: toStructuredText(options:string)

    Extract the text on the page into a :doc:`StructuredText` object. 

    :arg options: `string`. A comma separated list of flags: "preserve-ligatures", "preserve-whitespace", "preserve-spans", and "preserve-images".
    :return: :doc:`StructuredText`.

    |example_tag|

    .. code-block:: javascript

        let sText = page.toStructuredText("preserve-whitespace");

.. method:: insertText(value:string, point: [number, number], fontName:string = "Times-Roman", fontSize:number = 18, graphics: {strokeColor:[number,number,number,number], fillColor:[number,number,number,number], strokeThickness:number} = {strokeColor:[0,0,0,1], fillColor:[0,0,0,1], strokeThickness:1})
    
    Inserts text onto a page at the given point along with styling options. 

    :arg value: `string`. The value of the text. 
    :arg point: `[number, number]`. The `x,y` coordinate for the text.
    :arg fontName: `string`. Defaults to "Times-Roman"
    :arg fontSize: `number`. Font size, default is 18 points.
    :arg graphics: `{strokeColor:[number,number,number,number], fillColor:[number,number,number,number], strokeThickness:number}`. An object with three keys to set the graphics styling for the text.

        - `strokeColor`. :ref:`RGBA Array <RGBA_Array>` for the color of the text border (or stroke).
        - `fillColor`. :ref:`RGBA Array <RGBA_Array>`  for the color of the text fill (or body)
        - `strokeThickness`. `number`. 0 or above to set the stroke thickness in points. Floating point numbers are accepted.

    |example_tag|

    .. code-block:: javascript

        mupdfJSPage.insertText("HELLO WORLD!", 
                       [0,0], 
                       "Times-Roman", 
                       65, 
                       {strokeColor:[0,0,0,1], fillColor:[1,0,0,0.75], strokeThickness:1.5});



.. method:: insertImage(data: {image:Image, name:string}, rect: {x?:number, y?:number, width?:number, height?:number} = {x:0,y:0,width:0,height:0}) 

    Inserts an image onto a page with a given name and within the given rectangle.

    :arg data: `{image:Image, name:string}`. Object containing an :doc:`Image` and the name for the image (note this should ideally be unique for the page).
    :arg rect: `{x?:number, y?:number, width?:number, height?:number}`. An optional object used to define the position and size for the image. If these values are `undefined` then `x` = `0`, `y` = `0`, `width` = *inherent image width*, `height` = *inherent image height*. 

    |example_tag|

    .. code-block:: javascript

        const imageData = fs.readFileSync("logo.png"));
        let logo:mupdfjs.Image = new mupdfjs.Image(imageData);
        mupdfJSPage.insertImage({image:logo, name:"MyLogo"}, 
                                {x:0, y:0, width:200, height:200});



.. method:: getLinks()

    Return array of all links on the page.

    :return: `[...]`.

    |example_tag|

    .. code-block:: javascript

        let links = page.getLinks();


.. method:: createAnnotation()

    Create a new blank annotation of a given :ref:`type <PDFPage_annotation_types>`.

    :arg type: `string` representing :ref:`annotation type <PDFPage_annotation_types>`.
    :return: :doc:`PDFAnnotation`.

    |example_tag|

    .. code-block:: javascript

        let annotation = page.createAnnotation("Text");

.. _PDFPage_annotation_types:

**Annotation types**

.. note::

    Annotation types are also referred to as "subtypes".


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

.. method:: deleteAnnotation(annot:PDFAnnotation)

    Delete the annotation from the page.

    :arg annot: `PDFAnnotation`.

    |example_tag|

    .. code-block:: javascript

        page.deleteAnnotation(annot)


.. method:: createLink(rect:[], destinationUri:string)

    Create a new link within the rectangle on the page, linking to the destination URI string.

    :arg rect: :ref:`Rectangle <Glossary_Rectangles>` for the link.
    :arg destinationUri: `string` containing URI.
    :return: :doc:`Link`.

    |example_tag|

    .. code-block:: javascript

        var link = page.createLink([0,0,100,100], "https://example.com");


.. method:: getAnnotations()

    Return array of all annotations on the page.

    :return: `[...]`.

    |example_tag|

    .. code-block:: javascript

        let annots = pdfPage.getAnnotations();

.. method:: getWidgets()

    Return array of all widgets on the page.

    :return: `[...]`.

    |example_tag|

    .. code-block:: javascript

        let widgets = pdfPage.getWidgets();


..  method:: rotate(r:number)

    Rotating a page allows for 90 increment rotations on a page. 
    
    If you send a rotation value which is not one of postive or negative `0`, `90`, `180`, `270` then this method will do nothing.

    :arg r: `number`. The rotation value to apply to the page.

    |example_tag|

    .. code-block:: javascript

        // rotate a page 90 degrees anti-clockwise
        page.rotate(-90)

    .. note::

        Positive rotation values are clockwise, negative are anti-clockwise.


.. method:: setPageBox(type:string)

    Sets the type of box required for the page, one of "MediaBox", "CropBox", "BleedBox", "TrimBox" or "ArtBox".

    :arg type: `string`.

    .. note::

        Explanation of box types:

        - **MediaBox** -for complete pages including items that will be physically trimmed from the final product like crop marks, registration marks, etc.

        - **CropBox** defines the region that a PDF is expected to display or print.

        - **BleedBox** determines the region to which the page contents expect to be clipped.

        - **TrimBox** defines the intended dimensions of the finished page.

        - **ArtBox** can be used to denote areas where it is considered “safe” to place graphical elements.


----

.. _RGBA_Array:

.. admonition:: RGBA Array

    **RGBA Array** is a array of 4 floating point numbers between `0 - 1` to define Red, Green, Blue, and Alpha settings for your color.

.. include:: footer.rst
.. include:: ../footer.rst



